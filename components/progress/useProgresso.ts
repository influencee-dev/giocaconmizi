"use client";

import { useCallback, useState } from "react";

/**
 * Stato di avanzamento condiviso dai giochi.
 * I giochi restano liberi e senza login (piano §2, decisione 1): se il genitore
 * è registrato l'avanzamento viene inviato, altrimenti resta solo in memoria.
 */

export interface RisultatoGioco {
  score: number;
  stars: number;
}

export function useProgresso(totaleRound: number, slug: string) {
  const [round, setRound] = useState(0);
  const [finito, setFinito] = useState(false);
  const [risultato, setRisultato] = useState<RisultatoGioco | null>(null);

  const onProgress = useCallback((roundCorrente: number) => {
    setRound(roundCorrente);
  }, []);

  const onComplete = useCallback(
    (esito: RisultatoGioco) => {
      setRisultato(esito);
      setFinito(true);

      // Best effort: se non c'è sessione la rotta risponde 204 e non succede nulla.
      void fetch("/api/progresso", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, ...esito }),
      }).catch(() => {
        // L'avanzamento non deve mai rompere il gioco: il bambino sta giocando.
      });
    },
    [slug],
  );

  const ricomincia = useCallback(() => {
    setRound(0);
    setFinito(false);
    setRisultato(null);
  }, []);

  return { round, totaleRound, finito, risultato, onProgress, onComplete, ricomincia };
}
