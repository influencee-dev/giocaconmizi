import type { Metadata } from "next";
import Link from "next/link";
import { TestataPagina } from "@/components/vetrina";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { Briciole, InBreve } from "@/components/directory/Briciole";
import { Illustrazione } from "@/components/directory/Illustrazione";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { CardRisorsaDirectory } from "@/components/risorse/CardRisorsaDirectory";
import { CtaRisorsa, NavCategorieRisorse } from "@/components/risorse/Directory";
import { site, url } from "@/lib/seo";
import { PERCORSO_TRAPPOLA } from "@/lib/protezione/limiti";
import { risorseVisibili } from "@/lib/risorse-reclamo";
import { DISCLAIMER, FAQ_RISORSE, LINK_CONTROLLATI, PERCORSO_RISORSE, RISPOSTA_BREVE } from "@/lib/risorse-educative";
import {
  categorieAttive,
  listingRisorse,
  percorsoCategoriaRisorse,
  percorsoListingRisorse,
  risorseDi,
  type Ambito,
} from "@/lib/risorse-categorie";

/**
 * Hub della directory delle risorse educative (14/11/2026): come /feste,
 * categorie → province → schede. Ogni realtà ha la sua scheda; le categorie
 * nascono da sole alla prima scheda (lib/risorse-categorie.ts).
 */

export const revalidate = 600;

const TITOLO = "Risorse educative per bambini e insegnanti | Gioca con Mizi";
const DESCRIZIONE =
  "Scuole paritarie, cooperative, blog per genitori, schede per insegnanti, coding e fiabe: la guida alle risorse educative per bambini da 3 a 12 anni, divisa per categoria e provincia.";
const H1 = "Risorse educative per bambini, famiglie e insegnanti";

export const metadata: Metadata = {
  // absolute: il title è già completo, senza il suffisso del layout.
  title: { absolute: TITOLO },
  description: DESCRIZIONE,
  alternates: { canonical: PERCORSO_RISORSE },
  openGraph: { title: TITOLO, description: DESCRIZIONE, url: PERCORSO_RISORSE, type: "website" },
};

const AMBITI: { id: Ambito; titolo: string; testo: string }[] = [
  { id: "online", titolo: "Da usare da casa o in classe", testo: "Siti, blog e materiali che si usano online, in tutta Italia." },
  { id: "territorio", titolo: "Sul territorio", testo: "Scuole, cooperative e realtà con una sede, provincia per provincia." },
];

export default async function RisorseEducativePage() {
  const tutte = await risorseVisibili();
  const categorie = categorieAttive(tutte);
  const listing = listingRisorse(tutte);
  // In evidenza prima le schede verificate dalle realtà, poi una per categoria.
  const verificate = tutte.filter((r) => r.reclamata);
  const evidenza = [
    ...verificate,
    ...categorie.map((c) => risorseDi(c.slug, tutte)[0]!).filter((r) => !r.reclamata),
  ].slice(0, 6);

  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Risorse educative", percorso: PERCORSO_RISORSE }])} />
      <JsonLd data={jsonLdCollezione(categorie.map((c) => ({ nome: c.nome, percorso: percorsoCategoriaRisorse(c) })))} />
      <JsonLd data={jsonLdFaq([...FAQ_RISORSE])} />

      <div className="mb-4">
        <Briciole voci={[{ nome: "Risorse educative" }]} />
      </div>

      <TestataPagina occhiello="Risorse educative consigliate" tono="verde" foto="I-04">
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{H1}</h1>
        <p className="max-w-2xl text-lg font-semibold text-notte">
          {tutte.length} scuole, cooperative, siti e progetti utili a bambini, famiglie e insegnanti, divisi in{" "}
          {categorie.length} categorie. Ogni realtà ha la sua scheda e può reclamarla gratis.
        </p>
      </TestataPagina>

      <InBreve testo={RISPOSTA_BREVE} />

      <div className="mt-8">
        <NavCategorieRisorse categorie={categorie} />
      </div>

      {AMBITI.map((a) => {
        const qui = categorie.filter((c) => c.ambito === a.id);
        if (!qui.length) return null;
        return (
          <section key={a.id} className="mt-10" aria-labelledby={`ambito-${a.id}`}>
            <h2 id={`ambito-${a.id}`} className="text-[1.75rem] font-black leading-tight tracking-tight text-notte sm:text-4xl">
              {a.titolo}
            </h2>
            <p className="mb-5 mt-1 max-w-2xl text-notte-tenue">{a.testo}</p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {qui.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={percorsoCategoriaRisorse(c)}
                    data-tap
                    className="flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white transition-colors hover:border-viola"
                  >
                    <Illustrazione colore={c.colore} icona={c.icona} alta="h-28" />
                    <span className="flex flex-1 flex-col gap-1 p-4">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-lg font-black leading-tight text-notte">{c.nome}</span>
                        <span className="shrink-0 text-xs font-extrabold text-viola">{risorseDi(c.slug, tutte).length} ›</span>
                      </span>
                      <span className="text-sm text-notte-tenue">{c.sottotitolo}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {listing.length > 0 && (
        <section className="mt-10">
          <TitoloSezione>Le province con più realtà</TitoloSezione>
          <div className="flex flex-wrap gap-2">
            {listing.map((l) => (
              <Link
                key={`${l.categoria.slug}-${l.slug}`}
                href={percorsoListingRisorse(l.categoria, l.slug)}
                className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola"
              >
                {l.categoria.breve} a {l.provincia} <span className="text-viola">({l.n})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <TitoloSezione>In evidenza</TitoloSezione>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {evidenza.map((r) => (
            <li key={r.slug}>
              <CardRisorsaDirectory r={r} />
            </li>
          ))}
        </ul>
      </section>

      <CtaRisorsa />

      {/*
        Trappola per bot (honeypot): nascosta a chi naviga e agli screen reader
        (attributo hidden = fuori dall'albero di accessibilità), fuori dal tab,
        vietata in robots.txt e assente dalla sitemap. Una persona non la può
        raggiungere; un crawler corretto la salta. Vedi lib/protezione/limiti.ts.
      */}
      <a href={PERCORSO_TRAPPOLA} hidden aria-hidden="true" tabIndex={-1} rel="nofollow">
        Archivio
      </a>

      <Faq voci={[...FAQ_RISORSE]} />

      <section className="mt-12">
        <TitoloSezione>Continua con Gioca con Mizi</TitoloSezione>
        <ul className="flex flex-col gap-2 text-lg text-notte-tenue">
          <li>
            <Link href="/giochi" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Giochi didattici online
            </Link>{" "}
            per bambini dai 3 ai 12 anni: lettura, matematica, inglese e coding, gratis e senza pubblicità.
          </li>
          <li>
            <Link href="/per-insegnanti" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Giochi da usare in classe
            </Link>{" "}
            con la LIM o sui tablet, senza registrazione.
          </li>
          <li>
            <Link href="/storie" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Storie da leggere
            </Link>{" "}
            in stampatello, minuscolo o corsivo, con lettura ad alta voce.
          </li>
          <li>
            <Link href="/feste" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Feste di compleanno per bambini
            </Link>{" "}
            città per città: ludoteche, sale feste, fattorie didattiche e laser game.
          </li>
        </ul>
      </section>

      <p className="mt-10 max-w-3xl text-sm text-notte-tenue">
        {DISCLAIMER} Link controllati il {LINK_CONTROLLATI}.
      </p>
    </Contenitore>
  );
}

/** CollectionPage con l'elenco delle categorie che esistono davvero. */
function jsonLdCollezione(voci: { nome: string; percorso: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url(PERCORSO_RISORSE),
    url: url(PERCORSO_RISORSE),
    name: H1,
    description: DESCRIZIONE,
    inLanguage: site.lingua,
    isPartOf: { "@type": "WebSite", name: site.nome, url: url("/") },
    mainEntity: {
      "@type": "ItemList",
      name: "Categorie delle risorse educative",
      numberOfItems: voci.length,
      itemListElement: voci.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.nome, url: url(v.percorso) })),
    },
  };
}
