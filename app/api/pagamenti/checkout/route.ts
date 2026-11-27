import { NextResponse } from "next/server";
import { utenteCorrente } from "@/lib/supabase/server";
import { apriInvito } from "@/lib/directory/directory-db";
import { eTipoContributo } from "@/lib/pagamenti/contributi";
import { creaPagamento } from "@/lib/pagamenti/stripe";

/**
 * Avvia un pagamento con Stripe Checkout.
 * - mamma_anno: serve la mamma collegata (area genitori);
 * - scheda: serve il codice valido del link personale dell'attività.
 * Il prezzo lo decide il server (lib/pagamenti/contributi.ts), mai il browser.
 */
export async function POST(req: Request) {
  const corpo = (await req.json().catch(() => null)) as { tipo?: unknown; codice?: unknown } | null;
  const tipo = corpo?.tipo;
  if (!eTipoContributo(tipo)) return NextResponse.json({ errore: "Contributo non valido." }, { status: 400 });
  const origine = new URL(req.url).origin;

  if (tipo === "mamma_anno") {
    const utente = await utenteCorrente();
    if (!utente) return NextResponse.json({ errore: "Prima accedi con la tua email." }, { status: 401 });
    const r = await creaPagamento({ tipo, utente: utente.id, email: utente.email ?? undefined, origine });
    return "url" in r ? NextResponse.json(r) : NextResponse.json(r, { status: 503 });
  }

  const codice = typeof corpo?.codice === "string" ? corpo.codice : "";
  const invito = await apriInvito(codice);
  if (!invito) return NextResponse.json({ errore: "Link non valido o scaduto." }, { status: 401 });
  const r = await creaPagamento({ tipo, chiave: invito.chiave, codice, origine });
  return "url" in r ? NextResponse.json(r) : NextResponse.json(r, { status: 503 });
}
