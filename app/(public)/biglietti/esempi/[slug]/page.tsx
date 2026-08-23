import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Contenitore } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { esempioPerSlug, esempiPubblicati, immagineDisponibile } from "@/lib/esempi";
import { linkAlTool, temaPerSlug } from "@/lib/biglietti";

type Params = { params: Promise<{ slug: string }> };

/** Solo gli esempi con immagine diventano pagine: le schede senza restano nell'indice. */
export function generateStaticParams() {
  return esempiPubblicati().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const esempio = esempioPerSlug(slug);
  if (!esempio) return {};
  return {
    title: `Esempio: ${esempio.titolo}`,
    description: `${esempio.descrizione} Crealo anche tu, gratis e senza registrazione.`,
    alternates: { canonical: `/biglietti/esempi/${slug}` },
  };
}

export default async function EsempioPage({ params }: Params) {
  const { slug } = await params;
  const esempio = esempioPerSlug(slug);
  if (!esempio || !immagineDisponibile(slug)) notFound();

  const tema = temaPerSlug(esempio.tema);

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Biglietti", percorso: "/biglietti" },
          { nome: "Esempi", percorso: "/biglietti/esempi" },
          { nome: esempio.titolo, percorso: `/biglietti/esempi/${slug}` },
        ])}
      />

      <nav aria-label="Percorso" className="mb-4 text-sm font-bold text-notte-tenue">
        <Link href="/biglietti" className="hover:text-viola">Biglietti</Link>
        {" · "}
        <Link href="/biglietti/esempi" className="hover:text-viola">Esempi</Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <Image
          src={`/esempi/${slug}.png`}
          alt={esempio.titolo}
          width={1240}
          height={1748}
          className="w-full max-w-md rounded-morbido border-2 border-crema-scuro"
          priority
        />

        <div>
          <h1 className="text-3xl font-extrabold text-notte">{esempio.titolo}</h1>
          <p className="mt-4 text-lg text-notte-tenue">{esempio.descrizione}</p>
          <p className="mt-2 font-bold text-viola">
            Tema {tema?.label ?? esempio.tema}
            {esempio.eta ? ` · ${esempio.eta} ${esempio.eta === 1 ? "anno" : "anni"}` : ""}
          </p>

          <Link
            href={linkAlTool({ tipo: esempio.tipo, tema: esempio.tema, eta: esempio.eta })}
            data-tap
            className="mt-8 inline-flex items-center justify-center rounded-bolla bg-rosa px-8 py-5 text-xl font-extrabold text-white"
          >
            Crealo tu con il tema {tema?.label.toLowerCase() ?? esempio.tema}
          </Link>
          <p className="mt-3 text-sm text-notte-tenue">
            Gratis, senza registrazione: si apre il creatore con il tema già scelto.
          </p>
        </div>
      </div>
    </Contenitore>
  );
}
