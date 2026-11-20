"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla, preparaVoci } from "@/lib/giochi/audio";
import { suona } from "@/lib/giochi/suoni";
import { aggiorna, creaTratto, filePerTratto, pilota, prossimaMossa, salta, sposta, type Cosa, type SpecTratto, type StatoCorsa } from "./corsa-logica";
import { useRound } from "./nucleo";
import type { GameProps } from "./tipi";

/**
 * Il motore delle corse a tre strade (20/11/2026).
 *
 * Mizi corre in un corridoio visto dall'alto e da dietro; le cose le vengono
 * incontro e lei cambia strada o salta. Un gioco di questo tipo è un elenco di
 * tratti (`SpecTratto`): ogni tratto è un round e finisce al portale.
 *
 * Regole di casa: nessuna vita, nessun tempo, nessuna fretta. Un urto fa
 * ripartire piano e conta come errore del round; al terzo urto dello stesso
 * tratto scatta l'aiuto: si va più calmi e la strada libera si illumina.
 *
 * La logica sta in corsa-logica.ts; qui ci sono lo schermo, i comandi e, in
 * fondo, i disegni. Il metodo è in .claude/skills/accademia-giochi.
 */

/** Le frasi comuni a tutte le corse: stanno identiche in content/voce-mizi.json. */
export const FRASI_CORSA = {
  urto: "Ops! Niente paura, si riparte.",
  aiuto: "Ti aiuto io: segui la strada che si illumina.",
  stella: "Una stella! Adesso niente ti ferma.",
} as const;

const ERRORI_PER_AIUTO = 3;
/** La simulazione avanza a passi uguali: stessa partita su ogni telefono. */
const PASSO = 1 / 120;

export interface CorsaProps extends GameProps {
  titolo: string;
  tratti: SpecTratto[];
}

interface Particella {
  x: number;
  y: number;
  /** Distanza da Mizi (avanti positivo). */
  z: number;
  vx: number;
  vy: number;
  vita: number;
  colore: string;
}

/** Quello che serve solo al disegno e ai comandi: non è stato di partita. */
interface Vista {
  tempo: number;
  /** Schiaccia (negativo) e allunga (positivo) di Mizi. */
  molla: number;
  /** La telecamera segue Mizi di lato, con ritardo. */
  camera: number;
  /** Fermo immagine brevissimo dopo un urto. */
  fermo: number;
  attesaPilota: number;
  urtiTratto: number;
  polvere: number;
  particelle: Particella[];
}

const vistaNuova = (): Vista => ({ tempo: 0, molla: 0, camera: 0, fermo: 0, attesaPilota: 0, urtiTratto: 0, polvere: 0, particelle: [] });

export function Corsa({ titolo, tratti, age, onProgress, onComplete, demo = false }: CorsaProps) {
  const totale = tratti.length;
  const partita = useRound({ totale, onProgress, onComplete, erroriPerAiuto: ERRORI_PER_AIUTO, pausa: 1500 });
  const { indice, finito, aiuto } = partita;
  const [giro, setGiro] = useState(0);

  const tela = useRef<HTMLCanvasElement>(null);
  const campo = useRef<HTMLDivElement>(null);
  const stato = useRef<StatoCorsa | null>(null);
  const vista = useRef<Vista>(vistaNuova());
  // Il ciclo parte una volta sola: quello che cambia a ogni disegno lo legge da qui.
  const ora = useRef({ partita, demo, indice, finito, fatto: tratti[0]?.fatto });
  useEffect(() => {
    ora.current = { partita, demo, indice, finito, fatto: tratti[indice]?.fatto };
  });

  useEffect(() => {
    preparaVoci([...Object.values(FRASI_CORSA), ...tratti.flatMap((t) => [t.istruzione, t.fatto])]);
  }, [tratti]);

  // Un tratto nuovo a ogni round (e a ogni «Ancora»).
  useEffect(() => {
    if (finito) return;
    const prima = stato.current;
    const nuovo = creaTratto(tratti[indice], age, filePerTratto(demo));
    // Le gemme si contano per tutta la partita, non per piano.
    if (indice > 0 && prima) nuovo.gemme = prima.gemme;
    stato.current = nuovo;
    vista.current.urtiTratto = 0;
    vista.current.particelle = [];
  }, [indice, finito, tratti, age, demo, giro]);

  useEffect(() => {
    if (stato.current) stato.current.aiuto = aiuto;
  }, [aiuto, indice, giro]);

  const muovi = useCallback((verso: -1 | 1) => {
    const s = stato.current;
    if (!s || s.arrivato || ora.current.finito) return;
    const prima = s.strada;
    sposta(s, verso);
    if (s.strada !== prima) suona("gira");
  }, []);

  const saltaOra = useCallback(() => {
    const s = stato.current;
    if (!s || s.arrivato || ora.current.finito) return;
    if (salta(s)) {
      suona("salto");
      vista.current.molla = 0.28;
    }
  }, []);

  const ricomincia = useCallback(() => {
    partita.ricomincia();
    setGiro((g) => g + 1);
  }, [partita]);

  // Tastiera: frecce per cambiare strada, freccia su o spazio per saltare.
  useEffect(() => {
    const tasto = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") muovi(-1);
      else if (e.key === "ArrowRight") muovi(1);
      else if (e.key === "ArrowUp" || e.key === " ") saltaOra();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", tasto);
    return () => window.removeEventListener("keydown", tasto);
  }, [muovi, saltaOra]);

  // Dito: lo scorrimento scatta mentre il dito si muove (18 px), non quando si
  // alza; continuando a trascinare si fa una seconda mossa. Un tocco è un salto.
  const gesto = useRef<{ x: number; y: number; fatto: boolean } | null>(null);
  const giu = (e: React.PointerEvent<HTMLCanvasElement>) => {
    gesto.current = { x: e.clientX, y: e.clientY, fatto: false };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Non tutti i browser lo permettono: il gesto funziona lo stesso.
    }
  };
  const mosso = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = gesto.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < (g.fatto ? 46 : 18)) return;
    g.fatto = true;
    g.x = e.clientX;
    g.y = e.clientY;
    if (Math.abs(dx) > Math.abs(dy)) muovi(dx > 0 ? 1 : -1);
    else if (dy < 0) saltaOra();
  };
  const su = () => {
    if (gesto.current && !gesto.current.fatto) saltaOra();
    gesto.current = null;
  };

  // Il ciclo: un solo requestAnimationFrame, simulazione a passi fissi.
  useEffect(() => {
    const c = tela.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const riduci = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mizi = faiPose();
    const m: Misure = { larghezza: 300, altezza: 300, fuoco: 300, centro: 0, punto: 3, densita: 0 };

    const misura = () => {
      const r = c.getBoundingClientRect();
      m.larghezza = Math.max(200, r.width);
      m.altezza = Math.max(200, r.height);
      m.fuoco = Math.min(m.altezza * 0.95, m.larghezza * 1.75);
      m.centro = m.altezza * 0.62;
      m.punto = Math.max(2, Math.round(((m.fuoco / PROFONDITA_MIZI) * 1.8) / ALTEZZA_FIGURA));
      // Si parte dalla densità dello schermo, con un tetto di pixel in tutto.
      if (!m.densita) m.densita = Math.max(0.5, Math.min(2, window.devicePixelRatio || 1, Math.sqrt(1.3e6 / (m.larghezza * m.altezza))));
      c.width = Math.round(m.larghezza * m.densita);
      c.height = Math.round(m.altezza * m.densita);
      ctx.setTransform(m.densita, 0, 0, m.densita, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    misura();
    const osservatore = new ResizeObserver(misura);
    osservatore.observe(c);

    const scintille = (x: number, y: number, z: number, colore: string, quante: number) => {
      const v = vista.current;
      for (let i = 0; i < quante; i++) {
        v.particelle.push({ x, y, z, vx: (Math.random() - 0.5) * 5, vy: 2 + Math.random() * 4, vita: 0.5 + Math.random() * 0.3, colore });
      }
    };

    const passo = (dt: number) => {
      const s = stato.current;
      const v = vista.current;
      v.tempo += dt;
      if (!s || ora.current.finito) return;
      if (v.fermo > 0) {
        v.fermo -= dt;
        return;
      }
      v.molla += (0 - v.molla) * (1 - Math.exp(-dt * 11));
      v.camera += (s.x * CORSIA * 0.42 - v.camera) * (1 - Math.exp(-dt * 6));
      for (const p of v.particelle) {
        p.vita -= dt;
        p.vy -= 14 * dt;
        p.x += p.vx * dt;
        p.y = Math.max(0, p.y + p.vy * dt);
        p.z -= s.velocitaOra * 0.5 * dt;
      }
      v.particelle = v.particelle.filter((p) => p.vita > 0 && p.z > -3);

      if (s.arrivato) {
        // Oltre il portale Mizi continua a correre finché non arriva il tratto dopo.
        s.percorso += s.velocitaOra * dt;
        s.x += (s.strada - s.x) * (1 - Math.exp(-dt * 16));
        return;
      }

      if (ora.current.demo) {
        v.attesaPilota -= dt;
        const mossa = pilota(s);
        if (mossa.sposta && v.attesaPilota <= 0) {
          sposta(s, mossa.sposta);
          v.attesaPilota = 0.14;
        }
        if (mossa.salta && salta(s)) {
          suona("salto");
          v.molla = 0.28;
        }
      }

      for (const e of aggiorna(s, dt)) {
        if (e.tipo === "gemma") {
          suona("gemma");
          scintille(e.cosa.strada * CORSIA, e.cosa.alta ? 2 : 0.9, 0, COLORI.gemma, 4);
        } else if (e.tipo === "cassa") {
          suona("cassa");
          scintille(e.cosa.strada * CORSIA, 0.6, 0, COLORI.legno, 10);
          scintille(e.cosa.strada * CORSIA, 1, 0, COLORI.gemma, 5);
        } else if (e.tipo === "stella") {
          suona("livello");
          parla(FRASI_CORSA.stella);
        } else if (e.tipo === "urto") {
          v.urtiTratto += 1;
          v.fermo = riduci ? 0 : 0.07;
          v.molla = -0.25;
          scintille(s.x * CORSIA, 1, 0, COLORI.sabbia, 8);
          // Mizi lo dice al primo urto del tratto e quando scatta l'aiuto; gli altri
          // urti hanno solo il suono morbido, se no ripeterebbe la stessa frase.
          if (v.urtiTratto === 1) ora.current.partita.sbagliato(FRASI_CORSA.urto);
          else if (v.urtiTratto === ERRORI_PER_AIUTO) ora.current.partita.sbagliato(FRASI_CORSA.aiuto, { aiuto: true });
          else suona("riprova");
        } else if (e.tipo === "salto") {
          suona("salto");
          v.molla = 0.28;
        } else if (e.tipo === "atterra") {
          v.molla = -0.3;
          scintille(s.x * CORSIA, 0.1, 0, COLORI.sabbia, 5);
        } else if (e.tipo === "portale") {
          ora.current.partita.giusto(ora.current.fatto);
        }
      }

      // Un po' di polvere sotto le zampe mentre corre.
      v.polvere -= dt;
      if (s.y === 0 && v.polvere <= 0) {
        v.polvere = 0.16;
        v.particelle.push({ x: s.x * CORSIA + (Math.random() - 0.5) * 0.5, y: 0.05, z: -0.2, vx: (Math.random() - 0.5) * 1.5, vy: 1 + Math.random() * 1.5, vita: 0.35, colore: COLORI.sabbia });
      }
    };

    // Lo stato si legge da fuori con gli attributi data-: li usano le prove.
    const scritti = { strada: "", urti: "", gemme: "", aria: "" };
    const scrivi = () => {
      const s = stato.current;
      const el = campo.current;
      if (!s || !el) return;
      const nuovi = { strada: String(s.strada), urti: String(s.urti), gemme: String(s.gemme), aria: s.y > 0 ? "si" : "no" };
      if (nuovi.strada !== scritti.strada) el.setAttribute("data-strada", (scritti.strada = nuovi.strada));
      if (nuovi.urti !== scritti.urti) el.setAttribute("data-urti", (scritti.urti = nuovi.urti));
      if (nuovi.gemme !== scritti.gemme) el.setAttribute("data-gemme", (scritti.gemme = nuovi.gemme));
      if (nuovi.aria !== scritti.aria) el.setAttribute("data-in-aria", (scritti.aria = nuovi.aria));
    };

    let vivo = true;
    let ultimo = 0;
    let accumulo = 0;
    let lenti = 0;
    let sommaLenti = 0;
    let richiesta = 0;
    const fotogramma = (adesso: number) => {
      if (!vivo) return;
      const trascorso = (adesso - ultimo) / 1000 || 0;
      ultimo = adesso;
      if (!document.hidden) {
        // Dopo una pausa lunga non si recupera tutto: al massimo un quarto di secondo.
        accumulo += Math.min(0.25, trascorso);
        while (accumulo >= PASSO) {
          passo(PASSO);
          accumulo -= PASSO;
        }
        disegna(ctx, m, stato.current, vista.current, { indice: ora.current.indice, mizi, riduci });
        scrivi();
        // Risoluzione adattiva: se la media di 30 fotogrammi è sotto i 48 al secondo, meno pixel.
        if (trascorso < 1) {
          sommaLenti += trascorso;
          if (++lenti >= 30) {
            const media = sommaLenti / lenti;
            if (media > 0.021 && m.densita > 0.5) {
              m.densita = Math.max(0.5, m.densita * Math.max(0.5, 0.017 / media));
              misura();
            }
            lenti = 0;
            sommaLenti = 0;
          }
        }
      }
      richiesta = requestAnimationFrame(fotogramma);
    };
    richiesta = requestAnimationFrame(fotogramma);

    return () => {
      vivo = false;
      cancelAnimationFrame(richiesta);
      osservatore.disconnect();
    };
  }, []);

  const bottone = "flex min-h-16 items-center justify-center rounded-morbido bg-white text-notte shadow-sm active:translate-y-0.5";

  return (
    <GameShell titolo={titolo} istruzione={tratti[indice]?.istruzione ?? ""} round={indice} totaleRound={totale} finito={finito} stelle={partita.stelle} onAncora={ricomincia}>
      <div ref={campo} className="mx-auto flex w-full max-w-xl flex-col gap-4" data-corsa {...partita.attributi}>
        <canvas
          ref={tela}
          className="block w-full touch-none select-none rounded-morbido"
          style={{ height: "min(52vh, 560px)", minHeight: 260 }}
          role="img"
          aria-label="Mizi corre nel corridoio della piramide"
          onPointerDown={giu}
          onPointerMove={mosso}
          onPointerUp={su}
          onPointerCancel={() => (gesto.current = null)}
        />
        <div className="grid grid-cols-3 gap-4">
          <button type="button" className={bottone} onClick={() => muovi(-1)} aria-label="Vai a sinistra" data-comando="sinistra">
            <Freccia verso="sinistra" />
          </button>
          <button type="button" className={`${bottone} text-xl font-extrabold`} onClick={saltaOra} data-comando="salta">
            Salta
          </button>
          <button type="button" className={bottone} onClick={() => muovi(1)} aria-label="Vai a destra" data-comando="destra">
            <Freccia verso="destra" />
          </button>
        </div>
      </div>
    </GameShell>
  );
}

function Freccia({ verso }: { verso: "sinistra" | "destra" }) {
  return (
    <svg viewBox="0 0 24 24" width={32} height={32} aria-hidden style={verso === "destra" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// I disegni. Lo stile della corsa si cambia qui, non nella logica.
// ---------------------------------------------------------------------------

/** Larghezza di una strada, metà corridoio, altezza dei muri, in unità di mondo. */
const CORSIA = 1.5;
const MEZZO = 2.5;
const MURO = 4.2;
/** Quanto si vede lontano e quanto è lunga una lastra del pavimento. */
const LONTANO = 70;
const LASTRA = 4;
/** La telecamera sta in alto dietro Mizi e guarda in giù di 32 gradi. */
const INCLINAZIONE = (32 * Math.PI) / 180;
const COS = Math.cos(INCLINAZIONE);
const SEN = Math.sin(INCLINAZIONE);
const ALTEZZA_CAMERA = 5.2;
const DIETRO = 7.7;
const PROFONDITA_MIZI = ALTEZZA_CAMERA * SEN + DIETRO * COS;

const COLORI = { gemma: "#2fd6c3", legno: "#c98a4a", sabbia: "#e6cfa4", oro: "#f2c14e", aiuto: "#9B6DD6" } as const;

type Terna = [number, number, number];
/** Una tavolozza per tratto: muri, pavimento e il buio in fondo. */
const TAVOLOZZE: { muroA: Terna; muroB: Terna; terraA: Terna; terraB: Terna; fondo: Terna }[] = [
  { muroA: [150, 98, 58], muroB: [128, 82, 48], terraA: [196, 150, 96], terraB: [176, 132, 82], fondo: [26, 16, 38] },
  { muroA: [70, 112, 120], muroB: [56, 94, 104], terraA: [120, 160, 150], terraB: [100, 140, 134], fondo: [10, 22, 34] },
  { muroA: [140, 70, 84], muroB: [118, 56, 72], terraA: [190, 120, 110], terraB: [168, 102, 96], fondo: [34, 12, 24] },
  { muroA: [104, 96, 150], muroB: [86, 78, 130], terraA: [160, 150, 196], terraB: [140, 130, 178], fondo: [16, 14, 40] },
  { muroA: [150, 120, 60], muroB: [128, 100, 46], terraA: [214, 180, 110], terraB: [194, 160, 94], fondo: [30, 20, 30] },
];

interface Misure {
  larghezza: number;
  altezza: number;
  /** Distanza focale: decide quanto sono grandi le cose. */
  fuoco: number;
  /** Altezza sullo schermo del punto che la telecamera guarda. */
  centro: number;
  /** Lato di un quadretto della figura di Mizi, in pixel CSS. */
  punto: number;
  /** Pixel del canvas per pixel CSS. */
  densita: number;
}

type Punto = [number, number, number];

/** Dal mondo allo schermo: x di lato, y in alto, z avanti rispetto a Mizi. */
function proietta(m: Misure, camera: number, x: number, y: number, z: number): Punto {
  const dy = y - ALTEZZA_CAMERA;
  const dz = z + DIETRO;
  const profondita = Math.max(0.3, dz * COS - dy * SEN);
  const scala = m.fuoco / profondita;
  return [m.larghezza / 2 + (x - camera) * scala, m.centro - (dy * COS + dz * SEN) * scala, scala];
}

const mescola = (a: Terna, b: Terna, t: number) => `rgb(${(a[0] + (b[0] - a[0]) * t) | 0},${(a[1] + (b[1] - a[1]) * t) | 0},${(a[2] + (b[2] - a[2]) * t) | 0})`;

function quadro(ctx: CanvasRenderingContext2D, a: Punto, b: Punto, c: Punto, d: Punto, colore: string) {
  ctx.fillStyle = colore;
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.lineTo(d[0], d[1]);
  ctx.closePath();
  ctx.fill();
}

let alone: HTMLCanvasElement | null = null;
/** L'alone delle torce: disegnato una volta, poi copiato. */
function aloneTorcia(): HTMLCanvasElement {
  if (alone) return alone;
  alone = document.createElement("canvas");
  alone.width = alone.height = 64;
  const g = alone.getContext("2d");
  if (g) {
    const sfumatura = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    sfumatura.addColorStop(0, "rgba(255,170,80,.6)");
    sfumatura.addColorStop(1, "rgba(255,170,80,0)");
    g.fillStyle = sfumatura;
    g.fillRect(0, 0, 64, 64);
  }
  return alone;
}

interface Pose {
  corsa: HTMLCanvasElement[];
  salto: HTMLCanvasElement;
}

function disegna(ctx: CanvasRenderingContext2D, m: Misure, s: StatoCorsa | null, v: Vista, opzioni: { indice: number; mizi: Pose; riduci: boolean }) {
  const tav = TAVOLOZZE[opzioni.indice % TAVOLOZZE.length];
  const P = (x: number, y: number, z: number) => proietta(m, v.camera, x, y, z);
  const strada = s?.percorso ?? v.tempo * 4;
  const buio: Terna = [12, 8, 18];

  ctx.fillStyle = mescola(tav.fondo, tav.fondo, 0);
  ctx.fillRect(0, 0, m.larghezza, m.altezza);

  // Corridoio: lastre dal fondo verso chi guarda, che sfumano nel buio.
  const scarto = strada % LASTRA;
  const base = Math.floor(strada / LASTRA);
  for (let k = Math.ceil(LONTANO / LASTRA); k >= -1; k--) {
    let z0 = k * LASTRA - scarto;
    const z1 = z0 + LASTRA;
    if (z1 < -7) continue;
    z0 = Math.max(z0, -7);
    const pari = (base + k) & 1;
    const t = Math.pow(Math.max(0, Math.min(1, z0 / LONTANO)), 0.8);
    quadro(ctx, P(-MEZZO, 0, z1), P(MEZZO, 0, z1), P(MEZZO, 0, z0), P(-MEZZO, 0, z0), mescola(pari ? tav.terraA : tav.terraB, tav.fondo, t));
    quadro(ctx, P(-MEZZO, 0, z1), P(-MEZZO, MURO, z1), P(-MEZZO, MURO, z0), P(-MEZZO, 0, z0), mescola(pari ? tav.muroA : tav.muroB, tav.fondo, t));
    quadro(ctx, P(MEZZO, 0, z1), P(MEZZO, MURO, z1), P(MEZZO, MURO, z0), P(MEZZO, 0, z0), mescola(pari ? tav.muroB : tav.muroA, tav.fondo, t));
    const fascia = mescola(pari ? tav.muroB : tav.muroA, buio, 0.35 + t * 0.4);
    for (const lato of [-MEZZO, MEZZO]) quadro(ctx, P(lato, 2.9, z1), P(lato, 3.3, z1), P(lato, 3.3, z0), P(lato, 2.9, z0), fascia);
    if (z1 - z0 > 3.9) {
      // Segni dorati incisi nella fascia: tre forme che si ripetono.
      const oro = mescola([242, 193, 78], tav.fondo, Math.min(1, t + 0.25));
      const forma = (((base + k) % 3) + 3) % 3;
      const za = z0 + 1.4;
      const zb = z0 + (forma === 1 ? 1.8 : 2.4);
      const ya = forma === 2 ? 3.02 : 2.98;
      const yb = forma === 2 ? 3.14 : 3.22;
      for (const lato of [-MEZZO + 0.01, MEZZO - 0.01]) quadro(ctx, P(lato, ya, zb), P(lato, yb, zb), P(lato, yb, za), P(lato, ya, za), oro);
    }
    if ((((base + k) % 4) + 4) % 4 === 0 && z0 > -3) {
      for (const lato of [-1, 1]) {
        const p = P(lato * (MEZZO - 0.05), 2.4, z0);
        const r = p[2] * 1.5;
        ctx.globalAlpha = 1 - t;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(aloneTorcia(), p[0] - r, p[1] - r, r * 2, r * 2);
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffd27a";
        ctx.beginPath();
        ctx.ellipse(p[0], p[1], p[2] * 0.09, p[2] * (0.16 + (opzioni.riduci ? 0 : 0.03 * Math.sin(v.tempo * 12 + k))), 0, 0, 7);
        ctx.fill();
      }
    }
  }
  ctx.strokeStyle = "rgba(0,0,0,.16)";
  ctx.lineWidth = 2;
  for (const x of [-CORSIA / 2, CORSIA / 2]) {
    const a = P(x, 0, LONTANO);
    const b = P(x, 0, -7);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  }
  if (!s) return;

  const visibili = s.cose.filter((c) => !c.fatta || c.tipo === "blocco" || c.tipo === "fosso").filter((c) => c.z - s.percorso > -6 && c.z - s.percorso < LONTANO);
  const sfuma = (z: number) => Math.max(0, Math.min(1, (LONTANO - z) / 14));

  // I fossi stanno nel pavimento: si disegnano prima di tutto il resto.
  for (const c of visibili) {
    if (c.tipo !== "fosso") continue;
    const z = c.z - s.percorso;
    ctx.globalAlpha = sfuma(z);
    quadro(ctx, P(-MEZZO, 0, z + 1), P(MEZZO, 0, z + 1), P(MEZZO, 0, z - 1), P(-MEZZO, 0, z - 1), "#07040b");
    quadro(ctx, P(-MEZZO, 0, z + 1), P(MEZZO, 0, z + 1), P(MEZZO, -0.6, z + 1), P(-MEZZO, -0.6, z + 1), "#3a2416");
    ctx.globalAlpha = 1;
  }

  // L'aiuto: la strada libera si illumina di viola (un colore che nella scena non c'è).
  if (s.aiuto && !s.arrivato) {
    const mossa = prossimaMossa(s);
    const fin = Math.max(9, Math.min(16, mossa.davanti + 2));
    const x = mossa.strada * CORSIA;
    const lampo = opzioni.riduci ? 0.4 : 0.32 + 0.12 * Math.sin(v.tempo * 6);
    ctx.globalAlpha = lampo;
    quadro(ctx, P(x - 0.62, 0.02, fin), P(x + 0.62, 0.02, fin), P(x + 0.62, 0.02, 0.6), P(x - 0.62, 0.02, 0.6), COLORI.aiuto);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    for (const lato of [-0.62, 0.62]) {
      const a = P(x + lato, 0.02, fin);
      const b = P(x + lato, 0.02, 0.6);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    if (mossa.salta) {
      // Tre frecce a terra prima del fosso: qui si salta.
      for (let i = 0; i < 3; i++) {
        const z = mossa.davanti - 1.6 - i * 1.1;
        if (z < 0.4) continue;
        const punta = P(x, 0.03, z + 0.5);
        const sx = P(x - 0.45, 0.03, z);
        const dx = P(x + 0.45, 0.03, z);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 7;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(sx[0], sx[1]);
        ctx.lineTo(punta[0], punta[1]);
        ctx.lineTo(dx[0], dx[1]);
        ctx.stroke();
        ctx.strokeStyle = COLORI.aiuto;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
  }

  // Dal più lontano al più vicino; Mizi entra al suo posto nella fila.
  let miziFatta = false;
  const portale = s.lunghezza - s.percorso;
  let portaleFatto = portale > LONTANO || portale < -6;
  for (let i = visibili.length - 1; i >= 0; i--) {
    const c = visibili[i];
    if (c.tipo === "fosso") continue;
    const z = c.z - s.percorso;
    if (!portaleFatto && portale >= z) {
      if (!miziFatta && portale <= 0) {
        disegnaMizi(ctx, m, s, v, opzioni, P);
        miziFatta = true;
      }
      disegnaPortale(ctx, P, portale, sfuma(portale));
      portaleFatto = true;
    }
    if (!miziFatta && z <= 0) {
      disegnaMizi(ctx, m, s, v, opzioni, P);
      miziFatta = true;
    }
    ctx.globalAlpha = sfuma(z);
    disegnaCosa(ctx, P, c, z, v.tempo, opzioni.riduci);
    ctx.globalAlpha = 1;
  }
  if (!portaleFatto) {
    if (!miziFatta && portale <= 0) {
      disegnaMizi(ctx, m, s, v, opzioni, P);
      miziFatta = true;
    }
    disegnaPortale(ctx, P, portale, sfuma(portale));
  }
  if (!miziFatta) disegnaMizi(ctx, m, s, v, opzioni, P);

  for (const p of v.particelle) {
    const q = P(p.x, p.y, p.z);
    ctx.globalAlpha = Math.min(1, p.vita * 2.5);
    ctx.fillStyle = p.colore;
    ctx.fillRect(q[0] - q[2] * 0.06, q[1] - q[2] * 0.06, q[2] * 0.12, q[2] * 0.12);
  }
  ctx.globalAlpha = 1;

  // Le gemme raccolte, in alto a sinistra: un numero che sale, niente da battere.
  const u = Math.max(16, Math.min(22, m.larghezza * 0.05));
  ctx.fillStyle = "rgba(20,13,31,.55)";
  ctx.beginPath();
  ctx.roundRect(10, 10, u * 4.2, u * 1.9, u * 0.6);
  ctx.fill();
  ctx.fillStyle = COLORI.gemma;
  ctx.beginPath();
  ctx.moveTo(10 + u, 10 + u * 0.35);
  ctx.lineTo(10 + u * 1.5, 10 + u * 0.95);
  ctx.lineTo(10 + u, 10 + u * 1.55);
  ctx.lineTo(10 + u * 0.5, 10 + u * 0.95);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff3dc";
  ctx.font = `800 ${Math.round(u * 1.1)}px Nunito, system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(String(s.gemme), 10 + u * 1.9, 10 + u);
}

type Proiezione = (x: number, y: number, z: number) => Punto;

function disegnaPortale(ctx: CanvasRenderingContext2D, P: Proiezione, z: number, alfa: number) {
  ctx.globalAlpha = alfa;
  const a = P(-MEZZO, MURO, z);
  const b = P(-MEZZO + 0.5, 0, z);
  const e = P(MEZZO - 0.5, MURO, z);
  const f = P(MEZZO, 0, z);
  const architrave = P(-MEZZO, 3.5, z);
  ctx.fillStyle = COLORI.oro;
  ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
  ctx.fillRect(e[0], e[1], f[0] - e[0], f[1] - e[1]);
  ctx.fillRect(a[0], a[1], f[0] - a[0], architrave[1] - a[1]);
  ctx.fillStyle = "#b3531a";
  ctx.fillRect(a[0], architrave[1] - a[2] * 0.14, f[0] - a[0], a[2] * 0.14);
  ctx.fillStyle = COLORI.gemma;
  const lato = a[2] * 0.4;
  ctx.fillRect((a[0] + f[0]) / 2 - lato / 2, (a[1] + architrave[1]) / 2 - lato / 2, lato, lato);
  ctx.globalAlpha = 1;
}

function disegnaCosa(ctx: CanvasRenderingContext2D, P: Proiezione, c: Cosa, z: number, tempo: number, fermo: boolean) {
  const x = c.strada * CORSIA;
  if (c.tipo === "blocco") {
    const a = P(x - 0.68, 2.3, z);
    const b = P(x + 0.68, 0, z);
    quadro(ctx, P(x - 0.68, 2.3, z + 1.2), P(x + 0.68, 2.3, z + 1.2), [b[0], a[1], a[2]], a, "#e6bd84");
    const l = b[0] - a[0];
    const h = b[1] - a[1];
    ctx.fillStyle = "#b9824a";
    ctx.fillRect(a[0], a[1], l, h);
    ctx.fillStyle = "#8a5a30";
    ctx.fillRect(a[0] + l * 0.14, a[1] + h * 0.12, l * 0.72, h * 0.76);
    ctx.fillStyle = "#e6bd84";
    ctx.beginPath();
    ctx.moveTo(a[0] + l * 0.5, a[1] + h * 0.25);
    ctx.lineTo(a[0] + l * 0.74, a[1] + h * 0.72);
    ctx.lineTo(a[0] + l * 0.26, a[1] + h * 0.72);
    ctx.closePath();
    ctx.fill();
  } else if (c.tipo === "cassa") {
    quadro(ctx, P(x - 0.55, 1.1, z + 1.1), P(x + 0.55, 1.1, z + 1.1), P(x + 0.55, 1.1, z), P(x - 0.55, 1.1, z), "#e0a868");
    const a = P(x - 0.55, 1.1, z);
    const b = P(x + 0.55, 0, z);
    const l = b[0] - a[0];
    const h = b[1] - a[1];
    ctx.fillStyle = COLORI.legno;
    ctx.fillRect(a[0], a[1], l, h);
    ctx.strokeStyle = "#7a4a20";
    ctx.lineWidth = Math.max(1.5, l * 0.09);
    ctx.strokeRect(a[0] + ctx.lineWidth / 2, a[1] + ctx.lineWidth / 2, l - ctx.lineWidth, h - ctx.lineWidth);
    ctx.beginPath();
    ctx.moveTo(a[0] + l * 0.5, a[1]);
    ctx.lineTo(a[0] + l * 0.5, a[1] + h);
    ctx.stroke();
    ctx.fillStyle = COLORI.gemma;
    ctx.beginPath();
    ctx.arc(a[0] + l * 0.5, a[1] + h * 0.5, l * 0.13, 0, 7);
    ctx.fill();
  } else if (c.tipo === "gemma") {
    const p = P(x, (c.alta ? 2.1 : 0.9) + (fermo ? 0 : Math.sin(tempo * 5 + c.z) * 0.08), z);
    const r = p[2] * 0.3;
    const giro = fermo ? 1 : Math.abs(Math.cos(tempo * 3 + c.z * 0.3)) * 0.7 + 0.3;
    ctx.fillStyle = COLORI.gemma;
    ctx.beginPath();
    ctx.moveTo(p[0], p[1] - r);
    ctx.lineTo(p[0] + r * 0.75 * giro, p[1]);
    ctx.lineTo(p[0], p[1] + r);
    ctx.lineTo(p[0] - r * 0.75 * giro, p[1]);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#b8fff5";
    ctx.beginPath();
    ctx.moveTo(p[0], p[1] - r);
    ctx.lineTo(p[0] + r * 0.3 * giro, p[1]);
    ctx.lineTo(p[0], p[1]);
    ctx.closePath();
    ctx.fill();
  } else if (c.tipo === "stella") {
    const p = P(x, 1 + (fermo ? 0 : Math.sin(tempo * 5) * 0.1), z);
    const u = p[2] * 0.11;
    ctx.fillStyle = "rgba(255,255,255,.2)";
    ctx.beginPath();
    ctx.arc(p[0], p[1], u * 5.5, 0, 7);
    ctx.fill();
    ctx.fillStyle = COLORI.oro;
    STELLA.forEach((riga, i) => {
      for (let j = 0; j < riga.length; j++) if (riga[j] === "#") ctx.fillRect(p[0] + (j - 3.5) * u, p[1] + (i - 3) * u, u + 0.6, u + 0.6);
    });
  }
}

const STELLA = ["   #   ", "  ###  ", "#######", " ##### ", " ## ## ", "##   ##"];

function disegnaMizi(ctx: CanvasRenderingContext2D, m: Misure, s: StatoCorsa, v: Vista, opzioni: { mizi: Pose; riduci: boolean }, P: Proiezione) {
  const terra = P(s.x * CORSIA, 0, 0);
  const scala = terra[2];
  ctx.fillStyle = "rgba(0,0,0,.35)";
  ctx.beginPath();
  ctx.ellipse(terra[0], terra[1], scala * 0.45 * (1 - Math.min(0.6, s.y * 0.3)), scala * 0.12, 0, 0, 7);
  ctx.fill();
  // Dopo un urto lampeggia per un attimo: è il segno che in quel momento niente la tocca.
  if (s.riparo > 0 && !opzioni.riduci && Math.floor(v.tempo * 14) % 2 === 0) return;
  const lato = m.punto;
  const larga = LARGHEZZA_FIGURA * lato;
  const alta = ALTEZZA_FIGURA * lato;
  const zampe = P(s.x * CORSIA, s.y, 0)[1];
  if (s.scudo > 0 && (s.scudo > 1.5 || Math.floor(v.tempo * 10) % 2)) {
    ctx.strokeStyle = COLORI.oro;
    ctx.lineWidth = lato * 2;
    ctx.beginPath();
    ctx.ellipse(terra[0], zampe - scala * 0.9, scala * 0.85, scala * 1.1, 0, 0, 7);
    ctx.stroke();
  }
  const figura = s.y > 0 ? opzioni.mizi.salto : opzioni.mizi.corsa[Math.floor(s.percorso * 0.55) % 4];
  // Si piega nel cambio di strada, si allunga allo stacco, si schiaccia all'atterraggio.
  const piega = opzioni.riduci ? 0 : Math.max(-0.3, Math.min(0.3, (s.strada - s.x) * 0.32));
  const sy = opzioni.riduci ? 1 : 1 + v.molla;
  const sx = opzioni.riduci ? 1 : 1 - v.molla * 0.6;
  ctx.save();
  ctx.translate(terra[0], zampe);
  ctx.rotate(piega);
  ctx.scale(sx, sy);
  ctx.drawImage(figura, -larga / 2, -alta + lato, larga, alta);
  ctx.restore();
}

// --- Mizi in pixel art, vista di spalle -------------------------------------

const LARGHEZZA_FIGURA = 40;
const ALTEZZA_FIGURA = 48;

interface Posa {
  /** Quanto è alzata ogni zampa (0–3). */
  zampaSx?: number;
  zampaDx?: number;
  /** Angolo di ogni ala; negativo = alzata. */
  alaSx?: number;
  alaDx?: number;
  /** Il corpo dondola di un quadretto a destra e a sinistra. */
  dondolo?: number;
  giu?: number;
  /** Le code della bandana si aprono. */
  code?: number;
  aliSu?: boolean;
}

function faiPose(): Pose {
  return {
    corsa: [
      faiMizi({ zampaSx: 0, zampaDx: 3, alaSx: 0.2, alaDx: 0.55, dondolo: -1 }),
      faiMizi({ zampaSx: 1, zampaDx: 1, alaSx: 0.38, alaDx: 0.38, giu: 1, code: 1 }),
      faiMizi({ zampaSx: 3, zampaDx: 0, alaSx: 0.55, alaDx: 0.2, dondolo: 1 }),
      faiMizi({ zampaSx: 1, zampaDx: 1, alaSx: 0.38, alaDx: 0.38, giu: 1, code: 1 }),
    ],
    salto: faiMizi({ zampaSx: 3, zampaDx: 3, alaSx: -1, alaDx: -1, aliSu: true, code: 1 }),
  };
}

/**
 * Disegna Mizi di spalle su un canvas di 40×48 quadretti: caschetto castano
 * col ciuffo, guance bianche, bandana rosa a pois annodata dietro, dorso nero
 * coi fianchi bianchi, zampe arancioni. Le forme sono ellissi piccole, poi ogni
 * quadretto viene portato al colore più vicino della tavolozza e si aggiunge
 * il contorno scuro: così i bordi restano netti.
 */
function faiMizi(posa: Posa): HTMLCanvasElement {
  const tela = document.createElement("canvas");
  tela.width = LARGHEZZA_FIGURA;
  tela.height = ALTEZZA_FIGURA;
  const g = tela.getContext("2d");
  if (!g) return tela;
  const NERO = "#2b2b36", NERO_LUCE = "#4a4a5c", NERO_OMBRA = "#17171e", CAPELLI = "#6a3d25", CAPELLI_LUCE = "#9a6640", CAPELLI_OMBRA = "#40220f";
  const ROSA = "#f26d9e", ROSA_OMBRA = "#c9487b", BIANCO = "#fff6ec", ARANCIO = "#f59a1c", ARANCIO_OMBRA = "#c96f0c", ARANCIO_LUCE = "#ffc76e";
  const tavolozza = [NERO, NERO_LUCE, NERO_OMBRA, CAPELLI, CAPELLI_LUCE, CAPELLI_OMBRA, ROSA, ROSA_OMBRA, BIANCO, ARANCIO, ARANCIO_OMBRA, ARANCIO_LUCE].map((c) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ]);
  const ox = posa.dondolo ?? 0;
  const oy = posa.giu ?? 0;
  const code = posa.code ?? 0;
  const ovale = (cx: number, cy: number, rx: number, ry: number, colore: string, giro = 0) => {
    g.fillStyle = colore;
    g.beginPath();
    g.ellipse(cx + ox, cy + oy, rx, ry, giro, 0, 7);
    g.fill();
  };
  const triangolo = (a: number[], b: number[], c: number[], colore: string) => {
    g.fillStyle = colore;
    g.beginPath();
    g.moveTo(a[0] + ox, a[1] + oy);
    g.lineTo(b[0] + ox, b[1] + oy);
    g.lineTo(c[0] + ox, c[1] + oy);
    g.closePath();
    g.fill();
  };
  const zampa = (x: number, alzata: number) => {
    g.fillStyle = alzata > 1 ? ARANCIO_LUCE : ARANCIO;
    g.beginPath();
    g.ellipse(x, 44.5 - alzata, 4.2, 2.4, 0, 0, 7);
    g.fill();
    if (alzata <= 1) {
      g.fillStyle = ARANCIO_OMBRA;
      g.fillRect(x - 3, 45 - alzata, 6, 1);
    }
  };
  const ala = (lato: -1 | 1, angolo: number) => {
    const cx = 20 + lato * 12.3;
    const cy = posa.aliSu ? 24 : 29;
    ovale(cx, cy, 3.2, 7.5, NERO, -lato * angolo);
    ovale(cx - lato * 0.8, cy - 1, 1.1, 4.2, lato < 0 ? NERO_LUCE : NERO_OMBRA, -lato * angolo);
  };

  zampa(15, posa.zampaSx ?? 0);
  zampa(25, posa.zampaDx ?? 0);
  triangolo([18, 41], [22, 41], [20, 45], NERO);
  ovale(20, 33.5, 11.6, 8.5, BIANCO);
  ovale(20, 32, 10.2, 11, NERO);
  ovale(15, 30, 2.2, 6, NERO_LUCE);
  ovale(25.5, 34, 2, 5.5, NERO_OMBRA);
  ala(-1, posa.alaSx ?? 0);
  ala(1, posa.alaDx ?? 0);
  ovale(20, 15, 10, 9, NERO);
  ovale(10.6, 18.6, 2.3, 2.7, BIANCO);
  ovale(29.4, 18.6, 2.3, 2.7, BIANCO);
  ovale(20, 22.5, 8.5, 2.5, ROSA);
  triangolo([17, 23], [20, 23], [15 - code, 29.5], ROSA);
  triangolo([20, 23], [23, 23], [25 + code, 29.5], ROSA);
  ovale(20, 23.5, 1.9, 1.5, ROSA_OMBRA);
  g.fillStyle = BIANCO;
  for (const [x, y] of [[14, 22], [17, 21], [22, 21], [25, 22], [17, 26], [23, 26]]) g.fillRect(x + ox, y + oy, 1, 1);
  ovale(20, 12.5, 11.5, 9.5, CAPELLI_OMBRA);
  ovale(20, 11.5, 11.2, 8.6, CAPELLI);
  ovale(16, 7, 5, 2.2, CAPELLI_LUCE);
  ovale(24.5, 12, 1, 5, CAPELLI_OMBRA);
  ovale(14, 13, 0.9, 4, CAPELLI_LUCE);
  ovale(21, 2.8, 1.4, 2.4, CAPELLI);
  ovale(18.4, 3.8, 1.3, 1.8, CAPELLI);

  const immagine = g.getImageData(0, 0, LARGHEZZA_FIGURA, ALTEZZA_FIGURA);
  const d = immagine.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 110) {
      d[i + 3] = 0;
      continue;
    }
    let scelto = 0;
    let distanza = Infinity;
    for (let j = 0; j < tavolozza.length; j++) {
      const t = tavolozza[j];
      const dd = (d[i] - t[0]) ** 2 + (d[i + 1] - t[1]) ** 2 + (d[i + 2] - t[2]) ** 2;
      if (dd < distanza) {
        distanza = dd;
        scelto = j;
      }
    }
    [d[i], d[i + 1], d[i + 2]] = tavolozza[scelto];
    d[i + 3] = 255;
  }
  const pieno = new Uint8ClampedArray(d);
  const acceso = (x: number, y: number) => x >= 0 && y >= 0 && x < LARGHEZZA_FIGURA && y < ALTEZZA_FIGURA && pieno[(y * LARGHEZZA_FIGURA + x) * 4 + 3] > 0;
  for (let y = 0; y < ALTEZZA_FIGURA; y++) {
    for (let x = 0; x < LARGHEZZA_FIGURA; x++) {
      if (acceso(x, y)) continue;
      if (acceso(x - 1, y) || acceso(x + 1, y) || acceso(x, y - 1) || acceso(x, y + 1)) {
        const i = (y * LARGHEZZA_FIGURA + x) * 4;
        d[i] = 20;
        d[i + 1] = 12;
        d[i + 2] = 30;
        d[i + 3] = 255;
      }
    }
  }
  g.putImageData(immagine, 0, 0);
  return tela;
}
