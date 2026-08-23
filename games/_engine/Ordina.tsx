"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { mescola } from "./casuale";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "./tipi";

/**
 * Motore "metti in ordine".
 *
 * Si tocca, non si trascina: il drag su un telefono, con un dito piccolo, è la
 * prima causa di frustrazione. Il bambino tocca i pezzi nell'ordine giusto e
 * quelli scelti salgono nella riga in alto; "Togli l'ultimo" annulla.
 *
 * Copre sillabe, sequenze di storie, puzzle e composizione di mosse.
 */

export interface Pezzo {
  id: string;
  etichetta?: string;
  contenuto?: ReactNode;
  descrizione?: string;
}

export interface RoundOrdina {
  istruzione: string;
  /** I pezzi nell'ordine corretto: il motore li mescola da solo. */
  soluzione: Pezzo[];
  centro?: ReactNode;
  /** Detta a voce quando il round è risolto (es. la parola composta). */
  vocePremio?: string;
}

export interface OrdinaProps extends GameProps {
  titolo: string;
  round: RoundOrdina[];
}

export function Ordina({ titolo, round, age, onProgress, onComplete, demo = false }: OrdinaProps) {
  const [indice, setIndice] = useState(0);
  const [scelti, setScelti] = useState<Pezzo[]>([]);
  const [disponibili, setDisponibili] = useState<Pezzo[]>([]);
  const [punti, setPunti] = useState(0);
  const [primoTentativo, setPrimoTentativo] = useState(true);
  const [risolto, setRisolto] = useState(false);
  const [finito, setFinito] = useState(false);

  const corrente = round[Math.min(indice, round.length - 1)];
  const totale = round.length;

  useEffect(() => {
    setDisponibili(mescola(corrente.soluzione));
    setScelti([]);
    setRisolto(false);
    setPrimoTentativo(true);
  }, [corrente]);

  const completa = useCallback(
    (ordine: Pezzo[]) => {
      const giusto = ordine.every((p, i) => p.id === corrente.soluzione[i].id);

      if (!giusto) {
        setPrimoTentativo(false);
        parla("Non è l'ordine giusto. Riprova.");
        window.setTimeout(() => {
          setScelti([]);
          setDisponibili(mescola(corrente.soluzione));
        }, 900);
        return;
      }

      setRisolto(true);
      parla(corrente.vocePremio ?? "Bravo! Ordine giusto.");

      const nuoviPunti = primoTentativo ? punti + 1 : punti;
      setPunti(nuoviPunti);

      window.setTimeout(() => {
        const prossimo = indice + 1;
        if (prossimo >= totale) {
          setFinito(true);
          onComplete?.({ score: nuoviPunti, stars: stelle(nuoviPunti, totale) });
          return;
        }
        setIndice(prossimo);
        onProgress?.(prossimo, totale);
      }, 1600);
    },
    [corrente, indice, onComplete, onProgress, primoTentativo, punti, totale],
  );

  const prendi = useCallback(
    (pezzo: Pezzo) => {
      if (risolto || finito) return;
      const nuoviScelti = [...scelti, pezzo];
      setScelti(nuoviScelti);
      setDisponibili((precedenti) => precedenti.filter((p) => p.id !== pezzo.id));
      if (pezzo.etichetta) parla(pezzo.etichetta);
      if (nuoviScelti.length === corrente.soluzione.length) {
        window.setTimeout(() => completa(nuoviScelti), 500);
      }
    },
    [completa, corrente.soluzione.length, finito, risolto, scelti],
  );

  const togliUltimo = useCallback(() => {
    if (risolto || scelti.length === 0) return;
    const ultimo = scelti[scelti.length - 1];
    setScelti((precedenti) => precedenti.slice(0, -1));
    setDisponibili((precedenti) => [...precedenti, ultimo]);
  }, [risolto, scelti]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setPunti(0);
    setFinito(false);
    setRisolto(false);
    setScelti([]);
    setDisponibili(mescola(round[0].soluzione));
    setPrimoTentativo(true);
  }, [round]);

  // Demo: compone la soluzione da sola.
  useEffect(() => {
    if (!demo || finito || risolto) return;
    const prossimo = corrente.soluzione[scelti.length];
    if (!prossimo) return;
    const t = window.setTimeout(() => prendi(prossimo), 800);
    return () => window.clearTimeout(t);
  }, [demo, finito, risolto, corrente.soluzione, scelti.length, prendi]);

  return (
    <GameShell
      titolo={titolo}
      istruzione={corrente.istruzione}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={stelle(punti, totale)}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
        {corrente.centro && <div className="flex items-center justify-center">{corrente.centro}</div>}

        {age >= 6 && (
          <p className="text-center text-xl font-bold text-notte">{corrente.istruzione}</p>
        )}

        {/* Riga della soluzione in costruzione */}
        <div
          className={`flex min-h-24 w-full flex-wrap items-center justify-center gap-2 rounded-morbido border-4 border-dashed p-3 ${
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

        {/* Pezzi ancora da usare */}
        <div className="flex w-full flex-wrap items-center justify-center gap-3">
          {disponibili.map((pezzo) => (
            <button
              key={pezzo.id}
              type="button"
              onClick={() => prendi(pezzo)}
              aria-label={pezzo.descrizione ?? pezzo.etichetta ?? pezzo.id}
              className="rounded-morbido border-4 border-crema-scuro bg-white p-3 transition-transform active:scale-95"
            >
              <Tessera pezzo={pezzo} variante="libero" />
            </button>
          ))}
        </div>

        {scelti.length > 0 && !risolto && (
          <button
            type="button"
            onClick={togliUltimo}
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-3 text-lg font-bold text-notte-tenue"
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
