// La guardia delle cartelle: ogni file sta dove dice docs/ARCHITETTURA.md.
//
// Nasce il 17/11/2026. Il progetto cresce a pezzi, da più chat insieme, e i
// file finivano dove capitava: `lib/` aveva 57 file sciolti di sette argomenti
// diversi. Questo controllo gira con `npm run verifica`: un file nel posto
// sbagliato ferma la pubblicazione e dice dove andava messo.
//
// Per aggiungere una cartella nuova: prima la si scrive in docs/ARCHITETTURA.md
// (cosa contiene e perché non sta in una già esistente), poi qui sotto.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";

const problemi = [];
const ko = (testo) => problemi.push(testo);
const voci = (cartella) => readdirSync(cartella, { withFileTypes: true }).filter((v) => ![".DS_Store"].includes(v.name));
const cartelle = (c) => voci(c).filter((v) => v.isDirectory()).map((v) => v.name);
const file = (c) => voci(c).filter((v) => v.isFile()).map((v) => v.name);

// 1. La radice: solo queste cartelle e questi file di configurazione.
const RADICE_CARTELLE = ["app", "assets", "cards", "components", "content", "docs", "games", "lib", "public", "scripts", "supabase"];
const RADICE_FILE = [
  "AGENTS.md", "CLAUDE.md", "README.md", "eslint.config.mjs", "middleware.ts", "next-env.d.ts", "next.config.ts",
  "package-lock.json", "package.json", "postcss.config.mjs", "tsconfig.json", "tsconfig.tsbuildinfo", "vercel.json",
];
for (const c of cartelle(".")) {
  if (c.startsWith(".") || c === "node_modules") continue;
  if (!RADICE_CARTELLE.includes(c)) ko(`cartella «${c}/» nella radice: non è prevista. Il codice va in app, components, games o lib; i testi in content.`);
}
for (const f of file(".")) {
  if (f.startsWith(".")) continue;
  if (!RADICE_FILE.includes(f)) ko(`file «${f}» nella radice: qui stanno solo i file di configurazione. Uno script va in scripts/, un documento in docs/.`);
}

// 2. lib/: nessun file sciolto, solo cartelle per argomento.
const LIB = {
  biglietti: "inviti, kit della festa, condivisione",
  contenuti: "guide brevi, articoli compilati, tutorial, lettura di content/, note legali",
  directory: "feste per città, schede delle attività, categorie, filtri, mappa, pannello",
  email: "Brevo ed email di servizio",
  famiglia: "il profilo della famiglia nell'app e i percorsi di riflessione per i genitori",
  foto: "registro delle foto, prenotazioni, misure, caricatore delle immagini",
  giochi: "album di Mizi, voce, suoni, conto delle partite",
  natale: "letterina, biglietti ed eventi di Natale",
  protezione: "limiti e difese contro gli abusi",
  risorse: "la directory delle risorse educative",
  seo: "dominio, date delle pagine, immagini di anteprima, Search Console",
  social: "le slide e i testi per Instagram",
  supabase: "i collegamenti al database",
};
for (const f of file("lib")) ko(`«lib/${f}» è sciolto in lib/: va in una cartella per argomento (${Object.keys(LIB).join(", ")}).`);
for (const c of cartelle("lib")) if (!LIB[c]) ko(`cartella «lib/${c}/» non prevista: gli argomenti di lib sono ${Object.keys(LIB).join(", ")}.`);

// 3. components/: una cartella per zona del sito, più tre file condivisi da tutti.
const COMPONENTI = [
  "app", "biglietti", "directory", "feste", "font-switcher", "form", "game-shell", "genitori", "giochi", "guide", "legal", "mappa",
  "natale", "progress", "risorse", "seo", "storie", "tutorial", "ui", "vetrina",
];
const COMPONENTI_SCIOLTI = ["decor.tsx", "icone.tsx", "illustrazioni.tsx"];
for (const c of cartelle("components")) if (!COMPONENTI.includes(c)) ko(`cartella «components/${c}/» non prevista: aggiungila alla mappa o usa una zona che esiste già.`);
for (const f of file("components")) if (!COMPONENTI_SCIOLTI.includes(f)) ko(`«components/${f}» è sciolto: va nella cartella della sua zona (components/<zona>/).`);

// 4. games/: ogni cartella è un gioco del registro con il suo Game.tsx; i motori stanno in _engine.
const registro = readFileSync("games/registry.ts", "utf8");
const slugRegistro = new Set([...registro.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]));
for (const c of cartelle("games")) {
  if (c.startsWith("_")) {
    if (!["_engine", "_template"].includes(c)) ko(`cartella «games/${c}/» non prevista: le parti comuni stanno in games/_engine.`);
    continue;
  }
  if (!slugRegistro.has(c)) ko(`«games/${c}/» non è nel registro (games/registry.ts): un gioco esiste solo se è registrato.`);
  if (!existsSync(`games/${c}/Game.tsx`)) ko(`«games/${c}/» non ha Game.tsx.`);
}
for (const f of file("games")) if (!["componenti.ts", "elenco.ts", "registry.ts"].includes(f)) ko(`«games/${f}» è sciolto: la logica comune va in games/_engine.`);

// 5. content/: testi e dati scritti a mano, niente codice.
for (const c of ["content", "docs"]) {
  const giro = (dir) => {
    for (const v of voci(dir)) {
      const p = `${dir}/${v.name}`;
      if (v.isDirectory()) giro(p);
      else if (/\.(ts|tsx|mjs|js|py)$/.test(v.name)) ko(`«${p}»: in ${c}/ non va codice. Gli script stanno in scripts/, la logica in lib/.`);
    }
  };
  giro(c);
}

// 6. scripts/: gli strumenti stanno qui, e le prove in scripts/verifica.
for (const c of cartelle("scripts")) if (!["articoli", "verifica", "video"].includes(c)) ko(`cartella «scripts/${c}/» non prevista.`);

// 7. La mappa esiste e nomina ogni cartella di lib.
const mappa = existsSync("docs/ARCHITETTURA.md") ? readFileSync("docs/ARCHITETTURA.md", "utf8") : "";
if (!mappa) ko("manca docs/ARCHITETTURA.md.");
for (const c of Object.keys(LIB)) if (mappa && !mappa.includes(`lib/${c}/`)) ko(`docs/ARCHITETTURA.md non parla di lib/${c}/.`);
for (const c of RADICE_CARTELLE) if (mappa && !mappa.includes(`\`${c}/\``)) ko(`docs/ARCHITETTURA.md non parla di ${c}/.`);

// Niente file più grandi di 500 kB fuori da public/ (foto e video stanno lì).
// Fanno eccezione i file generati da uno script, che crescono col sito.
const GENERATI_GRANDI = ["lib/contenuti/approfondimenti.json"];
for (const c of ["app", "components", "games", "lib", "scripts", "content", "docs"]) {
  const giro = (dir) => {
    for (const v of voci(dir)) {
      const p = `${dir}/${v.name}`;
      if (v.isDirectory()) giro(p);
      else if (statSync(p).size > 500 * 1024 && !/\.ttf$/.test(v.name) && !GENERATI_GRANDI.includes(p)) ko(`«${p}» pesa più di 500 kB: i file grandi (foto, audio, video) vanno in public/.`);
    }
  };
  giro(c);
}

if (problemi.length) {
  console.log(problemi.map((p) => `FUORI POSTO  ${p}`).join("\n"));
  console.log(`struttura: ${problemi.length} PROBLEMI (la mappa è docs/ARCHITETTURA.md)`);
  process.exit(1);
}
console.log("struttura: in ordine");
