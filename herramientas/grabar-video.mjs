// Fuente original: tesla-nexus/scripts/voltio/grabar-video.mjs
// Graba video.html cuadro por cuadro con Chrome (CDP) y lo arma en MP4 con ffmpeg.
// Uso: node grabar.mjs <video.html> <salida.mp4> [fps] [trabajadores]
// Varios Chrome en paralelo, cada uno con su tramo de cuadros.
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const [, , html, salida = 'voltio-video.mp4', fpsTxt = '30', nTxt = '4'] = process.argv;
const N = Number(nTxt);
const FPS = Number(fpsTxt);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PUERTO = 9333;
const cuadros = resolve('cuadros');

rmSync(cuadros, { recursive: true, force: true });
mkdirSync(cuadros, { recursive: true });

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function abrir(puerto) {
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${puerto}`, '--disable-gpu', '--hide-scrollbars',
    '--allow-file-access-from-files', '--window-size=1080,1920', `--user-data-dir=${resolve('perfil-chrome-' + puerto)}`, 'about:blank'], { stdio: 'ignore' });
  let destino;
  for (let i = 0; i < 60 && !destino; i++) {
    await espera(250);
    try { destino = (await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json()).find((x) => x.type === 'page'); } catch { /* todavía arranca */ }
  }
  if (!destino) throw new Error(`Chrome no abrió el puerto ${puerto}`);
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pendientes = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pendientes.has(m.id)) { const { ok, mal } = pendientes.get(m.id); pendientes.delete(m.id); m.error ? mal(new Error(m.error.message)) : ok(m.result); }
  });
  const cdp = (method, params = {}) => new Promise((ok, mal) => { const n = ++id; pendientes.set(n, { ok, mal }); ws.send(JSON.stringify({ id: n, method, params })); });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.enable');
  await cdp('Page.navigate', { url: pathToFileURL(resolve(html)).href });
  await espera(2500);
  await cdp('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
  return { cdp, cerrar: () => { ws.close(); chrome.kill(); } };
}

const primero = await abrir(9333);
const { result } = await primero.cdp('Runtime.evaluate', { expression: 'window.DURACION' });
const total = Math.round(result.value * FPS);
console.log(`${total} cuadros a ${FPS} fps, ${N} trabajadores`);
const navegadores = [primero, ...(await Promise.all(Array.from({ length: N - 1 }, (_, i) => abrir(9334 + i))))];

let siguiente = 0;
let hechos = 0;
await Promise.all(navegadores.map(async ({ cdp }) => {
  for (let f = siguiente++; f < total; f = siguiente++) {
    await cdp('Runtime.evaluate', { expression: `pintar(${(f / FPS).toFixed(5)})` });
    const { data } = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 94, optimizeForSpeed: true });
    writeFileSync(join(cuadros, `c${String(f).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'));
    if (++hechos % 60 === 0) console.log(`cuadro ${hechos}/${total}`);
  }
}));
navegadores.forEach((n) => n.cerrar());

execFileSync(ffmpeg, ['-y', '-framerate', String(FPS), '-i', join(cuadros, 'c%05d.jpg'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', resolve(salida)], { stdio: 'inherit' });
console.log('listo:', resolve(salida));
