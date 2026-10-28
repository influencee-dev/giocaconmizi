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
      "A Milano una festa di compleanno per bambini si organizza in ludoteca o in una sala feste di zona: ce ne sono in quasi ogni quartiere, da Lambrate al Sempione alla zona Ripamonti, con formule da circa due ore e mezza che spesso comprendono spazio giochi, buffet e animazione. Conviene prenotare con qualche settimana di anticipo, chiedere un preventivo scritto e verificare cosa è incluso: torta, allestimento e pulizie fanno la differenza sul prezzo finale.",
    intro:
      "Milano è piena di spazi pensati per i compleanni dei bambini, e il problema di solito non è trovarne uno: è sceglierlo senza girare venti profili Instagram. Qui sotto ci sono le location di cui le famiglie milanesi parlano di più, con la zona e il tipo di spazio, così parti dalla tua fermata di metro e non dal fondo della lista.",
    locali: [
      {
        nome: "Il Nano Gigante",
        zona: "via Bistolfi",
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
        zona: "Sempione",
        tipo: "ludoteca",
        descrizione:
          "Feste a tema progettate su misura, con educatrici che possono prendersi cura dei bambini dai 3 anni in su.",
      },
      {
        nome: "Effetto Magia",
        zona: "via Morosini",
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
  {
    slug: "bologna",
    citta: "Bologna",
    aggiornata: "2026-10-21",
    rispostaBreve:
      "A Bologna le feste di compleanno per bambini si fanno nei parchi gioco al coperto e nelle ludoteche \u2014 da Casteldebole al centro \u2014 oppure, per chi preferisce l'aria aperta, negli agriturismi con animazione alle porte della citt\u00e0. Dalle fonti pubbliche, una festa in ludoteca costa in genere tra i 100 e i 200 euro, mentre gli spazi pi\u00f9 grandi con pacchetto completo arrivano a 200\u2013500 euro per due\u2013tre ore: per i weekend conviene prenotare almeno quattro settimane prima.",
    intro:
      "Bologna ha due anime anche nelle feste: i grandi spazi al coperto con gonfiabili per l'inverno, e il verde appena fuori porta per la bella stagione. Ecco i posti di cui parlano le famiglie bolognesi.",
    locali: [
      {
        nome: "Il Borgo dei Piccoli",
        zona: "Casteldebole",
        tipo: "parco giochi al coperto",
        descrizione:
          "Parco al coperto dedicato al gioco libero con gonfiabili, per bambini da 1 a 9 anni, con una sala allestita apposta per i compleanni.",
        sito: "https://ilborgodeipiccoli.it/",
      },
      {
        nome: "Magic World",
        zona: "Budrio",
        tipo: "sale feste al chiuso",
        descrizione:
          "Ambiente climatizzato con due sale al piano terra per bambini da 1 a 10 anni e una sala dedicata ai piccolissimi (1\u20135).",
        sito: "https://magicworldaps.it/",
      },
      {
        nome: "Il Mondo di Makam\u00f2",
        zona: "via San Rocco",
        tipo: "ludoteca in affitto",
        descrizione:
          "Gli spazi della ludoteca si affittano per feste ed eventi privati, con formule diverse a seconda delle esigenze.",
        sito: "https://www.ilmondodimakamo.it/ludoteca-bologna/",
      },
      {
        nome: "Luna Farm",
        zona: "zona FICO",
        tipo: "parco divertimenti",
        descrizione:
          "Il parco divertimenti al coperto con pacchetti festa all inclusive, per i gruppi numerosi.",
      },
    ],
    faq: [
      {
        domanda: "Quanto costa una festa di compleanno per bambini a Bologna?",
        risposta:
          "Dalle fonti pubbliche: una festa in ludoteca costa in genere 100\u2013200 euro, mentre gli spazi pi\u00f9 grandi con pacchetto completo (animazione, buffet, pulizie) vanno dai 200 ai 500 euro per due\u2013tre ore.",
      },
      {
        domanda: "Con quanto anticipo prenotare?",
        risposta:
          "Per ludoteche e spazi privati nel weekend, almeno quattro settimane prima. Per le feste infrasettimanali i margini sono molto pi\u00f9 morbidi.",
      },
      {
        domanda: "C'\u00e8 un'alternativa alla ludoteca classica?",
        risposta:
          "S\u00ec: nella bella stagione gli agriturismi con animazione alle porte della citt\u00e0, e per gruppi numerosi i parchi divertimento con pacchetti all inclusive. Anche il museo pu\u00f2 essere una festa: alcuni propongono percorsi e laboratori su prenotazione.",
      },
      {
        domanda: "Come gestisco inviti e conferme?",
        risposta:
          "Invito con giorno, orario di inizio e fine, indirizzo e una scadenza per confermare. Su Gioca con Mizi si crea gratis, con la conferma WhatsApp a un tocco e il QR \u00abInquadra e conferma\u00bb sul biglietto stampato.",
      },
    ],
  },
  {
    slug: "firenze",
    citta: "Firenze",
    aggiornata: "2026-10-21",
    rispostaBreve:
      "A Firenze le feste di compleanno per bambini si organizzano nelle ludoteche \u2014 dall'Oltrarno a via Pisana \u2014 nei saloni attrezzati in citt\u00e0 o nei grandi spazi con gonfiabili della piana, come Calenzano e Campi Bisenzio. Dalle fonti pubbliche i pacchetti partono da circa 150 euro nei feriali per 10 bambini; le sale pi\u00f9 richieste lavorano il sabato e la domenica pomeriggio e vanno prenotate con almeno una settimana d'anticipo.",
    intro:
      "A Firenze la festa si divide tra centro e piana: le ludoteche storiche dentro la citt\u00e0, i capannoni climatizzati con gonfiabili appena fuori. Ecco i posti di cui parlano le famiglie fiorentine.",
    locali: [
      {
        nome: "Ludoteca Nidiaci",
        zona: "Oltrarno (Santo Spirito)",
        tipo: "ludoteca con giardino",
        descrizione:
          "La ludoteca dell'Oltrarno, ristrutturata di recente, con sale interne e un ampio giardino per le feste a tema: i compleanni si festeggiano di sabato, su prenotazione.",
      },
      {
        nome: "La Mondolfiera",
        zona: "via Pisana",
        tipo: "ludoteca",
        descrizione:
          "Ludoteca gestita dalla cooperativa L'Abbaino, open space di circa 200 mq per bambini dai 3 agli 11 anni.",
      },
      {
        nome: "Klab Kids",
        zona: "Firenze",
        tipo: "saloni per feste",
        descrizione:
          "Due ampi saloni (uno con spazio attrezzato a pavimento antitrauma) per oltre 70 persone, con cucina e pulizie incluse nel noleggio; sabato e domenica pomeriggio, da prenotare con almeno una settimana d'anticipo.",
        sito: "https://www.klabkids.it/feste/",
      },
      {
        nome: "Fantasyland",
        zona: "Calenzano",
        tipo: "parco giochi al coperto",
        descrizione:
          "Oltre 700 mq climatizzati con gonfiabili e playground: pacchetto festa da 150 euro nei feriali (170 nel weekend) per 10 bambini, 8\u201310 euro per ogni bambino in pi\u00f9; il buffet si porta da casa o lo prepara la struttura.",
        sito: "https://www.fantasylandpark.it/",
      },
      {
        nome: "Stargate Lasergame",
        zona: "Firenze e Prato",
        tipo: "lasergame",
        descrizione:
          "La festa per i pi\u00f9 grandi: sala giochi e lasergame fino a 24 giocatori per partita.",
        sito: "https://www.lasergamefirenze.com/compleanni-cxrn",
      },
    ],
    faq: [
      {
        domanda: "Quanto costa una festa di compleanno per bambini a Firenze?",
        risposta:
          "Dalle fonti pubbliche: i pacchetti nei grandi spazi della piana partono da circa 150 euro nei feriali e 170 nel weekend per 10 bambini, con 8\u201310 euro per ogni bambino in pi\u00f9. In citt\u00e0 il noleggio dei saloni attrezzati include spesso cucina e pulizie.",
      },
      {
        domanda: "Quando si fanno le feste nelle ludoteche fiorentine?",
        risposta:
          "Quasi sempre nel weekend: diverse sale lavorano solo il sabato e la domenica pomeriggio, su prenotazione. Muovetevi con almeno una settimana d'anticipo, di pi\u00f9 nei mesi di punta.",
      },
      {
        domanda: "E per i ragazzi pi\u00f9 grandi?",
        risposta:
          "Il lasergame \u00e8 il classico degli 8\u201312 anni: partite fino a 24 giocatori e festa in sala dedicata. Funziona bene anche come festa mista con i genitori.",
      },
      {
        domanda: "Come mando gli inviti?",
        risposta:
          "Con un biglietto che dica giorno, orario di inizio e fine, indirizzo e come confermare. Su Gioca con Mizi si crea gratis, con la conferma WhatsApp a un tocco e il QR \u00abInquadra e conferma\u00bb sul biglietto stampato.",
      },
    ],
  },
  {
    slug: "bari",
    citta: "Bari",
    aggiornata: "2026-10-21",
    rispostaBreve:
      "A Bari le feste di compleanno per bambini si fanno nelle ludoteche e sale feste della citt\u00e0 \u2014 da Poggiofranco a via Amendola \u2014 e nei comuni alle porte, come Valenzano: i pacchetti comprendono in genere animazione, buffet a fasce di prezzo e spesso anche addobbi e pulizie. Molte strutture seguono anche battesimi e feste a tema: chiedete un preventivo scritto con l'elenco di cosa \u00e8 incluso.",
    intro:
      "A Bari la sala feste \u00e8 un'istituzione: animazione, buffet e addobbi arrivano quasi sempre in pacchetto, e il passaparola pesa pi\u00f9 di qualunque pubblicit\u00e0. Ecco i posti di cui parlano le famiglie baresi.",
    locali: [
      {
        nome: "Ludoteca Il Cappellaio Matto",
        zona: "via Nicola Angelini",
        tipo: "ludoteca",
        descrizione:
          "Feste con animazione, pi\u00f9 campi estivi e baby parking durante l'anno.",
      },
      {
        nome: "Playhouse",
        zona: "Bari",
        tipo: "organizzazione feste",
        descrizione:
          "Feste a tema con buffet a pacchetti in tre fasce di prezzo per bambino, da confermare col preventivo.",
      },
      {
        nome: "Giardino dei Bimbi",
        zona: "via Amendola",
        tipo: "sala feste",
        descrizione:
          "Locali per compleanni, battesimi e carnevale, con buffet per 25 bambini, addobbi, palloncini e animazione.",
        sito: "https://www.scuolagiardinodeibimbi.net/feste-gallery",
      },
      {
        nome: "Baby Stars",
        zona: "Poggiofranco",
        tipo: "ludoteca",
        descrizione:
          "Struttura interna di 400 mq per bambini da 0 a 10 anni, con compleanni e feste a tema.",
      },
      {
        nome: "Play Planet",
        zona: "Bari",
        tipo: "sala feste",
        descrizione:
          "Tra le sale pi\u00f9 spaziose della guida cittadina, con animatore e spesso catering e pulizie inclusi.",
      },
      {
        nome: "Fuori di Festa",
        zona: "Valenzano",
        tipo: "sala feste con baby parking",
        descrizione:
          "Sala per compleanni e feste a tema alle porte della citt\u00e0, con servizio di baby parking.",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Bari?",
        risposta:
          "Nelle ludoteche e sale feste della citt\u00e0 (Poggiofranco, via Amendola, via Nicola Angelini) o nei comuni alle porte come Valenzano. Quasi tutte propongono il pacchetto completo con animazione e buffet.",
      },
      {
        domanda: "Cosa comprende il pacchetto festa a Bari?",
        risposta:
          "In genere animazione, buffet a fasce di prezzo per bambino e spesso addobbi, palloncini e pulizie. I prezzi pubblicati online invecchiano in fretta: fate sempre confermare tutto nel preventivo scritto.",
      },
      {
        domanda: "Le sale fanno anche battesimi e altre feste?",
        risposta:
          "S\u00ec, \u00e8 la norma: molte strutture seguono battesimi, comunioni e feste a tema oltre ai compleanni, con gli stessi spazi e lo stesso staff.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "catania",
    citta: "Catania",
    aggiornata: "2026-10-22",
    rispostaBreve:
      "A Catania la festa di compleanno per bambini si fa quasi sempre in una sala feste o ludoteca con playground: in citt\u00e0 ci sono spazi grandi con area baby e sala per i genitori, e appena fuori \u2014 San Gregorio, Misterbianco, Acireale \u2014 parchi giochi al chiuso e ville con spazi all'aperto. I pacchetti comprendono spesso allestimento e catering: fatevi dare un preventivo scritto con l'elenco di cosa \u00e8 incluso.",
    intro:
      "A Catania la sala feste \u00e8 una cosa seria: playground, gonfiabili e buffet arrivano quasi sempre in pacchetto, e molte famiglie scelgono tra citt\u00e0 e hinterland soprattutto in base al parcheggio. Ecco i posti di cui si parla di pi\u00f9.",
    locali: [
      {
        nome: "Nila Party Family",
        zona: "via Ingegnere",
        tipo: "sala feste con playground",
        descrizione:
          "Circa 400 mq con playground, area baby per i bimbi da 0 a 3 anni, sala relax per i genitori e spazi per i laboratori creativi.",
        sito: "https://nilapartyfamily.it",
      },
      {
        nome: "La Bacchetta Magica",
        zona: "via Quieta",
        tipo: "ludoteca e sala feste",
        descrizione:
          "Ludoteca con sala feste ampia, sala dance con palco e animazione; durante l'anno anche doposcuola e nido.",
        sito: "https://www.labacchettamagicact.it",
      },
      {
        nome: "Party Time",
        zona: "via Generale Cascino",
        tipo: "sala feste",
        descrizione:
          "Cinquecento metri quadri con due sale per le feste, gonfiabili, playground e un'area con animazione anche per i pi\u00f9 grandi.",
      },
      {
        nome: "PoWow",
        zona: "San Gregorio di Catania",
        tipo: "ludoteca e sala eventi",
        descrizione:
          "Gonfiabili, playground, calcetto e sala esterna, con pacchetti festa che comprendono allestimento e catering.",
        sito: "https://powow.it",
      },
      {
        nome: "Funny Island",
        zona: "Misterbianco",
        tipo: "parco giochi al chiuso",
        descrizione: "Parco giochi al coperto con sale a tema dedicate ai compleanni.",
        sito: "https://www.funny-island.com",
      },
      {
        nome: "Villa Anzalone",
        zona: "Acireale (Capomulini)",
        tipo: "parco con spazi all'aperto",
        descrizione:
          "Parco divertimenti e ludoteca con spazi all'aperto e una pista ciclabile privata; feste per bambini da 1 a 12 anni.",
        sito: "https://villaanzalone.it",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Catania?",
        risposta:
          "In citt\u00e0 nelle sale feste con playground (via Ingegnere, via Quieta, via Generale Cascino) oppure nell'hinterland: San Gregorio, Misterbianco e Acireale hanno parchi giochi al chiuso e spazi all'aperto, in genere pi\u00f9 comodi col parcheggio.",
      },
      {
        domanda: "Cosa comprende il pacchetto festa a Catania?",
        risposta:
          "Quasi sempre lo spazio giochi con l'animazione, e spesso allestimento e catering. Le aree baby per i piccolissimi e la sala per i genitori sono frequenti: chiedete il preventivo scritto con l'elenco completo.",
      },
      {
        domanda: "Meglio in citt\u00e0 o fuori?",
        risposta:
          "In citt\u00e0 si arriva senza macchina ma gli spazi sono pi\u00f9 contesi; fuori (Misterbianco, San Gregorio, Acireale) si trovano parchi pi\u00f9 grandi, spazi all'aperto e parcheggio. Col bel tempo, che a Catania \u00e8 la norma, l'aperto vince spesso.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "verona",
    citta: "Verona",
    aggiornata: "2026-10-22",
    rispostaBreve:
      "A Verona si pu\u00f2 scegliere tra la sala feste privata per i pi\u00f9 piccoli, il bowling in zona Fiera con pacchetti da circa 25 \u20ac a bambino e perfino il compleanno al museo: il Children's Museum e il Museo Archeologico Nazionale organizzano feste su prenotazione (al museo archeologico 190 \u20ac fino a 20 bambini). Verso il lago di Garda ci sono trattorie con ludoteca dove i grandi mangiano e i bimbi giocano.",
    intro:
      "Verona \u00e8 una delle poche citt\u00e0 dove il compleanno si pu\u00f2 fare al museo. Tra Fiera, San Marco e il lago le formule sono molto diverse tra loro: conviene partire da che festa volete \u2014 scatenata, per piccolissimi o \u00abda grandi\u00bb \u2014 e poi scegliere il posto.",
    locali: [
      {
        nome: "121 Bimbi",
        zona: "via San Marco",
        tipo: "sala feste privata",
        descrizione:
          "Sala riservata pensata per i bambini dai 2 ai 6 anni, con gonfiabili e giochi: si festeggia un compleanno alla volta e la data si blocca con un acconto.",
        sito: "https://www.csssport.com/121bimbi",
      },
      {
        nome: "Bowling Verona",
        zona: "viale della Fiera",
        tipo: "bowling con sala feste",
        descrizione:
          "Feste di compleanno da circa 25 \u20ac a bambino con un minimo di 8 invitati; nel weekend conviene prenotare presto.",
        sito: "https://www.bowlingverona.com/birthday",
      },
      {
        nome: "Children's Museum Verona",
        zona: "via Santa Teresa",
        tipo: "museo per bambini",
        descrizione:
          "Il museo pensato per i bambini, con area esperienziale e laboratorio ThinkLab, organizza il \u00abCompleanno al museo\u00bb su prenotazione.",
        sito: "https://www.cmverona.it/famiglie/compleanno/",
      },
      {
        nome: "Museo Archeologico Nazionale",
        zona: "centro storico",
        tipo: "museo",
        descrizione:
          "\u00abCompleanno al museo\u00bb per bambini dai 5 ai 12 anni: 190 \u20ac fino a 20 bambini, con l'ingresso di due adulti compreso, da prenotare con almeno una settimana di anticipo.",
        sito: "https://manverona.cultura.gov.it",
      },
      {
        nome: "Trattoria da Maick",
        zona: "Castelnuovo del Garda",
        tipo: "trattoria con ludoteca",
        descrizione:
          "Trattoria con ludoteca e spazi dedicati ai pi\u00f9 piccoli: la formula dove i grandi stanno a tavola e i bimbi giocano accanto.",
        sito: "https://www.trattoriadamaick.it",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Verona?",
        risposta:
          "In una sala feste privata (via San Marco), al bowling in zona Fiera, al museo \u2014 il Children's Museum e il Museo Archeologico fanno i compleanni su prenotazione \u2014 oppure verso il lago, nelle trattorie con ludoteca.",
      },
      {
        domanda: "Quanto costa una festa di compleanno a Verona?",
        risposta:
          "Il bowling parte da circa 25 \u20ac a bambino con almeno 8 invitati; il Museo Archeologico Nazionale chiede 190 \u20ac fino a 20 bambini. Per le sale private il prezzo dipende dal pacchetto: fatevi dare un preventivo scritto.",
      },
      {
        domanda: "Come funziona il compleanno al museo?",
        risposta:
          "Si prenota con anticipo (al Museo Archeologico almeno una settimana prima) e il museo organizza attivit\u00e0 e giochi a tema per il gruppo; l'archeologico accoglie bambini dai 5 ai 12 anni, fino a 20 per festa.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "venezia",
    citta: "Venezia",
    aggiornata: "2026-10-22",
    rispostaBreve:
      "A Venezia la maggior parte delle feste di compleanno per bambini si fa in terraferma, tra Mestre e dintorni: trampoline park con sala privata (pacchetto base 120 \u20ac nei feriali, 150 \u20ac nel weekend), ristoranti per eventi con area giochi e perfino il compleanno in fattoria. In centro storico gli spazi sono pochissimi (la ludoteca comunale di Castello \u00e8 chiusa dal 2022), quindi chi abita in laguna di solito festeggia oltre il ponte.",
    intro:
      "Venezia \u00e8 un caso a parte: in laguna gli spazi per le feste sono rari e piccoli, cos\u00ec il grosso dei compleanni si festeggia a Mestre e dintorni, dove c'\u00e8 di tutto \u2014 dal trampoline park alla fattoria. Ecco le opzioni di cui parlano le famiglie veneziane.",
    locali: [
      {
        nome: "Joy Zone Jump",
        zona: "Mestre (Porte di Mestre)",
        tipo: "trampoline park",
        descrizione:
          "Sala privata per tre ore fino a 25 persone: il pacchetto base per 4\u20139 invitati costa 120 \u20ac nei feriali e 150 \u20ac nel weekend, e c'\u00e8 una sala doppia fino a 50 persone.",
        sito: "https://www.joyzone-jump.com/sale_feste/feste.html",
      },
      {
        nome: "Mida Eventi",
        zona: "Mestre",
        tipo: "ristorante per eventi",
        descrizione:
          "Sala divisibile in area giochi e area tavoli, cucina interna e men\u00f9 a tema; il prezzo dipende dalla sala, dall'animazione e dal numero di invitati.",
        sito: "https://www.midaevents.it",
      },
      {
        nome: "Il Selgaro",
        zona: "Mestre",
        tipo: "agriturismo",
        descrizione:
          "Il compleanno in fattoria: truccabimbi, bolle di sapone e caccia al tesoro, in sala interna o all'aperto a seconda della stagione.",
        sito: "https://www.ilselgaro.com",
      },
      {
        nome: "Bimbiland",
        zona: "Mestre (via Don Luigi Peron)",
        tipo: "ludoteca",
        descrizione: "Ludoteca con sala eventi dedicata alle feste di compleanno.",
      },
      {
        nome: "Il Giardino delle Ciliegie",
        zona: "Cazzago di Pianiga",
        tipo: "spazio per l'infanzia",
        descrizione:
          "Affitta le sale per le feste nel weekend, quattro ore dalle 15 alle 19, fino a 15 bambini con i loro adulti; va prenotato con qualche settimana di anticipo.",
        sito: "https://www.ilgiardinodelleciliegie.it",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Venezia?",
        risposta:
          "Quasi sempre in terraferma: a Mestre e dintorni ci sono trampoline park, ristoranti per eventi, ludoteche e perfino un agriturismo per il compleanno in fattoria. In centro storico gli spazi sono pochissimi: la ludoteca comunale di Castello è chiusa dal 2022.",
      },
      {
        domanda: "Quanto costa una festa di compleanno a Venezia?",
        risposta:
          "Il trampoline park di Mestre pubblica i prezzi del pacchetto base: 120 \u20ac nei feriali e 150 \u20ac nel weekend per 4\u20139 invitati, con la sala privata per tre ore. Altrove il prezzo dipende da sala, men\u00f9 e animazione: chiedete il preventivo scritto.",
      },
      {
        domanda: "E se abito in centro storico?",
        risposta:
          "Gli spazi in laguna sono pochi e piccoli, quindi molte famiglie attraversano il ponte: Mestre si raggiunge in pochi minuti di treno o tram, e quasi tutte le location sono vicine alle fermate.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "messina",
    citta: "Messina",
    aggiornata: "2026-10-23",
    rispostaBreve:
      "A Messina la festa di compleanno per bambini si fa nei parchi giochi con gonfiabili e playground \u2014 i pi\u00f9 grandi sono lungo la costa, da Galati Marina a Torre Faro \u2014 oppure in ludoteca in centro citt\u00e0. Per i pi\u00f9 grandi c'\u00e8 anche il lasergame con la caccia al tesoro. Quasi tutti propongono pacchetti con animazione e sale a tema: fatevi elencare per iscritto cosa \u00e8 compreso.",
    intro:
      "A Messina le feste si dividono tra la costa \u2014 dove stanno i parchi giochi grandi, col giardino e le strutture sportive \u2014 e il centro, con le ludoteche storiche. Ecco i posti di cui parlano le famiglie messinesi.",
    locali: [
      {
        nome: "Festilandia",
        zona: "Galati Marina",
        tipo: "sala feste con giardino",
        descrizione:
          "Sale a tema e animatori al centro sportivo Il Limoneto, sulla statale 114: oltre 100 mq per le feste, con giardino, spettacoli di magia e mascotte.",
        sito: "https://festilandia.it",
      },
      {
        nome: "Neverland Park",
        zona: "Messina",
        tipo: "parco giochi con gonfiabili",
        descrizione:
          "Si presenta col playground pi\u00f9 grande della provincia: gonfiabili, strutture sportive per calcio, basket e pallavolo, salterelli e area baby.",
        sito: "https://www.neverlandpark.it",
      },
      {
        nome: "Ludoteca Anima e Corpo",
        zona: "centro citt\u00e0",
        tipo: "ludoteca",
        descrizione:
          "Feste di compleanno con animazione, gonfiabili e mascotte; il sabato anche feste a tema.",
      },
      {
        nome: "Baby Planet (Mister Alex)",
        zona: "via Croce Rossa",
        tipo: "area giochi",
        descrizione:
          "L'area giochi al coperto di Mister Alex, che d'estate si sposta anche a Torre Faro con la sede estiva; fanno pure gli allestimenti per le feste.",
        sito: "https://misteralex.it",
      },
      {
        nome: "Underworld Lasergame",
        zona: "Messina",
        tipo: "lasergame ed escape room",
        descrizione:
          "Per i pi\u00f9 grandi: pacchetto compleanno con partita al lasergame, caccia al tesoro e animazione su richiesta.",
        sito: "https://www.lasergamemessina.it/compleanni-eventi/",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Messina?",
        risposta:
          "Nei parchi giochi con gonfiabili lungo la costa (Galati Marina, e d'estate Torre Faro) o nelle ludoteche del centro. Dai 7-8 anni in su piace molto anche il lasergame con la caccia al tesoro.",
      },
      {
        domanda: "Cosa comprende il pacchetto festa a Messina?",
        risposta:
          "Di solito la sala o l'area riservata, l'animazione e spesso gli allestimenti a tema; gonfiabili e mascotte sono frequenti. I dettagli cambiano molto da locale a locale: chiedete il preventivo scritto.",
      },
      {
        domanda: "E per i bambini pi\u00f9 grandi, verso i 10 anni?",
        risposta:
          "Il lasergame \u00e8 l'opzione che funziona quasi sempre: partita, caccia al tesoro e, volendo, animazione. In alternativa i parchi con strutture sportive, dove la festa diventa un torneo.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "padova",
    citta: "Padova",
    aggiornata: "2026-10-23",
    rispostaBreve:
      "A Padova si festeggia in playroom in citt\u00e0 \u2014 con l'area giochi riservata e la sala buffet separata \u2014 ma il grosso delle feste si fa nella cintura: Legnaro, Albignasego, Maser\u00e0, Limena e Curtarolo hanno ludoteche e parchi con gonfiabili, sale fino a 50 invitati e perfino un castello a tema medievale. Molte strutture offrono anche catering e feste a domicilio: fatevi mettere tutto nel preventivo.",
    intro:
      "A Padova la mappa delle feste \u00e8 a cerchi: in citt\u00e0 le playroom raccolte, nella cintura i capannoni coi gonfiabili e i parchi a tema. In mezzo c'\u00e8 di tutto, dal castello medievale al parco spaziale: ecco i posti di cui parlano le famiglie padovane.",
    locali: [
      {
        nome: "Blank Space",
        zona: "via Belzoni",
        tipo: "playroom",
        descrizione:
          "La playroom si riserva per l'intera festa: area giochi con scivolo pensata per i bambini dai 2 agli 8 anni e sala separata per il buffet.",
        sito: "https://www.blankspacepadova.it/feste-di-compleanno-a-blank-space/",
      },
      {
        nome: "Gi\u00f2 Party",
        zona: "Legnaro",
        tipo: "sala feste",
        descrizione:
          "Sala interna fino a 50 invitati e spazi esterni che arrivano a 100 persone; aperto tutto l'anno.",
        sito: "https://gioparty.com/sala-feste/",
      },
      {
        nome: "La Valle Incantata",
        zona: "Albignasego",
        tipo: "ludoteca",
        descrizione:
          "Gonfiabili, animazione, baby parking e serate a tema; organizza anche feste a domicilio con servizio catering.",
        sito: "https://valleincantata.it",
      },
      {
        nome: "All'Arrembaggio",
        zona: "Maser\u00e0 di Padova",
        tipo: "ludoteca e parco giochi",
        descrizione:
          "Feste di compleanno con giochi gonfiabili, servizio catering e baby sitting dai 3 anni in su.",
        sito: "https://www.allarrembaggio.com",
      },
      {
        nome: "Castello di Cavilot",
        zona: "Limena",
        tipo: "parco a tema medievale",
        descrizione:
          "Seicento metri quadri a tema medievale con castello gonfiabile e aree divise per fasce d'et\u00e0, dai 3 ai 10 anni.",
      },
      {
        nome: "Danilandia",
        zona: "Curtarolo",
        tipo: "parco a tema spazio",
        descrizione:
          "Parco a tema spaziale con zona baby dedicata ai bimbi da 0 a 3 anni, gonfiabili e pacchetti festa personalizzabili.",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Padova?",
        risposta:
          "In citt\u00e0 nelle playroom con sala riservata (zona Portello/via Belzoni), oppure nella cintura: Legnaro, Albignasego, Maser\u00e0, Limena e Curtarolo hanno ludoteche, parchi a tema e sale fino a 50 invitati.",
      },
      {
        domanda: "Quanti invitati pu\u00f2 ospitare una sala a Padova?",
        risposta:
          "Le playroom cittadine sono pensate per gruppi raccolti; nella cintura si sale: a Legnaro la sala interna arriva a 50 invitati e gli spazi esterni a 100 persone.",
      },
      {
        domanda: "Si pu\u00f2 fare la festa a casa con l'animazione?",
        risposta:
          "S\u00ec: alcune ludoteche della cintura, come quella di Albignasego, portano a domicilio animazione e catering. Per i gonfiabili in giardino serve solo lo spazio (e un piano B al coperto se piove).",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "trieste",
    citta: "Trieste",
    aggiornata: "2026-10-23",
    rispostaBreve:
      "A Trieste per la festa di compleanno si affitta la sala: la citt\u00e0 funziona pi\u00f9 a sale per feste \u2014 da 50 a 200 mq, spesso con animazione da aggiungere \u2014 che a ludoteche col pacchetto tutto compreso. Le eccezioni ci sono: una ludoteca da circa mille metri quadri in via Capodistria e la sala della parrocchia con l'area esterna, che resta l'opzione pi\u00f9 economica. Prenotate presto: le sale buone nel weekend vanno via settimane prima.",
    intro:
      "Trieste ha un suo modo di fare le feste: si affitta la sala \u2014 grande, media o parrocchiale \u2014 e ci si costruisce sopra la festa, con l'animazione scelta a parte. Ecco gli spazi di cui parlano le famiglie triestine.",
    locali: [
      {
        nome: "Ludoteca Piccole Canaglie",
        zona: "via Capodistria",
        tipo: "ludoteca",
        descrizione:
          "Circa mille metri quadri, tra gli spazi pi\u00f9 grandi della citt\u00e0: feste in sede o a domicilio con gonfiabili e catering, per bambini da 1 a 10 anni.",
      },
      {
        nome: "Stock a Party",
        zona: "via Lionello Stock",
        tipo: "sala feste",
        descrizione:
          "Sala per compleanni con animazione personalizzabile: tema, decorazioni e men\u00f9 si scelgono col locale.",
        sito: "https://www.stockaparty.it",
      },
      {
        nome: "Villa Rinascita (parrocchia San Marco)",
        zona: "via dei Modiano",
        tipo: "sala parrocchiale con esterno",
        descrizione:
          "La sala compleanni della parrocchia, con area esterna: l'opzione semplice ed economica, da prenotare per tempo.",
        sito: "https://feste.parrocchiasanmarco.trieste.it",
      },
      {
        nome: "Sala Magicoloso",
        zona: "via Milano",
        tipo: "sala feste",
        descrizione:
          "Circa 200 mq con percorso ludo-didattico per i bambini e zona relax per i genitori.",
      },
      {
        nome: "Sala SpaceLab",
        zona: "Trieste",
        tipo: "sala feste",
        descrizione:
          "Open space con giochi e pavimento interattivo, climatizzato; su richiesta arriva gi\u00e0 allestito.",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Trieste?",
        risposta:
          "Quasi sempre in una sala affittata \u2014 via Lionello Stock, via Milano, la sala parrocchiale di via dei Modiano \u2014 oppure nella grande ludoteca di via Capodistria, che fa anche feste a domicilio.",
      },
      {
        domanda: "Qual \u00e8 l'opzione pi\u00f9 economica a Trieste?",
        risposta:
          "La sala parrocchiale con area esterna: si affitta lo spazio e si porta il resto da casa. In generale a Trieste conviene separare le voci \u2014 sala, torta, animazione \u2014 e aggiungere solo quello che serve.",
      },
      {
        domanda: "L'animazione \u00e8 compresa nella sala?",
        risposta:
          "Spesso no: a Trieste molte sale si affittano vuote o semi-allestite e l'animazione si sceglie a parte. Chiedete sempre cosa \u00e8 compreso: allestimento, pulizie finali e kit per il taglio della torta fanno la differenza.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "brescia",
    citta: "Brescia",
    aggiornata: "2026-10-24",
    rispostaBreve:
      "A Brescia la festa di compleanno per bambini si fa in ludoteca o in una sala affittata: in centro c'\u00e8 perfino il parco scientifico con la sala da 100 \u20ac per la mezza giornata (animazione esclusa, fino a una trentina di bambini), e per i pi\u00f9 grandi il lasergame da 17 \u20ac a partecipante. In Valtrompia, a Concesio, la ludoteca col ristorante fa stare comodi anche i genitori.",
    intro:
      "Brescia alterna due formule: la sala da riempire a modo vostro \u2014 come quella del parco scientifico in centro \u2014 e il pacchetto completo delle ludoteche. Ecco i posti di cui parlano le famiglie bresciane.",
    locali: [
      {
        nome: "AmbienteParco",
        zona: "Largo Torrelunga (centro)",
        tipo: "parco scientifico con sala feste",
        descrizione:
          "La sala feste del parco ambientale in centro: fino a una trentina di bambini con gli accompagnatori, 100 \u20ac per la mezza giornata dal luned\u00ec al sabato. L'animazione non c'\u00e8: si organizza in autonomia.",
        sito: "https://ambienteparco.it/giochi-nel-verde/",
      },
      {
        nome: "LaserGame Brescia",
        zona: "Brescia",
        tipo: "lasergame",
        descrizione:
          "Feste per bambini e ragazzi dai 7 ai 17 anni, con pacchetti da 17 \u20ac a partecipante e un minimo di 6 giocatori.",
        sito: "https://lasergame-brescia.com/compleanni/",
      },
      {
        nome: "Ape e Maia",
        zona: "Concesio",
        tipo: "ludoteca con ristorante",
        descrizione:
          "Ludoteca con ristorante e area bar per i genitori; nei feriali l'ingresso \u00e8 7 \u20ac con la merenda inclusa.",
        sito: "https://www.apeemaia.it",
      },
      {
        nome: "Mago Mim\u00f9",
        zona: "San Zeno Naviglio",
        tipo: "parco giochi al chiuso",
        descrizione:
          "Zone playground, pista di macchinine, campo di calcetto e salette dedicate ai compleanni.",
      },
      {
        nome: "Ludoteca Gatto Matto",
        zona: "via Manara",
        tipo: "ludoteca",
        descrizione:
          "La ludoteca gestita da ArciRagazzi, tra gli indirizzi storici segnalati dalla guida cittadina per le feste dei bambini.",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Brescia?",
        risposta:
          "In centro nella sala del parco scientifico (da riempire a modo proprio), nelle ludoteche in citt\u00e0 e nell'hinterland \u2014 San Zeno Naviglio, Concesio \u2014 o al lasergame per i pi\u00f9 grandi.",
      },
      {
        domanda: "Quanto costa una festa di compleanno a Brescia?",
        risposta:
          "La sala di AmbienteParco parte da 100 \u20ac per la mezza giornata senza animazione; il lasergame da 17 \u20ac a partecipante con minimo 6. Nelle ludoteche il prezzo dipende dal pacchetto: fatevi dare un preventivo scritto.",
      },
      {
        domanda: "Sala vuota o pacchetto completo?",
        risposta:
          "La sala da autogestire costa meno e lascia scegliere tutto, ma torta, animazione e pulizie restano a voi. Il pacchetto della ludoteca costa di pi\u00f9 e pensa a tutto. Con tanti invitati piccoli, il pacchetto di solito vince.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "taranto",
    citta: "Taranto",
    aggiornata: "2026-10-24",
    rispostaBreve:
      "A Taranto la festa di compleanno per bambini si fa in sala feste: tra viale Jonio, il Rinascimento e la zona Lama ci sono sale con gonfiabili, playground e animatori, quasi sempre con buffet su ordinazione e formule da concordare di persona. Molte lavorano solo su appuntamento e i prezzi non sono pubblicati: telefonate presto e fatevi scrivere il preventivo.",
    intro:
      "A Taranto le sale feste funzionano col passaparola e il primo appuntamento: si va, si vede la sala, si concorda tutto \u2014 animazione s\u00ec o no, buffet s\u00ec o no. Ecco gli indirizzi di cui parlano le famiglie tarantine.",
    locali: [
      {
        nome: "Magic Park",
        zona: "via Livio Andronico",
        tipo: "sala feste con playground",
        descrizione:
          "Due sale feste con zona gonfiabili e playground, animatori per i bambini e buffet su ordinazione, con men\u00f9 anche per gli adulti.",
      },
      {
        nome: "Tata Susina",
        zona: "viale del Rinascimento",
        tipo: "sala feste e ludoteca",
        descrizione:
          "Sala feste e ludoteca che durante l'anno fa anche doposcuola e babysitting.",
      },
      {
        nome: "Joya's Party",
        zona: "viale Jonio",
        tipo: "sala feste",
        descrizione: "Sala feste per bambini con parcheggio esterno e pacchetti buffet.",
      },
      {
        nome: "Nuvolandia Party",
        zona: "via Fogazzaro",
        tipo: "sala feste",
        descrizione:
          "Feste con o senza animazione e con o senza buffet: tutto si concorda al primo appuntamento, e si riceve solo su appuntamento.",
      },
      {
        nome: "Il Paese dei Balocchi",
        zona: "zona Lama",
        tipo: "ludoteca",
        descrizione: "Ludoteca in zona Lama, tra gli indirizzi segnalati dalle guide cittadine.",
      },
      {
        nome: "Mam\u00e0",
        zona: "Leporano",
        tipo: "spazio per l'infanzia",
        descrizione:
          "Alle porte della citt\u00e0: playroom, spazio verde per il taglio della torta e una terrazza, nella sala eventi di uno spazio per l'infanzia.",
        sito: "https://mamainfanzia.it/sala-eventi",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Taranto?",
        risposta:
          "Nelle sale feste della citt\u00e0 \u2014 viale Jonio, viale del Rinascimento, via Livio Andronico, zona Lama \u2014 o appena fuori, a Leporano. Quasi tutte uniscono gonfiabili, animazione e buffet su ordinazione.",
      },
      {
        domanda: "Quanto costa una festa di compleanno a Taranto?",
        risposta:
          "I prezzi quasi mai sono pubblicati online: si concordano al primo appuntamento in base a invitati, animazione e buffet. Fatevi mettere tutto per iscritto, pulizie e torta comprese.",
      },
      {
        domanda: "Serve prenotare molto prima?",
        risposta:
          "S\u00ec, specie per i weekend: molte sale ricevono solo su appuntamento e le date buone partono settimane prima. Meglio muoversi con un mese d'anticipo.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: "prato",
    citta: "Prato",
    aggiornata: "2026-10-24",
    rispostaBreve:
      "A Prato la festa di compleanno per bambini si fa nel grande parco al coperto dell'Omnia Center \u2014 oltre 1000 mq climatizzati e cinque salette, col prezzo della sala che include l'ingresso per 10 bambini \u2014 oppure in una sala in centro: ce n'\u00e8 una da 100 mq da 150 \u20ac per 5 ore e una associativa in autogestione con un contributo. Prenotate il weekend con anticipo.",
    intro:
      "A Prato la scelta \u00e8 tra il parco giochi al coperto, dove la festa si aggancia agli scivoli e ai gonfiabili, e la sala in centro da allestire a modo vostro. Ecco i posti di cui parlano le famiglie pratesi.",
    locali: [
      {
        nome: "Il Paese dei Saltas\u00f9",
        zona: "Omnia Center",
        tipo: "parco giochi al coperto",
        descrizione:
          "Oltre 1000 mq interamente al coperto e climatizzati, per bambini fino a 10 anni: cinque salette per le feste, col prezzo della sala che include l'ingresso al parco per 10 bambini, e servizio catering. Nei feriali il biglietto \u00e8 9 \u20ac.",
        sito: "https://www.ilpaesedeisaltasu.it/il-paese-dei-saltasu.php",
      },
      {
        nome: "Happy Party Space",
        zona: "via Tiepolo (centro)",
        tipo: "sala feste",
        descrizione:
          "Sala da 100 mq in centro, da 150 \u20ac per 5 ore, con attivit\u00e0 per bambini come il laboratorio di cupcake.",
        sito: "https://www.happypartyplanner.it/happy-party-space-la-location-per-feste-a-prato/",
      },
      {
        nome: "Centro Ideale",
        zona: "centro",
        tipo: "sala associativa",
        descrizione:
          "Associazione culturale che mette a disposizione una sala in autogestione con un contributo alle spese, oppure attivit\u00e0 ludico-educative curate dal centro.",
      },
      {
        nome: "Parco Giocagi\u00f2",
        zona: "Prato",
        tipo: "parco giochi",
        descrizione:
          "Parco giochi con spazio gioco e ludoteca, cucina, bar e gelateria artigianale.",
      },
    ],
    faq: [
      {
        domanda: "Dove si festeggia un compleanno per bambini a Prato?",
        risposta:
          "Al parco al coperto dell'Omnia Center, con le salette dedicate, oppure in una sala in centro \u2014 da 150 \u20ac per 5 ore quella privata, con un contributo associativo quella in autogestione.",
      },
      {
        domanda: "Quanto costa una festa di compleanno a Prato?",
        risposta:
          "La sala privata in centro parte da 150 \u20ac per 5 ore; al parco coperto il prezzo della saletta include l'ingresso per 10 bambini (biglietto feriale 9 \u20ac). La sala associativa chiede un contributo alle spese.",
      },
      {
        domanda: "Meglio il parco coperto o la sala?",
        risposta:
          "Col gruppo vivace e sotto i 10 anni vince il parco: i giochi sono gi\u00e0 l\u00ec e la saletta serve solo per torta e regali. La sala conviene per le feste a tema, dove volete scegliere voi attivit\u00e0 e allestimento.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp gi\u00e0 scritta, e sul biglietto stampato c'\u00e8 il QR \u00abInquadra e conferma\u00bb.",
      },
    ],
  },
  {
    slug: 'reggio-calabria',
    citta: 'Reggio Calabria',
    aggiornata: "2026-10-25",
    rispostaBreve:
      'A Reggio Calabria la festa di compleanno per bambini si fa in una sala feste con gonfiabili e playground — ce ne sono in città e verso nord, fino a Catona — oppure in un locale col parco giochi dove i grandi mangiano e i bambini giocano. Molte sale propongono temi a scelta e il catering su richiesta: fatevi elencare per iscritto cosa è compreso.',
    intro:
      'A Reggio le feste si dividono tra le sale con gonfiabili, dove si sceglie il tema, e i locali col parco giochi, dove la festa diventa anche una cena per i grandi. Ecco i posti di cui parlano le famiglie reggine.',
    locali: [
      {
        nome: 'Funny Club',
        zona: 'via Tirrenica',
        tipo: 'locale con parco giochi e sala feste',
        descrizione:
          "Ludoteca e locale con sala principale, terrazza per le sere d'estate e una sala riservata per le feste private.",
        sito: 'https://ludotecafunnyclub.it/feste-eventi/',
      },
      {
        nome: 'Space Party',
        zona: 'via Caserma',
        tipo: 'sala feste',
        descrizione:
          'Sala di 150 mq con playground e gonfiabili: si sceglie fra diversi temi e si può chiedere il catering.',
      },
      {
        nome: "L'Oasi del Divertimento",
        zona: 'Catona',
        tipo: 'ludoteca e sala eventi',
        descrizione:
          'Gonfiabili, ludoteca e baby parking, con la sala da affittare per le feste private.',
      },
      {
        nome: 'Neverland Parco Giochi Ludoteca Party',
        zona: 'via Nazionale',
        tipo: 'parco giochi e ludoteca',
        descrizione:
          'Parco giochi e ludoteca che ospita le feste dei bambini e anche eventi per gli adulti.',
      },
    ],
    faq: [
      {
        domanda: 'Dove si festeggia un compleanno per bambini a Reggio Calabria?',
        risposta:
          'Nelle sale feste con gonfiabili e playground (via Caserma, verso nord fino a Catona) o nei locali col parco giochi come quello di via Tirrenica, dove i grandi possono anche cenare.',
      },
      {
        domanda: 'Cosa comprende una festa in sala a Reggio Calabria?',
        risposta:
          "Di solito la sala, i gonfiabili e il playground; temi, catering e animazione si aggiungono su richiesta. I prezzi online sono rari: chiedete un preventivo scritto con l'elenco completo.",
      },
      {
        domanda: "Si può festeggiare all'aperto?",
        risposta:
          "Sì, e col clima di Reggio succede spesso: alcuni locali hanno terrazze e spazi esterni per le sere d'estate. Tenete comunque una sala al coperto come piano B.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma».",
      },
    ],
  },
  {
    slug: 'modena',
    citta: 'Modena',
    aggiornata: "2026-10-25",
    rispostaBreve:
      "A Modena la festa di compleanno per bambini si fa nella grande ludoteca al coperto di Modena Est — 1.300 mq di gonfiabili e playground per i bambini fino a 10 anni — oppure in posti diversi dal solito: l'ippodromo ha una sala compleanni con gonfiabili e spazio all'aperto, e a Campogalliano il Museo della Bilancia organizza le feste per i bambini dai 6 ai 10 anni.",
    intro:
      "Modena ha una delle ludoteche al coperto più grandi della zona, ma anche alternative originali per chi vuole una festa diversa: il compleanno all'ippodromo o al museo. Ecco i posti di cui parlano le famiglie modenesi.",
    locali: [
      {
        nome: 'Oplà',
        zona: 'Modena Est (via Gasparini)',
        tipo: 'ludoteca al coperto',
        descrizione:
          '1.300 mq con gonfiabili, playground e area ristoro per i bambini da 0 a 10 anni: zona baby 0–3 e area 4–10 con campo da calcio e basket indoor.',
        sito: 'https://www.oplamodena.it/feste-di-compleanno',
      },
      {
        nome: 'Ippodromo Ghirlandina',
        zona: 'Modena',
        tipo: "sala compleanni all'ippodromo",
        descrizione:
          "Sala interna per i compleanni dei bambini attrezzata con gonfiabili, con area esterna e attività all'aperto.",
        sito: 'https://ippodromoghirlandina.it/location-per-compleanni-modena/',
      },
      {
        nome: 'Museo della Bilancia',
        zona: 'Campogalliano',
        tipo: 'museo',
        descrizione:
          'Il museo degli strumenti di misura organizza compleanni e feste per i bambini dai 6 ai 10 anni.',
        sito: 'https://www.museodellabilancia.it/annuncio.php?ida=175&idarg=106',
      },
      {
        nome: 'Casa Matilda Ludoteca',
        zona: 'Piumazzo (Castelfranco Emilia)',
        tipo: 'ludoteca e baby parking',
        descrizione:
          'Ludoteca e baby parking per i bambini dai 3 ai 10 anni, che si può riservare per le feste a tema.',
      },
    ],
    faq: [
      {
        domanda: 'Dove si festeggia un compleanno per bambini a Modena?',
        risposta:
          "Nella grande ludoteca al coperto di Modena Est, in una ludoteca più raccolta, oppure in un posto insolito: la sala compleanni dell'ippodromo o il Museo della Bilancia a Campogalliano.",
      },
      {
        domanda: "Qual è l'opzione per i più piccoli?",
        risposta:
          "La ludoteca al coperto con la zona baby da 0 a 3 anni: i piccolissimi giocano in un'area separata dai grandi, e la festa resta tranquilla per tutti.",
      },
      {
        domanda: 'Esiste una festa di compleanno diversa dal solito?',
        risposta:
          "Sì: il compleanno al museo (dai 6 ai 10 anni) o all'ippodromo, con la sala attrezzata e lo spazio all'aperto. Sono formule da prenotare con anticipo.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma».",
      },
    ],
  },
  {
    slug: 'parma',
    citta: 'Parma',
    aggiornata: "2026-10-25",
    rispostaBreve:
      'A Parma la festa di compleanno per bambini si fa nei parchi giochi al coperto — il più grande supera i 1.600 mq, con pacchetti tutto compreso o sale da noleggiare — o nelle ludoteche con playground e laboratori creativi, dove si può personalizzare il pacchetto. Ci sono anche sale più raccolte per le feste a tema: chiedete un preventivo scritto con tutto incluso.',
    intro:
      "Parma offre un po' di tutto: il parco indoor enorme per le feste scatenate, la ludoteca coi laboratori per chi preferisce fare, e la sala a tema per i più piccoli. Ecco i posti di cui parlano le famiglie parmigiane.",
    locali: [
      {
        nome: 'Divertilandia',
        zona: 'via Anselmi',
        tipo: 'parco giochi al coperto',
        descrizione:
          'Parco indoor di circa 1.600 mq: si sceglie tra il pacchetto tutto compreso e il noleggio delle sale riservate già allestite.',
      },
      {
        nome: 'Sofiland',
        zona: 'via Rastelli',
        tipo: 'ludoteca con playground',
        descrizione:
          'Pacchetti festa personalizzabili con playground, laboratori creativi e animazione; nel playground scivoli e una mini città per il gioco di ruolo.',
        sito: 'https://ludotecasofiland.it',
      },
      {
        nome: 'La Bacchetta Magica',
        zona: 'via Rubini',
        tipo: 'sala feste e ludoteca',
        descrizione:
          'Sala per feste di compleanno e feste a tema, con baby parking e ludoteca.',
      },
      {
        nome: 'Magicomondo',
        zona: 'Parma',
        tipo: 'parco giochi con gonfiabili',
        descrizione:
          "Gonfiabili, playground e feste di compleanno, con un'area dedicata ai bimbi da 0 a 3 anni.",
        instagram: 'https://www.instagram.com/magicomondoparma/',
      },
    ],
    faq: [
      {
        domanda: 'Dove si festeggia un compleanno per bambini a Parma?',
        risposta:
          'Nei parchi giochi al coperto (il più grande in via Anselmi), nelle ludoteche con laboratori creativi come quella di via Rastelli, o nelle sale feste a tema più raccolte.',
      },
      {
        domanda: 'Pacchetto tutto compreso o sala in affitto?',
        risposta:
          'Il pacchetto toglie ogni pensiero ma costa di più; il noleggio della sala allestita costa meno e lascia a voi buffet e torta. Molti parchi offrono entrambe le formule.',
      },
      {
        domanda: 'Ci sono feste adatte ai più piccoli?',
        risposta:
          "Sì: diverse strutture hanno un'area dedicata ai bimbi da 0 a 3 anni, separata dai giochi dei più grandi.",
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta:
          "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma».",
      },
    ],
  },
  {
    slug: "reggio-emilia",
    citta: "Reggio Emilia",
    aggiornata: "2026-10-26",
    rispostaBreve: "A Reggio Emilia una festa di compleanno per bambini si fa al Bowling 2000 di Cella, che organizza feste con bowling e laser game per bambini e ragazzi dai 4 ai 18 anni, oppure in fattoria: con gli asini dell'Asineria al Mauriziano o tra gli animali di Fattoria Alex a Quattro Castella. Se scegliete una festa all'aperto, chiedete sempre qual è il piano B in caso di pioggia: all'Asineria, per esempio, con il maltempo l'attività con gli asini viene annullata.",
    intro: "Reggio Emilia è una città a misura di bambino, con una lunga tradizione educativa e una campagna che comincia a pochi minuti dal centro. Per il compleanno si può scegliere tra una sfida al laser game o un pomeriggio in fattoria con gli animali.",
    locali: [
      { nome: "Bowling 2000 – Laser Game Revolution", zona: "Cella (Reggio Emilia)", tipo: "lasergame", descrizione: "Centro con piste da bowling, sala giochi e laser game, che organizza feste di compleanno per bambini e ragazzi dai 4 ai 18 anni con formule che uniscono gioco e pizza.", sito: "https://www.bowling2000.it/" },
      { nome: "Asineria Asini di Reggio Emilia", zona: "Mauriziano (Reggio Emilia)", tipo: "fattoria didattica, spazi all'aperto", descrizione: "Nella fattoria «L'asino dell'Ariosto» e nel vicino Palazzo Vecchio del Mauriziano ci sono aree verdi recintate e sale a uso esclusivo per i compleanni; su richiesta si aggiungono circa due ore di animazione con gli asini, nella stagione del «Compleanno con raglio» (in primavera-estate e da settembre a fine ottobre). Servono scarpe chiuse e, se piove, l'attività con gli asini viene annullata.", sito: "https://www.asinidireggioemilia.it/" },
      { nome: "Fattoria Alex", zona: "Quattro Castella", tipo: "fattoria didattica, spazi all'aperto", descrizione: "Fattoria sulle colline reggiane che organizza compleanni all'aperto con animazione, contatto con gli animali e laboratori a scelta, come le erbe aromatiche o la caccia al tesoro. Per i mesi freddi c'è un salone riscaldato da circa 35 persone.", sito: "https://fattoriaalex.it/" },
    ],
    faq: [
      { domanda: "Dove festeggiare a Reggio Emilia con bambini piccoli?", risposta: "Per i più piccoli la fattoria è la scelta più tranquilla: l'Asineria al Mauriziano e Fattoria Alex a Quattro Castella propongono compleanni con il contatto diretto con gli animali, in spazi verdi e con una sala per quando fa freddo o piove." },
      { domanda: "Che cosa proporre a una festa per ragazzi più grandi?", risposta: "Bowling e laser game piacciono molto anche ai ragazzi delle medie: il Bowling 2000 di Cella organizza feste per bambini e ragazzi dai 4 ai 18 anni, unendo gioco e pizza. Chiedete al momento della prenotazione quanto dura la partita di laser game e da che età è consigliata." },
      { domanda: "Si può fare una festa in fattoria anche in autunno o in inverno?", risposta: "Dipende dalla struttura: all'Asineria il «Compleanno con raglio» segue un calendario stagionale e con la pioggia l'attività con gli asini salta, mentre Fattoria Alex mette a disposizione un salone riscaldato per i mesi freddi. In ogni caso conviene concordare prima un'alternativa al coperto." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "perugia",
    citta: "Perugia",
    aggiornata: "2026-10-26",
    rispostaBreve: "A Perugia la festa di compleanno per bambini si fa nei parchi giochi al coperto e nelle sale feste, come Partyland a Balanzano (330 mq, feste di quattro ore) o la sala a tema sport di FestePerugia (450 mq, dai 3 ai 12 anni); nella bella stagione c'è la Città della Domenica, con pacchetti compleanno all'aperto. Alcune sale lavorano a turni fissi e il weekend si riempie presto: bloccate la data qualche settimana prima e chiedete subito se pulizie, buffet e uso esclusivo sono inclusi.",
    intro: "Perugia è una città a misura di famiglia, con sale feste e parchi giochi al coperto sparsi tra i quartieri e le frazioni lungo la E45. Per i mesi caldi c'è poi la Città della Domenica, uno dei parchi divertimenti per famiglie più antichi d'Italia, aperto negli anni Cinquanta.",
    locali: [
      {
        nome: "Partyland",
        zona: "Balanzano (Perugia)",
        tipo: "parco giochi al coperto",
        descrizione: "Parco giochi al coperto di 330 mq a circa 2 km dalle uscite E45 di Balanzano e Ponte San Giovanni, con parcheggio gratuito. Le feste durano quattro ore a turni fissi, con pulizie incluse; nell'area giochi si entra senza scarpe.",
        sito: "https://partyland.fun/",
      },
      {
        nome: "FestePerugia – All Music Hall",
        zona: "Perugia, via Ruggero D'Andreotto",
        tipo: "sala feste",
        descrizione: "La Sala Stadium, pensata per bambini dai 3 ai 12 anni, è di 450 mq a tema sport, con mini calcio, mini volley, mini basket, un tappeto elastico e un grande calciobalilla. La Sala Party (320 mq) ha un'area baby con cavalcabili e scivolo e una zona mini-disco.",
        sito: "https://www.festeperugia.it/",
      },
      {
        nome: "Città della Domenica",
        zona: "Perugia, a circa 6 km dal centro",
        tipo: "parco divertimenti",
        descrizione: "Parco storico immerso nel verde a pochi chilometri dal centro, con aree a tema fiabesco e western. Propone pacchetti compleanno con area riservata e, in alcune formule, animazione pomeridiana con giochi e caccia al tesoro; il parco apre solo in alcuni mesi dell'anno, quindi verifica le date della stagione.",
        sito: "https://www.cittadelladomenica.it/",
      },
      {
        nome: "Etoile Baby Play Room",
        zona: "Torgiano, località Signoria",
        tipo: "ludoteca e sala feste",
        descrizione: "Ludoteca di circa 200 mq per bambini da 0 a 12 anni, con pavimento antitrauma, che organizza compleanni e feste a tema. Le feste si fanno in esclusiva dal venerdì alla domenica, mentre negli altri giorni è aperta al pubblico con ludoteca, baby parking e aiuto compiti.",
        sito: "https://etoilebaby.it/",
      },
    ],
    faq: [
      {
        domanda: "Quali sono i posti più adatti per una festa di compleanno per bambini a Perugia?",
        risposta: "Per l'inverno funzionano bene i parchi giochi al coperto e le sale feste, come Partyland a Balanzano o FestePerugia; nella bella stagione la Città della Domenica offre pacchetti compleanno all'aperto. Se cerchi uno spazio raccolto per i più piccoli, a Torgiano c'è la ludoteca Etoile Baby."
      },
      {
        domanda: "Con quanto anticipo conviene prenotare la sala?",
        risposta: "Per il sabato e la domenica è meglio muoversi con qualche settimana di anticipo, perché alcune sale, come Partyland, lavorano a turni fissi e le date del weekend vanno via in fretta. In settimana di solito c'è più scelta."
      },
      {
        domanda: "Cosa chiedere prima di confermare la location?",
        risposta: "Chiedi quante ore dura la festa, se le pulizie e il buffet sono inclusi, se la sala è in uso esclusivo e quali regole valgono nell'area giochi (per esempio se si entra senza scarpe). Così eviti sorprese il giorno della festa."
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»."
      },
    ],
  },
  {
    slug: "livorno",
    citta: "Livorno",
    aggiornata: "2026-10-26",
    rispostaBreve: "A Livorno una festa di compleanno per bambini si fa volentieri all'Acquario, con formule per 4-6 e 7-12 anni e un'attività guidata di un'ora e mezza, o al Museo di Storia Naturale del Mediterraneo, con un laboratorio scientifico per gruppi fino a 30 persone. Per giocare e muoversi c'è il fun center di Porta a Mare con sale feste e playground, e sulle colline una fattoria didattica affitta aula, giardino e parco giochi. Al museo le feste si fanno solo il giovedì e la domenica da settembre a maggio: fissate la data con anticipo.",
    intro: "Livorno offre alle famiglie un mix raro: feste educative tra acquario e museo di scienze naturali, un grande centro di divertimento al porto e spazi verdi in collina. Che il festeggiato ami il mare, gli esperimenti o correre all'aria aperta, c'è un posto adatto a ogni età e a ogni stagione.",
    locali: [
      {
        nome: "Acquario di Livorno",
        zona: "Terrazza Mascagni",
        tipo: "museo",
        descrizione: "Propone feste di compleanno per bambini dai 4 ai 12 anni, con due formule divise per fascia d'età: una guida accompagna il gruppo in un'attività educativa di circa un'ora e mezza lungo il percorso espositivo, poi si passa in una sala dedicata per il taglio della torta. Il gruppo va da un minimo di 12 a un massimo di 40 bambini.",
        sito: "https://www.acquariodilivorno.it"
      },
      {
        nome: "Museo di Storia Naturale del Mediterraneo",
        zona: "Via Roma (Villa Henderson)",
        tipo: "museo",
        descrizione: "Ospita feste di compleanno il giovedì e la domenica pomeriggio, da settembre a maggio, con un'ora di attività scientifica curata dagli educatori della cooperativa Itinera: visita ad alcune sale del museo e un laboratorio in cui ogni bambino realizza un piccolo lavoretto da portare a casa. Il limite è di 30 persone tra bambini e adulti, con spazi interni ed esterni a disposizione.",
        sito: "https://musmed.provincia.livorno.it"
      },
      {
        nome: "Wappy Livorno",
        zona: "Porta a Mare",
        tipo: "sala feste con playground",
        descrizione: "Centro di divertimento per famiglie nel complesso di Porta a Mare, con playground, bowling, autoscontri, realtà virtuale e sale per feste ed eventi pensate per bambini, ragazzi e adulti. La festa si può scegliere e prenotare direttamente online.",
        sito: "https://wappy.fun/livorno/"
      },
      {
        nome: "Limone nel Verde",
        zona: "Colline di Livorno",
        tipo: "fattoria didattica, spazi all'aperto",
        descrizione: "Fattoria didattica biologica che affitta i suoi spazi per le feste: un'aula di 120 mq ricavata da un'antica stalla, un parco giochi attrezzato, un campetto di calcetto, un grande gazebo e un giardino fiorito. Tavoli, sedie e riscaldamento in inverno sono compresi, mentre animazione e rinfresco restano a cura della famiglia.",
        sito: "https://limonenelverde.it"
      }
    ],
    faq: [
      {
        domanda: "Dove festeggio a Livorno se il tempo è brutto?",
        risposta: "L'Acquario, il Museo di Storia Naturale del Mediterraneo e Wappy a Porta a Mare sono al coperto; anche Limone nel Verde, pur essendo in campagna, ha un'aula di 120 mq riscaldata in inverno, così la festa non dipende dal meteo."
      },
      {
        domanda: "Qual è la soluzione più adatta in base all'età?",
        risposta: "L'Acquario ha formule separate per 4-6 anni e 7-12 anni, mentre il laboratorio del Museo funziona bene con i bambini che amano scoprire e costruire. Per i più grandi che vogliono muoversi, Wappy unisce playground e attrazioni come bowling e autoscontri; per i più piccoli è prezioso il giardino recintato di una fattoria didattica."
      },
      {
        domanda: "Quanto prima devo prenotare?",
        risposta: "Il prima possibile, soprattutto per sabato e domenica. Al Museo le feste si tengono solo il giovedì e la domenica da settembre a maggio e la data si concorda via email; all'Acquario serve un gruppo di almeno 12 bambini, quindi conviene contare gli invitati prima di fissare."
      },
      {
        domanda: "Come raccolgo le conferme?",
        risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»."
      }
    ]
  },
  {
    slug: "ravenna",
    citta: "Ravenna",
    aggiornata: "2026-10-27",
    rispostaBreve: "A Ravenna la festa di compleanno per bambini si fa nei parchi giochi al coperto con gonfiabili, come Neverland Park alle Bassette (700 mq, con un'area per i bimbi da 0 a 3 anni), nelle sale feste con playground in città e a Marina Romea, oppure per i più grandi con il pacchetto compleanno di Mirabilandia. Molti pacchetti arrivano a circa 20 bambini fratelli compresi: fate la lista degli invitati prima di prenotare.",
    intro: "Ravenna unisce una città raccolta e i lidi a pochi minuti, e questo si vede anche nelle feste: si sceglie tra i parchi gioco coperti della periferia, le sale feste vicino al mare e il grande parco divertimenti a Savio.",
    locali: [
      { nome: "Neverland Park", zona: "Ravenna, zona commerciale Le Bassette", tipo: "parco giochi al coperto", descrizione: "Parco giochi coperto di 700 mq con gonfiabili, labirinti, tappeti elastici, un piccolo campo da calcio e un'area dedicata ai bimbi da 0 a 3 anni. Ha una sala feste e organizza compleanni di mattina, di pomeriggio o di sera; il pacchetto comprende fino a 20 bambini, fratelli inclusi.", sito: "https://www.neverlandparkravenna.it/" },
      { nome: "Cucina Retrò", zona: "Marina Romea (Ravenna)", tipo: "sala feste con playground", descrizione: "Locale dedicato esclusivamente ai compleanni dei bambini, con sale per le feste e circa 200 mq di aree gioco, tra cui una ludoteca coperta con playground, piscina di palline e scivolo; i genitori possono seguire i bimbi dal tavolo grazie ai monitor. Il buffet è preparato in giornata dalla cucina e in stagione si gioca anche all'aperto.", sito: "https://cucinaretro.it/" },
      { nome: "L'isola di Sophie", zona: "Ravenna, via Agro Pontino", tipo: "sala feste con playground", descrizione: "Spazio per le feste di compleanno aperto nel 2026, pensato per riunire in un unico ambiente l'area gioco dei bambini e uno spazio riservato ai genitori. Le due aree principali accolgono una ventina di bambini, con gonfiabili, un playground di sei metri, scivoli e un'area baby per i più piccoli." },
      { nome: "Mirabilandia", zona: "Savio di Ravenna", tipo: "parco divertimenti", descrizione: "Il parco propone un pacchetto compleanno per gruppi di almeno 10 persone, con ingresso omaggio per il festeggiato, ingresso scontato per gli invitati e un pasto con torta di compleanno; d'estate c'è una formula simile anche al parco acquatico Mirabeach. Il pacchetto va prenotato almeno 3 giorni prima.", sito: "https://www.mirabilandia.it/" },
    ],
    faq: [
      { domanda: "Quanti bambini posso invitare in un parco giochi al coperto?", risposta: "Dipende dal locale, ma a Ravenna è frequente un pacchetto fino a circa 20 bambini: a Neverland Park, per esempio, il conteggio comprende anche i fratelli. Fai la lista completa prima di prenotare e chiedi come vengono contati i più piccoli." },
      { domanda: "Si può festeggiare al mare anche fuori stagione?", risposta: "In buona parte dell'anno sì: a Marina Romea Cucina Retrò ha sale e aree gioco al coperto dedicate ai compleanni ed è aperto da febbraio a novembre, con il gioco all'aperto nella bella stagione. Verificate sempre date e orari con il locale prima di fissare." },
      { domanda: "Che cosa conviene per i bambini più grandi?", risposta: "Per chi ama le attrazioni c'è Mirabilandia, che offre un pacchetto compleanno per gruppi di almeno 10 persone, da prenotare almeno 3 giorni prima. Ricorda che il parco è stagionale: controlla il calendario di apertura prima di fissare la data." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "cagliari",
    citta: "Cagliari",
    aggiornata: "2026-10-27",
    rispostaBreve: "A Cagliari la festa di compleanno per bambini si fa soprattutto nelle sale feste con playground e gonfiabili, in città e nell'hinterland: a Sestu c'è una sala di circa 200 mq con uno scivolo gonfiabile alto 6 metri, a Monserrato una sala di 160 mq con un giardino di 200 mq. Le sale lavorano spesso a turni pomeridiani: fissate la data con qualche settimana d'anticipo, soprattutto per il weekend.",
    intro: "Cagliari e i comuni vicini hanno diverse sale feste pensate per i più piccoli, con playground, gonfiabili e spazi per il buffet, e alcune hanno anche un giardino per le giornate di sole. Ecco qualche indirizzo da cui partire per organizzare una festa serena, dentro la città o a pochi minuti di strada.",
    locali: [
      { nome: "Edoland", zona: "Cagliari", tipo: "sala feste con playground", descrizione: "Sala feste per bambini con playground gigante, gonfiabile, scivoli e un trono per il taglio della torta; c'è un'assistente di sala che aiuta con catering, bevande e buffet. La sala è climatizzata e c'è un ampio parcheggio.", sito: "https://edoland.it/" },
      { nome: "Il Castello Incantato", zona: "Monserrato", tipo: "sala feste con playground", descrizione: "Sala di 160 mq con zona buffet, trono per il festeggiato, playground con vasca di palline e zona discoteca. All'esterno c'è un giardino di 200 mq con un grande castello gonfiabile e un tappeto elastico.", sito: "https://ilcastelloincantatocagliari.it/" },
      { nome: "Happy", zona: "Sestu", tipo: "sala feste con playground", descrizione: "Sala feste di circa 200 mq con playground, salterello, piscina di palline e scivolo gonfiabile alto 6 metri. È attrezzata per il catering con due frigoriferi e un forno a microonde.", sito: "https://www.happysalafestesestu.com/" },
    ],
    faq: [
      { domanda: "Meglio una sala in città o nell'hinterland?", risposta: "Dipende da dove abitano gli invitati: in città c'è per esempio Edoland, mentre a Monserrato e Sestu si trovano spazi ampi con playground e gonfiabili. Guardate soprattutto il parcheggio e i tempi di strada per le famiglie." },
      { domanda: "Ci sono sale con uno spazio all'aperto?", risposta: "Sì: Il Castello Incantato a Monserrato ha un giardino di 200 mq con castello gonfiabile e tappeto elastico. Con il clima di Cagliari uno spazio esterno è prezioso da primavera all'autunno, ma chiedete sempre cosa succede in caso di maltempo." },
      { domanda: "Posso portare il mio buffet?", risposta: "Molte sale sono attrezzate per accogliere il catering: Happy a Sestu, per esempio, mette a disposizione frigoriferi e microonde. Le regole su cibo, torta e bevande cambiano da sala a sala, quindi chiedetele al momento della prenotazione." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "foggia",
    citta: "Foggia",
    aggiornata: "2026-10-27",
    rispostaBreve: "A Foggia la festa di compleanno per bambini si fa soprattutto nelle ludoteche con sala feste di città, oppure in spazi con giardino come l'Officina del Gioco, che ha 1000 mq all'aperto con gonfiabili e aree salto. Ogni ludoteca ha le sue regole (in una l'area giochi è fino ai 9 anni): chiedete subito quanti bambini comprende la formula e prenotate con largo anticipo.",
    intro: "Foggia ha una rete vivace di ludoteche di quartiere che d'inverno diventano il punto di riferimento per i compleanni dei più piccoli. Con la bella stagione, invece, si cercano spazi con giardino dove i bambini possano correre e saltare all'aperto.",
    locali: [
      { nome: "Ludoteca I Sogni di Luca", zona: "Foggia, via Paolo Telesforo", tipo: "ludoteca e sala feste", descrizione: "Ludoteca con area giochi per bambini fino ai 9 anni, che organizza feste con allestimento personalizzato sul tema scelto, buffet merenda e torta. Le prenotazioni delle feste si fanno solo per telefono o WhatsApp.", sito: "https://ludotecaisognidiluca.it/" },
      { nome: "La Città dei Giochi", zona: "Foggia, viale Manfredi", tipo: "ludoteca e sala feste", descrizione: "Si presenta come sala feste dedicata ai bambini e alle loro famiglie, con compleanni, spazi per il gioco libero e laboratori creativi. Le formule più complete includono la sala per due ore, animazione e buffet.", sito: "https://lacittadeigiochi.it/" },
      { nome: "L'Officina del Gioco (As.So.Ri.)", zona: "Foggia, via Benedetto Biagi", tipo: "ludoteca e sala feste", descrizione: "Ludoteca con un giardino di 1000 mq all'aperto con giochi, aree salto e gonfiabili, dove si organizzano feste personalizzate con allestimento e catering. Per i più grandi c'è un formato a parte con arena laser, sfide di ballo e calcetto al coperto.", sito: "https://asdassoriets.it/officina-del-gioco/" },
    ],
    faq: [
      { domanda: "Dove fare una festa di compleanno per bambini a Foggia?", risposta: "Le scelte più comuni sono le ludoteche con sala feste in città, ad esempio in via Paolo Telesforo e in viale Manfredi. Se la festa è nella bella stagione, l'Officina del Gioco in via Benedetto Biagi ha un ampio giardino con gonfiabili." },
      { domanda: "Fino a che età vanno bene le ludoteche di Foggia?", risposta: "Dipende dal locale: ai Sogni di Luca, per esempio, l'area giochi è riservata ai bambini fino ai 9 anni. Per i più grandi alcune strutture propongono formati dedicati, come l'arena laser e il calcetto al coperto dell'Officina del Gioco." },
      { domanda: "Cosa chiedere prima di prenotare la sala?", risposta: "Quanti bambini sono compresi nella formula e come si contano quelli in più, cosa include il buffet (e se è pensato anche per gli adulti), quanto dura la festa e se l'allestimento a tema è compreso. Meglio fissare la data con qualche settimana di anticipo, soprattutto nei fine settimana." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "rimini",
    citta: "Rimini",
    aggiornata: "2026-10-28",
    rispostaBreve: "A Rimini la festa di compleanno per bambini si fa soprattutto nelle ludoteche con sala feste e nei parchi giochi al coperto tra Marina Centro e Viserba, mentre nei dintorni ci sono un bowling con play park a Cerasolo di Coriano e un parco giochi all'aperto a Igea Marina. Molte formule durano circa tre ore: Tiny Rimini propone pacchetti fino a 20 bambini, Chibia ha uno spazio coperto di circa 1000 mq con un'area baby per i bimbi da 0 a 3 anni. Prenota con qualche settimana di anticipo, soprattutto per il weekend, e chiedi subito cosa è compreso tra buffet, torta e animazione.",
    intro: "Rimini non è solo spiaggia d'estate: tutto l'anno ci sono spazi pensati per far festa con i bambini, dalle ludoteche vicino al mare ai grandi parchi gonfiabili al coperto. E se cerchi qualcosa di diverso, a pochi chilometri trovi anche bowling e parchi giochi all'aperto nei comuni vicini.",
    locali: [
      { nome: "Tiny Rimini", zona: "Rimini, Marina Centro", tipo: "ludoteca e sala feste", descrizione: "Ludoteca e spazio feste in viale Flavio Gioia con laboratori e bar interno: le feste durano tre ore, con formule che vanno dal solo spazio fino al pacchetto completo per un massimo di 20 bambini, e gli adulti accompagnatori entrano gratis. Su richiesta c'è anche l'animazione, dal truccabimbi ai giochi musicali e alla baby dance.", sito: "https://www.tinyriminikids.it/" },
      { nome: "Chibia Parco Giochi", zona: "Rimini, Viserba", tipo: "parco giochi al coperto", descrizione: "Area coperta di circa 1000 mq con gonfiabili, uno scivolo alto 7 metri, percorsi a ostacoli e un'area baby recintata per i bimbi da 0 a 3 anni. Per le feste allestisce uno spazio dedicato, prepara il buffet e include l'accesso a tutti i giochi del parco.", sito: "https://www.chibiaparcogiochirimini.it/" },
      { nome: "Bowling Seventies", zona: "Cerasolo (Coriano)", tipo: "sala feste con playground", descrizione: "Bowling a pochi minuti da Rimini con pacchetti compleanno divisi per età (0–6, 7–10 e 11–17 anni), che comprendono decorazioni, animatori e torta della pasticceria interna. I più piccoli hanno il Play Park, e c'è uno short bowling con piste più corte e palle leggere pensato per i bambini dai 4 anni.", sito: "https://bowling-seventies.com/" },
      { nome: "Parcogiochi Paperopolis", zona: "Igea Marina (Bellaria Igea Marina)", tipo: "parco divertimenti", descrizione: "Storico parco giochi per famiglie all'aperto, in un'area verde, con gonfiabili, reti elastiche e piccole attrazioni. Organizza feste di tre ore al pomeriggio oppure la sera; conviene verificare il calendario di apertura prima di fissare la data.", sito: "https://paperopolis.it/" },
    ],
    faq: [
      { domanda: "Qual è il posto giusto in base all'età?", risposta: "Per i più piccoli funzionano bene i parchi giochi al coperto con un'area baby dedicata, come quello di Viserba con lo spazio per i bimbi da 0 a 3 anni. Dai 4–5 anni in su piacciono gonfiabili e short bowling, mentre per i ragazzi più grandi alcuni locali propongono pacchetti teen con bowling o biliardo." },
      { domanda: "Cosa è compreso di solito nel pacchetto festa?", risposta: "Dipende dalla formula: alcuni spazi offrono solo la sala e i giochi, e buffet, torta e decorazioni li porti tu; altri includono buffet, bevande, allestimento e animazione. Prima di prenotare chiedi sempre per quanti bambini vale il pacchetto, quanto dura e se lo spazio è riservato solo a voi." },
      { domanda: "Quanto prima conviene prenotare?", risposta: "Per il sabato e la domenica è meglio muoversi con qualche settimana di anticipo, perché le fasce del pomeriggio sono le più richieste. Se hai una data fissa, blocca prima il locale e poi manda gli inviti." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "salerno",
    citta: "Salerno",
    aggiornata: "2026-10-28",
    rispostaBreve: "A Salerno la festa di compleanno per bambini si fa soprattutto in ludoteche con sala feste e playground al coperto, tra il centro e la zona orientale della città. Il Dipark, per esempio, ha un playground diviso in due aree separate (1–4 e 5–11 anni) e cinque sale attrezzate per le feste, e Marachella in centro ha un parco giochi coperto e una sala per le feste a tema. Prenota con qualche settimana di anticipo, soprattutto per il weekend, e chiedi sempre cosa è compreso nella formula.",
    intro: "Salerno è una città a misura di famiglia, dove tra il lungomare e i quartieri più nuovi non mancano spazi coperti pensati per far giocare i bambini anche quando il tempo non aiuta. Ecco i posti da cui partire per una festa al coperto, dai più piccoli fino ai ragazzi.",
    locali: [
      { nome: "Dipark", zona: "Salerno, zona orientale", tipo: "ludoteca e sala feste", descrizione: "Si presenta come la ludoteca più grande di Salerno: ha un playground per bambini da 1 a 11 anni con due aree separate (1–4 e 5–11 anni) e cinque sale attrezzate per i compleanni. Propone oltre 20 formule tutto compreso, con animazione, spettacolo dal vivo o a tema, e organizza anche feste a domicilio.", sito: "https://www.dipark.it" },
      { nome: "Marachella", zona: "Salerno, centro", tipo: "ludoteca e sala feste", descrizione: "Nido e ludoteca nel centro di Salerno con un parco giochi al coperto interamente rivestito per la sicurezza dei più piccoli e una sala feste per compleanni e feste a tema. Il servizio di ludoteca accoglie bambini dai 5 ai 12 anni.", sito: "https://www.marachellaludoteca.it" },
    ],
    faq: [
      { domanda: "Che tipo di locale scelgo in base all'età?", risposta: "Per i bambini fino a 10–11 anni le ludoteche con playground sono la scelta più comoda: al Dipark, per esempio, piccoli e grandi giocano in aree separate. Marachella accoglie in ludoteca i bambini dai 5 ai 12 anni: chiedete sempre fino a che età è pensata la formula festa." },
      { domanda: "Si può fare la festa a casa con l'animazione di una ludoteca?", risposta: "Sì, alcune strutture lo prevedono: il Dipark, ad esempio, propone anche feste a domicilio con animazione e laboratori creativi. Chiedi in anticipo di quanto spazio hanno bisogno gli animatori e cosa portano loro." },
      { domanda: "Con quanto anticipo conviene prenotare?", risposta: "Per sabato e domenica meglio muoversi con qualche settimana di anticipo, perché le sale feste si riempiono presto. Prima di confermare chiedi quanti bambini sono previsti nella formula, quanto dura la festa e se torta e merenda sono comprese." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "ferrara",
    citta: "Ferrara",
    aggiornata: "2026-10-28",
    rispostaBreve: "A Ferrara una festa di compleanno per bambini si organizza soprattutto in ludoteche e sale feste di quartiere, e nei parchi giochi al coperto. Per esempio, la sala del Bosco delle Meraviglie in via dell'Aeroporto ospita circa 60 persone tra adulti e bambini per 4 ore in esclusiva, mentre alla Nuova Darsena ha aperto nel 2026 Youngo, con sale riservate per le feste. Per i fine settimana conviene prenotare con largo anticipo e chiedere sempre cosa è incluso: animazione, gonfiabili e buffet spesso si aggiungono a parte.",
    intro: "Ferrara è una città a misura di bambino, raccolta e pianeggiante, dove spostarsi tra un quartiere e l'altro è semplice anche con tanti piccoli invitati. Per i compleanni si può scegliere tra ludoteche con sala feste, parchi giochi coperti con gonfiabili e il nuovo spazio giochi della Nuova Darsena.",
    locali: [
      { nome: "Il Bosco delle Meraviglie", zona: "Ferrara, via dell'Aeroporto", tipo: "ludoteca e sala feste", descrizione: "Ludoteca con sala compleanni pensata per bambini da 1 a 10 anni, allestita a tema bosco con giochi e tappetone morbido. La sala si affitta in esclusiva per 4 ore e accoglie circa 60 persone tra adulti e bambini, con tavoli buffet e bagno con fasciatoio.", sito: "https://www.boscomeraviglie.it/" },
      { nome: "Youngo Nuova Darsena", zona: "Ferrara, centro commerciale Nuova Darsena (via Darsena)", tipo: "sala feste con playground", descrizione: "Spazio di divertimento inaugurato a febbraio 2026, con videogiochi, biliardo e un'area dedicata ai più piccoli. Per i compleanni propone sale ampie e personalizzabili, con spazio festa riservato, accesso alle attrazioni e assistenza dello staff.", sito: "https://youngoshop.it/portfolios/nuova-darsena-ferrara/" },
      { nome: "Baby Park Happy Days", zona: "Ferrara, via del Commercio", tipo: "parco giochi al coperto", descrizione: "Centro ricreativo al coperto con gonfiabili, saltarelli, un playground e un campetto da calcio. Organizza feste a tema e compleanni.", sito: "https://babyparkhappydays.it/" },
    ],
    faq: [
      { domanda: "Quali sono i posti più adatti per una festa di compleanno per bambini a Ferrara?", risposta: "Dipende dall'età: per i più piccoli funzionano bene le ludoteche con sala feste, per chi ha voglia di muoversi i parchi giochi al coperto con gonfiabili, e per i più grandi gli spazi con videogiochi e sale riservate come quello alla Nuova Darsena." },
      { domanda: "Con quanto anticipo conviene prenotare la sala?", risposta: "Per sabato e domenica è meglio muoversi con qualche settimana di anticipo, soprattutto nei mesi freddi, quando le sale al chiuso sono le più richieste. Nei giorni feriali di solito c'è più disponibilità." },
      { domanda: "Cosa conviene chiedere prima di confermare la festa?", risposta: "Quante ore dura l'affitto, quante persone può ospitare lo spazio, se animazione, gonfiabili e buffet sono inclusi o a parte, se si possono portare torta e cibo da casa e se c'è parcheggio vicino per le famiglie." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
];

export function cittaFeste(slug: string): CittaFeste | undefined {
  return CITTA_FESTE.find((c) => c.slug === slug);
}
