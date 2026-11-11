"use client";

import { useActionState } from "react";
import { mandaProva, type EsitoProva } from "./azioni";

/** Il bottone «Manda un'email di prova» del pannello Iscritti. */
export function ProvaEmail({ codice }: { codice: string }) {
  const [esito, invia, inviando] = useActionState<EsitoProva, FormData>(mandaProva, { stato: "fermo" });
  return (
    <form action={invia} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="codice" value={codice} />
      <button type="submit" disabled={inviando} className="w-fit rounded-bolla bg-viola px-5 py-2.5 font-extrabold text-white disabled:opacity-60" data-prova-email>
        {inviando ? "Invio…" : "Manda un'email di prova"}
      </button>
      {esito.stato === "partita" && (
        <p role="status" className="break-words rounded-xl bg-[#E3F4E8] px-3 py-2 text-sm font-extrabold text-[#2E7D4A]" data-esito-prova="partita">
          Partita verso {esito.a}: controlla la casella (anche lo spam).
        </p>
      )}
      {esito.stato === "non-partita" && (
        <p role="alert" className="break-words rounded-xl bg-[#FDE4E4] px-3 py-2 text-sm font-extrabold text-rosso" data-esito-prova="non-partita">
          Non partita. Brevo dice: {esito.motivo}
        </p>
      )}
    </form>
  );
}
