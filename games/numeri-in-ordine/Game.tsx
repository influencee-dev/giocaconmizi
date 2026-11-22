"use client";

import { useMemo } from "react";
import { Ordina, type RoundOrdina } from "@/games/_engine/Ordina";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Numeri in ordine (6–8 anni).
 * Quattro o cinque numeri da toccare in fila: tre volte dal più piccolo al più
 * grande (ordine crescente), tre volte dal più grande al più piccolo
 * (decrescente). I numeri arrivano fino a 20 a sei anni, fino a 60 a sette,
 * fino a 100 dagli otto; in metà dei round stanno tutti vicini, nelle ultime
 * due decine.
 */

export const FRASI_ORDINE = {
  crescente: "Metti i numeri in ordine, dal più piccolo al più grande.",
  decrescente: "Adesso al contrario: dal più grande al più piccolo.",
  fatto: "Evviva! Ordine giusto.",
} as const;

/** `quanti` numeri diversi tra `minimo` e `massimo`. */
function numeri(quanti: number, minimo: number, massimo: number): number[] {
  const tutti = Array.from({ length: massimo - minimo + 1 }, (_, i) => minimo + i);
  return mescola(tutti).slice(0, quanti);
}

export default function Game(props: GameProps) {
  const round = useMemo<RoundOrdina[]>(() => {
    const limite = props.age <= 6 ? 20 : props.age === 7 ? 60 : 100;
    const base = limite === 20 ? 1 : 10;
    const piano: { verso: "crescente" | "decrescente"; quanti: number; vicini: boolean }[] = [
      { verso: "crescente", quanti: 4, vicini: false },
      { verso: "crescente", quanti: 4, vicini: true },
      { verso: "crescente", quanti: 5, vicini: true },
      { verso: "decrescente", quanti: 4, vicini: false },
      { verso: "decrescente", quanti: 5, vicini: true },
      { verso: "decrescente", quanti: 5, vicini: false },
    ];

    return piano.map(({ verso, quanti, vicini }) => {
      const scelti = numeri(quanti, vicini ? Math.max(base, limite - 19) : base, limite).sort((a, b) =>
        verso === "crescente" ? a - b : b - a,
      );
      return {
        istruzione: FRASI_ORDINE[verso],
        soluzione: scelti.map((n) => ({ id: `n-${n}`, etichetta: String(n), descrizione: `Numero ${n}` })),
        vocePremio: FRASI_ORDINE.fatto,
      };
    });
  }, [props.age]);

  return <Ordina titolo="Numeri in ordine" round={round} {...props} />;
}
