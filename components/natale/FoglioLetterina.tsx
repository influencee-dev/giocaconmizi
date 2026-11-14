import { Disegno } from "@/games/_engine/arte";
import { CSS_DA_COLORARE, Sfondo, inchiostro, type Variante } from "@/components/biglietti/Sfondo";
import { FOGLIO_A4 } from "@/components/biglietti/Etichette";
import { aCapo } from "@/components/biglietti/Caccia";

/**
 * La letterina a Babbo Natale su un foglio A4 (300 dpi), nello stile dei
 * biglietti: motivi solo lungo la cornice, centro libero per il testo.
 * Le parti vuote diventano righe da scrivere a mano: così lo stesso foglio
 * vale sia compilato dal telefono sia «da stampare e scrivere».
 */

export interface DatiLetterina {
  carta: string;
  variante: Variante;
  apertura: string;
  questAnno: string;
  desideri: string[];
  pensiero: string;
  chiusura: string;
  firma: string;
  conMizi: boolean;
}

const W = FOGLIO_A4.larghezza;
const H = FOGLIO_A4.altezza;
const FAMIGLIA = "Nunito, ui-sans-serif, system-ui, sans-serif";
const X0 = W * 0.13;
const X1 = W * 0.87;

/** Un blocco di testo con righe tratteggiate sotto, oppure solo righe se è vuoto. */
function Blocco({
  testo,
  y,
  corpo,
  perRiga,
  righe,
  colore,
  peso = 700,
}: {
  testo: string;
  y: number;
  corpo: number;
  perRiga: number;
  righe: number;
  colore: string;
  peso?: number;
}) {
  const linee = testo.trim() ? aCapo(testo, perRiga, righe) : Array.from({ length: righe }, () => "");
  const passo = corpo * 1.55;
  return (
    <g>
      {linee.map((l, i) => (
        <g key={i}>
          <line x1={X0} x2={X1} y1={y + i * passo + corpo * 0.35} y2={y + i * passo + corpo * 0.35} stroke={colore} strokeOpacity="0.22" strokeWidth="4" strokeDasharray="2 16" strokeLinecap="round" />
          {l && (
            <text x={X0} y={y + i * passo} fontFamily={FAMIGLIA} fontSize={corpo} fontWeight={peso} fill={colore}>
              {l}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

export function FoglioLetterina({ dati }: { dati: DatiLetterina }) {
  const colore = inchiostro(dati.carta, dati.variante);
  const daColorare = dati.variante === "colorare";
  const desideri = dati.desideri.map((d) => d.trim()).filter(Boolean);
  const corpo = 78;
  let y = H * 0.25;

  const pezzi: React.ReactNode[] = [];
  pezzi.push(<Blocco key="apertura" testo={dati.apertura} y={y} corpo={corpo} perRiga={42} righe={2} colore={colore} peso={800} />);
  y += corpo * 1.55 * 2 + corpo * 0.9;
  pezzi.push(<Blocco key="anno" testo={dati.questAnno} y={y} corpo={corpo} perRiga={42} righe={3} colore={colore} />);
  y += corpo * 1.55 * 3 + corpo * 0.9;

  pezzi.push(
    <text key="tit-desideri" x={X0} y={y} fontFamily={FAMIGLIA} fontSize={corpo * 1.05} fontWeight="900" fill={colore}>
      Per Natale vorrei:
    </text>,
  );
  y += corpo * 1.5;
  const righeDesideri = Math.max(desideri.length, 4);
  for (let i = 0; i < righeDesideri; i++) {
    const d = desideri[i] ?? "";
    const yy = y + i * corpo * 1.55;
    pezzi.push(
      <g key={`des-${i}`}>
        <circle cx={X0 + corpo * 0.3} cy={yy - corpo * 0.32} r={corpo * 0.22} fill={daColorare ? "#FFFFFF" : "#E8474B"} stroke={colore} strokeWidth={daColorare ? 4 : 0} />
        <line x1={X0 + corpo * 0.8} x2={X1} y1={yy + corpo * 0.35} y2={yy + corpo * 0.35} stroke={colore} strokeOpacity="0.22" strokeWidth="4" strokeDasharray="2 16" strokeLinecap="round" />
        {d && (
          <text x={X0 + corpo * 0.8} y={yy} fontFamily={FAMIGLIA} fontSize={corpo} fontWeight="800" fill={colore}>
            {d}
          </text>
        )}
      </g>,
    );
  }
  y += righeDesideri * corpo * 1.55 + corpo * 0.6;

  if (dati.pensiero.trim()) {
    pezzi.push(<Blocco key="pensiero" testo={dati.pensiero} y={y} corpo={corpo * 0.9} perRiga={46} righe={2} colore={colore} />);
    y += corpo * 0.9 * 1.55 * 2 + corpo * 0.6;
  }
  pezzi.push(<Blocco key="chiusura" testo={dati.chiusura} y={y} corpo={corpo} perRiga={42} righe={1} colore={colore} />);
  y += corpo * 1.9;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" data-foglio-letterina>
      {daColorare && <style>{CSS_DA_COLORARE}</style>}
      <Sfondo tema={dati.carta} variante={dati.variante} larghezza={W} altezza={H} />
      <rect
        x={W * 0.09}
        y={H * 0.1}
        width={W * 0.82}
        height={H * 0.8}
        rx="70"
        fill="#FFFFFF"
        fillOpacity={daColorare ? 1 : 0.92}
        stroke={daColorare ? colore : "none"}
        strokeWidth={daColorare ? 6 : 0}
      />
      <text x={W / 2} y={H * 0.17} textAnchor="middle" fontFamily={FAMIGLIA} fontSize="150" fontWeight="900" fill={daColorare ? "#FFFFFF" : "#C8363B"} stroke={daColorare ? colore : "none"} strokeWidth={daColorare ? 6 : 0}>
        Caro Babbo Natale
      </text>
      {pezzi}
      <text x={X1} y={Math.min(y + corpo * 0.6, H * 0.83)} textAnchor="end" fontFamily={FAMIGLIA} fontSize={corpo * 1.1} fontWeight="900" fill={colore}>
        {dati.firma.trim() ? dati.firma.trim() : "Firma: ______________"}
      </text>
      {dati.conMizi && (
        <g transform={`translate(${W * 0.12} ${H * 0.76}) scale(${(H * 0.11) / 100})`}>
          <g className={daColorare ? "dc-linea dc-disegno" : undefined}>
            <Disegno id="pinguino" className="" lato={100} />
          </g>
        </g>
      )}
      <text x={W / 2} y={H - 60} textAnchor="middle" fontFamily={FAMIGLIA} fontSize="34" fontWeight="700" fill="#9AA1AD">
        Letterina fatta con Mizi su giocamizi.it
      </text>
    </svg>
  );
}

/** La risposta di Babbo Natale: il nome lo scrive a mano il genitore. */
export function FoglioRisposta({ paragrafi, carta, variante }: { paragrafi: string[]; carta: string; variante: Variante }) {
  const colore = inchiostro(carta, variante);
  const daColorare = variante === "colorare";
  const corpo = 76;
  let y = H * 0.3;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" data-foglio-risposta>
      {daColorare && <style>{CSS_DA_COLORARE}</style>}
      <Sfondo tema={carta} variante={variante} larghezza={W} altezza={H} />
      <rect x={W * 0.09} y={H * 0.1} width={W * 0.82} height={H * 0.8} rx="70" fill="#FFFFFF" fillOpacity={daColorare ? 1 : 0.92} stroke={daColorare ? colore : "none"} strokeWidth={daColorare ? 6 : 0} />
      <text x={W / 2} y={H * 0.16} textAnchor="middle" fontFamily={FAMIGLIA} fontSize="66" fontWeight="800" fill={colore} opacity="0.75">
        Polo Nord, laboratorio degli elfi
      </text>
      <text x={X0} y={H * 0.235} fontFamily={FAMIGLIA} fontSize={corpo * 1.25} fontWeight="900" fill={colore}>
        Caro/a
      </text>
      <line x1={X0 + corpo * 3.6} x2={X1} y1={H * 0.235 + 12} y2={H * 0.235 + 12} stroke={colore} strokeOpacity="0.35" strokeWidth="5" strokeDasharray="2 16" strokeLinecap="round" />
      {paragrafi.map((p, i) => {
        const righe = aCapo(p, 44, 5);
        const blocco = (
          <text key={i} x={X0} y={y} fontFamily={FAMIGLIA} fontSize={corpo} fontWeight="700" fill={colore}>
            {righe.map((r, k) => (
              <tspan key={k} x={X0} dy={k === 0 ? 0 : corpo * 1.45}>
                {r}
              </tspan>
            ))}
          </text>
        );
        y += righe.length * corpo * 1.45 + corpo * 0.8;
        return blocco;
      })}
      <text x={X1} y={Math.min(y + corpo, H * 0.84)} textAnchor="end" fontFamily={FAMIGLIA} fontSize={corpo * 1.2} fontWeight="900" fill={daColorare ? colore : "#C8363B"}>
        Babbo Natale
      </text>
      <text x={W / 2} y={H - 60} textAnchor="middle" fontFamily={FAMIGLIA} fontSize="34" fontWeight="700" fill="#9AA1AD">
        La risposta di Babbo Natale · giocamizi.it
      </text>
    </svg>
  );
}
