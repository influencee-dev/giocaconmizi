"use server";

import { adminValido } from "@/lib/admin";
import { provaVersoAvvisi } from "@/lib/email-servizio";

export type EsitoProva = { stato: "fermo" } | { stato: "partita"; a: string } | { stato: "non-partita"; motivo: string };

/** «Manda un'email di prova»: dice subito se Brevo la accetta, o perché no. */
export async function mandaProva(_prima: EsitoProva, form: FormData): Promise<EsitoProva> {
  if (!(await adminValido(String(form.get("codice") ?? "")))) return { stato: "non-partita", motivo: "Codice del pannello non valido." };
  const esito = await provaVersoAvvisi();
  return esito.ok ? { stato: "partita", a: esito.a } : { stato: "non-partita", motivo: esito.motivo };
}
