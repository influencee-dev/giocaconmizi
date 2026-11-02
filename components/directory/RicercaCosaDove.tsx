"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * La barra di ricerca «Cosa cerchi · Dove», come quella di matrimonio.com:
 * due campi in una pillola bianca e il bottone Cerca. Porta al listing
 * categoria + città; se quella categoria in città non ha un listing, alla
 * pagina feste della città (dove ci sono tutti i posti); se la città non
 * c'è ancora, lo dice invece di portare a una pagina vuota.
 */

export interface VoceCosa {
  slug: string;
  nome: string;
}
export interface VoceDove {
  slug: string;
  nome: string;
  /** Categorie con un listing in questa città. */
  categorie: string[];
}

const TUTTI = "tutti";

export function RicercaCosaDove({
  cosa,
  dove,
  categoria = TUTTI,
  citta = "",
  grande = false,
}: {
  cosa: VoceCosa[];
  dove: VoceDove[];
  categoria?: string;
  citta?: string;
  grande?: boolean;
}) {
  const router = useRouter();
  const [cat, setCat] = useState(categoria);
  const [testo, setTesto] = useState(dove.find((d) => d.slug === citta)?.nome ?? "");
  const [avviso, setAvviso] = useState("");

  const cerca = () => {
    const t = testo.trim().toLowerCase();
    const voce = dove.find((d) => d.nome.toLowerCase() === t) ?? (t ? dove.find((d) => d.nome.toLowerCase().startsWith(t)) : undefined);
    if (!voce) {
      if (!t && cat !== TUTTI) return router.push(`/${cat}`);
      setAvviso(t ? `Non siamo ancora a «${testo.trim()}»: scegli una città dall'elenco.` : "Scrivi la città.");
      return;
    }
    setAvviso("");
    router.push(cat !== TUTTI && voce.categorie.includes(cat) ? `/${cat}/${voce.slug}` : `/feste/${voce.slug}`);
  };

  const campo = grande ? "py-3.5 text-lg" : "py-2.5 text-base";
  return (
    <div className="w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          cerca();
        }}
        className={`flex w-full flex-col gap-2 rounded-[1.4rem] bg-white p-2 shadow-[0_14px_40px_-16px_rgba(31,36,48,0.45)] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full ${grande ? "max-w-3xl" : "max-w-4xl"}`}
      >
        <label className="flex min-w-0 flex-1 flex-col px-4 sm:border-r sm:border-notte/10">
          <span className="pt-1 text-[11px] font-black uppercase tracking-wide text-notte-tenue">Cosa cerchi</span>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className={`w-full min-w-0 bg-transparent font-extrabold text-notte outline-none ${campo} pt-0.5`}
          >
            <option value={TUTTI}>Tutti i posti per la festa</option>
            {cosa.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 flex-1 flex-col px-4">
          <span className="pt-1 text-[11px] font-black uppercase tracking-wide text-notte-tenue">Dove</span>
          <input
            list="ricerca-citta"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="In quale città?"
            className={`w-full min-w-0 bg-transparent font-extrabold text-notte outline-none placeholder:font-bold placeholder:text-notte-tenue ${campo} pt-0.5`}
          />
          <datalist id="ricerca-citta">
            {dove.map((d) => (
              <option key={d.slug} value={d.nome} />
            ))}
          </datalist>
        </label>
        <button
          type="submit"
          className={`flex items-center justify-center gap-2 rounded-2xl bg-viola px-7 font-black text-white transition-colors hover:bg-notte sm:rounded-full ${grande ? "py-4 text-lg" : "py-3"}`}
        >
          <Search className="h-5 w-5" strokeWidth={2.6} aria-hidden />
          Cerca
        </button>
      </form>
      {avviso && (
        <p role="alert" className="mt-2 px-4 text-sm font-bold text-arancione">
          {avviso}
        </p>
      )}
    </div>
  );
}
