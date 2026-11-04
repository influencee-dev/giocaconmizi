"use client";

import { KeyRound, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { proponi, type EsitoCandidatura } from "./azioni";

/** Il modulo: «aggiungete la mia attività» o «gestisco una scheda che c'è già». */

const campo = "w-full min-w-0 rounded-2xl border-2 border-crema-scuro bg-white px-4 py-3 text-base focus:border-viola";
type Scheda = { chiave: string; nome: string; citta: string };

/** Minuscole e senza accenti: «Città» trova anche «citta». */
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function Facoltativo() {
  return <span className="font-bold text-notte-tenue"> (facoltativo)</span>;
}

export function ModuloCandidatura({
  schede,
  categorie,
  citta,
  iniziale,
}: {
  schede: Scheda[];
  categorie: { slug: string; nome: string }[];
  citta: string[];
  /** Dal link «È la tua attività?» della scheda: la scheda già scelta. */
  iniziale?: string;
}) {
  const [esito, invia, inviando] = useActionState<EsitoCandidatura, FormData>(proponi, { stato: "fermo" });
  const preScelta = schede.find((s) => s.chiave === iniziale) ?? null;
  const [tipo, setTipo] = useState<"nuova" | "accesso">(preScelta ? "accesso" : "nuova");
  const [scelta, setScelta] = useState<Scheda | null>(preScelta);
  const [cerca, setCerca] = useState("");
  const errore = useRef<HTMLParagraphElement>(null);

  const trovate = useMemo(() => {
    const q = norm(cerca.trim());
    if (q.length < 2) return [];
    const parole = q.split(/\s+/);
    return schede.filter((s) => parole.every((p) => norm(`${s.nome} ${s.citta}`).includes(p))).slice(0, 8);
  }, [cerca, schede]);

  // L'errore si vede subito, anche se il modulo è lungo.
  useEffect(() => {
    if (esito.stato === "errore") errore.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [esito]);

  if (esito.stato === "ok") {
    return (
      <div className="mt-10 max-w-2xl rounded-[1.6rem] bg-white p-6 shadow-[0_10px_26px_-16px_rgba(31,36,48,0.5)] sm:p-8" role="status" data-candidatura-ok>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mizi/mizi-intera.webp" alt="" width={300} height={380} className="h-24 w-auto" />
        <p className="mt-3 text-2xl font-black text-notte">Grazie, richiesta ricevuta!</p>
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

  return (
    <form
      // Invio a mano (non con action=): così, se manca qualcosa, quello che si è scritto resta lì.
      onSubmit={(e) => {
        e.preventDefault();
        const dati = new FormData(e.currentTarget);
        startTransition(() => invia(dati));
      }}
      className="mt-10 flex max-w-2xl flex-col gap-6"
      data-modulo-candidatura
    >
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-black text-notte">Cosa vuoi fare?</legend>
        {(
          [
            ["nuova", "Aggiungere la mia attività", "non c'è ancora su Giocamizi", Plus],
            ["accesso", "La mia attività c'è già", "voglio gestirla, correggerla o completarla", KeyRound],
          ] as const
        ).map(([v, t, d, Icona]) => (
          <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-[1.3rem] border-[2.5px] bg-white p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-viola/30 ${tipo === v ? "border-viola shadow-[0_10px_24px_-16px_rgba(155,109,214,0.9)]" : "border-crema-scuro"}`}>
            <input type="radio" name="tipo" value={v} checked={tipo === v} onChange={() => setTipo(v)} className="sr-only" data-tipo={v} />
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tipo === v ? "bg-viola text-white" : "bg-viola/10 text-viola"}`}>
              <Icona className="h-5 w-5" strokeWidth={2.8} aria-hidden />
            </span>
            <span>
              <span className="block font-black text-notte">{t}</span>
              <span className="block text-sm text-notte-tenue">{d}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {tipo === "accesso" ? (
        <div className="flex flex-col gap-3">
          <input type="hidden" name="scheda" value={scelta?.chiave ?? ""} />
          {scelta ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border-[2.5px] border-viola bg-white p-4" data-scheda-scelta>
              <span className="min-w-0">
                <span className="block font-black text-notte">{scelta.nome}</span>
                <span className="block text-sm text-notte-tenue">{scelta.citta}</span>
              </span>
              <button type="button" onClick={() => setScelta(null)} className="flex shrink-0 items-center gap-1 text-sm font-black text-viola" style={{ minHeight: 0 }}>
                <X className="h-4 w-4" strokeWidth={3} aria-hidden /> Cambia
              </button>
            </div>
          ) : (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="font-extrabold">Cerca la tua attività</span>
                <span className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-notte-tenue" strokeWidth={2.6} aria-hidden />
                  <input
                    value={cerca}
                    onChange={(e) => setCerca(e.target.value)}
                    placeholder="Nome o città, es. Nano Gigante"
                    autoComplete="off"
                    className={`${campo} pl-11`}
                    data-campo="cerca-scheda"
                  />
                </span>
              </label>
              {trovate.length > 0 && (
                <ul className="flex flex-col gap-2" aria-label="Attività trovate">
                  {trovate.map((s) => (
                    <li key={s.chiave}>
                      <button
                        type="button"
                        onClick={() => setScelta(s)}
                        className="flex w-full flex-col rounded-2xl border-2 border-crema-scuro bg-white px-4 py-3 text-left hover:border-viola"
                        data-trovata={s.chiave}
                      >
                        <span className="font-black text-notte">{s.nome}</span>
                        <span className="text-sm text-notte-tenue">{s.citta}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {cerca.trim().length >= 2 && trovate.length === 0 && (
                <p className="rounded-2xl bg-white px-4 py-3 text-notte" data-nessuna>
                  Non la troviamo.{" "}
                  <button type="button" onClick={() => setTipo("nuova")} className="font-black text-viola underline underline-offset-4" style={{ minHeight: 0 }}>
                    Aggiungila tu
                  </button>
                  : ci metti due minuti.
                </p>
              )}
            </>
          )}
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
              <input name="citta" required list="citta-attivita" maxLength={80} autoComplete="address-level2" className={campo} data-campo="citta" />
              <datalist id="citta-attivita">
                {citta.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">Cosa fate per i bambini</span>
            <textarea name="descrizione" required minLength={40} maxLength={1200} rows={4} className={campo} placeholder="Per esempio: laboratori creativi dai 4 ai 10 anni, feste di compleanno a tema con un educatore, centro estivo." data-campo="descrizione" />
            <span className="text-sm text-notte-tenue">Bastano due o tre frasi.</span>
          </label>
          <details className="rounded-2xl bg-white px-4 py-3 [&[open]>summary]:mb-3">
            <summary className="cursor-pointer font-black text-viola">Aggiungi indirizzo, età, sito e social</summary>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-extrabold">
                  Indirizzo o zona
                  <Facoltativo />
                </span>
                <input name="indirizzo" maxLength={200} autoComplete="street-address" className={campo} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-extrabold">
                    Età dei bambini
                    <Facoltativo />
                  </span>
                  <input name="eta" maxLength={40} placeholder="es. 3–10 anni" className={campo} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-extrabold">
                    Sito ufficiale
                    <Facoltativo />
                  </span>
                  <input name="sito" inputMode="url" maxLength={200} placeholder="www.…" className={campo} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="font-extrabold">
                  Instagram o Facebook
                  <Facoltativo />
                </span>
                <input name="instagram" maxLength={200} className={campo} />
              </label>
            </div>
          </details>
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
            <span className="font-extrabold">Email</span>
            <input name="email" type="email" inputMode="email" required autoComplete="email" maxLength={200} className={campo} data-campo="email" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">
              Telefono
              <Facoltativo />
            </span>
            <input name="telefono" type="tel" autoComplete="tel" maxLength={40} className={campo} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-extrabold">
              Ruolo
              <Facoltativo />
            </span>
            <input name="ruolo" maxLength={80} placeholder="titolare, presidente…" className={campo} />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-extrabold">
            Vuoi dirci altro?
            <Facoltativo />
          </span>
          <textarea name="messaggio" maxLength={800} rows={2} className={campo} />
        </label>
        <p className="text-sm text-notte-tenue">Telefono ed email servono solo a noi per risponderti: non compaiono sulla scheda se non ce lo chiedi.</p>
      </div>

      {/* Campo trappola per i bot: invisibile alle persone. */}
      <input type="text" name="sito_web_2" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />

      <label className="flex items-start gap-3">
        <input type="checkbox" name="conferma" value="si" required className="mt-0.5 h-6 w-6 shrink-0 accent-[#9B6DD6]" data-spunta="conferma" />
        <span className="font-semibold">
          Gestisco questa attività (o ho il permesso di chi la gestisce), accetto i{" "}
          <a href="/termini-attivita" target="_blank" rel="noopener" className="font-black text-viola underline underline-offset-4">
            termini per le attività
          </a>{" "}
          e ho letto{" "}
          <a href="/privacy" target="_blank" rel="noopener" className="font-black text-viola underline underline-offset-4">
            la privacy
          </a>
          .
        </span>
      </label>

      {esito.stato === "errore" && (
        <p ref={errore} role="alert" className="rounded-2xl bg-arancione/15 px-4 py-3 font-bold text-notte" data-candidatura-errore>
          {esito.messaggio}
        </p>
      )}

      <button type="submit" disabled={inviando} className="rounded-[1.4rem] bg-viola px-6 py-4 text-lg font-black text-white shadow-[0_12px_28px_-12px_rgba(155,109,214,0.9)] disabled:opacity-60" data-invia>
        {inviando ? "Invio…" : tipo === "accesso" ? "Chiedi l'accesso alla scheda" : "Proponi la mia attività"}
      </button>
    </form>
  );
}
