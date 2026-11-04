/**
 * Le chiavi Supabase arrivano dall'ambiente (Vercel / .env.local), con i
 * valori pubblici di produzione come riserva.
 * In build senza variabili il sito pubblico deve comunque compilare: i giochi e
 * i contenuti non richiedono login (piano §2, decisione 1). Per questo esponiamo
 * `supabaseConfigurato` invece di far esplodere l'import.
 */

/**
 * I valori PUBBLICI del progetto di produzione (gli stessi di .env.production):
 * URL e anon key finiscono comunque nel JavaScript del browser, i dati li
 * protegge la RLS. Servono di riserva: una variabile lasciata vuota su Vercel
 * vince sul file .env.production e spegneva accesso, pannello e moduli.
 */
const URL_PRODUZIONE = "https://wrkderhcbzlppkveknyd.supabase.co";
const ANON_PRODUZIONE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indya2RlcmhjYnpscHBrdmVrbnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NjUyODYsImV4cCI6MjEwMzA0MTI4Nn0.W51Zscfzoh9uxpZYdnCryXmV7j2s98JKeeywNf3pw0Q";

/** Una variabile vuota o di soli spazi vale come assente. */
const piena = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const SUPABASE_URL = piena(process.env.NEXT_PUBLIC_SUPABASE_URL) ?? URL_PRODUZIONE;
export const SUPABASE_ANON_KEY = piena(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ?? ANON_PRODUZIONE;

export const supabaseConfigurato =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
