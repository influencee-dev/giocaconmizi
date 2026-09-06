"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import type { Comando } from "@/games/_engine/GrigliaCoding";
import { GrigliaScena, ProgrammaScritto, type OggettoInCella } from "@/games/_engine/scena";
import { mescola } from "@/games/_engine/casuale";
import type { NomeFigura } from "@/games/_engine/arte";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Dove arriva Mizi? (6–8 anni).
 * Il programma è già scritto: va letto ed eseguito con gli occhi.
 * Prevedere l'output è l'altra metà del coding (piano §13): finora il bambino
 * scriveva programmi, qui impara a leggerli.
 */

interface Scena {
  partenza: [number, number];
  programma: Comando[];
  /** Il primo oggetto è quello giusto: la cella dove il programma finisce. */
  oggetti: [NomeFigura, number, number][];
}

// Le scene sono fisse e verificate a mano: griglia 4x4, nessun rimbalzo sui
// bordi, i distrattori stanno dove porta un errore tipico (un comando saltato
// o l'ultimo dimenticato). L'oggetto giusto CAMBIA a ogni scena, altrimenti
// si impara "tocca sempre il pesce" invece di leggere il programma.
const SCENE: Scena[] = [
  { partenza: [0, 3], programma: ["destra", "destra"], oggetti: [["pesce", 2, 3], ["mela", 3, 3], ["palla", 1, 2]] },
  { partenza: [0, 3], programma: ["su", "destra"], oggetti: [["mela", 1, 2], ["palla", 1, 3], ["pesce", 0, 2]] },
  { partenza: [1, 3], programma: ["destra", "su", "su"], oggetti: [["palla", 2, 1], ["pesce", 1, 1], ["mela", 2, 2]] },
  { partenza: [0, 0], programma: ["giu", "giu", "destra"], oggetti: [["pesce", 1, 2], ["palla", 0, 2], ["mela", 1, 1]] },
  { partenza: [3, 3], programma: ["sinistra", "sinistra", "su", "su"], oggetti: [["mela", 1, 1], ["pesce", 1, 3], ["palla", 3, 1]] },
  { partenza: [0, 2], programma: ["destra", "destra", "su", "destra"], oggetti: [["palla", 3, 1], ["mela", 2, 1], ["pesce", 3, 2]] },
];

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    return SCENE.map((scena) => {
      const oggetti: OggettoInCella[] = scena.oggetti.map(([figura, x, y]) => ({ figura, x, y }));
      const giusta = scena.oggetti[0][0];

      return {
        istruzione: "Leggi il programma. Dove arriva Mizi?",
        opzioni: mescola(
          scena.oggetti.map(([figura]) => ({ id: figura, disegno: figura, descrizione: figura })),
        ),
        correttaId: giusta,
        centro: (
          <div className="flex w-full flex-col items-center gap-3">
            <GrigliaScena lato={4} mizi={scena.partenza} oggetti={oggetti} />
            <ProgrammaScritto comandi={scena.programma} />
          </div>
        ),
      };
    });
  }, []);

  return <SceltaMultipla titolo="Dove arriva Mizi?" round={round} colonne={3} {...props} />;
}
