import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { esempi, immagineDisponibile } from "@/lib/esempi";
import { linkAlTool, temaPerSlug } from "@/lib/biglietti";

export const metadata: Metadata = {
  title: "Esempi di biglietti di compleanno",
  description:
    "Biglietti di compleanno veri, da cui prendere ispirazione: guarda l'esempio e crealo tu con lo stesso tema, gratis e senza registrazione.",
  alternates: { canonical: "/biglietti/esempi" },
};

export default function EsempiPage() {
  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Biglietti", percorso: "/biglietti" },
          { nome: "Esempi", percorso: "/biglietti/esempi" },
        ])}
      />

      <nav aria-label="Percorso" className="mb-4 text-sm font-bold text-notte-tenue">
        <Link href="/biglietti" className="hover:text-viola">Biglietti</Link>
      </nav>

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Esempi di biglietti di compleanno
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Biglietti veri, per farsi un&apos;idea prima di cominciare. Ogni esempio ha
        il suo pulsante &laquo;Crealo tu&raquo;: apre il creatore con il tema già
        scelto, e resta solo da scrivere il nome.
      </p>

      <section className="mt-10">
        <TitoloSezione>La galleria</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-2">
          {esempi.map((esempio) => {
            const pronta = immagineDisponibile(esempio.slug);
            const tema = temaPerSlug(esempio.tema);
            const interno = (
              <>
                {pronta ? (
                  <Image
                    src={`/esempi/${esempio.slug}.png`}
                    alt={esempio.titolo}
                    width={620}
                    height={874}
                    className="w-full"
                  />
                ) : (
                  <div className="flex aspect-[62/87] items-center justify-center bg-crema p-6 text-center text-notte-tenue">
                    Anteprima in arrivo
                  </div>
                )}
                <span className="block bg-white p-3">
                  <span className="block font-extrabold text-notte">{esempio.titolo}</span>
                  <span className="block text-sm text-notte-tenue">
                    {tema?.label ?? esempio.tema}
                    {esempio.eta ? ` · ${esempio.eta} ${esempio.eta === 1 ? "anno" : "anni"}` : ""}
                  </span>
                </span>
              </>
            );

            // Le pagine dettaglio esistono solo per gli esempi con immagine.
            return pronta ? (
              <Link
                key={esempio.slug}
                href={`/biglietti/esempi/${esempio.slug}`}
                className="overflow-hidden rounded-morbido border-2 border-crema-scuro transition-colors hover:border-viola"
                style={{ minHeight: 0 }}
              >
                {interno}
              </Link>
            ) : (
              <div
                key={esempio.slug}
                className="overflow-hidden rounded-morbido border-2 border-dashed border-crema-scuro"
              >
                {interno}
              </div>
            );
          })}
        </div>
      </section>

      <Link
        href={linkAlTool({ tipo: "invito" })}
        data-tap
        className="mt-10 inline-flex items-center justify-center rounded-bolla bg-rosa px-8 py-5 text-xl font-extrabold text-white"
      >
        Crea il tuo, gratis
      </Link>
    </Contenitore>
  );
}
