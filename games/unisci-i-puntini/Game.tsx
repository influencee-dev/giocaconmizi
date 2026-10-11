"use client";

import { Puntini, type FiguraPuntini } from "@/games/_engine/Puntini";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Unisci i puntini (5–7 anni).
 * La sequenza numerica 1–20 diventa un disegno. Ogni numero toccato viene
 * detto a voce: si conta ad alta voce mentre si disegna.
 */

const FIGURE: FiguraPuntini[] = [
  {
    nome: "una stella",
    chiusa: true,
    punti: [
      [50, 8], [59, 36], [90, 36], [65, 55], [75, 88],
      [50, 68], [25, 88], [35, 55], [10, 36], [41, 36],
    ],
  },
  {
    nome: "una casa",
    chiusa: true,
    punti: [
      [20, 90], [20, 45], [50, 15], [80, 45], [80, 90],
      [60, 90], [60, 65], [40, 65], [40, 90],
    ],
  },
  {
    nome: "un pesce",
    chiusa: true,
    punti: [
      [20, 50], [35, 32], [58, 28], [74, 42], [88, 26],
      [88, 74], [72, 60], [58, 72], [35, 68],
    ],
  },
  {
    // Ridisegnata: la vecchia aveva l'albero sovrapposto allo scafo
    // (punti 2 e 9 a distanza 4: etichette accavallate e tocchi ambigui).
    // Regola: mai due punti a meno di 14 unità (il bersaglio ha raggio 9).
    nome: "una barca",
    chiusa: true,
    punti: [
      [50, 6], [66, 26], [80, 44], [90, 56], [74, 84],
      [50, 90], [26, 84], [10, 56], [20, 44], [34, 26],
    ],
  },
  {
    nome: "un razzo",
    chiusa: true,
    punti: [
      [50, 8], [64, 30], [64, 62], [82, 80], [64, 78],
      [58, 92], [42, 92], [36, 78], [18, 80], [36, 62],
      [36, 30],
    ],
  },
];

export default function Game(props: GameProps) {
  return <Puntini titolo="Unisci i puntini" figure={FIGURE} {...props} />;
}
