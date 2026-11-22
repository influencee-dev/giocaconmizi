"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Le parti della pianta (6–8 anni).
 * Prima si impara il nome: un cerchio rosa indica una parte della pianta e si
 * tocca come si chiama (radici, fusto, rami, foglie, fiori). Poi si impara a
 * cosa serve: Mizi fa una domanda («Quale parte assorbe l'acqua dal terreno?»)
 * e la pianta resta lì da guardare. Nove round: cinque nomi e quattro lavori.
 */

type Parte = "radici" | "fusto" | "rami" | "foglie" | "fiori";

export const PARTI: Record<Parte, { nome: string; lode: string; lavoro: string; cerchio: [number, number, number] }> = {
  radici: { nome: "radici", lode: "Le radici!", lavoro: "Quale parte assorbe l'acqua dal terreno e tiene ferma la pianta?", cerchio: [50, 86, 13] },
  fusto: { nome: "fusto", lode: "Il fusto!", lavoro: "Quale parte sostiene la pianta e porta l'acqua verso l'alto?", cerchio: [50, 60, 10] },
  rami: { nome: "rami", lode: "I rami!", lavoro: "Quale parte sostiene le foglie, i fiori e i frutti?", cerchio: [50, 41, 9] },
  foglie: { nome: "foglie", lode: "Le foglie!", lavoro: "Quale parte serve alla pianta per respirare?", cerchio: [22, 24, 11] },
  fiori: { nome: "fiori", lode: "I fiori!", lavoro: "Quale parte si trasforma in frutto?", cerchio: [76, 22, 10] },
};

export const ISTRUZIONE_NOME = "Guarda il cerchio rosa. Come si chiama questa parte della pianta?";

const FOGLIE: [number, number, number][] = [
  [14, 30, -30], [22, 20, -10], [30, 12, 20], [20, 34, 60], [30, 26, -50], [38, 18, 30], [44, 8, -10],
  [56, 8, 20], [62, 30, 40], [88, 28, 30], [86, 14, -20], [66, 10, -30], [10, 20, 10], [50, 18, 0],
];
const FIORI: [number, number][] = [[76, 22], [62, 18], [84, 36]];

/** La pianta intera, disegnata a parti; `cerchio` indica quella da riconoscere. */
function Pianta({ cerchio }: { cerchio?: [number, number, number] }) {
  return (
    <svg viewBox="0 0 100 100" className="h-48 w-48" role="img" aria-label="Una pianta con radici, fusto, rami, foglie e fiori" data-pianta>
      {/* Terreno, con le radici dentro */}
      <path d="M8 74h84q2 22-42 24Q6 96 8 74z" fill="#b98556" />
      <path d="M8 74h84q.4 5-2 9H10q-2.4-4-2-9z" fill="#000" opacity="0.08" />
      <rect x="6" y="71.5" width="88" height="4.5" rx="2.2" fill="#8ed081" />
      <g fill="none" stroke="#f6e3cf" strokeWidth="2" strokeLinecap="round">
        <path d="M50 75v19M50 76c0 8-6 11-12 16M50 76c2 9 8 11 14 16M49 79c-5 2-11 2-18 4M51 79c6 2 12 2 19 5" />
      </g>

      {/* Fusto e rami */}
      <g fill="none" stroke="#a9683a" strokeWidth="4" strokeLinecap="round">
        <path d="M48 46c-6-6-14-8-22-12M52 46c6-6 14-8 24-12M50 44V26" />
      </g>
      <path d="M44.5 75c2.5-12 1.5-22 1.5-31h8c0 9-1 19 1.5 31z" fill="#a9683a" />
      <path d="M51 44h3c0 9-1 19 1.5 31h-4c-1.5-12-.5-22-.5-31z" fill="#000" opacity="0.14" />

      {/* Chioma: foglie a sinistra e in alto, fiori a destra */}
      <ellipse cx="50" cy="24" rx="44" ry="22" fill="#d9f2cc" />
      {FOGLIE.map(([x, y, giro], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${giro})`}>
          <path d="M0-6.5c4.5 2 4.5 10 0 13-4.5-3-4.5-11 0-13z" fill={i % 2 ? "#4caf6d" : "#6fbf6a"} />
          <path d="M0-5v10" stroke="#2f7a4a" strokeWidth="0.7" />
        </g>
      ))}
      {FIORI.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((giro) => (
            <ellipse key={giro} cx="0" cy="-4.2" rx="2.8" ry="3.6" fill="#fff" stroke="#f28ab2" strokeWidth="0.6" transform={`rotate(${giro})`} />
          ))}
          <circle r="2.4" fill="#f9c846" />
        </g>
      ))}

      {cerchio && (
        <circle cx={cerchio[0]} cy={cerchio[1]} r={cerchio[2]} fill="#f28ab2" fillOpacity="0.12" stroke="#e0457b" strokeWidth="2.5" data-cerchio />
      )}
    </svg>
  );
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const tutte = Object.keys(PARTI) as Parte[];
    const opzioni = (giusta: Parte) =>
      mescola([giusta, ...alcuni(tutte, 3, [giusta])]).map((p) => ({ id: p, etichetta: PARTI[p].nome, descrizione: PARTI[p].nome }));

    const nomi: Round[] = mescola(tutte).map((parte) => ({
      istruzione: ISTRUZIONE_NOME,
      opzioni: opzioni(parte),
      correttaId: parte,
      lode: PARTI[parte].lode,
      centro: <Pianta cerchio={PARTI[parte].cerchio} />,
    }));

    const lavori: Round[] = mescola(tutte)
      .slice(0, 4)
      .map((parte) => ({
        istruzione: PARTI[parte].lavoro,
        opzioni: opzioni(parte),
        correttaId: parte,
        lode: PARTI[parte].lode,
        centro: <Pianta />,
      }));

    return [...nomi, ...lavori];
  }, []);

  return <SceltaMultipla titolo="Le parti della pianta" round={round} colonne={2} {...props} />;
}
