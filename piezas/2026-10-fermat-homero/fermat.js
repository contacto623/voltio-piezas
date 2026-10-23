// «El margen de Fermat»: piezas ilustradas compartidas por carrusel.html y video.html.
// Cada pieza recibe `tt` (tiempos en segundos, relativos a su escena). Sin `tt` sale quieta y
// terminada (carrusel); con `tt` cada parte lleva data-fx/data-t y el motor del video la anima.
(function () {
  const fx = (nombre, t, extra = '') => (t == null ? '' : ` data-fx="${nombre}" data-t="${(+t).toFixed(2)}"${extra}`);
  const COS30 = Math.cos(Math.PI / 6);
  let uid = 0;
  const sup = (b, e) => `${b}<sup>${e}</sup>`;

  // ───────── Iconos (SVG propios, trazo de 24) ─────────
  function sprite() {
    const s = (id, d) => `<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</symbol>`;
    const svg = `<svg width="0" height="0" style="position:absolute"><defs>
      ${s('flecha', '<path d="M5 12h14M13 6l6 6-6 6"/>')}
      ${s('check', '<path d="m5 12.5 4.2 4.2L19 7"/>')}
      ${s('equis', '<path d="M6 6l12 12M18 6 6 18"/>')}
      ${s('libro', '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M8 7h8M8 10.5h6"/>')}
      ${s('pluma', '<path d="M20 4c-6 0-11.5 4.5-13 12l-2 4"/><path d="M20 4c0 6-4.5 11-11 12.5"/><path d="M9.5 11.5 13 15"/>')}
      ${s('alerta', '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.3v.2"/>')}
      ${s('megafono', '<path d="M3 10v4h3l7 4V6L6 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>')}
      ${s('llave', '<circle cx="7.5" cy="15.5" r="3.5"/><path d="m10 13 9-9M16 7l2.5 2.5M14 9l2 2"/>')}
      ${s('revista', '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>')}
      ${s('guardar', '<path d="M6 3h12v18l-6-4.5L6 21z"/>')}
      ${s('compartir', '<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4"/>')}
      ${s('calc', '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8 6.5h8v3H8zM8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 17h.01M12 17h.01M15.5 17h.01"/>')}
      ${s('reloj', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>')}
      ${s('lupa', '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>')}
      ${s('cubo', '<path d="M12 2.8 20 7.3v9.4L12 21.2 4 16.7V7.3z"/><path d="M4 7.3 12 12l8-4.7M12 12v9.2"/>')}
    </defs></svg>`;
    document.body.insertAdjacentHTML('afterbegin', svg);
  }

  const marca = () => `<div class="marca"><img src="logo-t.png" alt=""><div class="txt"><span class="a">PREUNIVERSITARIO</span><span class="b">TESLA</span></div></div>`;
  const subrayo = (t, color = 'var(--oro-c)') => `<svg viewBox="0 0 400 30" preserveAspectRatio="none"${fx('traza', t)}><path d="M4 20C90 6 220 4 396 14" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" pathLength="1"/></svg>`;

  // ───────── Mundo 3D isométrico propio (retícula + poliedros de alambre) ─────────
  const PHI = (1 + Math.sqrt(5)) / 2;
  const POLIEDROS = {
    cubo: { v: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], d: 2 },
    octa: { v: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], d: Math.SQRT2 },
    tetra: { v: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], d: 2 * Math.SQRT2 },
    ico: { v: [[0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI], [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0], [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1]], d: 2 },
  };
  Object.values(POLIEDROS).forEach((p) => {
    p.e = [];
    for (let i = 0; i < p.v.length; i++) for (let j = i + 1; j < p.v.length; j++) {
      const dd = Math.hypot(...p.v[i].map((c, k) => c - p.v[j][k]));
      if (Math.abs(dd - p.d) < 1e-6) p.e.push([i, j]);
    }
  });

  function mundo(tt = {}, lugares = null) {
    const u = ++uid;
    const W = 1000, H = 760, cx = 500, cy = 300, k = 46;
    const N = tt.n || 8;
    const iso = (x, y, z = 0) => [cx + (x - y) * k * COS30, cy + (x + y) * k * .5 - z * k];
    let lineas = '';
    let i = 0;
    for (let a = -N; a <= N; a++) {
      const d = Math.abs(a) / N;
      const op = (0.55 - d * .42).toFixed(2);
      const [x1, y1] = iso(a, -N), [x2, y2] = iso(a, N);
      const [x3, y3] = iso(-N, a), [x4, y4] = iso(N, a);
      const t1 = tt.piso == null ? null : tt.piso + (i++) * .025;
      const t2 = tt.piso == null ? null : tt.piso + (i++) * .025;
      lineas += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#7fb7ff" stroke-opacity="${op}" stroke-width="1.6" pathLength="1"${fx('traza', t1)}/>`;
      lineas += `<path d="M${x3.toFixed(1)} ${y3.toFixed(1)}L${x4.toFixed(1)} ${y4.toFixed(1)}" stroke="#b58cff" stroke-opacity="${op}" stroke-width="1.6" pathLength="1"${fx('traza', t2)}/>`;
    }
    const piezas = [
      { tipo: 'ico', x: -4.6, y: 1.2, z: 2.2, r: .95, vel: .42, color: '#ff5fb8', t: tt.polis },
      { tipo: 'cubo', x: 3.6, y: -3.4, z: 1.7, r: .85, vel: -.5, color: '#4cb6ff', t: tt.polis == null ? null : tt.polis + .25 },
      { tipo: 'octa', x: 4.4, y: 2.8, z: 1.9, r: 1.25, vel: .62, color: '#ffd34d', t: tt.polis == null ? null : tt.polis + .5 },
      { tipo: 'tetra', x: -2.2, y: -4.8, z: 1.6, r: .8, vel: -.7, color: '#a8e05a', t: tt.polis == null ? null : tt.polis + .75 },
    ];
    if (lugares) lugares.forEach((l, j) => Object.assign(piezas[j], l));
    const polis = piezas.slice(0, lugares ? lugares.length : piezas.length).map((p) => {
      const [sx, sy] = iso(p.x, p.y, 0);
      const rx = p.r * k * 1.25;
      return `<g${fx('pop', p.t)}>
        <ellipse cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * .5).toFixed(1)}" fill="${p.color}" opacity=".16" filter="url(#mBrillo${u})"/>
        <ellipse cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" rx="${(rx * .7).toFixed(1)}" ry="${(rx * .35).toFixed(1)}" fill="none" stroke="${p.color}" stroke-opacity=".5" stroke-width="2"/>
        <g data-poli="${p.tipo}" data-x="${p.x}" data-y="${p.y}" data-z="${p.z}" data-r="${p.r}" data-vel="${p.vel}" stroke="${p.color}" stroke-width="3" stroke-linecap="round" fill="none" filter="url(#mNeon${u})"></g></g>`;
    }).join('');
    const motas = Array.from({ length: 26 }, (_, j) => {
      const x = (j * 397) % W, y = (j * 211) % (H - 120) + 20, r = 1.5 + (j % 3);
      return `<circle data-mota="${j}" cx="${x}" cy="${y}" r="${r}" fill="#cfe2ff" opacity="${(.25 + (j % 4) * .12).toFixed(2)}"/>`;
    }).join('');
    return `<svg class="mundo" viewBox="0 0 ${W} ${H}" data-cx="${cx}" data-cy="${cy}" data-k="${k}" style="display:block;width:100%;height:auto;overflow:visible">
      <defs><filter id="mNeon${u}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="mBrillo${u}"><feGaussianBlur stdDeviation="14"/></filter></defs>
      <g fill="none">${lineas}</g>${motas}${polis}</svg>`;
  }

  // Gira los poliedros: el mundo se ve «vivo», como un render de alambre.
  function animarMundo(svg, t) {
    const cx = +svg.dataset.cx, cy = +svg.dataset.cy, k = +svg.dataset.k;
    const iso = (x, y, z) => [cx + (x - y) * k * COS30, cy + (x + y) * k * .5 - z * k];
    svg.querySelectorAll('[data-poli]').forEach((g) => {
      const P = POLIEDROS[g.dataset.poli];
      const a = t * +g.dataset.vel, b = .5 + t * .23 * Math.sign(+g.dataset.vel);
      const r = +g.dataset.r, X = +g.dataset.x, Y = +g.dataset.y, Z = +g.dataset.z + Math.sin(t * 1.3 + X) * .18;
      const pts = P.v.map(([x, y, z]) => {
        const n = Math.hypot(x, y, z); x /= n; y /= n; z /= n;
        let y1 = y * Math.cos(b) - z * Math.sin(b); let z1 = y * Math.sin(b) + z * Math.cos(b);
        let x2 = x * Math.cos(a) - y1 * Math.sin(a); let y2 = x * Math.sin(a) + y1 * Math.cos(a);
        return iso(X + x2 * r, Y + y2 * r, Z + z1 * r);
      });
      g.innerHTML = P.e.map(([i, j]) => `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}"/>`).join('');
    });
    svg.querySelectorAll('[data-mota]').forEach((c) => {
      const j = +c.dataset.mota;
      c.setAttribute('transform', `translate(0 ${(-((t * (8 + j % 5) * 3) % 90)).toFixed(1)})`);
    });
  }

  const ECUACION = `<span class="mat">${sup(1782, 12)}<span class="op">+</span>${sup(1841, 12)}<span class="op">=</span>${sup(1922, 12)}</span>`;

  // ───────── Calculadora de 10 dígitos ─────────
  function calculadora(tt = {}) {
    const teclas = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', ',', 'xʸ', '='];
    return `<div class="calc">
      <div class="calc-pantalla">
        <div class="calc-linea"${fx('sube', tt.l1)}><small>${sup(1782, 12)} + ${sup(1841, 12)}</small><b>2.541210259<sup>E39</sup></b></div>
        <div class="calc-linea"${fx('sube', tt.l2)}><small>${sup(1922, 12)}</small><b>2.541210259<sup>E39</sup></b></div>
      </div>
      <div class="calc-teclas">${teclas.map((x) => `<span${x === '=' ? ` class="igual"${fx('presiona', tt.igual)}` : ''}>${x === 'xʸ' ? '<span>x<sup style="font-size:.6em;position:relative;top:-.5em">y</sup></span>' : x}</span>`).join('')}</div>
      <div class="calc-veredicto"${fx('pop', tt.veredicto)}><svg><use href="#check"/></svg>IGUALES</div>
    </div>`;
  }

  // ───────── Los 40 dígitos de cada lado ─────────
  const IZQ = '2541210258614589176288669958142428526657';
  const DER = '2541210259314801410819278649643651567616';
  function digitos(tt = {}, tam = 30) {
    const fila = (num, otro, etiqueta, t) => {
      let html = '';
      const n = num.length;
      for (let i = 0; i < n; i++) {
        const grupo = (n - i) % 3 === 0 && i > 0 ? ' style="margin-left:.28em"' : '';
        const cls = num[i] === otro[i] && num.slice(0, i) === otro.slice(0, i) ? 'igual' : 'distinto';
        html += `<span class="${cls}"${grupo}>${num[i]}</span>`;
      }
      return `<div${fx('sube', t)}><div class="lbl" style="font-size:${tam * .72}px;margin-bottom:4px;color:rgba(255,255,255,.62);font-weight:600">${etiqueta}</div><div style="font-size:${tam}px">${html}</div></div>`;
    };
    return `<div class="digitos" style="display:grid;gap:16px">
      ${fila(IZQ, DER, `${sup(1782, 12)} + ${sup(1841, 12)} =`, tt.f1)}
      ${fila(DER, IZQ, `${sup(1922, 12)} =`, tt.f2)}
      <div style="font-size:${tam * .72}px;color:rgba(255,255,255,.7);font-weight:500"${fx('sube', tt.nota)}>Solo coinciden los <b class="verde">9 primeros</b> de 40 dígitos.</div>
    </div>`;
  }

  // Zoom a las cifras finales: una termina en 7, la otra en 6.
  function finales(tt = {}) {
    const caja = (ult, resto, etiqueta, clase, texto, t) => `<div class="vidrio" style="flex:1;padding:22px 24px;text-align:center"${fx('zoom', t)}>
      <div style="font-size:21px;color:rgba(255,255,255,.62);font-weight:600">${etiqueta}</div>
      <div class="mat" style="font-size:58px;margin-top:6px">…${resto}<span style="color:${clase === 'impar' ? 'var(--magenta-c)' : 'var(--azul-c)'};text-shadow:0 0 22px currentColor">${ult}</span></div>
      <div style="margin-top:10px"><span class="etq ${clase}">${texto}</span></div></div>`;
    return `<div style="display:flex;gap:22px">
      ${caja('7', '665', `Izquierda termina en`, 'impar', 'Impar', tt.a)}
      ${caja('6', '761', `Derecha termina en`, 'par', 'Par', tt.b)}</div>`;
  }

  // ───────── Paridad: la prueba sin calculadora ─────────
  function paridad(tt = {}, tam = 40) {
    const T = (i) => (tt.ts ? tt.ts[i] : tt.p == null ? null : tt.p + i * (tt.paso || .9));
    const fila = (izq, etq, t) => `<div class="vidrio par-paso" style="border-radius:24px"${fx('sube', t)}>
      <span class="mat" style="font-size:${tam}px">${izq}</span><svg class="flecha"><use href="#flecha"/></svg>${etq}</div>`;
    return `<div style="display:grid;gap:14px">
      ${fila(`1782 <span style="font-weight:500;font-size:.7em;opacity:.8">es par</span>`, `<span class="etq par">${sup(1782, 12)}&nbsp;par</span>`, T(0))}
      ${fila(`1841 <span style="font-weight:500;font-size:.7em;opacity:.8">es impar</span>`, `<span class="etq impar">${sup(1841, 12)}&nbsp;impar</span>`, T(1))}
      ${fila(`par <span class="op">+</span> impar`, `<span class="etq impar">impar</span>`, T(2))}
      ${fila(`1922 <span style="font-weight:500;font-size:.7em;opacity:.8">es par</span>`, `<span class="etq par">${sup(1922, 12)}&nbsp;par</span>`, T(3))}
      <div class="vidrio" style="display:flex;align-items:center;justify-content:center;gap:22px;padding:22px;border-color:rgba(255,122,85,.7);box-shadow:0 0 60px rgba(255,122,85,.25)"${fx('pop', T(4))}>
        <span class="mat" style="font-size:${tam + 6}px">impar <span class="op">≠</span> par</span><span class="etq mal" style="font-size:${tam * .66}px">Falsa</span></div>
    </div>`;
  }

  // ───────── Pitágoras: los cuadrados de los catetos llenan el de la hipotenusa ─────────
  function pitagoras(tt = {}, u = 46) {
    const pad = 30;
    const ox = pad + 3 * u, oy = pad + 7 * u;
    const P = (x, y) => [ox + x * u, oy - y * u];
    const W = pad * 2 + 10 * u, H = pad * 2 + 11 * u;
    const e1 = [0.8, -0.6], e2 = [0.6, 0.8], A = [0, 3];
    const ang = Math.atan2(0.6, 0.8) * 180 / Math.PI; // giro en pantalla
    const fuentes = [];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) fuentes.push({ c: P(-i - .5, j + .5), col: 'mag' });
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) fuentes.push({ c: P(i + .5, -j - .5), col: 'azul' });
    const mag = [], azu = [];
    for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) {
      const m = [A[0] + (i + .5) * e1[0] + (j + .5) * e2[0], A[1] + (i + .5) * e1[1] + (j + .5) * e2[1]];
      (i < 3 && j < 3 ? mag : azu).push(P(m[0], m[1]));
    }
    let im = 0, ia = 0;
    const celdas = fuentes.map((f, n) => {
      const dest = f.col === 'mag' ? mag[im++] : azu[ia++];
      const color = f.col === 'mag' ? '#ff5fb8' : '#4cb6ff';
      const t = tt.vuela == null ? null : tt.vuela + n * .045;
      const [x, y, a] = t == null ? [dest[0], dest[1], ang] : [f.c[0], f.c[1], 0];
      return `<rect x="${-u / 2 + 2}" y="${-u / 2 + 2}" width="${u - 4}" height="${u - 4}" rx="6" fill="${color}" fill-opacity=".85" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"
        transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(2)})"${fx('vuela', t, ` data-de="${f.c[0].toFixed(1)},${f.c[1].toFixed(1)},0" data-a="${dest[0].toFixed(1)},${dest[1].toFixed(1)},${ang.toFixed(2)}"`)}/>`;
    }).join('');
    const poli = (pts, extra) => `<path d="M${pts.map((p) => P(...p).map((v) => v.toFixed(1)).join(' ')).join('L')}Z" ${extra}/>`;
    const contorno = 'fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5" stroke-dasharray="8 8"';
    const [lx, ly] = P(-1.5, 1.5), [bx, by] = P(2, -2), [hx, hy] = P(3.5, 3.5);
    return `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;overflow:visible">
      ${poli([[0, 0], [0, 3], [-3, 3], [-3, 0]], contorno)}
      ${poli([[0, 0], [4, 0], [4, -4], [0, -4]], contorno)}
      ${poli([[0, 3], [4, 0], [7, 4], [3, 7]], 'fill="rgba(255,211,77,.06)" stroke="#ffd34d" stroke-width="3" stroke-dasharray="10 8"')}
      ${tt.vuela == null ? `<text x="${lx}" y="${ly + 16}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="44" fill="rgba(255,255,255,.75)">9</text>
        <text x="${bx}" y="${by + 16}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="48" fill="rgba(255,255,255,.75)">16</text>` : ''}
      ${poli([[0, 0], [4, 0], [0, 3]], 'fill="rgba(5,8,23,.85)" stroke="#fff" stroke-width="4" stroke-linejoin="round"')}
      <path d="M${P(0, .55).join(' ')}L${P(.55, .55).join(' ')}L${P(.55, 0).join(' ')}" fill="none" stroke="#fff" stroke-width="2.5"/>
      ${celdas}
      <text x="${P(.3, 1.45)[0]}" y="${P(.3, 1.45)[1] + 11}" font-family="Inter" font-weight="700" font-size="32" fill="#ff5fb8">3</text>
      <text x="${P(1.3, .28)[0]}" y="${P(1.3, .28)[1]}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="32" fill="#4cb6ff">4</text>
      <text x="${P(1.75, 1.05)[0]}" y="${P(1.75, 1.05)[1] + 11}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="32" fill="#ffd34d">5</text>
      ${tt.vuela == null ? `<text x="${hx}" y="${hy + 18}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="52" fill="#fff" stroke="rgba(5,8,23,.7)" stroke-width="6" paint-order="stroke">25</text>` : `<text x="${hx}" y="${hy + 18}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="52" fill="#fff" stroke="rgba(5,8,23,.7)" stroke-width="6" paint-order="stroke"${fx('pop', tt.total)}>25</text>`}
    </svg>`;
  }

  // ───────── Cubos isométricos con su cuadriculado de unidades ─────────
  function cuboIso(n, s, opciones = {}) {
    const { color = '#4cb6ff', hueco = false, t = null, efecto = 'crece' } = opciones;
    const w = 2 * n * s * COS30, h = 2 * n * s;
    const ox = w / 2, oy = n * s;
    const P = (x, y, z) => [ox + (x - y) * s * COS30, oy + (x + y) * s * .5 - z * s];
    const pol = (pts, fill, extra = '') => `<path d="M${pts.map((p) => P(...p).map((v) => v.toFixed(1)).join(' ')).join('L')}Z" fill="${fill}" ${extra}/>`;
    const lin = (a, b) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`; };
    let grid = '';
    for (let q = 1; q < n; q++) {
      grid += lin([q, 0, n], [q, n, n]) + lin([0, q, n], [n, q, n]);
      grid += lin([n, q, 0], [n, q, n]) + lin([n, 0, q], [n, n, q]);
      grid += lin([q, n, 0], [q, n, n]) + lin([0, n, q], [n, n, q]);
    }
    const m = n - 1;
    const cavidad = hueco ? `${pol([[m, m, m], [n, m, m], [n, n, m], [m, n, m]], 'rgba(0,0,0,.55)')}
      ${pol([[m, m, m], [m, n, m], [m, n, n], [m, m, n]], 'rgba(0,0,0,.35)')}
      ${pol([[m, m, m], [n, m, m], [n, m, n], [m, m, n]], 'rgba(0,0,0,.7)')}
      <circle cx="${P(n, n, n)[0].toFixed(1)}" cy="${P(n, n, n)[1].toFixed(1)}" r="${(s * 2.6).toFixed(1)}" fill="none" stroke="#ff7a55" stroke-width="3" style="filter:drop-shadow(0 0 8px rgba(255,122,85,.8))"/>` : '';
    return `<svg viewBox="-4 -4 ${(w + 8).toFixed(1)} ${(h + 8).toFixed(1)}" width="${(w + 8).toFixed(0)}" height="${(h + 8).toFixed(0)}" style="display:block;overflow:visible"${fx(efecto, t)}>
      ${pol([[0, 0, n], [n, 0, n], [n, n, n], [0, n, n]], color, 'fill-opacity=".95"')}
      ${pol([[n, 0, 0], [n, n, 0], [n, n, n], [n, 0, n]], color, 'fill-opacity=".62"')}
      ${pol([[0, n, 0], [n, n, 0], [n, n, n], [0, n, n]], color, 'fill-opacity=".38"')}
      <path d="${grid}" stroke="rgba(5,8,23,.45)" stroke-width="${Math.max(.8, s * .07).toFixed(2)}" fill="none"/>
      ${cavidad}
      <path d="${lin([0, 0, n], [n, 0, n])}${lin([n, 0, n], [n, n, n])}${lin([n, n, n], [0, n, n])}${lin([0, n, n], [0, 0, n])}${lin([n, 0, 0], [n, n, 0])}${lin([n, n, 0], [0, n, 0])}${lin([n, 0, 0], [n, 0, n])}${lin([n, n, 0], [n, n, n])}${lin([0, n, 0], [0, n, n])}" stroke="rgba(255,255,255,.85)" stroke-width="2" fill="none" stroke-linejoin="round"/>
    </svg>`;
  }

  const etiquetaCubo = (b, valor, t, color = '#fff') => `<div style="text-align:center;margin-top:12px"${fx('sube', t)}><div class="mat" style="font-size:34px;color:${color}">${sup(b, 3)}</div><div style="font-size:24px;color:rgba(255,255,255,.66);font-weight:600;margin-top:2px">${valor}</div></div>`;
  const opGrande = (txt, t) => `<div class="mat" style="font-size:50px;align-self:center;margin-bottom:60px;opacity:.85"${fx('aparece', t)}>${txt}</div>`;

  // Fila «9³ + 10³ = 1729 → 12³ = 1728, sobra 1» (o «6³ + 8³ = 728 → 9³ = 729, falta 1»).
  function cubos(tt = {}, s = 11, variante = 'sobra') {
    const [a, b, c, sa, sb, sc, suma, cc] = variante === 'sobra' ? [9, 10, 12, '729', '1000', '1728', '1729', 'sobra'] : [6, 8, 9, '216', '512', '729', '728', 'falta'];
    const T = (k) => (tt.t == null ? null : tt.t + k * (tt.k || 1));
    const extra = variante === 'sobra' ? `<div style="position:absolute;right:-46px;top:-6px;width:64px;height:64px;display:grid;place-items:center;border-radius:50%;border:3px solid #ff7a55;box-shadow:0 0 24px rgba(255,122,85,.7)"${fx('salta', T(2.1))}>${cuboIso(1, s * 1.15, { color: '#ff7a55' })}<span style="position:absolute;top:-36px;left:50%;transform:translateX(-50%);font-weight:700;font-size:22px;color:var(--rojo-c);white-space:nowrap">+1</span></div>` : '';
    return `<div style="display:flex;align-items:flex-end;justify-content:center;gap:16px">
      <div>${cuboIso(a, s, { color: '#ff5fb8', t: T(0) })}${etiquetaCubo(a, sa, T(.2))}</div>
      ${opGrande('+', T(.4))}
      <div>${cuboIso(b, s, { color: '#a77bff', t: T(.5) })}${etiquetaCubo(b, sb, T(.7))}</div>
      ${opGrande('<svg class="ico" style="width:46px;height:46px"><use href="#flecha"/></svg>', T(1.0))}
      <div style="position:relative">${cuboIso(c, s, { color: '#4cb6ff', hueco: variante === 'falta', t: T(1.2) })}${extra}${etiquetaCubo(c, sc, T(1.5))}</div>
    </div>
    <div style="display:flex;justify-content:center;align-items:center;gap:18px;margin-top:20px"${fx('sube', T(2.4))}>
      <span class="mat" style="font-size:36px">${sup(a, 3)}<span class="op">+</span>${sup(b, 3)}<span class="op">=</span>${suma}</span>
      <span class="etq mal">${cc} 1</span></div>`;
  }

  // ───────── La nota del margen (ejemplar de la Aritmética de Diofanto) ─────────
  const LATIN = ['Cubum autem in duos cubos, aut', 'quadratoquadratum in duos qua-', 'dratoquadratos, et generaliter', 'nullam in infinitum ultra qua-', 'dratum potestatem in duos eius-', 'dem nominis fas est dividere.', 'Cuius rei demonstrationem', 'mirabilem sane detexi. Hanc', 'marginis exiguitas non caperet.'];
  function manuscrito(tt = {}) {
    const W = 900, H = 640, id = `papel${++uid}`;
    let impreso = '';
    for (let i = 0; i < 17; i++) {
      const y = 150 + i * 27;
      const w = i === 16 ? 170 : 390 - ((i * 37) % 50);
      impreso += `<rect x="70" y="${y}" width="${w}" height="9" rx="4" fill="#5b4a33" opacity="${i % 5 === 4 ? .28 : .42}"/>`;
    }
    const nota = LATIN.map((l, i) => {
      const t = tt.escribe == null ? null : tt.escribe + i * (tt.ritmo || .42);
      return `<text x="500" y="${150 + i * 47}" font-family="Mano, 'Segoe Print', 'Instrument Serif', serif" font-size="21" fill="#3b2410" transform="rotate(-1.4 500 ${150 + i * 47})"${fx('escribeMano', t)}>${l}</text>`;
    }).join('');
    const tSub = tt.escribe == null ? null : tt.escribe + LATIN.length * (tt.ritmo || .42) + .1;
    return `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;filter:drop-shadow(0 40px 60px rgba(0,0,0,.6))">
      <defs><radialGradient id="${id}" cx="40%" cy="35%" r="80%"><stop offset="0" stop-color="#f3e6c8"/><stop offset=".75" stop-color="#e2cfa4"/><stop offset="1" stop-color="#c9ad78"/></radialGradient></defs>
      <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="10" fill="url(#${id})"/>
      <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="10" fill="none" stroke="#a88c5c" stroke-width="2"/>
      <text x="265" y="78" text-anchor="middle" font-family="'Instrument Serif',Georgia,serif" font-size="30" fill="#4a3a24" letter-spacing="3">ARITHMETICORVM LIB. II.</text>
      <text x="265" y="118" text-anchor="middle" font-family="'Instrument Serif',Georgia,serif" font-style="italic" font-size="25" fill="#4a3a24">Quaestio VIII.</text>
      ${impreso}
      <line x1="482" y1="40" x2="482" y2="${H - 40}" stroke="#a88c5c" stroke-width="1.5" stroke-dasharray="3 6"/>
      ${nota}
      <path d="M502 ${150 + 6 * 47 + 9}C600 ${150 + 6 * 47 + 3} 700 ${150 + 6 * 47 + 6} 800 ${150 + 6 * 47}M500 ${150 + 7 * 47 + 9}C580 ${150 + 7 * 47 + 4} 660 ${150 + 7 * 47 + 6} 760 ${150 + 7 * 47 + 3}" fill="none" stroke="#e0330a" stroke-width="3.5" stroke-linecap="round" opacity=".8" pathLength="1"${fx('traza', tSub)}/>
    </svg>`;
  }

  // ───────── Siglos de intentos ─────────
  const HITOS = [
    ['hacia 1637', '', '<b>Fermat</b> anota la conjetura en el margen.', false],
    ['Siglo XVII', '', '<b>Fermat</b> deja demostrado <span class="mat"><i>n</i> = 4</span> con su «descenso infinito».', false],
    ['1770', '', '<b>Euler</b> publica el caso <span class="mat"><i>n</i> = 3</span>.', false],
    ['1825', '', '<b>Dirichlet</b> y <b>Legendre</b>: <span class="mat"><i>n</i> = 5</span>.', false],
    ['1839', '', '<b>Lamé</b>: <span class="mat"><i>n</i> = 7</span>.', false],
    ['1847', '', '<b>Kummer</b> lo prueba para toda una familia de exponentes primos (los «regulares»), pero no para todos.', false],
    ['1995', '', '<b>Andrew Wiles</b>: para todos los <span class="mat"><i>n</i> ≥ 3</span>.', true],
  ];
  function linea(tt = {}, tam = 27) {
    const T = (i) => (tt.h == null ? null : tt.h + i * (tt.paso || .55));
    return `<div style="position:relative;display:grid;gap:${tam * 1.05}px">
      <div style="position:absolute;left:${190 + 26 + 11}px;top:10px;bottom:10px;width:4px;border-radius:4px;background:linear-gradient(180deg,var(--morado-c),var(--oro-c));transform-origin:top"${fx('bajaLinea', tt.linea)}></div>
      ${HITOS.map(([anio, , txt, clave], i) => `<div class="hito${clave ? ' clave' : ''}"${fx('sube', T(i))}><div class="anio">${anio}</div><div class="punto"></div><div class="txt" style="font-size:${tam}px">${txt}</div></div>`).join('')}
    </div>`;
  }

  // ───────── Wiles ─────────
  const PASOS_WILES = [
    ['libro', '1963', 'A los <b>10 años</b> encuentra el problema en un libro de la biblioteca.', 'azul'],
    ['megafono', '1993', 'Lo anuncia en <b>Cambridge</b>.', 'azul'],
    ['alerta', '1993', 'En la revisión aparece <b>un error</b>.', 'rojo'],
    ['llave', '1994', 'Lo corrige, con ayuda de <b>Richard Taylor</b>.', 'oro'],
    ['revista', '1995', 'Se publica en <b>Annals of Mathematics</b>.', 'verde'],
  ];
  function wiles(tt = {}, tam = 27) {
    const T = (i) => (tt.ts ? tt.ts[i] : tt.p == null ? null : tt.p + i * (tt.paso || 1.1));
    const col = { azul: 'var(--azul-c)', rojo: 'var(--rojo-c)', oro: 'var(--oro-c)', verde: 'var(--verde-c)' };
    return `<div style="display:grid;gap:14px">${PASOS_WILES.map(([ic, anio, txt, c], i) => `<div class="vidrio" style="display:flex;align-items:center;gap:22px;padding:18px 24px;border-radius:24px${c === 'rojo' ? ';border-color:rgba(255,122,85,.6)' : ''}"${fx(c === 'rojo' ? 'sacude' : 'sube', T(i))}>
      <span style="flex:none;width:62px;height:62px;border-radius:18px;display:grid;place-items:center;background:rgba(255,255,255,.08);border:1.5px solid ${col[c]};color:${col[c]}"><svg style="width:34px;height:34px"><use href="#${ic}"/></svg></span>
      <span class="pir" style="flex:none;width:118px;font-size:28px;color:${col[c]}">${anio}</span>
      <span style="font-size:${tam}px;line-height:1.3;color:rgba(255,255,255,.82)">${txt}</span></div>`).join('')}</div>`;
  }

  // ───────── Problema estilo PAES ─────────
  const ALTS = [
    ['A', '2, 3 y 4', `${sup(2, 2)} + ${sup(3, 2)} = 13, ${sup(4, 2)} = 16`],
    ['B', '5, 12 y 14', `${sup(5, 2)} + ${sup(12, 2)} = 169, ${sup(14, 2)} = 196`],
    ['C', '8, 15 y 17', `${sup(8, 2)} + ${sup(15, 2)} = 289 = ${sup(17, 2)}`],
    ['D', '9, 12 y 16', `${sup(9, 2)} + ${sup(12, 2)} = 225, ${sup(16, 2)} = 256`],
  ];
  function paes(tt = {}, conRespuesta = false) {
    const T = (i) => (tt.alts == null ? null : tt.alts + i * .22);
    return `<div class="vidrio paes">
      <div class="paes-tag"${fx('sube', tt.tag)}><svg class="ico" style="width:24px;height:24px"><use href="#lupa"/></svg>Desafío estilo PAES · M1</div>
      <div class="paes-enun"${fx('sube', tt.enun)}>¿Cuál de los siguientes tríos de números puede corresponder a las medidas de los lados de un <b>triángulo rectángulo</b>?</div>
      <div class="alts">${ALTS.map(([l, v, p], i) => {
        const ok = l === 'C';
        const cls = conRespuesta ? (ok ? ' correcta' : ' descartada') : '';
        const marca = conRespuesta ? `<span class="porque mat" style="color:${ok ? 'var(--verde-c)' : 'var(--rojo-c)'}">${p}</span>` : '';
        return `<div class="alt${cls}"${conRespuesta ? fx(ok ? 'pop' : 'apaga', tt.resp == null ? null : tt.resp + (ok ? .6 : i * .15)) : fx('sube', T(i))}><span class="l">${l}</span>${v}${marca}</div>`;
      }).join('')}</div></div>`;
  }

  window.FERMAT = { sprite, marca, subrayo, mundo, animarMundo, ECUACION, calculadora, digitos, finales, paridad, pitagoras, cuboIso, cubos, manuscrito, linea, wiles, paes, sup };
})();
