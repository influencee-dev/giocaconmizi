// Le pagine locali "Festa di compleanno per bambini a [città]" (/feste).
// Ogni città = una voce qui: pagina, sitemap e llms.txt si aggiornano da soli.
//
// REGOLE (valgono per ogni città nuova):
// - solo locali REALI trovati con la ricerca web, mai inventati;
// - link esterni solo ai siti ufficiali trovati davvero (rel nofollow);
// - descrizioni fedeli a ciò che le fonti dicono, senza promesse nostre;
// - niente personaggi protetti da copyright nelle NOSTRE descrizioni;
// - il reel Instagram si aggiunge solo con l'URL vero del post (campo reel).

export interface LocaleFesta {
  nome: string;
  /** Zona o comune, per il GEO: "Lambrate", "Portuense", "Mugnano". */
  zona: string;
  /** Tipo breve: "ludoteca", "parco giochi al chiuso", "sala feste"… */
  tipo: string;
  descrizione: string;
  /** Sito ufficiale, solo se verificato nelle fonti. */
  sito?: string;
  /** Profilo Instagram (URL completo), solo se verificato. */
  instagram?: string;
  /** URL di un reel Instagram da incorporare (caricato solo al tocco). */
  reel?: string;
}

export interface CittaFeste {
  slug: string;
  citta: string;
  /** La risposta in due frasi, citabile dalle AI. */
  rispostaBreve: string;
  intro: string;
  locali: LocaleFesta[];
  faq: { domanda: string; risposta: string }[];
  aggiornata: string;
}

export const CITTA_FESTE: CittaFeste[] = [
  {
    slug: "milano",
    citta: "Milano",
    aggiornata: "2026-10-19",
    rispostaBreve:
      "A Milano una festa di compleanno per bambini si organizza in ludoteca o in una sala feste di zona: ce ne sono in quasi ogni quartiere, da Lambrate a Porta Romana alla zona Ripamonti, con formule da circa due ore e mezza che spesso comprendono spazio giochi, buffet e animazione. Conviene prenotare con qualche settimana di anticipo, chiedere un preventivo scritto e verificare cosa è incluso: torta, allestimento e pulizie fanno la differenza sul prezzo finale.",
    intro:
      "Milano è piena di spazi pensati per i compleanni dei bambini, e il problema di solito non è trovarne uno: è sceglierlo senza girare venti profili Instagram. Qui sotto ci sono le location di cui le famiglie milanesi parlano di più, con la zona e il tipo di spazio, così parti dalla tua fermata di metro e non dal fondo della lista.",
    locali: [
      {
        nome: "Il Nano Gigante",
        zona: "Lambrate",
        tipo: "ludoteca e playground",
        descrizione:
          "Un open space di circa 500 mq con playground, gonfiabili, labirinti e un gioco interattivo a pavimento: lo spazio grande per le feste movimentate.",
      },
      {
        nome: "Kikolle Lab",
        zona: "zona Solari",
        tipo: "ludoteca creativa",
        descrizione:
          "Uno dei nomi storici delle feste milanesi: centinaia di feste organizzate ogni anno, con laboratori e animazione curati.",
      },
      {
        nome: "Festavventura",
        zona: "Stazione Centrale",
        tipo: "sala feste con animazione",
        descrizione:
          "Formula festa da due ore e mezza con buffet, torta e pulizie comprese: la scelta di chi vuole arrivare, festeggiare e tornare a casa senza pensieri.",
      },
      {
        nome: "MiniMeG Ludoteca",
        zona: "Porta Romana",
        tipo: "ludoteca",
        descrizione:
          "Feste a tema progettate su misura, con educatrici che possono prendersi cura dei bambini dai 3 anni in su.",
      },
      {
        nome: "Effetto Magia",
        zona: "centro",
        tipo: "sala feste con ludoteca",
        descrizione:
          "Una sala da 165 mq con ludoteca interna di oltre 50 mq, nel cuore della città.",
        sito: "https://www.effettomagia.it/",
      },
      {
        nome: "Mini Club Scooby",
        zona: "Ripamonti",
        tipo: "area giochi attrezzata",
        descrizione:
          "200 mq di area gioco attrezzata con preventivi personalizzati in base a età e numero di invitati.",
        sito: "https://asilominiclubscoobymilano.it/affitto-sala-feste-per-bambini/",
      },
      {
        nome: "Spazio Rev",
        zona: "zona sud",
        tipo: "sala in affitto",
        descrizione:
          "Il noleggio della sala per chi vuole organizzare la festa in autonomia, con la possibilità di farsi aiutare dal loro team.",
        sito: "https://www.spaziorev.com/spazio-bambini-milano/",
      },
      {
        nome: "Tuttotondo",
        zona: "zona nord",
        tipo: "ludoteca",
        descrizione:
          "Feste di compleanno con o senza animazione: la via di mezzo tra la sala nuda e il pacchetto completo.",
      },
    ],
    faq: [
      {
        domanda: "Quanto costa una festa di compleanno per bambini a Milano?",
        risposta:
          "Dipende da spazio e formula: l'affitto della sola sala costa meno del pacchetto completo con animazione, buffet e torta. Chiedete sempre un preventivo scritto con l'elenco di cosa è incluso: pulizie e allestimento sono le voci che più spesso compaiono a sorpresa.",
      },
      {
        domanda: "Con quanto anticipo bisogna prenotare?",
        risposta:
          "Per i weekend conviene muoversi con 3–4 settimane di anticipo, di più nei mesi di punta (maggio, giugno e il periodo prenatalizio). Per le feste infrasettimanali basta molto meno.",
      },
      {
        domanda: "Ludoteca o sala in affitto: cosa conviene?",
        risposta:
          "La ludoteca con pacchetto completo toglie quasi tutti i pensieri ma costa di più; la sala in affitto costa meno e lascia a voi giochi e merenda. Per i bambini sotto i 5 anni la festa semplice con pochi invitati funziona benissimo anche in casa.",
      },
      {
        domanda: "Come gestisco inviti e conferme?",
        risposta:
          "Invito con giorno, orario di inizio e fine, indirizzo e una scadenza per confermare. Su Gioca con Mizi l'invito si crea gratis e chi lo riceve conferma con un tocco su WhatsApp, anche col QR sul biglietto stampato.",
      },
    ],
  },
  {
    slug: "roma",
    citta: "Roma",
    aggiornata: "2026-10-19",
    rispostaBreve:
      "A Roma le feste di compleanno per bambini si fanno in ludoteca, nei parchi giochi al chiuso o — nella bella stagione — negli spazi con giardino: l'offerta è distribuita per quadranti, da Roma Nord alla Portuense a Roma Sud, quindi conviene cercare prima per zona e poi per formula. Le strutture propongono in genere sala, merenda e animazione su prenotazione, spesso con un acconto: chiedete cosa è incluso e fissate una scadenza per le conferme degli invitati.",
    intro:
      "Roma è grande e attraversarla di sabato pomeriggio con dodici bambini al seguito non è un'idea: la festa giusta è prima di tutto quella nel quadrante giusto. Ecco le location di cui i genitori romani parlano, ordinate per zona.",
    locali: [
      {
        nome: "Il Pozzo ai Massimi",
        zona: "Portuense",
        tipo: "giardino con playground",
        descrizione:
          "Ampio giardino con playground e area feste con gazebo dedicati, vicino alla riserva naturale della Valle dei Casali: la scelta per le feste all'aperto.",
      },
      {
        nome: "Criollo, il Bistrot del Gelato",
        zona: "Portuense",
        tipo: "gelateria con sala feste",
        descrizione:
          "Gelateria con spazi per le feste e laboratori (quelli di gelateria sono il pezzo forte): sala, merenda e animazione si prenotano con una telefonata e un acconto.",
      },
      {
        nome: "Mondo Caramella",
        zona: "Magliana",
        tipo: "ludoteca 0–3 anni",
        descrizione:
          "Ludoteca con sala feste e playground pensata per i più piccoli, da 0 a 3 anni: una rarità preziosa per i primi compleanni.",
      },
      {
        nome: "DIDI Bimbi",
        zona: "Portuense",
        tipo: "ludoteca",
        descrizione:
          "Grande sala per merenda e rinfreschi, con animazione costruita su misura per l'età dei bambini.",
        sito: "https://www.didibimbi.it/feste-compleanno-bambini-portuense-roma",
      },
      {
        nome: "Ludoteca Il Piccolo Principe",
        zona: "Roma Sud (Castel di Leva)",
        tipo: "ludoteca",
        descrizione:
          "Ampie sale con allestimento e servizio di animazione compresi nella proposta.",
      },
      {
        nome: "Nella Vecchia Fattoria",
        zona: "Roma Nord",
        tipo: "ludoteca con parco",
        descrizione:
          "Feste nel weekend in due fasce orarie (10–14 col brunch o 15–19 classica) e, in primavera ed estate, un parco giochi all'aperto con boschetto.",
        sito: "https://www.asilodueponti.com/attivita-extra/feste-per-bambini-roma-nord/",
      },
      {
        nome: "Carosel Park",
        zona: "Cinecittà Est",
        tipo: "parco giochi al chiuso",
        descrizione:
          "Area gonfiabili interna da 350 mq dedicata alle feste: lo spazio per i gruppi numerosi e le feste a tutta energia.",
        sito: "https://www.parcogiochicinecittaest.com/le-attrazioni",
      },
      {
        nome: "Candy Park",
        zona: "Roma",
        tipo: "parco giochi al chiuso",
        descrizione:
          "Sala buffet e sala giochi spaziose, con feste pensate per bambini fino ai 9 anni.",
        sito: "https://www.candypark.net/",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Roma?",
        risposta:
          "In ludoteca o parco giochi al chiuso tutto l'anno, e negli spazi con giardino nella bella stagione. L'offerta è distribuita per quadranti — Roma Nord, Portuense, Roma Sud, Cinecittà — quindi partite dalla zona comoda per i vostri invitati.",
      },
      {
        domanda: "Quanto dura una festa in ludoteca?",
        risposta:
          "Le formule più comuni durano dalle due alle tre ore, spesso in fasce fisse (per esempio 10–14 o 15–19). Due ore bastano a qualunque età: un orario di fine chiaro nell'invito è un regalo per tutti i genitori.",
      },
      {
        domanda: "Serve un acconto per prenotare?",
        risposta:
          "Quasi sempre sì, soprattutto per i weekend. Chiedete conferma scritta di data, orario, numero minimo di bambini e di cosa comprende il pacchetto prima di versarlo.",
      },
      {
        domanda: "Come raccolgo le conferme senza impazzire?",
        risposta:
          "Mettete nell'invito una scadenza chiara e un modo per confermare a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma».",
      },
    ],
  },
  {
    slug: "napoli",
    citta: "Napoli",
    aggiornata: "2026-10-19",
    rispostaBreve:
      "A Napoli e nell'hinterland le feste di compleanno per bambini si organizzano nelle ludoteche e nelle sale feste con playground: dall'area del Vomero a Salvator Rosa fino a Mugnano, Casoria e Quarto, le strutture propongono pacchetti con sala, giochi, animazione e spesso mascotte. Il passaparola tra mamme conta molto: prima di prenotare chiedete un preventivo scritto e verificate cosa comprende davvero il pacchetto.",
    intro:
      "A Napoli la festa di compleanno è una cosa seria, e l'offerta di ludoteche e sale feste — in città e nei comuni dell'hinterland — è tra le più ricche d'Italia. Queste sono le strutture di cui le famiglie parlano di più, in città e appena fuori.",
    locali: [
      {
        nome: "Il Regno dei Bambini",
        zona: "Salvator Rosa",
        tipo: "ludoteca e sala feste",
        descrizione:
          "Sala attrezzata con giochi e playground per feste, eventi a tema e intrattenimento, in piena città.",
      },
      {
        nome: "Wonder Park",
        zona: "Mugnano di Napoli",
        tipo: "parco giochi con sala feste",
        descrizione:
          "Uno degli spazi più noti del passaparola tra mamme: playground, tappeto elastico, gonfiabili e perfino una pista go-kart per bambini.",
        sito: "https://www.wonderparkmugnano.it/",
      },
      {
        nome: "Università del Divertimento",
        zona: "Vomero",
        tipo: "ludoteca",
        descrizione:
          "Ludoteca storica del Vomero per feste di compleanno in una delle zone più comode della città.",
      },
      {
        nome: "Spac Eventi",
        zona: "Bagnoli",
        tipo: "sala eventi",
        descrizione: "Sale esclusive con mascotte e animazione.",
      },
      {
        nome: "Il Castello Sale Eventi",
        zona: "Casoria",
        tipo: "ludoteca e sala eventi",
        descrizione:
          "Feste per bambini e adulti, primi compleanni, battesimi e feste a tema nell'hinterland nord.",
        sito: "https://www.ilcastelloeventi.net/",
      },
      {
        nome: "Mondo Felice",
        zona: "Quarto",
        tipo: "sala feste con playground",
        descrizione:
          "Playground recente, giochi di ballo su schermo, animazione e mascotte per i gruppi che non stanno mai fermi.",
      },
      {
        nome: "Butterfly Party",
        zona: "Calvizzano",
        tipo: "ludoteca e sala eventi",
        descrizione: "Ludoteca e sala eventi dell'area nord, per feste e ricorrenze.",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Napoli?",
        risposta:
          "Nelle ludoteche e sale feste con playground, in città (Vomero, Salvator Rosa, Bagnoli) o nei comuni dell'hinterland (Mugnano, Casoria, Quarto, Giugliano), dove gli spazi sono spesso più grandi e i prezzi più morbidi.",
      },
      {
        domanda: "Cosa comprende di solito il pacchetto festa?",
        risposta:
          "Sala, uso del playground, animazione e spesso mascotte; buffet e torta a volte sono inclusi, a volte no. È la prima cosa da chiarire nel preventivo scritto, insieme al numero minimo di bambini.",
      },
      {
        domanda: "Meglio in città o nell'hinterland?",
        risposta:
          "In città vincono comodità e parcheggi dei quartieri serviti; nell'hinterland vincono gli spazi grandi. Scegliete in base a dove abitano gli invitati: una festa vicina è una festa con più presenti.",
      },
      {
        domanda: "Come mando gli inviti?",
        risposta:
          "Con un biglietto che dica giorno, orario di inizio e fine, indirizzo e come confermare. Su Gioca con Mizi si crea gratis, con la conferma a un tocco su WhatsApp e il QR sul biglietto stampato.",
      },
    ],
  },
  {
    slug: "torino",
    citta: "Torino",
    aggiornata: "2026-10-20",
    rispostaBreve:
      "A Torino le feste di compleanno per bambini si fanno nelle ludoteche e sale giochi della citt\u00e0 e della prima cintura \u2014 da via Bardonecchia a Nichelino, Collegno e Beinasco \u2014 con pacchetti che spesso comprendono sala riservata, gonfiabili, cibo e allestimento. Le formule con animazione durano in genere due ore e mezza; i prezzi partono da circa 150 euro nei giorni feriali e l'affitto di una sala attrezzata si aggira tra i 200 e i 300 euro.",
    intro:
      "A Torino l'offerta vera \u00e8 met\u00e0 in citt\u00e0 e met\u00e0 in prima cintura: Nichelino, Collegno e Beinasco sono a un quarto d'ora e hanno gli spazi pi\u00f9 grandi. Ecco i posti di cui parlano le famiglie torinesi.",
    locali: [
      {
        nome: "1000 Salti",
        zona: "Nichelino",
        tipo: "ludoteca con gonfiabili",
        descrizione:
          "Scivoli gonfiabili, playground, calciobalilla e una sala riservata per le feste: il pacchetto comprende cibo, bibite e allestimento.",
        sito: "https://1000salti.it/",
      },
      {
        nome: "Mela Spasso",
        zona: "Collegno",
        tipo: "sala giochi inclusiva",
        descrizione:
          "Sala giochi pensata per essere inclusiva, con sala esclusiva per feste ed eventi privati e laboratori tenuti da esperti.",
        sito: "https://melaspasso.it/",
      },
      {
        nome: "Kidsland",
        zona: "via Bardonecchia",
        tipo: "ludoteca",
        descrizione:
          "400 mq con palestra, area giochi e feste di compleanno, in citt\u00e0.",
        sito: "https://www.kidsland.to.it/",
      },
      {
        nome: "CH4 Sporting Club",
        zona: "Torino",
        tipo: "centro sportivo con animazione",
        descrizione:
          "Feste con animazione per tutte le et\u00e0: due ore e mezza con un animatore ogni 12 bambini presenti.",
        sito: "https://ch4sportingclub.it/servizi/feste-compleanno/",
      },
      {
        nome: "Baby Luna Park",
        zona: "Torino",
        tipo: "luna park al chiuso",
        descrizione:
          "Giostre, gonfiabili e animazione; le tariffe indicate partono da 150 euro per 10 bambini nei giorni feriali, con un extra per ogni bambino in pi\u00f9.",
        sito: "https://baby-lunapark.it/",
      },
      {
        nome: "K1 Speed",
        zona: "Beinasco",
        tipo: "kart per bambini",
        descrizione:
          "La festa in pista coi kart, per i bambini pi\u00f9 grandi: il pacchetto richiede un minimo di 6 partecipanti.",
        sito: "https://www.k1speed.com/it/torino/festa-di-compleanno-per-bambini.html",
      },
      {
        nome: "+Spazio4",
        zona: "Torino",
        tipo: "salone per feste",
        descrizione:
          "Un salone al chiuso di oltre 200 mq: la scelta per le feste d'inverno coi gruppi numerosi.",
      },
    ],
    faq: [
      {
        domanda: "Quanto costa una festa di compleanno per bambini a Torino?",
        risposta:
          "Dalle fonti pubbliche: i pacchetti al chiuso partono da circa 150 euro per 10 bambini nei giorni feriali, mentre l'affitto di una sala attrezzata per la giornata si aggira tra i 200 e i 300 euro. Il preventivo scritto con l'elenco di cosa \u00e8 incluso resta la regola d'oro.",
      },
      {
        domanda: "Meglio in citt\u00e0 o in prima cintura?",
        risposta:
          "Nichelino, Collegno e Beinasco hanno spazi pi\u00f9 grandi e parcheggio facile, la citt\u00e0 vince per chi si muove coi mezzi. Scegliete in base a dove abitano gli invitati.",
      },
      {
        domanda: "Quanto dura la festa con animazione?",
        risposta:
          "La formula pi\u00f9 diffusa dura due ore e mezza, con un animatore ogni 10\u201312 bambini. Due ore bastano a qualunque et\u00e0: l'orario di fine scritto nell'invito aiuta tutti.",
      },
      {
        domanda: "Come gestisco inviti e conferme?",
        risposta:
          "Invito con giorno, orario di inizio e fine, indirizzo e una scadenza per confermare. Su Gioca con Mizi si crea gratis, con la conferma WhatsApp a un tocco e il QR sul biglietto stampato.",
      },
    ],
  },
  {
    slug: "palermo",
    citta: "Palermo",
    aggiornata: "2026-10-20",
    rispostaBreve:
      "A Palermo le feste di compleanno per bambini si organizzano nelle ludoteche e sale feste della citt\u00e0 \u2014 da via Resuttana a via Di Marzo fino alla Favorita \u2014 con pacchetti che spesso comprendono animazione, gonfiabili, feste a tema con scenografia e perfino la torta personalizzata. Molte strutture lavorano su prenotazione con preventivo gratuito: chiedetelo scritto, con l'elenco di cosa comprende davvero.",
    intro:
      "A Palermo la festa a tema \u00e8 la specialit\u00e0 della casa: scenografie, mascotte e staff che segue i bambini dall'inizio alla fine. Queste sono le strutture di cui le famiglie palermitane parlano di pi\u00f9.",
    locali: [
      {
        nome: "LudoArt",
        zona: "Palermo",
        tipo: "ludoteca e sala feste",
        descrizione:
          "Sala feste che \u00e8 anche ludoteca, con uno staff di educatori professionisti, animatori e insegnanti e spazi colorati e accoglienti.",
        sito: "https://www.festeperbambini.palermo.it/",
      },
      {
        nome: "Party Time Kid's",
        zona: "via Di Marzo",
        tipo: "ludoteca",
        descrizione:
          "Feste a tema e laboratori creativi in spazi ampi, con giochi pensati per tutti.",
        sito: "http://www.partytimekids.it/",
      },
      {
        nome: "Hula Hoop",
        zona: "Palermo",
        tipo: "sala feste a tema",
        descrizione:
          "Feste a tema con scenografia e torta personalizzata: balli, canti, cucina, gonfiabili e laboratori seguiti da uno staff professionale.",
        sito: "https://hulahoopalermo.it/",
      },
      {
        nome: "Che Festa",
        zona: "via Resuttana",
        tipo: "sala feste con baby parking",
        descrizione:
          "Feste di compleanno per bambini da 1 a 10 anni, battesimi e comunioni, con servizio di baby parking.",
      },
      {
        nome: "Toy Park",
        zona: "Palermo",
        tipo: "parco divertimenti",
        descrizione:
          "Il pacchetto festa del parco: gioco nel padiglione, sala feste dedicata e una coordinatrice in sala che segue il gruppo.",
        sito: "https://www.toypark-palermo.com/feste-a-tema-per-compleanni-parco-divertimenti-a-palermo-toy-park-dettaglio.asp?ID=3",
      },
      {
        nome: "Holiday Party House",
        zona: "Palermo",
        tipo: "location con animazione",
        descrizione:
          "Animazione, parco gonfiabili e mascotte comprese nel pacchetto.",
        sito: "https://www.holidayanimazione.com/organizzazione-feste-palermo",
      },
      {
        nome: "Dueffe Animazione",
        zona: "Favorita e Villabate",
        tipo: "animazione con sale convenzionate",
        descrizione:
          "Agenzia di animazione con sale convenzionate, tra cui la caffetteria dentro il bowling della Favorita e la sala feste con gonfiabili di Villabate; preventivo gratuito.",
        sito: "https://dueffeanimazione.it/sale-feste-bambini-palermo/",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Palermo?",
        risposta:
          "Nelle ludoteche e sale feste della citt\u00e0 (via Resuttana, via Di Marzo, zona Favorita) o nelle sale convenzionate con le agenzie di animazione, fino a Villabate. Quasi tutte lavorano su prenotazione con preventivo gratuito.",
      },
      {
        domanda: "Cosa comprende il pacchetto festa a tema?",
        risposta:
          "Nelle strutture pi\u00f9 complete: scenografia del tema scelto, animazione, gonfiabili, laboratori e a volte la torta personalizzata e le mascotte. Verificate per iscritto cosa \u00e8 incluso e cosa si paga a parte.",
      },
      {
        domanda: "C'\u00e8 un posto adatto ai pi\u00f9 piccoli?",
        risposta:
          "S\u00ec: diverse sale seguono feste dal primo compleanno (da 1 a 10 anni) e alcune offrono anche il baby parking. Per i piccolissimi contano pi\u00f9 gli spazi morbidi e un orario corto che le attrazioni.",
      },
      {
        domanda: "Come mando gli inviti?",
        risposta:
          "Con un biglietto che dica giorno, orario di inizio e fine, indirizzo e come confermare. Su Gioca con Mizi si crea gratis, con la conferma WhatsApp a un tocco e il QR \u00abInquadra e conferma\u00bb sul biglietto stampato.",
      },
    ],
  },
  {
    slug: "genova",
    citta: "Genova",
    aggiornata: "2026-10-20",
    rispostaBreve:
      "A Genova il compleanno dei bambini si festeggia in ludoteca \u2014 dal centro a Sampierdarena \u2014 o nelle sale di quartiere e parrocchiali, molto usate e pi\u00f9 economiche: la sala di via Donghi a San Fruttuoso \u00e8 tra le pi\u00f9 richieste. I pacchetti delle strutture attrezzate partono da circa 220 euro nei giorni feriali (260 nel weekend) per la fascia 15:30\u201318:30, spesso con addobbi e pulizie inclusi.",
    intro:
      "Genova \u00e8 la citt\u00e0 delle due vie: la ludoteca attrezzata con gonfiabili e playground, oppure la sala di quartiere o parrocchiale da allestire in proprio, che costa meno e lascia fare a modo vostro. Qui trovate entrambe.",
    locali: [
      {
        nome: "Ludoteca Bim Bum Bam",
        zona: "centro (via Santa Maria in Via Lata)",
        tipo: "ludoteca",
        descrizione:
          "Ampio playground, gonfiabili colorati e zone per i giochi di movimento, con personale che organizza le feste di compleanno.",
      },
      {
        nome: "Giocomondo",
        zona: "Sampierdarena",
        tipo: "ludoteca con baby parking",
        descrizione:
          "Ludoteca di via Nicol\u00f2 Daste dove la festa si organizza direttamente in struttura, con servizio di baby parking.",
      },
      {
        nome: "L'isola che c'\u00e8",
        zona: "Genova",
        tipo: "sala feste",
        descrizione:
          "Tra le poche con prezzi pubblici: pacchetto feriale da 220 euro e weekend da 260, fascia 15:30\u201318:30, con tovaglie, frigorifero, addobbi, pulizie e smaltimento inclusi; 5 euro per ogni bambino oltre i compresi, fino a 30.",
        sito: "https://www.lisolachecegenova.it/feste/",
      },
      {
        nome: "Capriole sulle Nuvole",
        zona: "centro storico, San Fruttuoso e Voltri",
        tipo: "animazione con sale in pi\u00f9 quartieri",
        descrizione:
          "Servizio di feste e animazione attivo in diversi quartieri della citt\u00e0, con sale appoggiate per ogni zona.",
        sito: "https://www.compleannogenova.it/",
      },
      {
        nome: "Festolandia",
        zona: "Genova",
        tipo: "location per feste",
        descrizione: "Location dedicata alle feste per bambini con area giochi attrezzata.",
        sito: "https://www.festolandia.it/",
      },
    ],
    faq: [
      {
        domanda: "Quanto costa una festa di compleanno per bambini a Genova?",
        risposta:
          "Dalle fonti pubbliche: una sala feste attrezzata parte da circa 220 euro nei feriali e 260 nel weekend per tre ore, addobbi e pulizie inclusi. Le sale di quartiere e parrocchiali costano sensibilmente meno ma vanno allestite in proprio.",
      },
      {
        domanda: "Le sale parrocchiali si possono affittare?",
        risposta:
          "S\u00ec, ed \u00e8 una tradizione genovese molto viva: l'affitto si concorda direttamente con la parrocchia. La sala di via Donghi a San Fruttuoso \u00e8 tra le pi\u00f9 richieste; a Voltri c'\u00e8 una saletta attrezzata in via Montanella.",
      },
      {
        domanda: "Ludoteca o sala da allestire?",
        risposta:
          "La ludoteca include giochi, personale e pulizie; la sala libera costa meno e lascia a voi merenda e giochi. Sotto i 5 anni una festa semplice in sala piccola, con pochi invitati, funziona benissimo.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
];

export function cittaFeste(slug: string): CittaFeste | undefined {
  return CITTA_FESTE.find((c) => c.slug === slug);
}
