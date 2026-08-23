"use client";

import { PixelArt, type Quadro } from "@/games/_engine/PixelArt";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Pixel art (4–9 anni).
 * Colorare seguendo un codice: dalla legenda per righe alle coordinate tipo B3.
 * È il primo momento in cui "una posizione si può scrivere", che è la stessa
 * idea che c'è dietro un foglio di calcolo o un array.
 */

const QUADRI: Quadro[] = [
  {
    nome: "un cuore",
    legenda: { r: "rosso" },
    righe: [
      ".rr..rr.",
      "rrrrrrrr",
      "rrrrrrrr",
      ".rrrrrr.",
      "..rrrr..",
      "...rr...",
    ],
  },
  {
    nome: "una stella",
    legenda: { g: "giallo" },
    righe: [
      "...gg...",
      "...gg...",
      "gggggggg",
      ".gggggg.",
      "..gggg..",
      ".gg..gg.",
    ],
  },
  {
    nome: "un pesce",
    legenda: { a: "arancione", n: "nero" },
    righe: [
      "........",
      "..aaa..a",
      ".aaaaaaa",
      "anaaaaaa",
      ".aaaaaaa",
      "..aaa..a",
    ],
  },
  {
    nome: "Mizi",
    legenda: { n: "nero", b: "bianco", a: "arancione" },
    righe: [
      "..nnnn..",
      ".nnnnnn.",
      ".nbnnbn.",
      "..naan..",
      ".nbbbbn.",
      ".nbbbbn.",
      "..n..n..",
    ],
  },
  {
    nome: "un albero",
    legenda: { v: "verde", m: "marrone" },
    righe: [
      "...vv...",
      "..vvvv..",
      ".vvvvvv.",
      "vvvvvvvv",
      "...mm...",
      "...mm...",
    ],
  },
];

export default function Game(props: GameProps) {
  return <PixelArt titolo="Pixel art" quadri={QUADRI} {...props} />;
}
