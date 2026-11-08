"use client";

import { useState, useTransition } from "react";
import { pubblicaPost, type EsitoPubblicazione } from "./azioni";

/** Didascalia modificabile e pubblicazione di un post (una sola azione primaria). */
export function SchedaPost({
  codice,
  id,
  link,
  didascaliaIniziale,
  collegato,
}: {
  codice: string;
  id: string;
  link: string;
  didascaliaIniziale: string;
  collegato: boolean;
}) {
  const [didascalia, setDidascalia] = useState(didascaliaIniziale);
  const [esito, setEsito] = useState<EsitoPubblicazione | null>(null);
  const [inCorso, avvia] = useTransition();
  const manca = !didascalia.includes(link);
  const troppo = didascalia.length > 2200;

  return (
    <div className="mt-4">
      <label htmlFor={`didascalia-${id}`} className="text-sm font-bold text-notte">
        Didascalia
      </label>
      <textarea
        id={`didascalia-${id}`}
        value={didascalia}
        onChange={(e) => setDidascalia(e.target.value)}
        rows={9}
        className="mt-1 w-full rounded-2xl border border-notte/15 bg-white p-3 text-base leading-relaxed text-notte focus:border-viola focus:outline-none"
      />
      <p className={`mt-1 text-sm ${troppo || manca ? "font-bold text-rosso" : "text-notte-tenue"}`}>
        {didascalia.length.toLocaleString("it-IT")} / 2.200 caratteri
        {manca && ` · deve restare il link ${link}`}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!collegato || inCorso || manca || troppo || esito?.ok === true}
          onClick={() => avvia(async () => setEsito(await pubblicaPost(codice, id, didascalia)))}
          className="rounded-2xl bg-viola px-5 py-3 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {inCorso ? "Pubblicazione in corso…" : esito?.ok ? "Pubblicato" : "Pubblica su Instagram"}
        </button>
        {!collegato && <span className="text-sm text-notte-tenue">Instagram non è ancora collegato.</span>}
      </div>

      {esito && (
        <p role="status" className={`mt-3 font-bold ${esito.ok ? "text-verde" : "text-rosso"}`}>
          {esito.ok ? (
            <>
              {esito.gia ? "Era già stato pubblicato: " : "Pubblicato: "}
              <a href={esito.permalink} target="_blank" rel="noopener" className="underline">
                apri su Instagram
              </a>
            </>
          ) : (
            esito.errore
          )}
        </p>
      )}
    </div>
  );
}
