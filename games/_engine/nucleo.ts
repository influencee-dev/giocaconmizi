"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parla, preparaVoci } from "@/lib/giochi/audio";
import { suona } from "@/lib/giochi/suoni";
import { stelle, type EsitoPartita } from "./tipi";

/**
 * Il nucleo comune dei giochi a round (16/11/2026).
 *
 * Ogni motore faceva per conto suo le stesse cose, ognuno a modo suo: contare
 * i round, non far avanzare due volte per un doppio tocco, decidere le stelle,
 * dire «riprova». Qui stanno una volta sola, uguali per tutti:
 *
 * - il round si chiude subito (un ref, non uno stato): due tocchi nello stesso
 *   istante non lo fanno avanzare due volte;
 * - il punto vale solo se il round è pulito, cioè senza errori: le stelle
 *   contano gli errori evitabili e non scendono mai sotto una;
 * - dopo `erroriPerAiuto` errori nello stesso round scatta l'aiuto (il motore
 *   decide come mostrarlo: di solito la risposta giusta dondola);
 * - un suono a ogni esito, la lode e l'incoraggiamento a voce, senza genere
 *   («Evviva!», mai «Bravo!»);
 * - lo stato della partita si legge dagli attributi `data-`: le prove
 *   automatiche e la demo non devono indovinarlo dal testo;
 * - a fine partita l'esito dice anche errori, aiuti e secondi giocati.
 *
 * Un motore nuovo parte da qui (vedi SceltaMultipla.tsx). Un gioco fatto a
 * mano che non lo usa deve comunque rispettare le stesse regole.
 */

/** Le lodi a voce dopo una risposta giusta: mai al maschile o al femminile. */
export const LODI = ["Evviva!", "Esatto!", "Sì, proprio così!", "Che occhio!", "Giusto!"] as const;

/** Dopo un errore: mai «sbagliato», sempre un invito a riprovare. */
export const INCORAGGIAMENTI = ["Quasi! Riprova.", "Non è questo. Riprova.", "Riprova, ci sei quasi."] as const;

/** Detta quando scatta l'aiuto. */
export const FRASE_AIUTO = "Ti aiuto io: guarda quella che si muove.";

/** Tutte le frasi comuni del nucleo: stanno identiche in content/voce-mizi.json («nucleo»). */
export const FRASI_NUCLEO: readonly string[] = [...LODI, ...INCORAGGIAMENTI, FRASE_AIUTO];

export interface OpzioniRound {
  /** Quanti round ha la partita. */
  totale: number;
  onProgress?: (round: number, totale: number) => void;
  onComplete?: (esito: EsitoPartita) => void;
  /** Dopo quanti errori nello stesso round scatta l'aiuto (0 = mai). */
  erroriPerAiuto?: number;
  /** Millisecondi tra la risposta giusta e il round dopo. */
  pausa?: number;
  /**
   * Le stelle, per i giochi dove un tocco a vuoto è esplorazione e non errore
   * (trova le differenze): di norma contano i round puliti.
   */
  stelleDi?: (conto: { punti: number; totale: number; errori: number; aiuti: number }) => number;
}

export type FaseRound = "gioca" | "giusta" | "finito";

export function useRound({ totale, onProgress, onComplete, erroriPerAiuto = 3, pausa = 1000, stelleDi }: OpzioniRound) {
  const [indice, setIndice] = useState(0);
  const [punti, setPunti] = useState(0);
  const [fase, setFase] = useState<FaseRound>("gioca");
  const [erroriRound, setErroriRound] = useState(0);
  const [aiuto, setAiuto] = useState(false);
  const [errori, setErrori] = useState(0);

  // La regola delle stelle può cambiare identità a ogni disegno: si legge da un ref.
  const regolaStelle = useRef(stelleDi);
  useEffect(() => {
    regolaStelle.current = stelleDi;
  }, [stelleDi]);
  const stelleOra = useCallback(
    (c: { punti: number; errori: number; aiuti: number }) =>
      Math.max(1, Math.min(3, regolaStelle.current?.({ punti: c.punti, totale, errori: c.errori, aiuti: c.aiuti }) ?? stelle(c.punti, totale))),
    [totale],
  );

  // Quello che serve subito, senza aspettare il render: i tocchi veloci dei bambini.
  const chiuso = useRef(false);
  const conto = useRef({ indice: 0, punti: 0, erroriRound: 0, errori: 0, aiuti: 0 });
  const inizio = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    inizio.current = Date.now();
    preparaVoci([...FRASI_NUCLEO]);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const avanza = useCallback(() => {
    const c = conto.current;
    const pulito = c.erroriRound === 0;
    c.punti += pulito ? 1 : 0;
    setPunti(c.punti);

    const prossimo = c.indice + 1;
    if (prossimo >= totale) {
      setFase("finito");
      onComplete?.({
        score: c.punti,
        stars: stelleOra(c),
        errori: c.errori,
        aiuti: c.aiuti,
        secondi: Math.round((Date.now() - inizio.current) / 1000),
      });
      return;
    }

    c.indice = prossimo;
    c.erroriRound = 0;
    chiuso.current = false;
    setIndice(prossimo);
    setErroriRound(0);
    setAiuto(false);
    setFase("gioca");
    onProgress?.(prossimo, totale);
  }, [totale, onComplete, onProgress, stelleOra]);

  /** Risposta giusta: chiude il round, festeggia e dopo la pausa passa oltre. `false` se il round era già chiuso. */
  const giusto = useCallback(
    (lode?: string): boolean => {
      if (chiuso.current) return false;
      chiuso.current = true;
      setFase("giusta");
      suona("coppia");
      parla(lode ?? LODI[conto.current.indice % LODI.length]);
      timer.current = window.setTimeout(avanza, pausa);
      return true;
    },
    [avanza, pausa],
  );

  /**
   * Risposta sbagliata: si resta nel round, senza punizioni. `frase` è il trucco
   * del gioco, se ce l'ha. Con `aiuto: true` è il motore a decidere che l'aiuto
   * scatta adesso (per esempio dopo tre tocchi a vuoto dall'ultima cosa trovata).
   */
  const sbagliato = useCallback(
    (frase?: string, opzioni?: { aiuto?: boolean }): void => {
      if (chiuso.current) return;
      const c = conto.current;
      c.erroriRound += 1;
      c.errori += 1;
      setErroriRound(c.erroriRound);
      setErrori(c.errori);
      const scatta = opzioni?.aiuto ?? (erroriPerAiuto > 0 && c.erroriRound === erroriPerAiuto);
      if (scatta) {
        c.aiuti += 1;
        setAiuto(true);
        suona("aiuto");
      } else {
        suona("riprova");
      }
      parla(frase ?? (scatta ? FRASE_AIUTO : INCORAGGIAMENTI[(c.erroriRound - 1) % INCORAGGIAMENTI.length]));
    },
    [erroriPerAiuto],
  );

  const ricomincia = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    conto.current = { indice: 0, punti: 0, erroriRound: 0, errori: 0, aiuti: 0 };
    chiuso.current = false;
    inizio.current = Date.now();
    setIndice(0);
    setPunti(0);
    setErroriRound(0);
    setErrori(0);
    setAiuto(false);
    setFase("gioca");
  }, []);

  /** Da mettere sul contenitore del gioco: lo stato leggibile da prove e demo. */
  const attributi = useMemo(
    () => ({
      "data-partita": fase,
      "data-round": indice + 1,
      "data-round-totali": totale,
      "data-errori-round": erroriRound,
      "data-aiuto-attivo": aiuto ? "si" : undefined,
    }),
    [fase, indice, totale, erroriRound, aiuto],
  );

  return {
    indice,
    punti,
    fase,
    finito: fase === "finito",
    /** Vero tra la risposta giusta e il round dopo: i tocchi non contano. */
    inPausa: fase === "giusta",
    erroriRound,
    aiuto,
    stelle: stelleOra({ punti, errori, aiuti: conto.current.aiuti }),
    giusto,
    sbagliato,
    ricomincia,
    attributi,
  };
}
