/**
 * Sync contatti ed eventi verso Brevo (piano §4.4).
 * Gli attributi sono quelli decisi nel piano §7: CITTA, PROFESSIONE, ETA_FIGLIO, CLASSE.
 * La chiave sta solo lato server: non va mai esposta al browser.
 */

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

/** Template Brevo dell'email di conferma (doppio opt-in), creato il 31/10/2026. */
const TEMPLATE_DOI = Number(process.env.BREVO_DOI_TEMPLATE_ID ?? 122);
const CARTELLA = "Giocamizi";
const LISTE = { genitori: "Giocamizi · Genitori", insegnanti: "Giocamizi · Insegnanti" } as const;
/** Attributi del modulo: se mancano nell'account Brevo li crea il sito. */
const ATTRIBUTI: [string, "text" | "float" | "date"][] = [
  ["CITTA", "text"], ["PROFESSIONE", "text"], ["ETA_FIGLIO", "float"], ["CLASSE", "text"],
  ["ORIGINE", "text"], ["CONSENSO_DATA", "date"], ["CONSENSO_FONTE", "text"],
];

async function api(metodo: "GET" | "POST", percorso: string, body?: unknown) {
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

  // Doppio opt-in: Brevo manda l'email di conferma (template TEMPLATE_DOI) e
  // il contatto entra in lista solo dopo il clic. È la prova del consenso.
  // BREVO_DOI_TEMPLATE_ID=0 in Vercel lo spegne (iscrizione diretta).
  if (TEMPLATE_DOI && listId) {
    return chiama("/contacts/doubleOptinConfirmation", {
      email: contatto.email,
      includeListIds: [listId],
      templateId: TEMPLATE_DOI,
      redirectionUrl: "https://giocamizi.it/iscrizione-confermata",
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
