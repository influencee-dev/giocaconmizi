"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Le doppie (6–8 anni).
 * Coppie di parole che cambiano significato con una consonante doppia:
 * pala/palla, nono/nonno, sete/sette… Una frase con un buco dice quale serve;
 * Mizi legge la frase e poi le due parole, pronunciando bene la differenza
 * (nella doppia il suono è più lungo). Il fumetto non svela la risposta.
 * Dopo un errore Mizi dice cosa vuol dire ciascuna parola.
 * Dieci round, ognuno con una coppia diversa.
 */

interface Frase {
  prima: string;
  dopo: string;
  giusta: string;
}

export interface Coppia {
  parole: [string, string];
  aiuto: string;
  frasi: Frase[];
}

export const COPPIE: Coppia[] = [
  {
    parole: ["pala", "palla"],
    aiuto: "PALA, con una L, serve per scavare. PALLA, con due L, si lancia e rimbalza.",
    frasi: [
      { prima: "Scavo nella sabbia con la", dopo: ".", giusta: "pala" },
      { prima: "Lancio la", dopo: "al cane.", giusta: "palla" },
    ],
  },
  {
    parole: ["nono", "nonno"],
    aiuto: "NONNO, con due N, è il papà della mamma o del papà. NONO, con una N, viene dopo l'ottavo.",
    frasi: [
      { prima: "Il", dopo: "mi racconta una storia.", giusta: "nonno" },
      { prima: "Dopo l'ottavo viene il", dopo: ".", giusta: "nono" },
    ],
  },
  {
    parole: ["sete", "sette"],
    aiuto: "SETE, con una T, è la voglia di bere. SETTE, con due T, è il numero.",
    frasi: [
      { prima: "Ho tanta", dopo: ": voglio un bicchiere d'acqua.", giusta: "sete" },
      { prima: "La settimana ha", dopo: "giorni.", giusta: "sette" },
    ],
  },
  {
    parole: ["tuta", "tutta"],
    aiuto: "TUTA, con una T, si mette per fare ginnastica. TUTTA, con due T, vuol dire «intera».",
    frasi: [
      { prima: "Per la ginnastica metto la", dopo: ".", giusta: "tuta" },
      { prima: "Ho mangiato", dopo: "la pizza.", giusta: "tutta" },
    ],
  },
  {
    parole: ["pena", "penna"],
    aiuto: "PENNA, con due N, serve per scrivere. PENA, con una N, è quando si è tristi per qualcuno.",
    frasi: [
      { prima: "Scrivo il mio nome con la", dopo: "blu.", giusta: "penna" },
      { prima: "Mi fa", dopo: "il gattino sotto la pioggia.", giusta: "pena" },
    ],
  },
  {
    parole: ["note", "notte"],
    aiuto: "NOTTE, con due T, è quando è buio. NOTE, con una T, sono quelle della musica.",
    frasi: [
      { prima: "Di", dopo: "guardo le stelle.", giusta: "notte" },
      { prima: "Al pianoforte suono le", dopo: ".", giusta: "note" },
    ],
  },
  {
    parole: ["sono", "sonno"],
    aiuto: "SONNO, con due N, è la voglia di dormire. SONO, con una N, è il verbo essere: io sono.",
    frasi: [
      { prima: "Ho tanto", dopo: ": vado a letto.", giusta: "sonno" },
      { prima: "Io", dopo: "la tua amica Mizi.", giusta: "sono" },
    ],
  },
  {
    parole: ["casa", "cassa"],
    aiuto: "CASA, con una S, è dove abiti. CASSA, con due S, è dove si paga, o una grande scatola.",
    frasi: [
      { prima: "Dopo la scuola torno a", dopo: ".", giusta: "casa" },
      { prima: "Al supermercato si paga alla", dopo: ".", giusta: "cassa" },
    ],
  },
  {
    parole: ["copia", "coppia"],
    aiuto: "COPPIA, con due P, vuol dire «due insieme». COPIA, con una P, è una cosa rifatta uguale.",
    frasi: [
      { prima: "Leo e Sara giocano in", dopo: ".", giusta: "coppia" },
      { prima: "Faccio una", dopo: "del disegno per la nonna.", giusta: "copia" },
    ],
  },
  {
    parole: ["caro", "carro"],
    aiuto: "CARRO, con due R, è tirato dai cavalli. CARO, con una R, vuol dire «a cui voglio bene», o che costa tanto.",
    frasi: [
      { prima: "Il", dopo: "è tirato da due cavalli.", giusta: "carro" },
      { prima: "Leo è il mio amico più", dopo: ".", giusta: "caro" },
    ],
  },
  {
    parole: ["capello", "cappello"],
    aiuto: "CAPPELLO, con due P, si mette in testa. CAPELLO, con una P, è uno dei tuoi capelli.",
    frasi: [
      { prima: "D'inverno metto il", dopo: "di lana.", giusta: "cappello" },
      { prima: "Sulla spazzola è rimasto un", dopo: "lungo.", giusta: "capello" },
    ],
  },
  {
    parole: ["fata", "fatta"],
    aiuto: "FATA, con una T, è quella delle favole con la bacchetta magica. FATTA, con due T, vuol dire «finita, preparata».",
    frasi: [
      { prima: "Nella favola la", dopo: "ha una bacchetta magica.", giusta: "fata" },
      { prima: "La torta è", dopo: "con le fragole.", giusta: "fatta" },
    ],
  },
];

/** Dopo il buco: niente spazio se si continua con la punteggiatura (": voglio…", "."). */
const seguito = (dopo: string) => (/^[.,:;!?]/.test(dopo) ? dopo : ` ${dopo}`);

/** La frase come si legge: il buco diventa una pausa. */
const conBuco = (f: Frase) => `${f.prima} …${f.dopo === "." ? "" : seguito(f.dopo)}`;

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const scelte = alcuni(COPPIE, 10, []).map((coppia) => ({ coppia, frase: alcuni(coppia.frasi, 1, [])[0] }));
    return scelte.map(({ coppia, frase }) => {
      const [semplice, doppia] = coppia.parole;
      return {
        istruzione: `${conBuco(frase)} Si scrive ${semplice} o ${doppia}?`,
        opzioni: mescola([...coppia.parole]).map((parola) => ({
          id: parola,
          etichetta: parola,
          descrizione: parola,
        })),
        correttaId: frase.giusta,
        aiuto: coppia.aiuto,
        centro: (
          <p className="max-w-xl text-center text-3xl font-extrabold leading-snug text-notte sm:text-4xl" data-frase>
            {frase.prima} <span className="text-viola">___</span>
            {seguito(frase.dopo)}
          </p>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Le doppie" round={round} colonne={2} {...props} />;
}
