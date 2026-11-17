"use client";

import { useCallback, useMemo, useState } from "react";
import { componenti } from "@/games/componenti";
import { registraPartita } from "@/lib/giochi/partite";
import { registraNellAlbum, type EsitoAlbum, type GiocoBreve } from "@/lib/giochi/album";
import { ContestoPartita, type Partita } from "@/components/game-shell/partita";
import { DopoIlGioco } from "@/components/form/DopoIlGioco";

/**
 * Monta il gioco e raccoglie il risultato.
 * L'avanzamento viene registrato in locale (l'album di Mizi e il conto per
 * proporre il form al momento giusto) e inviato al server solo se c'è una
 * sessione: i giochi restano liberi e senza login (piano §2, decisione 1).
 */
export function Giocatore({
  slug,
  titolo,
  eta,
  difficolta,
  demo,
  giochi,
}: {
  slug: string;
  titolo: string;
  eta: number;
  difficolta: 1 | 2 | 3;
  demo: boolean;
  /** Tutti i giochi giocabili: la festa finale ne propone uno. */
  giochi: GiocoBreve[];
}) {
  const Gioco = componenti[slug];

  const [finita, setFinita] = useState(false);
  const [esito, setEsito] = useState<EsitoAlbum | null>(null);

  const alTermine = useCallback(
    (risultato: { score: number; stars: number }) => {
      registraPartita(slug);
      // Le partite dimostrative (?demo=1, per i reel) non riempiono l'album.
      if (!demo) setEsito(registraNellAlbum(slug, risultato.stars));
      setFinita(true);

      void fetch("/api/progresso", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, ...risultato }),
      }).catch(() => {
        // Il salvataggio non deve mai disturbare chi sta giocando.
      });
    },
    [slug, demo],
  );

  const azzera = useCallback(() => setEsito(null), []);
  const partita = useMemo<Partita>(() => ({ slug, titolo, eta, giochi, esito, azzera }), [slug, titolo, eta, giochi, esito, azzera]);

  if (!Gioco) return null;

  return (
    <ContestoPartita.Provider value={partita}>
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
    </ContestoPartita.Provider>
  );
}
