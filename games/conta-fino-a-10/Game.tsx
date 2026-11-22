"use client";

import { useMemo, useState } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { Disegno } from "@/games/_engine/arte";
import { mescola } from "@/games/_engine/casuale";
import type { GameProps } from "@/games/_engine/tipi";
import { parla } from "@/lib/giochi/audio";
import { suona } from "@/lib/giochi/suoni";

/**
 * Conta fino a 10 (3–5 anni).
 * Un banco di pesci da contare e tre numeri fra cui scegliere. I distrattori
 * sono i numeri vicini: è lì che si sbaglia davvero quando si impara a contare.
 *
 * I pesci si toccano uno alla volta: ognuno prende il suo numero e Mizi lo
 * dice («Uno!», «Due!»…). È il modo in cui si impara a contare davvero, un
 * oggetto per ogni parola. Contare così è facoltativo e non è mai un errore.
 * Alla risposta giusta Mizi ripete quanti sono («Cinque pesci!»).
 *
 * Tutte le frasi stanno nel copione della voce, content/voce-mizi.json sotto
 * «conta-fino-a-10».
 */

const NUMERI = ["Uno!", "Due!", "Tre!", "Quattro!", "Cinque!", "Sei!", "Sette!", "Otto!", "Nove!", "Dieci!"];
const QUANTI: Record<number, string> = {
  2: "Due pesci!",
  3: "Tre pesci!",
  5: "Cinque pesci!",
  6: "Sei pesci!",
  8: "Otto pesci!",
  10: "Dieci pesci!",
};

/** Il banco: ogni pesce toccato prende il numero successivo e resta segnato. */
function Banco({ quanti }: { quanti: number }) {
  // L'ordine in cui sono stati toccati: il posto nell'elenco è il numero del pesce.
  const [contati, setContati] = useState<number[]>([]);

  const conta = (pesce: number) => {
    if (contati.includes(pesce)) return;
    suona("gemma");
    parla(NUMERI[contati.length]);
    setContati([...contati, pesce]);
  };

  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2" data-banco data-contati={contati.length}>
      {Array.from({ length: quanti }, (_, i) => {
        const numero = contati.indexOf(i) + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => conta(i)}
            aria-label={numero ? `Pesce numero ${numero}` : "Pesce da contare"}
            data-pesce={numero || "da-contare"}
            className={`relative h-14 w-14 touch-manipulation rounded-full transition-transform duration-150 active:scale-90 ${numero ? "bg-giallo/40" : ""}`}
            style={{ minHeight: 0, minWidth: 0 }}
          >
            <Disegno id="pesce" />
            {numero > 0 && (
              <span className="spunta-entra absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-viola text-sm font-extrabold text-white" aria-hidden>
                {numero}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    // Si parte da pochi pesci e si arriva a dieci.
    const quantita = [2, 3, 5, 6, 8, 10];

    return quantita.map((quanti) => {
      const vicini = [quanti - 1, quanti + 1, quanti + 2].filter((n) => n >= 1 && n <= 10 && n !== quanti);
      const distrattori = mescola(vicini).slice(0, 2);

      return {
        istruzione: "Tocca i pesci per contarli, poi tocca il numero giusto.",
        lode: QUANTI[quanti],
        opzioni: mescola([quanti, ...distrattori]).map((n) => ({
          id: String(n),
          etichetta: String(n),
          descrizione: `Numero ${n}`,
        })),
        correttaId: String(quanti),
        centro: <Banco quanti={quanti} />,
      };
    });
  }, []);

  return <SceltaMultipla titolo="Conta fino a 10" round={round} colonne={3} {...props} />;
}
