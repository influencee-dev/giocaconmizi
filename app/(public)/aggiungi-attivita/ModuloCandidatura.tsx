"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { proponi, type EsitoCandidatura } from "./azioni";

/** Il modulo: «aggiungete la mia attività» o «gestisco una scheda che c'è già». */

const campo = "w-full min-w-0 rounded-2xl border-2 border-crema-scuro bg-white px-4 py-3 text-base focus:border-viola";

export function ModuloCandidatura({
  schede,
  categorie,
  citta,
}: {
  schede: { chiave: string; nome: string; citta: string }[];
  categorie: { slug: string; nome: string }[];
  citta: string[];
}) {
  const [esito, invia, inviando] = useActionState<EsitoCandidatura, FormData>(proponi, { stato: "fermo" });
  const [tipo, setTipo] = useState<"nuova" | "accesso">("nuova");
  const [cittaScheda, setCittaScheda] = useState("");

  if (esito.stato === "ok") {
    return (
      <div className="mt-10 max-w-2xl rounded-[1.6rem] bg-white p-6 shadow-[0_10px_26px_-16px_rgba(31,36,48,0.5)] sm:p-8" role="status" data-candidatura-ok>
        <p className="text-2xl font-black text-notte">Grazie, richiesta ricevuta!</p>
        <p className="mt-3 text-notte-tenue">
          {esito.tipo === "accesso"
            ? "Controlliamo che tu gestisca davvero questa attività e ti mandiamo per email il link personale della scheda: da lì puoi approvarla, correggerla o chiederne la rimozione."
            : "La controlliamo a mano, di solito entro pochi giorni lavorativi, e ti scriviamo con il link della scheda appena è online."}
        </p>
        <Link href="/feste" className="mt-5 inline-block font-black text-viola underline underline-offset-4">
          Guarda le attività già su Giocamizi
        </Link>
      </div>
    );
  }

  const cittaConSchede = [...new Set(schede.map((s) => s.citta))];

  return (
    <form action={invia} className="mt-10 flex max-w-2xl flex-col gap-6" data-modulo-candidatura>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-lg font-black text-notte">Cosa vuoi fare?</legend>
        {[
          ["nuova", "Aggiungere la mia attività", "non c'è ancora su Giocamizi"],
          ["accesso", "Gestire la scheda della mia attività", "c'è già e voglio correggerla o completarla"],
        ].map(([v, t, d]) => (
          <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-4 ${tipo === v ? "border-viola" : "border-crema-scuro"}`}>
            <input type="radio" name="tipo" value={v} checked={tipo === v} onChange={() => setTipo(v as "nuova" | "accesso")} className="mt-1 h-5 w-5 accent-[#9B6DD6]" />
            <span>
              <span className="block font-black text-notte">{t}</span>
              <span className="block text-sm text-notte-tenue">{d}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {tipo === "accesso" ? (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">Città</span>
            <select value={cittaScheda} onChange={(e) => setCittaScheda(e.target.value)} className={campo} data-campo="citta-scheda">
              <option value="">Scegli la città</option>
              {cittaConSchede.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">La tua attività</span>
            <select name="scheda" required className={campo} disabled={!cittaScheda} data-campo="scheda">
              <option value="">{cittaScheda ? "Scegli l'attività" : "Prima scegli la città"}</option>
              {schede.filter((s) => s.citta === cittaScheda).map((s) => (
                <option key={s.chiave} value={s.chiave}>
                  {s.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">Nome dell&apos;attività</span>
            <input name="nome" required maxLength={120} className={campo} data-campo="nome" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-extrabold">Categoria</span>
              <select name="categoria" required className={campo} data-campo="categoria" defaultValue="">
                <option value="" disabled>
                  Scegli
                </option>
                {categorie.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-extrabold">Città</span>
              <input name="citta" required list="citta-attivita" maxLength={80} className={campo} data-campo="citta" />
              <datalist id="citta-attivita">
                {citta.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">
              Indirizzo o zona <span className="font-bold text-notte-tenue">(facoltativo)</span>
            </span>
            <input name="indirizzo" maxLength={200} className={campo} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">Cosa fate per i bambini</span>
            <textarea name="descrizione" required minLength={40} maxLength={1200} rows={5} className={campo} placeholder="Per esempio: laboratori creativi dai 4 ai 10 anni, feste di compleanno a tema con un educatore, centro estivo." data-campo="descrizione" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-extrabold">
                Età dei bambini <span className="font-bold text-notte-tenue">(facoltativo)</span>
              </span>
              <input name="eta" maxLength={40} placeholder="es. 3–10 anni" className={campo} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-extrabold">
                Sito ufficiale <span className="font-bold text-notte-tenue">(facoltativo)</span>
              </span>
              <input name="sito" inputMode="url" maxLength={200} placeholder="www.…" className={campo} />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">
              Instagram o Facebook <span className="font-bold text-notte-tenue">(facoltativo)</span>
            </span>
            <input name="instagram" maxLength={200} className={campo} />
          </label>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-[1.4rem] bg-white p-5">
        <p className="font-black text-notte">Chi sei</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">Nome e cognome</span>
            <input name="referente" required autoComplete="name" maxLength={120} className={campo} data-campo="referente" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">
              Ruolo <span className="font-bold text-notte-tenue">(facoltativo)</span>
            </span>
            <input name="ruolo" maxLength={80} placeholder="titolare, presidente, responsabile…" className={campo} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">Email</span>
            <input name="email" type="email" required autoComplete="email" maxLength={200} className={campo} data-campo="email" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">
              Telefono <span className="font-bold text-notte-tenue">(facoltativo)</span>
            </span>
            <input name="telefono" type="tel" autoComplete="tel" maxLength={40} className={campo} />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-extrabold">
            Vuoi dirci altro? <span className="font-bold text-notte-tenue">(facoltativo)</span>
          </span>
          <textarea name="messaggio" maxLength={800} rows={3} className={campo} />
        </label>
        <p className="text-sm text-notte-tenue">Telefono ed email servono solo a noi per risponderti: non compaiono sulla scheda se non ce lo chiedi.</p>
      </div>

      {/* Campo trappola per i bot: invisibile alle persone. */}
      <input type="text" name="sito_web_2" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="titolare" value="si" required className="mt-0.5 h-6 w-6 shrink-0 accent-[#9B6DD6]" data-spunta="titolare" />
          <span className="font-semibold">Gestisco questa attività o ho il permesso di chi la gestisce.</span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="termini" value="si" required className="mt-0.5 h-6 w-6 shrink-0 accent-[#9B6DD6]" data-spunta="termini" />
          <span className="font-semibold">
            Accetto i{" "}
            <a href="/termini-attivita" target="_blank" rel="noopener" className="font-black text-viola underline underline-offset-4">
              termini per le attività
            </a>{" "}
            e ho letto{" "}
            <a href="/privacy" target="_blank" rel="noopener" className="font-black text-viola underline underline-offset-4">
              come trattiamo i dati
            </a>
            .
          </span>
        </label>
      </div>

      {esito.stato === "errore" && (
        <p role="alert" className="font-bold text-arancione" data-candidatura-errore>
          {esito.messaggio}
        </p>
      )}

      <button type="submit" disabled={inviando} className="rounded-[1.4rem] bg-viola px-6 py-4 text-lg font-black text-white shadow-[0_12px_28px_-12px_rgba(155,109,214,0.9)] disabled:opacity-60" data-invia>
        {inviando ? "Invio…" : tipo === "accesso" ? "Chiedi l'accesso alla scheda" : "Proponi la mia attività"}
      </button>
    </form>
  );
}
