import { unstable_cache } from "next/cache";
import { chiaviConLogo, pubblicate } from "./directory-db";
import { chiaveRisorsa, type Costi, type Risorsa } from "./risorse-educative";
import { RISORSE } from "./risorse-educative-dati";

/**
 * Le risorse educative con sopra le risposte che Giorgia ha accettato.
 *
 * Una risorsa che reclama la scheda dal suo link personale (stesse tabelle
 * delle attività, chiave "risorse/<slug>") e viene approvata diventa
 * «reclamata»: ottiene la pagina propria e può mostrare il logo che ha caricato.
 * Se chiede la rimozione e Giorgia accetta, sparisce dall'hub.
 * Se il database non risponde, l'hub resta quello di lib/risorse-educative-dati.ts.
 */

/** I campi che la realtà può scrivere dal suo link: tutti testo, tutti pubblici. */
export const CAMPI_RISORSA = [
  "descrizione", "cosaFa", "perChi", "comeSiUsa", "costi", "sede", "orari",
  "sito", "email", "telefono", "instagram", "facebook", "tiktok", "youtube",
] as const;
export type CampoRisorsa = (typeof CAMPI_RISORSA)[number];
export type DatiRisorsa = Partial<Record<CampoRisorsa, string>>;

export const COSTI: Costi[] = ["Gratuito", "A pagamento", "In parte gratuito", "Da verificare sul sito"];

export interface RisorsaVista extends Risorsa {
  reclamata: boolean;
  logo: boolean;
  /** I contatti e i dettagli in più scritti dalla realtà. */
  extra: DatiRisorsa;
}

const testo = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Stato del database letto al massimo ogni 10 minuti (le decisioni lo svuotano subito). */
export const TAG_RECLAMO = "risorse-reclamo";
async function statoDiretto() {
  const [p, loghi] = await Promise.all([pubblicate(), chiaviConLogo()]);
  return {
    risposte: [...p].filter(([k]) => k.startsWith("risorse/")).map(([k, v]) => [k, v.tipo, v.dati] as const),
    loghi: [...loghi].filter((k) => k.startsWith("risorse/")),
  };
}
const stato = unstable_cache(statoDiretto, ["risorse-reclamo-stato"], { revalidate: 600, tags: [TAG_RECLAMO] });

function vista(r: Risorsa, risposte: Map<string, { tipo: string; dati: Record<string, string> }>, loghi: Set<string>): RisorsaVista | null {
  const chiave = chiaveRisorsa(r);
  const risposta = risposte.get(chiave);
  if (risposta?.tipo === "rimuovi") return null;
  const d = (risposta?.dati ?? {}) as DatiRisorsa;
  const costi = COSTI.find((c) => c === testo(d.costi));
  return {
    ...r,
    descrizione: testo(d.descrizione) || r.descrizione,
    cosaFa: testo(d.cosaFa) || r.cosaFa,
    perChi: testo(d.perChi) || r.perChi,
    comeSiUsa: testo(d.comeSiUsa) || r.comeSiUsa,
    costi: costi ?? r.costi,
    url: /^https?:\/\//.test(testo(d.sito)) ? testo(d.sito) : r.url,
    reclamata: Boolean(risposta),
    logo: Boolean(risposta) && loghi.has(chiave),
    extra: d,
  };
}

/** Tutte le risorse da mostrare, con le modifiche approvate. */
export async function risorseVisibili(): Promise<RisorsaVista[]> {
  let s: Awaited<ReturnType<typeof stato>>;
  // Nel server delle verifiche niente cache: quella riempita dalla build non sa della risorsa di prova.
  const inProva = Boolean(process.env.GIOCAMIZI_ADMIN_PROVA && !process.env.VERCEL);
  try {
    s = inProva ? await statoDiretto() : await stato();
  } catch {
    s = { risposte: [], loghi: [] };
  }
  const risposte = new Map(s.risposte.map(([k, tipo, dati]) => [k, { tipo, dati: dati as Record<string, string> }]));
  const loghi = new Set(s.loghi);
  return RISORSE.map((r) => vista(r, risposte, loghi)).filter((r): r is RisorsaVista => r !== null);
}

/** Il link a un profilo social, solo se è davvero quello del social indicato. */
export function linkSocial(campo: "instagram" | "facebook" | "tiktok" | "youtube", valore?: string): string | null {
  const v = testo(valore);
  if (!v) return null;
  const domini = { instagram: "instagram.com", facebook: "facebook.com", tiktok: "tiktok.com", youtube: "youtube.com" };
  if (/^https?:\/\//.test(v)) {
    try {
      const host = new URL(v).hostname.replace(/^www\.|^m\./, "");
      return host === domini[campo] || (campo === "youtube" && host === "youtu.be") ? v : null;
    } catch {
      return null;
    }
  }
  const nome = v.replace(/^@/, "");
  if (!/^[\w.]{1,60}$/.test(nome)) return null;
  return campo === "tiktok" ? `https://www.tiktok.com/@${nome}` : campo === "youtube" ? `https://www.youtube.com/@${nome}` : `https://www.${domini[campo]}/${nome}`;
}
