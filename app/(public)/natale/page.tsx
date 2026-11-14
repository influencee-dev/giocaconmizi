import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FaqVetrina, InBreve } from "@/components/vetrina";
import { JsonLd, jsonLdFaq } from "@/components/seo/JsonLd";
import { CITTA_EVENTI, eventiAttivi } from "@/lib/eventi-natale";
import { MOTIVI } from "@/components/biglietti/motivi";
import { PERCORSO_BIGLIETTI_NATALE, PERCORSO_COME_SCRIVERE, PERCORSO_EVENTI, PERCORSO_LETTERINA, PERCORSO_NATALE, RISPOSTA_BREVE_NATALE } from "@/lib/natale";

export const metadata: Metadata = {
  title: "Natale per bambini: letterina, biglietti, eventi e giochi gratis",
  description:
    "Il Natale di Mizi: letterina a Babbo Natale da compilare e stampare, biglietti di Natale da personalizzare o colorare, eventi di Natale per bambini città per città. Gratis e senza pubblicità.",
  alternates: { canonical: PERCORSO_NATALE },
};

export const revalidate = 3600;

const FAQ = [
  {
    domanda: "Cosa trovo nel Natale di Giocamizi?",
    risposta:
      "La letterina a Babbo Natale da compilare e stampare (anche da colorare), i biglietti di auguri di Natale da personalizzare, gli eventi di Natale per bambini nelle città italiane e, da dicembre, le favole di Mizi da leggere e colorare.",
  },
  {
    domanda: "È tutto gratis?",
    risposta: "Sì, gratis e senza pubblicità. Non serve registrarsi: i dati che scrivi nella letterina e nei biglietti restano sul tuo dispositivo.",
  },
  {
    domanda: "Quando escono le favole di Natale di Mizi?",
    risposta: "Da dicembre, una alla volta, da leggere sul sito e da stampare con i disegni da colorare. Chi è iscritto alla posta di Mizi riceve l'avviso.",
  },
];

export default function NatalePage() {
  const citta = CITTA_EVENTI.filter((c) => eventiAttivi(c).length > 0);
  // Ogni scheda ha il suo disegno: si capisce anche senza leggere (studio UX 14/11/2026).
  const pezzi = [
    { titolo: "Letterina a Babbo Natale", testo: "Frasi pronte per età, lista dei desideri, la busta da colorare. PDF da stampare.", href: PERCORSO_LETTERINA, tono: "bg-rosa/15 border-rosa/40", motivo: "natale-regali" },
    { titolo: "Come scrivere la letterina", testo: "Le parti della lettera ed esempi completi per 3-5, 6-8 e 9-12 anni.", href: PERCORSO_COME_SCRIVERE, tono: "bg-verde/10 border-verde/40", motivo: "natale-neve" },
    { titolo: "Biglietti di Natale", testo: "Auguri da personalizzare con il nome, per nonni, maestre e amici.", href: PERCORSO_BIGLIETTI_NATALE, tono: "bg-giallo/15 border-giallo/50", motivo: "natale" },
    { titolo: "Eventi di Natale per bambini", testo: "Villaggi di Babbo Natale, mercatini e laboratori nella tua città.", href: PERCORSO_EVENTI, tono: "bg-azzurro/15 border-azzurro/40", motivo: "natale-renne" },
    { titolo: "Le favole di Mizi", testo: "In arrivo a dicembre: storie buffe da leggere e da colorare.", href: "/storie", tono: "bg-viola/10 border-viola/40", motivo: "natale-dolci" },
  ];
  return (
    <Contenitore className="py-10">
      <JsonLd data={jsonLdFaq(FAQ)} />
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Il Natale di Mizi</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        Tutto quello che serve a dicembre, gratis: la letterina, i biglietti, gli eventi per uscire e le favole per la sera.
      </p>
      <InBreve className="mt-6">{RISPOSTA_BREVE_NATALE}</InBreve>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pezzi.map((p) => (
          <Link key={p.titolo} href={p.href} className={`flex flex-col gap-2 rounded-[1.6rem] border-2 p-6 hover:shadow-md ${p.tono}`} data-scheda-natale>
            {MOTIVI[p.motivo] && (
              <svg viewBox="0 0 40 40" className="h-14 w-14" aria-hidden>
                {MOTIVI[p.motivo].motivo(MOTIVI[p.motivo].tinte)}
              </svg>
            )}
            <span className="text-xl font-extrabold text-notte">{p.titolo}</span>
            <span className="text-notte-tenue">{p.testo}</span>
            <span className="mt-auto pt-2 font-extrabold text-viola-forte">Apri →</span>
          </Link>
        ))}
      </div>

      {citta.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-notte sm:text-3xl">Eventi di Natale per bambini, città per città</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {citta.map((c) => (
              <Link key={c.slug} href={`${PERCORSO_EVENTI}/${c.slug}`} className="rounded-bolla border-2 border-notte/10 bg-white px-4 py-2 font-bold text-notte hover:border-viola hover:text-viola">
                {c.citta}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold text-notte sm:text-3xl">Domande frequenti</h2>
        <FaqVetrina voci={FAQ} />
      </section>
    </Contenitore>
  );
}
