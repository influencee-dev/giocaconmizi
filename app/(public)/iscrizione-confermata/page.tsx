import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { BottoneFreccia, TestataPagina } from "@/components/vetrina";

export const metadata: Metadata = {
  title: "Iscrizione confermata",
  robots: { index: false, follow: false },
};

/** Dove arriva chi tocca «Confermo l'iscrizione» nell'email di Brevo. */
export default function IscrizioneConfermataPage() {
  return (
    <Contenitore largo className="pb-10 pt-8">
      <TestataPagina occhiello="Iscrizione confermata" tono="verde">
        <h1>Grazie, sei dei nostri!</h1>
        <p className="text-notte-tenue">
          Ti scriveremo solo quando ci sono giochi, storie e guide nuove. Puoi cancellarti quando vuoi dal link in
          fondo a ogni email.
        </p>
        <div className="flex flex-wrap gap-3">
          <BottoneFreccia href="/giochi">Scegli un gioco</BottoneFreccia>
          <BottoneFreccia href="/guide" variante="chiaro">Leggi una guida</BottoneFreccia>
        </div>
      </TestataPagina>
    </Contenitore>
  );
}
