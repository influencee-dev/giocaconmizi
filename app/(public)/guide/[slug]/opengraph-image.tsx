import { guida } from "@/lib/contenuti/guide";
import { dimensioniOg, immagineOg } from "@/lib/seo/og";

export const alt = "Guida per i genitori — Giocamizi";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di condivisione di una guida o di un articolo: la domanda in grande. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const voce = guida(slug);
  return immagineOg({
    titolo: voce?.titolo ?? "Guide per i genitori",
    etichetta: voce ? `Guida per i genitori · ${voce.minutiLettura} minuti` : "Guide per i genitori",
    sottotitolo: "Scritta da una mamma, con i giochi per esercitarsi",
    tinta: "giallo",
    invito: "Leggi su giocamizi.it",
  });
}
