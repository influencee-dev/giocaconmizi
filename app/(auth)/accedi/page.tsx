import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FormAccesso } from "./FormAccesso";

export const metadata: Metadata = {
  title: "Accedi",
  description:
    "Accedi con un link via email per salvare l'avanzamento e scaricare i PDF. I giochi restano gratis anche senza account.",
  // Pagina di servizio: non deve competere con gli hub nei risultati di ricerca.
  robots: { index: false, follow: true },
};

export default async function AccediPage({ searchParams }: { searchParams: Promise<{ errore?: string }> }) {
  const { errore } = await searchParams;
  return (
    <Contenitore className="py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mizi/mizi-intera.webp" alt="" width={300} height={380} className="h-24 w-auto shrink-0" />
          <div>
            <h1 className="text-3xl font-black text-notte">Accedi</h1>
            <p className="mt-1 flex items-center gap-1.5 font-bold text-notte-tenue">
              <KeyRound className="h-4 w-4 shrink-0" strokeWidth={2.6} aria-hidden /> Niente password
            </p>
          </div>
        </div>
        <p className="mt-5 text-lg text-notte">
          Scrivi la tua email: ti mandiamo un link e con un tocco sei dentro. Serve a salvare i progressi dei bambini e a scaricare i PDF.
        </p>

        <div className="mt-6">
          <FormAccesso errore={errore} />
        </div>

        <p className="mt-8 text-center text-notte-tenue">
          I giochi funzionano anche senza accedere.{" "}
          <Link href="/giochi" className="font-black text-viola underline underline-offset-4">
            Vai ai giochi
          </Link>
        </p>
      </div>
    </Contenitore>
  );
}
