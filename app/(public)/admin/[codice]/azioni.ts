"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { SCHEDE, percorsoScheda } from "@/lib/directory";
import { adminDati, adminEsito } from "@/lib/directory-db";
import { TAG_RECLAMO } from "@/lib/risorse-reclamo";
import { percorsoRisorsa, risorsaDaChiave } from "@/lib/risorse-educative";
import { schedaOnline, schedaTolta } from "@/lib/email-servizio";

/** Giorgia accetta o rifiuta una risposta; le pagine pubbliche si rigenerano. */
export async function decidi(scelta: "accettata" | "rifiutata", form: FormData) {
  const codice = String(form.get("codice") ?? "");
  const id = Number(form.get("id"));
  const esito = scelta === "accettata" ? "accettata" : "rifiutata";
  // Prima della decisione: chi aveva risposto, per scrivergli com'è andata.
  const richiesta = esito === "accettata" ? (await adminDati(codice))?.richieste.find((r) => r.id === id) : undefined;
  const ok = await adminEsito(codice, id, esito, String(form.get("nota") ?? "").slice(0, 1000));
  if (ok) {
    // Le risorse educative leggono le risposte da una cache di 10 minuti: si svuota subito.
    revalidateTag(TAG_RECLAMO);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms-full.txt");
    if (richiesta?.email) emailEsito(richiesta.chiave, richiesta.tipo, richiesta.email);
  }
  revalidatePath(`/admin/${codice}`);
}

/** «La tua scheda è online» o «l'abbiamo tolta», dopo la risposta al pannello. */
function emailEsito(chiave: string, tipo: "approva" | "modifica" | "rimuovi", email: string) {
  const r = chiave.startsWith("risorse/") ? risorsaDaChiave(chiave) : undefined;
  const s = r ? undefined : SCHEDE.find((x) => `${x.cittaSlug}/${x.slug}` === chiave);
  const nome = r?.nome ?? s?.nome;
  if (!nome) return;
  const percorso = r ? percorsoRisorsa(r) : percorsoScheda(s!);
  after(() => (tipo === "rimuovi" ? schedaTolta(email, nome) : schedaOnline(email, nome, percorso)));
}
