"use server";

import { revalidatePath } from "next/cache";
import { adminEsitoCandidatura } from "@/lib/directory-db";

/** Giorgia segna una candidatura come accettata o rifiutata. */
export async function decidiCandidatura(scelta: "accettata" | "rifiutata", form: FormData) {
  const codice = String(form.get("codice") ?? "");
  await adminEsitoCandidatura(codice, Number(form.get("id")), scelta === "accettata" ? "accettata" : "rifiutata", String(form.get("nota") ?? "").slice(0, 1000));
  revalidatePath(`/admin/${codice}/candidature`);
}
