import { SUPABASE_URL } from "@/lib/supabase/config";

/**
 * L'archivio dei PDF venduti: il contenitore PRIVATO «negozio» di Supabase Storage
 * (supabase/negozio.sql). Dal browser non si legge: il server, dopo aver
 * controllato l'acquisto su Stripe, chiede un link firmato che vale due minuti
 * e ci rimanda la famiglia. Serve SUPABASE_SERVICE_ROLE_KEY su Vercel, solo lato server.
 */

export const CONTENITORE = "negozio";

const chiaveServizio = () => (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
export const archivioConfigurato = () => chiaveServizio().length > 0;

export async function linkFirmato(percorso: string, nomeScarico: string, secondi = 120): Promise<string | null> {
  if (!archivioConfigurato()) return null;
  const sicuro = percorso.split("/").map(encodeURIComponent).join("/");
  try {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${CONTENITORE}/${sicuro}`, {
      method: "POST",
      headers: { apikey: chiaveServizio(), Authorization: `Bearer ${chiaveServizio()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: secondi }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!r.ok) {
      console.warn("negozio: link firmato non creato", r.status, percorso);
      return null;
    }
    const { signedURL } = (await r.json()) as { signedURL?: string };
    if (!signedURL) return null;
    return `${SUPABASE_URL}/storage/v1${signedURL}&download=${encodeURIComponent(nomeScarico)}`;
  } catch {
    return null;
  }
}
