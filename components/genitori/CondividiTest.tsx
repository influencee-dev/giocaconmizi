"use client";

import { Condividi } from "@/components/ui/Condividi";
import { PERCORSO } from "@/lib/famiglia/sotto-pressione";

/**
 * Il tasto «Condividi» del test «sotto pressione»: il tasto comune del sito
 * (components/ui/Condividi.tsx) con l'invito del test. Nel messaggio
 * c'è solo l'invito e l'indirizzo: MAI il risultato di chi ha compilato.
 */
export function CondividiTest({ compatto = false }: { compatto?: boolean }) {
  return (
    <div data-condividi-test>
      <Condividi
        percorso={PERCORSO.percorso}
        titolo={PERCORSO.titoloSocial}
        testo={PERCORSO.testoCondividi}
        campagna="test-sotto-pressione"
        etichetta="Condividi il test con le amiche"
        compatto={compatto}
      />
    </div>
  );
}
