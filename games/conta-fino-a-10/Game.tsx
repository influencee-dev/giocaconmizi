"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { Disegno } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Conta fino a 10 (3–5 anni).
 * Un banco di pesci da contare e tre numeri fra cui scegliere. I distrattori
 * sono i numeri vicini: è lì che si sbaglia davvero quando si impara a contare.
 */

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    // Si parte da pochi pesci e si arriva a dieci.
    const quantita = [2, 3, 5, 6, 8, 10];

    return quantita.map((quanti) => {
      const vicini = [quanti - 1, quanti + 1, quanti + 2].filter((n) => n >= 1 && n <= 10 && n !== quanti);
      const distrattori = mescola(vicini).slice(0, 2);

      return {
        istruzione: `Conta i pesci e tocca il numero giusto.`,
        opzioni: mescola([quanti, ...distrattori]).map((n) => ({
          id: String(n),
          etichetta: String(n),
          descrizione: `Numero ${n}`,
        })),
        correttaId: String(quanti),
        centro: (
          <div className="flex max-w-sm flex-wrap items-center justify-center gap-1">
            {Array.from({ length: quanti }, (_, i) => (
              <div key={i} className="h-12 w-12">
                <Disegno id="pesce" />
              </div>
            ))}
          </div>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Conta fino a 10" round={round} colonne={3} {...props} />;
}
