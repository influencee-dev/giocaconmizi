import type { Metadata } from "next";
import { Suspense } from "react";
import { Contenitore } from "@/components/ui";
import { Invito } from "@/components/biglietti/Invito";

export const metadata: Metadata = {
  title: "Un invito per te",
  description: "Apri l'invito e conferma con un tocco su WhatsApp.",
  // Ogni invito è unico e privato: fuori dai motori di ricerca.
  robots: { index: false, follow: false },
};

export default function VediInvitoPage() {
  return (
    <Contenitore className="py-8">
      <Suspense fallback={null}>
        <Invito />
      </Suspense>
    </Contenitore>
  );
}
