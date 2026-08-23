"use client";

import { Tartaruga, type Sfida } from "@/games/_engine/Tartaruga";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Disegna con la tartaruga (8–12 anni).
 * Logo, in italiano. Le sfide sono ordinate in modo che ognuna aggiunga
 * una sola idea nuova: il ciclo, poi l'angolo che cambia, poi il ciclo dentro
 * il ciclo. La figura obiettivo è sempre visibile accanto alla propria.
 */

const SFIDE: Sfida[] = [
  {
    nome: "un quadrato",
    suggerimento: "quattro lati uguali, quattro angoli da 90°",
    soluzione: [{ tipo: "ripeti", volte: 4, corpo: [{ tipo: "avanti", valore: 60 }, { tipo: "gira", valore: 90 }] }],
  },
  {
    nome: "un triangolo",
    suggerimento: "tre lati: l'angolo non è 60°, è quello che gira la tartaruga",
    soluzione: [{ tipo: "ripeti", volte: 3, corpo: [{ tipo: "avanti", valore: 60 }, { tipo: "gira", valore: 120 }] }],
  },
  {
    nome: "una scala",
    suggerimento: "avanti, gira, avanti, gira indietro: e ripeti",
    soluzione: [
      {
        tipo: "ripeti",
        volte: 4,
        corpo: [
          { tipo: "avanti", valore: 20 },
          { tipo: "gira", valore: 90 },
          { tipo: "avanti", valore: 20 },
          { tipo: "gira", valore: -90 },
        ],
      },
    ],
  },
  {
    nome: "un esagono",
    suggerimento: "sei lati: 360 diviso 6",
    soluzione: [{ tipo: "ripeti", volte: 6, corpo: [{ tipo: "avanti", valore: 40 }, { tipo: "gira", valore: 60 }] }],
  },
  {
    nome: "una stella",
    suggerimento: "cinque punte: la tartaruga gira più di mezzo giro ogni volta",
    soluzione: [{ tipo: "ripeti", volte: 5, corpo: [{ tipo: "avanti", valore: 80 }, { tipo: "gira", valore: 144 }] }],
  },
];

export default function Game(props: GameProps) {
  return <Tartaruga titolo="Disegna con la tartaruga" sfide={SFIDE} {...props} />;
}
