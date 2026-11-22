// Giro di fluidità su tutti i giochi vivi: fotogrammi, scatti e lavori lunghi mentre la demo gioca,
// su profilo telefono con la CPU rallentata 4 volte. I giochi escono dal peggiore al migliore.
// Uso (dalla radice, dopo `npm run build` e `npx next start -p 3200`):
//   node .claude/skills/accademia-giochi/giro-fluidita.mjs [indirizzo] [file.json]
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { CHROMIUM } from "../../../scripts/verifica/comune.mjs";
const reg = readFileSync("games/registry.ts", "utf8");
const vivi = [...reg.matchAll(/slug: "([^"]+)"[^}]*?ageMin: (\d+)[^}]*?status: "live"/g)].map((x) => ({ slug: x[1], eta: +x[2] }));
const b = await chromium.launch({ executablePath: CHROMIUM });
const BASE = process.argv[2] ?? "http://localhost:3200";
const righe = [];
for (const g of vivi) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} window.__lunghi = []; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lunghi.push(Math.round(e.duration)); }).observe({ entryTypes: ["longtask"] }); } catch {} });
  const p = await ctx.newPage(); let err = 0; p.on("pageerror", () => err++);
  try {
    await p.goto(`${BASE}/giochi/${g.slug}/gioca?eta=${g.eta}&demo=1`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(1500);
    const cdp = await ctx.newCDPSession(p); await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await p.evaluate(() => { window.__lunghi.length = 0; });
    const m = await p.evaluate(() => new Promise((fine) => { const t = []; let prima = performance.now(); const inizio = prima; function giro(ora) { t.push(ora - prima); prima = ora; if (ora - inizio < 7000) requestAnimationFrame(giro); else { t.shift(); t.sort((a, b) => a - b); fine({ n: t.length, media: +(t.reduce((a, b) => a + b, 0) / t.length).toFixed(1), p95: +t[Math.floor(t.length * 0.95)].toFixed(1), max: +t[t.length - 1].toFixed(0), scatti: +((t.filter((x) => x > 25).length / t.length) * 100).toFixed(1), lunghi: window.__lunghi.length, lungoMax: Math.max(0, ...window.__lunghi) }); } } requestAnimationFrame(giro); }));
    righe.push({ ...g, ...m, err });
  } catch (e) { righe.push({ ...g, errore: String(e).slice(0, 80) }); }
  await ctx.close();
}
await b.close();
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(righe, null, 1));
righe.sort((a, b) => (b.scatti ?? 99) - (a.scatti ?? 99));
for (const r of righe) console.log(`${(r.slug).padEnd(26)} media ${String(r.media).padStart(5)} p95 ${String(r.p95).padStart(5)} max ${String(r.max).padStart(4)} scatti ${String(r.scatti).padStart(4)}% lavori lunghi ${String(r.lunghi).padStart(2)} (max ${r.lungoMax} ms) ${r.err ? "ERRORI JS " + r.err : ""}${r.errore ?? ""}`);
