"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { COLORI, Disegno } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import type { NomeForma } from "@/games/_engine/arte";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Cosa viene dopo? (4–7 anni).
 * Riconoscere un pattern e continuarlo è il primo mattone del pensiero
 * computazionale (piano §13): si passa da ABAB a ABCABC a AABB.
 */

interface Elemento {
  id: string;
  forma: NomeForma;
  colore: string;
}

const MATTONI: Elemento[] = [
  { id: "cerchio-rosa", forma: "cerchio", colore: COLORI.rosa },
  { id: "quadrato-azzurro", forma: "quadrato", colore: COLORI.azzurro },
  { id: "triangolo-giallo", forma: "triangolo", colore: COLORI.giallo },
  { id: "stella-viola", forma: "stella", colore: COLORI.viola },
  { id: "rombo-verde", forma: "rombo", colore: COLORI.verde },
];

/**
 * Ogni schema è il periodo che si ripete, scritto come indici dei pezzi.
 * Il gioco mostra i primi cinque elementi della serie e chiede il sesto,
 * che è sempre `periodo[5 % periodo.length]`.
 */
const PERIODI: number[][] = [
  [0, 1], // ABAB
  [0, 1], // ABAB con altri pezzi
  [0, 1, 2], // ABCABC
  [0, 0, 1, 1], // AABB
  [0, 1, 2], // ABCABC
  [0, 0, 1, 1], // AABB
];

const MOSTRATI = 5;

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return PERIODI.map((periodo) => {
      const quantiPezzi = Math.max(...periodo) + 1;
      const pezzi = mescola(MATTONI).slice(0, Math.max(quantiPezzi, 3));

      const serie = Array.from({ length: MOSTRATI }, (_, i) => pezzi[periodo[i % periodo.length]]);
      const giusto = pezzi[periodo[MOSTRATI % periodo.length]];

      // Le opzioni sono i pezzi in gioco: i distrattori sono già dentro la serie,
      // quindi la scelta è davvero sul pattern e non sulla novità.
      const opzioni = mescola(pezzi.slice(0, 3));

      return {
        istruzione: "Guarda la fila. Quale viene dopo?",
        opzioni: opzioni.map((p) => ({
          id: p.id,
          disegno: p.forma,
          colore: p.colore,
          descrizione: p.forma,
        })),
        correttaId: giusto.id,
        centro: (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {serie.map((p, i) => (
              <div key={i} className="h-14 w-14">
                <Disegno id={p.forma} colore={p.colore} />
              </div>
            ))}
            <div className="flex h-14 w-14 items-center justify-center rounded-morbido border-4 border-dashed border-viola text-2xl font-extrabold text-viola">
              ?
            </div>
          </div>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Cosa viene dopo?" round={round} colonne={3} {...props} />;
}
