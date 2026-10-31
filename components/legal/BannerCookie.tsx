"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { avviaAnalytics, consensoStatistiche, salvaConsenso } from "./analytics";

/**
 * Banner di consenso del primo ingresso (Garante cookie 2021, ePrivacy).
 *
 * Chiede il consenso per l'unica cosa che lo richiede: le statistiche
 * (Google Analytics). Il testo spiega il perché (per convincere, non per
 * ingannare): "Sì" e "No" hanno stessa dimensione, posizione e leggibilità,
 * e la X chiude rifiutando, come chiedono il Garante (linee guida cookie del
 * 10 giugno 2021) e l'EDPB (rapporto sui cookie banner, 2023). Niente muri,
 * niente rifiuto nascosto; senza scelta non parte nessun tracciamento. I cookie tecnici non richiedono
 * consenso e sono elencati nella cookie policy.
 */
export function BannerCookie() {
  const [visibile, setVisibile] = useState(false);

  useEffect(() => {
    const scelta = consensoStatistiche();
    if (scelta === null) setVisibile(true);
    else if (scelta === "si") avviaAnalytics();
  }, []);

  const scegli = (valore: "si" | "no") => {
    salvaConsenso(valore);
    if (valore === "si") avviaAnalytics();
    setVisibile(false);
  };

  if (!visibile) return null;

  // Una riga discreta: l'informativa completa resta a un tocco di distanza,
  // ma il banner non deve coprire mezzo schermo su ogni pagina.
  return (
    <div
      role="region"
      aria-label="Consenso su cookie e statistiche"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-crema-scuro bg-white px-4 py-2.5 shadow-[0_-4px_20px_rgba(31,36,48,0.08)]"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-4 gap-y-2">
        <p className="min-w-0 flex-1 basis-60 text-xs leading-snug text-notte sm:text-sm">
          <strong>Ci aiuti a fare giochi migliori?</strong> Con il tuo ok contiamo le
          visite con Google Analytics (cookie di terze parti) per capire quali giochi
          piacciono di più ai bambini e quali rifare. Niente pubblicità, niente profilazione;
          se dici no, il sito funziona uguale.{" "}
          Dettagli e ripensamenti nella{" "}
          <Link href="/cookie" className="font-bold text-viola underline underline-offset-2">
            cookie policy
          </Link>{" "}
          e nella{" "}
          <Link href="/privacy" className="font-bold text-viola underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scegli("no")}
            className="rounded-2xl border-2 border-notte bg-white px-4 py-2 text-sm font-extrabold text-notte"
            style={{ minHeight: "2.75rem" }}
          >
            No, grazie
          </button>
          <button
            type="button"
            onClick={() => scegli("si")}
            className="rounded-2xl border-2 border-viola bg-viola px-4 py-2 text-sm font-extrabold text-white"
            style={{ minHeight: "2.75rem" }}
          >
            Sì, volentieri
          </button>
          <button
            type="button"
            onClick={() => scegli("no")}
            aria-label="Chiudi senza accettare"
            className="rounded-2xl px-2 text-xl font-black text-notte-tenue hover:text-notte"
            style={{ minHeight: "2.75rem", minWidth: "2.75rem" }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
