/**
 * Libreria di disegni SVG inline — Gioca con Mizi.
 *
 * Regola della checklist di design: "Nessuna immagine esterna: SVG inline o
 * asset in /public". Ogni figura vive in un viewBox 0 0 100 100 così che i
 * giochi possano scalarla senza pensarci.
 *
 * Le figure sono volutamente geometriche e ad alto contrasto: devono essere
 * riconoscibili da un bambino di tre anni su uno schermo da 360px.
 */

import type { ReactNode } from "react";

export const COLORI = {
  rosso: "#E8474B",
  arancione: "#F59A23",
  giallo: "#F9C846",
  verde: "#4CAF6D",
  azzurro: "#3DB5E6",
  blu: "#2F6BD6",
  viola: "#9B6DD6",
  rosa: "#F28AB2",
  marrone: "#9B6B4A",
  nero: "#1F2430",
  bianco: "#FFFFFF",
  grigio: "#B9C0CC",
} as const;

export type NomeColore = keyof typeof COLORI;

/** Etichette in italiano, come le direbbe la voce a un bambino. */
export const NOMI_COLORE: Record<NomeColore, string> = {
  rosso: "rosso",
  arancione: "arancione",
  giallo: "giallo",
  verde: "verde",
  azzurro: "azzurro",
  blu: "blu",
  viola: "viola",
  rosa: "rosa",
  marrone: "marrone",
  nero: "nero",
  bianco: "bianco",
  grigio: "grigio",
};

// --- Mattoni riusabili -----------------------------------------------------

function Occhi({ y = 42, dx = 14, r = 5 }: { y?: number; dx?: number; r?: number }) {
  return (
    <>
      <circle cx={50 - dx} cy={y} r={r} fill={COLORI.nero} />
      <circle cx={50 + dx} cy={y} r={r} fill={COLORI.nero} />
    </>
  );
}

/** Muso animale: testa tonda + orecchie di forma diversa per specie. */
function Testa({
  colore,
  orecchie,
  bocca = "sorriso",
}: {
  colore: string;
  orecchie: ReactNode;
  bocca?: "sorriso" | "becco" | "muso";
}) {
  return (
    <>
      {orecchie}
      <circle cx="50" cy="52" r="34" fill={colore} />
      <Occhi />
      {bocca === "sorriso" && (
        <path d="M38 62 Q50 72 62 62" stroke={COLORI.nero} strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      {bocca === "becco" && <path d="M42 60 L58 60 L50 72 Z" fill={COLORI.arancione} />}
      {bocca === "muso" && (
        <>
          <ellipse cx="50" cy="64" rx="14" ry="10" fill={COLORI.bianco} />
          <ellipse cx="50" cy="60" rx="5" ry="4" fill={COLORI.nero} />
        </>
      )}
    </>
  );
}

// --- Il catalogo -----------------------------------------------------------

const FIGURE: Record<string, ReactNode> = {
  // Animali
  gatto: (
    <Testa
      colore="#C7893F"
      orecchie={
        <>
          <path d="M22 34 L28 8 L46 24 Z" fill="#C7893F" />
          <path d="M78 34 L72 8 L54 24 Z" fill="#C7893F" />
        </>
      }
      bocca="muso"
    />
  ),
  cane: (
    <Testa
      colore="#9B6B4A"
      orecchie={
        <>
          <ellipse cx="20" cy="42" rx="11" ry="22" fill="#7A5238" />
          <ellipse cx="80" cy="42" rx="11" ry="22" fill="#7A5238" />
        </>
      }
      bocca="muso"
    />
  ),
  mucca: (
    <Testa
      colore={COLORI.bianco}
      orecchie={
        <>
          <ellipse cx="16" cy="44" rx="10" ry="7" fill="#DDD" />
          <ellipse cx="84" cy="44" rx="10" ry="7" fill="#DDD" />
          <circle cx="34" cy="34" r="9" fill={COLORI.nero} />
          <circle cx="70" cy="70" r="8" fill={COLORI.nero} />
        </>
      }
      bocca="muso"
    />
  ),
  pecora: (
    <Testa
      colore="#F0EDE6"
      orecchie={
        <>
          <circle cx="26" cy="28" r="12" fill="#F0EDE6" />
          <circle cx="74" cy="28" r="12" fill="#F0EDE6" />
          <circle cx="18" cy="50" r="12" fill="#F0EDE6" />
          <circle cx="82" cy="50" r="12" fill="#F0EDE6" />
        </>
      }
      bocca="muso"
    />
  ),
  papera: (
    <Testa
      colore={COLORI.giallo}
      orecchie={<circle cx="50" cy="24" r="10" fill={COLORI.giallo} />}
      bocca="becco"
    />
  ),
  gallo: (
    <Testa
      colore={COLORI.bianco}
      orecchie={
        <>
          <path d="M38 22 Q44 6 50 22 Q56 6 62 22 Z" fill={COLORI.rosso} />
        </>
      }
      bocca="becco"
    />
  ),
  rana: (
    <Testa
      colore={COLORI.verde}
      orecchie={
        <>
          <circle cx="30" cy="24" r="13" fill={COLORI.verde} />
          <circle cx="70" cy="24" r="13" fill={COLORI.verde} />
          <circle cx="30" cy="24" r="6" fill={COLORI.nero} />
          <circle cx="70" cy="24" r="6" fill={COLORI.nero} />
        </>
      }
    />
  ),
  ape: (
    <>
      <ellipse cx="50" cy="55" rx="30" ry="26" fill={COLORI.giallo} />
      <rect x="34" y="38" width="9" height="34" fill={COLORI.nero} />
      <rect x="56" y="38" width="9" height="34" fill={COLORI.nero} />
      <ellipse cx="28" cy="26" rx="16" ry="10" fill="#FFFFFFCC" />
      <ellipse cx="72" cy="26" rx="16" ry="10" fill="#FFFFFFCC" />
      <Occhi y={50} dx={10} r={4} />
    </>
  ),
  orso: (
    <Testa
      colore="#8C6239"
      orecchie={
        <>
          <circle cx="24" cy="26" r="13" fill="#8C6239" />
          <circle cx="76" cy="26" r="13" fill="#8C6239" />
        </>
      }
      bocca="muso"
    />
  ),
  pesce: (
    <>
      <ellipse cx="46" cy="50" rx="32" ry="22" fill={COLORI.arancione} />
      <path d="M78 50 L96 32 L96 68 Z" fill={COLORI.arancione} />
      <circle cx="32" cy="44" r="5" fill={COLORI.nero} />
      <path d="M40 62 Q50 68 60 62" stroke="#00000033" strokeWidth="3" fill="none" />
    </>
  ),
  pinguino: (
    <>
      <ellipse cx="50" cy="56" rx="30" ry="34" fill={COLORI.nero} />
      <ellipse cx="50" cy="62" rx="20" ry="26" fill={COLORI.bianco} />
      <circle cx="50" cy="26" r="20" fill={COLORI.nero} />
      <Occhi y={24} dx={8} r={4} />
      <path d="M44 32 L56 32 L50 40 Z" fill={COLORI.arancione} />
    </>
  ),

  // Oggetti
  mela: (
    <>
      <circle cx="50" cy="58" r="30" fill={COLORI.rosso} />
      <rect x="47" y="22" width="6" height="16" rx="3" fill="#6B4A2F" />
      <ellipse cx="63" cy="28" rx="12" ry="7" fill={COLORI.verde} />
    </>
  ),
  palla: (
    <>
      <circle cx="50" cy="50" r="34" fill={COLORI.rosa} />
      <path d="M16 50 Q50 26 84 50" stroke={COLORI.bianco} strokeWidth="5" fill="none" />
      <path d="M16 50 Q50 74 84 50" stroke={COLORI.bianco} strokeWidth="5" fill="none" />
    </>
  ),
  casa: (
    <>
      <rect x="24" y="46" width="52" height="40" fill={COLORI.giallo} />
      <path d="M18 48 L50 18 L82 48 Z" fill={COLORI.rosso} />
      <rect x="42" y="62" width="16" height="24" fill="#6B4A2F" />
    </>
  ),
  albero: (
    <>
      <rect x="44" y="54" width="12" height="32" fill="#7A5238" />
      <circle cx="50" cy="40" r="26" fill={COLORI.verde} />
    </>
  ),
  sole: (
    <>
      <circle cx="50" cy="50" r="24" fill={COLORI.giallo} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="47"
          y="6"
          width="6"
          height="14"
          rx="3"
          fill={COLORI.giallo}
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
    </>
  ),
  luna: (
    <path d="M62 12 A38 38 0 1 0 62 88 A30 30 0 1 1 62 12 Z" fill={COLORI.giallo} />
  ),
  razzo: (
    <>
      <path d="M50 10 Q68 40 68 66 L32 66 Q32 40 50 10 Z" fill={COLORI.bianco} stroke={COLORI.grigio} strokeWidth="3" />
      <circle cx="50" cy="40" r="9" fill={COLORI.azzurro} />
      <path d="M32 56 L18 76 L32 70 Z" fill={COLORI.rosso} />
      <path d="M68 56 L82 76 L68 70 Z" fill={COLORI.rosso} />
      <path d="M40 68 Q50 92 60 68 Z" fill={COLORI.arancione} />
    </>
  ),
  fiore: (
    <>
      <rect x="47" y="52" width="6" height="36" fill={COLORI.verde} />
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="26"
          rx="10"
          ry="16"
          fill={COLORI.rosa}
          transform={`rotate(${i * 60} 50 44)`}
        />
      ))}
      <circle cx="50" cy="44" r="10" fill={COLORI.giallo} />
    </>
  ),
  macchina: (
    <>
      <rect x="14" y="48" width="72" height="22" rx="8" fill={COLORI.azzurro} />
      <path d="M30 48 L38 32 L64 32 L72 48 Z" fill={COLORI.azzurro} />
      <circle cx="32" cy="72" r="11" fill={COLORI.nero} />
      <circle cx="68" cy="72" r="11" fill={COLORI.nero} />
    </>
  ),
  barca: (
    <>
      <path d="M14 62 L86 62 L74 82 L26 82 Z" fill="#7A5238" />
      <rect x="47" y="18" width="5" height="44" fill="#5A3D28" />
      <path d="M52 20 L80 52 L52 52 Z" fill={COLORI.bianco} />
    </>
  ),
  libro: (
    <>
      <rect x="18" y="24" width="64" height="52" rx="4" fill={COLORI.viola} />
      <rect x="47" y="24" width="6" height="52" fill="#00000022" />
      <rect x="26" y="34" width="16" height="4" fill="#FFFFFF88" />
      <rect x="58" y="34" width="16" height="4" fill="#FFFFFF88" />
    </>
  ),
  torta: (
    <>
      <rect x="20" y="48" width="60" height="34" rx="6" fill={COLORI.rosa} />
      <rect x="20" y="48" width="60" height="10" fill={COLORI.bianco} />
      <rect x="47" y="26" width="6" height="20" fill={COLORI.azzurro} />
      <ellipse cx="50" cy="22" rx="5" ry="8" fill={COLORI.arancione} />
    </>
  ),
  nuvola: (
    <>
      <circle cx="34" cy="56" r="18" fill={COLORI.bianco} />
      <circle cx="54" cy="48" r="22" fill={COLORI.bianco} />
      <circle cx="72" cy="58" r="16" fill={COLORI.bianco} />
      <rect x="34" y="56" width="38" height="18" fill={COLORI.bianco} />
    </>
  ),

  // Forme geometriche
  cerchio: <circle cx="50" cy="50" r="36" fill="currentColor" />,
  quadrato: <rect x="16" y="16" width="68" height="68" rx="4" fill="currentColor" />,
  triangolo: <path d="M50 12 L88 84 L12 84 Z" fill="currentColor" />,
  rettangolo: <rect x="10" y="30" width="80" height="40" rx="4" fill="currentColor" />,
  stella: (
    <path
      d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z"
      fill="currentColor"
    />
  ),
  ovale: <ellipse cx="50" cy="50" rx="40" ry="26" fill="currentColor" />,
  rombo: <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="currentColor" />,
};

/** Nomi delle forme, per la voce e per le etichette. */
export const FORME = ["cerchio", "quadrato", "triangolo", "rettangolo", "stella", "ovale", "rombo"] as const;
export type NomeForma = (typeof FORME)[number];

export type NomeFigura = keyof typeof FIGURE;

/**
 * Disegna una figura del catalogo.
 * `colore` vale solo per le forme geometriche, che usano currentColor.
 */
export function Disegno({
  id,
  colore,
  className = "h-full w-full",
  titolo,
}: {
  id: NomeFigura;
  colore?: string;
  className?: string;
  titolo?: string;
}) {
  const figura = FIGURE[id];
  if (!figura) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={colore ? { color: colore } : undefined}
      role={titolo ? "img" : "presentation"}
      aria-label={titolo}
      aria-hidden={titolo ? undefined : true}
    >
      {figura}
    </svg>
  );
}

/** Secchiello di vernice: il bersaglio di "Abbina i colori". */
export function Secchiello({ colore, className = "h-full w-full" }: { colore: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d="M22 34 L78 34 L70 86 L30 86 Z" fill={colore} />
      <ellipse cx="50" cy="34" rx="28" ry="9" fill={colore} stroke="#00000022" strokeWidth="2" />
      <path d="M26 32 Q50 4 74 32" stroke={colore} strokeWidth="6" fill="none" />
    </svg>
  );
}

/** Le facce di Mizi: servono al gioco sulle emozioni. */
export type Emozione = "felice" | "triste" | "arrabbiato" | "spaventato" | "sorpreso";

export const NOMI_EMOZIONE: Record<Emozione, string> = {
  felice: "felice",
  triste: "triste",
  arrabbiato: "arrabbiata",
  spaventato: "spaventata",
  sorpreso: "sorpresa",
};

export function FacciaMizi({ emozione, className = "h-full w-full" }: { emozione: Emozione; className?: string }) {
  const bocche: Record<Emozione, ReactNode> = {
    felice: <path d="M36 62 Q50 76 64 62" stroke={COLORI.nero} strokeWidth="5" fill="none" strokeLinecap="round" />,
    // Bocca all'ingiù: gli angoli stanno più in basso del centro.
    triste: <path d="M36 72 Q50 58 64 72" stroke={COLORI.nero} strokeWidth="5" fill="none" strokeLinecap="round" />,
    // La rabbia ha la bocca stretta e squadrata, non una smorfia triste.
    arrabbiato: <path d="M38 70 L62 70" stroke={COLORI.nero} strokeWidth="6" strokeLinecap="round" />,
    spaventato: <ellipse cx="50" cy="68" rx="9" ry="12" fill={COLORI.nero} />,
    sorpreso: <circle cx="50" cy="68" r="10" fill={COLORI.nero} />,
  };

  const sopracciglia: Record<Emozione, ReactNode> = {
    felice: null,
    // Nella tristezza le estremità interne si alzano.
    triste: (
      <>
        <path d="M28 40 L42 32" stroke={COLORI.nero} strokeWidth="4" strokeLinecap="round" />
        <path d="M72 40 L58 32" stroke={COLORI.nero} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    // Nella rabbia si abbassano verso il naso.
    arrabbiato: (
      <>
        <path d="M28 32 L42 40" stroke={COLORI.nero} strokeWidth="5" strokeLinecap="round" />
        <path d="M72 32 L58 40" stroke={COLORI.nero} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
    spaventato: (
      <>
        <path d="M28 32 Q35 26 42 32" stroke={COLORI.nero} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M58 32 Q65 26 72 32" stroke={COLORI.nero} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
    sorpreso: (
      <>
        <path d="M28 30 Q35 24 42 30" stroke={COLORI.nero} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M58 30 Q65 24 72 30" stroke={COLORI.nero} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
  };

  const occhi = emozione === "spaventato" || emozione === "sorpreso" ? 9 : 6;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="52" r="40" fill={COLORI.nero} />
      <ellipse cx="50" cy="56" rx="30" ry="32" fill={COLORI.bianco} />
      <circle cx="36" cy="46" r={occhi} fill={COLORI.nero} />
      <circle cx="64" cy="46" r={occhi} fill={COLORI.nero} />
      <path d="M44 54 L56 54 L50 62 Z" fill={COLORI.arancione} />
      {sopracciglia[emozione]}
      {bocche[emozione]}
    </svg>
  );
}
