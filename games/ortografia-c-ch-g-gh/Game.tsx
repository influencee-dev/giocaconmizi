"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * C o CH? (6–8 anni).
 * Le difficoltà ortografiche italiane che tornano ogni anno: C/CH, G/GH,
 * SC/SCH, CE/CIE, GLI/LI. La parola viene detta a voce: si sceglie con
 * l'orecchio, non a memoria.
 */

interface Voce {
  parola: string;
  /** La parte nascosta. */
  buco: string;
  alternative: string[];
}

const PAROLE: Voce[] = [
  { parola: "CHIESA", buco: "CH", alternative: ["C", "CH"] },
  { parola: "CUCINA", buco: "C", alternative: ["C", "CH"] },
  { parola: "CHIAVE", buco: "CH", alternative: ["C", "CH"] },
  { parola: "CIPOLLA", buco: "C", alternative: ["C", "CH"] },
  { parola: "GHIACCIO", buco: "GH", alternative: ["G", "GH"] },
  { parola: "GELATO", buco: "G", alternative: ["G", "GH"] },
  { parola: "GHIRLANDA", buco: "GH", alternative: ["G", "GH"] },
  { parola: "GIRAFFA", buco: "G", alternative: ["G", "GH"] },
  { parola: "SCHERMO", buco: "SCH", alternative: ["SC", "SCH"] },
  { parola: "SCIVOLO", buco: "SC", alternative: ["SC", "SCH"] },
  { parola: "FOGLIA", buco: "GLI", alternative: ["GLI", "LI"] },
  { parola: "OLIO", buco: "LI", alternative: ["GLI", "LI"] },
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return mescola(PAROLE)
      .slice(0, 6)
      .map((voce) => {
        const resto = voce.parola.slice(voce.buco.length);

        return {
          istruzione: `${voce.parola.toLowerCase()}. Come si scrive l'inizio di questa parola?`,
          mostraTesto: true,
          opzioni: mescola(voce.alternative).map((a) => ({
            id: a,
            etichetta: a,
            descrizione: a,
          })),
          correttaId: voce.buco,
          centro: (
            <span className="text-4xl font-extrabold tracking-widest text-notte">
              <span className="text-viola">___</span>
              {resto}
            </span>
          ),
        };
      });
  }, []);

  return <SceltaMultipla titolo="C o CH?" round={round} colonne={2} {...props} />;
}
