import { TestataPagina } from "@/components/vetrina";
import { ScenaBiglietti } from "@/components/illustrazioni";
import type { Metadata } from "next";
import Link from "next/link";
import { CITTA_FESTE } from "@/lib/feste";
import { CATEGORIE_ATTIVE } from "@/lib/directory";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Feste di compleanno per bambini: le location città per città",
  description:
    "Dove festeggiare il compleanno dei bambini, città per città: ludoteche, sale feste e spazi gioco raccontati dalle famiglie, con inviti gratis e consigli pratici.",
  alternates: { canonical: "/feste" },
};

export default function FestePage() {
  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Feste", percorso: "/feste" }])} />
      <JsonLd
        data={jsonLdElenco(
          "Feste di compleanno per bambini città per città — Gioca con Mizi",
          CITTA_FESTE.map((c) => ({
            nome: `Festa di compleanno per bambini a ${c.citta}`,
            percorso: `/feste/${c.slug}`,
          })),
        )}
      />

      <TestataPagina occhiello="Compleanni città per città" tono="rosa" foto="F-01" ripiego={<ScenaBiglietti />}>
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
          Feste di compleanno per bambini, città per città
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
          Le location di cui le famiglie parlano davvero — ludoteche, sale feste,
          parchi gioco — raccolte zona per zona, senza accordi commerciali. E
          quando hai scelto il posto, l&apos;invito lo fai gratis qui, con la
          conferma WhatsApp a un tocco.
        </p>
      </TestataPagina>

      <section className="mt-8">
        <TitoloSezione>Cerca per tipo di posto</TitoloSezione>
        <div className="flex flex-wrap gap-2">
          {CATEGORIE_ATTIVE.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola"
            >
              {c.nome}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <TitoloSezione>Scegli la città</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CITTA_FESTE.map((c) => (
            <Link
              key={c.slug}
              href={`/feste/${c.slug}`}
              data-tap
              className="flex flex-col gap-2 rounded-[1.4rem] border border-notte/10 bg-white p-5 transition-colors hover:border-viola"
            >
              <span className="text-xl font-extrabold text-notte">{c.citta}</span>
              <span className="text-sm text-notte-tenue">
                {c.locali.length} location per zona
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-notte-tenue">
          La tua città non c&apos;è ancora? Ne aggiungiamo di nuove ogni
          settimana: scrivici dalla pagina{" "}
          <Link href="/chi-siamo" className="font-bold text-viola underline underline-offset-2">
            Chi siamo
          </Link>{" "}
          per chiederla.
        </p>
      </section>

      <section className="mt-10 flex flex-wrap items-center gap-4 rounded-morbido bg-crema p-6">
        <p className="min-w-0 flex-1 text-lg font-bold text-notte">
          Il posto è deciso? Manca solo l&apos;invito: gratis, con QR
          &laquo;Inquadra e conferma&raquo;.
        </p>
        <Link
          href="/biglietti/crea"
          data-tap
          className="rounded-2xl bg-viola px-6 py-4 font-extrabold text-white"
        >
          Crea l&apos;invito
        </Link>
      </section>
    </Contenitore>
  );
}
