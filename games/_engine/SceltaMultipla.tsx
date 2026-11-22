"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno, FacciaMizi, Secchiello, type Emozione, type NomeFigura } from "./arte";
import type { Lingua } from "@/lib/giochi/audio";
import type { GameProps } from "./tipi";
import { useRound } from "./nucleo";

/**
 * Motore "tocca la risposta giusta".
 *
 * È la meccanica di più della metà del catalogo: colori, forme, lettere,
 * numeri, emozioni, inglese, matematica, ortografia, orologio, comprensione.
 * Ogni gioco costruisce i propri round e delega qui interazione, voce,
 * feedback e conteggio.
 *
 * Regole rispettate qui una volta per tutte (docs/GAME-DESIGN-CHECKLIST.md):
 * niente timer, l'errore non punisce e non blocca, feedback positivo,
 * una sola azione per schermo, tap target ampi.
 *
 * Round, punti, stelle, suoni, lodi e aiuto vengono dal nucleo comune
 * (nucleo.ts). Qui restano solo le opzioni da toccare: dopo due errori nello
 * stesso round la risposta giusta dondola, così nessuno resta bloccato.
 *
 * Il movimento (22/11/2026, .claude/skills/accademia-giochi): niente compare o
 * cambia di colpo. Le opzioni di un round nuovo entrano una dopo l'altra, la
 * giusta fa un saltello, quella sbagliata un dondolio morbido prima di
 * spegnersi. Si muovono solo `transform` e `opacity`, la spunta non sposta
 * niente, e con «meno movimento» tutto resta fermo (app/globals.css).
 */

export interface Opzione {
  id: string;
  /** Testo grande dentro il bottone: lettere, numeri, parole. */
  etichetta?: string;
  /** Figura del catalogo SVG. */
  disegno?: NomeFigura;
  /** Colore di riempimento: forme geometriche e secchielli. */
  colore?: string;
  /** Come va disegnata l'opzione. */
  tipo?: "figura" | "secchiello" | "faccia" | "testo";
  emozione?: Emozione;
  /** Fattore di scala 0–1, per i confronti di grandezza. */
  scala?: number;
  /** Quante copie della figura: per i round di conteggio ("three fish"). */
  ripeti?: number;
  /** Letto dallo screen reader al posto dell'etichetta. */
  descrizione?: string;
}

export interface Round {
  /** Detta a voce all'inizio del round. */
  istruzione: string;
  linguaIstruzione?: Lingua;
  /** Ignorato: il guscio mostra sempre l'istruzione nel fumetto di Mizi. */
  mostraTesto?: boolean;
  /** Cosa sta al centro, sopra le opzioni. */
  centro?: ReactNode;
  opzioni: Opzione[];
  correttaId: string;
  /** Il trucco da dire (e mostrare) dopo un errore, al posto del solito «Riprova». */
  aiuto?: string;
  /** Colonne solo per questo round: vince sulle colonne del gioco. */
  colonne?: number;
}

export interface SceltaMultiplaProps extends GameProps {
  titolo: string;
  round: Round[];
  /** Colonne della griglia di opzioni; di default si adatta al numero. */
  colonne?: number;
  /** Chiamata quando si tocca «Ancora»: serve ai giochi che prima fanno scegliere qualcosa (le tabelline). */
  onRicomincia?: () => void;
}

export function SceltaMultipla({
  titolo,
  round,
  colonne,
  onProgress,
  onComplete,
  onRicomincia,
  demo = false,
}: SceltaMultiplaProps) {
  const totale = round.length;
  const [sbagliateDi, setSbagliateDi] = useState<{ round: number; ids: string[] }>({ round: 0, ids: [] });
  // Con due sole opzioni l'aiuto arriva al primo errore: ne resta una.
  const partita = useRound({ totale, onProgress, onComplete, erroriPerAiuto: 2 });
  const { indice, finito, inPausa, giusto, sbagliato } = partita;

  const corrente = round[Math.min(indice, round.length - 1)];
  const sbagliate = sbagliateDi.round === indice ? sbagliateDi.ids : NESSUNA;
  const azzeccata = inPausa || finito ? corrente.correttaId : null;
  const aiutoAttivo = !azzeccata && (partita.aiuto || (sbagliate.length > 0 && corrente.opzioni.length - sbagliate.length === 1));

  const scegli = useCallback(
    (id: string) => {
      if (inPausa || finito) return;
      if (id === corrente.correttaId) {
        // Il punto vale solo se azzeccata al primo colpo; l'errore non toglie nulla.
        giusto();
        return;
      }
      // Errore: feedback gentile, l'opzione si spegne, si resta nel round.
      if (sbagliate.includes(id)) return;
      setSbagliateDi({ round: indice, ids: [...sbagliate, id] });
      sbagliato(corrente.aiuto);
    },
    [inPausa, finito, corrente.correttaId, corrente.aiuto, giusto, sbagliato, sbagliate, indice],
  );

  // Modalità demo per i reel: risponde giusto da sola, una volta al secondo.
  useEffect(() => {
    if (!demo || finito || inPausa) return;
    const t = window.setTimeout(() => scegli(corrente.correttaId), 1200);
    return () => window.clearTimeout(t);
  }, [demo, finito, inPausa, corrente.correttaId, scegli]);

  const ricomincia = useCallback(() => {
    setSbagliateDi({ round: 0, ids: [] });
    partita.ricomincia();
    onRicomincia?.();
  }, [partita, onRicomincia]);

  const colonneEffettive =
    corrente.colonne ??
    colonne ??
    (corrente.opzioni.length <= 3 ? corrente.opzioni.length : corrente.opzioni.length <= 4 ? 2 : 3);

  return (
    <GameShell
      titolo={titolo}
      istruzione={corrente.istruzione}
      linguaIstruzione={corrente.linguaIstruzione}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={partita.stelle}
      onAncora={ricomincia}
    >
      <div data-scelta-multipla {...partita.attributi} className="flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6">
        {corrente.centro && (
          <div key={indice} className="centro-entra flex items-center justify-center">{corrente.centro}</div>
        )}

        <div
          className="grid w-full gap-4"
          style={{ gridTemplateColumns: `repeat(${colonneEffettive}, minmax(0, 1fr))` }}
        >
          {corrente.opzioni.map((opzione, posto) => (
            <BottoneOpzione
              // La chiave cambia a ogni round: i bottoni rinascono e rientrano in scena.
              key={`${indice}-${opzione.id}`}
              posto={posto}
              opzione={opzione}
              stato={
                azzeccata === opzione.id
                  ? "giusta"
                  : sbagliate.includes(opzione.id)
                    ? "sbagliata"
                    : "libera"
              }
              aiuto={aiutoAttivo && opzione.id === corrente.correttaId}
              onScegli={() => scegli(opzione.id)}
            />
          ))}
        </div>

        {corrente.aiuto && sbagliate.length > 0 && !azzeccata && (
          <p role="status" className="max-w-xl rounded-2xl bg-giallo/30 px-4 py-3 text-center text-lg font-bold text-notte" data-aiuto>
            {corrente.aiuto}
          </p>
        )}
      </div>
    </GameShell>
  );
}

const NESSUNA: string[] = [];

/** Vero se l'opzione mostra una figura, non solo testo. */
function contenutoVisivo(opzione: Opzione): boolean {
  return Boolean(opzione.disegno || opzione.tipo === "faccia" || opzione.tipo === "secchiello");
}

function BottoneOpzione({
  opzione,
  posto,
  stato,
  aiuto,
  onScegli,
}: {
  opzione: Opzione;
  /** Il posto nella griglia: decide dopo quanto entra in scena. */
  posto: number;
  stato: "libera" | "giusta" | "sbagliata";
  /** Dopo due errori la risposta giusta dondola. */
  aiuto: boolean;
  onScegli: () => void;
}) {
  const bordo =
    stato === "giusta"
      ? "border-verde bg-verde/10 opzione-giusta"
      : stato === "sbagliata"
        ? "border-crema-scuro bg-white opzione-riprova"
        : aiuto
          ? "border-giallo bg-giallo/20 opzione-aiuto"
          : "border-crema-scuro bg-white opzione-entra active:scale-95";

  const contenuto = useMemo(() => {
    const scala = opzione.scala ?? 1;
    const stile = { width: `${scala * 100}%`, height: `${scala * 100}%` };

    if (opzione.tipo === "secchiello" && opzione.colore) {
      return <Secchiello colore={opzione.colore} className="h-20 w-20" />;
    }
    if (opzione.tipo === "faccia" && opzione.emozione) {
      return <FacciaMizi emozione={opzione.emozione} className="h-20 w-20" />;
    }
    if (opzione.disegno && opzione.ripeti) {
      return (
        <span className="flex max-w-full flex-wrap items-center justify-center gap-1">
          {Array.from({ length: opzione.ripeti }, (_, i) => (
            <Disegno key={i} id={opzione.disegno!} colore={opzione.colore} className="h-9 w-9" />
          ))}
        </span>
      );
    }
    if (opzione.disegno) {
      return (
        <div className="flex h-20 w-20 items-center justify-center">
          <div style={stile} className="flex items-center justify-center">
            <Disegno id={opzione.disegno} colore={opzione.colore} />
          </div>
        </div>
      );
    }
    // Le frasi intere ("le nove meno un quarto") a corpo pieno sbrodolano
    // dai bottoni sui telefoni: oltre le 10 lettere il corpo scende.
    const corpo =
      (opzione.etichetta?.length ?? 0) > 10
        ? "text-xl sm:text-2xl"
        : "text-3xl sm:text-4xl";
    return <span className={`font-extrabold text-notte ${corpo}`}>{opzione.etichetta}</span>;
  }, [opzione]);

  return (
    <button
      type="button"
      onClick={onScegli}
      disabled={stato === "sbagliata"}
      data-opzione={opzione.id}
      data-stato={stato}
      data-aiuto-opzione={aiuto ? "si" : undefined}
      aria-label={opzione.descrizione ?? opzione.etichetta ?? opzione.id}
      // Si animano solo trasformazione, trasparenza e colori: niente che faccia ricalcolare la pagina.
      className={`relative flex min-h-24 touch-manipulation flex-col items-center justify-center gap-1 rounded-morbido border-4 p-3 transition-[transform,opacity,background-color,border-color] duration-150 ${bordo}`}
      style={stato === "libera" && !aiuto ? { animationDelay: `${Math.min(posto, 8) * 45}ms` } : undefined}
    >
      {contenuto}
      {/* L'etichetta accompagna una figura solo quando il gioco la chiede:
          sotto i 6 anni la maggior parte dei giochi resta senza testo. */}
      {opzione.etichetta && opzione.tipo !== "testo" && !!contenutoVisivo(opzione) && (
        <span className="text-lg font-bold text-notte">{opzione.etichetta}</span>
      )}
      {/* In un angolo, fuori dal flusso: quando compare il bottone non cambia altezza. */}
      {stato === "giusta" && (
        <span className="spunta-entra absolute right-2 top-1 text-2xl" aria-hidden>
          ✓
        </span>
      )}
    </button>
  );
}
