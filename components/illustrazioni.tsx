import { IconaGioco } from "@/components/icone";
import { COLORI, Disegno, FacciaMizi } from "@/games/_engine/arte";
import type { Skill } from "@/games/registry";

/**
 * Illustrazioni della vetrina — Gioca con Mizi.
 *
 * Come per games/_engine/arte.tsx vale la regola "nessuna immagine esterna":
 * tutto è SVG inline, così la home si carica in un colpo solo e i disegni
 * restano nitidi a ogni dimensione. Quando arriveranno le illustrazioni
 * definitive (docs/asset-da-generare.md) basterà sostituire questi componenti.
 */

/** Mizi a figura intera. `saluta` alza l'ala destra (a sinistra per chi guarda). */
export function MiziIntero({
  saluta = true,
  className = "h-full w-full",
}: {
  saluta?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden>
      {/* ala che saluta, dietro il corpo */}
      {saluta ? (
        <ellipse cx="38" cy="86" rx="14" ry="40" fill={COLORI.nero} transform="rotate(-38 38 86)" />
      ) : (
        <ellipse cx="34" cy="150" rx="13" ry="38" fill={COLORI.nero} transform="rotate(16 34 150)" />
      )}
      <ellipse cx="166" cy="150" rx="13" ry="38" fill={COLORI.nero} transform="rotate(-16 166 150)" />

      {/* zampe */}
      <ellipse cx="76" cy="226" rx="20" ry="10" fill={COLORI.arancione} />
      <ellipse cx="124" cy="226" rx="20" ry="10" fill={COLORI.arancione} />

      {/* corpo e pancia */}
      <ellipse cx="100" cy="136" rx="68" ry="88" fill={COLORI.nero} />
      <ellipse cx="100" cy="156" rx="46" ry="62" fill={COLORI.bianco} />

      {/* faccia */}
      <ellipse cx="100" cy="84" rx="42" ry="34" fill={COLORI.bianco} />
      <circle cx="84" cy="78" r="7" fill={COLORI.nero} />
      <circle cx="116" cy="78" r="7" fill={COLORI.nero} />
      <circle cx="86.5" cy="75.5" r="2.2" fill={COLORI.bianco} />
      <circle cx="118.5" cy="75.5" r="2.2" fill={COLORI.bianco} />
      <path d="M92 92 L108 92 L100 103 Z" fill={COLORI.arancione} />
      <circle cx="70" cy="94" r="6" fill="#F28AB2" opacity="0.55" />
      <circle cx="130" cy="94" r="6" fill="#F28AB2" opacity="0.55" />

      {/* sciarpa gialla */}
      <path
        d="M56 112 Q100 130 144 112 L144 126 Q100 144 56 126 Z"
        fill="#F9C846"
      />
      <path d="M120 124 L134 168 L112 164 Z" fill="#F9C846" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Le tre scenette di "Come funziona"                                  */
/* ------------------------------------------------------------------ */

/** Passo 1: si sceglie l'età toccando un bottone grande. */
export function ScenaScegliEta({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      {[
        { x: 12, n: "3", attivo: false },
        { x: 82, n: "4", attivo: true },
        { x: 152, n: "5", attivo: false },
      ].map(({ x, n, attivo }) => (
        <g key={n}>
          <rect
            x={x}
            y={attivo ? 18 : 26}
            width="56"
            height="56"
            rx="16"
            fill={attivo ? "#9B6DD6" : COLORI.bianco}
            stroke={attivo ? "none" : "#F6E3CF"}
            strokeWidth="3"
          />
          <text
            x={x + 28}
            y={attivo ? 58 : 66}
            textAnchor="middle"
            fontSize="30"
            fontWeight="800"
            fill={attivo ? COLORI.bianco : "#1F2430"}
            fontFamily="inherit"
          >
            {n}
          </text>
        </g>
      ))}
      {/* la manina che tocca */}
      <g transform="translate(96 66)">
        <circle cx="18" cy="34" r="18" fill="#F2B58B" />
        <rect x="12" y="-2" width="13" height="34" rx="6.5" fill="#F2B58B" />
      </g>
    </svg>
  );
}

/** Passo 2: Mizi spiega a voce e con il fumetto. */
export function ScenaMiziSpiega({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      <g transform="translate(4 34) scale(0.9)">
        <FacciaMizi emozione="felice" className="" />
      </g>
      {/* fumetto */}
      <g>
        <rect x="98" y="18" width="112" height="62" rx="18" fill={COLORI.bianco} stroke="#F6E3CF" strokeWidth="3" />
        <path d="M100 62 L84 78 L104 72 Z" fill={COLORI.bianco} stroke="#F6E3CF" strokeWidth="3" strokeLinejoin="round" />
        <text x="112" y="58" fontSize="20" fontWeight="800" fill="#1F2430" fontFamily="inherit">
          Tocca il
        </text>
        <circle cx="192" cy="50" r="13" fill="#F9C846" />
        <text x="192" y="57" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1F2430" fontFamily="inherit">3</text>
      </g>
      {/* onde della voce */}
      <path d="M74 22 Q80 28 74 34" stroke="#9B6DD6" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M82 16 Q92 28 82 40" stroke="#9B6DD6" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Passo 3: niente timer, solo stelle e "Ancora". */
export function ScenaSenzaFretta({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      {/* orologio barrato: qui il tempo non conta */}
      <g transform="translate(18 20)">
        <circle cx="30" cy="30" r="26" fill={COLORI.bianco} stroke="#F6E3CF" strokeWidth="3" />
        <path d="M30 16 L30 30 L42 36" stroke="#4A5164" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M8 52 L52 8" stroke="#E8474B" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* stelle */}
      {[
        { x: 106, y: 30, s: 1 },
        { x: 142, y: 16, s: 1.3 },
        { x: 182, y: 32, s: 1 },
      ].map(({ x, y, s }, i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) scale(${s})`}
          d="M0 -14 L4 -4 L15 -4 L6 3 L9 14 L0 7 L-9 14 L-6 3 L-15 -4 L-4 -4 Z"
          fill="#F9C846"
        />
      ))}
      {/* bottone Ancora */}
      <rect x="100" y="62" width="104" height="44" rx="22" fill="#F28AB2" />
      <text x="152" y="91" textAnchor="middle" fontSize="24" fontWeight="800" fill={COLORI.bianco} fontFamily="inherit">
        Ancora
      </text>
    </svg>
  );
}

/**
 * La mini-illustrazione di un gioco per competenza. Le scenette disegnate a
 * mano (SCENE_SKILL, sopra) risultavano poco leggibili: ora si delega alla
 * libreria di icone Twemoji in components/icone.tsx, molto più chiara.
 */
export function IllustrazioneSkill({ skill }: { skill: Skill }) {
  return <IconaGioco skill={skill} />;
}

/* ------------------------------------------------------------------ */
/* Scenette delle sezioni (storie, coding, biglietti, compiti)         */
/* ------------------------------------------------------------------ */

export function ScenaStorie({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      <g transform="translate(58 4) scale(1.1)"><Disegno id="libro" className="" /></g>
      <text x="36" y="60" fontSize="26" fontWeight="800" fill="#9B6DD6" fontFamily="inherit">A</text>
      <text x="26" y="96" fontSize="24" fontWeight="800" fill="#3DB5E6" fontFamily="inherit" fontStyle="italic">a</text>
      <text x="176" y="60" fontSize="26" fontWeight="800" fill="#F28AB2" fontFamily="inherit">a</text>
    </svg>
  );
}

export function ScenaCoding({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      {[0, 1, 2, 3].map((c) => (
        <rect key={c} x={16 + c * 48} y={40} width="42" height="42" rx="10" fill={COLORI.bianco} stroke="#F6E3CF" strokeWidth="3" />
      ))}
      <g transform="translate(20 44) scale(0.36)"><Disegno id="pinguino" className="" /></g>
      <text x="85" y="70" textAnchor="middle" fontSize="28" fontWeight="800" fill="#9B6DD6" fontFamily="inherit">→</text>
      <text x="133" y="70" textAnchor="middle" fontSize="28" fontWeight="800" fill="#9B6DD6" fontFamily="inherit">→</text>
      <g transform="translate(164 44) scale(0.36)"><Disegno id="pesce" className="" /></g>
    </svg>
  );
}

export function ScenaBiglietti({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      <rect x="60" y="10" width="80" height="110" rx="10" fill={COLORI.bianco} stroke="#F6E3CF" strokeWidth="4" />
      <circle cx="100" cy="42" r="14" fill="#F28AB2" />
      <path d="M100 56 L100 74" stroke="#4A5164" strokeWidth="2.5" />
      <circle cx="80" cy="36" r="10" fill="#3DB5E6" />
      <path d="M80 46 L80 74" stroke="#4A5164" strokeWidth="2.5" />
      <circle cx="120" cy="34" r="10" fill="#F9C846" />
      <path d="M120 44 L120 74" stroke="#4A5164" strokeWidth="2.5" />
      <text x="100" y="100" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1F2430" fontFamily="inherit">SOFIA 5</text>
      <g transform="translate(150 68) scale(0.5)"><Disegno id="torta" className="" /></g>
    </svg>
  );
}

export function ScenaCompiti({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden>
      <rect x="64" y="8" width="92" height="114" rx="8" fill={COLORI.bianco} stroke="#F6E3CF" strokeWidth="4" />
      <text x="80" y="42" fontSize="20" fontWeight="800" fill="#1F2430" fontFamily="inherit">3 + 4 =</text>
      <text x="146" y="42" fontSize="20" fontWeight="800" fill="#4CAF6D" fontFamily="inherit">7</text>
      <text x="80" y="74" fontSize="20" fontWeight="800" fill="#1F2430" fontFamily="inherit">5 + 2 =</text>
      <rect x="138" y="58" width="24" height="22" rx="6" fill="none" stroke="#9B6DD6" strokeWidth="3" strokeDasharray="5 4" />
      <path d="M30 108 L54 84" stroke="#F59A23" strokeWidth="9" strokeLinecap="round" />
      <path d="M54 84 L60 78" stroke="#F2B58B" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}
