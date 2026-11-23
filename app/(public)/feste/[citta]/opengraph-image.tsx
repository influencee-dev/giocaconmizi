import { cittaFeste, localiDaFesta } from "@/lib/directory/feste";
import { dimensioniOg, immagineOg } from "@/lib/seo/og";

export const alt = "Festa di compleanno per bambini — Giocamizi";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di condivisione di una pagina città: la keyword locale in grande. */
export default async function Image({ params }: { params: Promise<{ citta: string }> }) {
  const { citta } = await params;
  const voce = cittaFeste(citta);
  return immagineOg({
    titolo: voce ? `Festa di compleanno per bambini a ${voce.citta}` : "Feste di compleanno per bambini",
    etichetta: voce ? `${localiDaFesta(voce).length} posti verificati` : "Città per città",
    sottotitolo: "Zona per zona, con prezzi, età e cosa chiedere",
    tinta: "rosa",
    invito: "Scegli su giocamizi.it",
  });
}
