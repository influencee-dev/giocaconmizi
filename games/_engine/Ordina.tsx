"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { mescola } from "./casuale";
import { parla } from "@/lib/giochi/audio";
import { suona } from "@/lib/giochi/suoni";
import type { GameProps } from "./tipi";
import { useRound } from "./nucleo";

/**
 * Motore "metti in ordine".
 *
 * Si tocca, non si trascina: il drag su un telefono, con un dito piccolo, è la
 * prima causa di frustrazione. Il bambino tocca i pezzi nell'ordine giusto e
 * quelli scelti salgono nella riga in alto; "Togli l'ultimo" annulla.
 *
 * Copre sillabe, sequenze di storie, puzzle e composizione di mosse.
 *
 * Dal 27/11/2026 sta sul nucleo comune (nucleo.ts), dopo il giro di tutti i
 * giochi: prima due dita nello stesso istante su due pezzi ne facevano sparire
 * uno (la partita non si poteva più finire) e chi sbagliava sempre non riceveva
 * mai un aiuto. Ora lo stato vero sta in un ref, e dopo due ordini sbagliati
 * nello stesso round il pezzo che viene adesso dondola: finché l'aiuto è
 * acceso gli altri pezzi non si prendono, così si arriva sempre in fondo.
 */

export interface Pezzo {
  id: string;
  etichetta?: string;
  contenuto?: ReactNode;
  descrizione?: string;
  /**
   * Valore ai fini della correttezza: due pezzi con lo stesso valore sono
   * intercambiabili. Serve quando la soluzione contiene pezzi identici alla
   * vista (due "batti le mani", due sillabe uguali): senza, il bambino che
   * tocca "l'altro" gemello si sente dire che ha sbagliato.
   */
  valore?: string;
}

export interface RoundOrdina {
  istruzione: string;
  /** I pezzi nell'ordine corretto: il motore li mescola da solo. */
  soluzione: Pezzo[];
  centro?: ReactNode;
  /** Detta a voce quando il round è risolto (es. la parola composta). */
  vocePremio?: string;
  /**
   * Per i puzzle: i pezzi scelti si impilano dall'alto, uno sotto l'altro e
   * senza spazi, sopra questa guida in trasparenza. Così il disegno si
   * ricompone davvero sotto gli occhi.
   */
  pila?: ReactNode;
}

export interface OrdinaProps extends GameProps {
  titolo: string;
  round: RoundOrdina[];
}

export function Ordina({ titolo, round, onProgress, onComplete, demo = false }: OrdinaProps) {
  const totale = round.length;
  const partita = useRound({ totale, onProgress, onComplete, erroriPerAiuto: 2, pausa: 1600 });
  const { indice, finito, inPausa, giusto, sbagliato } = partita;
  const corrente = round[Math.min(indice, totale - 1)];

  const [scelti, setScelti] = useState<Pezzo[]>([]);
  const [disponibili, setDisponibili] = useState<Pezzo[]>([]);
  /** Cresce a ogni «Ancora»: rimescola anche quando il round è di nuovo il primo. */
  const [giro, setGiro] = useState(0);

  // Lo stato vero, letto subito: due tocchi nello stesso istante non devono
  // partire tutti e due dalla stessa fotografia vecchia.
  const stato = useRef<{ scelti: Pezzo[]; disponibili: Pezzo[]; valuta: boolean; errori: number }>({
    scelti: [], disponibili: [], valuta: false, errori: 0,
  });
  const timer = useRef<number | null>(null);

  const stendi = useCallback((soluzione: Pezzo[], errori: number) => {
    const mescolati = mescola(soluzione);
    stato.current = { scelti: [], disponibili: mescolati, valuta: false, errori };
    setScelti([]);
    setDisponibili(mescolati);
  }, []);

  useEffect(() => {
    stendi(corrente.soluzione, 0);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [corrente, giro, stendi]);

  const chiave = (p: Pezzo) => p.valore ?? p.id;
  /** Il pezzo che viene adesso, se l'aiuto è acceso. */
  const attesa = partita.aiuto && !inPausa && !finito ? corrente.soluzione[scelti.length] : undefined;
  const idAiuto = attesa ? disponibili.find((p) => chiave(p) === chiave(attesa))?.id : undefined;

  const valuta = useCallback(() => {
    const s = stato.current;
    const giustoOrdine = s.scelti.every((p, i) => (p.valore ?? p.id) === (corrente.soluzione[i].valore ?? corrente.soluzione[i].id));
    if (giustoOrdine) {
      giusto(corrente.vocePremio ?? "Evviva! Ordine giusto.");
      return;
    }
    // Il primo errore dice cosa non va; dal secondo parla il nucleo (e scatta l'aiuto).
    s.errori += 1;
    sbagliato(s.errori === 1 ? "Non è l'ordine giusto. Riprova." : undefined);
    timer.current = window.setTimeout(() => stendi(corrente.soluzione, s.errori), 900);
  }, [corrente, giusto, sbagliato, stendi]);

  const prendi = useCallback(
    (pezzo: Pezzo) => {
      const s = stato.current;
      if (finito || s.valuta) return;
      // Già preso da un altro tocco arrivato nello stesso istante.
      if (!s.disponibili.some((p) => p.id === pezzo.id)) return;
      // Con l'aiuto acceso si prende solo il pezzo che dondola.
      const serve = corrente.soluzione[s.scelti.length];
      if (partita.aiuto && serve && (pezzo.valore ?? pezzo.id) !== (serve.valore ?? serve.id)) {
        suona("riprova");
        return;
      }
      s.scelti = [...s.scelti, pezzo];
      s.disponibili = s.disponibili.filter((p) => p.id !== pezzo.id);
      setScelti(s.scelti);
      setDisponibili(s.disponibili);
      suona("gira");
      if (pezzo.etichetta) parla(pezzo.etichetta);
      if (s.scelti.length === corrente.soluzione.length) {
        s.valuta = true;
        timer.current = window.setTimeout(valuta, 500);
      }
    },
    [corrente.soluzione, finito, partita.aiuto, valuta],
  );

  const togliUltimo = useCallback(() => {
    const s = stato.current;
    if (s.valuta || s.scelti.length === 0) return;
    const ultimo = s.scelti[s.scelti.length - 1];
    s.scelti = s.scelti.slice(0, -1);
    s.disponibili = [...s.disponibili, ultimo];
    setScelti(s.scelti);
    setDisponibili(s.disponibili);
  }, []);

  const ricomincia = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    partita.ricomincia();
    setGiro((g) => g + 1);
  }, [partita]);

  // Demo: compone la soluzione da sola.
  useEffect(() => {
    if (!demo || finito || inPausa) return;
    const prossimo = corrente.soluzione[scelti.length];
    if (!prossimo) return;
    const t = window.setTimeout(() => prendi(prossimo), 800);
    return () => window.clearTimeout(t);
  }, [demo, finito, inPausa, corrente.soluzione, scelti.length, prendi]);

  const risolto = inPausa || finito;
  const inPila = corrente.pila !== undefined;
  const quanti = corrente.soluzione.length;

  return (
    <GameShell
      titolo={titolo}
      istruzione={corrente.istruzione}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={partita.stelle}
      onAncora={ricomincia}
    >
      <div data-ordina {...partita.attributi} className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6 basso:gap-3">
        {corrente.centro && <div className="flex items-center justify-center">{corrente.centro}</div>}

        {/* La soluzione in costruzione: una riga, oppure una pila sopra la guida (puzzle) */}
        {inPila ? (
          <div
            data-soluzione
            className={`relative h-44 w-44 overflow-hidden rounded-morbido border-4 border-dashed basso:h-40 basso:w-40 ${
              risolto ? "border-verde bg-white" : "border-crema-scuro bg-white/70"
            }`}
          >
            <div className="absolute inset-0 opacity-25" aria-hidden>{corrente.pila}</div>
            <div className="absolute inset-0 flex flex-col">
              {scelti.map((pezzo, i) => (
                <div key={`${pezzo.id}-${i}`} className="w-full" style={{ height: `${100 / quanti}%` }}>
                  {pezzo.contenuto}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            data-soluzione
            className={`flex min-h-24 w-full flex-wrap items-center justify-center gap-2 rounded-morbido border-4 border-dashed p-3 basso:min-h-20 basso:p-2 ${
              risolto ? "border-verde bg-verde/10" : "border-crema-scuro bg-white/60"
            }`}
          >
            {scelti.length === 0 ? (
              <span className="text-notte-tenue">Tocca i pezzi nell&apos;ordine giusto</span>
            ) : (
              scelti.map((pezzo, i) => (
                <Tessera key={`${pezzo.id}-${i}`} pezzo={pezzo} variante="scelto" />
              ))
            )}
          </div>
        )}

        {/* Pezzi ancora da usare */}
        <div className="flex w-full flex-wrap items-center justify-center gap-3 basso:gap-2">
          {disponibili.map((pezzo) => (
            <button
              key={pezzo.id}
              type="button"
              onClick={() => prendi(pezzo)}
              aria-label={pezzo.descrizione ?? pezzo.etichetta ?? pezzo.id}
              data-pezzo={pezzo.id}
              data-aiuto-pezzo={pezzo.id === idAiuto ? "si" : undefined}
              className={`flex min-h-16 min-w-16 touch-manipulation items-center justify-center rounded-morbido border-4 p-3 transition-transform active:scale-95 basso:p-2 ${
                pezzo.id === idAiuto ? "opzione-aiuto border-giallo bg-giallo/20" : "border-crema-scuro bg-white"
              }`}
            >
              {inPila ? (
                <div className="w-36" style={{ aspectRatio: `${quanti} / 1` }}>{pezzo.contenuto}</div>
              ) : (
                <Tessera pezzo={pezzo} variante="libero" />
              )}
            </button>
          ))}
        </div>

        {scelti.length > 0 && !risolto && (
          <button
            type="button"
            onClick={togliUltimo}
            className="min-h-12 rounded-bolla border-2 border-crema-scuro bg-white px-6 py-3 text-lg font-bold text-notte-tenue basso:py-2 basso:text-base"
          >
            ← Togli l&apos;ultimo
          </button>
        )}
      </div>
    </GameShell>
  );
}

function Tessera({ pezzo, variante }: { pezzo: Pezzo; variante: "libero" | "scelto" }) {
  if (pezzo.contenuto) {
    return (
      <div className={variante === "scelto" ? "h-16 w-16" : "h-20 w-20"}>{pezzo.contenuto}</div>
    );
  }
  return (
    <span
      className={`px-2 font-extrabold text-notte ${variante === "scelto" ? "text-2xl" : "text-3xl"}`}
    >
      {pezzo.etichetta}
    </span>
  );
}
