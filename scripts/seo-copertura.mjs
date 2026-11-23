// `npm run seo:copertura`: per ogni ricerca di content/seo/parole-chiave.json
// guarda la pagina che le risponde e dice DOVE compaiono le parole cercate:
// nel titolo (quello che Google mostra), nella descrizione, nell'H1, nel testo.
//
// Nasce il 23/11/2026 col sistema del SEO manager (.claude/skills/seo-geo-aeo-manager):
// la ricerca del 22/11 diceva «le pagine si chiamano col nome del gioco, la
// gente cerca altro». Questo strumento lo misura invece di supporlo.
//
//   npm run seo:copertura                      server locale (:3100, dopo npm run build)
//   npm run seo:copertura -- --sito https://giocamizi.it   il sito vero
//   npm run seo:copertura -- --md rapporto.md  scrive anche un rapporto in Markdown
//   npm run seo:copertura -- --controlla       solo le righe «fatto»: se una ha perso
//                                              le sue parole esce con errore (lo usa seo.mjs)
import { readFileSync, writeFileSync } from "node:fs";

const argomenti = process.argv.slice(2);
const valore = (nome) => {
  const i = argomenti.indexOf(nome);
  return i >= 0 ? argomenti[i + 1] : undefined;
};
const CONTROLLA = argomenti.includes("--controlla");
const SITO = valore("--sito");
const MD = valore("--md");

const dati = JSON.parse(readFileSync("content/seo/parole-chiave.json", "utf8"));

let base = SITO?.replace(/\/$/, "");
let servito = null;
if (!base) {
  const { conServer, BASE } = await import("./verifica/comune.mjs");
  servito = await conServer();
  base = BASE;
}

// Parole che non contano per dire «c'è»: articoli, preposizioni e simili.
const VUOTE = new Set("il lo la i gli le un uno una di a da in con su per tra fra e o del della dei delle al alla ai alle dal dalla nel nella sul sulla è".split(" "));
const normale = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
// «tabelline» trova anche «tabellina», «giochi» anche «gioco», «esercizio» anche
// «esercizi»: si confronta la radice (senza le vocali finali e l'acca di «chi/ghi»).
const radice = (p) => (p.length > 4 ? p.replace(/[aeiou]+$/, "").replace(/([cg])h$/, "$1") : p);
const parole = (frase) => normale(frase).split(" ").filter((p) => p && !VUOTE.has(p));

/** «frase»: tutta la ricerca, in fila. «parole»: tutte le parole che contano, in qualunque ordine. */
function trova(ricerca, testo) {
  const t = ` ${normale(testo)} `;
  if (t.includes(` ${normale(ricerca)} `)) return "frase";
  const nel = new Set(t.trim().split(" ").map(radice));
  return parole(ricerca).every((p) => nel.has(radice(p))) ? "parole" : null;
}

const decodifica = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const pagine = new Map();
async function leggi(percorso) {
  if (pagine.has(percorso)) return pagine.get(percorso);
  const r = await fetch(`${base}${percorso}`, { headers: { "user-agent": "giocamizi-seo-copertura" } }).catch(() => null);
  if (!r || !r.ok) {
    pagine.set(percorso, { stato: r?.status ?? "rete" });
    return pagine.get(percorso);
  }
  const html = await r.text();
  const titolo = decodifica(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const descrizione = decodifica(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const h1 = decodifica((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(/<[^>]+>/g, " "));
  const corpo = decodifica(
    (html.match(/<main[\s\S]*<\/main>/)?.[0] ?? html)
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " "),
  );
  pagine.set(percorso, { stato: 200, titolo, descrizione, h1, corpo });
  return pagine.get(percorso);
}

const righe = [];
for (const r of dati.ricerche) {
  if (!r.pagina) {
    righe.push({ ...r, esito: "senza pagina" });
    continue;
  }
  const p = await leggi(r.pagina);
  if (p.stato !== 200) {
    righe.push({ ...r, esito: `la pagina risponde ${p.stato}` });
    continue;
  }
  righe.push({
    ...r,
    titolo: trova(r.ricerca, p.titolo),
    descr: trova(r.ricerca, p.descrizione),
    h1: trova(r.ricerca, p.h1),
    corpo: trova(r.ricerca, p.corpo),
    titoloVero: p.titolo,
  });
}
if (servito) process.kill(-servito.pid);

const segno = (v) => (v === "frase" ? "✔" : v === "parole" ? "≈" : "·");

if (CONTROLLA) {
  // Una riga «fatto» deve avere la ricerca almeno nel titolo o nell'H1, e la pagina deve rispondere.
  const perse = righe.filter((r) => r.stato === "fatto" && (r.esito || !(r.titolo || r.h1)));
  for (const r of perse) console.log(`PERSA  «${r.ricerca}» su ${r.pagina}: ${r.esito ?? `titolo «${r.titoloVero}»`}`);
  console.log(`seo-copertura: ${righe.filter((r) => r.stato === "fatto").length - perse.length}/${righe.filter((r) => r.stato === "fatto").length} ricerche fatte ancora al loro posto`);
  process.exit(perse.length ? 1 : 0);
}

const migliaia = (n) => n.toLocaleString("it-IT");
const conPagina = righe.filter((r) => !r.esito);
const volumeTot = righe.reduce((s, r) => s + r.volume, 0);
const volumeTitolo = conPagina.filter((r) => r.titolo).reduce((s, r) => s + r.volume, 0);
const volumePagina = conPagina.filter((r) => r.titolo || r.h1 || r.corpo).reduce((s, r) => s + r.volume, 0);

const intestazione = [
  `Copertura delle ricerche · ${base} · ${new Date().toISOString().slice(0, 10)}`,
  `${righe.length} ricerche, ${migliaia(volumeTot)} al mese in tutto.`,
  `Nel titolo: ${conPagina.filter((r) => r.titolo).length} ricerche (${migliaia(volumeTitolo)} al mese, ${Math.round((volumeTitolo / volumeTot) * 100)}%).`,
  `Almeno da qualche parte nella pagina: ${conPagina.filter((r) => r.titolo || r.h1 || r.corpo).length} (${migliaia(volumePagina)} al mese, ${Math.round((volumePagina / volumeTot) * 100)}%).`,
  `Senza pagina: ${righe.filter((r) => r.esito === "senza pagina").length}. Pagina che non risponde: ${righe.filter((r) => r.esito?.startsWith("la pagina")).length}.`,
  "Legenda: ✔ la frase intera · ≈ tutte le parole, in un altro ordine · · assente.",
];
console.log(intestazione.join("\n"));
console.log("");

// Prima quello che rende di più: le ricerche grandi con la pagina che c'è ma il titolo che non le nomina.
const ordinate = [...righe].sort((a, b) => b.volume - a.volume);
const tabella = ordinate.map((r) =>
  r.esito
    ? `${r.volume.toString().padStart(7)}  ${r.ricerca.padEnd(42)} ${r.esito}${r.pagina ? ` (${r.pagina})` : ""}`
    : `${r.volume.toString().padStart(7)}  ${r.ricerca.padEnd(42)} titolo ${segno(r.titolo)} descr ${segno(r.descr)} h1 ${segno(r.h1)} testo ${segno(r.corpo)}  ${r.pagina}`,
);
console.log(tabella.join("\n"));

if (MD) {
  const md = [
    `# ${intestazione[0]}`,
    "",
    ...intestazione.slice(1).map((r) => `- ${r}`),
    "",
    "| Al mese | Ricerca | Pagina | Titolo | Descr. | H1 | Testo | Stato |",
    "|---:|---|---|:-:|:-:|:-:|:-:|---|",
    ...ordinate.map((r) =>
      r.esito
        ? `| ${migliaia(r.volume)} | ${r.ricerca} | ${r.pagina ?? "—"} | | | | | ${r.esito} |`
        : `| ${migliaia(r.volume)} | ${r.ricerca} | ${r.pagina} | ${segno(r.titolo)} | ${segno(r.descr)} | ${segno(r.h1)} | ${segno(r.corpo)} | ${r.stato} |`,
    ),
    "",
  ].join("\n");
  writeFileSync(MD, md);
  console.log(`\nrapporto scritto in ${MD}`);
}
