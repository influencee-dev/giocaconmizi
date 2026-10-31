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

export type CodiceFoto =
  | "H-01" | "H-02" | "H-03" | "H-04" | "H-05" | "H-06" | "H-07" | "H-08"
  | "G-01" | "F-01" | "F-02" | "P-01" | "S-01" | "S-02" | "S-03"
  | "I-02" | "I-03" | "I-04" | "I-05";

export interface SchedaFoto {
  /** Nome file base, senza larghezza né estensione (parole chiave SEO). */
  file: string;
  /** Rapporto larghezza/altezza del ritaglio consegnato. */
  rapporto: number;
  alt: string;
}

export const FOTO: Record<CodiceFoto, SchedaFoto> = {
  "H-01": { file: "bambina-gioca-giochi-educativi-con-mizi", rapporto: 16 / 9, alt: "Bambina di 6 anni gioca a un gioco educativo sul tablet con il papà e Mizi, il pupazzo pinguina" },
  "H-02": { file: "bambino-gioca-numeri-in-cucina", rapporto: 2, alt: "Bambino di 4 anni gioca con i numeri al tavolo della cucina, accanto a Mizi" },
  "H-03": { file: "festa-compleanno-bambini-torta", rapporto: 2, alt: "Festa di compleanno per bambini con torta, cappellini colorati e Mizi sul tavolo" },
  "H-04": { file: "mamma-e-figlia-leggono-guida-genitori", rapporto: 2, alt: "Mamma e figlia di 7 anni fanno i compiti insieme al tavolo, con Mizi vicino ai quaderni" },
  "H-05": { file: "bambina-sorride-tra-i-libri-con-mizi", rapporto: 3 / 4, alt: "Bambina di 8 anni sorride appoggiata a una pila di libri colorati, con Mizi accanto" },
  "H-06": { file: "partita-gioco-da-tavolo-in-famiglia", rapporto: 3 / 2, alt: "Famiglia gioca a un gioco da tavolo sul tappeto del soggiorno, con Mizi che guarda il dado" },
  "H-07": { file: "festa-compleanno-bambini-in-giardino", rapporto: 4 / 3, alt: "Bambini festeggiano un compleanno in giardino con palloncini e Mizi sulla panchina" },
  "H-08": { file: "bambini-ridono-con-libro-in-testa", rapporto: 16 / 9, alt: "Due bambini ridono con un libro aperto sulla testa in una biblioteca di casa, con Mizi" },
  "G-01": { file: "giochi-educativi-gratis-bambini-tablet", rapporto: 4 / 3, alt: "Due fratelli giocano a un gioco educativo gratis sul tablet, seduti sul divano con Mizi" },
  "F-01": { file: "festa-di-compleanno-per-bambini-ludoteca", rapporto: 4 / 3, alt: "Bambini corrono in uno spazio giochi colorato durante una festa di compleanno, con Mizi" },
  "F-02": { file: "inviti-compleanno-bambini-da-personalizzare", rapporto: 4 / 3, alt: "Mani di una bambina colorano un invito di compleanno stampato, con Mizi sul tavolo" },
  "P-01": { file: "guide-per-genitori-mamma-legge", rapporto: 4 / 3, alt: "Mamma legge una guida per genitori sul telefono mentre la figlia disegna accanto a Mizi" },
  "S-01": { file: "storie-della-buonanotte-da-leggere", rapporto: 4 / 3, alt: "Papà legge una storia della buonanotte a un bambino nel letto, con Mizi sul cuscino" },
  "S-02": { file: "coding-per-bambini-con-i-blocchi", rapporto: 4 / 3, alt: "Bambina di 9 anni prova il coding con i blocchi sul computer, con Mizi accanto alla tastiera" },
  "S-03": { file: "compiti-delle-vacanze-in-terrazzo", rapporto: 4 / 3, alt: "Bambino fa i compiti delle vacanze su un terrazzo d'estate, con Mizi e un bicchiere di limonata" },
  "I-02": { file: "metodo-imparare-giocando-adulto-vicino", rapporto: 4 / 3, alt: "Nonna e nipote giocano insieme a un gioco educativo sul tablet, con Mizi tra loro" },
  "I-03": { file: "giochi-gratis-senza-pubblicita-famiglia", rapporto: 4 / 3, alt: "Mamma e figlio ridono sul divano dopo un gioco senza pubblicità, con Mizi in braccio" },
  "I-04": { file: "giochi-educativi-in-classe-lim", rapporto: 4 / 3, alt: "Maestra e bambini di prima elementare giocano a un gioco educativo sulla LIM, con Mizi sulla cattedra" },
  "I-05": { file: "rete-delle-mamme-incontro-parco", rapporto: 4 / 3, alt: "Gruppo di mamme con passeggini e bambini si incontra al parco, con Mizi su una panchina" },
};

const LARGHEZZE = [1440, 960, 800, 640, 480];

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
