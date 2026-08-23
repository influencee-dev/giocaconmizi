"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola, numero } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Che ore sono? (6–9 anni).
 * Livello 1 ore esatte, livello 2 mezz'ore, livello 3 i quarti. L'orologio è
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

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return Array.from({ length: 6 }, (_, i) => {
      // Ore esatte, poi mezz'ore, poi i quarti.
      const passo = i < 2 ? [0] : i < 4 ? [0, 30] : [0, 15, 30, 45];
      const ore = numero(1, 12);
      const minuti = passo[numero(0, passo.length - 1)];

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
          descrizione: `Le ${testo}`,
        })),
        correttaId: scrivi(ore, minuti),
        centro: <Orologio ore={ore} minuti={minuti} />,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Che ore sono?" round={round} colonne={2} {...props} />;
}
