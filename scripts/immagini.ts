// Ottimizzatore immagini da riga di comando, stessa logica del pannello
// (lib/immagini/ottimizza.ts): WebP alla qualità più bassa che resta
// identica a occhio, più le varianti responsive.
//
//   npm run immagini -- <cartella-o-file> [--codice H-01] [--fuori public/immagini] [--lato 1920] [--fedelta equilibrata]
//
// Con --codice il ritaglio e i nomi sono quelli di lib/foto-dati.ts e i file
// finiscono in public/immagini/ pronti per il sito.
import fs from "node:fs";
import path from "node:path";
import { FOTO, LARGHEZZE, type CodiceFoto } from "../lib/foto-dati";
import {
  ottimizza,
  nomePulito,
  FEDELTA,
  type Fedelta,
} from "../lib/immagini/ottimizza";

const arg = (nome: string) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const sorgente = process.argv
  .slice(2)
  .find((a, i, t) => !a.startsWith("--") && !t[i - 1]?.startsWith("--"));
if (!sorgente) {
  console.error(
    "Uso: npm run immagini -- <cartella-o-file> [--codice H-01] [--fuori cartella] [--lato 1920] [--fedelta equilibrata]",
  );
  process.exit(1);
}
const codice = arg("codice") as CodiceFoto | undefined;
if (codice && !FOTO[codice]) {
  console.error(
    `Codice sconosciuto: ${codice}. Validi: ${Object.keys(FOTO).join(", ")}`,
  );
  process.exit(1);
}
const fuori =
  arg("fuori") ??
  (codice ? "public/immagini" : path.join(path.dirname(sorgente), "webp"));
const lato = Number(arg("lato") ?? 1920);
const fedelta = (arg("fedelta") ?? "equilibrata") as Fedelta;
if (!(fedelta in FEDELTA)) {
  console.error(`Fedeltà: ${Object.keys(FEDELTA).join(", ")}`);
  process.exit(1);
}

const file = fs.statSync(sorgente).isDirectory()
  ? fs
      .readdirSync(sorgente)
      .filter((f) => /\.(png|jpe?g|webp|tiff?|avif)$/i.test(f))
      .map((f) => path.join(sorgente, f))
  : [sorgente];
if (codice && file.length !== 1) {
  console.error("Con --codice passa un file solo.");
  process.exit(1);
}
fs.mkdirSync(fuori, { recursive: true });

async function principale() {
  let prima = 0;
  let dopo = 0;
  for (const f of file) {
    const scheda = codice ? FOTO[codice] : null;
    const r = await ottimizza(fs.readFileSync(f), {
      latoMassimo: lato,
      fedelta,
      rapporto: scheda?.rapporto,
      varianti: [...LARGHEZZE],
    });
    const base = scheda ? scheda.file : nomePulito(path.basename(f));
    const scrivi = (nome: string, dati: Buffer) =>
      fs.writeFileSync(path.join(fuori, nome), dati);
    scrivi(
      scheda ? `${base}-${r.principale.larghezza}.webp` : `${base}.webp`,
      r.principale.dati,
    );
    for (const v of r.varianti) scrivi(`${base}-${v.larghezza}.webp`, v.dati);
    const peso = fs.statSync(f).size;
    prima += peso;
    dopo += r.principale.byte;
    console.log(
      `${path.basename(f)}: ${Math.round(peso / 1024)} KB → ${Math.round(r.principale.byte / 1024)} KB ` +
        `(${r.principale.larghezza}×${r.principale.altezza}, qualità ${r.qualita}, ${r.psnr} dB) + ${r.varianti.length} varianti`,
    );
  }
  console.log(
    `Totale: ${Math.round(prima / 1024)} KB → ${Math.round(dopo / 1024)} KB in ${fuori}`,
  );
}

principale().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
