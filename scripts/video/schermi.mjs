// Script del video tutorial: vedi docs/video-tutorial.md. Si lancia dalla cartella di lavoro.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
const B = 'http://localhost:3100';
const pagine = [
  ['feste', '/feste', null],
  ['risorse', '/risorse-educative-bambini', null],
  ['scheda', '/risorse-educative-bambini/maestra-giulia', 'a[data-cta-attivita]'],
  ['modulo', '/aggiungi-attivita?scheda=' + encodeURIComponent('risorse/maestra-giulia'), 'input[name=referente]'],
  ['link', '/la-tua-scheda/prova-risorsa-locale-000000000000', null],
];
(async () => {
  const b = await chromium.launch({ executablePath: CHROMIUM });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { localStorage.setItem('mizi.consenso-statistiche', 'no'); localStorage.setItem('giocamizi-benvenuto-rimandato', String(Date.now())); localStorage.setItem('giocamizi-app-chiusa', '1'); });
  const p = await ctx.newPage();
  const box = {};
  for (const [n, u, sel] of pagine) {
    await p.goto(B + u, { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    // Nello scatto non servono le barre fisse in basso (app, navigazione): restano solo testata e pagina.
    await p.evaluate(() => { for (const e of document.querySelectorAll('body *')) { const s = getComputedStyle(e); if ((s.position === 'fixed' || s.position === 'sticky') && e.getBoundingClientRect().top > 120) e.style.setProperty('display', 'none', 'important'); } });
    await p.waitForTimeout(200);
    if (n === 'modulo') {
      await p.fill('input[name=referente]', 'Giulia Rossi').catch(()=>{});
      await p.fill('input[name=email]', 'giulia@esempio.it').catch(()=>{});
      await p.fill('input[name=telefono]', '333 000 0000').catch(()=>{});
    }
    await p.screenshot({ path: `${__dirname}/schermi/${n}.png`, fullPage: true });
    const info = { altezza: await p.evaluate(() => document.documentElement.scrollHeight) };
    const trova = async (s) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }; }, s);
    if (sel) info.evidenza = await trova(sel);
    if (n === 'modulo') { info.campi = [await trova('input[name=referente]'), await trova('input[name=email]'), await trova('input[name=telefono]')]; }
    if (n === 'link') info.scelte = await p.evaluate(() => [...document.querySelectorAll('label, button')].filter(e => /approv|modific|complet|comparire|togli/i.test(e.innerText)).slice(0,4).map(e => { const r = e.getBoundingClientRect(); return { t: e.innerText.slice(0,40), x: r.x, y: r.y + scrollY, w: r.width, h: r.height }; }));
    if (n === 'verificata') info.bollino = await p.evaluate(() => { const e = [...document.querySelectorAll('p')].find(x => /verificata/i.test(x.innerText)); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }; });
    box[n] = info;
    console.log(n, JSON.stringify(info).slice(0, 200));
  }
  fs.writeFileSync(__dirname + '/box.json', JSON.stringify(box, null, 1));
  await b.close();
})();
