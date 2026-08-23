import { cardBackgrounds, cardFormats, phrases, type Gender } from "@/cards/registry";

/**
 * Dati condivisi fra il tool dei biglietti e le pagine SEO (piano §14).
 * Le pagine sono generate da template: un solo file di rotta produce l'intera
 * mappa di §14.2, e ogni pagina rimanda al tool con i campi già precompilati.
 */

export const TIPI = ["invito", "auguri", "ringraziamento"] as const;
export type Tipo = (typeof TIPI)[number];

export const NOMI_TIPO: Record<Tipo, { singolare: string; plurale: string; azione: string }> = {
  invito: { singolare: "invito", plurale: "inviti", azione: "invitare" },
  auguri: { singolare: "biglietto di auguri", plurale: "biglietti di auguri", azione: "fare gli auguri" },
  ringraziamento: {
    singolare: "biglietto di ringraziamento",
    plurale: "biglietti di ringraziamento",
    azione: "ringraziare",
  },
};

export const ETA_BIGLIETTI = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const FORMATI = [
  { id: "a6", nome: "A6 da stampare", descrizione: "Il formato classico dell'invito di carta." },
  { id: "a5", nome: "A5 da stampare", descrizione: "Più grande, buono come biglietto di auguri." },
  { id: "story", nome: "WhatsApp e storie", descrizione: "Verticale 9:16, per mandarlo dal telefono." },
  { id: "square", nome: "Quadrato", descrizione: "1:1, per i social." },
] as const;

export type FormatoId = (typeof FORMATI)[number]["id"];

/** Larghezza e altezza in pixel del formato scelto (il registry le espone readonly). */
export const misure = (formato: FormatoId): [number, number] => {
  const [larghezza, altezza] = cardFormats[formato];
  return [larghezza, altezza];
};

/** I temi disponibili, uno per riga del registry (le varianti sono due per tema). */
export const temi = [...new Map(cardBackgrounds.map((b) => [b.theme, b])).values()];

export const temaPerSlug = (slug: string) => temi.find((t) => t.theme === slug);

/** I temi consigliati per un'età e, se indicato, per un genere. */
export function temiPer(eta?: number, genere?: Gender) {
  return temi.filter((t) => {
    const etaOk = eta === undefined || (eta >= t.ageMin && eta <= t.ageMax);
    const genereOk = genere === undefined || genere === "n" || t.gender === genere || t.gender === "n";
    return etaOk && genereOk;
  });
}

/** Le frasi pronte per un tipo di biglietto, con i segnaposto già sostituiti. */
export function frasi(tipo: Tipo, nome = "{nome}", eta: number | string = "{eta}"): string[] {
  return phrases[tipo].map((f) =>
    f.replace(/\{nome\}/g, String(nome)).replace(/\{eta\}/g, String(eta)),
  );
}

/** Link al tool con i campi già compilati, come previsto dalla §14.2. */
export function linkAlTool(opzioni: {
  tipo?: Tipo;
  eta?: number;
  genere?: Gender;
  tema?: string;
  formato?: FormatoId;
}): string {
  const parametri = new URLSearchParams();
  if (opzioni.tipo) parametri.set("tipo", opzioni.tipo);
  if (opzioni.eta) parametri.set("eta", String(opzioni.eta));
  if (opzioni.genere) parametri.set("genere", opzioni.genere);
  if (opzioni.tema) parametri.set("tema", opzioni.tema);
  if (opzioni.formato) parametri.set("formato", opzioni.formato);
  const query = parametri.toString();
  return query ? `/biglietti/crea?${query}` : "/biglietti/crea";
}

// --- La mappa delle pagine SEO -------------------------------------------

export type Pagina =
  | { genere: "hub"; tipo: Tipo }
  | { genere: "eta"; tipo: Tipo; eta: number }
  | { genere: "eta-genere"; tipo: Tipo; eta: number; sesso: "bambina" | "bambino" }
  | { genere: "tema"; tipo: Tipo; tema: string }
  | { genere: "modalita"; tipo: Tipo; modalita: string }
  | { genere: "frasi"; tipo: Tipo }
  | { genere: "colorare" };

export const MODALITA: Record<string, { nome: string; risposta: string }> = {
  whatsapp: {
    nome: "da mandare su WhatsApp",
    risposta:
      "Scegli il formato verticale, scarica l'immagine e allegala alla chat. Dal telefono puoi anche usare il pulsante Condividi, che apre WhatsApp direttamente.",
  },
  pdf: {
    nome: "in PDF",
    risposta:
      "Scarica il biglietto e stampalo, oppure salvalo come PDF dalla finestra di stampa del browser: il risultato è pronto per la tipografia o per la stampante di casa.",
  },
  "da-stampare": {
    nome: "da stampare",
    risposta:
      "Il formato A6 è quello classico dell'invito di carta: ne entrano quattro in un foglio A4, da tagliare lungo i bordi.",
  },
  digitali: {
    nome: "digitali",
    risposta:
      "Il biglietto si crea e si scarica direttamente dal browser, senza installare niente e senza registrarsi.",
  },
  gratis: {
    nome: "gratis",
    risposta:
      "Il tool è gratuito e non ha limiti: puoi creare quanti biglietti vuoi, senza filigrana e senza account.",
  },
};

/** Tutti gli slug generati, cioè la mappa SEO della §14.2. */
export function tutteLePagine(): { slug: string; pagina: Pagina }[] {
  const elenco: { slug: string; pagina: Pagina }[] = [];

  const conTemi = (tipo: Tipo, prefisso: string) => {
    for (const t of temi) elenco.push({ slug: `${prefisso}-${t.theme}`, pagina: { genere: "tema", tipo, tema: t.theme } });
  };

  // Inviti: il cluster più grande (§14.1)
  elenco.push({ slug: "inviti-compleanno-bambini", pagina: { genere: "hub", tipo: "invito" } });
  elenco.push({ slug: "frasi-inviti-compleanno-bambini", pagina: { genere: "frasi", tipo: "invito" } });
  for (const eta of ETA_BIGLIETTI) {
    elenco.push({ slug: `inviti-compleanno-${eta}-anni`, pagina: { genere: "eta", tipo: "invito", eta } });
    elenco.push({
      slug: `inviti-compleanno-bambina-${eta}-anni`,
      pagina: { genere: "eta-genere", tipo: "invito", eta, sesso: "bambina" },
    });
    elenco.push({
      slug: `inviti-compleanno-bambino-${eta}-anni`,
      pagina: { genere: "eta-genere", tipo: "invito", eta, sesso: "bambino" },
    });
  }
  conTemi("invito", "inviti-compleanno");
  for (const modalita of Object.keys(MODALITA)) {
    elenco.push({ slug: `inviti-compleanno-${modalita}`, pagina: { genere: "modalita", tipo: "invito", modalita } });
  }

  // Auguri
  elenco.push({ slug: "auguri-compleanno-bambini", pagina: { genere: "hub", tipo: "auguri" } });
  elenco.push({ slug: "frasi-auguri-compleanno-bambini", pagina: { genere: "frasi", tipo: "auguri" } });
  for (const eta of ETA_BIGLIETTI) {
    elenco.push({ slug: `auguri-compleanno-${eta}-anni`, pagina: { genere: "eta", tipo: "auguri", eta } });
    elenco.push({
      slug: `auguri-compleanno-bambina-${eta}-anni`,
      pagina: { genere: "eta-genere", tipo: "auguri", eta, sesso: "bambina" },
    });
    elenco.push({
      slug: `auguri-compleanno-bambino-${eta}-anni`,
      pagina: { genere: "eta-genere", tipo: "auguri", eta, sesso: "bambino" },
    });
  }
  conTemi("auguri", "auguri-compleanno");

  // Ringraziamenti e da colorare
  elenco.push({
    slug: "ringraziamento-compleanno-bambini",
    pagina: { genere: "hub", tipo: "ringraziamento" },
  });
  elenco.push({ slug: "biglietti-compleanno-da-colorare", pagina: { genere: "colorare" } });

  return elenco;
}

export const paginaPerSlug = (slug: string): Pagina | undefined =>
  tutteLePagine().find((p) => p.slug === slug)?.pagina;
