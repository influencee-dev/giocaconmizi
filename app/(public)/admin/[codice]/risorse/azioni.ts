"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { adminCreaInvito, adminEsitoLogo } from "@/lib/directory-db";
import { TAG_RECLAMO } from "@/lib/risorse-reclamo";
import { chiaveRisorsa, risorsaDaSlug } from "@/lib/risorse-educative";

export type EsitoLink = { stato: "fermo" } | { stato: "ok"; link: string; nome: string } | { stato: "errore"; messaggio: string };

/** Crea (o rinnova) il link personale di una risorsa. Il codice si vede una volta sola: nel database c'è solo l'impronta. */
export async function creaLink(_prima: EsitoLink, form: FormData): Promise<EsitoLink> {
  const codice = String(form.get("codice") ?? "");
  const r = risorsaDaSlug(String(form.get("slug") ?? ""));
  if (!r) return { stato: "errore", messaggio: "Risorsa non trovata." };
  const token = await adminCreaInvito(codice, chiaveRisorsa(r));
  if (!token) return { stato: "errore", messaggio: "Il database non risponde: va incollato supabase/risorse-reclamo.sql in Supabase." };
  revalidatePath(`/admin/${codice}/risorse`);
  return { stato: "ok", link: `https://giocamizi.it/la-tua-scheda/${token}`, nome: r.nome };
}

/** Giorgia approva o rifiuta un logo caricato da una risorsa. */
export async function decidiLogo(esito: "accettato" | "rifiutato", form: FormData) {
  const codice = String(form.get("codice") ?? "");
  const ok = await adminEsitoLogo(codice, Number(form.get("id")), esito === "accettato" ? "accettato" : "rifiutato");
  if (ok) {
    revalidateTag(TAG_RECLAMO);
    revalidatePath("/risorse-educative-bambini", "layout");
  }
  revalidatePath(`/admin/${codice}/risorse`);
}
