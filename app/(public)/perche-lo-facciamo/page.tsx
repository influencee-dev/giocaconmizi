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
      "Perché Giocamizi è gratis, senza pubblicità e senza dati dei bambini.",
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
      inBreve="Giocamizi è nato nell'estate 2026, quando mia figlia non aveva voglia di fare i compiti. È gratis, senza pubblicità e senza dati dei bambini, e così resta: non l'ho fatto per guadagnare."
      faq={[
        { domanda: "Perché Giocamizi è gratis?", risposta: "Perché non l'ho fatto per guadagnare: i giochi restano gratis per tutti, senza abbonamenti né acquisti nascosti." },
        { domanda: "Ci sono pubblicità o tracciamenti?", risposta: "No pubblicità, mai. Le statistiche sono anonime e i bambini non hanno account: l'elenco completo è nella pagina privacy." },
        { domanda: "Posso proporre un gioco o collaborare?", risposta: "Sì: scrivimi a ciao@giocamizi.it." },
      ]}
    />
  );
}
