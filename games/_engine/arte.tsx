/**
 * Libreria di disegni SVG inline — Gioca con Mizi.
 *
 * Regola della checklist di design: "Nessuna immagine esterna: SVG inline o
 * asset in /public". Ogni figura vive in un viewBox 0 0 100 100 così che i
 * giochi possano scalarla senza pensarci.
 *
 * Le figure sono volutamente geometriche e ad alto contrasto: devono essere
 * riconoscibili da un bambino di tre anni su uno schermo da 360px.
 *
 * Dal 22/11/2026 si ridisegnano una alla volta con il volume (vedi OMBRA e
 * LUCE più sotto). Fatte: le sette forme, il secchiello, pesce, palla, mela,
 * fiore, macchina. Le altre sono ancora piatte.
 */

import type { CSSProperties, ReactNode } from "react";

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

/*
 * Il volume delle figure (22/11/2026). Le figure erano forme piatte a tinta
 * unita. Ora ognuna ha tre strati: il colore, un'ombra (nero trasparente) dove
 * la luce non arriva e un riflesso (bianco trasparente) dove batte. Ombra e
 * riflesso sono trasparenti apposta: funzionano con qualunque tinta, anche
 * quella scelta dal gioco. La luce viene sempre dall'alto a sinistra.
 */
const OMBRA = "rgba(31,36,48,0.16)";
const OMBRA_FORTE = "rgba(31,36,48,0.28)";
const LUCE = "rgba(255,255,255,0.42)";
const LUCE_TENUE = "rgba(255,255,255,0.2)";

/** Il colore di una figura che il gioco può tingere (`tinta` di Disegno), con il suo colore di sempre. */
const tinta = (diBase: string) => ({ fill: `var(--tinta, ${diBase})` });

/** Mezzaluna d'ombra in basso a destra e riflesso in alto a sinistra, per una palla di raggio 36 al centro. */
const SFERA = (
  <>
    <path d="M77.6 26.9 A36 36 0 0 1 26.9 77.6 A46 46 0 0 0 77.6 26.9 Z" fill={OMBRA} />
    <ellipse cx="37" cy="33" rx="10" ry="6" fill={LUCE} transform="rotate(-38 37 33)" />
  </>
);

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
      <path d="M74 50 Q88 34 96 30 Q92 50 96 70 Q88 66 74 50 Z" style={tinta(COLORI.arancione)} />
      <path d="M74 50 Q88 34 96 30 Q92 50 96 70 Q88 66 74 50 Z" fill={OMBRA} />
      <path d="M40 30 Q52 14 64 30 Z" style={tinta(COLORI.arancione)} />
      <path d="M40 30 Q52 14 64 30 Z" fill={OMBRA} />
      <ellipse cx="46" cy="50" rx="33" ry="22" style={tinta(COLORI.arancione)} />
      <path d="M14 54 A33 22 0 0 0 78 54 A40 30 0 0 1 14 54 Z" fill={OMBRA} />
      <ellipse cx="44" cy="60" rx="20" ry="8" fill={LUCE_TENUE} />
      <path d="M52 40 Q58 50 52 60 M62 42 Q67 50 62 58" stroke={OMBRA_FORTE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="38" rx="12" ry="5" fill={LUCE} transform="rotate(-14 38 38)" />
      <circle cx="30" cy="46" r="7" fill={COLORI.bianco} />
      <circle cx="29" cy="47" r="4" fill={COLORI.nero} />
      <circle cx="27.5" cy="45.5" r="1.4" fill={COLORI.bianco} />
      <path d="M20 58 Q26 62 31 58" stroke={OMBRA_FORTE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
      <path d="M50 36 Q51 26 56 20" stroke="#6B4A2F" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M56 26 Q70 14 80 24 Q70 36 56 26 Z" fill={COLORI.verde} />
      <path d="M58 26 Q68 22 78 24" stroke={OMBRA_FORTE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M50 38 Q34 28 22 44 Q12 62 26 80 Q38 92 50 86 Q62 92 74 80 Q88 62 78 44 Q66 28 50 38 Z" style={tinta(COLORI.rosso)} />
      <path d="M78 44 Q88 62 74 80 Q62 92 50 86 Q72 78 78 44 Z" fill={OMBRA} />
      <ellipse cx="34" cy="52" rx="7" ry="11" fill={LUCE} transform="rotate(24 34 52)" />
    </>
  ),
  palla: (
    <>
      <circle cx="50" cy="50" r="36" style={tinta(COLORI.rosa)} />
      <path d="M17 38 Q50 22 83 38" stroke={COLORI.bianco} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M17 62 Q50 78 83 62" stroke={COLORI.bianco} strokeWidth="6" fill="none" strokeLinecap="round" />
      {SFERA}
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
      <path d="M50 54 Q46 72 50 92" stroke={COLORI.verde} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M49 76 Q34 66 28 76 Q38 86 49 76 Z" fill={COLORI.verde} />
      <path d="M51 70 Q66 60 72 70 Q62 80 51 70 Z" fill={COLORI.verde} />
      <path d="M51 70 Q62 76 72 70 Q62 80 51 70 Z" fill={OMBRA} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 60} 50 40)`}>
          <ellipse cx="50" cy="20" rx="11" ry="16" style={tinta(COLORI.rosa)} />
          <ellipse cx="50" cy="17" rx="5" ry="8" fill={LUCE_TENUE} />
        </g>
      ))}
      <circle cx="50" cy="40" r="11" fill={COLORI.giallo} />
      <path d="M58.4 33 A11 11 0 0 1 43 48.4 A14 14 0 0 0 58.4 33 Z" fill={OMBRA} />
      <circle cx="46.5" cy="36.5" r="3" fill={LUCE} />
    </>
  ),
  macchina: (
    <>
      <path d="M28 50 L36 32 Q38 28 43 28 L62 28 Q67 28 69 32 L76 50 Z" style={tinta(COLORI.azzurro)} />
      <path d="M38 48 L43 35 L56 35 L56 48 Z M60 35 L64 35 L70 48 L60 48 Z" fill="#DDF3FC" />
      <path d="M41 46 L45 37 L49 37 L45 46 Z" fill={LUCE} />
      <rect x="10" y="46" width="80" height="26" rx="11" style={tinta(COLORI.azzurro)} />
      <path d="M10 62 H90 V61 Q90 72 79 72 H21 Q10 72 10 61 Z" fill={OMBRA} />
      <rect x="18" y="50" width="34" height="5" rx="2.5" fill={LUCE} />
      <circle cx="84" cy="56" r="4" fill={COLORI.giallo} />
      <circle cx="30" cy="74" r="12" fill={COLORI.nero} />
      <circle cx="30" cy="74" r="5" fill={COLORI.grigio} />
      <circle cx="70" cy="74" r="12" fill={COLORI.nero} />
      <circle cx="70" cy="74" r="5" fill={COLORI.grigio} />
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
  // Le forme geometriche: la sagoma resta quella esatta, il volume è solo luce e ombra.
  cerchio: (
    <>
      <circle cx="50" cy="50" r="36" fill="currentColor" />
      {SFERA}
    </>
  ),
  quadrato: (
    <>
      <rect x="16" y="16" width="68" height="68" rx="6" fill="currentColor" />
      <path d="M16 68 H84 V78 Q84 84 78 84 H22 Q16 84 16 78 Z" fill={OMBRA} />
      <rect x="24" y="23" width="30" height="6" rx="3" fill={LUCE} />
    </>
  ),
  triangolo: (
    <>
      <path d="M50 16 L84 80 L16 80 Z" fill="currentColor" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
      <path d="M21 70 H79 L86 82 Q86 84 84 84 H16 Q14 84 14 82 Z" fill={OMBRA} />
      <path d="M46 30 L32 57" stroke={LUCE} strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  rettangolo: (
    <>
      <rect x="10" y="30" width="80" height="40" rx="6" fill="currentColor" />
      <path d="M10 58 H90 V64 Q90 70 84 70 H16 Q10 70 10 64 Z" fill={OMBRA} />
      <rect x="18" y="36" width="34" height="5" rx="2.5" fill={LUCE} />
    </>
  ),
  stella: (
    <>
      <path
        d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Cinque facce in ombra, una per punta: la stella sembra in rilievo. */}
      <path d="M50 51 L50 8 L61 38 Z M50 51 L93 38 L67 57 Z M50 51 L77 88 L50 69 Z M50 51 L23 88 L33 57 Z M50 51 L7 38 L39 38 Z" fill={OMBRA} />
      <path d="M44 26 L40 37" stroke={LUCE} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  ovale: (
    <>
      <ellipse cx="50" cy="50" rx="40" ry="26" fill="currentColor" />
      <g transform="translate(50 50) scale(1.111 0.722) translate(-50 -50)">{SFERA}</g>
    </>
  ),
  rombo: (
    <>
      <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <path d="M50 50 L92 50 Q93 50 92 51 L51 92 Q50 93 50 92 Z" fill={OMBRA} />
      <path d="M50 50 L8 50 Q7 50 8 49 L49 8 Q50 7 50 8 Z" fill={LUCE_TENUE} />
    </>
  ),
};

/** Nomi delle forme, per la voce e per le etichette. */
export const FORME = ["cerchio", "quadrato", "triangolo", "rettangolo", "stella", "ovale", "rombo"] as const;
export type NomeForma = (typeof FORME)[number];

export type NomeFigura = keyof typeof FIGURE;

/**
 * Disegna una figura del catalogo.
 * `colore` vale solo per le forme geometriche, che usano currentColor.
 * `tinta` cambia il colore principale delle figure che lo permettono (palla,
 * mela, fiore, macchina, pesce): senza, restano del loro colore di sempre.
 */
export function Disegno({
  id,
  colore,
  tinta: tintaScelta,
  className = "h-full w-full",
  titolo,
  lato,
}: {
  id: NomeFigura;
  colore?: string;
  tinta?: string;
  className?: string;
  titolo?: string;
  /**
   * Taglia esplicita in unità utente: OBBLIGATORIA quando il disegno sta
   * dentro un altro SVG. Un <svg> annidato senza width/height vale "100%"
   * del riquadro esterno: si disegna enorme e gonfia il layout della pagina.
   */
  lato?: number;
}) {
  const figura = FIGURE[id];
  if (!figura) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      width={lato}
      height={lato}
      className={className}
      style={colore || tintaScelta ? ({ color: colore, "--tinta": tintaScelta } as CSSProperties) : undefined}
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
      {/* Il manico di metallo, dietro al secchiello. */}
      <path d="M24 34 Q50 2 76 34" stroke="#9AA3B2" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M22 36 L78 36 L71 84 Q70 90 64 90 L36 90 Q30 90 29 84 Z" fill={colore} />
      <path d="M62 36 L78 36 L71 84 Q70 90 64 90 L56 90 Z" fill={OMBRA} />
      <path d="M30 44 L34 80" stroke={LUCE} strokeWidth="6" strokeLinecap="round" />
      {/* Il bordo e la vernice dentro, un po' più chiara. */}
      <ellipse cx="50" cy="36" rx="29" ry="9.5" fill={colore} />
      <ellipse cx="50" cy="36" rx="29" ry="9.5" fill={OMBRA_FORTE} />
      <ellipse cx="50" cy="37.5" rx="24" ry="6.5" fill={colore} />
      <ellipse cx="50" cy="37.5" rx="24" ry="6.5" fill={LUCE_TENUE} />
      <ellipse cx="42" cy="36.5" rx="8" ry="2" fill={LUCE} />
      <circle cx="23" cy="36" r="3" fill="#9AA3B2" />
      <circle cx="77" cy="36" r="3" fill="#9AA3B2" />
    </svg>
  );
}

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
