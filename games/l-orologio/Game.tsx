"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola, numero } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Che ore sono? (6–9 anni).
 * Livello 1 ore esatte, livello 2 mezz'ore, livello 3 i quarti in cifre,
 * livello 4 l'ora detta a voce ("le tre e un quarto", "le nove meno un
 * quarto"): è così che l'orologio si usa davvero in Italia. L'orologio è
 * un SVG: le lancette sono davvero all'angolo giusto, minuti compresi, così
 * la lancetta delle ore avanza fra un'ora e l'altra come su un orologio vero.
 */

function Orologio({ ore, minuti }: { ore: number; minuti: number }) {
  const angoloOre = (ore % 12) * 30 + minuti * 0.5;
  const angoloMinuti = minuti * 6;

  return (
    <svg viewBox="0 0 100 100" className="h-56 w-56" role="img" aria-label="Orologio">
      <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#1F2430" strokeWidth="3" />
      {Array.from({ length: 12 }, (_, i) => {
        const angolo = (i * 30 - 90) * (Math.PI / 180);
        const x = 50 + Math.cos(angolo) * 37;
        const y = 50 + Math.sin(angolo) * 37;
        return (
          <text
            key={i}
            x={x}
            y={y + 3}
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            fill="#1F2430"
          >
            {i === 0 ? 12 : i}
          </text>
        );
      })}
      <line
        x1="50"
        y1="50"
        x2={50 + Math.cos((angoloOre - 90) * (Math.PI / 180)) * 22}
        y2={50 + Math.sin((angoloOre - 90) * (Math.PI / 180)) * 22}
        stroke="#1F2430"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2={50 + Math.cos((angoloMinuti - 90) * (Math.PI / 180)) * 32}
        y2={50 + Math.sin((angoloMinuti - 90) * (Math.PI / 180)) * 32}
        stroke="#F28AB2"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="3.5" fill="#1F2430" />
    </svg>
  );
}

function scrivi(ore: number, minuti: number): string {
  return `${ore}:${String(minuti).padStart(2, "0")}`;
}

const NOMI_ORE = [
  "dodici", "una", "due", "tre", "quattro", "cinque",
  "sei", "sette", "otto", "nove", "dieci", "undici",
];

/** "3:15" come lo si dice a voce: "le tre e un quarto". */
function aParole(ore: number, minuti: number): string {
  const nome = (quale: number) => {
    const n = NOMI_ORE[quale % 12];
    return n === "una" ? "l'una" : `le ${n}`;
  };
  if (minuti === 0) return `${nome(ore)} in punto`;
  if (minuti === 15) return `${nome(ore)} e un quarto`;
  if (minuti === 30) return `${nome(ore)} e mezza`;
  return `${nome(ore + 1)} meno un quarto`;
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return Array.from({ length: 8 }, (_, i) => {
      // Ore esatte, poi mezz'ore, poi i quarti in cifre, infine a parole.
      const passo = i < 2 ? [0] : i < 4 ? [0, 30] : [0, 15, 30, 45];
      const ore = numero(1, 12);
      // Negli ultimi round niente ore esatte: il punto sono le frasi dei quarti.
      const minuti = i < 6 ? passo[numero(0, passo.length - 1)] : [15, 30, 45][numero(0, 2)];

      if (i >= 6) {
        const giusta = aParole(ore, minuti);
        const alternative = new Set<string>();
        while (alternative.size < 3) {
          const testo = aParole(numero(1, 12), passo[numero(0, passo.length - 1)]);
          if (testo !== giusta) alternative.add(testo);
        }
        return {
          istruzione: "Guarda l'orologio. Come la dici a voce?",
          mostraTesto: true,
          colonne: 1,
          opzioni: mescola([giusta, ...alternative]).map((testo) => ({
            id: testo,
            etichetta: testo,
          })),
          correttaId: giusta,
          centro: <Orologio ore={ore} minuti={minuti} />,
        };
      }

      const alternative = new Set<string>();
      while (alternative.size < 3) {
        const altraOra = numero(1, 12);
        const altriMinuti = passo[numero(0, passo.length - 1)];
        const testo = scrivi(altraOra, altriMinuti);
        if (testo !== scrivi(ore, minuti)) alternative.add(testo);
      }

      return {
        istruzione: "Guarda l'orologio. Che ore sono?",
        mostraTesto: true,
        opzioni: mescola([scrivi(ore, minuti), ...alternative]).map((testo) => ({
          id: testo,
          etichetta: testo,
          // La voce legge l'ora come la si dice, non le cifre.
          descrizione: aParole(
            Number(testo.split(":")[0]),
            Number(testo.split(":")[1]),
          ),
        })),
        correttaId: scrivi(ore, minuti),
        centro: <Orologio ore={ore} minuti={minuti} />,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Che ore sono?" round={round} colonne={2} {...props} />;
}
