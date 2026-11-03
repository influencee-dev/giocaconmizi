/**
 * I disegni da colorare (originali, viewBox 0 0 400 400). Ogni «parte» è una
 * zona chiusa che il secchiello riempie; sono in ordine di disegno (quelle
 * dopo stanno sopra). I «dettagli» sono solo tratto o pieni neri (pupille,
 * bocca) e non si colorano.
 */

export type Forma =
  | { t: "rect"; x: number; y: number; w: number; h: number; r?: number }
  | { t: "circle"; cx: number; cy: number; r: number }
  | { t: "ellipse"; cx: number; cy: number; rx: number; ry: number; rot?: number }
  | { t: "path"; d: string };

export interface Parte {
  id: string;
  forma: Forma;
}

export interface Disegno {
  id: string;
  nome: string;
  istruzione: string;
  parti: Parte[];
  dettagli?: { forma: Forma; pieno?: boolean }[];
}

const sfondo: Parte = { id: "sfondo", forma: { t: "rect", x: 4, y: 4, w: 392, h: 392, r: 24 } };

export const DISEGNI: Disegno[] = [
  {
    id: "mizi",
    nome: "Mizi",
    istruzione: "Coloriamo Mizi! Scegli un colore e tocca una parte del disegno, oppure disegna con il dito.",
    parti: [
      sfondo,
      { id: "ala-sx", forma: { t: "ellipse", cx: 92, cy: 238, rx: 26, ry: 72, rot: 28 } },
      { id: "ala-dx", forma: { t: "ellipse", cx: 308, cy: 238, rx: 26, ry: 72, rot: -28 } },
      { id: "piede-sx", forma: { t: "ellipse", cx: 160, cy: 366, rx: 38, ry: 16 } },
      { id: "piede-dx", forma: { t: "ellipse", cx: 240, cy: 366, rx: 38, ry: 16 } },
      { id: "corpo", forma: { t: "ellipse", cx: 200, cy: 262, rx: 108, ry: 104 } },
      { id: "pancia", forma: { t: "ellipse", cx: 200, cy: 286, rx: 70, ry: 72 } },
      { id: "testa", forma: { t: "circle", cx: 200, cy: 130, r: 86 } },
      { id: "faccia", forma: { t: "path", d: "M200 104 C226 78 270 88 272 134 C274 182 236 200 200 200 C164 200 126 182 128 134 C130 88 174 78 200 104 Z" } },
      { id: "occhio-sx", forma: { t: "circle", cx: 170, cy: 134, r: 16 } },
      { id: "occhio-dx", forma: { t: "circle", cx: 230, cy: 134, r: 16 } },
      { id: "becco", forma: { t: "path", d: "M182 162 L218 162 L200 184 Z" } },
      { id: "sciarpa", forma: { t: "path", d: "M126 196 Q200 226 274 196 L280 222 Q200 254 120 222 Z" } },
      { id: "cuore", forma: { t: "path", d: "M200 330 C160 304 168 270 200 286 C232 270 240 304 200 330 Z" } },
    ],
    dettagli: [
      { forma: { t: "circle", cx: 172, cy: 136, r: 7 }, pieno: true },
      { forma: { t: "circle", cx: 232, cy: 136, r: 7 }, pieno: true },
    ],
  },
  {
    id: "torta",
    nome: "la torta di compleanno",
    istruzione: "Coloriamo la torta di compleanno, con le candeline e la ciliegia!",
    parti: [
      sfondo,
      { id: "piatto", forma: { t: "ellipse", cx: 200, cy: 340, rx: 170, ry: 30 } },
      { id: "piano-sotto", forma: { t: "rect", x: 70, y: 230, w: 260, h: 104, r: 14 } },
      { id: "crema-sotto", forma: { t: "path", d: "M70 244 Q70 226 90 226 L310 226 Q330 226 330 244 Q312 268 294 246 Q276 268 258 246 Q240 268 222 246 Q204 268 186 246 Q168 268 150 246 Q132 268 114 246 Q96 268 70 244 Z" } },
      { id: "piano-sopra", forma: { t: "rect", x: 110, y: 150, w: 180, h: 82, r: 12 } },
      { id: "crema-sopra", forma: { t: "path", d: "M110 164 Q110 146 128 146 L272 146 Q290 146 290 164 Q275 186 260 166 Q245 186 230 166 Q215 186 200 166 Q185 186 170 166 Q155 186 140 166 Q125 186 110 164 Z" } },
      { id: "candela-1", forma: { t: "rect", x: 142, y: 92, w: 18, h: 56, r: 4 } },
      { id: "candela-2", forma: { t: "rect", x: 191, y: 82, w: 18, h: 66, r: 4 } },
      { id: "candela-3", forma: { t: "rect", x: 240, y: 92, w: 18, h: 56, r: 4 } },
      { id: "fiamma-1", forma: { t: "path", d: "M151 86 C138 72 146 58 151 48 C156 58 164 72 151 86 Z" } },
      { id: "fiamma-2", forma: { t: "path", d: "M200 76 C187 62 195 48 200 38 C205 48 213 62 200 76 Z" } },
      { id: "fiamma-3", forma: { t: "path", d: "M249 86 C236 72 244 58 249 48 C254 58 262 72 249 86 Z" } },
      { id: "cuore-torta", forma: { t: "path", d: "M200 306 C168 286 174 258 200 272 C226 258 232 286 200 306 Z" } },
    ],
  },
  {
    id: "casa",
    nome: "la casa",
    istruzione: "Coloriamo la casa con il sole, l'albero e il prato!",
    parti: [
      sfondo,
      { id: "prato", forma: { t: "path", d: "M4 300 Q100 276 200 296 T396 290 L396 372 Q396 396 372 396 L28 396 Q4 396 4 372 Z" } },
      { id: "sole", forma: { t: "circle", cx: 330, cy: 70, r: 40 } },
      { id: "nuvola", forma: { t: "path", d: "M60 100 Q60 76 86 78 Q96 56 122 64 Q146 56 152 82 Q174 84 170 104 Q168 118 150 118 L76 118 Q58 118 60 100 Z" } },
      { id: "muro", forma: { t: "rect", x: 92, y: 180, w: 170, h: 136 } },
      { id: "tetto", forma: { t: "path", d: "M74 186 L177 104 L280 186 Z" } },
      { id: "porta", forma: { t: "rect", x: 158, y: 248, w: 40, h: 68, r: 18 } },
      { id: "finestra-sx", forma: { t: "rect", x: 108, y: 206, w: 38, h: 38, r: 4 } },
      { id: "finestra-dx", forma: { t: "rect", x: 210, y: 206, w: 38, h: 38, r: 4 } },
      { id: "tronco", forma: { t: "rect", x: 318, y: 236, w: 22, h: 72, r: 4 } },
      { id: "chioma", forma: { t: "circle", cx: 329, cy: 214, r: 44 } },
    ],
    dettagli: [{ forma: { t: "circle", cx: 190, cy: 284, r: 4 }, pieno: true }],
  },
  {
    id: "pesce",
    nome: "il pesce",
    istruzione: "Coloriamo il pesce in fondo al mare, con le bolle e la stella marina!",
    parti: [
      sfondo,
      { id: "sabbia", forma: { t: "path", d: "M4 320 Q120 300 200 318 T396 312 L396 372 Q396 396 372 396 L28 396 Q4 396 4 372 Z" } },
      { id: "alga", forma: { t: "path", d: "M58 330 C40 290 76 270 58 230 C46 204 70 190 66 170 C86 196 74 214 84 236 C100 274 70 290 84 330 Z" } },
      { id: "stella", forma: { t: "path", d: "M320 300 L332 326 L360 328 L338 346 L346 374 L320 358 L294 374 L302 346 L280 328 L308 326 Z" } },
      { id: "coda", forma: { t: "path", d: "M270 180 L350 128 L340 180 L350 232 Z" } },
      { id: "corpo-pesce", forma: { t: "ellipse", cx: 190, cy: 180, rx: 100, ry: 66 } },
      { id: "pinna", forma: { t: "path", d: "M170 118 Q200 76 240 124 Z" } },
      { id: "pinna-sotto", forma: { t: "path", d: "M170 240 Q196 276 226 238 Z" } },
      { id: "occhio", forma: { t: "circle", cx: 132, cy: 164, r: 16 } },
      { id: "bolla-1", forma: { t: "circle", cx: 80, cy: 110, r: 14 } },
      { id: "bolla-2", forma: { t: "circle", cx: 62, cy: 70, r: 9 } },
      { id: "bolla-3", forma: { t: "circle", cx: 92, cy: 40, r: 6 } },
    ],
    dettagli: [
      { forma: { t: "circle", cx: 134, cy: 166, r: 7 }, pieno: true },
      { forma: { t: "path", d: "M104 196 Q116 206 128 198" } },
      { forma: { t: "path", d: "M196 140 Q214 180 196 220 M226 144 Q244 180 226 216" } },
    ],
  },
  {
    id: "farfalla",
    nome: "la farfalla",
    istruzione: "Coloriamo la farfalla: le ali si possono fare di tanti colori!",
    parti: [
      sfondo,
      { id: "ala-su-sx", forma: { t: "path", d: "M196 180 C150 80 50 60 56 140 C60 196 130 204 196 190 Z" } },
      { id: "ala-su-dx", forma: { t: "path", d: "M204 180 C250 80 350 60 344 140 C340 196 270 204 204 190 Z" } },
      { id: "ala-giu-sx", forma: { t: "path", d: "M196 200 C130 206 82 240 96 290 C112 336 178 300 196 224 Z" } },
      { id: "ala-giu-dx", forma: { t: "path", d: "M204 200 C270 206 318 240 304 290 C288 336 222 300 204 224 Z" } },
      { id: "macchia-1", forma: { t: "circle", cx: 116, cy: 136, r: 24 } },
      { id: "macchia-2", forma: { t: "circle", cx: 284, cy: 136, r: 24 } },
      { id: "macchia-3", forma: { t: "circle", cx: 136, cy: 262, r: 16 } },
      { id: "macchia-4", forma: { t: "circle", cx: 264, cy: 262, r: 16 } },
      { id: "corpo-farfalla", forma: { t: "ellipse", cx: 200, cy: 210, rx: 14, ry: 76 } },
      { id: "testa-farfalla", forma: { t: "circle", cx: 200, cy: 124, r: 18 } },
    ],
    dettagli: [{ forma: { t: "path", d: "M192 110 Q176 70 156 64 M208 110 Q224 70 244 64" } }],
  },
  {
    id: "razzo",
    nome: "il razzo",
    istruzione: "Coloriamo il razzo che vola tra le stelle e la luna!",
    parti: [
      sfondo,
      { id: "luna", forma: { t: "path", d: "M96 50 A48 48 0 1 0 140 120 A38 38 0 1 1 96 50 Z" } },
      { id: "stella-1", forma: { t: "path", d: "M310 50 L318 68 L338 70 L322 82 L328 102 L310 90 L292 102 L298 82 L282 70 L302 68 Z" } },
      { id: "stella-2", forma: { t: "path", d: "M60 270 L66 284 L80 285 L69 294 L73 308 L60 300 L47 308 L51 294 L40 285 L54 284 Z" } },
      { id: "fiamma", forma: { t: "path", d: "M176 300 Q200 392 224 300 Z" } },
      { id: "pinna-sx", forma: { t: "path", d: "M162 230 L120 300 L170 290 Z" } },
      { id: "pinna-dx", forma: { t: "path", d: "M238 230 L280 300 L230 290 Z" } },
      { id: "corpo-razzo", forma: { t: "path", d: "M200 52 C250 100 250 220 236 302 L164 302 C150 220 150 100 200 52 Z" } },
      { id: "punta", forma: { t: "path", d: "M200 52 C222 72 234 96 240 120 L160 120 C166 96 178 72 200 52 Z" } },
      { id: "finestrino", forma: { t: "circle", cx: 200, cy: 180, r: 26 } },
    ],
  },
];
