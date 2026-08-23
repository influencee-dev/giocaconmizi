"use client";

import { useMemo } from "react";
import { Ordina, type RoundOrdina } from "@/games/_engine/Ordina";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Unisci le sillabe (5–7 anni).
 * Sintesi sillabica: si vede l'immagine e si mettono in fila le sillabe.
 * Ogni sillaba viene detta a voce quando la si tocca, così il bambino sente la
 * parola formarsi pezzo per pezzo.
 */

const PAROLE: { figura: NomeFigura; sillabe: string[] }[] = [
  { figura: "casa", sillabe: ["CA", "SA"] },
  { figura: "mela", sillabe: ["ME", "LA"] },
  { figura: "sole", sillabe: ["SO", "LE"] },
  { figura: "luna", sillabe: ["LU", "NA"] },
  { figura: "pesce", sillabe: ["PE", "SCE"] },
  { figura: "torta", sillabe: ["TOR", "TA"] },
  { figura: "gatto", sillabe: ["GAT", "TO"] },
  { figura: "barca", sillabe: ["BAR", "CA"] },
  { figura: "macchina", sillabe: ["MAC", "CHI", "NA"] },
  { figura: "albero", sillabe: ["AL", "BE", "RO"] },
  { figura: "nuvola", sillabe: ["NU", "VO", "LA"] },
];

export default function Game(props: GameProps) {
  const round = useMemo<RoundOrdina[]>(() => {
    // Prima le bisillabe, poi le trisillabe: la difficoltà cresce da sola.
    const bisillabe = mescola(PAROLE.filter((p) => p.sillabe.length === 2)).slice(0, 4);
    const trisillabe = mescola(PAROLE.filter((p) => p.sillabe.length === 3)).slice(0, 2);

    return [...bisillabe, ...trisillabe].map((voce) => {
      const parola = voce.sillabe.join("");
      return {
        istruzione: "Metti le sillabe in ordine per formare la parola.",
        soluzione: voce.sillabe.map((sillaba, i) => ({
          id: `${sillaba}-${i}`,
          etichetta: sillaba,
          descrizione: `Sillaba ${sillaba}`,
        })),
        vocePremio: `${parola}! Bravo.`,
        centro: (
          <div className="h-28 w-28">
            <Disegno id={voce.figura} titolo={parola.toLowerCase()} />
          </div>
        ),
      };
    });
  }, []);

  return <Ordina titolo="Unisci le sillabe" round={round} {...props} />;
}
