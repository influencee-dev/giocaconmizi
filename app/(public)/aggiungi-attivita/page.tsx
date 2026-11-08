import type { Metadata } from "next";
import { CATEGORIE, SCHEDE } from "@/lib/directory";
import { CITTA_FESTE } from "@/lib/feste";
import { chiaveScheda } from "@/lib/directory-db";
import { chiaveRisorsa } from "@/lib/risorse-educative";
import { RISORSE } from "@/lib/risorse-educative-dati";
import { Contenitore } from "@/components/ui";
import { ModuloCandidatura } from "./ModuloCandidatura";

export const metadata: Metadata = {
  title: "Aggiungi la tua attività per bambini su Giocamizi",
  description:
    "Ludoteche, sale feste, parchi, musei, associazioni e laboratori per bambini: chiedi di comparire gratis su Giocamizi o di gestire la scheda della tua attività.",
  alternates: { canonical: "/aggiungi-attivita" },
};

/**
 * La porta d'ingresso delle attività: «aggiungete la mia» oppure «sono il
 * titolare di una scheda che c'è già». Le richieste arrivano nel pannello di
 * Giorgia (Candidature) e niente va online senza il suo controllo.
 */
export default async function AggiungiAttivita({ searchParams }: { searchParams: Promise<{ scheda?: string }> }) {
  const { scheda } = await searchParams;
  const schede = [...SCHEDE]
    .sort((a, b) => a.citta.localeCompare(b.citta, "it") || a.nome.localeCompare(b.nome, "it"))
    .map((s) => ({ chiave: chiaveScheda(s), nome: s.nome, citta: s.citta }))
    // Anche le risorse educative si possono reclamare (chiave "risorse/<slug>").
    .concat(RISORSE.map((r) => ({ chiave: chiaveRisorsa(r), nome: r.nome, citta: r.localita ?? "Risorse educative" })));
  const categorie = CATEGORIE.map((c) => ({ slug: c.slug, nome: c.nome }));
  const citta = CITTA_FESTE.map((c) => c.citta).sort((a, b) => a.localeCompare(b, "it"));

  return (
    <Contenitore className="py-8 sm:py-10">
      <p className="w-fit rounded-full bg-rosa px-4 py-1 text-sm font-black text-white">Per le attività · gratis</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-notte sm:text-5xl">Aggiungi la tua attività per bambini su Giocamizi</h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Ludoteche, sale feste, parchi, musei, associazioni e laboratori: su Giocamizi le mamme cercano dove portare i bambini e dove
        festeggiare il compleanno. La scheda è gratuita e la controlliamo a mano prima di pubblicarla.
      </p>
      <ul className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-3 sm:gap-3">
        {[
          ["1", "Compili il modulo", "due minuti, dal telefono va benissimo"],
          ["2", "Controlliamo", "verifichiamo che l'attività sia vera e adatta ai bambini"],
          ["3", "Sei online", "ti scriviamo con il link della tua scheda"],
        ].map(([n, t, d]) => (
          <li key={n} className="flex items-center gap-3 rounded-[1.3rem] bg-white px-4 py-3 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.4)] sm:items-start sm:py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-viola font-black text-white">{n}</span>
            <span>
              <span className="block font-black text-notte">{t}</span>
              <span className="block text-sm text-notte-tenue">{d}</span>
            </span>
          </li>
        ))}
      </ul>
      <ModuloCandidatura schede={schede} categorie={categorie} citta={citta} iniziale={scheda} />
    </Contenitore>
  );
}
