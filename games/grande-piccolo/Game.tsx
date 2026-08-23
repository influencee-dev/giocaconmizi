"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { COLORI } from "@/games/_engine/arte";
import { mescola, uno } from "@/games/_engine/casuale";
import type { NomeFigura } from "@/games/_engine/arte";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Grande o piccolo? (3–4 anni).
 * Lo stesso oggetto in due o tre misure. Si confrontano grandezze, quindi
 * l'oggetto e il colore restano identici: cambia solo la scala.
 */

const OGGETTI: NomeFigura[] = ["palla", "mela", "albero", "casa", "fiore", "pesce"];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const richieste: { chiave: "grande" | "piccolo" | "medio"; frase: string }[] = [
      { chiave: "grande", frase: "Tocca quello più grande." },
      { chiave: "piccolo", frase: "Tocca quello più piccolo." },
      { chiave: "grande", frase: "Tocca quello più grande." },
      { chiave: "medio", frase: "Tocca quello di mezzo, né il più grande né il più piccolo." },
      { chiave: "piccolo", frase: "Tocca quello più piccolo." },
      { chiave: "medio", frase: "Tocca quello di mezzo." },
    ];

    return richieste.map((richiesta, i) => {
      const oggetto = uno(OGGETTI);
      // Il "medio" ha senso solo con tre oggetti in campo.
      const tre = richiesta.chiave === "medio" || i >= 3;
      const scale = tre ? [1, 0.65, 0.38] : [1, 0.5];
      const idGiusto =
        richiesta.chiave === "grande" ? "s0" : richiesta.chiave === "piccolo" ? `s${scale.length - 1}` : "s1";

      return {
        istruzione: richiesta.frase,
        opzioni: mescola(
          scale.map((scala, indice) => ({
            id: `s${indice}`,
            disegno: oggetto,
            colore: COLORI.azzurro,
            scala,
            descrizione: indice === 0 ? "Il più grande" : indice === scale.length - 1 ? "Il più piccolo" : "Quello di mezzo",
          })),
        ),
        correttaId: idGiusto,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Grande o piccolo?" round={round} {...props} />;
}
