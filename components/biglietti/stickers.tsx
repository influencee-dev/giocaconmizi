import type { ReactNode } from "react";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";

/**
 * Adesivi per i biglietti: arte originale in stile cartone animato.
 *
 * NIENTE personaggi con copyright (Peppa, Paw Patrol, Disney…): sono coperti
 * da marchio anche "trovati sul web", e un biglietto stampato li distribuisce.
 * Qui tutto è disegnato in casa: unicorni, dinosauri e supereroi GENERICI
 * danno alle mamme lo stesso effetto senza esporre nessuno a rischi.
 *
 * Ogni adesivo vive in un viewBox 0 0 100 100 e viene posizionato dal
 * biglietto con translate/scale. Nessun "use client": serve anche alle
 * pagine SEO statiche.
 */

export interface StickerSulBiglietto {
  /** id dal CATALOGO_STICKER */
  id: string;
  /** Posizione del centro, in percentuale della larghezza/altezza (0–100). */
  x: number;
  y: number;
  /** Scala: 1 = un decimo dell'altezza del biglietto. */
  s: number;
}

/* ---- Adesivi disegnati apposta ---- */

const Unicorno = (
  <g>
    <ellipse cx="52" cy="62" rx="30" ry="24" fill="#FFFFFF" stroke="#E8D5F5" strokeWidth="2" />
    <circle cx="70" cy="42" r="16" fill="#FFFFFF" stroke="#E8D5F5" strokeWidth="2" />
    <path d="M76 28 L82 8 L86 28 Z" fill="#F9C846" />
    <path d="M60 30 Q48 20 52 38 Q42 30 46 44 Q36 40 42 52" stroke="#F28AB2" strokeWidth="6" fill="none" strokeLinecap="round" />
    <circle cx="74" cy="42" r="3" fill="#1F2430" />
    <circle cx="84" cy="47" r="4" fill="#F8BBD0" opacity="0.8" />
    <rect x="34" y="80" width="7" height="12" rx="3" fill="#FFFFFF" stroke="#E8D5F5" strokeWidth="2" />
    <rect x="60" y="80" width="7" height="12" rx="3" fill="#FFFFFF" stroke="#E8D5F5" strokeWidth="2" />
    <path d="M26 62 Q14 66 20 78 Q10 78 16 88" stroke="#9B6DD6" strokeWidth="6" fill="none" strokeLinecap="round" />
  </g>
);

const Dinosauro = (
  <g>
    <ellipse cx="48" cy="62" rx="28" ry="22" fill="#7ED6A5" />
    <circle cx="74" cy="40" r="14" fill="#7ED6A5" />
    <circle cx="78" cy="37" r="3" fill="#1F2430" />
    <path d="M80 46 Q86 48 84 52" stroke="#1F2430" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M30 44 L36 32 L42 46 L48 32 L54 46" fill="#4CAF6D" />
    <rect x="34" y="78" width="9" height="14" rx="4" fill="#7ED6A5" />
    <rect x="54" y="78" width="9" height="14" rx="4" fill="#7ED6A5" />
    <path d="M22 66 Q8 70 12 82" stroke="#7ED6A5" strokeWidth="9" fill="none" strokeLinecap="round" />
    <circle cx="56" cy="60" r="3.5" fill="#4CAF6D" />
    <circle cx="42" cy="68" r="3" fill="#4CAF6D" />
  </g>
);

const Farfalla = (
  <g>
    <ellipse cx="38" cy="38" rx="18" ry="14" fill="#F28AB2" transform="rotate(-25 38 38)" />
    <ellipse cx="62" cy="38" rx="18" ry="14" fill="#3DB5E6" transform="rotate(25 62 38)" />
    <ellipse cx="40" cy="62" rx="14" ry="11" fill="#F9C846" transform="rotate(20 40 62)" />
    <ellipse cx="60" cy="62" rx="14" ry="11" fill="#9B6DD6" transform="rotate(-20 60 62)" />
    <ellipse cx="50" cy="50" rx="5" ry="18" fill="#1F2430" />
    <path d="M46 32 Q42 22 38 20 M54 32 Q58 22 62 20" stroke="#1F2430" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="42" cy="36" r="3" fill="#FFFFFF" opacity="0.7" />
    <circle cx="58" cy="36" r="3" fill="#FFFFFF" opacity="0.7" />
  </g>
);

const Arcobaleno = (
  <g>
    {["#E8474B", "#F59A23", "#F9C846", "#4CAF6D", "#3DB5E6", "#9B6DD6"].map((c, i) => (
      <path key={c} d={`M${14 + i * 6} 78 A ${36 - i * 6} ${36 - i * 6} 0 0 1 ${86 - i * 6} 78`} stroke={c} strokeWidth="6" fill="none" strokeLinecap="round" />
    ))}
    <ellipse cx="16" cy="80" rx="12" ry="8" fill="#FFFFFF" />
    <ellipse cx="84" cy="80" rx="12" ry="8" fill="#FFFFFF" />
  </g>
);

const PalloneCalcio = (
  <g>
    <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#1F2430" strokeWidth="3" />
    <polygon points="50,36 62,45 57,59 43,59 38,45" fill="#1F2430" />
    <path d="M50 36 L50 18 M62 45 L80 40 M57 59 L68 74 M43 59 L32 74 M38 45 L20 40" stroke="#1F2430" strokeWidth="3" />
  </g>
);

const Coccinella = (
  <g>
    <circle cx="50" cy="58" r="30" fill="#E8474B" />
    <path d="M50 28 L50 88" stroke="#1F2430" strokeWidth="3" />
    <circle cx="50" cy="26" r="12" fill="#1F2430" />
    <circle cx="45" cy="23" r="2.5" fill="#FFFFFF" />
    <circle cx="55" cy="23" r="2.5" fill="#FFFFFF" />
    <circle cx="38" cy="50" r="5" fill="#1F2430" />
    <circle cx="62" cy="50" r="5" fill="#1F2430" />
    <circle cx="34" cy="68" r="4" fill="#1F2430" />
    <circle cx="66" cy="68" r="4" fill="#1F2430" />
    <path d="M40 16 Q36 8 30 8 M60 16 Q64 8 70 8" stroke="#1F2430" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </g>
);

const Corona = (
  <g>
    <path d="M18 70 L14 34 L34 50 L50 26 L66 50 L86 34 L82 70 Z" fill="#F9C846" stroke="#F59A23" strokeWidth="3" strokeLinejoin="round" />
    <rect x="18" y="70" width="64" height="10" rx="4" fill="#F59A23" />
    <circle cx="50" cy="52" r="5" fill="#F28AB2" />
    <circle cx="30" cy="58" r="4" fill="#3DB5E6" />
    <circle cx="70" cy="58" r="4" fill="#9B6DD6" />
  </g>
);

const Supereroe = (
  <g>
    {/* Mascherina e mantello: il supereroe generico che piace a tutti. */}
    <path d="M20 80 Q10 50 26 30 L38 44 Q30 60 34 80 Z" fill="#E8474B" />
    <circle cx="56" cy="38" r="20" fill="#F2B58B" />
    <path d="M38 34 Q56 22 74 34 L74 42 Q56 34 38 42 Z" fill="#3DB5E6" />
    <circle cx="48" cy="38" r="3" fill="#1F2430" />
    <circle cx="64" cy="38" r="3" fill="#1F2430" />
    <path d="M50 48 Q56 53 62 48" stroke="#1F2430" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <rect x="42" y="58" width="28" height="30" rx="9" fill="#3DB5E6" />
    <path d="M50 66 L56 74 L62 66" stroke="#F9C846" strokeWidth="4" fill="none" strokeLinejoin="round" />
  </g>
);

/* ---- Catalogo completo: nuovi + figure del catalogo giochi ---- */

interface VoceCatalogo {
  id: string;
  nome: string;
  disegno: ReactNode;
}

const Zucca = (
  <g>
    <ellipse cx="50" cy="58" rx="34" ry="28" fill="#F59A23" stroke="#D97706" strokeWidth="2" />
    <ellipse cx="30" cy="58" rx="12" ry="26" fill="none" stroke="#D97706" strokeWidth="2" opacity="0.6" />
    <ellipse cx="70" cy="58" rx="12" ry="26" fill="none" stroke="#D97706" strokeWidth="2" opacity="0.6" />
    <rect x="45" y="18" width="10" height="16" rx="4" fill="#4CAF6D" />
    <path d="M55 24 Q68 18 72 28" fill="none" stroke="#4CAF6D" strokeWidth="4" strokeLinecap="round" />
    <circle cx="38" cy="52" r="4.5" fill="#1F2430" />
    <circle cx="62" cy="52" r="4.5" fill="#1F2430" />
    <path d="M36 68 Q50 78 64 68" fill="none" stroke="#1F2430" strokeWidth="4" strokeLinecap="round" />
  </g>
);

const Fantasmino = (
  <g>
    <path d="M26 52 Q26 20 50 20 Q74 20 74 52 L74 84 L66 76 L58 84 L50 76 L42 84 L34 76 L26 84 Z" fill="#FFFFFF" stroke="#D7D3F0" strokeWidth="2.5" />
    <circle cx="41" cy="46" r="4.5" fill="#1F2430" />
    <circle cx="59" cy="46" r="4.5" fill="#1F2430" />
    <ellipse cx="50" cy="58" rx="5" ry="6.5" fill="#1F2430" opacity="0.85" />
    <circle cx="33" cy="53" r="4" fill="#F8BBD0" opacity="0.8" />
    <circle cx="67" cy="53" r="4" fill="#F8BBD0" opacity="0.8" />
  </g>
);

const Pipistrello = (
  <g>
    <path d="M8 46 Q20 28 34 40 Q30 30 40 32 Q38 24 46 28 L54 28 Q62 24 60 32 Q70 30 66 40 Q80 28 92 46 Q78 42 74 50 Q66 44 60 52 Q56 46 50 52 Q44 46 40 52 Q34 44 26 50 Q22 42 8 46" fill="#9B6DD6" stroke="#7C4FC0" strokeWidth="2" />
    <circle cx="44" cy="38" r="3.5" fill="#FFFFFF" />
    <circle cx="56" cy="38" r="3.5" fill="#FFFFFF" />
    <circle cx="44" cy="38" r="1.6" fill="#1F2430" />
    <circle cx="56" cy="38" r="1.6" fill="#1F2430" />
    <path d="M46 46 Q50 49 54 46" fill="none" stroke="#1F2430" strokeWidth="2" strokeLinecap="round" />
  </g>
);

const Alberello = (
  <g>
    <path d="M50 8 L66 32 L58 32 L72 54 L62 54 L78 80 L22 80 L38 54 L28 54 L42 32 L34 32 Z" fill="#4CAF6D" stroke="#3B8A55" strokeWidth="2" />
    <rect x="44" y="80" width="12" height="12" rx="3" fill="#8B5A2B" />
    <path d="M50 2 L52.4 7.6 L58.5 8.2 L54 12.2 L55.3 18 L50 15 L44.7 18 L46 12.2 L41.5 8.2 L47.6 7.6 Z" fill="#F9C846" />
    <circle cx="40" cy="44" r="4" fill="#E8474B" />
    <circle cx="58" cy="62" r="4" fill="#F9C846" />
    <circle cx="44" cy="70" r="4" fill="#3DB5E6" />
  </g>
);

const PupazzoDiNeve = (
  <g>
    <circle cx="50" cy="66" r="24" fill="#FFFFFF" stroke="#D7E3F0" strokeWidth="2.5" />
    <circle cx="50" cy="34" r="16" fill="#FFFFFF" stroke="#D7E3F0" strokeWidth="2.5" />
    <rect x="38" y="12" width="24" height="7" rx="2" fill="#1F2430" />
    <rect x="43" y="2" width="14" height="12" rx="2" fill="#1F2430" />
    <circle cx="44" cy="31" r="2.2" fill="#1F2430" />
    <circle cx="56" cy="31" r="2.2" fill="#1F2430" />
    <path d="M50 35 L58 38 L50 40 Z" fill="#F59A23" />
    <path d="M44 44 Q50 48 56 44" stroke="#E8474B" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="50" cy="60" r="2.4" fill="#1F2430" />
    <circle cx="50" cy="70" r="2.4" fill="#1F2430" />
  </g>
);

const FioccoDiNeve = (
  <g stroke="#3DB5E6" strokeWidth="5" strokeLinecap="round" fill="none">
    <path d="M50 10 V90" />
    <path d="M15 30 L85 70" />
    <path d="M85 30 L15 70" />
    <path d="M50 10 L42 20 M50 10 L58 20" />
    <path d="M50 90 L42 80 M50 90 L58 80" />
    <path d="M15 30 L28 32 M15 30 L17 43" />
    <path d="M85 70 L72 68 M85 70 L83 57" />
    <path d="M85 30 L72 32 M85 30 L83 43" />
    <path d="M15 70 L28 68 M15 70 L17 57" />
    <circle cx="50" cy="50" r="7" fill="#FFFFFF" strokeWidth="4" />
  </g>
);

const dallArte = (id: NomeFigura, nome: string): VoceCatalogo => ({
  id,
  nome,
  // lato esplicito: dentro un altro SVG, un <svg> senza misure vale "100%"
  // del riquadro esterno e sfonda il layout della pagina.
  disegno: <Disegno id={id} className="" lato={100} />,
});

export const CATALOGO_STICKER: VoceCatalogo[] = [
  { id: "unicorno", nome: "Unicorno", disegno: Unicorno },
  { id: "dinosauro", nome: "Dinosauro", disegno: Dinosauro },
  { id: "farfalla", nome: "Farfalla", disegno: Farfalla },
  { id: "arcobaleno", nome: "Arcobaleno", disegno: Arcobaleno },
  { id: "pallone", nome: "Pallone", disegno: PalloneCalcio },
  { id: "coccinella", nome: "Coccinella", disegno: Coccinella },
  { id: "corona", nome: "Corona", disegno: Corona },
  { id: "supereroe", nome: "Supereroe", disegno: Supereroe },
  { id: "zucca", nome: "Zucca", disegno: Zucca },
  { id: "fantasmino", nome: "Fantasmino", disegno: Fantasmino },
  { id: "pipistrello", nome: "Pipistrello", disegno: Pipistrello },
  { id: "alberello", nome: "Alberello", disegno: Alberello },
  { id: "pupazzo-di-neve", nome: "Pupazzo di neve", disegno: PupazzoDiNeve },
  { id: "fiocco-di-neve", nome: "Fiocco di neve", disegno: FioccoDiNeve },
  dallArte("torta", "Torta"),
  dallArte("razzo", "Razzo"),
  dallArte("gatto", "Gattino"),
  dallArte("cane", "Cagnolino"),
  dallArte("orso", "Orsetto"),
  dallArte("fiore", "Fiore"),
  dallArte("sole", "Sole"),
  dallArte("barca", "Barca"),
];

export function StickerDisegno({ id }: { id: string }) {
  const voce = CATALOGO_STICKER.find((v) => v.id === id);
  if (!voce) return null;
  return <>{voce.disegno}</>;
}
