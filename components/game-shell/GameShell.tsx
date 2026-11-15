"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { parla, zittisci, type Lingua } from "@/lib/audio";
import { suona } from "@/lib/suoni";
import { GIOCHI_PER_COCCARDA, leggiAlbum, prossimiGiochi } from "@/lib/album";
import { FigurinaGioco } from "@/components/icone";
import { FacciaMizi } from "@/games/_engine/arte";
import { usePartita, type Partita } from "./partita";

/**
 * Guscio comune a tutti i giochi (piano §7, prompt "Template gioco").
 * Regole non negoziabili della checklist: niente timer, niente game over,
 * istruzione vocale con icona ripeti, "Esci" piccolo in alto a sinistra,
 * "Ancora" sempre visibile alla fine, festa con coriandoli CSS.
 * Dal 15/11/2026 la festa mostra anche la figurina per l'album di Mizi, la
 * coccarda del giorno e il prossimo gioco da provare (lib/album.ts).
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
  const partita = usePartita();
  const azzera = partita?.azzera;

  // «Ancora»: la figurina della partita prima non va mostrata alla prossima festa.
  useEffect(() => {
    if (!finito) azzera?.();
  }, [finito, azzera]);

  useEffect(() => {
    setVocePronta(true);
    return () => zittisci();
  }, []);

  // L'istruzione viene letta a ogni cambio di round: chi non legge deve capire
  // lo stesso. In coda, non sopra: prima si lascia finire il «Brava!» del round
  // appena chiuso (prima lo tagliava a metà).
  useEffect(() => {
    if (!vocePronta || finito) return;
    parla(istruzione, linguaIstruzione, { accoda: true });
  }, [istruzione, linguaIstruzione, round, vocePronta, finito]);

  const ripeti = useCallback(() => parla(istruzione, linguaIstruzione), [istruzione, linguaIstruzione]);

  return (
    // z-50: lo schermo di gioco copre tutto, banner informativo compreso —
    // l'avviso è per i genitori, non deve comparire sopra un gioco.
    <div className="fixed inset-0 z-50 flex flex-col bg-crema">
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
      {/* Non un secondo <main>: la pagina ne ha già uno. */}
      <div className="flex-1 overflow-y-auto p-4" data-campo-di-gioco>
        <div className="flex min-h-full items-center justify-center">{children}</div>
      </div>

      {finito && <Festa stelle={stelle} onAncora={onAncora} partita={partita} />}
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

/**
 * Festa finale: coriandoli in CSS puro, zero librerie, zero immagini esterne.
 * Con una partita vera (pagina /gioca) mostra la figurina per l'album, i
 * pallini della coccarda di oggi e il prossimo gioco: è da qui che si passa
 * da un gioco all'altro.
 */
function Festa({ stelle, onAncora, partita }: { stelle: number; onAncora: () => void; partita: Partita | null }) {
  const esito = partita?.esito ?? null;
  const esitoVivo = useRef(esito);
  useEffect(() => {
    esitoVivo.current = esito;
  }, [esito]);
  const quante = Math.max(1, Math.min(3, stelle));

  useEffect(() => {
    suona("festa");
    // Un attimo di attesa: l'esito dell'album arriva nello stesso giro, e la
    // frase in coda lascia finire l'ultimo «Coppia trovata!» del gioco.
    const t = window.setTimeout(() => {
      const e = esitoVivo.current;
      if (e?.nuova || e?.coccardaOra) suona("figurina");
      parla(
        e?.coccardaOra
          ? "Evviva! Hai vinto la coccarda di oggi!"
          : e?.nuova
            ? "Evviva! Ce l'hai fatta! Hai una figurina nuova!"
            : "Evviva! Ce l'hai fatta!",
        "it-IT",
        { accoda: true },
      );
    }, 350);
    return () => window.clearTimeout(t);
  }, []);

  const questo = partita?.giochi.find((g) => g.slug === partita.slug);
  // L'album si legge qui e non dal contesto: serve solo a scegliere il prossimo gioco.
  const prossimo = partita && esito ? prossimiGiochi(partita.giochi, leggiAlbum(), partita.eta, partita.slug, 1)[0] : undefined;
  const etaProssimo = prossimo && partita ? Math.min(Math.max(partita.eta, prossimo.ageMin), prossimo.ageMax) : 0;
  const totale = partita?.giochi.length ?? 0;
  const mancano = esito ? GIOCHI_PER_COCCARDA - esito.oggi : 0;

  return (
    <div className="absolute inset-0 overflow-y-auto bg-crema/95" data-festa>
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

      <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center gap-4 p-5 text-center">
        <span className="h-20 w-20">
          <FacciaMizi emozione="felice" />
        </span>
        <p className="flex gap-1 text-5xl" role="img" aria-label={`${quante} ${quante === 1 ? "stella" : "stelle"} su 3`} data-stelle={quante}>
          {Array.from({ length: quante }, (_, i) => (
            <span key={i} className="stella-festa" style={{ animationDelay: `${0.15 + i * 0.18}s` }} aria-hidden>
              ⭐
            </span>
          ))}
        </p>
        <p className="text-3xl font-extrabold text-notte">Evviva, ce l&apos;hai fatta!</p>

        {partita && esito && questo && (
          <div className="flex w-full flex-col gap-3 rounded-morbido border-2 border-crema-scuro bg-white p-4" data-esito-album>
            <div className="flex items-center gap-3 text-left">
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-viola bg-crema p-2 ${esito.nuova ? "figurina-nuova" : ""}`} aria-hidden>
                <FigurinaGioco slug={partita.slug} skill={questo.skill} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-lg font-extrabold leading-tight text-notte" data-figurina={esito.nuova ? "nuova" : esito.record ? "record" : "gia"}>
                  {esito.nuova ? "Nuova figurina!" : esito.record ? "Nuovo record di stelle!" : "Figurina già nell'album"}
                </span>
                <span className="text-sm font-bold text-notte-tenue" data-figurine={esito.figurine}>
                  {esito.figurine} di {totale} nell&apos;album di Mizi
                </span>
              </span>
            </div>
            <span className="block h-2.5 overflow-hidden rounded-full bg-crema-scuro" aria-hidden>
              <span className="block h-full rounded-full bg-viola-forte" style={{ width: `${Math.max(4, (esito.figurine / Math.max(1, totale)) * 100)}%` }} />
            </span>
            <div className="flex items-center gap-3 text-left" data-oggi={esito.oggi}>
              <span className="flex shrink-0 gap-1.5" aria-hidden>
                {Array.from({ length: GIOCHI_PER_COCCARDA }, (_, i) => (
                  <span key={i} className={`h-4 w-4 rounded-full ${i < esito.oggi ? "bg-arancione" : "bg-crema-scuro"}`} />
                ))}
              </span>
              <span className="text-sm font-bold text-notte">
                {esito.coccardaOra
                  ? "Coccarda di oggi conquistata! 🎖️"
                  : mancano <= 0
                    ? "La coccarda di oggi è già tua"
                    : mancano === 1
                      ? "Ancora un gioco diverso e vinci la coccarda di oggi"
                      : `Ancora ${mancano} giochi diversi per la coccarda di oggi`}
              </span>
            </div>
          </div>
        )}

        {prossimo && (
          <Link
            href={`/giochi/${prossimo.slug}/gioca?eta=${etaProssimo}`}
            className="flex w-full items-center gap-3 rounded-bolla bg-rosa-forte p-3 pr-5 text-left text-white"
            data-prossimo-gioco={prossimo.slug}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white p-2" aria-hidden>
              <FigurinaGioco slug={prossimo.slug} skill={prossimo.skill} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-bold opacity-90">Prossimo gioco</span>
              <span className="text-xl font-extrabold leading-tight">{prossimo.title}</span>
            </span>
            <span className="text-2xl" aria-hidden>
              →
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={onAncora}
          className={
            prossimo
              ? "min-h-14 w-full rounded-bolla border-2 border-rosa-forte bg-white px-8 text-xl font-extrabold text-rosa-forte"
              : "rounded-bolla bg-rosa-forte px-10 py-5 text-2xl font-extrabold text-white"
          }
          data-ancora
        >
          Ancora
        </button>

        <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-lg font-bold">
          {partita && esito && (
            <Link href="/giochi/album" className="text-viola-forte underline underline-offset-4" data-apri-album>
              Apri l&apos;album
            </Link>
          )}
          <Link href="/giochi" className="text-viola-forte underline underline-offset-4">
            Scegli un altro gioco
          </Link>
        </p>
      </div>
    </div>
  );
}
