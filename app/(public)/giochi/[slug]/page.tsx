import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games } from "@/games/registry";
import { testoGioco } from "@/lib/content";
import { Contenitore, Prosa } from "@/components/ui";
import {
  JsonLd,
  jsonLdBreadcrumb,
  jsonLdFaq,
  jsonLdGioco,
} from "@/components/seo/JsonLd";

type Params = { params: Promise<{ slug: string }> };

/** Un gioco = una pagina indicizzata (piano §2, decisione 4). */
export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const gioco = games.find((g) => g.slug === slug);
  if (!gioco) return {};

  const testo = testoGioco(slug);
  const descrizione =
    testo?.description ??
    `${gioco.title}: gioco educativo gratis per bambini dai ${gioco.ageMin} ai ${gioco.ageMax} anni. Senza pubblicità e senza timer.`;

  return {
    title: gioco.title,
    description: descrizione,
    alternates: { canonical: `/giochi/${slug}` },
    openGraph: { title: gioco.title, description: descrizione },
  };
}

export default async function GiocoPage({ params }: Params) {
  const { slug } = await params;
  const gioco = games.find((g) => g.slug === slug);
  if (!gioco) notFound();

  const testo = testoGioco(slug);
  const descrizione = testo?.description ?? gioco.mechanic;

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdGioco({
          slug: gioco.slug,
          title: gioco.title,
          description: descrizione,
          ageMin: gioco.ageMin,
          ageMax: gioco.ageMax,
        })}
      />
      {/* Le stesse FAQ che il lettore vede in fondo alla pagina */}
      {testo && testo.faq.length > 0 && <JsonLd data={jsonLdFaq(testo.faq)} />}
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Giochi", percorso: "/giochi" },
          {
            nome: `${gioco.ageMin} anni`,
            percorso: `/giochi/eta/${gioco.ageMin}-anni`,
          },
          { nome: gioco.title, percorso: `/giochi/${gioco.slug}` },
        ])}
      />

      <nav aria-label="Percorso" className="mb-4 text-sm font-bold text-notte-tenue">
        <Link href="/giochi" className="hover:text-viola">Giochi</Link>
        {" · "}
        <Link href={`/giochi/eta/${gioco.ageMin}-anni`} className="hover:text-viola">
          {gioco.ageMin} anni
        </Link>
      </nav>

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{gioco.title}</h1>
      <p className="mt-3 text-lg text-notte-tenue">{descrizione}</p>

      <p className="mt-2 font-bold text-viola">
        {gioco.ageMin}–{gioco.ageMax} anni · {gioco.minutes} minuti · {gioco.skill}
      </p>

      {gioco.status === "live" ? (
        <div className="mt-6 flex flex-col gap-4">
          <Link
            href={`/giochi/${gioco.slug}/gioca`}
            data-tap
            className="inline-flex w-full items-center justify-center rounded-bolla bg-rosa px-10 py-5 text-2xl font-extrabold text-white sm:w-auto"
          >
            Gioca
          </Link>

          {/* Lo stesso gioco si adatta all'età: qui la si sceglie prima di entrare. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-notte-tenue">Gioca come se avesse</span>
            {Array.from({ length: gioco.ageMax - gioco.ageMin + 1 }, (_, i) => gioco.ageMin + i).map(
              (anni) => (
                <Link
                  key={anni}
                  href={`/giochi/${gioco.slug}/gioca?eta=${anni}`}
                  className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola"
                  style={{ minHeight: "2.75rem", minWidth: "2.75rem" }}
                >
                  {anni}
                </Link>
              ),
            )}
            <span className="font-bold text-notte-tenue">anni</span>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-morbido border-2 border-crema-scuro bg-white p-5 text-notte-tenue">
          Questo gioco è in costruzione. Meccanica prevista: {gioco.mechanic}
        </p>
      )}

      {testo && (
        <div className="mt-10">
          <Prosa html={testo.html} />
        </div>
      )}
    </Contenitore>
  );
}
