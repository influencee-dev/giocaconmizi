"use client";

import { useMemo, useState } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola, uno } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Leggi e rispondi (6–8 anni).
 * Un testo breve in stampatello resta sempre visibile sopra le domande: la
 * comprensione non è memoria, quindi rileggere deve essere possibile e gratis.
 */

interface Brano {
  testo: string[];
  domande: { domanda: string; giusta: string; altre: string[] }[];
}

const BRANI: Brano[] = [
  {
    testo: [
      "MIZI SI SVEGLIA PRESTO.",
      "FUORI PIOVE E IL MARE È GRIGIO.",
      "ALLORA PRENDE L'OMBRELLO GIALLO",
      "E VA A TROVARE LA SUA AMICA RANA.",
    ],
    domande: [
      { domanda: "Che tempo fa?", giusta: "Piove", altre: ["C'è il sole", "Nevica"] },
      { domanda: "Di che colore è l'ombrello?", giusta: "Giallo", altre: ["Rosso", "Azzurro"] },
      { domanda: "Chi va a trovare Mizi?", giusta: "La rana", altre: ["Il gatto", "La mucca"] },
    ],
  },
  {
    testo: [
      "IN GIARDINO C'È UN ALBERO ALTO.",
      "SOTTO L'ALBERO DORME UN GATTO ARANCIONE.",
      "UN'APE GLI VOLA VICINO ALL'ORECCHIO",
      "E IL GATTO SI SVEGLIA DI COLPO.",
    ],
    domande: [
      { domanda: "Dove dorme il gatto?", giusta: "Sotto l'albero", altre: ["Sul tetto", "In casa"] },
      { domanda: "Di che colore è il gatto?", giusta: "Arancione", altre: ["Nero", "Bianco"] },
      { domanda: "Chi sveglia il gatto?", giusta: "Un'ape", altre: ["Un cane", "Il vento"] },
    ],
  },
];

export default function Game(props: GameProps) {
  const [brano] = useState<Brano>(() => uno(BRANI));

  const round = useMemo<Round[]>(() => {
    return brano.domande.map((d) => ({
      istruzione: d.domanda,
      mostraTesto: true,
      opzioni: mescola([d.giusta, ...d.altre]).map((testo) => ({
        id: testo,
        etichetta: testo,
        descrizione: testo,
      })),
      correttaId: d.giusta,
      centro: (
        <div className="testo-lettura max-w-md rounded-morbido bg-white p-4 text-lg leading-loose tracking-wide text-notte">
          {brano.testo.map((riga, i) => (
            <p key={i}>{riga}</p>
          ))}
        </div>
      ),
    }));
  }, [brano]);

  return <SceltaMultipla titolo="Leggi e rispondi" round={round} colonne={1} {...props} />;
}
