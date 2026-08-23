"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { alcuni, mescola, uno } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Tocca la lettera (4–6 anni).
 * Livello 1 stampatello maiuscolo, livello 2 minuscolo (dai 6 anni o con
 * difficoltà 2). L'alfabeto è quello italiano di 21 lettere: J, K, W, X, Y
 * arrivano dopo e confonderebbero.
 */

const ALFABETO = "ABCDEFGHILMNOPQRSTUVZ".split("");

export default function Game(props: GameProps) {
  const minuscole = (props.difficulty ?? 1) >= 2 || props.age >= 6;

  const round = useMemo<Round[]>(() => {
    return Array.from({ length: 6 }, (_, i) => {
      // La griglia cresce da 6 a 12 lettere.
      const quante = i < 2 ? 6 : i < 4 ? 9 : 12;
      const giusta = uno(ALFABETO);
      const altre = alcuni(ALFABETO, quante - 1, [giusta]);
      const mostra = (l: string) => (minuscole ? l.toLowerCase() : l);

      return {
        istruzione: `Tocca la lettera ${giusta}.`,
        opzioni: mescola([giusta, ...altre]).map((lettera) => ({
          id: lettera,
          etichetta: mostra(lettera),
          descrizione: `Lettera ${lettera}`,
        })),
        correttaId: giusta,
      };
    });
  }, [minuscole]);

  return <SceltaMultipla titolo="Tocca la lettera" round={round} colonne={3} {...props} />;
}
