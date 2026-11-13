import { CSS_DA_COLORARE, Sfondo, inchiostro, type Variante } from "./Sfondo";
import { FOGLIO_A4 } from "./Etichette";

/**
 * La caccia al tesoro della festa: un foglio A4 (300 dpi) con 6 cartoncini
 * «Indizio», nello stesso tema del biglietto. Ogni indizio dice dove si
 * trova il successivo; l'ultimo porta al tesoro. I testi pronti sono per
 * una caccia in casa, ma si cambiano uno per uno nell'editor e restano nel
 * browser (non vanno nel link del biglietto).
 */

export const NUMERO_INDIZI = 6;
export const MAX_CARATTERI_INDIZIO = 90;

export const INDIZI_PRONTI: string[] = [
  "Il prossimo indizio ti aspetta dove di notte dormono i cuscini.",
  "Cerca dove l'acqua fa le bolle quando ti lavi le mani.",
  "Vai dove il freddo tiene al fresco il latte.",
  "Guarda sotto la sedia dove ti siedi a mangiare.",
  "Cerca vicino alla porta, dove riposano le scarpe.",
  "Il tesoro è nascosto dove si guarda la TV!",
];

const MARGINE = 120;
const SPAZIO = 40;
const COLONNE = 2;
const RIGHE = 3;
const L = (FOGLIO_A4.larghezza - MARGINE * 2 - SPAZIO * (COLONNE - 1)) / COLONNE;
const H = (FOGLIO_A4.altezza - MARGINE * 2 - SPAZIO * (RIGHE - 1)) / RIGHE;
const FAMIGLIA = "Nunito, ui-sans-serif, system-ui, sans-serif";

/** Testo andato a capo per parole, al massimo `righe` righe da `perRiga` caratteri. */
export function aCapo(testo: string, perRiga: number, righe: number): string[] {
  const parole = testo.trim().split(/\s+/).filter(Boolean);
  const fuori: string[] = [];
  let riga = "";
  for (const p of parole) {
    const prova = riga ? `${riga} ${p}` : p;
    if (prova.length <= perRiga || !riga) riga = prova;
    else {
      fuori.push(riga);
      riga = p;
    }
  }
  if (riga) fuori.push(riga);
  if (fuori.length > righe) {
    const tenute = fuori.slice(0, righe);
    tenute[righe - 1] = `${tenute[righe - 1].replace(/[.,;:!?…]*$/, "")}…`;
    return tenute;
  }
  return fuori;
}

/** Gli indizi da stampare: quelli scritti, oppure quelli pronti dove la casella è vuota. */
export function indiziDaStampare(scritti: string[]): string[] {
  return Array.from({ length: NUMERO_INDIZI }, (_, i) => {
    const t = (scritti[i] ?? "").trim().slice(0, MAX_CARATTERI_INDIZIO);
    return t || INDIZI_PRONTI[i];
  });
}

export function FoglioCaccia({
  indizi,
  tema,
  variante,
  festeggiato,
}: {
  indizi: string[];
  tema: string;
  variante: Variante;
  festeggiato: string;
}) {
  const testo = inchiostro(tema, variante);
  const daColorare = variante === "colorare";
  const firma = festeggiato.trim() ? `La caccia al tesoro di ${festeggiato.trim()}` : "La caccia al tesoro della festa";
  return (
    <svg
      viewBox={`0 0 ${FOGLIO_A4.larghezza} ${FOGLIO_A4.altezza}`}
      width={FOGLIO_A4.larghezza}
      height={FOGLIO_A4.altezza}
      xmlns="http://www.w3.org/2000/svg"
      data-foglio-caccia
      data-indizi={indizi.length}
    >
      {daColorare && <style>{CSS_DA_COLORARE}</style>}
      <rect x="0" y="0" width={FOGLIO_A4.larghezza} height={FOGLIO_A4.altezza} fill="#FFFFFF" />
      {indizi.map((indizio, i) => {
        const x = MARGINE + (i % COLONNE) * (L + SPAZIO);
        const y = MARGINE + Math.floor(i / COLONNE) * (H + SPAZIO);
        const righe = aCapo(indizio, 24, 5);
        const corpo = H * 0.064;
        const inizio = H * 0.5 - ((righe.length - 1) * corpo * 1.25) / 2 + corpo * 0.35;
        return (
          <g key={i} data-indizio={i + 1}>
            <svg x={x} y={y} width={L} height={H} viewBox={`0 0 ${L} ${H}`}>
              <Sfondo tema={tema} variante={variante} larghezza={L} altezza={H} />
              <rect
                x={L * 0.07}
                y={H * 0.1}
                width={L * 0.86}
                height={H * 0.8}
                rx={H * 0.06}
                fill="#FFFFFF"
                fillOpacity={daColorare ? 1 : 0.9}
                stroke={daColorare ? testo : "none"}
                strokeWidth={daColorare ? 4 : 0}
              />
              <text x={L / 2} y={H * 0.24} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={H * 0.085} fontWeight="900" letterSpacing={H * 0.006} fill={testo}>
                {i === indizi.length - 1 ? "ULTIMO INDIZIO" : `INDIZIO ${i + 1}`}
              </text>
              <text x={L / 2} y={inizio} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={corpo} fontWeight="800" fill={testo} data-testo-indizio>
                {righe.map((r, k) => (
                  <tspan key={k} x={L / 2} dy={k === 0 ? 0 : corpo * 1.25}>
                    {r}
                  </tspan>
                ))}
              </text>
              <text x={L / 2} y={H * 0.84} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={H * 0.042} fontWeight="700" fill={testo} opacity="0.75">
                {firma}
              </text>
            </svg>
            <rect x={x} y={y} width={L} height={H} rx="20" fill="none" stroke="#B9B9B9" strokeWidth="3" strokeDasharray="18 12" />
          </g>
        );
      })}
      <text x={FOGLIO_A4.larghezza / 2} y={FOGLIO_A4.altezza - 50} textAnchor="middle" fontFamily={FAMIGLIA} fontSize="34" fontWeight="700" fill="#9AA1AD">
        Ritaglia sul tratteggio, nascondi gli indizi in ordine e consegna il primo · giocamizi.it
      </text>
    </svg>
  );
}
