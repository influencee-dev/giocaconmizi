/**
 * Risorse educative consigliate — l'hub /risorse-educative-bambini.
 *
 * Una sola pagina, divisa in cinque sezioni filtrabili: niente pagine
 * sottili per ogni risorsa (le schede vivono tutte qui). I dati pubblici
 * stanno in lib/risorse-educative-dati.ts; l'archivio completo (con email e
 * note di outreach) resta nel foglio privato di Giorgia e NON entra nel repo.
 *
 * COME SI AGGIORNA: dal foglio «Listing GiocaMizi» si copiano solo le righe
 * che non sono «Solo outreach — non pubblicare», e di quelle solo le colonne
 * pubbliche (vedi l'intestazione del file dati). Prima di pubblicare una
 * riga si controlla che il sito ufficiale risponda.
 */
import { RISORSE } from "./risorse-educative-dati";

export const PERCORSO_RISORSE = "/risorse-educative-bambini";

export const SEZIONI = {
  famiglie: {
    nome: "Per famiglie e genitori",
    breve: "Famiglie",
    descrizione:
      "Blog, magazine e community scritti da genitori e per genitori: idee per crescere, viaggiare e passare il tempo insieme ai bambini.",
  },
  insegnanti: {
    nome: "Per insegnanti e scuola primaria",
    breve: "Insegnanti",
    descrizione:
      "Portali di schede e attività, blog di maestre e maestri e progetti di formazione utili in classe, dall'infanzia alla primaria.",
  },
  territorio: {
    nome: "Scuole, nidi, cooperative e territorio",
    breve: "Scuole e territorio",
    descrizione:
      "Scuole dell'infanzia e primarie, nidi e cooperative educative con laboratori e servizi per bambini e famiglie, città per città.",
  },
  coding: {
    nome: "Coding, STEM e digitale",
    breve: "Coding e STEM",
    descrizione:
      "Robotica, pensiero computazionale, scienza e tecnologia: realtà che portano il digitale ai bambini in modo attivo e creativo.",
  },
  lettura: {
    nome: "Lettura, storie e creatività",
    breve: "Lettura e creatività",
    descrizione:
      "Fiabe, libri, musica e laboratori creativi per far nascere il piacere di leggere, raccontare e inventare.",
  },
} as const;

export type Sezione = keyof typeof SEZIONI;
export const ORDINE_SEZIONI = Object.keys(SEZIONI) as Sezione[];

/** Solo ciò che il sito ufficiale dice chiaramente; nel dubbio «Da verificare sul sito». */
export type Costi = "Gratuito" | "A pagamento" | "In parte gratuito" | "Da verificare sul sito";

export interface Risorsa {
  /** Codice dell'archivio (GM-xxx): serve per allineare il foglio, non si mostra. */
  id: string;
  nome: string;
  /** La stessa frase compare nella card e nel JSON-LD. */
  descrizione: string;
  /** La prima è la sezione principale: lì compare la card nella vista completa. */
  sezioni: Sezione[];
  temi: string[];
  perChi: string;
  /** La scheda che si apre con «Scopri di più»: scritta rileggendo il sito ufficiale. */
  cosaFa?: string;
  comeSiUsa?: string;
  costi?: Costi;
  localita?: string;
  /** Sito ufficiale (controllato il 7/11/2026). */
  url: string;
}

/** Data dell'ultimo controllo dei link, mostrata in pagina. */
export const LINK_CONTROLLATI = "7 novembre 2026";

export const AVVISO_LINK =
  "Link esterno: la presenza non implica partnership, approvazione o sponsorizzazione.";

export const RISPOSTA_BREVE =
  "Gioca con Mizi raccoglie risorse esterne utili per imparare, giocare e trovare idee educative per bambini. Puoi esplorare siti per famiglie, insegnanti, scuole e attività divisi per tema e modalità di utilizzo.";

export const DISCLAIMER =
  "Le informazioni arrivano dai siti ufficiali delle realtà elencate: prima di usare un servizio verifica modalità, costi, privacy e disponibilità direttamente alla fonte. Una scheda non implica collaborazione o approvazione reciproca, salvo indicazione esplicita.";

/** Le FAQ visibili in pagina: lo stesso testo va nel JSON-LD FAQPage. */
export const FAQ_RISORSE = [
  {
    domanda: "Le risorse elencate sono partner di Gioca con Mizi?",
    risposta:
      "No, salvo indicazione esplicita. Le realtà sono elencate perché utili a bambini, famiglie e insegnanti: la presenza non implica partnership, approvazione o sponsorizzazione.",
  },
  {
    domanda: "Sono tutte gratuite?",
    risposta:
      "No. Alcune offrono materiali gratuiti, altre servizi a pagamento: verifica condizioni, costi e privacy direttamente sul sito ufficiale di ciascuna.",
  },
  {
    domanda: "Come vengono selezionate le risorse?",
    risposta:
      "Partiamo da informazioni pubbliche presenti sui siti ufficiali e da una verifica editoriale: pertinenza per bambini da 3 a 12 anni, descrizione concreta e sito raggiungibile. I link vengono ricontrollati periodicamente.",
  },
  {
    domanda: "Posso segnalare una risorsa o chiedere una correzione?",
    risposta:
      "Sì: scrivi al contatto ufficiale di Gioca con Mizi indicato in fondo alla pagina. Valutiamo ogni segnalazione e correggiamo o togliamo una scheda su richiesta della realtà interessata.",
  },
] as const;

/** Schede per pagina nella vista filtrata (paginazione lato server). */
export const PER_PAGINA = 12;

export function eSezione(valore: unknown): valore is Sezione {
  return typeof valore === "string" && valore in SEZIONI;
}

/** Vista completa: ogni risorsa una volta sola, nella sua sezione principale. */
export function principaliDi(sezione: Sezione): Risorsa[] {
  return RISORSE.filter((r) => r.sezioni[0] === sezione);
}

/** Vista filtrata: tutte le risorse che toccano la sezione. */
export function tutteDi(sezione: Sezione): Risorsa[] {
  return RISORSE.filter((r) => r.sezioni.includes(sezione));
}

export function contaRisorse(): number {
  return RISORSE.length;
}

/** Una pagina di risultati; `null` se la pagina chiesta non esiste. */
export function paginaDi(sezione: Sezione, pagina: number) {
  const tutte = tutteDi(sezione);
  const pagine = Math.max(1, Math.ceil(tutte.length / PER_PAGINA));
  if (!Number.isInteger(pagina) || pagina < 1 || pagina > pagine) return null;
  return {
    voci: tutte.slice((pagina - 1) * PER_PAGINA, pagina * PER_PAGINA),
    pagina,
    pagine,
    totale: tutte.length,
  };
}

/** Il dominio leggibile del sito ufficiale, per il testo del link. */
export function dominio(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

/** Le iniziali della card (al posto del logo: niente marchi presi dai siti). */
export function iniziali(nome: string): string {
  const parole = nome
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^\p{Lu}/u.test(p));
  return (parole[0]?.[0] ?? nome[0] ?? "?").toUpperCase() + (parole[1]?.[0] ?? "").toUpperCase();
}
