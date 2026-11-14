/**
 * Le anteprime dei siti delle risorse educative ONLINE (14/11/2026, decisione
 * di Giorgia): uno screenshot ritagliato della homepage, in
 * public/immagini/risorse/<slug>-<960|640>.webp.
 *
 * Regole (vedi CLAUDE.md):
 *  - solo per blog, portali e progetti online, MAI per scuole, nidi e
 *    cooperative (sui loro siti ci sono spesso foto di bambini veri);
 *  - ogni scatto si guarda prima di pubblicarlo: niente volti di bambini,
 *    niente personaggi protetti, niente banner dei cookie (si ritaglia, non
 *    si clicca «Accetta» a nome di nessuno);
 *  - se la realtà reclama la scheda e carica le sue immagini, vincono quelle;
 *    se chiede di togliere lo screenshot, si toglie da qui e si cancella il file.
 */
export const ANTEPRIME_SITI = new Set([
  "bimbisani-e-belli",
  "brick-education",
  "eduinaf",
  "fantavolando",
  "maestra-ilaria",
  "maestro-roberto",
  "mamme-venete",
  "mela-music",
  "mimom-mag",
  "punto-e-virgola-mamma",
  "tempo-di-fiabe",
  "viaggiapiccoli",
]);

/** Il giorno dello scatto, mostrato sotto l'anteprima. */
export const DATA_ANTEPRIME = "14 novembre 2026";

export const anteprimaSito = (slug: string) =>
  ANTEPRIME_SITI.has(slug)
    ? { src: `/immagini/risorse/${slug}-960.webp`, srcSet: `/immagini/risorse/${slug}-640.webp 640w, /immagini/risorse/${slug}-960.webp 960w` }
    : null;
