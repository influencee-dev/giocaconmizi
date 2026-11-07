// Le date vere delle pagine, per il <lastmod> della sitemap.
//
// Google usa lastmod solo se è "costantemente e verificabilmente accurato":
// una sitemap che dichiara "modificato adesso" su ogni pagina viene ignorata.
// Questo script legge dalla storia git il giorno dell'ultima modifica di ogni
// file sorgente che conta per le pagine e lo scrive in lib/date-pagine.json
// (versionato: su Vercel la storia git non c'è). I file modificati e non
// ancora committati prendono la data di oggi, che sarà quella del commit.
//
//   node scripts/date-pagine.mjs             rigenera il file
//   node scripts/date-pagine.mjs --controlla esce con errore se è vecchio
//
// Serve la storia completa: in un clone superficiale (--depth) le date dei
// file vecchi sarebbero sbagliate, quindi lo script si rifiuta.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const USCITA = path.join(RADICE, "lib/date-pagine.json");
const git = (...a) => execFileSync("git", a, { cwd: RADICE, encoding: "utf8" });

if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
  console.error("date-pagine: il clone è superficiale. Prima: git fetch --unshallow origin main");
  process.exit(1);
}

/** I file che decidono il contenuto delle pagine. */
const CONTA = (f) =>
  /^content\/.+\.md$/.test(f) ||
  /^games\/[a-z0-9-]+\//.test(f) ||
  /^app\/\(public\)\/.+\/page\.tsx$/.test(f) ||
  f === "app/(public)/page.tsx" ||
  ["lib/biglietti.ts", "cards/registry.ts", "lib/esempi.ts"].includes(f);

/** I file di un gioco contano come una cosa sola: games/<slug>. */
const chiave = (f) => f.match(/^(games\/[a-z0-9-]+)\//)?.[1] ?? f;

const date = {};
const metti = (f, giorno) => {
  const k = chiave(f);
  if (!date[k] || giorno > date[k]) date[k] = giorno;
};

// Una sola passata sulla storia: per ogni file vale il commit più recente.
const visti = new Set();
let giorno = "";
for (const riga of git("log", "--format=@%cs", "--name-only", "--no-renames", "HEAD").split("\n")) {
  if (riga.startsWith("@")) giorno = riga.slice(1);
  else if (riga && !visti.has(riga)) {
    visti.add(riga);
    if (CONTA(riga)) metti(riga, giorno);
  }
}

// Le modifiche ancora da committare: oggi.
const oggi = new Date().toISOString().slice(0, 10);
for (const riga of git("status", "--porcelain", "--untracked-files=all").split("\n")) {
  const f = riga.slice(3).trim().replace(/^"|"$/g, "");
  if (f && CONTA(f) && fs.existsSync(path.join(RADICE, f))) metti(f, oggi);
}

// Solo i file che esistono ancora (la storia ricorda anche quelli tolti).
const esiste = (k) => fs.existsSync(path.join(RADICE, k));
const ordinate = Object.fromEntries(Object.keys(date).filter(esiste).sort().map((k) => [k, date[k]]));
const testo = `${JSON.stringify(ordinate, null, 2)}\n`;

if (process.argv.includes("--controlla")) {
  const attuale = fs.existsSync(USCITA) ? fs.readFileSync(USCITA, "utf8") : "";
  if (attuale !== testo) {
    console.error("date-pagine: lib/date-pagine.json non è aggiornato. Esegui: npm run date-pagine");
    process.exit(1);
  }
  console.log(`date-pagine: aggiornato (${Object.keys(ordinate).length} voci)`);
} else {
  fs.writeFileSync(USCITA, testo);
  console.log(`date-pagine: ${Object.keys(ordinate).length} voci in lib/date-pagine.json`);
}
