/**
 * I video tutorial di Mizi (15/11/2026): una pagina per video su /tutorial/<slug>,
 * divisi in due gruppi come su Drive (2 Aree → Giocamizi · Video):
 *   - partner: attività, scuole, cooperative, associazioni;
 *   - utenti: mamme, papà, insegnanti e bambini.
 *
 * COME SI AGGIUNGE UN TUTORIAL: si scrive la scheda content/video/<slug>.json
 * (scene, frasi di Mizi, testi della pagina) e si lancia `npm run video -- <slug>`:
 * video, pagina, hub, sitemap e llms.txt si aggiornano da soli.
 * I video sono file nostri, serviti dal sito: niente player di terzi né cookie.
 * Quelli ancora da fare stanno in IN_ARRIVO (solo testo nell'hub, niente pagine vuote).
 */

import dati from "./tutorial-dati.json";

export type GruppoTutorial = "partner" | "utenti";

export const GRUPPI: Record<GruppoTutorial, { titolo: string; descrizione: string }> = {
  partner: {
    titolo: "Per attività, scuole e associazioni",
    descrizione: "Come reclamare e gestire la scheda della tua realtà, e far conoscere quello che fai alle famiglie.",
  },
  utenti: {
    titolo: "Per famiglie e insegnanti",
    descrizione: "Come usare Giocamizi: i giochi, gli inviti, le feste, le storie e le risorse educative.",
  },
};

export interface Capitolo {
  /** Secondi dall'inizio del video. */
  da: number;
  titolo: string;
}

export interface Tutorial {
  slug: string;
  gruppo: GruppoTutorial;
  titolo: string;
  /** Una riga per la card e per i meta. */
  descrizione: string;
  /** La risposta citabile («In breve»). */
  rispostaBreve: string;
  video: {
    src: string;
    poster: string;
    sottotitoli: string;
    /** ISO 8601, come vuole schema.org. */
    durata: string;
    secondi: number;
    caricato: string;
    /** Il testo parlato da Mizi, scena per scena: è la trascrizione. */
    testo: string[];
  };
  /** I passi del video: bottoni che saltano al punto giusto e «momenti chiave» per Google. */
  capitoli: Capitolo[];
  /** La pagina del sito di cui il video parla. */
  pagina: { href: string; testo: string };
  faq: { domanda: string; risposta: string }[];
}

export const PERCORSO_TUTORIAL = "/tutorial";

/**
 * L'elenco dei tutorial pubblicati è GENERATO da scripts/video/registra.py
 * (alla fine di `npm run video -- <slug>`): prende le schede content/video/<slug>.json
 * che hanno il file in public/video/ e i tempi delle scene. Non si scrive a mano.
 */
export const TUTORIAL: Tutorial[] = (dati as (Tutorial & { ordine?: number })[]).map((t) => ({ ...t }));

/** I tutorial in preparazione (01 Catalogo dei video su Drive): solo testo nell'hub. */
export const IN_ARRIVO: Record<GruppoTutorial, string[]> = {
  partner: ["Come inserire un evento, anche ricorrente", "Come leggere le statistiche della tua scheda"],
  utenti: ["Ciao, sono Mizi: cos'è Giocamizi in un minuto", "Come si gioca: un video per ogni gioco", "Gli eventi per bambini nella tua città"],
};

export const tutorialDaSlug = (slug: string) => TUTORIAL.find((t) => t.slug === slug);
export const percorsoTutorial = (t: Pick<Tutorial, "slug">) => `${PERCORSO_TUTORIAL}/${t.slug}`;
export const tutorialDi = (g: GruppoTutorial) => TUTORIAL.filter((t) => t.gruppo === g);

/** «1:05» */
export const minuti = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
