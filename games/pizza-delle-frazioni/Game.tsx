"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { mescola, uno } from "@/games/_engine/casuale";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "@/games/_engine/tipi";

/**
 * La pizza delle frazioni (8–10 anni) — frazioni come parti di un intero.
 *
 * Due tipi di round, 4 + 4:
 * 1. "Leggi": una pizza tagliata in N fette, K col salame. Il bambino sceglie
 *    la frazione giusta fra 3. Le risposte sbagliate sono gli errori tipici
 *    di terza e quarta: contare le fette bianche, o mettere sotto le fette
 *    bianche invece di tutte le fette (K/(N−K)). Nessuna risposta sbagliata
 *    vale quanto quella giusta (niente 2/4 se la giusta è 1/2).
 * 2. "Fai": la pizza è bianca e Mizi chiede "metti il salame su K/N". Si
 *    toccano le fette (un tocco mette, un altro toglie) e si preme Fatto.
 *    Qualsiasi K fette vanno bene: la frazione non dipende da quali.
 * Il punto del round vale solo al primo tentativo, ma si va avanti solo con
 * la risposta giusta: niente "hai perso".
 */

type Frazione = { n: number; d: number };
type Round = { tipo: "leggi" | "fai"; f: Frazione };

const NOMI: Record<number, [string, string]> = {
  2: ["mezzo", "mezzi"],
  3: ["terzo", "terzi"],
  4: ["quarto", "quarti"],
  5: ["quinto", "quinti"],
  6: ["sesto", "sesti"],
  8: ["ottavo", "ottavi"],
};

/** "un quarto", "3 ottavi": come si legge a voce. */
const aParole = ({ n, d }: Frazione) => (n === 1 ? `un ${NOMI[d][0]}` : `${n} ${NOMI[d][1]}`);

const uguali = (a: Frazione, b: Frazione) => a.n * b.d === b.n * a.d;
const chiave = (f: Frazione) => `${f.n}/${f.d}`;

/** Dal più facile al più difficile: ogni posto pesca da una piccola rosa. */
const ROSE_LEGGI: Frazione[][] = [
  [{ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 1, d: 3 }],
  [{ n: 3, d: 4 }, { n: 2, d: 3 }],
  [{ n: 2, d: 5 }, { n: 5, d: 6 }, { n: 3, d: 5 }],
  [{ n: 3, d: 8 }, { n: 5, d: 8 }],
];
const ROSE_FAI: Frazione[][] = [
  [{ n: 1, d: 4 }, { n: 1, d: 3 }],
  [{ n: 2, d: 3 }, { n: 3, d: 4 }],
  [{ n: 4, d: 6 }, { n: 3, d: 5 }],
  [{ n: 7, d: 8 }, { n: 5, d: 8 }],
];

/** La giusta più due sbagliate, mai equivalenti alla giusta né "improprie". */
function opzioniPer(f: Frazione): Frazione[] {
  const candidate: Frazione[] = [
    { n: f.d - f.n, d: f.d }, // ha contato le fette bianche
    { n: f.n, d: f.d - f.n }, // sotto le bianche invece di tutte
    { n: f.n, d: f.d + 1 },
    { n: f.n + 1, d: f.d },
    { n: f.n - 1, d: f.d },
    { n: f.n, d: f.d * 2 },
  ];
  const scelte: Frazione[] = [f];
  for (const c of candidate) {
    if (scelte.length === 3) break;
    // Solo denominatori che sappiamo dire a voce (niente "noni").
    if (c.n < 1 || c.n >= c.d || !NOMI[c.d]) continue;
    if (scelte.some((s) => uguali(s, c))) continue;
    scelte.push(c);
  }
  return mescola(scelte);
}

/** Lo spicchio i di d, in coordinate 0–100, a partire dalle ore 12. */
function spicchio(i: number, d: number, r = 44) {
  const a0 = (i / d) * 2 * Math.PI - Math.PI / 2;
  const a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
  const x0 = 50 + r * Math.cos(a0);
  const y0 = 50 + r * Math.sin(a0);
  const x1 = 50 + r * Math.cos(a1);
  const y1 = 50 + r * Math.sin(a1);
  const grande = 1 / d > 0.5 ? 1 : 0;
  return `M50 50 L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${grande} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

/** Le fette di salame: tre tondini nel mezzo dello spicchio. */
function salami(i: number, d: number) {
  const centro = ((i + 0.5) / d) * 2 * Math.PI - Math.PI / 2;
  const raggio = d >= 6 ? 4 : 5.5;
  const posti = d >= 6 ? [26] : [18, 32];
  const punti: { x: number; y: number; r: number }[] = [];
  for (const dist of posti) {
    punti.push({ x: 50 + dist * Math.cos(centro), y: 50 + dist * Math.sin(centro), r: raggio });
  }
  if (d <= 4) {
    const lato = centro + (d === 2 ? 0.6 : 0.35);
    punti.push({ x: 50 + 26 * Math.cos(lato), y: 50 + 26 * Math.sin(lato), r: raggio });
  }
  return punti;
}

function Pizza({
  d,
  piene,
  onTocca,
  lato = 260,
}: {
  d: number;
  piene: boolean[];
  onTocca?: (i: number) => void;
  lato?: number;
}) {
  return (
    <svg viewBox="0 0 100 100" width={lato} height={lato} className="max-w-full" role={onTocca ? "group" : "img"} aria-label={`Pizza tagliata in ${d} fette`}>
      {/* Il cornicione */}
      <circle cx="50" cy="50" r="48" fill="#E0A458" stroke="#B9782F" strokeWidth="1.5" />
      {Array.from({ length: d }, (_, i) => (
        <g key={i}>
          <path
            d={spicchio(i, d)}
            fill={piene[i] ? "#E86F4F" : "#F8E3A6"}
            stroke="#B9782F"
            strokeWidth="1.2"
            {...(onTocca
              ? {
                  role: "button",
                  tabIndex: 0,
                  "aria-label": `Fetta ${i + 1}`,
                  "aria-pressed": piene[i],
                  onClick: () => onTocca(i),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onTocca(i);
                    }
                  },
                  style: { cursor: "pointer" },
                }
              : {})}
          />
          {piene[i] &&
            salami(i, d).map((p, j) => (
              <circle key={j} cx={p.x} cy={p.y} r={p.r} fill="#B8323A" stroke="#8E2229" strokeWidth="0.6" pointerEvents="none" />
            ))}
        </g>
      ))}
    </svg>
  );
}

/** La frazione scritta come a scuola: numeratore, linea, denominatore. */
function Scritta({ f, grande = false }: { f: Frazione; grande?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-center font-black leading-none text-notte ${grande ? "text-4xl" : "text-3xl"}`}>
      <span>{f.n}</span>
      <span className="my-1 h-1 w-8 rounded bg-notte" aria-hidden />
      <span>{f.d}</span>
    </span>
  );
}

const LODI = ["Giusto!", "Esatto!", "Bravo!", "Perfetto!"];

export default function Game({ onProgress, onComplete, demo = false }: GameProps) {
  const round: Round[] = useMemo(
    () => [
      ...ROSE_LEGGI.map((rosa) => ({ tipo: "leggi" as const, f: uno(rosa) })),
      ...ROSE_FAI.map((rosa) => ({ tipo: "fai" as const, f: uno(rosa) })),
    ],
    [],
  );

  const [indice, setIndice] = useState(0);
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);
  const [errori, setErrori] = useState(0);
  const [fatto, setFatto] = useState(false);
  const [avviso, setAvviso] = useState<string | null>(null);
  const [fette, setFette] = useState<boolean[]>(() => Array(round[0].f.d).fill(false));
  const chiuso = useRef(false);

  const corrente = round[Math.min(indice, round.length - 1)];
  const totale = round.length;
  const { f } = corrente;

  // Le fette col salame: nei round "leggi" sono le prime K, a partire da un
  // punto a caso, così non sono sempre in alto a destra.
  const partenza = useMemo(() => Math.floor(Math.random() * f.d), [f.d, indice]); // eslint-disable-line react-hooks/exhaustive-deps
  const pieneLeggi = useMemo(
    () => Array.from({ length: f.d }, (_, i) => (i - partenza + f.d) % f.d < f.n),
    [f, partenza],
  );
  const opzioni = useMemo(() => opzioniPer(f), [f]);

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
      setFette(Array(round[prossimo].f.d).fill(false));
      setErrori(0);
      setFatto(false);
      setAvviso(null);
      chiuso.current = false;
      onProgress?.(prossimo, totale);
    },
    [indice, punti, round, totale, onComplete, onProgress],
  );

  const vinci = useCallback(() => {
    chiuso.current = true;
    setFatto(true);
    setAvviso(null);
    parla(`${LODI[indice % LODI.length]} ${aParole(f)}.`);
    window.setTimeout(() => prossimoRound(errori === 0), 1400);
  }, [errori, f, indice, prossimoRound]);

  const sbaglia = useCallback((frase: string) => {
    setErrori((e) => e + 1);
    setAvviso(frase);
    parla(frase);
  }, []);

  const scegli = useCallback(
    (o: Frazione) => {
      if (chiuso.current || finito) return;
      if (o.n === f.n && o.d === f.d) return vinci();
      const bianche = f.d - f.n;
      sbaglia(
        o.d !== f.d
          ? `Quante fette ci sono in tutto? Sono ${f.d}: il numero sotto la linea conta tutte le fette.`
          : o.n === bianche
            ? `Quella conta le fette senza salame. Conta quelle col salame.`
            : `Conta di nuovo le fette col salame.`,
      );
    },
    [f, finito, sbaglia, vinci],
  );

  const tocca = useCallback(
    (i: number) => {
      if (chiuso.current || finito) return;
      setAvviso(null);
      setFette((attuali) => attuali.map((v, j) => (j === i ? !v : v)));
    },
    [finito],
  );

  const controlla = useCallback(
    (scelte?: boolean[]) => {
      if (chiuso.current || finito) return;
      const piene = (scelte ?? fette).filter(Boolean).length;
      if (piene === f.n) return vinci();
      sbaglia(
        piene < f.n
          ? `Ne mancano: il salame va su ${f.n} fette su ${f.d}.`
          : `Sono troppe: tocca una fetta per togliere il salame. Ne servono ${f.n}.`,
      );
    },
    [f, fette, finito, sbaglia, vinci],
  );

  // Demo per i reel: risponde giusto da sola.
  useEffect(() => {
    if (!demo || finito || fatto) return;
    const t = window.setTimeout(() => {
      if (corrente.tipo === "leggi") {
        scegli(f);
      } else {
        const giuste = Array.from({ length: f.d }, (_, i) => i < f.n);
        setFette(giuste);
        controlla(giuste);
      }
    }, 1500);
    return () => window.clearTimeout(t);
  }, [demo, finito, fatto, corrente.tipo, f, scegli, controlla]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setFette(Array(round[0].f.d).fill(false));
    setPunti(0);
    setFinito(false);
    setErrori(0);
    setFatto(false);
    setAvviso(null);
    chiuso.current = false;
  }, [round]);

  const istruzione =
    corrente.tipo === "leggi"
      ? "Mizi ha messo il salame su alcune fette. Che frazione della pizza è col salame?"
      : `Metti il salame su ${aParole(f)} della pizza: tocca le fette, poi premi Fatto.`;

  return (
    <GameShell
      titolo="La pizza delle frazioni"
      istruzione={istruzione}
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={stelle(punti, totale)}
      onAncora={ricomincia}
    >
      {/* data-* servono alla verifica e2e: tipo di round e frazione giusta. */}
      <div
        data-round={corrente.tipo}
        data-frazione={chiave(f)}
        className="flex h-full w-full max-w-xl flex-col items-center justify-center gap-4"
      >
        {corrente.tipo === "fai" && (
          <div className={`flex items-center gap-3 rounded-2xl border-4 bg-white px-5 py-2 ${fatto ? "border-verde" : "border-crema-scuro"}`}>
            <span className="text-lg font-extrabold text-notte">Salame su</span>
            <Scritta f={f} grande />
            <span className="text-lg font-extrabold text-notte">della pizza</span>
          </div>
        )}

        <Pizza
          d={f.d}
          piene={corrente.tipo === "leggi" ? pieneLeggi : fette.length === f.d ? fette : Array(f.d).fill(false)}
          onTocca={corrente.tipo === "fai" ? tocca : undefined}
        />

        <p className="min-h-7 text-center text-lg font-bold text-notte" aria-live="polite">
          {avviso}
        </p>

        {corrente.tipo === "leggi" ? (
          <div className="flex items-center justify-center gap-4">
            {opzioni.map((o) => {
              const giusta = o.n === f.n && o.d === f.d;
              return (
                <button
                  key={chiave(o)}
                  type="button"
                  onClick={() => scegli(o)}
                  disabled={fatto}
                  aria-label={aParole(o)}
                  className={`flex h-24 w-20 items-center justify-center rounded-2xl border-4 bg-white active:scale-95 ${
                    fatto && giusta ? "border-verde" : "border-crema-scuro"
                  }`}
                >
                  <Scritta f={o} />
                </button>
              );
            })}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => controlla()}
            disabled={fatto}
            className="rounded-2xl bg-viola px-10 py-4 text-xl font-extrabold text-white active:scale-95 disabled:opacity-60"
          >
            Fatto
          </button>
        )}
      </div>
    </GameShell>
  );
}
