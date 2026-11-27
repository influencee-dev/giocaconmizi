import { immagineStoria } from "@/lib/seo/og";

/**
 * /genitori/sotto-pressione/storia: l'immagine verticale (1080×1920) per
 * condividere il test nelle storie (26/11/2026). La usa il tasto «Condividi
 * nelle storie» di components/genitori/CondividiTest.tsx. Mai il risultato di
 * chi ha fatto il test: solo l'invito.
 */
export const dynamic = "force-static";

export async function GET() {
  return immagineStoria({
    titolo: "E tu che mamma diventi sotto pressione?",
    etichetta: "Il test · 10 minuti · gratis",
    sottotitolo: "Le risposte restano sul tuo telefono",
    tinta: "rosa",
    indirizzo: "giocamizi.it/test",
  });
}
