"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { Disegno } from "@/games/_engine/arte";
import { mescola, numero } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Addizioni entro 20 (6–8 anni).
 * Livello 1 con i pesci da contare, livello 2 solo numeri. I distrattori sono
 * i risultati sbagliati tipici: uno in più, uno in meno, la differenza.
 */

export default function Game(props: GameProps) {
  const conSupporto = (props.difficulty ?? 2) < 2 && props.age <= 6;

  const round = useMemo<Round[]>(() => {
    return Array.from({ length: 6 }, (_, i) => {
      // Prime tre entro 10, poi entro 20.
      const max = i < 3 ? 10 : 20;
      const a = numero(1, Math.min(9, max - 2));
      const b = numero(1, max - a);
      const risultato = a + b;

      const sbagliati = [risultato + 1, risultato - 1, Math.abs(a - b)].filter(
        (n) => n >= 0 && n !== risultato,
      );
      const distrattori = mescola([...new Set(sbagliati)]).slice(0, 3);

      return {
        istruzione: `Quanto fa ${a} più ${b}?`,
        mostraTesto: true,
        opzioni: mescola([risultato, ...distrattori]).map((n) => ({
          id: String(n),
          etichetta: String(n),
          descrizione: `Numero ${n}`,
        })),
        correttaId: String(risultato),
        centro: (
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl font-extrabold text-notte">
              {a} + {b} = ?
            </span>
            {conSupporto && (
              <div className="flex max-w-sm flex-wrap items-center justify-center gap-1">
                {Array.from({ length: a }, (_, k) => (
                  <div key={`a${k}`} className="h-9 w-9">
                    <Disegno id="pesce" />
                  </div>
                ))}
                <span className="px-2 text-2xl font-extrabold text-viola">+</span>
                {Array.from({ length: b }, (_, k) => (
                  <div key={`b${k}`} className="h-9 w-9">
                    <Disegno id="pesce" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      };
    });
  }, [conSupporto]);

  return <SceltaMultipla titolo="Addizioni entro 20" round={round} colonne={4} {...props} />;
}
