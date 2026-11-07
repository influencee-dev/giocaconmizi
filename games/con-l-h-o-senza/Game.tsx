"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Con l'H o senza? (7–9 anni).
 * Ho/o, ha/a, hanno/anno, hai/ai, è/e: si sentono uguali, quindi la voce
 * legge la frase intera senza svelare niente, e si sceglie col ragionamento.
 * Dopo un errore Mizi dice il trucco della famiglia («se puoi dire avevo…»).
 * Dieci round, due per famiglia: ogni partita le copre tutte.
 */

interface Frase {
  prima: string;
  dopo: string;
  giusta: string;
}

interface Famiglia {
  coppia: [string, string];
  aiuto: string;
  frasi: Frase[];
}

const FAMIGLIE: Famiglia[] = [
  {
    coppia: ["ho", "o"],
    aiuto: "Trucco: se puoi dire «avevo», ci vuole HO con l'acca. Se vuol dire «oppure», è O.",
    frasi: [
      { prima: "Io", dopo: "un gatto nero.", giusta: "ho" },
      { prima: "Oggi", dopo: "fatto i compiti.", giusta: "ho" },
      { prima: "Domani", dopo: "la gita con la classe.", giusta: "ho" },
      { prima: "Vuoi il succo", dopo: "l'acqua?", giusta: "o" },
      { prima: "Giochiamo a carte", dopo: "a palla?", giusta: "o" },
      { prima: "Prendi il rosso", dopo: "il blu?", giusta: "o" },
    ],
  },
  {
    coppia: ["ha", "a"],
    aiuto: "Trucco: se puoi dire «aveva», ci vuole HA con l'acca. Altrimenti è A, senza acca.",
    frasi: [
      { prima: "La nonna", dopo: "fatto la torta.", giusta: "ha" },
      { prima: "Mizi", dopo: "freddo.", giusta: "ha" },
      { prima: "Il cane", dopo: "quattro zampe.", giusta: "ha" },
      { prima: "Andiamo", dopo: "casa.", giusta: "a" },
      { prima: "Gioco", dopo: "calcio con Leo.", giusta: "a" },
      { prima: "Do un bacio", dopo: "mamma.", giusta: "a" },
    ],
  },
  {
    coppia: ["hanno", "anno"],
    aiuto: "Trucco: se puoi dire «avevano», ci vuole HANNO. ANNO, senza acca, è quello di dodici mesi.",
    frasi: [
      { prima: "I gatti", dopo: "fame.", giusta: "hanno" },
      { prima: "Le mie amiche", dopo: "una bici.", giusta: "hanno" },
      { prima: "I nonni", dopo: "un orto.", giusta: "hanno" },
      { prima: "Ogni", dopo: "facciamo la festa.", giusta: "anno" },
      { prima: "Il mio fratellino ha un", dopo: "e mezzo.", giusta: "anno" },
      { prima: "Quest'", dopo: "vado in terza.", giusta: "anno" },
    ],
  },
  {
    coppia: ["hai", "ai"],
    aiuto: "Trucco: se puoi dire «avevi», ci vuole HAI. AI, senza acca, vuol dire «a i»: ai pesci, ai bambini.",
    frasi: [
      { prima: "Tu", dopo: "un cane?", giusta: "hai" },
      { prima: "Quanti anni", dopo: "?", giusta: "hai" },
      { prima: "Tu", dopo: "ragione!", giusta: "hai" },
      { prima: "Diamo da mangiare", dopo: "pesci.", giusta: "ai" },
      { prima: "Dico ciao", dopo: "compagni.", giusta: "ai" },
      { prima: "Ho dato i colori", dopo: "bambini.", giusta: "ai" },
    ],
  },
  {
    coppia: ["è", "e"],
    aiuto: "Trucco: se puoi dire «era», ci vuole È con l'accento. Se unisce due cose, è E.",
    frasi: [
      { prima: "Il mare", dopo: "blu.", giusta: "è" },
      { prima: "Oggi", dopo: "domenica.", giusta: "è" },
      { prima: "Mizi", dopo: "una pinguina.", giusta: "è" },
      { prima: "Mangio pane", dopo: "marmellata.", giusta: "e" },
      { prima: "Ho una matita", dopo: "una gomma.", giusta: "e" },
      { prima: "Leo", dopo: "Sara giocano insieme.", giusta: "e" },
    ],
  },
];

/** La frase intera, da leggere: l'apostrofo resta attaccato («Quest'anno»). */
export function fraseIntera(f: Frase): string {
  const attaccata = f.prima.endsWith("'");
  const dopo = f.dopo === "?" ? "?" : ` ${f.dopo}`;
  return `${f.prima}${attaccata ? "" : " "}${f.giusta}${dopo}`;
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const scelte = mescola(
      FAMIGLIE.flatMap((famiglia) => alcuni(famiglia.frasi, 2, []).map((frase) => ({ famiglia, frase }))),
    );
    return scelte.map(({ famiglia, frase }) => {
      const attaccata = frase.prima.endsWith("'");
      return {
        istruzione: `${fraseIntera(frase)} Come si scrive?`,
        opzioni: mescola([...famiglia.coppia]).map((parola) => ({
          id: parola,
          etichetta: parola,
          descrizione: parola,
        })),
        correttaId: frase.giusta,
        aiuto: famiglia.aiuto,
        centro: (
          <p className="max-w-xl text-center text-3xl font-extrabold leading-snug text-notte sm:text-4xl" data-frase>
            {frase.prima}
            {attaccata ? "" : " "}
            <span className="text-viola">___</span>
            {frase.dopo === "?" ? "?" : ` ${frase.dopo}`}
          </p>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Con l'H o senza?" round={round} colonne={2} {...props} />;
}
