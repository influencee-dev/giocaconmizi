"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno, FacciaMizi, Secchiello, type Emozione, type NomeFigura } from "./arte";
import { parla, type Lingua } from "@/lib/audio";
import { stelle, type GameProps } from "./tipi";

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
  /** Letto dallo screen reader al posto dell'etichetta. */
  descrizione?: string;
}

export interface Round {
  /** Detta a voce all'inizio del round. */
  istruzione: string;
  linguaIstruzione?: Lingua;
  /** Il testo dell'istruzione compare a schermo solo dai 6 anni in su. */
  mostraTesto?: boolean;
  /** Cosa sta al centro, sopra le opzioni. */
  centro?: ReactNode;
  opzioni: Opzione[];
  correttaId: string;
}

export interface SceltaMultiplaProps extends GameProps {
  titolo: string;
  round: Round[];
  /** Colonne della griglia di opzioni; di default si adatta al numero. */
  colonne?: number;
}

const LODI = ["Bravo!", "Benissimo!", "Esatto!", "Perfetto!", "Sì!"];
const INCORAGGIAMENTI = ["Quasi! Riprova.", "Non è questo. Riprova.", "Riprova, ci sei quasi."];

export function SceltaMultipla({
  titolo,
  round,
  colonne,
  age,
  onProgress,
  onComplete,
  demo = false,
}: SceltaMultiplaProps) {
  const [indice, setIndice] = useState(0);
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);
  const [sbagliate, setSbagliate] = useState<string[]>([]);
  const [azzeccata, setAzzeccata] = useState<string | null>(null);
  const [primoTentativo, setPrimoTentativo] = useState(true);

  /**
   * Lock di round. I bambini toccano più volte lo stesso bottone, e due tap
   * nello stesso tick userebbero entrambi lo stato del render precedente:
   * il round avanzerebbe due volte. Un ref si aggiorna subito, uno stato no.
   */
  const chiuso = useRef(false);

  const corrente = round[Math.min(indice, round.length - 1)];
  const totale = round.length;

  // Dai 6 anni l'istruzione compare anche scritta; sotto, solo voce e icone.
  const mostraTesto = corrente.mostraTesto ?? age >= 6;

  const prossimoRound = useCallback(
    (giusto: boolean) => {
      const nuoviPunti = giusto ? punti + 1 : punti;
      setPunti(nuoviPunti);

      const prossimo = indice + 1;
      if (prossimo >= totale) {
        setFinito(true);
        onComplete?.({ score: nuoviPunti, stars: stelle(nuoviPunti, totale) });
        return;
      }

      setIndice(prossimo);
      setSbagliate([]);
      setAzzeccata(null);
      setPrimoTentativo(true);
      chiuso.current = false;
      onProgress?.(prossimo, totale);
    },
    [indice, punti, totale, onComplete, onProgress],
  );

  const scegli = useCallback(
    (id: string) => {
      if (chiuso.current || azzeccata || finito) return;

      if (id === corrente.correttaId) {
        chiuso.current = true;
        setAzzeccata(id);
        parla(LODI[indice % LODI.length]);
        // Il punto vale solo se azzeccata al primo colpo; l'errore non toglie nulla.
        window.setTimeout(() => prossimoRound(primoTentativo), 1000);
        return;
      }

      // Errore: feedback gentile, l'opzione si spegne, si resta nel round.
      setSbagliate((precedenti) => [...precedenti, id]);
      setPrimoTentativo(false);
      parla(INCORAGGIAMENTI[sbagliate.length % INCORAGGIAMENTI.length]);
    },
    [azzeccata, finito, corrente.correttaId, indice, primoTentativo, prossimoRound, sbagliate.length],
  );

  // Modalità demo per i reel: risponde giusto da sola, una volta al secondo.
  useEffect(() => {
    if (!demo || finito) return;
    const t = window.setTimeout(() => scegli(corrente.correttaId), 1200);
    return () => window.clearTimeout(t);
  }, [demo, finito, corrente.correttaId, scegli]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setPunti(0);
    setFinito(false);
    setSbagliate([]);
    setAzzeccata(null);
    setPrimoTentativo(true);
    chiuso.current = false;
  }, []);

  const colonneEffettive =
    colonne ?? (corrente.opzioni.length <= 3 ? corrente.opzioni.length : corrente.opzioni.length <= 4 ? 2 : 3);

  return (
    <GameShell
      titolo={titolo}
      istruzione={corrente.istruzione}
      linguaIstruzione={corrente.linguaIstruzione}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={stelle(punti, totale)}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6">
        {corrente.centro && (
          <div className="flex items-center justify-center">{corrente.centro}</div>
        )}

        {mostraTesto && (
          <p className="text-center text-xl font-bold text-notte sm:text-2xl">
            {corrente.istruzione}
          </p>
        )}

        <div
          className="grid w-full gap-4"
          style={{ gridTemplateColumns: `repeat(${colonneEffettive}, minmax(0, 1fr))` }}
        >
          {corrente.opzioni.map((opzione) => (
            <BottoneOpzione
              key={opzione.id}
              opzione={opzione}
              stato={
                azzeccata === opzione.id
                  ? "giusta"
                  : sbagliate.includes(opzione.id)
                    ? "sbagliata"
                    : "libera"
              }
              onScegli={() => scegli(opzione.id)}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
}

/** Vero se l'opzione mostra una figura, non solo testo. */
function contenutoVisivo(opzione: Opzione): boolean {
  return Boolean(opzione.disegno || opzione.tipo === "faccia" || opzione.tipo === "secchiello");
}

function BottoneOpzione({
  opzione,
  stato,
  onScegli,
}: {
  opzione: Opzione;
  stato: "libera" | "giusta" | "sbagliata";
  onScegli: () => void;
}) {
  const bordo =
    stato === "giusta"
      ? "border-verde bg-verde/10 scale-105"
      : stato === "sbagliata"
        ? "border-crema-scuro bg-white opacity-40"
        : "border-crema-scuro bg-white active:scale-95";

  const contenuto = useMemo(() => {
    const scala = opzione.scala ?? 1;
    const stile = { width: `${scala * 100}%`, height: `${scala * 100}%` };

    if (opzione.tipo === "secchiello" && opzione.colore) {
      return <Secchiello colore={opzione.colore} className="h-20 w-20" />;
    }
    if (opzione.tipo === "faccia" && opzione.emozione) {
      return <FacciaMizi emozione={opzione.emozione} className="h-20 w-20" />;
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
    return (
      <span className="text-3xl font-extrabold text-notte sm:text-4xl">{opzione.etichetta}</span>
    );
  }, [opzione]);

  return (
    <button
      type="button"
      onClick={onScegli}
      disabled={stato === "sbagliata"}
      aria-label={opzione.descrizione ?? opzione.etichetta ?? opzione.id}
      className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-morbido border-4 p-3 transition-all ${bordo}`}
    >
      {contenuto}
      {/* L'etichetta accompagna una figura solo quando il gioco la chiede:
          sotto i 6 anni la maggior parte dei giochi resta senza testo. */}
      {opzione.etichetta && opzione.tipo !== "testo" && !!contenutoVisivo(opzione) && (
        <span className="text-lg font-bold text-notte">{opzione.etichetta}</span>
      )}
      {stato === "giusta" && <span className="text-2xl" aria-hidden>✓</span>}
    </button>
  );
}
