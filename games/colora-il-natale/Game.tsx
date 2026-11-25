"use client";

import { Colora } from "@/games/colora-con-mizi/Game";
import type { GameProps } from "@/games/_engine/tipi";
import { DISEGNI_NATALE } from "./disegni";

/**
 * Colora il Natale (3–8 anni), 25/11/2026: lo stesso gioco di «Colora con Mizi»
 * (secchiello, pennello, gomma, colori detti a voce, Salva in PNG) con quattro
 * disegni di Natale originali. Per chi cerca «disegni da colorare di Natale».
 */
export default function Game(props: GameProps) {
  return <Colora {...props} disegni={DISEGNI_NATALE} titolo="Colora il Natale" />;
}
