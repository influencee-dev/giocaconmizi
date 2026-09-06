import { Disegno, type NomeFigura } from "./arte";
import type { Comando } from "./GrigliaCoding";

/**
 * Scena di coding "da leggere": una griglia disegnata e un programma già
 * scritto. Serve ai giochi in cui non si compone il programma ma lo si
 * interpreta (Dove arriva Mizi?, Trova il bug). Nessuno stato: è un disegno.
 */

export interface OggettoInCella {
  x: number;
  y: number;
  figura: NomeFigura;
}

const FRECCE: Record<Comando, string> = {
  su: "↑",
  giu: "↓",
  sinistra: "←",
  destra: "→",
  avanti: "avanti",
  giraDx: "↻",
  giraSx: "↺",
};

export function GrigliaScena({
  lato,
  mizi,
  oggetti,
  muri = [],
}: {
  lato: number;
  /** Dove sta Mizi all'inizio. */
  mizi: [number, number];
  oggetti: OggettoInCella[];
  muri?: string[];
}) {
  const celle = Array.from({ length: lato * lato }, (_, i) => [i % lato, Math.floor(i / lato)]);
  const insiemeMuri = new Set(muri);

  return (
    <div
      className="grid w-full max-w-xs gap-1 rounded-morbido bg-white p-2"
      style={{ gridTemplateColumns: `repeat(${lato}, minmax(0, 1fr))` }}
    >
      {celle.map(([x, y]) => {
        const oggetto = oggetti.find((o) => o.x === x && o.y === y);
        const quiMizi = mizi[0] === x && mizi[1] === y;
        return (
          <div
            key={`${x},${y}`}
            className={`flex aspect-square items-center justify-center rounded-lg ${
              insiemeMuri.has(`${x},${y}`) ? "bg-notte-tenue" : "bg-crema"
            }`}
          >
            {quiMizi && (
              <div className="h-full w-full p-0.5">
                <Disegno id="pinguino" titolo="Mizi" />
              </div>
            )}
            {oggetto && !quiMizi && (
              <div className="h-full w-full p-1">
                <Disegno id={oggetto.figura} titolo={oggetto.figura} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Il programma scritto, comando per comando, eventualmente numerato. */
export function ProgrammaScritto({
  comandi,
  numerato = false,
}: {
  comandi: Comando[];
  numerato?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {comandi.map((c, i) => (
        <span key={i} className="flex flex-col items-center gap-0.5">
          {numerato && <span className="text-xs font-bold text-notte-tenue">{i + 1}</span>}
          <span className="rounded-lg bg-viola px-3 py-1.5 text-xl font-extrabold text-white">
            {FRECCE[c]}
          </span>
        </span>
      ))}
    </div>
  );
}
