// Le registrazioni vere dello schermo per i reel di Mizi (docs/video-tutorial.md, «Reel»).
// node reel-clip.mjs <scheda-reel.json> <cartella-lavoro> [base]
// Per ogni voce di `clip` apre la pagina dal server di prova (telefono 390×844),
// fa le azioni (tocca, scrivi lettera per lettera, scorri, attendi) e registra
// tutto in <cartella>/clip/<nome>.mp4 a risoluzione piena (780×1688, i pixel veri del
// telefono): i fotogrammi arrivano dal browser (screencast), con i loro tempi, e
// ffmpeg li rimette a 25 al secondo. (Il registratore video di Playwright salva a
// metà risoluzione: sgranato.) Un cerchio rosa mostra dove tocca il dito.
// Dati sempre finti; niente consenso ai cookie di nessuno (il sito di prova è il nostro).
import { chromium } from "playwright-core";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const [specPath, cartella, base = "http://localhost:3100"] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const CHROMIUM = process.env.CHROMIUM || "/opt/pw-browsers/chromium";
fs.mkdirSync(`${cartella}/clip`, { recursive: true });
const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nome, c] of Object.entries(spec.clip ?? {})) {
  const tmp = `${cartella}/clip/tmp-${nome}`;
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    localStorage.setItem("mizi.consenso-statistiche", "no");
    localStorage.setItem("giocamizi-benvenuto-rimandato", String(Date.now()));
    localStorage.setItem("giocamizi-app-chiusa", "1");
    // il dito: un cerchio rosa dove si tocca
    addEventListener("pointerdown", (e) => {
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(242,138,178,.55);border:3px solid #C42A6B;z-index:2147483647;pointer-events:none;transition:transform .45s,opacity .45s`;
      document.documentElement.appendChild(d);
      requestAnimationFrame(() => { d.style.transform = "scale(1.8)"; d.style.opacity = "0"; });
      setTimeout(() => d.remove(), 600);
    }, true);
  });
  const p = await ctx.newPage();
  await p.goto(base + c.url, { waitUntil: "networkidle" });
  // da qui si registra: ogni fotogramma con il suo tempo
  const cdp = await ctx.newCDPSession(p);
  const fotogrammi = [];
  cdp.on("Page.screencastFrame", async (f) => {
    const n = fotogrammi.length;
    fs.writeFileSync(`${tmp}/${String(n).padStart(5, "0")}.jpg`, Buffer.from(f.data, "base64"));
    fotogrammi.push(f.metadata.timestamp);
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  await p.waitForTimeout(c.attesaIniziale ?? 600);
  for (const a of c.azioni ?? []) {
    if (a.tocca) { await p.locator(a.tocca).first().scrollIntoViewIfNeeded(); await p.waitForTimeout(250); await p.locator(a.tocca).first().tap(); }
    if (a.scrivi) { await p.locator(a.scrivi).first().scrollIntoViewIfNeeded(); await p.locator(a.scrivi).first().tap(); await p.keyboard.type(a.testo, { delay: a.ritmo ?? 70 }); }
    if (a.scegli) await p.selectOption(a.scegli, a.valore);
    if (a.scorri !== undefined) await p.evaluate((y) => window.scrollTo({ top: y, behavior: "smooth" }), a.scorri);
    if (a.vedi) await p.locator(a.vedi).first().scrollIntoViewIfNeeded();
    await p.waitForTimeout(a.attendi ?? 500);
  }
  await p.waitForTimeout(c.secondi ? c.secondi * 1000 : 300);
  await cdp.send("Page.stopScreencast");
  await ctx.close();
  // ogni fotogramma dura fino al successivo (lo schermo fermo non manda fotogrammi nuovi)
  const righe = fotogrammi.map((ts, i) => `file '${String(i).padStart(5, "0")}.jpg'\nduration ${Math.max(0.001, ((fotogrammi[i + 1] ?? ts + 0.04) - ts)).toFixed(4)}`);
  fs.writeFileSync(`${tmp}/elenco.txt`, righe.join("\n") + `\nfile '${String(fotogrammi.length - 1).padStart(5, "0")}.jpg'\n`);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", `${tmp}/elenco.txt`, "-vf", "fps=25,scale=780:1688", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", `${cartella}/clip/${nome}.mp4`]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("clip", nome, fotogrammi.length, "fotogrammi");
}
await b.close();
