import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { FormAccesso } from "./FormAccesso";

export const metadata: Metadata = {
  title: "Accedi",
  description:
    "Accedi con un link via email per salvare l'avanzamento e scaricare i PDF. I giochi restano gratis anche senza account.",
  // Pagina di servizio: non deve competere con gli hub nei risultati di ricerca.
  robots: { index: false, follow: true },
};

export default function AccediPage() {
  return (
    <Contenitore className="py-12">
      <h1 className="text-3xl font-extrabold text-notte">Accedi</h1>
      <p className="mt-4 max-w-xl text-lg text-notte-tenue">
        Niente password. Scrivi la tua email e ti mandiamo un link per entrare.
        I giochi si usano anche senza accedere: l&apos;account serve solo a salvare
        l&apos;avanzamento dei bambini e a scaricare i PDF.
      </p>

      <div className="mt-8 max-w-xl">
        <FormAccesso />
      </div>
    </Contenitore>
  );
}
