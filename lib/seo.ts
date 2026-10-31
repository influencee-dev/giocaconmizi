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
