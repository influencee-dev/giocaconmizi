"use client";

import { useMemo } from "react";
import { Ordina, type RoundOrdina } from "@/games/_engine/Ordina";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Puzzle facile (3–5 anni).
 * Il disegno è tagliato in strisce orizzontali: si toccano dall'alto verso il
 * basso per rimetterlo insieme. Le strisce passano da 4 a 6, e l'immagine
 * intera resta visibile come guida — a tre anni serve vedere il modello.
 */

const IMMAGINI: { figura: NomeFigura; nome: string }[] = [
  { figura: "razzo", nome: "il razzo" },
  { figura: "casa", nome: "la casa" },
  { figura: "albero", nome: "l'albero" },
  { figura: "fiore", nome: "il fiore" },
  { figura: "macchina", nome: "la macchina" },
  { figura: "barca", nome: "la barca" },
];

/** Una striscia orizzontale del disegno, ritagliata con clipPath. */
function Striscia({ figura, indice, totale }: { figura: NomeFigura; indice: number; totale: number }) {
  const altezza = 100 / totale;
  const id = `taglio-${figura}-${indice}`;

  return (
    <svg viewBox={`0 ${indice * altezza} 100 ${altezza}`} className="block h-full w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <clipPath id={id}>
          <rect x="0" y={indice * altezza} width="100" height={altezza} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {/* `lato` è obbligatorio dentro un altro SVG: senza, il disegno si
            schiacciava nella striscia e i pezzi uscivano vuoti (giro del 27/11/2026). */}
        <Disegno id={figura} lato={100} className="" />
      </g>
    </svg>
  );
}

export default function Game(props: GameProps) {
  const round = useMemo<RoundOrdina[]>(() => {
    const scelte = mescola(IMMAGINI).slice(0, 5);

    return scelte.map((immagine, i) => {
      const pezzi = i < 2 ? 4 : i < 4 ? 5 : 6;

      return {
        istruzione: "Rimetti insieme il disegno: tocca le strisce dall'alto verso il basso.",
        soluzione: Array.from({ length: pezzi }, (_, k) => ({
          id: `pezzo-${k}`,
          contenuto: <Striscia figura={immagine.figura} indice={k} totale={pezzi} />,
          descrizione: `Pezzo ${k + 1}`,
        })),
        vocePremio: `Evviva! È ${immagine.nome}.`,
        // Il modello in trasparenza sta dentro il riquadro: le strisce ci si
        // impilano sopra dall'alto e il disegno si ricompone davvero.
        pila: <Disegno id={immagine.figura} />,
      };
    });
  }, []);

  return <Ordina titolo="Puzzle facile" round={round} {...props} />;
}
