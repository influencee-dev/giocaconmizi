"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { COLORI, Disegno, NOMI_COLORE, type NomeColore } from "@/games/_engine/arte";
import { alcuni, mescola, uno } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Abbina i colori (3–4 anni).
 * Un oggetto colorato al centro, i secchielli sotto: si tocca quello dello
 * stesso colore. Le opzioni passano da 3 a 5 mano a mano che il gioco procede.
 */

const OGGETTI = ["palla", "mela", "fiore", "macchina", "stella", "cerchio"] as const;

const TAVOLOZZA: NomeColore[] = ["rosso", "giallo", "azzurro", "verde", "viola", "rosa", "arancione"];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return Array.from({ length: 6 }, (_, i) => {
      // Da 3 opzioni si sale a 5: la difficoltà cresce dentro la partita.
      const quante = i < 2 ? 3 : i < 4 ? 4 : 5;
      const giusto = uno(TAVOLOZZA);
      const distrattori = alcuni(TAVOLOZZA, quante - 1, [giusto]);
      const oggetto = OGGETTI[i % OGGETTI.length];

      return {
        istruzione: `Tocca il secchiello ${NOMI_COLORE[giusto]}, come questo.`,
        opzioni: mescola([giusto, ...distrattori]).map((colore) => ({
          id: colore,
          tipo: "secchiello" as const,
          colore: COLORI[colore],
          descrizione: `Secchiello ${NOMI_COLORE[colore]}`,
        })),
        correttaId: giusto,
        centro: (
          <div className="h-32 w-32">
            <Disegno id={oggetto} colore={COLORI[giusto]} titolo={`Oggetto ${NOMI_COLORE[giusto]}`} />
          </div>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Abbina i colori" round={round} {...props} />;
}
