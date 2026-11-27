import { NextResponse } from "next/server";
import { registraSessione, stripe } from "@/lib/pagamenti/stripe";

/**
 * Il webhook di Stripe: apre l'accesso SOLO se la firma è valida
 * (STRIPE_WEBHOOK_SECRET su Vercel). Stripe può mandare lo stesso evento
 * più volte: la registrazione nel database è idempotente.
 */
export async function POST(req: Request) {
  const s = stripe();
  const segreto = process.env.STRIPE_WEBHOOK_SECRET;
  const firma = req.headers.get("stripe-signature");
  if (!s || !segreto || !firma) return NextResponse.json({ errore: "non configurato" }, { status: 400 });
  const corpo = await req.text();
  let evento;
  try {
    evento = s.webhooks.constructEvent(corpo, firma, segreto);
  } catch {
    return NextResponse.json({ errore: "firma non valida" }, { status: 400 });
  }
  if (evento.type === "checkout.session.completed" || evento.type === "checkout.session.async_payment_succeeded") {
    const ok = await registraSessione(evento.data.object);
    // 500 = Stripe riprova più tardi (per esempio se il database era in pausa).
    if (!ok && evento.data.object.payment_status === "paid") return NextResponse.json({ errore: "non registrato" }, { status: 500 });
  }
  return NextResponse.json({ ricevuto: true });
}
