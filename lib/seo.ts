/**
 * Configurazione SEO condivisa — Gioca con Mizi.
 * Il dominio di produzione è giocaconmizi.com (Vercel); giocaconmizi.it fa redirect.
 */

export const site = {
  nome: "Gioca con Mizi",
  dominio: "https://giocaconmizi.com",
  titoloDefault:
    "Gioca con Mizi — giochi educativi per bambini dai 3 ai 12 anni",
  descrizioneDefault:
    "Giochi educativi, storie da leggere, coding e biglietti di compleanno per bambini dai 3 ai 12 anni. Gratis, senza pubblicità e senza timer.",
  lingua: "it-IT",
  autore: "Gioca con Mizi",
} as const;

/** URL assoluto per canonical, sitemap e Open Graph. */
export function url(percorso = "/"): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? site.dominio;
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
