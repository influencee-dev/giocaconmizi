"use client";

import { useState } from "react";
import { Condividi } from "@/components/ui/Condividi";
import { PERCORSO } from "@/lib/famiglia/sotto-pressione";
import { url } from "@/lib/seo/seo";

/**
 * I tasti per condividere il test «sotto pressione».
 *
 * 1. «Condividi nelle storie» (26/11/2026, richiesta di Giorgia): prepara
 *    l'immagine verticale del test (/genitori/sotto-pressione/storia, 1080×1920)
 *    e copia il link. Sul telefono si apre il foglio di condivisione con
 *    l'immagine: si sceglie Instagram → Storia (o WhatsApp → Stato), poi si
 *    aggiunge lo sticker «Link» e si incolla. Dove il telefono non condivide
 *    immagini, l'immagine si scarica. Il link è anche scritto nell'immagine
 *    (giocamizi.it/test, che porta al test).
 * 2. Il tasto comune del sito (components/ui/Condividi.tsx) per mandare il link.
 *
 * Nel messaggio e nell'immagine c'è solo l'invito: MAI il risultato di chi ha
 * compilato.
 */
const IMMAGINE = `${PERCORSO.percorso}/storia`;
const LINK_STORIA = `${url(PERCORSO.percorso)}?utm_source=storia&utm_medium=social&utm_campaign=test-sotto-pressione`;

export function CondividiTest({ compatto = false }: { compatto?: boolean }) {
  const [stato, setStato] = useState<"" | "prepara" | "condivisa" | "scaricata">("");

  async function nelleStorie() {
    setStato("prepara");
    try {
      await navigator.clipboard?.writeText(LINK_STORIA);
    } catch {
      // senza appunti: il link è comunque scritto nell'immagine
    }
    try {
      const blob = await (await fetch(IMMAGINE)).blob();
      const file = new File([blob], "test-mamma-sotto-pressione-giocamizi.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          setStato("condivisa");
          return;
        } catch (e) {
          if ((e as Error)?.name === "AbortError") {
            setStato("");
            return;
          }
        }
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 30_000);
      setStato("scaricata");
    } catch {
      setStato("");
    }
  }

  return (
    <div className="flex flex-col gap-3" data-condividi-test>
      <div className="flex flex-col gap-2" data-condividi-storia>
        <button
          type="button"
          onClick={nelleStorie}
          disabled={stato === "prepara"}
          className={`inline-flex min-h-14 w-fit items-center gap-2.5 rounded-2xl bg-viola px-6 py-3 font-extrabold text-white shadow-[0_10px_24px_-14px_rgba(155,109,214,0.9)] hover:bg-notte disabled:opacity-70 ${compatto ? "text-base" : "text-lg"}`}
        >
          <svg aria-hidden viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <circle cx="12" cy="11" r="3" />
          </svg>
          {stato === "prepara" ? "Preparo la storia…" : "Condividi nelle storie"}
        </button>
        {(stato === "condivisa" || stato === "scaricata") && (
          <p className="max-w-md rounded-2xl bg-viola/10 p-3 text-sm font-semibold text-notte" role="status" data-storia-istruzioni>
            {stato === "scaricata" ? "L'immagine è scaricata e il link è copiato. " : "Il link è copiato. "}
            Nella storia tocca lo sticker <strong>«Link»</strong> e incollalo: chi la guarda arriva dritto al test.
          </p>
        )}
      </div>
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
