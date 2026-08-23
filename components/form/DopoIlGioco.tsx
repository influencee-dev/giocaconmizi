"use client";

import { useEffect, useState } from "react";
import { FormGenitore } from "./FormGenitore";
import { partiteFinite } from "@/lib/partite";

/**
 * Il form si propone dopo il secondo gioco completato (piano §2, decisione 1):
 * non all'ingresso, non prima di giocare. Se lo si chiude non torna più.
 */

const CHIAVE = "mizi.form-proposto";

export function DopoIlGioco() {
  const [visibile, setVisibile] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(CHIAVE)) return;
      if (partiteFinite() < 2) return;
      setVisibile(true);
      window.localStorage.setItem(CHIAVE, "1");
    } catch {
      // Storage bloccato: semplicemente non si propone niente.
    }
  }, []);

  if (!visibile) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-notte/40 p-4">
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
