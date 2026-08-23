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

/** La lista in cui finisce il contatto: genitori o insegnanti, in base alla professione. */
function listaPer(professione?: string): number | null {
  const insegnanti = process.env.BREVO_LIST_INSEGNANTI;
  const genitori = process.env.BREVO_LIST_GENITORI;
  const pareInsegnante = /insegnante|maestr|docent|educat/i.test(professione ?? "");
  const scelta = pareInsegnante ? insegnanti : genitori;
  return scelta ? Number(scelta) : null;
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
  const listId = listaPer(contatto.professione);

  return chiama("/contacts", {
    email: contatto.email,
    updateEnabled: true,
    attributes: {
      NOME: contatto.nomeGenitore,
      CITTA: contatto.citta,
      PROFESSIONE: contatto.professione,
      ETA_FIGLIO: contatto.etaFiglio,
      CLASSE: contatto.classe,
      ORIGINE: contatto.origine,
    },
    listIds: listId ? [listId] : undefined,
  });
}

/** Evento "gioco_completato": alimenta le automazioni Brevo (§4.4). */
export async function tracciaGiocoCompletato(email: string, slug: string) {
  return chiama("/events", {
    event_name: "gioco_completato",
    identifiers: { email_id: email },
    event_properties: { slug },
  });
}
