import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FaqVetrina, InBreve } from "@/components/vetrina";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { CARTELLA_DISEGNI_NATALE, DISEGNI_NATALE, PERCORSO_DISEGNI_NATALE } from "@/lib/natale/disegni-natale";
import { PERCORSO_BIGLIETTI_NATALE, PERCORSO_LETTERINA, PERCORSO_NATALE } from "@/lib/natale/natale";

/**
 * Disegni di Natale da colorare e stampare (26/11/2026): dieci disegni, ognuno
 * col suo PDF A4, e tutti.pdf con i dieci. Per chi cerca «disegni da colorare
 * di Natale» (27.100 ricerche al mese, Ubersuggest 22/11/2026). Chi vuole
 * colorare dal telefono va al gioco «Colora il Natale».
 */

export const metadata: Metadata = {
  title: "Disegni di Natale da colorare e stampare gratis (PDF)",
  description:
    "Dieci disegni di Natale da colorare per bambini, da stampare in A4: Babbo Natale, albero, renna, pupazzo di neve, elfo, slitta e altri. PDF gratis, senza registrazione.",
  alternates: { canonical: PERCORSO_DISEGNI_NATALE },
};

const RISPOSTA_BREVE =
  "Su Giocamizi ci sono dieci disegni di Natale da colorare: Babbo Natale, l'albero, la renna, il pupazzo di neve, la casetta di pan di zenzero, l'elfo, la slitta, l'angioletto, la ghirlanda e il caminetto. Ognuno si scarica in PDF A4 da stampare, gratis e senza registrazione; c'è anche un PDF unico con tutti e dieci. Le linee sono grosse e le zone larghe, adatte ai bambini dai 3 anni.";

const FAQ = [
  {
    domanda: "Come si stampano i disegni di Natale da colorare?",
    risposta:
      "Tocca «Scarica il PDF» sotto il disegno: si apre un foglio A4 già impaginato, con il margine. Stampalo in bianco e nero, a grandezza reale. Se ne vuoi più di uno, scarica il PDF con tutti e dieci e scegli le pagine al momento di stampare.",
  },
  {
    domanda: "Sono adatti ai bambini piccoli?",
    risposta:
      "Sì: le linee sono spesse e le zone da colorare sono grandi. Per i 3-4 anni vanno bene l'albero, il pupazzo di neve e la slitta; la casetta di pan di zenzero e il caminetto hanno più dettagli e sono per i più grandi.",
  },
  {
    domanda: "Si possono colorare anche dal telefono?",
    risposta:
      "Sì, con il gioco «Colora il Natale»: quattro disegni di Natale da riempire col dito, con i colori detti a voce, e alla fine si salva il disegno in PNG.",
  },
  {
    domanda: "Sono gratis?",
    risposta: "Sì, tutti e dieci, senza registrazione e senza pubblicità. Puoi stamparli a casa o a scuola, anche per la classe.",
  },
];

export default function DisegniNatalePage() {
  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Natale", percorso: PERCORSO_NATALE },
          { nome: "Disegni di Natale da colorare", percorso: PERCORSO_DISEGNI_NATALE },
        ])}
      />
      <JsonLd data={jsonLdFaq(FAQ)} />

      <nav aria-label="Percorso" className="text-sm font-bold text-notte-tenue">
        <Link href={PERCORSO_NATALE} className="text-viola hover:underline">
          Natale
        </Link>{" "}
        / Disegni da colorare
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold text-notte sm:text-4xl">Disegni di Natale da colorare e stampare</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        Dieci disegni di Natale con linee grosse e zone larghe. Scegli quello che ti piace, scarica il PDF e stampalo in A4.
      </p>
      <InBreve className="mt-6">{RISPOSTA_BREVE}</InBreve>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`${CARTELLA_DISEGNI_NATALE}/tutti.pdf`}
          download="disegni-di-natale-da-colorare-giocamizi.pdf"
          className="inline-flex items-center justify-center rounded-2xl bg-viola px-6 py-4 text-lg font-extrabold text-white"
          data-scarica-tutti
        >
          Scarica tutti e 10 (PDF)
        </a>
        <Link
          href="/giochi/colora-il-natale"
          className="inline-flex items-center justify-center rounded-2xl border-2 border-viola px-6 py-4 text-lg font-extrabold text-viola"
        >
          Colora dal telefono
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" data-disegni-natale>
        {DISEGNI_NATALE.map((d) => (
          <li key={d.slug} className="flex flex-col overflow-hidden rounded-[1.2rem] border border-notte/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- anteprima WebP già piccola (600 px), dal nostro dominio */}
            <img
              src={`${CARTELLA_DISEGNI_NATALE}/${d.slug}.webp`}
              alt={d.alt}
              width={600}
              height={800}
              loading="lazy"
              className="aspect-[3/4] w-full object-contain p-2"
            />
            <div className="flex flex-1 flex-col gap-1 p-3">
              <h2 className="text-base font-extrabold text-notte">{d.titolo}</h2>
              <p className="text-sm text-notte-tenue">{d.eta}</p>
              <a
                href={`${CARTELLA_DISEGNI_NATALE}/${d.slug}.pdf`}
                download={`disegno-natale-${d.slug}-giocamizi.pdf`}
                className="mt-auto pt-2 text-sm font-extrabold text-viola underline underline-offset-2"
                data-scarica-disegno={d.slug}
              >
                Scarica il PDF
              </a>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-notte sm:text-3xl">Idee per usarli</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded-[1.2rem] bg-crema p-4 text-notte">
            <strong>Un biglietto per i nonni.</strong> Piegate il foglio colorato a metà e scrivete dentro una frase di auguri: ne trovate di brevi nella{" "}
            <Link href={PERCORSO_BIGLIETTI_NATALE} className="font-bold text-viola underline">
              pagina dei biglietti di Natale
            </Link>
            .
          </li>
          <li className="rounded-[1.2rem] bg-crema p-4 text-notte">
            <strong>Insieme alla letterina.</strong> Un disegno colorato da mettere nella busta con la{" "}
            <Link href={PERCORSO_LETTERINA} className="font-bold text-viola underline">
              letterina a Babbo Natale
            </Link>
            .
          </li>
          <li className="rounded-[1.2rem] bg-crema p-4 text-notte">
            <strong>Un pomeriggio in classe.</strong> Il PDF con tutti e dieci si stampa una volta e basta per un gruppo: ognuno sceglie il suo.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold text-notte sm:text-3xl">Domande frequenti</h2>
        <FaqVetrina voci={FAQ} />
      </section>
    </Contenitore>
  );
}
