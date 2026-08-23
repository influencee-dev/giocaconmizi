"use client";

import { GrigliaCoding, type Livello } from "@/games/_engine/GrigliaCoding";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Guida Mizi (3–6 anni).
 * Il primo coding: si mettono le frecce in fila e si preme Via. Le direzioni
 * sono assolute (su, giù, destra, sinistra) perché a tre anni il punto di
 * vista del personaggio è ancora troppo difficile — quello arriva col labirinto.
 */

const LIVELLI: Livello[] = [
  { lato: 3, partenza: [0, 1], arrivo: [2, 1], massimo: 4 },
  { lato: 3, partenza: [0, 2], arrivo: [2, 0], massimo: 5 },
  { lato: 4, partenza: [0, 0], arrivo: [3, 3], massimo: 8 },
  { lato: 4, partenza: [0, 3], arrivo: [3, 0], muri: ["1,1", "2,2"], massimo: 8 },
  { lato: 5, partenza: [0, 2], arrivo: [4, 2], muri: ["2,1", "2,2", "2,3"], massimo: 10 },
  { lato: 5, partenza: [0, 0], arrivo: [4, 4], muri: ["1,1", "2,2", "3,3", "1,3"], massimo: 12 },
];

export default function Game(props: GameProps) {
  return <GrigliaCoding titolo="Guida Mizi" modalita="frecce" livelli={LIVELLI} {...props} />;
}
