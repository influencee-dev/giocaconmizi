"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno, type NomeFigura } from "./arte";
import { mescola } from "./casuale";
import { parla } from "@/lib/audio";
import type { GameProps } from "./tipi";

/**
 * Memory a coppie. La griglia cresce con l'età invece che con un timer:
 * 2x3 per i più piccoli, fino a 3x4 (checklist: niente fretta).
 */

interface Carta {
  chiave: string;
  figura: NomeFigura;
  nome: string;
  scoperta: boolean;
  trovata: boolean;
}

export interface MemoryProps extends GameProps {
  titolo: string;
  figure: { id: NomeFigura; nome: string }[];
}

export function Memory({ titolo, figure, age, onProgress, onComplete, demo = false }: MemoryProps) {
  // 3 coppie sotto i 4 anni, 4 fino a 5, 6 dai 6 in su.
  const coppie = age <= 3 ? 3 : age <= 5 ? 4 : 6;

  const [carte, setCarte] = useState<Carta[]>([]);
  const [aperte, setAperte] = useState<number[]>([]);
  const [trovate, setTrovate] = useState(0);
  const [errori, setErrori] = useState(0);
  const [finito, setFinito] = useState(false);

  /** Stesso motivo di SceltaMultipla: due tap nello stesso tick aprirebbero tre carte. */
  const chiuso = useRef(false);

  const distribuisci = useCallback(() => {
    const scelte = mescola(figure).slice(0, coppie);
    const mazzo = mescola(
      scelte.flatMap((f, i) => [
        { chiave: `${f.id}-a-${i}`, figura: f.id, nome: f.nome, scoperta: false, trovata: false },
        { chiave: `${f.id}-b-${i}`, figura: f.id, nome: f.nome, scoperta: false, trovata: false },
      ]),
    );
    setCarte(mazzo);
    setAperte([]);
    setTrovate(0);
    setErrori(0);
    setFinito(false);
    chiuso.current = false;
  }, [figure, coppie]);

  useEffect(() => {
    distribuisci();
  }, [distribuisci]);

  const tocca = useCallback(
    (i: number) => {
      if (chiuso.current || finito || aperte.length >= 2) return;
      const carta = carte[i];
      if (!carta || carta.trovata || aperte.includes(i)) return;

      const nuoveAperte = [...aperte, i];
      setAperte(nuoveAperte);

      if (nuoveAperte.length < 2) return;

      // Da qui parte un confronto con timer: nessun altro tap fino alla fine.
      chiuso.current = true;

      const [a, b] = nuoveAperte;
      if (carte[a].figura === carte[b].figura) {
        parla(`${carte[a].nome}! Coppia trovata.`);
        window.setTimeout(() => {
          setCarte((precedenti) =>
            precedenti.map((c, idx) => (idx === a || idx === b ? { ...c, trovata: true } : c)),
          );
          setAperte([]);
          chiuso.current = false;
          const nuoveTrovate = trovate + 1;
          setTrovate(nuoveTrovate);
          onProgress?.(nuoveTrovate, coppie);

          if (nuoveTrovate >= coppie) {
            setFinito(true);
            // Le stelle guardano gli errori, non il tempo: nessuno corre.
            const stelle = errori <= 2 ? 3 : errori <= 5 ? 2 : 1;
            onComplete?.({ score: nuoveTrovate, stars: stelle });
          }
        }, 700);
      } else {
        setErrori((n) => n + 1);
        window.setTimeout(() => {
          setAperte([]);
          chiuso.current = false;
        }, 1100);
      }
    },
    [aperte, carte, coppie, errori, finito, onComplete, onProgress, trovate],
  );

  // Demo: scopre le coppie da sola, guardando il mazzo.
  useEffect(() => {
    if (!demo || finito || carte.length === 0 || aperte.length > 0) return;
    const t = window.setTimeout(() => {
      const primo = carte.findIndex((c) => !c.trovata);
      if (primo < 0) return;
      const secondo = carte.findIndex((c, i) => i !== primo && !c.trovata && c.figura === carte[primo].figura);
      tocca(primo);
      window.setTimeout(() => tocca(secondo), 500);
    }, 900);
    return () => window.clearTimeout(t);
  }, [demo, finito, carte, aperte.length, tocca]);

  const colonne = coppie <= 3 ? 3 : coppie === 4 ? 4 : 4;

  return (
    <GameShell
      titolo={titolo}
      istruzione="Tocca due carte uguali per trovare le coppie."
      round={trovate}
      totaleRound={coppie}
      finito={finito}
      stelle={errori <= 2 ? 3 : errori <= 5 ? 2 : 1}
      onAncora={distribuisci}
    >
      <div
        className="grid w-full max-w-lg gap-3"
        style={{ gridTemplateColumns: `repeat(${colonne}, minmax(0, 1fr))` }}
      >
        {carte.map((carta, i) => {
          const visibile = carta.trovata || aperte.includes(i);
          return (
            <button
              key={carta.chiave}
              type="button"
              onClick={() => tocca(i)}
              aria-label={visibile ? carta.nome : "Carta coperta"}
              className={`flex aspect-square items-center justify-center rounded-morbido border-4 p-2 transition-all ${
                carta.trovata
                  ? "border-verde bg-verde/10"
                  : visibile
                    ? "border-viola bg-white"
                    : "border-crema-scuro bg-viola active:scale-95"
              }`}
            >
              {visibile ? (
                <Disegno id={carta.figura} />
              ) : (
                <span className="text-4xl text-white" aria-hidden>
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
