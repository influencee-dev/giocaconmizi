/**
 * Le «esperienze»: ciò che una mamma cerca quando organizza una festa
 * (animazione, gonfiabili, buffet, sala tutta per sé…). Sono i filtri dei
 * listing in stile Booking e il riquadro «Cosa offre» della scheda.
 *
 * Regola di onestà: un'esperienza si accende SOLO se è scritta nel tipo o
 * nella descrizione della scheda, che vengono dalle fonti verificate o dal
 * titolare. Se non è scritta non vuol dire che manchi: la scheda la mette
 * fra le cose «da chiedere al locale». Per questo le espressioni sono
 * strette (niente «aperto» da solo, che vorrebbe dire anche «aperto la
 * domenica»). Tutto senza dipendenze: lo usano server e client.
 */

export type IdEsperienza =
  | "animazione"
  | "buffet"
  | "tema"
  | "esclusiva"
  | "pacchetti"
  | "gonfiabili"
  | "laboratori"
  | "sport"
  | "animali"
  | "piccoli"
  | "genitori"
  | "aperto"
  | "coperto";

export interface Esperienza {
  id: IdEsperienza;
  nome: string;
  icona: string;
  gruppo: "Per la festa" | "Per giocare" | "Comodità" | "Dove";
  /** La domanda da fare al locale se la scheda non ne parla. */
  domanda: string;
  trova: RegExp;
  /** Categorie della directory che la implicano da sole (es. parchi all'aperto). */
  categorie?: string[];
}

export const ESPERIENZE: Esperienza[] = [
  {
    id: "animazione",
    nome: "Animazione inclusa",
    icona: "🎈",
    gruppo: "Per la festa",
    domanda: "C'è un animatore? Per quanto tempo e per quanti bambini?",
    trova: /animazion|animator|intrattenitor|\bmago\b|clown|spettacolo di|baby ?dance/i,
  },
  {
    id: "buffet",
    nome: "Buffet e torta",
    icona: "🎂",
    gruppo: "Per la festa",
    domanda: "Il buffet e la torta sono compresi, o si possono portare da casa?",
    trova: /buffet|merenda|\btorta\b|catering|rinfresco|\bmen[uù]\b|pizza/i,
  },
  {
    id: "tema",
    nome: "Feste a tema",
    icona: "🦄",
    gruppo: "Per la festa",
    domanda: "Si può fare una festa a tema, con truccabimbi o travestimenti?",
    trova: /a tema|feste tematiche|travestim|truccabimbi|trucca ?bimbi|costum/i,
  },
  {
    id: "esclusiva",
    nome: "Sala tutta per voi",
    icona: "🔑",
    gruppo: "Per la festa",
    domanda: "La sala è in esclusiva o ci sono altre feste nello stesso momento?",
    trova: /esclusiv|privatizz|riservat[oa] (solo )?(a|per) voi|sala privata|uso privato/i,
  },
  {
    id: "pacchetti",
    nome: "Pacchetti festa",
    icona: "📦",
    gruppo: "Per la festa",
    domanda: "Avete pacchetti festa? Cosa include ognuno, per iscritto?",
    trova: /pacchett|formula festa|festa chiavi in mano|tutto compreso|compres[eio] /i,
  },
  {
    id: "gonfiabili",
    nome: "Gonfiabili e palline",
    icona: "🏰",
    gruppo: "Per giocare",
    domanda: "Ci sono gonfiabili, scivoli o piscina di palline?",
    trova: /gonfiabil|tappet[oi] elastic|trampolin|piscin[ae] di palline|piscin[ae] con le palline|vasca (di|con le) palline|playground|labirint/i,
  },
  {
    id: "laboratori",
    nome: "Laboratori creativi",
    icona: "🎨",
    gruppo: "Per giocare",
    domanda: "Fate laboratori durante la festa (creativi, di cucina, scientifici)?",
    trova: /laborator|esperiment|attivit[aà] creativ|didattic/i,
  },
  {
    id: "sport",
    nome: "Sport e movimento",
    icona: "⚽",
    gruppo: "Per giocare",
    domanda: "Che attività di movimento si possono fare durante la festa?",
    trova: /laser ?(game|tag)|\bsport|calcett|calcio|bowling|arrampic|\bnuoto|pattin|karting|percorsi? (avventura|acrobatic)|parkour/i,
  },
  {
    id: "animali",
    nome: "Animali e fattoria",
    icona: "🐐",
    gruppo: "Per giocare",
    domanda: "I bambini possono vedere o accarezzare gli animali?",
    trova: /animali|fattoria|cavall|\bpony|asin[oi]|caprett/i,
  },
  {
    id: "piccoli",
    nome: "Adatto ai più piccoli",
    icona: "🧸",
    gruppo: "Comodità",
    domanda: "C'è un'area sicura per i bambini sotto i 3 anni?",
    trova: /\b0\s*[-–a]\s*[2-4]\s*anni|da 0 a|piccolissim|\bbaby\b|primi passi|area morbida|area soft|zona morbida/i,
  },
  {
    id: "genitori",
    nome: "Angolo per i genitori",
    icona: "☕",
    gruppo: "Comodità",
    domanda: "C'è un posto dove gli adulti possono sedersi e prendere un caffè?",
    trova: /\bbar\b|caff[eè]|area (per i )?genitori|zona (per i )?genitori|genitori possono|relax per (i )?(genitori|adulti)/i,
  },
  {
    id: "aperto",
    nome: "All'aperto",
    icona: "🌳",
    gruppo: "Dove",
    domanda: "Avete uno spazio all'aperto? E se piove?",
    trova: /all'aperto|all’aperto|giardino|\bprato|outdoor|spazio esterno|area esterna|nel verde/i,
    categorie: ["parchi-all-aperto"],
  },
  {
    id: "coperto",
    nome: "Al coperto",
    icona: "🏠",
    gruppo: "Dove",
    domanda: "La festa si fa al chiuso? Com'è con il caldo d'estate?",
    trova: /al coperto|indoor|al chiuso/i,
    categorie: ["parchi-giochi-al-coperto", "ludoteche", "sale-feste", "laser-game", "musei-per-bambini"],
  },
];

export const GRUPPI = ["Per la festa", "Per giocare", "Comodità", "Dove"] as const;

/** Le esperienze scritte nella scheda (tipo + descrizione + pacchetti), più quelle implicate dalla categoria. */
export function esperienzeDi(s: { tipo: string; descrizione: string; categoria: string; pacchetti?: string }): IdEsperienza[] {
  const testo = `${s.tipo} ${s.descrizione} ${s.pacchetti ?? ""}`;
  const scritte = ESPERIENZE.filter((e) => e.trova.test(testo)).map((e) => e.id);
  // La categoria implica «al coperto» o «all'aperto» solo se il testo non dice il contrario.
  const implicite = ESPERIENZE.filter(
    (e) => e.categorie?.includes(s.categoria) && !(e.id === "coperto" && scritte.includes("aperto")) && !(e.id === "aperto" && scritte.includes("coperto")),
  ).map((e) => e.id);
  return ESPERIENZE.map((e) => e.id).filter((id) => scritte.includes(id) || implicite.includes(id));
}

/** L'età indicata nella descrizione, se c'è ("dai 3 ai 10 anni", "0-12 anni"). */
export function etaDi(descrizione: string): string | null {
  const m = descrizione.match(/(?:da(?:i|gli)?\s+)?(\d{1,2})\s*(?:-|–|a|ai|agli)\s*(\d{1,2})\s*anni/i);
  if (!m) return null;
  const [da, a] = [Number(m[1]), Number(m[2])];
  return da < a && a <= 18 ? `${da}-${a} anni` : null;
}

export const esperienza = (id: IdEsperienza) => ESPERIENZE.find((e) => e.id === id)!;
