/**
 * La letterina a Babbo Natale con Mizi (richiesta di Giorgia del 13/11/2026,
 * «Il Natale di Mizi», pezzo 1).
 *
 * Tutto succede nel browser: nome, età e desideri del bambino non arrivano
 * mai al server e non si salvano da nessuna parte. Le frasi pronte cambiano
 * con la fascia d'età e sono scritte senza accordi di genere («ho fatto del
 * mio meglio», non «sono stato bravo/brava»), così vanno bene per tutti.
 * Mai personaggi protetti: niente renne con il nome, niente film.
 */

export const FASCE = [
  { id: "3-5", etichetta: "3-5 anni", nota: "frasi corte, le scrive il grande con il bambino" },
  { id: "6-8", etichetta: "6-8 anni", nota: "frasi semplici da scegliere insieme" },
  { id: "9-12", etichetta: "9-12 anni", nota: "frasi da ragazzi, con un po' di ironia" },
] as const;

export type Fascia = (typeof FASCE)[number]["id"];

export type GruppoFrasi = "presentazione" | "anno" | "domanda" | "pensiero" | "chiusura";

export const GRUPPI: { id: GruppoFrasi; titolo: string }[] = [
  { id: "presentazione", titolo: "Per presentarsi" },
  { id: "anno", titolo: "Com'è andato l'anno" },
  { id: "domanda", titolo: "Una domanda a Babbo Natale" },
  { id: "pensiero", titolo: "Un pensiero per gli altri" },
  { id: "chiusura", titolo: "Per salutare" },
];

/** {nome} e {eta} si riempiono con quello che scrive il bambino. */
export const FRASI: Record<Fascia, Record<GruppoFrasi, string[]>> = {
  "3-5": {
    presentazione: ["Mi chiamo {nome} e ho {eta} anni.", "Ciao, sono {nome}!"],
    anno: [
      "Quest'anno ho fatto del mio meglio.",
      "Ho imparato tante cose nuove.",
      "Ho aiutato a mettere in ordine i giochi.",
      "Ho fatto tanti disegni e uno è per te.",
    ],
    domanda: ["Fa tanto freddo dove abiti?", "Le renne mangiano le carote?"],
    pensiero: ["Ti lascio il latte e i biscotti.", "Un saluto anche alle renne!"],
    chiusura: ["Ti voglio bene.", "Un abbraccio grande grande."],
  },
  "6-8": {
    presentazione: [
      "Mi chiamo {nome}, ho {eta} anni e ti scrivo questa letterina con tanta emozione.",
      "Ciao Babbo Natale, sono {nome} e quest'anno ho {eta} anni.",
    ],
    anno: [
      "Quest'anno ho imparato a leggere e a scrivere sempre meglio.",
      "A scuola ho conosciuto nuovi amici.",
      "Ho provato a essere gentile con tutti, anche quando era difficile.",
      "A casa ho dato una mano ad apparecchiare la tavola.",
    ],
    domanda: [
      "Come fai a consegnare tutti i regali in una notte sola?",
      "Come stanno le renne? Fa tanto freddo al Polo Nord?",
    ],
    pensiero: [
      "Vorrei un regalo anche per i bambini che ne hanno più bisogno.",
      "Porta un sorriso anche alle persone a cui voglio bene.",
    ],
    chiusura: [
      "Ti lascio i biscotti sul tavolo. Grazie, Babbo Natale!",
      "Ti aspetto la notte di Natale. Un abbraccio!",
    ],
  },
  "9-12": {
    presentazione: [
      "Sono {nome} e ho {eta} anni: forse sono un po' grande per le letterine, ma non ci voglio rinunciare.",
      "Caro Babbo Natale, ti scrive {nome}, {eta} anni compiuti.",
    ],
    anno: [
      "Quest'anno è stato pieno di cose nuove: la scuola, gli amici, le passioni.",
      "Ho imparato che anche gli errori servono a qualcosa.",
      "Ho cercato di aiutare chi era in difficoltà.",
      "Ho trovato una passione nuova e ci ho messo tanto impegno.",
    ],
    domanda: [
      "Dimmi la verità: come riesci a passare da tutti i camini?",
      "Quanti elfi lavorano nel tuo laboratorio, e fanno anche le vacanze?",
    ],
    pensiero: [
      "Più dei regali, vorrei un Natale sereno per tutta la mia famiglia.",
      "Vorrei che nessun bambino passasse il Natale da solo.",
    ],
    chiusura: ["Con affetto, e un saluto agli elfi.", "Grazie per tutto. A presto!"],
  },
};

/** Esempi di desideri, solo come segnaposto nelle caselle. */
export const ESEMPI_DESIDERI: Record<Fascia, string[]> = {
  "3-5": ["un peluche morbido", "i colori a dita", "un libro con gli animali"],
  "6-8": ["una bicicletta", "un gioco da tavolo", "un libro di avventure"],
  "9-12": ["un libro di una saga", "un kit per esperimenti", "una giornata tutti insieme"],
};

export const MAX_NOME = 20;
export const MAX_DESIDERI = 5;
export const MAX_CARATTERI_DESIDERIO = 50;
export const MAX_TESTO_LIBERO = 280;

export interface SceltaLetterina {
  fascia: Fascia;
  nome: string;
  eta: string;
  /** Le frasi scelte, come indici dentro FRASI[fascia][gruppo]. */
  frasi: Partial<Record<GruppoFrasi, number[]>>;
  testoLibero: string;
  desideri: string[];
}

/** Le frasi già spuntate quando si apre la pagina o si cambia fascia. */
export function frasiIniziali(): SceltaLetterina["frasi"] {
  return { presentazione: [0], anno: [0, 1], pensiero: [0], chiusura: [0] };
}

/** Il nome pulito: corto, senza a capo né simboli che rompono il foglio. */
export const nomePulito = (nome: string) =>
  nome.replace(/[<>{}]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_NOME);

const etaPulita = (eta: string) => (/^\d{1,2}$/.test(eta.trim()) ? eta.trim() : "");

export interface TestoLetterina {
  apertura: string;
  /** I paragrafi prima dei desideri. */
  prima: string[];
  desideri: string[];
  /** I paragrafi dopo i desideri. */
  dopo: string[];
  firma: string;
}

/**
 * Il testo della letterina, nell'ordine in cui si scrive una lettera.
 * Senza nome restano le righe vuote «______», da completare a penna.
 */
export function testoLetterina(s: SceltaLetterina): TestoLetterina {
  const nome = nomePulito(s.nome) || "________";
  const eta = etaPulita(s.eta) || "___";
  const riempi = (frase: string) => frase.replaceAll("{nome}", nome).replaceAll("{eta}", eta);
  const del = (gruppo: GruppoFrasi) =>
    (s.frasi[gruppo] ?? [])
      .filter((i) => FRASI[s.fascia][gruppo][i] !== undefined)
      .sort((a, b) => a - b)
      .map((i) => riempi(FRASI[s.fascia][gruppo][i]));

  const presentazione = del("presentazione");
  const anno = del("anno");
  const libero = s.testoLibero.replace(/[<>{}]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_TESTO_LIBERO);
  const desideri = s.desideri
    .map((d) => d.replace(/[<>{}]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_CARATTERI_DESIDERIO))
    .filter(Boolean)
    .slice(0, MAX_DESIDERI);

  const prima = [
    [...presentazione, ...anno].join(" "),
    del("domanda").join(" "),
    libero,
  ].filter(Boolean);

  return {
    apertura: "Caro Babbo Natale,",
    prima,
    desideri,
    dopo: [del("pensiero").join(" "), del("chiusura").join(" ")].filter(Boolean),
    firma: nomePulito(s.nome),
  };
}

/** Il testo che accompagna l'immagine quando la si condivide. */
export const TESTO_CONDIVISIONE =
  "Ho scritto la letterina a Babbo Natale con Mizi. Puoi farla anche tu, gratis: giocamizi.it/natale/lettera-a-babbo-natale";
