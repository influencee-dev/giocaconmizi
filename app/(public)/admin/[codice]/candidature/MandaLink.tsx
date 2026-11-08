"use client";

import { useActionState } from "react";
import { mandaLinkCandidatura, type EsitoInvio } from "./azioni";

/** Il bottone «Manda il link personale» di una candidatura «accesso». */
export function MandaLink({ codice, id, email }: { codice: string; id: number; email: string }) {
  const [esito, invia, inviando] = useActionState<EsitoInvio, FormData>(mandaLinkCandidatura, { stato: "fermo" });
  if (esito.stato === "mandato") {
    return <p className="mt-4 rounded-xl bg-[#E3F4E8] px-4 py-3 text-sm font-extrabold text-[#2E7D4A]">Link mandato a {esito.a}.</p>;
  }
  if (esito.stato === "da-copiare") {
    return (
      <div className="mt-4 flex flex-col gap-1 rounded-xl bg-[#FFF4D6] p-3 text-sm">
        <p className="font-extrabold text-notte">{esito.motivo} Copialo ora: non lo rivedrai.</p>
        <input readOnly value={esito.link} onFocus={(e) => e.currentTarget.select()} className="w-full rounded-lg border border-notte/15 bg-white px-2 py-1 font-mono text-xs text-notte" />
      </div>
    );
  }
  return (
    <form action={invia} className="mt-4 flex flex-col gap-1">
      <input type="hidden" name="codice" value={codice} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={inviando} className="w-fit rounded-bolla bg-viola px-5 py-2.5 font-extrabold text-white disabled:opacity-60" data-manda-link>
        {inviando ? "Invio…" : `Manda il link personale a ${email}`}
      </button>
      <span className="text-xs font-semibold text-notte-tenue">Prima controlla che gestisca davvero questa attività (sito ufficiale, email del dominio, telefono).</span>
      {esito.stato === "errore" && <p role="alert" className="text-sm font-bold text-rosso">{esito.messaggio}</p>}
    </form>
  );
}
