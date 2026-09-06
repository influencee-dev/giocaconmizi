"use client";

import { GrigliaCoding, type Livello } from "@/games/_engine/GrigliaCoding";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Missione sul ghiaccio (8–11 anni).
 * Il seguito del labirinto a blocchi: griglie più grandi, lastre di ghiaccio
 * (muri) che obbligano a deviare, e tre livelli finali dove il "ripeti"
 * non è un aiuto ma l'unica strada.
 *
 * Ogni livello è stato verificato con una ricerca esaustiva
 * (scratchpad/verifica-missione.mjs): risolvibile entro `massimo` comandi
 * senza urtare nulla, e nei livelli `ripeti` NESSUN programma a esecuzione
 * singola arriva al pesce.
 */

const LIVELLI: Livello[] = [
  // Una L lunga per scaldarsi: 8 comandi su 9.
  { lato: 5, partenza: [0, 4], arrivo: [4, 1], direzione: 1, massimo: 9 },
  // Le lastre chiudono la discesa diretta: si passa dall'alto.
  { lato: 5, partenza: [0, 0], arrivo: [4, 4], direzione: 1, muri: ["0,2", "1,2", "3,4", "3,3"], massimo: 12 },
  // Slalom vero: si parte guardando in su e si devia subito.
  { lato: 6, partenza: [0, 5], arrivo: [5, 0], direzione: 0, muri: ["0,2", "1,2", "3,0", "3,1", "3,3", "2,5"], massimo: 15 },
  // Da qui il ripeti è obbligatorio: 5 comandi eseguiti due volte.
  { lato: 6, partenza: [0, 0], arrivo: [4, 2], direzione: 1, massimo: 5, ripeti: true },
  { lato: 6, partenza: [0, 0], arrivo: [2, 4], direzione: 1, massimo: 5, ripeti: true },
  // Finale: scala di due, con le lastre a chiudere le scorciatoie.
  { lato: 6, partenza: [0, 5], arrivo: [4, 1], direzione: 1, muri: ["3,5", "5,3"], massimo: 6, ripeti: true },
];

export default function Game(props: GameProps) {
  return <GrigliaCoding titolo="Missione sul ghiaccio" modalita="blocchi" livelli={LIVELLI} {...props} />;
}
