/**
 * Sync contatti ed eventi verso Brevo (piano §4.4).
 * Gli attributi sono quelli decisi nel piano §7: CITTA, PROFESSIONE, ETA_FIGLIO, CLASSE.
 * La chiave sta solo lato server: non va mai esposta al browser.
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { OGGETTO_BENVENUTO, htmlBenvenuto } from "./brevo-benvenuto";
import { HTML_CONFERMA, NOME_CONFERMA, OGGETTO_CONFERMA } from "./brevo-conferma";

const BREVO_API = "https://api.brevo.com/v3";

export interface ContattoBrevo {
  email: string;
  nomeGenitore?: string;
  citta?: string;
  professione?: string;
  etaFiglio?: number;
  classe?: string;
  /** Da dove arriva il contatto: serve alle automazioni (§14.3: ORIGINE=biglietti). */
  origine?: string;
}

function chiave(): string | null {
  return process.env.BREVO_API_KEY ?? null;
}

/**
 * L'email di conferma (doppio opt-in). Con BREVO_DOI_TEMPLATE_ID si usa quel
 * template (0 = iscrizione diretta, senza conferma); senza, il sito trova o
 * crea nell'account il template «Giocamizi · Conferma iscrizione» con il
 * mittente BREVO_MITTENTE (ciao@giocamizi.it). Così un account Brevo nuovo
 * funziona appena c'è la chiave.
 */
const TEMPLATE_DOI_ENV = process.env.BREVO_DOI_TEMPLATE_ID;
const MITTENTE = { name: "Mizi di Giocamizi", email: process.env.BREVO_MITTENTE ?? "ciao@giocamizi.it" };
const CARTELLA = "Giocamizi";
const LISTE = { genitori: "Giocamizi · Genitori", insegnanti: "Giocamizi · Insegnanti" } as const;
/** Attributi del modulo: se mancano nell'account Brevo li crea il sito. */
const ATTRIBUTI: [string, "text" | "float" | "date"][] = [
  ["CITTA", "text"], ["PROFESSIONE", "text"], ["ETA_FIGLIO", "float"], ["CLASSE", "text"],
  ["ORIGINE", "text"], ["CONSENSO_DATA", "date"], ["CONSENSO_FONTE", "text"], ["BENVENUTO", "date"],
];

async function api(metodo: "GET" | "POST" | "PUT", percorso: string, body?: unknown) {
  const apiKey = chiave();
  if (!apiKey) return null;
  const r = await fetch(`${BREVO_API}${percorso}`, {
    method: metodo,
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const testo = await r.text();
  try {
    return { ok: r.ok, dati: testo ? JSON.parse(testo) : {} };
  } catch {
    return { ok: r.ok, dati: {} };
  }
}

let listeCache: Record<keyof typeof LISTE, number> | null = null;

/**
 * Trova (o crea, la prima volta) la cartella "Giocamizi", le due liste e gli
 * attributi nell'account Brevo. Così il collegamento non dipende da ID
 * copiati a mano nelle variabili di Vercel.
 */
async function preparaBrevo(): Promise<Record<keyof typeof LISTE, number> | null> {
  if (listeCache) return listeCache;
  const daEnv = { genitori: Number(process.env.BREVO_LIST_GENITORI), insegnanti: Number(process.env.BREVO_LIST_INSEGNANTI) };
  if (daEnv.genitori && daEnv.insegnanti) {
    await Promise.all(ATTRIBUTI.map(([nome, tipo]) => api("POST", `/contacts/attributes/normal/${nome}`, { type: tipo })));
    return (listeCache = daEnv);
  }

  const cartelle = await api("GET", "/contacts/folders?limit=50&offset=0");
  if (!cartelle?.ok) return null;
  let cartellaId: number | undefined = (cartelle.dati.folders ?? []).find((f: { name: string }) => f.name === CARTELLA)?.id;
  if (!cartellaId) cartellaId = (await api("POST", "/contacts/folders", { name: CARTELLA }))?.dati?.id;
  if (!cartellaId) return null;

  const esistenti = await api("GET", `/contacts/folders/${cartellaId}/lists?limit=50&offset=0`);
  const trovate: { id: number; name: string }[] = esistenti?.dati?.lists ?? [];
  const id = async (nome: string) =>
    trovate.find((l) => l.name === nome)?.id ?? (await api("POST", "/contacts/lists", { name: nome, folderId: cartellaId }))?.dati?.id;
  const genitori = await id(LISTE.genitori);
  const insegnanti = await id(LISTE.insegnanti);
  if (!genitori || !insegnanti) return null;

  // Attributi: se esistono già Brevo risponde con un errore, che ignoriamo.
  await Promise.all(ATTRIBUTI.map(([nome, tipo]) => api("POST", `/contacts/attributes/normal/${nome}`, { type: tipo })));
  return (listeCache = { genitori, insegnanti });
}

let confermaCache: number | null = null;

/**
 * L'ID del template di conferma: dalla variabile, oppure trovato per nome o
 * creato nell'account (con il mittente, se non c'è ancora). 0 = nessuna
 * conferma; null = non è stato possibile prepararlo (si iscrive senza).
 */
async function templateConferma(): Promise<number | null> {
  if (TEMPLATE_DOI_ENV !== undefined && TEMPLATE_DOI_ENV !== "") return Number(TEMPLATE_DOI_ENV) || 0;
  if (confermaCache) return confermaCache;
  const elenco = await api("GET", "/smtp/templates?templateStatus=true&limit=100&offset=0&sort=desc");
  if (!elenco?.ok) return null;
  const trovato = (elenco.dati.templates ?? []).find((t: { name: string; id: number }) => t.name === NOME_CONFERMA)?.id;
  if (trovato) return (confermaCache = trovato);

  // Il mittente deve esistere nell'account: se manca lo si aggiunge (con il
  // dominio autenticato è subito attivo, altrimenti Brevo manda un codice).
  const mittenti = await api("GET", "/senders");
  const presente = (mittenti?.dati?.senders ?? []).some((m: { email: string }) => m.email.toLowerCase() === MITTENTE.email.toLowerCase());
  if (!presente) await api("POST", "/senders", MITTENTE);

  const creato = await api("POST", "/smtp/templates", {
    templateName: NOME_CONFERMA,
    subject: OGGETTO_CONFERMA,
    htmlContent: HTML_CONFERMA,
    sender: MITTENTE,
    replyTo: MITTENTE.email,
    tag: "optin",
    isActive: true,
  });
  const id = Number(creato?.dati?.id);
  return id ? (confermaCache = id) : null;
}

/** La lista in cui finisce il contatto: genitori o insegnanti, in base alla professione. */
async function listaPer(professione?: string): Promise<number | null> {
  const liste = await preparaBrevo();
  if (!liste) return null;
  return /insegnante|maestr|docent|educat/i.test(professione ?? "") ? liste.insegnanti : liste.genitori;
}

async function chiama(percorso: string, body: unknown) {
  const apiKey = chiave();
  if (!apiKey) {
    // In sviluppo o in preview senza chiave non è un errore: si salta e basta.
    return { ok: false, motivo: "BREVO_API_KEY mancante" as const };
  }

  const risposta = await fetch(`${BREVO_API}${percorso}`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!risposta.ok) {
    const dettaglio = await risposta.text();
    return { ok: false, motivo: `Brevo ${risposta.status}: ${dettaglio}` };
  }

  return { ok: true as const };
}

/** Crea o aggiorna il contatto alla conferma della registrazione. */
export async function creaContatto(contatto: ContattoBrevo) {
  const listId = await listaPer(contatto.professione);
  const base = {
    email: contatto.email,
    updateEnabled: true,
    listIds: listId ? [listId] : undefined,
  };

  // Doppio opt-in: Brevo manda l'email di conferma e il contatto entra in
  // lista solo dopo il clic. È la prova del consenso.
  // BREVO_DOI_TEMPLATE_ID=0 in Vercel lo spegne (iscrizione diretta).
  const conferma = listId ? await templateConferma() : null;
  // Senza email di conferma pronta non si iscrive nessuno «di nascosto»:
  // meglio un'iscrizione non riuscita (il sito lo dice) che senza la prova del consenso.
  if (listId && conferma === null) return { ok: false, motivo: "Email di conferma non pronta in Brevo" };
  if (conferma && listId) {
    return chiama("/contacts/doubleOptinConfirmation", {
      email: contatto.email,
      includeListIds: [listId],
      templateId: conferma,
      // Il codice cifrato fa partire l'email di benvenuto all'arrivo sulla pagina.
      redirectionUrl: `https://giocamizi.it/iscrizione-confermata?t=${codiceBenvenuto(contatto.email) ?? ""}`,
      attributes: {
        FIRSTNAME: contatto.nomeGenitore,
        CITTA: contatto.citta,
        PROFESSIONE: contatto.professione,
        ETA_FIGLIO: contatto.etaFiglio,
        CLASSE: contatto.classe,
        ORIGINE: contatto.origine,
        CONSENSO_DATA: new Date().toISOString().slice(0, 10),
        CONSENSO_FONTE: `giocamizi.it modulo ${contatto.origine ?? "sito"} v2026-10-31`,
      },
    });
  }

  const esito = await chiama("/contacts", {
    ...base,
    attributes: {
      // FIRSTNAME è l'attributo standard già presente nell'account Brevo.
      FIRSTNAME: contatto.nomeGenitore,
      CITTA: contatto.citta,
      PROFESSIONE: contatto.professione,
      ETA_FIGLIO: contatto.etaFiglio,
      CLASSE: contatto.classe,
      ORIGINE: contatto.origine,
    },
  });

  // Se l'account non ha ancora uno degli attributi (PROFESSIONE, ETA_FIGLIO,
  // CLASSE, ORIGINE vanno creati a mano in Brevo), meglio un contatto con
  // meno campi che un'iscrizione fallita: si riprova col minimo garantito.
  if (!esito.ok && /attribute/i.test(esito.motivo ?? "")) {
    return chiama("/contacts", {
      ...base,
      attributes: { FIRSTNAME: contatto.nomeGenitore, CITTA: contatto.citta },
    });
  }

  return esito;
}

export interface Iscritto {
  email: string;
  lista: "genitori" | "insegnanti";
  creato: string;
  disiscritto: boolean;
  citta?: string;
  professione?: string;
  origine?: string;
  consensoData?: string;
  consensoFonte?: string;
}

/**
 * Per il pannello di Giorgia: i numeri delle due liste e gli ultimi iscritti
 * (fino a 500 per lista). Dati personali: solo lato server, mai in cache.
 * null = BREVO_API_KEY mancante o Brevo non raggiungibile.
 */
export async function iscrittiAdmin(): Promise<{
  totali: Record<keyof typeof LISTE, { iscritti: number; disiscritti: number }>;
  elenco: Iscritto[];
} | null> {
  const liste = await preparaBrevo();
  if (!liste) return null;
  const totali = {} as Record<keyof typeof LISTE, { iscritti: number; disiscritti: number }>;
  const elenco: Iscritto[] = [];
  for (const nome of Object.keys(LISTE) as (keyof typeof LISTE)[]) {
    const [info, contatti] = await Promise.all([
      api("GET", `/contacts/lists/${liste[nome]}`),
      api("GET", `/contacts/lists/${liste[nome]}/contacts?limit=500&offset=0&sort=desc`),
    ]);
    if (!info?.ok) return null;
    totali[nome] = { iscritti: info.dati.uniqueSubscribers ?? info.dati.totalSubscribers ?? 0, disiscritti: info.dati.totalBlacklisted ?? 0 };
    for (const c of (contatti?.dati?.contacts ?? []) as {
      email: string;
      createdAt: string;
      emailBlacklisted: boolean;
      attributes?: Record<string, string>;
    }[]) {
      elenco.push({
        email: c.email,
        lista: nome,
        creato: c.createdAt,
        disiscritto: c.emailBlacklisted,
        citta: c.attributes?.CITTA,
        professione: c.attributes?.PROFESSIONE,
        origine: c.attributes?.ORIGINE,
        consensoData: c.attributes?.CONSENSO_DATA,
        consensoFonte: c.attributes?.CONSENSO_FONTE,
      });
    }
  }
  elenco.sort((a, b) => b.creato.localeCompare(a.creato));
  return { totali, elenco };
}


/* ---------------- Email di benvenuto ---------------- */

/** Chiave del codice di benvenuto, ricavata da quella Brevo: niente segreti in più. */
function chiaveCodice(): Buffer | null {
  const k = chiave();
  return k ? createHash("sha256").update(`giocamizi-benvenuto|${k}`).digest() : null;
}

/** L'email cifrata (AES-256-GCM) da mettere nel link di conferma: nessuno la legge nell'indirizzo. */
export function codiceBenvenuto(email: string): string | null {
  const k = chiaveCodice();
  if (!k) return null;
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", k, iv);
  const dati = Buffer.concat([c.update(email.trim().toLowerCase(), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), dati]).toString("base64url");
}

function leggiCodice(codice: string): string | null {
  const k = chiaveCodice();
  if (!k || !/^[A-Za-z0-9_-]{40,400}$/.test(codice)) return null;
  try {
    const b = Buffer.from(codice, "base64url");
    const d = createDecipheriv("aes-256-gcm", k, b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    const email = Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) ? email : null;
  } catch {
    return null;
  }
}

const attesa = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Chi arriva su /iscrizione-confermata col codice: se Brevo conferma che il
 * contatto è entrato in una lista di Giocamizi (ha cliccato «Confermo») e non
 * ha ancora avuto il benvenuto, gli si manda l'email con la foto di Giorgia e
 * Domiziana e si segna BENVENUTO. Una volta sola, anche se ricarica la pagina.
 * Non lancia mai errori: la pagina si vede comunque.
 */
export async function inviaBenvenuto(codice: string | undefined): Promise<"inviato" | "gia-inviato" | "no"> {
  if (!codice) return "no";
  const email = leggiCodice(codice);
  if (!email) return "no";
  try {
    const liste = await preparaBrevo();
    if (!liste) return "no";
    const percorso = `/contacts/${encodeURIComponent(email)}`;
    let contatto = await api("GET", percorso);
    const inLista = (c: typeof contatto) =>
      Boolean(c?.ok && (c.dati.listIds ?? []).some((id: number) => id === liste.genitori || id === liste.insegnanti));
    // Brevo può metterci un attimo a spostare il contatto in lista dopo il clic.
    if (!inLista(contatto)) {
      await attesa(1500);
      contatto = await api("GET", percorso);
    }
    if (!inLista(contatto)) return "no";
    if (contatto?.dati?.attributes?.BENVENUTO) return "gia-inviato";

    const nome = typeof contatto?.dati?.attributes?.FIRSTNAME === "string" ? contatto.dati.attributes.FIRSTNAME.trim().slice(0, 40) : "";
    const invio = await api("POST", "/smtp/email", {
      sender: MITTENTE,
      to: [{ email }],
      replyTo: { email: MITTENTE.email, name: MITTENTE.name },
      subject: OGGETTO_BENVENUTO,
      htmlContent: htmlBenvenuto(),
      params: nome ? { NOME: nome } : undefined,
      tags: ["benvenuto"],
    });
    if (!invio?.ok) return "no";
    await api("PUT", percorso, { attributes: { BENVENUTO: new Date().toISOString().slice(0, 10) } });
    return "inviato";
  } catch {
    return "no";
  }
}
