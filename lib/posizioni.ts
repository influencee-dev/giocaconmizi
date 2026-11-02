import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "@/lib/supabase/config";
import { CENTRO_CITTA } from "@/lib/coordinate-citta";

/**
 * Le posizioni dei locali sulla mappa (supabase/backoffice.sql, tabella
 * dir_posizioni). Le calcola il pannello con OpenStreetMap Nominatim:
 * dal server, una richiesta al secondo, con un'intestazione che dice chi
 * siamo, come chiedono le regole d'uso di Nominatim. Se il database non
 * risponde, la mappa semplicemente non mostra i segnaposto.
 */

export type Precisione = "indirizzo" | "nome" | "zona" | "manuale";
export interface Posizione {
  lat: number;
  lng: number;
  precisione: Precisione;
}

function db() {
  if (!supabaseConfigurato) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(4000), cache: "no-store" }) },
  });
}

/** Tutte le posizioni, per chiave "città/slug". Mappa vuota se il DB non risponde. */
export async function posizioni(): Promise<Map<string, Posizione>> {
  const client = db();
  if (!client) return new Map();
  try {
    const { data, error } = await client.rpc("dir_posizioni");
    if (error || !data) return new Map();
    return new Map((data as (Posizione & { chiave: string })[]).map((p) => [p.chiave, { lat: p.lat, lng: p.lng, precisione: p.precisione }]));
  } catch {
    return new Map();
  }
}

export async function salvaPosizione(codice: string, chiave: string, p: Posizione | null): Promise<boolean> {
  const client = db();
  if (!client) return false;
  const { error } = await client.rpc("dir_admin_posizione", {
    p_codice: codice,
    p_chiave: chiave,
    p_lat: p?.lat ?? null,
    p_lng: p?.lng ?? null,
    p_precisione: p?.precisione ?? "manuale",
  });
  return !error;
}

const AGENTE = "Giocamizi/1.0 (https://giocamizi.it; ciao@giocamizi.it)";

/** Una ricerca su Nominatim, limitata a un riquadro intorno alla città (niente omonimi lontani). */
async function cerca(testo: string, cittaSlug: string): Promise<{ lat: number; lng: number } | null> {
  const centro = CENTRO_CITTA[cittaSlug];
  if (!centro) return null;
  const [lat, lng] = centro;
  const q = new URLSearchParams({
    q: testo,
    format: "jsonv2",
    limit: "1",
    countrycodes: "it",
    viewbox: `${lng - 0.35},${lat + 0.25},${lng + 0.35},${lat - 0.25}`,
    bounded: "1",
    "accept-language": "it",
  });
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?${q}`, {
      headers: { "User-Agent": AGENTE, Referer: "https://giocamizi.it/" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const [primo] = (await r.json()) as { lat: string; lon: string }[];
    return primo ? { lat: Number(primo.lat), lng: Number(primo.lon) } : null;
  } catch {
    return null;
  }
}

const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Trova la posizione di un locale: prima l'indirizzo (se il titolare l'ha
 * dato), poi il nome del locale, infine la zona (segnaposto approssimativo).
 * Rispetta il limite di Nominatim: una richiesta ogni 1,1 secondi.
 */
export async function trovaPosizione(s: {
  nome: string;
  zona: string;
  citta: string;
  cittaSlug: string;
  indirizzo?: string;
}): Promise<Posizione | null> {
  const tentativi: [string, Precisione][] = [
    ...(s.indirizzo ? ([[`${s.indirizzo}, ${s.citta}`, "indirizzo"]] as [string, Precisione][]) : []),
    [`${s.nome}, ${s.citta}`, "nome"],
    [`${s.zona.replace(/\(.*?\)/g, "").trim()}, ${s.citta}`, "zona"],
  ];
  for (const [testo, precisione] of tentativi) {
    const trovata = await cerca(testo, s.cittaSlug);
    await pausa(1100);
    if (trovata) return { ...trovata, precisione };
  }
  return null;
}
