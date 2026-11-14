import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { Briciole, InBreve } from "@/components/directory/Briciole";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco, jsonLdFaq } from "@/components/seo/JsonLd";
import { CardRisorsaDirectory } from "@/components/risorse/CardRisorsaDirectory";
import { CtaRisorsa } from "@/components/risorse/Directory";
import { RISORSE } from "@/lib/risorse-educative-dati";
import { PERCORSO_RISORSE, percorsoRisorsa } from "@/lib/risorse-educative";
import { risorseVisibili } from "@/lib/risorse-reclamo";
import {
  MIN_LISTING_RISORSE,
  categoriaRisorsaDaSlug,
  listingRisorse,
  percorsoCategoriaRisorse,
  percorsoListingRisorse,
  provinciaDi,
  risorseDi,
  rispostaListingRisorse,
} from "@/lib/risorse-categorie";

/**
 * Una categoria in una provincia (/risorse-educative-bambini/scuole-paritarie-infanzia-primaria/torino):
 * esiste solo per le categorie sul territorio e con almeno MIN_LISTING_RISORSE schede,
 * sotto Google la tratterebbe come contenuto sottile.
 */

export const revalidate = 600;
export const dynamicParams = false;

export function generateStaticParams() {
  return listingRisorse(RISORSE).map((l) => ({ slug: l.categoria.slug, provincia: l.slug }));
}

type P = { params: Promise<{ slug: string; provincia: string }> };

async function dati(params: P["params"]) {
  const { slug, provincia } = await params;
  const cat = categoriaRisorsaDaSlug(slug);
  if (!cat || cat.ambito !== "territorio") return null;
  const tutte = await risorseVisibili();
  const voci = risorseDi(cat.slug, tutte, provincia);
  if (voci.length < MIN_LISTING_RISORSE) return null;
  return { cat, voci, tutte, provincia, nome: provinciaDi(voci[0]!)!.provincia };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = await dati(params);
  if (!d) return {};
  return {
    title: `${d.cat.nome} a ${d.nome} e provincia`,
    description: `${d.voci.length} ${d.cat.nome.toLowerCase()} in provincia di ${d.nome}: cosa fanno, per chi, costi e cosa chiedere prima di scegliere.`,
    alternates: { canonical: percorsoListingRisorse(d.cat, d.provincia) },
  };
}

export default async function ListingRisorse({ params }: P) {
  const d = await dati(params);
  if (!d) notFound();
  const { cat, voci, tutte, provincia, nome } = d;
  const altre = listingRisorse(tutte).filter((l) => !(l.categoria.slug === cat.slug && l.slug === provincia));
  const faq = [
    ...cat.faq.slice(0, 2),
    {
      domanda: `Come scelgo tra le ${cat.nome.toLowerCase()} in provincia di ${nome}?`,
      risposta: `Apri le schede di questa pagina: per ognuna trovi cosa fa, per chi è e il sito ufficiale. Poi chiedi direttamente costi, orari e posti disponibili, e se puoi visitala prima di decidere.`,
    },
  ];

  return (
    <Contenitore largo className="py-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Risorse educative", percorso: PERCORSO_RISORSE },
          { nome: cat.nome, percorso: percorsoCategoriaRisorse(cat) },
          { nome, percorso: percorsoListingRisorse(cat, provincia) },
        ])}
      />
      <JsonLd data={jsonLdFaq(faq)} />
      <JsonLd data={jsonLdElenco(`${cat.nome} a ${nome}`, voci.map((r) => ({ nome: r.nome, percorso: percorsoRisorsa(r) })))} />

      <Briciole
        voci={[
          { nome: "Risorse educative", href: PERCORSO_RISORSE },
          { nome: cat.nome, href: percorsoCategoriaRisorse(cat) },
          { nome },
        ]}
      />
      <h1 className="mt-4 max-w-3xl text-[2rem] font-black leading-[1.05] tracking-tight text-notte sm:text-5xl">
        {cat.nome} a {nome} e provincia
      </h1>
      <p className="mt-3 max-w-2xl text-lg font-semibold text-notte-tenue">{cat.sottotitolo}</p>

      <div className="mt-6">
        <InBreve testo={rispostaListingRisorse(cat, nome, voci)} />
      </div>

      <section className="mt-10">
        <TitoloSezione>
          {voci.length} realtà in provincia di {nome}
        </TitoloSezione>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {voci.map((r) => (
            <li key={r.slug}>
              <CardRisorsaDirectory r={r} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-[1.4rem] bg-[#FEF3D1] p-6">
        <h2 className="text-2xl font-extrabold text-notte">Cosa guardare prima di scegliere</h2>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-notte">
          {cat.comeScegliere.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <Faq voci={faq} />

      <section className="mt-10">
        <TitoloSezione>Cerca altrove</TitoloSezione>
        <div className="flex flex-wrap gap-2">
          <Link href={percorsoCategoriaRisorse(cat)} className="rounded-bolla border-2 border-viola bg-white px-4 py-2 font-bold text-notte">
            {cat.nome} in tutta Italia
          </Link>
          {altre.map((l) => (
            <Link
              key={`${l.categoria.slug}-${l.slug}`}
              href={percorsoListingRisorse(l.categoria, l.slug)}
              className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola"
            >
              {l.categoria.breve} a {l.provincia}
            </Link>
          ))}
        </div>
      </section>

      <CtaRisorsa />
    </Contenitore>
  );
}
