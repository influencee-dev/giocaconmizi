"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "./tipi";

/**
 * Disegna con la tartaruga (Logo). Dagli 8 anni.
 *
 * Blocchi: avanti N, gira N gradi, ripeti N volte. È qui che compare il ciclo
 * annidato: un quadrato è "ripeti 4 [avanti 60, gira 90]", e vederlo funzionare
 * spiega più di qualsiasi definizione.
 *
 * Il confronto con la figura obiettivo avviene sul tracciato disegnato, non sul
 * codice: strade diverse che producono la stessa figura sono tutte giuste.
 */

export type Istruzione =
  | { tipo: "avanti"; valore: number }
  | { tipo: "gira"; valore: number }
  | { tipo: "ripeti"; volte: number; corpo: Istruzione[] };

export interface Sfida {
  nome: string;
  /** Il programma di riferimento: serve solo a generare il tracciato obiettivo. */
  soluzione: Istruzione[];
  suggerimento: string;
}

export interface TartarugaProps extends GameProps {
  titolo: string;
  sfide: Sfida[];
}

/** Esegue un programma e restituisce il tracciato in coordinate 0–200. */
function traccia(programma: Istruzione[]): [number, number][] {
  const punti: [number, number][] = [[100, 100]];
  let x = 100;
  let y = 100;
  let angolo = -90; // parte guardando in alto

  const passo = (istruzioni: Istruzione[], profondita = 0) => {
    if (profondita > 4) return; // paracadute contro annidamenti assurdi
    for (const i of istruzioni) {
      if (i.tipo === "avanti") {
        x += Math.cos((angolo * Math.PI) / 180) * i.valore;
        y += Math.sin((angolo * Math.PI) / 180) * i.valore;
        punti.push([x, y]);
      } else if (i.tipo === "gira") {
        angolo = (angolo + i.valore) % 360;
      } else {
        for (let n = 0; n < Math.min(i.volte, 36); n++) passo(i.corpo, profondita + 1);
      }
    }
  };

  passo(programma);
  return punti;
}

/** Due tracciati coincidono se toccano gli stessi punti, arrotondati. */
function uguali(a: [number, number][], b: [number, number][]): boolean {
  if (a.length !== b.length) return false;
  return a.every(([x, y], i) => Math.abs(x - b[i][0]) < 2 && Math.abs(y - b[i][1]) < 2);
}

function daPunti(punti: [number, number][]): string {
  return punti.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function descrivi(i: Istruzione): string {
  if (i.tipo === "avanti") return `avanti ${i.valore}`;
  if (i.tipo === "gira")
    return i.valore < 0 ? `gira a sinistra ${-i.valore}°` : `gira a destra ${i.valore}°`;
  return `ripeti ${i.volte} volte [ ${i.corpo.map(descrivi).join(", ")} ]`;
}

export function Tartaruga({ titolo, sfide, onProgress, onComplete, demo = false }: TartarugaProps) {
  const [indice, setIndice] = useState(0);
  const [programma, setProgramma] = useState<Istruzione[]>([]);
  const [dentroRipeti, setDentroRipeti] = useState(false);
  const [volte, setVolte] = useState(4);
  const [passo, setPasso] = useState(60);
  const [angolo, setAngolo] = useState(90);
  // Gli angoli che servono davvero sono 360 diviso il numero di lati:
  // uno stepper a passo fisso non ci arriverebbe (144° della stella).
  const ANGOLI = [30, 36, 45, 60, 72, 90, 120, 135, 144];
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);
  const [risolta, setRisolta] = useState(false);

  const sfida = sfide[Math.min(indice, sfide.length - 1)];
  const totale = sfide.length;

  const obiettivo = useMemo(() => traccia(sfida.soluzione), [sfida]);
  const mio = useMemo(() => traccia(programma), [programma]);

  const aggiungi = useCallback(
    (istruzione: Istruzione) => {
      if (finito || risolta) return;
      setProgramma((p) => {
        if (!dentroRipeti) return [...p, istruzione];
        const ultimo = p[p.length - 1];
        if (ultimo?.tipo === "ripeti") {
          return [...p.slice(0, -1), { ...ultimo, corpo: [...ultimo.corpo, istruzione] }];
        }
        return [...p, istruzione];
      });
    },
    [dentroRipeti, finito, risolta],
  );

  const apriRipeti = useCallback(() => {
    if (finito || risolta) return;
    setProgramma((p) => [...p, { tipo: "ripeti", volte, corpo: [] }]);
    setDentroRipeti(true);
  }, [finito, risolta, volte]);

  useEffect(() => {
    if (risolta || finito || programma.length === 0) return;
    if (!uguali(mio, obiettivo)) return;

    setRisolta(true);
    parla(`Perfetto! Hai disegnato ${sfida.nome}.`);
    const nuoviPunti = punti + 1;
    setPunti(nuoviPunti);

    const t = window.setTimeout(() => {
      const prossimo = indice + 1;
      if (prossimo >= totale) {
        setFinito(true);
        onComplete?.({ score: nuoviPunti, stars: stelle(nuoviPunti, totale) });
        return;
      }
      setIndice(prossimo);
      setProgramma([]);
      setDentroRipeti(false);
      setRisolta(false);
      onProgress?.(prossimo, totale);
    }, 2000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mio, obiettivo, risolta, finito, programma.length, indice, totale, sfida.nome, onComplete, onProgress]);

  useEffect(() => {
    if (!demo || finito || risolta || programma.length > 0) return;
    const t = window.setTimeout(() => setProgramma(sfida.soluzione), 900);
    return () => window.clearTimeout(t);
  }, [demo, finito, risolta, programma.length, sfida.soluzione]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setPunti(0);
    setFinito(false);
    setRisolta(false);
    setProgramma([]);
    setDentroRipeti(false);
  }, []);

  return (
    <GameShell
      titolo={titolo}
      istruzione={`Disegna ${sfida.nome}. Usa avanti, gira e ripeti.`}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={stelle(punti, totale)}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-2xl flex-col items-center gap-3 overflow-y-auto">
        <p className="text-center text-lg font-bold text-notte">
          Disegna {sfida.nome} <span className="text-notte-tenue">· {sfida.suggerimento}</span>
        </p>

        <div className="grid w-full grid-cols-2 gap-3">
          <figure className="rounded-morbido bg-white p-2">
            <figcaption className="text-center text-sm font-bold text-notte-tenue">Obiettivo</figcaption>
            <svg viewBox="0 0 200 200" className="w-full">
              <path d={daPunti(obiettivo)} fill="none" stroke="#B9C0CC" strokeWidth="4" strokeLinejoin="round" />
            </svg>
          </figure>

          <figure className={`rounded-morbido p-2 ${risolta ? "bg-verde/10" : "bg-white"}`}>
            <figcaption className="text-center text-sm font-bold text-notte-tenue">Il tuo disegno</figcaption>
            <svg viewBox="0 0 200 200" className="w-full">
              <path d={daPunti(mio)} fill="none" stroke="#9B6DD6" strokeWidth="4" strokeLinejoin="round" />
              {mio.length > 0 && (
                <circle cx={mio[mio.length - 1][0]} cy={mio[mio.length - 1][1]} r="5" fill="#4CAF6D" />
              )}
            </svg>
          </figure>
        </div>

        {/* Il programma, leggibile come codice */}
        <pre className="w-full overflow-x-auto rounded-morbido bg-notte p-3 text-left text-sm text-white">
          {programma.length === 0
            ? "// il tuo programma è vuoto"
            : programma.map((i) => descrivi(i)).join("\n")}
        </pre>

        {/* I blocchi */}
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <Regolatore etichetta="passo" valore={passo} onCambia={setPasso} passo={10} min={10} max={120} />
          <button
            type="button"
            onClick={() => aggiungi({ tipo: "avanti", valore: passo })}
            className="rounded-morbido border-4 border-crema-scuro bg-white px-4 py-3 font-extrabold text-notte"
          >
            avanti {passo}
          </button>

          <select
            value={angolo}
            onChange={(e) => setAngolo(Number(e.target.value))}
            aria-label="Gradi"
            className="rounded-bolla border-2 border-crema-scuro bg-white px-3 py-3 font-bold text-notte"
          >
            {ANGOLI.map((a) => (
              <option key={a} value={a}>
                {a}°
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => aggiungi({ tipo: "gira", valore: angolo })}
            className="rounded-morbido border-4 border-crema-scuro bg-white px-4 py-3 font-extrabold text-notte"
          >
            ↻ gira {angolo}°
          </button>
          <button
            type="button"
            onClick={() => aggiungi({ tipo: "gira", valore: -angolo })}
            className="rounded-morbido border-4 border-crema-scuro bg-white px-4 py-3 font-extrabold text-notte"
          >
            ↺ gira {angolo}°
          </button>

          <Regolatore etichetta="volte" valore={volte} onCambia={setVolte} passo={1} min={2} max={12} />
          <button
            type="button"
            onClick={apriRipeti}
            className={`rounded-morbido border-4 px-4 py-3 font-extrabold ${
              dentroRipeti ? "border-arancione bg-arancione text-white" : "border-crema-scuro bg-white text-notte"
            }`}
          >
            ripeti {volte} ×
          </button>
        </div>

        <div className="flex gap-3 pb-4">
          {dentroRipeti && (
            <button
              type="button"
              onClick={() => setDentroRipeti(false)}
              className="rounded-bolla bg-arancione px-6 py-3 font-bold text-white"
            >
              Chiudi ripeti
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setProgramma([]);
              setDentroRipeti(false);
            }}
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-3 font-bold text-notte-tenue"
          >
            Cancella
          </button>
        </div>
      </div>
    </GameShell>
  );
}

function Regolatore({
  etichetta,
  valore,
  onCambia,
  passo,
  min,
  max,
}: {
  etichetta: string;
  valore: number;
  onCambia: (n: number) => void;
  passo: number;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-bolla bg-white px-2 py-1">
      <button
        type="button"
        onClick={() => onCambia(Math.max(min, valore - passo))}
        aria-label={`Meno ${etichetta}`}
        className="h-10 w-10 rounded-full bg-crema text-xl font-extrabold text-notte"
        style={{ minHeight: "2.5rem", minWidth: "2.5rem" }}
      >
        −
      </button>
      <span className="w-14 text-center text-sm font-bold text-notte-tenue">{etichetta}</span>
      <button
        type="button"
        onClick={() => onCambia(Math.min(max, valore + passo))}
        aria-label={`Più ${etichetta}`}
        className="h-10 w-10 rounded-full bg-crema text-xl font-extrabold text-notte"
        style={{ minHeight: "2.5rem", minWidth: "2.5rem" }}
      >
        +
      </button>
    </div>
  );
}
