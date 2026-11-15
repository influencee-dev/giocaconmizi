/** La pagina che spiega come si reclama una scheda (attività delle feste e risorse educative). */
export const PERCORSO_COME_RECLAMARE = "/come-reclamare-la-scheda";

/**
 * Il video tutorial della pagina (15/11/2026): scene animate con le schermate
 * vere del sito, voce italiana (shimmer, tono empatico) generata con l'API di OpenAI, musica originale
 * scritta col codice (nessun diritto di terzi), sottotitoli WebVTT. Si
 * rifà con gli script in docs/video-tutorial.md quando cambiano le pagine.
 */
export const VIDEO_RECLAMO = {
  src: "/video/come-reclamare-la-scheda.mp4",
  poster: "/video/come-reclamare-la-scheda.webp",
  sottotitoli: "/video/come-reclamare-la-scheda.vtt",
  durata: "PT1M38S",
  caricato: "2026-11-15",
  /** Il testo parlato, scena per scena: è anche la trascrizione in pagina. */
  testo: [
    "Hai un'attività per bambini, una scuola o un progetto educativo? Su Giocamizi la tua scheda forse c'è già. Ti mostro come reclamarla: è gratis, e ci vogliono pochi minuti.",
    "Per prima cosa, cerca la tua attività. Le feste sono divise per città, le risorse educative per categoria e provincia.",
    "Apri la tua scheda e scorri fino in fondo: lì trovi il bottone «Reclama la scheda».",
    "Si apre un modulo, con la tua scheda già scelta. Scrivi il tuo nome, l'email e, se vuoi, un telefono. Restano privati: non finiscono sul sito.",
    "Poi controlliamo noi, a mano, che sia davvero la tua realtà. Niente va online da solo.",
    "A quel punto ti arriva un'email con il tuo link personale. Non serve nessuna password.",
    "Dal link vedi la scheda proprio come la vedono le famiglie. Puoi approvarla, completarla con descrizione, contatti, orari e logo, oppure chiedere di toglierla.",
    "Quando approviamo le modifiche, la tua scheda prende il bollino «Verificata». Ed è gratis, davvero: nessuna commissione, nessuna pubblicità.",
    "Trovi tutti i passaggi su giocamizi.it, nella pagina «Come reclamare la scheda». Ti aspettiamo!"
  ],
};
