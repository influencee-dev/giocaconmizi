"use client";

import { Brush, Camera, Check, Eraser, PaintBucket, Undo2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla } from "@/lib/audio";
import type { GameProps } from "@/games/_engine/tipi";
import { DISEGNI, type Forma } from "./disegni";

/**
 * Colora con Mizi (3–8 anni): i colori, con il secchiello o con il dito.
 *
 * Sei disegni originali, uno per livello. Tre strumenti:
 * - Secchiello: tocchi una parte e si riempie (il più facile, per i piccoli);
 * - Pennello: disegni con il dito, in tre grandezze;
 * - Gomma: cancella quello che hai disegnato col dito.
 * Ogni colore scelto si sente a voce («giallo!»): così si imparano i nomi.
 * «Annulla» torna indietro di un gesto, «Salva» crea il PNG nel browser.
 * Non c'è niente di giusto o sbagliato: «Fatto» porta al disegno dopo.
 *
 * Tre strati uno sull'altro: le parti colorate (SVG), il disegno a mano
 * (canvas) e sopra i contorni neri, che restano sempre visibili.
 */

const COLORI = [
  { nome: "rosso", hex: "#EF5350" },
  { nome: "arancione", hex: "#F59A23" },
  { nome: "giallo", hex: "#F9C846" },
  { nome: "verde chiaro", hex: "#9CCC65" },
  { nome: "verde", hex: "#43A047" },
  { nome: "azzurro", hex: "#3DB5E6" },
  { nome: "blu", hex: "#3F51B5" },
  { nome: "viola", hex: "#9B6DD6" },
  { nome: "rosa", hex: "#F28AB2" },
  { nome: "marrone", hex: "#8D6E63" },
  { nome: "nero", hex: "#1F2430" },
  { nome: "bianco", hex: "#FFFFFF" },
];
const GRANDEZZE = [
  { nome: "Sottile", px: 10 },
  { nome: "Medio", px: 22 },
  { nome: "Grosso", px: 40 },
];
const LATO = 800; // pixel del canvas (il disegno è 400 × 400, a doppia definizione)

type Strumento = "secchiello" | "pennello" | "gomma";
type Tratto = { colore: string; px: number; gomma: boolean; punti: [number, number][] };
type Gesto = { tipo: "riempi"; parte: string; prima: string | undefined } | { tipo: "tratto" };

function Figura({ f, ...props }: { f: Forma } & React.SVGProps<SVGElement>) {
  const p = props as Record<string, unknown>;
  switch (f.t) {
    case "rect":
      return <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={f.r} {...p} />;
    case "circle":
      return <circle cx={f.cx} cy={f.cy} r={f.r} {...p} />;
    case "ellipse":
      return <ellipse cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry} transform={f.rot ? `rotate(${f.rot} ${f.cx} ${f.cy})` : undefined} {...p} />;
    default:
      return <path d={f.d} {...p} />;
  }
}

function disegnaTratto(ctx: CanvasRenderingContext2D, t: Tratto) {
  ctx.save();
  ctx.globalCompositeOperation = t.gomma ? "destination-out" : "source-over";
  ctx.strokeStyle = t.colore;
  ctx.fillStyle = t.colore;
  ctx.lineWidth = t.px;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (t.punti.length === 1) {
    const [x, y] = t.punti[0];
    ctx.beginPath();
    ctx.arc(x, y, t.px / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    t.punti.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  }
  ctx.restore();
}

export default function Game({ onComplete, onProgress, demo }: GameProps) {
  const [livello, setLivello] = useState(0);
  const [riempite, setRiempite] = useState<Record<string, string>>({});
  const [strumento, setStrumento] = useState<Strumento>("secchiello");
  const [colore, setColore] = useState(COLORI[2].hex);
  const [grandezza, setGrandezza] = useState(GRANDEZZE[1].px);
  const [finito, setFinito] = useState(false);
  const [gesti, setGesti] = useState<Gesto[]>([]);
  const tratti = useRef<Tratto[]>([]);
  const inCorso = useRef<Tratto | null>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const svgColori = useRef<SVGSVGElement>(null);
  const svgContorni = useRef<SVGSVGElement>(null);
  const disegno = DISEGNI[Math.min(livello, DISEGNI.length - 1)];

  useEffect(() => onProgress?.(livello, DISEGNI.length), [livello, onProgress]);

  const ridisegna = useCallback(() => {
    const ctx = tela.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, LATO, LATO);
    for (const t of tratti.current) disegnaTratto(ctx, t);
  }, []);

  const pulisci = useCallback(() => {
    setRiempite({});
    setGesti([]);
    tratti.current = [];
    inCorso.current = null;
    ridisegna();
  }, [ridisegna]);

  const scegliColore = (c: (typeof COLORI)[number]) => {
    setColore(c.hex);
    if (strumento === "gomma") setStrumento("pennello");
    parla(c.nome);
  };

  const riempi = (id: string) => {
    if (strumento !== "secchiello") return;
    setGesti((g): Gesto[] => [...g, { tipo: "riempi" as const, parte: id, prima: riempite[id] }].slice(-60));
    setRiempite((r) => ({ ...r, [id]: colore }));
  };

  // ---- Il dito sul canvas ----
  const punto = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * LATO, ((e.clientY - r.top) / r.height) * LATO];
  };
  const giu = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (strumento === "secchiello") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const t: Tratto = { colore, px: strumento === "gomma" ? grandezza * 1.6 : grandezza, gomma: strumento === "gomma", punti: [punto(e)] };
    inCorso.current = t;
    const ctx = tela.current?.getContext("2d");
    if (ctx) disegnaTratto(ctx, t);
  };
  const muovi = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const t = inCorso.current;
    if (!t) return;
    const p = punto(e);
    const ultimo = t.punti[t.punti.length - 1];
    t.punti.push(p);
    const ctx = tela.current?.getContext("2d");
    if (ctx) disegnaTratto(ctx, { ...t, punti: [ultimo, p] });
  };
  const su = () => {
    if (!inCorso.current) return;
    tratti.current.push(inCorso.current);
    inCorso.current = null;
    setGesti((g) => [...g, { tipo: "tratto" as const }].slice(-60));
  };

  const annulla = () => {
    const ultimo = gesti[gesti.length - 1];
    if (!ultimo) return;
    setGesti((g) => g.slice(0, -1));
    if (ultimo.tipo === "riempi") {
      setRiempite((r) => {
        const n = { ...r };
        if (ultimo.prima) n[ultimo.parte] = ultimo.prima;
        else delete n[ultimo.parte];
        return n;
      });
    } else {
      tratti.current.pop();
      ridisegna();
    }
  };

  const fatto = useCallback(() => {
    parla(livello + 1 >= DISEGNI.length ? "Che capolavori!" : "Bellissimo!");
    if (livello + 1 >= DISEGNI.length) {
      setFinito(true);
      onComplete?.({ score: DISEGNI.length, stars: 3 });
      return;
    }
    setLivello((l) => l + 1);
    pulisci();
    setStrumento("secchiello");
  }, [livello, onComplete, pulisci]);

  // ?demo=1: si colora da solo, una parte ogni mezzo secondo.
  useEffect(() => {
    if (!demo || finito) return;
    let i = 1;
    const id = window.setInterval(() => {
      const parte = disegno.parti[i];
      if (!parte) {
        window.clearInterval(id);
        window.setTimeout(fatto, 800);
        return;
      }
      setRiempite((r) => ({ ...r, [parte.id]: COLORI[i % COLORI.length].hex }));
      i++;
    }, 500);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, livello, finito]);

  const ancora = () => {
    setLivello(0);
    pulisci();
    setFinito(false);
  };

  /** Il PNG: colori + disegno a mano + contorni, tutto nel browser. */
  const salva = async () => {
    const out = document.createElement("canvas");
    out.width = LATO;
    out.height = LATO;
    const ctx = out.getContext("2d")!;
    const svgInImmagine = async (svg: SVGSVGElement | null) => {
      if (!svg) return;
      const copia = svg.cloneNode(true) as SVGSVGElement;
      copia.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      copia.setAttribute("width", String(LATO));
      copia.setAttribute("height", String(LATO));
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copia)], { type: "image/svg+xml" }));
      const img = new Image();
      await new Promise((ok, ko) => {
        img.onload = ok;
        img.onerror = ko;
        img.src = url;
      });
      ctx.drawImage(img, 0, 0, LATO, LATO);
      URL.revokeObjectURL(url);
    };
    await svgInImmagine(svgColori.current);
    if (tela.current) ctx.drawImage(tela.current, 0, 0);
    await svgInImmagine(svgContorni.current);
    const a = document.createElement("a");
    a.download = `${disegno.id}-colorato-giocamizi.png`;
    a.href = out.toDataURL("image/png");
    a.click();
  };

  const STRUMENTI: { id: Strumento; nome: string; Icona: typeof Brush }[] = [
    { id: "secchiello", nome: "Riempi", Icona: PaintBucket },
    { id: "pennello", nome: "Pennello", Icona: Brush },
    { id: "gomma", nome: "Gomma", Icona: Eraser },
  ];

  return (
    <GameShell titolo="Colora con Mizi" istruzione={disegno.istruzione} round={livello} totaleRound={DISEGNI.length} finito={finito} stelle={3} onAncora={ancora}>
      <div className="flex w-full max-w-xl flex-col items-center gap-3">
        {/* Il foglio */}
        <div className="relative aspect-square w-[min(100%,44vh)] overflow-hidden rounded-[1.6rem] border-2 border-crema-scuro bg-white shadow-sm">
          <svg ref={svgColori} viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" data-colori>
            {disegno.parti.map((p) => (
              <Figura
                key={p.id}
                f={p.forma}
                fill={riempite[p.id] ?? "#FFFFFF"}
                onClick={() => riempi(p.id)}
                style={{ cursor: strumento === "secchiello" ? "pointer" : undefined }}
                data-parte={p.id}
              />
            ))}
          </svg>
          <canvas
            ref={tela}
            width={LATO}
            height={LATO}
            onPointerDown={giu}
            onPointerMove={muovi}
            onPointerUp={su}
            onPointerCancel={su}
            className="absolute inset-0 h-full w-full"
            style={{ pointerEvents: strumento === "secchiello" ? "none" : "auto", touchAction: strumento === "secchiello" ? "auto" : "none" }}
            aria-label="Foglio per disegnare con il dito"
            data-tela
          />
          <svg ref={svgContorni} viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {/* Ogni contorno è nascosto dove una parte disegnata dopo lo copre:
                si vedono solo le linee vere, come in un album da colorare. */}
            <defs>
              {disegno.parti.map((p, i) => (
                <mask key={p.id} id={`${disegno.id}-m-${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={400} height={400}>
                  <rect x={0} y={0} width={400} height={400} fill="#FFFFFF" />
                  {disegno.parti.slice(i + 1).map((q) => (
                    <Figura key={q.id} f={q.forma} fill="#000000" />
                  ))}
                </mask>
              ))}
            </defs>
            {disegno.parti.map((p, i) => (
              <Figura key={p.id} f={p.forma} fill="none" stroke="#1F2430" strokeWidth={5} strokeLinejoin="round" mask={`url(#${disegno.id}-m-${i})`} />
            ))}
            {disegno.dettagli?.map((d, i) => (
              <Figura key={i} f={d.forma} fill={d.pieno ? "#1F2430" : "none"} stroke="#1F2430" strokeWidth={5} strokeLinecap="round" />
            ))}
          </svg>
        </div>

        {/* Strumenti */}
        <div className="flex w-full items-center gap-2">
          {STRUMENTI.map(({ id, nome, Icona }) => (
            <button
              key={id}
              type="button"
              aria-pressed={strumento === id}
              onClick={() => setStrumento(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl border-2 py-2 text-xs font-black ${strumento === id ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white text-notte"}`}
              style={{ minHeight: 0, minWidth: 0 }}
              data-strumento={id}
            >
              <Icona className="h-6 w-6" strokeWidth={2.4} aria-hidden />
              {nome}
            </button>
          ))}
          <button type="button" onClick={annulla} disabled={!gesti.length} aria-label="Annulla l'ultimo gesto" className="flex h-[3.6rem] w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-crema-scuro bg-white text-notte disabled:opacity-40" style={{ minHeight: 0, minWidth: 0 }} data-annulla>
            <Undo2 className="h-6 w-6" strokeWidth={2.4} aria-hidden />
          </button>
        </div>

        {/* Colori */}
        <div className="grid w-full grid-cols-6 gap-2" role="radiogroup" aria-label="Colori">
          {COLORI.map((c) => (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={colore === c.hex}
              aria-label={c.nome}
              onClick={() => scegliColore(c)}
              className={`aspect-square rounded-full border-[3px] transition-transform ${colore === c.hex ? "scale-110 border-notte shadow-md" : "border-crema-scuro"}`}
              style={{ background: c.hex, minHeight: 0, minWidth: 0 }}
              data-colore={c.nome}
            />
          ))}
        </div>

        {strumento !== "secchiello" && (
          <div className="flex w-full gap-2" role="radiogroup" aria-label="Grandezza">
            {GRANDEZZE.map((g) => (
              <button
                key={g.px}
                type="button"
                role="radio"
                aria-checked={grandezza === g.px}
                onClick={() => setGrandezza(g.px)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-2 text-sm font-black ${grandezza === g.px ? "border-notte bg-notte text-white" : "border-crema-scuro bg-white text-notte"}`}
                style={{ minHeight: 0, minWidth: 0 }}
              >
                <span className="rounded-full bg-current" style={{ width: g.px / 2.5, height: g.px / 2.5 }} aria-hidden />
                {g.nome}
              </button>
            ))}
          </div>
        )}

        <div className="flex w-full gap-2">
          <button type="button" onClick={() => void salva()} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-viola bg-white py-3 font-black text-viola" data-salva>
            <Camera className="h-5 w-5" strokeWidth={2.6} aria-hidden /> Salva
          </button>
          <button type="button" onClick={fatto} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-viola py-3 text-lg font-black text-white" data-fatto>
            <Check className="h-5 w-5" strokeWidth={3} aria-hidden /> Fatto
          </button>
        </div>
      </div>
    </GameShell>
  );
}
