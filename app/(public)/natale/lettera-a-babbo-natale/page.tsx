import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore, Faq } from "@/components/ui";
import { InBreve, TestataPagina } from "@/components/vetrina";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { EditorLetterina } from "@/components/natale/EditorLetterina";
import { url } from "@/lib/seo";
import { FAQ_LETTERINA, RISPOSTA_LETTERINA } from "@/lib/natale/pagine";

export const metadata: Metadata = {
  title: "Lettera a Babbo Natale da stampare, con frasi pronte per età",
  description:
    "Scrivi la letterina a Babbo Natale con Mizi: frasi pronte per 3-5, 6-8 e 9-12 anni, carta di Natale, PDF A4 da stampare. Anche a righe e da colorare. Gratis.",
  alternates: { canonical: "/natale/lettera-a-babbo-natale" },
};

export default function LetteraBabboNatalePage() {
  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Il Natale di Mizi", percorso: "/natale" },
          { nome: "Lettera a Babbo Natale", percorso: "/natale/lettera-a-babbo-natale" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Lettera a Babbo Natale con Mizi",
          url: url("/natale/lettera-a-babbo-natale"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          inLanguage: "it-IT",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Come preparare la lettera a Babbo Natale da stampare",
          totalTime: "PT5M",
          step: [
            { "@type": "HowToStep", name: "Scegli l'età", text: "3-5, 6-8 o 9-12 anni: cambiano le frasi pronte." },
            { "@type": "HowToStep", name: "Scrivi il nome", text: "Oppure lascialo vuoto e completalo a penna." },
            { "@type": "HowToStep", name: "Tocca le frasi e i desideri", text: "Fino a cinque desideri; c'è anche una casella per scrivere a modo tuo." },
            { "@type": "HowToStep", name: "Scegli il foglio", text: "Già scritto o a righe, chiaro, colorato o da colorare." },
            { "@type": "HowToStep", name: "Scarica o stampa", text: "PDF A4, immagine da condividere o stampa diretta." },
            { "@type": "HowToStep", name: "Stampa la busta", text: "La busta da colorare, da ritagliare e piegare: dentro ci sta la letterina piegata in quattro." },
          ],
        }}
      />
      <JsonLd data={jsonLdFaq(FAQ_LETTERINA)} />

      <TestataPagina occhiello="Il Natale di Mizi" tono="rosa">
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Lettera a Babbo Natale da stampare</h1>
        <p className="mt-2 max-w-2xl text-lg text-notte-tenue">
          Scegli le frasi adatte all&apos;età, aggiungi i desideri e scarica il PDF. Oppure stampa il foglio a
          righe, da scrivere a mano. E c&apos;è anche la busta da colorare.
        </p>
      </TestataPagina>

      <InBreve>{RISPOSTA_LETTERINA}</InBreve>

      <div className="mt-8">
        <EditorLetterina />
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold text-notte">Non sai da dove cominciare?</h2>
        <p className="mt-2 text-notte-tenue">
          Nella guida <Link href="/natale/come-scrivere-la-letterina" className="font-bold text-viola underline">come scrivere la letterina a Babbo Natale</Link>{" "}
          trovi le quattro parti della lettera, i consigli per età e tre esempi completi, da 4 a 10 anni. Per gli
          auguri ai nonni o alla maestra c&apos;è il{" "}
          <Link href="/biglietti/crea?tipo=auguri&tema=natale" className="font-bold text-viola underline">creatore di biglietti con la cornice di Natale</Link>.
        </p>
      </section>

      <Faq voci={FAQ_LETTERINA} />
    </Contenitore>
  );
}
