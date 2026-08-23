"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno } from "./arte";
import type { GameProps } from "./tipi";

/**
 * Crea il tuo gioco (10–12 anni).
 *
 * Non è un quiz: è un piccolo editor a eventi. Il ragazzo sceglie coppie
 * "quando succede X → fai Y", preme Prova e il suo gioco gira davvero.
 * Il codice JavaScript equivalente è sempre visibile: il passaggio dai blocchi
 * al testo è il punto di tutta la sezione coding (piano §13).
 *
 * Il progetto si salva nell'URL, così si condivide senza account.
 */

type Evento = "tocchiMizi" | "ogniSecondo" | "tocchiSfondo";
type Azione = "puntoPiu" | "muoviACaso" | "ingrandisci" | "cambiaColore" | "puntoMeno";

interface Regola {
  evento: Evento;
  azione: Azione;
}

const EVENTI: Record<Evento, string> = {
  tocchiMizi: "quando tocchi Mizi",
  ogniSecondo: "ogni secondo",
  tocchiSfondo: "quando tocchi lo sfondo",
};

const AZIONI: Record<Azione, string> = {
  puntoPiu: "aggiungi 1 punto",
  puntoMeno: "togli 1 punto",
  muoviACaso: "sposta Mizi a caso",
  ingrandisci: "cambia la taglia di Mizi",
  cambiaColore: "cambia il colore dello sfondo",
};

const CODICE: Record<Azione, string> = {
  puntoPiu: "punti = punti + 1",
  puntoMeno: "punti = punti - 1",
  muoviACaso: "mizi.x = a caso(0, 100); mizi.y = a caso(0, 100)",
  ingrandisci: "mizi.taglia = a caso(40, 110)",
  cambiaColore: "sfondo = colore a caso()",
};

const SFONDI = ["#FFF3E6", "#DFF1FB", "#FDE7F0", "#EFE6FB", "#FDF3D6"];

export interface CreaGiocoProps extends GameProps {
  titolo: string;
}

export function CreaGioco({ titolo, onComplete }: CreaGiocoProps) {
  const [regole, setRegole] = useState<Regola[]>([{ evento: "tocchiMizi", azione: "puntoPiu" }]);
  const [inProva, setInProva] = useState(false);
  const [punti, setPunti] = useState(0);
  const [mizi, setMizi] = useState({ x: 50, y: 50, taglia: 70 });
  const [sfondo, setSfondo] = useState(SFONDI[0]);
  const [salvato, setSalvato] = useState(false);
  const battito = useRef<number | null>(null);

  // Ricarica un progetto condiviso via link.
  useEffect(() => {
    const hash = window.location.hash.replace("#progetto=", "");
    if (!hash) return;
    try {
      const decodificato = JSON.parse(atob(decodeURIComponent(hash))) as Regola[];
      if (Array.isArray(decodificato) && decodificato.length) setRegole(decodificato);
    } catch {
      // Link rovinato: si riparte dal progetto di default, senza messaggi d'errore.
    }
  }, []);

  const applica = useCallback((azione: Azione) => {
    if (azione === "puntoPiu") setPunti((p) => p + 1);
    if (azione === "puntoMeno") setPunti((p) => p - 1);
    if (azione === "muoviACaso")
      setMizi((m) => ({ ...m, x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 }));
    if (azione === "ingrandisci") setMizi((m) => ({ ...m, taglia: 40 + Math.random() * 70 }));
    if (azione === "cambiaColore") setSfondo(SFONDI[Math.floor(Math.random() * SFONDI.length)]);
  }, []);

  const scatta = useCallback(
    (evento: Evento) => {
      if (!inProva) return;
      regole.filter((r) => r.evento === evento).forEach((r) => applica(r.azione));
    },
    [applica, inProva, regole],
  );

  useEffect(() => {
    if (!inProva) {
      if (battito.current) window.clearInterval(battito.current);
      battito.current = null;
      return;
    }
    battito.current = window.setInterval(() => scatta("ogniSecondo"), 1000);
    return () => {
      if (battito.current) window.clearInterval(battito.current);
    };
  }, [inProva, scatta]);

  const avviaProva = useCallback(() => {
    setPunti(0);
    setMizi({ x: 50, y: 50, taglia: 70 });
    setInProva(true);
  }, []);

  const salva = useCallback(() => {
    const codificato = encodeURIComponent(btoa(JSON.stringify(regole)));
    window.location.hash = `progetto=${codificato}`;
    setSalvato(true);
    window.setTimeout(() => setSalvato(false), 2500);
  }, [regole]);

  const codice = [
    "let punti = 0",
    "",
    ...regole.map(
      (r) =>
        `quando (${r.evento === "ogniSecondo" ? "ogni secondo" : r.evento === "tocchiMizi" ? "tocchi Mizi" : "tocchi lo sfondo"}) {\n  ${CODICE[r.azione]}\n}`,
    ),
  ].join("\n");

  return (
    <GameShell
      titolo={titolo}
      istruzione="Costruisci il tuo gioco: scegli quando succede una cosa e cosa deve fare."
      round={inProva ? 1 : 0}
      totaleRound={1}
      finito={false}
      onAncora={() => undefined}
    >
      <div className="flex h-full w-full max-w-2xl flex-col gap-3 overflow-y-auto pb-4">
        {/* Il palcoscenico */}
        <div
          className="relative h-56 w-full shrink-0 overflow-hidden rounded-morbido transition-colors"
          style={{ backgroundColor: sfondo }}
          onClick={() => scatta("tocchiSfondo")}
        >
          <span className="absolute left-3 top-2 text-xl font-extrabold text-notte">Punti: {punti}</span>
          {!inProva && (
            <span className="absolute right-3 top-2 rounded-bolla bg-white/80 px-3 py-1 text-sm font-bold text-notte-tenue">
              premi Prova
            </span>
          )}
          <button
            type="button"
            aria-label="Mizi"
            onClick={(e) => {
              e.stopPropagation();
              scatta("tocchiMizi");
            }}
            className="absolute transition-all duration-300"
            style={{
              left: `${mizi.x}%`,
              top: `${mizi.y}%`,
              width: mizi.taglia,
              height: mizi.taglia,
              minHeight: 0,
              minWidth: 0,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Disegno id="pinguino" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={inProva ? () => setInProva(false) : avviaProva}
            className="rounded-bolla bg-rosa px-8 py-3 text-lg font-extrabold text-white"
          >
            {inProva ? "⏸ Ferma" : "▶ Prova"}
          </button>
          <button
            type="button"
            onClick={salva}
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-3 font-bold text-notte"
          >
            {salvato ? "Salvato nel link ✓" : "Salva nel link"}
          </button>
          <button
            type="button"
            onClick={() => onComplete?.({ score: Math.max(punti, 1), stars: 3 })}
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-3 font-bold text-notte"
          >
            Ho finito
          </button>
        </div>

        {/* Le regole */}
        <div className="flex flex-col gap-2">
          {regole.map((regola, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-morbido bg-white p-3">
              <select
                value={regola.evento}
                onChange={(e) =>
                  setRegole((r) =>
                    r.map((x, j) => (j === i ? { ...x, evento: e.target.value as Evento } : x)),
                  )
                }
                aria-label="Quando"
                className="rounded-bolla border-2 border-crema-scuro px-3 py-2 font-bold text-notte"
              >
                {Object.entries(EVENTI).map(([id, nome]) => (
                  <option key={id} value={id}>
                    {nome}
                  </option>
                ))}
              </select>
              <span className="font-extrabold text-viola">→</span>
              <select
                value={regola.azione}
                onChange={(e) =>
                  setRegole((r) =>
                    r.map((x, j) => (j === i ? { ...x, azione: e.target.value as Azione } : x)),
                  )
                }
                aria-label="Fai"
                className="rounded-bolla border-2 border-crema-scuro px-3 py-2 font-bold text-notte"
              >
                {Object.entries(AZIONI).map(([id, nome]) => (
                  <option key={id} value={id}>
                    {nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setRegole((r) => r.filter((_, j) => j !== i))}
                aria-label="Togli questa regola"
                className="ml-auto h-10 w-10 rounded-full bg-crema text-xl font-extrabold text-notte-tenue"
                style={{ minHeight: "2.5rem", minWidth: "2.5rem" }}
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setRegole((r) => [...r, { evento: "ogniSecondo", azione: "muoviACaso" }])}
            className="rounded-morbido border-4 border-dashed border-crema-scuro bg-white/60 px-4 py-3 font-bold text-notte-tenue"
          >
            + Aggiungi una regola
          </button>
        </div>

        {/* Il codice equivalente */}
        <details className="rounded-morbido bg-notte p-3 text-white" open>
          <summary className="cursor-pointer font-bold">Vedi il codice</summary>
          <pre className="mt-2 overflow-x-auto text-sm">{codice}</pre>
        </details>
      </div>
    </GameShell>
  );
}
