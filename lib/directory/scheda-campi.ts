/**
 * I campi della scheda estesa di un'attività: lotto B di docs/listing-ricerca.md.
 *
 * È l'UNICO punto in cui si definisce un campo. Da qui nascono il modulo
 * dell'attività (/la-tua-scheda), la pagina pubblica, i filtri della directory
 * e il JSON-LD. Un campo nuovo si aggiunge solo qui.
 *
 * Regole di onestà (le stesse di lib/esperienze.ts):
 * - un campo vuoto non vuol dire «no»: la scheda lo mostra come «da chiedere»;
 * - il prezzo si mostra solo con la data in cui l'attività l'ha comunicato,
 *   altrimenti «Prezzo su richiesta» (decisione di Giorgia del 16/11/2026);
 * - niente giudizi («adatto ai bambini»): solo fatti dichiarati dall'attività.
 *
 * I dati viaggiano dentro dir_richieste.dati.estesa (supabase/directory.sql):
 * Giorgia li vede nel pannello e la pagina pubblica legge solo quelli accettati.
 * Tutto senza dipendenze: lo usano server e client.
 */

export const VERSIONE_SCHEDA = 1;

/** Le categorie della directory (slug di CATEGORIE in lib/directory.ts). */
export type SlugCategoria =
  | "parchi-avventura"
  | "parchi-acquatici"
  | "laser-game"
  | "musei-per-bambini"
  | "fattorie-didattiche"
  | "parchi-all-aperto"
  | "ludoteche"
  | "parchi-giochi-al-coperto"
  | "associazioni-per-bambini"
  | "animatori-per-feste"
  | "ristoranti-per-bambini"
  | "corsi-per-bambini"
  | "teatro-per-bambini"
  | "allestimenti-feste"
  | "sale-feste";

export const GIORNI = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"] as const;
export type Giorno = (typeof GIORNI)[number];
export const NOME_GIORNO: Record<Giorno, string> = {
  lun: "lunedì", mar: "martedì", mer: "mercoledì", gio: "giovedì", ven: "venerdì", sab: "sabato", dom: "domenica",
};

// ---------- I tipi dei valori ----------

export interface Intervallo { da?: number; a?: number }

export interface FasciaOraria { giorno: Giorno; dalle: string; alle: string }

/** Come si calcola il prezzo. Dai regolamenti veri: «180 € fino a 15 bambini, poi 12 € a bambino». */
export type ModelloPrezzo = "bambino" | "festa" | "ora";

export interface Prezzo {
  modello: ModelloPrezzo;
  /** Euro: a bambino, a festa o a ora secondo il modello. */
  importo: number;
  /** Solo «festa»: quanti bambini comprende. */
  bambiniInclusi?: number;
  /** Solo «festa»: euro per ogni bambino in più. */
  supplemento?: number;
  /** Solo «ora»: ore minime. */
  oreMinime?: number;
  /** Mese in cui l'attività l'ha comunicato, «AAAA-MM». Obbligatorio: senza, il prezzo non esce. */
  comunicatoIl: string;
}

export interface Pacchetto {
  nome: string;
  prezzo?: number;
  /** Cosa comprende, in una riga. */
  comprende?: string;
  bambini?: Intervallo;
  /** Minuti. */
  durata?: number;
}

export interface Extra { nome: string; prezzo?: number }

/** Da dove viene un valore: scritto a mano o proposto dall'AI e confermato dall'attività. */
export interface Provenienza { come: "mano" | "ai"; fonte?: string }

export type Valore =
  | boolean
  | number
  | string
  | string[]
  | Intervallo
  | FasciaOraria[]
  | Prezzo
  | Pacchetto[]
  | Extra[];

/** Il contenuto di dir_richieste.dati.estesa. */
export interface SchedaEstesa {
  versione: number;
  valori: Partial<Record<IdCampo, Valore>>;
  provenienza?: Partial<Record<IdCampo, Provenienza>>;
}

// ---------- La definizione dei campi ----------

export type TipoCampo =
  | "sino"
  | "numero"
  | "intervallo"
  | "scelta"
  | "spunte"
  | "testoBreve"
  | "testo"
  | "orari"
  | "prezzo"
  | "pacchetti"
  | "extra"
  | "link";

/** Obbligatorio, consigliato, facoltativo: decide la barra di completezza. */
export type Livello = "obbligatorio" | "consigliato" | "facoltativo";

export type Gruppo =
  | "Base"
  | "Per chi"
  | "La festa"
  | "Prezzi"
  | "Prenotare"
  | "Quando"
  | "Dove e comodità"
  | "Sicurezza e regole"
  | "Prima di andare"
  | "Contatti e video";

export const ORDINE_GRUPPI: Gruppo[] = [
  "Base", "Per chi", "La festa", "Prezzi", "Prenotare", "Quando",
  "Dove e comodità", "Sicurezza e regole", "Prima di andare", "Contatti e video",
];

export interface Opzione { id: string; nome: string }

export interface DefCampo {
  id: string;
  etichetta: string;
  /** L'etichetta nella pagina pubblica, se quella del modulo parla all'attività («Fate…», «Avete…»). */
  pubblica?: string;
  gruppo: Gruppo;
  tipo: TipoCampo;
  livello: Livello;
  /** Frase d'aiuto sotto il campo, nel modulo dell'attività. */
  aiuto?: string;
  /** Per scelta e spunte. */
  opzioni?: Opzione[];
  /** Unità per numero e intervallo («anni», «bambini», «km»). */
  unita?: string;
  /** Limiti per numeri e intervalli, e lunghezza massima per i testi. */
  min?: number;
  max?: number;
  /** Diventa un filtro della directory. */
  filtro?: boolean;
  /** Entra nella risposta breve citabile e nelle FAQ con JSON-LD. */
  aeo?: boolean;
  /** La domanda da fare all'attività quando il campo è vuoto. */
  domanda?: string;
  /** Se c'è, il campo vale solo per queste categorie. */
  categorie?: SlugCategoria[];
  /** Il campo ha senso solo se un altro campo sì/no è vero (es. i pacchetti solo se fanno feste). */
  seVero?: string;
}

const op = (...coppie: [string, string][]): Opzione[] => coppie.map(([id, nome]) => ({ id, nome }));

const FESTA = "fannoFeste";
const INCLUSO = op(["sala", "Sala"], ["animazione", "Animazione"], ["merenda", "Merenda o buffet"], ["torta", "Torta"], ["bevande", "Bevande"],
  ["gadget", "Gadget"], ["inviti", "Inviti"], ["allestimento", "Allestimento a tema"], ["pulizia", "Pulizia finale"]);
const ALL_APERTO: SlugCategoria[] = ["parchi-all-aperto", "fattorie-didattiche", "parchi-avventura", "parchi-acquatici"];

export const CAMPI_SCHEDA = [
  // ---- Base (nome, categoria e città restano quelli della scheda in lib/feste.ts)
  { id: "descrizione", etichetta: "Chi siete, in 2-3 frasi", gruppo: "Base", tipo: "testo", livello: "obbligatorio", max: 600, aeo: true,
    aiuto: "Cosa fate e per chi. Fatti, non aggettivi: «open space di 500 mq con gonfiabili» dice più di «spazio fantastico»." },
  { id: "indirizzo", etichetta: "Indirizzo", gruppo: "Base", tipo: "testoBreve", livello: "consigliato", max: 160, aeo: true },
  { id: "puntiForza", etichetta: "I vostri 3 punti di forza", gruppo: "Base", tipo: "spunte", livello: "facoltativo",
    aiuto: "Sceglieteli fra i servizi che avete segnato: compaiono in cima alla scheda.", max: 3, opzioni: INCLUSO },

  // ---- Per chi
  { id: "eta", etichetta: "Età consigliata", gruppo: "Per chi", tipo: "intervallo", livello: "obbligatorio", unita: "anni", min: 0, max: 18,
    filtro: true, aeo: true, domanda: "Per che età è pensato?" },
  { id: "sotto3", etichetta: "Adatto anche sotto i 3 anni", gruppo: "Per chi", tipo: "sino", livello: "consigliato", filtro: true, aeo: true,
    domanda: "C'è uno spazio per i più piccoli, sotto i 3 anni?" },

  // ---- La festa
  { id: FESTA, etichetta: "Fate feste di compleanno", gruppo: "La festa", tipo: "sino", livello: "obbligatorio", filtro: true, aeo: true },
  { id: "bambini", etichetta: "Quanti bambini", gruppo: "La festa", tipo: "intervallo", livello: "consigliato", unita: "bambini", min: 1, max: 500,
    filtro: true, aeo: true, seVero: FESTA, domanda: "Fino a quanti bambini si può invitare?" },
  { id: "adulti", etichetta: "Adulti ammessi, al massimo", gruppo: "La festa", tipo: "numero", livello: "facoltativo", unita: "adulti", min: 0, max: 1000, seVero: FESTA },
  { id: "durata", etichetta: "Durata della festa", gruppo: "La festa", tipo: "scelta", livello: "consigliato", aeo: true, seVero: FESTA,
    opzioni: op(["90", "1 ora e mezza"], ["120", "2 ore"], ["150", "2 ore e mezza"], ["180", "3 ore"], ["altro", "Altro, lo spieghiamo"]) },
  { id: "esclusiva", etichetta: "La sala è", gruppo: "La festa", tipo: "scelta", livello: "consigliato", filtro: true, aeo: true, seVero: FESTA,
    opzioni: op(["esclusiva", "Tutta per voi"], ["condivisa", "Condivisa con altre feste"], ["dipende", "Dipende dal pacchetto"]),
    domanda: "La sala è in esclusiva o ci sono altre feste nello stesso momento?" },
  { id: "incluso", etichetta: "Cosa è incluso nel prezzo", gruppo: "La festa", tipo: "spunte", livello: "consigliato", filtro: true, aeo: true, seVero: FESTA,
    aiuto: "Solo ciò che è davvero compreso: gli extra a pagamento vanno nella sezione Prezzi.",
    opzioni: INCLUSO },
  { id: "tortaDaCasa", etichetta: "Torta o cibo portati da casa", gruppo: "La festa", tipo: "scelta", livello: "consigliato", aeo: true, seVero: FESTA,
    opzioni: op(["si", "Sì"], ["supplemento", "Sì, con un supplemento"], ["no", "No"]),
    domanda: "Si può portare la torta da casa?" },
  { id: "allergie", etichetta: "Allergie e menu speciali", gruppo: "La festa", tipo: "scelta", livello: "consigliato", aeo: true, seVero: FESTA,
    opzioni: op(["si", "Prepariamo menu per allergie e intolleranze"], ["su-richiesta", "Su richiesta, da concordare"], ["no", "Non possiamo garantirlo"]),
    domanda: "Come gestite allergie e intolleranze?" },
  { id: "temi", etichetta: "Feste a tema", gruppo: "La festa", tipo: "testoBreve", livello: "facoltativo", filtro: true, max: 200, seVero: FESTA,
    aiuto: "Quali temi proponete. Niente nomi di personaggi protetti (Disney, Paw Patrol…): scrivete «principesse», «supereroi», «dinosauri»." },
  { id: "giorniFeste", etichetta: "Giorni in cui si fanno le feste", gruppo: "La festa", tipo: "spunte", livello: "consigliato", filtro: true, seVero: FESTA,
    opzioni: GIORNI.map((g) => ({ id: g, nome: NOME_GIORNO[g] })) },

  // ---- Prezzi
  { id: "prezzo", etichetta: "Prezzo di partenza", gruppo: "Prezzi", tipo: "prezzo", livello: "facoltativo", filtro: true, aeo: true,
    aiuto: "Facoltativo. Se lo scrivete, compare con il mese in cui ce l'avete dato. Se no, la scheda dice «Prezzo su richiesta».",
    domanda: "Quanto costa una festa?" },
  { id: "pacchetti", etichetta: "Pacchetti festa", gruppo: "Prezzi", tipo: "pacchetti", livello: "facoltativo", aeo: true, seVero: FESTA, max: 6 },
  { id: "extra", etichetta: "Extra a pagamento", gruppo: "Prezzi", tipo: "extra", livello: "facoltativo", seVero: FESTA, max: 12,
    aiuto: "Truccabimbi, torta, gadget, ore in più: ognuno con il suo prezzo, così la mamma calcola la spesa senza sorprese." },

  // ---- Prenotare
  { id: "caparra", etichetta: "Caparra", gruppo: "Prenotare", tipo: "testoBreve", livello: "consigliato", aeo: true, max: 160,
    aiuto: "Per esempio: «50% alla prenotazione».", domanda: "Serve una caparra?" },
  { id: "cancellazione", etichetta: "Cancellazione e cambio del numero di bambini", gruppo: "Prenotare", tipo: "testoBreve", livello: "consigliato", aeo: true, max: 240,
    domanda: "Fino a quando si può disdire o cambiare il numero di bambini?" },
  { id: "anticipo", etichetta: "Con quanto anticipo prenotare", gruppo: "Prenotare", tipo: "scelta", livello: "facoltativo", aeo: true,
    opzioni: op(["1", "Una settimana"], ["2", "Due settimane"], ["4", "Un mese"], ["8", "Due mesi o più"]) },

  // ---- Quando
  { id: "orari", etichetta: "Giorni e orari di apertura", gruppo: "Quando", tipo: "orari", livello: "consigliato", filtro: true, aeo: true },
  { id: "orarioLimite", etichetta: "Orario di chiusura delle feste", gruppo: "Quando", tipo: "testoBreve", livello: "facoltativo", max: 20, seVero: FESTA,
    aiuto: "Per esempio «19:30»." },

  // ---- Dove e comodità
  { id: "ambiente", etichetta: "Al coperto o all'aperto", gruppo: "Dove e comodità", tipo: "scelta", livello: "obbligatorio", filtro: true, aeo: true,
    opzioni: op(["coperto", "Al coperto"], ["aperto", "All'aperto"], ["entrambi", "Tutti e due"]) },
  { id: "metriQuadri", etichetta: "Superficie", gruppo: "Dove e comodità", tipo: "numero", livello: "facoltativo", unita: "mq", min: 1, max: 100000,
    categorie: ["ludoteche", "parchi-giochi-al-coperto", "sale-feste"] },
  { id: "parcheggio", etichetta: "Parcheggio", gruppo: "Dove e comodità", tipo: "scelta", livello: "consigliato", filtro: true,
    opzioni: op(["proprio", "Parcheggio nostro"], ["strada", "In strada, nei dintorni"], ["no", "Difficile, meglio i mezzi"]) },
  { id: "passeggino", etichetta: "Si entra con il passeggino, senza barriere", gruppo: "Dove e comodità", tipo: "sino", livello: "consigliato", filtro: true, aeo: true },
  { id: "fasciatoio", etichetta: "Fasciatoio e bagni per bambini", gruppo: "Dove e comodità", tipo: "sino", livello: "facoltativo" },
  { id: "genitori", etichetta: "Spazio per i genitori (zona caffè, wifi)", gruppo: "Dove e comodità", tipo: "sino", livello: "consigliato", filtro: true,
    domanda: "C'è uno spazio dove i genitori possono aspettare?" },
  { id: "sePiove", etichetta: "Se piove", gruppo: "Dove e comodità", tipo: "testoBreve", livello: "consigliato", max: 200, categorie: ALL_APERTO,
    aiuto: "C'è uno spazio al coperto? La festa si sposta o si rimanda?" },

  // ---- Sicurezza e regole
  { id: "educatori", etichetta: "Un educatore ogni quanti bambini", pubblica: "Un educatore ogni", gruppo: "Sicurezza e regole", tipo: "numero", livello: "consigliato", unita: "bambini", min: 1, max: 100, aeo: true },
  { id: "regole", etichetta: "Regole da sapere", gruppo: "Sicurezza e regole", tipo: "testo", livello: "consigliato", max: 400, aeo: true,
    aiuto: "Calze antiscivolo, i genitori restano o no, cosa non si può portare." },
  { id: "assicurazione", etichetta: "Avete un'assicurazione per i partecipanti", pubblica: "Assicurazione per i partecipanti", gruppo: "Sicurezza e regole", tipo: "sino", livello: "facoltativo" },
  { id: "fotoBambini", etichetta: "Foto e video ai bambini durante le feste", pubblica: "Foto e video ai bambini", gruppo: "Sicurezza e regole", tipo: "scelta", livello: "facoltativo",
    opzioni: op(["no", "Non ne facciamo"], ["solo-famiglia", "Solo per la famiglia, non le pubblichiamo"], ["con-consenso", "Le pubblichiamo solo con il consenso dei genitori"]) },

  // ---- Prima di andare
  { id: "cosaPortare", etichetta: "Cosa portare e cosa indossare", gruppo: "Prima di andare", tipo: "testoBreve", livello: "facoltativo", max: 240 },
  { id: "minimi", etichetta: "Età o altezza minime per le attrazioni", gruppo: "Prima di andare", tipo: "testoBreve", livello: "facoltativo", max: 200,
    categorie: ["laser-game", "parchi-giochi-al-coperto", "parchi-avventura", "parchi-acquatici"] },
  { id: "comeArrivare", etichetta: "Come arrivare", gruppo: "Prima di andare", tipo: "testoBreve", livello: "facoltativo", max: 240,
    aiuto: "Mezzi pubblici, ingresso, dove ci si trova se lo spazio è grande." },

  // ---- Contatti e video (email e telefoni restano nel database, mai nel repository)
  { id: "whatsapp", etichetta: "WhatsApp", gruppo: "Contatti e video", tipo: "testoBreve", livello: "consigliato", max: 30 },
  { id: "telefono", etichetta: "Telefono", gruppo: "Contatti e video", tipo: "testoBreve", livello: "consigliato", max: 30 },
  { id: "sito", etichetta: "Sito", gruppo: "Contatti e video", tipo: "link", livello: "facoltativo" },
  { id: "instagram", etichetta: "Instagram", gruppo: "Contatti e video", tipo: "link", livello: "facoltativo" },
  { id: "facebook", etichetta: "Facebook", gruppo: "Contatti e video", tipo: "link", livello: "facoltativo" },
  { id: "tiktok", etichetta: "TikTok", gruppo: "Contatti e video", tipo: "link", livello: "facoltativo" },
  { id: "schedaGoogle", etichetta: "La vostra scheda su Google Maps", gruppo: "Contatti e video", tipo: "link", livello: "facoltativo" },
  { id: "video", etichetta: "Reel e video", gruppo: "Contatti e video", tipo: "link", livello: "consigliato", max: 5,
    aiuto: "Fino a 5 link di reel Instagram, video YouTube o TikTok. Si vedono nella scheda con il player ufficiale, solo quando la mamma tocca." },

  // ---- Per categoria
  { id: "giocoLibero", etichetta: "Si può venire a giocare anche senza festa", gruppo: "Per chi", tipo: "sino", livello: "consigliato",
    categorie: ["ludoteche", "parchi-giochi-al-coperto"] },
  { id: "animali", etichetta: "Animali che si incontrano", gruppo: "Per chi", tipo: "testoBreve", livello: "consigliato", max: 200,
    categorie: ["fattorie-didattiche"] },
  { id: "tessera", etichetta: "Tessera associativa", gruppo: "Prenotare", tipo: "testoBreve", livello: "consigliato", max: 160,
    categorie: ["associazioni-per-bambini", "corsi-per-bambini"], aiuto: "Serve? Quanto costa? Basta per il festeggiato?",
    domanda: "Serve la tessera associativa?" },
  { id: "zonaServita", etichetta: "Fin dove vi spostate", pubblica: "Si spostano fino a", gruppo: "Dove e comodità", tipo: "numero", livello: "consigliato", unita: "km", min: 1, max: 500,
    categorie: ["animatori-per-feste", "allestimenti-feste"] },
  { id: "trasferta", etichetta: "Costo della trasferta", gruppo: "Prezzi", tipo: "testoBreve", livello: "consigliato", max: 160,
    categorie: ["animatori-per-feste", "allestimenti-feste"] },
  { id: "animatori", etichetta: "Quanti animatori vengono", gruppo: "La festa", tipo: "numero", livello: "facoltativo", min: 1, max: 50,
    categorie: ["animatori-per-feste"] },
  { id: "menuBambini", etichetta: "Menu bambini", gruppo: "La festa", tipo: "testoBreve", livello: "consigliato", max: 200,
    categorie: ["ristoranti-per-bambini"] },
  { id: "seggioloni", etichetta: "Seggioloni", gruppo: "Dove e comodità", tipo: "sino", livello: "consigliato", categorie: ["ristoranti-per-bambini"] },
  { id: "areaGiochi", etichetta: "Area giochi per i bambini", gruppo: "Dove e comodità", tipo: "sino", livello: "consigliato", filtro: true,
    categorie: ["ristoranti-per-bambini"] },
  { id: "lezioneProva", etichetta: "Lezione di prova", gruppo: "Prenotare", tipo: "sino", livello: "consigliato", categorie: ["corsi-per-bambini"] },
  { id: "frequenza", etichetta: "Frequenza dei corsi", gruppo: "Quando", tipo: "testoBreve", livello: "consigliato", max: 160, categorie: ["corsi-per-bambini"] },
  { id: "consegna", etichetta: "Consegna: zona, costo e preavviso", gruppo: "Prezzi", tipo: "testoBreve", livello: "consigliato", max: 200,
    categorie: ["allestimenti-feste"] },
] as const satisfies readonly DefCampo[];

export type IdCampo = (typeof CAMPI_SCHEDA)[number]["id"];

const PER_ID = new Map<string, DefCampo>(CAMPI_SCHEDA.map((c) => [c.id, c]));
export const campo = (id: IdCampo): DefCampo => PER_ID.get(id)!;

/** I campi che valgono per una categoria, nell'ordine dei gruppi. */
export function campiPerCategoria(categoria: string): DefCampo[] {
  const validi = (CAMPI_SCHEDA as readonly DefCampo[]).filter(
    (c) => !c.categorie || (c.categorie as string[]).includes(categoria),
  );
  return ORDINE_GRUPPI.flatMap((g) => validi.filter((c) => c.gruppo === g));
}

// ---------- Validazione: quello che arriva dal modulo (o dall'AI) diventa una SchedaEstesa pulita ----------

const ORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const MESE = /^20\d\d-(0[1-9]|1[0-2])$/;
const LINK = /^https:\/\/[^\s<>"]{3,300}$/;

const testoPulito = (v: unknown, max = 400) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";

const numero = (v: unknown, min = 0, max = 1e6): number | undefined => {
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= min && n <= max ? Math.round(n * 100) / 100 : undefined;
};

const intervallo = (v: unknown, min?: number, max?: number): Intervallo | undefined => {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const da = numero(o.da, min, max);
  const a = numero(o.a, min, max);
  if (da === undefined && a === undefined) return undefined;
  if (da !== undefined && a !== undefined && da > a) return { da: a, a: da };
  return { ...(da !== undefined && { da }), ...(a !== undefined && { a }) };
};

/** Il prezzo esce solo con importo, modello e mese: altrimenti è «su richiesta». */
function prezzo(v: unknown): Prezzo | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const modello = o.modello;
  const importo = numero(o.importo, 0.5, 100000);
  const mese = testoPulito(o.comunicatoIl, 7);
  if ((modello !== "bambino" && modello !== "festa" && modello !== "ora") || importo === undefined || !MESE.test(mese)) return undefined;
  const p: Prezzo = { modello, importo, comunicatoIl: mese };
  if (modello === "festa") {
    const inclusi = numero(o.bambiniInclusi, 1, 500);
    const suppl = numero(o.supplemento, 0, 10000);
    if (inclusi !== undefined) p.bambiniInclusi = inclusi;
    if (suppl !== undefined) p.supplemento = suppl;
  }
  if (modello === "ora") {
    const ore = numero(o.oreMinime, 0.5, 24);
    if (ore !== undefined) p.oreMinime = ore;
  }
  return p;
}

function link(v: unknown): string | undefined {
  const s = testoPulito(v, 300);
  return LINK.test(s) ? s : undefined;
}

export interface EsitoValidazione {
  scheda: SchedaEstesa;
  /** Messaggi per l'attività, già in italiano, per id del campo. */
  errori: Partial<Record<IdCampo, string>>;
}

/**
 * Pulisce i valori in arrivo per una categoria. Scarta i campi sconosciuti o di
 * altre categorie, tronca i testi, ignora i valori non validi segnalandoli.
 */
export function validaScheda(
  categoria: string,
  valori: Record<string, unknown>,
  provenienza: Record<string, unknown> = {},
): EsitoValidazione {
  const out: SchedaEstesa["valori"] = {};
  const prov: SchedaEstesa["provenienza"] = {};
  const errori: EsitoValidazione["errori"] = {};

  for (const c of campiPerCategoria(categoria)) {
    const id = c.id as IdCampo;
    const v = valori[id];
    if (v === undefined || v === null || v === "") continue;
    let pulito: Valore | undefined;

    switch (c.tipo) {
      case "sino":
        pulito = v === true || v === "si" ? true : v === false || v === "no" ? false : undefined;
        break;
      case "numero":
        pulito = numero(v, c.min, c.max);
        break;
      case "intervallo":
        pulito = intervallo(v, c.min, c.max);
        break;
      case "scelta": {
        const s = String(v);
        pulito = c.opzioni?.some((o) => o.id === s) ? s : undefined;
        break;
      }
      case "spunte": {
        const lista = Array.isArray(v) ? v.map(String) : [];
        const ammesse = new Set(c.opzioni?.map((o) => o.id));
        const scelte = [...new Set(lista)].filter((s) => ammesse.has(s));
        pulito = scelte.length ? scelte.slice(0, c.max ?? 20) : undefined;
        break;
      }
      case "testoBreve":
      case "testo": {
        const s = testoPulito(v, c.max);
        pulito = s || undefined;
        break;
      }
      case "link": {
        if (id === "video") {
          const lista = (Array.isArray(v) ? v : [v]).map(link).filter((s): s is string => Boolean(s && videoRiconosciuto(s)));
          pulito = lista.length ? lista.slice(0, c.max ?? 5) : undefined;
        } else {
          pulito = link(v);
        }
        break;
      }
      case "orari": {
        const lista = Array.isArray(v) ? v : [];
        const fasce = lista
          .map((f) => f as Record<string, unknown>)
          .filter((f) => GIORNI.includes(f.giorno as Giorno) && ORA.test(String(f.dalle)) && ORA.test(String(f.alle)) && String(f.dalle) < String(f.alle))
          .map((f) => ({ giorno: f.giorno as Giorno, dalle: String(f.dalle), alle: String(f.alle) }));
        pulito = fasce.length ? fasce.slice(0, 21) : undefined;
        break;
      }
      case "prezzo":
        pulito = prezzo(v);
        if (!pulito) errori[id] = "Per mostrare un prezzo servono importo, come si calcola e il mese. Senza, la scheda dice «Prezzo su richiesta».";
        break;
      case "pacchetti": {
        const lista = Array.isArray(v) ? v : [];
        const pacchetti = lista
          .map((p) => p as Record<string, unknown>)
          .map((p): Pacchetto => ({
            nome: testoPulito(p.nome, 80),
            ...(numero(p.prezzo, 0, 100000) !== undefined && { prezzo: numero(p.prezzo, 0, 100000) }),
            ...(testoPulito(p.comprende, 240) && { comprende: testoPulito(p.comprende, 240) }),
            ...(intervallo(p.bambini, 1, 500) && { bambini: intervallo(p.bambini, 1, 500) }),
            ...(numero(p.durata, 15, 720) !== undefined && { durata: numero(p.durata, 15, 720) }),
          }))
          .filter((p) => p.nome);
        pulito = pacchetti.length ? pacchetti.slice(0, c.max ?? 6) : undefined;
        break;
      }
      case "extra": {
        const lista = Array.isArray(v) ? v : [];
        const extra = lista
          .map((e) => e as Record<string, unknown>)
          .map((e): Extra => ({
            nome: testoPulito(e.nome, 80),
            ...(numero(e.prezzo, 0, 100000) !== undefined && { prezzo: numero(e.prezzo, 0, 100000) }),
          }))
          .filter((e) => e.nome);
        pulito = extra.length ? extra.slice(0, c.max ?? 12) : undefined;
        break;
      }
    }

    if (pulito === undefined) {
      if (!errori[id]) errori[id] = `«${c.etichetta}»: valore non valido, non l'abbiamo salvato.`;
      continue;
    }
    out[id] = pulito;
    const p = provenienza[id] as Record<string, unknown> | undefined;
    if (p && (p.come === "ai" || p.come === "mano")) {
      prov[id] = { come: p.come, ...(testoPulito(p.fonte, 300) && { fonte: testoPulito(p.fonte, 300) }) };
    }
  }

  // I punti di forza si scelgono fra i servizi segnati: niente frasi libere.
  const incluso = (out.incluso as string[] | undefined) ?? [];
  if (out.puntiForza) {
    const ok = (out.puntiForza as string[]).filter((s) => incluso.includes(s));
    if (ok.length) out.puntiForza = ok;
    else delete out.puntiForza;
  }

  return { scheda: { versione: VERSIONE_SCHEDA, valori: out, ...(Object.keys(prov).length && { provenienza: prov }) }, errori };
}

// ---------- Completezza e «da chiedere» ----------

/** Un campo conta solo se si applica: i campi della festa non pesano se non fanno feste. */
function siApplica(c: DefCampo, valori: SchedaEstesa["valori"]): boolean {
  return !c.seVero || valori[c.seVero as IdCampo] === true;
}

/** Percentuale per la barra del backend: gli obbligatori pesano 3, i consigliati 1. */
export function completezza(categoria: string, s: SchedaEstesa | undefined) {
  const valori = s?.valori ?? {};
  const campi = campiPerCategoria(categoria).filter((c) => c.livello !== "facoltativo" && siApplica(c, valori));
  const peso = (c: DefCampo) => (c.livello === "obbligatorio" ? 3 : 1);
  const totale = campi.reduce((t, c) => t + peso(c), 0);
  const fatti = campi.filter((c) => valori[c.id as IdCampo] !== undefined);
  const mancanti = campi.filter((c) => valori[c.id as IdCampo] === undefined);
  return {
    percentuale: totale ? Math.round((fatti.reduce((t, c) => t + peso(c), 0) / totale) * 100) : 0,
    obbligatoriMancanti: mancanti.filter((c) => c.livello === "obbligatorio").map((c) => c.etichetta),
    consigliatiMancanti: mancanti.filter((c) => c.livello === "consigliato").map((c) => c.etichetta),
  };
}

/** Le domande da fare all'attività per i campi vuoti: vanno nella scheda pubblica come «da chiedere». */
export function daChiedere(categoria: string, s: SchedaEstesa | undefined): string[] {
  const valori = s?.valori ?? {};
  return campiPerCategoria(categoria)
    .filter((c) => c.domanda && siApplica(c, valori) && valori[c.id as IdCampo] === undefined)
    .map((c) => c.domanda!);
}

// ---------- Prezzo e video: come si mostrano ----------

const euro = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")} €`;
const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

/** «da 15 € a bambino · prezzo comunicato a novembre 2026», oppure «Prezzo su richiesta». */
export function testoPrezzo(p: Prezzo | undefined): { prezzo: string; nota?: string } {
  if (!p) return { prezzo: "Prezzo su richiesta" };
  const [anno, mese] = p.comunicatoIl.split("-");
  const nota = `prezzo comunicato a ${MESI[Number(mese) - 1]} ${anno}`;
  if (p.modello === "bambino") return { prezzo: `da ${euro(p.importo)} a bambino`, nota };
  if (p.modello === "ora") {
    return { prezzo: `da ${euro(p.importo)} all'ora${p.oreMinime ? `, minimo ${String(p.oreMinime).replace(".", ",")} ore` : ""}`, nota };
  }
  const base = `da ${euro(p.importo)} a festa${p.bambiniInclusi ? ` fino a ${p.bambiniInclusi} bambini` : ""}`;
  return { prezzo: p.supplemento ? `${base}, poi ${euro(p.supplemento)} per ogni bambino in più` : base, nota };
}

/** Le piattaforme che si incorporano con il player ufficiale, caricato solo al tocco. */
export type Piattaforma = "instagram" | "youtube" | "tiktok";

export interface VideoIncorporato { piattaforma: Piattaforma; url: string; incorpora: string }

/** Riconosce un link di reel/video e prepara l'indirizzo del player ufficiale. */
export function videoRiconosciuto(url: string): VideoIncorporato | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www\.|m\.)/, "");
  if (host === "instagram.com") {
    const m = u.pathname.match(/^\/(reel|reels|p|tv)\/([A-Za-z0-9_-]{5,40})/);
    if (!m) return null;
    const tipo = m[1] === "reels" ? "reel" : m[1];
    return { piattaforma: "instagram", url, incorpora: `https://www.instagram.com/${tipo}/${m[2]}/embed` };
  }
  if (host === "youtube.com" || host === "youtu.be") {
    const id =
      host === "youtu.be"
        ? u.pathname.slice(1)
        : u.searchParams.get("v") ?? u.pathname.match(/^\/(shorts|embed|live)\/([A-Za-z0-9_-]{6,20})/)?.[2] ?? "";
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null;
    // La versione «senza cookie» di YouTube.
    return { piattaforma: "youtube", url, incorpora: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host === "tiktok.com") {
    const id = u.pathname.match(/\/video\/(\d{8,25})/)?.[1];
    if (!id) return null;
    return { piattaforma: "tiktok", url, incorpora: `https://www.tiktok.com/embed/v2/${id}` };
  }
  return null;
}

// ---------- Riepilogo leggibile (pannello di Giorgia, anteprima dell'attività) ----------

const minuti = (m: number) => (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} ore`);

function testoIntervallo(i: Intervallo, unita = "") {
  const u = unita ? ` ${unita}` : "";
  if (i.da !== undefined && i.a !== undefined) return `da ${i.da} a ${i.a}${u}`;
  return i.da !== undefined ? `da ${i.da}${u}` : `fino a ${i.a}${u}`;
}

/** Un valore in parole, come lo legge una persona. */
export function testoValore(c: DefCampo, v: Valore): string {
  switch (c.tipo) {
    case "sino":
      return v ? "Sì" : "No";
    case "numero":
      return `${v}${c.unita ? ` ${c.unita}` : ""}`;
    case "intervallo":
      return testoIntervallo(v as Intervallo, c.unita);
    case "scelta":
      return c.opzioni?.find((o) => o.id === v)?.nome ?? String(v);
    case "spunte":
      return (v as string[]).map((s) => c.opzioni?.find((o) => o.id === s)?.nome ?? s).join(", ");
    case "orari":
      return (v as FasciaOraria[]).map((f) => `${NOME_GIORNO[f.giorno]} ${f.dalle}-${f.alle}`).join("; ");
    case "prezzo": {
      const t = testoPrezzo(v as Prezzo);
      return t.nota ? `${t.prezzo} (${t.nota})` : t.prezzo;
    }
    case "pacchetti":
      return (v as Pacchetto[])
        .map((p) =>
          [p.nome, p.prezzo !== undefined && euro(p.prezzo), p.bambini && testoIntervallo(p.bambini, "bambini"), p.durata && minuti(p.durata), p.comprende]
            .filter(Boolean)
            .join(" · "),
        )
        .join("\n");
    case "extra":
      return (v as Extra[]).map((e) => (e.prezzo !== undefined ? `${e.nome} ${euro(e.prezzo)}` : e.nome)).join(", ");
    case "link":
      return Array.isArray(v) ? v.join("\n") : String(v);
    default:
      return String(v);
  }
}

/** Tutti i campi compilati, nell'ordine dei gruppi, con la provenienza. */
export function riepilogoScheda(categoria: string, s: SchedaEstesa | undefined) {
  const valori = s?.valori ?? {};
  return campiPerCategoria(categoria)
    .filter((c) => valori[c.id as IdCampo] !== undefined)
    .map((c) => ({
      id: c.id,
      gruppo: c.gruppo,
      etichetta: c.etichetta,
      valore: testoValore(c, valori[c.id as IdCampo]!),
      ai: s?.provenienza?.[c.id as IdCampo]?.come === "ai",
    }));
}

/** È davvero una scheda estesa (e non un vecchio dato a testo libero)? */
export const eSchedaEstesa = (v: unknown): v is SchedaEstesa =>
  Boolean(v && typeof v === "object" && typeof (v as SchedaEstesa).versione === "number" && typeof (v as SchedaEstesa).valori === "object");

// ---------- Dati strutturati (schema.org) dalla scheda estesa ----------

const GIORNO_SCHEMA: Record<Giorno, string> = {
  lun: "Monday", mar: "Tuesday", mer: "Wednesday", gio: "Thursday", ven: "Friday", sab: "Saturday", dom: "Sunday",
};

/** Le proprietà in più per il JSON-LD LocalBusiness della scheda: solo dati dichiarati dall'attività. */
export function jsonLdEstesa(categoria: string, s: SchedaEstesa | undefined): Record<string, unknown> {
  if (!s) return {};
  const v = s.valori;
  const out: Record<string, unknown> = {};
  const servizi = campiPerCategoria(categoria).filter((c) => c.tipo === "sino" && v[c.id as IdCampo] !== undefined);
  const inclusi = (v.incluso as string[] | undefined) ?? [];
  const amenity = [
    ...servizi.map((c) => ({ "@type": "LocationFeatureSpecification", name: c.etichetta, value: v[c.id as IdCampo] === true })),
    ...inclusi.map((i) => ({ "@type": "LocationFeatureSpecification", name: `${campo("incluso").opzioni?.find((o) => o.id === i)?.nome ?? i} incluso`, value: true })),
  ];
  if (amenity.length) out.amenityFeature = amenity;
  const orari = v.orari as FasciaOraria[] | undefined;
  if (orari) {
    out.openingHoursSpecification = orari.map((f) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: GIORNO_SCHEMA[f.giorno], opens: f.dalle, closes: f.alle }));
  }
  const p = v.prezzo as Prezzo | undefined;
  const pacchetti = (v.pacchetti as Pacchetto[] | undefined)?.filter((k) => k.prezzo !== undefined) ?? [];
  // Un prezzo senza data non esce mai (decisione del 16/11/2026): i pacchetti usano la data del prezzo.
  if (p) {
    const offerte = [
      { "@type": "Offer", name: "Festa di compleanno", priceCurrency: "EUR", price: p.importo, validFrom: `${p.comunicatoIl}-01` },
      ...pacchetti.map((k) => ({ "@type": "Offer", name: k.nome, priceCurrency: "EUR", price: k.prezzo, validFrom: `${p.comunicatoIl}-01`, ...(k.comprende && { description: k.comprende }) })),
    ];
    out.makesOffer = offerte;
  }
  const eta = v.eta as Intervallo | undefined;
  if (eta) out.audience = { "@type": "PeopleAudience", ...(eta.da !== undefined && { suggestedMinAge: eta.da }), ...(eta.a !== undefined && { suggestedMaxAge: eta.a }) };
  const video = ((v.video as string[] | undefined) ?? []).map(videoRiconosciuto).filter((x) => x !== null);
  if (video.length) out.subjectOf = video.map((x) => ({ "@type": "VideoObject", name: `Video su ${x.piattaforma}`, embedUrl: x.incorpora, url: x.url }));
  return out;
}
