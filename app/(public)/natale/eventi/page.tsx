import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { InBreve } from "@/components/vetrina";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { CITTA_EVENTI, EVENTI_VERIFICATI_IL, eventiAttivi } from "@/lib/eventi-natale";
import { PERCORSO_EVENTI, PERCORSO_NATALE } from "@/lib/natale";

export const metadata: Metadata = {
  title: "Eventi di Natale per bambini nelle città italiane",
  description:
    "Villaggi e case di Babbo Natale, mercatini di Natale per famiglie, laboratori e spettacoli per bambini, città per città: solo eventi verificati sui siti ufficiali.",
  alternates: { canonical: PERCORSO_EVENTI },
};

export const revalidate = 3600;

export default function EventiNatalePage() {
  const citta = CITTA_EVENTI.map((c) => ({ ...c, attivi: eventiAttivi(c) })).filter((c) => c.attivi.length > 0);
  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Natale", percorso: PERCORSO_NATALE },
          { nome: "Eventi di Natale", percorso: PERCORSO_EVENTI },
        ])}
      />
      <nav aria-label="Percorso" className="text-sm font-bold text-notte-tenue">
        <Link href={PERCORSO_NATALE} className="text-viola hover:underline">
          Natale
        </Link>{" "}
        / Eventi
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold text-notte sm:text-4xl">Eventi di Natale per bambini, città per città</h1>
      <InBreve className="mt-6">
        Villaggi e case di Babbo Natale, mercatini con attività per i più piccoli, laboratori, spettacoli e piste di pattinaggio.
        Mettiamo solo eventi di quest&apos;anno con le date confermate dal sito dell&apos;organizzatore o del comune; quelli finiti
        spariscono da soli. Controllati il {EVENTI_VERIFICATI_IL.split("-").reverse().join("/")}.
      </InBreve>
      {citta.length === 0 ? (
        <p className="mt-8 text-lg text-notte">Stiamo controllando gli eventi di quest&apos;anno: le prime città arrivano a giorni.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {citta.map((c) => (
            <Link key={c.slug} href={`${PERCORSO_EVENTI}/${c.slug}`} className="flex flex-col gap-1 rounded-[1.4rem] border-2 border-notte/10 bg-white p-5 hover:border-viola">
              <span className="text-xl font-extrabold text-notte">{c.citta}</span>
              <span className="text-sm text-notte-tenue">
                {c.attivi.length} {c.attivi.length === 1 ? "evento" : "eventi"} per bambini e famiglie
              </span>
            </Link>
          ))}
        </div>
      )}
    </Contenitore>
  );
}
