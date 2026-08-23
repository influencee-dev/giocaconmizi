"use client";

import { useMemo } from "react";
import { Ordina, type RoundOrdina } from "@/games/_engine/Ordina";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Il robot ballerino (4–7 anni).
 * Si copia una coreografia mettendo le mosse nell'ordine giusto: è una
 * sequenza di istruzioni, cioè un programma, senza che nessuno lo chiami così.
 * Le coreografie crescono da 4 a 8 mosse e le ultime contengono una ripetizione.
 */

const MOSSE: Record<string, { icona: string; nome: string }> = {
  salta: { icona: "⬆", nome: "salta" },
  gira: { icona: "↻", nome: "gira" },
  batti: { icona: "👏", nome: "batti le mani" },
  piega: { icona: "⬇", nome: "piegati" },
};

const COREOGRAFIE: string[][] = [
  ["salta", "batti", "gira", "piega"],
  ["batti", "batti", "salta", "gira"],
  ["gira", "piega", "batti", "salta", "batti"],
  ["salta", "salta", "batti", "gira", "piega", "batti"],
  ["batti", "gira", "salta", "batti", "gira", "salta", "piega"],
  ["piega", "salta", "batti", "gira", "piega", "salta", "batti", "gira"],
];

export default function Game(props: GameProps) {
  const round = useMemo<RoundOrdina[]>(() => {
    return COREOGRAFIE.map((coreografia) => ({
      istruzione: `Guarda la coreografia e rifalla: ${coreografia.map((m) => MOSSE[m].nome).join(", poi ")}.`,
      soluzione: coreografia.map((mossa, i) => ({
        id: `${mossa}-${i}`,
        etichetta: MOSSE[mossa].icona,
        descrizione: MOSSE[mossa].nome,
      })),
      vocePremio: "Che ballerino! Coreografia giusta.",
      centro: (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-morbido bg-white p-3">
          {coreografia.map((mossa, i) => (
            <span key={i} className="flex flex-col items-center">
              <span className="text-3xl" aria-hidden>
                {MOSSE[mossa].icona}
              </span>
              <span className="text-xs font-bold text-notte-tenue">{MOSSE[mossa].nome}</span>
            </span>
          ))}
        </div>
      ),
    }));
  }, []);

  return <Ordina titolo="Il robot ballerino" round={round} {...props} />;
}
