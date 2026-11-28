import { dbServizio } from "@/lib/supabase/servizio";

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
  try {
    const client = dbServizio();
    if (!client) return false;
    const { error } = await client.rpc("dir_admin_inviti", { p_codice: codice });
    return !error;
  } catch {
    return false;
  }
}
