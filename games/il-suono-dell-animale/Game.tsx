"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { NomeFigura } from "@/games/_engine/arte";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Di chi è questo suono? (3–5 anni).
 * Il verso lo fa la sintesi vocale con l'onomatopea: nessun file audio da
 * scaricare, funziona anche con la connessione lenta.
 */

const ANIMALI: { id: NomeFigura; nome: string; verso: string }[] = [
  { id: "gatto", nome: "il gatto", verso: "miao, miao" },
  { id: "cane", nome: "il cane", verso: "bau, bau" },
  { id: "mucca", nome: "la mucca", verso: "muuu" },
  { id: "pecora", nome: "la pecora", verso: "beee" },
  { id: "papera", nome: "la papera", verso: "qua qua" },
  { id: "gallo", nome: "il gallo", verso: "chicchirichì" },
  { id: "rana", nome: "la rana", verso: "cra cra" },
  { id: "ape", nome: "l'ape", verso: "bzzzz" },
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const scelti = mescola(ANIMALI).slice(0, 6);

    return scelti.map((animale, i) => {
      const quante = i < 3 ? 3 : 4;
      const altri = alcuni(ANIMALI, quante - 1, [animale]);

      return {
        istruzione: `${animale.verso}. Chi fa questo verso?`,
        opzioni: mescola([animale, ...altri]).map((a) => ({
          id: a.id,
          disegno: a.id,
          descrizione: a.nome,
        })),
        correttaId: animale.id,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Di chi è questo suono?" round={round} {...props} />;
}
