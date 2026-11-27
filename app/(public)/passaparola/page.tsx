import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { TestataPagina } from "@/components/vetrina";
import { Passaparola } from "@/components/ui/Passaparola";

export const metadata: Metadata = {
  title: "Fai conoscere Giocamizi",
  description: "Manda Giocamizi a un'amica o nel gruppo della classe: giochi educativi gratis, senza pubblicità e senza registrazione.",
  alternates: { canonical: "/passaparola" },
  robots: { index: false, follow: true },
};

/** Dove porta il bottone «Mandalo su WhatsApp» della terza email di benvenuto. */
export default function PassaparolaPage() {
  return (
    <Contenitore className="pb-12 pt-8">
      <TestataPagina occhiello="Grazie del passaparola" tono="rosa">
        <h1>Mandalo a un&apos;amica</h1>
        <p className="text-notte-tenue">Il messaggio è già scritto: tocca il bottone e scegli a chi mandarlo.</p>
        <div className="max-w-xl">
          <Passaparola />
        </div>
        <p className="text-notte-tenue">Giocamizi resta gratis e senza pubblicità grazie al passaparola tra mamme. Grazie!</p>
      </TestataPagina>
    </Contenitore>
  );
}
