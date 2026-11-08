import { inviaEmailServizio } from "./brevo";
import { TITOLARE } from "./legal";

/**
 * Le email di servizio delle schede (attività della directory e risorse educative):
 *   1. avviso a Giorgia: candidatura, risposta dal link personale, logo da approvare;
 *   2. conferma a chi ha scritto: «abbiamo ricevuto»;
 *   3. il link personale, mandato dal pannello con un tocco;
 *   4. «la tua scheda è online» (o «l'abbiamo tolta») dopo la decisione di Giorgia.
 *
 * Partono da Brevo (lib/brevo.ts → inviaEmailServizio) e non bloccano mai
 * l'azione: senza chiave o con Brevo giù, semplicemente non partono.
 * Nessun codice del pannello nelle email: chi le inoltra non apre niente.
 */

const SITO = "https://giocamizi.it";
/** Dove arrivano gli avvisi per Giorgia: AVVISI_EMAIL su Vercel, se no la casella del sito. */
const AVVISI = process.env.AVVISI_EMAIL || TITOLARE.email;

/** Tutto ciò che arriva dai moduli va ripulito prima di entrare nell'HTML. */
const h = (testo: string) =>
  testo.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const bottone = (href: string, testo: string) =>
  `<a href="${h(href)}" style="display:inline-block;background:#9B6DD6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 22px;border-radius:14px;">${h(testo)}</a>`;

function pagina(titolo: string, corpo: string): string {
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${h(titolo)}</title></head>
<body style="margin:0;background:#FFF3E6;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#1F2430;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border-radius:22px;padding:28px;">
<tr><td>
<p style="margin:0 0 6px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#9B6DD6;">Giocamizi</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1F2430;">${h(titolo)}</h1>
${corpo}
<p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#5B6070;">Giocamizi è un sito gratuito per famiglie e insegnanti, senza pubblicità. Per qualsiasi domanda rispondi pure a questa email.</p>
</td></tr></table>
</td></tr></table></body></html>`;
}

const par = (testo: string) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;">${testo}</p>`;

// ---------- 1. Avviso a Giorgia ----------

export type Avviso = "candidatura-nuova" | "candidatura-accesso" | "risposta" | "rimozione" | "logo";

const OGGETTI_AVVISO: Record<Avviso, string> = {
  "candidatura-nuova": "Nuova attività da verificare",
  "candidatura-accesso": "Qualcuno reclama una scheda",
  risposta: "Una scheda ha risposto dal link personale",
  rimozione: "Una scheda chiede di essere tolta",
  logo: "Un logo da approvare",
};

export async function avvisaGiorgia(tipo: Avviso, scheda: string, righe: Record<string, string | undefined> = {}) {
  const elenco = Object.entries(righe)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 10px 4px 0;font-size:14px;font-weight:bold;vertical-align:top;">${h(k)}</td><td style="padding:4px 0;font-size:14px;">${h(String(v)).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  const corpo =
    par(`<strong>${h(scheda)}</strong>`) +
    (elenco ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 16px;">${elenco}</table>` : "") +
    par("Apri il pannello di Giocamizi (il tuo link con il codice) per decidere: niente va online senza di te.");
  return inviaEmailServizio({ a: AVVISI, oggetto: `${OGGETTI_AVVISO[tipo]}: ${scheda}`.slice(0, 150), html: pagina(OGGETTI_AVVISO[tipo], corpo), etichetta: `avviso-${tipo}` });
}

// ---------- 2. Conferma a chi ha scritto ----------

export async function confermaRicevuta(a: string, persona: string, scheda: string, tipo: "candidatura" | "accesso" | "risposta" | "rimozione") {
  const saluto = persona ? `Ciao ${h(persona.split(" ")[0]!)},` : "Ciao,";
  const testi = {
    candidatura: `abbiamo ricevuto la proposta di <strong>${h(scheda)}</strong> per Giocamizi. La controlliamo a mano, di solito entro pochi giorni lavorativi, e ti scriviamo appena la scheda è online.`,
    accesso: `abbiamo ricevuto la tua richiesta per la scheda di <strong>${h(scheda)}</strong>. Controlliamo che tu possa rappresentarla e ti mandiamo il link personale: da lì potrai approvarla, completarla (anche con il logo) o toglierla.`,
    risposta: `abbiamo ricevuto la tua risposta per la scheda di <strong>${h(scheda)}</strong>. La controlliamo e la pubblichiamo entro 48 ore: ti scriviamo quando è online.`,
    rimozione: `abbiamo ricevuto la richiesta di togliere la scheda di <strong>${h(scheda)}</strong>. La togliamo entro 48 ore e ti scriviamo per conferma.`,
  };
  return inviaEmailServizio({ a, oggetto: `Abbiamo ricevuto la tua richiesta: ${scheda}`.slice(0, 150), html: pagina("Richiesta ricevuta", par(saluto) + par(testi[tipo])), etichetta: `conferma-${tipo}` });
}

// ---------- 3. Il link personale ----------

export async function mandaLinkPersonale(a: string, persona: string, scheda: string, link: string) {
  const saluto = persona ? `Ciao ${h(persona.split(" ")[0]!)},` : "Ciao,";
  const corpo =
    par(saluto) +
    par(`ecco il link personale della scheda di <strong>${h(scheda)}</strong> su Giocamizi. Da qui puoi approvarla così com'è, completarla con i tuoi dati e il logo, oppure chiederci di toglierla.`) +
    `<p style="margin:8px 0 20px;">${bottone(link, "Apri la tua scheda")}</p>` +
    par(`Il link è solo tuo: non inoltrarlo. Vale 60 giorni; se scade, rispondi a questa email e te ne mandiamo uno nuovo.`) +
    par(`È gratis e lo resta: nessuna commissione, nessuna pubblicità.`);
  return inviaEmailServizio({ a, oggetto: `Il link della tua scheda su Giocamizi: ${scheda}`.slice(0, 150), html: pagina("La tua scheda su Giocamizi", corpo), etichetta: "link-personale" });
}

// ---------- 4. Esito ----------

export async function schedaOnline(a: string, scheda: string, percorso: string) {
  const corpo =
    par(`La scheda di <strong>${h(scheda)}</strong> è online su Giocamizi, con il bollino «Scheda verificata».`) +
    `<p style="margin:8px 0 20px;">${bottone(`${SITO}${percorso}`, "Guarda la tua scheda")}</p>` +
    par("Se vuoi cambiare qualcosa, usa di nuovo il tuo link personale. Se ti fa piacere, condividi la scheda sui tuoi canali: aiuta le famiglie a trovarti.");
  return inviaEmailServizio({ a, oggetto: `La tua scheda è online: ${scheda}`.slice(0, 150), html: pagina("La tua scheda è online", corpo), etichetta: "scheda-online" });
}

export async function schedaTolta(a: string, scheda: string) {
  const corpo = par(`Come ci hai chiesto, abbiamo tolto la scheda di <strong>${h(scheda)}</strong> da Giocamizi.`) + par("Se cambi idea, scrivici: la rimettiamo volentieri.");
  return inviaEmailServizio({ a, oggetto: `Abbiamo tolto la scheda: ${scheda}`.slice(0, 150), html: pagina("Scheda tolta", corpo), etichetta: "scheda-tolta" });
}
