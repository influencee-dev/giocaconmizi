import Link from "next/link";
import { tutteLeStorie } from "@/lib/content";
import { Contenitore, Griglia } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";

/**
 * Hub /storie/{carattere}: intercetta le ricerche "storie in stampatello",
 * "storie in corsivo da stampare" (piano §1.2). Il testo è lo stesso per tutti
 * i caratteri: cambia solo come viene mostrato.
 */

export interface Carattere {
  slug: "stampatello" | "minuscolo" | "corsivo";
  titolo: string;
  descrizione: string;
  spiegazione: string;
}

export const caratteri: Record<Carattere["slug"], Carattere> = {
  stampatello: {
    slug: "stampatello",
    titolo: "Storie in stampatello maiuscolo",
    descrizione:
      "Storie per bambini da leggere in STAMPATELLO MAIUSCOLO: il carattere con cui si impara a leggere. Gratis, con il pulsante Ascolta.",
    spiegazione:
      "Lo stampatello maiuscolo è il primo carattere che i bambini riconoscono: le lettere sono tutte della stessa altezza e non si legano fra loro.",
  },
  minuscolo: {
    slug: "minuscolo",
    titolo: "Storie in stampatello minuscolo",
    descrizione:
      "Storie per bambini da leggere in stampatello minuscolo, per la prima elementare. Gratis, con il pulsante Ascolta.",
    spiegazione:
      "Il minuscolo arriva di solito in prima elementare, quando il bambino riconosce già le maiuscole e inizia a leggere parole intere.",
  },
  corsivo: {
    slug: "corsivo",
    titolo: "Storie in corsivo",
    descrizione:
      "Storie per bambini da leggere in corsivo, per la seconda elementare. Gratis, con il pulsante Ascolta.",
    spiegazione:
      "Il corsivo si affronta in seconda elementare. Leggerlo aiuta a scriverlo: le lettere si legano e la mano segue l'occhio.",
  },
};

export function HubCarattere({ carattere }: { carattere: Carattere }) {
  const storie = tutteLeStorie();

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Storie", percorso: "/storie" },
          { nome: carattere.titolo, percorso: `/storie/${carattere.slug}` },
        ])}
      />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        {carattere.titolo}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        {carattere.descrizione}
      </p>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        {carattere.spiegazione}
      </p>

      <div className="mt-8">
        {storie.length === 0 ? (
          <p className="rounded-morbido border-2 border-crema-scuro bg-white p-5 text-notte-tenue">
            Le prime storie sono in scrittura.
          </p>
        ) : (
          <Griglia>
            {storie.map((s) => (
              <Link
                key={s.slug}
                href={`/storie/${s.slug}`}
                data-tap
                className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5 hover:border-viola"
              >
                <span className="text-xl font-extrabold text-notte">{s.title}</span>
                <span className="mt-auto pt-2 text-sm font-bold text-viola">
                  {s.age} anni · {s.minutes} minuti
                </span>
              </Link>
            ))}
          </Griglia>
        )}
      </div>
    </Contenitore>
  );
}
