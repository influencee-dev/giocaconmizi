"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FacciaMizi } from "@/games/_engine/arte";
import { avviaAnalytics, consensoStatistiche, salvaConsenso } from "./analytics";

/**
 * Banner di consenso del primo ingresso (Garante cookie 2021, ePrivacy).
 *
 * Chiede il consenso per l'unica cosa che lo richiede: le statistiche
 * (Google Analytics). "Accetta" e "Rifiuta" hanno pari evidenza; senza
 * scelta non parte nessun tracciamento. I cookie tecnici non richiedono
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

  return (
    <div
      role="region"
      aria-label="Consenso su cookie e statistiche"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-crema-scuro bg-white p-4 shadow-[0_-4px_20px_rgba(31,36,48,0.08)]"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
        <span className="hidden h-12 w-12 shrink-0 sm:block" aria-hidden>
          <FacciaMizi emozione="felice" />
        </span>
        <p className="flex-1 text-sm leading-snug text-notte">
          Niente pubblicità e niente profilazione. Vorremmo solo usare{" "}
          <strong>statistiche anonime</strong> (Google Analytics) per capire quali
          giochi piacciono di più. Dettagli nella{" "}
          <Link href="/cookie" className="font-bold text-viola underline underline-offset-2">
            cookie policy
          </Link>{" "}
          e nella{" "}
          <Link href="/privacy" className="font-bold text-viola underline underline-offset-2">
            privacy policy
          </Link>
          ; puoi cambiare idea quando vuoi dalla cookie policy.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scegli("no")}
            className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 font-extrabold text-notte"
            style={{ minHeight: "2.75rem" }}
          >
            Rifiuta
          </button>
          <button
            type="button"
            onClick={() => scegli("si")}
            className="rounded-bolla bg-rosa px-5 py-3 font-extrabold text-white"
            style={{ minHeight: "2.75rem" }}
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
