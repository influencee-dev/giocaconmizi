import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIE_ATTIVE, LISTING, categoria, datiCard, haListing, percorsoScheda, rispostaListing, schedeDi } from "@/lib/directory";
import { cittaFeste } from "@/lib/feste";
import { conModifiche, pubblicate } from "@/lib/directory-db";
import { url } from "@/lib/seo";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { Briciole, CtaAttivita, InBreve } from "@/components/directory/Briciole";
import { ListingFiltrato } from "@/components/directory/ListingFiltrato";

/** Listing categoria + città, la pagina che conta per la SEO locale (Figma 01–03). */

export const dynamicParams = false;
export const revalidate = 600;

export function generateStaticParams() {
  return LISTING.map((l) => ({ categoria: l.categoria.slug, citta: l.cittaSlug }));
}

type P = { params: Promise<{ categoria: string; citta: string }> };

async function dati(params: P["params"]) {
  const { categoria: c, citta } = await params;
  const cat = categoria(c);
  if (!cat || !haListing(c, citta)) return null;
  const schede = schedeDi(c, citta);
  return { cat, schede, nomeCitta: schede[0].citta, citta };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = await dati(params);
  if (!d) return {};
  return {
    title: `${d.cat.nome} a ${d.nomeCitta}: dove portare i bambini e fare la festa`,
    description: `${d.schede.length} ${d.cat.nome.toLowerCase()} a ${d.nomeCitta}, zona per zona: tipo di spazio, feste di compleanno e consigli prima di prenotare.`,
    alternates: { canonical: `/${d.cat.slug}/${d.citta}` },
  };
}

export default async function ListingPage({ params }: P) {
  const d = await dati(params);
  if (!d) notFound();
  const { cat, nomeCitta, citta } = d;
  const p = await pubblicate();
  const schede = d.schede.map((s) => conModifiche(s, p)).filter((s): s is NonNullable<typeof s> => s !== null);
  const altre = CATEGORIE_ATTIVE.filter((c) => c.slug !== cat.slug && haListing(c.slug, citta));
  const vicine = LISTING.filter((l) => l.categoria.slug === cat.slug && l.cittaSlug !== citta).slice(0, 6);
  const faq = [
    ...cat.faq.slice(1, 3),
    {
      domanda: `Dove si festeggia un compleanno per bambini a ${nomeCitta}?`,
      risposta: `Oltre alle ${cat.nome.toLowerCase()} di questa pagina, a ${nomeCitta} ci sono altre location per le feste: le trovi tutte, zona per zona, nella pagina dedicata alle feste di compleanno in città.`,
    },
  ];

  return (
    <Contenitore largo className="py-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: cat.nome, percorso: `/${cat.slug}` },
          { nome: nomeCitta, percorso: `/${cat.slug}/${citta}` },
        ])}
      />
      <JsonLd data={jsonLdFaq(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${cat.nome} a ${nomeCitta}`,
          itemListElement: schede.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: url(percorsoScheda(s)),
            name: s.nome,
          })),
        }}
      />

      <Briciole voci={[{ nome: cat.nome, href: `/${cat.slug}` }, { nome: nomeCitta }]} />
      <h1 className="mt-4 text-3xl font-extrabold text-notte sm:text-5xl">
        {cat.nome} a {nomeCitta}
      </h1>
      <p className="mt-2 text-sm font-bold text-notte-tenue">
        {schede.length} attività · aggiornato a {new Date(cittaFeste(citta)?.aggiornata ?? Date.now()).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
      </p>
      <div className="mt-6">
        <InBreve testo={rispostaListing(cat, nomeCitta, schede)} />
      </div>

      <div className="mt-8">
        <ListingFiltrato schede={schede.map(datiCard)} nome={cat.nome} />
      </div>

      <section className="mt-12">
        <TitoloSezione>Cerca anche</TitoloSezione>
        <div className="flex flex-wrap gap-2">
          <Link href={`/feste/${citta}`} className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola">
            Feste di compleanno a {nomeCitta}
          </Link>
          {altre.map((c) => (
            <Link key={c.slug} href={`/${c.slug}/${citta}`} className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola">
              {c.nome} a {nomeCitta}
            </Link>
          ))}
        </div>
        {vicine.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {vicine.map((l) => (
              <Link key={l.cittaSlug} href={`/${cat.slug}/${l.cittaSlug}`} className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola">
                {cat.nome} a {l.citta}
              </Link>
            ))}
          </div>
        )}
      </section>

      <Faq voci={faq} />
      <CtaAttivita />
    </Contenitore>
  );
}
