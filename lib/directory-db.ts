import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "@/lib/supabase/config";
import type { Scheda } from "@/lib/directory";

/**
 * L'area delle attività sul database (supabase/directory.sql).
 * Solo chiave pubblica: ogni lettura e scrittura passa dalle funzioni SQL,
 * che controllano il codice del link personale o del pannello admin.
 * Se il database non risponde (in pausa, non ancora creato, in locale) il
 * sito pubblico non si rompe: le schede restano quelle di lib/feste.ts.
 */

const ATTESA_MS = 4000;

function db() {
  if (!supabaseConfigurato) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(ATTESA_MS), cache: "no-store" }) },
  });
}

/** La chiave stabile di una scheda nel database: "città/slug". */
export const chiaveScheda = (s: Pick<Scheda, "cittaSlug" | "slug">) => `${s.cittaSlug}/${s.slug}`;

/** I campi che il locale può cambiare, tutti testo. */
export const CAMPI = [
  "descrizione", "indirizzo", "telefono", "whatsapp", "sito", "instagram",
  "facebook", "tiktok", "video", "orari", "pacchetti",
] as const;
export type Campo = (typeof CAMPI)[number];
export type DatiModifica = Partial<Record<Campo, string>>;

export interface Pubblicata {
  tipo: "approva" | "modifica" | "rimuovi";
  dati: DatiModifica;
}

/** Le risposte dei locali che Giorgia ha accettato, per chiave scheda. */
export async function pubblicate(): Promise<Map<string, Pubblicata>> {
  const client = db();
  if (!client) return new Map();
  try {
    const { data, error } = await client.rpc("dir_pubblicate");
    if (error || !Array.isArray(data)) return new Map();
    return new Map(data.map((r: { chiave: string; tipo: Pubblicata["tipo"]; dati: DatiModifica }) => [r.chiave, { tipo: r.tipo, dati: r.dati ?? {} }]));
  } catch {
    return new Map();
  }
}

/** La scheda con le modifiche approvate sopra, o null se il locale ha chiesto di toglierla. */
export function conModifiche(s: Scheda, p: Map<string, Pubblicata>): (Scheda & { verificata: boolean; extra: DatiModifica }) | null {
  const r = p.get(chiaveScheda(s));
  if (r?.tipo === "rimuovi") return null;
  const d = r?.dati ?? {};
  return {
    ...s,
    descrizione: d.descrizione?.trim() || s.descrizione,
    sito: d.sito?.trim() || s.sito,
    instagram: d.instagram?.trim() || s.instagram,
    verificata: Boolean(r),
    extra: d,
  };
}

export async function apriInvito(codice: string) {
  const client = db();
  if (!client || !/^[A-Za-z0-9_-]{20,80}$/.test(codice)) return null;
  try {
    const { data, error } = await client.rpc("dir_apri_invito", { p_codice: codice });
    if (error || !Array.isArray(data) || !data[0]) return null;
    return data[0] as { chiave: string; stato: string; scade_il: string };
  } catch {
    return null;
  }
}

export async function inviaRichiesta(r: {
  codice: string; tipo: "approva" | "modifica" | "rimuovi"; dati: DatiModifica; email: string; referente: string; termini: boolean;
}) {
  const client = db();
  if (!client) return { ok: false as const, errore: "Il servizio non è disponibile in questo momento." };
  const { error } = await client.rpc("dir_invia_richiesta", {
    p_codice: r.codice, p_tipo: r.tipo, p_dati: r.dati, p_email: r.email, p_referente: r.referente, p_termini: r.termini,
  });
  if (error) return { ok: false as const, errore: error.message };
  return { ok: true as const };
}

export interface Richiesta {
  id: number; chiave: string; tipo: Pubblicata["tipo"]; dati: DatiModifica; email: string | null;
  referente: string | null; termini_accettati: boolean; creato_il: string; stato: string; nota: string | null;
}

export async function adminDati(codice: string) {
  const client = db();
  if (!client) return null;
  try {
    const [r, i] = await Promise.all([
      client.rpc("dir_admin_richieste", { p_codice: codice }),
      client.rpc("dir_admin_inviti", { p_codice: codice }),
    ]);
    if (r.error || i.error) return null;
    return {
      richieste: r.data as Richiesta[],
      inviti: i.data as { chiave: string; stato: string; aperto_il: string | null }[],
    };
  } catch {
    return null;
  }
}

export async function adminEsito(codice: string, id: number, esito: "accettata" | "rifiutata", nota: string) {
  const client = db();
  if (!client) return false;
  const { error } = await client.rpc("dir_admin_esito", { p_codice: codice, p_id: id, p_esito: esito, p_nota: nota });
  return !error;
}
