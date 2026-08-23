"use client";

import { useCallback, useEffect, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "./tipi";

/**
 * Unisci i puntini: si tocca in ordine e la linea si disegna.
 * Toccare fuori sequenza non azzera niente: la voce ricorda solo qual è il
 * numero da cercare (checklist: l'errore non punisce).
 */

export interface FiguraPuntini {
  nome: string;
  /** Punti in coordinate 0–100, già nell'ordine da seguire. */
  punti: [number, number][];
  /** Chiude la figura ricongiungendo l'ultimo punto al primo. */
  chiusa?: boolean;
}

export interface PuntiniProps extends GameProps {
  titolo: string;
  figure: FiguraPuntini[];
}

export function Puntini({ titolo, figure, onProgress, onComplete, demo = false }: PuntiniProps) {
  const [indice, setIndice] = useState(0);
  const [fatti, setFatti] = useState(0);
  const [punti, setPunti] = useState(0);
  const [errori, setErrori] = useState(0);
  const [finito, setFinito] = useState(false);

  const figura = figure[Math.min(indice, figure.length - 1)];
  const totale = figure.length;
  const completa = fatti >= figura.punti.length;

  const tocca = useCallback(
    (i: number) => {
      if (finito || completa) return;

      if (i !== fatti) {
        setErrori((n) => n + 1);
        parla(`Cerca il numero ${fatti + 1}.`);
        return;
      }

      const nuoviFatti = fatti + 1;
      setFatti(nuoviFatti);
      parla(String(nuoviFatti));

      if (nuoviFatti >= figura.punti.length) {
        window.setTimeout(() => {
          parla(`È ${figura.nome === "una stella" || figura.nome === "una casa" ? figura.nome : figura.nome}!`);
        }, 500);

        const nuoviPunti = punti + 1;
        setPunti(nuoviPunti);

        window.setTimeout(() => {
          const prossimo = indice + 1;
          if (prossimo >= totale) {
            setFinito(true);
            onComplete?.({ score: nuoviPunti, stars: stelle(totale - Math.min(errori, totale - 1), totale) });
            return;
          }
          setIndice(prossimo);
          setFatti(0);
          onProgress?.(prossimo, totale);
        }, 2200);
      }
    },
    [completa, errori, fatti, figura, finito, indice, onComplete, onProgress, punti, totale],
  );

  useEffect(() => {
    if (!demo || finito || completa) return;
    const t = window.setTimeout(() => tocca(fatti), 500);
    return () => window.clearTimeout(t);
  }, [demo, finito, completa, fatti, tocca]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setFatti(0);
    setPunti(0);
    setErrori(0);
    setFinito(false);
  }, []);

  const tracciato = figura.punti
    .slice(0, fatti)
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");

  const chiusura = completa && figura.chiusa ? " Z" : "";

  return (
    <GameShell
      titolo={titolo}
      istruzione={`Tocca i puntini in ordine, dal numero 1 al numero ${figura.punti.length}.`}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={errori <= 2 ? 3 : errori <= 6 ? 2 : 1}
      onAncora={ricomincia}
    >
      <div className="flex w-full max-w-lg flex-col items-center gap-4">
        <svg viewBox="-6 -6 112 112" className="w-full rounded-morbido bg-white">
          <path
            d={tracciato + chiusura}
            fill={completa ? "#9B6DD633" : "none"}
            stroke="#9B6DD6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {figura.punti.map(([x, y], i) => {
            const fatto = i < fatti;
            const prossimo = i === fatti;
            return (
              <g key={i} onClick={() => tocca(i)} style={{ cursor: "pointer" }}>
                {/* Bersaglio invisibile largo: il dito di un bambino non è preciso */}
                <circle cx={x} cy={y} r="9" fill="transparent" />
                <circle
                  cx={x}
                  cy={y}
                  r={prossimo ? 5 : 3.5}
                  fill={fatto ? "#4CAF6D" : prossimo ? "#F28AB2" : "#FFFFFF"}
                  stroke={fatto ? "#4CAF6D" : "#1F2430"}
                  strokeWidth="1.2"
                />
                <text
                  x={x}
                  y={y - 7}
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="800"
                  fill={fatto ? "#4CAF6D" : "#1F2430"}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {completa && (
          <p className="text-2xl font-extrabold text-viola">È {figura.nome}!</p>
        )}
      </div>
    </GameShell>
  );
}
