"use client";

import { useCallback, useState } from "react";
import { componenti } from "@/games/componenti";
import { registraPartita } from "@/lib/partite";
import { DopoIlGioco } from "@/components/form/DopoIlGioco";

/**
 * Monta il gioco e raccoglie il risultato.
 * L'avanzamento viene registrato in locale (per proporre il form al momento
 * giusto) e inviato al server solo se c'è una sessione: i giochi restano
 * liberi e senza login (piano §2, decisione 1).
 */
export function Giocatore({
  slug,
  titolo,
  eta,
  difficolta,
  demo,
}: {
  slug: string;
  titolo: string;
  eta: number;
  difficolta: 1 | 2 | 3;
  demo: boolean;
}) {
  const Gioco = componenti[slug];

  const [finita, setFinita] = useState(false);

  const alTermine = useCallback(
    (esito: { score: number; stars: number }) => {
      registraPartita(slug);
      setFinita(true);

      void fetch("/api/progresso", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, ...esito }),
      }).catch(() => {
        // Il salvataggio non deve mai disturbare chi sta giocando.
      });
    },
    [slug],
  );

  if (!Gioco) return null;

  return (
    <>
      <Gioco
        key={`${slug}-${eta}`}
        age={eta}
        difficulty={difficolta}
        demo={demo}
        onComplete={alTermine}
        aria-label={titolo}
      />
      {/* La proposta arriva a partita finita, mai durante */}
      {finita && <DopoIlGioco />}
    </>
  );
}
