import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Le illustrazioni di Mizi prodotte con l'AI (docs: prompt consegnati a
 * Giorgia). Vivono in public/mizi/: quando un file arriva, le sezioni che lo
 * aspettano lo mostrano da sole; finché manca resta il disegno SVG di
 * ripiego. Solo per componenti server: usa il filesystem.
 */

export type NomeImmagine =
  | "mizi-logo"
  | "mizi-saluto"
  | "mizi-lettura"
  | "mizi-coding"
  | "mizi-festa"
  | "mizi-compleanno"
  | "mizi-maestra"
  | "mizi-abbraccio"
  | "mizi-pensa"
  | "mizi-copertina"
  | "mizi-originale";

/** Percorso pubblico dell'immagine, o null se il file non è ancora arrivato. */
export function immagineMizi(nome: NomeImmagine): string | null {
  const file = `${nome}.png`;
  return existsSync(join(process.cwd(), "public", "mizi", file)) ? `/mizi/${file}` : null;
}
