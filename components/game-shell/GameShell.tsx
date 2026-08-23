"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parla, zittisci, type Lingua } from "@/lib/audio";

/**
 * Guscio comune a tutti i giochi (piano §7, prompt "Template gioco").
 * Regole non negoziabili della checklist: niente timer, niente game over,
 * istruzione vocale con icona ripeti, "Esci" piccolo in alto a sinistra,
 * "Ancora" sempre visibile alla fine, festa con coriandoli CSS.
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
      <header className="flex items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/giochi"
          aria-label="Esci dal gioco"
          className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-notte-tenue"
          style={{ minHeight: "2.75rem", minWidth: "2.75rem" }}
        >
          ✕
        </Link>

        <Progresso round={round} totale={totaleRound} />

        <button
          type="button"
          onClick={ripeti}
          aria-label="Ripeti l'istruzione"
          className="flex items-center justify-center rounded-full bg-white text-3xl"
        >
          🔊
        </button>
      </header>

      <h1 className="sr-only">{titolo}</h1>

      <main className="flex flex-1 items-center justify-center overflow-hidden p-4">
        {children}
      </main>

      {finito && <Festa stelle={stelle} onAncora={onAncora} />}
    </div>
  );
}

/** Pallini di avanzamento. Nessun numero, nessun tempo: solo "quanto manca". */
export function Progresso({ round, totale }: { round: number; totale: number }) {
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={round}
      aria-valuemin={0}
      aria-valuemax={totale}
      aria-label={`Round ${round} di ${totale}`}
    >
      {Array.from({ length: totale }, (_, i) => (
        <span
          key={i}
          className={`h-3 w-3 rounded-full ${i < round ? "bg-viola" : "bg-crema-scuro"}`}
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
