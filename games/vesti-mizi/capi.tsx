/**
 * Il guardaroba di Mizi: ogni capo è un disegno SVG nelle coordinate della
 * foto ufficiale public/mizi/mizi-intera.webp (442 × 560 px). Le misure sono
 * prese sulla foto: occhi a (162, 210) e (287, 197), becco a (230, 236),
 * guance a (146, 252) e (323, 232), sciarpa tra y 268 e 336, punte delle ali a
 * (10, 300) e (430, 268), piedi tra y 510 e 560.
 */

export type Zona = "testa" | "occhi" | "collo" | "corpo" | "ali" | "piedi" | "trucchi";

export interface Capo {
  id: string;
  nome: string;
  zona: Zona;
  /** Riquadro della miniatura nel guardaroba (viewBox). */
  box: string;
  disegno: React.ReactNode;
}

export const ZONE: { id: Zona; nome: string }[] = [
  { id: "testa", nome: "Testa" },
  { id: "occhi", nome: "Occhi" },
  { id: "collo", nome: "Collo" },
  { id: "corpo", nome: "Pancia" },
  { id: "ali", nome: "Ali" },
  { id: "piedi", nome: "Piedi" },
  { id: "trucchi", nome: "Trucchi" },
];

const C = { rosa: "#F28AB2", viola: "#9B6DD6", giallo: "#F9C846", oro: "#E9B32A", azzurro: "#3DB5E6", verde: "#4CAF6D", arancione: "#F59A23", notte: "#1F2430", rosso: "#EF5350", bianco: "#FFFFFF" };
const tratto = { stroke: "#1F2430", strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function stella(cx: number, cy: number, r: number, fill: string) {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return <polygon points={p.join(" ")} fill={fill} stroke="#B8860B" strokeWidth={2} strokeLinejoin="round" />;
}
function cuore(cx: number, cy: number, s: number, fill: string) {
  return <path d={`M${cx} ${cy + s * 0.9} C${cx - s * 1.6} ${cy - s * 0.1} ${cx - s * 0.7} ${cy - s * 1.2} ${cx} ${cy - s * 0.35} C${cx + s * 0.7} ${cy - s * 1.2} ${cx + s * 1.6} ${cy - s * 0.1} ${cx} ${cy + s * 0.9} Z`} fill={fill} />;
}
function brillo(cx: number, cy: number, r: number) {
  return <path d={`M${cx} ${cy - r} Q${cx + r * 0.2} ${cy - r * 0.2} ${cx + r} ${cy} Q${cx + r * 0.2} ${cy + r * 0.2} ${cx} ${cy + r} Q${cx - r * 0.2} ${cy + r * 0.2} ${cx - r} ${cy} Q${cx - r * 0.2} ${cy - r * 0.2} ${cx} ${cy - r} Z`} fill="#FFE27A" stroke="#E9B32A" strokeWidth={1.5} />;
}

export const CAPI: Capo[] = [
  // ---------- Testa ----------
  {
    id: "paglia", nome: "Cappello di paglia", zona: "testa", box: "10 10 422 130",
    disegno: (
      <g>
        <ellipse cx={221} cy={98} rx={198} ry={36} fill="#EFCB6E" {...tratto} />
        <path d="M122 98 C118 26 324 26 320 98 Z" fill="#F5D987" {...tratto} />
        <path d="M121 80 C170 92 272 92 321 80 L321 97 C272 109 170 109 121 97 Z" fill={C.rosa} />
        <circle cx={300} cy={86} r={13} fill={C.bianco} {...tratto} strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "lana", nome: "Berretto di lana", zona: "testa", box: "60 -10 322 190",
    disegno: (
      <g>
        <path d="M84 156 C66 34 376 34 358 156 Z" fill={C.azzurro} {...tratto} />
        <path d="M78 142 C150 118 292 118 364 142 L368 180 C292 156 150 156 74 180 Z" fill="#2A8FC0" {...tratto} />
        {[110, 150, 190, 230, 270, 310].map((x) => (
          <line key={x} x1={x} y1={136} x2={x} y2={168} stroke="#1E6E96" strokeWidth={4} />
        ))}
        <circle cx={221} cy={40} r={32} fill={C.bianco} {...tratto} />
      </g>
    ),
  },
  {
    id: "corona", nome: "Corona", zona: "testa", box: "100 0 242 130",
    disegno: (
      <g>
        <path d="M136 108 L118 32 L172 72 L221 14 L270 72 L324 32 L306 108 Z" fill={C.giallo} stroke="#C8901A" strokeWidth={5} strokeLinejoin="round" />
        <circle cx={221} cy={86} r={11} fill={C.rosso} />
        <circle cx={172} cy={94} r={9} fill={C.azzurro} />
        <circle cx={270} cy={94} r={9} fill={C.verde} />
        {[[118, 30], [221, 12], [324, 30]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={9} fill={C.bianco} stroke="#C8901A" strokeWidth={3} />
        ))}
      </g>
    ),
  },
  {
    id: "festa", nome: "Cappello da festa", zona: "testa", box: "150 -80 170 200",
    disegno: (
      <g>
        <path d="M176 104 L244 -40 L292 98 Z" fill={C.viola} {...tratto} />
        <path d="M200 52 L270 34 M188 78 L282 66 M222 6 L258 0" stroke={C.giallo} strokeWidth={10} strokeLinecap="round" />
        <path d="M172 104 Q234 116 296 98" fill="none" stroke={C.rosa} strokeWidth={10} strokeLinecap="round" />
        <circle cx={244} cy={-44} r={18} fill={C.giallo} {...tratto} />
      </g>
    ),
  },
  // ---------- Occhi ----------
  {
    id: "sole", nome: "Occhiali da sole", zona: "occhi", box: "70 140 310 120",
    disegno: (
      <g transform="rotate(-4 224 201)">
        <path d="M80 196 L117 200 M332 198 L372 192" stroke={C.notte} strokeWidth={7} strokeLinecap="round" />
        <rect x={115} y={172} width={94} height={68} rx={28} fill="#1F2430" opacity={0.92} stroke={C.notte} strokeWidth={6} />
        <rect x={240} y={168} width={94} height={68} rx={28} fill="#1F2430" opacity={0.92} stroke={C.notte} strokeWidth={6} />
        <path d="M209 200 Q224 188 240 198" fill="none" stroke={C.notte} strokeWidth={7} strokeLinecap="round" />
        <path d="M130 188 L150 184 M255 184 L275 180" stroke={C.bianco} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      </g>
    ),
  },
  {
    id: "cuori", nome: "Occhiali a cuore", zona: "occhi", box: "90 140 270 130",
    disegno: (
      <g>
        <path d="M162 252 C100 222 108 168 162 186 C216 168 224 222 162 252 Z" fill="rgba(242,138,178,0.35)" stroke={C.rosa} strokeWidth={9} strokeLinejoin="round" />
        <path d="M287 240 C225 210 233 156 287 174 C341 156 349 210 287 240 Z" fill="rgba(242,138,178,0.35)" stroke={C.rosa} strokeWidth={9} strokeLinejoin="round" />
        <path d="M208 200 Q224 190 241 194" fill="none" stroke={C.rosa} strokeWidth={8} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "sub", nome: "Maschera da sub", zona: "occhi", box: "60 20 360 260",
    disegno: (
      <g>
        <path d="M72 206 L112 206 M340 196 L380 196" stroke={C.notte} strokeWidth={10} strokeLinecap="round" />
        <rect x={108} y={158} width={234} height={94} rx={42} fill="rgba(61,181,230,0.28)" stroke={C.azzurro} strokeWidth={13} />
        <path d="M128 176 L160 170" stroke={C.bianco} strokeWidth={7} strokeLinecap="round" opacity={0.8} />
        <path d="M352 222 L392 222 L392 70 Q392 44 414 44" fill="none" stroke={C.arancione} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ),
  },
  // ---------- Collo ----------
  {
    id: "perle", nome: "Collana di perle", zona: "collo", box: "140 290 180 90",
    disegno: (
      <g>
        {Array.from({ length: 11 }, (_, i) => {
          const t = i / 10;
          const x = (1 - t) ** 2 * 160 + 2 * (1 - t) * t * 232 + t ** 2 * 302;
          const y = (1 - t) ** 2 * 320 + 2 * (1 - t) * t * 384 + t ** 2 * 314;
          return <circle key={i} cx={x} cy={y} r={10} fill="#FFF8F0" stroke="#C9B8A8" strokeWidth={2.5} />;
        })}
      </g>
    ),
  },
  {
    id: "papillon", nome: "Papillon", zona: "collo", box: "160 260 140 90",
    disegno: (
      <g>
        <path d="M230 304 L178 278 L178 332 Z" fill={C.viola} {...tratto} />
        <path d="M230 304 L282 278 L282 332 Z" fill={C.viola} {...tratto} />
        <rect x={218} y={290} width={24} height={28} rx={8} fill="#7B4FBF" {...tratto} />
        <circle cx={196} cy={296} r={5} fill={C.bianco} />
        <circle cx={264} cy={314} r={5} fill={C.bianco} />
      </g>
    ),
  },
  // ---------- Pancia ----------
  {
    id: "tutu", nome: "Tutù", zona: "corpo", box: "60 390 320 140",
    disegno: (
      <g>
        <path d="M86 446 Q222 398 358 446 L376 500 Q346 518 320 496 Q294 522 268 498 Q242 524 216 498 Q190 524 164 498 Q138 522 112 496 Q90 514 66 500 Z" fill="#F7A8C8" {...tratto} />
        <path d="M96 446 Q222 410 348 446 L356 470 Q222 440 88 470 Z" fill={C.rosa} />
        {[130, 180, 230, 280, 320].map((x, i) => (
          <circle key={x} cx={x} cy={478 + (i % 2) * 8} r={5} fill={C.bianco} opacity={0.9} />
        ))}
      </g>
    ),
  },
  {
    id: "salvagente", nome: "Salvagente", zona: "corpo", box: "40 380 364 150",
    disegno: (
      <g>
        <ellipse cx={222} cy={456} rx={160} ry={48} fill="none" stroke={C.notte} strokeWidth={42} />
        <ellipse cx={222} cy={456} rx={160} ry={48} fill="none" stroke={C.rosso} strokeWidth={34} />
        <ellipse cx={222} cy={456} rx={160} ry={48} fill="none" stroke={C.bianco} strokeWidth={34} strokeDasharray="46 80" />
      </g>
    ),
  },
  // ---------- Ali ----------
  {
    id: "ombrello", nome: "Ombrello", zona: "ali", box: "-85 25 180 320",
    disegno: (
      <g>
        <path d="M8 120 L8 300 Q8 324 -12 320" fill="none" stroke={C.notte} strokeWidth={8} strokeLinecap="round" />
        <path d="M-74 124 A82 82 0 0 1 90 124 Z" fill={C.azzurro} {...tratto} />
        <path d="M-74 124 Q-46 106 -19 124 Q8 106 35 124 Q62 106 90 124" fill="#2A8FC0" stroke={C.notte} strokeWidth={4} />
        <path d="M8 42 L8 124 M-32 56 Q-24 92 -19 124 M48 56 Q40 92 35 124" stroke="#1E6E96" strokeWidth={4} fill="none" />
        <circle cx={8} cy={40} r={7} fill={C.notte} />
      </g>
    ),
  },
  {
    id: "palloncino", nome: "Palloncino", zona: "ali", box: "380 0 140 290",
    disegno: (
      <g>
        <path d="M428 268 Q470 200 452 124" fill="none" stroke={C.notte} strokeWidth={3} />
        <ellipse cx={454} cy={72} rx={44} ry={54} fill={C.rosso} {...tratto} />
        <path d="M447 125 L461 125 L454 114 Z" fill={C.rosso} {...tratto} strokeWidth={3} />
        <ellipse cx={438} cy={54} rx={9} ry={16} fill={C.bianco} opacity={0.6} />
      </g>
    ),
  },
  {
    id: "secchiello", nome: "Secchiello", zona: "ali", box: "-60 260 120 130",
    disegno: (
      <g>
        <path d="M-30 320 Q2 264 34 320" fill="none" stroke={C.notte} strokeWidth={5} />
        <path d="M-38 318 L42 318 L30 380 L-26 380 Z" fill={C.giallo} {...tratto} />
        <path d="M-38 318 Q2 304 42 318" fill="#E8C468" stroke={C.notte} strokeWidth={4} />
        <path d="M-20 342 L24 342" stroke={C.arancione} strokeWidth={6} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "bacchetta", nome: "Bacchetta magica", zona: "ali", box: "400 110 120 180",
    disegno: (
      <g>
        <path d="M428 270 L476 172" stroke="#8B5E3C" strokeWidth={9} strokeLinecap="round" />
        {stella(482, 156, 32, C.giallo)}
        {brillo(450, 128, 10)}
        {brillo(508, 196, 8)}
      </g>
    ),
  },
  // ---------- Piedi ----------
  {
    id: "stivali", nome: "Stivali di gomma", zona: "piedi", box: "70 450 300 130",
    disegno: (
      <g>
        <path d="M96 470 L198 470 L204 548 Q204 562 190 562 L88 562 Q76 562 78 548 Z" fill={C.giallo} {...tratto} />
        <path d="M244 470 L346 470 L356 548 Q358 562 344 562 L242 562 Q228 562 230 548 Z" fill={C.giallo} {...tratto} />
        <path d="M94 488 L200 488 M242 488 L348 488" stroke="#E0A800" strokeWidth={8} />
      </g>
    ),
  },
  {
    id: "pinne", nome: "Pinne", zona: "piedi", box: "50 490 340 130",
    disegno: (
      <g>
        <path d="M88 506 L206 506 L232 592 Q148 612 62 592 Z" fill={C.azzurro} {...tratto} />
        <path d="M236 506 L354 506 L380 592 Q296 612 210 592 Z" fill={C.azzurro} {...tratto} />
        <path d="M120 530 L104 590 M150 530 L148 596 M180 530 L192 592 M268 530 L252 590 M298 530 L296 596 M328 530 L340 592" stroke="#1E6E96" strokeWidth={4} />
      </g>
    ),
  },
  // ---------- Trucchi (si possono mettere tutti insieme) ----------
  {
    id: "guance", nome: "Guance rosa", zona: "trucchi", box: "110 200 250 90",
    disegno: (
      <g>
        <circle cx={146} cy={252} r={26} fill={C.rosa} opacity={0.6} />
        <circle cx={323} cy={232} r={26} fill={C.rosa} opacity={0.6} />
      </g>
    ),
  },
  {
    id: "ombretto", nome: "Ombretto", zona: "trucchi", box: "110 140 230 80",
    disegno: (
      <g opacity={0.75}>
        <path d="M126 192 Q162 158 198 188" fill="none" stroke={C.viola} strokeWidth={11} strokeLinecap="round" />
        <path d="M252 180 Q287 146 322 176" fill="none" stroke={C.viola} strokeWidth={11} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "stelline", nome: "Stelline", zona: "trucchi", box: "100 220 270 80",
    disegno: (
      <g>
        {stella(124, 276, 11, C.giallo)}
        {stella(166, 270, 8, C.giallo)}
        {stella(342, 256, 11, C.giallo)}
        {stella(304, 262, 8, C.giallo)}
      </g>
    ),
  },
  {
    id: "cuoricini", nome: "Cuoricini", zona: "trucchi", box: "100 220 270 80",
    disegno: (
      <g>
        {cuore(128, 262, 11, C.rosso)}
        {cuore(162, 280, 8, C.rosa)}
        {cuore(340, 244, 11, C.rosso)}
        {cuore(306, 262, 8, C.rosa)}
      </g>
    ),
  },
  {
    id: "brillantini", nome: "Brillantini", zona: "trucchi", box: "-40 -40 520 300",
    disegno: (
      <g>
        {brillo(52, 70, 16)}
        {brillo(392, 60, 18)}
        {brillo(20, 190, 12)}
        {brillo(424, 170, 12)}
        {brillo(221, -14, 14)}
      </g>
    ),
  },
];

export const capo = (id: string) => CAPI.find((c) => c.id === id)!;

/** Ordine di disegno: dal corpo verso la testa, i trucchi sotto agli occhiali. */
export const ORDINE: Zona[] = ["piedi", "corpo", "collo", "trucchi", "occhi", "testa", "ali"];
