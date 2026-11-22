"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { numero } from "@/games/_engine/casuale";
import { limitePerEta, scelteNumeriche } from "@/games/_engine/numeri";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Decine e unità (6–8 anni).
 * Nove round in quattro modi: si contano barre da dieci e quadratini (che
 * numero è?), si compone il numero da «5 decine e 3 unità», e di un numero
 * scritto si dice quante decine e quante unità ha. A sette anni metà dei
 * numeri sta fra 50 e 60, dove arriva la classe a novembre.
 */

export const FRASI_DECINE = {
  blocchi: "Conta le decine e le unità. Che numero è?",
  componi: "Che numero formano?",
  decine: "Quante decine ci sono in questo numero?",
  unita: "Quante unità ci sono in questo numero?",
  aiutoBlocchi: "Ogni barra lunga vale dieci, ogni quadratino vale uno.",
  aiutoCifre: "Le decine sono la cifra a sinistra, le unità quella a destra.",
} as const;

/** Un numero di due cifre diverse fra loro, con le unità sopra zero. */
function numeroAdatto(eta: number, alto: boolean): number {
  const limite = limitePerEta(eta);
  const minimo = limite === 20 ? 11 : alto ? limite - 9 : 21;
  for (;;) {
    const n = numero(minimo, limite - 1);
    if (n % 10 !== 0 && Math.floor(n / 10) !== n % 10) return n;
  }
}

/** Barre da dieci e quadratini: il numero disegnato coi blocchi. */
function Blocchi({ n }: { n: number }) {
  const decine = Math.floor(n / 10);
  const unita = n % 10;
  const larghezza = decine * 14 + 8 + 2 * 14;

  return (
    <svg viewBox={`0 0 ${larghezza} 104`} className="h-44 w-auto max-w-full" role="img" aria-label="Barre da dieci e quadratini da contare" data-blocchi={n}>
      {Array.from({ length: decine }, (_, d) => (
        <g key={d} transform={`translate(${d * 14} 2)`}>
          <rect width="11" height="100" rx="2" fill="#9b6dd6" />
          <rect x="7" width="4" height="100" rx="2" fill="#000" opacity="0.12" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M0 ${(i + 1) * 10}h11`} stroke="#fff" strokeWidth="1" opacity="0.7" />
          ))}
        </g>
      ))}
      {Array.from({ length: unita }, (_, u) => (
        <g key={u} transform={`translate(${decine * 14 + 8 + (u % 2) * 14} ${92 - Math.floor(u / 2) * 13})`}>
          <rect width="10" height="10" rx="2" fill="#f9a03f" />
          <rect x="6" width="4" height="10" rx="2" fill="#000" opacity="0.12" />
        </g>
      ))}
    </svg>
  );
}

const Grande = ({ children }: { children: React.ReactNode }) => (
  <p className="text-center text-5xl font-extrabold text-notte sm:text-6xl" data-numero>{children}</p>
);

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const scambiato = (n: number) => (n % 10) * 10 + Math.floor(n / 10);
    const tipi = ["blocchi", "blocchi", "componi", "decine", "unita", "blocchi", "componi", "decine", "unita"] as const;

    return tipi.map((tipo, i): Round => {
      const n = numeroAdatto(props.age, i % 2 === 1);
      const decine = Math.floor(n / 10);
      const unita = n % 10;

      if (tipo === "blocchi") {
        return {
          istruzione: FRASI_DECINE.blocchi,
          opzioni: scelteNumeriche(n, [scambiato(n), n + 10, n - 10, n + 1, n - 1]),
          correttaId: String(n),
          aiuto: FRASI_DECINE.aiutoBlocchi,
          centro: <Blocchi n={n} />,
        };
      }
      if (tipo === "componi") {
        return {
          istruzione: FRASI_DECINE.componi,
          opzioni: scelteNumeriche(n, [scambiato(n), decine + unita, n + 10]),
          correttaId: String(n),
          aiuto: FRASI_DECINE.aiutoCifre,
          centro: (
            <p className="text-center text-3xl font-extrabold leading-snug text-notte sm:text-4xl" data-componi={n}>
              <span className="text-viola">{decine} decine</span> e <span className="text-arancione">{unita} unità</span>
            </p>
          ),
        };
      }
      const giusto = tipo === "decine" ? decine : unita;
      return {
        istruzione: tipo === "decine" ? FRASI_DECINE.decine : FRASI_DECINE.unita,
        opzioni: scelteNumeriche(giusto, [tipo === "decine" ? unita : decine, decine + unita, giusto + 1]),
        correttaId: String(giusto),
        aiuto: FRASI_DECINE.aiutoCifre,
        centro: <Grande>{n}</Grande>,
      };
    });
  }, [props.age]);

  return <SceltaMultipla titolo="Decine e unità" round={round} colonne={3} {...props} />;
}
