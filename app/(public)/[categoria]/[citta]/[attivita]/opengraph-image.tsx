import { scheda } from "@/lib/directory/directory";
import { dimensioniOg, immagineOg } from "@/lib/seo/og";

export const alt = "Scheda di un'attività per bambini — Giocamizi";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di condivisione di una scheda della directory: nome del posto e città. */
export default async function Image({ params }: { params: Promise<{ categoria: string; citta: string; attivita: string }> }) {
  const { categoria, citta, attivita } = await params;
  const s = scheda(categoria, citta, attivita);
  return immagineOg({
    titolo: s ? `${s.nome}, ${s.citta}` : "Posti per bambini nella tua città",
    etichetta: s ? s.categoria.nome : "Directory per famiglie",
    sottotitolo: s ? (s.festa ? "Fa feste di compleanno · la scheda con tutto quello che serve" : "La scheda con tutto quello che serve sapere") : undefined,
    tinta: s?.festa ? "rosa" : "arancio",
    invito: "Guarda la scheda su giocamizi.it",
  });
}
