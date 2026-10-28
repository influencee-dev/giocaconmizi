"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "@/games/_engine/tipi";

/**
 * Il salvadanaio di Mizi (6–9 anni) — contare il denaro.
 *
 * Mizi vuole comprare un oggetto: il bambino mette nel borsellino le monete
 * per pagare il prezzo esatto, poi preme "Paga". Il totale NON è mostrato:
 * sommare le monete è proprio la competenza. Se sono poche o troppe, Mizi lo
 * dice con gentilezza e una moneta si toglie toccandola. Prezzi interi con
 * 1 € e 2 € nei primi round, poi anche i 50 centesimi.
 * Le monete sono disegni generici (cerchio bicolore + valore), non le facce
 * nazionali dell'euro.
 */

type Moneta = 50 | 100 | 200; // in centesimi

const OGGETTI: { figura: NomeFigura; nome: string }[] = [
  { figura: "mela", nome: "la mela" },
  { figura: "palla", nome: "la palla" },
  { figura: "libro", nome: "il libro" },
  { figura: "torta", nome: "la torta" },
  { figura: "fiore", nome: "il fiore" },
  { figura: "macchina", nome: "la macchinina" },
  { figura: "barca", nome: "la barchetta" },
  { figura: "razzo", nome: "il razzo" },
];

/** Prezzi in centesimi: interi, poi con i 50 centesimi. */
const PREZZI = [200, 300, 400, 500, 700, 150, 250, 350];
const MAX_MONETE = 10;

/** "3 €" / "1,50 €" per l'etichetta del prezzo. */
const cifre = (cent: number) =>
  cent % 100 === 0 ? `${cent / 100} €` : `${Math.floor(cent / 100)},50 €`;

/** A parole, per la voce: "3 euro", "un euro e 50 centesimi". */
function aParole(cent: number) {
  const euro = Math.floor(cent / 100);
  const intero = euro === 1 ? "un euro" : `${euro} euro`;
  return cent % 100 === 0 ? intero : `${intero} e 50 centesimi`;
}

const NOME_MONETA: Record<Moneta, string> = { 50: "50 centesimi", 100: "1 euro", 200: "2 euro" };

/** Le monete per un prezzo, dalla più grande: serve alla demo. */
function scomponi(cent: number): Moneta[] {
  const fuori: Moneta[] = [];
  let resto = cent;
  for (const m of [200, 100, 50] as Moneta[]) {
    while (resto >= m) {
      fuori.push(m);
      resto -= m;
    }
  }
  return fuori;
}

function DisegnoMoneta({ valore, lato = 64 }: { valore: Moneta; lato?: number }) {
  // 1 €: centro argento, anello oro. 2 €: il contrario. 50 cent: tutta oro.
  const oro = "#F2C14E";
  const argento = "#D7DCE3";
  const [anello, centro] = valore === 100 ? [oro, argento] : valore === 200 ? [argento, oro] : [oro, oro];
  const testo = valore === 50 ? "50" : valore === 100 ? "1€" : "2€";
  return (
    <svg viewBox="0 0 100 100" width={lato} height={lato} aria-hidden>
      <circle cx="50" cy="50" r="46" fill={anello} stroke="#9A7B2F" strokeWidth="3" />
      <circle cx="50" cy="50" r={valore === 50 ? 38 : 32} fill={centro} stroke="#9A7B2F" strokeWidth={valore === 50 ? 1.5 : 2} />
      <text
        x="50"
        y={valore === 50 ? 58 : 60}
        textAnchor="middle"
        fontFamily="Nunito, system-ui, sans-serif"
        fontWeight="900"
        fontSize={valore === 50 ? 26 : 30}
        fill="#4A3B12"
      >
        {testo}
      </text>
      {valore === 50 && (
        <text x="50" y="76" textAnchor="middle" fontFamily="Nunito, system-ui, sans-serif" fontWeight="800" fontSize="11" fill="#4A3B12">
          cent
        </text>
      )}
    </svg>
  );
}

const LODI = ["Giusto! Mizi ha comprato", "Perfetto! Ecco", "Bravo! Pagato", "Esatto! Tutto tuo"];

export default function Game({ onProgress, onComplete, demo = false }: GameProps) {
  const round = useMemo(() => {
    const oggetti = mescola(OGGETTI);
    return PREZZI.map((prezzo, i) => ({ ...oggetti[i % oggetti.length], prezzo }));
  }, []);

  const [indice, setIndice] = useState(0);
  const [borsellino, setBorsellino] = useState<Moneta[]>([]);
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);
  const [errori, setErrori] = useState(0);
  const [pagato, setPagato] = useState(false);
  const [avviso, setAvviso] = useState<string | null>(null);
  const chiuso = useRef(false);

  const corrente = round[Math.min(indice, round.length - 1)];
  const totale = round.length;
  const conCentesimi = corrente.prezzo % 100 !== 0;
  const monete: Moneta[] = conCentesimi ? [50, 100, 200] : [100, 200];

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
      setBorsellino([]);
      setErrori(0);
      setPagato(false);
      setAvviso(null);
      chiuso.current = false;
      onProgress?.(prossimo, totale);
    },
    [indice, punti, totale, onComplete, onProgress],
  );

  const metti = useCallback(
    (m: Moneta) => {
      if (chiuso.current || finito) return;
      setAvviso(null);
      setBorsellino((b) => (b.length >= MAX_MONETE ? b : [...b, m]));
    },
    [finito],
  );

  const togli = useCallback(
    (posto: number) => {
      if (chiuso.current || finito) return;
      setAvviso(null);
      setBorsellino((b) => b.filter((_, i) => i !== posto));
    },
    [finito],
  );

  const paga = useCallback(
    (monete?: Moneta[]) => {
      if (chiuso.current || finito) return;
      const usate = monete ?? borsellino;
      const somma = usate.reduce((a, m) => a + m, 0);
      if (somma === corrente.prezzo) {
        chiuso.current = true;
        setPagato(true);
        setAvviso(null);
        parla(`${LODI[indice % LODI.length]} ${corrente.nome}!`);
        window.setTimeout(() => prossimoRound(errori === 0), 1300);
        return;
      }
      setErrori((e) => e + 1);
      const frase =
        usate.length === 0
          ? "Il borsellino è vuoto: metti qualche moneta."
          : somma < corrente.prezzo
            ? "Non basta ancora: aggiungi una moneta."
            : "È troppo! Tocca una moneta nel borsellino per toglierla.";
      setAvviso(frase);
      parla(frase);
    },
    [borsellino, corrente, errori, finito, indice, prossimoRound],
  );

  // Demo per i reel: mette le monete giuste e paga.
  useEffect(() => {
    if (!demo || finito || pagato) return;
    const giuste = scomponi(corrente.prezzo);
    const t = window.setTimeout(() => {
      setBorsellino(giuste);
      paga(giuste);
    }, 1200);
    return () => window.clearTimeout(t);
  }, [demo, finito, pagato, corrente.prezzo, paga]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setBorsellino([]);
    setPunti(0);
    setFinito(false);
    setErrori(0);
    setPagato(false);
    setAvviso(null);
    chiuso.current = false;
  }, []);

  return (
    <GameShell
      titolo="Il salvadanaio di Mizi"
      istruzione={`Mizi vuole comprare ${corrente.nome}: costa ${aParole(corrente.prezzo)}. Metti le monete giuste e premi Paga.`}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={stelle(punti, totale)}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-xl flex-col items-center justify-center gap-5">
        {/* Il banco: l'oggetto col cartellino. data-prezzo (centesimi) serve alla verifica e2e. */}
        <div
          data-prezzo={corrente.prezzo}
          className={`flex items-center gap-4 rounded-bolla border-4 bg-white px-6 py-3 transition-colors ${pagato ? "border-verde" : "border-crema-scuro"}`}
        >
          <Disegno id={corrente.figura} className="h-16 w-16" />
          <span className="rounded-xl bg-giallo/40 px-4 py-2 text-3xl font-extrabold text-notte">
            {cifre(corrente.prezzo)}
          </span>
          {pagato && <span className="text-3xl" aria-hidden>✓</span>}
        </div>

        {/* Il borsellino: una moneta toccata torna fuori. */}
        <div
          data-borsellino
          aria-label="Borsellino"
          className="flex min-h-28 w-full flex-wrap items-center justify-center gap-2 rounded-bolla border-4 border-dashed border-viola/50 bg-viola/5 p-3"
        >
          {borsellino.length === 0 ? (
            <span className="text-base font-bold text-notte-tenue">Il borsellino è vuoto</span>
          ) : (
            borsellino.map((m, i) => (
              <button
                key={`${i}-${m}`}
                type="button"
                data-moneta={m}
                onClick={() => togli(i)}
                aria-label={`Togli ${NOME_MONETA[m]}`}
                className="rounded-full p-1 active:scale-90"
                style={{ minHeight: 0, minWidth: 0 }}
              >
                <DisegnoMoneta valore={m} lato={60} />
              </button>
            ))
          )}
        </div>

        <p className="min-h-7 text-center text-lg font-bold text-notte" aria-live="polite">
          {avviso}
        </p>

        {/* Le monete da prendere: tap target grandi. */}
        <div className="flex items-center justify-center gap-5">
          {monete.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => metti(m)}
              aria-label={`Aggiungi ${NOME_MONETA[m]}`}
              className="flex flex-col items-center gap-1 rounded-morbido border-4 border-crema-scuro bg-white p-2 active:scale-95"
            >
              <DisegnoMoneta valore={m} lato={72} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => paga()}
          disabled={pagato}
          className="rounded-bolla bg-viola px-10 py-4 text-xl font-extrabold text-white active:scale-95 disabled:opacity-60"
        >
          Paga
        </button>
      </div>
    </GameShell>
  );
}
