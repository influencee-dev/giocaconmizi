/**
 * Configurazione SEO condivisa — Gioca con Mizi.
 * Il dominio di produzione è giocamizi.it (Vercel). Finché non è collegato,
 * VERCEL_PROJECT_PRODUCTION_URL tiene canonical e sitemap sul dominio che
 * serve davvero le pagine: appena giocamizi.it è attivo, passa da solo.
 */

export const site = {
  nome: "Giocamizi",
  dominio: "https://giocamizi.it",
  titoloDefault:
    "Giocamizi — giochi educativi, storie e feste per bambini dai 3 ai 12 anni",
  descrizioneDefault:
    "Giochi educativi, storie da leggere, coding e biglietti di compleanno per bambini dai 3 ai 12 anni. Gratis, senza pubblicità e senza timer.",
  lingua: "it-IT",
  autore: "Giorgia Palazzo",
} as const;

/** URL assoluto per canonical, sitemap e Open Graph. */
export function url(percorso = "/"): string {
  // "|| " e non "??": su Vercel la variabile può esistere ma essere vuota,
  // e new URL("") fa fallire la build. VERCEL_PROJECT_PRODUCTION_URL è il
  // dominio di produzione del progetto (il custom più corto, o il vercel.app):
  // così il canonical punta sempre a un dominio che risponde davvero.
  const produzione = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (produzione && `https://${produzione}`) ||
    site.dominio
  ).replace(/\/$/, "");
  return percorso === "/" ? base : `${base}${percorso.startsWith("/") ? percorso : `/${percorso}`}`;
}

/** Le età hub coperte dal sito: una pagina per anno, da 3 a 12 (piano §3). */
export const eta = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/** Classi per gli hub "compiti delle vacanze". */
export const classi = [
  "prima-elementare",
  "seconda-elementare",
  "terza-elementare",
  "quarta-elementare",
  "quinta-elementare",
] as const;

export type Classe = (typeof classi)[number];

/** Etichetta leggibile per una classe (usata in H1 e breadcrumb). */
export function etichettaClasse(classe: string): string {
  return classe.replace(/-/g, " ");
}

/**
 * Un testo accorciato per la descrizione della pagina nei motori di ricerca:
 * oltre i 155 caratteri circa Google la taglia a metà parola. Qui si taglia
 * alla fine di una frase se ce n'è una dopo i primi 90 caratteri, altrimenti
 * all'ultima parola intera, con i puntini.
 */
export function riassunto(testo: string, massimo = 155): string {
  const pulito = testo.replace(/\s+/g, " ").trim();
  if (pulito.length <= massimo) return pulito;
  const pezzo = pulito.slice(0, massimo + 1);
  const fineFrase = Math.max(pezzo.lastIndexOf(". "), pezzo.lastIndexOf("! "), pezzo.lastIndexOf("? "));
  if (fineFrase >= 90) return pezzo.slice(0, fineFrase + 1);
  return `${pezzo.slice(0, pezzo.lastIndexOf(" ", massimo - 1)).replace(/[,;:(]+$/, "")}…`;
}

/**
 * Titoli di pagina (22/11/2026). Google mostra circa 60 caratteri di titolo e
 * taglia il resto: 318 pagine su 761 superavano i 70, e le schede dei locali
 * arrivavano a 150-200 («Nome, tipo lungo a Città (zona) — Giocamizi»), col
 * nome del posto e la città persi in mezzo. Regola: un titolo sta in
 * `TITOLO_MAX` caratteri; se col nome del sito in coda non ci sta, esce senza.
 */
export const TITOLO_MAX = 65;
const CODA_SITO = ` — ${site.nome}`;

/** Il titolo così com'è se col nome del sito sta nel limite; altrimenti senza « — Giocamizi». */
export function titoloPagina(titolo: string): string | { absolute: string } {
  return titolo.length + CODA_SITO.length > TITOLO_MAX ? { absolute: titolo } : titolo;
}

/**
 * Il titolo di una scheda: nome, che cos'è e città, nella forma più ricca che
 * sta nel limite. La zona non c'è più: resta nella descrizione e nella pagina.
 */
export function titoloScheda(s: { nome: string; tipo: string; citta: string }): string | { absolute: string } {
  // «parco giochi al coperto con gonfiabili e area per i più piccoli» → «parco giochi al coperto»
  const tipoCorto = s.tipo.split(/ con |, |: | \(| e | in | per /)[0];
  return titoloCheSta(`${s.nome}, ${s.tipo} a ${s.citta}`, `${s.nome}, ${tipoCorto} a ${s.citta}`, `${s.nome} a ${s.citta}`);
}

/**
 * La prima forma che sta nel limite, dalla più ricca alla più corta: prima col
 * nome del sito in coda, poi senza. Se non ne sta nessuna, l'ultima (la più corta).
 */
export function titoloCheSta(...forme: string[]): string | { absolute: string } {
  const scelta =
    forme.find((f) => f.length + CODA_SITO.length <= TITOLO_MAX) ?? forme.find((f) => f.length <= TITOLO_MAX) ?? forme[forme.length - 1];
  return titoloPagina(scelta);
}
