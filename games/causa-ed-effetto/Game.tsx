"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Causa ed effetto (6–8 anni).
 * Tre modi di guardare la stessa cosa: una frase che finisce con «perché…» (si
 * cerca la causa), una che finisce con «perciò…» (si cerca l'effetto), e due
 * fatti disegnati (quale dei due fa succedere l'altro?).
 * Otto round: tre, tre e due. Mizi legge la frase; le risposte le legge chi gioca.
 */

interface Fatto {
  testo: string;
  figura: string;
}

interface Frase {
  inizio: string;
  giusta: string;
  sbagliata: string;
}

export const PERCHE: Frase[] = [
  { inizio: "La strada è tutta bagnata perché…", giusta: "ha piovuto.", sbagliata: "oggi è domenica." },
  { inizio: "Il gelato si è sciolto perché…", giusta: "è rimasto al sole.", sbagliata: "era alla fragola." },
  { inizio: "Il gatto è scappato sull'albero perché…", giusta: "un cane gli correva dietro.", sbagliata: "l'albero ha le foglie verdi." },
  { inizio: "Sara ha messo il cappotto perché…", giusta: "fuori fa freddo.", sbagliata: "il cappotto è blu." },
  { inizio: "La piantina è appassita perché…", giusta: "nessuno le ha dato l'acqua.", sbagliata: "sta in un vaso rosso." },
  { inizio: "Leo ha la pancia piena perché…", giusta: "ha mangiato due piatti di pasta.", sbagliata: "ha le scarpe nuove." },
];

export const PERCIO: Frase[] = [
  { inizio: "Fuori è buio, perciò…", giusta: "accendo la luce.", sbagliata: "metto gli occhiali da sole." },
  { inizio: "Ha nevicato tutta la notte, perciò…", giusta: "il giardino è tutto bianco.", sbagliata: "andiamo a fare il bagno al mare." },
  { inizio: "Leo ha corso tantissimo, perciò…", giusta: "adesso ha il fiatone.", sbagliata: "adesso ha i capelli più lunghi." },
  { inizio: "Il bicchiere è caduto per terra, perciò…", giusta: "si è rotto.", sbagliata: "si è riempito d'acqua." },
  { inizio: "Sara ha ripetuto tante volte la poesia, perciò…", giusta: "adesso la sa a memoria.", sbagliata: "adesso l'ha dimenticata." },
  { inizio: "La finestra è rimasta aperta, perciò…", giusta: "in casa è entrato il vento.", sbagliata: "in casa fa più caldo che al sole." },
];

/** Due fatti, ognuno col suo disegno (public/figure): il primo è la causa, il secondo l'effetto. */
export const FATTI: [Fatto, Fatto][] = [
  [{ testo: "Suona la sveglia.", figura: "sveglia-suona" }, { testo: "Leo si sveglia.", figura: "bambino-sveglio" }],
  [{ testo: "Il vento soffia forte.", figura: "vento-forte" }, { testo: "Le foglie cadono dall'albero.", figura: "foglie-cadono" }],
  [{ testo: "Sara annaffia il semino ogni giorno.", figura: "annaffia" }, { testo: "Nel vaso spunta una piantina.", figura: "piantina" }],
  [{ testo: "Piove forte.", figura: "pioggia" }, { testo: "Per terra ci sono le pozzanghere.", figura: "pozzanghere" }],
];

export const FRASI_CAUSA = {
  cercaCausa: "Tocca la causa giusta.",
  cercaEffetto: "Tocca l'effetto giusto.",
  qualeCausa: "Guarda i due fatti. Quale dei due è la causa?",
  qualeEffetto: "Guarda i due fatti. Quale dei due è l'effetto?",
  aiutoCausa: "La causa viene prima: è il fatto che fa succedere l'altro.",
  aiutoEffetto: "L'effetto viene dopo: succede per via della causa.",
} as const;

/** L'istruzione dei round con la frase: Mizi la legge e poi dice cosa cercare. */
export const istruzione = (f: Frase, cerca: string) => `${f.inizio} ${cerca}`;

function roundFrase(f: Frase, tipo: "causa" | "effetto"): Round {
  return {
    istruzione: istruzione(f, tipo === "causa" ? FRASI_CAUSA.cercaCausa : FRASI_CAUSA.cercaEffetto),
    opzioni: mescola([f.giusta, f.sbagliata]).map((testo) => ({ id: testo, etichetta: testo, descrizione: testo })),
    correttaId: f.giusta,
    aiuto: tipo === "causa" ? FRASI_CAUSA.aiutoCausa : FRASI_CAUSA.aiutoEffetto,
    centro: (
      <p className="max-w-md text-center text-2xl font-extrabold leading-snug text-notte sm:text-3xl" data-frase>
        {f.inizio}
      </p>
    ),
  };
}

function roundFatti([causa, effetto]: [Fatto, Fatto], cerca: "causa" | "effetto"): Round {
  return {
    istruzione: cerca === "causa" ? FRASI_CAUSA.qualeCausa : FRASI_CAUSA.qualeEffetto,
    opzioni: mescola([causa, effetto]).map((f) => ({ id: f.figura, immagine: f.figura, etichetta: f.testo, descrizione: f.testo })),
    correttaId: (cerca === "causa" ? causa : effetto).figura,
    aiuto: cerca === "causa" ? FRASI_CAUSA.aiutoCausa : FRASI_CAUSA.aiutoEffetto,
    colonne: 2,
  };
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const cause = mescola(PERCHE).slice(0, 3).map((f) => roundFrase(f, "causa"));
    const effetti = mescola(PERCIO).slice(0, 3).map((f) => roundFrase(f, "effetto"));
    const fatti = mescola(FATTI).slice(0, 2);
    return [
      cause[0], effetti[0], roundFatti(fatti[0], "causa"),
      cause[1], effetti[1], roundFatti(fatti[1], "effetto"),
      cause[2], effetti[2],
    ];
  }, []);

  return <SceltaMultipla titolo="Causa ed effetto" round={round} colonne={1} {...props} />;
}
