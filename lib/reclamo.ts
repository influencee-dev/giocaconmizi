/** La pagina che spiega come si reclama una scheda (attività delle feste e risorse educative). */
export const PERCORSO_COME_RECLAMARE = "/come-reclamare-la-scheda";

/**
 * Il video tutorial della pagina (15/11/2026): scene animate con le schermate
 * vere del sito, la voce di Mizi (pinguina-bambina, voce «sage» di OpenAI, una sola registrazione), musica originale
 * scritta col codice (nessun diritto di terzi), sottotitoli WebVTT. Si
 * rifà con gli script in docs/video-tutorial.md quando cambiano le pagine.
 */
export const VIDEO_RECLAMO = {
  src: "/video/come-reclamare-la-scheda.mp4",
  poster: "/video/come-reclamare-la-scheda.webp",
  sottotitoli: "/video/come-reclamare-la-scheda.vtt",
  durata: "PT1M39S",
  caricato: "2026-11-15",
  /** Il testo parlato, scena per scena: è anche la trascrizione in pagina. */
  testo: [
    "Ciao, sono Mizi! Hai un'attività per bambini, una scuola o un progetto educativo? Forse su Giocamizi la tua scheda c'è già. Ti faccio vedere come reclamarla: è gratis, e ci vogliono pochi minuti!",
    "Per prima cosa, cerca la tua attività. Le feste sono divise per città, e le risorse educative per categoria e provincia.",
    "Apri la tua scheda e scorri fino in fondo: lì c'è il bottone «Reclama la scheda».",
    "Si apre un modulo, con la tua scheda già scelta. Scrivi il tuo nome, l'email e, se vuoi, un telefono. Non preoccuparti: restano privati e non finiscono sul sito.",
    "Poi il team di Giocamizi controlla a mano che sia proprio la tua realtà. Niente va online da solo!",
    "A quel punto ti arriva un'email con il tuo link personale. Niente password da ricordare!",
    "Dal link vedi la scheda proprio come la vedono le famiglie. Puoi approvarla, completarla con descrizione, contatti, orari e logo, oppure chiedere di toglierla.",
    "Quando le modifiche sono approvate, la tua scheda prende il bollino «Verificata». Ed è gratis, davvero: nessuna commissione e nessuna pubblicità.",
    "Trovi tutti i passaggi su giocamizi.it, nella pagina «Come reclamare la scheda». Ti aspetto! Ciao ciao!"
  ],
};
