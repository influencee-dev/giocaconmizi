"use server";

import { revalidatePath } from "next/cache";
import { adminValido } from "@/lib/admin";
import { SCHEDE, percorsoScheda } from "@/lib/directory";
import { SCHEDA_ESTESA_PROVA, adminSalvaScheda } from "@/lib/directory-db";
import { fornitoreAi, leggiFonti, proponiScheda, type EsitoFonte, type Proposta } from "@/lib/import-ai";
import { validaScheda, type SchedaEstesa } from "@/lib/scheda-campi";

const schedaDa = (chiave: string) => SCHEDE.find((s) => `${s.cittaSlug}/${s.slug}` === chiave);

/** Il link che, nel server delle verifiche, restituisce la proposta dimostrativa. */
const LINK_DIMOSTRATIVO = "https://prova.giocamizi.it/";

function propostaDimostrativa(categoria: string): EsitoProposta {
  const v = SCHEDA_ESTESA_PROVA.estesa.valori;
  const scelti = { descrizione: v.descrizione, eta: v.eta, fannoFeste: v.fannoFeste, bambini: v.bambini, durata: v.durata, incluso: v.incluso, prezzo: v.prezzo, orari: v.orari, ambiente: v.ambiente, passeggino: v.passeggino };
  const provenienza = Object.fromEntries(Object.keys(scelti).map((id) => [id, { come: "ai", fonte: LINK_DIMOSTRATIVO }]));
  const { scheda } = validaScheda(categoria, scelti, provenienza);
  const frasi: Record<string, string> = {
    eta: "Feste per bambini dai 3 ai 10 anni",
    fannoFeste: "Organizziamo feste di compleanno tutto l'anno",
    bambini: "da 10 a 30 bambini",
    durata: "La festa dura 3 ore",
    incluso: "Sala, animatore, merenda, torta e allestimento compresi",
    prezzo: "250 € fino a 15 bambini, 12 € per ogni bambino in più",
    orari: "Venerdì 16-20, sabato 10-20, domenica 10-19",
    ambiente: "Sala al coperto di 220 mq",
    passeggino: "Ingresso senza gradini",
    descrizione: "Sala feste con animazione per bambini",
  };
  const citazioni = Object.fromEntries(Object.keys(scheda.valori).map((id) => [id, { fonte: LINK_DIMOSTRATIVO, citazione: frasi[id] ?? "" }]));
  return {
    stato: "ok",
    esiti: [{ url: LINK_DIMOSTRATIVO, ok: true, nota: "letta (proposta dimostrativa, solo nella copia di prova)" }],
    proposta: { scheda, citazioni, scartati: [], note: "Proposta dimostrativa: dati inventati per provare la pagina." },
  };
}

export type EsitoProposta =
  | { stato: "ok"; esiti: EsitoFonte[]; proposta: Proposta }
  | { stato: "errore"; messaggio: string; esiti?: EsitoFonte[] };

/** Legge le fonti e chiede all'AI la scheda. Solo con il codice del pannello: ogni chiamata costa. */
export async function proponi(codice: string, chiave: string, urls: string[]): Promise<EsitoProposta> {
  if (!(await adminValido(codice))) return { stato: "errore", messaggio: "Codice del pannello non valido." };
  const s = schedaDa(chiave);
  if (!s) return { stato: "errore", messaggio: "Scheda non trovata." };
  // Solo nel server delle verifiche (mai su Vercel): una proposta dimostrativa, senza rete né chiave.
  if (process.env.GIOCAMIZI_ADMIN_PROVA && !process.env.VERCEL && urls.includes(LINK_DIMOSTRATIVO)) return propostaDimostrativa(s.categoria.slug);
  const { fonti, esiti } = await leggiFonti(urls.slice(0, 6));
  // I link pubblici che il nostro server non ha aperto: Gemini li può leggere da sé.
  const linkDaLeggere = fornitoreAi() === "gemini" ? esiti.filter((e) => !e.ok && !e.nota.startsWith("indirizzo non valido")).map((e) => e.url) : [];
  if (!fonti.length && !linkDaLeggere.length) return { stato: "errore", messaggio: "Non sono riuscita a leggere nessuna fonte.", esiti };
  try {
    const ora = new Date();
    const mese = `${ora.getFullYear()}-${String(ora.getMonth() + 1).padStart(2, "0")}`;
    const proposta = await proponiScheda({ nome: s.nome, citta: s.citta, categoria: s.categoria.slug, nomeCategoria: s.categoria.nome, fonti, linkDaLeggere, mese });
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
