import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIE_ATTIVE, REGIONE, categoria, cittaDi, datiCard, haListing, percorsoScheda, schedeDi, vociRicerca } from "@/lib/directory";
import { RicercaCosaDove } from "@/components/directory/RicercaCosaDove";
import { CardRicerca } from "@/components/directory/CardRicerca";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco, jsonLdFaq } from "@/components/seo/JsonLd";
import { Briciole, CtaAttivita, InBreve } from "@/components/directory/Briciole";
import { conModifiche, pubblicate } from "@/lib/directory-db";
import { Illustrazione } from "@/components/directory/Illustrazione";

/** Pagina categoria nazionale della directory (Figma 07–09). */

export const dynamicParams = false;
export const revalidate = 600;

export function generateStaticParams() {
  return CATEGORIE_ATTIVE.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const cat = categoria((await params).categoria);
  if (!cat) return {};
  return {
    title: `${cat.titolo}: città per città`,
    description: `${cat.sottotitolo} Zone, tipo di spazio e consigli per la festa di compleanno.`,
    alternates: { canonical: `/${cat.slug}` },
  };
}

const COLORI = ["#F6E3CF", "#FCE1EC", "#E1F3FB", "#EFE6FA", "#FEF3D1", "#E3F4E8"];

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const cat = categoria((await params).categoria);
  if (!cat) notFound();
  const citta = cittaDi(cat.slug);
  const p = await pubblicate();
  const schede = schedeDi(cat.slug).map((s) => conModifiche(s, p)).filter((s): s is NonNullable<typeof s> => s !== null);
  const hrefCitta = (slug: string) => {
    if (haListing(cat.slug, slug)) return `/${cat.slug}/${slug}`;
    const unica = schede.find((s) => s.cittaSlug === slug) ?? schedeDi(cat.slug).find((s) => s.cittaSlug === slug)!;
    return percorsoScheda(unica);
  };
  const regioni = [...new Set(citta.map((c) => REGIONE[c.slug]).filter(Boolean))].sort();
  const evidenza = citta.slice(0, 3).map((c) => schede.find((s) => s.cittaSlug === c.slug)).filter((s) => s !== undefined);

  return (
    <>
      <JsonLd data={jsonLdBreadcrumb([{ nome: cat.nome, percorso: `/${cat.slug}` }])} />
      <JsonLd data={jsonLdFaq(cat.faq)} />
      <JsonLd
        data={jsonLdElenco(
          cat.titolo,
          citta.map((c) => ({ nome: `${cat.nome} a ${c.citta}`, percorso: hrefCitta(c.slug) })),
        )}
      />
      {/* Testata come matrimonio.com: fascia colorata, titolo e la grande ricerca «Cosa · Dove». */}
      <div className="bg-[#F0E8FA]">
        <Contenitore largo className="flex flex-col gap-4 pb-10 pt-8 sm:pb-14 sm:pt-10">
          <Briciole voci={[{ nome: cat.nome }]} />
          <h1 className="max-w-3xl text-[2.1rem] font-black leading-[1.05] tracking-tight text-notte sm:text-5xl lg:text-6xl">{cat.titolo}</h1>
          <p className="max-w-2xl text-lg font-semibold text-notte-tenue">{cat.sottotitolo}</p>
          <div className="mt-2">
            <RicercaCosaDove {...vociRicerca()} categoria={cat.slug} grande />
          </div>
        </Contenitore>
      </div>

      {/* Tutte le categorie, come le sotto-categorie di matrimonio.com. */}
      <Contenitore largo className="-mt-6 sm:-mt-8">
        <nav aria-label="Categorie" className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIE_ATTIVE.map((c) => {
            const qui = c.slug === cat.slug;
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                aria-current={qui ? "page" : undefined}
                className={`flex shrink-0 flex-col items-center gap-2 rounded-[1.4rem] border-2 px-4 py-3 text-center text-sm font-extrabold shadow-sm ${
                  qui ? "border-viola bg-viola text-white" : "border-white bg-white text-notte hover:border-viola"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- icone statiche locali */}
                <img src={`/icone/${c.icona}.png`} alt="" className="h-10 w-10" />
                <span className="w-28 leading-tight">{c.nome}</span>
              </Link>
            );
          })}
        </nav>
      </Contenitore>

      <Contenitore largo className="py-8">
        <InBreve testo={cat.rispostaBreve} />

        <section className="mt-10">
          <TitoloSezione>Le città con più posti</TitoloSezione>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {citta.map((c, i) => (
              <Link
                key={c.slug}
                href={hrefCitta(c.slug)}
                data-tap
                className="overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white transition-colors hover:border-viola"
              >
                <Illustrazione colore={COLORI[i % COLORI.length]} icona={cat.icona} alta="h-24 sm:h-28" />
                <span className="flex items-center justify-between gap-2 p-3">
                  <span className="font-extrabold text-notte">{c.citta}</span>
                  <span className="text-xs font-extrabold text-viola">{c.n} ›</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {regioni.length > 1 && (
          <section className="mt-10">
            <TitoloSezione>Cerca per regione</TitoloSezione>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {regioni.map((r) => (
                <div key={r} className="rounded-xl border-2 border-crema-scuro bg-white px-4 py-3">
                  <p className="font-extrabold text-notte">{r}</p>
                  <p className="mt-1 flex flex-wrap gap-x-2 text-sm font-bold">
                    {citta.filter((c) => REGIONE[c.slug] === r).map((c) => (
                      <Link key={c.slug} href={hrefCitta(c.slug)} className="text-viola hover:underline">
                        {c.citta}
                      </Link>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <TitoloSezione>In evidenza</TitoloSezione>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {evidenza.map((s) => (
              <CardRicerca key={`${s.cittaSlug}-${s.slug}`} s={datiCard(s)} />
            ))}
          </div>
        </section>

        <Link
          href="/guide/festa-di-compleanno-semplice"
          data-tap
          className="mt-10 flex flex-col gap-1.5 rounded-morbido bg-[#FEF3D1] p-6 transition-colors hover:bg-[#FCEAB8]"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#8A5700]">Guida per i genitori</span>
          <span className="text-xl font-extrabold text-notte">La festa di compleanno semplice: come organizzarla senza stress</span>
          <span className="font-extrabold text-viola">Leggi la guida ›</span>
        </Link>

        <Faq voci={cat.faq} />

        {CATEGORIE_ATTIVE.length > 1 && (
          <section className="mt-10">
            <TitoloSezione>Altri posti per bambini</TitoloSezione>
            <div className="flex flex-wrap gap-2">
              {CATEGORIE_ATTIVE.filter((c) => c.slug !== cat.slug).map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola">
                  {c.nome}
                </Link>
              ))}
            </div>
          </section>
        )}

        <CtaAttivita />
      </Contenitore>
    </>
  );
}
