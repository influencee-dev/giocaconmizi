"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { numero } from "@/games/_engine/casuale";
import { limitePerEta, scelteNumeriche } from "@/games/_engine/numeri";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Più e meno (6–8 anni).
 * Dieci calcoli in riga, addizioni e sottrazioni alternate, entro 20 a sei
 * anni, entro 60 a sette, entro 100 dagli otto. I primi sei restano dentro la
 * decina (34 + 5, 58 − 6) o lavorano con le decine intere (40 + 20); gli
 * ultimi quattro cambiano decina (38 + 5, 52 − 4). Le risposte sbagliate sono
 * gli errori tipici: uno in più o in meno, la decina sbagliata, l'operazione
 * scambiata.
 */

export const FRASI_CALCOLI = {
  istruzione: "Quanto fa?",
  aiutoPiu: "Parti dal numero più grande e conta in avanti.",
  aiutoMeno: "Parti dal primo numero e conta all'indietro.",
} as const;

type Calcolo = { a: number; b: number; piu: boolean };

export function calcoli(eta: number): Calcolo[] {
  const limite = limitePerEta(eta);
  const decine = limite / 10;

  return Array.from({ length: 10 }, (_, i): Calcolo => {
    const piu = i % 2 === 0;
    if (limite === 20) {
      const b = numero(1, i < 6 ? 5 : 9);
      return piu ? { a: numero(1, 20 - b), b, piu } : { a: numero(b + 1, 20), b, piu };
    }
    // Decine intere: 40 + 20, 60 − 30.
    if (i === 4 || i === 5) {
      const d1 = numero(1, decine - 1);
      const d2 = numero(1, piu ? decine - d1 : d1);
      return piu ? { a: d1 * 10, b: d2 * 10, piu } : { a: Math.max(d1, d2 + 1) * 10, b: d2 * 10, piu };
    }
    // Col cambio di decina in salita si resta una decina sotto il limite.
    const decina = numero(1, i >= 6 && piu ? decine - 2 : decine - 1) * 10;
    if (i < 6) {
      // Dentro la decina: le unità non la superano.
      const u = numero(1, 8);
      const b = numero(1, piu ? 9 - u : u);
      return { a: decina + u, b, piu };
    }
    // Con il cambio di decina.
    const u = piu ? numero(5, 9) : numero(1, 5);
    const b = piu ? numero(11 - u, 9) : numero(u + 1, 9);
    return { a: decina + u, b, piu };
  });
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(
    () =>
      calcoli(props.age).map(({ a, b, piu }) => {
        const risultato = piu ? a + b : a - b;
        return {
          istruzione: FRASI_CALCOLI.istruzione,
          opzioni: scelteNumeriche(risultato, [risultato + 1, risultato - 1, risultato + 10, risultato - 10, piu ? a - b : a + b]),
          correttaId: String(risultato),
          aiuto: piu ? FRASI_CALCOLI.aiutoPiu : FRASI_CALCOLI.aiutoMeno,
          centro: (
            <p className="text-center text-5xl font-extrabold text-notte sm:text-6xl" data-calcolo={`${a}${piu ? "+" : "-"}${b}`}>
              {a} {piu ? "+" : "−"} {b} = <span className="text-viola">?</span>
            </p>
          ),
        };
      }),
    [props.age],
  );

  return <SceltaMultipla titolo="Più e meno" round={round} colonne={3} {...props} />;
}
