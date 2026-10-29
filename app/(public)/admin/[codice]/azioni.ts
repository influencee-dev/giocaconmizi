"use server";

import { revalidatePath } from "next/cache";
import { adminEsito } from "@/lib/directory-db";

/** Giorgia accetta o rifiuta una risposta; le pagine pubbliche si rigenerano. */
export async function decidi(scelta: "accettata" | "rifiutata", form: FormData) {
  const codice = String(form.get("codice") ?? "");
  const id = Number(form.get("id"));
  const esito = scelta === "accettata" ? "accettata" : "rifiutata";
  const ok = await adminEsito(codice, id, esito, String(form.get("nota") ?? "").slice(0, 1000));
  if (ok) {
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms-full.txt");
  }
  revalidatePath(`/admin/${codice}`);
}
