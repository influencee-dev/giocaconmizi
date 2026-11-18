import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Le foto del sito (template vetrina). Ogni riquadro ha un codice, lo stesso
 * dei prompt per ChatGPT su Drive ("Giocamizi · Prompt immagini"): quando
 * Giorgia consegna lo ZIP, i WebP vanno in public/immagini/ col nome
 * `<file>-<larghezza>.webp` e il riquadro li mostra da solo. Finché il file
 * manca resta l'illustrazione di ripiego: niente immagini rotte.
 * Solo per componenti server: usa il filesystem.
 */

import { FOTO, LARGHEZZE, type CodiceFoto } from "./foto-dati";

export { FOTO, LARGHEZZE, type CodiceFoto, type SchedaFoto } from "./foto-dati";

/** La foto consegnata (la variante più larga), o null se non è ancora arrivata. */
export function fotoSito(codice: CodiceFoto): { src: string; larghezza: number; altezza: number; alt: string } | null {
  const scheda = FOTO[codice];
  for (const l of LARGHEZZE) {
    const nome = `${scheda.file}-${l}.webp`;
    if (existsSync(join(process.cwd(), "public", "immagini", nome))) {
      return { src: `/immagini/${nome}`, larghezza: l, altezza: Math.round(l / scheda.rapporto), alt: scheda.alt };
    }
  }
  return null;
}

/** Larghezze consegnate per le foto delle guide (16:9). */
export const LARGHEZZE_GUIDA = [1440, 960, 640];

/**
 * La foto di testata di una guida (public/immagini/guida-<slug>-<larghezza>.webp),
 * o null se non è ancora arrivata. Il prompt sta nel documento «00 PROMPT GUIDE».
 */
export function fotoGuida(slug: string, alt: string): { src: string; larghezza: number; altezza: number; alt: string } | null {
  for (const l of LARGHEZZE_GUIDA) {
    const nome = `guida-${slug}-${l}.webp`;
    if (existsSync(join(process.cwd(), "public", "immagini", nome))) {
      return { src: `/immagini/${nome}`, larghezza: l, altezza: Math.round((l * 9) / 16), alt };
    }
  }
  return null;
}

/**
 * Quali foto vere stanno in quale pagina, per la sitemap delle immagini
 * (Google Immagini). Le foto del piè di pagina, uguali ovunque, restano
 * fuori. La batteria SEO controlla che ogni foto in sitemap compaia davvero
 * nella sua pagina: se si sposta un riquadro, va aggiornata questa mappa.
 */
const FOTO_PAGINE: Record<string, CodiceFoto[]> = {
  "/": ["H-01", "H-02", "H-03", "H-04", "H-05", "H-06", "H-07", "H-08"],
  "/chi-siamo": ["H-08"],
  "/giochi": ["G-01"],
  "/feste": ["F-01"],
  "/biglietti": ["F-02"],
  "/guide": ["P-01"],
  "/storie": ["S-01"],
  "/coding": ["S-02"],
  "/metodo": ["I-02"],
  "/perche-lo-facciamo": ["I-03"],
  "/per-insegnanti": ["I-04"],
  "/per-le-mamme": ["I-05"],
};

/** Le foto di Chi siamo, fuori dal registro dei riquadri. */
const FOTO_FISSE: Record<string, string[]> = {
  "/chi-siamo": [
    "/immagini/giorgia-e-domiziana-giocamizi.webp",
    "/immagini/giorgia-palazzo-giocamizi.webp",
    "/immagini/domiziana-giocamizi.webp",
  ],
};

/** I percorsi delle foto consegnate di una pagina (la variante più larga). */
export function fotoDellaPagina(percorso: string): string[] {
  const riquadri = (FOTO_PAGINE[percorso] ?? []).map((c) => fotoSito(c)?.src).filter((s): s is string => !!s);
  const fisse = (FOTO_FISSE[percorso] ?? []).filter((s) => existsSync(join(process.cwd(), "public", s)));
  return [...new Set([...riquadri, ...fisse])];
}
