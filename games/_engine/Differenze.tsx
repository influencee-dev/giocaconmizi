"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "./tipi";

/**
 * Trova le differenze fra due scene SVG quasi identiche.
 * Le due scene condividono uno sfondo comune; le differenze sono elementi
 * presenti solo nella scena di destra. Ogni trovata riceve un cerchio verde.
 */

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
  const [indice, setIndice] = useState(0);
  const [trovate, setTrovate] = useState<string[]>([]);
  const [errori, setErrori] = useState(0);
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);

  const scena = scene[Math.min(indice, scene.length - 1)];
  const totale = scene.length;
  // Dai 5 anni si cercano 3 differenze, dai 7 tutte quelle previste.
  const daTrovare = age <= 6 ? Math.min(3, scena.differenze.length) : scena.differenze.length;
  const attive = scena.differenze.slice(0, daTrovare);

  const tocca = useCallback(
    (id: string) => {
      if (finito || trovate.includes(id)) return;

      const nuoveTrovate = [...trovate, id];
      setTrovate(nuoveTrovate);
      parla("Trovata!");

      if (nuoveTrovate.length >= daTrovare) {
        const nuoviPunti = punti + 1;
        setPunti(nuoviPunti);
        window.setTimeout(() => {
          const prossimo = indice + 1;
          if (prossimo >= totale) {
            setFinito(true);
            onComplete?.({ score: nuoviPunti, stars: stelle(nuoviPunti, totale) });
            return;
          }
          setIndice(prossimo);
          setTrovate([]);
          onProgress?.(prossimo, totale);
        }, 1400);
      }
    },
    [daTrovare, finito, indice, onComplete, onProgress, punti, totale, trovate],
  );

  const sbaglia = useCallback(() => {
    if (finito) return;
    setErrori((n) => n + 1);
  }, [finito]);

  useEffect(() => {
    if (!demo || finito) return;
    const prossima = attive.find((d) => !trovate.includes(d.id));
    if (!prossima) return;
    const t = window.setTimeout(() => tocca(prossima.id), 1000);
    return () => window.clearTimeout(t);
  }, [demo, finito, attive, trovate, tocca]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setTrovate([]);
    setErrori(0);
    setPunti(0);
    setFinito(false);
  }, []);

  const rimaste = daTrovare - trovate.length;

  return (
    <GameShell
      titolo={titolo}
      istruzione={`Guarda le due immagini. Trova ${daTrovare} differenze toccandole nell'immagine di sotto.`}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={errori <= 3 ? 3 : errori <= 8 ? 2 : 1}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-3">
        <p className="text-lg font-bold text-viola">
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
          onClick={sbaglia}
        >
          {scena.sfondo}
          {attive.map((d) => (
            <g key={d.id}>{d.disegno}</g>
          ))}
          {attive.map((d) => (
            <circle
              key={`${d.id}-bersaglio`}
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
              />
            );
          })}
        </svg>
      </div>
    </GameShell>
  );
}
