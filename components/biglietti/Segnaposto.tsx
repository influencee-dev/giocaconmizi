import { CSS_DA_COLORARE, Sfondo, inchiostro, type Variante } from "./Sfondo";
import { FOGLIO_A4 } from "./Etichette";

/**
 * I segnaposto per la tavola della festa: cartoncini da piegare a tenda con
 * il nome di ogni invitato, nello stesso tema del biglietto. Un foglio A4
 * (300 dpi) ne tiene 6; ogni cartoncino è due metà uguali, quella di sopra
 * capovolta, così piegato sulla linea a puntini il nome si legge da tutti e
 * due i lati del tavolo. I nomi sono gli stessi delle etichette (punto 7) e
 * restano nel browser, come lì.
 */

export const SEGNAPOSTO_PER_FOGLIO = 6;

const MARGINE = 120;
const SPAZIO = 40;
const COLONNE = 2;
const RIGHE = 3;
const L = (FOGLIO_A4.larghezza - MARGINE * 2 - SPAZIO * (COLONNE - 1)) / COLONNE;
const H = (FOGLIO_A4.altezza - MARGINE * 2 - SPAZIO * (RIGHE - 1)) / RIGHE;
/** Una metà del cartoncino: è la faccia che si vede, circa 9 × 4,5 cm. */
const META = H / 2;
const FAMIGLIA = "Nunito, ui-sans-serif, system-ui, sans-serif";

/** I nomi divisi in fogli da 6. */
export function fogliSegnaposto(nomi: string[]): string[][] {
  const fogli: string[][] = [];
  for (let i = 0; i < nomi.length; i += SEGNAPOSTO_PER_FOGLIO) fogli.push(nomi.slice(i, i + SEGNAPOSTO_PER_FOGLIO));
  return fogli;
}

const corpo = (testo: string, massimo: number, spazio: number) =>
  Math.min(massimo, spazio / Math.max(1, testo.length * 0.56));

function Faccia({ nome, sotto, tema, variante }: { nome: string; sotto: string; tema: string; variante: Variante }) {
  const testo = inchiostro(tema, variante);
  const daColorare = variante === "colorare";
  const corpoNome = corpo(nome, META * 0.36, L * 0.78);
  return (
    <>
      <Sfondo tema={tema} variante={variante} larghezza={L} altezza={META} />
      {/* Il nastro chiaro dove sta il nome: si legge su qualsiasi motivo. */}
      <rect
        x={L * 0.07}
        y={META * 0.2}
        width={L * 0.86}
        height={META * 0.6}
        rx={META * 0.12}
        fill="#FFFFFF"
        fillOpacity={daColorare ? 1 : 0.88}
        stroke={daColorare ? testo : "none"}
        strokeWidth={daColorare ? 4 : 0}
      />
      <text
        x={L / 2}
        y={META * 0.52 + corpoNome * 0.12}
        textAnchor="middle"
        fontFamily={FAMIGLIA}
        fontSize={corpoNome}
        fontWeight="900"
        fill={daColorare ? "#FFFFFF" : testo}
        stroke={daColorare ? testo : undefined}
        strokeWidth={daColorare ? corpoNome * 0.04 : undefined}
        strokeLinejoin="round"
        data-segnaposto-nome
      >
        {nome}
      </text>
      <text
        x={L / 2}
        y={META * 0.72}
        textAnchor="middle"
        fontFamily={FAMIGLIA}
        fontSize={corpo(sotto, META * 0.085, L * 0.7)}
        fontWeight="700"
        fill={testo}
        opacity="0.8"
      >
        {sotto}
      </text>
    </>
  );
}

export function FoglioSegnaposto({
  nomi,
  tema,
  variante,
  festeggiato,
  pagina,
}: {
  nomi: string[];
  tema: string;
  variante: Variante;
  festeggiato: string;
  pagina: number;
}) {
  const sotto = festeggiato.trim() ? `alla festa di ${festeggiato.trim()}` : "benvenuto alla festa";
  return (
    <svg
      viewBox={`0 0 ${FOGLIO_A4.larghezza} ${FOGLIO_A4.altezza}`}
      width={FOGLIO_A4.larghezza}
      height={FOGLIO_A4.altezza}
      xmlns="http://www.w3.org/2000/svg"
      data-foglio-segnaposto={pagina}
      data-segnaposto={nomi.length}
    >
      {variante === "colorare" && <style>{CSS_DA_COLORARE}</style>}
      <rect x="0" y="0" width={FOGLIO_A4.larghezza} height={FOGLIO_A4.altezza} fill="#FFFFFF" />
      {nomi.map((nome, i) => {
        const x = MARGINE + (i % COLONNE) * (L + SPAZIO);
        const y = MARGINE + Math.floor(i / COLONNE) * (H + SPAZIO);
        return (
          <g key={`${i}-${nome}`} data-segnaposto-di={nome}>
            {/* Metà di sopra, capovolta: dopo la piega si legge dall'altro lato del tavolo. */}
            <svg x={x} y={y} width={L} height={META} viewBox={`0 0 ${L} ${META}`}>
              <g transform={`rotate(180 ${L / 2} ${META / 2})`}>
                <Faccia nome={nome} sotto={sotto} tema={tema} variante={variante} />
              </g>
            </svg>
            <svg x={x} y={y + META} width={L} height={META} viewBox={`0 0 ${L} ${META}`}>
              <Faccia nome={nome} sotto={sotto} tema={tema} variante={variante} />
            </svg>
            {/* Piega a puntini e linea di taglio. */}
            <line x1={x} y1={y + META} x2={x + L} y2={y + META} stroke="#9AA1AD" strokeWidth="4" strokeDasharray="4 14" strokeLinecap="round" />
            <rect x={x} y={y} width={L} height={H} rx="20" fill="none" stroke="#B9B9B9" strokeWidth="3" strokeDasharray="18 12" />
          </g>
        );
      })}
      <text x={FOGLIO_A4.larghezza / 2} y={FOGLIO_A4.altezza - 50} textAnchor="middle" fontFamily={FAMIGLIA} fontSize="34" fontWeight="700" fill="#9AA1AD">
        Ritaglia sul tratteggio e piega a tenda sui puntini · giocamizi.it
      </text>
    </svg>
  );
}
