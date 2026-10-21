// «Misma cuadra»: el contraste (el cuaderno del de al lado y sus WhatsApp sin contestar)
// y la lista del sistema que usa el cierre. Compartido por carrusel.html y video.html.
(function () {
  const fx = (nombre, t) => (t == null ? '' : ` data-fx="${nombre}" data-t="${t}"`);

  function cuaderno(tt = {}) {
    const lineas = [
      ['Sáb 21:00 · Pérez, 6 pers.', false],
      ['Jueves Gonzalo ¿confirmó?', true],
      ['Mesa 12 pers. ¿cuánto cobrar?', false],
      ['¿Hay algo sin gluten? ver', false],
      ['Llamar señora del martes', true],
      ['Vie 20:30 ¿4 o 5?', false],
    ];
    const filas = lineas.map(([txt, tachado], i) => {
      const y = 150 + i * 72;
      return `<g${fx('escribeMano', tt.lineas == null ? null : (tt.lineas + i * .32).toFixed(2))}>
        <text x="96" y="${y}" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="40" fill="#1f2a44">${txt}</text>
        ${tachado ? `<path d="M90 ${y - 12} C220 ${y - 20} 330 ${y - 4} 470 ${y - 14}" stroke="#c0392b" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}</g>`;
    }).join('');
    const espiral = Array.from({ length: 9 }, (_, i) => `<rect x="${44 + i * 56}" y="10" width="14" height="44" rx="7" fill="#9aa3b5" stroke="#5c6578" stroke-width="2"/>`).join('');
    const renglones = Array.from({ length: 8 }, (_, i) => `<line x1="30" x2="530" y1="${162 + i * 72}" y2="${162 + i * 72}" stroke="#b9cbe8" stroke-width="2"/>`).join('');
    return `<svg viewBox="0 0 560 680" style="width:100%;height:auto;display:block;filter:drop-shadow(0 40px 60px rgba(0,0,0,.55))">
      <rect x="10" y="30" width="540" height="640" rx="18" fill="#efe6d2"/>
      <rect x="10" y="30" width="540" height="640" rx="18" fill="none" stroke="#d8cbb0" stroke-width="2"/>
      ${renglones}<line x1="80" x2="80" y1="40" y2="660" stroke="#e08a8a" stroke-width="2.5"/>
      <circle cx="430" cy="560" r="62" fill="none" stroke="rgba(120,80,40,.28)" stroke-width="10"/>
      <text x="96" y="96" font-family="Inter" font-weight="700" font-size="22" letter-spacing="3" fill="#7a6e60">RESERVAS</text>
      ${filas}${espiral}</svg>`;
  }

  function avisos(tt = {}) {
    const items = [
      ['+56 9 •••• 3812', '¿Hay mesa para hoy?', '22:51'],
      ['Valentina', '¿Tienen algo sin gluten?', '22:58'],
      ['+56 9 •••• 0447', 'Hola, ¿atienden todavía?', '23:05'],
    ];
    return `<div class="avisos">
      <div class="aviso-hora"${fx('sube', tt.hora)}>23:07</div>
      ${items.map(([n, m, h], i) => `<div class="aviso"${fx('caeAviso', tt.items == null ? null : (tt.items + i * .45).toFixed(2))}>
        <div class="aviso-app"><span><svg><use href="#chat"/></svg></span>WhatsApp<em>${h}</em></div><b>${n}</b><p>${m}</p></div>`).join('')}
      <div class="aviso-total"${fx('pop', tt.total)}><b data-fx="${tt.total == null ? '' : 'cuenta'}" data-t="${tt.total ?? ''}" data-d="1.4" data-hasta="14">14</b> mensajes sin contestar</div>
    </div>
    <style>
      .avisos{display:flex;flex-direction:column;gap:14px}
      .aviso-hora{font-size:60px;font-weight:300;letter-spacing:-.03em;text-align:right;color:rgba(255,255,255,.9);margin-bottom:6px;text-shadow:0 4px 20px rgba(0,0,0,.5)}
      .aviso{padding:18px 22px;border-radius:26px;background:rgba(30,36,52,.72);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(18px);box-shadow:0 20px 50px rgba(0,0,0,.45)}
      .aviso-app{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:rgba(255,255,255,.6)}
      .aviso-app span{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:#2a3346}
      .aviso-app svg{width:20px;height:20px;color:#fff}
      .aviso-app em{margin-left:auto;font-style:normal;text-transform:none}
      .aviso b{display:block;font-size:24px;margin-top:8px}
      .aviso p{font-size:24px;color:rgba(255,255,255,.78);margin-top:2px}
      .aviso-total{align-self:center;margin-top:8px;padding:12px 24px;border-radius:999px;font-size:24px;font-weight:600;color:#ffd0d0;background:rgba(255,90,90,.16);border:1px solid rgba(255,155,155,.5)}
      .aviso-total b{font-variant-numeric:tabular-nums}
    </style>`;
  }

  // Lo que hace el sistema hoy (verificado en el código el 21-oct-2026).
  const SISTEMA = ['Web con carta y fotos', 'Ficha de Google al día', 'Posición en Maps medida', 'Bot que no inventa precios',
    'Reservas con abono', 'Recordatorios 24 h y 2 h', 'Reseñas pedidas por WhatsApp', 'Clientes en un CRM'];

  window.CUADERNO = { cuaderno, avisos, SISTEMA };
})();
