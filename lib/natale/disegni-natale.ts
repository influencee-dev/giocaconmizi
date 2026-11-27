/**
 * I disegni di Natale da colorare e stampare (/natale/disegni-da-colorare),
 * 26/11/2026. Disegni originali fatti con ChatGPT sul prompt in «0 Richieste»
 * («2026-11-24 · ChatGPT · Disegni di Natale da colorare»), guardati uno per
 * uno: contorni neri su bianco, niente scritte, nessun personaggio di marchi.
 * I file in public/disegni-natale/ li crea `node scripts/disegni-natale.mjs
 * <cartella con 01.png … 10.png>`: anteprima .webp, PDF A4 per disegno e
 * tutti.pdf con i dieci.
 */

export const PERCORSO_DISEGNI_NATALE = "/natale/disegni-da-colorare";
export const CARTELLA_DISEGNI_NATALE = "/disegni-natale";

export interface DisegnoNatale {
  slug: string;
  titolo: string;
  /** Testo alternativo dell'anteprima: cosa c'è nel disegno. */
  alt: string;
  /** Per chi è più adatto, a occhio: quanti dettagli piccoli ha. */
  eta: string;
}

export const DISEGNI_NATALE: DisegnoNatale[] = [
  { slug: "babbo-natale", titolo: "Babbo Natale", alt: "Babbo Natale sorridente che saluta, con il sacco dei regali sulla spalla, da colorare", eta: "dai 4 anni" },
  { slug: "albero-di-natale", titolo: "L'albero di Natale", alt: "Albero di Natale con la stella, cinque palline grandi e tre pacchi regalo, da colorare", eta: "dai 3 anni" },
  { slug: "renna", titolo: "La renna", alt: "Renna con la sciarpa a righe e un campanellino al collo, da colorare", eta: "dai 4 anni" },
  { slug: "pupazzo-di-neve", titolo: "Il pupazzo di neve", alt: "Pupazzo di neve con cilindro, sciarpa, scopa e tre bottoni, da colorare", eta: "dai 3 anni" },
  { slug: "casetta-di-pan-di-zenzero", titolo: "La casetta di pan di zenzero", alt: "Casetta di pan di zenzero con lecca-lecca, bastoncini di zucchero e un omino di pan di zenzero, da colorare", eta: "dai 6 anni" },
  { slug: "elfo", titolo: "L'elfo che incarta i regali", alt: "Elfo con il cappello che incarta un pacco con le stelle, con forbici e nastro adesivo, da colorare", eta: "dai 5 anni" },
  { slug: "slitta", titolo: "La slitta dei regali", alt: "Slitta piena di pacchi regalo con due stelle e un rametto di agrifoglio, da colorare", eta: "dai 3 anni" },
  { slug: "angioletto", titolo: "L'angioletto", alt: "Angioletto con l'aureola e le ali che tiene una stella, da colorare", eta: "dai 4 anni" },
  { slug: "ghirlanda", titolo: "La ghirlanda", alt: "Ghirlanda di Natale con fiocco, campanelle, palline e agrifoglio, da colorare", eta: "dai 5 anni" },
  { slug: "caminetto", titolo: "Il caminetto", alt: "Caminetto acceso con tre calze appese, candele e un gatto che dorme sul tappeto, da colorare", eta: "dai 5 anni" },
];
