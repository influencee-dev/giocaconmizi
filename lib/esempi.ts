import fs from "node:fs";
import path from "node:path";

/**
 * Galleria esempi dei biglietti (piano §14.5).
 *
 * Gli esempi sono design veri fatti in Canva, usati come ispirazione: qui la
 * libreria Canva si può usare, perché non vengono ridistribuiti come template
 * ma solo mostrati, con la CTA "Crealo tu con il nostro sfondo {tema}".
 *
 * L'immagine di ogni esempio vive in public/esempi/{slug}.png e arriva via
 * Drive (vedi docs/asset-da-generare.md §5). Finché il file non c'è, la
 * pagina dettaglio non viene generata e l'indice mostra la voce come
 * "in arrivo": si può committare la scheda prima dell'immagine.
 */

export interface Esempio {
  slug: string;
  titolo: string;
  descrizione: string;
  /** Età indicativa del festeggiato, per i tag e i link interni. */
  eta?: number;
  /** Tema del nostro tool da proporre nella CTA (slug di cards/registry). */
  tema: string;
  tipo: "invito" | "auguri" | "ringraziamento";
}

export const esempi: Esempio[] = [
  {
    slug: "promo-di-compleanno",
    titolo: "Festa di compleanno con palloncini",
    descrizione:
      "Un invito pieno di colore, con i palloncini protagonisti e il testo ben leggibile al centro: la struttura che funziona per quasi ogni festa.",
    tema: "palloncini",
    tipo: "invito",
  },
  {
    slug: "un-anno-di",
    titolo: "Il primo compleanno",
    descrizione:
      "Per il primo anno: toni morbidi, luna e stelle, poche parole. Il biglietto che si conserva nell'album.",
    eta: 1,
    tema: "stelle-luna",
    tipo: "invito",
  },
];

const CARTELLA = path.join(process.cwd(), "public", "esempi");

/** Vero se l'immagine dell'esempio è già arrivata nel repo. */
export function immagineDisponibile(slug: string): boolean {
  return fs.existsSync(path.join(CARTELLA, `${slug}.png`));
}

/** Gli esempi completi di immagine: gli unici pubblicati come pagina propria. */
export function esempiPubblicati(): Esempio[] {
  return esempi.filter((e) => immagineDisponibile(e.slug));
}

export const esempioPerSlug = (slug: string): Esempio | undefined =>
  esempi.find((e) => e.slug === slug);
