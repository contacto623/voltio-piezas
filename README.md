# Voltio · Piezas

Portafolio de las piezas de redes de Voltio Digital: carruseles, reels y sus textos. La vitrina es `index.html`, publicada con GitHub Pages.

## Cómo está ordenado

```
marca/                     logo, fondo (cielo) y letras: Inter + Instrument Serif (licencia OFL)
piezas/<año-mes>-<tema>/   una carpeta por pieza
  carrusel.html            fuente del carrusel (1080x1350, una lámina por #l1…#l5)
  video.html               fuente del reel (1080x1920, animado con efectos Scrolltide)
  *.png, *.mp4             lo que se sube a Instagram
  textos.md                texto del post, mensaje a prospectos y respuesta a objeciones
piezas.json                la lista que pinta la vitrina: agregar una entrada por pieza nueva
herramientas/              el grabador del reel
```

## Cómo se arma una pieza nueva

Reglas, acordadas con el dueño el 20-oct-2026:

1. **Tendencia bajada a tierra.** «Todos hablan de X; nosotros ya lo tenemos andando.»
2. **Solo lo que el producto hace hoy**, revisado en el código de la suite antes de escribirlo.
3. **Gráfica de voltiodigital.cl** con efectos Scrolltide, iconos SVG, sin emojis, y datos de ejemplo tapados.
4. **Siempre dos formatos**: carrusel y reel, más sus textos.

**Marca de cada pieza** (desde el 23-oct-2026): cada entrada de `piezas.json` lleva `"marca": "voltio"` o `"marca": "preu"`. Las del Preuniversitario Tesla se ven en la pestaña Portafolio de la suite (Agencia Web), en su propio espacio, y **no** salen en las vitrinas públicas de Voltio (esta página y voltiodigital.cl/voltio/piezas). Usan la gráfica del preu, no la de voltiodigital.cl.

Para generar las láminas:

```bash
chrome --headless=new --window-size=1080,1350 --screenshot=lamina-01.png "file:///…/carrusel.html#l1"
```

Para grabar el reel:

```bash
cd herramientas && npm install
node grabar-video.mjs ../piezas/<pieza>/video.html ../piezas/<pieza>/reel.mp4 30 6
```

El grabador abre Chrome sin ventana, pide cada cuadro a `pintar(t)` y los une con ffmpeg. El último número es cuántos Chrome trabajan en paralelo.
