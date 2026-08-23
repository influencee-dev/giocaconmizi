import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { byAge, games } from "@/games/registry";
import { hub } from "@/lib/content";
import { CardGioco, Contenitore, Griglia, Prosa, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { eta as etaCoperte } from "@/lib/seo";

type Params = { params: Promise<{ eta: string }> };

/** Hub per ogni età da 3 a 12 (piano §3). Lo slug è "3-anni", "4-anni", … */
export function generateStaticParams() {
  return etaCoperte.map((anni) => ({ eta: `${anni}-anni` }));
}

function anniDaSlug(slug: string): number | null {
  const match = /^(\d{1,2})-anni$/.exec(slug);
  if (!match) return null;
  const anni = Number(match[1]);
  return etaCoperte.includes(anni as (typeof etaCoperte)[number]) ? anni : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { eta } = await params;
  const anni = anniDaSlug(eta);
  if (anni === null) return {};

  const contenuto = hub(eta);
  return {
    title: contenuto?.title ?? `Giochi per bambini di ${anni} anni`,
    description:
      contenuto?.description ??
      `Giochi educativi online gratis per bambini di ${anni} anni. Senza pubblicità e senza timer.`,
    alternates: { canonical: `/giochi/eta/${eta}` },
  };
}

export default async function HubEtaPage({ params }: Params) {
  const { eta } = await params;
  const anni = anniDaSlug(eta);
  if (anni === null) notFound();

  const contenuto = hub(eta);

  // Il frontmatter dell'hub decide l'ordine dei giochi; senza frontmatter si
  // ripiega sul filtro per età del registry.
  const selezione = contenuto?.games.length
    ? contenuto.games
        .map((slug) => games.find((g) => g.slug === slug))
        .filter((g): g is (typeof games)[number] => g !== undefined)
    : byAge(anni);

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Giochi", percorso: "/giochi" },
          { nome: `${anni} anni`, percorso: `/giochi/eta/${eta}` },
        ])}
      />

      {contenuto ? (
        <Prosa html={contenuto.html} />
      ) : (
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
          Giochi per bambini di {anni} anni
        </h1>
      )}

      <section className="mt-10">
        <TitoloSezione>I giochi per questa età</TitoloSezione>
        <Griglia>
          {selezione.map((g) => (
            <CardGioco
              key={g.slug}
              slug={g.slug}
              titolo={g.title}
              descrizione={g.subskill}
              eta={`${g.ageMin}–${g.ageMax}`}
              minuti={g.minutes}
            />
          ))}
        </Griglia>
      </section>
    </Contenitore>
  );
}
