import { TestataPagina } from "@/components/vetrina";
import { ScenaCompiti } from "@/components/illustrazioni";
import type { Metadata } from "next";
import Link from "next/link";
import { guideInOrdine } from "@/lib/contenuti/guide";
import { fotoGuidaPiccola } from "@/lib/foto/foto";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { IllustrazioneSkill } from "@/components/illustrazioni";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Guide per i genitori: tabelline, lettura, coding, compiti",
  description:
    "Guide pratiche scritte da una mamma: come insegnare le tabelline, imparare a leggere, iniziare col coding, leggere l'orologio, gestire schermi e compiti. Gratis.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  // Gli articoli in cima, dal più recente (22/11/2026): prima finivano in fondo,
  // dopo tutte le guide brevi, e sul telefono non li vedeva nessuno.
  const guide = guideInOrdine();
  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd
        data={jsonLdElenco(
          "Guide per i genitori — Gioca con Mizi",
          guide.map((g) => ({ nome: g.titolo, percorso: `/guide/${g.slug}` })),
        )}
      />
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Guide", percorso: "/guide" }])} />

      <TestataPagina occhiello="Scritte da una mamma" tono="giallo" foto="P-01" ripiego={<ScenaCompiti />}>
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
          Guide per i genitori
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
          Le domande che ci fanno più spesso le mamme, con risposte complete e
          oneste: niente fuffa, niente &quot;dipende&quot; lasciati a metà, e per
          ogni guida i giochi gratuiti per esercitarsi. Scritte da una mamma,
          riviste a ogni aggiornamento del sito.
        </p>
      </TestataPagina>

      <section className="mt-10">
        <TitoloSezione>Gli articoli e le guide, dai più recenti</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-2" data-elenco-guide>
          {guide.map((g, i) => {
            const foto = fotoGuidaPiccola(g.slug);
            return (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                data-tap
                data-guida={g.slug}
                className="flex flex-col gap-2 overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white p-5 transition-colors hover:border-viola"
              >
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element -- foto già pronta in tre misure: qui basta la piccola
                  <img
                    src={foto}
                    alt=""
                    width={640}
                    height={360}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="-mx-5 -mt-5 mb-1 h-40 w-[calc(100%+2.5rem)] max-w-none object-cover"
                  />
                ) : (
                  <span aria-hidden className="-mx-5 -mt-5 mb-1 flex h-24 items-center justify-center bg-crema p-2">
                    <IllustrazioneSkill skill={g.skill} />
                  </span>
                )}
                {g.approfondimento && (
                  <span className="w-fit rounded-full bg-viola/10 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wide text-viola-forte">
                    Articolo
                  </span>
                )}
                <span className="text-xl font-extrabold text-notte">{g.titolo}</span>
                <span className="text-notte-tenue">{g.descrizione}</span>
                <span className="mt-auto pt-2 text-sm font-bold text-viola">
                  {g.etaMin}–{g.etaMax} anni · {g.minutiLettura} minuti di lettura
                </span>
              </Link>
            );
          })}
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
