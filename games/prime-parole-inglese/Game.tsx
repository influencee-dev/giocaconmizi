"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { COLORI, type NomeFigura } from "@/games/_engine/arte";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Prime parole in inglese (5–8 anni).
 * L'istruzione è in inglese (Web Speech en-GB), le opzioni sono immagini: si
 * ascolta e si riconosce, senza tradurre. Il tasto 🔊 del guscio ripete.
 */

const PAROLE: { id: string; en: string; figura: NomeFigura; colore?: string }[] = [
  { id: "cat", en: "cat", figura: "gatto" },
  { id: "dog", en: "dog", figura: "cane" },
  { id: "fish", en: "fish", figura: "pesce" },
  { id: "cow", en: "cow", figura: "mucca" },
  { id: "bee", en: "bee", figura: "ape" },
  { id: "sun", en: "sun", figura: "sole" },
  { id: "moon", en: "moon", figura: "moon", colore: undefined },
  { id: "house", en: "house", figura: "casa" },
  { id: "tree", en: "tree", figura: "albero" },
  { id: "car", en: "car", figura: "macchina" },
  { id: "apple", en: "apple", figura: "mela" },
  { id: "flower", en: "flower", figura: "fiore" },
  { id: "boat", en: "boat", figura: "barca" },
  { id: "star", en: "star", figura: "stella", colore: COLORI.giallo },
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    // "moon" nel catalogo si chiama "luna": si corregge qui una volta sola.
    const catalogo = PAROLE.map((p) => ({ ...p, figura: (p.figura === "moon" ? "luna" : p.figura) as NomeFigura }));
    const scelte = mescola(catalogo).slice(0, 6);

    return scelte.map((voce, i) => {
      const quante = i < 3 ? 3 : 4;
      const altre = alcuni(catalogo, quante - 1, [voce]);

      return {
        istruzione: `Where is the ${voce.en}?`,
        linguaIstruzione: "en-GB" as const,
        opzioni: mescola([voce, ...altre]).map((p) => ({
          id: p.id,
          disegno: p.figura,
          colore: p.colore,
          descrizione: p.en,
        })),
        correttaId: voce.id,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Prime parole in inglese" round={round} {...props} />;
}
