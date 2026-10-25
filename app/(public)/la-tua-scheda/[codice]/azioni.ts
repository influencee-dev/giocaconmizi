"use server";

import { CAMPI, inviaRichiesta, type DatiModifica } from "@/lib/directory-db";

export type Esito = { stato: "fermo" } | { stato: "ok"; tipo: string } | { stato: "errore"; messaggio: string };

const pulito = (v: FormDataEntryValue | null, max = 600) => String(v ?? "").trim().slice(0, max);

/** La risposta del locale dal suo link personale: approva, modifica o rimuovi. */
export async function rispondi(_prima: Esito, form: FormData): Promise<Esito> {
  const tipo = pulito(form.get("tipo"), 20) as "approva" | "modifica" | "rimuovi";
  if (!["approva", "modifica", "rimuovi"].includes(tipo)) return { stato: "errore", messaggio: "Scelta non valida." };
  const email = pulito(form.get("email"), 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { stato: "errore", messaggio: "Serve un'email valida per risponderti." };
  const termini = form.get("termini") === "si";
  if (tipo !== "rimuovi" && !termini) return { stato: "errore", messaggio: "Per pubblicare la scheda serve accettare i termini e condizioni." };

  const dati: DatiModifica = {};
  if (tipo === "modifica") {
    for (const c of CAMPI) {
      const v = pulito(form.get(c), c === "descrizione" || c === "pacchetti" || c === "orari" ? 1200 : 300);
      if (v) dati[c] = v;
    }
  }
  const motivo = pulito(form.get("motivo"), 600);
  if (motivo) (dati as Record<string, string>).motivo = motivo;

  const r = await inviaRichiesta({
    codice: pulito(form.get("codice"), 100), tipo, dati, email, referente: pulito(form.get("referente"), 200), termini,
  });
  if (!r.ok) return { stato: "errore", messaggio: r.errore.includes("non valido") ? "Il link non è più valido: scrivici e te ne mandiamo uno nuovo." : "Non siamo riusciti a salvare la risposta. Riprova tra qualche minuto." };
  return { stato: "ok", tipo };
}
