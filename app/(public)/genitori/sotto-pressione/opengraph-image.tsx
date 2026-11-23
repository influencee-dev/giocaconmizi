import { dimensioniOg, immagineOg } from "@/lib/seo/og";

export const alt = "Il test per i genitori: che mamma diventi sotto pressione? — Giocamizi";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima del test: la domanda che fa venire voglia di farlo. */
export default function Image() {
  return immagineOg({
    titolo: "E tu che tipo di mamma sei quando sei sotto pressione?",
    etichetta: "Il test · 10 minuti · gratis",
    sottotitolo: "45 domande e un esercizio per la settimana",
    tinta: "rosa",
    invito: "Fai il test su giocamizi.it",
  });
}
