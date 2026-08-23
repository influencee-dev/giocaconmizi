/**
 * Le chiavi Supabase arrivano dall'ambiente (Vercel / .env.local).
 * In build senza variabili il sito pubblico deve comunque compilare: i giochi e
 * i contenuti non richiedono login (piano §2, decisione 1). Per questo esponiamo
 * `supabaseConfigurato` invece di far esplodere l'import.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigurato =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
