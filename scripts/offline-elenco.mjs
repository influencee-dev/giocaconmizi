// Dopo la build: scrive public/offline-elenco.json, l'elenco di tutto quello
// che serve per giocare senza connessione (lib/giochi/offline.ts lo scarica
// quando qualcuno tocca «Scarica i giochi»). File generato, non sta nel repo.
//
//   node scripts/offline-elenco.mjs
//
// Dentro: le pagine dei giochi, tutti i file di .next/static (il codice e i
// caratteri), la voce registrata di Mizi e i disegni dei giochi.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

if (!existsSync(".next/BUILD_ID")) {
  console.error("offline-elenco: manca la build (.next/BUILD_ID).");
  process.exit(1);
}

function percorri(cartella) {
  return readdirSync(cartella, { withFileTypes: true }).flatMap((v) => {
    const p = join(cartella, v.name);
    return v.isDirectory() ? percorri(p) : [p];
  });
}
// Come li chiede il browser: ogni pezzo dell'indirizzo codificato ([slug] diventa %5Bslug%5D).
const indirizzo = (percorso) => "/" + percorso.split("/").map(encodeURIComponent).join("/");

let peso = 0;
const elenca = (cartella, prefisso, tieni = () => true) =>
  (existsSync(cartella) ? percorri(cartella) : [])
    .filter((p) => tieni(p))
    .map((p) => {
      peso += statSync(p).size;
      return indirizzo(prefisso + p.slice(cartella.length + 1));
    });

const statici = elenca(".next/static", "_next/static/", (p) => !p.endsWith(".map"));
const voce = elenca("public/voce", "voce/", (p) => p.endsWith(".mp3"));
const figure = elenca("public/figure", "figure/", (p) => p.endsWith(".webp"));
const mizi = elenca("public/mizi", "mizi/", (p) => /\.(webp|png|svg)$/.test(p));
const app = elenca("public/app", "app/", (p) => /\.(png|svg|webp)$/.test(p));

const registro = readFileSync("games/registry.ts", "utf8");
const giocabili = readFileSync("games/elenco.ts", "utf8");
const vivi = [...registro.matchAll(/slug: "([^"]+)"[^}]*?status: "live"/g)].map((x) => x[1]).filter((s) => giocabili.includes(`"${s}"`) || giocabili.includes(`  ${s},`));
const pagine = ["/", "/giochi", "/giochi/album", ...vivi.flatMap((s) => [`/giochi/${s}`, `/giochi/${s}/gioca`])];
// Le pagine pesano una cinquantina di kB l'una: una stima onesta per dire «circa N MB».
peso += pagine.length * 50_000;

const elenco = { versione: readFileSync(".next/BUILD_ID", "utf8").trim(), giochi: vivi.length, peso, pagine, file: [...statici, ...voce, ...figure, ...mizi, ...app] };
writeFileSync("public/offline-elenco.json", JSON.stringify(elenco));
console.log(`offline-elenco: ${vivi.length} giochi, ${pagine.length} pagine, ${elenco.file.length} file, circa ${(peso / 1048576).toFixed(1)} MB`);
