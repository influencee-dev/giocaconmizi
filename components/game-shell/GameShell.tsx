"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parla, zittisci, type Lingua } from "@/lib/audio";
import { FacciaMizi } from "@/games/_engine/arte";

/**
 * Guscio comune a tutti i giochi (piano §7, prompt "Template gioco").
 * Regole non negoziabili della checklist: niente timer, niente game over,
 * istruzione vocale con icona ripeti, "Esci" piccolo in alto a sinistra,
 * "Ancora" sempre visibile alla fine, festa con coriandoli CSS.
 *
 * L'istruzione è SEMPRE anche scritta, nel fumetto di Mizi: la voce può non
 * partire (telefono muto, browser senza sintesi) e senza testo lo schermo
 * sembra rotto. Il fumetto è il piano A, la voce il piano B.
 */

export interface GameShellProps {
  titolo: string;
  istruzione: string;
  /** L'istruzione può essere in inglese: lo usa "Prime parole in inglese". */
  linguaIstruzione?: Lingua;
  round: number;
  totaleRound: number;
  finito: boolean;
  stelle?: number;
  onAncora: () => void;
  children: React.ReactNode;
}

export function GameShell({
  titolo,
  istruzione,
  linguaIstruzione = "it-IT",
  round,
  totaleRound,
  finito,
  stelle = 3,
  onAncora,
  children,
}: GameShellProps) {
  const [vocePronta, setVocePronta] = useState(false);
  const livello = Math.min(round + 1, totaleRound);

  useEffect(() => {
    setVocePronta(true);
    return () => zittisci();
  }, []);

  // L'istruzione viene letta a ogni cambio di round: chi non legge deve capire lo stesso.
  useEffect(() => {
    if (!vocePronta || finito) return;
    parla(istruzione, linguaIstruzione);
  }, [istruzione, linguaIstruzione, round, vocePronta, finito]);

  const ripeti = useCallback(() => parla(istruzione, linguaIstruzione), [istruzione, linguaIstruzione]);

  return (
    <div className="fixed inset-0 flex flex-col bg-crema">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/giochi"
          aria-label="Esci dal gioco"
          className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-notte-tenue"
          style={{ minHeight: "2.75rem", minWidth: "2.75rem" }}
        >
          ✕
        </Link>

        <div className="flex flex-col items-center gap-1">
          <span className="rounded-bolla bg-viola px-4 py-1 text-sm font-extrabold text-white">
            Livello {livello} di {totaleRound}
          </span>
          <Progresso round={round} totale={totaleRound} />
        </div>

        <button
          type="button"
          onClick={ripeti}
          aria-label="Ripeti l'istruzione"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm"
          style={{ minHeight: "2.75rem", minWidth: "2.75rem" }}
        >
          🔊
        </button>
      </header>

      <h1 className="sr-only">{titolo}</h1>

      {/* Mizi dice l'istruzione: sempre scritta, un tocco la ripete a voce. */}
      <button
        type="button"
        onClick={ripeti}
        aria-label="Ripeti l'istruzione a voce"
        className="mx-4 flex items-center gap-3 text-left"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <FacciaMizi emozione="felice" className="h-11 w-11" />
        </span>
        <span className="fumetto relative flex-1 rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3">
          <span className="block text-lg font-extrabold leading-snug text-notte">
            {istruzione}
          </span>
        </span>
      </button>

      {/* Se il gioco è più alto dello schermo si scorre: un bottone
          irraggiungibile è un gioco che "non funziona". */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">{children}</div>
      </main>

      {finito && <Festa stelle={stelle} onAncora={onAncora} />}
    </div>
  );
}

/** Pallini di avanzamento: fatti brillare quello corrente, spenti i futuri. */
export function Progresso({ round, totale }: { round: number; totale: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={round}
      aria-valuemin={0}
      aria-valuemax={totale}
      aria-label={`Livello ${Math.min(round + 1, totale)} di ${totale}`}
    >
      {Array.from({ length: totale }, (_, i) => (
        <span
          key={i}
          className={`rounded-full ${
            i < round
              ? "h-2.5 w-2.5 bg-viola"
              : i === round
                ? "h-3 w-3 bg-giallo ring-2 ring-arancione"
                : "h-2.5 w-2.5 bg-crema-scuro"
          }`}
        />
      ))}
    </div>
  );
}

/** Festa finale: coriandoli in CSS puro, zero librerie, zero immagini esterne. */
function Festa({ stelle, onAncora }: { stelle: number; onAncora: () => void }) {
  useEffect(() => {
    parla("Bravissimo! Hai finito.");
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-crema/95 p-6 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="coriandolo"
            style={{
              left: `${(i * 4.17) % 100}%`,
              animationDelay: `${(i % 8) * 0.15}s`,
              backgroundColor: ["#F28AB2", "#F9C846", "#3DB5E6", "#9B6DD6", "#F59A23"][i % 5],
            }}
          />
        ))}
      </div>

      <span className="relative h-24 w-24">
        <FacciaMizi emozione="felice" />
      </span>
      <p className="relative text-5xl" aria-hidden>
        {"⭐".repeat(Math.max(1, Math.min(3, stelle)))}
      </p>
      <p className="relative text-3xl font-extrabold text-notte">Bravissimo!</p>

      <button
        type="button"
        onClick={onAncora}
        className="relative rounded-bolla bg-rosa px-10 py-5 text-2xl font-extrabold text-white"
      >
        Ancora
      </button>

      <Link
        href="/giochi"
        className="relative text-lg font-bold text-viola underline underline-offset-4"
      >
        Scegli un altro gioco
      </Link>
    </div>
  );
}
