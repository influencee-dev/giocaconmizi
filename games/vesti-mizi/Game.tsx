"use client";

import { Camera, Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "@/games/_engine/tipi";
import { CAPI, ORDINE, ZONE, capo, type Zona } from "./capi";

/**
 * Vesti Mizi (3–7 anni): scegliere le cose giuste per ogni situazione.
 *
 * Sei uscite di Mizi, poi il gioco libero:
 * 1–3. Mizi dice cosa mettere («il cappello di paglia e gli occhiali da sole»):
 *      ascoltare, riconoscere gli oggetti per nome.
 * 4–6. Mizi dice solo dove va («sulla neve, ha freddo alla testa»): il bambino
 *      ragiona su cosa serve.
 * 7.   Libero: vestiti e trucchi come vuole, e la foto da salvare.
 * Ogni zona porta un capo alla volta (un tocco mette, un altro toglie); i
 * trucchi si sommano. Con «Fatto» Mizi controlla: se manca qualcosa dà un
 * aiuto e si riprova. Il punto vale al primo tentativo; niente «hai perso».
 */

type Scena = "mare" | "festa" | "pioggia" | "neve" | "sub" | "ballo" | "libero";
interface Uscita {
  scena: Scena;
  istruzione: string;
  servono: string[];
  fatto: string;
}

const USCITE: Uscita[] = [
  { scena: "mare", istruzione: "Mizi va al mare! Mettile il cappello di paglia e gli occhiali da sole, poi tocca Fatto.", servono: ["paglia", "sole"], fatto: "Perfetta per il mare!" },
  { scena: "festa", istruzione: "È la festa di compleanno di Mizi! Mettile il cappello da festa e dalle il palloncino.", servono: ["festa", "palloncino"], fatto: "Che bella festa!" },
  { scena: "pioggia", istruzione: "Piove! Dai a Mizi l'ombrello e mettile gli stivali di gomma.", servono: ["ombrello", "stivali"], fatto: "Ora può saltare nelle pozzanghere!" },
  { scena: "neve", istruzione: "Mizi gioca sulla neve e ha freddo alla testa. Cosa le metti?", servono: ["lana"], fatto: "Calda calda!" },
  { scena: "sub", istruzione: "Mizi nuota sott'acqua per vedere i pesci. Cosa le serve per gli occhi e per i piedi?", servono: ["sub", "pinne"], fatto: "Pronta per i pesci!" },
  { scena: "ballo", istruzione: "Mizi va al ballo delle fate. Mettile qualcosa da regina in testa e qualcosa di magico nell'ala.", servono: ["corona", "bacchetta"], fatto: "Una vera regina delle fate!" },
  { scena: "libero", istruzione: "Ora decidi tu: vestila e truccala come vuoi! Poi salva la foto o tocca Fatto.", servono: [], fatto: "Bellissima!" },
];

const AIUTI: Record<string, string> = {
  paglia: "Manca il cappello di paglia: lo trovi in Testa.",
  sole: "Mancano gli occhiali da sole: guarda in Occhi.",
  festa: "Manca il cappello da festa, quello a punta: è in Testa.",
  palloncino: "Manca il palloncino: Mizi lo tiene con l'ala.",
  ombrello: "Senza ombrello si bagna! Cercalo in Ali.",
  stivali: "Per le pozzanghere servono gli stivali: guarda in Piedi.",
  lana: "Fa freddo: cerca in Testa qualcosa di caldo, di lana.",
  sub: "Sott'acqua gli occhi devono restare all'asciutto: guarda in Occhi.",
  pinne: "Per nuotare veloce servono i piedi giusti: guarda in Piedi.",
  corona: "Una regina porta in testa qualcosa d'oro.",
  bacchetta: "Nell'ala serve qualcosa di magico, con una stella.",
};

type Vestiti = Partial<Record<Exclude<Zona, "trucchi">, string>>;

function SfondoScena({ scena }: { scena: Scena }) {
  const tutto = { x: -80, y: -80, width: 602, height: 720 };
  switch (scena) {
    case "mare":
      return (
        <g>
          <rect {...tutto} fill="#CDEFFB" />
          <circle cx={440} cy={-10} r={70} fill="#FFE27A" />
          <path d="M-80 470 Q-20 450 40 470 T160 470 T280 470 T400 470 T522 470 L522 560 L-80 560 Z" fill="#7FD3F0" />
          <rect x={-80} y={560} width={602} height={80} fill="#F5DFA8" />
        </g>
      );
    case "festa":
      return (
        <g>
          <rect {...tutto} fill="#F3E9FC" />
          {[[-40, -20, "#F28AB2"], [60, 60, "#F9C846"], [380, 0, "#3DB5E6"], [470, 120, "#4CAF6D"], [-50, 420, "#F59A23"], [480, 420, "#F28AB2"], [20, 560, "#9B6DD6"], [430, 590, "#F9C846"]].map(([x, y, c], i) => (
            <rect key={i} x={x as number} y={y as number} width={18} height={10} rx={3} fill={c as string} transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
        </g>
      );
    case "pioggia":
      return (
        <g>
          <rect {...tutto} fill="#DCE6EE" />
          <path d="M300 -10 Q300 -60 360 -60 Q380 -100 430 -80 Q500 -80 490 -20 Q520 0 490 20 L310 20 Q280 10 300 -10 Z" fill="#B6C4D0" />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={-60 + i * 42} y1={(i * 97) % 600} x2={-66 + i * 42} y2={((i * 97) % 600) + 26} stroke="#7FA6C4" strokeWidth={5} strokeLinecap="round" />
          ))}
          <ellipse cx={222} cy={610} rx={220} ry={26} fill="#A9C6DA" />
        </g>
      );
    case "neve":
      return (
        <g>
          <rect {...tutto} fill="#E6F4FB" />
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={-60 + ((i * 71) % 580)} cy={-60 + ((i * 113) % 560)} r={6 + (i % 3) * 2} fill="#FFFFFF" />
          ))}
          <rect x={-80} y={540} width={602} height={100} fill="#FFFFFF" />
        </g>
      );
    case "sub":
      return (
        <g>
          <rect {...tutto} fill="#5FB6DF" />
          {[[-30, 120, 14], [470, 60, 10], [480, 300, 16], [-40, 400, 12], [20, 30, 8]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
          ))}
          <path d="M440 470 q30 -22 60 0 q-30 22 -60 0 z M500 470 l14 -12 v24 z" fill="#F59A23" />
          <path d="M-60 210 q26 -18 52 0 q-26 18 -52 0 z M-8 210 l12 -10 v20 z" fill="#F9C846" />
          <path d="M-80 600 Q40 570 160 600 T400 600 T522 600 L522 640 L-80 640 Z" fill="#F5DFA8" />
        </g>
      );
    case "ballo":
      return (
        <g>
          <rect {...tutto} fill="#4B3A7A" />
          {[[-40, -30], [60, 80], [420, -40], [490, 160], [-50, 300], [480, 380], [10, 520], [440, 560]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 4 : 6} fill="#FFE27A" />
          ))}
        </g>
      );
    default:
      return (
        <g>
          <rect {...tutto} fill="#FFF3E6" />
          <circle cx={-40} cy={40} r={110} fill="#FDE8F0" />
          <circle cx={490} cy={520} r={120} fill="#EFE6FA" />
        </g>
      );
  }
}

/** Mizi con i capi addosso. */
function Palco({ scena, vestiti, trucchi, svgRef }: { scena: Scena; vestiti: Vestiti; trucchi: string[]; svgRef?: React.Ref<SVGSVGElement> }) {
  const addosso = ORDINE.flatMap((z) => (z === "trucchi" ? trucchi : vestiti[z] ? [vestiti[z]!] : []));
  return (
    <svg ref={svgRef} viewBox="-80 -80 602 720" className="h-full w-auto max-w-full" role="img" aria-label={`Mizi${addosso.length ? " con " + addosso.map((id) => capo(id).nome.toLowerCase()).join(", ") : ""}`} data-palco>
      <SfondoScena scena={scena} />
      <image href="/mizi/mizi-intera.webp" x={0} y={0} width={442} height={560} />
      {addosso.map((id) => (
        <g key={id} className="animate-[comparsa_0.25s_ease-out]" data-addosso={id}>
          {capo(id).disegno}
        </g>
      ))}
    </svg>
  );
}

export default function Game({ onComplete, onProgress, demo }: GameProps) {
  const [round, setRound] = useState(0);
  const [vestiti, setVestiti] = useState<Vestiti>({});
  const [trucchi, setTrucchi] = useState<string[]>([]);
  const [zona, setZona] = useState<Zona>("testa");
  const [messaggio, setMessaggio] = useState<{ testo: string; tipo: "aiuto" | "brava" } | null>(null);
  const [primoTentativo, setPrimoTentativo] = useState(true);
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);
  const palco = useRef<SVGSVGElement>(null);
  const uscita = USCITE[Math.min(round, USCITE.length - 1)];
  const totale = USCITE.length;

  useEffect(() => onProgress?.(round, totale), [round, totale, onProgress]);

  const indossa = useCallback((id: string) => {
    const c = capo(id);
    setMessaggio(null);
    if (c.zona === "trucchi") {
      setTrucchi((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
    } else {
      const z = c.zona as Exclude<Zona, "trucchi">;
      setVestiti((v) => ({ ...v, [z]: v[z] === id ? undefined : id }));
    }
  }, []);

  const addosso = (id: string) => trucchi.includes(id) || Object.values(vestiti).includes(id);

  const fatto = useCallback(() => {
    const mancano = uscita.servono.filter((id) => !(Object.values(vestiti).includes(id) || trucchi.includes(id)));
    if (mancano.length) {
      const testo = AIUTI[mancano[0]];
      setMessaggio({ testo, tipo: "aiuto" });
      setPrimoTentativo(false);
      parla(testo);
      return;
    }
    const nuoviPunti = punti + (primoTentativo && uscita.servono.length ? 1 : 0);
    setPunti(nuoviPunti);
    setMessaggio({ testo: uscita.fatto, tipo: "brava" });
    parla(uscita.fatto);
    window.setTimeout(() => {
      setMessaggio(null);
      setPrimoTentativo(true);
      if (round + 1 >= totale) {
        setFinito(true);
        onComplete?.({ score: nuoviPunti, stars: stelle(nuoviPunti, totale - 1) });
        return;
      }
      setRound((r) => r + 1);
      // Si riparte spogliati, così ogni uscita si prepara da capo; i trucchi restano solo nel libero.
      setVestiti({});
      if (round + 1 < totale - 1) setTrucchi([]);
      setZona("testa");
    }, 1500);
  }, [uscita, vestiti, trucchi, punti, primoTentativo, round, totale, onComplete]);

  // ?demo=1: Mizi si veste da sola (per i video).
  useEffect(() => {
    if (!demo || finito) return;
    const t = window.setTimeout(() => {
      for (const id of uscita.servono.length ? uscita.servono : ["corona", "cuori", "tutu", "guance", "brillantini"]) if (!addosso(id)) indossa(id);
      window.setTimeout(fatto, 900);
    }, 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, round, finito]);

  const ancora = () => {
    setRound(0);
    setVestiti({});
    setTrucchi([]);
    setPunti(0);
    setPrimoTentativo(true);
    setMessaggio(null);
    setFinito(false);
  };

  /** La foto: sfondo + Mizi + capi in un PNG da salvare (niente esce dal telefono). */
  const salvaFoto = async () => {
    const svg = palco.current;
    if (!svg) return;
    const copia = svg.cloneNode(true) as SVGSVGElement;
    const img = copia.querySelector("image");
    if (img) {
      const blob = await fetch("/mizi/mizi-intera.webp").then((r) => r.blob());
      const dati = await new Promise<string>((ok) => {
        const fr = new FileReader();
        fr.onload = () => ok(String(fr.result));
        fr.readAsDataURL(blob);
      });
      img.setAttribute("href", dati);
    }
    copia.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copia.setAttribute("width", "1204");
    copia.setAttribute("height", "1440");
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copia)], { type: "image/svg+xml" }));
    const immagine = new Image();
    await new Promise((ok, ko) => {
      immagine.onload = ok;
      immagine.onerror = ko;
      immagine.src = url;
    });
    const tela = document.createElement("canvas");
    tela.width = 1204;
    tela.height = 1440;
    tela.getContext("2d")!.drawImage(immagine, 0, 0, 1204, 1440);
    URL.revokeObjectURL(url);
    const a = document.createElement("a");
    a.download = "mizi-vestita-giocamizi.png";
    a.href = tela.toDataURL("image/png");
    a.click();
  };

  const capiZona = CAPI.filter((c) => c.zona === zona);

  return (
    <GameShell titolo="Vesti Mizi" istruzione={uscita.istruzione} round={round} totaleRound={totale} finito={finito} stelle={stelle(punti, totale - 1)} onAncora={ancora}>
      <div className="flex w-full max-w-xl flex-col items-center gap-3">
        <div className="relative flex h-[min(42vh,26rem)] w-full items-center justify-center overflow-hidden rounded-[1.6rem] border-2 border-crema-scuro bg-white">
          <Palco scena={uscita.scena} vestiti={vestiti} trucchi={trucchi} svgRef={palco} />
          {messaggio && (
            <p
              role="status"
              className={`absolute inset-x-3 bottom-3 rounded-2xl px-4 py-2.5 text-center text-base font-black shadow-lg ${messaggio.tipo === "brava" ? "bg-verde text-white" : "bg-white text-notte"}`}
              data-messaggio={messaggio.tipo}
            >
              {messaggio.testo}
            </p>
          )}
        </div>

        <div className="flex w-full gap-2">
          {uscita.scena === "libero" && (
            <button type="button" onClick={() => void salvaFoto()} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-viola bg-white py-3 font-black text-viola" data-salva-foto>
              <Camera className="h-5 w-5" strokeWidth={2.6} aria-hidden /> Salva la foto
            </button>
          )}
          <button type="button" onClick={fatto} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-viola py-3 text-lg font-black text-white" data-fatto>
            <Check className="h-5 w-5" strokeWidth={3} aria-hidden /> Fatto
          </button>
        </div>

        {/* Il guardaroba: prima la zona, poi il capo. */}
        <div className="flex w-full gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Zone del guardaroba">
          {ZONE.map((z) => (
            <button
              key={z.id}
              type="button"
              role="tab"
              aria-selected={zona === z.id}
              onClick={() => setZona(z.id)}
              className={`shrink-0 rounded-full border-2 px-3.5 py-2 text-sm font-black ${zona === z.id ? "border-notte bg-notte text-white" : "border-crema-scuro bg-white text-notte"}`}
              style={{ minHeight: 0, minWidth: 0 }}
              data-zona={z.id}
            >
              {z.nome}
            </button>
          ))}
        </div>
        <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4" role="tabpanel">
          {capiZona.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={addosso(c.id)}
              onClick={() => indossa(c.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-[3px] bg-white p-2 ${addosso(c.id) ? "border-viola" : "border-crema-scuro"}`}
              style={{ minHeight: 0, minWidth: 0 }}
              data-capo={c.id}
            >
              <svg viewBox={c.box} className="h-14 w-full" aria-hidden>
                {c.disegno}
              </svg>
              <span className="text-center text-xs font-extrabold leading-tight text-notte">{c.nome}</span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
