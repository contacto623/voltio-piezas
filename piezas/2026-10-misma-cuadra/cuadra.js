// «Misma cuadra»: piezas compartidas por carrusel.html y video.html.
// La ciudad isométrica y las pantallas del celular se arman aquí, en SVG y HTML,
// sin imágenes externas. Cada elemento puede llevar data-fx/data-t para que el
// video lo anime; en el carrusel esos atributos no hacen nada y se ve el estado final.
(function () {
  const fx = (nombre, t, extra = '') => (t == null ? '' : ` data-fx="${nombre}" data-t="${t}"${extra}`);


  // Íconos y degradados en un solo sprite global (nunca dentro de una lámina oculta,
  // porque Chrome no pinta un degradado que vive en un bloque con display:none).
  const ICONOS = {
    pin: '<path d="M12 21c-4-4.6-6.5-8.1-6.5-11a6.5 6.5 0 0 1 13 0c0 2.9-2.5 6.4-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/>',
    web: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9c-2.6-2.8-3.8-5.8-3.8-9S9.4 5.8 12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    chat: '<path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H8.5z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8.5 9.5h7M8.5 13h4.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="m9 14.6 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    estrella: '<path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z" fill="currentColor"/>',
    lupa: '<circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    ruta: '<path d="M12 3 21 12 12 21 3 12z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9.5 13.5V11h4.5m-1.5-2 2 2-2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    reloj: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    senal: '<path d="M4 18h2v-3H4zm4.5 0h2v-6h-2zm4.5 0h2V9h-2zm4.5 0h2V6h-2z" fill="currentColor"/>',
    bateria: '<rect x="2.5" y="7.5" width="17" height="9" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4.3" y="9.3" width="11" height="5.4" rx="1" fill="currentColor"/><rect x="20.3" y="10.3" width="1.6" height="3.4" rx=".8" fill="currentColor"/>',
    atras: '<path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    enviar: '<path d="M4 12 20 4l-5 16-3-6.5z" fill="currentColor"/>',
    persona: '<circle cx="12" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M5 20c1.1-3.6 3.8-5.4 7-5.4s5.9 1.8 7 5.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    check: '<path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    cruz: '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
    rayo: '<path d="M13.5 2 4 14h6.5L9 22l11-13h-7z" fill="currentColor"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    cuaderno: '<rect x="5" y="3.5" width="14" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M9 3.5v17M12 8h4M12 11.5h4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    grafico: '<path d="M4 19h16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M6 15l4-4 3 3 5-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    contactos: '<circle cx="9" cy="9" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19c.9-3 3-4.6 5.5-4.6s4.6 1.6 5.5 4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M15 6.5h5.5M15 10h5.5M17 13.5h3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    campana: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M10 20.5h4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  };
  function sprite() {
    const div = document.createElement('div');
    div.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <symbol id="logo" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#1d68ff"/><path d="M18 4 8 18h7l-2 10 10-14h-7z" fill="#fff"/></symbol>
      ${Object.entries(ICONOS).map(([k, v]) => `<symbol id="${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}
      <symbol id="subrayo" viewBox="0 0 400 30" preserveAspectRatio="none"><path d="M4 20C90 6 220 4 396 14" fill="none" stroke="#7dffb0" stroke-width="7" stroke-linecap="round"/></symbol>
      <linearGradient id="mesaMadera" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b2a20"/><stop offset="1" stop-color="#22170f"/></linearGradient>

      <linearGradient id="luz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6efff"/><stop offset="1" stop-color="#8fb4ff"/></linearGradient>
      <linearGradient id="toldoA" x1="0" y1="0" x2="1" y2="0">${Array.from({ length: 12 }, (_, i) => `<stop offset="${i / 12}" stop-color="${i % 2 ? '#1d68ff' : '#e9f0ff'}"/><stop offset="${(i + 1) / 12}" stop-color="${i % 2 ? '#1d68ff' : '#e9f0ff'}"/>`).join('')}</linearGradient>
      <linearGradient id="toldoB" x1="0" y1="0" x2="1" y2="0">${Array.from({ length: 12 }, (_, i) => `<stop offset="${i / 12}" stop-color="${i % 2 ? '#2a3140' : '#3a4254'}"/><stop offset="${(i + 1) / 12}" stop-color="${i % 2 ? '#2a3140' : '#3a4254'}"/>`).join('')}</linearGradient>
      <radialGradient id="copa" cx=".4" cy=".35"><stop offset="0" stop-color="#3f7cff"/><stop offset="1" stop-color="#173a8f"/></radialGradient>
      <radialGradient id="halo"><stop offset="0" stop-color="rgba(190,215,255,.55)"/><stop offset="1" stop-color="rgba(190,215,255,0)"/></radialGradient>
      <radialGradient id="resplandor"><stop offset="0" stop-color="rgba(91,147,255,.55)"/><stop offset="1" stop-color="rgba(29,104,255,0)"/></radialGradient>
    
    </defs></svg>`;
    document.body.prepend(div.firstElementChild);
  }

  // ── Proyección isométrica ──
  const S = 46, OX = 530, OY = 236;
  const P = (x, y, z = 0) => [OX + (x - y) * 0.866 * S, OY + (x + y) * 0.5 * S - z * S];
  const pts = (ps) => ps.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  const poly = (ps, fill, extra = '') => `<polygon points="${pts(ps)}" fill="${fill}" ${extra}/>`;
  const caraY = (y, x0, x1, z0, z1, fill, extra) => poly([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)], fill, extra);
  const caraX = (x, y0, y1, z0, z1, fill, extra) => poly([P(x, y0, z0), P(x, y1, z0), P(x, y1, z1), P(x, y0, z1)], fill, extra);
  const suelo = (x0, y0, x1, y1, z, fill, extra) => poly([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)], fill, extra);
  function caja(x0, y0, x1, y1, z0, h, c) {
    const z1 = z0 + h;
    return caraY(y1, x0, x1, z0, z1, c.izq) + caraX(x1, y0, y1, z0, z1, c.der) + suelo(x0, y0, x1, y1, z1, c.top);
  }
  // Texto pegado a la fachada (cara +y): el eje x del texto sigue la calle.
  const letrero = (x, y, z, txt, tam, color) => { const [X, Y] = P(x, y, z);
    return `<text transform="matrix(0.866,0.5,0,1,${X.toFixed(1)},${Y.toFixed(1)})" font-size="${tam}" font-weight="700" letter-spacing="3" fill="${color}" font-family="Inter">${txt}</text>`; };

  function persona(x, y, color, extra = '') {
    const [X, Y] = P(x, y, 0);
    return `<g ${extra}><ellipse cx="${X}" cy="${Y}" rx="9" ry="4" fill="rgba(0,0,0,.35)"/>
      <rect x="${X - 6}" y="${Y - 22}" width="12" height="21" rx="6" fill="${color}"/>
      <circle cx="${X}" cy="${Y - 29}" r="6" fill="#e9eefb"/></g>`;
  }
  function mesa(x, y, ocupada, colores) {
    let s = caja(x - .22, y - .22, x + .22, y + .22, .32, .06, { top: '#dfe8ff', izq: '#8ea3cc', der: '#6c7fa8' });
    const [X, Y] = P(x, y, 0);
    s = `<line x1="${X}" y1="${Y}" x2="${X}" y2="${Y - 15}" stroke="#6c7fa8" stroke-width="3"/>` + s;
    if (!ocupada) return s;
    return persona(x - .45, y - .1, colores[0]) + s + persona(x + .1, y + .45, colores[1]);
  }
  function arbol(x, y) {
    const [X, Y] = P(x, y, 0);
    return `<ellipse cx="${X}" cy="${Y}" rx="18" ry="8" fill="rgba(0,0,0,.35)"/><line x1="${X}" y1="${Y}" x2="${X}" y2="${Y - 34}" stroke="#4a3a2c" stroke-width="5"/>
      <circle cx="${X}" cy="${Y - 52}" r="27" fill="url(#copa)"/><circle cx="${X - 9}" cy="${Y - 60}" r="11" fill="rgba(255,255,255,.10)"/>`;
  }
  function farol(x, y) {
    const [X, Y] = P(x, y, 0);
    return `<line x1="${X}" y1="${Y}" x2="${X}" y2="${Y - 78}" stroke="#2c3a58" stroke-width="4"/><circle cx="${X}" cy="${Y - 80}" r="7" fill="#dfeaff"/>
      <circle cx="${X}" cy="${Y - 80}" r="26" fill="url(#halo)"/>`;
  }
  function edificio(x0, x1, lleno, letreroTxt, clase) {
    const y0 = 1, y1 = 4, h = 3.4;
    const muro = lleno ? { top: '#3a5488', izq: '#22345c', der: '#172540' } : { top: '#2a3245', izq: '#1a202e', der: '#121722' };
    const vidrio = lleno ? 'url(#luz)' : '#0d121c';
    const toldo = lleno ? 'url(#toldoA)' : 'url(#toldoB)';
    let s = caja(x0, y0, x1, y1, 0, h, muro);
    // Vitrina y puerta del primer piso
    s += caraY(y1, x0 + .3, x0 + 2.0, .25, 1.45, vidrio, lleno ? 'class="vitrina"' : '');
    if (lleno) { // siluetas comiendo adentro
      for (const [px, c] of [[x0 + .7, '#284c9c'], [x0 + 1.25, '#2f5bc0'], [x0 + 1.7, '#284c9c']]) {
        const [X, Y] = P(px, y1, .3);
        s += `<rect x="${X - 6}" y="${Y - 30}" width="12" height="24" rx="6" fill="${c}" opacity=".85"/><circle cx="${X}" cy="${Y - 36}" r="6" fill="${c}" opacity=".85"/>`;
      }
    }
    s += caraY(y1, x0 + 2.35, x0 + 3.05, 0, 1.4, lleno ? '#bcd4ff' : '#0b0f18');
    // Toldo
    s += poly([P(x0 + .15, y1, 1.8), P(x1 - .15, y1, 1.8), P(x1 - .15, y1 + .55, 1.5), P(x0 + .15, y1 + .55, 1.5)], toldo);
    // Letrero
    s += caraY(y1, x0 + .35, x1 - .35, 2.0, 2.55, lleno ? '#0f1d3d' : '#151a25');
    s += letrero(x0 + .55, y1, 2.13, letreroTxt, 17, lleno ? '#dfeaff' : '#4a5468');
    // Ventanas de arriba
    for (let i = 0; i < 4; i++) { const a = x0 + .35 + i * .82; s += caraY(y1, a, a + .5, 2.75, 3.15, lleno ? '#7fa6ff' : '#1d2433'); }
    for (let i = 0; i < 3; i++) { const a = y0 + .3 + i * .95; s += caraX(x1, a, a + .55, 2.75, 3.15, lleno ? '#5d86e6' : '#171d2a'); s += caraX(x1, a, a + .55, .5, 1.3, lleno ? '#4d77d6' : '#141a26'); }
    // Equipo en el techo
    s += caja(x0 + .5, y0 + .4, x0 + 1.2, y0 + 1.0, h, .3, { top: '#4b5d82', izq: '#2f3b55', der: '#252f45' });
    return `<g class="${clase}">${s}</g>`;
  }

  // La cuadra: dos restaurantes en la misma vereda (A lleno, B vacío).
  function ciudad(op = {}) {
    const id = op.id || 'c';
    const tiempo = op.tiempos || {};
    let s = '';
    // Suelo: vereda, calle con línea y paso de cebra, vereda del frente.
    let piso = caja(-.6, -.6, 10.6, 10.2, -.35, .35, { top: '#141d30', izq: '#0c1220', der: '#0a0f1a' });
    piso += suelo(-.6, 4.6, 10.6, 6.9, 0, '#070b15');
    for (let x = -.2; x < 10.4; x += 1.3) piso += suelo(x, 5.7, x + .65, 5.82, 0, 'rgba(220,232,255,.35)');
    for (let i = 0; i < 6; i++) piso += suelo(4.65, 4.8 + i * .35, 5.35, 4.95 + i * .35, 0, 'rgba(230,238,255,.55)');
    piso += suelo(-.6, 4.5, 10.6, 4.6, 0, '#26314a') + suelo(-.6, 6.9, 10.6, 7.0, 0, '#26314a');
    s += `<g class="piso"${fx('aparece', tiempo.piso)}>${piso}</g>`;
    // Resplandor bajo el restaurante lleno
    const [gx, gy] = P(2.6, 4.6, 0);
    s += `<ellipse class="resplandor" cx="${gx}" cy="${gy}" rx="260" ry="120" fill="url(#resplandor)"${fx('aparece', tiempo.luz)}/>`;
    s += `<g${fx('crece', tiempo.a)}>${edificio(.4, 4.4, true, 'LA MESA', 'edA')}</g>`;
    s += `<g${fx('crece', tiempo.b)}>${edificio(5.6, 9.6, false, 'COCINERÍA', 'edB')}</g>`;
    // Terrazas: llena en A, vacía en B.
    const colores = ['#5b93ff', '#9cc0ff', '#1d68ff', '#cfe0ff', '#7dffb0', '#5b93ff'];
    let terraza = '';
    [[1.0, 4.95], [2.6, 4.95]].forEach(([x, y], i) => { terraza += mesa(x, y, true, colores.slice(i * 2)); });
    s += `<g${fx('aparece', tiempo.terraza)}>${terraza}</g>`;
    s += `<g${fx('aparece', tiempo.b)}>${mesa(6.4, 4.95, false)}${mesa(8.2, 4.95, false)}</g>`;
    // Fila de gente que camina hacia la puerta de A (el video las mueve).
    const fila = [[3.6, 4.35], [3.95, 4.5], [4.3, 4.35], [4.65, 4.5], [5.0, 4.38]];
    s += fila.map(([x, y], i) => persona(x, y, colores[i % colores.length],
      `class="caminante" data-x="${x}" data-y="${y}" data-ti="${tiempo.fila == null ? '' : (tiempo.fila + i * .35).toFixed(2)}"`)).join('');
    // Auto en la calle
    s += `<g class="auto">${caja(6.6, 5.85, 8.1, 6.4, .12, .38, { top: '#5b93ff', izq: '#1d68ff', der: '#1450d6' })}${caja(6.95, 5.9, 7.7, 6.35, .5, .3, { top: '#cfe0ff', izq: '#9cbfff', der: '#7aa2f0' })}</g>`;
    // Vereda del frente: árboles y faroles.
    s += [1, 3.6, 6.2, 8.8].map((x) => arbol(x, 8.3)).join('') + farol(2.3, 7.3) + farol(7.5, 7.3);
    // Íconos del sistema sobre el restaurante lleno.
    if (op.iconos) {
      const [cx, cy] = P(2.4, 2.5, 3.4);
      const iconos = ['pin', 'web', 'chat', 'cal', 'estrella'];
      s += iconos.map((ic, i) => {
        const ang = Math.PI * (1.12 + i * .19); const r = 150;
        const x = cx + Math.cos(ang) * r * 1.15, y = cy - 40 + Math.sin(ang) * r * .75;
        return `<g${fx('pop', tiempo.iconos == null ? null : (tiempo.iconos + i * .16).toFixed(2))} style="transform-box:fill-box;transform-origin:center">
          <line x1="${cx}" y1="${cy - 6}" x2="${x}" y2="${y}" stroke="rgba(125,170,255,.55)" stroke-width="2" stroke-dasharray="5 6"/>
          <circle cx="${x}" cy="${y}" r="34" fill="#1d68ff" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
          <use href="#${ic}" x="${x - 18}" y="${y - 18}" width="36" height="36" color="#fff"/></g>`;
      }).join('');
    }
    return `<svg class="ciudad" viewBox="60 0 940 740" xmlns="http://www.w3.org/2000/svg" data-id="${id}">${s}</svg>`;
  }

  // El video mueve la fila de gente y el auto; el carrusel los deja quietos.
  function animarCiudad(svg, tl, t) {
    svg.querySelectorAll('.caminante').forEach((g) => {
      const ti = parseFloat(g.dataset.ti);
      if (Number.isNaN(ti)) return;
      const p = Math.max(0, Math.min(1, (tl - ti) / 2.2));
      const e = 1 - Math.pow(1 - p, 2);
      const dx = (1 - e) * 7; // llegan desde la derecha, por la vereda
      const [x0, y0] = P(+g.dataset.x, +g.dataset.y); const [x1, y1] = P(+g.dataset.x + dx, +g.dataset.y);
      const salto = p > 0 && p < 1 ? -Math.abs(Math.sin(tl * 11 + ti)) * 5 : 0;
      g.style.opacity = Math.min(1, p * 4);
      g.setAttribute('transform', `translate(${(x1 - x0).toFixed(1)},${(y1 - y0 + salto).toFixed(1)})`);
    });
    const auto = svg.querySelector('.auto');
    if (auto) { const d = ((t * 1.6) % 16) - 9; auto.setAttribute('transform', `translate(${(d * .866 * S).toFixed(1)},${(d * .5 * S).toFixed(1)})`); }
  }

  // ── Platos dibujados (para la ficha y la carta) ──
  function plato(tipo) {
    const fondo = '<rect width="120" height="120" fill="url(#mesaMadera)"/>';
    const defs = '';
    const d = {
      choclo: '<circle cx="60" cy="62" r="44" fill="#8a4a24"/><circle cx="60" cy="62" r="36" fill="#f0b94a"/><circle cx="60" cy="62" r="36" fill="none" stroke="#c98a2a" stroke-width="3"/>' +
        [[48, 52], [66, 50], [56, 68], [72, 66], [44, 70], [62, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff4cf"/>`).join(''),
      reineta: '<circle cx="60" cy="62" r="46" fill="#f4f6fb"/><circle cx="60" cy="62" r="38" fill="none" stroke="#dde3ee" stroke-width="2"/><ellipse cx="54" cy="58" rx="28" ry="13" fill="#e8cf9c" transform="rotate(-18 54 58)"/>' +
        '<ellipse cx="74" cy="78" rx="14" ry="10" fill="#fbeaa6"/><path d="M78 40a10 10 0 0 1 10 12z" fill="#ffe14d"/>',
      quinoa: '<circle cx="60" cy="62" r="44" fill="#eef1f6"/><circle cx="48" cy="56" r="12" fill="#5fae5a"/><circle cx="66" cy="50" r="11" fill="#7cc46e"/><circle cx="70" cy="70" r="12" fill="#4f9a4c"/>' +
        '<circle cx="52" cy="74" r="8" fill="#e2493b"/>' + Array.from({ length: 14 }, (_, i) => `<circle cx="${40 + (i * 37) % 44}" cy="${46 + (i * 23) % 38}" r="2.4" fill="#f3e3b5"/>`).join(''),
      lomo: '<circle cx="60" cy="62" r="46" fill="#f4f6fb"/><ellipse cx="50" cy="56" rx="22" ry="15" fill="#7a3b22"/><circle cx="72" cy="74" r="13" fill="#fff"/><circle cx="73" cy="73" r="6" fill="#ffb31a"/>' +
        [[36, 74], [42, 80], [50, 82]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="16" height="5" rx="2" fill="#f7cf55" transform="rotate(${-20 + i * 14} ${x} ${y})"/>`).join(''),
    };
    return `<svg viewBox="0 0 120 120" class="plato">${defs}${fondo}${d[tipo]}</svg>`;
  }

  // ── Celular ──
  const barra = (hora, claro) => `<div class="estado ${claro ? 'claro' : ''}"><b>${hora}</b><span><svg><use href="#senal"/></svg><svg><use href="#bateria"/></svg></span></div>`;
  const cel = (contenido, op = {}) => `<div class="cel ${op.clase || ''}" ${op.atr || ''}><div class="pantalla ${op.claro ? 'clara' : ''}">${barra(op.hora || '21:48', op.claro)}${contenido}</div></div>`;

  // Pantalla 1: lo buscan y aparece en Google con su ficha completa.
  function google(tt = {}) {
    return cel(`<div class="g">
      <div class="g-busca"><svg><use href="#lupa"/></svg>almuerzo cerca de Plaza Ñuñoa</div>
      <div class="g-mapa"${fx('aparece', tt.mapa)}>${mapa()}</div>
      <div class="g-ficha"${fx('subeCel', tt.ficha)}>
        <div class="g-nombre">La Mesa de Ñuñoa</div>
        <div class="g-nota"><b>4,8</b>${'<svg class="est"><use href="#estrella"/></svg>'.repeat(5)}<span>(312)</span></div>
        <div class="g-meta">Restaurante · Av. Irarrázaval</div>
        <div class="g-abre"><b>Abierto</b> · Cierra a las 23:00</div>
        <div class="g-botones">
          <span${fx('pop', tt.botones)}><svg><use href="#web"/></svg>Sitio web</span>
          <span${fx('pop', tt.botones == null ? null : tt.botones + .12)}><svg><use href="#ruta"/></svg>Cómo llegar</span>
          <span${fx('pop', tt.botones == null ? null : tt.botones + .24)}><svg><use href="#chat"/></svg>WhatsApp</span>
        </div>
        <div class="g-fotos">${['choclo', 'reineta', 'lomo'].map((p, i) => `<div${fx('pop', tt.fotos == null ? null : (tt.fotos + i * .15).toFixed(2))}>${plato(p)}</div>`).join('')}</div>
        <div class="g-filas"${fx('aparece', tt.filas)}><div><svg><use href="#reloj"/></svg><span>Lun a sáb 12:30 a 23:00</span></div><div><svg><use href="#web"/></svg><span>Carta y fotos en su sitio web</span></div></div>
      </div></div>`, { claro: true, hora: '13:05', clase: 'cel-google' });
  }
  function mapa() {
    return `<svg viewBox="0 0 476 200" preserveAspectRatio="xMidYMid slice"><rect width="476" height="200" fill="#e6ebf2"/>
      <path d="M-10 140 L490 60" stroke="#fff" stroke-width="18"/><path d="M120 -10 L180 210" stroke="#fff" stroke-width="12"/><path d="M330 -10 L300 210" stroke="#fff" stroke-width="12"/>
      <path d="M-10 40 L490 180" stroke="#fff" stroke-width="8"/><rect x="196" y="120" width="90" height="70" rx="10" fill="#cfe8cf"/>
      <g fill="#9aa6b8"><circle cx="70" cy="70" r="7"/><circle cx="400" cy="140" r="7"/><circle cx="380" cy="40" r="7"/></g>
      <g transform="translate(236 84)"><circle r="30" fill="rgba(29,104,255,.18)"/><path d="M0 14C-10 2-16-6-16-13a16 16 0 0 1 32 0c0 7-6 15-16 27z" fill="#1d68ff" transform="translate(0 -14)"/><circle cy="-27" r="6" fill="#fff"/></g></svg>`;
  }

  // Pantalla 2: su web, con carta, horario y fotos.
  function sitio(tt = {}) {
    const carta = [
      ['Pastel de choclo', 'Con pino de vacuno y pollo', '$8.900', 'choclo'],
      ['Reineta a la plancha', 'Con puré rústico', '$10.500', 'reineta', 'Sin gluten'],
      ['Ensalada de quinoa', 'Palta, tomate y semillas', '$7.900', 'quinoa', 'Sin gluten'],
      ['Lomo a lo pobre', 'Papas fritas y huevo', '$11.900', 'lomo'],
    ];
    return cel(`<div class="w">
      <div class="w-cabeza"><span class="w-logo">La Mesa</span><span class="w-menu"><i></i><i></i></span></div>
      <div class="w-hero"><div class="w-hero-txt"><span>Ñuñoa · desde 2015</span><b>Cocina chilena <em>de siempre</em></b></div>${plato('choclo')}</div>
      <div class="w-horario"><svg><use href="#reloj"/></svg>Lun a sáb 12:30 a 23:00 · Dom hasta 17:00</div>
      <div class="w-tabs"><b>Carta</b><span>Horarios</span><span>Fotos</span></div>
      <div class="w-ventana"><div class="w-carta"${fx('scroll', tt.scroll, tt.scroll == null ? '' : ' data-d="2.6" data-hasta="-96"')}>${carta.map(([n, d, p, img, tag]) => `
        <div class="w-plato"><div class="w-img">${plato(img)}</div><div class="w-txt"><b>${n}</b><span>${d}</span>${tag ? `<em class="w-tag"${fx('pop', tt.tag)}>${tag}</em>` : ''}</div><div class="w-precio">${p}</div></div>`).join('')}
      </div></div>
      <div class="w-boton"${fx('pop', tt.boton)}><svg><use href="#chat"/></svg>Escríbenos por WhatsApp</div>
    </div>`, { claro: true, hora: '13:06', clase: 'cel-sitio' });
  }

  // Encabezado de chat del restaurante.
  const cabezaChat = (sub = 'Asistente · en línea') => `<div class="ch-cabeza"><svg class="ch-atras"><use href="#atras"/></svg><span class="ch-av">LM</span><div><b>La Mesa de Ñuñoa</b><span>${sub}</span></div></div>`;
  const pie = '<div class="ch-pie"><span>Mensaje</span><i><svg><use href="#enviar"/></svg></i></div>';
  const burbuja = (lado, texto, hora, t) => `<div class="b ${lado === 'in' ? 'b-in' : 'b-out'}"${fx('pop', t)}>${texto}<span class="b-hora">${hora}</span></div>`;
  const escribe = (t, d) => (t == null ? '' : `<div class="b-escribe" data-fx="escribe" data-t="${t}" data-d="${d}"><span></span><span></span><span></span></div>`);

  // Pantalla 3: de noche le preguntan; responde con su carta y deriva lo que no sabe.
  function chatNoche(tt = {}) {
    return cel(`${cabezaChat()}<div class="ch-cuerpo">
      <div class="ch-dia">Hoy</div>
      ${burbuja('in', '¿Tienen opciones sin gluten?', '23:48', tt.m1)}
      ${escribe(tt.e1, .8)}
      ${burbuja('out', 'Sí. En la carta van marcadas la <b>reineta a la plancha</b> y la <b>ensalada de quinoa</b>. ¿Te la mando?', '23:48', tt.m2)}
      ${burbuja('in', '¿Y mesa para 12 el sábado con menú cerrado? ¿Cuánto sale?', '23:50', tt.m3)}
      ${escribe(tt.e2, .8)}
      ${burbuja('out', 'Ese valor no lo tengo publicado, así que no te voy a inventar uno. Te lo confirma <b>Paula</b>, del equipo, mañana a las 10:00.', '23:50', tt.m4)}
      <div class="ch-aviso"${fx('pop', tt.aviso)}><svg><use href="#persona"/></svg>Conversación derivada a Paula</div>
    </div>${pie}`, { hora: '23:50', clase: 'cel-chat' });
  }

  // Pantalla 4: agenda la mesa y cobra el abono por el mismo chat.
  function reserva(tt = {}) {
    return cel(`${cabezaChat()}<div class="ch-cuerpo">
      <div class="ch-dia">Miércoles</div>
      ${burbuja('in', 'Hola, ¿me reservas mesa para 6 el sábado a las 21:00?', '18:12', tt.m1)}
      ${escribe(tt.e1, .8)}
      ${burbuja('out', 'Hay mesa. Para dejarla tomada pedimos un abono de <b>$10.000</b>, que se descuenta de la cuenta.', '18:12', tt.m2)}
      <div class="b b-out b-pago"${fx('pop', tt.pago)}>
        <div class="pago-fila"><span class="pago-ic"><svg><use href="#cal"/></svg></span><div><b>Mesa para 6</b><span>Sábado · 21:00</span></div></div>
        <div class="pago-monto"><span>Abono</span><b>$10.000</b></div>
        <div class="pago-boton"${fx('presiona', tt.toque)}>Pagar abono</div>
      </div>
      <div class="ch-aviso ok"${fx('pop', tt.ok)}><svg><use href="#check"/></svg>Abono pagado · Reserva confirmada</div>
    </div>${pie}`, { hora: '18:13', clase: 'cel-chat' });
  }

  // Pantalla 5: recordatorios 24 h y 2 h; al día siguiente, la reseña.
  function despues(tt = {}) {
    return cel(`${cabezaChat()}<div class="ch-cuerpo">
      <div class="ch-dia"${fx('aparece', tt.d1)}>Viernes</div>
      <div class="b b-out"${fx('pop', tt.m1)}><em class="b-tag">24 h antes</em>Hola Camila, te esperamos mañana a las <b>21:00</b>, mesa para 6.<span class="b-hora">21:00</span></div>
      <div class="ch-dia"${fx('aparece', tt.d2)}>Sábado</div>
      <div class="b b-out"${fx('pop', tt.m2)}><em class="b-tag">2 h antes</em>Faltan 2 horas. Tu mesa ya está lista.<span class="b-hora">19:00</span></div>
      <div class="ch-dia"${fx('aparece', tt.d3)}>Domingo</div>
      <div class="b b-out"${fx('pop', tt.m3)}>Gracias por venir. ¿Nos dejas tu reseña en Google?
        <div class="resena">${[0, 1, 2, 3, 4].map((i) => `<svg${fx('estrella', tt.est == null ? null : (tt.est + i * .14).toFixed(2))}><use href="#estrella"/></svg>`).join('')}</div>
        <div class="pago-boton">Dejar reseña</div><span class="b-hora">13:00</span></div>
    </div>${pie}`, { hora: '13:01', clase: 'cel-chat' });
  }

  window.CUADRA = { sprite, ciudad, animarCiudad, google, sitio, chatNoche, reserva, despues, plato, P };
})();
