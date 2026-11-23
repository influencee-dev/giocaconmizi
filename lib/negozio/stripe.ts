import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stripe senza libreria: tre chiamate REST e la firma dei webhook.
 *
 * Gli ordini vivono in Stripe e basta: nessuna tabella nostra. La sessione di
 * pagamento porta nei metadati i codici dei prodotti (li scriviamo noi, lato
 * server) e l'ora in cui la persona ha accettato la consegna immediata.
 * Chiavi solo lato server, su Vercel: STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET.
 */

const API = "https://api.stripe.com/v1";

const chiave = () => (process.env.STRIPE_SECRET_KEY ?? "").trim();
export const stripeConfigurato = () => chiave().length > 0;
/** Chiave di prova: si paga con le carte finte di Stripe, nessun soldo vero. */
export const stripeDiProva = () => /^(sk|rk)_test_/.test(chiave());

/** I parametri di Stripe vanno in forma «a[b][c]=valore». */
function forma(dati: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(dati)) if (v !== undefined) p.append(k, String(v));
  return p;
}

async function chiama<T>(metodo: "GET" | "POST", percorso: string, dati?: Record<string, string | number | undefined>): Promise<T> {
  if (!stripeConfigurato()) throw new Error("manca STRIPE_SECRET_KEY");
  const r = await fetch(API + percorso, {
    method: metodo,
    headers: { Authorization: `Bearer ${chiave()}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: dati ? forma(dati) : undefined,
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  const json = (await r.json().catch(() => ({}))) as T & { error?: { message?: string } };
  if (!r.ok) throw new Error(`Stripe ${r.status}: ${json.error?.message ?? "errore"}`);
  return json;
}

/** I metadati di Stripe tengono 500 caratteri per voce: i codici si spezzano su più voci. */
const MAX_VOCE = 480;
function codiciInMetadati(codici: string[]): Record<string, string> {
  const voci: string[] = [];
  let riga = "";
  for (const c of codici) {
    if (riga && riga.length + 1 + c.length > MAX_VOCE) {
      voci.push(riga);
      riga = c;
    } else riga = riga ? `${riga},${c}` : c;
  }
  if (riga) voci.push(riga);
  return Object.fromEntries(voci.map((v, i) => [`metadata[prodotti_${i + 1}]`, v]));
}
function codiciDaMetadati(m: Record<string, string> | null | undefined): string[] {
  if (!m) return [];
  return Object.keys(m)
    .filter((k) => /^prodotti_\d+$/.test(k))
    .sort((a, b) => Number(a.split("_")[1]) - Number(b.split("_")[1]))
    .flatMap((k) => m[k].split(","))
    .filter(Boolean);
}

export interface RigaOrdine {
  codice: string;
  nome: string;
  prezzo: number;
}

/** Apre la pagina di pagamento di Stripe e ne restituisce l'indirizzo. */
export async function creaSessione(o: { righe: RigaOrdine[]; sito: string; consensoRecesso: string }): Promise<string> {
  const dati: Record<string, string | number> = {
    mode: "payment",
    locale: "it",
    success_url: `${o.sito}/negozio/grazie?sessione={CHECKOUT_SESSION_ID}`,
    cancel_url: `${o.sito}/negozio/carrello`,
    "metadata[consenso_recesso]": o.consensoRecesso,
    "payment_intent_data[description]": "Giocamizi · PDF da stampare",
    "custom_text[submit][message]":
      "Riceverai subito i PDF in questa pagina e per email. Hai chiesto la consegna immediata: dopo l'acquisto il diritto di recesso non si applica (art. 59, lettera o, Codice del consumo).",
    ...codiciInMetadati(o.righe.map((r) => r.codice)),
  };
  o.righe.forEach((r, i) => {
    dati[`line_items[${i}][quantity]`] = 1;
    dati[`line_items[${i}][price_data][currency]`] = "eur";
    dati[`line_items[${i}][price_data][unit_amount]`] = r.prezzo;
    dati[`line_items[${i}][price_data][product_data][name]`] = r.nome.slice(0, 200);
  });
  const s = await chiama<{ url: string }>("POST", "/checkout/sessions", dati);
  return s.url;
}

export interface Acquisto {
  id: string;
  pagato: boolean;
  email: string | null;
  /** Millisecondi, come Date.now(). */
  creato: number;
  totale: number;
  codici: string[];
  pagamento: string | null;
}

type SessioneStripe = {
  id: string;
  status: string;
  payment_status: string;
  created: number;
  amount_total: number;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string>;
  payment_intent?: string | { id: string } | null;
};

export const sessioneValida = (id: unknown): id is string => typeof id === "string" && /^cs_(test|live)_[A-Za-z0-9]{10,250}$/.test(id);

/** Una piccola memoria per non chiedere a Stripe la stessa sessione a ogni scarico. */
const memoria = new Map<string, { quando: number; a: Acquisto }>();

export async function leggiAcquisto(id: string): Promise<Acquisto | null> {
  if (!sessioneValida(id)) return null;
  const m = memoria.get(id);
  if (m && Date.now() - m.quando < 60_000) return m.a;
  let s: SessioneStripe;
  try {
    s = await chiama<SessioneStripe>("GET", `/checkout/sessions/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
  const a: Acquisto = {
    id: s.id,
    pagato: s.status === "complete" && s.payment_status === "paid",
    email: s.customer_details?.email ?? null,
    creato: s.created * 1000,
    totale: s.amount_total,
    codici: codiciDaMetadati(s.metadata),
    pagamento: typeof s.payment_intent === "string" ? s.payment_intent : (s.payment_intent?.id ?? null),
  };
  if (a.pagato) memoria.set(id, { quando: Date.now(), a });
  if (memoria.size > 500) memoria.delete(memoria.keys().next().value!);
  return a;
}

/**
 * L'email con i link va una volta sola, anche se Stripe ripete il webhook:
 * il segno «email_inviata» sta nei metadati del pagamento, non in una tabella.
 */
export async function emailGiaInviata(pagamento: string): Promise<boolean> {
  const pi = await chiama<{ metadata?: Record<string, string> }>("GET", `/payment_intents/${encodeURIComponent(pagamento)}`);
  return Boolean(pi.metadata?.email_inviata);
}
export async function segnaEmailInviata(pagamento: string) {
  await chiama("POST", `/payment_intents/${encodeURIComponent(pagamento)}`, { "metadata[email_inviata]": new Date().toISOString() });
}

/**
 * Firma dei webhook (intestazione Stripe-Signature: «t=…,v1=…»): HMAC-SHA256 di
 * «t.corpo» con il segreto dell'endpoint. Rifiuta le firme più vecchie di 5 minuti.
 */
export function firmaValida(corpo: string, intestazione: string | null, segreto: string, ora = Date.now()): boolean {
  if (!intestazione || !segreto) return false;
  const parti = intestazione.split(",").map((p) => p.trim().split("="));
  const t = parti.find(([k]) => k === "t")?.[1];
  const firme = parti.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || !/^\d+$/.test(t) || firme.length === 0) return false;
  if (Math.abs(ora / 1000 - Number(t)) > 300) return false;
  const attesa = createHmac("sha256", segreto).update(`${t}.${corpo}`).digest();
  return firme.some((f) => {
    if (!/^[0-9a-f]{64}$/.test(f)) return false;
    const b = Buffer.from(f, "hex");
    return b.length === attesa.length && timingSafeEqual(b, attesa);
  });
}
