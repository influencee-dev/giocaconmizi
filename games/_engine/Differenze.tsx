"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla } from "@/lib/giochi/audio";
import type { GameProps } from "./tipi";
import { useRound } from "./nucleo";
import { suona } from "@/lib/giochi/suoni";

/**
 * Trova le differenze fra due scene SVG quasi identiche.
 * Le due scene condividono uno sfondo comune; le differenze sono elementi
 * presenti solo nella scena di destra. Ogni trovata riceve un cerchio verde.
 *
 * Dal 17/11/2026 sta sul nucleo comune (nucleo.ts): suoni, stato leggibile,
 * esito con errori e aiuti. Qui un tocco a vuoto è esplorazione, non errore:
 * le stelle guardano quanti sono in tutta la partita, non il singolo round.
 * Dopo tre tocchi a vuoto dall'ultima trovata, un cerchio viola tratteggiato
 * indica una differenza che manca (viola con un bordo bianco sotto: si vede su
 * ogni sfondo; giallo, intorno al sole giallo, sembravano raggi).
 */

/** Le frasi del motore: identiche in content/voce-mizi.json («trova-le-differenze»). */
export const FRASI_DIFFERENZE = {
  trovata: "Trovata!",
  tutte: "Trovate tutte!",
  aiuto: "Ti aiuto io: guarda il cerchio viola.",
  vuoto: "Lì è uguale. Guarda meglio.",
};

/** Dopo quanti tocchi a vuoto di fila compare il cerchio dell'aiuto. */
const VUOTI_PER_AIUTO = 3;

export interface Differenza {
  id: string;
  /** Centro del bersaglio, in coordinate 0–100 della scena. */
  x: number;
  y: number;
  /** L'elemento in più (o diverso) che compare nella seconda scena. */
  disegno: ReactNode;
  /** L'elemento della prima scena, se la differenza è una sostituzione. */
  disegnoOriginale?: ReactNode;
}

export interface Scena {
  sfondo: ReactNode;
  differenze: Differenza[];
}

export interface DifferenzeProps extends GameProps {
  titolo: string;
  scene: Scena[];
}

export function Differenze({ titolo, scene, age, onProgress, onComplete, demo = false }: DifferenzeProps) {
  const totale = scene.length;
  const partita = useRound({
    totale,
    onProgress,
    onComplete,
    erroriPerAiuto: 0, // l'aiuto lo decide questo motore, sui tocchi a vuoto di fila
    pausa: 1400,
    // Fino a tre tocchi a vuoto in tutta la partita sono solo curiosità.
    stelleDi: ({ errori }) => (errori <= 3 ? 3 : errori <= 8 ? 2 : 1),
  });
  const { indice, finito, inPausa, giusto, sbagliato } = partita;

  const [trovateDi, setTrovateDi] = useState<{ scena: number; ids: string[] }>({ scena: 0, ids: [] });
  const [vuoti, setVuoti] = useState(0);
  // Due tocchi nello stesso istante sull'ultima differenza: lo stato non è ancora
  // aggiornato, il ref sì. Prima la scena dopo veniva saltata.
  const giaTrovate = useRef<Set<string>>(new Set());

  const scena = scene[Math.min(indice, scene.length - 1)];
  // Dai 5 anni si cercano 3 differenze, dai 7 tutte quelle previste.
  const daTrovare = age <= 6 ? Math.min(3, scena.differenze.length) : scena.differenze.length;
  const attive = scena.differenze.slice(0, daTrovare);
  const trovate = trovateDi.scena === indice ? trovateDi.ids : NESSUNA;
  const aiutoSu = !inPausa && !finito && vuoti >= VUOTI_PER_AIUTO ? attive.find((d) => !trovate.includes(d.id))?.id : undefined;

  // Scena nuova: si riparte da zero.
  useEffect(() => {
    giaTrovate.current = new Set();
    setVuoti(0);
  }, [indice]);

  const tocca = useCallback(
    (id: string) => {
      if (finito || inPausa || giaTrovate.current.has(id)) return;
      giaTrovate.current.add(id);
      const nuove = [...giaTrovate.current];
      setTrovateDi({ scena: indice, ids: nuove });
      setVuoti(0);
      if (nuove.length >= daTrovare) {
        giusto(FRASI_DIFFERENZE.tutte);
        return;
      }
      suona("coppia");
      parla(FRASI_DIFFERENZE.trovata);
    },
    [daTrovare, finito, inPausa, indice, giusto],
  );

  const sbaglia = useCallback(() => {
    if (finito || inPausa) return;
    const adesso = vuoti + 1;
    setVuoti(adesso);
    if (adesso === VUOTI_PER_AIUTO) sbagliato(FRASI_DIFFERENZE.aiuto, { aiuto: true });
    else sbagliato(FRASI_DIFFERENZE.vuoto, { aiuto: false });
  }, [finito, inPausa, vuoti, sbagliato]);

  useEffect(() => {
    if (!demo || finito || inPausa) return;
    const prossima = attive.find((d) => !trovate.includes(d.id));
    if (!prossima) return;
    const t = window.setTimeout(() => tocca(prossima.id), 1000);
    return () => window.clearTimeout(t);
  }, [demo, finito, inPausa, attive, trovate, tocca]);

  const ricomincia = useCallback(() => {
    giaTrovate.current = new Set();
    setTrovateDi({ scena: 0, ids: [] });
    setVuoti(0);
    partita.ricomincia();
  }, [partita]);

  const rimaste = daTrovare - trovate.length;

  return (
    <GameShell
      titolo={titolo}
      istruzione={`Guarda le due immagini. Trova ${daTrovare} differenze toccandole nell'immagine di sotto.`}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={partita.stelle}
      onAncora={ricomincia}
    >
      <div
        data-differenze
        {...partita.attributi}
        data-trovate={trovate.length}
        data-da-trovare={daTrovare}
        className="flex h-full w-full max-w-md flex-col items-center justify-center gap-3"
      >
        <p className="text-lg font-bold text-viola" role="status">
          {rimaste > 0 ? `Ne mancano ${rimaste}` : "Trovate tutte!"}
        </p>

        {/* Scena originale: si guarda, non si tocca */}
        <svg viewBox="0 0 100 60" className="w-full rounded-morbido bg-white" aria-label="Prima immagine">
          {scena.sfondo}
          {attive.map((d) => (d.disegnoOriginale ? <g key={d.id}>{d.disegnoOriginale}</g> : null))}
        </svg>

        {/* Scena con le differenze: qui si tocca */}
        <svg
          viewBox="0 0 100 60"
          className="w-full rounded-morbido bg-white"
          aria-label="Seconda immagine: tocca le differenze"
          data-scena-da-toccare
          onClick={sbaglia}
        >
          {scena.sfondo}
          {attive.map((d) => (
            <g key={d.id}>{d.disegno}</g>
          ))}
          {aiutoSu &&
            attive
              .filter((d) => d.id === aiutoSu)
              .map((d) => (
                <g key={`${d.id}-aiuto`} data-aiuto-differenza={d.id} className="differenza-aiuto" pointerEvents="none">
                  <circle cx={d.x} cy={d.y} r="9" fill="none" stroke="#FFFFFF" strokeWidth="4" />
                  <circle cx={d.x} cy={d.y} r="9" fill="none" stroke="#7B4CC4" strokeWidth="2.5" strokeDasharray="4 3" />
                </g>
              ))}
          {attive.map((d) => (
            <circle
              key={`${d.id}-bersaglio`}
              data-differenza={d.id}
              data-trovata={trovate.includes(d.id) ? "si" : undefined}
              cx={d.x}
              cy={d.y}
              r="9"
              fill="transparent"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                tocca(d.id);
              }}
            />
          ))}
          {trovate.map((id) => {
            const d = attive.find((x) => x.id === id);
            if (!d) return null;
            return (
              <circle
                key={`${id}-ok`}
                cx={d.x}
                cy={d.y}
                r="8"
                fill="none"
                stroke="#4CAF6D"
                strokeWidth="2.5"
                pointerEvents="none"
              />
            );
          })}
        </svg>
      </div>
    </GameShell>
  );
}

const NESSUNA: string[] = [];
