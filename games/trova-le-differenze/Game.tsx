"use client";

import { Differenze, type Scena } from "@/games/_engine/Differenze";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Trova le differenze (5–8 anni).
 * Due scene quasi uguali, disegnate in SVG. Le differenze sono aggiunte o
 * sostituzioni ben visibili: l'obiettivo è l'attenzione, non l'acutezza visiva.
 */

const SCENE: Scena[] = [
  {
    // Un prato con l'albero
    sfondo: (
      <>
        <rect x="0" y="0" width="100" height="60" fill="#DFF1FB" />
        <rect x="0" y="44" width="100" height="16" fill="#B9E3B0" />
        <rect x="30" y="28" width="5" height="18" fill="#7A5238" />
        <circle cx="32.5" cy="24" r="12" fill="#4CAF6D" />
        <rect x="62" y="30" width="20" height="16" fill="#F9C846" />
        <path d="M60 30 L72 20 L84 30 Z" fill="#E8474B" />
      </>
    ),
    differenze: [
      { id: "sole", x: 88, y: 12, disegno: <circle cx="88" cy="12" r="7" fill="#F9C846" /> },
      { id: "porta", x: 72, y: 40, disegno: <rect x="68" y="36" width="8" height="10" fill="#7A5238" /> },
      { id: "fiore", x: 15, y: 48, disegno: <circle cx="15" cy="48" r="3" fill="#F28AB2" /> },
      { id: "nuvola", x: 22, y: 12, disegno: <ellipse cx="22" cy="12" rx="10" ry="5" fill="#FFFFFF" /> },
      { id: "uccello", x: 52, y: 14, disegno: <path d="M48 14 Q52 10 56 14" stroke="#1F2430" strokeWidth="1.5" fill="none" /> },
    ],
  },
  {
    // Il mare
    sfondo: (
      <>
        <rect x="0" y="0" width="100" height="30" fill="#DFF1FB" />
        <rect x="0" y="30" width="100" height="30" fill="#8FD3F0" />
        <path d="M42 8 L42 30 L62 30 L62 22 Z" fill="#FFFFFF" stroke="#B9C0CC" strokeWidth="1" />
        <rect x="40" y="6" width="2" height="26" fill="#7A5238" />
      </>
    ),
    differenze: [
      { id: "pesce", x: 20, y: 44, disegno: <ellipse cx="20" cy="44" rx="6" ry="4" fill="#F59A23" /> },
      { id: "gabbiano", x: 76, y: 12, disegno: <path d="M70 12 Q76 7 82 12" stroke="#1F2430" strokeWidth="1.5" fill="none" /> },
      { id: "isola", x: 88, y: 32, disegno: <ellipse cx="88" cy="32" rx="9" ry="3.5" fill="#F0DDA0" /> },
      { id: "onda", x: 34, y: 50, disegno: <path d="M26 50 Q30 46 34 50 Q38 54 42 50" stroke="#FFFFFF" strokeWidth="1.5" fill="none" /> },
      { id: "nuvoletta", x: 14, y: 10, disegno: <ellipse cx="14" cy="10" rx="8" ry="4" fill="#FFFFFF" /> },
    ],
  },
  {
    // La cameretta
    sfondo: (
      <>
        <rect x="0" y="0" width="100" height="60" fill="#FDF3E2" />
        <rect x="0" y="46" width="100" height="14" fill="#E4CBA8" />
        <rect x="10" y="24" width="30" height="22" rx="2" fill="#9B6DD6" />
        <rect x="14" y="28" width="22" height="6" fill="#FFFFFF" />
        <rect x="62" y="18" width="26" height="28" rx="2" fill="#3DB5E6" />
      </>
    ),
    differenze: [
      { id: "lampada", x: 52, y: 12, disegno: <path d="M46 16 L58 16 L52 8 Z" fill="#F9C846" /> },
      { id: "palla", x: 50, y: 42, disegno: <circle cx="50" cy="42" r="5" fill="#F28AB2" /> },
      { id: "quadro", x: 50, y: 22, disegno: <rect x="44" y="18" width="12" height="9" fill="#4CAF6D" /> },
      { id: "tappeto", x: 26, y: 52, disegno: <ellipse cx="26" cy="52" rx="14" ry="4" fill="#E8474B" /> },
      { id: "libro", x: 74, y: 40, disegno: <rect x="70" y="37" width="9" height="6" fill="#F59A23" /> },
    ],
  },
  {
    // Il cielo di notte
    sfondo: (
      <>
        <rect x="0" y="0" width="100" height="60" fill="#2A3352" />
        <rect x="0" y="48" width="100" height="12" fill="#1F2430" />
        <circle cx="78" cy="14" r="8" fill="#F9C846" />
        <path d="M20 48 L32 30 L44 48 Z" fill="#3C4664" />
      </>
    ),
    differenze: [
      { id: "stella1", x: 14, y: 14, disegno: <circle cx="14" cy="14" r="1.8" fill="#FFFFFF" /> },
      { id: "stella2", x: 48, y: 10, disegno: <circle cx="48" cy="10" r="1.8" fill="#FFFFFF" /> },
      { id: "stella3", x: 60, y: 28, disegno: <circle cx="60" cy="28" r="1.8" fill="#FFFFFF" /> },
      { id: "razzo", x: 88, y: 40, disegno: <path d="M88 34 Q92 40 88 46 Q84 40 88 34 Z" fill="#E8474B" /> },
      { id: "montagna", x: 66, y: 46, disegno: <path d="M56 48 L66 34 L76 48 Z" fill="#3C4664" /> },
    ],
  },
];

export default function Game(props: GameProps) {
  return <Differenze titolo="Trova le differenze" scene={SCENE} {...props} />;
}
