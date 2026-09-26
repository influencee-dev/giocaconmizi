import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE } from "@/lib/guide";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guide per i genitori: tabelline, lettura, coding, compiti",
  description:
    "Guide pratiche scritte da una mamma: come insegnare le tabelline, imparare a leggere, iniziare col coding, leggere l'orologio, gestire schermi e compiti. Gratis.",
  alternates: { canonical: "/guide" },
};

/** ItemList: dice ai motori e alle AI che questo è l'indice delle guide. */
function jsonLdElenco() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Guide per i genitori — Gioca con Mizi",
    itemListElement: GUIDE.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.titolo,
      url: url(`/guide/${g.slug}`),
    })),
  };
}

export default function GuidePage() {
  return (
    <Contenitore className="py-10">
      <JsonLd data={jsonLdElenco()} />
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Guide", percorso: "/guide" }])} />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Guide per i genitori
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Le domande che ci fanno più spesso le mamme, con risposte complete e
        oneste: niente fuffa, niente &quot;dipende&quot; lasciati a metà, e per
        ogni guida i giochi gratuiti per esercitarsi. Scritte da una mamma,
        riviste a ogni aggiornamento del sito.
      </p>

      <section className="mt-10">
        <TitoloSezione>Le guide</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDE.map((g) => (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              data-tap
              className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5 transition-colors hover:border-viola"
            >
              <span className="text-xl font-extrabold text-notte">{g.titolo}</span>
              <span className="text-notte-tenue">{g.descrizione}</span>
              <span className="mt-auto pt-2 text-sm font-bold text-viola">
                {g.etaMin}–{g.etaMax} anni · {g.minutiLettura} minuti di lettura
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 max-w-2xl text-notte-tenue">
        Manca la guida che cercavi? Scrivici da{" "}
        <Link href="/chi-siamo" className="font-bold text-viola underline underline-offset-4">
          Chi siamo
        </Link>
        : le prossime le scegliamo con le domande vere dei genitori.
      </p>
    </Contenitore>
  );
}
