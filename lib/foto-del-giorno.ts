import { existsSync } from "node:fs";
import { join } from "node:path";
import { GUIDE } from "./guide";
import { FOTO, LARGHEZZE, LARGHEZZE_GUIDA, fotoSito, type CodiceFoto } from "./foto";
import { fotoArrivata, leggiCoda } from "./foto-in-arrivo";
import { BLOCCO_FOTO, BLOCCO_MIZI, REGOLE_PERSONE } from "../scripts/blocchi-prompt";

/**
 * Le foto da fare per un giorno e il loro prompt, uguali per i due usi:
 *  - scripts/foto-genera.ts — le genera la routine serale con l'API di OpenAI;
 *  - scripts/prompt-del-giorno.ts — il documento su Drive (riserva manuale).
 * Prima TUTTE le prenotazioni per quel giorno (o rimaste indietro), poi fino a
 * `quante` foto che mancano al sito (guide, poi riquadri del sito).
 */

export interface FotoDaFare {
  nomeFile: string;
  titolo: string;
  scena: string;
  rapporto: number;
}

const FORMATI: [number, string][] = [
  [16 / 9, "16:9 orizzontale: genera a 1536×1024 e ritaglia a 16:9 centrando i soggetti"],
  [2, "2:1 orizzontale: genera a 1536×1024 e ritaglia a 2:1 centrando i soggetti"],
  [3 / 2, "3:2 orizzontale: genera a 1536×1024"],
  [4 / 3, "4:3 orizzontale: genera a 1536×1024 e ritaglia a 4:3 centrando i soggetti"],
  [3 / 4, "3:4 verticale: genera a 1024×1536 e ritaglia a 3:4 centrando i soggetti"],
  [1, "quadrato 1:1: genera a 1024×1024"],
];
export const formatoTesto = (r: number) => FORMATI.find(([x]) => Math.abs(x - r) < 0.01)?.[1] ?? FORMATI[0][1];

/** La misura da chiedere all'API (poi foto-arrivate ritaglia al rapporto giusto). */
export const misuraApi = (r: number) => (r > 1.05 ? "1536x1024" : r < 0.95 ? "1024x1536" : "1024x1024");

const guidaFatta = (slug: string) =>
  LARGHEZZE_GUIDA.some((l) => existsSync(join(process.cwd(), "public", "immagini", `guida-${slug}-${l}.webp`)));

export function fotoDelGiorno(data: string, quante: number) {
  const prenotate: FotoDaFare[] = leggiCoda()
    .prenotazioni.filter(
      (p) => p.perIl <= data && !fotoArrivata(p.nomeFile, p.nomeFile.startsWith("guida-") ? LARGHEZZE_GUIDA : LARGHEZZE),
    )
    .map((p) => ({ nomeFile: p.nomeFile, titolo: p.titolo, scena: p.scena, rapporto: p.rapporto }));
  const giaPrenotate = new Set(prenotate.map((p) => p.nomeFile));

  const mancanti: FotoDaFare[] = [
    ...GUIDE.filter((g) => !guidaFatta(g.slug) && !giaPrenotate.has(`guida-${g.slug}`)).map((g) => ({
      nomeFile: `guida-${g.slug}`,
      titolo: `Foto della guida «${g.titolo}»`,
      scena: g.foto.scena,
      rapporto: 16 / 9,
    })),
    ...(Object.keys(FOTO) as CodiceFoto[])
      .filter((c) => !fotoSito(c))
      .map((c) => ({ nomeFile: FOTO[c].file, titolo: `Foto del sito ${c}`, scena: `${FOTO[c].alt}.`, rapporto: FOTO[c].rapporto })),
  ];
  return { prenotate, mancanti, oggi: [...prenotate, ...mancanti.slice(0, quante)] };
}

/** Il prompt della foto, senza la consegna (che cambia tra API e documento). */
export function promptFoto(f: FotoDaFare): string {
  return [
    "Sei il fotografo di Giocamizi, un sito gratuito di giochi educativi per bambini. Crea una sola fotografia realistica con questa scena. Usa l'immagine allegata come riferimento esatto per Mizi.",
    `MIZI: ${BLOCCO_MIZI}`,
    `STILE: ${BLOCCO_FOTO}`,
    `PERSONE: ${REGOLE_PERSONE.join(" ")}`,
    `SCENA: ${f.scena}`,
    `FORMATO: ${formatoTesto(f.rapporto)}. Lascia un po' d'aria sopra le teste.`,
    "CONTROLLO: Mizi ha il caschetto castano, la bandana rosa a pois, il cuore sulla pancia, becco e zampe arancioni ed è chiaramente un pupazzo di stoffa. Nessuna scritta né numero leggibile. Mani e dita corrette.",
  ].join("\n\n");
}

/** Titolo senza marchi né nomi di giochi (i generatori di immagini li rifiutano). */
export const titoloNeutro = (f: FotoDaFare) =>
  f.nomeFile.startsWith("guida-")
    ? f.titolo.startsWith("Foto dell'articolo")
      ? "Foto di testata di un articolo per genitori"
      : "Foto di testata di una guida per genitori"
    : "Foto per una pagina del sito";
