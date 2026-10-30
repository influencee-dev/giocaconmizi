import { CSS_DA_COLORARE, Sfondo, inchiostro, type Variante } from "./Sfondo";

/**
 * Le etichette per i sacchettini della festa: un foglio A4 (300 dpi) con
 * fino a 12 cartellini "Grazie, Martina!", nello stesso tema del biglietto.
 * Si stampa, si ritaglia lungo il tratteggio, si fa il buco nel cerchietto
 * e si lega al sacchetto.
 *
 * I nomi degli invitati sono dati di altri bambini: restano nel browser,
 * non entrano mai nel link del biglietto (come la foto).
 */

export const FOGLIO_A4 = { larghezza: 2480, altezza: 3508 } as const;
export const MAX_ETICHETTE = 12;

const MARGINE = 120;
const SPAZIO = 40;
const COLONNE = 2;
const RIGHE = 6;
const L = (FOGLIO_A4.larghezza - MARGINE * 2 - SPAZIO * (COLONNE - 1)) / COLONNE;
const H = (FOGLIO_A4.altezza - MARGINE * 2 - SPAZIO * (RIGHE - 1)) / RIGHE;

/** I nomi scritti uno per riga, puliti: niente righe vuote, al massimo 12. */
export function nomiOspiti(testo: string): string[] {
  return testo
    .split(/\r?\n/)
    .map((n) => n.trim().slice(0, 24))
    .filter(Boolean)
    .slice(0, MAX_ETICHETTE);
}

/** Corpo del nome: grande, ma deve stare dentro il cartellino. */
const corpo = (testo: string, massimo: number, spazio: number) =>
  Math.min(massimo, spazio / Math.max(1, testo.length * 0.54));

export function Etichette({
  nomi,
  tema,
  variante,
  festeggiato,
}: {
  nomi: string[];
  tema: string;
  variante: Variante;
  festeggiato: string;
}) {
  const testo = inchiostro(tema, variante);
  const famiglia = "Nunito, ui-sans-serif, system-ui, sans-serif";
  const daColorare = variante === "colorare";
  const sotto = festeggiato.trim() ? `dalla festa di ${festeggiato.trim()}` : "per aver festeggiato con noi";

  return (
    <svg
      viewBox={`0 0 ${FOGLIO_A4.larghezza} ${FOGLIO_A4.altezza}`}
      width={FOGLIO_A4.larghezza}
      height={FOGLIO_A4.altezza}
      xmlns="http://www.w3.org/2000/svg"
      data-etichette={nomi.length}
    >
      {daColorare && <style>{CSS_DA_COLORARE}</style>}
      <rect x="0" y="0" width={FOGLIO_A4.larghezza} height={FOGLIO_A4.altezza} fill="#FFFFFF" />
      {nomi.map((nome, i) => {
        const x = MARGINE + (i % COLONNE) * (L + SPAZIO);
        const corpoNome = corpo(nome, H * 0.27, L * 0.72);
        const y = MARGINE + Math.floor(i / COLONNE) * (H + SPAZIO);
        return (
          <g key={`${i}-${nome}`} data-etichetta={nome}>
            {/* Il cartellino: un SVG annidato con larghezza e altezza esplicite. */}
            <svg x={x} y={y} width={L} height={H} viewBox={`0 0 ${L} ${H}`}>
              <Sfondo tema={tema} variante={variante} larghezza={L} altezza={H} />
              {/* Il buco per il nastrino, a sinistra. */}
              <circle cx={H * 0.16} cy={H / 2} r={H * 0.055} fill="#FFFFFF" stroke="#B9C0CC" strokeWidth="4" strokeDasharray="10 8" />
              <text
                x={L / 2}
                y={H * 0.33}
                textAnchor="middle"
                fontFamily={famiglia}
                fontSize={H * 0.13}
                fontWeight="800"
                letterSpacing={H * 0.01}
                fill={testo}
                opacity="0.75"
              >
                GRAZIE
              </text>
              <text
                x={L / 2}
                y={H * 0.62}
                textAnchor="middle"
                fontFamily={famiglia}
                fontSize={corpoNome}
                fontWeight="800"
                fill={daColorare ? "#FFFFFF" : testo}
                stroke={daColorare ? testo : undefined}
                strokeWidth={daColorare ? corpoNome * 0.045 : undefined}
                strokeLinejoin="round"
              >
                {nome}
              </text>
              <text
                x={L / 2}
                y={H * 0.8}
                textAnchor="middle"
                fontFamily={famiglia}
                fontSize={corpo(sotto, H * 0.085, L * 0.7)}
                fontWeight="700"
                fill={testo}
              >
                {sotto}
              </text>
            </svg>
            {/* Linea di taglio. */}
            <rect x={x} y={y} width={L} height={H} rx="24" fill="none" stroke="#B9B9B9" strokeWidth="3" strokeDasharray="18 12" />
          </g>
        );
      })}
    </svg>
  );
}
