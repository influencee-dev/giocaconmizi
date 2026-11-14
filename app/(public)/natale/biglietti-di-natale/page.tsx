import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FaqVetrina, InBreve } from "@/components/vetrina";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { auguriPerTema } from "@/cards/registry";
import { linkAlTool } from "@/lib/biglietti";
import { PERCORSO_BIGLIETTI_NATALE, PERCORSO_LETTERINA, PERCORSO_NATALE } from "@/lib/natale";

export const metadata: Metadata = {
  title: "Biglietti di Natale da stampare e personalizzare gratis",
  description:
    "Biglietti di auguri di Natale da personalizzare con il nome, da stampare, mandare su WhatsApp o colorare. Frasi pronte per nonni, maestre e amici. Gratis, senza registrazione.",
  alternates: { canonical: PERCORSO_BIGLIETTI_NATALE },
};

const RISPOSTA_BREVE =
  "Un biglietto di Natale fatto in casa si prepara in due minuti: scegli lo sfondo di Natale, scrivi il nome di chi lo riceve e una frase di auguri, poi lo stampi in A6 (quattro per foglio A4), lo mandi su WhatsApp o lo stampi in bianco e nero da far colorare ai bambini. Su Giocamizi è gratis e senza registrazione.";

const FAQ = [
  {
    domanda: "Come faccio un biglietto di Natale personalizzato gratis?",
    risposta:
      "Apri il creatore con lo sfondo di Natale già scelto, scrivi il nome di chi lo riceve e tocca una frase pronta (o scrivila tu). Puoi aggiungere adesivi, Mizi e una foto, poi scarichi il PNG o lo mandi su WhatsApp.",
  },
  {
    domanda: "Ci sono biglietti di Natale da colorare?",
    risposta:
      "Sì: scegli la versione «Da colorare» e il biglietto diventa a soli contorni neri su fondo bianco, da stampare e far colorare ai bambini prima di regalarlo.",
  },
  {
    domanda: "Che frase scrivo sul biglietto di Natale per la maestra o i nonni?",
    risposta:
      "Una frase breve e personale funziona meglio di una lunga: «Grazie di esserci, buone feste!» per la maestra, «Ti auguro un Natale caldo come una tazza di cioccolata» per i nonni. Nel creatore trovi le frasi pronte e le puoi cambiare.",
  },
  {
    domanda: "In che formato si stampa?",
    risposta:
      "A6 per il biglietto di carta classico (ne entrano quattro in un foglio A4, con i segni di taglio), A5 se lo vuoi più grande, verticale per WhatsApp e le storie.",
  },
];

const PER_CHI = [
  { chi: "Per i nonni", frase: "Ti auguro un Natale caldo come una tazza di cioccolata." },
  { chi: "Per la maestra", frase: "Grazie di esserci, buone feste!" },
  { chi: "Per gli amici", frase: "Buone feste! Ci vediamo sotto l'albero." },
];

export default function BigliettiNatalePage() {
  const scelte = [
    { titolo: "Auguri di Natale", testo: "Sfondo con albero e renne, frasi di auguri pronte.", href: linkAlTool({ tipo: "auguri", tema: "natale", variante: "colorato", formato: "a6" }) },
    { titolo: "Da colorare", testo: "Solo contorni neri: lo stampi e lo colorano i bambini.", href: linkAlTool({ tipo: "auguri", tema: "natale", variante: "colorare", formato: "a6" }) },
    { titolo: "Per WhatsApp", testo: "Verticale, pronto da mandare dal telefono.", href: linkAlTool({ tipo: "auguri", tema: "natale", variante: "chiaro", formato: "story" }) },
    { titolo: "Invito alla festa di Natale", testo: "Per la merenda o la festa con gli amici.", href: linkAlTool({ tipo: "invito", tema: "natale", variante: "colorato", formato: "a6" }) },
  ];

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Natale", percorso: PERCORSO_NATALE },
          { nome: "Biglietti di Natale", percorso: PERCORSO_BIGLIETTI_NATALE },
        ])}
      />
      <JsonLd data={jsonLdFaq(FAQ)} />

      <nav aria-label="Percorso" className="text-sm font-bold text-notte-tenue">
        <Link href={PERCORSO_NATALE} className="text-viola hover:underline">
          Natale
        </Link>{" "}
        / Biglietti di Natale
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold text-notte sm:text-4xl">Biglietti di Natale da stampare e personalizzare</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        Scegli il biglietto, scrivi il nome di chi lo riceve, stampalo o mandalo su WhatsApp. C&apos;è anche la versione da colorare.
      </p>
      <InBreve className="mt-6">{RISPOSTA_BREVE}</InBreve>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scelte.map((s) => (
          <Link key={s.titolo} href={s.href} className="flex flex-col gap-2 rounded-[1.4rem] border-2 border-notte/10 bg-white p-5 hover:border-viola">
            <span className="text-lg font-extrabold text-notte">{s.titolo}</span>
            <span className="text-sm text-notte-tenue">{s.testo}</span>
            <span className="mt-auto pt-2 text-sm font-extrabold text-viola">Crea il biglietto →</span>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-notte sm:text-3xl">Le frasi di auguri pronte</h2>
        <p className="mt-2 text-notte-tenue">Nel creatore compaiono per prime quando scegli lo sfondo di Natale; le puoi sempre cambiare.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {auguriPerTema.natale.map((f) => (
            <li key={f} className="rounded-xl bg-crema px-4 py-3 text-notte">
              {f.replace(/\{nome\}/g, "…")}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {PER_CHI.map((p) => (
            <div key={p.chi} className="rounded-[1.2rem] border border-notte/10 bg-white p-4">
              <p className="font-extrabold text-viola">{p.chi}</p>
              <p className="mt-1 italic text-notte">«{p.frase}»</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold text-notte sm:text-3xl">Domande frequenti</h2>
        <FaqVetrina voci={FAQ} />
      </section>

      <p className="mt-10 text-notte">
        Ti serve anche{" "}
        <Link href={PERCORSO_LETTERINA} className="font-bold text-viola underline">
          la letterina a Babbo Natale
        </Link>
        ? E per uscire:{" "}
        <Link href="/natale/eventi" className="font-bold text-viola underline">
          gli eventi di Natale per bambini nella tua città
        </Link>
        .
      </p>
    </Contenitore>
  );
}
