import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "./config";

/**
 * Il client Supabase del SERVER (mai nel browser): uno solo per tutto il sito.
 *
 * Usa la chiave di servizio (SUPABASE_SERVICE_ROLE_KEY, solo su Vercel): dal
 * 28/11/2026 le funzioni della directory, del pannello e dei pagamenti non si
 * possono più chiamare con la chiave pubblica (supabase/migrazioni/0003). Chi
 * prova a chiamarle da fuori, con la chiave che sta nel JavaScript del sito,
 * riceve «permission denied».
 *
 * Senza chiave di servizio (in locale, nel server delle verifiche) ripiega sulla
 * chiave pubblica: lì il database vero non si tocca o risponde «non autorizzato»,
 * e il sito pubblico resta in piedi con le schede del repo.
 *
 * Ogni chiamata ha un tempo massimo e non passa dalla cache di Next: la cache
 * la decide chi legge (unstable_cache con i tag, lib/directory/directory-db.ts).
 */

const ATTESA_MS = 4000;

let cliente: SupabaseClient | null = null;

/** Vero se il server ha la chiave di servizio (su Vercel). */
export const chiaveServizioPresente = () => Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

export function dbServizio(): SupabaseClient | null {
  if (typeof window !== "undefined") throw new Error("dbServizio si usa solo sul server");
  if (!supabaseConfigurato) return null;
  if (cliente) return cliente;
  const chiave = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || SUPABASE_ANON_KEY;
  cliente = createClient(SUPABASE_URL, chiave, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(ATTESA_MS), cache: "no-store" }) },
  });
  return cliente;
}
