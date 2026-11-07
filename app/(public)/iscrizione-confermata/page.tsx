import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { BottoneFreccia, TestataPagina } from "@/components/vetrina";
import { inviaBenvenuto } from "@/lib/brevo";

export const metadata: Metadata = {
  title: "Iscrizione confermata",
  robots: { index: false, follow: false },
};

/**
 * Dove arriva chi tocca «Confermo l'iscrizione» nell'email di Brevo. Il
 * codice ?t= nel link fa partire, una volta sola, l'email di benvenuto.
 */
export default async function IscrizioneConfermataPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  await inviaBenvenuto(t);
  return (
    <Contenitore largo className="pb-10 pt-8">
      <TestataPagina occhiello="Iscrizione confermata" tono="verde">
        <h1>Grazie, sei dei nostri!</h1>
        <p className="text-notte-tenue">
          Ti abbiamo appena mandato un&apos;email di benvenuto. Da oggi ti scriviamo solo quando ci sono giochi, storie e
          guide nuove; puoi cancellarti quando vuoi dal link in fondo a ogni email.
        </p>
        <div className="flex flex-wrap gap-3">
          <BottoneFreccia href="/giochi">Scegli un gioco</BottoneFreccia>
          <BottoneFreccia href="/guide" variante="chiaro">Leggi una guida</BottoneFreccia>
        </div>
      </TestataPagina>
    </Contenitore>
  );
}
