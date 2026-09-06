"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno } from "./arte";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "./tipi";

/**
 * Coding su griglia: si compone un programma, si preme Via, Mizi lo esegue.
 *
 * Due modalità, come da piano §13:
 * - "frecce": direzioni assolute (su, giù, sinistra, destra), dai 3 anni.
 * - "blocchi": avanti / gira, cioè il punto di vista del personaggio, dai 6 anni,
 *   con "ripeti" dai livelli avanzati.
 *
 * Se il programma sbaglia, Mizi si ferma dov'è e torna al via: nessun game over,
 * si guarda cosa è successo e si corregge (checklist).
 */

export type Comando = "su" | "giu" | "sinistra" | "destra" | "avanti" | "giraDx" | "giraSx";

export interface Livello {
  /** Lato della griglia. */
  lato: number;
  partenza: [number, number];
  arrivo: [number, number];
  /** Celle non attraversabili, come "x,y". */
  muri?: string[];
  /** Direzione iniziale in modalità blocchi: 0 su, 1 destra, 2 giù, 3 sinistra. */
  direzione?: number;
  /** Numero massimo di comandi: è il vincolo che rende il livello un problema. */
  massimo?: number;
  ripeti?: boolean;
}

export interface GrigliaCodingProps extends GameProps {
  titolo: string;
  modalita: "frecce" | "blocchi";
  livelli: Livello[];
}

const ETICHETTE: Record<Comando, string> = {
  su: "↑",
  giu: "↓",
  sinistra: "←",
  destra: "→",
  avanti: "↑ avanti",
  giraDx: "↻ gira a destra",
  giraSx: "↺ gira a sinistra",
};

const NOMI: Record<Comando, string> = {
  su: "su",
  giu: "giù",
  sinistra: "sinistra",
  destra: "destra",
  avanti: "avanti",
  giraDx: "gira a destra",
  giraSx: "gira a sinistra",
};

const SPOSTAMENTI: [number, number][] = [
  [0, -1], // su
  [1, 0], // destra
  [0, 1], // giù
  [-1, 0], // sinistra
];

export function GrigliaCoding({
  titolo,
  modalita,
  livelli,
  onProgress,
  onComplete,
  demo = false,
}: GrigliaCodingProps) {
  const [indice, setIndice] = useState(0);
  const [programma, setProgramma] = useState<Comando[]>([]);
  const [posizione, setPosizione] = useState<[number, number]>([0, 0]);
  const [direzione, setDirezione] = useState(0);
  const [inEsecuzione, setInEsecuzione] = useState(false);
  const [punti, setPunti] = useState(0);
  const [tentativi, setTentativi] = useState(0);
  const [finito, setFinito] = useState(false);
  const timers = useRef<number[]>([]);

  const livello = livelli[Math.min(indice, livelli.length - 1)];
  const totale = livelli.length;
  // Memoizzato: altrimenti l'insieme cambia identità a ogni render e `esegui`
  // verrebbe ricreato di continuo.
  const muri = useMemo(() => new Set(livello.muri ?? []), [livello]);
  const massimo = livello.massimo ?? livello.lato * 3;

  const pulisciTimer = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const reimposta = useCallback(() => {
    pulisciTimer();
    setPosizione(livello.partenza);
    setDirezione(livello.direzione ?? 1);
    setProgramma([]);
    setInEsecuzione(false);
  }, [livello, pulisciTimer]);

  useEffect(() => {
    reimposta();
    return pulisciTimer;
  }, [reimposta, pulisciTimer]);

  const aggiungi = useCallback(
    (comando: Comando) => {
      if (inEsecuzione || programma.length >= massimo) return;
      setProgramma((p) => [...p, comando]);
      parla(NOMI[comando]);
    },
    [inEsecuzione, massimo, programma.length],
  );

  const esegui = useCallback(() => {
    if (inEsecuzione || programma.length === 0) return;
    setInEsecuzione(true);
    // `tentativi` nello stato non è ancora aggiornato dentro questa chiusura:
    // il valore vero di questo tentativo va calcolato a mano per le stelle.
    const tentativoCorrente = tentativi + 1;
    setTentativi(tentativoCorrente);

    let x = livello.partenza[0];
    let y = livello.partenza[1];
    let dir = livello.direzione ?? 1;

    // Il "ripeti" raddoppia la sequenza: è la prima idea di ciclo (piano §13).
    const passi = livello.ripeti ? [...programma, ...programma] : programma;

    passi.forEach((comando, i) => {
      const t = window.setTimeout(
        () => {
          if (comando === "giraDx") dir = (dir + 1) % 4;
          else if (comando === "giraSx") dir = (dir + 3) % 4;
          else {
            const [dx, dy] =
              comando === "avanti"
                ? SPOSTAMENTI[dir]
                : comando === "su"
                  ? SPOSTAMENTI[0]
                  : comando === "destra"
                    ? SPOSTAMENTI[1]
                    : comando === "giu"
                      ? SPOSTAMENTI[2]
                      : SPOSTAMENTI[3];

            const nx = x + dx;
            const ny = y + dy;
            // Muri e bordi fermano Mizi senza drammi: resta dov'è.
            if (nx >= 0 && ny >= 0 && nx < livello.lato && ny < livello.lato && !muri.has(`${nx},${ny}`)) {
              x = nx;
              y = ny;
            }
          }

          setPosizione([x, y]);
          setDirezione(dir);

          if (i === passi.length - 1) {
            const arrivato = x === livello.arrivo[0] && y === livello.arrivo[1];
            const t2 = window.setTimeout(() => {
              if (arrivato) {
                parla("Ce l'hai fatta! Mizi ha preso il pesce.");
                const nuoviPunti = punti + 1;
                setPunti(nuoviPunti);
                const t3 = window.setTimeout(() => {
                  const prossimo = indice + 1;
                  if (prossimo >= totale) {
                    setFinito(true);
                    onComplete?.({ score: nuoviPunti, stars: stelle(totale - Math.max(0, tentativoCorrente - totale), totale) });
                    return;
                  }
                  setIndice(prossimo);
                  onProgress?.(prossimo, totale);
                }, 1500);
                timers.current.push(t3);
              } else {
                parla("Mizi non è arrivata al pesce. Guarda dove si è fermata e riprova.");
                const t3 = window.setTimeout(reimposta, 1600);
                timers.current.push(t3);
              }
            }, 450);
            timers.current.push(t2);
          }
        },
        (i + 1) * 650,
      );
      timers.current.push(t);
    });
  }, [inEsecuzione, programma, livello, muri, punti, indice, totale, tentativi, onComplete, onProgress, reimposta]);

  // Demo: costruisce un percorso banale in linea e lo esegue.
  useEffect(() => {
    if (!demo || finito || inEsecuzione || programma.length > 0) return;
    const t = window.setTimeout(() => {
      const [px, py] = livello.partenza;
      const [ax, ay] = livello.arrivo;
      const passi: Comando[] = [];
      if (modalita === "frecce") {
        for (let i = 0; i < ax - px; i++) passi.push("destra");
        for (let i = 0; i < px - ax; i++) passi.push("sinistra");
        for (let i = 0; i < ay - py; i++) passi.push("giu");
        for (let i = 0; i < py - ay; i++) passi.push("su");
      } else {
        for (let i = 0; i < Math.abs(ax - px); i++) passi.push("avanti");
      }
      setProgramma(passi);
    }, 700);
    return () => window.clearTimeout(t);
  }, [demo, finito, inEsecuzione, programma.length, livello, modalita]);

  useEffect(() => {
    if (!demo || inEsecuzione || programma.length === 0) return;
    const t = window.setTimeout(esegui, 600);
    return () => window.clearTimeout(t);
  }, [demo, inEsecuzione, programma.length, esegui]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setPunti(0);
    setTentativi(0);
    setFinito(false);
    reimposta();
  }, [reimposta]);

  const disponibili: Comando[] =
    modalita === "frecce" ? ["su", "giu", "sinistra", "destra"] : ["avanti", "giraSx", "giraDx"];

  const celle = Array.from({ length: livello.lato * livello.lato }, (_, i) => [
    i % livello.lato,
    Math.floor(i / livello.lato),
  ]);

  return (
    <GameShell
      titolo={titolo}
      istruzione={
        modalita === "frecce"
          ? "Metti le frecce nella riga, poi premi Via. Mizi deve arrivare al pesce."
          : "Componi il programma con avanti e gira, poi premi Via. Mizi deve arrivare al pesce."
      }
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={3}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-4">
        {/* La griglia */}
        <div
          className="grid w-full gap-1 rounded-morbido bg-white p-2"
          style={{ gridTemplateColumns: `repeat(${livello.lato}, minmax(0, 1fr))` }}
        >
          {celle.map(([x, y]) => {
            const muro = muri.has(`${x},${y}`);
            const arrivo = x === livello.arrivo[0] && y === livello.arrivo[1];
            const mizi = x === posizione[0] && y === posizione[1];
            return (
              <div
                key={`${x},${y}`}
                className={`flex aspect-square items-center justify-center rounded-lg ${
                  muro ? "bg-notte-tenue" : "bg-crema"
                }`}
              >
                {mizi && (
                  <div
                    className="h-full w-full p-0.5 transition-transform"
                    style={{ transform: modalita === "blocchi" ? `rotate(${direzione * 90}deg)` : undefined }}
                  >
                    <Disegno id="pinguino" titolo="Mizi" />
                  </div>
                )}
                {arrivo && !mizi && (
                  <div className="h-full w-full p-1">
                    <Disegno id="pesce" titolo="Il pesce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Il programma composto */}
        <div className="flex min-h-14 w-full flex-wrap items-center justify-center gap-1 rounded-morbido border-4 border-dashed border-crema-scuro bg-white/60 p-2">
          {programma.length === 0 ? (
            <span className="text-notte-tenue">Il programma è vuoto</span>
          ) : (
            programma.map((c, i) => (
              <span key={i} className="rounded bg-viola px-2 py-1 text-lg font-bold text-white">
                {ETICHETTE[c]}
              </span>
            ))
          )}
          {livello.ripeti && programma.length > 0 && (
            <span className="rounded bg-arancione px-2 py-1 text-sm font-bold text-white">ripeti ×2</span>
          )}
        </div>

        <p className="text-sm font-bold text-notte-tenue">
          {programma.length} / {massimo} comandi
        </p>

        {/* I comandi disponibili */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {disponibili.map((comando) => (
            <button
              key={comando}
              type="button"
              onClick={() => aggiungi(comando)}
              disabled={inEsecuzione || programma.length >= massimo}
              aria-label={NOMI[comando]}
              className="rounded-morbido border-4 border-crema-scuro bg-white px-4 py-3 text-xl font-extrabold text-notte disabled:opacity-40"
            >
              {ETICHETTE[comando]}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={esegui}
            disabled={inEsecuzione || programma.length === 0}
            className="rounded-bolla bg-rosa px-8 py-4 text-xl font-extrabold text-white disabled:opacity-40"
          >
            ▶ Via
          </button>
          <button
            type="button"
            onClick={reimposta}
            disabled={inEsecuzione}
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-4 text-lg font-bold text-notte-tenue disabled:opacity-40"
          >
            Cancella
          </button>
        </div>
      </div>
    </GameShell>
  );
}
