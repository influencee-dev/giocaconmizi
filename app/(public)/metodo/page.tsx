import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hub } from "@/lib/content";
import { PaginaHub } from "@/components/vetrina/PaginaHub";

export async function generateMetadata(): Promise<Metadata> {
  const contenuto = hub("metodo");
  return {
    title: contenuto?.title ?? "Il metodo",
    description:
      contenuto?.description ??
      "Come scegliamo e costruiamo i giochi: una competenza per gioco, niente timer, feedback gentile.",
    alternates: { canonical: "/metodo" },
  };
}

export default function MetodoPage() {
  const contenuto = hub("metodo");
  if (!contenuto) notFound();

  return (
    <PaginaHub
      titolo={contenuto.title}
      html={contenuto.html}
      occhiello="Come scegliamo i giochi"
      tono="azzurro"
      foto="I-02"
      inBreve="Ogni gioco di Giocamizi segue una regola: un gioco, una competenza, un adulto vicino. Niente timer e niente punteggi da battere, l'errore non chiude la partita, e le cinque caratteristiche del gioco che fa imparare (gioioso, significativo, attivo, ripetibile, sociale) vengono dalla ricerca della LEGO Foundation."
      faq={[
        { domanda: "Perché i giochi non hanno il timer?", risposta: "Il tempo che corre crea ansia e spinge a tirare a indovinare. Senza timer il bambino ragiona, sbaglia e riprova con calma." },
        { domanda: "Che cosa vuol dire «un gioco, una competenza»?", risposta: "Ogni gioco allena una cosa sola, per esempio contare fino a 10 o riconoscere le vocali, come nei materiali Montessori: così il bambino sa cosa sta imparando e può correggersi da solo." },
        { domanda: "Serve un adulto vicino?", risposta: "Non è obbligatorio, ma aiuta: ogni gioco ha tre suggerimenti per giocare insieme, perché il gioco guidato da un adulto funziona meglio sia del gioco libero sia della lezione." },
        { domanda: "Da dove vengono queste regole?", risposta: "Dalla ricerca sull'apprendimento attraverso il gioco (LEGO Foundation, Active Playful Learning) e dal metodo Montessori. Le fonti sono elencate in fondo alla pagina." },
      ]}
    />
  );
}
