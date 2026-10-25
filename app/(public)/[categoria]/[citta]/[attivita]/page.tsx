import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCHEDE, datiCard, haListing, percorsoScheda, scheda, schedeDi } from "@/lib/directory";
import { url } from "@/lib/seo";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { Briciole, CtaAttivita, InBreve } from "@/components/directory/Briciole";
import { CardAttivita } from "@/components/directory/CardAttivita";
import { Illustrazione } from "@/components/directory/Illustrazione";
import { ReelInstagram } from "@/components/feste/ReelInstagram";

/** La scheda di un'attività (Figma 04–06). */

export const dynamicParams = false;

export function generateStaticParams() {
  return SCHEDE.map((s) => ({ categoria: s.categoria.slug, citta: s.cittaSlug, attivita: s.slug }));
}

type P = { params: Promise<{ categoria: string; citta: string; attivita: string }> };

async function trova(params: P["params"]) {
  const { categoria, citta, attivita } = await params;
  return scheda(categoria, citta, attivita) ?? null;
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = await trova(params);
  if (!s) return {};
  return {
    title: `${s.nome}, ${s.tipo} a ${s.citta} (${s.zona})`,
    description: `${s.descrizione} ${s.nome} a ${s.citta}, zona ${s.zona}: feste di compleanno per bambini e cosa chiedere prima di prenotare.`,
    alternates: { canonical: percorsoScheda(s) },
  };
}

function Contatti({ sito, instagram }: { sito?: string; instagram?: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-morbido border-2 border-crema-scuro bg-white p-5 shadow-[0_10px_30px_rgba(31,36,48,0.08)]">
      <p className="text-xl font-extrabold text-notte">Contatta l&apos;attività</p>
      <p className="text-sm font-semibold text-notte-tenue">
        Prezzi, disponibilità e pacchetti festa si chiedono direttamente al locale: noi non prendiamo commissioni.
      </p>
      {sito && (
        <a href={sito} target="_blank" rel="nofollow noopener" className="rounded-bolla bg-rosa px-5 py-3 text-center font-extrabold text-white">
          Vai al sito ufficiale
        </a>
      )}
      {instagram && (
        <a href={instagram} target="_blank" rel="nofollow noopener" className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 text-center font-extrabold text-notte">
          Profilo Instagram
        </a>
      )}
      {!sito && !instagram && (
        <p className="rounded-xl bg-crema px-4 py-3 text-sm font-bold text-notte">
          I contatti arrivano quando l&apos;attività completa la scheda.
        </p>
      )}
      <Link href="/biglietti/crea" className="border-t-2 border-crema pt-3 text-sm font-extrabold text-viola">
        Intanto prepara l&apos;invito, gratis ›
      </Link>
    </div>
  );
}

export default async function SchedaPage({ params }: P) {
  const s = await trova(params);
  if (!s) notFound();
  const cat = s.categoria;
  const listing = haListing(cat.slug, s.cittaSlug);
  const hrefCitta = listing ? `/${cat.slug}/${s.cittaSlug}` : `/feste/${s.cittaSlug}`;
  const simili = schedeDi(cat.slug, s.cittaSlug).filter((x) => x.slug !== s.slug).slice(0, 3);
  const faq = cat.faq.map((f) => ({ ...f }));

  return (
    <>
      <Contenitore largo className="pb-28 pt-6 lg:pb-12">
        <JsonLd
          data={jsonLdBreadcrumb([
            { nome: cat.nome, percorso: `/${cat.slug}` },
            ...(listing ? [{ nome: s.citta, percorso: hrefCitta }] : []),
            { nome: s.nome, percorso: percorsoScheda(s) },
          ])}
        />
        <JsonLd data={jsonLdFaq(faq)} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": cat.schema,
            name: s.nome,
            description: s.descrizione,
            url: url(percorsoScheda(s)),
            address: { "@type": "PostalAddress", addressLocality: s.citta, addressRegion: s.zona, addressCountry: "IT" },
            ...(s.sito || s.instagram ? { sameAs: [s.sito, s.instagram].filter(Boolean) } : {}),
          }}
        />

        <Briciole voci={[{ nome: cat.nome, href: `/${cat.slug}` }, { nome: s.citta, href: hrefCitta }, { nome: s.nome }]} />

        <div className="mt-4 overflow-hidden rounded-morbido">
          <Illustrazione colore={s.colore} icona={cat.icona} alta="h-48 sm:h-72" grande />
        </div>
        <p className="mt-2 text-xs font-semibold text-notte-tenue">
          Le foto le aggiunge l&apos;attività quando completa la scheda.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold text-notte sm:text-5xl">{s.nome}</h1>
          <p className="font-bold text-notte-tenue">
            {s.zona}, {s.citta} · {s.tipo}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-bolla bg-[#E3F4E8] px-3 py-1 text-xs font-extrabold text-[#2E7D4A]">Scheda da reclamare</span>
            <span className="rounded-bolla bg-crema px-3 py-1 text-xs font-extrabold text-notte">Fa feste di compleanno</span>
            <span className="rounded-bolla bg-crema px-3 py-1 text-xs font-extrabold text-notte">{cat.nome}</span>
          </div>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-col gap-8">
            <InBreve
              testo={`${s.descrizione} ${s.nome} si trova a ${s.citta}, zona ${s.zona}, e organizza feste di compleanno per bambini: chiedete al locale un preventivo scritto con tutto quello che è incluso.`}
            />
            <section>
              <TitoloSezione>Cosa chiedere prima di prenotare</TitoloSezione>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {cat.comeScegliere.map((c) => (
                  <li key={c} className="flex gap-2 rounded-xl border-2 border-crema-scuro bg-white px-4 py-3 text-sm font-bold text-notte">
                    <span className="text-verde" aria-hidden>✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
            {s.reel && <ReelInstagram url={s.reel} nome={s.nome} />}
            <div className="lg:hidden">
              <Contatti sito={s.sito} instagram={s.instagram} />
            </div>
          </div>
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <Contatti sito={s.sito} instagram={s.instagram} />
          </aside>
        </div>

        <Faq voci={faq} />

        {simili.length > 0 && (
          <section className="mt-12">
            <TitoloSezione>
              Altre {cat.nome.toLowerCase()} a {s.citta}
            </TitoloSezione>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {simili.map((x) => (
                <CardAttivita key={x.slug} s={datiCard(x)} />
              ))}
            </div>
          </section>
        )}

        <CtaAttivita />
      </Contenitore>

      {/* Telefono e tablet: l'azione principale sempre a portata di pollice. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-crema-scuro bg-white px-4 py-3 lg:hidden">
        {s.sito ? (
          <a href={s.sito} target="_blank" rel="nofollow noopener" className="block rounded-bolla bg-rosa px-5 py-3 text-center font-extrabold text-white">
            Vai al sito ufficiale
          </a>
        ) : (
          <Link href="/biglietti/crea" className="block rounded-bolla bg-rosa px-5 py-3 text-center font-extrabold text-white">
            Prepara l&apos;invito, gratis
          </Link>
        )}
      </div>
    </>
  );
}
