"use client";

import { useEffect, useMemo } from "react";
import { Ordina, type RoundOrdina } from "@/games/_engine/Ordina";
import { mescola } from "@/games/_engine/casuale";
import { Figura } from "@/games/_engine/figura";
import type { GameProps } from "@/games/_engine/tipi";
import { parla } from "@/lib/giochi/audio";

/**
 * I suoni difficili (6–8 anni).
 * Parole con due o tre consonanti di fila (BR, PR, FR, TR, DR, GR, CR, SP, SC,
 * STR, SPR): si vede il disegno, Mizi dice la parola e il bambino la ricompone
 * coi pezzi. La parola non è scritta da nessuna parte: si ascolta, e il suono
 * difficile va cercato tra i pezzi. «Ascolta ancora» la ripete quante volte si
 * vuole. Ogni parola ha il suo disegno in public/figure.
 */

export const PAROLE: string[][] = [
  ["TRE", "NO"],
  ["PRA", "TO"],
  ["DRA", "GO"],
  ["SPA", "DA"],
  ["STRA", "DA"],
  ["STRE", "GA"],
  ["SCAR", "PA"],
  ["GRIL", "LO"],
  ["BRU", "CO"],
  ["STRUZ", "ZO"],
  ["FRA", "GO", "LA"],
  ["CRI", "CE", "TO"],
  ["SPRE", "MU", "TA"],
  ["FI", "NE", "STRA"],
  ["TRI", "CI", "CLO"],
  ["TROT", "TO", "LA"],
  ["TRAM", "PO", "LI", "NO"],
];

/** Come la dice Mizi: «Strada.» (identica nel copione). */
export const detta = (sillabe: string[]) => {
  const parola = sillabe.join("").toLowerCase();
  return `${parola[0].toUpperCase()}${parola.slice(1)}.`;
};

export const ISTRUZIONE = "Ascolta la parola e metti i pezzi in ordine.";

/** Dice la parola all'inizio del round (dopo l'istruzione) e a ogni tocco. */
function Ascolta({ frase }: { frase: string }) {
  useEffect(() => {
    // Un attimo dopo: l'istruzione del guscio parte per prima, la parola si mette in coda.
    const t = window.setTimeout(() => parla(frase, "it-IT", { accoda: true }), 80);
    return () => window.clearTimeout(t);
  }, [frase]);

  return (
    <button
      type="button"
      onClick={() => parla(frase)}
      data-ascolta
      className="tasto flex min-h-14 items-center gap-3 rounded-bolla border-4 border-crema-scuro bg-white px-6 py-3 text-xl font-extrabold text-notte"
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
        <path d="M4 9v6h4l5 4V5L8 9z" fill="#9b6dd6" />
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#9b6dd6" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Ascolta ancora
    </button>
  );
}

export default function Game(props: GameProps) {
  const round = useMemo<RoundOrdina[]>(() => {
    const corte = mescola(PAROLE.filter((p) => p.length === 2)).slice(0, 3);
    const lunghe = mescola(PAROLE.filter((p) => p.length === 3)).slice(0, props.age >= 7 ? 2 : 3);
    const lunghissime = props.age >= 7 ? PAROLE.filter((p) => p.length === 4) : [];

    return [...corte, ...lunghe, ...lunghissime].map((sillabe) => ({
      istruzione: ISTRUZIONE,
      soluzione: sillabe.map((sillaba, i) => ({
        id: `${sillaba}-${i}`,
        valore: sillaba,
        etichetta: sillaba,
        descrizione: `Pezzo ${sillaba}`,
      })),
      vocePremio: detta(sillabe),
      centro: (
        <div className="flex flex-col items-center gap-3">
          <Figura nome={sillabe.join("").toLowerCase()} alt="" className="h-32 w-32" />
          <Ascolta frase={detta(sillabe)} />
        </div>
      ),
    }));
  }, [props.age]);

  return <Ordina titolo="I suoni difficili" round={round} {...props} />;
}
