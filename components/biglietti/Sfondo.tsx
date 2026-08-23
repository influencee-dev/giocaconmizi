import { MOTIVI } from "./motivi";

/**
 * Lo sfondo di un biglietto.
 *
 * Regola unica della §14.4 del piano: **centro libero**. I motivi stanno solo
 * lungo i bordi e negli angoli, perché al centro ci va il testo e senza spazio
 * bianco il biglietto non si legge.
 *
 * Due varianti: "chiaro" (fondo crema, motivi radi) e "colorato" (fondo tinta
 * piena, motivi più fitti e in negativo).
 */

export type Variante = "chiaro" | "colorato";

/** Posizioni dei motivi lungo la cornice, in percentuale del biglietto. */
const CORNICE: { x: number; y: number; scala: number; ruota: number }[] = [
  { x: 8, y: 7, scala: 1.1, ruota: -12 },
  { x: 30, y: 4, scala: 0.75, ruota: 8 },
  { x: 52, y: 6, scala: 0.9, ruota: -6 },
  { x: 74, y: 4, scala: 0.7, ruota: 14 },
  { x: 91, y: 9, scala: 1.05, ruota: 10 },
  { x: 5, y: 26, scala: 0.7, ruota: 6 },
  { x: 94, y: 27, scala: 0.75, ruota: -8 },
  { x: 6, y: 47, scala: 0.85, ruota: -10 },
  { x: 93, y: 49, scala: 0.8, ruota: 12 },
  { x: 5, y: 68, scala: 0.7, ruota: 8 },
  { x: 95, y: 70, scala: 0.7, ruota: -6 },
  { x: 9, y: 90, scala: 1.05, ruota: 12 },
  { x: 30, y: 94, scala: 0.75, ruota: -8 },
  { x: 50, y: 96, scala: 0.9, ruota: 6 },
  { x: 71, y: 94, scala: 0.7, ruota: -12 },
  { x: 92, y: 91, scala: 1.1, ruota: 8 },
];

/** Coriandoli minuti, per riempire senza invadere. */
const CORIANDOLI = [
  { x: 18, y: 15 }, { x: 82, y: 16 }, { x: 12, y: 36 }, { x: 88, y: 38 },
  { x: 14, y: 58 }, { x: 86, y: 60 }, { x: 20, y: 82 }, { x: 80, y: 84 },
  { x: 42, y: 10 }, { x: 62, y: 12 }, { x: 40, y: 90 }, { x: 60, y: 88 },
];

export function Sfondo({
  tema,
  variante,
  larghezza,
  altezza,
}: {
  tema: string;
  variante: Variante;
  larghezza: number;
  altezza: number;
}) {
  const scheda = MOTIVI[tema] ?? MOTIVI.palloncini;
  const [primo, secondo, terzo] = scheda.tinte;

  const fondo = variante === "chiaro" ? "#FFF9F2" : primo;
  const opacitaMotivi = variante === "chiaro" ? 0.85 : 0.9;
  const tinteMotivo: [string, string, string] =
    variante === "chiaro" ? scheda.tinte : ["#FFFFFF", secondo, terzo];

  // Il motivo è disegnato in un riquadro 40×40: qui lo si porta alla scala del biglietto.
  const lato = Math.min(larghezza, altezza) * 0.105;

  return (
    <g>
      <rect x="0" y="0" width={larghezza} height={altezza} fill={fondo} />

      {/* Alone chiaro al centro: garantisce il contrasto del testo su ogni variante */}
      <ellipse
        cx={larghezza / 2}
        cy={altezza / 2}
        rx={larghezza * 0.42}
        ry={altezza * 0.32}
        fill="#FFFFFF"
        opacity={variante === "chiaro" ? 0.8 : 0.9}
      />

      {CORIANDOLI.map((punto, i) => (
        <circle
          key={`coriandolo-${i}`}
          cx={(punto.x / 100) * larghezza}
          cy={(punto.y / 100) * altezza}
          r={lato * 0.07}
          fill={variante === "chiaro" ? [primo, secondo, terzo][i % 3] : "#FFFFFF"}
          opacity="0.7"
        />
      ))}

      {CORNICE.map((posto, i) => {
        const x = (posto.x / 100) * larghezza;
        const y = (posto.y / 100) * altezza;
        const dimensione = lato * posto.scala;
        return (
          <g
            key={`motivo-${i}`}
            transform={`translate(${x - dimensione / 2} ${y - dimensione / 2}) rotate(${posto.ruota} ${dimensione / 2} ${dimensione / 2}) scale(${dimensione / 40})`}
            opacity={opacitaMotivi}
          >
            {scheda.motivo(tinteMotivo)}
          </g>
        );
      })}
    </g>
  );
}

/** Il colore del testo che legge bene sopra questo sfondo. */
export function inchiostro(tema: string, variante: Variante): string {
  // Il centro è sempre schiarito, quindi il blu notte va bene su entrambe le
  // varianti; resta parametrico per quando arriveranno gli sfondi fotografici.
  void tema;
  void variante;
  return "#1F2430";
}
