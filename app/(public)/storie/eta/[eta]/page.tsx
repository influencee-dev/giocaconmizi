import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tutteLeStorie } from "@/lib/content";
import { Contenitore, Griglia } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";

type Params = { params: Promise<{ eta: string }> };

// Le storie sono graduate su tre fasce (CONTENT-GUIDE: 5, 6, 7 anni).
const fasce = [5, 6, 7] as const;

export function generateStaticParams() {
  return fasce.map((anni) => ({ eta: `${anni}-anni` }));
}

function anniDaSlug(slug: string): number | null {
  const match = /^(\d)-anni$/.exec(slug);
  if (!match) return null;
  const anni = Number(match[1]);
  return fasce.includes(anni as (typeof fasce)[number]) ? anni : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { eta } = await params;
  const anni = anniDaSlug(eta);
  if (anni === null) return {};
  return {
    title: `Storie per bambini di ${anni} anni`,
    description: `Storie brevi da leggere per bambini di ${anni} anni, in stampatello, minuscolo o corsivo. Gratis.`,
    alternates: { canonical: `/storie/eta/${eta}` },
  };
}

export default async function HubStorieEtaPage({ params }: Params) {
  const { eta } = await params;
  const anni = anniDaSlug(eta);
  if (anni === null) notFound();

  const storie = tutteLeStorie().filter((s) => s.age === anni);

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Storie", percorso: "/storie" },
          { nome: `${anni} anni`, percorso: `/storie/eta/${eta}` },
        ])}
      />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Storie per bambini di {anni} anni
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Storie brevi, con finale sereno e tre domande per parlarne insieme.
        Si leggono in stampatello, in minuscolo o in corsivo.
      </p>

      <div className="mt-8">
        {storie.length === 0 ? (
          <p className="rounded-morbido border-2 border-crema-scuro bg-white p-5 text-notte-tenue">
            Le storie per questa età sono in scrittura.
          </p>
        ) : (
          <Griglia>
            {storie.map((s) => (
              <Link
                key={s.slug}
                href={`/storie/${s.slug}`}
                data-tap
                className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5 hover:border-viola"
              >
                <span className="text-xl font-extrabold text-notte">{s.title}</span>
                <span className="mt-auto pt-2 text-sm font-bold text-viola">
                  {s.minutes} minuti
                </span>
              </Link>
            ))}
          </Griglia>
        )}
      </div>
    </Contenitore>
  );
}
