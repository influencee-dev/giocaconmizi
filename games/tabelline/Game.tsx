"use client";

import { useCallback, useMemo, useState } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola } from "@/games/_engine/casuale";
import { Contenitore } from "@/components/ui";
import type { EsitoPartita, GameProps } from "@/games/_engine/tipi";
import { DOMANDE_PER_PARTITA, TABELLINE, domandeDi, domandeMiste } from "./domande";

/**
 * Tabelline con Mizi (7–10 anni).
 * Prima si sceglie quale tabellina allenare — o «tutte insieme» —, poi dieci
 * domande. Scegliere è importante: chi sta lavorando sul 7 non vuole il 2.
 *
 * Dal 21/11/2026 le domande vengono da `domande.ts`: tutte diverse, dalle
 * facili alle difficili, con un trucco dopo l'errore. Finita una tabellina,
 * «Ancora» riporta alla scelta, dove quelle già fatte hanno il segno.
 */

type Scelta = number | "mix";

export default function Game(props: GameProps) {
  // ?demo=1 (video e prove automatiche): niente schermata di scelta, tutte insieme.
  const [scelta, setScelta] = useState<Scelta | null>(props.demo ? "mix" : null);
  // Le tabelline finite in questa visita: solo in memoria, niente da salvare.
  const [fatte, setFatte] = useState<Scelta[]>([]);
  const { age, onComplete } = props;

  const round = useMemo<Round[]>(() => {
    if (scelta === null) return [];
    const domande = scelta === "mix" ? domandeMiste(age, mescola) : domandeDi(scelta, mescola);
    return domande.map((d) => ({
      istruzione: `Quanto fa ${d.tabellina} per ${d.fattore}?`,
      mostraTesto: true,
      opzioni: d.opzioni.map((n) => ({ id: String(n), etichetta: String(n), descrizione: `Numero ${n}` })),
      correttaId: String(d.risultato),
      aiuto: d.trucco,
      centro: (
        <span className="text-5xl font-extrabold text-notte" data-domanda={`${d.tabellina}x${d.fattore}`}>
          {d.tabellina} × {d.fattore}
        </span>
      ),
    }));
  }, [scelta, age]);

  const finita = useCallback(
    (esito: EsitoPartita) => {
      if (scelta !== null) setFatte((prima) => (prima.includes(scelta) ? prima : [...prima, scelta]));
      onComplete?.(esito);
    },
    [scelta, onComplete],
  );
  // «Ancora» non ripete le stesse dieci domande: si torna a scegliere.
  const aScegliere = useCallback(() => setScelta(null), []);

  if (scelta === null) {
    const segno = (s: Scelta) =>
      fatte.includes(s) ? (
        <span aria-label="già fatta" className="absolute right-2 top-1.5 text-xl text-verde-forte">
          ✓
        </span>
      ) : null;
    return (
      <Contenitore className="flex min-h-dvh flex-col justify-center py-10">
        <h1 className="text-3xl font-extrabold text-notte">Quale tabellina vuoi allenare?</h1>
        <p className="mt-2 text-lg text-notte-tenue">
          {DOMANDE_PER_PARTITA} domande, dalle più facili alle più difficili. Se sbagli, Mizi ti dice un trucco.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3" data-scelta-tabellina>
          {TABELLINE.map((t) => (
            <button
              key={t}
              type="button"
              data-tabellina={t}
              data-fatta={fatte.includes(t) ? "si" : undefined}
              onClick={() => setScelta(t)}
              className={`relative rounded-morbido border-4 bg-white py-6 text-3xl font-extrabold text-notte ${
                fatte.includes(t) ? "border-verde" : "border-crema-scuro"
              }`}
            >
              {t}
              {segno(t)}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-tabellina="mix"
          data-fatta={fatte.includes("mix") ? "si" : undefined}
          onClick={() => setScelta("mix")}
          className="relative mt-4 rounded-bolla bg-viola px-8 py-5 text-xl font-extrabold text-white"
        >
          Tutte insieme
          {fatte.includes("mix") && (
            <span aria-label="già fatta" className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
              ✓
            </span>
          )}
        </button>
      </Contenitore>
    );
  }

  return (
    <SceltaMultipla
      titolo="Tabelline con Mizi"
      round={round}
      colonne={2}
      {...props}
      onComplete={finita}
      onRicomincia={props.demo ? undefined : aScegliere}
    />
  );
}
