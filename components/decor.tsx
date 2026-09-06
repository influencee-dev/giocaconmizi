import type { ReactNode } from "react";

/**
 * Decorazioni del template vetrina (impostazione da UI kit per bambini):
 * onde fra le sezioni, cerchio-blob dietro la mascotte, stelline sparse.
 * Solo SVG: nessun asset esterno, nitide a ogni densità di schermo.
 */

/** Onda di separazione fra due bande. `colore` è il riempimento dell'onda
 *  (il colore della banda che ARRIVA sotto). `capovolta` la specchia. */
export function Onda({
  colore = "#FFFFFF",
  capovolta = false,
  className = "",
}: {
  colore?: string;
  capovolta?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={`-mb-px w-full overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className={`block h-8 w-full sm:h-12 ${capovolta ? "rotate-180" : ""}`}
      >
        <path
          d="M0 32 C 180 64, 360 0, 540 24 C 720 48, 900 8, 1080 24 C 1260 40, 1350 48, 1440 32 L 1440 64 L 0 64 Z"
          fill={colore}
        />
      </svg>
    </div>
  );
}

/** Cerchio morbido dietro la mascotte, con anello tratteggiato. */
export function Blob({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Anello e cerchio DENTRO i confini del box: niente sbordi. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full border-4 border-dashed border-giallo/60"
      />
      <div aria-hidden className="absolute inset-2 rounded-full bg-azzurro/20" />
      <div className="relative flex h-full w-full items-center justify-center">{children}</div>
    </div>
  );
}

/** Stelline e cuoricini che fluttuano attorno all'hero. */
export function Stelline({ className = "" }: { className?: string }) {
  const voci = [
    { x: "6%", y: "12%", colore: "#F9C846", scala: 1 },
    { x: "88%", y: "8%", colore: "#F28AB2", scala: 0.7 },
    { x: "94%", y: "55%", colore: "#9B6DD6", scala: 0.9 },
    { x: "3%", y: "70%", colore: "#3DB5E6", scala: 0.6 },
    { x: "78%", y: "85%", colore: "#F9C846", scala: 0.5 },
  ];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {voci.map((v, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute h-6 w-6 sm:h-8 sm:w-8"
          style={{ left: v.x, top: v.y, transform: `scale(${v.scala}) rotate(${i * 17}deg)` }}
        >
          {i % 2 === 0 ? (
            <path
              d="M12 2 L14.5 8.5 L21 9 L16 13.5 L17.5 20 L12 16.5 L6.5 20 L8 13.5 L3 9 L9.5 8.5 Z"
              fill={v.colore}
            />
          ) : (
            <path
              d="M12 21 C 5 15, 2 11, 2 7.5 C 2 4.5 4.5 3 7 3 C 9 3 11 4.5 12 6 C 13 4.5 15 3 17 3 C 19.5 3 22 4.5 22 7.5 C 22 11 19 15 12 21 Z"
              fill={v.colore}
            />
          )}
        </svg>
      ))}
    </div>
  );
}
