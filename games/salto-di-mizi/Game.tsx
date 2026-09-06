"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Il salto di Mizi (7–10 anni).
 * Prima volta del condizionale: una regola "se… allora… altrimenti…" e una
 * fila di caselle da attraversare con gli occhi. Il bambino esegue la regola
 * a mente, mossa per mossa, e prevede dove finisce Mizi.
 *
 * Regola: a ogni mossa Mizi guarda la casella davanti.
 * Azzurra (ghiaccio scivoloso) → salta di DUE. Altrimenti → un passo.
 */

const CASELLE = 8;

interface Scena {
  /** Indici delle caselle azzurre. */
  azzurre: number[];
  mosse: number;
  /** Dove finisce davvero (verificato in scratchpad). */
  giusta: number;
  distrattori: [number, number];
}

const SCENE: Scena[] = [
  { azzurre: [2], mosse: 3, giusta: 4, distrattori: [3, 5] },
  { azzurre: [1, 4], mosse: 3, giusta: 5, distrattori: [3, 6] },
  { azzurre: [3], mosse: 4, giusta: 5, distrattori: [4, 6] },
  { azzurre: [1, 3, 5], mosse: 3, giusta: 6, distrattori: [3, 5] },
  { azzurre: [2, 5], mosse: 4, giusta: 6, distrattori: [4, 5] },
  { azzurre: [1, 2, 5], mosse: 4, giusta: 6, distrattori: [5, 7] },
];

const FIGURE: NomeFigura[] = ["pesce", "mela", "palla"];

function Fila({ scena, figure }: { scena: Scena; figure: Map<number, NomeFigura> }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="grid w-full max-w-sm grid-cols-8 gap-1 rounded-morbido bg-white p-2">
        {Array.from({ length: CASELLE }, (_, i) => (
          <div
            key={i}
            className={`flex aspect-square flex-col items-center justify-center rounded-lg ${
              scena.azzurre.includes(i) ? "bg-azzurro/60" : "bg-crema"
            }`}
          >
            {i === 0 ? (
              <Disegno id="pinguino" titolo="Mizi" />
            ) : figure.has(i) ? (
              <Disegno id={figure.get(i)!} titolo={figure.get(i)} />
            ) : null}
          </div>
        ))}
      </div>
      <p className="rounded-morbido border-2 border-crema-scuro bg-white px-4 py-2 text-center font-bold text-notte">
        <span className="text-azzurro">SE</span> la casella davanti è azzurra{" "}
        <span className="text-viola">→</span> salta di 2.{" "}
        <span className="text-azzurro">ALTRIMENTI</span>{" "}
        <span className="text-viola">→</span> 1 passo.
      </p>
    </div>
  );
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return SCENE.map((scena, indice) => {
      // L'oggetto premio ruota a ogni scena: se fosse sempre il pesce si
      // imparerebbe a toccare il pesce, non a eseguire la regola.
      const figureScena = [0, 1, 2].map((k) => FIGURE[(indice + k) % FIGURE.length]);
      const posti = [scena.giusta, ...scena.distrattori];
      const figure = new Map<number, NomeFigura>(posti.map((p, i) => [p, figureScena[i]]));

      return {
        istruzione: `Mizi fa ${scena.mosse} mosse. Segui la regola: dove arriva?`,
        opzioni: mescola(figureScena.map((f) => ({ id: f, disegno: f, descrizione: f }))),
        correttaId: figureScena[0],
        centro: <Fila scena={scena} figure={figure} />,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Il salto di Mizi" round={round} colonne={3} {...props} />;
}
