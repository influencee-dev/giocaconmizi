"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * C o CH? (6–8 anni).
 * Le difficoltà ortografiche italiane che tornano ogni anno: C/CH, G/GH,
 * SC/SCH, GLI/LI. La parola viene detta a voce: si sceglie con l'orecchio,
 * non a memoria. Il buco può stare in qualunque punto della parola
 * (FO___A, MA___ERA): prima stava sempre all'inizio e FOGLIA diventava
 * l'inesistente "GLILIA".
 * Otto round, due per famiglia: ogni partita le copre tutte.
 */

interface Voce {
  /** La parola spezzata attorno al buco: prima + buco + dopo. */
  prima: string;
  buco: string;
  dopo: string;
  alternative: [string, string];
}

const FAMIGLIE: Voce[][] = [
  // C / CH
  [
    { prima: "", buco: "CH", dopo: "IESA", alternative: ["C", "CH"] },
    { prima: "", buco: "C", dopo: "UCINA", alternative: ["C", "CH"] },
    { prima: "", buco: "CH", dopo: "IAVE", alternative: ["C", "CH"] },
    { prima: "", buco: "C", dopo: "IPOLLA", alternative: ["C", "CH"] },
    { prima: "", buco: "CH", dopo: "ITARRA", alternative: ["C", "CH"] },
    { prima: "PAN", buco: "CH", dopo: "INA", alternative: ["C", "CH"] },
  ],
  // G / GH
  [
    { prima: "", buco: "GH", dopo: "IACCIO", alternative: ["G", "GH"] },
    { prima: "", buco: "G", dopo: "ELATO", alternative: ["G", "GH"] },
    { prima: "", buco: "GH", dopo: "IRLANDA", alternative: ["G", "GH"] },
    { prima: "", buco: "G", dopo: "IRAFFA", alternative: ["G", "GH"] },
    { prima: "MAR", buco: "GH", dopo: "ERITA", alternative: ["G", "GH"] },
    { prima: "", buco: "G", dopo: "EMELLI", alternative: ["G", "GH"] },
  ],
  // SC / SCH
  [
    { prima: "", buco: "SCH", dopo: "ERMO", alternative: ["SC", "SCH"] },
    { prima: "", buco: "SC", dopo: "IVOLO", alternative: ["SC", "SCH"] },
    { prima: "", buco: "SCH", dopo: "IENA", alternative: ["SC", "SCH"] },
    { prima: "", buco: "SC", dopo: "IARPA", alternative: ["SC", "SCH"] },
    { prima: "MA", buco: "SCH", dopo: "ERA", alternative: ["SC", "SCH"] },
    { prima: "U", buco: "SC", dopo: "ITA", alternative: ["SC", "SCH"] },
  ],
  // GLI / LI
  [
    { prima: "FO", buco: "GLI", dopo: "A", alternative: ["GLI", "LI"] },
    { prima: "O", buco: "LI", dopo: "O", alternative: ["GLI", "LI"] },
    { prima: "CONI", buco: "GLI", dopo: "O", alternative: ["GLI", "LI"] },
    { prima: "BOTTI", buco: "GLI", dopo: "A", alternative: ["GLI", "LI"] },
    { prima: "ITA", buco: "LI", dopo: "A", alternative: ["GLI", "LI"] },
  ],
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    // Due parole per famiglia, poi tutto mescolato: ogni partita copre
    // C/CH, G/GH, SC/SCH e GLI/LI invece di pescare a caso dal mucchio.
    const scelte = mescola(FAMIGLIE.flatMap((famiglia) => alcuni(famiglia, 2, [])));

    return scelte.map((voce) => {
      const parola = `${voce.prima}${voce.buco}${voce.dopo}`;

      return {
        istruzione: `${parola.toLowerCase()}. Come si scrive?`,
        mostraTesto: true,
        opzioni: mescola([...voce.alternative]).map((a) => ({
          id: a,
          etichetta: a,
          descrizione: a,
        })),
        correttaId: voce.buco,
        centro: (
          <span className="text-4xl font-extrabold tracking-widest text-notte">
            {voce.prima}
            <span className="text-viola">___</span>
            {voce.dopo}
          </span>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="C o CH?" round={round} colonne={2} {...props} />;
}
