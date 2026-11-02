import { CSS_DA_COLORARE, Sfondo, inchiostro, type Variante } from "./Sfondo";
import { FOGLIO_A4 } from "./Etichette";

/**
 * Il festone "Buon compleanno": una bandierina per lettera, nello stesso tema
 * del biglietto, 6 per foglio A4 a 300 dpi. Si ritaglia sul tratteggio, si
 * piega la linguetta in alto sullo spago e si incolla. Fra una parola e
 * l'altra c'è una bandierina con la stella. Il numerino nella linguetta dice
 * l'ordine, così il festone non si monta al contrario.
 */

export type TestoFestone = "buon-compleanno" | "auguri" | "nome";

export const TESTI_FESTONE: { id: TestoFestone; etichetta: string }[] = [
  { id: "buon-compleanno", etichetta: "Buon compleanno + nome" },
  { id: "auguri", etichetta: "Auguri + nome" },
  { id: "nome", etichetta: "Solo il nome" },
];

export const PER_FOGLIO = 6;
export const MAX_BANDIERINE = 30;
const STELLA = "★";
/** I colori del sito, a giro sulle bandierine. */
const BORDI = ["#F28AB2", "#3DB5E6", "#F9C846", "#9B6DD6", "#4CAF6D", "#F59A23"];

/** Le bandierine, in ordine: una lettera ciascuna, una stella fra le parole. */
export function bandierine(testo: TestoFestone, nome: string): string[] {
  const pulito = nome.trim().toLocaleUpperCase("it-IT").replace(/[^\p{L}\p{N}' ]/gu, "").replace(/\s+/g, " ");
  const parole =
    testo === "nome"
      ? [pulito]
      : [testo === "auguri" ? "AUGURI" : "BUON COMPLEANNO", pulito].filter(Boolean).join(" ").split(" ");
  const fuori: string[] = [];
  parole.filter(Boolean).forEach((parola, i) => {
    if (i > 0) fuori.push(STELLA);
    fuori.push(...Array.from(parola));
  });
  return fuori.slice(0, MAX_BANDIERINE);
}

/** Le bandierine a gruppi di 6: un gruppo per foglio. */
export const fogli = (lista: string[]) =>
  Array.from({ length: Math.ceil(lista.length / PER_FOGLIO) }, (_, i) => lista.slice(i * PER_FOGLIO, (i + 1) * PER_FOGLIO));

const MARGINE = 120;
const SPAZIO = 40;
const COLONNE = 2;
const RIGHE = 3;
const L = (FOGLIO_A4.larghezza - MARGINE * 2 - SPAZIO * (COLONNE - 1)) / COLONNE;
const H = (FOGLIO_A4.altezza - MARGINE * 2 - SPAZIO * (RIGHE - 1)) / RIGHE;
/** La linguetta da piegare sullo spago. */
const LINGUETTA = H * 0.13;

function stella(cx: number, cy: number, r: number) {
  const punti: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const raggio = i % 2 === 0 ? r : r * 0.42;
    punti.push(`${(cx + raggio * Math.cos(a)).toFixed(1)},${(cy + raggio * Math.sin(a)).toFixed(1)}`);
  }
  return punti.join(" ");
}

export function FoglioFestone({
  lettere,
  primo,
  tema,
  variante,
  pagina,
}: {
  lettere: string[];
  /** Il numero d'ordine della prima bandierina del foglio (da 1). */
  primo: number;
  tema: string;
  variante: Variante;
  pagina: number;
}) {
  const testo = inchiostro(tema, variante);
  const famiglia = "Nunito, ui-sans-serif, system-ui, sans-serif";
  const daColorare = variante === "colorare";
  const sagoma = `M0 0 H${L} V${LINGUETTA} L${L / 2} ${H} L0 ${LINGUETTA} Z`;
  const triangolo = `M0 ${LINGUETTA} H${L} L${L / 2} ${H} Z`;
  const corpo = (H - LINGUETTA) * 0.46;
  const yLettera = LINGUETTA + (H - LINGUETTA) * 0.42;

  return (
    <svg
      viewBox={`0 0 ${FOGLIO_A4.larghezza} ${FOGLIO_A4.altezza}`}
      width={FOGLIO_A4.larghezza}
      height={FOGLIO_A4.altezza}
      xmlns="http://www.w3.org/2000/svg"
      data-foglio-festone={pagina}
      data-bandierine={lettere.length}
    >
      {daColorare && <style>{CSS_DA_COLORARE}</style>}
      <rect x="0" y="0" width={FOGLIO_A4.larghezza} height={FOGLIO_A4.altezza} fill="#FFFFFF" />
      {lettere.map((lettera, i) => {
        const x = MARGINE + (i % COLONNE) * (L + SPAZIO);
        const y = MARGINE + Math.floor(i / COLONNE) * (H + SPAZIO);
        const id = `festone-${pagina}-${i}`;
        return (
          <g key={id} data-bandierina={lettera}>
            {/* Ogni bandierina è un SVG annidato con larghezza e altezza esplicite. */}
            <svg x={x} y={y} width={L} height={H} viewBox={`0 0 ${L} ${H}`}>
              <defs>
                <clipPath id={id}>
                  <path d={triangolo} />
                </clipPath>
              </defs>
              <g clipPath={`url(#${id})`}>
                <Sfondo tema={tema} variante={variante} larghezza={L} altezza={H} />
                {/* Il bordo colorato, a colori alterni come i festoni veri
                    (nel "da colorare" resta da riempire). */}
                <path
                  d={triangolo}
                  fill="none"
                  stroke={daColorare ? testo : BORDI[(primo + i - 1) % BORDI.length]}
                  strokeWidth={daColorare ? 8 : 70}
                  strokeLinejoin="round"
                />
              </g>
              {/* La linguetta resta bianca: si piega dietro, sullo spago. */}
              <rect x="0" y="0" width={L} height={LINGUETTA} fill="#FFFFFF" />
              <line x1="0" y1={LINGUETTA} x2={L} y2={LINGUETTA} stroke="#B9C0CC" strokeWidth="4" strokeDasharray="6 10" />
              <text x={L / 2} y={LINGUETTA * 0.62} textAnchor="middle" fontFamily={famiglia} fontSize={LINGUETTA * 0.36} fontWeight="700" fill="#9AA1AD">
                {primo + i} · piega qui
              </text>
              {lettera === STELLA ? (
                <polygon
                  points={stella(L / 2, yLettera - corpo * 0.32, corpo * 0.42)}
                  fill={daColorare ? "#FFFFFF" : testo}
                  stroke={testo}
                  strokeWidth={corpo * 0.03}
                  strokeLinejoin="round"
                />
              ) : (
                <text
                  x={L / 2}
                  y={yLettera}
                  textAnchor="middle"
                  fontFamily={famiglia}
                  fontSize={corpo}
                  fontWeight="900"
                  fill={daColorare ? "#FFFFFF" : testo}
                  stroke={daColorare ? testo : undefined}
                  strokeWidth={daColorare ? corpo * 0.04 : undefined}
                  strokeLinejoin="round"
                >
                  {lettera}
                </text>
              )}
            </svg>
            {/* Linea di taglio, sagoma intera con la linguetta. */}
            <path d={sagoma} transform={`translate(${x} ${y})`} fill="none" stroke="#B9B9B9" strokeWidth="3" strokeDasharray="18 12" />
          </g>
        );
      })}
    </svg>
  );
}
