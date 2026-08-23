/**
 * I motivi decorativi dei biglietti: uno per tema, disegnati in SVG.
 *
 * Perché SVG e non le PNG previste dal piano §14.4: gli sfondi vettoriali
 * pesano pochi kilobyte in totale invece di decine di megabyte, si adattano a
 * qualsiasi formato (A6, A5, story, quadrato) senza sgranare e non hanno
 * nessun problema di licenza. Quando arriveranno le illustrazioni vere basterà
 * sostituire questo file: il resto del tool non cambia.
 *
 * Nessun motivo richiama personaggi protetti, come prescrive il piano:
 * "supereroi" non è Spiderman, "mondo a cubetti" non è Minecraft.
 *
 * Ogni motivo vive in un riquadro 0 0 40 40.
 */

import type { ReactNode } from "react";

export interface Tema {
  /** Due o tre tinte: la prima domina. */
  tinte: [string, string, string];
  motivo: (c: [string, string, string]) => ReactNode;
}

const c = (t: [string, string, string], i: 0 | 1 | 2) => t[i];

export const MOTIVI: Record<string, Tema> = {
  unicorno: {
    tinte: ["#F28AB2", "#9B6DD6", "#F9C846"],
    motivo: (t) => (
      <>
        {/* muso, collo e criniera: a questa scala serve una sagoma leggibile */}
        <path d="M8 34 Q8 20 18 16 L14 10 L22 13 Q30 15 30 24 Q30 32 26 36 Z" fill="#FFFFFF" stroke={c(t, 0)} strokeWidth="1.6" />
        <path d="M18 16 L20 4 L25 13 Z" fill={c(t, 2)} />
        <path d="M22 13 Q30 12 32 20 Q28 18 26 22 Q30 24 28 30" fill="none" stroke={c(t, 1)} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="15" cy="24" r="1.5" fill="#1F2430" />
        <ellipse cx="9.5" cy="30" rx="1.6" ry="1.1" fill={c(t, 0)} />
      </>
    ),
  },
  dinosauri: {
    tinte: ["#4CAF6D", "#F59A23", "#3DB5E6"],
    motivo: (t) => (
      <>
        <path d="M6 30 Q10 18 20 18 Q28 18 32 12 L34 20 Q30 30 20 30 Z" fill={c(t, 0)} />
        <path d="M14 18 L17 12 L20 18 L23 12 L26 18 Z" fill={c(t, 1)} />
        <circle cx="29" cy="17" r="1.4" fill="#1F2430" />
      </>
    ),
  },
  calcio: {
    tinte: ["#FFFFFF", "#1F2430", "#4CAF6D"],
    motivo: (t) => (
      <>
        <circle cx="20" cy="20" r="13" fill={c(t, 0)} stroke={c(t, 1)} strokeWidth="1.5" />
        <path d="M20 12 L26 17 L24 25 L16 25 L14 17 Z" fill={c(t, 1)} />
      </>
    ),
  },
  principessa: {
    tinte: ["#F28AB2", "#F9C846", "#FFFFFF"],
    motivo: (t) => (
      <>
        <path d="M8 28 L10 14 L16 20 L20 10 L24 20 L30 14 L32 28 Z" fill={c(t, 1)} />
        <circle cx="14" cy="24" r="1.8" fill={c(t, 0)} />
        <circle cx="20" cy="24" r="1.8" fill={c(t, 0)} />
        <circle cx="26" cy="24" r="1.8" fill={c(t, 0)} />
      </>
    ),
  },
  supereroe: {
    tinte: ["#E8474B", "#3DB5E6", "#F9C846"],
    motivo: (t) => (
      <>
        <path d="M20 6 L32 12 V22 Q32 32 20 36 Q8 32 8 22 V12 Z" fill={c(t, 0)} />
        <path d="M20 12 L23 19 H30 L24 23 L26 31 L20 26 L14 31 L16 23 L10 19 H17 Z" fill={c(t, 2)} />
      </>
    ),
  },
  spazio: {
    tinte: ["#3DB5E6", "#9B6DD6", "#F9C846"],
    motivo: (t) => (
      <>
        <path d="M20 4 Q28 16 28 26 H12 Q12 16 20 4 Z" fill="#FFFFFF" stroke={c(t, 0)} strokeWidth="1.5" />
        <circle cx="20" cy="16" r="3.5" fill={c(t, 0)} />
        <path d="M12 22 L6 32 L12 29 Z" fill={c(t, 1)} />
        <path d="M28 22 L34 32 L28 29 Z" fill={c(t, 1)} />
        <path d="M16 27 Q20 38 24 27 Z" fill={c(t, 2)} />
      </>
    ),
  },
  "animali-foresta": {
    tinte: ["#F59A23", "#4CAF6D", "#9B6B4A"],
    motivo: (t) => (
      <>
        <path d="M10 26 L14 10 L20 20 L26 10 L30 26 Z" fill={c(t, 0)} />
        <circle cx="20" cy="26" r="8" fill={c(t, 0)} />
        <circle cx="17" cy="25" r="1.5" fill="#1F2430" />
        <circle cx="23" cy="25" r="1.5" fill="#1F2430" />
        <path d="M18 30 L22 30 L20 33 Z" fill="#1F2430" />
      </>
    ),
  },
  fattoria: {
    tinte: ["#E8474B", "#F9C846", "#4CAF6D"],
    motivo: (t) => (
      <>
        <rect x="10" y="18" width="20" height="16" fill={c(t, 0)} />
        <path d="M7 18 L20 7 L33 18 Z" fill={c(t, 1)} />
        <rect x="17" y="25" width="6" height="9" fill="#7A5238" />
      </>
    ),
  },
  sirena: {
    tinte: ["#3DB5E6", "#F28AB2", "#9B6DD6"],
    motivo: (t) => (
      <>
        <path d="M20 6 Q30 14 26 24 Q22 32 20 36 Q18 32 14 24 Q10 14 20 6 Z" fill={c(t, 0)} />
        <path d="M14 34 Q20 28 26 34 Q20 32 14 34 Z" fill={c(t, 1)} />
        <path d="M20 12 Q24 18 20 24 Q16 18 20 12 Z" fill="#FFFFFF" opacity="0.5" />
      </>
    ),
  },
  pirati: {
    tinte: ["#1F2430", "#E8474B", "#F9C846"],
    motivo: (t) => (
      <>
        <path d="M8 26 H32 L28 34 H12 Z" fill="#7A5238" />
        <rect x="19" y="6" width="2" height="20" fill={c(t, 0)} />
        <path d="M21 8 L32 16 L21 20 Z" fill={c(t, 1)} />
      </>
    ),
  },
  "mondo-a-cubetti": {
    tinte: ["#4CAF6D", "#9B6B4A", "#3DB5E6"],
    motivo: (t) => (
      <>
        <rect x="8" y="18" width="12" height="12" fill={c(t, 0)} />
        <rect x="20" y="18" width="12" height="12" fill={c(t, 1)} />
        <rect x="14" y="6" width="12" height="12" fill={c(t, 2)} />
      </>
    ),
  },
  macchinine: {
    tinte: ["#E8474B", "#3DB5E6", "#1F2430"],
    motivo: (t) => (
      <>
        <rect x="6" y="20" width="28" height="9" rx="3" fill={c(t, 0)} />
        <path d="M12 20 L16 12 H26 L30 20 Z" fill={c(t, 1)} />
        <circle cx="13" cy="30" r="4" fill={c(t, 2)} />
        <circle cx="27" cy="30" r="4" fill={c(t, 2)} />
      </>
    ),
  },
  cuccioli: {
    tinte: ["#9B6B4A", "#F28AB2", "#FFFFFF"],
    motivo: (t) => (
      <>
        <circle cx="20" cy="24" r="9" fill={c(t, 0)} />
        <ellipse cx="10" cy="18" rx="4" ry="7" fill={c(t, 0)} />
        <ellipse cx="30" cy="18" rx="4" ry="7" fill={c(t, 0)} />
        <circle cx="17" cy="22" r="1.5" fill="#1F2430" />
        <circle cx="23" cy="22" r="1.5" fill="#1F2430" />
        <ellipse cx="20" cy="27" rx="3" ry="2" fill={c(t, 1)} />
      </>
    ),
  },
  "farfalle-fiori": {
    tinte: ["#F28AB2", "#9B6DD6", "#F9C846"],
    motivo: (t) => (
      <>
        <ellipse cx="12" cy="16" rx="8" ry="10" fill={c(t, 0)} transform="rotate(-20 12 16)" />
        <ellipse cx="28" cy="16" rx="8" ry="10" fill={c(t, 1)} transform="rotate(20 28 16)" />
        <ellipse cx="14" cy="28" rx="6" ry="7" fill={c(t, 0)} />
        <ellipse cx="26" cy="28" rx="6" ry="7" fill={c(t, 1)} />
        <rect x="19" y="10" width="2" height="24" rx="1" fill="#1F2430" />
      </>
    ),
  },
  arcobaleno: {
    tinte: ["#E8474B", "#F9C846", "#3DB5E6"],
    motivo: (t) => (
      <>
        <path d="M4 32 A16 16 0 0 1 36 32" fill="none" stroke={c(t, 0)} strokeWidth="4" />
        <path d="M9 32 A11 11 0 0 1 31 32" fill="none" stroke={c(t, 1)} strokeWidth="4" />
        <path d="M14 32 A6 6 0 0 1 26 32" fill="none" stroke={c(t, 2)} strokeWidth="4" />
      </>
    ),
  },
  circo: {
    tinte: ["#E8474B", "#F9C846", "#3DB5E6"],
    motivo: (t) => (
      <>
        <path d="M6 32 L20 8 L34 32 Z" fill={c(t, 1)} />
        <path d="M20 8 L27 32 H20 Z" fill={c(t, 0)} />
        <path d="M13 32 L20 8 V32 Z" fill={c(t, 0)} opacity="0.6" />
        <circle cx="20" cy="6" r="2.5" fill={c(t, 2)} />
      </>
    ),
  },
  safari: {
    tinte: ["#F9C846", "#F59A23", "#4CAF6D"],
    motivo: (t) => (
      <>
        <circle cx="20" cy="22" r="10" fill={c(t, 1)} />
        <circle cx="20" cy="22" r="14" fill="none" stroke={c(t, 0)} strokeWidth="3" strokeDasharray="4 3" />
        <circle cx="16" cy="20" r="1.6" fill="#1F2430" />
        <circle cx="24" cy="20" r="1.6" fill="#1F2430" />
        <path d="M16 26 Q20 30 24 26" stroke="#1F2430" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  "mare-estate": {
    tinte: ["#3DB5E6", "#F9C846", "#FFFFFF"],
    motivo: (t) => (
      <>
        <circle cx="28" cy="12" r="6" fill={c(t, 1)} />
        <path d="M2 24 Q10 18 18 24 Q26 30 38 24" stroke={c(t, 0)} strokeWidth="3" fill="none" />
        <path d="M2 31 Q10 25 18 31 Q26 37 38 31" stroke={c(t, 0)} strokeWidth="3" fill="none" opacity="0.6" />
      </>
    ),
  },
  "dolci-torta": {
    tinte: ["#F28AB2", "#F9C846", "#FFFFFF"],
    motivo: (t) => (
      <>
        <path d="M10 20 H30 L27 34 H13 Z" fill={c(t, 0)} />
        <path d="M9 18 Q14 12 20 18 Q26 12 31 18 Z" fill={c(t, 2)} />
        <rect x="19" y="6" width="2" height="7" fill={c(t, 1)} />
        <ellipse cx="20" cy="5" rx="2" ry="3" fill="#F59A23" />
      </>
    ),
  },
  palloncini: {
    tinte: ["#E8474B", "#3DB5E6", "#F9C846"],
    motivo: (t) => (
      <>
        <ellipse cx="13" cy="14" rx="7" ry="9" fill={c(t, 0)} />
        <ellipse cx="27" cy="17" rx="6" ry="8" fill={c(t, 1)} />
        <path d="M13 23 Q15 30 12 36" stroke="#1F2430" strokeWidth="1" fill="none" />
        <path d="M27 25 Q25 31 28 36" stroke="#1F2430" strokeWidth="1" fill="none" />
      </>
    ),
  },
  robot: {
    tinte: ["#3DB5E6", "#B9C0CC", "#F9C846"],
    motivo: (t) => (
      <>
        <rect x="10" y="12" width="20" height="18" rx="4" fill={c(t, 0)} />
        <circle cx="16" cy="20" r="2.5" fill="#FFFFFF" />
        <circle cx="24" cy="20" r="2.5" fill="#FFFFFF" />
        <rect x="16" y="25" width="8" height="2" rx="1" fill="#FFFFFF" />
        <rect x="19" y="6" width="2" height="6" fill={c(t, 1)} />
        <circle cx="20" cy="5" r="2" fill={c(t, 2)} />
      </>
    ),
  },
  fate: {
    tinte: ["#9B6DD6", "#F28AB2", "#F9C846"],
    motivo: (t) => (
      <>
        <path d="M20 6 L23 15 L32 15 L25 21 L28 30 L20 24 L12 30 L15 21 L8 15 L17 15 Z" fill={c(t, 2)} />
        <rect x="19" y="24" width="2" height="12" rx="1" fill={c(t, 0)} />
        <circle cx="10" cy="10" r="1.5" fill={c(t, 1)} />
        <circle cx="31" cy="26" r="1.5" fill={c(t, 1)} />
      </>
    ),
  },
  ballerina: {
    tinte: ["#F28AB2", "#9B6DD6", "#FFFFFF"],
    motivo: (t) => (
      <>
        <circle cx="20" cy="10" r="4" fill={c(t, 1)} />
        <path d="M20 14 L20 24" stroke={c(t, 1)} strokeWidth="3" strokeLinecap="round" />
        <path d="M8 26 Q20 18 32 26 Q20 32 8 26 Z" fill={c(t, 0)} />
        <path d="M17 30 L14 36 M23 30 L26 36" stroke={c(t, 1)} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  mattoncini: {
    tinte: ["#E8474B", "#F9C846", "#3DB5E6"],
    motivo: (t) => (
      <>
        <rect x="6" y="16" width="16" height="9" rx="1.5" fill={c(t, 0)} />
        <circle cx="10" cy="15" r="2.5" fill={c(t, 0)} />
        <circle cx="18" cy="15" r="2.5" fill={c(t, 0)} />
        <rect x="16" y="25" width="16" height="9" rx="1.5" fill={c(t, 2)} />
        <circle cx="20" cy="24" r="2.5" fill={c(t, 2)} />
        <circle cx="28" cy="24" r="2.5" fill={c(t, 2)} />
      </>
    ),
  },
  "stelle-luna": {
    tinte: ["#F9C846", "#9B6DD6", "#FFFFFF"],
    motivo: (t) => (
      <>
        <path d="M26 6 A13 13 0 1 0 26 32 A10 10 0 1 1 26 6 Z" fill={c(t, 0)} />
        <path d="M10 8 L11.5 12 L15.5 12 L12 14.5 L13.5 19 L10 16 L6.5 19 L8 14.5 L5 12 L8.5 12 Z" fill={c(t, 2)} />
      </>
    ),
  },
};
