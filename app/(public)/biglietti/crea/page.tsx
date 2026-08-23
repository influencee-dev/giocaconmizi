import type { Metadata } from "next";
import { Suspense } from "react";
import { Contenitore } from "@/components/ui";
import { Editor } from "@/components/biglietti/Editor";
import { JsonLd } from "@/components/seo/JsonLd";
import { url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Crea inviti e biglietti di compleanno online gratis",
  description:
    "Crea l'invito o il biglietto di compleanno di tuo figlio in due minuti: scegli lo sfondo, scrivi il nome, scarica. Gratis, senza registrazione e senza filigrana.",
  alternates: { canonical: "/biglietti/crea" },
};

export default function CreaPage() {
  return (
    <Contenitore className="py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Crea biglietti di compleanno",
          url: url("/biglietti/crea"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          inLanguage: "it-IT",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Come creare un invito di compleanno in due minuti",
          totalTime: "PT2M",
          step: [
            { "@type": "HowToStep", name: "Scegli il tipo e il formato", text: "Invito, auguri o ringraziamento; A6 per stamparlo o verticale per WhatsApp." },
            { "@type": "HowToStep", name: "Scegli lo sfondo", text: "Venticinque temi, ognuno in versione chiara e colorata." },
            { "@type": "HowToStep", name: "Scrivi nome, età e frase", text: "Le frasi pronte si toccano e si modificano." },
            { "@type": "HowToStep", name: "Scarica o condividi", text: "Il biglietto si scarica in PNG oppure si manda direttamente da telefono." },
          ],
        }}
      />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Crea il tuo biglietto di compleanno
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        Scegli lo sfondo, scrivi il nome e scarica. Gratis, senza registrazione,
        senza filigrana. Funziona dal telefono.
      </p>

      <div className="mt-8">
        {/* useSearchParams richiede un confine di Suspense in una pagina statica */}
        <Suspense fallback={<p className="text-notte-tenue">Preparo il biglietto…</p>}>
          <Editor />
        </Suspense>
      </div>
    </Contenitore>
  );
}
