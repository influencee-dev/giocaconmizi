"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { alcuni, mescola, uno } from "@/games/_engine/casuale";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "@/games/_engine/tipi";

/**
 * Cosa manca? (4–7 anni) — il "gioco del vassoio" della guida su memoria
 * e concentrazione, in digitale.
 *
 * Due fasi per round: si osserva il vassoio finché si vuole (niente timer,
 * come da checklist: avanza il bambino col bottone "Ho guardato!"), poi un
 * oggetto sparisce e lo si indica fra tre. Il vassoio cresce: 4 → 5 → 6
 * oggetti. I nomi delle figure del catalogo sono già in italiano: fanno
 * da aria-label così come sono.
 */

const CATALOGO: NomeFigura[] = [
  "mela", "palla", "libro", "torta", "fiore", "macchina", "barca", "razzo",
  "sole", "luna", "pesce", "gatto", "cane", "albero", "casa", "nuvola",
];

interface RoundVassoio {
  vassoio: NomeFigura[];
  manca: NomeFigura;
  opzioni: NomeFigura[];
}

const LODI = ["Bravo!", "Benissimo!", "Esatto!", "Che memoria!"];
const INCORAGGIAMENTI = ["Quasi! Riprova.", "Non è questo. Riprova.", "Riprova, ci sei quasi."];

export default function Game({ onProgress, onComplete, demo = false }: GameProps) {
  const round = useMemo<RoundVassoio[]>(
    () =>
      [4, 4, 4, 5, 5, 5, 6, 6].map((quanti) => {
        const vassoio = alcuni(CATALOGO, quanti);
        const manca = uno(vassoio);
        return { vassoio, manca, opzioni: mescola([manca, ...alcuni(CATALOGO, 2, vassoio)]) };
      }),
    [],
  );

  const [indice, setIndice] = useState(0);
  const [fase, setFase] = useState<"osserva" | "scegli">("osserva");
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);
  const [sbagliate, setSbagliate] = useState<NomeFigura[]>([]);
  const [azzeccata, setAzzeccata] = useState<NomeFigura | null>(null);
  const [primoTentativo, setPrimoTentativo] = useState(true);
  // Lock di round: due tap nello stesso tick non devono avanzare due volte.
  const chiuso = useRef(false);

  const corrente = round[Math.min(indice, round.length - 1)];
  const totale = round.length;

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
      setFase("osserva");
      setSbagliate([]);
      setAzzeccata(null);
      setPrimoTentativo(true);
      chiuso.current = false;
      onProgress?.(prossimo, totale);
    },
    [indice, punti, totale, onComplete, onProgress],
  );

  const scegli = useCallback(
    (nome: NomeFigura) => {
      if (chiuso.current || azzeccata || finito || fase !== "scegli") return;
      if (nome === corrente.manca) {
        chiuso.current = true;
        setAzzeccata(nome);
        parla(LODI[indice % LODI.length]);
        window.setTimeout(() => prossimoRound(primoTentativo), 1000);
        return;
      }
      setSbagliate((precedenti) => [...precedenti, nome]);
      setPrimoTentativo(false);
      parla(INCORAGGIAMENTI[sbagliate.length % INCORAGGIAMENTI.length]);
    },
    [azzeccata, finito, fase, corrente.manca, indice, primoTentativo, prossimoRound, sbagliate.length],
  );

  // Modalità demo per i reel: guarda, poi risponde giusto da sola.
  useEffect(() => {
    if (!demo || finito) return;
    const t = window.setTimeout(
      () => (fase === "osserva" ? setFase("scegli") : scegli(corrente.manca)),
      1400,
    );
    return () => window.clearTimeout(t);
  }, [demo, finito, fase, corrente.manca, scegli]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setFase("osserva");
    setPunti(0);
    setFinito(false);
    setSbagliate([]);
    setAzzeccata(null);
    setPrimoTentativo(true);
    chiuso.current = false;
  }, []);

  const sulVassoio =
    fase === "osserva" ? corrente.vassoio : corrente.vassoio.filter((n) => n !== corrente.manca);

  return (
    <GameShell
      titolo="Cosa manca?"
      istruzione={
        fase === "osserva"
          ? "Guarda bene il vassoio: tra poco un oggetto sparisce!"
          : "Ne è sparito uno! Cosa manca?"
      }
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={stelle(punti, totale)}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
        {/* Il vassoio. data-oggetto serve alla verifica e2e per dedurre il mancante. */}
        <div
          data-vassoio
          className="grid w-full grid-cols-3 gap-3 rounded-bolla border-4 border-crema-scuro bg-white p-4"
        >
          {sulVassoio.map((nome) => (
            <div
              key={nome}
              data-oggetto={nome}
              role="img"
              aria-label={nome}
              className="flex items-center justify-center rounded-morbido bg-crema p-3"
            >
              <Disegno id={nome} className="h-14 w-14 sm:h-16 sm:w-16" />
            </div>
          ))}
        </div>

        {fase === "osserva" ? (
          <button
            type="button"
            onClick={() => setFase("scegli")}
            className="rounded-bolla bg-viola px-8 py-4 text-xl font-extrabold text-white active:scale-95"
          >
            Ho guardato!
          </button>
        ) : (
          <div className="grid w-full grid-cols-3 gap-4">
            {corrente.opzioni.map((nome) => {
              const stato =
                azzeccata === nome ? "giusta" : sbagliate.includes(nome) ? "sbagliata" : "libera";
              const bordo =
                stato === "giusta"
                  ? "border-verde bg-verde/10 scale-105"
                  : stato === "sbagliata"
                    ? "border-crema-scuro bg-white opacity-40"
                    : "border-crema-scuro bg-white active:scale-95";
              return (
                <button
                  key={nome}
                  type="button"
                  onClick={() => scegli(nome)}
                  disabled={stato === "sbagliata"}
                  aria-label={nome}
                  className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-morbido border-4 p-3 transition-all ${bordo}`}
                >
                  <Disegno id={nome} className="h-14 w-14" />
                  {stato === "giusta" && <span className="text-2xl" aria-hidden>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </GameShell>
  );
}
