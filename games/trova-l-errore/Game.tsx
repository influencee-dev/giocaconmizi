"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Trova l'errore (6–9 anni).
 * Il debug: il programma c'è già, ma Mizi sbaglia strada. Si legge, si trova
 * il blocco sbagliato e lo si corregge. Cercare l'errore in un programma che
 * quasi funziona è un'abilità diversa dallo scriverlo.
 */

interface Bug {
  /** Il programma mostrato, con l'errore già dentro. */
  programma: string[];
  /** Indice del blocco sbagliato. */
  sbagliato: number;
  /** Le correzioni fra cui scegliere; la prima è quella giusta. */
  correzioni: [string, string, string];
  cosaSuccede: string;
}

const BUG: Bug[] = [
  {
    programma: ["avanti", "avanti", "gira a sinistra", "avanti"],
    sbagliato: 2,
    correzioni: ["gira a destra", "avanti", "torna indietro"],
    cosaSuccede: "Mizi doveva girare verso il pesce, ma è andata dalla parte opposta.",
  },
  {
    programma: ["avanti", "avanti", "avanti", "avanti", "gira a destra"],
    sbagliato: 3,
    correzioni: ["gira a destra", "avanti", "salta"],
    cosaSuccede: "Mizi fa un passo di troppo e finisce contro il muro.",
  },
  {
    programma: ["gira a destra", "avanti", "avanti", "gira a destra", "avanti"],
    sbagliato: 0,
    correzioni: ["gira a sinistra", "avanti", "gira a destra"],
    cosaSuccede: "Mizi parte subito nella direzione sbagliata.",
  },
  {
    programma: ["ripeti 2 volte", "avanti", "gira a destra", "avanti"],
    sbagliato: 0,
    correzioni: ["ripeti 4 volte", "ripeti 1 volta", "avanti"],
    cosaSuccede: "Il giro non si chiude: il quadrato resta a metà.",
  },
  {
    programma: ["avanti", "gira a destra", "gira a destra", "avanti"],
    sbagliato: 2,
    correzioni: ["avanti", "gira a sinistra", "torna al via"],
    cosaSuccede: "Mizi gira due volte di fila e torna da dove è venuta.",
  },
  {
    programma: ["avanti", "avanti", "prendi il pesce", "avanti"],
    sbagliato: 3,
    correzioni: ["ferma", "avanti", "gira a destra"],
    cosaSuccede: "Mizi prende il pesce e poi va avanti lo stesso, cadendo in acqua.",
  },
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return BUG.map((bug) => {
      const [giusta, ...sbagliate] = bug.correzioni;

      return {
        istruzione: `${bug.cosaSuccede} Con che blocco va sostituito quello sbagliato?`,
        mostraTesto: true,
        opzioni: mescola([giusta, ...sbagliate]).map((testo) => ({
          id: testo,
          etichetta: testo,
          descrizione: testo,
        })),
        correttaId: giusta,
        centro: (
          <ol className="w-full max-w-xs rounded-morbido bg-notte p-3 text-left font-mono text-sm text-white">
            {bug.programma.map((blocco, i) => (
              <li
                key={i}
                className={`rounded px-2 py-1 ${
                  i === bug.sbagliato ? "bg-rosso font-bold" : ""
                }`}
              >
                {i + 1}. {blocco}
                {i === bug.sbagliato && <span className="ml-2" aria-label="blocco sbagliato">← qui</span>}
              </li>
            ))}
          </ol>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Trova l'errore" round={round} colonne={1} {...props} />;
}
