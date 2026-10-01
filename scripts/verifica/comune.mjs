// Attrezzi comuni delle verifiche: browser, server e un biglietto pieno.
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";

export const BASE = "http://localhost:3100";
export const CHROMIUM = process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

/** Un biglietto con tutto dentro: il caso peggiore per layout e link. */
export const DATI_PIENI = {
  tipo: "invito", tema: "halloween", variante: "colorato", nome: "Domiziana", eta: "7",
  frase: "Ti aspetto alla mia festa! 🎃", data: "sabato 31 ottobre", ora: "dalle 16",
  luogo: "Via dei Tigli 4", conferma: "333 1234567", firma: "Domiziana e mamma",
  conMizi: true, carattere: "tondo", conQr: true,
  stickers: [{ id: "zucca", x: 18, y: 16, s: 1 }, { id: "fantasmino", x: 82, y: 16, s: 1.2 }],
};
export const B_PIENO = encodeURIComponent(Buffer.from(JSON.stringify(DATI_PIENI), "utf8").toString("base64"));

/** PNG rosso 1x1: basta per provare il caricamento della foto. */
export const FOTO_PROVA = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

export async function apriBrowser() {
  return chromium.launch({ executablePath: CHROMIUM });
}

/** Si assicura che il server di produzione risponda su :3100; se serve lo avvia. */
export async function conServer() {
  const su = () => fetch(`${BASE}/robots.txt`).then((r) => r.ok).catch(() => false);
  if (await su()) return null;
  const proc = spawn("npx", ["next", "start", "-p", "3100"], { stdio: "ignore", detached: true });
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await su()) return proc;
  }
  throw new Error("il server su :3100 non è partito (hai fatto npm run build?)");
}

export function contatore() {
  const esiti = [];
  return {
    ok(nome, cond, det = "") {
      esiti.push(!!cond);
      console.log(`${cond ? "PASS" : "FAIL"}  ${nome}${det ? ` — ${det}` : ""}`);
    },
    chiudi(etichetta) {
      const ko = esiti.filter((e) => !e).length;
      console.log(`${etichetta}: ${esiti.length - ko}/${esiti.length}`);
      return ko === 0;
    },
  };
}
