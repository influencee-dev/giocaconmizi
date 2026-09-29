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
 * Otto round: sei di parole (catalogo di 24, cambia a ogni partita) e due
 * di colori, con i cerchi colorati — "Where is the red circle?".
 */

const PAROLE: { id: string; en: string; figura: NomeFigura; colore?: string }[] = [
  // Animali
  { id: "cat", en: "cat", figura: "gatto" },
  { id: "dog", en: "dog", figura: "cane" },
  { id: "fish", en: "fish", figura: "pesce" },
  { id: "cow", en: "cow", figura: "mucca" },
  { id: "bee", en: "bee", figura: "ape" },
  { id: "sheep", en: "sheep", figura: "pecora" },
  { id: "duck", en: "duck", figura: "papera" },
  { id: "frog", en: "frog", figura: "rana" },
  { id: "bear", en: "bear", figura: "orso" },
  { id: "penguin", en: "penguin", figura: "pinguino" },
  // Cose della giornata
  { id: "sun", en: "sun", figura: "sole" },
  { id: "moon", en: "moon", figura: "luna" },
  { id: "house", en: "house", figura: "casa" },
  { id: "tree", en: "tree", figura: "albero" },
  { id: "car", en: "car", figura: "macchina" },
  { id: "apple", en: "apple", figura: "mela" },
  { id: "flower", en: "flower", figura: "fiore" },
  { id: "boat", en: "boat", figura: "barca" },
  { id: "ball", en: "ball", figura: "palla" },
  { id: "book", en: "book", figura: "libro" },
  { id: "cake", en: "cake", figura: "torta" },
  { id: "cloud", en: "cloud", figura: "nuvola" },
  { id: "rocket", en: "rocket", figura: "razzo" },
  { id: "star", en: "star", figura: "stella", colore: COLORI.giallo },
];

/** I colori, come cerchi pieni: i primi che si imparano in inglese. */
const TINTE: { id: string; en: string; colore: string }[] = [
  { id: "red", en: "red", colore: COLORI.rosso },
  { id: "blue", en: "blue", colore: COLORI.blu },
  { id: "green", en: "green", colore: COLORI.verde },
  { id: "yellow", en: "yellow", colore: COLORI.giallo },
  { id: "orange", en: "orange", colore: COLORI.arancione },
  { id: "pink", en: "pink", colore: COLORI.rosa },
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const scelte = mescola(PAROLE).slice(0, 6);

    const diParole: Round[] = scelte.map((voce, i) => {
      const quante = i < 3 ? 3 : 4;
      const altre = alcuni(PAROLE, quante - 1, [voce]);

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

    const diColori: Round[] = mescola(TINTE)
      .slice(0, 2)
      .map((tinta) => {
        const altre = alcuni(TINTE, 3, [tinta]);
        return {
          istruzione: `Where is the ${tinta.en} circle?`,
          linguaIstruzione: "en-GB" as const,
          opzioni: mescola([tinta, ...altre]).map((t) => ({
            id: t.id,
            disegno: "cerchio" as NomeFigura,
            colore: t.colore,
            descrizione: t.en,
          })),
          correttaId: tinta.id,
        };
      });

    // I colori spezzano il ritmo a metà e in chiusura.
    return [...diParole.slice(0, 3), diColori[0], ...diParole.slice(3), diColori[1]];
  }, []);

  return <SceltaMultipla titolo="Prime parole in inglese" round={round} {...props} />;
}
