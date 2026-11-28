import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { RicercaAi } from "@/components/cerca/RicercaAi";

export const metadata: Metadata = {
  title: "Cerca con l'AI su Giocamizi",
  description: "Chiedi in parole normali: feste, posti per bambini, giochi e guide. Le risposte vengono solo dalle pagine di Giocamizi.",
  alternates: { canonical: "/cerca" },
  robots: { index: false, follow: true },
};

export default function PaginaCerca() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-5xl">Cerca con l&apos;AI</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        Scrivi cosa cerchi come lo diresti a un&apos;amica. L&apos;AI risponde solo con le pagine di Giocamizi: posti, feste, giochi e guide. Se non trova niente, lo dice.
      </p>
      <div className="mt-6">
        <RicercaAi />
      </div>
      <p className="mt-6 text-xs text-notte-tenue">
        Per migliorare la ricerca salviamo le domande, senza sapere chi le ha scritte. Non scrivere nomi, indirizzi o dati dei bambini.
      </p>
    </Contenitore>
  );
}
