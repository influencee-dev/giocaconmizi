// Script del video tutorial: vedi docs/video-tutorial.md. Si lancia dalla cartella di lavoro.
import { chromium } from 'playwright-core';
const CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
// node rendi.mjs <cartella-lavoro> [v]  → orizzontale 1920×1080 (fotogrammi/) o verticale 1080×1920 (fotogrammi-v/), 25 al secondo
const LAVORO = process.argv[2];
const V = process.argv[3] === 'v';
const FPS = 25;
const CART = V ? 'fotogrammi-v' : 'fotogrammi';
(async () => {
  const b = await chromium.launch({ executablePath: CHROMIUM });
  const p = await b.newPage({ viewport: V ? { width: 540, height: 960 } : { width: 1280, height: 720 }, deviceScaleFactor: V ? 2 : 1.5 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + LAVORO + '/video-pronto.html' + (V ? '#verticale' : ''));
  await p.waitForTimeout(1000);
  const D = await p.evaluate(() => window.DURATA);
  const n = Math.ceil(D * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => render(t), i / FPS);
    await p.screenshot({ path: `${LAVORO}/${CART}/f${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
    if (i % 300 === 0) console.log(i, '/', n);
  }
  await b.close();
})();
