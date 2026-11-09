import { etichettaDi, type Etichetta } from "./etichette";
import { esperienzeDi, etaDi, type IdEsperienza } from "./esperienze";
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
    slug: "fattorie-didattiche",
    nome: "Fattorie didattiche e agriturismi",
    singolare: "fattoria didattica",
    titolo: "Fattorie didattiche per feste e attività con i bambini",
    sottotitolo: "Compleanni in fattoria, animali da conoscere e giornate in campagna: le fattorie didattiche città per città.",
    rispostaBreve:
      "Una festa in fattoria didattica unisce gioco all'aperto e scoperta: i bambini incontrano gli animali, fanno un laboratorio come il pane o l'orto e poi festeggiano in giardino. È la festa più adatta dai 3 ai 9 anni nella bella stagione: chiedete sempre cosa succede se piove e se c'è uno spazio al coperto.",
    comeScegliere: [
      "Se c'è uno spazio al coperto in caso di pioggia o freddo.",
      "Quali animali si possono avvicinare e chi accompagna i bambini.",
      "Il laboratorio compreso (pane, orto, miele, animali) e la sua durata.",
      "Merenda e torta: preparate da loro o portate da casa.",
    ],
    faq: [
      { domanda: "Cosa si fa a una festa in fattoria didattica?", risposta: "Di solito una visita agli animali con un operatore, un laboratorio pratico come il pane, l'orto o il miele, giochi all'aperto e poi la merenda con la torta. Ogni fattoria ha il suo programma: fatevelo descrivere prima." },
      { domanda: "Da che età è adatta?", risposta: "Dai 3 anni in su, con un adulto vicino per i più piccoli. Fino ai 9-10 anni è quasi sempre un successo; per i più grandi chiedete attività più impegnative, come la cura degli animali o un percorso a cavallo." },
      { domanda: "Si può fare anche d'inverno?", risposta: "Dipende dalla fattoria: alcune hanno una sala o una stalla al coperto, altre lavorano solo nella bella stagione. Chiedete il piano B in caso di pioggia prima di confermare." },
    ],
    schema: "LocalBusiness",
    icona: "capra",
    regola: /fattoria|azienda agricola|asineria|maneggio/i,
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
    slug: "associazioni-per-bambini",
    nome: "Associazioni e laboratori",
    singolare: "associazione",
    titolo: "Associazioni e laboratori per bambini",
    sottotitolo: "Associazioni, laboratori creativi e centri per bambini che organizzano attività e feste, città per città.",
    rispostaBreve:
      "Le associazioni e i laboratori per bambini propongono attività guidate, come arte, musica, teatro, scienza, natura o sport, e spesso anche feste di compleanno a tema con un educatore. Prima di scegliere guardate la fascia d'età, quanti bambini segue ogni educatore e se serve la tessera associativa.",
    comeScegliere: [
      "La fascia d'età dell'attività e quanti bambini segue ogni educatore.",
      "Se per partecipare serve la tessera dell'associazione e quanto costa.",
      "Cosa comprende la festa: laboratorio, materiali, merenda, spazio.",
      "Dove si svolge: nella sede, all'aperto o a casa vostra.",
    ],
    faq: [
      { domanda: "Cosa fa un'associazione per bambini?", risposta: "Organizza attività educative e di gioco guidate da educatori: laboratori creativi, musica, teatro, scienza, natura o sport, spesso con corsi durante l'anno, centri estivi e feste di compleanno a tema." },
      { domanda: "Serve la tessera per la festa?", risposta: "A volte sì: molte associazioni chiedono una tessera associativa annuale, anche solo per il festeggiato. Chiedetelo al momento del preventivo, insieme a cosa comprende il prezzo." },
      { domanda: "Da che età si può fare una festa con un laboratorio?", risposta: "Dai 3-4 anni per i laboratori più semplici, come pittura, pasta di sale e musica; quelli di scienza o teatro funzionano meglio dai 6 anni in su." },
    ],
    schema: "NGO",
    icona: "tavolozza",
    regola: /associazion|laboratori|centro per bambini|\basd\b/i,
  },
  {
    slug: "animatori-per-feste",
    nome: "Animatori e feste a domicilio",
    singolare: "servizio di animazione",
    titolo: "Animatori per feste di bambini e feste a domicilio",
    sottotitolo: "Animatori, maghi, gonfiabili a noleggio e organizzatori che portano la festa a casa vostra o nella sala che scegliete.",
    rispostaBreve:
      "Un animatore per la festa dei bambini porta giochi, musica e spettacolo dove volete voi: a casa, in giardino, in una sala in affitto. Si paga a ore e il prezzo cambia con il numero di animatori e di bambini. Chiedete cosa portano (casse, materiali, trucca bimbi, palloncini) e per quanti bambini basta un animatore.",
    comeScegliere: [
      "Quanti bambini segue ogni animatore e quante ore dura il servizio.",
      "Cosa portano loro: casse, giochi, trucca bimbi, palloncini, bolle.",
      "Se lavorano a casa vostra, in sale convenzionate o in entrambe.",
      "Lo spazio che serve per i giochi e i costi di trasferta.",
    ],
    faq: [
      { domanda: "Quanti animatori servono per una festa?", risposta: "Come regola pratica un animatore ogni 12-15 bambini sopra i 5 anni, e qualcuno in più con i più piccoli. Chiedete sempre all'agenzia per quanti bambini è pensato il pacchetto." },
      { domanda: "Si può fare la festa con l'animatore a casa?", risposta: "Sì, molti lavorano a domicilio: serve uno spazio libero dove muoversi, in casa o in giardino. Alcuni hanno anche sale convenzionate se a casa non c'è posto." },
      { domanda: "Quanto dura l'animazione?", risposta: "Di solito da un'ora e mezza a tre ore. Per una festa di pomeriggio due ore bastano: giochi, un momento di spettacolo e la torta." },
    ],
    schema: "LocalBusiness",
    icona: "palloncino",
    regola: /animazione con sal|organizzazione feste|animator|a domicilio|noleggio gonfiabili|\bmag(o|hi)\b/i,
  },
  {
    slug: "ristoranti-per-bambini",
    nome: "Ristoranti e pizzerie per feste",
    singolare: "ristorante per bambini",
    titolo: "Ristoranti e pizzerie per le feste dei bambini",
    sottotitolo: "Pizzerie con area bimbi, ristoranti con sala riservata e menù per i compleanni, città per città.",
    rispostaBreve:
      "Festeggiare in pizzeria o al ristorante è la soluzione più semplice: il cibo c'è già, spesso c'è un'area giochi o una sala riservata e alcuni aggiungono l'animazione. Chiedete il menù bambini a prezzo fisso, se si può portare la torta e se la sala è solo vostra o condivisa con altri clienti.",
    comeScegliere: [
      "Il menù bambini a prezzo fisso e cosa comprende.",
      "Se la sala o l'area giochi è riservata solo a voi.",
      "Se la torta si porta da casa o la prepara il locale.",
      "Animazione inclusa, a parte o da portare voi.",
    ],
    faq: [
      { domanda: "Conviene fare la festa in pizzeria?", risposta: "Per molte famiglie sì: niente da cucinare né da pulire, un prezzo a persona chiaro e spesso un'area giochi. Funziona meglio con una sala riservata, così i bambini possono muoversi senza disturbare gli altri tavoli." },
      { domanda: "Si può portare la torta al ristorante?", risposta: "Spesso sì, a volte con un piccolo costo per il servizio. Alcuni locali chiedono una torta di pasticceria con lo scontrino: chiedetelo quando prenotate." },
      { domanda: "Serve l'animatore anche al ristorante?", risposta: "Con i bambini sotto i 7 anni aiuta molto: un'ora di giochi tra la pizza e la torta tiene tutti tranquilli. Alcune pizzerie lo propongono nel pacchetto, altrimenti si può chiamare un animatore esterno." },
    ],
    schema: "Restaurant",
    icona: "caffe",
    regola: /pizzeri|ristorant|trattori|gelateri|osteri|\bbar\b/i,
  },
  {
    slug: "corsi-per-bambini",
    nome: "Corsi e sport per bambini",
    singolare: "corso per bambini",
    titolo: "Corsi e attività sportive per bambini",
    sottotitolo: "Musica, danza, nuoto, inglese, arti marziali e sport di squadra: i corsi per bambini città per città.",
    rispostaBreve:
      "Un corso per bambini funziona quando è adatto all'età e piace davvero a vostro figlio: per questo quasi tutte le scuole offrono una lezione di prova. Guardate quanti bambini ci sono per insegnante, la frequenza settimanale e cosa serve comprare, e chiedete se organizzano anche feste o centri estivi.",
    comeScegliere: [
      "Se c'è una lezione di prova gratuita prima di iscriversi.",
      "Quanti bambini ci sono per insegnante o istruttore.",
      "Frequenza, orari e costo dell'iscrizione e del materiale.",
      "Se serve un certificato medico per l'attività sportiva.",
    ],
    faq: [
      { domanda: "A che età iniziare un corso?", risposta: "Musica e acquaticità già dai 3 anni, con proposte di gioco; danza e sport di squadra di solito dai 5-6 anni. L'importante è che il corso sia pensato per quella fascia d'età e non una versione ridotta di quello per i grandi." },
      { domanda: "Serve il certificato medico?", risposta: "Per le attività sportive non agonistiche dei bambini spesso sì, e lo rilascia il pediatra. Le scuole vi dicono quale serve al momento dell'iscrizione." },
      { domanda: "Quanti corsi fare durante la settimana?", risposta: "Uno o due bastano nei primi anni di scuola: i bambini hanno bisogno anche di tempo libero per giocare. Meglio un corso che li entusiasma di tre fatti di corsa." },
    ],
    schema: "SportsActivityLocation",
    icona: "pallone",
    regola: /\bcorsi\b|scuola di|danza|musica|nuoto|arti marziali/i,
  },
  {
    slug: "teatro-per-bambini",
    nome: "Teatro e cinema per bambini",
    singolare: "teatro per bambini",
    titolo: "Teatro, burattini e cinema per bambini",
    sottotitolo: "Spettacoli per famiglie, burattini, cinema e rassegne per bambini, città per città.",
    rispostaBreve:
      "Il teatro per bambini è un'uscita perfetta dai 3 anni in su: spettacoli brevi, spesso la domenica pomeriggio, con storie pensate per i più piccoli. Alcuni teatri organizzano anche feste di compleanno con lo spettacolo e una merenda. Controllate l'età consigliata e la durata, e prenotate per le date di festa.",
    comeScegliere: [
      "L'età consigliata dello spettacolo e quanto dura.",
      "Se ci sono posti per i passeggini e un fasciatoio.",
      "Se propongono feste di compleanno o laboratori dopo lo spettacolo.",
      "Prezzi per famiglie e abbonamenti alle rassegne.",
    ],
    faq: [
      { domanda: "Da che età portare un bambino a teatro?", risposta: "Dai 3 anni con spettacoli pensati per la loro età, di solito sotto l'ora. Esistono anche proposte per i più piccoli, da 1 a 3 anni, molto brevi e con il pubblico vicino al palco." },
      { domanda: "Si può fare una festa di compleanno a teatro?", risposta: "Alcuni teatri e compagnie la propongono: spettacolo o laboratorio teatrale e poi merenda in uno spazio riservato. Chiedete direttamente al teatro della vostra città." },
      { domanda: "Come preparare il bambino al primo spettacolo?", risposta: "Raccontategli prima la storia e cosa succede a teatro: il buio in sala, gli applausi, il silenzio. Sedetevi vicino al corridoio, così potete uscire se serve." },
    ],
    schema: "LocalBusiness",
    icona: "stella",
    regola: /teatr|cinema|burattin|spettacol/i,
  },
  {
    slug: "allestimenti-feste",
    nome: "Torte, palloncini e allestimenti",
    singolare: "fornitore per feste",
    titolo: "Torte, palloncini e allestimenti per le feste dei bambini",
    sottotitolo: "Pasticcerie per torte di compleanno, palloncini, allestimenti e decorazioni per la festa, città per città.",
    rispostaBreve:
      "Per la festa dei bambini i fornitori più cercati sono la pasticceria per la torta, chi fa composizioni di palloncini e chi allestisce la sala. Ordinate la torta almeno una settimana prima, segnalate le allergie per iscritto e chiedete se consegnano e montano l'allestimento sul posto.",
    comeScegliere: [
      "I tempi di ordine e se consegnano sul posto della festa.",
      "Le allergie e le intolleranze: segnalatele per iscritto.",
      "Se l'allestimento comprende montaggio e smontaggio.",
      "Il preventivo scritto con consegna e acconto.",
    ],
    faq: [
      { domanda: "Con quanto anticipo ordinare la torta di compleanno?", risposta: "Almeno una settimana, due o tre per le torte decorate a tema o nei periodi di festa. Ricordatevi di dire quante porzioni servono e se ci sono allergie." },
      { domanda: "I palloncini si possono portare in sala?", risposta: "Quasi sempre sì, ma alcune sale vietano coriandoli o elio: chiedete prima al locale e poi al fornitore se consegna già gonfiati." },
      { domanda: "Serve un allestimento professionale?", risposta: "No: per una festa di bambini bastano pochi elementi ben scelti, come un festone, i palloncini nei colori del tema e una tavola ordinata. L'allestimento professionale aiuta nelle sale grandi o quando volete un tema preciso." },
    ],
    schema: "LocalBusiness",
    icona: "torta-compleanno",
    regola: /pasticceri|palloncin|allestiment|cake design|addobb/i,
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
  "reggio-calabria": "Calabria", "reggio-emilia": "Emilia-Romagna", ravenna: "Emilia-Romagna",
  rimini: "Emilia-Romagna", ferrara: "Emilia-Romagna", piacenza: "Emilia-Romagna", perugia: "Umbria",
  livorno: "Toscana", cagliari: "Sardegna", foggia: "Puglia", salerno: "Campania", latina: "Lazio",
  monza: "Lombardia", bergamo: "Lombardia", vicenza: "Veneto", trento: "Trentino-Alto Adige",
  bolzano: "Trentino-Alto Adige", novara: "Piemonte", arezzo: "Toscana", udine: "Friuli Venezia Giulia",
  cesena: "Emilia-Romagna", lecce: "Puglia", treviso: "Veneto", como: "Lombardia", varese: "Lombardia", lucca: "Toscana", grosseto: "Toscana", siracusa: "Sicilia", cremona: "Lombardia", cosenza: "Calabria", caserta: "Campania", pozzuoli: "Campania", viterbo: "Lazio", trapani: "Sicilia", savona: "Liguria", "busto-arsizio": "Lombardia", carpi: "Emilia-Romagna",
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
  etichetta: Etichetta;
  esperienze: IdEsperienza[];
  eta: string | null;
  contatti: { whatsapp: boolean; telefono: boolean; sito: boolean; social: boolean };
  verificata: boolean;
}

/** I dati per le card e i filtri; accetta anche la scheda con le modifiche del titolare. */
export const datiCard = (
  s: Scheda & { extra?: { whatsapp?: string; telefono?: string; pacchetti?: string; facebook?: string; tiktok?: string }; verificata?: boolean },
): DatiCard => ({
  chiave: `${s.cittaSlug}-${s.slug}`,
  href: percorsoScheda(s),
  nome: s.nome,
  zona: s.zona,
  tipo: s.tipo,
  descrizione: s.descrizione,
  citta: s.citta,
  colore: s.colore,
  icona: s.categoria.icona,
  etichetta: etichettaDi(s.tipo, s.categoria.slug),
  esperienze: esperienzeDi({ tipo: s.tipo, descrizione: s.descrizione, categoria: s.categoria.slug, pacchetti: s.extra?.pacchetti }),
  eta: etaDi(s.descrizione),
  contatti: {
    whatsapp: Boolean(s.extra?.whatsapp),
    telefono: Boolean(s.extra?.telefono),
    sito: Boolean(s.sito),
    social: Boolean(s.instagram || s.extra?.facebook || s.extra?.tiktok),
  },
  verificata: Boolean(s.verificata),
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

/** Le voci della barra «Cosa cerchi · Dove» (components/directory/RicercaCosaDove). */
export function vociRicerca() {
  return {
    cosa: CATEGORIE_ATTIVE.map((c) => ({ slug: c.slug, nome: c.nome })),
    dove: CITTA_FESTE.map((c) => ({
      slug: c.slug,
      nome: c.citta,
      categorie: CATEGORIE_ATTIVE.filter((cat) => haListing(cat.slug, c.slug)).map((cat) => cat.slug),
    })).sort((a, b) => a.nome.localeCompare(b.nome)),
  };
}
