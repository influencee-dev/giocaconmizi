import type { Disegno, Parte } from "@/games/colora-con-mizi/disegni";

/**
 * I disegni di «Colora il Natale» (25/11/2026), originali, viewBox 0 0 400 400,
 * stesso formato di Colora con Mizi: ogni parte è una zona chiusa che il
 * secchiello riempie, in ordine di disegno (quelle dopo stanno sopra).
 */

const sfondo: Parte = { id: "sfondo", forma: { t: "rect", x: 4, y: 4, w: 392, h: 392, r: 24 } };

export const DISEGNI_NATALE: Disegno[] = [
  {
    id: "albero-di-natale",
    nome: "l'albero di Natale",
    istruzione: "Coloriamo l'albero di Natale, con la stella, le palline e il regalo!",
    parti: [
      sfondo,
      { id: "neve", forma: { t: "ellipse", cx: 200, cy: 360, rx: 180, ry: 34 } },
      { id: "tronco", forma: { t: "rect", x: 176, y: 300, w: 48, h: 50, r: 6 } },
      { id: "piano-basso", forma: { t: "path", d: "M60 310 L200 170 L340 310 Q200 336 60 310 Z" } },
      { id: "piano-medio", forma: { t: "path", d: "M90 232 L200 110 L310 232 Q200 256 90 232 Z" } },
      { id: "piano-alto", forma: { t: "path", d: "M126 158 L200 64 L274 158 Q200 178 126 158 Z" } },
      { id: "stella", forma: { t: "path", d: "M200 14 L209 38 L234 39 L214 55 L221 79 L200 65 L179 79 L186 55 L166 39 L191 38 Z" } },
      { id: "pallina-1", forma: { t: "circle", cx: 150, cy: 284, r: 14 } },
      { id: "pallina-2", forma: { t: "circle", cx: 252, cy: 274, r: 14 } },
      { id: "pallina-3", forma: { t: "circle", cx: 200, cy: 212, r: 13 } },
      { id: "pallina-4", forma: { t: "circle", cx: 156, cy: 206, r: 12 } },
      { id: "pallina-5", forma: { t: "circle", cx: 236, cy: 146, r: 11 } },
      { id: "regalo", forma: { t: "rect", x: 262, y: 316, w: 62, h: 48, r: 4 } },
      { id: "nastro", forma: { t: "rect", x: 286, y: 316, w: 14, h: 48 } },
      { id: "fiocco", forma: { t: "path", d: "M293 316 C270 296 268 280 290 298 Q293 306 293 316 Z M293 316 C316 296 318 280 296 298 Q293 306 293 316 Z" } },
    ],
  },
  {
    id: "pupazzo-di-neve",
    nome: "il pupazzo di neve",
    istruzione: "Coloriamo il pupazzo di neve, con il cappello e la sciarpa!",
    parti: [
      sfondo,
      { id: "neve", forma: { t: "ellipse", cx: 200, cy: 362, rx: 185, ry: 32 } },
      { id: "corpo", forma: { t: "circle", cx: 200, cy: 278, r: 82 } },
      { id: "testa", forma: { t: "circle", cx: 200, cy: 152, r: 58 } },
      { id: "cappello", forma: { t: "rect", x: 158, y: 34, w: 84, h: 66, r: 8 } },
      { id: "fascia", forma: { t: "rect", x: 158, y: 78, w: 84, h: 14 } },
      { id: "falda", forma: { t: "rect", x: 138, y: 94, w: 124, h: 16, r: 6 } },
      { id: "sciarpa", forma: { t: "path", d: "M146 196 Q200 222 254 196 L258 214 Q200 242 142 214 Z" } },
      { id: "coda-sciarpa", forma: { t: "path", d: "M226 222 L248 216 L258 266 L236 270 Z" } },
      { id: "naso", forma: { t: "path", d: "M200 150 L248 162 L200 172 Z" } },
      { id: "bottone-1", forma: { t: "circle", cx: 200, cy: 262, r: 9 } },
      { id: "bottone-2", forma: { t: "circle", cx: 200, cy: 292, r: 9 } },
      { id: "bottone-3", forma: { t: "circle", cx: 200, cy: 322, r: 9 } },
    ],
    dettagli: [
      { forma: { t: "circle", cx: 180, cy: 138, r: 6 }, pieno: true },
      { forma: { t: "circle", cx: 220, cy: 138, r: 6 }, pieno: true },
      { forma: { t: "path", d: "M176 182 Q200 196 224 182" } },
      { forma: { t: "path", d: "M124 250 L70 212 M88 224 L70 232" } },
      { forma: { t: "path", d: "M276 250 L330 212 M312 224 L330 232" } },
    ],
  },
  {
    id: "mizi-natale",
    nome: "Mizi con il cappello di Natale",
    istruzione: "Coloriamo Mizi con il cappello di Natale!",
    parti: [
      sfondo,
      { id: "ala-sx", forma: { t: "ellipse", cx: 92, cy: 238, rx: 26, ry: 72, rot: 28 } },
      { id: "ala-dx", forma: { t: "ellipse", cx: 308, cy: 238, rx: 26, ry: 72, rot: -28 } },
      { id: "piede-sx", forma: { t: "ellipse", cx: 160, cy: 366, rx: 38, ry: 16 } },
      { id: "piede-dx", forma: { t: "ellipse", cx: 240, cy: 366, rx: 38, ry: 16 } },
      { id: "corpo", forma: { t: "ellipse", cx: 200, cy: 262, rx: 108, ry: 104 } },
      { id: "pancia", forma: { t: "ellipse", cx: 200, cy: 286, rx: 70, ry: 72 } },
      { id: "testa", forma: { t: "circle", cx: 200, cy: 136, r: 82 } },
      { id: "faccia", forma: { t: "path", d: "M200 112 C226 88 268 96 270 140 C272 186 236 204 200 204 C164 204 128 186 130 140 C132 96 174 88 200 112 Z" } },
      { id: "occhio-sx", forma: { t: "circle", cx: 170, cy: 142, r: 16 } },
      { id: "occhio-dx", forma: { t: "circle", cx: 230, cy: 142, r: 16 } },
      { id: "becco", forma: { t: "path", d: "M182 168 L218 168 L200 188 Z" } },
      { id: "sciarpa", forma: { t: "path", d: "M126 200 Q200 230 274 200 L280 226 Q200 258 120 226 Z" } },
      { id: "cappello", forma: { t: "path", d: "M132 84 Q150 18 248 24 Q300 30 316 70 Q276 54 268 84 Z" } },
      { id: "bordo-cappello", forma: { t: "rect", x: 118, y: 74, w: 166, h: 26, r: 13 } },
      { id: "pompon", forma: { t: "circle", cx: 318, cy: 76, r: 18 } },
    ],
    dettagli: [
      { forma: { t: "circle", cx: 172, cy: 144, r: 7 }, pieno: true },
      { forma: { t: "circle", cx: 232, cy: 144, r: 7 }, pieno: true },
    ],
  },
  {
    id: "pacchi-regalo",
    nome: "i pacchi regalo",
    istruzione: "Coloriamo i pacchi regalo e la stella di Natale!",
    parti: [
      sfondo,
      { id: "tappeto", forma: { t: "ellipse", cx: 200, cy: 350, rx: 182, ry: 28 } },
      { id: "stella", forma: { t: "path", d: "M318 56 L328 82 L356 84 L334 101 L342 128 L318 113 L294 128 L302 101 L280 84 L308 82 Z" } },
      { id: "pacco-grande", forma: { t: "rect", x: 70, y: 206, w: 150, h: 136, r: 8 } },
      { id: "nastro-grande", forma: { t: "rect", x: 136, y: 206, w: 18, h: 136 } },
      { id: "coperchio", forma: { t: "rect", x: 60, y: 186, w: 170, h: 30, r: 6 } },
      { id: "nastro-coperchio", forma: { t: "rect", x: 136, y: 186, w: 18, h: 30 } },
      { id: "fiocco-grande", forma: { t: "path", d: "M145 186 C110 168 104 138 138 154 Q146 168 145 186 Z M145 186 C180 168 186 138 152 154 Q144 168 145 186 Z" } },
      { id: "pacco-piccolo", forma: { t: "rect", x: 238, y: 254, w: 100, h: 88, r: 8 } },
      { id: "nastro-orizzontale", forma: { t: "rect", x: 238, y: 290, w: 100, h: 14 } },
      { id: "nastro-verticale", forma: { t: "rect", x: 281, y: 254, w: 14, h: 88 } },
      { id: "fiocco-piccolo", forma: { t: "path", d: "M288 254 C264 240 262 220 284 234 Q289 244 288 254 Z M288 254 C312 240 314 220 292 234 Q287 244 288 254 Z" } },
    ],
  },
];
