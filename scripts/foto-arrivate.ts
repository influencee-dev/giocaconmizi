/**
 * Le foto arrivate da ChatGPT (cartella Drive «99 Immagini pronte», scaricate
 * in una cartella locale) diventano i WebP del sito, riconosciute dal nome:
 *   guida-<slug>.png        → public/immagini/guida-<slug>-1440|960|640.webp
 *   <file di FOTO>.png o H-03.png → public/immagini/<file>-<larghezze>.webp
 * Una foto già sul sito si salta (con --sovrascrivi si rifà). I nomi che non
 * corrispondono a niente vengono elencati: vanno guardati a mano.
 *
 *   npm run foto-arrivate -- <cartella> [--sovrascrivi]
 */
import fs from "node:fs";
import path from "node:path";
import { GUIDE } from "../lib/guide";
import { FOTO, LARGHEZZE, LARGHEZZE_GUIDA, type CodiceFoto } from "../lib/foto";
import { ottimizza } from "../lib/immagini/ottimizza";
import { leggiCoda } from "../lib/foto-in-arrivo";

const cartella = process.argv.slice(2).find((a) => !a.startsWith("--"));
const sovrascrivi = process.argv.includes("--sovrascrivi");
if (!cartella || !fs.statSync(cartella).isDirectory()) {
  console.error("Uso: npm run foto-arrivate -- <cartella> [--sovrascrivi]");
  process.exit(1);
}
const FUORI = path.join(process.cwd(), "public", "immagini");

/** Il nome «pulito»: minuscolo, senza estensione, copie «(1)» o larghezze. */
const radice = (f: string) =>
  path
    .basename(f, path.extname(f))
    .toLowerCase()
    .replace(/\s*\(\d+\)$/, "")
    .replace(/-(1440|960|800|640|480)$/, "")
    .trim();

type Destinazione = { base: string; rapporto: number; larghezze: number[] };

function riconosci(nome: string): Destinazione | null {
  const r = radice(nome);
  const guida = GUIDE.find((g) => r === `guida-${g.slug}`);
  if (guida) return { base: `guida-${guida.slug}`, rapporto: 16 / 9, larghezze: LARGHEZZE_GUIDA };
  const codice = (Object.keys(FOTO) as CodiceFoto[]).find((c) => c.toLowerCase() === r || FOTO[c].file === r);
  if (codice) return { base: FOTO[codice].file, rapporto: FOTO[codice].rapporto, larghezze: [...LARGHEZZE] };
  // Le foto prenotate (content/foto-in-arrivo.json) di pagine non ancora
  // pubblicate: es. l'articolo di oggi, la cui foto arriva prima del testo.
  const prenotata = leggiCoda().prenotazioni.find((p) => p.nomeFile === r);
  if (prenotata)
    return {
      base: prenotata.nomeFile,
      rapporto: prenotata.rapporto,
      larghezze: prenotata.nomeFile.startsWith("guida-") ? LARGHEZZE_GUIDA : [...LARGHEZZE],
    };
  return null;
}

async function principale() {
  const file = fs
    .readdirSync(cartella!)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort();
  const fatte: string[] = [];
  const saltate: string[] = [];
  const sconosciute: string[] = [];
  for (const f of file) {
    const d = riconosci(f);
    if (!d) {
      sconosciute.push(f);
      continue;
    }
    const prima = `${d.base}-${d.larghezze[0]}.webp`;
    if (!sovrascrivi && d.larghezze.some((l) => fs.existsSync(path.join(FUORI, `${d.base}-${l}.webp`)))) {
      saltate.push(`${f} (già sul sito)`);
      continue;
    }
    const r = await ottimizza(fs.readFileSync(path.join(cartella!, f)), {
      latoMassimo: d.larghezze[0],
      fedelta: "equilibrata",
      rapporto: d.rapporto,
      varianti: d.larghezze.slice(1),
    });
    fs.writeFileSync(path.join(FUORI, `${d.base}-${r.principale.larghezza}.webp`), r.principale.dati);
    for (const v of r.varianti) fs.writeFileSync(path.join(FUORI, `${d.base}-${v.larghezza}.webp`), v.dati);
    fatte.push(
      `${f} → ${d.base} (${r.principale.larghezza}×${r.principale.altezza}, ${Math.round(r.principale.byte / 1024)} KB, +${r.varianti.length} varianti)` +
        (r.principale.larghezza !== d.larghezze[0] ? ` ATTENZIONE: originale più piccolo di ${prima}` : ""),
    );
  }
  for (const r of fatte) console.log(`FATTA      ${r}`);
  for (const r of saltate) console.log(`SALTATA    ${r}`);
  for (const r of sconosciute) console.log(`SCONOSCIUTA ${r}: il nome non corrisponde a nessuna foto`);
  console.log(`Totale: ${fatte.length} nuove, ${saltate.length} già presenti, ${sconosciute.length} da guardare a mano.`);
}

principale().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
