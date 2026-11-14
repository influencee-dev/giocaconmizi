import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FaqVetrina, InBreve } from "@/components/vetrina";
import { EditorLetterina } from "@/components/natale/EditorLetterina";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { url } from "@/lib/seo";
import { FAQ_LETTERINA, PERCORSO_LETTERINA, PERCORSO_NATALE, RISPOSTA_BREVE_LETTERINA } from "@/lib/natale";

export const metadata: Metadata = {
  title: "Lettera a Babbo Natale da stampare e compilare: la letterina gratis",
  description:
    "Scrivi la letterina a Babbo Natale con Mizi: frasi pronte per età, lista dei desideri, cinque cornici di Natale anche da colorare e la busta da ritagliare. PDF A4, stampa o WhatsApp. Gratis, senza registrazione.",
  alternates: { canonical: PERCORSO_LETTERINA },
};

const ESEMPI = [
  {
    eta: "3-5 anni",
    testo:
      "Ciao Babbo Natale! Quest'anno ho imparato a contare fino a dieci. Per Natale vorrei un libro con gli animali e la neve. Ti voglio bene!",
    consiglio: "La detta il bambino, la scrive l'adulto. Poi lui la colora e ci mette la firma come sa fare: anche uno scarabocchio vale.",
  },
  {
    eta: "6-8 anni",
    testo:
      "Caro Babbo Natale, quest'anno ho messo impegno a scuola e ho fatto amicizia con tanti compagni. Per Natale vorrei un gioco da tavolo e un libro di avventure. Fai un salto anche dai nonni! Ti aspetto la notte di Natale.",
    consiglio: "Può copiarla da sola dal foglio: le righe tratteggiate aiutano chi sta imparando il corsivo.",
  },
  {
    eta: "9-12 anni",
    testo:
      "Caro Babbo Natale, quest'anno è stato pieno di cose nuove: alcune facili, altre meno. Ti chiedo un romanzo nuovo e un set da disegno. Porta un regalo anche ai bambini che ne hanno più bisogno. Grazie in anticipo, comunque vada.",
    consiglio: "A quest'età la letterina diventa un esercizio di scrittura vero: tre paragrafi, un pensiero per gli altri, niente lista infinita.",
  },
];

export default function LetterinaPage() {
  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Natale", percorso: PERCORSO_NATALE },
          { nome: "Letterina a Babbo Natale", percorso: PERCORSO_LETTERINA },
        ])}
      />
      <JsonLd data={jsonLdFaq(FAQ_LETTERINA)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Letterina a Babbo Natale con Mizi",
          url: url(PERCORSO_LETTERINA),
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          inLanguage: "it-IT",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }}
      />

      <nav aria-label="Percorso" className="text-sm font-bold text-notte-tenue">
        <Link href={PERCORSO_NATALE} className="text-viola hover:underline">
          Natale
        </Link>{" "}
        / Letterina a Babbo Natale
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold text-notte sm:text-4xl">Lettera a Babbo Natale da stampare e compilare</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        Scegli l&apos;età, la carta da lettera e le frasi, scrivi i desideri. Poi la scarichi in A4, la condividi o la stampi da
        colorare. Gratis, senza registrazione, dal telefono.
      </p>
      <InBreve className="mt-6">{RISPOSTA_BREVE_LETTERINA}</InBreve>

      <div className="mt-8">
        <EditorLetterina />
      </div>

      <section className="mt-14" aria-labelledby="come-si-scrive">
        <h2 id="come-si-scrive" className="text-2xl font-extrabold text-notte sm:text-3xl">
          Come si scrive la letterina a Babbo Natale: esempi per età
        </h2>
        <p className="mt-3 max-w-3xl text-notte-tenue">
          Tre parti bastano: chi sei, com&apos;è andato l&apos;anno, cosa desideri. Meglio pochi desideri scritti bene che una lista
          lunga: è anche il momento per chiedere qualcosa che non si compra, come una giornata insieme.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ESEMPI.map((e) => (
            <div key={e.eta} className="flex flex-col gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-5">
              <span className="w-fit rounded-bolla bg-viola/10 px-3 py-1 text-sm font-extrabold text-viola">{e.eta}</span>
              <p className="italic text-notte">«{e.testo}»</p>
              <p className="text-sm text-notte-tenue">{e.consiglio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-2xl font-extrabold text-notte sm:text-3xl">Domande frequenti</h2>
        <FaqVetrina voci={FAQ_LETTERINA} />
      </section>

      <p className="mt-10 text-notte">
        Dopo la letterina:{" "}
        <Link href="/natale/biglietti-di-natale" className="font-bold text-viola underline">
          i biglietti di Natale da personalizzare
        </Link>
        ,{" "}
        <Link href="/natale/eventi" className="font-bold text-viola underline">
          gli eventi di Natale per bambini nella tua città
        </Link>{" "}
        e{" "}
        <Link href="/giochi" className="font-bold text-viola underline">
          i giochi di Mizi
        </Link>
        .
      </p>
    </Contenitore>
  );
}
