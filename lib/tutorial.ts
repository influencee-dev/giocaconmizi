/**
 * I video tutorial di Mizi (15/11/2026): una pagina per video su /tutorial/<slug>,
 * divisi in due gruppi come su Drive (2 Aree → Giocamizi · Video):
 *   - partner: attività, scuole, cooperative, associazioni;
 *   - utenti: mamme, papà, insegnanti e bambini.
 *
 * COME SI AGGIUNGE UN TUTORIAL: si fa il video (docs/video-tutorial.md), si
 * mettono mp4, poster e sottotitoli in public/video/ e si aggiunge una voce a
 * TUTORIAL. La pagina, l'hub, la sitemap e llms.txt si aggiornano da soli.
 * I video sono file nostri, serviti dal sito: niente player di terzi né cookie.
 * Quelli ancora da fare stanno in IN_ARRIVO (solo testo nell'hub, niente pagine vuote).
 */

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

export const TUTORIAL: Tutorial[] = [
  {
    slug: "come-reclamare-la-scheda",
    gruppo: "partner",
    titolo: "Come reclamare la scheda della tua attività",
    descrizione: "Mizi ti mostra, passo per passo, come trovare la tua scheda su Giocamizi, reclamarla e completarla. Gratis.",
    rispostaBreve:
      "Per reclamare la scheda della tua attività su Giocamizi: apri la scheda, tocca «Reclama la scheda», compila il modulo con nome ed email. Dopo un controllo a mano ricevi un link personale per approvarla, completarla con contatti, orari e logo, o toglierla. È gratis, senza commissioni.",
    video: {
      src: "/video/come-reclamare-la-scheda.mp4",
      poster: "/video/come-reclamare-la-scheda.webp",
      sottotitoli: "/video/come-reclamare-la-scheda.vtt",
      durata: "PT1M39S",
      secondi: 99,
      caricato: "2026-11-15",
      testo: [
        "Ciao, sono Mizi! Hai un'attività per bambini, una scuola o un progetto educativo? Forse su Giocamizi la tua scheda c'è già. Ti faccio vedere come reclamarla: è gratis, e ci vogliono pochi minuti!",
        "Per prima cosa, cerca la tua attività. Le feste sono divise per città, e le risorse educative per categoria e provincia.",
        "Apri la tua scheda e scorri fino in fondo: lì c'è il bottone «Reclama la scheda».",
        "Si apre un modulo, con la tua scheda già scelta. Scrivi il tuo nome, l'email e, se vuoi, un telefono. Non preoccuparti: restano privati e non finiscono sul sito.",
        "Poi il team di Giocamizi controlla a mano che sia proprio la tua realtà. Niente va online da solo!",
        "A quel punto ti arriva un'email con il tuo link personale. Niente password da ricordare!",
        "Dal link vedi la scheda proprio come la vedono le famiglie. Puoi approvarla, completarla con descrizione, contatti, orari e logo, oppure chiedere di toglierla.",
        "Quando le modifiche sono approvate, la tua scheda prende il bollino «Verificata». Ed è gratis, davvero: nessuna commissione e nessuna pubblicità.",
        "Trovi tutti i passaggi su giocamizi.it, nella pagina «Come reclamare la scheda». Ti aspetto! Ciao ciao!",
      ],
    },
    // Gli inizi delle scene del video (dai tempi della voce, scripts/video).
    capitoli: [
      { da: 0, titolo: "Ciao, sono Mizi" },
      { da: 18, titolo: "1 · Cerca la tua attività" },
      { da: 28, titolo: "2 · Tocca «Reclama la scheda»" },
      { da: 36, titolo: "3 · Compila il modulo" },
      { da: 50, titolo: "4 · Il controllo a mano" },
      { da: 58, titolo: "5 · Il link personale" },
      { da: 66, titolo: "6 · Approva, completa o togli" },
      { da: 78, titolo: "7 · La scheda verificata" },
    ],
    pagina: { href: "/come-reclamare-la-scheda", testo: "Tutti i passi scritti e le domande frequenti" },
    faq: [
      { domanda: "Reclamare la scheda costa qualcosa?", risposta: "No. La scheda è gratuita e lo resta: nessuna commissione sulle prenotazioni e nessuna pubblicità." },
      { domanda: "Quanto tempo ci vuole?", risposta: "Il modulo si compila in due minuti. Il controllo lo facciamo a mano e ti scriviamo appena è fatto; dopo, le modifiche accettate vanno online in pochi minuti." },
      { domanda: "Email e telefono finiscono sul sito?", risposta: "No: quelli che scrivi nel modulo restano nel nostro archivio privato. Sul sito compaiono solo i contatti che decidi tu di mostrare dal link personale." },
    ],
  },
];

/** I tutorial in preparazione (01 Catalogo dei video su Drive): solo testo nell'hub. */
export const IN_ARRIVO: Record<GruppoTutorial, string[]> = {
  partner: [
    "Come completare la scheda dal link personale",
    "Come aggiungere un'attività che non c'è ancora",
    "Giocamizi in classe con la LIM, senza account",
  ],
  utenti: [
    "Ciao, sono Mizi: cos'è Giocamizi in un minuto",
    "Come mettere Giocamizi sul telefono, come un'app",
    "Come creare l'invito di compleanno con la conferma su WhatsApp",
    "La letterina a Babbo Natale, passo passo",
    "Come si gioca: un video per ogni gioco",
  ],
};

export const tutorialDaSlug = (slug: string) => TUTORIAL.find((t) => t.slug === slug);
export const percorsoTutorial = (t: Pick<Tutorial, "slug">) => `${PERCORSO_TUTORIAL}/${t.slug}`;
export const tutorialDi = (g: GruppoTutorial) => TUTORIAL.filter((t) => t.gruppo === g);

/** «1:05» */
export const minuti = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
