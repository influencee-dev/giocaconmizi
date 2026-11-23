import { dimensioniOg, immagineOg } from "@/lib/seo/og";

export const alt = "Giocamizi — giochi educativi gratis per bambini dai 3 ai 12 anni";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di default del sito (home e pagine senza anteprima propria). */
export default function Image() {
  return immagineOg({
    titolo: "Giochi educativi gratis per bambini dai 3 ai 12 anni",
    etichetta: "Gratis · senza pubblicità",
    sottotitolo: "Giochi, storie, inviti di compleanno e guide per i genitori",
    tinta: "viola",
    invito: "Gioca su giocamizi.it",
  });
}
