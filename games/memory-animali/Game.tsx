"use client";

import { Memory } from "@/games/_engine/Memory";
import type { NomeFigura } from "@/games/_engine/arte";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Memory degli animali (3–5 anni).
 * Il nome dell'animale viene detto a voce a ogni coppia trovata: si allena la
 * memoria visiva e intanto si arricchisce il vocabolario.
 */

const ANIMALI: { id: NomeFigura; nome: string }[] = [
  { id: "gatto", nome: "Il gatto" },
  { id: "cane", nome: "Il cane" },
  { id: "mucca", nome: "La mucca" },
  { id: "pecora", nome: "La pecora" },
  { id: "papera", nome: "La papera" },
  { id: "rana", nome: "La rana" },
  { id: "ape", nome: "L'ape" },
  { id: "orso", nome: "L'orso" },
  { id: "pesce", nome: "Il pesce" },
  { id: "gallo", nome: "Il gallo" },
];

export default function Game(props: GameProps) {
  return <Memory titolo="Memory degli animali" figure={ANIMALI} {...props} />;
}
