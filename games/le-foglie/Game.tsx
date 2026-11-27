"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { alcuni, mescola } from "@/games/_engine/casuale";
import type { NomeFigura } from "@/games/_engine/arte";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Le foglie (6–8 anni).
 * Prima le quattro parti: una foglia grande con una parte colorata di rosa, e
 * si tocca il suo nome (margine, lamina, nervature, picciolo); alla risposta
 * giusta Mizi dice anche che cos'è. Poi le cinque forme: Mizi dice il nome e
 * cosa ricorda (ovale come un uovo, palmata come una mano aperta, cuoriforme,
 * lanceolata, aghiforme) e si tocca la foglia giusta. Nove round.
 */

type Parte = "margine" | "lamina" | "nervature" | "picciolo";

export const PARTI: Record<Parte, string> = {
  margine: "Il margine: è il bordo della foglia.",
  lamina: "La lamina: è la faccia della foglia.",
  nervature: "Le nervature: sono i tubicini dove passa il nutrimento.",
  picciolo: "Il picciolo: tiene la foglia attaccata al ramo.",
};

export const ISTRUZIONE_PARTE = "Guarda la parte colorata di rosa. Come si chiama?";

export const FORME: { id: string; figura: NomeFigura; istruzione: string }[] = [
  { id: "ovale", figura: "foglia-ovale", istruzione: "Tocca la foglia ovale: è tonda e allungata come un uovo." },
  { id: "palmata", figura: "foglia-palmata", istruzione: "Tocca la foglia palmata: sembra il palmo di una mano aperta." },
  { id: "cuoriforme", figura: "foglia-cuoriforme", istruzione: "Tocca la foglia cuoriforme: ha la forma di un cuore." },
  { id: "lanceolata", figura: "foglia-lanceolata", istruzione: "Tocca la foglia lanceolata: è lunga e stretta come la punta di una lancia." },
  { id: "aghiforme", figura: "foglia-aghiforme", istruzione: "Tocca la foglia aghiforme: è sottile come un ago." },
];

const SAGOMA = "M50 6c32 16 38 54 0 74C12 60 18 22 50 6z";
const ROSA = "#e0457b";

/** Una foglia grande: la parte chiesta è colorata di rosa. */
function Foglia({ parte }: { parte: Parte }) {
  return (
    <svg viewBox="0 0 100 100" className="h-48 w-48" role="img" aria-label="Una foglia con una parte colorata di rosa" data-foglia={parte}>
      <path d="M50 78v20" fill="none" stroke={parte === "picciolo" ? ROSA : "#6b8f3a"} strokeWidth={parte === "picciolo" ? 6 : 4} strokeLinecap="round" />
      <path d={SAGOMA} fill={parte === "lamina" ? "#f7a8c4" : "#6fbf6a"} />
      <path d="M50 6c32 16 38 54 0 74z" fill="#000" opacity="0.08" />
      <g fill="none" stroke={parte === "nervature" ? ROSA : "#2f7a4a"} strokeWidth={parte === "nervature" ? 3.5 : 1.6} strokeLinecap="round">
        <path d="M50 12v66M50 30l-17-8M50 30l17-8M50 44l-23-9M50 44l23-9M50 58l-19-6M50 58l19-6" />
      </g>
      <path d={SAGOMA} fill="none" stroke={parte === "margine" ? ROSA : "#2f7a4a"} strokeWidth={parte === "margine" ? 5 : 2} strokeLinejoin="round" />
    </svg>
  );
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const nomi = Object.keys(PARTI) as Parte[];

    const parti: Round[] = mescola(nomi).map((parte) => ({
      istruzione: ISTRUZIONE_PARTE,
      opzioni: mescola(nomi).map((p) => ({ id: p, etichetta: p, descrizione: p })),
      correttaId: parte,
      lode: PARTI[parte],
      centro: <Foglia parte={parte} />,
      colonne: 2,
    }));

    const forme: Round[] = mescola(FORME).map((forma, i) => ({
      istruzione: forma.istruzione,
      opzioni: mescola([forma, ...alcuni(FORME, i < 2 ? 2 : 3, [forma])]).map((f) => ({
        id: f.id,
        disegno: f.figura,
        descrizione: `Foglia ${f.id}`,
      })),
      correttaId: forma.id,
    }));

    return [...parti, ...forme];
  }, []);

  return <SceltaMultipla titolo="Le foglie" round={round} {...props} />;
}
