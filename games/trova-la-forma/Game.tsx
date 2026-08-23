"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { COLORI, FORME } from "@/games/_engine/arte";
import { alcuni, mescola, uno } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Trova la forma (3–5 anni).
 * La voce dice la forma, il bambino la tocca. Tutte le forme hanno lo stesso
 * colore in ogni round: così si guarda la sagoma, non la tinta.
 */

const ARTICOLI: Record<string, string> = {
  cerchio: "il cerchio",
  quadrato: "il quadrato",
  triangolo: "il triangolo",
  rettangolo: "il rettangolo",
  stella: "la stella",
  ovale: "l'ovale",
  rombo: "il rombo",
};

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const tinte = [COLORI.viola, COLORI.azzurro, COLORI.rosa, COLORI.arancione, COLORI.verde, COLORI.giallo];

    return Array.from({ length: 6 }, (_, i) => {
      const quante = i < 2 ? 3 : i < 4 ? 4 : 6;
      const giusta = uno(FORME);
      const altre = alcuni(FORME, quante - 1, [giusta]);
      const tinta = tinte[i % tinte.length];

      return {
        istruzione: `Tocca ${ARTICOLI[giusta]}.`,
        opzioni: mescola([giusta, ...altre]).map((forma) => ({
          id: forma,
          disegno: forma,
          colore: tinta,
          descrizione: ARTICOLI[forma],
        })),
        correttaId: giusta,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Trova la forma" round={round} {...props} />;
}
