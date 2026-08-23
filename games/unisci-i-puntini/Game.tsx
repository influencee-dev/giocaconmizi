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
      [88, 74], [74, 58], [58, 72], [35, 68],
    ],
  },
  {
    nome: "una barca",
    chiusa: true,
    punti: [
      [50, 10], [50, 55], [82, 55], [88, 72], [72, 88],
      [28, 88], [12, 72], [18, 55], [46, 55], [46, 18],
      [76, 40], [50, 40],
    ],
  },
  {
    nome: "un razzo",
    chiusa: true,
    punti: [
      [50, 8], [64, 30], [64, 62], [80, 78], [64, 76],
      [58, 92], [42, 92], [36, 76], [20, 78], [36, 62],
      [36, 30],
    ],
  },
];

export default function Game(props: GameProps) {
  return <Puntini titolo="Unisci i puntini" figure={FIGURE} {...props} />;
}
