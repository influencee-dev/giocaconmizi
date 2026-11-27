"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Gamepad2, LoaderCircle, MapPin, Search, Sparkles } from "lucide-react";

type Risultato = { tipo: "posto" | "guida" | "gioco" | "storia"; titolo: string; url: string; dettaglio: string; perche: string };

const ICONA = { posto: MapPin, guida: BookOpen, gioco: Gamepad2, storia: BookOpen } as const;
const ESEMPI = [
  "Festa per 15 bambini a Milano con animatore",
  "Un gioco per imparare le tabelline a 8 anni",
  "Fattoria didattica vicino a Bologna per una gita",
  "Come limitare il tempo sul tablet",
];

/** La ricerca con l'AI: una domanda in parole normali, risposte solo dal sito. */
export function RicercaAi() {
  const [domanda, setDomanda] = useState("");
  const [inCorso, setInCorso] = useState(false);
  const [esito, setEsito] = useState<{ risposta: string; risultati: Risultato[] } | null>(null);
  const [errore, setErrore] = useState("");

  async function cerca(testo = domanda) {
    if (testo.trim().length < 3 || inCorso) return;
    setDomanda(testo);
    setInCorso(true);
    setErrore("");
    setEsito(null);
    try {
      const r = await fetch("/api/cerca", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ domanda: testo }) });
      const d = await r.json();
      if (!r.ok) setErrore(d.errore ?? "Qualcosa non è andato: riprova.");
      else setEsito(d);
    } catch {
      setErrore("Connessione assente: riprova tra poco.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          cerca();
        }}
        className="flex flex-col gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-4 shadow-[0_10px_30px_rgba(31,36,48,0.08)] sm:flex-row"
      >
        <label htmlFor="domanda-ai" className="sr-only">Cosa cerchi?</label>
        <input
          id="domanda-ai"
          value={domanda}
          onChange={(e) => setDomanda(e.target.value)}
          maxLength={300}
          placeholder="Scrivi cosa cerchi, come lo diresti a un'amica"
          className="min-h-14 flex-1 rounded-2xl border-2 border-crema-scuro px-4 text-lg"
        />
        <button type="submit" disabled={inCorso} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-viola-forte px-6 font-extrabold text-white disabled:opacity-60">
          {inCorso ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Search className="h-5 w-5" aria-hidden />}
          {inCorso ? "Cerco…" : "Cerca"}
        </button>
      </form>

      {!esito && !inCorso && (
        <div className="flex flex-wrap gap-2">
          {ESEMPI.map((e) => (
            <button key={e} type="button" onClick={() => cerca(e)} className="rounded-full border-2 border-crema-scuro bg-white px-4 py-2 text-sm font-bold text-notte hover:border-viola">
              {e}
            </button>
          ))}
        </div>
      )}

      {errore && <p className="rounded-xl bg-rosso/10 px-4 py-3 font-bold text-rosso" data-errore-ricerca>{errore}</p>}

      {esito && (
        <section data-risultati-ai className="flex flex-col gap-4">
          <p className="flex gap-2 rounded-[1.4rem] bg-viola/10 p-5 font-semibold text-notte">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-viola" aria-hidden />
            {esito.risposta}
          </p>
          <ul className="flex flex-col gap-3">
            {esito.risultati.map((r) => {
              const I = ICONA[r.tipo];
              return (
                <li key={r.url}>
                  <Link href={r.url} className="flex gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-4 hover:border-viola">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-crema text-viola">
                      <I className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-extrabold text-notte">{r.titolo}</span>
                      <span className="block text-xs font-bold uppercase tracking-wide text-notte-tenue">{r.dettaglio}</span>
                      <span className="mt-1 block text-sm text-notte">{r.perche}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
