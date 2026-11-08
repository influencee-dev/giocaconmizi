"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { adminEsito } from "@/lib/directory-db";
import { TAG_RECLAMO } from "@/lib/risorse-reclamo";

/** Giorgia accetta o rifiuta una risposta; le pagine pubbliche si rigenerano. */
export async function decidi(scelta: "accettata" | "rifiutata", form: FormData) {
  const codice = String(form.get("codice") ?? "");
  const id = Number(form.get("id"));
  const esito = scelta === "accettata" ? "accettata" : "rifiutata";
  const ok = await adminEsito(codice, id, esito, String(form.get("nota") ?? "").slice(0, 1000));
  if (ok) {
    // Le risorse educative leggono le risposte da una cache di 10 minuti: si svuota subito.
    revalidateTag(TAG_RECLAMO);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms-full.txt");
  }
  revalidatePath(`/admin/${codice}`);
}
