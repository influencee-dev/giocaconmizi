import { slugify } from "./directory";
import { PERCORSO_RISORSE, type Risorsa, type Sezione } from "./risorse-educative";

/**
 * La directory delle risorse educative (14/11/2026), gemella di quella delle
 * feste (lib/directory.ts): categoria → provincia → scheda.
 *
 * Indirizzi:
 *   /risorse-educative-bambini                       l'hub con tutte le categorie
 *   /risorse-educative-bambini/<categoria>           una categoria
 *   /risorse-educative-bambini/<categoria>/<prov>    una provincia (solo ≥ MIN_LISTING schede)
 *   /risorse-educative-bambini/<slug-risorsa>        la scheda di ogni realtà
 *
 * La scheda NON ha la categoria nell'indirizzo: è il link che parte nelle
 * email di Giorgia e deve restare uguale anche se un giorno la realtà
 * cambia categoria. Categorie e schede condividono lo stesso livello
 * dell'indirizzo: la batteria SEO controlla che non ci siano doppioni.
 *
 * COME SI AGGIUNGE UNA CATEGORIA: una voce in CATEGORIE_RISORSE. Diventa
 * pagina (e entra in sitemap, llms.txt e menu) da sola appena ha almeno una
 * scheda: finché è vuota non si vede. Una risorsa nuova finisce nella
 * categoria scritta in ASSEGNAZIONI; se manca, decide la sua prima sezione.
 */

export const MIN_LISTING_RISORSE = 2;

export type Ambito = "online" | "territorio";

export interface CategoriaRisorsa {
  slug: string;
  /** "Scuole paritarie dell'infanzia e primarie": nei titoli e nelle card. */
  nome: string;
  /** Il nome corto della card e dell'etichetta. */
  breve: string;
  /** H1 della pagina categoria. */
  titolo: string;
  sottotitolo: string;
  /** La risposta citabile dalle AI (box «In breve»). */
  rispostaBreve: string;
  /** Cosa guardare prima di scegliere: compare nella categoria e in ogni scheda. */
  comeScegliere: string[];
  faq: { domanda: string; risposta: string }[];
  /** online = si usa da casa o da scuola; territorio = ha una sede, pagine per provincia. */
  ambito: Ambito;
  /** Tipo schema.org della realtà nella scheda. */
  schema: "Organization" | "EducationalOrganization" | "School";
  /** Icona in public/icone per la fascia illustrata. */
  icona: string;
  /** Colore pastello della fascia e dell'etichetta. */
  colore: string;
  /** Le risorse senza assegnazione esplicita, per prima sezione. */
  sezioneDiRiserva?: Sezione;
}

export const CATEGORIE_RISORSE: CategoriaRisorsa[] = [
  {
    slug: "blog-per-genitori",
    nome: "Blog e magazine per genitori",
    breve: "Per genitori",
    titolo: "Blog e magazine per genitori",
    sottotitolo: "Siti scritti da mamme e papà, guide di città e magazine su crescita, gite e vita in famiglia.",
    rispostaBreve:
      "I blog e i magazine per genitori raccolgono consigli pratici su crescita, salute, scuola, gite ed eventi con i bambini. Sono un buon punto di partenza per farsi un'idea, ma non sostituiscono il pediatra o gli insegnanti: per salute e sviluppo vale sempre il parere di un professionista.",
    comeScegliere: [
      "Chi scrive: un genitore che racconta la sua esperienza o una redazione con esperti.",
      "La data degli articoli: su salute, bonus e scuola le regole cambiano spesso.",
      "Se il sito parla della tua zona: le guide di città segnalano eventi e posti vicini.",
      "Per salute e sviluppo, il parere del pediatra viene sempre prima.",
    ],
    faq: [
      { domanda: "I blog per genitori sono affidabili?", risposta: "Dipende da chi scrive e da quando. Un blog di una mamma è prezioso per idee ed esperienze; su salute e sviluppo conviene sempre verificare con il pediatra e preferire articoli recenti che citano le fonti." },
      { domanda: "Dove trovo eventi per bambini nella mia città?", risposta: "Le guide di città scritte da genitori, come quelle di Milano o del Veneto, segnalano eventi, gite e posti adatti ai bambini. Per orari e prezzi controlla sempre il sito dell'organizzatore." },
    ],
    ambito: "online",
    schema: "Organization",
    icona: "cuore-viola",
    colore: "#FCE1EC",
    sezioneDiRiserva: "famiglie",
  },
  {
    slug: "schede-didattiche-per-insegnanti",
    nome: "Schede e materiali per insegnanti",
    breve: "Per insegnanti",
    titolo: "Schede didattiche e materiali per insegnanti",
    sottotitolo: "Blog di maestre e maestri, portali di schede da stampare e riviste di pedagogia, dall'infanzia alla primaria.",
    rispostaBreve:
      "Le schede didattiche da stampare e i blog di maestre e maestri aiutano a preparare lezioni, compiti e lavoretti per la scuola dell'infanzia e la primaria. Prima di usarle in classe conviene controllare le condizioni d'uso del sito: molte sono gratuite per uso didattico, ma non sempre per la ridistribuzione.",
    comeScegliere: [
      "L'età e la classe a cui è pensato il materiale.",
      "Le condizioni d'uso: gratis per la classe non vuol dire libero da ridistribuire.",
      "Se le schede si possono modificare o solo stampare.",
      "Se il sito chiede registrazione o abbonamento per scaricare.",
    ],
    faq: [
      { domanda: "Le schede didattiche online sono gratuite?", risposta: "Molte sì, per uso personale e in classe; alcune richiedono registrazione o un abbonamento. Le condizioni sono scritte sul sito di ciascun autore: leggile prima di stampare in quantità o condividere i file." },
      { domanda: "Si possono usare i giochi di Giocamizi in classe?", risposta: "Sì: i giochi di Giocamizi sono gratuiti, senza pubblicità e senza registrazione, e funzionano sulla LIM e sui tablet della scuola." },
    ],
    ambito: "online",
    schema: "Organization",
    icona: "matita",
    colore: "#E3F4E8",
    sezioneDiRiserva: "insegnanti",
  },
  {
    slug: "coding-e-stem-per-bambini",
    nome: "Coding, STEM e scienza per bambini",
    breve: "Coding e STEM",
    titolo: "Coding, STEM e scienza per bambini",
    sottotitolo: "Robotica, mattoncini, astronomia e pensiero computazionale: progetti che portano la scienza ai bambini in modo attivo.",
    rispostaBreve:
      "Coding e STEM per bambini vogliono dire imparare logica, scienza e tecnologia facendo: costruire, programmare un robot, osservare il cielo. Dai 4-5 anni si parte con giochi senza schermo e sequenze di comandi; il coding con il computer arriva di solito verso i 7-8 anni.",
    comeScegliere: [
      "L'età minima: molte attività di robotica partono dai 6-8 anni.",
      "Se si lavora con le mani (mattoncini, robot) o davanti a uno schermo.",
      "Se è un'attività per la classe, per la famiglia o da fare da soli a casa.",
      "Costi e materiali: kit e robot possono essere a carico delle famiglie.",
    ],
    faq: [
      { domanda: "A che età si può iniziare con il coding?", risposta: "Con giochi di sequenze e direzioni, anche senza schermo, già a 4-5 anni. Il coding a blocchi su computer o tablet è adatto di solito dai 7-8 anni. Su Giocamizi trovi giochi di coding gratuiti per le prime età." },
      { domanda: "Serve comprare un robot?", risposta: "No. Si può iniziare con giochi di carta, frecce disegnate sul pavimento o giochi online gratuiti. Robot e kit aiutano dopo, quando il bambino ha già capito l'idea di sequenza." },
    ],
    ambito: "online",
    schema: "Organization",
    icona: "robot",
    colore: "#E1F3FB",
    sezioneDiRiserva: "coding",
  },
  {
    slug: "fiabe-e-musica-per-bambini",
    nome: "Fiabe, canzoni e lettura",
    breve: "Fiabe e musica",
    titolo: "Fiabe, canzoni e lettura per bambini",
    sottotitolo: "Fiabe da leggere e ascoltare, canzoni e copioni per le recite: per far nascere il piacere di leggere e cantare.",
    rispostaBreve:
      "Fiabe brevi, canzoni e recite sono tra i modi più semplici per far amare la lettura ai bambini: bastano dieci minuti al giorno, meglio se sempre alla stessa ora, ad esempio prima di dormire. Per i più piccoli contano la voce di chi legge e la ripetizione delle storie che già conoscono.",
    comeScegliere: [
      "La lunghezza della storia rispetto all'età e al momento della giornata.",
      "Se si può ascoltare oltre che leggere: aiuta chi non legge ancora.",
      "Per la scuola: se canzoni e copioni si possono usare nelle recite.",
    ],
    faq: [
      { domanda: "Quanto deve durare la lettura della buonanotte?", risposta: "Per i 3-5 anni bastano 5-10 minuti, una storia breve e magari sempre la stessa per qualche sera. Dai 6 anni si può passare a un capitolo al giorno." },
      { domanda: "Dove trovo storie gratuite da leggere ai bambini?", risposta: "Tra i siti di fiabe di questa pagina e nella sezione Storie di Giocamizi, con testi in stampatello, minuscolo e corsivo e la lettura ad alta voce." },
    ],
    ambito: "online",
    schema: "Organization",
    icona: "note",
    colore: "#EFE6FA",
    sezioneDiRiserva: "lettura",
  },
  {
    slug: "scuole-paritarie-infanzia-primaria",
    nome: "Scuole paritarie dell'infanzia e primarie",
    breve: "Scuole",
    titolo: "Scuole paritarie dell'infanzia e primarie",
    sottotitolo: "Micronidi, scuole dell'infanzia e primarie paritarie, laiche e religiose, provincia per provincia.",
    rispostaBreve:
      "Una scuola paritaria fa parte del sistema nazionale di istruzione: rilascia titoli con lo stesso valore della scuola statale, ma ha un suo progetto educativo e spesso una retta. Prima di iscrivere un bambino conviene visitarla in un open day, chiedere la retta con tutte le voci e leggere il piano dell'offerta formativa (PTOF).",
    comeScegliere: [
      "La retta mensile e cosa comprende: mensa, pre e post scuola, materiali, uscite.",
      "Il progetto educativo: lingue, musica, metodo (ad esempio Montessori) e orientamento religioso.",
      "Gli orari e le settimane di apertura, compresi i centri estivi.",
      "Il numero di bambini per sezione e per insegnante.",
      "Le date di open day e iscrizioni: per l'infanzia si chiude di solito tra gennaio e febbraio.",
    ],
    faq: [
      { domanda: "Che differenza c'è tra scuola statale e scuola paritaria?", risposta: "La scuola paritaria è riconosciuta dallo Stato e i suoi titoli valgono come quelli della statale, ma è gestita da un ente privato o religioso con un proprio progetto educativo e di solito chiede una retta." },
      { domanda: "Quando si fanno le iscrizioni alla scuola dell'infanzia?", risposta: "Per le scuole statali le iscrizioni si aprono di solito a gennaio, con le date fissate ogni anno dal Ministero. Le paritarie hanno spesso tempi propri e open day in autunno e inverno: chiedi direttamente alla scuola." },
      { domanda: "Una scuola paritaria costa sempre?", risposta: "Quasi sempre c'è una retta, che varia molto da scuola a scuola. Alcune sono convenzionate con il Comune e hanno rette più basse o legate all'ISEE: chiedi il prospetto completo." },
    ],
    ambito: "territorio",
    schema: "School",
    icona: "abc-mai",
    colore: "#FEF3D1",
  },
  {
    slug: "cooperative-educative",
    nome: "Cooperative e servizi educativi",
    breve: "Cooperative",
    titolo: "Cooperative educative e servizi per l'infanzia",
    sottotitolo: "Le cooperative che gestiscono nidi, spazi gioco, centri estivi, doposcuola e laboratori per bambini e famiglie.",
    rispostaBreve:
      "Le cooperative educative gestiscono molti dei servizi per l'infanzia di un territorio: asili nido, spazi gioco, centri estivi, doposcuola e laboratori, spesso in convenzione con il Comune. Per sapere costi e posti disponibili si guarda il servizio della propria zona, perché ogni Comune ha regole e graduatorie sue.",
    comeScegliere: [
      "Quali servizi gestisce nel tuo Comune: nido, spazio gioco, centro estivo, doposcuola.",
      "Se il servizio è in convenzione con il Comune (tariffe e graduatorie comunali) o privato.",
      "Le età accolte e gli orari.",
      "Se ci sono attività per i genitori: incontri, sportelli, gruppi.",
    ],
    faq: [
      { domanda: "Cosa fa una cooperativa educativa?", risposta: "Gestisce servizi per bambini e famiglie: asili nido, scuole dell'infanzia, spazi gioco, centri estivi, doposcuola e progetti nelle scuole, spesso per conto del Comune." },
      { domanda: "Come si iscrive un bambino a un nido gestito da una cooperativa?", risposta: "Se il nido è comunale, la domanda si fa al Comune nei tempi del bando, anche se poi il servizio lo gestisce la cooperativa. Se è privato, ci si rivolge direttamente alla cooperativa." },
    ],
    ambito: "territorio",
    schema: "EducationalOrganization",
    icona: "puzzle",
    colore: "#F6E3CF",
    sezioneDiRiserva: "territorio",
  },
  {
    slug: "natura-musei-uscite-didattiche",
    nome: "Natura, musei e uscite didattiche",
    breve: "Natura e musei",
    titolo: "Educazione in natura, musei e uscite didattiche",
    sottotitolo: "Asili nel bosco, educazione ambientale, laboratori nei musei e gite scolastiche per bambini e classi.",
    rispostaBreve:
      "L'educazione all'aperto, i laboratori nei musei e le uscite didattiche fanno imparare con il corpo e con gli occhi: i bambini toccano, osservano e fanno domande. Per le classi si prenotano di solito con mesi di anticipo; per le famiglie ci sono spesso laboratori nel fine settimana e centri estivi.",
    comeScegliere: [
      "Per chi è: classi su prenotazione, famiglie nel fine settimana o centri estivi.",
      "L'età consigliata e la durata dell'attività.",
      "Cosa succede se piove, per le attività all'aperto.",
      "Costi a bambino e se il trasporto è compreso, per le gite scolastiche.",
    ],
    faq: [
      { domanda: "Cos'è un asilo nel bosco?", risposta: "È un servizio per l'infanzia che passa gran parte della giornata all'aperto, con ogni tempo, seguendo i principi dell'educazione in natura. In Italia ci sono reti che mettono in contatto scuole, educatori e famiglie interessate." },
      { domanda: "Con quanto anticipo si prenota un'uscita didattica?", risposta: "Per le classi conviene muoversi a inizio anno scolastico: musei e fattorie didattiche riempiono presto le date di primavera." },
    ],
    ambito: "territorio",
    schema: "EducationalOrganization",
    icona: "albero",
    colore: "#E3F4E8",
  },
  // Pronte per le prossime realtà: compaiono da sole alla prima scheda.
  {
    slug: "sostegno-ai-genitori",
    nome: "Sostegno ai genitori",
    breve: "Sostegno genitori",
    titolo: "Sostegno ai genitori: centri per le famiglie e sportelli",
    sottotitolo: "Centri per le famiglie, sportelli di ascolto, gruppi di genitori e servizi di supporto alla genitorialità.",
    rispostaBreve:
      "I centri per le famiglie e gli sportelli di sostegno alla genitorialità offrono ascolto, incontri e gruppi per mamme e papà, spesso gratuiti perché legati al Comune o all'ASL. Sono pensati per le fatiche normali del crescere un figlio, non solo per le emergenze.",
    comeScegliere: [
      "Se il servizio è pubblico (Comune, ASL) o privato, e quanto costa.",
      "Per quali età dei figli è pensato.",
      "Se serve un appuntamento o ci sono incontri aperti.",
    ],
    faq: [
      { domanda: "Cos'è un centro per le famiglie?", risposta: "È un servizio, spesso comunale, che offre ascolto, incontri, gruppi di genitori e informazioni sui servizi per bambini del territorio. Di solito è gratuito." },
    ],
    ambito: "territorio",
    schema: "Organization",
    icona: "cuore-viola",
    colore: "#FCE1EC",
  },
  {
    slug: "doposcuola-e-aiuto-compiti",
    nome: "Doposcuola e aiuto compiti",
    breve: "Doposcuola",
    titolo: "Doposcuola e aiuto compiti per bambini",
    sottotitolo: "Doposcuola, aiuto compiti e attività pomeridiane per i bambini della primaria.",
    rispostaBreve:
      "Un doposcuola segue i bambini nel pomeriggio, aiuta con i compiti e spesso propone giochi e laboratori. Prima di scegliere conviene chiedere quanti bambini ci sono per educatore, se c'è un servizio di ritiro da scuola e quanto costa al mese.",
    comeScegliere: [
      "Quanti bambini per educatore.",
      "Se c'è il ritiro da scuola e fino a che ora si resta.",
      "Il costo mensile e i giorni minimi di frequenza.",
    ],
    faq: [
      { domanda: "Il doposcuola fa fare tutti i compiti?", risposta: "Dipende dal servizio: molti affiancano i bambini nei compiti, ma un'occhiata dei genitori la sera resta utile. Chiedi come funziona prima di iscriverti." },
    ],
    ambito: "territorio",
    schema: "EducationalOrganization",
    icona: "matita",
    colore: "#E1F3FB",
  },
];

/**
 * La categoria di ogni risorsa già pubblicata (14/11/2026). Una risorsa nuova
 * senza riga qui finisce nella categoria della sua prima sezione.
 */
const ASSEGNAZIONI: Record<string, string> = {
  "bimbisani-e-belli": "blog-per-genitori",
  "mamme-a-milano": "blog-per-genitori",
  "mamme-magazine": "blog-per-genitori",
  "mamme-venete": "blog-per-genitori",
  "mimom-mag": "blog-per-genitori",
  "punto-e-virgola-mamma": "blog-per-genitori",
  viaggiapiccoli: "blog-per-genitori",

  fantavolando: "schede-didattiche-per-insegnanti",
  "maestra-e-mamma": "schede-didattiche-per-insegnanti",
  "maestra-giulia": "schede-didattiche-per-insegnanti",
  "maestra-ilaria": "schede-didattiche-per-insegnanti",
  "maestro-roberto": "schede-didattiche-per-insegnanti",
  "pedagogika-it": "schede-didattiche-per-insegnanti",
  "portale-bambini": "schede-didattiche-per-insegnanti",

  "brick-education": "coding-e-stem-per-bambini",
  eduinaf: "coding-e-stem-per-bambini",

  "mela-music": "fiabe-e-musica-per-bambini",
  "tempo-di-fiabe": "fiabe-e-musica-per-bambini",

  "european-school-of-trieste": "scuole-paritarie-infanzia-primaria",
  "istituto-figlie-di-sant-anna": "scuole-paritarie-infanzia-primaria",
  "istituto-principessa-clotilde-di-savoia": "scuole-paritarie-infanzia-primaria",
  "marcelline-foggia": "scuole-paritarie-infanzia-primaria",
  "phoenix-international-school-phis": "scuole-paritarie-infanzia-primaria",
  "scuola-dell-infanzia-mons-giacomo-jop": "scuole-paritarie-infanzia-primaria",
  "scuola-dell-infanzia-paritaria-mons-f-bellando": "scuole-paritarie-infanzia-primaria",
  "scuola-infanzia-maria-ausiliatrice": "scuole-paritarie-infanzia-primaria",
  "scuola-maria-bambina-marcon": "scuole-paritarie-infanzia-primaria",
  "scuola-materna-giuseppe-bionda": "scuole-paritarie-infanzia-primaria",
  "scuola-primaria-paritaria-figlie-di-carita": "scuole-paritarie-infanzia-primaria",

  "accento-cooperativa-sociale": "cooperative-educative",
  "avalon-cooperativa-sociale": "cooperative-educative",
  "cinquepiu-cooperativa-sociale": "cooperative-educative",
  "codess-sociale": "cooperative-educative",
  "cometa-cooperativa-sociale": "cooperative-educative",
  "coop-21-cooperativa-sociale": "cooperative-educative",
  "cooperativa-indaco": "cooperative-educative",
  "geco-cooperativa-sociale": "cooperative-educative",
  "koine-cooperativa-sociale": "cooperative-educative",
  "ricreazione-cooperativa": "cooperative-educative",

  "artificio-societa-cooperativa": "natura-musei-uscite-didattiche",
  canalescuola: "natura-musei-uscite-didattiche",
  ecofficine: "natura-musei-uscite-didattiche",
  "educ-a-land": "natura-musei-uscite-didattiche",
  "educazione-in-natura-cen": "natura-musei-uscite-didattiche",
};

/** Le province delle località (sigla → nome): una sigla nuova = una riga qui. */
export const PROVINCE: Record<string, string> = {
  AG: "Agrigento", AL: "Alessandria", AN: "Ancona", AR: "Arezzo", AT: "Asti", BA: "Bari", BG: "Bergamo",
  BI: "Biella", BL: "Belluno", BN: "Benevento", BO: "Bologna", BR: "Brindisi", BS: "Brescia", BZ: "Bolzano",
  CA: "Cagliari", CB: "Campobasso", CE: "Caserta", CH: "Chieti", CN: "Cuneo", CO: "Como", CR: "Cremona",
  CS: "Cosenza", CT: "Catania", CZ: "Catanzaro", FC: "Forlì-Cesena", FE: "Ferrara", FG: "Foggia", FI: "Firenze",
  FR: "Frosinone", GE: "Genova", GO: "Gorizia", GR: "Grosseto", LC: "Lecco", LE: "Lecce", LI: "Livorno",
  LO: "Lodi", LT: "Latina", LU: "Lucca", MB: "Monza e Brianza", MC: "Macerata", ME: "Messina", MI: "Milano",
  MN: "Mantova", MO: "Modena", NA: "Napoli", NO: "Novara", PA: "Palermo", PC: "Piacenza", PD: "Padova",
  PE: "Pescara", PG: "Perugia", PI: "Pisa", PN: "Pordenone", PO: "Prato", PR: "Parma", PT: "Pistoia",
  PU: "Pesaro e Urbino", PV: "Pavia", PZ: "Potenza", RA: "Ravenna", RC: "Reggio Calabria", RE: "Reggio Emilia",
  RM: "Roma", RN: "Rimini", SA: "Salerno", SI: "Siena", SP: "La Spezia", SS: "Sassari", SV: "Savona",
  TA: "Taranto", TN: "Trento", TO: "Torino", TP: "Trapani", TR: "Terni", TS: "Trieste", TV: "Treviso",
  UD: "Udine", VA: "Varese", VE: "Venezia", VI: "Vicenza", VR: "Verona", VT: "Viterbo",
};

export const categoriaRisorsaDaSlug = (slug: string) => CATEGORIE_RISORSE.find((c) => c.slug === slug);

export function categoriaDiRisorsa(r: Pick<Risorsa, "slug" | "sezioni">): CategoriaRisorsa {
  const esplicita = ASSEGNAZIONI[r.slug] && categoriaRisorsaDaSlug(ASSEGNAZIONI[r.slug]!);
  if (esplicita) return esplicita;
  return CATEGORIE_RISORSE.find((c) => c.sezioneDiRiserva === r.sezioni[0]) ?? CATEGORIE_RISORSE[0]!;
}

/** "Rivalta di Torino (TO)" → { comune, sigla, provincia, slug }. */
export function provinciaDi(r: Pick<Risorsa, "localita">) {
  const m = r.localita?.match(/^(.*?)\s*\(([A-Z]{2})\)\s*$/);
  if (!m) return null;
  const nome = PROVINCE[m[2]!];
  if (!nome) return null;
  return { comune: m[1]!, sigla: m[2]!, provincia: nome, slug: slugify(nome) };
}

/** Le risorse della categoria (dall'elenco già filtrato dalle rimozioni). */
export function risorseDi<T extends Risorsa>(cat: string, elenco: T[], provincia?: string): T[] {
  return elenco
    .filter((r) => categoriaDiRisorsa(r).slug === cat && (!provincia || provinciaDi(r)?.slug === provincia))
    .sort((a, b) => a.nome.localeCompare(b.nome, "it"));
}

/** Le province della categoria con quante realtà ha ognuna (più ricche prima). */
export function provinceDi<T extends Risorsa>(cat: string, elenco: T[]) {
  const conteggi = new Map<string, { slug: string; provincia: string; n: number }>();
  for (const r of risorseDi(cat, elenco)) {
    const p = provinciaDi(r);
    if (!p) continue;
    const v = conteggi.get(p.slug) ?? { slug: p.slug, provincia: p.provincia, n: 0 };
    v.n++;
    conteggi.set(p.slug, v);
  }
  return [...conteggi.values()].sort((a, b) => b.n - a.n || a.provincia.localeCompare(b.provincia, "it"));
}

/** Le categorie con almeno una scheda: le sole che diventano pagina. */
export function categorieAttive<T extends Risorsa>(elenco: T[]) {
  return CATEGORIE_RISORSE.filter((c) => risorseDi(c.slug, elenco).length > 0);
}

/** Le pagine provincia che esistono davvero (solo categorie sul territorio, almeno MIN_LISTING_RISORSE schede). */
export function listingRisorse<T extends Risorsa>(elenco: T[]) {
  return categorieAttive(elenco)
    .filter((c) => c.ambito === "territorio")
    .flatMap((c) =>
      provinceDi(c.slug, elenco)
        .filter((p) => p.n >= MIN_LISTING_RISORSE)
        .map((p) => ({ categoria: c, provincia: p.provincia, slug: p.slug, n: p.n })),
    );
}

export const percorsoCategoriaRisorse = (c: Pick<CategoriaRisorsa, "slug">) => `${PERCORSO_RISORSE}/${c.slug}`;
export const percorsoListingRisorse = (c: Pick<CategoriaRisorsa, "slug">, provincia: string) =>
  `${PERCORSO_RISORSE}/${c.slug}/${provincia}`;

/** La risposta breve della pagina provincia, costruita dai dati veri. */
export function rispostaListingRisorse(cat: CategoriaRisorsa, provincia: string, voci: Risorsa[]) {
  const comuni = [...new Set(voci.map((r) => provinciaDi(r)?.comune).filter(Boolean))] as string[];
  const elenco = comuni.length > 1 ? `${comuni.slice(0, -1).join(", ")} e ${comuni.at(-1)}` : comuni[0];
  return (
    `In provincia di ${provincia} abbiamo raccolto ${voci.length} ${cat.nome.toLowerCase()}, tra ${elenco}. ` +
    `Ogni scheda riporta quello che la realtà scrive sul suo sito ufficiale: ` +
    `costi, orari e posti disponibili vanno sempre chiesti direttamente a loro.`
  );
}
