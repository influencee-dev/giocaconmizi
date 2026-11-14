import { Disegno } from "@/games/_engine/arte";
import { FOGLIO_A4 } from "@/components/biglietti/Etichette";
import { CSS_DA_COLORARE } from "@/components/biglietti/Sfondo";
import { MOTIVI } from "@/components/biglietti/motivi";

/**
 * La busta per la letterina, sempre da colorare (richiesta di Giorgia del
 * 14/11/2026). Un A4 a 300 dpi con lo sviluppo della busta: si ritaglia sulla
 * linea continua, si piega sui trattini e si incollano le alette. Il fronte
 * (110 × 154 mm) tiene la letterina A4 piegata in quattro (105 × 148,5 mm).
 * Il fronte è disegnato in orizzontale, ruotato: a busta chiusa si legge
 * come una busta vera.
 */

const { larghezza: W, altezza: H } = FOGLIO_A4;
const mm = (v: number) => (v * W) / 210;
const FAMIGLIA = "Nunito, ui-sans-serif, system-ui, sans-serif";
const NERO = "#1F2430";

/** Il fronte, in millimetri sul foglio verticale. */
const FRONTE = { x: 50, y: 62, w: 110, h: 154 };

const TAGLIO = [
  // aletta in alto
  `M${mm(50)} ${mm(62)} L${mm(62)} ${mm(22)} Q${mm(105)} ${mm(8)} ${mm(148)} ${mm(22)} L${mm(160)} ${mm(62)}`,
  // aletta destra
  `L${mm(198)} ${mm(80)} L${mm(198)} ${mm(198)} L${mm(160)} ${mm(216)}`,
  // aletta in basso
  `L${mm(152)} ${mm(270)} Q${mm(105)} ${mm(284)} ${mm(58)} ${mm(270)} L${mm(50)} ${mm(216)}`,
  // aletta sinistra
  `L${mm(12)} ${mm(198)} L${mm(12)} ${mm(80)} Z`,
].join(" ");

function Motivo({ x, y, lato, ruota = 0 }: { x: number; y: number; lato: number; ruota?: number }) {
  const scheda = MOTIVI.natale;
  return (
    <g
      className="dc-linea dc-motivo"
      transform={`translate(${x - lato / 2} ${y - lato / 2}) rotate(${ruota} ${lato / 2} ${lato / 2}) scale(${lato / 40})`}
    >
      {scheda.motivo(scheda.tinte)}
    </g>
  );
}

export function FoglioBusta({ mittente }: { mittente: string }) {
  // Il fronte orizzontale (154 × 110 mm) ruotato di 90° dentro il rettangolo verticale.
  const fw = mm(FRONTE.h);
  const fh = mm(FRONTE.w);
  const cx = mm(FRONTE.x + FRONTE.w / 2);
  const cy = mm(FRONTE.y + FRONTE.h / 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" data-foglio-busta>
      <style>{CSS_DA_COLORARE}</style>
      <rect x="0" y="0" width={W} height={H} fill="#FFFFFF" />

      {/* Motivi sulle alette: diventano il retro della busta. */}
      <Motivo x={mm(105)} y={mm(38)} lato={mm(20)} />
      <Motivo x={mm(80)} y={mm(46)} lato={mm(13)} ruota={-12} />
      <Motivo x={mm(130)} y={mm(46)} lato={mm(13)} ruota={12} />
      <Motivo x={mm(31)} y={mm(139)} lato={mm(16)} ruota={90} />
      <Motivo x={mm(179)} y={mm(139)} lato={mm(16)} ruota={-90} />

      {/* Contorno da ritagliare e pieghe. */}
      <path d={TAGLIO} fill="none" stroke={NERO} strokeWidth="6" strokeLinejoin="round" data-busta-taglio />
      <rect
        x={mm(FRONTE.x)}
        y={mm(FRONTE.y)}
        width={mm(FRONTE.w)}
        height={mm(FRONTE.h)}
        fill="none"
        stroke="#9AA1AD"
        strokeWidth="5"
        strokeDasharray="22 16"
        data-busta-pieghe
      />

      {/* Il fronte della busta. */}
      <g transform={`translate(${cx} ${cy}) rotate(-90) translate(${-fw / 2} ${-fh / 2})`} data-busta-fronte>
        {/* Francobollo da colorare. */}
        <rect x={fw - mm(34)} y={mm(8)} width={mm(26)} height={mm(30)} rx={mm(1.5)} fill="#FFFFFF" stroke={NERO} strokeWidth="5" strokeDasharray="10 8" />
        <Motivo x={fw - mm(21)} y={mm(21)} lato={mm(18)} />
        <text x={fw - mm(21)} y={mm(35)} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={mm(2.6)} fontWeight="800" fill={NERO}>
          POSTA DI MIZI
        </text>

        <text x={mm(14)} y={mm(56)} fontFamily={FAMIGLIA} fontSize={mm(9)} fontWeight="900" fill="#FFFFFF" stroke={NERO} strokeWidth="5" strokeLinejoin="round" data-busta-destinatario>
          A: Babbo Natale
        </text>
        <text x={mm(14)} y={mm(70)} fontFamily={FAMIGLIA} fontSize={mm(6.5)} fontWeight="800" fill={NERO}>
          Polo Nord
        </text>
        <line x1={mm(14)} y1={mm(80)} x2={fw - mm(48)} y2={mm(80)} stroke="#B9BFCC" strokeWidth="5" strokeDasharray="2 22" strokeLinecap="round" />

        <text x={mm(14)} y={mm(97)} fontFamily={FAMIGLIA} fontSize={mm(5)} fontWeight="800" fill={NERO} data-busta-mittente>
          {`Da: ${mittente || "______________________"}`}
        </text>

        <g transform={`translate(${fw - mm(40)} ${mm(70)}) scale(${mm(30) / 100})`}>
          <g className="dc-linea dc-disegno">
            <Disegno id="pinguino" className="" lato={100} />
          </g>
        </g>
        <Motivo x={mm(10)} y={mm(10)} lato={mm(11)} ruota={-10} />
      </g>

      {/* Istruzioni sull'aletta in basso (il retro della busta). */}
      <text x={mm(105)} y={mm(236)} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={mm(3.6)} fontWeight="800" fill={NERO}>
        Ritaglia sulla linea continua, piega sui trattini
      </text>
      <text x={mm(105)} y={mm(243)} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={mm(3.6)} fontWeight="800" fill={NERO}>
        e incolla le alette laterali sotto questa.
      </text>
      <text x={mm(105)} y={mm(256)} textAnchor="middle" fontFamily={FAMIGLIA} fontSize={mm(3)} fontWeight="700" fill="#9AA1AD">
        La busta di Mizi · giocamizi.it
      </text>
    </svg>
  );
}
