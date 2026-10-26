import { MOTIVI } from "./motivi";

/**
 * Lo sfondo di un biglietto.
 *
 * Regola unica della §14.4 del piano: **centro libero**. I motivi stanno solo
 * lungo i bordi e negli angoli, perché al centro ci va il testo e senza spazio
 * bianco il biglietto non si legge.
 *
 * Tre varianti: "chiaro" (fondo crema, motivi radi), "colorato" (fondo tinta
 * piena, motivi più fitti e in negativo) e "colorare": fondo bianco e gli
 * stessi motivi a soli contorni neri, da stampare e far colorare al bambino.
 */

export type Variante = "chiaro" | "colorato" | "colorare";

export const VARIANTI: { id: Variante; etichetta: string }[] = [
  { id: "chiaro", etichetta: "Chiaro" },
  { id: "colorato", etichetta: "Colorato" },
  { id: "colorare", etichetta: "Da colorare" },
];

/**
 * La versione da colorare non ridisegna niente: un foglio di stile dentro
 * l'SVG del biglietto riempie di bianco ogni forma e le dà un contorno scuro.
 * Il CSS vince sugli attributi fill/stroke dei disegni, quindi vale per tutti
 * i temi, gli adesivi e Mizi senza toccarli. Gli spessori sono nelle unità di
 * ciascun disegno (motivi 40×40, adesivi e Mizi 100×100).
 * Le classi esistono SOLO sui biglietti da colorare: il foglio di stile di un
 * SVG in pagina vale per tutto il documento.
 */
export const CSS_DA_COLORARE = [
  ".dc-linea path,.dc-linea circle,.dc-linea ellipse,.dc-linea rect,.dc-linea polygon,.dc-linea polyline,.dc-linea line{fill:#FFFFFF;stroke:#1F2430;stroke-linejoin:round;stroke-linecap:round;opacity:1}",
  '.dc-linea [fill="none"]{fill:none}',
  '.dc-linea [fill="transparent"]{fill:none;stroke:none}',
  ".dc-motivo path,.dc-motivo circle,.dc-motivo ellipse,.dc-motivo rect,.dc-motivo polygon,.dc-motivo polyline,.dc-motivo line{stroke-width:1.15px}",
  ".dc-disegno path,.dc-disegno circle,.dc-disegno ellipse,.dc-disegno rect,.dc-disegno polygon,.dc-disegno polyline,.dc-disegno line{stroke-width:2.6px}",
].join("");

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
  // Il motivo è disegnato in un riquadro 40×40: qui lo si porta alla scala del biglietto.
  const lato = Math.min(larghezza, altezza) * 0.105;

  if (variante === "colorare") {
    return (
      <g>
        <rect x="0" y="0" width={larghezza} height={altezza} fill="#FFFFFF" />
        <g className="dc-linea dc-motivo">
          {CORIANDOLI.map((punto, i) => (
            <circle
              key={`coriandolo-${i}`}
              cx={(punto.x / 100) * larghezza}
              cy={(punto.y / 100) * altezza}
              r={lato * 0.09}
              style={{ strokeWidth: lato * 0.02 }}
            />
          ))}
        </g>
        {CORNICE.map((posto, i) => {
          const x = (posto.x / 100) * larghezza;
          const y = (posto.y / 100) * altezza;
          // Un po' più grandi: sono da colorare, servono spazi larghi.
          const dimensione = lato * posto.scala * 1.2;
          return (
            <g
              key={`motivo-${i}`}
              className="dc-linea dc-motivo"
              transform={`translate(${x - dimensione / 2} ${y - dimensione / 2}) rotate(${posto.ruota} ${dimensione / 2} ${dimensione / 2}) scale(${dimensione / 40})`}
            >
              {scheda.motivo(scheda.tinte)}
            </g>
          );
        })}
      </g>
    );
  }

  const fondo = variante === "chiaro" ? "#FFF9F2" : primo;
  const opacitaMotivi = variante === "chiaro" ? 0.85 : 0.9;
  const tinteMotivo: [string, string, string] =
    variante === "chiaro" ? scheda.tinte : ["#FFFFFF", secondo, terzo];

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
