import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "@/lib/supabase/config";

/**
 * Il controllo del codice del pannello di Giorgia (/admin/[codice]).
 * Il codice vero non sta mai nel repo: il database ne conosce solo
 * l'impronta, e la funzione dir_admin_inviti risponde solo se è giusto.
 *
 * Per le verifiche automatiche in locale, `npm run verifica` avvia il server
 * con GIOCAMIZI_ADMIN_PROVA: quel codice vale solo se la variabile esiste,
 * e su Vercel non esiste (né in produzione né nelle anteprime).
 */
export async function adminValido(codice: string | null | undefined): Promise<boolean> {
  if (!codice || codice.length < 12) return false;
  const prova = process.env.GIOCAMIZI_ADMIN_PROVA;
  if (prova && !process.env.VERCEL && codice === prova) return true;
  if (!supabaseConfigurato) return false;
  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(4000), cache: "no-store" }) },
    });
    const { error } = await client.rpc("dir_admin_inviti", { p_codice: codice });
    return !error;
  } catch {
    return false;
  }
}
