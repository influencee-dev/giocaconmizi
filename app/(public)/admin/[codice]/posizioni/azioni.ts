"use server";

import { revalidatePath } from "next/cache";
import { adminValido } from "@/lib/admin";
import { SCHEDE } from "@/lib/directory";
import { chiaveScheda, conModifiche, pubblicate } from "@/lib/directory-db";
import { posizioni, salvaPosizione, trovaPosizione } from "@/lib/posizioni";

/** Quante schede per giro: 3 richieste al massimo per scheda, una al secondo, dentro i 60 secondi di Vercel. */
const PER_GIRO = 12;

/** Cerca la posizione delle schede che ancora non ce l'hanno. */
export async function calcolaPosizioni(codice: string) {
  if (!(await adminValido(codice))) return;
  const [fatte, p] = await Promise.all([posizioni(), pubblicate()]);
  const mancanti = [...new Map(SCHEDE.map((s) => [chiaveScheda(s), s])).values()].filter((s) => !fatte.has(chiaveScheda(s)));
  for (const s of mancanti.slice(0, PER_GIRO)) {
    const conDati = conModifiche(s, p);
    if (!conDati) continue;
    const trovata = await trovaPosizione({
      nome: s.nome,
      zona: s.zona,
      citta: s.citta,
      cittaSlug: s.cittaSlug,
      indirizzo: conDati.extra.indirizzo,
    });
    if (trovata) await salvaPosizione(codice, chiaveScheda(s), trovata);
  }
  revalidatePath(`/admin/${codice}/posizioni`);
}

/** Corregge a mano una posizione ("45.46, 9.19") o la toglie (campo vuoto). */
export async function correggiPosizione(codice: string, chiave: string, modulo: FormData) {
  if (!(await adminValido(codice))) return;
  const testo = String(modulo.get("coordinate") ?? "").trim();
  if (!testo) {
    await salvaPosizione(codice, chiave, null);
  } else {
    const [lat, lng] = testo.split(/[,;\s]+/).map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) await salvaPosizione(codice, chiave, { lat, lng, precisione: "manuale" });
  }
  revalidatePath(`/admin/${codice}/posizioni`);
}
