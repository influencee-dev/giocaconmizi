"use client";

import { useCallback, useEffect, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { TOTALE_ROUND } from "./meta";

/**
 * Scaffold da copiare per ogni nuovo gioco (piano §7, prompt "Template gioco").
 *
 * Contratto: ogni gioco riceve { age, difficulty, onProgress, onComplete }.
 * Regole non negoziabili (docs/GAME-DESIGN-CHECKLIST.md):
 * niente timer, niente game over, istruzione vocale, tap target ≥ 64px,
 * una sola azione per schermo, SVG inline invece di immagini esterne.
 */

/** Palette del brand: gli asset dei giochi non escono da qui. */
const TAVOLOZZA = ["#F28AB2", "#F9C846", "#3DB5E6", "#9B6DD6", "#F59A23"];

export interface GameProps {
  age: number;
  difficulty?: 1 | 2 | 3;
  onProgress?: (round: number, totale: number) => void;
  onComplete?: (esito: { score: number; stars: number }) => void;
  /** ?demo=1: il gioco si gioca da solo per 12 secondi, per registrare i reel. */
  demo?: boolean;
}

export default function Game({
  age,
  difficulty = 1,
  onProgress,
  onComplete,
  demo = false,
}: GameProps) {
  const [round, setRound] = useState(0);
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);

  const avanza = useCallback(
    (giusto: boolean) => {
      // L'errore non toglie punti e non blocca: si va avanti comunque (checklist).
      const nuoviPunti = giusto ? punti + 1 : punti;
      const prossimo = round + 1;

      setPunti(nuoviPunti);

      if (prossimo >= TOTALE_ROUND) {
        setFinito(true);
        const stelle = nuoviPunti >= TOTALE_ROUND - 1 ? 3 : nuoviPunti >= TOTALE_ROUND / 2 ? 2 : 1;
        onComplete?.({ score: nuoviPunti, stars: stelle });
        return;
      }

      setRound(prossimo);
      onProgress?.(prossimo, TOTALE_ROUND);
    },
    [punti, round, onComplete, onProgress],
  );

  const ricomincia = useCallback(() => {
    setRound(0);
    setPunti(0);
    setFinito(false);
  }, []);

  // La difficoltà cresce dentro la partita, non solo fra un livello e l'altro:
  // si parte da 3 opzioni e si sale, senza mai superare quelle previste dal livello.
  const opzioni = Math.min(2 + difficulty + Math.floor(round / 2), 3 + difficulty);

  // Sotto i 6 anni non c'è niente da leggere: solo icone e voce (checklist).
  const istruzione =
    age < 6 ? "Tocca il cerchio giusto." : "Tocca il cerchio del colore giusto.";

  // Modalità demo: tocca da sola una risposta al secondo, per 12 secondi.
  useEffect(() => {
    if (!demo || finito) return;
    const timer = setInterval(() => avanza(true), 1200);
    return () => clearInterval(timer);
  }, [demo, finito, avanza]);

  return (
    <GameShell
      titolo="Template"
      istruzione={istruzione}
      round={round}
      totaleRound={TOTALE_ROUND}
      finito={finito}
      stelle={punti >= TOTALE_ROUND - 1 ? 3 : 2}
      onAncora={ricomincia}
    >
      {/* Sostituisci questo blocco con la meccanica vera: SVG inline, un'azione
          per schermo, difficoltà crescente in base a `round`, `age` e `difficulty`. */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {Array.from({ length: opzioni }, (_, opzione) => (
          <button
            key={opzione}
            type="button"
            onClick={() => avanza(opzione === round % opzioni)}
            className="flex h-32 w-32 items-center justify-center rounded-morbido bg-white text-5xl shadow-sm"
            aria-label={`Opzione ${opzione + 1}`}
          >
            <svg viewBox="0 0 100 100" className="h-20 w-20" aria-hidden>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill={TAVOLOZZA[opzione % TAVOLOZZA.length]}
              />
            </svg>
          </button>
        ))}
      </div>
    </GameShell>
  );
}
