"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { Disegno, FacciaMizi, type NomeFigura } from "./arte";
import { mescola } from "./casuale";
import { parla, preparaVoci } from "@/lib/audio";
import { suona } from "@/lib/suoni";
import type { GameProps } from "./tipi";

/**
 * Memory a coppie, in tre livelli che crescono (15/11/2026).
 *
 * La difficoltà sale col numero di carte, mai con un timer (checklist: niente
 * fretta). Ogni carta girata dice il suo nome: si allena la memoria e intanto
 * il vocabolario. Dopo tre tentativi a vuoto di fila Mizi fa ballare una
 * coppia: l'aiuto arriva prima della frustrazione.
 *
 * Lo stato «vero» sta nei ref: due tocchi nello stesso istante, o un tocco che
 * arriva da un timer (la demo), leggono sempre il mazzo aggiornato. Prima la
 * demo si bloccava alla seconda carta proprio per una chiusura vecchia.
 */

interface Carta {
  chiave: string;
  figura: NomeFigura;
  nome: string;
  trovata: boolean;
}

type Fase = "guarda" | "gioca" | "passaggio" | "finito";

export interface MemoryProps extends GameProps {
  titolo: string;
  figure: { id: NomeFigura; nome: string }[];
}

/** Le coppie dei tre livelli: 4-6-8 carte a 3 anni, fino a 8-12-16 dai 5. */
export function livelliMemory(age: number): number[] {
  if (age <= 3) return [2, 3, 4];
  if (age === 4) return [3, 4, 6];
  return [4, 6, 8];
}

const COLONNE: Record<number, { colonne: number; larghezza: string }> = {
  4: { colonne: 2, larghezza: "max-w-[17rem]" },
  6: { colonne: 3, larghezza: "max-w-sm" },
  8: { colonne: 4, larghezza: "max-w-lg" },
  12: { colonne: 4, larghezza: "max-w-lg" },
  16: { colonne: 4, larghezza: "max-w-lg" },
};

/** Le frasi fisse del gioco: stanno anche in content/voce-mizi.json, per la voce registrata. */
export const FRASI_MEMORY = {
  guarda: "Guarda bene dove sono gli animali!",
  gioca: "Tocca due carte uguali: trova le coppie!",
  ancora: "Più carte, più memoria: trova tutte le coppie!",
  livello: "Livello superato! Adesso ci sono più carte.",
  aiuto: "Ti aiuto io: guarda le due carte che ballano!",
  coppia: (nome: string) => `${nome}! Coppia trovata.`,
};

export function Memory({ titolo, figure, age, onProgress, onComplete, demo = false }: MemoryProps) {
  const livelli = livelliMemory(age);
  const coppieTotali = livelli.reduce((a, b) => a + b, 0);
  // Ai più piccoli, al primo livello, le carte si mostrano un momento scoperte.
  const conSbirciata = age <= 4;

  const [livello, setLivello] = useState(0);
  const [carte, setCarte] = useState<Carta[]>([]);
  const [aperte, setAperte] = useState<number[]>([]);
  const [trovate, setTrovate] = useState(0);
  const [fase, setFase] = useState<Fase>("gioca");
  const [aiuto, setAiuto] = useState<number[]>([]);
  const [stelle, setStelle] = useState(3);

  const carteVive = useRef<Carta[]>([]);
  const aperteVive = useRef<number[]>([]);
  const faseViva = useRef<Fase>("gioca");
  const livelloVivo = useRef(0);
  const trovateLivello = useRef(0);
  const trovateInTutto = useRef(0);
  /** Confronto in corso: nessun altro tocco finché le carte non si richiudono. */
  const occupato = useRef(false);
  /** Le carte già viste in questo livello: servono a distinguere l'errore dalla prima esplorazione. */
  const viste = useRef(new Set<number>());
  const errori = useRef(0);
  const vuotiDiFila = useRef(0);
  const sveglie = useRef<number[]>([]);
  const avvisa = useRef({ onProgress, onComplete });
  useEffect(() => {
    avvisa.current = { onProgress, onComplete };
  }, [onProgress, onComplete]);

  const dopo = useCallback((ms: number, fai: () => void) => {
    sveglie.current.push(window.setTimeout(fai, ms));
  }, []);
  const fermaSveglie = useCallback(() => {
    sveglie.current.forEach((t) => window.clearTimeout(t));
    sveglie.current = [];
  }, []);

  const cambiaFase = useCallback((f: Fase) => {
    faseViva.current = f;
    setFase(f);
  }, []);

  const distribuisci = useCallback(
    (quale: number) => {
      fermaSveglie();
      const coppie = livelliMemory(age)[quale];
      const mazzo = mescola(
        mescola(figure)
          .slice(0, coppie)
          .flatMap((f) => ["a", "b"].map((lato) => ({ chiave: `${quale}-${f.id}-${lato}`, figura: f.id, nome: f.nome, trovata: false }))),
      );
      carteVive.current = mazzo;
      aperteVive.current = [];
      livelloVivo.current = quale;
      trovateLivello.current = 0;
      occupato.current = false;
      viste.current = new Set();
      vuotiDiFila.current = 0;
      setCarte(mazzo);
      setAperte([]);
      setTrovate(0);
      setAiuto([]);
      setLivello(quale);
      if (quale === 0 && conSbirciata) {
        cambiaFase("guarda");
        dopo(2800, () => cambiaFase("gioca"));
      } else {
        cambiaFase("gioca");
      }
    },
    [figure, age, conSbirciata, cambiaFase, dopo, fermaSveglie],
  );

  const daCapo = useCallback(() => {
    errori.current = 0;
    trovateInTutto.current = 0;
    distribuisci(0);
  }, [distribuisci]);

  useEffect(() => {
    daCapo();
    return fermaSveglie;
  }, [daCapo, fermaSveglie]);

  // Le voci registrate del gioco si scaricano subito: al tocco partono senza attesa.
  useEffect(() => {
    preparaVoci([...figure.flatMap((f) => [f.nome, FRASI_MEMORY.coppia(f.nome)]), FRASI_MEMORY.gioca, FRASI_MEMORY.ancora, FRASI_MEMORY.livello]);
  }, [figure]);

  const tocca = useCallback(
    (i: number) => {
      if (faseViva.current !== "gioca" || occupato.current) return;
      const mazzo = carteVive.current;
      const carta = mazzo[i];
      if (!carta || carta.trovata || aperteVive.current.includes(i)) return;
      const tappe = livelliMemory(age);
      const inTutto = tappe.reduce((x, y) => x + y, 0);

      suona("gira");
      const scoperte = [...aperteVive.current, i];
      aperteVive.current = scoperte;
      setAperte(scoperte);
      setAiuto([]);

      if (scoperte.length < 2) {
        parla(carta.nome);
        return;
      }

      occupato.current = true;
      const [a, b] = scoperte;
      const gemellaDiA = mazzo.findIndex((c, k) => k !== a && c.figura === mazzo[a].figura);

      if (mazzo[a].figura === mazzo[b].figura) {
        vuotiDiFila.current = 0;
        parla(FRASI_MEMORY.coppia(carta.nome));
        dopo(180, () => suona("coppia"));
        dopo(750, () => {
          const aggiornato = carteVive.current.map((c, k) => (k === a || k === b ? { ...c, trovata: true } : c));
          carteVive.current = aggiornato;
          aperteVive.current = [];
          occupato.current = false;
          trovateLivello.current += 1;
          trovateInTutto.current += 1;
          setCarte(aggiornato);
          setAperte([]);
          setTrovate(trovateLivello.current);
          avvisa.current.onProgress?.(trovateInTutto.current, inTutto);

          if (trovateLivello.current < tappe[livelloVivo.current]) return;

          if (livelloVivo.current >= tappe.length - 1) {
            // Le stelle guardano gli errori evitabili, non il tempo: nessuno corre.
            const voto = errori.current <= Math.ceil(inTutto / 3) ? 3 : errori.current <= inTutto ? 2 : 1;
            setStelle(voto);
            cambiaFase("finito");
            avvisa.current.onComplete?.({ score: trovateInTutto.current, stars: voto });
            return;
          }
          cambiaFase("passaggio");
          suona("livello");
          parla(FRASI_MEMORY.livello, "it-IT", { accoda: true });
          dopo(1900, () => distribuisci(livelloVivo.current + 1));
        });
        return;
      }

      // Non è un errore girare due carte mai viste: lo è sbagliare quando la
      // gemella della prima era già passata, o rigirare una carta già vista.
      if (viste.current.has(gemellaDiA) || viste.current.has(b)) errori.current += 1;
      viste.current.add(a);
      viste.current.add(b);
      vuotiDiFila.current += 1;
      parla(carta.nome);
      dopo(320, () => suona("riprova"));
      dopo(1250, () => {
        aperteVive.current = [];
        occupato.current = false;
        setAperte([]);
        if (vuotiDiFila.current < 3) return;
        // Tre tentativi a vuoto: Mizi fa ballare una coppia (meglio una di cui si è già vista una carta).
        vuotiDiFila.current = 0;
        const ancoraCoperte = carteVive.current.map((c, k) => ({ c, k })).filter((x) => !x.c.trovata);
        const prima = ancoraCoperte.find((x) => viste.current.has(x.k)) ?? ancoraCoperte[0];
        const seconda = ancoraCoperte.find((x) => x.k !== prima?.k && x.c.figura === prima?.c.figura);
        if (!prima || !seconda) return;
        setAiuto([prima.k, seconda.k]);
        suona("aiuto");
        parla(FRASI_MEMORY.aiuto);
        dopo(2600, () => setAiuto([]));
      });
    },
    [age, cambiaFase, distribuisci, dopo],
  );

  // Demo (?demo=1, per i reel): trova le coppie da sola, guardando il mazzo.
  useEffect(() => {
    if (!demo || fase !== "gioca" || aperte.length > 0) return;
    let secondoTocco = 0;
    const primoTocco = window.setTimeout(() => {
      const primo = carteVive.current.findIndex((c) => !c.trovata);
      if (primo < 0) return;
      const secondo = carteVive.current.findIndex((c, k) => k !== primo && !c.trovata && c.figura === carteVive.current[primo].figura);
      tocca(primo);
      secondoTocco = window.setTimeout(() => tocca(secondo), 600);
    }, 900);
    return () => {
      window.clearTimeout(primoTocco);
      // Il secondo tocco NON si annulla quando si apre la prima carta: è lui a chiudere la coppia.
      if (aperteVive.current.length === 0) window.clearTimeout(secondoTocco);
    };
  }, [demo, fase, aperte.length, trovate, livello, tocca]);

  const coppie = livelli[livello];
  const griglia = COLONNE[carte.length] ?? COLONNE[8];
  const istruzione = fase === "guarda" ? FRASI_MEMORY.guarda : livello === 0 ? FRASI_MEMORY.gioca : FRASI_MEMORY.ancora;

  return (
    <GameShell
      titolo={titolo}
      istruzione={istruzione}
      round={livello}
      totaleRound={livelli.length}
      finito={fase === "finito"}
      stelle={stelle}
      onAncora={daCapo}
    >
      <div className="flex w-full flex-col items-center gap-4" data-memory data-fase={fase} data-livello={livello + 1} data-coppie={coppie} data-coppie-totali={coppieTotali}>
        <div className={`grid w-full gap-2.5 sm:gap-3 ${griglia.larghezza}`} style={{ gridTemplateColumns: `repeat(${griglia.colonne}, minmax(0, 1fr))` }}>
          {carte.map((carta, i) => {
            const scoperta = fase === "guarda" || carta.trovata || aperte.includes(i);
            return (
              <button
                key={carta.chiave}
                type="button"
                onClick={() => tocca(i)}
                aria-label={scoperta ? carta.nome : `Carta coperta ${i + 1}`}
                data-carta={i}
                data-girata={scoperta ? "si" : "no"}
                data-stato={carta.trovata ? "trovata" : scoperta ? "aperta" : "coperta"}
                data-aiuto={aiuto.includes(i) ? "si" : undefined}
                className="carta-memory block aspect-square w-full transition-transform active:scale-95"
                style={{ minHeight: 0, minWidth: 0 }}
              >
                <span className="facce">
                  <span className="faccia rounded-morbido border-4 border-white bg-viola shadow-sm">
                    <FacciaMizi emozione="felice" className="h-1/2 w-1/2 opacity-90" />
                  </span>
                  <span className={`faccia faccia-davanti rounded-morbido border-4 bg-white p-2 shadow-sm ${carta.trovata ? "border-verde" : "border-viola"}`}>
                    <Disegno id={carta.figura} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Le coppie trovate in questo livello: pallini per i bambini, numeri per i grandi. */}
        <p className="flex items-center gap-2 text-sm font-bold text-notte-tenue" data-coppie-trovate={trovate}>
          <span className="flex gap-1.5" aria-hidden>
            {Array.from({ length: coppie }, (_, k) => (
              <span key={k} className={`h-3 w-3 rounded-full ${k < trovate ? "bg-verde" : "bg-crema-scuro"}`} />
            ))}
          </span>
          {trovate} di {coppie} coppie
        </p>
      </div>
    </GameShell>
  );
}
