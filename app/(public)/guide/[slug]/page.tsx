import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDE, guida } from "@/lib/guide";
import { games } from "@/games/registry";
import { CardGioco, Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { IllustrazioneSkill } from "@/components/illustrazioni";
import {
  JsonLd,
  jsonLdArticolo,
  jsonLdBreadcrumb,
  jsonLdFaq,
} from "@/components/seo/JsonLd";

/**
 * La pagina di una guida (piano AEO): la risposta breve in testa è il
 * paragrafo pensato per essere citato da motori e assistenti AI; le sezioni
 * sono la risposta completa; in fondo i giochi per passare dalla teoria
 * alla pratica. Tutto statico, generato da lib/guide.ts.
 */

export function generateStaticParams() {
  return GUIDE.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const voce = guida(slug);
  if (!voce) return {};
  return {
    title: voce.titolo,
    description: voce.descrizione,
    alternates: { canonical: `/guide/${voce.slug}` },
  };
}

export default async function GuidaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const voce = guida(slug);
  if (!voce) notFound();

  const correlati = voce.giochi
    .map((s) => games.find((g) => g.slug === s && g.status === "live"))
    .filter((g) => g !== undefined);

  return (
    <Contenitore className="py-10">
      <JsonLd data={jsonLdArticolo(voce)} />
      <JsonLd data={jsonLdFaq(voce.faq)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Guide", percorso: "/guide" },
          { nome: voce.titoloBreve, percorso: `/guide/${voce.slug}` },
        ])}
      />

      <nav aria-label="Percorso" className="text-sm font-bold text-notte-tenue">
        <Link href="/guide" className="text-viola hover:underline">
          Guide
        </Link>{" "}
        / {voce.titoloBreve}
      </nav>

      <div className="mt-4 flex items-start gap-4">
        <span
          aria-hidden
          className="hidden h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-morbido bg-crema p-2 sm:flex"
        >
          <IllustrazioneSkill skill={voce.skill} />
        </span>
        <h1 className="min-w-0 text-3xl font-extrabold text-notte sm:text-4xl">
          {voce.titolo}
        </h1>
      </div>
      <p className="mt-2 text-sm font-bold text-notte-tenue">
        {voce.etaMin}–{voce.etaMax} anni · {voce.minutiLettura} minuti di lettura ·
        di Giorgia Palazzo, mamma e creatrice del sito
      </p>

      {/* La risposta in breve: il blocco pensato per essere citato dalle AI. */}
      <div className="mt-6 rounded-morbido border-2 border-viola/40 bg-viola/10 p-5">
        <p className="font-extrabold text-viola">In breve</p>
        <p className="mt-1 text-lg leading-relaxed text-notte">{voce.rispostaBreve}</p>
      </div>

      {voce.sezioni.map((sezione) => (
        <section key={sezione.titolo} className="mt-10">
          <h2 className="text-2xl font-extrabold text-notte">{sezione.titolo}</h2>
          {sezione.paragrafi.map((p, i) => (
            <p key={i} className="mt-4 text-lg leading-relaxed text-notte">
              {p}
            </p>
          ))}
        </section>
      ))}

      {correlati.length > 0 && (
        <section className="mt-12">
          <TitoloSezione>Per esercitarsi giocando, gratis</TitoloSezione>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {correlati.map((g) => (
              <CardGioco
                key={g.slug}
                slug={g.slug}
                titolo={g.title}
                descrizione={g.subskill}
                eta={`${g.ageMin}–${g.ageMax}`}
                minuti={g.minutes}
                illustrazione={<IllustrazioneSkill skill={g.skill} />}
              />
            ))}
          </div>
        </section>
      )}

      <Faq voci={voce.faq} />

      <section className="mt-10 flex flex-wrap items-center gap-4 rounded-morbido bg-crema p-6">
        <p className="min-w-0 flex-1 text-lg font-bold text-notte">
          Le altre guide: tabelline, lettura, coding, orologio, schermi e compiti.
        </p>
        <Link
          href="/guide"
          data-tap
          className="rounded-bolla bg-rosa px-6 py-4 font-extrabold text-white"
        >
          Tutte le guide
        </Link>
      </section>
    </Contenitore>
  );
}
