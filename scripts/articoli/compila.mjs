// Gli articoli approfonditi: da content/guide/<slug>.md a lib/approfondimenti.json.
//
// Ogni articolo è un file Markdown con i dati in testa (frontmatter: vedi
// docs/routine-articoli.md). Questo script lo trasforma nel formato delle
// guide (lib/guide.ts → Guida), con in più l'HTML del corpo, l'indice, la
// scheda rapida, le fonti e le immagini. Solo gli articoli con
// `stato: pubblicata` finiscono nel JSON: le bozze restano nel Markdown.
//
//   node scripts/articoli/compila.mjs             rigenera il JSON
//   node scripts/articoli/compila.mjs --controlla esce con errore se è vecchio
//
// Blocchi speciali nel Markdown (visualizzazioni originali, niente immagini di terzi):
//   ```grafico   {"titolo","unita","nota","voci":[{"etichetta","valore"}]}
//   ```matrice   {"titolo","colonne":[...],"righe":[{"voce","valori":[...]}],"nota"}
//                 valori: "si" | "no" | "parziale" | testo libero
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { Marked } from "marked";

const QUESTO = fileURLToPath(import.meta.url);
const RADICE = path.resolve(path.dirname(QUESTO), "../..");
export const CARTELLA = path.join(RADICE, "content/guide");
const USCITA = path.join(RADICE, "lib/approfondimenti.json");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const ancora = (t) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Il testo che legge una persona: tag tolti, entità decodificate, spazi normalizzati. */
export const testoPiano = (html) =>
  html
    .replace(/<!--viz-->[\s\S]*?<!--\/viz-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const CHIP = {
  si: ["si", "Sì"],
  no: ["no", "No"],
  parziale: ["parziale", "In parte"],
};

function grafico(json) {
  const d = JSON.parse(json);
  const max = Math.max(...d.voci.map((v) => Number(v.valore)));
  const fmt = (v) => `${Number(v).toLocaleString("it-IT", { maximumFractionDigits: 2 })}${d.unita ? ` ${esc(d.unita)}` : ""}`;
  const righe = d.voci
    .map(
      (v) =>
        `<li><span class="grafico-etichetta">${esc(v.etichetta)}</span><span class="grafico-binario"><span class="grafico-barra" style="width:${Math.max(2, (Number(v.valore) / max) * 100).toFixed(1)}%"></span></span><span class="grafico-valore">${fmt(v.valore)}</span></li>`,
    )
    .join("");
  return `<!--viz--><figure class="grafico"><figcaption>${esc(d.titolo)}</figcaption><ul>${righe}</ul>${d.nota ? `<p class="viz-nota">${esc(d.nota)}</p>` : ""}</figure><!--/viz-->`;
}

function matrice(json) {
  const d = JSON.parse(json);
  const cella = (v) => {
    const c = CHIP[String(v).toLowerCase()];
    return c ? `<span class="chip chip-${c[0]}">${c[1]}</span>` : esc(v);
  };
  const testa = `<tr><th scope="col">${esc(d.intestazione ?? "")}</th>${d.colonne.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr>`;
  const corpo = d.righe
    .map((r) => `<tr><th scope="row">${esc(r.voce)}</th>${r.valori.map((v) => `<td>${cella(v)}</td>`).join("")}</tr>`)
    .join("");
  return `<!--viz--><figure class="matrice"><figcaption>${esc(d.titolo)}</figcaption><div class="tabella-scorre"><table><thead>${testa}</thead><tbody>${corpo}</tbody></table></div>${d.nota ? `<p class="viz-nota">${esc(d.nota)}</p>` : ""}</figure><!--/viz-->`;
}

function creaMarked(indice) {
  const m = new Marked({ gfm: true });
  m.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const id = ancora(html);
        if (depth === 2) indice.push({ id, titolo: testoPiano(html) });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      code({ text, lang }) {
        if (lang === "grafico") return grafico(text);
        if (lang === "matrice") return matrice(text);
        return `<pre><code>${esc(text)}</code></pre>\n`;
      },
      table(token) {
        const testa = token.header.map((c) => `<th scope="col">${this.parser.parseInline(c.tokens)}</th>`).join("");
        const righe = token.rows
          .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${this.parser.parseInline(c.tokens)}</th>` : `<td>${this.parser.parseInline(c.tokens)}</td>`)).join("")}</tr>`)
          .join("");
        return `<div class="tabella-scorre"><table><thead><tr>${testa}</tr></thead><tbody>${righe}</tbody></table></div>\n`;
      },
      link({ href, title, tokens }) {
        const testo = this.parser.parseInline(tokens);
        const esterno = /^https?:\/\//.test(href);
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ""}${esterno ? ' target="_blank" rel="noopener"' : ""}>${testo}</a>`;
      },
      image({ href, title, text }) {
        return `<figure class="immagine"><img src="${esc(href)}" alt="${esc(text)}" loading="lazy" decoding="async">${title ? `<figcaption>${esc(title)}</figcaption>` : ""}</figure>`;
      },
    },
  });
  return m;
}

/** Legge e trasforma un articolo. Usata anche da controlla.mjs. */
export function leggiArticolo(file) {
  const grezzo = fs.readFileSync(file, "utf8");
  const { data: d, content } = matter(grezzo);
  const indice = [];
  const m = creaMarked(indice);
  const html = m.parse(content);

  // Le sezioni in formato Guida (per llms-full.txt e per chi legge solo il testo).
  const sezioni = [];
  let corrente = { titolo: "Introduzione", paragrafi: [] };
  const sub = creaMarked([]);
  for (const t of m.lexer(content)) {
    if (t.type === "heading" && t.depth === 2) {
      if (corrente.paragrafi.length) sezioni.push(corrente);
      corrente = { titolo: testoPiano(sub.parseInline(t.text)), paragrafi: [] };
    } else if (t.type !== "space") {
      const testo = testoPiano(sub.parser([t]));
      if (testo) corrente.paragrafi.push(testo);
    }
  }
  if (corrente.paragrafi.length) sezioni.push(corrente);

  const testo = testoPiano(html);
  const parole = testo.split(" ").filter(Boolean).length;
  const data = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ?? null);

  return {
    file,
    grezzo,
    corpo: content,
    dati: d,
    guida: {
      slug: d.slug,
      titolo: d.titolo,
      titoloBreve: d.titoloBreve,
      descrizione: d.descrizione,
      rispostaBreve: d.rispostaBreve,
      etaMin: d.etaMin,
      etaMax: d.etaMax,
      minutiLettura: Math.max(1, Math.round(parole / 200)),
      aggiornata: data(d.aggiornata),
      skill: d.skill,
      sezioni,
      faq: d.faq ?? [],
      giochi: d.giochi ?? [],
      foto: d.foto,
      approfondimento: {
        stato: d.stato,
        voce: d.voce,
        categoria: d.categoria,
        keyword: d.keyword,
        titoloSeo: d.titoloSeo ?? null,
        pubblicata: data(d.pubblicata),
        fontiVerificateIl: data(d.fontiVerificateIl),
        prezziVerificatiIl: data(d.prezziVerificatiIl),
        caratteri: testo.length,
        schedaRapida: d.schedaRapida ?? [],
        indice,
        html,
        fonti: (d.fonti ?? []).map((f) => ({ ...f, consultata: data(f.consultata) })),
        immagini: d.immagini ?? [],
        relazioniCommerciali: d.relazioniCommerciali ?? null,
        trasparenza: d.trasparenza ?? null,
      },
    },
  };
}

export function tuttiGliArticoli() {
  if (!fs.existsSync(CARTELLA)) return [];
  return fs
    .readdirSync(CARTELLA)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => leggiArticolo(path.join(CARTELLA, f)));
}

const eseguito = process.argv[1] && path.resolve(process.argv[1]) === QUESTO;
if (eseguito) {
  const pubblicati = tuttiGliArticoli()
    .filter((a) => a.dati.stato === "pubblicata")
    .map((a) => a.guida);
  const testo = `${JSON.stringify(pubblicati, null, 2)}\n`;
  if (process.argv.includes("--controlla")) {
    const attuale = fs.existsSync(USCITA) ? fs.readFileSync(USCITA, "utf8") : "";
    if (attuale !== testo) {
      console.error("articoli: lib/approfondimenti.json non è aggiornato. Esegui: npm run articoli:compila");
      process.exit(1);
    }
    console.log(`articoli: aggiornato (${pubblicati.length} pubblicati)`);
  } else {
    fs.writeFileSync(USCITA, testo);
    console.log(`articoli: ${pubblicati.length} pubblicati in lib/approfondimenti.json`);
  }
}
