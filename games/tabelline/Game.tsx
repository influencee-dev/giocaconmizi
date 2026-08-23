"use client";

import { useMemo, useState } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola, numero } from "@/games/_engine/casuale";
import { Contenitore } from "@/components/ui";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Tabelline con Mizi (7–10 anni).
 * Prima si sceglie quale tabellina allenare — o "tutte insieme" —, poi otto
 * domande. Scegliere è importante: chi sta lavorando sul 7 non vuole il 2.
 */

const TABELLINE = [2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Game(props: GameProps) {
  const [scelta, setScelta] = useState<number | "mix" | null>(null);

  const round = useMemo<Round[]>(() => {
    if (scelta === null) return [];

    return Array.from({ length: 8 }, () => {
      const tabellina = scelta === "mix" ? TABELLINE[numero(0, TABELLINE.length - 1)] : scelta;
      const fattore = numero(1, 10);
      const risultato = tabellina * fattore;

      // Errori tipici: il vicino di tabellina e l'aver contato una volta in meno.
      const sbagliati = [
        tabellina * (fattore + 1),
        tabellina * Math.max(1, fattore - 1),
        risultato + tabellina - 1,
      ].filter((n) => n !== risultato && n > 0);

      const distrattori = mescola([...new Set(sbagliati)]).slice(0, 3);

      return {
        istruzione: `Quanto fa ${tabellina} per ${fattore}?`,
        mostraTesto: true,
        opzioni: mescola([risultato, ...distrattori]).map((n) => ({
          id: String(n),
          etichetta: String(n),
          descrizione: `Numero ${n}`,
        })),
        correttaId: String(risultato),
        centro: (
          <span className="text-5xl font-extrabold text-notte">
            {tabellina} × {fattore}
          </span>
        ),
      };
    });
  }, [scelta]);

  if (scelta === null) {
    return (
      <Contenitore className="flex min-h-dvh flex-col justify-center py-10">
        <h1 className="text-3xl font-extrabold text-notte">Quale tabellina vuoi allenare?</h1>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {TABELLINE.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setScelta(t)}
              className="rounded-morbido border-4 border-crema-scuro bg-white py-6 text-3xl font-extrabold text-notte"
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setScelta("mix")}
          className="mt-4 rounded-bolla bg-viola px-8 py-5 text-xl font-extrabold text-white"
        >
          Tutte insieme
        </button>
      </Contenitore>
    );
  }

  return <SceltaMultipla titolo="Tabelline con Mizi" round={round} colonne={4} {...props} />;
}
