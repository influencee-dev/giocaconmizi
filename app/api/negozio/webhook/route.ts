import { NextResponse, type NextRequest } from "next/server";
import { avvisaVendita, mandaPdfAcquistati } from "@/lib/email/email-negozio";
import { emailGiaInviata, firmaValida, leggiAcquisto, segnaEmailInviata, stripeDiProva } from "@/lib/negozio/stripe";

/**
 * POST /api/negozio/webhook: Stripe avvisa che un pagamento è andato a buon fine.
 * Da registrare nel pannello di Stripe (Sviluppatori → Webhook) con gli eventi
 * checkout.session.completed e checkout.session.async_payment_succeeded;
 * il segreto dell'endpoint va su Vercel come STRIPE_WEBHOOK_SECRET.
 *
 * Il corpo dell'evento non ci basta: rileggiamo la sessione da Stripe, così
 * contano solo i dati che Stripe conferma. Poi email a chi ha comprato e a Giorgia,
 * una volta sola (segno nei metadati del pagamento).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTI = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

export async function POST(request: NextRequest) {
  const corpo = await request.text();
  const segreto = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  if (!firmaValida(corpo, request.headers.get("stripe-signature"), segreto)) {
    return NextResponse.json({ errore: "firma non valida" }, { status: 400 });
  }

  let evento: { type?: string; data?: { object?: { id?: string } } };
  try {
    evento = JSON.parse(corpo);
  } catch {
    return NextResponse.json({ errore: "JSON non valido" }, { status: 400 });
  }
  if (!evento.type || !EVENTI.has(evento.type)) return NextResponse.json({ ok: true, ignorato: evento.type ?? null });

  const acquisto = await leggiAcquisto(evento.data?.object?.id ?? "");
  // Pagamento non ancora arrivato (es. bonifico): ci riavviserà Stripe con async_payment_succeeded.
  if (!acquisto || !acquisto.pagato) return NextResponse.json({ ok: true, inAttesa: true });
  if (!acquisto.pagamento) return NextResponse.json({ ok: true });

  try {
    if (await emailGiaInviata(acquisto.pagamento)) return NextResponse.json({ ok: true, giaInviata: true });
  } catch (e) {
    // Senza poter leggere il segno rispondiamo 500: Stripe riprova più tardi.
    console.warn("negozio: segno email non letto", (e as Error).message);
    return NextResponse.json({ errore: "riprova" }, { status: 500 });
  }

  const inviata = acquisto.email ? await mandaPdfAcquistati(acquisto.email, acquisto.id, acquisto.codici) : false;
  await avvisaVendita(acquisto.codici, acquisto.totale, stripeDiProva());
  if (inviata) await segnaEmailInviata(acquisto.pagamento).catch(() => {});
  else console.warn("negozio: email con i PDF non partita", acquisto.id);

  return NextResponse.json({ ok: true, email: inviata });
}
