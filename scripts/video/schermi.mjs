// Le schermate del video: node schermi.mjs <scheda.json> <cartella-lavoro> [base]
// Apre ogni pagina della scheda dal server di prova (base, di solito http://localhost:3100),
// fa le azioni (riempi/scegli campi con dati finti, clicca, attendi), nasconde le barre fisse in basso,
// fotografa la pagina intera e salva dove stanno gli elementi da evidenziare (box.json).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [specPath, cartella, base = 'http://localhost:3100'] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
fs.mkdirSync(`${cartella}/schermi`, { recursive: true });
const b = await chromium.launch({ executablePath: CHROMIUM });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await ctx.addInitScript(() => {
  localStorage.setItem('mizi.consenso-statistiche', 'no');
  localStorage.setItem('giocamizi-benvenuto-rimandato', String(Date.now()));
  localStorage.setItem('giocamizi-app-chiusa', '1');
});
const p = await ctx.newPage();
const box = {};
for (const [nome, s] of Object.entries(spec.schermate)) {
  await p.goto(base + s.url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  for (const a of s.azioni ?? []) {
    if (a.riempi) await p.fill(a.riempi, a.valore);
    if (a.scegli) await p.selectOption(a.scegli, a.valore);
    if (a.clicca) { await p.click(a.clicca); await p.waitForTimeout(600); }
    if (a.attendi) await p.waitForTimeout(a.attendi);
  }
  // in cima prima dello scatto: la testata fissa deve stare in alto, non dove ci ha portato la compilazione
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.evaluate(() => { for (const e of document.querySelectorAll('body *')) { const st = getComputedStyle(e); if ((st.position === 'fixed' || st.position === 'sticky') && e.getBoundingClientRect().top > 120) e.style.setProperty('display', 'none', 'important'); } });
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${cartella}/schermi/${nome}.png`, fullPage: true });
  const sel = {};
  for (const q of s.selettori ?? []) {
    const r = await p.locator(q).first().evaluate((e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }; }).catch(() => null);
    if (!r) throw new Error(`Nella schermata «${nome}» non trovo ${q}`);
    sel[q] = r;
  }
  box[nome] = { altezza: await p.evaluate(() => document.documentElement.scrollHeight), sel };
  console.log('schermata', nome, Object.keys(sel).length, 'elementi');
}
fs.writeFileSync(`${cartella}/box.json`, JSON.stringify(box, null, 1));
await b.close();
