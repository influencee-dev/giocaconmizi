"use server";

import { CATEGORIE, SCHEDE } from "@/lib/directory";
import { chiaveScheda, inviaCandidatura } from "@/lib/directory-db";

export type EsitoCandidatura = { stato: "fermo" } | { stato: "ok"; tipo: "nuova" | "accesso" } | { stato: "errore"; messaggio: string };

const pulito = (v: FormDataEntryValue | null, max = 300) => String(v ?? "").trim().replace(/\s+/g, " ").slice(0, max);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const URL_OK = /^(https?:\/\/)?[a-z0-9.-]+\.[a-z]{2,}(\/\S*)?$/i;

/** Una proposta dal modulo pubblico: attività nuova o accesso a una scheda che c'è già. */
export async function proponi(_prima: EsitoCandidatura, form: FormData): Promise<EsitoCandidatura> {
  if (pulito(form.get("sito_web_2"))) return { stato: "ok", tipo: "nuova" }; // campo trappola dei bot
  const tipo = form.get("tipo") === "accesso" ? "accesso" : "nuova";
  const referente = pulito(form.get("referente"), 120);
  const email = pulito(form.get("email"), 200).toLowerCase();
  if (!referente) return { stato: "errore", messaggio: "Scrivi il tuo nome e cognome." };
  if (!EMAIL.test(email)) return { stato: "errore", messaggio: "Controlla l'email: ti scriviamo lì." };
  // Una spunta sola nel modulo («conferma»): vale come titolare + termini.
  const conferma = form.get("conferma") === "si";
  if (!conferma && form.get("titolare") !== "si") return { stato: "errore", messaggio: "Serve la conferma che gestisci l'attività o hai il permesso di farlo." };
  if (!conferma && form.get("termini") !== "si") return { stato: "errore", messaggio: "Per comparire su Giocamizi serve accettare i termini per le attività." };

  const dati: Record<string, string> = {};
  const metti = (k: string, max = 300) => {
    const v = pulito(form.get(k), max);
    if (v) dati[k] = v;
  };
  metti("telefono", 40);
  metti("ruolo", 80);
  metti("messaggio", 800);

  let chiave: string | null = null;
  if (tipo === "accesso") {
    const s = SCHEDE.find((x) => chiaveScheda(x) === pulito(form.get("scheda"), 200));
    if (!s) return { stato: "errore", messaggio: "Cerca la tua attività e toccala nell'elenco." };
    chiave = chiaveScheda(s);
    dati.nome = s.nome;
  } else {
    metti("nome", 120);
    metti("citta", 80);
    metti("indirizzo", 200);
    metti("descrizione", 1200);
    metti("eta", 40);
    metti("sito", 200);
    metti("instagram", 200);
    const cat = CATEGORIE.find((c) => c.slug === pulito(form.get("categoria"), 80));
    if (!dati.nome) return { stato: "errore", messaggio: "Scrivi il nome dell'attività." };
    if (!cat) return { stato: "errore", messaggio: "Scegli la categoria." };
    if (!dati.citta) return { stato: "errore", messaggio: "Scrivi la città." };
    if (!dati.descrizione || dati.descrizione.length < 40) return { stato: "errore", messaggio: "Racconta in due o tre frasi cosa fate per i bambini." };
    if (dati.sito && !URL_OK.test(dati.sito)) return { stato: "errore", messaggio: "Il sito non sembra un indirizzo web: controllalo." };
    dati.categoria = cat.slug;
  }

  const r = await inviaCandidatura({ tipo, chiave, dati, email, referente, termini: true });
  if (!r.ok) {
    return {
      stato: "errore",
      messaggio: r.errore.includes("troppe") ? "Hai già mandato diverse richieste oggi: ti rispondiamo presto." : "Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto.",
    };
  }
  return { stato: "ok", tipo };
}
