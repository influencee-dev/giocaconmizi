"use client";

import { CreaGioco } from "@/games/_engine/CreaGioco";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Crea il tuo gioco (10–12 anni).
 * L'ultimo gradino della sezione coding: eventi, variabili e un progetto che
 * si condivide con un link.
 */

export default function Game(props: GameProps) {
  return <CreaGioco titolo="Crea il tuo gioco" {...props} />;
}
