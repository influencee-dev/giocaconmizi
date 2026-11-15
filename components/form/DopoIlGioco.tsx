"use client";

import { useEffect, useState } from "react";
import { FormGenitore } from "./FormGenitore";
import { partiteFinite } from "@/lib/partite";

/**
 * Il form si propone dopo il secondo gioco completato (piano §2, decisione 1):
 * non all'ingresso, non prima di giocare. Se lo si chiude non torna più.
 *
 * Sta SOPRA lo schermo di gioco (fixed, z-60): fino al 15/11/2026 era
 * «absolute z-10», cioè sotto il guscio dei giochi (fixed z-50). Nessuno lo
 * vedeva, e veniva pure segnato come già proposto. Per questo la chiave ha il
 * «-2»: chi l'aveva «visto» senza vederlo lo incontra una volta davvero.
 * Arriva qualche secondo dopo la festa: prima la figurina, poi i grandi.
 */

const CHIAVE = "mizi.form-proposto-2";
const ATTESA_MS = 3500;

export function DopoIlGioco() {
  const [visibile, setVisibile] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem(CHIAVE)) return;
        if (partiteFinite() < 2) return;
        setVisibile(true);
        window.localStorage.setItem(CHIAVE, "1");
      } catch {
        // Storage bloccato: semplicemente non si propone niente.
      }
    }, ATTESA_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (!visibile) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-notte/40 p-4" data-dopo-il-gioco>
      <div className="w-full max-w-md">
        <FormGenitore
          origine="dopo-il-gioco"
          titolo="Vi mandiamo i giochi nuovi?"
          sottotitolo="Una email ogni tanto, con i giochi e le storie nuove per l'età di tuo figlio. Niente pubblicità."
          onChiudi={() => setVisibile(false)}
        />
      </div>
    </div>
  );
}
