import type { Metadata } from "next";
import { Suspense } from "react";
import { Contenitore } from "@/components/ui";
import { Editor } from "@/components/biglietti/Editor";
import { JsonLd } from "@/components/seo/JsonLd";
import { url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kit per la festa di compleanno da stampare gratis",
  description:
    "Etichette per i sacchettini, festone col nome, topper per la torta, segnaposto e caccia al tesoro: tutto con lo stesso sfondo dell'invito, da stampare a casa. Gratis, senza registrazione.",
  alternates: { canonical: "/biglietti/kit-festa" },
};

export default function KitFestaPage() {
  return (
    <Contenitore className="py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Kit per la festa di compleanno",
          url: url("/biglietti/kit-festa"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          inLanguage: "it-IT",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }}
      />

      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Il kit della festa</h1>
        <p className="mt-3 text-lg text-notte-tenue">
          Etichette per i sacchettini, festone col nome, topper per la torta, segnaposto e caccia al
          tesoro, con lo stesso sfondo dell&apos;invito. Ogni foglio è un A4 da stampare a casa e
          ritagliare. Gratis, senza registrazione.
        </p>
      </div>

      <div className="mt-8">
        {/* useSearchParams richiede un confine di Suspense in una pagina statica */}
        <Suspense fallback={<p className="text-notte-tenue">Preparo il kit…</p>}>
          <Editor parte="kit" />
        </Suspense>
      </div>
    </Contenitore>
  );
}
