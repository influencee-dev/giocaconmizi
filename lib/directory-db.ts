import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "@/lib/supabase/config";
import type { Scheda } from "@/lib/directory";
import type { SchedaEstesa } from "@/lib/scheda-campi";

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
/**
 * I campi a testo libero di oggi, più la scheda estesa (lib/scheda-campi.ts)
 * sotto la chiave «estesa»: viaggiano insieme in dir_richieste.dati.
 */
export type DatiModifica = Partial<Record<Campo, string>> & { estesa?: SchedaEstesa };

export interface Pubblicata {
  tipo: "approva" | "modifica" | "rimuovi";
  dati: DatiModifica;
}

/** Le risposte dei locali che Giorgia ha accettato, per chiave scheda. */
export async function pubblicate(): Promise<Map<string, Pubblicata>> {
  // Nel server delle verifiche una risorsa risulta reclamata, per provarne la pagina propria.
  if (process.env.GIOCAMIZI_ADMIN_PROVA && !process.env.VERCEL) {
    return new Map<string, Pubblicata>([
      [INVITO_PROVA_RISORSA.chiave, { tipo: "modifica", dati: { descrizione: "Scheda di prova: testo scritto dalla realtà dal suo link personale.", sito: "https://www.coopaccento.it/" } }],
      [SCHEDA_ESTESA_PROVA.chiave, { tipo: "modifica", dati: { estesa: SCHEDA_ESTESA_PROVA.estesa } }],
    ]);
  }
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

/**
 * Una scheda estesa di PROVA, solo nel server delle verifiche (mai su Vercel):
 * serve a vedere e controllare la pagina pubblica piena. Dati inventati per il
 * test, mai mostrati sul sito vero.
 */
export const SCHEDA_ESTESA_PROVA: { chiave: string; estesa: SchedaEstesa } = {
  chiave: "milano/festavventura",
  estesa: {
    versione: 1,
    valori: {
      descrizione: "Scheda di prova: sala feste con animazione, compilata con tutti i campi per controllare la pagina.",
      puntiForza: ["animazione", "torta", "allestimento"],
      eta: { da: 3, a: 10 },
      sotto3: true,
      fannoFeste: true,
      bambini: { da: 10, a: 30 },
      durata: "180",
      esclusiva: "esclusiva",
      incluso: ["sala", "animazione", "merenda", "torta", "allestimento", "pulizia"],
      tortaDaCasa: "supplemento",
      allergie: "su-richiesta",
      temi: "principesse, supereroi, dinosauri, pirati",
      giorniFeste: ["ven", "sab", "dom"],
      prezzo: { modello: "festa", importo: 250, bambiniInclusi: 15, supplemento: 12, comunicatoIl: "2026-11" },
      pacchetti: [
        { nome: "Festa base", prezzo: 250, bambini: { da: 10, a: 15 }, durata: 150, comprende: "Sala, animatore, merenda salata e dolce, pulizia" },
        { nome: "Festa completa", prezzo: 390, bambini: { da: 15, a: 30 }, durata: 180, comprende: "Tutto il base, più torta, allestimento a tema e truccabimbi" },
      ],
      extra: [{ nome: "Truccabimbi", prezzo: 60 }, { nome: "Mezz'ora in più", prezzo: 40 }, { nome: "Gadget per gli invitati", prezzo: 3 }],
      caparra: "50% alla prenotazione",
      cancellazione: "Gratis fino a 7 giorni prima; il numero di bambini si cambia fino a 3 giorni prima",
      anticipo: "4",
      orari: [
        { giorno: "ven", dalle: "16:00", alle: "20:00" },
        { giorno: "sab", dalle: "10:00", alle: "20:00" },
        { giorno: "dom", dalle: "10:00", alle: "19:00" },
      ],
      orarioLimite: "20:00",
      ambiente: "coperto",
      metriQuadri: 220,
      parcheggio: "strada",
      passeggino: true,
      fasciatoio: true,
      genitori: true,
      educatori: 10,
      regole: "Calze antiscivolo per tutti i bambini. I genitori possono restare nella zona caffè.",
      fotoBambini: "solo-famiglia",
      cosaPortare: "Calze antiscivolo e un cambio per i più piccoli",
      comeArrivare: "Metro M2, fermata a 5 minuti a piedi",
      video: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.instagram.com/reel/C0prova123/"],
    },
  },
};

/** Il link di prova dell'area attività: vale solo nel server delle verifiche (come lib/admin.ts), mai su Vercel. */
export const INVITO_PROVA = { codice: "prova-attivita-locale-0000000000", chiave: "milano/il-nano-gigante" };

export async function apriInvito(codice: string) {
  if (process.env.GIOCAMIZI_ADMIN_PROVA && !process.env.VERCEL) {
    const prova = [INVITO_PROVA, INVITO_PROVA_RISORSA].find((p) => p.codice === codice);
    if (prova) return { chiave: prova.chiave, stato: "inviato", scade_il: new Date(Date.now() + 30 * 86400000).toISOString() };
  }
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

// ---------- Bozze della scheda estesa (supabase/scheda-dati.sql) ----------

/** Solo nel server delle verifiche: le bozze restano in memoria, per codice. */
const bozzeProva: Map<string, SchedaEstesa> = ((globalThis as { __bozzeProva?: Map<string, SchedaEstesa> }).__bozzeProva ??= new Map());

/** L'attività salva a metà: una bozza per scheda, sovrascritta a ogni salvataggio. */
export async function salvaBozza(codice: string, scheda: SchedaEstesa) {
  if (inProva() && [INVITO_PROVA.codice, INVITO_PROVA_RISORSA.codice].includes(codice)) {
    bozzeProva.set(codice, scheda);
    return { ok: true as const };
  }
  const client = db();
  if (!client) return { ok: false as const, errore: "Il servizio non è disponibile in questo momento." };
  try {
    const { error } = await client.rpc("dir_salva_bozza", { p_codice: codice, p_dati: scheda });
    return error ? { ok: false as const, errore: error.message } : { ok: true as const };
  } catch {
    return { ok: false as const, errore: "Il servizio non è disponibile in questo momento." };
  }
}

/** La bozza salvata, o null se non c'è (o se l'SQL delle bozze non è ancora stato incollato). */
export async function leggiBozza(codice: string): Promise<SchedaEstesa | null> {
  if (inProva() && bozzeProva.has(codice)) return bozzeProva.get(codice)!;
  const client = db();
  if (!client) return null;
  try {
    const { data, error } = await client.rpc("dir_leggi_bozza", { p_codice: codice });
    return error || !data ? null : (data as SchedaEstesa);
  } catch {
    return null;
  }
}

// ---------- Candidature: le attività che si propongono da sole (/aggiungi-attivita) ----------

export interface Candidatura {
  id: number;
  tipo: "nuova" | "accesso";
  chiave: string | null;
  dati: Record<string, string>;
  email: string;
  referente: string;
  termini_accettati: boolean;
  creato_il: string;
  stato: "in_attesa" | "accettata" | "rifiutata";
  nota: string | null;
}

/** Solo nel server delle verifiche: le candidature restano in memoria, niente database. */
const inProva = () => Boolean(process.env.GIOCAMIZI_ADMIN_PROVA && !process.env.VERCEL);
// Su globalThis: azioni e pagine del server possono stare in moduli separati.
const memoriaProva: Candidatura[] = ((globalThis as { __candidatureProva?: Candidatura[] }).__candidatureProva ??= []);

export async function inviaCandidatura(c: {
  tipo: "nuova" | "accesso"; chiave: string | null; dati: Record<string, string>; email: string; referente: string; termini: boolean;
}) {
  if (inProva()) {
    memoriaProva.unshift({ id: memoriaProva.length + 1, tipo: c.tipo, chiave: c.chiave, dati: c.dati, email: c.email, referente: c.referente, termini_accettati: c.termini, creato_il: new Date().toISOString(), stato: "in_attesa", nota: null });
    return { ok: true as const };
  }
  const client = db();
  if (!client) return { ok: false as const, errore: "servizio non disponibile" };
  try {
    const { error } = await client.rpc("dir_candidatura", {
      p_tipo: c.tipo, p_chiave: c.chiave, p_dati: c.dati, p_email: c.email, p_referente: c.referente, p_termini: c.termini,
    });
    if (error) return { ok: false as const, errore: error.message };
    return { ok: true as const };
  } catch {
    return { ok: false as const, errore: "servizio non disponibile" };
  }
}

export async function adminCandidature(codice: string): Promise<Candidatura[] | null> {
  if (inProva() && codice === process.env.GIOCAMIZI_ADMIN_PROVA) return memoriaProva;
  const client = db();
  if (!client) return null;
  try {
    const { data, error } = await client.rpc("dir_admin_candidature", { p_codice: codice });
    return error ? null : (data as Candidatura[]);
  } catch {
    return null;
  }
}

export async function adminEsitoCandidatura(codice: string, id: number, esito: "accettata" | "rifiutata", nota: string) {
  if (inProva() && codice === process.env.GIOCAMIZI_ADMIN_PROVA) {
    const c = memoriaProva.find((x) => x.id === id);
    if (c) Object.assign(c, { stato: esito, nota });
    return Boolean(c);
  }
  const client = db();
  if (!client) return false;
  const { error } = await client.rpc("dir_admin_esito_candidatura", { p_codice: codice, p_id: id, p_esito: esito, p_nota: nota });
  return !error;
}

// ---------- Risorse educative: link personale e logo (supabase/risorse-reclamo.sql) ----------

/** Il link di prova di una risorsa: come INVITO_PROVA, solo nel server delle verifiche. */
export const INVITO_PROVA_RISORSA = { codice: "prova-risorsa-locale-000000000000", chiave: "risorse/accento-cooperativa-sociale" };

/** Giorgia crea (o rinnova) il link personale di una scheda: restituisce il codice, da mandare una volta sola. */
export async function adminCreaInvito(codice: string, chiave: string): Promise<string | null> {
  const client = db();
  if (!client) return null;
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  try {
    const { error } = await client.rpc("dir_admin_crea_invito", { p_codice: codice, p_chiave: chiave, p_token: token });
    return error ? null : token;
  } catch {
    return null;
  }
}

/** Il logo già ricodificato in WebP dal server, in base64. */
export async function inviaLogo(codice: string, base64: string) {
  const client = db();
  if (!client) return { ok: false as const, errore: "servizio non disponibile" };
  try {
    const { error } = await client.rpc("dir_invia_logo", { p_codice: codice, p_immagine: base64 });
    return error ? { ok: false as const, errore: error.message } : { ok: true as const };
  } catch {
    return { ok: false as const, errore: "servizio non disponibile" };
  }
}

export interface LogoInAttesa { id: number; chiave: string; immagine: string; creato_il: string; stato: string }

export async function adminLoghi(codice: string): Promise<LogoInAttesa[]> {
  const client = db();
  if (!client) return [];
  try {
    const { data, error } = await client.rpc("dir_admin_loghi", { p_codice: codice });
    return error || !Array.isArray(data) ? [] : (data as LogoInAttesa[]);
  } catch {
    return [];
  }
}

export async function adminEsitoLogo(codice: string, id: number, esito: "accettato" | "rifiutato") {
  const client = db();
  if (!client) return false;
  const { error } = await client.rpc("dir_admin_esito_logo", { p_codice: codice, p_id: id, p_esito: esito });
  return !error;
}

/** Le chiavi delle schede con un logo approvato (per sapere dove mostrarlo). */
export async function chiaviConLogo(): Promise<Set<string>> {
  const client = db();
  if (!client) return new Set();
  try {
    const { data, error } = await client.rpc("dir_chiavi_con_logo");
    return error || !Array.isArray(data) ? new Set() : new Set(data as string[]);
  } catch {
    return new Set();
  }
}

/** Il logo approvato di una scheda, o null. */
export async function logoDi(chiave: string): Promise<Buffer | null> {
  const client = db();
  if (!client) return null;
  try {
    const { data, error } = await client.rpc("dir_logo", { p_chiave: chiave });
    return error || typeof data !== "string" || !data ? null : Buffer.from(data, "base64");
  } catch {
    return null;
  }
}
