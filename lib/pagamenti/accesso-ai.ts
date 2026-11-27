import { creaClientServer } from "@/lib/supabase/server";
import { RICERCHE_GRATIS } from "./contributi";

/**
 * L'accesso della mamma collegata alla ricerca con l'AI (supabase/ai-pagamenti.sql).
 * Le funzioni del database usano auth.uid(): ognuna vede e consuma solo il suo.
 */

export interface StatoAi {
  collegata: boolean;
  /** ISO, se ha pagato il contributo e vale ancora. */
  scadeIl: string | null;
  attivo: boolean;
  gratisRimaste: number;
  ricercheOggi: number;
}

export async function statoAi(): Promise<StatoAi> {
  const vuoto: StatoAi = { collegata: false, scadeIl: null, attivo: false, gratisRimaste: RICERCHE_GRATIS, ricercheOggi: 0 };
  const db = await creaClientServer();
  if (!db) return vuoto;
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return vuoto;
  const { data } = await db.rpc("ai_stato_mamma");
  const r = Array.isArray(data) ? data[0] : null;
  const scadeIl: string | null = r?.scade_il ?? null;
  return {
    collegata: true,
    scadeIl,
    attivo: Boolean(scadeIl && new Date(scadeIl) > new Date()),
    gratisRimaste: r?.gratis_rimaste ?? RICERCHE_GRATIS,
    ricercheOggi: r?.ricerche_oggi ?? 0,
  };
}

export type EsitoConsumo = "pagato" | "gratis" | "serve_contributo" | "troppe_oggi" | "non_collegata" | "errore";

/** Da chiamare PRIMA di ogni ricerca con l'AI: la conta e dice se si può fare. */
export async function consumaRicerca(): Promise<EsitoConsumo> {
  const db = await creaClientServer();
  if (!db) return "errore";
  const { data, error } = await db.rpc("ai_consuma_ricerca");
  if (error) return "errore";
  return (["pagato", "gratis", "serve_contributo", "troppe_oggi", "non_collegata"] as const).includes(data) ? data : "errore";
}
