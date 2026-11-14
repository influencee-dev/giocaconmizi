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
  halloween: {
    tinte: ["#F59A23", "#9B6DD6", "#1F2430"],
    motivo: (t) => (
      <>
        {/* zucca sorridente */}
        <ellipse cx="14" cy="28" rx="9" ry="7.5" fill={c(t, 0)} />
        <path d="M11 28 Q14 24 17 28 Q14 32 11 28" fill="none" stroke={c(t, 2)} strokeWidth="0" />
        <rect x="12.6" y="18.5" width="2.8" height="4" rx="1.2" fill={c(t, 1)} />
        <circle cx="10.5" cy="26.5" r="1.2" fill={c(t, 2)} />
        <circle cx="17.5" cy="26.5" r="1.2" fill={c(t, 2)} />
        <path d="M10 30.5 Q14 33.5 18 30.5" fill="none" stroke={c(t, 2)} strokeWidth="1.4" strokeLinecap="round" />
        {/* pipistrello buffo */}
        <path d="M27 10 Q30 6 33 10 Q34 7 36 9 Q38 7 39 10 Q42 6 45 10 Q42 14 36 13 Q30 14 27 10" fill={c(t, 1)} transform="translate(-8 -2) scale(0.9)" />
        {/* fantasmino */}
        <path d="M28 24 Q28 18 33 18 Q38 18 38 24 L38 32 L36 30 L34 32 L32 30 L30 32 Z" fill="#FFFFFF" opacity="0.95" />
        <circle cx="31.5" cy="23" r="1" fill={c(t, 2)} />
        <circle cx="34.5" cy="23" r="1" fill={c(t, 2)} />
      </>
    ),
  },
  natale: {
    tinte: ["#4CAF6D", "#E8474B", "#F9C846"],
    motivo: (t) => (
      <>
        {/* abete a tre balze con la stella */}
        <path d="M14 10 L20 18 L17 18 L22 25 L18.5 25 L24 33 L4 33 L9.5 25 L6 25 L11 18 L8 18 Z" fill={c(t, 0)} />
        <rect x="12" y="33" width="4" height="4" rx="1" fill="#8B5A2B" />
        <path d="M14 4 L15.3 7 L18.5 7.3 L16 9.4 L16.8 12.5 L14 10.8 L11.2 12.5 L12 9.4 L9.5 7.3 L12.7 7 Z" fill={c(t, 2)} />
        <circle cx="10" cy="27" r="1.6" fill={c(t, 1)} />
        <circle cx="18" cy="21" r="1.6" fill={c(t, 1)} />
        {/* pallina appesa */}
        <path d="M33 14 V18" stroke={c(t, 2)} strokeWidth="1.2" />
        <circle cx="33" cy="23" r="5" fill={c(t, 1)} />
        <path d="M28.5 21.5 Q33 19.5 37.5 21.5" stroke="#FFFFFF" strokeWidth="1.4" fill="none" opacity="0.8" />
        {/* fiocco di neve */}
        <g stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.95">
          <path d="M31 32 L35 40" />
          <path d="M35 32 L31 40" />
          <path d="M33 31 V41" />
          <path d="M29 36 H37" />
        </g>
      </>
    ),
  },
  /* Le cornici in più della letterina di Natale (14/11/2026): non sono temi
     del creatore di biglietti (non stanno in cards/registry.ts), solo cornici. */
  "natale-neve": {
    tinte: ["#3DB5E6", "#E8474B", "#F59A3C"],
    motivo: (t) => (
      <>
        {/* pupazzo di neve con cappello e sciarpa */}
        <circle cx="16" cy="29" r="8" fill="#FFFFFF" stroke="#BFD7E6" strokeWidth="0.8" />
        <circle cx="16" cy="17" r="5.5" fill="#FFFFFF" stroke="#BFD7E6" strokeWidth="0.8" />
        <rect x="11.5" y="6" width="9" height="6" rx="1" fill="#1F2430" />
        <rect x="9.5" y="11" width="13" height="2" rx="1" fill="#1F2430" />
        <path d="M10.5 21 Q16 24 21.5 21 L21.5 23.5 Q16 26.5 10.5 23.5 Z" fill={c(t, 1)} />
        <path d="M19 23 L21 30 L18 30 Z" fill={c(t, 1)} />
        <path d="M16 17.5 L21 18.5 L16 19.3 Z" fill={c(t, 2)} />
        <circle cx="14" cy="15.5" r="0.9" fill="#1F2430" />
        <circle cx="18" cy="15.5" r="0.9" fill="#1F2430" />
        <circle cx="16" cy="28" r="1" fill="#1F2430" />
        <circle cx="16" cy="32" r="1" fill="#1F2430" />
        {/* fiocco di neve */}
        <g stroke={c(t, 0)} strokeWidth="1.3" strokeLinecap="round">
          <path d="M33 4 V16" />
          <path d="M27.8 7 L38.2 13" />
          <path d="M38.2 7 L27.8 13" />
        </g>
        <circle cx="34" cy="31" r="1.4" fill={c(t, 0)} />
        <circle cx="29" cy="37" r="1" fill={c(t, 0)} />
      </>
    ),
  },
  "natale-regali": {
    tinte: ["#E8474B", "#4CAF6D", "#F9C846"],
    motivo: (t) => (
      <>
        {/* pacco grande con fiocco */}
        <rect x="4" y="18" width="19" height="17" rx="1.5" fill={c(t, 0)} />
        <rect x="2.5" y="14" width="22" height="5" rx="1.5" fill={c(t, 0)} />
        <rect x="12" y="14" width="3" height="21" fill={c(t, 2)} />
        <ellipse cx="10.5" cy="11.5" rx="3.6" ry="2.4" fill={c(t, 2)} transform="rotate(-25 10.5 11.5)" />
        <ellipse cx="16.5" cy="11.5" rx="3.6" ry="2.4" fill={c(t, 2)} transform="rotate(25 16.5 11.5)" />
        <circle cx="13.5" cy="13.3" r="1.6" fill={c(t, 2)} />
        {/* pacco piccolo */}
        <rect x="26" y="25" width="11" height="10" rx="1.2" fill={c(t, 1)} />
        <rect x="30.7" y="25" width="1.8" height="10" fill={c(t, 2)} />
        <rect x="26" y="29.2" width="11" height="1.8" fill={c(t, 2)} />
        {/* stellina */}
        <path d="M33 5 L34.3 8.2 L37.6 8.4 L35 10.5 L35.9 13.8 L33 12 L30.1 13.8 L31 10.5 L28.4 8.4 L31.7 8.2 Z" fill={c(t, 2)} />
      </>
    ),
  },
  "natale-dolci": {
    tinte: ["#C8874A", "#E8474B", "#F9C846"],
    motivo: (t) => (
      <>
        {/* omino di pan di zenzero */}
        <circle cx="13" cy="10" r="5" fill={c(t, 0)} />
        <path d="M8 16 H18 L24 19.5 Q26 22 23.5 23.3 L19 21.3 L19.5 28.5 L23.5 34.5 Q24 37.5 21 37 L15.5 31 H10.5 L5 37 Q2 37.5 2.5 34.5 L6.5 28.5 L7 21.3 L2.5 23.3 Q0 22 2 19.5 Z" fill={c(t, 0)} />
        <circle cx="11.2" cy="9.3" r="0.9" fill="#FFFFFF" />
        <circle cx="14.8" cy="9.3" r="0.9" fill="#FFFFFF" />
        <path d="M10.8 12 Q13 13.6 15.2 12" stroke="#FFFFFF" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <circle cx="13" cy="20" r="1.1" fill={c(t, 1)} />
        <circle cx="13" cy="24.5" r="1.1" fill={c(t, 1)} />
        {/* lecca-lecca */}
        <rect x="30.4" y="19" width="1.6" height="16" rx="0.8" fill="#E9DCC5" />
        <circle cx="31.2" cy="13" r="6.5" fill={c(t, 1)} />
        <path d="M31.2 13 m-3.6 0 a3.6 3.6 0 1 1 3.6 3.6 a2.2 2.2 0 1 1 -2.2 -2.2" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
      </>
    ),
  },
  "natale-renne": {
    tinte: ["#8B5A2B", "#4CAF6D", "#F9C846"],
    motivo: (t) => (
      <>
        {/* renna vista di fronte (naso scuro: niente renne famose) */}
        <path d="M12 12 Q10 6 6 4 M10.5 8.5 Q7 8.8 5 7.5 M24 12 Q26 6 30 4 M25.5 8.5 Q29 8.8 31 7.5" stroke={c(t, 0)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="10" cy="17" rx="3.5" ry="2" fill={c(t, 0)} transform="rotate(-25 10 17)" />
        <ellipse cx="26" cy="17" rx="3.5" ry="2" fill={c(t, 0)} transform="rotate(25 26 17)" />
        <path d="M18 12 Q26 12 26 21 Q26 30 21 34 Q18 36 15 34 Q10 30 10 21 Q10 12 18 12 Z" fill={c(t, 0)} />
        <ellipse cx="18" cy="31" rx="5" ry="3.6" fill="#E9C9A0" />
        <ellipse cx="18" cy="29.6" rx="2.2" ry="1.5" fill="#1F2430" />
        <circle cx="15" cy="21" r="1.2" fill="#1F2430" />
        <circle cx="21" cy="21" r="1.2" fill="#1F2430" />
        {/* campanella e stellina */}
        <circle cx="18" cy="37.5" r="2" fill={c(t, 2)} />
        <path d="M34 22 L35.1 24.7 L38 24.9 L35.8 26.7 L36.5 29.5 L34 28 L31.5 29.5 L32.2 26.7 L30 24.9 L32.9 24.7 Z" fill={c(t, 2)} />
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
