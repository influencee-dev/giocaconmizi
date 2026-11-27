import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { CONTRIBUTI, eTipoContributo, type TipoContributo } from "./contributi";

/**
 * Pagamenti con Stripe Checkout (lotto 1 di docs/piano-ai-a-pagamento.md).
 *
 * - La pagina di pagamento è quella di Stripe: carta, Apple Pay, Google Pay e
 *   PayPal (attivato nel pannello di Stripe). Sul sito non passa nessun dato di pagamento.
 * - Un pagamento apre l'accesso solo dopo il controllo con Stripe: dal webhook
 *   firmato (/api/stripe/webhook) o dalla pagina di ritorno, che rilegge la
 *   sessione da Stripe. La registrazione è idempotente: contarla due volte non fa danni.
 * - Chiavi solo su Vercel: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET. La scrittura
 *   nel database usa SUPABASE_SERVICE_ROLE_KEY, solo dal server.
 * - Nel server delle verifiche (GIOCAMIZI_ADMIN_PROVA, mai su Vercel) e senza
 *   chiave, il pagamento è finto: si passa da /pagamento/prova.
 */

export const stripeAttivo = () => Boolean(process.env.STRIPE_SECRET_KEY);
/** Vero con una chiave di prova di Stripe (sk_test_…): nessun incasso vero. */
export const modalitaProva = () => !process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
export const inServerDiProva = () => Boolean(process.env.GIOCAMIZI_ADMIN_PROVA && !process.env.VERCEL);

let cliente: Stripe | null = null;
export function stripe(): Stripe | null {
  const chiave = process.env.STRIPE_SECRET_KEY;
  if (!chiave) return null;
  cliente ??= new Stripe(chiave);
  return cliente;
}

export interface DatiSessione {
  tipo: TipoContributo;
  /** Mamma collegata (per mamma_anno). */
  utente?: string;
  email?: string;
  /** Chiave della scheda e codice del link personale (per scheda). */
  chiave?: string;
  codice?: string;
  /** Origine del sito per gli indirizzi di ritorno (https://giocamizi.it). */
  origine: string;
}

/** Crea il pagamento e restituisce l'indirizzo dove mandare la persona. */
export async function creaPagamento(d: DatiSessione): Promise<{ url: string } | { errore: string }> {
  const c = CONTRIBUTI[d.tipo];
  const ritorno = d.tipo === "scheda" && d.codice ? `/la-tua-scheda/${d.codice}` : "/profilo";
  const s = stripe();
  if (!s) {
    if (inServerDiProva()) {
      const q = new URLSearchParams({ tipo: d.tipo, ...(d.utente && { utente: d.utente }), ...(d.chiave && { chiave: d.chiave }), ritorno });
      return { url: `${d.origine}/pagamento/prova?${q}` };
    }
    return { errore: "I pagamenti non sono ancora attivi." };
  }
  try {
    const sessione = await s.checkout.sessions.create({
      mode: "payment",
      locale: "it",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: c.importoCent,
            product_data: { name: c.nome, description: c.descrizione },
          },
        },
      ],
      ...(d.email && { customer_email: d.email }),
      // Le attività hanno spesso la partita IVA: Stripe la chiede per la fattura.
      ...(d.tipo === "scheda" && { tax_id_collection: { enabled: true }, billing_address_collection: "required" as const }),
      client_reference_id: d.utente ?? d.chiave,
      metadata: { tipo: d.tipo, ...(d.utente && { utente: d.utente }), ...(d.chiave && { chiave: d.chiave }) },
      payment_intent_data: { metadata: { tipo: d.tipo, ...(d.chiave && { chiave: d.chiave }) } },
      success_url: `${d.origine}/pagamento/grazie?sessione={CHECKOUT_SESSION_ID}&ritorno=${encodeURIComponent(ritorno)}`,
      cancel_url: `${d.origine}/pagamento/annullato?ritorno=${encodeURIComponent(ritorno)}`,
    });
    return sessione.url ? { url: sessione.url } : { errore: "Stripe non ha dato l'indirizzo del pagamento." };
  } catch (e) {
    console.error("[stripe] pagamento non creato", e instanceof Error ? e.message : e);
    return { errore: "Il pagamento non è partito: riprova tra poco." };
  }
}

function dbServizio() {
  const chiave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!chiave) return null;
  return createClient(SUPABASE_URL, chiave, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Registra un pagamento riuscito e apre l'accesso. Vero se registrato (o già registrato prima). */
export async function registraSessione(sessione: Stripe.Checkout.Session): Promise<boolean> {
  if (sessione.payment_status !== "paid") return false;
  const tipo = sessione.metadata?.tipo;
  if (!eTipoContributo(tipo)) return false;
  // L'importo pagato deve essere quello del listino: niente accessi aperti da sessioni manomesse.
  if (sessione.amount_total !== CONTRIBUTI[tipo].importoCent || sessione.currency !== "eur") {
    console.error("[stripe] importo inatteso", sessione.id, sessione.amount_total, sessione.currency);
    return false;
  }
  const db = dbServizio();
  if (!db) {
    console.error("[stripe] manca SUPABASE_SERVICE_ROLE_KEY: pagamento non registrato", sessione.id);
    return false;
  }
  const { error } = await db.rpc("ai_registra_pagamento", {
    p_sessione: sessione.id,
    p_tipo: tipo,
    p_utente: sessione.metadata?.utente ?? null,
    p_chiave: sessione.metadata?.chiave ?? null,
    p_importo_cent: sessione.amount_total,
    p_prova: !sessione.livemode,
  });
  if (error) {
    console.error("[stripe] registrazione fallita", sessione.id, error.message);
    return false;
  }
  return true;
}

/** Dalla pagina di ritorno: rilegge la sessione da Stripe (mai fidarsi dell'indirizzo) e la registra. */
export async function confermaDaRitorno(id: string): Promise<{ ok: boolean; tipo?: TipoContributo }> {
  const s = stripe();
  if (!s || !/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return { ok: false };
  try {
    const sessione = await s.checkout.sessions.retrieve(id);
    const ok = await registraSessione(sessione);
    const tipo = sessione.metadata?.tipo;
    return { ok, ...(eTipoContributo(tipo) && { tipo }) };
  } catch {
    return { ok: false };
  }
}
