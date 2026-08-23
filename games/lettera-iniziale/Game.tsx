"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Con che lettera inizia? (5–6 anni).
 * Immagine, parola detta a voce, e si sceglie il suono iniziale. Le lettere
 * restano in stampatello maiuscolo: è il carattere con cui si impara.
 */

const PAROLE: { figura: NomeFigura; parola: string }[] = [
  { figura: "casa", parola: "CASA" },
  { figura: "mela", parola: "MELA" },
  { figura: "sole", parola: "SOLE" },
  { figura: "albero", parola: "ALBERO" },
  { figura: "pesce", parola: "PESCE" },
  { figura: "fiore", parola: "FIORE" },
  { figura: "luna", parola: "LUNA" },
  { figura: "razzo", parola: "RAZZO" },
  { figura: "torta", parola: "TORTA" },
  { figura: "barca", parola: "BARCA" },
  { figura: "gatto", parola: "GATTO" },
  { figura: "nuvola", parola: "NUVOLA" },
];

const ALFABETO = "ABCDEFGHILMNOPQRSTUVZ".split("");

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const scelte = mescola(PAROLE).slice(0, 6);

    return scelte.map((voce, i) => {
      const quante = i < 3 ? 3 : i < 5 ? 4 : 5;
      const giusta = voce.parola[0];
      const altre = alcuni(ALFABETO, quante - 1, [giusta]);

      return {
        istruzione: `${voce.parola}. Con che lettera inizia ${voce.parola.toLowerCase()}?`,
        opzioni: mescola([giusta, ...altre]).map((lettera) => ({
          id: lettera,
          etichetta: lettera,
          descrizione: `Lettera ${lettera}`,
        })),
        correttaId: giusta,
        centro: (
          <div className="flex flex-col items-center gap-2">
            <div className="h-32 w-32">
              <Disegno id={voce.figura} titolo={voce.parola.toLowerCase()} />
            </div>
            <span className="text-2xl font-extrabold tracking-widest text-notte">{voce.parola}</span>
          </div>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Con che lettera inizia?" round={round} {...props} />;
}
