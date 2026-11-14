/**
 * Eventi di Natale per bambini, città per città (/natale/eventi/<città>).
 *
 * REGOLE (come per le feste in lib/feste.ts):
 * - solo eventi dell'edizione in corso con date confermate da una fonte
 *   ufficiale (organizzatore, comune, ente turistico) o da un giornale locale
 *   che riporta il programma: mai date, orari o prezzi inventati;
 * - la descrizione dice solo ciò che dice la fonte; link nofollow;
 * - niente foto prese dai siti; niente personaggi protetti nelle descrizioni;
 * - gli eventi finiti spariscono da soli (campo `al`).
 */

export type TipoEvento =
  | "villaggio"
  | "casa-babbo-natale"
  | "mercatino"
  | "laboratorio"
  | "spettacolo"
  | "pattinaggio"
  | "presepe"
  | "luminarie"
  | "altro";

export const NOMI_TIPO_EVENTO: Record<TipoEvento, string> = {
  villaggio: "Villaggio di Babbo Natale",
  "casa-babbo-natale": "Casa di Babbo Natale",
  mercatino: "Mercatino di Natale",
  laboratorio: "Laboratorio per bambini",
  spettacolo: "Spettacolo",
  pattinaggio: "Pista di pattinaggio",
  presepe: "Presepe",
  luminarie: "Luci e luminarie",
  altro: "Evento di Natale",
};

export interface EventoNatale {
  nome: string;
  tipo: TipoEvento;
  luogo: string;
  zona: string;
  /** AAAA-MM-GG */
  dal: string;
  /** AAAA-MM-GG */
  al: string;
  orari?: string;
  prezzo?: string;
  eta?: string;
  descrizione: string;
  sito?: string;
  /** La pagina che conferma l'edizione in corso. */
  fonte: string;
}

export interface CittaEventi {
  slug: string;
  citta: string;
  eventi: EventoNatale[];
}

/** Ultimo controllo delle fonti. */
export const EVENTI_VERIFICATI_IL = "2026-11-14";

// Città con almeno 3 eventi verificati (14/11/2026). Firenze, Reggio Emilia e
// Catania: meno di 3 eventi 2026 confermati, da ricontrollare a fine novembre.
export const CITTA_EVENTI: CittaEventi[] = [
  {
    "slug": "napoli",
    "citta": "Napoli",
    "eventi": [
      {
        "nome": "Fiera di Natale di San Gregorio Armeno",
        "tipo": "mercatino",
        "luogo": "Via San Gregorio Armeno e traverse",
        "zona": "Centro storico (Decumani), Napoli",
        "dal": "2026-11-01",
        "al": "2027-01-10",
        "prezzo": "ingresso libero",
        "descrizione": "La fiera di Natale della strada dei presepi, con casette lungo i Decumani e nelle traverse; ingresso libero e senza prenotazione.",
        "fonte": "https://www.napolike.it/mercatini-di-natale-2026-napoli-e-provincia"
      },
      {
        "nome": "Mercatini di Natale al Museo di Pietrarsa",
        "tipo": "casa-babbo-natale",
        "luogo": "Museo Nazionale Ferroviario di Pietrarsa",
        "zona": "Portici / San Giorgio a Cremano (NA)",
        "dal": "2026-11-28",
        "al": "2027-01-06",
        "orari": "10-22, ultimo ingresso alle 21; chiuso 30 novembre, 9, 14, 21, 24, 25 e 31 dicembre 2026 e 1 gennaio 2027",
        "prezzo": "8 € feriali fino alle 15; 12 € weekend e festivi; 6 € ridotto bambini 3-12 anni; gratis fino a 2 anni",
        "eta": "ridotto 3-12 anni",
        "descrizione": "Mercatini tra le locomotive storiche del museo ferroviario, con spettacoli, parate, casa di Babbo Natale e attività per bambini.",
        "fonte": "https://www.napolike.it/mercatini-di-natale-2026-napoli-e-provincia"
      },
      {
        "nome": "Valle del Natale",
        "tipo": "villaggio",
        "luogo": "Parco Valle dell'Orso, via Giovanni XXIII 54",
        "zona": "Torre del Greco (NA)",
        "dal": "2026-11-28",
        "al": "2026-12-26",
        "orari": "11-20.30, solo nei giorni 28 e 29 novembre; 5, 6, 7, 8, 12, 13, 19, 20, 21, 22, 23 e 26 dicembre 2026",
        "prezzo": "a pagamento, biglietti online sul sito del parco",
        "descrizione": "Il parco diventa un villaggio di Natale con la baita di Babbo Natale, lo chalet di Mrs. Claus, l'ufficio postale degli elfi e spettacoli sul Molo Nord.",
        "fonte": "https://www.napolike.it/mercatini-di-natale-2026-napoli-e-provincia"
      },
      {
        "nome": "Mercatini al Castello di Lettere",
        "tipo": "mercatino",
        "luogo": "Castello Medievale di Lettere",
        "zona": "Lettere (NA)",
        "dal": "2026-11-14",
        "al": "2026-12-20",
        "orari": "16-23, ultimo ingresso alle 22; nei giorni 14, 15, 21, 22, 28 e 29 novembre e 5, 6, 7, 8, 12, 13, 19 e 20 dicembre 2026",
        "prezzo": "8 € adulti; 5 € bambini 6-12 anni; gratis residenti e bambini fino a 5 anni",
        "eta": "ridotto 6-12 anni",
        "descrizione": "Mercatini di Natale nel castello medievale con laboratori, animazione e spettacoli per famiglie.",
        "fonte": "https://www.napolike.it/mercatini-di-natale-2026-napoli-e-provincia"
      },
      {
        "nome": "Mercatini al Castello di Ottaviano",
        "tipo": "mercatino",
        "luogo": "Palazzo Mediceo (castello)",
        "zona": "Ottaviano (NA)",
        "dal": "2026-11-28",
        "al": "2026-12-13",
        "orari": "28 e 29 novembre e dal 4 al 13 dicembre 2026; weekend inaugurale 18-23",
        "prezzo": "gratis",
        "descrizione": "Mercatini nel castello con animazione per bambini e aree ristoro; c'è una navetta dal centro.",
        "fonte": "https://www.napolike.it/mercatini-di-natale-2026-napoli-e-provincia"
      },
      {
        "nome": "Natale in Reggia",
        "tipo": "altro",
        "luogo": "Reggia di Portici (sale borboniche, Galoppatoio Reale, Orto Botanico)",
        "zona": "Portici (NA)",
        "dal": "2026-12-03",
        "al": "2027-01-06",
        "prezzo": "gratis",
        "descrizione": "La Reggia si veste a festa con laboratori, visite guidate e teatralizzate, spettacoli e degustazioni; il calendario dettagliato è ancora in aggiornamento.",
        "fonte": "https://www.napolike.it/mercatini-di-natale-2026-napoli-e-provincia"
      },
      {
        "nome": "Christmas Dreams",
        "tipo": "pattinaggio",
        "luogo": "Arena Spettacoli del centro commerciale Vulcano Buono",
        "zona": "Nola (NA)",
        "dal": "2026-11-14",
        "al": "2027-01-06",
        "prezzo": "ingresso libero; spettacoli gratuiti",
        "descrizione": "Quarta edizione del villaggio natalizio su oltre 3.000 mq, con pista di pattinaggio e ruota panoramica.",
        "fonte": "https://www.napolike.it/mercatini-di-natale-2026-napoli-e-provincia"
      }
    ]
  },
  {
    "slug": "roma",
    "citta": "Roma",
    "eventi": [
      {
        "nome": "Christmas World",
        "tipo": "villaggio",
        "luogo": "Galoppatoio di Villa Borghese, viale del Galoppatoio",
        "zona": "Villa Borghese, Roma",
        "dal": "2026-11-28",
        "al": "2027-01-10",
        "descrizione": "Villaggio di Natale con giostre, ottovolante, mongolfiere, minicar, Ice Bumper e Ice Slide pensati per tutte le età, più parate e il Grande Spettacolo di Natale.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/08/mercatini-natale-roma-2026"
      },
      {
        "nome": "Natale a Cinecittà World",
        "tipo": "spettacolo",
        "luogo": "Cinecittà World",
        "zona": "Roma",
        "dal": "2026-11-07",
        "al": "2027-01-06",
        "orari": "show di benvenuto alle 11 sulla Main Street",
        "descrizione": "Il parco a tema propone attrazioni natalizie, il musical «Il posto delle cose perdute» e l'animazione «Elf Express» nell'area Wild West.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/08/mercatini-natale-roma-2026"
      },
      {
        "nome": "Ethica Christmas Village – Natale Altromercato",
        "tipo": "pattinaggio",
        "luogo": "Città dell'Altra Economia, Largo Dino Frisullo",
        "zona": "Testaccio, Roma",
        "dal": "2026-11-07",
        "al": "2027-01-10",
        "orari": "lunedì-venerdì 12-20; sabato e domenica 10-20",
        "prezzo": "gratis",
        "descrizione": "Villaggio di Natale a ingresso gratuito con mercatino e pista di pattinaggio sul ghiaccio.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/08/mercatini-natale-roma-2026"
      },
      {
        "nome": "Christmas Garden all'Orto Botanico",
        "tipo": "luminarie",
        "luogo": "Orto Botanico di Roma",
        "zona": "Trastevere, Roma",
        "dal": "2026-11-19",
        "al": "2027-01-10",
        "orari": "tutti i giorni 17-23",
        "descrizione": "Un percorso di circa 2 km tra installazioni luminose e paesaggi sonori.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/08/mercatini-natale-roma-2026"
      },
      {
        "nome": "Storie di Natale",
        "tipo": "spettacolo",
        "luogo": "Teatro di Roma – Teatro India, Lungotevere Vittorio Gassman 1",
        "zona": "Portuense, Roma",
        "dal": "2026-12-21",
        "al": "2027-01-06",
        "orari": "ore 10.30",
        "descrizione": "Letture di storie di Natale di Gianni Rodari e testi nuovi di Bernard Friot e Andrea Valente, con il pubblico che inventa storie con i metodi creativi di Rodari; per grandi e piccini (il programma può subire variazioni).",
        "fonte": "https://www.turismoroma.it/it/eventi/storie-di-natale-4"
      },
      {
        "nome": "Un magico Natale con Carolina",
        "tipo": "spettacolo",
        "luogo": "Teatro Brancaccio, via Merulana 244",
        "zona": "Esquilino, Roma",
        "dal": "2026-12-08",
        "al": "2026-12-08",
        "orari": "ore 15 e ore 18",
        "descrizione": "Spettacolo musicale di Carolina Benvenga e Morena D'Onofrio: la neve blocca i bambini a scuola prima delle vacanze e la maestra li aiuta a scoprire il valore del lavoro di squadra.",
        "fonte": "https://turismoroma.it/es/node/175754"
      },
      {
        "nome": "Mercatino di Natale e Befana a Piazza Navona",
        "tipo": "mercatino",
        "luogo": "Piazza Navona",
        "zona": "Centro storico, Roma",
        "dal": "2026-12-01",
        "al": "2027-01-06",
        "descrizione": "Il tradizionale mercatino della piazza; la mattina del 6 gennaio la Befana arriva con i Vigili del Fuoco e la loro banda e distribuisce dolci e caramelle.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/08/mercatini-natale-roma-2026"
      }
    ]
  },
  {
    "slug": "milano",
    "citta": "Milano",
    "eventi": [
      {
        "nome": "Villaggio delle Meraviglie",
        "tipo": "villaggio",
        "luogo": "Giardini Indro Montanelli",
        "zona": "Porta Venezia, Milano",
        "dal": "2026-11-20",
        "al": "2027-01-10",
        "orari": "tutti i giorni 10-21",
        "descrizione": "Villaggio di Natale con doppia pista di pattinaggio, giostre a tema e Casa di Babbo Natale fino al 25 dicembre; dal 26 dicembre c'è Mamma Natale e dal 4 al 6 gennaio la Befana.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/06/mercatini-natale-milano-2026"
      },
      {
        "nome": "Fiera degli Oh Bej! Oh Bej!",
        "tipo": "mercatino",
        "luogo": "Castello Sforzesco (piazza Castello, viale Gadio, piazza del Cannone)",
        "zona": "Centro, Milano",
        "dal": "2026-12-05",
        "al": "2026-12-08",
        "orari": "8.30-21",
        "descrizione": "La storica fiera di Sant'Ambrogio intorno al Castello Sforzesco, con bancarelle dove si trovano anche giocattoli.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/06/mercatini-natale-milano-2026"
      },
      {
        "nome": "Natale in BiM",
        "tipo": "laboratorio",
        "luogo": "BiM Bicocca",
        "zona": "Bicocca, Milano",
        "dal": "2026-12-03",
        "al": "2026-12-03",
        "orari": "dal mattino a tarda notte",
        "prezzo": "gratis",
        "descrizione": "Una giornata di iniziative gratuite con laboratori per adulti e bambini a cura de I Distratti.",
        "fonte": "https://tg24.sky.it/lifestyle/2026/11/06/mercatini-natale-milano-2026"
      },
      {
        "nome": "Gli Elfi di Babbo Natale (I Fantaweekend)",
        "tipo": "spettacolo",
        "luogo": "Teatro Carcano, corso di Porta Romana 63",
        "zona": "Porta Romana, Milano",
        "dal": "2026-11-29",
        "al": "2026-11-29",
        "orari": "ore 11",
        "eta": "dai 3 anni",
        "descrizione": "Spettacolo di Fantateatro con danza e canzoni dal vivo: alla vigilia di Natale gli scherzi dei nuovi apprendisti elfi mettono a rischio la consegna dei regali, fino al lieto fine.",
        "fonte": "https://www.mentelocale.it/milano/129748-fantaweekend-gli-elfi-di-babbo-natale.htm"
      },
      {
        "nome": "Favole di Natale al Museo Bagatti Valsecchi",
        "tipo": "laboratorio",
        "luogo": "Museo Bagatti Valsecchi, via Gesù 5",
        "zona": "Quadrilatero, Milano",
        "dal": "2026-12-19",
        "al": "2026-12-19",
        "orari": "ore 15",
        "descrizione": "Visita guidata interattiva per bambini e famiglie nella collezione del museo, che si chiude con la lettura di storie natalizie nel salone.",
        "fonte": "https://www.mentelocale.it/milano/113298-visita-e-laboratorio-per-famiglie-favole-di-natale.htm"
      }
    ]
  },
  {
    "slug": "verona",
    "citta": "Verona",
    "eventi": [
      {
        "nome": "Mercatini di Natale di Verona",
        "tipo": "mercatino",
        "luogo": "Piazza Bra e Piazza dei Signori",
        "zona": "Centro storico, Verona",
        "dal": "2026-11-20",
        "al": "2026-12-27",
        "orari": "domenica-giovedì 10-21; venerdì e sabato 10-23; 24 dicembre 10-17; 25 dicembre 16-23; 27 dicembre 10-18",
        "descrizione": "Diciottesima edizione con chalet di artigianato ed enogastronomia in Piazza Bra e il Villaggio di Natale Flover in Piazza dei Signori; l'inaugurazione con l'accensione delle luminarie è sabato 21 novembre alle 17 in Piazza Bra.",
        "sito": "https://www.nataleinpiazza.it",
        "fonte": "https://www.nataleinpiazza.it"
      },
      {
        "nome": "Pista di pattinaggio all'Arsenale",
        "tipo": "pattinaggio",
        "luogo": "Piazza Sacco e Vanzetti (Arsenale)",
        "zona": "Borgo Trento, Verona",
        "dal": "2026-11-20",
        "al": "2026-12-27",
        "descrizione": "Pista di pattinaggio su ghiaccio allestita nell'area dell'Arsenale come parte dei Mercatini di Natale di Verona.",
        "sito": "https://www.nataleinpiazza.it",
        "fonte": "https://www.nataleinpiazza.it"
      },
      {
        "nome": "Villaggio di Natale Flover",
        "tipo": "villaggio",
        "luogo": "Flover Garden Center, via Pastrengo 14",
        "zona": "Bussolengo (VR)",
        "dal": "2026-11-07",
        "al": "2027-01-06",
        "orari": "tutti i giorni 9-19.30; chiuso 25 dicembre e 1 gennaio",
        "descrizione": "Trentesima edizione del villaggio: i bambini possono incontrare Babbo Natale e consegnargli la letterina, con animazioni e spettacoli ogni weekend e cene con Babbo Natale su prenotazione.",
        "sito": "https://www.ilvillaggiodinatale.it",
        "fonte": "https://www.flover.it/"
      }
    ]
  },
  {
    "slug": "torino",
    "citta": "Torino",
    "eventi": [
      {
        "nome": "Luci d'Artista",
        "tipo": "luminarie",
        "luogo": "Strade e piazze del centro, Politecnico, OGR",
        "zona": "Torino",
        "dal": "2026-10-23",
        "al": "2027-01-10",
        "descrizione": "Ventinovesima edizione: 31 installazioni luminose d'artista in strade, piazze e luoghi simbolo della città, quattro delle quali nuove.",
        "fonte": "https://www.mentelocale.it/torino/144508-luci-d-artista-parte-l-edizione-2026-con-trentuno-installazioni-luminose.htm"
      },
      {
        "nome": "Natale è Reale",
        "tipo": "casa-babbo-natale",
        "luogo": "Palazzina di Caccia di Stupinigi, piazza Principe Amedeo 7",
        "zona": "Nichelino (TO)",
        "dal": "2026-11-28",
        "al": "2026-12-13",
        "orari": "28-29 novembre e 5, 6, 7, 8, 12, 13 dicembre 2026; di solito 10-19.30, domenica 29 novembre 13-21",
        "descrizione": "Villaggio di Babbo Natale con casa, elfi al lavoro, ufficio postale e laboratori, giochi in legno, uno spettacolo cantato e ballato, una mostra di trenini e presepi.",
        "sito": "https://www.natalereale.it",
        "fonte": "https://www.natalereale.it"
      },
      {
        "nome": "Il Villaggio di Natale a Torino Outlet Village",
        "tipo": "pattinaggio",
        "luogo": "Torino Outlet Village",
        "zona": "Settimo Torinese (TO)",
        "dal": "2026-11-14",
        "al": "2027-01-31",
        "descrizione": "Pista di pattinaggio in piazza dell'Acqua fino al 31 gennaio, giostra a cavalli e Casa di Babbo Natale fino al 7 gennaio, con incontri con Babbo Natale l'8, 12, 13, 19 e 20 dicembre e nevicate artificiali in alcuni sabati.",
        "sito": "https://www.torinooutletvillage.com",
        "fonte": "https://www.mentelocale.it/torino/147120-il-villaggio-di-natale-a-torino-outlet-village-pista-di-pattinaggio-nevicate-artificiali-e-shopping.htm"
      },
      {
        "nome": "Prossima destinazione: Natale!",
        "tipo": "spettacolo",
        "luogo": "Teatro Garybaldi, via Partigiani 4",
        "zona": "Settimo Torinese (TO)",
        "dal": "2026-12-06",
        "al": "2026-12-06",
        "orari": "ore 15.30 e ore 17",
        "descrizione": "Spettacolo di circo contemporaneo dell'Accademia Cirko Vertigo per tutta la famiglia: artisti bloccati in aeroporto alla vigilia di Natale raccontano le tradizioni delle loro terre.",
        "fonte": "https://www.mentelocale.it/torino/137405-prossima-destinazione-natale-accademia-cirko-vertigo.htm"
      },
      {
        "nome": "Canto di Natale (Favole a Merenda)",
        "tipo": "spettacolo",
        "luogo": "Teatro della Concordia, corso Puccini",
        "zona": "Venaria Reale (TO)",
        "dal": "2026-12-06",
        "al": "2026-12-06",
        "orari": "ore 16",
        "descrizione": "Spettacolo per bambini e famiglie di e con Irene Paoletti e Pablo Torregiani, liberamente tratto dal racconto di Charles Dickens.",
        "fonte": "https://www.mentelocale.it/torino/132500-canto-di-natale.htm"
      },
      {
        "nome": "Il bosco delle storie di Natale",
        "tipo": "spettacolo",
        "luogo": "Teatro Garybaldi, via Partigiani 4",
        "zona": "Settimo Torinese (TO)",
        "dal": "2026-12-27",
        "al": "2026-12-27",
        "orari": "ore 15.30 e ore 17",
        "eta": "dai 3 anni",
        "descrizione": "Spettacolo di Drogheria Rebelot: nella notte della Vigilia i personaggi dei libri prendono vita nella cameretta e intrecciano la tradizione natalizia con l'immaginazione dei bambini.",
        "fonte": "https://www.mentelocale.it/torino/137403-bosco-delle-storie-natale-drogheria-rebelot.htm"
      }
    ]
  },
  {
    "slug": "arezzo",
    "citta": "Arezzo",
    "eventi": [
      {
        "nome": "Villaggio Tirolese e Grande Mercatino di Natale",
        "tipo": "mercatino",
        "luogo": "Piazza Grande",
        "zona": "Centro storico, Arezzo",
        "dal": "2026-11-14",
        "al": "2027-01-06",
        "descrizione": "Casette di legno con artigiani ed espositori dall'area alpina, dall'Austria e dalla Germania, con decorazioni e prodotti tipici, cuore di Arezzo Città del Natale.",
        "sito": "https://www.arezzocittadelnatale.it",
        "fonte": "https://www.arezzocittadelnatale.it/"
      },
      {
        "nome": "Pista di ghiaccio di Arezzo Città del Natale",
        "tipo": "pattinaggio",
        "luogo": "Arezzo Città del Natale",
        "zona": "Arezzo",
        "dal": "2026-11-14",
        "al": "2027-01-06",
        "descrizione": "Pista di pattinaggio sul ghiaccio inserita nel programma di Arezzo Città del Natale.",
        "sito": "https://www.arezzocittadelnatale.it",
        "fonte": "https://www.arezzocittadelnatale.it/"
      },
      {
        "nome": "Estra Terrestre",
        "tipo": "altro",
        "luogo": "Arezzo Città del Natale",
        "zona": "Arezzo",
        "dal": "2026-11-19",
        "al": "2027-01-06",
        "descrizione": "Mostra interattiva su spazio e Luna con reperti della missione Apollo 11, meteoriti da toccare e l'incontro con un addetto vestito da astronauta.",
        "sito": "https://www.arezzocittadelnatale.it",
        "fonte": "https://www.arezzocittadelnatale.it/"
      },
      {
        "nome": "Eurochocolate al Christmas Village",
        "tipo": "laboratorio",
        "luogo": "Parco Il Prato e Piazza Grande",
        "zona": "Centro storico, Arezzo",
        "dal": "2026-11-14",
        "al": "2027-01-06",
        "descrizione": "Un'area dedicata al cacao con golosità e curiosità al Prato e il laboratorio «Costruttori di Dolcezze» in Piazza Grande, a tema Pinocchio.",
        "sito": "https://www.arezzocittadelnatale.it",
        "fonte": "https://www.arezzocittadelnatale.it/"
      },
      {
        "nome": "Villaggio di Natale nella Fortezza Medicea",
        "tipo": "villaggio",
        "luogo": "Fortezza Medicea",
        "zona": "Arezzo",
        "dal": "2026-11-14",
        "al": "2027-01-06",
        "descrizione": "Oltre 10.000 mq con coreografie, giochi di luce e attrazioni natalizie, dentro il programma di Arezzo Città del Natale (le date sono quelle dell'intera manifestazione).",
        "sito": "https://www.arezzocittadelnatale.it",
        "fonte": "https://siviaggia.it/notizie/espresso-natale-roma-arezzo-2026/603511/"
      },
      {
        "nome": "Espresso Natale da Roma ad Arezzo",
        "tipo": "altro",
        "luogo": "Treno da Roma Termini ad Arezzo",
        "zona": "Arezzo (partenza da Roma)",
        "dal": "2026-11-29",
        "al": "2026-12-27",
        "orari": "solo le domeniche 29 novembre, 6, 13, 20 e 27 dicembre 2026; partenza da Roma Termini tra le 8 e le 8.30, rientro da Arezzo tra le 20.45 e le 21.30",
        "prezzo": "adulti 79 €; bambini 6-14 anni 49 €; sotto i 6 anni gratis senza posto assegnato",
        "eta": "gratis sotto i 6 anni",
        "descrizione": "Un treno della domenica da Roma per passare la giornata ad Arezzo Città del Natale, con carrozza ristorante e staff che accompagna i passeggeri.",
        "fonte": "https://siviaggia.it/notizie/espresso-natale-roma-arezzo-2026/603511/"
      }
    ]
  },
  {
    "slug": "trento",
    "citta": "Trento",
    "eventi": [
      {
        "nome": "Mercatino di Natale di Trento",
        "tipo": "mercatino",
        "luogo": "Piazza Fiera e Piazza Mostra",
        "zona": "Centro storico, Trento",
        "dal": "2026-11-20",
        "al": "2027-01-06",
        "orari": "10-20",
        "descrizione": "75 casette in legno tra le antiche mura di Piazza Fiera e Piazza Mostra, ai piedi del Castello del Buonconsiglio, con artigianato, decorazioni e specialità del territorio.",
        "fonte": "https://siviaggia.it/notizie/mercatino-di-natale-trento-2026/608641/"
      },
      {
        "nome": "Piazza dei Bambini",
        "tipo": "villaggio",
        "luogo": "Piazza Dante",
        "zona": "Centro, Trento",
        "dal": "2026-11-20",
        "al": "2027-01-06",
        "descrizione": "Lo spazio di Natale dedicato ai più piccoli, con un villaggio incantato e una ruota panoramica.",
        "fonte": "https://www.iltrentinodeibambini.it/?p=223622"
      },
      {
        "nome": "Villaggio natalizio dei Canopi",
        "tipo": "mercatino",
        "luogo": "Centro storico",
        "zona": "Pergine Valsugana (TN)",
        "dal": "2026-11-14",
        "al": "2026-12-31",
        "orari": "solo nei weekend",
        "descrizione": "Casette artigianali, sapori tipici, musica, spettacoli e laboratori per bambini.",
        "fonte": "https://www.iltrentinodeibambini.it/?p=223622"
      },
      {
        "nome": "Artigiani a Bosentino",
        "tipo": "mercatino",
        "luogo": "Mercatino coperto",
        "zona": "Bosentino, Altopiano della Vigolana (TN)",
        "dal": "2026-12-05",
        "al": "2026-12-13",
        "orari": "5-8 dicembre e 12-13 dicembre 2026",
        "descrizione": "Mercatino coperto di artigianato e idee regalo con appuntamenti per i più piccoli e la presenza dei Krampus.",
        "fonte": "https://www.iltrentinodeibambini.it/?p=223622"
      },
      {
        "nome": "Il Natale di montagna",
        "tipo": "mercatino",
        "luogo": "Centro del paese",
        "zona": "Brentonico (TN)",
        "dal": "2026-12-06",
        "al": "2026-12-30",
        "descrizione": "Alberi illuminati, giochi didattici in legno, casette enogastronomiche, spettacoli e laboratori.",
        "fonte": "https://www.iltrentinodeibambini.it/?p=223622"
      },
      {
        "nome": "Rintocchi di Luce – Natale a Rovereto",
        "tipo": "luminarie",
        "luogo": "Centro storico",
        "zona": "Rovereto (TN)",
        "dal": "2026-11-20",
        "al": "2027-01-06",
        "descrizione": "Luminarie, eventi e iniziative natalizie nel centro storico di Rovereto.",
        "fonte": "https://www.iltrentinodeibambini.it/?p=223622"
      }
    ]
  }
];

/** Gli eventi non ancora finiti, in ordine di inizio. */
export function eventiAttivi(c: CittaEventi, oggi = new Date().toISOString().slice(0, 10)): EventoNatale[] {
  return c.eventi.filter((e) => e.al >= oggi).sort((a, b) => a.dal.localeCompare(b.dal));
}

export const cittaEventi = (slug: string) => CITTA_EVENTI.find((c) => c.slug === slug);

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

/** «dal 28 novembre al 6 gennaio», «il 13 dicembre». */
export function quando(e: Pick<EventoNatale, "dal" | "al">): string {
  const giorno = (d: string) => {
    const [, m, g] = d.split("-").map(Number);
    return `${g} ${MESI[m - 1]}`;
  };
  return e.dal === e.al ? `il ${giorno(e.dal)}` : `dal ${giorno(e.dal)} al ${giorno(e.al)}`;
}
