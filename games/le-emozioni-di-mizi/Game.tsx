"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { NOMI_EMOZIONE, type Emozione } from "@/games/_engine/arte";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Le emozioni di Mizi (3–6 anni).
 * Una situazione breve detta a voce, poi si sceglie la faccia. Le situazioni
 * sono quotidiane e neutre: niente paure forti, niente colpe.
 */

const EMOZIONI: Emozione[] = ["felice", "triste", "arrabbiato", "spaventato", "sorpreso"];

const SITUAZIONI: { testo: string; emozione: Emozione }[] = [
  { testo: "Mizi ha ricevuto un regalo dalla sua amica. Come si sente?", emozione: "felice" },
  { testo: "Mizi ha perso il suo pupazzo preferito. Come si sente?", emozione: "triste" },
  { testo: "Qualcuno ha rotto la torre che Mizi aveva costruito. Come si sente?", emozione: "arrabbiato" },
  { testo: "Si è spenta la luce e Mizi è rimasta al buio. Come si sente?", emozione: "spaventato" },
  { testo: "Mizi apre la porta e trova tutti i suoi amici. Come si sente?", emozione: "sorpreso" },
  { testo: "Mizi è caduta e si è sbucciata il ginocchio. Come si sente?", emozione: "triste" },
  { testo: "Domani Mizi va al mare con il papà. Come si sente?", emozione: "felice" },
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const scelte = mescola(SITUAZIONI).slice(0, 6);

    return scelte.map((situazione, i) => {
      const quante = i < 3 ? 3 : i < 5 ? 4 : 5;
      const altre = alcuni(EMOZIONI, quante - 1, [situazione.emozione]);

      return {
        istruzione: situazione.testo,
        // La situazione va sempre mostrata: il genitore la legge al bambino piccolo.
        mostraTesto: true,
        opzioni: mescola([situazione.emozione, ...altre]).map((e) => ({
          id: e,
          tipo: "faccia" as const,
          emozione: e,
          etichetta: NOMI_EMOZIONE[e],
          descrizione: `Mizi ${NOMI_EMOZIONE[e]}`,
        })),
        correttaId: situazione.emozione,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Le emozioni di Mizi" round={round} {...props} />;
}
