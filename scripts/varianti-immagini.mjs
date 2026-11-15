// Elenco delle foto del sito e delle larghezze in cui esistono davvero
// (public/immagini/<nome>-<larghezza>.webp) → lib/immagini-varianti.json.
// Lo legge lib/caricatore-immagini.ts per scegliere il file giusto senza
// passare dal ridimensionamento di Vercel. Gira da solo prima di ogni build
// («prebuild»): una foto nuova entra nell'elenco senza doverci pensare.
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RADICE = "public/immagini";
const varianti = {};
function leggi(cartella, prefisso) {
  for (const nome of readdirSync(cartella).sort()) {
    const percorso = join(cartella, nome);
    if (statSync(percorso).isDirectory()) {
      leggi(percorso, `${prefisso}${nome}/`);
      continue;
    }
    const m = nome.match(/^(.+)-(\d+)\.webp$/);
    if (m) (varianti[`${prefisso}${m[1]}`] ??= []).push(Number(m[2]));
  }
}
leggi(RADICE, "");
for (const k of Object.keys(varianti)) varianti[k].sort((a, b) => a - b);
writeFileSync("lib/immagini-varianti.json", `${JSON.stringify(varianti)}\n`);
console.log(`varianti-immagini: ${Object.keys(varianti).length} foto in lib/immagini-varianti.json`);
