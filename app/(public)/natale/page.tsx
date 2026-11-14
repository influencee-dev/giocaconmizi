import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore, Faq } from "@/components/ui";
import { InBreve, TestataPagina } from "@/components/vetrina";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { linkAlTool } from "@/lib/biglietti";
import { FAQ_HUB_NATALE } from "@/lib/natale/pagine";

export const metadata: Metadata = {
  title: "Il Natale di Mizi: letterina a Babbo Natale e biglietti da stampare",
  description:
    "Letterina a Babbo Natale da scrivere e stampare (anche a righe e da colorare), esempi per età e biglietti di auguri di Natale. Gratis, senza registrazione.",
  alternates: { canonical: "/natale" },
};

const PEZZI = [
  {
    href: "/natale/lettera-a-babbo-natale",
    nome: "Lettera a Babbo Natale",
    testo: "Frasi pronte per età, carta di Natale, PDF da stampare. Anche a righe, da colorare e con la busta.",
    dato: "data-natale-letterina",
  },
  {
    href: "/natale/come-scrivere-la-letterina",
    nome: "Come scrivere la letterina",
    testo: "Le quattro parti della lettera ed esempi completi per 3-5, 6-8 e 9-12 anni.",
    dato: "data-natale-come-scrivere",
  },
  {
    href: linkAlTool({ tipo: "auguri", tema: "natale" }),
    nome: "Biglietti di auguri di Natale",
    testo: "Il creatore di biglietti con la cornice di Natale: scrivi gli auguri, scarica, stampa.",
    dato: "data-natale-biglietti",
  },
];

export default function NatalePage() {
  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Il Natale di Mizi", percorso: "/natale" }])} />
      <JsonLd data={jsonLdFaq(FAQ_HUB_NATALE)} />

      <TestataPagina occhiello="Gratis, senza registrazione" tono="rosa">
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Il Natale di Mizi</h1>
        <p className="mt-2 max-w-2xl text-lg text-notte-tenue">
          La letterina a Babbo Natale da scrivere insieme e stampare, gli esempi per ogni età e i biglietti di
          auguri. Tutto gratis, senza pubblicità.
        </p>
      </TestataPagina>

      <InBreve>
        Qui trovi la lettera a Babbo Natale da stampare, con frasi pronte per età, il foglio a righe da
        scrivere a mano e la versione da colorare, più i biglietti di auguri di Natale da personalizzare. Il
        nome e i desideri dei bambini restano sul tuo telefono.
      </InBreve>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {PEZZI.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            data-tap
            {...{ [p.dato]: "" }}
            className="flex flex-col gap-2 rounded-[1.4rem] border border-notte/10 bg-white p-5 hover:border-viola"
          >
            <span className="text-xl font-extrabold text-notte">{p.nome}</span>
            <span className="text-notte-tenue">{p.testo}</span>
          </Link>
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-notte-tenue">
        In arrivo nelle prossime settimane: i biglietti di Natale con le frasi per nonni, maestre e amici, gli
        eventi di Natale per bambini città per città e le favole di Mizi da leggere e colorare.
      </p>

      <Faq voci={FAQ_HUB_NATALE} />
    </Contenitore>
  );
}
