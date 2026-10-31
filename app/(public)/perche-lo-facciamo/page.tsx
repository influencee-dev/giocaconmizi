import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hub } from "@/lib/content";
import { PaginaHub } from "@/components/vetrina/PaginaHub";

export async function generateMetadata(): Promise<Metadata> {
  const contenuto = hub("perche-lo-facciamo");
  return {
    title: contenuto?.title ?? "Perché lo facciamo",
    description:
      contenuto?.description ??
      "Perché Gioca con Mizi è gratis e senza pubblicità, e dove va una parte di quello che guadagniamo.",
    alternates: { canonical: "/perche-lo-facciamo" },
  };
}

export default function PercheLoFacciamoPage() {
  const contenuto = hub("perche-lo-facciamo");
  if (!contenuto) notFound();

  return (
    <PaginaHub
      titolo={contenuto.title}
      html={contenuto.html}
      occhiello="La nostra promessa"
      tono="rosa"
      foto="I-03"
      inBreve="Giocamizi è nato per una bambina e i suoi compiti delle vacanze: cercavamo giochi che aiutassero a leggere e contare, e abbiamo trovato pubblicità, timer e personaggi dei cartoni. Così l'abbiamo costruito noi, gratis e senza pubblicità, e così resterà."
      faq={[
        { domanda: "Perché Giocamizi è gratis?", risposta: "Perché è un progetto personale nato per una bambina, non un'azienda: i giochi restano gratis per tutti, senza abbonamenti né acquisti nascosti." },
        { domanda: "Ci sono pubblicità o tracciamenti?", risposta: "No pubblicità, mai. Le statistiche sono anonime e i bambini non hanno account: l'elenco completo è nella pagina privacy." },
        { domanda: "Posso proporre un gioco o collaborare?", risposta: "Sì: scrivi a Giorgia. Le idee dei genitori e delle maestre sono la fonte principale dei giochi nuovi." },
      ]}
    />
  );
}
