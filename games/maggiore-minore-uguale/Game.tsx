"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Maggiore, minore o uguale? (6–8 anni).
 * Due numeri e un posto vuoto in mezzo: si tocca il segno giusto fra >, < e =.
 * I numeri arrivano fino a 20 a sei anni, fino a 60 a sette, fino a 100 dagli
 * otto. Metà delle coppie sta nella stessa decina (52 e 57): lì bisogna
 * guardare le unità. Due coppie su dieci sono uguali.
 */

export const FRASI_CONFRONTO = {
  istruzione: "Guarda i due numeri. Quale segno ci va in mezzo?",
  aiuto: "Il segno apre la bocca verso il numero più grande.",
  maggiore: "Maggiore!",
  minore: "Minore!",
  uguale: "Uguale!",
} as const;

const SEGNI = [
  { id: "maggiore", etichetta: ">", descrizione: "maggiore" },
  { id: "minore", etichetta: "<", descrizione: "minore" },
  { id: "uguale", etichetta: "=", descrizione: "uguale" },
] as const;

const tra = (minimo: number, massimo: number) => minimo + Math.floor(Math.random() * (massimo - minimo + 1));

/** Dieci coppie: quattro nella stessa decina, quattro lontane, due uguali. */
export function coppie(eta: number): [number, number][] {
  const limite = eta <= 6 ? 20 : eta === 7 ? 60 : 100;
  const base = limite === 20 ? 1 : 10;
  const diversi = (minimo: number, massimo: number): [number, number] => {
    const a = tra(minimo, massimo);
    let b = tra(minimo, massimo);
    while (b === a) b = tra(minimo, massimo);
    return [a, b];
  };

  const vicine = Array.from({ length: 4 }, () => {
    const decina = limite === 20 ? 10 : tra(Math.max(1, limite / 10 - 2), limite / 10 - 1) * 10;
    return diversi(decina, decina + 9);
  });
  const lontane = Array.from({ length: 4 }, () => diversi(base, limite));
  const uguali = Array.from({ length: 2 }, (): [number, number] => {
    const n = tra(base, limite);
    return [n, n];
  });
  return mescola([...vicine, ...lontane, ...uguali]);
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(
    () =>
      coppie(props.age).map(([a, b]) => {
        const giusto = a > b ? "maggiore" : a < b ? "minore" : "uguale";
        return {
          istruzione: FRASI_CONFRONTO.istruzione,
          opzioni: SEGNI.map((s) => ({ ...s })),
          correttaId: giusto,
          lode: FRASI_CONFRONTO[giusto],
          aiuto: giusto === "uguale" ? undefined : FRASI_CONFRONTO.aiuto,
          centro: (
            <p className="flex items-center gap-4 text-5xl font-extrabold text-notte sm:text-6xl" data-confronto={`${a},${b}`}>
              <span>{a}</span>
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-dashed border-viola text-3xl text-viola" aria-label="quale segno?">
                ?
              </span>
              <span>{b}</span>
            </p>
          ),
        };
      }),
    [props.age],
  );

  return <SceltaMultipla titolo="Maggiore, minore o uguale?" round={round} colonne={3} {...props} />;
}
