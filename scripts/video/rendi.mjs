// Script del video tutorial: vedi docs/video-tutorial.md. Si lancia dalla cartella di lavoro.
import { chromium } from 'playwright-core';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
(async () => {
  const b = await chromium.launch({ executablePath: CHROMIUM });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + __dirname + '/video-pronto.html');
  await p.waitForTimeout(1000);
  const D = await p.evaluate(() => window.DURATA);
  const n = Math.ceil(D * 30);
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => render(t), i / 30);
    await p.screenshot({ path: `${__dirname}/fotogrammi/f${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
    if (i % 300 === 0) console.log(i, '/', n);
  }
  await b.close();
})();
