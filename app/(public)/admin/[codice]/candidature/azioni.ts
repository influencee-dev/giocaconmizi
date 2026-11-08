"use server";

import { revalidatePath } from "next/cache";
import { SCHEDE } from "@/lib/directory";
import { adminCandidature, adminCreaInvito, adminEsitoCandidatura } from "@/lib/directory-db";
import { risorsaDaChiave } from "@/lib/risorse-educative";
import { mandaLinkPersonale } from "@/lib/email-servizio";

/** Giorgia segna una candidatura come accettata o rifiutata. */
export async function decidiCandidatura(scelta: "accettata" | "rifiutata", form: FormData) {
  const codice = String(form.get("codice") ?? "");
  await adminEsitoCandidatura(codice, Number(form.get("id")), scelta === "accettata" ? "accettata" : "rifiutata", String(form.get("nota") ?? "").slice(0, 1000));
  revalidatePath(`/admin/${codice}/candidature`);
}

export type EsitoInvio =
  | { stato: "fermo" }
  | { stato: "mandato"; a: string }
  | { stato: "da-copiare"; link: string; motivo: string }
  | { stato: "errore"; messaggio: string };

/**
 * «Manda il link personale»: per chi chiede l'accesso a una scheda (attività o
 * risorsa). Crea il link e lo manda all'email della candidatura; se Brevo non è
 * collegato mostra il link da copiare. In entrambi i casi la candidatura si chiude.
 */
export async function mandaLinkCandidatura(_prima: EsitoInvio, form: FormData): Promise<EsitoInvio> {
  const codice = String(form.get("codice") ?? "");
  const id = Number(form.get("id"));
  const c = (await adminCandidature(codice))?.find((x) => x.id === id);
  if (!c?.chiave) return { stato: "errore", messaggio: "Candidatura non trovata." };
  const nome = c.chiave.startsWith("risorse/")
    ? risorsaDaChiave(c.chiave)?.nome
    : SCHEDE.find((s) => `${s.cittaSlug}/${s.slug}` === c.chiave)?.nome;
  if (!nome) return { stato: "errore", messaggio: "La scheda non esiste più sul sito." };
  const token = await adminCreaInvito(codice, c.chiave);
  if (!token) return { stato: "errore", messaggio: "Il database non risponde: riprova tra poco." };
  const link = `https://giocamizi.it/la-tua-scheda/${token}`;
  const mandato = await mandaLinkPersonale(c.email, c.referente, nome, link);
  const oggi = new Date().toLocaleDateString("it-IT");
  await adminEsitoCandidatura(codice, id, "accettata", mandato ? `Link mandato per email il ${oggi}` : `Link creato il ${oggi} (da mandare a mano)`);
  revalidatePath(`/admin/${codice}/candidature`);
  return mandato ? { stato: "mandato", a: c.email } : { stato: "da-copiare", link, motivo: "Brevo non è ancora collegato: copia il link e mandalo tu." };
}
