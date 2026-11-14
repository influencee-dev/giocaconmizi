/**
 * Il Natale di Mizi (/natale): letterina a Babbo Natale, biglietti di Natale,
 * eventi di Natale per città e favole. Brief di Giorgia del 13/11/2026 su
 * Drive («0 Richieste di Giorgia»).
 *
 * La letterina si compila e si genera tutta nel browser: nome, età e
 * desideri del bambino non arrivano mai al server e non si salvano.
 */

export const PERCORSO_NATALE = "/natale";
export const PERCORSO_LETTERINA = "/natale/letterina-babbo-natale";
export const PERCORSO_BIGLIETTI_NATALE = "/natale/biglietti-di-natale";
export const PERCORSO_EVENTI = "/natale/eventi";

/** Le fasce d'età della letterina: le frasi cambiano con l'età. */
export const FASCE = [
  { id: "piccoli", etichetta: "3-5 anni", eta: [3, 5] },
  { id: "medi", etichetta: "6-8 anni", eta: [6, 8] },
  { id: "grandi", etichetta: "9-12 anni", eta: [9, 12] },
] as const;
export type Fascia = (typeof FASCE)[number]["id"];

/** Le carte da lettera: i temi dei biglietti che stanno bene a Natale. */
export const CARTE = [
  { tema: "natale", etichetta: "Albero e renne" },
  { tema: "stelle-luna", etichetta: "Stelle e luna" },
  { tema: "animali-foresta", etichetta: "Bosco d'inverno" },
] as const;

/** Le frasi d'apertura, una si sceglie e si può cambiare a mano. */
export const APERTURE: Record<Fascia, string[]> = {
  piccoli: [
    "Ciao Babbo Natale, sono {nome} e ho {eta} anni.",
    "Caro Babbo Natale, ti scrivo con la mamma e il papà.",
    "Ciao Babbo Natale! Come stanno le renne?",
  ],
  medi: [
    "Caro Babbo Natale, sono {nome} e quest'anno ho {eta} anni.",
    "Caro Babbo Natale, spero che al Polo Nord non faccia troppo freddo.",
    "Caro Babbo Natale, ti scrivo presto così hai tempo di organizzarti.",
  ],
  grandi: [
    "Caro Babbo Natale, sono {nome}, ho {eta} anni e ti scrivo ancora volentieri.",
    "Caro Babbo Natale, quest'anno ti faccio una lettera breve ma sincera.",
    "Caro Babbo Natale, ho pensato bene a cosa chiederti.",
  ],
};

/** «Quest'anno…»: il racconto dell'anno, in una frase. */
export const QUEST_ANNO: Record<Fascia, string[]> = {
  piccoli: [
    "Quest'anno ho imparato a vestirmi senza aiuto e a contare fino a dieci.",
    "Quest'anno ho fatto del mio meglio. Quasi sempre.",
    "Quest'anno ho mangiato anche le verdure (qualche volta).",
  ],
  medi: [
    "Quest'anno ho imparato a leggere meglio e ho aiutato a casa.",
    "Quest'anno ho messo impegno a scuola e ho fatto amicizia con tanti compagni.",
    "Quest'anno ho fatto qualche capriccio, ma ho chiesto scusa.",
  ],
  grandi: [
    "Quest'anno ho messo impegno a scuola e ho provato a essere più paziente con tutti.",
    "Quest'anno è stato pieno di cose nuove: alcune facili, altre meno.",
    "Quest'anno ho imparato una cosa importante: chiedere aiuto non è da piccoli.",
  ],
};

/** Un pensiero per gli altri: facoltativo. */
export const PENSIERI = [
  "Porta un regalo anche ai bambini che ne hanno più bisogno.",
  "Fai un salto anche dai nonni, ci tengono tanto.",
  "Lascia un pensiero anche per la mia maestra.",
  "Ricordati delle renne: lasceremo una carota sul davanzale.",
];

/** Le chiusure. */
export const CHIUSURE: Record<Fascia, string[]> = {
  piccoli: ["Ti voglio bene!", "Un abbraccio grande grande!", "Ciao ciao, a presto!"],
  medi: ["Ti aspetto la notte di Natale!", "Grazie per tutto quello che fai!", "Un abbraccio dal mio letto, dove dormirò prestissimo."],
  grandi: ["Grazie in anticipo, comunque vada.", "Buon lavoro e buon viaggio!", "Con affetto, e un biscotto che ti aspetta."],
};

export const MAX_DESIDERI = 5;
export const MAX_CARATTERI_DESIDERIO = 40;
export const MAX_CARATTERI_FRASE = 140;

/** Idee di desideri da toccare: anche non materiali, per non fare solo la lista dei giocattoli. */
export const IDEE_DESIDERI: Record<Fascia, string[]> = {
  piccoli: ["un libro con gli animali", "i colori a dita", "un pupazzo morbido", "una giornata al parco con papà", "la neve"],
  medi: ["un gioco da tavolo", "un libro di avventure", "i pattini", "un pomeriggio con i miei amici", "un kit per fare esperimenti"],
  grandi: ["un romanzo nuovo", "un set da disegno", "un gioco di costruzioni", "una gita in montagna", "più tempo insieme in famiglia"],
};

/** Sostituisce {nome} e {eta} senza lasciare segnaposto vuoti. */
export function riempi(frase: string, nome: string, eta: string): string {
  const n = nome.trim();
  const e = eta.trim();
  let fuori = frase;
  fuori = n ? fuori.replace(/\{nome\}/g, n) : fuori.replace(/,? ?sono \{nome\}/g, "").replace(/\{nome\}/g, "");
  fuori = e ? fuori.replace(/\{eta\}/g, e) : fuori.replace(/,? ?(e )?(quest'anno )?ho \{eta\} anni/g, "").replace(/\{eta\}/g, "");
  return fuori.replace(/\s+([,.!])/g, "$1").replace(/\s{2,}/g, " ").trim();
}

/** La risposta di Babbo Natale: un modello da stampare, il nome lo scrive il genitore a mano. */
export const RISPOSTA_BABBO_NATALE = [
  "ho ricevuto la tua letterina e l'ho letta tutta, con gli occhiali e una tazza di cioccolata calda.",
  "Gli elfi mi hanno detto che quest'anno hai messo tanto impegno: lo vedo dalla tua lettera e dal modo in cui hai scritto i desideri.",
  "Non posso promettere tutto, perché la slitta ha un limite di peso e le renne protestano. Ma farò del mio meglio.",
  "Intanto ti chiedo una cosa: continua a giocare, a fare domande e ad aiutare chi ti sta vicino. È il regalo più bello che puoi fare a me.",
];

/** Dal giorno in cui la risposta si può scaricare (la si annuncia nella posta di Mizi). */
export const DATA_RISPOSTA = "2026-12-20";

export const RISPOSTA_BREVE_LETTERINA =
  "La letterina a Babbo Natale si scrive meglio in tre parti: una presentazione («sono…, ho … anni»), un racconto dell'anno e la lista dei desideri, al massimo tre-cinque. Si scrive tra fine novembre e l'8 dicembre e si lascia sotto l'albero o si spedisce. Con lo strumento di Giocamizi si compila dal telefono, si stampa in A4 o si scarica da colorare, gratis e senza registrazione.";

export const FAQ_LETTERINA = [
  {
    domanda: "Come si scrive una letterina a Babbo Natale?",
    risposta:
      "In tre parti: chi sei (nome ed età), com'è andato l'anno e i desideri. I più piccoli la dettano a un adulto e poi la colorano; dai 6-7 anni la possono scrivere da soli copiando le frasi. Meglio pochi desideri, scritti bene, che una lista lunga.",
  },
  {
    domanda: "Quando si scrive la letterina a Babbo Natale?",
    risposta:
      "Di solito tra fine novembre e l'8 dicembre, quando si fa l'albero: così c'è tempo per leggerla con calma. Molte famiglie la lasciano sotto l'albero o sul davanzale la sera della Vigilia.",
  },
  {
    domanda: "Dove si spedisce la letterina a Babbo Natale?",
    risposta:
      "Si può lasciare sotto l'albero o sul davanzale la sera della Vigilia, consegnare nelle cassette per le letterine dei villaggi di Babbo Natale della propria città, oppure spedire con un francobollo per l'estero all'ufficio postale di Babbo Natale a Rovaniemi, in Finlandia (Santa Claus Main Post Office, 96930 Napapiiri).",
  },
  {
    domanda: "La letterina di Giocamizi è gratis? I dati dove vanno?",
    risposta:
      "È gratis e non serve registrarsi. Nome, età e desideri restano sul tuo telefono o computer: la letterina viene disegnata nel browser e non arriva mai ai nostri server.",
  },
  {
    domanda: "C'è anche la risposta di Babbo Natale?",
    risposta:
      "Sì: dal 20 dicembre in questa pagina si scarica la risposta di Babbo Natale da stampare, con lo spazio per il nome scritto a mano. Chi è iscritto alla posta di Mizi riceve il promemoria.",
  },
];

export const RISPOSTA_BREVE_NATALE =
  "Il Natale di Giocamizi è gratis e senza pubblicità: la letterina a Babbo Natale da compilare e stampare, i biglietti di auguri da personalizzare o colorare, gli eventi di Natale per bambini città per città e le favole di Mizi da leggere e colorare.";
