import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore } from "@/components/ui";
import { FaqVetrina, InBreve } from "@/components/vetrina";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { CITTA_EVENTI, EVENTI_VERIFICATI_IL, NOMI_TIPO_EVENTO, cittaEventi, eventiAttivi, quando } from "@/lib/eventi-natale";
import { CITTA_FESTE } from "@/lib/feste";
import { PERCORSO_BIGLIETTI_NATALE, PERCORSO_EVENTI, PERCORSO_LETTERINA, PERCORSO_NATALE } from "@/lib/natale";

/**
 * «Eventi di Natale per bambini a <città>»: solo eventi verificati
 * (lib/eventi-natale.ts), che spariscono quando finiscono. Dati
 * strutturati Event per ognuno.
 */

export const revalidate = 3600;

export function generateStaticParams() {
  return CITTA_EVENTI.map((c) => ({ citta: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ citta: string }> }): Promise<Metadata> {
  const { citta } = await params;
  const voce = cittaEventi(citta);
  if (!voce) return {};
  return {
    title: `Eventi di Natale per bambini a ${voce.citta}: villaggi, mercatini e laboratori`,
    description: `Cosa fare a Natale con i bambini a ${voce.citta}: villaggio e casa di Babbo Natale, mercatini per famiglie, laboratori e spettacoli, con date e link ufficiali.`,
    alternates: { canonical: `${PERCORSO_EVENTI}/${voce.slug}` },
  };
}

export default async function EventiCittaPage({ params }: { params: Promise<{ citta: string }> }) {
  const { citta } = await params;
  const voce = cittaEventi(citta);
  if (!voce) notFound();
  const eventi = eventiAttivi(voce);
  const verificati = EVENTI_VERIFICATI_IL.split("-").reverse().join("/");
  const tipi = [...new Set(eventi.map((e) => NOMI_TIPO_EVENTO[e.tipo].toLowerCase()))];
  const risposta = eventi.length
    ? `A ${voce.citta} a Natale con i bambini si può scegliere tra ${eventi.length} eventi verificati: ${tipi.slice(0, 4).join(", ")}. Le date vengono dai siti ufficiali e sono state controllate il ${verificati}: prima di andare conviene ricontrollare orari e prenotazioni sul sito dell'evento.`
    : `Gli eventi di Natale per bambini di quest'anno a ${voce.citta} sono finiti: torna il prossimo novembre.`;
  const faq = [
    {
      domanda: `Cosa fare a Natale con i bambini a ${voce.citta}?`,
      risposta: eventi.length
        ? `Le proposte di quest'anno sono: ${eventi.slice(0, 5).map((e) => e.nome).join(", ")}. Trovi date e link ufficiali in questa pagina.`
        : risposta,
    },
    {
      domanda: "Le date sono sicure?",
      risposta: `Mettiamo solo eventi con le date confermate da una fonte ufficiale, controllate il ${verificati}. Orari, prezzi e prenotazioni possono cambiare: verificali sempre sul sito dell'evento prima di partire.`,
    },
  ];
  const feste = CITTA_FESTE.find((c) => c.slug === voce.slug);

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Natale", percorso: PERCORSO_NATALE },
          { nome: "Eventi di Natale", percorso: PERCORSO_EVENTI },
          { nome: voce.citta, percorso: `${PERCORSO_EVENTI}/${voce.slug}` },
        ])}
      />
      <JsonLd data={jsonLdFaq(faq)} />
      {eventi.map((e) => (
        <JsonLd
          key={e.nome}
          data={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: e.nome,
            startDate: e.dal,
            endDate: e.al,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            description: e.descrizione,
            location: {
              "@type": "Place",
              name: e.luogo,
              address: { "@type": "PostalAddress", addressLocality: e.zona || voce.citta, addressCountry: "IT" },
            },
            ...(e.sito ? { url: e.sito } : {}),
            ...(e.prezzo && /gratis|gratuit|libero/i.test(e.prezzo) ? { isAccessibleForFree: true } : {}),
          }}
        />
      ))}

      <nav aria-label="Percorso" className="text-sm font-bold text-notte-tenue">
        <Link href={PERCORSO_NATALE} className="text-viola hover:underline">
          Natale
        </Link>{" "}
        /{" "}
        <Link href={PERCORSO_EVENTI} className="text-viola hover:underline">
          Eventi
        </Link>{" "}
        / {voce.citta}
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold text-notte sm:text-4xl">Eventi di Natale per bambini a {voce.citta}</h1>
      <InBreve className="mt-6">{risposta}</InBreve>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {eventi.map((e) => (
          <article key={e.nome} className="flex flex-col gap-2 rounded-[1.4rem] border border-notte/10 bg-white p-5">
            <span className="w-fit rounded-bolla bg-viola/10 px-3 py-1 text-xs font-extrabold text-viola">{NOMI_TIPO_EVENTO[e.tipo]}</span>
            <h2 className="text-xl font-extrabold text-notte">{e.nome}</h2>
            <p className="text-sm font-bold text-notte-tenue">
              {e.luogo}
              {e.zona ? ` · ${e.zona}` : ""} · {quando(e)}
            </p>
            <p className="text-notte">{e.descrizione}</p>
            {(e.orari || e.prezzo || e.eta) && (
              <p className="text-sm text-notte-tenue">{[e.orari, e.prezzo, e.eta].filter(Boolean).join(" · ")}</p>
            )}
            <p className="mt-auto flex flex-wrap gap-4 pt-1 text-sm font-bold">
              <a href={e.sito ?? e.fonte} target="_blank" rel="nofollow noopener" className="text-viola underline underline-offset-2">
                {e.sito ? "Sito ufficiale ↗" : "Fonte ↗"}
              </a>
            </p>
          </article>
        ))}
      </div>

      <section className="mt-12 rounded-morbido border-2 border-rosa/40 bg-rosa/10 p-5">
        <p className="font-extrabold text-notte">Prima di uscire</p>
        <p className="mt-1 text-notte">
          Scrivete insieme{" "}
          <Link href={PERCORSO_LETTERINA} className="font-bold text-viola underline">
            la letterina a Babbo Natale
          </Link>{" "}
          da portare al villaggio, o preparate{" "}
          <Link href={PERCORSO_BIGLIETTI_NATALE} className="font-bold text-viola underline">
            i biglietti di Natale
          </Link>{" "}
          per nonni e maestre.
          {feste && (
            <>
              {" "}
              Per il prossimo compleanno:{" "}
              <Link href={`/feste/${feste.slug}`} className="font-bold text-viola underline">
                dove fare la festa a {feste.citta}
              </Link>
              .
            </>
          )}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold text-notte sm:text-3xl">Domande frequenti</h2>
        <FaqVetrina voci={faq} />
      </section>
    </Contenitore>
  );
}
