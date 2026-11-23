import { NextResponse, type NextRequest } from "next/server";
import { NEGOZIO_APERTO, controllaCarrello } from "@/lib/negozio/catalogo";
import { creaSessione, stripeConfigurato, stripeDiProva } from "@/lib/negozio/stripe";

/**
 * POST /api/negozio/checkout con { prodotti: string[], recesso: true }.
 * Ricontrolla il carrello lato server (prezzi e codici li decide il catalogo,
 * mai il browser) e apre la pagina di pagamento di Stripe.
 * Negozio chiuso = si paga solo con la chiave di prova.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Al massimo 10 tentativi al minuto per indirizzo: basta a una persona, non a un bot. */
const tentativi = new Map<string, number[]>();
function troppi(ip: string) {
  const ora = Date.now();
  const lista = (tentativi.get(ip) ?? []).filter((t) => ora - t < 60_000);
  lista.push(ora);
  tentativi.set(ip, lista);
  if (tentativi.size > 2000) tentativi.delete(tentativi.keys().next().value!);
  return lista.length > 10;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "locale";
  if (troppi(ip)) return NextResponse.json({ errore: "Troppi tentativi: riprova tra un minuto." }, { status: 429 });

  if (!stripeConfigurato()) return NextResponse.json({ errore: "Il negozio non è ancora attivo." }, { status: 503 });
  const prova = stripeDiProva();
  if (!NEGOZIO_APERTO && !prova) return NextResponse.json({ errore: "Il negozio non è ancora aperto." }, { status: 503 });

  let corpo: { prodotti?: unknown; recesso?: unknown; sito?: unknown };
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ errore: "Richiesta non valida." }, { status: 400 });
  }
  // Campo trappola per i bot: invisibile alle persone, deve restare vuoto.
  if (typeof corpo.sito === "string" && corpo.sito.trim()) return NextResponse.json({ errore: "Richiesta non valida." }, { status: 400 });

  // Consegna immediata di contenuto digitale: serve il consenso espresso e la
  // presa d'atto della perdita del recesso (Codice del consumo, art. 59 lett. o).
  if (corpo.recesso !== true) {
    return NextResponse.json({ errore: "Per ricevere subito i PDF serve la spunta sulla consegna immediata." }, { status: 400 });
  }

  const esito = controllaCarrello(corpo.prodotti, prova);
  if (esito.errore) return NextResponse.json({ errore: "Il carrello non è valido: ricaricalo e riprova." }, { status: 400 });
  if (esito.sottoMinimo) return NextResponse.json({ errore: "Il carrello è sotto l'ordine minimo." }, { status: 400 });

  try {
    const url = await creaSessione({
      righe: esito.prodotti.map((p) => ({ codice: p.codice, nome: `${p.nome} · ${p.volume.titolo}`, prezzo: p.prezzo })),
      sito: new URL(request.url).origin,
      consensoRecesso: new Date().toISOString(),
    });
    return NextResponse.json({ url });
  } catch (e) {
    console.warn("negozio: sessione Stripe non creata", (e as Error).message);
    return NextResponse.json({ errore: "Il pagamento non è partito. Riprova tra poco." }, { status: 502 });
  }
}
