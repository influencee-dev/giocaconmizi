"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla, preparaVoci } from "@/lib/giochi/audio";
import { suona } from "@/lib/giochi/suoni";
import { Disegno, type NomeFigura } from "./arte";
import type { GameProps } from "./tipi";
import { useRound } from "./nucleo";
import {
  chiaveCella,
  costruisciSala,
  frasiDellaSala,
  missioneCompiuta,
  monete,
  muroTra,
  percorso,
  prossimoGiusto,
  quantePrese,
  scoperte,
  siPuoPrendere,
  stessaCella,
  voceDiPresa,
  type Cella,
  type Oggetto,
  type Sala,
  type SpecSala,
} from "./esplora-logica";

/**
 * Esplorazione a sale (17/11/2026). Mizi è in una mappa vista dall'alto: si
 * tocca una casella e lei ci va da sola per la strada più corta. Ogni sala ha
 * UNA missione (contare, scegliere, mettere in ordine, comporre una parola,
 * fare la spesa): compiuta la missione la porta si apre. Nell'ultima sala al
 * posto della porta c'è il tesoro.
 *
 * Regole di casa: nessun nemico, nessun tempo, nessuna vita da perdere. Una
 * cosa si prende solo se la si tocca apposta: passarci sopra andando altrove
 * non conta. Toccare la porta chiusa non è un errore: Mizi dice che manca
 * qualcosa e fa vedere una cosa da cercare. Dopo due cose prese per sbaglio
 * nella stessa sala, quella giusta si muove (nucleo comune).
 *
 * I disegni della mappa stanno tutti in fondo a questo file (Pavimento, Porta,
 * Tessera…): per cambiare stile si tocca solo lì.
 */

/** Le frasi del motore: identiche in content/voce-mizi.json, sotto lo slug del gioco. */
export const FRASI_ESPLORA = {
  portaChiusa: "La porta è ancora chiusa. Guarda cosa ti manca.",
  tesoroChiuso: "Il tesoro è ancora chiuso. Guarda cosa ti manca.",
  avanti: "Avanti, nella prossima sala!",
  tesoro: "Hai trovato il tesoro!",
};

const ERRORI_PER_AIUTO = 2;
/** Millisecondi per ogni casella percorsa. */
const PASSO_MS = 170;

type Meta = { tipo: "oggetto"; id: string } | { tipo: "porta" };

interface Giro {
  partita: number;
  sala: number;
  pos: Cella;
  /** La casella da cui Mizi è arrivata: ci torna se la cosa non si può prendere. */
  dietro: Cella | null;
  cammino: Cella[];
  meta: Meta | null;
  presi: string[];
  visitate: string[];
  /** La cosa mostrata dopo aver toccato la porta chiusa. */
  indizio: string | null;
  /** Cresce a ogni tocco: serve a non gestire due volte lo stesso arrivo. */
  n: number;
}

const giroNuovo = (partita: number, indice: number, sala: Sala): Giro => ({
  partita,
  sala: indice,
  pos: sala.partenza,
  dietro: null,
  cammino: [],
  meta: null,
  presi: [],
  visitate: [chiaveCella(sala.partenza)],
  indizio: null,
  n: 0,
});

export interface EsploraProps extends GameProps {
  titolo: string;
  sale: SpecSala[];
}

export function Esplora({ titolo, sale, onProgress, onComplete, demo = false }: EsploraProps) {
  const totale = sale.length;
  const partita = useRound({ totale, onProgress, onComplete, erroriPerAiuto: ERRORI_PER_AIUTO, pausa: 1300 });
  const { indice, finito, inPausa, giusto, sbagliato } = partita;

  // Le mappe si disegnano una volta per partita: «Ancora» ne fa di nuove.
  const [numeroPartita, setNumeroPartita] = useState(0);
  const [costruite, setCostruite] = useState<Sala[]>(() => sale.map((s) => costruisciSala(s)));
  const sala = costruite[Math.min(indice, totale - 1)];
  const ultima = indice >= totale - 1;

  const fresco = useMemo(() => giroNuovo(numeroPartita, indice, sala), [numeroPartita, indice, sala]);
  const [giro, setGiro] = useState<Giro>(fresco);
  // Sala nuova: il giro vecchio non vale più, senza aspettare un effetto.
  const g = giro.partita === numeroPartita && giro.sala === indice ? giro : fresco;

  const viste = useMemo(() => scoperte(sala, g.visitate), [sala, g.visitate]);
  const compiuta = missioneCompiuta(sala, g.presi);
  const prossimo = prossimoGiusto(sala, g.presi);
  const aiutoSu = !inPausa && !finito && prossimo && (partita.aiuto || g.indizio === prossimo.id) ? prossimo.id : undefined;

  useEffect(() => {
    preparaVoci([...Object.values(FRASI_ESPLORA), ...sale.flatMap(frasiDellaSala)]);
  }, [sale]);

  // Quello che serve dentro i tocchi, sempre aggiornato.
  const vivo = useRef({ sala, fresco, aiutoSu, fermo: finito || inPausa });
  useEffect(() => {
    vivo.current = { sala, fresco, aiutoSu, fermo: finito || inPausa };
  }, [sala, fresco, aiutoSu, finito, inPausa]);

  /**
   * Mizi va in una casella. «tocco»: se lì c'è una cosa che si vede, o la porta,
   * è quella la meta. «prendi»: la cosa è la meta anche se è ancora nella nebbia
   * (la demo e le frecce della tastiera).
   */
  const vai = useCallback((cella: Cella, modo: "tocco" | "prendi" = "tocco") => {
    const v = vivo.current;
    if (v.fermo) return;
    setGiro((prima) => {
      const p = prima.partita === v.fresco.partita && prima.sala === v.fresco.sala ? prima : v.fresco;
      const k = chiaveCella(cella);
      const cosa = v.sala.oggetti.find((o) => stessaCella(o, cella) && !p.presi.includes(o.id));
      const siVede = modo === "prendi" || scoperte(v.sala, p.visitate).has(k) || cosa?.id === v.aiutoSu;
      const meta: Meta | null = stessaCella(cella, v.sala.porta)
        ? { tipo: "porta" }
        : cosa && siVede
          ? { tipo: "oggetto", id: cosa.id }
          : null;
      const evita = new Set([...v.sala.oggetti.filter((o) => !p.presi.includes(o.id)).map(chiaveCella), chiaveCella(v.sala.porta)]);
      const strada = percorso(v.sala, p.pos, cella, evita);
      // Nella nebbia c'era una cosa: Mizi si ferma un passo prima e la scopre, senza salirci sopra.
      if (cosa && !meta) strada.pop();
      return { ...p, cammino: strada, meta, n: p.n + 1 };
    });
  }, []);

  // Un passo alla volta: ogni passo riparte dallo stato vero.
  useEffect(() => {
    if (!g.cammino.length || finito) return;
    const t = window.setTimeout(() => {
      setGiro((prima) => {
        if (!prima.cammino.length) return prima;
        const [qui, ...resto] = prima.cammino;
        const k = chiaveCella(qui);
        return { ...prima, pos: qui, dietro: prima.pos, cammino: resto, visitate: prima.visitate.includes(k) ? prima.visitate : [...prima.visitate, k] };
      });
    }, PASSO_MS);
    return () => window.clearTimeout(t);
  }, [g.cammino, finito]);

  // Arrivata alla meta: prende la cosa, oppure prova la porta.
  const gestito = useRef("");
  useEffect(() => {
    if (g.cammino.length || !g.meta || finito || inPausa) return;
    const firma = `${g.partita}-${g.sala}-${g.n}`;
    if (gestito.current === firma) return;
    gestito.current = firma;
    const meta = g.meta;

    if (meta.tipo === "porta") {
      if (compiuta) {
        setGiro({ ...g, meta: null });
        giusto(ultima ? FRASI_ESPLORA.tesoro : FRASI_ESPLORA.avanti);
        return;
      }
      suona("gira");
      parla(ultima ? FRASI_ESPLORA.tesoroChiuso : FRASI_ESPLORA.portaChiusa);
      setGiro({ ...g, meta: null, pos: g.dietro ?? g.pos, indizio: prossimo?.id ?? null });
      return;
    }

    const cosa = sala.oggetti.find((o) => o.id === meta.id);
    if (!cosa || g.presi.includes(cosa.id)) {
      setGiro({ ...g, meta: null });
      return;
    }
    if (!siPuoPrendere(sala, g.presi, cosa)) {
      // Al secondo sbaglio nella sala parla il nucleo: «Ti aiuto io».
      sbagliato(partita.erroriRound + 1 === ERRORI_PER_AIUTO ? undefined : sala.spec.errore);
      // La cosa resta dov'è e Mizi torna un passo indietro: così si rivede.
      setGiro({ ...g, meta: null, pos: g.dietro ?? g.pos });
      return;
    }
    const presi = [...g.presi, cosa.id];
    const voce = voceDiPresa(sala, cosa, quantePrese(sala, presi));
    if (missioneCompiuta(sala, presi)) {
      suona("livello");
      parla(voce);
      parla(sala.spec.fatto, "it-IT", { accoda: true });
    } else {
      suona("coppia");
      parla(voce);
    }
    setGiro({ ...g, meta: null, presi, indizio: null });
  }, [g, sala, compiuta, prossimo, ultima, finito, inPausa, giusto, sbagliato, partita.erroriRound]);

  // Da computer: le frecce spostano di una casella; la freccia verso una cosa la prende.
  const posizione = useRef(g.pos);
  useEffect(() => {
    posizione.current = g.pos;
  }, [g.pos]);
  useEffect(() => {
    const FRECCE: Record<string, Cella> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
    const tasto = (e: KeyboardEvent) => {
      const passo = FRECCE[e.key];
      if (!passo) return;
      e.preventDefault();
      const qui = posizione.current;
      const { sala: s } = vivo.current;
      const li = { x: qui.x + passo.x, y: qui.y + passo.y };
      if (li.x < 0 || li.y < 0 || li.x >= s.colonne || li.y >= s.righe || muroTra(s, qui, li)) return;
      vai(li, "prendi");
    };
    window.addEventListener("keydown", tasto);
    return () => window.removeEventListener("keydown", tasto);
  }, [vai]);

  // La demo gioca da sola: una cosa giusta alla volta, poi la porta.
  useEffect(() => {
    if (!demo || finito || inPausa || g.cammino.length || g.meta) return;
    const t = window.setTimeout(() => vai(prossimo ?? sala.porta, "prendi"), 450);
    return () => window.clearTimeout(t);
  }, [demo, finito, inPausa, g.cammino.length, g.meta, prossimo, sala, vai]);

  const ricomincia = useCallback(() => {
    const nuove = sale.map((s) => costruisciSala(s));
    gestito.current = "";
    setCostruite(nuove);
    setNumeroPartita((n) => n + 1);
    partita.ricomincia();
  }, [sale, partita]);

  const daPrendere = sala.oggetti.filter((o) => o.giusto).length;
  const prese = quantePrese(sala, g.presi);
  const larga = sala.colonne * 100;
  const alta = sala.righe * 100;

  return (
    <GameShell titolo={titolo} istruzione={sala.spec.istruzione} round={indice} totaleRound={totale} finito={finito} stelle={partita.stelle} onAncora={ricomincia}>
      <div
        data-esplora
        {...partita.attributi}
        data-prese={prese}
        data-da-prendere={daPrendere}
        data-porta={compiuta ? "aperta" : "chiusa"}
        data-mizi={chiaveCella(g.pos)}
        data-in-cammino={g.cammino.length ? "si" : undefined}
        className="flex w-full max-w-md flex-col items-center gap-3"
      >
        <Cruscotto sala={sala} presi={g.presi} compiuta={compiuta} ultima={ultima} />

        <svg
          viewBox={`-8 -8 ${larga + 16} ${alta + 16}`}
          className="w-full touch-manipulation select-none"
          style={{ maxHeight: "62vh" }}
          role="group"
          aria-label="La mappa: tocca una casella e Mizi ci va"
          data-mappa
        >
          <Pavimento sala={sala} viste={viste} />
          <Porta sala={sala} aperta={compiuta} tesoro={ultima} />
          {sala.oggetti
            .filter((o) => !g.presi.includes(o.id) && (viste.has(chiaveCella(o)) || o.id === aiutoSu))
            .map((o) => (
              <g key={o.id} className={o.id === aiutoSu ? "esplora-aiuto" : undefined} data-aiuto-oggetto={o.id === aiutoSu ? o.id : undefined} pointerEvents="none">
                <Tessera oggetto={o} />
              </g>
            ))}
          <g key={`${numeroPartita}-${indice}`} style={{ transform: `translate(${g.pos.x * 100}px, ${g.pos.y * 100}px)`, transition: `transform ${PASSO_MS}ms linear` }} pointerEvents="none">
            <g transform="translate(10 8)">
              <Disegno id="pinguino" titolo="Mizi" lato={80} className="" />
            </g>
          </g>
          {Array.from({ length: sala.colonne * sala.righe }, (_, i) => {
            const cella = { x: i % sala.colonne, y: Math.floor(i / sala.colonne) };
            const k = chiaveCella(cella);
            const cosa = sala.oggetti.find((o) => stessaCella(o, cella) && !g.presi.includes(o.id));
            const visibile = cosa && (viste.has(k) || cosa.id === aiutoSu);
            const quiPorta = stessaCella(cella, sala.porta);
            return (
              <rect
                key={k}
                data-cella={k}
                data-oggetto={cosa?.id}
                data-giusto={cosa ? (cosa.giusto ? "si" : "no") : undefined}
                data-prossimo={cosa && prossimo?.id === cosa.id ? "si" : undefined}
                data-si-vede={visibile ? "si" : undefined}
                data-porta-qui={quiPorta ? "si" : undefined}
                data-nebbia={viste.has(k) ? undefined : "si"}
                role="button"
                aria-label={quiPorta ? (ultima ? "Il tesoro" : "La porta") : visibile ? nomeDi(cosa) : `Casella ${cella.x + 1}, ${cella.y + 1}`}
                x={cella.x * 100}
                y={cella.y * 100}
                width="100"
                height="100"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => vai(cella)}
              />
            );
          })}
        </svg>
      </div>
    </GameShell>
  );
}

const nomeDi = (o: Oggetto) => (o.testo ? o.testo : (o.figura ?? "oggetto")) + (o.prezzo ? `, ${o.prezzo} monete` : "");

// ───────────────────────── I disegni (lo stile sta tutto qui) ─────────────────────────

const STILE = {
  pavimentoA: "#FDF3E2",
  pavimentoB: "#FBEBD0",
  nebbia: "#DCE8F6",
  nuvola: "#FFFFFF",
  muro: "#7B4CC4",
  porta: "#B9773F",
  portaScura: "#7A5238",
  oro: "#F9C846",
  oroScuro: "#F59A23",
  tessera: "#FFFFFF",
  bordoTessera: "#3DB5E6",
  inchiostro: "#1F2430",
  verde: "#4CAF6D",
};

function Pavimento({ sala, viste }: { sala: Sala; viste: Set<string> }) {
  const celle: Cella[] = [];
  for (let y = 0; y < sala.righe; y++) for (let x = 0; x < sala.colonne; x++) celle.push({ x, y });
  const muri: { k: string; x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const c of celle) {
    const destra = { x: c.x + 1, y: c.y };
    const sotto = { x: c.x, y: c.y + 1 };
    const siVede = (a: Cella, b: Cella) => viste.has(chiaveCella(a)) || viste.has(chiaveCella(b));
    if (destra.x < sala.colonne && muroTra(sala, c, destra) && siVede(c, destra)) muri.push({ k: `d${c.x},${c.y}`, x1: destra.x * 100, y1: c.y * 100, x2: destra.x * 100, y2: c.y * 100 + 100 });
    if (sotto.y < sala.righe && muroTra(sala, c, sotto) && siVede(c, sotto)) muri.push({ k: `s${c.x},${c.y}`, x1: c.x * 100, y1: sotto.y * 100, x2: c.x * 100 + 100, y2: sotto.y * 100 });
  }
  return (
    <>
      <rect x="-4" y="-4" width={sala.colonne * 100 + 8} height={sala.righe * 100 + 8} rx="22" fill={STILE.pavimentoA} />
      {celle.map((c) => {
        const scoperta = viste.has(chiaveCella(c));
        return (
          <g key={chiaveCella(c)}>
            {scoperta ? (
              (c.x + c.y) % 2 === 1 && <rect x={c.x * 100 + 3} y={c.y * 100 + 3} width="94" height="94" rx="14" fill={STILE.pavimentoB} />
            ) : (
              <>
                <rect x={c.x * 100 + 2} y={c.y * 100 + 2} width="96" height="96" rx="14" fill={STILE.nebbia} />
                <ellipse cx={c.x * 100 + 42} cy={c.y * 100 + 56} rx="24" ry="13" fill={STILE.nuvola} />
                <ellipse cx={c.x * 100 + 60} cy={c.y * 100 + 46} rx="20" ry="14" fill={STILE.nuvola} />
              </>
            )}
          </g>
        );
      })}
      {muri.map((m) => (
        <line key={m.k} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke={STILE.muro} strokeWidth="9" strokeLinecap="round" />
      ))}
      <rect x="-4" y="-4" width={sala.colonne * 100 + 8} height={sala.righe * 100 + 8} rx="22" fill="none" stroke={STILE.muro} strokeWidth="8" />
    </>
  );
}

function Porta({ sala, aperta, tesoro }: { sala: Sala; aperta: boolean; tesoro: boolean }) {
  const x = sala.porta.x * 100;
  const y = sala.porta.y * 100;
  if (tesoro) {
    return (
      <g transform={`translate(${x} ${y})`} data-disegno-porta={aperta ? "aperta" : "chiusa"} pointerEvents="none">
        {aperta && <circle cx="50" cy="50" r="46" fill={STILE.oro} opacity="0.35" />}
        <rect x="16" y="44" width="68" height="40" rx="6" fill={STILE.porta} stroke={STILE.portaScura} strokeWidth="4" />
        {aperta ? (
          <>
            <path d="M16 44 L24 16 L76 16 L84 44 Z" fill={STILE.portaScura} />
            <circle cx="36" cy="40" r="9" fill={STILE.oro} stroke={STILE.oroScuro} strokeWidth="3" />
            <circle cx="52" cy="34" r="9" fill={STILE.oro} stroke={STILE.oroScuro} strokeWidth="3" />
            <circle cx="66" cy="41" r="9" fill={STILE.oro} stroke={STILE.oroScuro} strokeWidth="3" />
          </>
        ) : (
          <>
            <path d="M16 46 Q16 18 50 18 Q84 18 84 46 Z" fill={STILE.porta} stroke={STILE.portaScura} strokeWidth="4" />
            <rect x="42" y="38" width="16" height="20" rx="4" fill={STILE.oro} stroke={STILE.oroScuro} strokeWidth="3" />
          </>
        )}
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`} data-disegno-porta={aperta ? "aperta" : "chiusa"} pointerEvents="none">
      {aperta && <circle cx="50" cy="50" r="46" fill={STILE.oro} opacity="0.35" />}
      <path d="M22 90 L22 40 Q22 12 50 12 Q78 12 78 40 L78 90 Z" fill={aperta ? STILE.oro : STILE.porta} stroke={aperta ? STILE.oroScuro : STILE.portaScura} strokeWidth="5" />
      {aperta ? (
        <path d="M38 58 L50 44 L62 58 M50 44 L50 76" stroke={STILE.portaScura} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ) : (
        <>
          <circle cx="50" cy="52" r="9" fill={STILE.oro} stroke={STILE.oroScuro} strokeWidth="3" />
          <rect x="46" y="56" width="8" height="14" rx="2" fill={STILE.oroScuro} />
        </>
      )}
    </g>
  );
}

/** Una moneta con il prezzo dentro. */
function Moneta({ x, y, r, valore }: { x: number; y: number; r: number; valore?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={STILE.oro} stroke={STILE.oroScuro} strokeWidth={r / 5} />
      {valore !== undefined && (
        <text x={x} y={y + r * 0.38} textAnchor="middle" fontSize={r * 1.15} fontWeight="800" fill={STILE.inchiostro}>
          {valore}
        </text>
      )}
    </>
  );
}

/** Una cosa sulla mappa, disegnata in una casella da 100. */
function Tessera({ oggetto }: { oggetto: Oggetto }) {
  const x = oggetto.x * 100;
  const y = oggetto.y * 100;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Figura oggetto={oggetto} lato={100} />
    </g>
  );
}

/** La stessa cosa, sulla mappa o nel cruscotto: disegno o tessera con numero o lettera, col prezzo se c'è. */
function Figura({ oggetto, lato }: { oggetto: Pick<Oggetto, "figura" | "testo" | "prezzo">; lato: number }) {
  const u = lato / 100;
  return (
    <g transform={`scale(${u})`}>
      {oggetto.testo ? (
        <>
          <rect x="16" y="16" width="68" height="68" rx="16" fill={STILE.tessera} stroke={STILE.bordoTessera} strokeWidth="5" />
          <text x="50" y={oggetto.testo.length > 1 ? 64 : 66} textAnchor="middle" fontSize={oggetto.testo.length > 1 ? 38 : 46} fontWeight="800" fill={STILE.inchiostro}>
            {oggetto.testo}
          </text>
        </>
      ) : (
        <g transform="translate(16 14)">
          <Disegno id={oggetto.figura as NomeFigura} lato={68} className="" />
        </g>
      )}
      {oggetto.prezzo !== undefined && <Moneta x={78} y={76} r={18} valore={oggetto.prezzo} />}
    </g>
  );
}

/** Sopra la mappa: a che punto è la missione, senza svelare cosa prendere. */
function Cruscotto({ sala, presi, compiuta, ultima }: { sala: Sala; presi: string[]; compiuta: boolean; ultima: boolean }) {
  const giusti = sala.oggetti.filter((o) => o.giusto);
  const prese = presi.map((id) => giusti.find((o) => o.id === id)).filter((o): o is Oggetto => Boolean(o));
  const tipo = sala.spec.cruscotto;
  const caselle =
    tipo === "parola"
      ? sala.spec.giusti.map((s, i) => ({ cosa: s, piena: i < prese.length }))
      : tipo === "lista"
        ? sala.spec.giusti.map((s) => ({ cosa: s, piena: prese.some((o) => o.figura === s.figura && o.testo === s.testo) }))
        : giusti.map((_, i) => ({ cosa: prese[i], piena: i < prese.length }));

  return (
    <div
      className="flex min-h-14 w-full items-center gap-2 rounded-2xl border-2 border-crema-scuro bg-white px-3 py-1.5"
      role="status"
      aria-label={`Prese ${prese.length} di ${giusti.length}. ${compiuta ? (ultima ? "Il tesoro è aperto." : "La porta è aperta.") : ""}`}
      data-cruscotto={tipo}
    >
      {tipo === "lista" && (
        <span className="flex shrink-0 items-center gap-1 text-lg font-extrabold text-notte" data-borsa={monete(sala, presi)}>
          <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
            <Moneta x={20} y={20} r={16} />
          </svg>
          {monete(sala, presi)}
        </span>
      )}
      <span className="flex flex-1 flex-wrap items-center justify-center gap-1.5">
        {caselle.map((c, i) => (
          <svg key={i} viewBox="0 0 100 100" className={caselle.length > 4 ? "h-10 w-10" : "h-12 w-12"} aria-hidden data-casella={c.piena ? "piena" : "vuota"}>
            {c.cosa ? (
              // La lista della spesa si deve leggere bene anche prima di comprare.
              <g opacity={c.piena || tipo === "lista" ? 1 : 0.45}>
                <Figura oggetto={c.cosa} lato={100} />
              </g>
            ) : (
              <circle cx="50" cy="50" r="26" fill="none" stroke="#E4CBA8" strokeWidth="6" strokeDasharray="10 8" />
            )}
            {c.piena && tipo === "lista" && <path d="M18 30 L34 46 L60 14" stroke={STILE.verde} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          </svg>
        ))}
      </span>
      <svg viewBox="0 0 100 100" className="h-10 w-10 shrink-0" aria-hidden>
        <path d="M22 90 L22 40 Q22 12 50 12 Q78 12 78 40 L78 90 Z" fill={compiuta ? STILE.oro : "#F1E3CC"} stroke={compiuta ? STILE.oroScuro : "#D9C3A0"} strokeWidth="6" />
        {!compiuta && <circle cx="50" cy="54" r="8" fill="#D9C3A0" />}
      </svg>
    </div>
  );
}
