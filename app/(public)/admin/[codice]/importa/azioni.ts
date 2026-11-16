"use server";

import { revalidatePath } from "next/cache";
import { adminValido } from "@/lib/admin";
import { SCHEDE, percorsoScheda } from "@/lib/directory";
import { adminSalvaScheda } from "@/lib/directory-db";
import { leggiFonti, proponiScheda, type EsitoFonte, type Proposta } from "@/lib/import-ai";
import { validaScheda, type SchedaEstesa } from "@/lib/scheda-campi";

const schedaDa = (chiave: string) => SCHEDE.find((s) => `${s.cittaSlug}/${s.slug}` === chiave);

export type EsitoProposta =
  | { stato: "ok"; esiti: EsitoFonte[]; proposta: Proposta }
  | { stato: "errore"; messaggio: string; esiti?: EsitoFonte[] };

/** Legge le fonti e chiede all'AI la scheda. Solo con il codice del pannello: ogni chiamata costa. */
export async function proponi(codice: string, chiave: string, urls: string[]): Promise<EsitoProposta> {
  if (!(await adminValido(codice))) return { stato: "errore", messaggio: "Codice del pannello non valido." };
  const s = schedaDa(chiave);
  if (!s) return { stato: "errore", messaggio: "Scheda non trovata." };
  const { fonti, esiti } = await leggiFonti(urls.slice(0, 6));
  if (!fonti.length) return { stato: "errore", messaggio: "Non sono riuscita a leggere nessuna fonte.", esiti };
  try {
    const ora = new Date();
    const mese = `${ora.getFullYear()}-${String(ora.getMonth() + 1).padStart(2, "0")}`;
    const proposta = await proponiScheda({ nome: s.nome, citta: s.citta, categoria: s.categoria.slug, nomeCategoria: s.categoria.nome, fonti, mese });
    return { stato: "ok", esiti, proposta };
  } catch (e) {
    return { stato: "errore", messaggio: e instanceof Error ? e.message : "L'AI non ha risposto.", esiti };
  }
}

export type EsitoSalva = { stato: "ok"; messaggio: string; href?: string } | { stato: "errore"; messaggio: string };

/** Salva i campi che Giorgia ha tenuto: come scheda pubblicata o solo pronta per l'attività. */
export async function salva(codice: string, chiave: string, scheda: SchedaEstesa, tieni: string[], pubblica: boolean): Promise<EsitoSalva> {
  if (!(await adminValido(codice))) return { stato: "errore", messaggio: "Codice del pannello non valido." };
  const s = schedaDa(chiave);
  if (!s) return { stato: "errore", messaggio: "Scheda non trovata." };
  const scelti = Object.fromEntries(Object.entries(scheda.valori ?? {}).filter(([id]) => tieni.includes(id)));
  const prov = Object.fromEntries(Object.entries(scheda.provenienza ?? {}).filter(([id]) => tieni.includes(id)));
  // Si riconvalida tutto: quello che arriva dal browser non è mai fidato.
  const { scheda: pulita } = validaScheda(s.categoria.slug, scelti, prov);
  if (!Object.keys(pulita.valori).length) return { stato: "errore", messaggio: "Nessun campo da salvare." };
  const r = await adminSalvaScheda(codice, chiave, pulita, pubblica);
  if (!r.ok) return { stato: "errore", messaggio: r.errore };
  const href = percorsoScheda(s);
  revalidatePath(href);
  revalidatePath(`/admin/${codice}/importa`);
  return {
    stato: "ok",
    messaggio: pubblica
      ? `Pubblicata: ${Object.keys(pulita.valori).length} campi sulla scheda di ${s.nome}.`
      : `Salvata per ${s.nome}: la troverà già compilata quando apre il suo link.`,
    href,
  };
}
