"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola } from "@/games/_engine/casuale";
import { Figura } from "@/games/_engine/figura";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * MB o MP? (6–8 anni).
 * Otto parole, ognuna col suo disegno e un buco al posto di MB o MP: si guarda,
 * si pensa alla parola
 * e si toccano le lettere che mancano. Poi due round sulla regola: la stessa
 * parola scritta con la M e con la N, e si tocca quella giusta. Alla risposta
 * giusta Mizi dice la parola intera.
 */

interface Parola {
  prima: string;
  gruppo: "MB" | "MP";
  dopo: string;
}

export const PAROLE: Parola[] = [
  { prima: "ta", gruppo: "MB", dopo: "uro" },
  { prima: "ba", gruppo: "MB", dopo: "ola" },
  { prima: "ga", gruppo: "MB", dopo: "a" },
  { prima: "o", gruppo: "MB", dopo: "rello" },
  { prima: "ba", gruppo: "MB", dopo: "ino" },
  { prima: "colo", gruppo: "MB", dopo: "a" },
  { prima: "tro", gruppo: "MB", dopo: "a" },
  { prima: "o", gruppo: "MB", dopo: "ra" },
  { prima: "ga", gruppo: "MB", dopo: "ero" },
  { prima: "i", gruppo: "MB", dopo: "uto" },
  { prima: "a", gruppo: "MB", dopo: "ulanza" },
  { prima: "ca", gruppo: "MP", dopo: "ana" },
  { prima: "la", gruppo: "MP", dopo: "o" },
  { prima: "ca", gruppo: "MP", dopo: "o" },
  { prima: "te", gruppo: "MP", dopo: "orale" },
  { prima: "la", gruppo: "MP", dopo: "one" },
  { prima: "la", gruppo: "MP", dopo: "ada" },
  { prima: "po", gruppo: "MP", dopo: "iere" },
  { prima: "ca", gruppo: "MP", dopo: "anello" },
  { prima: "la", gruppo: "MP", dopo: "ione" },
  { prima: "za", gruppo: "MP", dopo: "a" },
  { prima: "tra", gruppo: "MP", dopo: "olino" },
  { prima: "la", gruppo: "MP", dopo: "adina" },
];

export const intera = (p: Parola) => `${p.prima}${p.gruppo.toLowerCase()}${p.dopo}`;
/** La lode: la parola detta intera, «Campana!» (identica nel copione). */
export const lode = (p: Parola) => {
  const parola = intera(p);
  return `${parola[0].toUpperCase()}${parola.slice(1)}!`;
};

export const FRASI_MB_MP = {
  buco: "Quali lettere mancano? Tocca quelle giuste.",
  aiutoBuco: "Dilla ad alta voce: senti la B o la P?",
  regola: "Quale parola è scritta giusta?",
  aiutoRegola: "Prima di B e di P ci vuole sempre la M, mai la N.",
} as const;

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const conMB = mescola(PAROLE.filter((p) => p.gruppo === "MB"));
    const conMP = mescola(PAROLE.filter((p) => p.gruppo === "MP"));

    const buchi: Round[] = mescola([...conMB.slice(0, 4), ...conMP.slice(0, 4)]).map((p) => ({
      istruzione: FRASI_MB_MP.buco,
      opzioni: [
        { id: "MB", etichetta: "MB", descrizione: "M B" },
        { id: "MP", etichetta: "MP", descrizione: "M P" },
      ],
      correttaId: p.gruppo,
      lode: lode(p),
      aiuto: FRASI_MB_MP.aiutoBuco,
      centro: (
        <div className="flex flex-col items-center gap-2">
          <Figura nome={intera(p)} alt="" className="h-32 w-32" />
          <p className="text-center text-4xl font-extrabold tracking-wide text-notte sm:text-5xl" data-parola>
            {p.prima}
            <span className="mx-1 text-viola">__</span>
            {p.dopo}
          </p>
        </div>
      ),
    }));

    const regola: Round[] = [conMB[4], conMP[4]].map((p) => {
      const giusta = intera(p);
      const conLaN = `${p.prima}n${p.gruppo[1].toLowerCase()}${p.dopo}`;
      return {
        istruzione: FRASI_MB_MP.regola,
        opzioni: mescola([giusta, conLaN]).map((parola) => ({ id: parola, etichetta: parola, descrizione: parola })),
        correttaId: giusta,
        lode: lode(p),
        aiuto: FRASI_MB_MP.aiutoRegola,
        centro: <Figura nome={giusta} alt="" className="h-32 w-32" />,
      };
    });

    return [...buchi, ...regola];
  }, []);

  return <SceltaMultipla titolo="MB o MP?" round={round} colonne={2} {...props} />;
}
