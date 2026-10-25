import { CITTA_FESTE, type LocaleFesta } from "@/lib/feste";

/**
 * La directory delle attività per bambini (docs/piano-directory.md, fase 1).
 *
 * Categoria → città → scheda, sul modello di matrimonio.com. Le schede nascono
 * dai locali veri già raccolti in lib/feste.ts: ogni locale finisce in UNA
 * categoria secondo il suo `tipo` (regole qui sotto, la prima che combacia).
 * Una città diventa pagina di listing solo con almeno MIN_LISTING schede di
 * quella categoria: sotto, Google la tratterebbe come contenuto sottile.
 */

export const MIN_LISTING = 2;

export interface Categoria {
  slug: string;
  /** "Ludoteche" — nel titolo del listing: "Ludoteche a Milano". */
  nome: string;
  /** "ludoteca" — al singolare, nelle frasi. */
  singolare: string;
  /** H1 della pagina categoria. */
  titolo: string;
  /** Sottotitolo della pagina categoria. */
  sottotitolo: string;
  rispostaBreve: string;
  /** Cosa guardare prima di prenotare: compare in ogni scheda della categoria. */
  comeScegliere: string[];
  faq: { domanda: string; risposta: string }[];
  /** Sottotipo schema.org di LocalBusiness. */
  schema: string;
  /** Icona in public/icone, per la fascia colorata delle card. */
  icona: string;
  regola: RegExp;
}

export const CATEGORIE: Categoria[] = [
  {
    slug: "laser-game",
    nome: "Laser game, bowling e sport",
    singolare: "centro di gioco e sport",
    titolo: "Laser game, bowling e sport per bambini",
    sottotitolo: "Le feste movimentate per i più grandi: laser game, bowling, kart e centri sportivi, città per città.",
    rispostaBreve:
      "Laser game, bowling e centri sportivi sono le feste che funzionano meglio dai 7–8 anni in su: un'attività che fa squadra, una partita a tempo e poi la torta. Molti propongono pacchetti a persona con un numero minimo di partecipanti: verificate età minima, durata della partita e cosa resta escluso dal prezzo.",
    comeScegliere: [
      "L'età minima per giocare (spesso 7–8 anni per il laser game).",
      "Il numero minimo di partecipanti del pacchetto e il prezzo a persona.",
      "Quanto dura la partita e quanto resta per merenda e torta.",
      "Se c'è una sala riservata o si festeggia nello spazio comune.",
    ],
    faq: [
      { domanda: "Da che età si può fare la festa al laser game?", risposta: "Dipende dal centro, ma in genere dai 7–8 anni: sotto quell'età il gioco al buio e le regole a squadre diventano faticosi. Chiedete sempre l'età minima prima di invitare." },
      { domanda: "Come funzionano i pacchetti a persona?", risposta: "Di solito il prezzo è per partecipante con un minimo di invitati, e comprende partita e sala; merenda e torta possono essere a parte. Fatevi scrivere il totale con il numero esatto di bambini." },
      { domanda: "Serve prenotare molto prima?", risposta: "Per il sabato e la domenica sì, spesso con due o tre settimane di anticipo: le fasce del pomeriggio vanno via per prime." },
    ],
    schema: "SportsActivityLocation",
    icona: "gamepad",
    regola: /laser|escape|bowling|kart|centro sportivo/i,
  },
  {
    slug: "musei-per-bambini",
    nome: "Musei e scienza per bambini",
    singolare: "museo",
    titolo: "Musei e scienza per bambini",
    sottotitolo: "Il compleanno al museo e nei parchi scientifici: feste diverse dal solito, città per città.",
    rispostaBreve:
      "Sempre più musei organizzano il compleanno su prenotazione: un'attività guidata a tema per il gruppo, in genere per bambini dai 5–6 anni, con un prezzo a forfait per un numero massimo di invitati. È la festa giusta per chi vuole qualcosa di diverso dalla sala con i gonfiabili.",
    comeScegliere: [
      "La fascia d'età per cui è pensata l'attività.",
      "Il numero massimo di bambini e se gli adulti entrano gratis.",
      "Con quanto anticipo va prenotata (spesso almeno una settimana).",
      "Se si può portare merenda e torta e dove si consumano.",
    ],
    faq: [
      { domanda: "Come funziona il compleanno al museo?", risposta: "Si prenota con anticipo e il museo propone un'attività guidata a tema per il gruppo; la merenda si fa in uno spazio dedicato. Prezzo e numero massimo di bambini variano da museo a museo." },
      { domanda: "Da che età ha senso?", risposta: "In genere dai 5–6 anni: l'attività guidata chiede un po' di attenzione. Per i più piccoli meglio una ludoteca o una sala con i giochi." },
      { domanda: "È più cara di una festa in sala?", risposta: "Spesso no: molti musei applicano un forfait per gruppo che, diviso per gli invitati, è in linea con una sala feste. Chiedete cosa è incluso." },
    ],
    schema: "Museum",
    icona: "lampadina",
    regola: /museo|scientific/i,
  },
  {
    slug: "parchi-all-aperto",
    nome: "Parchi e spazi all'aperto",
    singolare: "spazio all'aperto",
    titolo: "Parchi, fattorie e spazi all'aperto per bambini",
    sottotitolo: "Agriturismi, parchi divertimento e giardini dove festeggiare all'aria aperta, città per città.",
    rispostaBreve:
      "Per la festa all'aperto si sceglie tra agriturismi con animazione, parchi divertimento e giardini attrezzati: più spazio per correre e spesso il parcheggio comodo. La regola d'oro è il piano B: chiedete sempre se c'è una sala al coperto in caso di pioggia.",
    comeScegliere: [
      "Se c'è una sala al coperto in caso di maltempo.",
      "Quanto è distante dalla città e se c'è parcheggio.",
      "Le attività incluse (animali, giochi, animazione) e per che età.",
      "Il periodo dell'anno: molti spazi lavorano soprattutto da aprile a ottobre.",
    ],
    faq: [
      { domanda: "Quando conviene la festa all'aperto?", risposta: "Da aprile a ottobre, con un piano B al coperto prenotato insieme: in Italia un sabato di pioggia capita anche a maggio." },
      { domanda: "Cosa chiedere a un agriturismo per la festa?", risposta: "Se c'è l'animazione o un'attività con gli animali, cosa comprende il menù per bambini e adulti, e se la sala interna è disponibile in caso di maltempo." },
      { domanda: "È adatta ai più piccoli?", risposta: "Sì, a patto che lo spazio sia recintato e che ci sia un'area d'ombra: per i bambini sotto i 3 anni contano più la sicurezza e il riposo che le attrazioni." },
    ],
    schema: "AmusementPark",
    icona: "mucca",
    regola: /agriturismo|parco divertimenti|spazi all'aperto|giardino con playground/i,
  },
  {
    slug: "ludoteche",
    nome: "Ludoteche",
    singolare: "ludoteca",
    titolo: "Ludoteche per bambini",
    sottotitolo: "Le ludoteche dove giocare e festeggiare il compleanno, città per città.",
    rispostaBreve:
      "Una ludoteca è uno spazio di gioco attrezzato per i bambini, spesso con playground, gonfiabili e laboratori; quasi tutte organizzano anche le feste di compleanno con animazione e buffet. Scegli la città per vedere zone, servizi e il tipo di spazio.",
    comeScegliere: [
      "La fascia d'età: alcune ludoteche sono pensate per i più piccoli, altre fino ai 10–12 anni.",
      "Se lo spazio è riservato alla vostra festa o condiviso con altri bambini.",
      "Cosa comprende il pacchetto: animazione, buffet, torta, pulizie.",
      "Il numero massimo di invitati e la durata della festa.",
    ],
    faq: [
      { domanda: "Cos'è una ludoteca?", risposta: "Uno spazio di gioco attrezzato per i bambini, con giochi, playground e spesso laboratori, dove si va a giocare con un adulto o per una festa. Molte offrono anche baby parking e centri estivi." },
      { domanda: "Quanto costa una festa in ludoteca?", risposta: "Dipende da città, invitati e formula: l'affitto dello spazio costa meno del pacchetto completo con animazione, buffet e torta. Chiedete sempre un preventivo scritto con l'elenco di cosa è incluso." },
      { domanda: "Da che età si può andare in ludoteca?", risposta: "Molte accolgono bambini da 1–2 anni fino ai 10–12, spesso con aree separate per i più piccoli. Controllate la fascia d'età prima di prenotare la festa." },
    ],
    schema: "ChildCare",
    icona: "puzzle",
    regola: /^ludoteca|playroom|spazio per l'infanzia|sala giochi/i,
  },
  {
    slug: "parchi-giochi-al-coperto",
    nome: "Parchi giochi al coperto",
    singolare: "parco giochi al coperto",
    titolo: "Parchi giochi al coperto per bambini",
    sottotitolo: "Gonfiabili, playground e trampolini al chiuso: i parchi gioco per le feste e i pomeriggi di pioggia.",
    rispostaBreve:
      "I parchi giochi al coperto uniscono playground, gonfiabili e spesso trampolini in un grande spazio climatizzato: sono la scelta più sicura per le feste movimentate e per i pomeriggi di pioggia. Per la festa di solito c'è una saletta riservata per torta e regali, mentre i bambini giocano in tutto il parco.",
    comeScegliere: [
      "Se il parco ha un'area separata per i più piccoli (0–3 anni).",
      "Se il prezzo della festa include l'ingresso dei bambini e quanti.",
      "Le calze antiscivolo: in molti parchi sono obbligatorie.",
      "Quanto tempo resta riservata la saletta per torta e regali.",
    ],
    faq: [
      { domanda: "Come funziona la festa in un parco giochi al coperto?", risposta: "I bambini giocano liberamente nel parco e c'è una saletta riservata per la merenda, la torta e i regali. Il pacchetto spesso include l'ingresso di un numero fisso di bambini." },
      { domanda: "Servono le calze antiscivolo?", risposta: "In molti parchi sì, per motivi di sicurezza sui gonfiabili e sui trampolini: scrivetelo nell'invito, così nessuno resta a guardare." },
      { domanda: "È adatto ai bambini piccoli?", risposta: "Se c'è un'area baby separata sì: lì i piccolissimi giocano senza i grandi che corrono. Chiedetelo prima di prenotare." },
    ],
    schema: "AmusementPark",
    icona: "razzo",
    regola: /parco giochi|area giochi|luna park|parco a tema|trampoline/i,
  },
  {
    slug: "sale-feste",
    nome: "Sale feste per bambini",
    singolare: "sala feste",
    titolo: "Sale feste per bambini",
    sottotitolo: "Le sale per il compleanno dei bambini, con animazione o da allestire a modo vostro, città per città.",
    rispostaBreve:
      "Una sala feste per bambini si prende in due modi: in affitto, da allestire a modo vostro, oppure col pacchetto completo di animazione, buffet e torta. L'affitto costa meno e lascia più libertà; il pacchetto toglie quasi tutti i pensieri. In entrambi i casi conviene un preventivo scritto con pulizie e allestimento.",
    comeScegliere: [
      "Affitto della sola sala o pacchetto completo con animazione e buffet.",
      "Il numero massimo di invitati, bambini e adulti.",
      "Se torta e cibo si possono portare da casa.",
      "Pulizie e allestimento: sono le voci che più spesso compaiono a sorpresa.",
    ],
    faq: [
      { domanda: "Meglio la sala in affitto o il pacchetto completo?", risposta: "La sala in affitto costa meno e lascia scegliere tutto; il pacchetto con animazione e buffet costa di più ma pensa a ogni cosa. Con tanti invitati piccoli il pacchetto di solito vince." },
      { domanda: "Si può portare la torta da casa?", risposta: "Spesso sì, ma alcune sale chiedono che venga da una pasticceria con lo scontrino, per le allergie e la conservazione: chiedetelo prima." },
      { domanda: "Con quanto anticipo prenotare?", risposta: "Per il weekend tre o quattro settimane, di più tra maggio, giugno e dicembre. Nei giorni feriali basta molto meno." },
    ],
    schema: "EventVenue",
    icona: "torta",
    regola: /.*/,
  },
];

/** Regione di ogni città della directory: per la pagina categoria. */
export const REGIONE: Record<string, string> = {
  milano: "Lombardia", brescia: "Lombardia", roma: "Lazio", napoli: "Campania", torino: "Piemonte",
  palermo: "Sicilia", catania: "Sicilia", messina: "Sicilia", genova: "Liguria", bologna: "Emilia-Romagna",
  modena: "Emilia-Romagna", parma: "Emilia-Romagna", firenze: "Toscana", prato: "Toscana", bari: "Puglia",
  taranto: "Puglia", verona: "Veneto", venezia: "Veneto", padova: "Veneto", trieste: "Friuli Venezia Giulia",
  "reggio-calabria": "Calabria",
};

export interface Scheda {
  slug: string;
  nome: string;
  zona: string;
  tipo: string;
  descrizione: string;
  sito?: string;
  instagram?: string;
  reel?: string;
  categoria: Categoria;
  citta: string;
  cittaSlug: string;
  /** Colore della fascia della card, a rotazione: le foto arrivano col claim. */
  colore: string;
}

const COLORI = ["#F6E3CF", "#FCE1EC", "#E1F3FB", "#EFE6FA", "#FEF3D1", "#E3F4E8"];

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function categoriaDi(locale: Pick<LocaleFesta, "tipo">): Categoria {
  return CATEGORIE.find((c) => c.regola.test(locale.tipo))!;
}

export const SCHEDE: Scheda[] = CITTA_FESTE.flatMap((c) =>
  c.locali.map((l, i) => ({
    slug: slugify(l.nome),
    nome: l.nome,
    zona: l.zona,
    tipo: l.tipo,
    descrizione: l.descrizione,
    sito: l.sito,
    instagram: l.instagram,
    reel: l.reel,
    categoria: categoriaDi(l),
    citta: c.citta,
    cittaSlug: c.slug,
    colore: COLORI[i % COLORI.length],
  })),
);

export const categoria = (slug: string) => CATEGORIE.find((c) => c.slug === slug);

export const schedeDi = (cat: string, citta?: string) =>
  SCHEDE.filter((s) => s.categoria.slug === cat && (!citta || s.cittaSlug === citta));

export const scheda = (cat: string, citta: string, slug: string) =>
  SCHEDE.find((s) => s.categoria.slug === cat && s.cittaSlug === citta && s.slug === slug);

export const percorsoScheda = (s: Scheda) => `/${s.categoria.slug}/${s.cittaSlug}/${s.slug}`;

/** I soli dati che servono a una card: oggetto semplice, passabile ai client component. */
export interface DatiCard {
  chiave: string;
  href: string;
  nome: string;
  zona: string;
  tipo: string;
  descrizione: string;
  citta: string;
  colore: string;
  icona: string;
}

export const datiCard = (s: Scheda): DatiCard => ({
  chiave: `${s.cittaSlug}-${s.slug}`,
  href: percorsoScheda(s),
  nome: s.nome,
  zona: s.zona,
  tipo: s.tipo,
  descrizione: s.descrizione,
  citta: s.citta,
  colore: s.colore,
  icona: s.categoria.icona,
});

/** Le città della categoria, con quante schede ha ognuna (più ricche prima). */
export function cittaDi(cat: string) {
  const conteggi = new Map<string, { slug: string; citta: string; n: number }>();
  for (const s of schedeDi(cat)) {
    const v = conteggi.get(s.cittaSlug) ?? { slug: s.cittaSlug, citta: s.citta, n: 0 };
    v.n++;
    conteggi.set(s.cittaSlug, v);
  }
  return [...conteggi.values()].sort((a, b) => b.n - a.n || a.citta.localeCompare(b.citta));
}

/** Le pagine listing che esistono davvero (almeno MIN_LISTING schede). */
export const LISTING = CATEGORIE.flatMap((c) =>
  cittaDi(c.slug)
    .filter((v) => v.n >= MIN_LISTING)
    .map((v) => ({ categoria: c, citta: v.citta, cittaSlug: v.slug, n: v.n })),
);

export const haListing = (cat: string, citta: string) =>
  LISTING.some((l) => l.categoria.slug === cat && l.cittaSlug === citta);

/** Le categorie con almeno una scheda: le sole che diventano pagina. */
export const CATEGORIE_ATTIVE = CATEGORIE.filter((c) => schedeDi(c.slug).length > 0);

/** La risposta breve del listing, costruita dai dati veri della città. */
export function rispostaListing(cat: Categoria, citta: string, schede: Scheda[]) {
  const zone = [...new Set(schede.map((s) => s.zona))].slice(0, 4);
  const elenco = zone.length > 1 ? `${zone.slice(0, -1).join(", ")} e ${zone.at(-1)}` : zone[0];
  return (
    `A ${citta} abbiamo raccolto ${schede.length} ${cat.nome.toLowerCase()} di cui parlano le famiglie, ` +
    `tra ${elenco}: tutte organizzano anche feste di compleanno per bambini. ` +
    `Prima di prenotare chiedete un preventivo scritto con cosa è incluso — animazione, buffet, torta e pulizie.`
  );
}
