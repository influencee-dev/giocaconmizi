import { NextResponse, type NextRequest } from "next/server";
import { GIORNI_SCARICO, fileAcquistati } from "@/lib/negozio/catalogo";
import { linkFirmato } from "@/lib/negozio/archivio";
import { leggiAcquisto, sessioneValida } from "@/lib/negozio/stripe";

/**
 * GET /api/negozio/scarica?sessione=cs_…&file=disegni-a4&prodotto=v01-disegni
 * Controlla su Stripe che l'acquisto sia pagato e che quel file ne faccia parte,
 * poi rimanda al link firmato dell'archivio privato (vale due minuti).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const nessunaCache = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };

function errore(testo: string, stato: number) {
  return new NextResponse(testo, { status: stato, headers: { ...nessunaCache, "Content-Type": "text/plain; charset=utf-8" } });
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const sessione = q.get("sessione");
  const chiave = q.get("file");
  const codice = q.get("prodotto");
  if (!sessioneValida(sessione) || !chiave || !codice) return errore("Link non valido.", 400);

  const acquisto = await leggiAcquisto(sessione);
  if (!acquisto) return errore("Acquisto non trovato.", 404);
  if (!acquisto.pagato) return errore("Il pagamento non risulta ancora arrivato: riprova tra qualche minuto.", 402);
  if (Date.now() - acquisto.creato > GIORNI_SCARICO * 86_400_000) {
    return errore("Il link è scaduto. Scrivici a ciao@giocamizi.it con l'email dell'acquisto e te lo rimandiamo.", 410);
  }

  const voce = fileAcquistati(acquisto.codici).find((v) => v.prodotto.codice === codice && v.file.chiave === chiave);
  if (!voce) return errore("Questo file non fa parte dell'acquisto.", 404);

  const link = await linkFirmato(voce.file.percorso, voce.file.nome);
  if (!link) return errore("Il file non è disponibile in questo momento. Riprova tra poco o scrivici a ciao@giocamizi.it.", 503);
  return NextResponse.redirect(link, { status: 303, headers: nessunaCache });
}
