"use client";

import { useMemo } from "react";
import { Ordina, type RoundOrdina } from "@/games/_engine/Ordina";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Sequenze logiche (5–8 anni).
 * Mettere in ordine le scene di una storia è ragionare sul tempo: prima,
 * poi, infine. Ogni scena ha una frase, e alla fine la voce legge la storia
 * completa nell'ordine giusto.
 */

interface Scena {
  figura: NomeFigura;
  frase: string;
}

const STORIE: { titolo: string; scene: Scena[] }[] = [
  {
    titolo: "Il seme",
    scene: [
      { figura: "nuvola", frase: "Prima piove sulla terra." },
      { figura: "fiore", frase: "Poi spunta un germoglio." },
      { figura: "albero", frase: "Infine diventa un albero." },
    ],
  },
  {
    titolo: "La gita al mare",
    scene: [
      { figura: "casa", frase: "Mizi esce di casa." },
      { figura: "macchina", frase: "Sale in macchina con il papà." },
      { figura: "barca", frase: "Arriva al porto e sale sulla barca." },
      { figura: "pesce", frase: "In mare vede un pesce arancione." },
    ],
  },
  {
    titolo: "La torta",
    scene: [
      { figura: "mela", frase: "Prima si prendono le mele." },
      { figura: "torta", frase: "Poi si prepara la torta." },
      { figura: "sole", frase: "Si aspetta che sia cotta." },
      { figura: "palla", frase: "Infine si gioca tutti insieme." },
    ],
  },
  {
    titolo: "Il giorno e la notte",
    scene: [
      { figura: "sole", frase: "Al mattino c'è il sole." },
      { figura: "nuvola", frase: "Nel pomeriggio arrivano le nuvole." },
      { figura: "luna", frase: "La sera esce la luna." },
    ],
  },
  {
    titolo: "Il viaggio nello spazio",
    scene: [
      { figura: "casa", frase: "Mizi saluta la sua casa." },
      { figura: "razzo", frase: "Sale sul razzo." },
      { figura: "luna", frase: "Arriva fino alla luna." },
      { figura: "stella", frase: "E saluta le stelle." },
    ],
  },
];

export default function Game(props: GameProps) {
  const round = useMemo<RoundOrdina[]>(() => {
    return mescola(STORIE)
      .slice(0, 5)
      .map((storia) => ({
        istruzione: "Metti le scene nell'ordine giusto: cosa succede prima?",
        soluzione: storia.scene.map((scena, i) => ({
          id: `scena-${i}`,
          contenuto: <Disegno id={scena.figura} titolo={scena.frase} />,
          etichetta: undefined,
          descrizione: scena.frase,
        })),
        vocePremio: storia.scene.map((s) => s.frase).join(" "),
        centro: <p className="text-xl font-extrabold text-viola">{storia.titolo}</p>,
      }));
  }, []);

  return <Ordina titolo="Sequenze logiche" round={round} {...props} />;
}
