"use client";

import { PixelArt, type Quadro } from "@/games/_engine/PixelArt";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Pixel art di Natale (4–9 anni), 24/11/2026.
 * Lo stesso gioco della pixel art (motore games/_engine/PixelArt.tsx) con sei
 * disegni di Natale, senza celle bianche: nasce per chi cerca «pixel art di Natale» (5.400 ricerche
 * al mese, Ubersuggest 22/11/2026). Fino ai sei anni si colora riga per riga,
 * dai sette con le coordinate.
 */

const QUADRI: Quadro[] = [
  {
    nome: "un albero di Natale",
    legenda: { v: "verde", g: "giallo", r: "rosso", m: "marrone" },
    righe: [
      "...gg...",
      "...vv...",
      "..vrvv..",
      ".vvvvgv.",
      ".vgvvvv.",
      "vvvvvrvv",
      "...mm...",
      "...mm...",
    ],
  },
  {
    nome: "un pacco regalo",
    legenda: { r: "rosso", a: "azzurro" },
    righe: [
      ".rr..rr.",
      "...rr...",
      "rrrrrrrr",
      "aaarraaa",
      "aaarraaa",
      "rrrrrrrr",
      "aaarraaa",
      "aaarraaa",
    ],
  },
  {
    nome: "una campanella",
    legenda: { r: "rosso", g: "giallo", n: "nero" },
    righe: [
      "..rrrr..",
      "...gg...",
      "..gggg..",
      "..gggg..",
      ".gggggg.",
      "gggggggg",
      "...nn...",
    ],
  },
  {
    nome: "una pallina di Natale",
    legenda: { g: "giallo", r: "rosso" },
    righe: [
      "...gg...",
      "..rrrr..",
      ".rrrrrr.",
      "rrrrrrrr",
      "gggggggg",
      "rrrrrrrr",
      ".rrrrrr.",
      "..rrrr..",
    ],
  },
  {
    nome: "un omino di pan di zenzero",
    legenda: { m: "marrone", n: "nero", r: "rosso" },
    righe: [
      "..mmmm..",
      ".mnmmnm.",
      ".mmrrmm.",
      "..mmmm..",
      "mmmmmmmm",
      "..mrmm..",
      "..mmmm..",
      "..mrmm..",
      ".mm..mm.",
      ".mm..mm.",
    ],
  },
  {
    // Senza bianco: le celle bianche non si distinguono da quelle vuote, quindi
    // pancia e occhi di Mizi restano celle vuote («.»).
    nome: "Mizi con il cappello di Natale",
    legenda: { r: "rosso", g: "giallo", n: "nero", a: "arancione" },
    righe: [
      "...rrr.g",
      "..rrrrr.",
      ".nnnnnn.",
      ".n.nn.n.",
      "..naan..",
      ".n....n.",
      ".n....n.",
      "..a..a..",
    ],
  },
];

export default function Game(props: GameProps) {
  return <PixelArt titolo="Pixel art di Natale" quadri={QUADRI} {...props} />;
}
