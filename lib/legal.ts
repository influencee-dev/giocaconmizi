/**
 * Registro privacy e cookie — fonte di verità delle due pagine legali.
 *
 * REGOLA DI MANUTENZIONE (per Giorgia e per Claude): ogni volta che il sito
 * aggiunge un tracciamento, un cookie, una voce di localStorage o un servizio
 * esterno che riceve dati, si aggiunge UNA VOCE qui sotto e si aggiorna
 * `AGGIORNATA`. Le pagine /privacy e /cookie leggono da qui: niente voce nel
 * registro = niente nel sito. Se il nuovo strumento NON è tecnico-necessario
 * (es. analytics con profilazione, pixel pubblicitari) serve anche il banner
 * di consenso preventivo: al momento non c'è perché non serve.
 */

/** Dati societari del gestore (D.Lgs. 70/2003 art. 7, art. 2250 c.c.). */
export const SOCIETA = {
  ragioneSociale: "Partidea SRL",
  sede: "Via Antonio Beltramelli 13, 47923 Rimini (RN)",
  piva: "04405500408",
  rea: "RN-411743",
  capitale: "€ 1.000",
} as const;

export const TITOLARE = {
  nome: "Partidea SRL",
  ruolo: `con sede in ${SOCIETA.sede}, P.IVA ${SOCIETA.piva}. Giocamizi è un'idea di Giorgia Palazzo, founder di Partidea e Influencee e mamma di Domiziana, da cui viene il nome di Mizi`,
  // NOTA: casella da attivare sul dominio giocamizi.it (comprato il 24/10/2026).
  email: "ciao@giocamizi.it",
} as const;

/** Data dell'ultima revisione delle informative (si aggiorna a ogni modifica). */
export const AGGIORNATA = "31 ottobre 2026";

export interface VoceRegistro {
  nome: string;
  tipo: "cookie" | "localStorage";
  scopo: string;
  durata: string;
  /** true = tecnico/necessario: non richiede consenso preventivo (ePrivacy). */
  necessario: boolean;
  /** Chi lo imposta: "noi" o il nome del fornitore. */
  chi: string;
  /** Quando compare davvero nel browser. */
  quando: string;
}

/** Tutto ciò che il sito scrive nel browser. Oggi: nessun tracciamento di terzi. */
export const REGISTRO: VoceRegistro[] = [
  {
    nome: "mizi.partite",
    tipo: "localStorage",
    scopo:
      "Conta quanti giochi sono stati completati su questo dispositivo, per proporre l'iscrizione alle novità solo dopo il secondo gioco e mai prima.",
    durata: "Finché non cancelli i dati del browser",
    necessario: true,
    chi: "noi",
    quando: "Alla fine del primo gioco completato",
  },
  {
    nome: "mizi.form-proposto",
    tipo: "localStorage",
    scopo:
      "Ricorda che l'invito a iscriversi alle novità è già comparso, così non te lo riproponiamo a ogni partita.",
    durata: "Finché non cancelli i dati del browser",
    necessario: true,
    chi: "noi",
    quando: "Quando l'invito compare la prima volta",
  },
  {
    nome: "mizi.consenso-statistiche",
    tipo: "localStorage",
    scopo:
      "Ricorda la scelta che hai fatto nel banner (accetta o rifiuta le statistiche), così non te lo richiediamo a ogni visita. Puoi cambiarla da questa pagina.",
    durata: "Finché non cancelli i dati del browser o cambi scelta",
    necessario: true,
    chi: "noi",
    quando: "Quando scegli nel banner del primo ingresso",
  },
  {
    nome: "sb-wrkderhcbzlppkveknyd-auth-token",
    tipo: "cookie",
    scopo:
      "Ti tiene collegata all'area genitori dopo l'accesso con il link via email. Esiste solo se scegli di creare un account.",
    durata: "Fino a un anno, o finché non esci",
    necessario: true,
    chi: "Supabase (server nell'Unione Europea, Francoforte)",
    quando: "Solo dopo l'accesso all'area genitori",
  },
  {
    nome: "Cookie di Instagram (Meta)",
    tipo: "cookie",
    scopo:
      "Solo nelle pagine con un reel e solo se tocchi «Guarda il reel»: il player ufficiale di Instagram si carica dentro la pagina e Meta può impostare i suoi cookie, secondo la sua informativa. Senza il tuo tocco non viene caricato nulla.",
    durata: "Decisa da Meta",
    necessario: false,
    chi: "Meta Platforms Ireland Ltd. (Instagram), titolare autonomo",
    quando: "Solo dopo il tocco su «Guarda il reel»",
  },
  {
    nome: "_ga",
    tipo: "cookie",
    scopo:
      "Statistiche: Google Analytics distingue i visitatori (senza nome) per contare visite e capire quali giochi piacciono. Configurato senza Google Signals e senza personalizzazione degli annunci.",
    durata: "13 mesi",
    necessario: false,
    chi: "Google Analytics",
    quando: "Solo se accetti dal banner",
  },
  {
    nome: "_ga_SMEEJZQBVJ",
    tipo: "cookie",
    scopo: "Statistiche: mantiene lo stato della sessione di Google Analytics.",
    durata: "13 mesi",
    necessario: false,
    chi: "Google Analytics",
    quando: "Solo se accetti dal banner",
  },
];

/** Servizi esterni che trattano dati per conto del sito (art. 28 GDPR). */
export const FORNITORI = [
  {
    nome: "Vercel Inc.",
    scopo: "Hosting del sito: riceve gli accessi e tiene log tecnici (indirizzo IP) per sicurezza e funzionamento.",
    dove: "Sito servito dalla regione di Francoforte; la società è statunitense e aderisce al Data Privacy Framework UE-USA",
  },
  {
    nome: "Supabase",
    scopo: "Conserva gli account dell'area genitori (email, progressi, fascia d'età dei bambini).",
    dove: "Unione Europea (Francoforte, eu-central-1)",
  },
  {
    nome: "Brevo (Sendinblue SAS)",
    scopo: "Invia le email delle novità a chi si iscrive. Riceve solo i dati del modulo di iscrizione.",
    dove: "Unione Europea (Francia)",
  },
  {
    nome: "Google Ireland Ltd. (Google Analytics)",
    scopo:
      "Statistiche di visita, SOLO se acconsenti dal banner: pagine viste e uso dei giochi, senza Google Signals né personalizzazione degli annunci.",
    dove: "Irlanda; possibili trasferimenti verso Google LLC (USA) coperti dal Data Privacy Framework UE-USA",
  },
] as const;

/**
 * Titolari autonomi: servizi che ricevono dati solo per un tuo gesto
 * esplicito e li trattano secondo le proprie informative.
 */
export const TITOLARI_AUTONOMI = [
  {
    nome: "Meta Platforms Ireland Ltd. (Instagram)",
    quando: "se tocchi «Guarda il reel» in una pagina città",
    informativa: "https://privacycenter.instagram.com/policy",
  },
] as const;
