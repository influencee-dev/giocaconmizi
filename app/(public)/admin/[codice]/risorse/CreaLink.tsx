"use client";

import { useActionState } from "react";
import { creaLink, type EsitoLink } from "./azioni";

/** Il bottone «Crea link personale»: mostra il link una volta sola, da copiare nell'email. */
export function CreaLink({ codice, slug, giaInviato }: { codice: string; slug: string; giaInviato: boolean }) {
  const [esito, invia, inviando] = useActionState<EsitoLink, FormData>(creaLink, { stato: "fermo" });
  if (esito.stato === "ok") {
    return (
      <div className="flex w-full flex-col gap-1 rounded-xl bg-[#E3F4E8] p-3 text-sm sm:w-auto sm:min-w-[22rem]">
        <p className="font-extrabold text-[#2E7D4A]">Link per {esito.nome}: copialo ora, non lo rivedrai.</p>
        <input
          readOnly
          value={esito.link}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded-lg border border-notte/15 bg-white px-2 py-1 font-mono text-xs text-notte"
        />
      </div>
    );
  }
  return (
    <form action={invia} className="flex flex-col gap-1">
      <input type="hidden" name="codice" value={codice} />
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" disabled={inviando} className="w-fit rounded-xl border-2 border-notte px-3 py-1.5 text-sm font-extrabold text-notte disabled:opacity-60">
        {inviando ? "Creo…" : giaInviato ? "Rinnova il link" : "Crea link personale"}
      </button>
      {esito.stato === "errore" && (
        <p role="alert" className="text-sm font-bold text-rosso">
          {esito.messaggio}
        </p>
      )}
    </form>
  );
}
