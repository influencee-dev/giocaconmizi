import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "@/lib/supabase/config";

/**
 * I contatori delle schede (supabase/backoffice.sql): viste e clic sui
 * contatti, sommati per giorno. Niente cookie, niente IP, niente persone:
 * solo numeri. Se il database non risponde il sito non se ne accorge.
 */

export const EVENTI = ["vista", "whatsapp", "telefono", "sito", "social", "invito"] as const;
export type Evento = (typeof EVENTI)[number];

export const NOME_EVENTO: Record<Evento, string> = {
  vista: "Visite",
  whatsapp: "WhatsApp",
  telefono: "Telefono",
  sito: "Sito",
  social: "Social",
  invito: "Invito",
};

export interface Riga {
  giorno: string;
  chiave: string;
  evento: Evento;
  conteggio: number;
}

function db() {
  if (!supabaseConfigurato) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(4000), cache: "no-store" }) },
  });
}

export async function conta(chiave: string, evento: Evento): Promise<boolean> {
  const client = db();
  if (!client) return false;
  try {
    const { error } = await client.rpc("dir_conta", { p_chiave: chiave, p_evento: evento });
    return !error;
  } catch {
    return false;
  }
}

/** null = database non pronto (backoffice.sql non ancora incollato) o codice sbagliato. */
export async function statisticheAdmin(codice: string, giorni: number): Promise<Riga[] | null> {
  const client = db();
  if (!client) return null;
  const dal = new Date(Date.now() - giorni * 86400000).toISOString().slice(0, 10);
  try {
    const { data, error } = await client.rpc("dir_admin_statistiche", { p_codice: codice, p_dal: dal });
    return error ? null : (data as Riga[]);
  } catch {
    return null;
  }
}

/** Somma per scheda ed evento. */
export function perScheda(righe: Riga[]): Map<string, Record<Evento, number>> {
  const mappa = new Map<string, Record<Evento, number>>();
  for (const r of righe) {
    const voce = mappa.get(r.chiave) ?? (Object.fromEntries(EVENTI.map((e) => [e, 0])) as Record<Evento, number>);
    voce[r.evento] += r.conteggio;
    mappa.set(r.chiave, voce);
  }
  return mappa;
}

/** Clic su un contatto qualsiasi (tutto tranne le visite). */
export const contatti = (v: Record<Evento, number>) => v.whatsapp + v.telefono + v.sito + v.social;
