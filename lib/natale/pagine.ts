import { FRASI, testoLetterina, type Fascia } from "@/lib/natale/letterina";

/**
 * Le pagine di «Il Natale di Mizi» (/natale): testi, FAQ e collegamenti in un
 * posto solo, così pagine, sitemap e llms.txt dicono la stessa cosa.
 * Parole chiave dal brief di Giorgia (Ubersuggest Italia, 13/11/2026):
 * «lettera a babbo natale da stampare», «letterina babbo natale», «da
 * colorare», «come scrivere la letterina», «esempio».
 */

export const PAGINE_NATALE = [
  {
    percorso: "/natale",
    titolo: "Il Natale di Mizi",
    descrizione: "Letterina a Babbo Natale da stampare, biglietti di auguri e idee per il Natale dei bambini, gratis.",
  },
  {
    percorso: "/natale/lettera-a-babbo-natale",
    titolo: "Lettera a Babbo Natale da stampare",
    descrizione:
      "Scrivi la letterina con frasi pronte per età (3-5, 6-8, 9-12 anni), scegli la carta e scaricala in PDF, anche a righe o da colorare.",
  },
  {
    percorso: "/natale/come-scrivere-la-letterina",
    titolo: "Come scrivere la letterina a Babbo Natale",
    descrizione: "Esempi di letterina per età e consigli per aiutare i bambini a scriverla, dai 3 ai 12 anni.",
  },
] as const;

export const RISPOSTA_LETTERINA =
  "Per scrivere la lettera a Babbo Natale da stampare: scegli l'età, scrivi il nome (o lascialo vuoto e completalo a penna), tocca le frasi pronte e aggiungi fino a cinque desideri. Poi scarichi il PDF A4 o la stampi subito. C'è anche il foglio a righe da scrivere a mano e la versione da colorare. È gratis e il nome del bambino non lascia il tuo telefono.";

export const FAQ_LETTERINA = [
  {
    domanda: "Come si scrive la lettera a Babbo Natale con Mizi?",
    risposta:
      "Scegli la fascia d'età, scrivi nome ed età, tocca le frasi che vuoi e aggiungi i desideri. Il foglio si aggiorna mentre scrivi: quando ti piace, scarichi il PDF A4, l'immagine o la stampi direttamente.",
  },
  {
    domanda: "C'è una letterina da stampare e colorare?",
    risposta:
      "Sì: scegli «Da colorare» e il foglio esce in bianco e nero, con la cornice di Natale e Mizi a soli contorni. Va bene sia con il testo già scritto sia nella versione a righe.",
  },
  {
    domanda: "Mio figlio vuole scriverla da solo: c'è un foglio a righe?",
    risposta:
      "Sì: scegli «A righe, da scrivere a mano». Il foglio ha già «Caro Babbo Natale» in alto, l'inizio «Mi chiamo… e ho… anni», le righe per il testo e cinque righe con la stellina per i desideri.",
  },
  {
    domanda: "Il nome e i desideri del bambino finiscono su internet?",
    risposta:
      "No. La letterina si compone nel tuo browser: nome, età e desideri non arrivano ai nostri server e non vengono salvati. Chiusa la pagina, spariscono.",
  },
  {
    domanda: "Quanto costa?",
    risposta: "Niente: è gratis, senza registrazione, senza pubblicità e senza filigrana.",
  },
];

export const RISPOSTA_COME_SCRIVERE =
  "La letterina a Babbo Natale si scrive in quattro parti: il saluto («Caro Babbo Natale»), due righe su chi sei e com'è andato l'anno, i desideri (pochi, tre o quattro bastano) e un saluto finale con la firma. Fino a 5 anni la detta il bambino e la scrive il grande; dai 6 anni il bambino può copiarla o scriverla da sé; dai 9 anni diventa una lettera vera, con un pensiero per gli altri.";

export const PARTI_LETTERINA = [
  { titolo: "Il saluto", testo: "«Caro Babbo Natale,» in alto, grande. È la parte che i bambini più piccoli possono anche ricalcare." },
  { titolo: "Chi scrive e com'è andato l'anno", testo: "Il nome, l'età e una o due cose belle dell'anno: una cosa imparata, un aiuto dato, un amico nuovo. Senza voti e senza «sono stato buono»: basta raccontare." },
  { titolo: "I desideri", testo: "Meglio pochi e scelti: tre o quattro. Scriverli in elenco aiuta il bambino a decidere quali sono davvero importanti." },
  { titolo: "Un pensiero per gli altri e il saluto", testo: "Un desiderio per qualcun altro, una domanda curiosa a Babbo Natale, poi il saluto e la firma." },
];

export const CONSIGLI_PER_ETA: { fascia: Fascia; titolo: string; consigli: string[] }[] = [
  {
    fascia: "3-5",
    titolo: "3-5 anni: la detta, la decora",
    consigli: [
      "Il bambino detta e il grande scrive, parola per parola: va bene anche se i desideri cambiano tre volte.",
      "Il nome lo può scrivere lui, anche ricalcandolo: è la parte di cui andrà più fiero.",
      "Lasciate spazio per un disegno o per i colori: la versione da colorare serve a questo.",
    ],
  },
  {
    fascia: "6-8",
    titolo: "6-8 anni: frasi corte, scritte da sé",
    consigli: [
      "Prima si sceglie cosa dire, poi si scrive: le frasi pronte aiutano a non bloccarsi davanti al foglio bianco.",
      "Il foglio a righe è un buon esercizio di scrittura: due frasi sull'anno e l'elenco dei desideri bastano.",
      "Niente correzioni con la penna rossa: una letterina con qualche errore è più vera.",
    ],
  },
  {
    fascia: "9-12",
    titolo: "9-12 anni: una lettera vera",
    consigli: [
      "A questa età molti sanno già «la verità» ma scrivono volentieri lo stesso: si può giocare con l'ironia.",
      "È il momento giusto per il pensiero per gli altri: un desiderio per la famiglia o per chi ne ha bisogno.",
      "La lettera può restare un ricordo: scritta a mano, da rileggere tra qualche anno.",
    ],
  },
];

/** Un esempio completo per fascia, composto con le stesse frasi dell'editor. */
export function esempioLetterina(fascia: Fascia) {
  const desideri: Record<Fascia, string[]> = {
    "3-5": ["un peluche a forma di pinguino", "i colori a dita"],
    "6-8": ["un gioco da tavolo per giocare tutti insieme", "un libro di avventure", "una torcia per leggere sotto le coperte"],
    "9-12": ["il nuovo libro della mia saga preferita", "un kit per esperimenti scientifici", "una giornata in montagna tutti insieme"],
  };
  const nome: Record<Fascia, [string, string]> = { "3-5": ["Leo", "4"], "6-8": ["Sara", "7"], "9-12": ["Tommaso", "10"] };
  const tutte = (g: keyof (typeof FRASI)[Fascia], quante = 1) =>
    Array.from({ length: Math.min(quante, FRASI[fascia][g].length) }, (_, i) => i);
  return testoLetterina({
    fascia,
    nome: nome[fascia][0],
    eta: nome[fascia][1],
    frasi: { presentazione: [0], anno: tutte("anno", 2), domanda: [0], pensiero: [0], chiusura: [0] },
    testoLibero: "",
    desideri: desideri[fascia],
  });
}

export const FAQ_COME_SCRIVERE = [
  {
    domanda: "Quando si scrive la letterina a Babbo Natale?",
    risposta:
      "Di solito tra fine novembre e i primi giorni di dicembre: c'è il tempo per pensarci, cambiare idea e, per chi la porta all'albero o la spedisce, farla arrivare prima delle feste.",
  },
  {
    domanda: "Cosa scrivere nella letterina oltre ai desideri?",
    risposta:
      "Chi sei e quanti anni hai, una o due cose belle dell'anno, una domanda curiosa a Babbo Natale e un pensiero per qualcun altro. Poi il saluto e la firma.",
  },
  {
    domanda: "Quanti desideri mettere?",
    risposta:
      "Tre o quattro bastano. Un elenco corto aiuta il bambino a scegliere quello che vuole davvero e lascia spazio alle sorprese.",
  },
  {
    domanda: "Un bambino di 4 anni può scrivere la letterina?",
    risposta:
      "Sì, con un grande che scrive sotto dettatura. Il bambino può firmarla, anche solo con l'iniziale, e colorarla: nella versione da colorare c'è tutto lo spazio.",
  },
];

export const FAQ_HUB_NATALE = [
  {
    domanda: "Cosa trovo nel Natale di Mizi?",
    risposta:
      "La letterina a Babbo Natale da scrivere e stampare (anche a righe e da colorare), una guida con gli esempi per età e i biglietti di auguri di Natale da personalizzare. Tutto gratis, senza registrazione e senza pubblicità.",
  },
  {
    domanda: "Serve registrarsi o lasciare l'email?",
    risposta: "No: si crea, si scarica e si stampa senza account. Nome e desideri dei bambini restano sul tuo dispositivo.",
  },
  {
    domanda: "Ci sono i personaggi dei cartoni di Natale?",
    risposta:
      "No: sono protetti da copyright. Le cornici, gli adesivi e Mizi la pinguina sono disegni nostri, che si possono stampare e regalare in tutta tranquillità.",
  },
];
