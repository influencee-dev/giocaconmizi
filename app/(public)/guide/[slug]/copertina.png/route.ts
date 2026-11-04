import { GUIDE } from "@/lib/guide";
import Immagine from "../opengraph-image";

/**
 * La copertina della guida a un indirizzo fisso (/guide/<slug>/copertina.png):
 * è la stessa immagine dell'anteprima social, ma quella ha un nome che cambia
 * a ogni build. Serve all'Article JSON-LD, che vuole un'immagine stabile.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return GUIDE.map((g) => ({ slug: g.slug }));
}

export async function GET(_richiesta: Request, { params }: { params: Promise<{ slug: string }> }) {
  return Immagine({ params });
}
