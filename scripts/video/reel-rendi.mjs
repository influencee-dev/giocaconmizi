// I fotogrammi di un reel: node reel-rendi.mjs <cartella-lavoro> [senza]
// 1080×1920 a 25 al secondo; «senza» = senza sottotitoli stampati (per quelli di Instagram).
import { chromium } from "playwright-core";
const [LAVORO, modo] = process.argv.slice(2);
const SENZA = modo === "senza";
const CART = SENZA ? "fotogrammi-senza" : "fotogrammi";
const FPS = 25;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const p = await b.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
p.on("pageerror", (e) => console.log("ERR", e.message));
await p.goto("file://" + LAVORO + "/reel-pronto.html" + (SENZA ? "#senza-sottotitoli" : ""));
await p.waitForTimeout(1500);
const D = await p.evaluate(() => window.DURATA);
const n = Math.ceil(D * FPS);
for (let i = 0; i < n; i++) {
  await p.evaluate((t) => window.render(t), i / FPS);
  await p.screenshot({ path: `${LAVORO}/${CART}/f${String(i).padStart(5, "0")}.jpg`, type: "jpeg", quality: 92 });
}
console.log("fotogrammi", n);
await b.close();
