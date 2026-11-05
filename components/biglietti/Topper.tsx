import { CSS_DA_COLORARE, Sfondo, inchiostro, type Variante } from "./Sfondo";
import { FOGLIO_A4 } from "./Etichette";

/**
 * Il topper per la torta: un foglio A4 (300 dpi) nello stesso tema del
 * biglietto, con un disco grande (11 cm) col numero degli anni e il nome, e
 * 8 dischetti piccoli (4 cm) per i cupcake, a numeri e stelline alterni.
 * Si ritaglia sul tratteggio e si fissa uno stecchino dietro con lo scotch,
 * sulla linguetta. Senza età al posto del numero c'è una stella.
 */

export const PICCOLI = 8;
/** I colori del sito, a giro sui bordi dei dischetti. */
const BORDI = ["#F28AB2", "#3DB5E6", "#F9C846", "#9B6DD6", "#4CAF6D", "#F59A23"];
const FAMIGLIA = "Nunito, ui-sans-serif, system-ui, sans-serif";

/** Gli anni come numero da 1 a 99, o null se il campo è vuoto o strano. */
export function anniTopper(eta: string): number | null {
  const n = Number.parseInt(eta.replace(/\D/g, ""), 10);
  return Number.isInteger(n) && n >= 1 && n <= 99 ? n : null;
}

function stella(cx: number, cy: number, r: number) {
  const punti: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const raggio = i % 2 === 0 ? r : r * 0.42;
    punti.push(`${(cx + raggio * Math.cos(a)).toFixed(1)},${(cy + raggio * Math.sin(a)).toFixed(1)}`);
  }
  return punti.join(" ");
}

// Disco grande: 11 cm a 300 dpi sono circa 1300 px.
const R_GRANDE = 650;
const CX = FOGLIO_A4.larghezza / 2;
const CY_GRANDE = 150 + R_GRANDE;
/** La linguetta dove si attacca lo stecchino, sotto il disco. */
const LINGUETTA = { larghezza: 150, altezza: 420 };
// Dischetti: 4 cm, due righe da 4.
const R_PICCOLO = 236;
const SPAZIO_PICCOLI = 120;
const Y_RIGA1 = CY_GRANDE + R_GRANDE + LINGUETTA.altezza + 200 + R_PICCOLO;

/** Un disco: sfondo del tema ritagliato nel cerchio, bordo colorato, centro chiaro. */
function Disco({
  id,
  cx,
  cy,
  r,
  tema,
  variante,
  bordo,
  children,
}: {
  id: string;
  cx: number;
  cy: number;
  r: number;
  tema: string;
  variante: Variante;
  bordo: string;
  children: React.ReactNode;
}) {
  const daColorare = variante === "colorare";
  const testo = inchiostro(tema, variante);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={r} cy={r} r={r} />
        </clipPath>
      </defs>
      <svg x={cx - r} y={cy - r} width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`}>
        <g clipPath={`url(#${id})`}>
          <Sfondo tema={tema} variante={variante} larghezza={r * 2} altezza={r * 2} />
        </g>
        {/* Il centro chiaro, perché numero e nome si leggano su qualsiasi motivo. */}
        <circle cx={r} cy={r} r={r * 0.7} fill="#FFFFFF" fillOpacity={daColorare ? 1 : 0.88} stroke={daColorare ? testo : "none"} strokeWidth={daColorare ? r * 0.012 : 0} />
        <circle cx={r} cy={r} r={r - r * 0.045} fill="none" stroke={daColorare ? testo : bordo} strokeWidth={daColorare ? r * 0.02 : r * 0.09} />
        {children}
      </svg>
      {/* Linea di taglio. */}
      <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#B9B9B9" strokeWidth="3" strokeDasharray="18 12" />
    </g>
  );
}

export function FoglioTopper({
  nome,
  eta,
  tema,
  variante,
}: {
  nome: string;
  eta: string;
  tema: string;
  variante: Variante;
}) {
  const daColorare = variante === "colorare";
  const testo = inchiostro(tema, variante);
  const anni = anniTopper(eta);
  const nomePulito = nome.trim().slice(0, 18);
  // Numero e lettere "vuoti" nel da colorare, pieni negli altri.
  const pieno = daColorare ? "#FFFFFF" : testo;
  const contorno = (corpo: number) => (daColorare ? { stroke: testo, strokeWidth: corpo * 0.035, strokeLinejoin: "round" as const } : {});

  const r = R_GRANDE;
  const corpoNumero = anni !== null && anni >= 10 ? r * 0.62 : r * 0.78;
  const corpoNome = Math.min(r * 0.19, (r * 1.0) / Math.max(1, nomePulito.length * 0.56));
  const piccoli = Array.from({ length: PICCOLI }, (_, i) => i);

  return (
    <svg
      viewBox={`0 0 ${FOGLIO_A4.larghezza} ${FOGLIO_A4.altezza}`}
      width={FOGLIO_A4.larghezza}
      height={FOGLIO_A4.altezza}
      xmlns="http://www.w3.org/2000/svg"
      data-foglio-topper
      data-anni={anni ?? ""}
      data-dischetti={PICCOLI}
    >
      {daColorare && <style>{CSS_DA_COLORARE}</style>}
      <rect x="0" y="0" width={FOGLIO_A4.larghezza} height={FOGLIO_A4.altezza} fill="#FFFFFF" />

      {/* La linguetta per lo stecchino, disegnata prima: il disco la copre in alto. */}
      <g>
        <rect
          x={CX - LINGUETTA.larghezza / 2}
          y={CY_GRANDE + r - 60}
          width={LINGUETTA.larghezza}
          height={LINGUETTA.altezza + 60}
          rx="20"
          fill="#FFFFFF"
          stroke="#B9B9B9"
          strokeWidth="3"
          strokeDasharray="18 12"
        />
        <text
          x={CX}
          y={CY_GRANDE + r + LINGUETTA.altezza / 2}
          textAnchor="middle"
          fontFamily={FAMIGLIA}
          fontSize="30"
          fontWeight="700"
          fill="#9AA1AD"
          transform={`rotate(-90 ${CX} ${CY_GRANDE + r + LINGUETTA.altezza / 2})`}
        >
          stecchino qui
        </text>
      </g>

      <Disco id="topper-grande" cx={CX} cy={CY_GRANDE} r={r} tema={tema} variante={variante} bordo={BORDI[0]}>
        <text x={r} y={r * 0.52} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={r * 0.105} fontWeight="800" fill={testo}>
          Buon compleanno
        </text>
        {anni === null ? (
          <polygon points={stella(r, r * 0.95, r * 0.33)} fill={pieno} stroke={testo} strokeWidth={r * 0.02} strokeLinejoin="round" data-topper-stella />
        ) : (
          <text x={r} y={r * 0.96 + corpoNumero * 0.33} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={corpoNumero} fontWeight="900" fill={pieno} {...contorno(corpoNumero)} data-topper-numero>
            {anni}
          </text>
        )}
        {nomePulito && (
          <text x={r} y={r * 1.47} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={corpoNome} fontWeight="900" fill={pieno} {...contorno(corpoNome)} data-topper-nome>
            {nomePulito}
          </text>
        )}
      </Disco>

      {piccoli.map((i) => {
        const colonna = i % 4;
        const riga = Math.floor(i / 4);
        const larghezzaRiga = 4 * R_PICCOLO * 2 + 3 * SPAZIO_PICCOLI;
        const cx = (FOGLIO_A4.larghezza - larghezzaRiga) / 2 + R_PICCOLO + colonna * (R_PICCOLO * 2 + SPAZIO_PICCOLI);
        const cy = Y_RIGA1 + riga * (R_PICCOLO * 2 + 170);
        const conNumero = anni !== null && (i + riga) % 2 === 0;
        const corpo = anni !== null && anni >= 10 ? R_PICCOLO * 0.7 : R_PICCOLO * 0.9;
        return (
          <Disco key={i} id={`topper-piccolo-${i}`} cx={cx} cy={cy} r={R_PICCOLO} tema={tema} variante={variante} bordo={BORDI[(i + 1) % BORDI.length]}>
            {conNumero ? (
              <text x={R_PICCOLO} y={R_PICCOLO + corpo * 0.36} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={corpo} fontWeight="900" fill={pieno} {...contorno(corpo)}>
                {anni}
              </text>
            ) : (
              <polygon points={stella(R_PICCOLO, R_PICCOLO * 1.04, R_PICCOLO * 0.42)} fill={pieno} stroke={testo} strokeWidth={R_PICCOLO * 0.03} strokeLinejoin="round" />
            )}
          </Disco>
        );
      })}

      <text x={CX} y={FOGLIO_A4.altezza - 90} textAnchor="middle" fontFamily={FAMIGLIA} fontSize="34" fontWeight="700" fill="#9AA1AD">
        Ritaglia sul tratteggio e fissa uno stecchino dietro con lo scotch · giocamizi.it
      </text>
    </svg>
  );
}
