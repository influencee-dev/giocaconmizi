"use client";

import { GrigliaCoding, type Livello } from "@/games/_engine/GrigliaCoding";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Il labirinto a blocchi (6–10 anni).
 * Qui i comandi sono relativi a Mizi: avanti, gira a destra, gira a sinistra.
 * È il salto concettuale vero — bisogna mettersi nei panni del personaggio.
 * Dal quinto livello entra il "ripeti", che raddoppia il programma: il numero
 * massimo di blocchi costringe a trovarlo.
 */

const LIVELLI: Livello[] = [
  { lato: 4, partenza: [0, 3], arrivo: [3, 3], direzione: 1, massimo: 4 },
  { lato: 4, partenza: [0, 3], arrivo: [3, 0], direzione: 1, massimo: 8 },
  { lato: 5, partenza: [0, 4], arrivo: [4, 0], direzione: 1, muri: ["2,3", "2,2"], massimo: 12 },
  { lato: 5, partenza: [2, 4], arrivo: [2, 0], direzione: 0, muri: ["1,2", "3,2"], massimo: 8 },
  // "avanti 4, gira a destra" ripetuto due volte disegna una L: è il livello
  // in cui si capisce a cosa serve il ripeti.
  { lato: 5, partenza: [0, 0], arrivo: [4, 4], direzione: 1, massimo: 5, ripeti: true },
  // Una scala: due passi avanti, giro, due passi, giro indietro. Ripetuta, sale.
  { lato: 6, partenza: [0, 0], arrivo: [4, 4], direzione: 1, muri: ["5,0", "5,1", "0,5", "1,5"], massimo: 6, ripeti: true },
];

export default function Game(props: GameProps) {
  return <GrigliaCoding titolo="Il labirinto a blocchi" modalita="blocchi" livelli={LIVELLI} {...props} />;
}
