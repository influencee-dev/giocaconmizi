// Misura il tempo per fotogramma di un gioco con un profilo da telefono.
// Uso: node misura-fotogrammi.mjs <indirizzo o file.html> [selettore del pulsante di avvio] [rallentamento CPU]
// Esempio: node misura-fotogrammi.mjs http://localhost:3200/giochi/memory-animali "[data-avvia]" 6
import { chromium } from "playwright-core";
import { CHROMIUM } from "../../../scripts/verifica/comune.mjs";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const [bersaglio = "index.html", avvio = "", rallentamento = "1"] = process.argv.slice(2);

let indirizzo = bersaglio;
if (!/^https?:/.test(bersaglio)) {
  // Una pagina sola senza <head>: si aggiunge il viewport, altrimenti il telefono finto usa 980 px.
  let pagina = readFileSync(resolve(bersaglio), "utf8");
  if (!/name=["']?viewport/i.test(pagina)) {
    pagina = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}</style>' + pagina;
  }
  const copia = join(mkdtempSync(join(tmpdir(), "fotogrammi-")), "gioco.html");
  writeFileSync(copia, pagina);
  indirizzo = "file://" + copia;
}

// Stesso Chromium delle verifiche del sito (scripts/verifica/comune.mjs).
const browser = await chromium.launch({ executablePath: CHROMIUM });
const contesto = await browser.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const pagina = await contesto.newPage();
const errori = [];
pagina.on("pageerror", (e) => errori.push(e.message));
await pagina.goto(indirizzo);
await pagina.waitForTimeout(500);
if (avvio && (await pagina.$(avvio))) await pagina.tap(avvio);
const cdp = await contesto.newCDPSession(pagina);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(rallentamento) });

const misura = await pagina.evaluate(
  () =>
    new Promise((fine) => {
      const tempi = [];
      let prima = performance.now();
      function giro(ora) {
        tempi.push(ora - prima);
        prima = ora;
        if (tempi.length < 240) return requestAnimationFrame(giro);
        tempi.shift();
        tempi.sort((a, b) => a - b);
        const tela = document.querySelector("canvas");
        fine({
          media_ms: +(tempi.reduce((a, b) => a + b) / tempi.length).toFixed(1),
          p95_ms: +tempi[Math.floor(tempi.length * 0.95)].toFixed(1),
          massimo_ms: +tempi[tempi.length - 1].toFixed(1),
          // Fotogrammi oltre 25 ms: quelli che l'occhio vede come scatti.
          scatti_percento: +((tempi.filter((t) => t > 25).length / tempi.length) * 100).toFixed(1),
          canvas: tela ? `${tela.width}x${tela.height}` : "nessuno",
        });
      }
      requestAnimationFrame(giro);
    }),
);
console.log(JSON.stringify({ rallentamento: Number(rallentamento), ...misura, errori }));
await browser.close();
