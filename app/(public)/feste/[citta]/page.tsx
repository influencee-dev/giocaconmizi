import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITTA_FESTE, cittaFeste } from "@/lib/feste";
import { categoriaDi, slugify } from "@/lib/directory";
import { pubblicate } from "@/lib/directory-db";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { ReelInstagram } from "@/components/feste/ReelInstagram";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { site } from "@/lib/seo";

/**
 * Pagina locale "Festa di compleanno per bambini a [città]" (piano SEO/GEO/AEO):
 * keyword esatta nel titolo e nell'H1, locali veri per zona (GEO), risposta
 * breve citabile + FAQ con JSON-LD (AEO), e i link interni che trasformano la
 * ricerca locale in utenti del sito: guida festa e creatore di biglietti.
 */

export const revalidate = 600;

export function generateStaticParams() {
  return CITTA_FESTE.map((c) => ({ citta: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citta: string }>;
}): Promise<Metadata> {
  const { citta } = await params;
  const voce = cittaFeste(citta);
  if (!voce) return {};
  return {
    title: `Festa di compleanno per bambini a ${voce.citta}: dove farla`,
    description: `Le location per una festa di compleanno per bambini a ${voce.citta}, zona per zona: ludoteche, sale feste e spazi gioco, con consigli su inviti, conferme e budget.`,
    alternates: { canonical: `/feste/${voce.slug}` },
  };
}

/** I locali come ItemList di LocalBusiness: la lista leggibile dalle macchine. */
function jsonLdLocali(voce: NonNullable<ReturnType<typeof cittaFeste>>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Location per feste di compleanno per bambini a ${voce.citta}`,
    itemListElement: voce.locali.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: l.nome,
        description: `${l.tipo} — ${l.zona}`,
        address: { "@type": "PostalAddress", addressLocality: voce.citta, addressCountry: "IT" },
        ...(l.sito ? { url: l.sito } : {}),
      },
    })),
  };
}

export default async function FestaCittaPage({
  params,
}: {
  params: Promise<{ citta: string }>;
}) {
  const { citta } = await params;
  const voce = cittaFeste(citta);
  if (!voce) notFound();

  const altre = CITTA_FESTE.filter((c) => c.slug !== voce.slug);
  // I locali che hanno chiesto di non comparire spariscono anche da qui.
  const p = await pubblicate();
  const locali = voce.locali.filter((l) => p.get(`${voce.slug}/${slugify(l.nome)}`)?.tipo !== "rimuovi");

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Feste", percorso: "/feste" },
          { nome: voce.citta, percorso: `/feste/${voce.slug}` },
        ])}
      />
      <JsonLd data={jsonLdFaq(voce.faq)} />
      <JsonLd data={jsonLdLocali({ ...voce, locali })} />

      <nav aria-label="Percorso" className="text-sm font-bold text-notte-tenue">
        <Link href="/feste" className="text-viola hover:underline">
          Feste
        </Link>{" "}
        / {voce.citta}
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold text-notte sm:text-4xl">
        Festa di compleanno per bambini a {voce.citta}: le location di cui
        parlano le famiglie
      </h1>
      <p className="mt-2 text-sm font-bold text-notte-tenue">
        {voce.locali.length} location per zona · aggiornata da {site.nome}
      </p>

      {/* La risposta in breve: il blocco pensato per essere citato dalle AI. */}
      <div className="mt-6 rounded-morbido border-2 border-viola/40 bg-viola/10 p-5">
        <p className="font-extrabold text-viola">In breve</p>
        <p className="mt-1 text-lg leading-relaxed text-notte">{voce.rispostaBreve}</p>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-notte">{voce.intro}</p>

      <section className="mt-10">
        <TitoloSezione>Le location, zona per zona</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-2">
          {locali.map((l) => (
            <div
              key={l.nome}
              className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-extrabold text-notte">{l.nome}</span>
                <span className="rounded-bolla bg-viola/10 px-3 py-1 text-xs font-extrabold text-viola">
                  {l.zona}
                </span>
              </div>
              <span className="text-sm font-bold text-notte-tenue">{l.tipo}</span>
              <p className="text-notte">{l.descrizione}</p>
              {(l.sito || l.instagram) && (
                <p className="mt-auto flex flex-wrap gap-4 pt-1 text-sm font-bold">
                  {l.sito && (
                    <a
                      href={l.sito}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-viola underline underline-offset-2"
                    >
                      Sito ufficiale ↗
                    </a>
                  )}
                  {l.instagram && (
                    <a
                      href={l.instagram}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-viola underline underline-offset-2"
                    >
                      Instagram ↗
                    </a>
                  )}
                </p>
              )}
              {l.reel && <ReelInstagram url={l.reel} nome={l.nome} />}
              <Link
                href={`/${categoriaDi(l).slug}/${voce.slug}/${slugify(l.nome)}`}
                className="mt-1 self-start text-sm font-extrabold text-viola"
              >
                Vedi la scheda ›
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-notte-tenue">
          Nessun accordo commerciale con i locali: raccontiamo i posti di cui le
          famiglie parlano online. Gestisci uno di questi spazi e qualcosa non
          torna, o vuoi segnalarne uno? Scrivici dalla pagina{" "}
          <Link href="/chi-siamo" className="font-bold text-viola underline underline-offset-2">
            Chi siamo
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <TitoloSezione>Prima della festa, da qui</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/guide/festa-di-compleanno-semplice"
            data-tap
            className="flex flex-col gap-1 rounded-morbido border-2 border-crema-scuro bg-white p-4 transition-colors hover:border-viola"
          >
            <span className="font-extrabold text-notte">
              La guida: organizzare una festa semplice
            </span>
            <span className="text-sm text-notte-tenue">
              Quanti invitati, la scaletta, il budget onesto.
            </span>
          </Link>
          <Link
            href="/biglietti/crea"
            data-tap
            className="flex flex-col gap-1 rounded-morbido border-2 border-crema-scuro bg-white p-4 transition-colors hover:border-viola"
          >
            <span className="font-extrabold text-notte">L&apos;invito, gratis</span>
            <span className="text-sm text-notte-tenue">
              27 temi, conferma WhatsApp a un tocco e QR sul biglietto stampato.
            </span>
          </Link>
          <Link
            href="/biglietti/inviti-compleanno-bambini"
            data-tap
            className="flex flex-col gap-1 rounded-morbido border-2 border-crema-scuro bg-white p-4 transition-colors hover:border-viola"
          >
            <span className="font-extrabold text-notte">Tutti gli inviti</span>
            <span className="text-sm text-notte-tenue">
              Per età e per tema, da scaricare e stampare.
            </span>
          </Link>
        </div>
      </section>

      <Faq voci={voce.faq} />

      {altre.length > 0 && (
        <section className="mt-10 flex flex-wrap items-center gap-3 rounded-morbido bg-crema p-6">
          <p className="w-full font-bold text-notte">Le altre città:</p>
          {altre.map((c) => (
            <Link
              key={c.slug}
              href={`/feste/${c.slug}`}
              className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola"
            >
              {c.citta}
            </Link>
          ))}
        </section>
      )}
    </Contenitore>
  );
}
