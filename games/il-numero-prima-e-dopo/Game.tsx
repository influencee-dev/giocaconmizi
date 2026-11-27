"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { numero } from "@/games/_engine/casuale";
import { limitePerEta, scelteNumeriche } from "@/games/_engine/numeri";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Il numero prima e dopo (6–8 anni).
 * Nove round: tre volte il numero che viene subito dopo, tre volte quello
 * subito prima, tre volte il numero che manca in una fila di cinque. In ogni
 * terzetto c'è un cambio di decina (39 e 40, 50 e 49): è lì che si sbaglia.
 */

export const FRASI_VICINI = {
  dopo: "Che numero viene subito dopo?",
  prima: "Che numero viene subito prima?",
  manca: "Che numero manca nella fila?",
  aiutoDopo: "Il numero dopo è uno in più.",
  aiutoPrima: "Il numero prima è uno in meno.",
  aiutoManca: "Conta in avanti, un numero alla volta.",
} as const;

const Casella = ({ children, vuota = false }: { children?: React.ReactNode; vuota?: boolean }) => (
  <span
    className={`flex h-14 min-w-12 items-center justify-center rounded-xl px-2 text-3xl font-extrabold ${
      vuota ? "border-4 border-dashed border-viola text-viola" : "bg-white text-notte"
    }`}
  >
    {vuota ? "?" : children}
  </span>
);

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const limite = limitePerEta(props.age);
    const base = limite === 20 ? 2 : 11;
    // Un numero qualsiasi, oppure uno che finisce con 9 (o con 0): il cambio di decina.
    const aCavallo = (finale: 9 | 0) => {
      const decina = numero(limite === 20 ? 1 : 2, limite / 10 - 1) * 10;
      return finale === 9 ? decina - 1 : decina;
    };

    const dopo: Round[] = [numero(base, limite - 2), aCavallo(9), numero(Math.max(base, limite - 12), limite - 2)].map((n) => ({
      istruzione: FRASI_VICINI.dopo,
      opzioni: scelteNumeriche(n + 1, [n - 1, n + 11, n + 2]),
      correttaId: String(n + 1),
      aiuto: FRASI_VICINI.aiutoDopo,
      centro: (
        <p className="flex items-center gap-3" data-vicino={`dopo-${n}`}>
          <Casella>{n}</Casella>
          <Casella vuota />
        </p>
      ),
    }));

    const prima: Round[] = [numero(base + 1, limite - 1), aCavallo(0), numero(Math.max(base + 1, limite - 12), limite)].map((n) => ({
      istruzione: FRASI_VICINI.prima,
      opzioni: scelteNumeriche(n - 1, [n + 1, n - 11, n - 2]),
      correttaId: String(n - 1),
      aiuto: FRASI_VICINI.aiutoPrima,
      centro: (
        <p className="flex items-center gap-3" data-vicino={`prima-${n}`}>
          <Casella vuota />
          <Casella>{n}</Casella>
        </p>
      ),
    }));

    const manca: Round[] = [1, 2, 3].map((buco, i) => {
      const inizio = i === 1 ? aCavallo(9) - 2 : numero(base, limite - 4);
      const mancante = inizio + buco;
      return {
        istruzione: FRASI_VICINI.manca,
        opzioni: scelteNumeriche(mancante, [mancante + 1, mancante - 1, mancante + 10]),
        correttaId: String(mancante),
        aiuto: FRASI_VICINI.aiutoManca,
        centro: (
          <p className="flex flex-wrap items-center justify-center gap-2" data-vicino={`manca-${mancante}`}>
            {Array.from({ length: 5 }, (_, k) => (k === buco ? <Casella key={k} vuota /> : <Casella key={k}>{inizio + k}</Casella>))}
          </p>
        ),
      };
    });

    return [dopo[0], prima[0], manca[0], dopo[1], prima[1], manca[1], dopo[2], prima[2], manca[2]];
  }, [props.age]);

  return <SceltaMultipla titolo="Il numero prima e dopo" round={round} colonne={3} {...props} />;
}
