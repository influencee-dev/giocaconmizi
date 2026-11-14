// Le pagine locali "Festa di compleanno per bambini a [città]" (/feste).
// Ogni città = una voce qui: pagina, sitemap e llms.txt si aggiornano da soli.
//
// REGOLE (valgono per ogni città nuova):
// - solo locali REALI trovati con la ricerca web, mai inventati;
// - link esterni solo ai siti ufficiali trovati davvero (rel nofollow);
// - descrizioni fedeli a ciò che le fonti dicono, senza promesse nostre;
// - niente personaggi protetti da copyright nelle NOSTRE descrizioni;
// - il reel Instagram si aggiunge solo con l'URL vero del post (campo reel).
//
// Città già provate e SCARTATE (meno di 2 locali solidi con segnali recenti):
// non ritentarle prima di qualche mese. Pescara, Sassari, Barletta, Pistoia,
// Terni, Matera, L'Aquila, Potenza, Marsala, Faenza, Legnano, Avellino
// (entro il 13/11/2026); Cinisello Balsamo, Torre del Greco, Olbia (14/11/2026).

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
  {
    slug: "latina",
    citta: "Latina",
    aggiornata: "2026-10-29",
    rispostaBreve: "A Latina la festa di compleanno per bambini si fa soprattutto nei parchi giochi al coperto con gonfiabili e trampolini, nelle ludoteche con sala feste del centro e, con la bella stagione, negli spazi verdi dei borghi come Borgo Bainsizza. Ci sono anche formule di nicchia, come le feste a tema moda e spa dai 5 ai 12 anni, o pacchetti con area riservata in esclusiva e torta inclusa. Per le feste nel fine settimana conviene prenotare con qualche settimana di anticipo e chiedere subito cosa comprende il pacchetto (buffet, animazione, aree incluse nel gioco libero).",
    intro: "Latina è una città giovane e a misura di famiglia, dove tra centro, borghi e litorale non mancano gli spazi pensati per far festa con i più piccoli. Si va dai grandi parchi giochi al coperto, perfetti nei mesi freddi, ai giardini e alle piscine della campagna pontina per le feste all'aperto.",
    locali: [
      { nome: "Crazy Park", zona: "Latina, via Coletta", tipo: "parco giochi al coperto", descrizione: "Parco al coperto con un'area dedicata ai gonfiabili di diverse grandezze, un trampoline park per bambini più grandi e ragazzi e una zona di realtà virtuale; dal 2025 c'è anche il laser game. Il pacchetto compleanno prevede un'area scelta in esclusiva con assistenza, tovagliato colorato, torta scenografica e gioco libero nell'area comune, con extra su richiesta come animazione, truccabimbi e spettacolo di magia.", sito: "https://www.crazypark.it/" },
      { nome: "Tutti Giù per Terra", zona: "Latina, via dei Marruccini", tipo: "ludoteca e sala feste", descrizione: "Associazione con ludoteca che affitta una sala per i compleanni dei bambini, personalizzabile con tema, decorazioni e animazione. Organizza anche feste a tema con giochi gonfiabili e teatrini.", sito: "https://www.ludotecatuttigiuperterra.com/" },
      { nome: "Angolo Verde Mini Park", zona: "Borgo Bainsizza (Latina)", tipo: "sala feste con playground", descrizione: "Azienda agrituristica con ampi spazi verdi, parco giochi per bambini, campi da calcetto e pallavolo, postazioni barbecue e una piscina all'aperto, più una sala interna per le feste nei mesi più freddi. Su richiesta si possono noleggiare gonfiabili e avere il buffet.", sito: "https://www.miniparklangoloverde.it/" },
      { nome: "La Petite", zona: "Latina, via Garigliano", tipo: "sala feste", descrizione: "Sala in stile parigino dedicata alle feste delle bambine dai 5 ai 12 anni, con formule come lo Spa & Fashion Party con piccola sfilata e l'Afternoon Tea Party con merenda elegante e giochi tra amiche. Propone anche una festa pensata per mamma e figlia.", sito: "https://www.lapetite.it/" },
    ],
    faq: [
      { domanda: "Dove si può fare una festa di compleanno al chiuso a Latina?", risposta: "Le scelte più comuni sono i parchi giochi al coperto con gonfiabili, trampolini e aree riservate per la festa, oppure le ludoteche con sala in affitto, che spesso includono anche animazione e decorazioni a tema. Sono le soluzioni più comode tra l'autunno e la primavera, quando il meteo è incerto." },
      { domanda: "Si può festeggiare all'aperto?", risposta: "Sì: nella campagna intorno a Latina, ad esempio a Borgo Bainsizza, ci sono strutture con prati, parco giochi, barbecue e piscina, che in genere hanno anche una sala interna di riserva. È una buona idea per le feste di fine primavera e d'estate, magari con un piano B al coperto." },
      { domanda: "Cosa conviene chiedere prima di prenotare?", risposta: "Chiedi quante ore dura la festa, se l'area è riservata solo al vostro gruppo, quali giochi sono inclusi nel gioco libero e cosa comprende il pacchetto tra torta, buffet e animazione. Verifica anche quanto tempo c'è per allestire se porti il rinfresco da casa." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "monza",
    citta: "Monza",
    aggiornata: "2026-10-29",
    rispostaBreve: "A Monza la festa di compleanno per bambini si fa nelle sale dei centri sportivi in città; appena fuori città ci sono il trampoline park di Lissone, i parchi giochi al coperto di Bellusco e la fattoria di Concorezzo. Qualche esempio: il trampoline park di Lissone ha 1.200 m² con un'area feste riservata, mentre il parco al coperto di Bellusco offre 650 m² di gioco per bambini da 0 a 12 anni e un'area party di 150 m² divisa in salette. Prenota con anticipo i weekend d'autunno e d'inverno, quando le feste si spostano al chiuso, e metti i calzini antiscivolo nello zaino.",
    intro: "Monza unisce il verde del Parco e della Villa Reale a una Brianza ricca di spazi pensati per i bambini, tutti a pochi minuti d'auto. Per la festa si può restare in città oppure spostarsi nei comuni vicini, scegliendo tra gioco libero, salti, natura e animali.",
    locali: [
      { nome: "Sport Village Monza", zona: "Monza (zona Binario 7)", tipo: "sala feste", descrizione: "Centro sportivo che affitta per le feste la Sala Arancio, 170 m² con parquet e aria condizionata, e in primavera ed estate un giardino attrezzato con salottini e gazebo. Su richiesta propone allestimenti a tema con un partner.", sito: "https://www.sportvillagemonza.it/" },
      { nome: "Space Jump", zona: "Lissone", tipo: "trampoline park", descrizione: "Trampoline park di 1.200 m² con un'area riservata ai compleanni e la sala Space Party per eventi privati. C'è anche il Baby Space dedicato ai più piccoli; per saltare servono i calzini antiscivolo.", sito: "https://www.spacejump.it/" },
      { nome: "La Foresta Incantata", zona: "Bellusco", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto a tema foresta: 650 m² di gioco per bambini da 0 a 12 anni, con un grande playground-labirinto e un angolo per i bimbi sotto i 3 anni. L'area party di 150 m² si divide in sei salette singole o tre doppie.", sito: "https://www.laforestaincantataparcogiochi.com/" },
      { nome: "La Camilla", zona: "Concorezzo", tipo: "fattoria didattica, spazi all'aperto", descrizione: "Agriturismo con 8 ettari di terreno e una fattoria con animali da cortile e cavalli, dove si organizza il compleanno in fattoria con merenda e giochi di gruppo all'aperto. Il pomeriggio è disponibile dal martedì al venerdì, il weekend su prenotazione.", sito: "https://www.lacamilla.it/" },
    ],
    faq: [
      { domanda: "Che posto scegliere in base all'età?", risposta: "Fino ai 5-6 anni funzionano bene ludoteche e parchi al coperto con un angolo baby e giochi morbidi, dove anche i piccolissimi sono al sicuro. Dai 6-7 anni in su piacciono gli spazi dove ci si muove tanto, come i trampolini, o le feste all'aperto con giochi di gruppo." },
      { domanda: "Posso portare merenda e torta da casa?", risposta: "Dipende dal locale: alcuni propongono formule con sala riservata in cui si porta tutto da casa, altri pacchetti con la merenda già inclusa, e c'è chi non ammette cibo esterno fuori dalle sale. Chiedilo al momento della prenotazione, insieme a eventuali allergie degli invitati." },
      { domanda: "Si può festeggiare all'aperto vicino a Monza?", risposta: "Sì, soprattutto in primavera ed estate: intorno a Monza ci sono fattorie con animali e centri sportivi con giardino che ospitano le feste. Tieni sempre un piano B al coperto, perché il meteo in Brianza cambia in fretta." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "bergamo",
    citta: "Bergamo",
    aggiornata: "2026-10-30",
    rispostaBreve: "A Bergamo la festa di compleanno per bambini si fa soprattutto nei parchi giochi al coperto in città e nei locali per famiglie con playground della provincia, mentre per chi vuole muoversi di più ci sono il parco trampolini di via Guzzanica e, a Capriate San Gervasio, Leolandia. Fantabosco accoglie bambini da 1 a 10 anni, e le feste a Leolandia sono pensate dai 3 anni in su con formule fino a 20 partecipanti. Prenotate con almeno due o tre settimane di anticipo, soprattutto se puntate al sabato o alla domenica.",
    intro: "Bergamo è una città a misura di famiglia, con spazi gioco al coperto a due passi dal centro e tante alternative nei comuni della provincia, dalla Bassa alla zona dei laghi. Che si cerchi un pomeriggio di scivoli e palline per i più piccoli o qualcosa di più movimentato per i grandi, le distanze sono brevi e le opzioni non mancano.",
    locali: [
      { nome: "Fantabosco", zona: "Bergamo, via Tadini", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto per bambini da 1 a 10 anni: per le feste lo staff si occupa di addobbi, gadget e torte a tema, con tavolo riservato; animazione e intrattenimento si possono aggiungere su richiesta.", sito: "https://www.fantaboscobergamo.com/" },
      { nome: "Mi gioco la pizza", zona: "Chiuduno (BG)", tipo: "sala feste con playground", descrizione: "Ristorante per famiglie con parco giochi coperto, tra percorso a ostacoli, piscina di palline e un'area dedicata ai bambini da 0 a 6 anni; il parco si può usare durante le feste di compleanno, proposte in diversi pacchetti con animazione dello staff.", sito: "https://www.migiocolapizza.com/" },
      { nome: "Zero-Gravity Bergamo", zona: "Bergamo, via Guzzanica", tipo: "trampoline park", descrizione: "Parco trampolini con formula festa privata pensata per bambini e ragazzi: comprende assistente dedicato, sala privata, allestimento e accesso alle aree trampolini, con calze antiscivolo per ogni partecipante.", sito: "https://www.zero-gravity.it/" },
      { nome: "Leolandia", zona: "Capriate San Gervasio (BG)", tipo: "parco divertimenti", descrizione: "Parco divertimenti con pacchetti compleanno per bambini dai 3 anni, che includono torta e tavolo riservato per il taglio; le formule sono pensate per gruppi di diverse dimensioni, fino a 20 partecipanti.", sito: "https://www.leolandia.it/" },
    ],
    faq: [
      { domanda: "Con quanto anticipo conviene prenotare?", risposta: "Almeno due o tre settimane prima, come suggerisce anche Leolandia per i suoi pacchetti; per i weekend e i periodi di festa è meglio muoversi ancora prima, perché sale e fasce orarie sono limitate." },
      { domanda: "Dove festeggiare con bambini molto piccoli?", risposta: "Meglio un parco giochi al coperto con spazi dedicati ai piccoli: Fantabosco accoglie bambini da 1 a 10 anni e Mi gioco la pizza a Chiuduno ha un'area riservata alla fascia 0–6 anni. Leolandia propone le feste dai 3 anni e invita a contattarla per festeggiati più piccoli." },
      { domanda: "E per i bambini più grandi o i ragazzi?", risposta: "Un parco trampolini come Zero-Gravity in via Guzzanica, con sala privata e assistente dedicato, o una giornata a Leolandia sono scelte che piacciono anche ai più grandi. Prima di confermare chiedete sempre le condizioni per spostare o annullare la festa." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "trento",
    citta: "Trento",
    aggiornata: "2026-10-30",
    rispostaBreve: "A Trento la festa di compleanno per bambini si fa soprattutto in uno spazio giochi al coperto come Oki Doki a Trento Sud, che ha una sala apposta per le feste, oppure al museo: il MUSE propone cacce al tesoro e misteri scientifici, e il Mart di Rovereto organizza compleanni creativi il sabato per bambini dai 4 ai 12 anni, fino a 25 invitati. Prenotate per tempo: il MUSE chiede almeno tre settimane di anticipo, e anche per gli altri posti il weekend si riempie presto.",
    intro: "Trento è una città a misura di famiglia, dove la scienza e l'arte sono di casa e si trasformano volentieri in una festa. Tra uno spazio giochi in città e due grandi musei, uno a Trento e uno a Rovereto, c'è la formula giusta sia per i più piccoli sia per chi ama esplorare.",
    locali: [
      { nome: "Oki Doki Family Club", zona: "Trento Sud (via Gramsci)", tipo: "parco giochi al coperto", descrizione: "Area divertimento di circa 300 mq per bambini da 1 a 10 anni, con gonfiabili e una sala compleanni: la festa base dura circa tre ore e accoglie in media 30 persone. Organizza anche feste a domicilio, con animazione, giochi di gruppo e trucca bimbi.", sito: "https://www.okidokitrento.it" },
      { nome: "MUSE – Museo delle Scienze", zona: "Trento (quartiere Le Albere)", tipo: "museo", descrizione: "Compleanni in museo tra animali, dinosauri, stelle e pianeti, con cacce al tesoro, percorsi a tappe e misteri da risolvere, come il «compleanno da detective» per 8–10 anni; per i più piccoli c'è una formula nel Maxi Ooh!, lo spazio sensoriale dedicato a 0–5 anni. Si prenota per telefono con almeno tre settimane di anticipo.", sito: "https://www.muse.it" },
      { nome: "Mart – Museo di arte moderna e contemporanea", zona: "Rovereto", tipo: "museo", descrizione: "Il «compleanno ad arte» si prenota il sabato per gruppi fino a 25 bambini dai 4 ai 12 anni: due o tre ore di attività ludiche e creative guidate dagli operatori dell'Area educazione. Merenda e addobbi sono a cura delle famiglie.", sito: "https://www.mart.tn.it" },
    ],
    faq: [
      { domanda: "Quali sono i posti più adatti ai bambini piccoli?", risposta: "Per i più piccoli funzionano bene gli spazi pensati per la loro età: Oki Doki accoglie bambini da 1 a 10 anni, e al MUSE c'è una formula di compleanno nel Maxi Ooh!, lo spazio sensoriale dedicato alla fascia 0–5 anni." },
      { domanda: "Si può festeggiare in un museo?", risposta: "Sì, ed è una delle specialità della zona: il MUSE di Trento propone feste con cacce al tesoro e attività scientifiche, mentre il Mart di Rovereto organizza il sabato compleanni creativi per bambini dai 4 ai 12 anni, fino a 25 invitati." },
      { domanda: "Con quanto anticipo conviene prenotare?", risposta: "Meglio non aspettare l'ultimo momento: il MUSE chiede almeno tre settimane di anticipo, e per gli spazi giochi conviene muoversi con qualche settimana di anticipo, ancora prima se volete una data precisa nel weekend." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "vicenza",
    citta: "Vicenza",
    aggiornata: "2026-10-31",
    rispostaBreve: "A Vicenza la festa di compleanno per bambini si fa soprattutto in un parco giochi al coperto: Wonderwood Dino Camp, dentro il Centro Commerciale Palladio, ha due salette riservabili ed è pensato per bambini fino a 9-10 anni, mentre Jungle Jump, vicino all'uscita Vicenza Est, organizza feste con buffet e allestimento da scegliere passo dopo passo. Per il weekend conviene prenotare con anticipo e chiedere prima le regole su torta e cibo portati da casa.",
    intro: "Vicenza ha diversi spazi al coperto dove i bambini possono correre e arrampicarsi anche quando il tempo non aiuta. Per la festa di compleanno ci sono due parchi giochi con sale dedicate, comodi da raggiungere dalla città.",
    locali: [
      { nome: "Wonderwood Dino Camp Vicenza", zona: "Vicenza (Centro Commerciale Palladio)", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto a tema dinosauri, pensato per bambini fino a circa 9-10 anni e aperto quasi tutti i giorni dell'anno. Per il compleanno ci sono due salette riservabili con un'area per il gruppo e una zona ristoro allestita; si può portare la propria torta e aggiungere il truccabimbi o uno spettacolo di magia.", sito: "https://wonderwood.it/vicenza/" },
      { nome: "Jungle Jump Vicenza", zona: "Vicenza Est (via Zamenhof)", tipo: "parco giochi al coperto", descrizione: "Play park al coperto con aree gioco, scivoli e tunnel, a due minuti dall'uscita autostradale Vicenza Est, aperto dal martedì alla domenica. Le feste di compleanno si compongono passo dopo passo, con buffet e allestimento a scelta, anche in sala riservata.", sito: "https://junglejumpvicenza.com" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno al coperto a Vicenza?", risposta: "Nei parchi giochi al coperto: Wonderwood Dino Camp, nel Centro Commerciale Palladio, ha due salette per le feste; Jungle Jump, vicino all'uscita Vicenza Est, organizza feste con buffet e allestimento personalizzabili." },
      { domanda: "Si può portare la torta da casa?", risposta: "Dipende dal posto: Wonderwood Dino Camp accetta la torta portata dalla famiglia. Negli altri casi chiedete al momento della prenotazione, perché le regole sul cibo esterno cambiano da struttura a struttura." },
      { domanda: "Fino a che età vanno bene questi posti?", risposta: "Sono pensati soprattutto per i bambini della scuola dell'infanzia e dei primi anni di primaria: Wonderwood indica una fascia fino a circa 9-10 anni." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "bolzano",
    citta: "Bolzano",
    aggiornata: "2026-11-01",
    rispostaBreve: "A Bolzano la festa di compleanno per bambini si fa soprattutto al Kuni Kids Park, il parco giochi al coperto di 500 m² dentro il centro commerciale Twenty, pensato per bambini dai 3 agli 11 anni, con feste senza animazione oppure a tema con lo staff; a pochi minuti, a Pineta di Laives, la Ludoteca Il Bruco mette a disposizione la sua sala nel weekend con pacchetti personalizzabili per bambini da 0 a 12 anni. Prenotate per tempo e, per il Kuni, mettete nello zaino i calzini antiscivolo.",
    intro: "Bolzano è una città bilingue e a misura di famiglia, dove d'inverno fa freddo presto e la festa si sposta volentieri al chiuso. Per il compleanno ci sono un grande parco giochi al coperto in città e una ludoteca appena fuori, a Pineta di Laives, adatta anche ai più piccoli.",
    locali: [
      { nome: "Kuni Kids Park", zona: "Bolzano (centro commerciale Twenty, via Galilei)", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto di 500 m² su più livelli, gestito dalla cooperativa Ki.Ba. Project, per bambini dai 3 agli 11 anni; i calzini antiscivolo vanno portati da casa. Per il compleanno si può festeggiare con gli amici senza animazione oppure scegliere una festa a tema seguita dallo staff, tra principesse e cavalieri, magia, animali, sirene e pirati, dinosauri e spazio.", sito: "https://www.kibaproject.it/" },
      { nome: "Ludoteca Il Bruco", zona: "Pineta di Laives", tipo: "ludoteca", descrizione: "Ludoteca per bambini da 0 a 12 anni con Area Soft, playground, piscina di palline e laboratori. Nei giorni feriali è uno spazio gioco e di accudimento; nel weekend la sala si riserva per feste di compleanno ed eventi, con pacchetti personalizzabili che includono animazione, giochi e l'uso degli spazi gioco.", sito: "https://www.ludotecailbruco.it/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno al coperto a Bolzano?", risposta: "In città c'è il Kuni Kids Park, il parco giochi al coperto del centro commerciale Twenty, per bambini dai 3 agli 11 anni. Appena fuori, a Pineta di Laives, la Ludoteca Il Bruco riserva la sua sala alle feste nel fine settimana." },
      { domanda: "Ci sono feste a tema?", risposta: "Sì: al Kuni Kids Park si può scegliere una festa a tema seguita dallo staff, per esempio principesse e cavalieri, magia, animali, sirene e pirati, dinosauri o spazio. Chi preferisce può anche festeggiare con gli amici senza animazione." },
      { domanda: "E per i bambini molto piccoli?", risposta: "La Ludoteca Il Bruco accoglie bambini da 0 a 12 anni e ha un'Area Soft, mentre il Kuni Kids Park è pensato dai 3 anni in su: con un festeggiato sotto i 3 anni conviene la ludoteca." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "piacenza",
    citta: "Piacenza",
    aggiornata: "2026-11-01",
    rispostaBreve: "A Piacenza la festa di compleanno per bambini si fa al coperto in uno spazio gioco come L'isola che ora c'è, in via Beati, pensato per bambini da 1 a 9 anni con aree separate per età e salette per le feste, oppure in fattoria: a Bosco Gerolo, in Val Trebbia, il compleanno comprende merenda e uso del parco, con la visita agli animali o una caccia al tesoro a richiesta. Prima di andare chiamate per conferma, perché lo spazio gioco può essere riservato a una festa privata o aver raggiunto il limite di ingressi; in campagna, invece, chiedete sempre il piano B per la pioggia.",
    intro: "Piacenza ha il vantaggio di avere la campagna e le colline a pochi minuti dalla città. Per il compleanno si può scegliere tra uno spazio gioco al coperto in città, comodo in ogni stagione, e una fattoria in Val Trebbia per chi vuole festeggiare tra animali e prati.",
    locali: [
      { nome: "L'isola che ora c'è", zona: "Piacenza (via Beati)", tipo: "ludoteca e spazio gioco al coperto", descrizione: "Spazio gioco al coperto per bambini da 1 a 9 anni, con un'area per i più piccoli fino a 4 anni, aree per i 5-9 anni e un bar per i genitori. Per le feste di compleanno ci sono salette dedicate, e su prenotazione si organizzano anche feste serali; le calzine antiscivolo sono obbligatorie.", sito: "https://www.lisolacheorace.it/" },
      { nome: "Bosco Gerolo Valtrebbia", zona: "Rivergaro (Val Trebbia)", tipo: "agriturismo e fattoria didattica", descrizione: "Agriturismo con fattoria didattica, animali, parco giochi e una sala giochi interna. Per il compleanno in fattoria propone un pacchetto merenda con uno spazio dedicato e l'uso del parco; su richiesta si aggiungono la visita alla fattoria dando da mangiare agli animali, una caccia al tesoro o un laboratorio di cucina o sull'orto.", sito: "https://www.boscogerolovaltrebbia.it/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno al coperto a Piacenza?", risposta: "In uno spazio gioco come L'isola che ora c'è, in via Beati: ha aree separate per i più piccoli e per i bambini dai 5 ai 9 anni e salette per le feste. Telefonate prima di andare, perché lo spazio può essere riservato a una festa privata o aver raggiunto il limite di ingressi del giorno." },
      { domanda: "Si può festeggiare in fattoria?", risposta: "Sì: a Bosco Gerolo, in Val Trebbia, il compleanno comprende merenda e uso del parco, e a richiesta la visita agli animali, una caccia al tesoro o un laboratorio. Chiedete sempre quale spazio al coperto resta disponibile in caso di pioggia." },
      { domanda: "Fino a che età vanno bene questi posti?", risposta: "L'isola che ora c'è è pensata per bambini da 1 a 9 anni: chi ha già compiuto 10 anni può entrare ma non usare i giochi. La fattoria piace anche ai più grandi, soprattutto con la caccia al tesoro." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "novara",
    citta: "Novara",
    aggiornata: "2026-11-01",
    rispostaBreve: "A Novara la festa di compleanno per bambini si fa nelle sale di un parco come il Parco della Mora, che affitta due sale con tavoli, frigorifero e bagno con fasciatoio affacciate su un parco giochi recintato, oppure al centro per famiglie Agorà, in via Cameri, che ha un'area feste accanto alla ludoteca e si prenota online. Per il weekend muovetevi con anticipo e chiedete sempre cosa è incluso nel prezzo: alla Mora le sale sono attrezzate con tavoli e frigorifero per merenda e torta, e il bar è proprio di fronte.",
    intro: "Novara è una città pianeggiante e comoda da girare, con spazi verdi e centri per le famiglie a pochi minuti da casa. Per il compleanno si può scegliere tra una sala affacciata su un parco giochi all'aperto e una ludoteca al coperto con area feste.",
    locali: [
      { nome: "Parco della Mora", zona: "Novara", tipo: "sala feste", descrizione: "Centro sportivo nel verde con un parco giochi interamente recintato, dove a gennaio 2026 sono arrivati giochi nuovi. Per i compleanni affitta due sale colorate con frigorifero, tavoli e sedie per merenda e torta e un bagno con fasciatoio, a uso privato per il pomeriggio: una ha una pergola coperta, l'altra un dehor con ombrelloni, e da entrambe si vedono i bambini giocare.", sito: "https://www.parcodellamora.it/" },
      { nome: "Agorà", zona: "Novara (via Cameri)", tipo: "ludoteca", descrizione: "Centro per le famiglie con ludoteca, scuola di musica e di lingue e campus estivi. Le feste di compleanno si fanno nell'area feste accanto alla ludoteca e si possono prenotare online.", sito: "https://www.agoranovara.com/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno per bambini a Novara?", risposta: "Due formule diverse: le sale del Parco della Mora, affacciate su un parco giochi recintato, oppure l'area feste accanto alla ludoteca del centro Agorà, in via Cameri, che si prenota online." },
      { domanda: "Si può festeggiare con i bambini che giocano all'aperto?", risposta: "Sì: dalle due sale del Parco della Mora si vedono i bambini giocare nel parco, che è interamente recintato. Una sala ha una pergola coperta e l'altra un dehor con ombrelloni; nei mesi freddi chiedete quale resta più riparata." },
      { domanda: "Posso portare merenda e torta da casa?", risposta: "Le sale del Parco della Mora hanno frigorifero, tavoli e sedie pensati per merenda e taglio della torta, e di fronte c'è il bar. Se volete portare cibo da casa chiedetelo al momento della prenotazione, perché le regole sul cibo esterno cambiano da posto a posto." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "arezzo",
    citta: "Arezzo",
    aggiornata: "2026-11-02",
    rispostaBreve: "Ad Arezzo la festa di compleanno per bambini si può fare in uno spazio che affitta le sale e offre l'animazione per le feste private, come Spazio Seme in via del Pantano, il centro artistico accanto alle piscine con due sale che diventano un unico ambiente di circa 220 m², oppure nell'area giochi Moovy Land del centro commerciale Al Magnifico, che ha baby parking e mini club ed è pensata anche per i compleanni. Chiedete prima cosa comprende il prezzo, dall'animazione alla merenda, e prenotate per tempo se puntate al weekend.",
    intro: "Arezzo è una città raccolta, dove il centro storico e i quartieri sono vicini e muoversi con i bambini è facile. Per il compleanno si può scegliere tra un centro artistico con sale ampie e animazione su richiesta e un'area giochi al coperto dentro un centro commerciale, comoda in ogni stagione.",
    locali: [
      { nome: "Spazio Seme", zona: "Arezzo (via del Pantano, accanto alle Piscine Pantano)", tipo: "sala in affitto con animazione", descrizione: "Centro artistico nato nel 2012, con corsi e laboratori per bambini, ragazzi e adulti. Ha circa 350 m² con due sale che si uniscono in un unico spazio di circa 220 m², un punto ristoro e spogliatoi con docce, e oltre alle attività artistiche offre l'affitto delle sale e l'animazione per feste private.", sito: "https://www.spazioseme.com/" },
      { nome: "Moovy Land", zona: "Arezzo (centro commerciale Al Magnifico)", tipo: "area giochi al coperto", descrizione: "Il playground per bambini del centro commerciale Al Magnifico, con baby parking e un mini club che propone giochi, attività educative ed eventi. Il centro lo indica come adatto alle feste di compleanno e ai momenti di gioco in sicurezza.", sito: "https://www.almagnifico.it/divertimento/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno al coperto ad Arezzo?", risposta: "Due formule diverse: le sale di Spazio Seme, in via del Pantano, che si affittano per le feste private con l'animazione, oppure l'area giochi Moovy Land dentro il centro commerciale Al Magnifico, con baby parking e mini club." },
      { domanda: "Che spazio serve per tanti invitati?", risposta: "Se la lista è lunga conviene uno spazio ampio: le due sale di Spazio Seme si uniscono in un unico ambiente di circa 220 m². Chiedete sempre quanti bambini e adulti sono ammessi e cosa è incluso nell'affitto." },
      { domanda: "Posso portare merenda e torta da casa?", risposta: "Dipende dal posto: chiedetelo al momento della prenotazione, insieme alle regole su allestimento e pulizie, perché cambiano da struttura a struttura." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "udine",
    citta: "Udine",
    aggiornata: "2026-11-02",
    rispostaBreve: "A Udine la festa di compleanno per bambini si fa in un parco giochi al coperto come il Bianconiglio Playland di via Tricesimo, con gonfiabili, area baby e pacchetti festa tutto compreso fino a tre ore (o la formula «fai da te» in una saletta accanto ai giochi), oppure in uno spazio più raccolto come la Fata dei Lillà, a Cussignacco, dove educatrici e psicomotriciste preparano feste su misura con giochi di movimento e musica, o si affitta solo la sala per bambini fino a 7 anni. Prenotate con anticipo e chiedete quali formule valgono nel weekend.",
    intro: "Udine è una città a misura di famiglia, con spazi per i bambini sparsi tra i quartieri. Per il compleanno si può scegliere tra un grande parco giochi al coperto, comodo con tanti invitati e in ogni stagione, e uno spazio più piccolo dedicato al movimento, pensato soprattutto per i più piccoli.",
    locali: [
      { nome: "Bianconiglio Playland & Cafè", zona: "Udine (via Tricesimo)", tipo: "parco giochi al coperto", descrizione: "Parco giochi e ludoteca al coperto con gonfiabili e area baby, pensato per bambini da circa un anno ai 10 anni, con un bar per i genitori. Per il compleanno propone tre pacchetti tutto compreso, con inviti, area riservata, allestimento, cibo e bevande, oppure la formula «fai da te» in una saletta accanto all'area giochi, da 5 a 25 bambini; la festa dura al massimo tre ore. A richiesta si aggiungono animazione e truccabimbi.", sito: "https://www.bianconiglio-playland.it/" },
      { nome: "Fata dei Lillà", zona: "Udine (Cussignacco)", tipo: "sala feste con animazione", descrizione: "Associazione che segue i bambini da 0 a 10 anni con psicomotricità, movimento e gioco. Le feste sono costruite su misura per il festeggiato da educatrici, psicomotriciste e insegnanti di movimento, con giochi di movimento, giochi musicali e piccoli laboratori creativi, senza mascotte né animatori in costume. Chi preferisce fare da sé può affittare solo la sala, pensata per bambini fino a 7 anni, con tavoli, frigorifero, impianto musicale e materiali di gioco.", sito: "https://www.fatadeililla.it/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno al coperto a Udine?", risposta: "Al Bianconiglio Playland di via Tricesimo, un parco giochi al coperto con gonfiabili, area baby e pacchetti festa, oppure alla Fata dei Lillà, a Cussignacco, che organizza feste con giochi di movimento e musica e affitta la sala a chi vuole organizzare da sé." },
      { domanda: "Si può portare cibo da casa?", risposta: "Dipende dalla formula: al Bianconiglio, con i pacchetti tutto compreso non si porta cibo da fuori a parte la torta, mentre nella formula «fai da te» il cibo deve essere confezionato o tracciabile, per esempio da panetteria o pasticceria. Alla Fata dei Lillà, se affittate solo la sala, decorazioni, torta e merenda sono a cura della famiglia." },
      { domanda: "E per i bambini più piccoli?", risposta: "Il Bianconiglio ha un'area baby e accoglie bambini da circa un anno; la sala della Fata dei Lillà è pensata per feste fino a 7 anni, e dai 5 anni si può scegliere la formula in cui i genitori accompagnano i bambini e tornano per la torta." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "cesena",
    citta: "Cesena",
    aggiornata: "2026-11-02",
    rispostaBreve: "A Cesena la festa di compleanno per bambini si fa nel verde del Parco Rio Marano, che ha pacchetti compleanno dai 4 anni in su con gonfiabili e reti elastiche senza limiti di tempo e una merenda con la pizza, oppure al coperto in una ludoteca come Libera-mente, a Capannaguzzo, che riserva lo spazio per le feste con area gioco, angolo per torta e buffet e una caffetteria per i genitori. Prenotate per tempo e, se scegliete il parco, chiedete sempre cosa succede in caso di pioggia.",
    intro: "Cesena ha la campagna a pochi minuti dal centro, e per un compleanno è un vantaggio: si può festeggiare all'aperto in un grande parco giochi nel verde oppure in una ludoteca al coperto, comoda in ogni stagione. Due posti diversi, uno per chi vuole correre e saltare, l'altro per chi cerca uno spazio raccolto anche d'inverno.",
    locali: [
      { nome: "Parco Rio Marano", zona: "Cesena (via Vicinale Papa)", tipo: "parco giochi, spazi all'aperto", descrizione: "Parco giochi nel verde con oltre 20 giochi e attrazioni, tra cui gonfiabili, reti elastiche, scivoli, castelli in legno, minigolf, il Rio Tree Village e un'area protetta per i bimbi da 0 a 3 anni, con ristorante e pizzeria. I pacchetti compleanno, per bambini dai 4 anni, comprendono gonfiabili e reti senza limiti di tempo e una merenda con pizza, crocchette, panini dolci, frutta e bibite; la torta si può prendere al parco o portare da pasticceria o gelateria con lo scontrino.", sito: "https://www.riomaranocesena.it/" },
      { nome: "Libera-mente APS", zona: "Cesena (Capannaguzzo, via Capannaguzzo)", tipo: "ludoteca", descrizione: "Ludoteca e spazio ricreativo e sensoriale per bambini, con un'area gioco attrezzata con giochi adatti a tutte le età, una zona costruzioni, laboratori sensoriali e creativi e una caffetteria dove i genitori si siedono mentre i bambini giocano. Lo spazio si può riservare per le feste di compleanno e gli eventi in esclusiva, con l'area gioco, uno spazio per il taglio della torta e il buffet e un aiuto nell'organizzazione. È un'associazione di promozione sociale: al primo ingresso si fa l'iscrizione, che serve anche per l'assicurazione.", sito: "https://www.libera-mente-aps.it/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno per bambini a Cesena?", risposta: "Due formule diverse: i pacchetti compleanno del Parco Rio Marano, nel verde, con gonfiabili, reti elastiche e merenda, oppure una festa al coperto nella ludoteca Libera-mente, a Capannaguzzo, che riserva lo spazio con area gioco e angolo per torta e buffet." },
      { domanda: "E se piove?", risposta: "La ludoteca Libera-mente è al coperto, quindi va bene in ogni stagione. Il Parco Rio Marano è soprattutto all'aperto: al momento della prenotazione chiedete cosa succede in caso di maltempo." },
      { domanda: "Da che età vanno bene questi posti?", risposta: "I pacchetti compleanno del Rio Marano sono pensati dai 4 anni in su, e per i più piccoli il parco ha un'area protetta da 0 a 3 anni. Libera-mente ha giochi per tutte le età; ricordate le calze antiscivolo e, per la zona costruzioni, le scarpe." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "lecce",
    citta: "Lecce",
    aggiornata: "2026-11-02",
    rispostaBreve: "A Lecce la festa di compleanno per bambini si fa soprattutto nelle sale feste appena fuori città, verso Cavallino: LuluParty ha 200 m² climatizzati con playground, area buffet e spazio per la torta e un pacchetto con assistenti in sala e baby dance, mentre il Magic Land di Castromediano organizza feste di due ore con gioco gonfiabile, piscine di palline per i più piccoli e due animatori fino a 20 bambini. Le sale si riempiono presto: prenotate con mesi di anticipo e chiedete cosa è incluso, perché cibo e torta di solito si aggiungono a parte.",
    intro: "Lecce è una città raccolta, e molte sale per le feste dei bambini stanno nei comuni attaccati alla città, a pochi minuti di macchina. Per il compleanno si può scegliere tra una sala grande con playground e un pacchetto con l'animazione, oppure una sala con gonfiabile e giochi guidati dagli animatori, pensata soprattutto per i più piccoli.",
    locali: [
      { nome: "LuluParty", zona: "Cavallino (via Miglietta), alle porte di Lecce", tipo: "sala feste con playground", descrizione: "Sala feste per bambini di circa 200 m² climatizzati, con playground, un'area buffet e uno spazio per il taglio della torta. Il pacchetto base comprende la sala, gli assistenti, i popcorn, la baby dance e una mascotte al momento della torta; menu per bambini e adulti, torta personalizzata e servizio caffè si aggiungono su richiesta.", sito: "https://luluparty.it/" },
      { nome: "Magic Land", zona: "Castromediano (Cavallino), alle porte di Lecce", tipo: "sala feste con animazione", descrizione: "La sala feste per bambini della scuola di ballo Puerta del Sol. La festa dura due ore, più venti minuti per salutare gli ospiti, e comprende un operatore all'accoglienza, due animatori fino a 20 bambini, un gioco gonfiabile, piscine di palline con tappeti antitrauma per i più piccoli e la sala climatizzata, con un'area divani per i genitori. Non c'è una cucina interna: merenda e catering li sceglie la famiglia. La sala ospita una sola festa al giorno e il calendario si riempie con mesi di anticipo.", sito: "https://www.puerta.it/magic-land-sala-bambini/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno per bambini a Lecce?", risposta: "Nelle sale feste appena fuori città, verso Cavallino: LuluParty, con 200 m² di sala e playground, oppure il Magic Land di Castromediano, con gioco gonfiabile e animatori. Sono a pochi minuti di macchina dal centro." },
      { domanda: "Con quanto anticipo bisogna prenotare?", risposta: "Prima che potete: il Magic Land ospita una sola festa al giorno e scrive che il calendario si riempie con mesi di anticipo. Per il sabato e la domenica muovetevi appena avete la data." },
      { domanda: "Posso portare merenda e torta da casa?", risposta: "Dipende dalla sala: al Magic Land non c'è una cucina interna e merenda e catering li sceglie la famiglia, mentre LuluParty propone a richiesta menu per bambini e adulti e la torta. Chiedetelo al momento della prenotazione, insieme a cosa comprende il prezzo." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "treviso",
    citta: "Treviso",
    aggiornata: "2026-11-03",
    rispostaBreve: "A Treviso la festa di compleanno per bambini si fa soprattutto appena fuori città: al Super Park di Dosson di Casier, un parco giochi al coperto con area bimbi, trampolini e kart, dove avete uno spazio riservato con tavoli e l'accesso a tutte le attrazioni, oppure alla Fattoria di Geronimo di Merlengo, una fattoria didattica dove la festa si fa all'aperto con la visita agli animali e giochi adatti all'età. Al parco la torta va nel frigo apposta e pizza o buffet si aggiungono a parte; alla fattoria le feste si fanno nel weekend e si fermano d'estate.",
    intro: "Attorno a Treviso le feste dei bambini si dividono tra due mondi: il parco giochi al coperto, che funziona con ogni tempo e piace a chi vuole correre e saltare, e la fattoria, per chi preferisce animali, prato e aria aperta. Tutti e due sono a pochi minuti di macchina dalla città.",
    locali: [
      { nome: "Super Park", zona: "Dosson di Casier, alle porte di Treviso", tipo: "parco giochi al coperto con trampolini e kart", descrizione: "Un parco giochi al coperto per tutta la famiglia, con un'area per i bimbi da 1 a 6 anni di oltre 200 m² e attrazioni per i più grandi, tra trampolini, un percorso ninja e i kart. Per il compleanno c'è uno spazio riservato con tre tavoli e posti a sedere, l'accesso a tutte le attrazioni del parco e un frigorifero per la torta; pizza, buffet e panini si aggiungono a richiesta, mentre addobbi e smaltimento dei rifiuti non sono compresi.", sito: "https://superpark.fun/" },
      { nome: "La Fattoria di Geronimo", zona: "Merlengo di Ponzano Veneto, a pochi chilometri da Treviso", tipo: "fattoria didattica, spazi all'aperto", descrizione: "Fattoria didattica riconosciuta dalla Regione Veneto, con animali e centro equestre. La festa si fa all'aperto, con uno spazio al coperto se il tempo è brutto, e comprende la visita della fattoria e giochi adatti all'età, con lo staff che aiuta a seguire i bambini. Le feste si tengono nel weekend, con orari che cambiano secondo la stagione, e sono sospese da giugno ad agosto per i centri estivi; per confermare si versa un acconto.", sito: "https://www.ilrifugiodigeronimo.it/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno per bambini a Treviso?", risposta: "Appena fuori città: al Super Park di Dosson di Casier, un parco giochi al coperto con trampolini e kart, o alla Fattoria di Geronimo di Merlengo, per una festa all'aperto con gli animali." },
      { domanda: "E se piove?", risposta: "Il Super Park è al coperto, quindi va bene tutto l'anno. Alla Fattoria di Geronimo la festa è all'aperto ma c'è uno spazio al coperto per il maltempo: chiedete al momento della prenotazione come funziona." },
      { domanda: "Si può portare la torta?", risposta: "Al Super Park sì: nello spazio riservato c'è un frigorifero per la torta, e pizza, buffet o panini si ordinano a parte. Per la fattoria chiedetelo quando prenotate, insieme a cosa comprende il prezzo." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "como",
    citta: "Como",
    aggiornata: "2026-11-03",
    rispostaBreve: "A Como la festa di compleanno per bambini più semplice da organizzare è al Kids Park, un parco giochi al coperto di circa 1.000 m² dentro il centro Driver, con playground su due piani e un'area per i bimbi da 1 a 3 anni: la sala è riservata per 3 ore e la tavola viene apparecchiata, ma dall'esterno si può portare solo la torta. Tra Como e Varese, a Binago, c'è anche Il Villaggio di Piedone, con un pacchetto che comprende sala privata decorata, merenda, torta e accesso ai giochi.",
    intro: "A Como i compleanni dei bambini si fanno soprattutto nei parchi giochi al coperto, che con il clima del lago sono una sicurezza in ogni stagione. In città c'è un grande parco con sale per le feste; poco fuori, verso Varese, un altro parco propone pacchetti con merenda e torta già compresi.",
    locali: [
      { nome: "Kids Park Como", zona: "Como, dentro il centro Driver (via Pasquale Paoli)", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto di circa 1.000 m², con un playground su due piani, una piscina di palline con scivoli, un'area calci di rigore e uno spazio per i bimbi da 1 a 3 anni. Per il compleanno la sala è riservata per 3 ore e la tavola è apparecchiata con piatti, bicchieri, posate e la corona per il festeggiato; cibo e bevande si ordinano al parco, perché dall'esterno si può portare solo la torta. Calze antiscivolo obbligatorie, serve almeno un adulto che accompagni i bambini e alla prenotazione si versa un acconto.", sito: "https://www.kidsparkcomo.it/" },
      { nome: "Il Villaggio di Piedone", zona: "Binago, tra Como e Varese", tipo: "parco giochi al coperto con gonfiabili", descrizione: "Parco giochi al coperto con un playground alto 7 metri, gonfiabili e un'area per i bimbi da 0 a 3 anni. Il pacchetto più scelto comprende una sala privata decorata, la merenda (pizza, focaccia, patatine, popcorn e bibite), la torta della pasticceria del parco e l'accesso ai giochi; da giugno a settembre la festa può usare anche le piscine all'aperto. Il parco resta aperto al pubblico durante le feste e le calze antiscivolo sono obbligatorie.", sito: "https://ilvillaggiodipiedone.com/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno per bambini a Como?", risposta: "In città al Kids Park Como, dentro il centro Driver, con sala riservata per 3 ore; poco fuori, a Binago, al Villaggio di Piedone, con un pacchetto che comprende sala, merenda e torta." },
      { domanda: "Si può portare la torta da casa?", risposta: "Al Kids Park sì, ed è l'unica cosa che si può portare da fuori: cibo e bevande si ordinano al parco. Al Villaggio di Piedone no: la torta arriva dalla pasticceria con cui lavora il parco." },
      { domanda: "Cosa serve portare?", risposta: "In tutti e due i parchi le calze antiscivolo sono obbligatorie: mettetelo nell'invito. Al Kids Park serve anche almeno un adulto che accompagni i bambini." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "varese",
    citta: "Varese",
    aggiornata: "2026-11-04",
    rispostaBreve: "A Varese la festa di compleanno per bambini si fa soprattutto a Gazzada Schianno, appena fuori città: al Gatto e la Volpe, un parco giochi al coperto di circa 600 m² con gonfiabili, playground e un'area per i bimbi fino a 3 anni, dove la festa ha un'area riservata e un menu a scelta da almeno 10 bambini, oppure allo SmashX3 Club Bellavista, un centro sportivo con gonfiabili, piscina interna riscaldata e animatore. Prenotate per tempo e chiedete cosa è compreso nel menu.",
    intro: "Intorno a Varese le feste dei bambini si concentrano a Gazzada Schianno, a pochi minuti dall'uscita Varese Sud. Si può scegliere tra un parco giochi al coperto, pensato apposta per le feste, e un centro sportivo dove il compleanno si fa tra gonfiabili, piscina e campi da calcetto, con qualsiasi tempo.",
    locali: [
      { nome: "Il Gatto e la Volpe", zona: "Gazzada Schianno, alle porte di Varese", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto di circa 600 m², con gonfiabili, playground, tappeto elastico, un'area recintata per i bimbi da 0 a 3 anni e una zona per i 3–11 anni. La festa ha un'area riservata e l'uso di tutti i giochi, con diversi menu a scelta e un minimo di 10 bambini: si va dal solo affitto dello spazio ai menu con pizza, panini, torta e bibite. Si prenota per telefono.", sito: "https://www.ilgattoelavolpesrl.com/" },
      { nome: "SmashX3 Club Bellavista", zona: "Gazzada Schianno (località Campagnola), vicino all'uscita Varese Sud", tipo: "centro sportivo con gonfiabili e piscina", descrizione: "Centro sportivo che organizza compleanni per bambini con gonfiabili a tema, giochi in acqua nella piscina interna riscaldata (d'estate anche in quella esterna), campi da calcetto e un animatore con giochi adatti all'età. Si festeggia con qualsiasi tempo; catering o grigliata, torta, bevande, palloncini e foto si aggiungono a richiesta.", sito: "https://smashx3.com/compleanni-bambini/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno per bambini a Varese?", risposta: "Appena fuori città, a Gazzada Schianno: al Gatto e la Volpe, un parco giochi al coperto con area riservata per la festa, oppure allo SmashX3 Club Bellavista, con gonfiabili, piscina interna e animatore." },
      { domanda: "Quanti bambini servono per la festa?", risposta: "Al Gatto e la Volpe i menu della festa partono da un minimo di 10 bambini. Allo SmashX3 chiedete al momento della prenotazione, insieme a cosa comprende il pacchetto." },
      { domanda: "E se piove?", risposta: "Tutti e due vanno bene in ogni stagione: Il Gatto e la Volpe è al coperto, e lo SmashX3 ha la piscina interna e gli spazi al chiuso. D'estate allo SmashX3 si usa anche la piscina esterna." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "lucca",
    citta: "Lucca",
    aggiornata: "2026-11-04",
    rispostaBreve: "A Lucca la festa di compleanno per bambini si fa spesso in pizzeria o al ristorante con l'area giochi: da Mara Meo, a Lammari, c'è un locale feste con stanza riservata e buffet nel pomeriggio, con le pulizie comprese, mentre al Ristorante La Corte di Santa Maria a Colle si festeggia in un gazebo affacciato sull'area giochi, con buffet di pizza. Chiedete sempre cosa comprende il pacchetto e le regole sulla torta.",
    intro: "A Lucca e dintorni il compleanno dei bambini si fa soprattutto dove si mangia bene e si gioca intorno: pizzerie e ristoranti con una stanza o un gazebo per la festa, spazi all'aperto e un buffet pensato per i bambini. Sono a pochi minuti dal centro, verso Capannori e verso le colline.",
    locali: [
      { nome: "Mara Meo", zona: "Lammari (Capannori), alle porte di Lucca", tipo: "pizzeria con sala feste", descrizione: "Pizzeria che organizza feste di compleanno per bambini nel pomeriggio, con stanza riservata, buffet e pulizie comprese, e pacchetti di grandezza diversa fino a 15 bambini, con un supplemento per ogni bambino in più; il pacchetto più grande comprende anche il campino all'aperto. L'animazione è facoltativa, con i loro animatori, e la torta portata da fuori deve venire da una pasticceria con lo scontrino. Per prenotare si versa un acconto.", sito: "https://www.marameo-lucca.it/" },
      { nome: "Ristorante La Corte", zona: "Santa Maria a Colle, Lucca", tipo: "ristorante, spazi all'aperto con giochi", descrizione: "Ristorante dove la festa dei bambini si fa in un gazebo affacciato sull'area giochi: parco giochi per i più piccoli, campo da calcio e scivolo gonfiabile per i più grandi, con buffet di pizza e bibite. Le feste si fanno nei giorni feriali o in date da concordare, e per i ragazzi dai 12 ai 17 anni c'è anche la pizzata serale; i prezzi si chiedono al ristorante.", sito: "https://www.ristorantelacortedadino.com/" },
    ],
    faq: [
      { domanda: "Dove si festeggia un compleanno per bambini a Lucca?", risposta: "In pizzeria o al ristorante con l'area giochi: da Mara Meo a Lammari, con stanza riservata e buffet, o al Ristorante La Corte di Santa Maria a Colle, con il gazebo sull'area giochi all'aperto." },
      { domanda: "Si può portare la torta?", risposta: "Da Mara Meo la torta portata da fuori deve venire da una pasticceria con lo scontrino. Alla Corte chiedetelo al momento della prenotazione, insieme a cosa comprende il buffet." },
      { domanda: "E per i ragazzi più grandi?", risposta: "Il Ristorante La Corte propone anche una pizzata serale per i ragazzi dai 12 ai 17 anni, quando la festa con i giochi non va più bene." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "grosseto",
    citta: "Grosseto",
    aggiornata: "2026-11-05",
    rispostaBreve: "A Grosseto la festa di compleanno per bambini si fa da KIDS in via Irlanda, una sala feste in esclusiva con una sala baby per i bambini da 0 a 6 anni e una sala kids con lo scivolo gonfiabile, oppure al Joy Family Park, un parco giochi al coperto con trampolini e una sala per i compleanni. Con la bella stagione c'è anche l'Agriturismo Le Giare, a Roselle, con parco giochi e castello gonfiabile. Nessuno pubblica i prezzi: chiedete un preventivo e cosa comprende (buffet, allestimento, torta).",
    intro: "A Grosseto le feste dei bambini si fanno in poche sale dedicate e nei parchi giochi al coperto in città, oppure negli agriturismi della campagna intorno. Per scegliere guardate l'età degli invitati e la stagione: al chiuso d'inverno, nel verde quando fa bello.",
    locali: [
      { nome: "KIDS", zona: "Grosseto, via Irlanda", tipo: "sala feste per bambini in esclusiva", descrizione: "Sala feste con due ambienti: la sala Baby, per i bambini da 0 a 6 anni, con un'area recintata a fondo morbido, giochi a dondolo, costruzioni e una piccola arrampicata, e la sala Kids, per tutte le età, con scivolo gonfiabile, biliardino, air hockey e giochi giganti. Tutte e due hanno l'area buffet allestita, il carretto dei popcorn e un fondale per le foto. I pacchetti si personalizzano, con buffet e allestimenti di ditte locali, e gli inviti digitali a tema sono in regalo.", sito: "https://kidsgrosseto.it/" },
      { nome: "Joy Family Park", zona: "Grosseto, via del Terminillo", tipo: "parco giochi al coperto con sala compleanni", descrizione: "Parco giochi al coperto con oltre 600 mq e un'area esterna: playground, trampolini, giochi di abilità, due piste per le auto radiocomandate e sale multigioco. Ha una sala dedicata ai compleanni, dove la festa si organizza su misura; il costo dipende dai servizi scelti, quindi si chiede un preventivo. Il lunedì apre solo per feste ed eventi prenotati.", sito: "https://www.joyfamilypark.it/" },
      { nome: "Agriturismo Le Giare", zona: "Roselle (Grosseto), Strada del Bottegone", tipo: "agriturismo con parco giochi e ristorante", descrizione: "Agriturismo di circa 12 ettari con ristorante a km zero che organizza anche feste di compleanno per bambini. Il parco giochi ha un castello gonfiabile, un saltarello e scivoli per età diverse, e ci sono un campo da calcio e uno da pallavolo: è adatto soprattutto alle feste all'aperto della bella stagione. La festa si prenota contattando la struttura.", sito: "https://agriturismolegiare.it/" },
    ],
    faq: [
      { domanda: "Dove si festeggia a Grosseto con bambini molto piccoli?", risposta: "Da KIDS, in via Irlanda, c'è una sala Baby pensata per i bambini da 0 a 6 anni, con un'area recintata a fondo morbido; accanto la sala Kids ha giochi per tutte le età, così fratelli e cugini di età diverse giocano ognuno nel suo spazio." },
      { domanda: "C'è un parco giochi al coperto per le feste quando piove?", risposta: "Sì, il Joy Family Park: oltre 600 mq al coperto con trampolini, playground e piste per le auto radiocomandate, e una sala per i compleanni. Il prezzo dipende dai servizi scelti: chiedete un preventivo prima di fissare la data." },
      { domanda: "Si può fare una festa all'aperto vicino a Grosseto?", risposta: "L'Agriturismo Le Giare, a Roselle, organizza feste per bambini con un parco giochi con castello gonfiabile, saltarello e scivoli, e un ristorante a km zero: è una buona scelta dalla primavera all'inizio dell'autunno." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "siracusa",
    citta: "Siracusa",
    aggiornata: "2026-11-05",
    rispostaBreve: "A Siracusa la festa di compleanno per bambini si fa soprattutto da Mama Party, in via Elorina: una sala feste climatizzata con playground, area soft e area baby, animatori e allestimenti a tema, dal solo affitto della sala alla festa chiavi in mano. Poco a nord, a Città Giardino, il Bowling Manhattan propone un pacchetto compleanno con cibo, una partita a bowling e un birillo ricordo. Chiedete subito cosa comprende il pacchetto e come funziona la torta.",
    intro: "A Siracusa le sale dedicate alle feste dei bambini sono poche, quindi conviene prenotare con anticipo, soprattutto per il fine settimana. Le scelte più comode sono una sala attrezzata in città o il bowling appena fuori, per i bambini un po' più grandi.",
    locali: [
      { nome: "Mama Party", zona: "Siracusa, via Elorina (zona sud)", tipo: "sala feste con playground e area baby", descrizione: "Sala feste dedicata soprattutto ai compleanni dei bambini, con una sala giochi che comprende playground, giostra, area soft e area baby, e animatori che seguono i bambini durante la festa. Tra le animazioni ci sono trucca bimbi, bolle di sapone, baby dance e il teatrino delle marionette, con baby catering e allestimenti a tema. La sala è climatizzata, c'è un ampio parcheggio e si può scegliere dal solo affitto dello spazio alla festa organizzata per intero, con un unico referente per i fornitori.", sito: "https://www.mamapartysiracusa.it/" },
      { nome: "Bowling Manhattan", zona: "Città Giardino (Melilli), viale Edoardo Garrone, a nord di Siracusa", tipo: "bowling con pacchetto compleanno", descrizione: "Centro bowling attivo dal 1995, con sala giochi e area ristoro, aperto tutti i giorni dal pomeriggio. Il pacchetto compleanno pubblicato dal locale comprende un trancio di pizza o un hot dog, patatine e nuggets, una bibita, una partita a bowling e un birillo personalizzato da portare a casa, con la torta offerta dal locale. Si prenota per telefono: chiedete le condizioni aggiornate.", instagram: "https://www.instagram.com/bowlingmanhattan/" },
    ],
    faq: [
      { domanda: "Dove si fa una festa al coperto a Siracusa?", risposta: "Da Mama Party, in via Elorina, che ha una sala climatizzata con playground, area soft e area baby e gli animatori; oppure al Bowling Manhattan di Città Giardino, al chiuso e aperto tutti i giorni dal pomeriggio." },
      { domanda: "La torta si porta o la fornisce il locale?", risposta: "Dipende. Nel pacchetto compleanno pubblicato dal Bowling Manhattan la torta la offre il locale; Mama Party parla di baby catering ma non della torta, quindi chiedetelo quando prenotate." },
      { domanda: "Che festa scelgo per i bambini più grandi?", risposta: "Per i bambini dalla scuola elementare in su il bowling è un'alternativa diversa dal solito: al Bowling Manhattan il pacchetto comprende una partita e un birillo ricordo per il festeggiato. Per i più piccoli è più adatta la sala con area baby e animazione di Mama Party." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "cremona",
    citta: "Cremona",
    aggiornata: "2026-11-06",
    rispostaBreve: "A Cremona la festa di compleanno per bambini si fa da Tourlé, in via Gaspare Pedone: una pizzeria con area bimbi (scivoli, percorsi e vasche di palline) che apre il pomeriggio su prenotazione per i compleanni, con tavoli allestiti e giropizza per gli invitati. Chi preferisce la campagna trova a Ossalengo di Castelverde, a pochi minuti dalla città, la Fattoria Ca' Bianca, che su richiesta organizza gli AGRIcompleanni tra animali, giochi e merenda. Prenotate con anticipo e chiedete subito come funziona la torta.",
    intro: "A Cremona le feste dei bambini si dividono fra il pomeriggio in pizzeria con l'area giochi e la festa in fattoria didattica, nella campagna appena fuori città. La prima è al coperto e senza pensieri, la seconda all'aria aperta e a contatto con gli animali.",
    locali: [
      { nome: "Tourlé", zona: "Cremona, via Gaspare Pedone", tipo: "pizzeria con area bimbi e feste di compleanno", descrizione: "Pizzeria che apre tutti i pomeriggi, su prenotazione, per le feste di compleanno dei bambini. L'area bimbi ha scivoli, percorsi e vasche di palline ed è visibile dai tavoli, così i genitori tengono d'occhio i piccoli. La festa prevede tavoli allestiti, gioco libero nell'area bimbi e giropizza per gli invitati, con un giropizza dedicato ai bambini fino a 10 anni. La torta si può portare dalla propria pasticceria pagando il servizio piattini, oppure si sceglie quella proposta dal locale.", sito: "https://www.tourle.it/cremona" },
      { nome: "Fattoria Ca' Bianca", zona: "Ossalengo di Castelverde, a pochi minuti da Cremona", tipo: "fattoria didattica con compleanni in fattoria", descrizione: "Fattoria didattica alle porte di Cremona che su richiesta organizza gli AGRIcompleanni, il compleanno in fattoria tra animali, giochi e merenda. Per i bambini dai 3 anni in su propone anche laboratori sull'orto, sul frutteto e sugli animali, come la passeggiata con le caprette e gli asinelli. I dettagli della festa si concordano direttamente con la fattoria.", sito: "https://cabianca.eu/" },
    ],
    faq: [
      { domanda: "C'è un posto al coperto a Cremona per la festa di compleanno?", risposta: "Sì: Tourlé, in via Gaspare Pedone, apre il pomeriggio su prenotazione per i compleanni dei bambini, con l'area bimbi al coperto (scivoli, percorsi e vasche di palline) visibile dai tavoli." },
      { domanda: "Si può portare la torta dalla pasticceria?", risposta: "Da Tourlé sì, pagando il servizio piattini, oppure si sceglie la torta proposta dal locale. Per la festa a Ca' Bianca la merenda si concorda con la fattoria quando si organizza." },
      { domanda: "La festa in fattoria va bene anche per i più piccoli?", risposta: "La Fattoria Ca' Bianca fa laboratori per bambini dai 3 anni, con caprette e asinelli, e organizza il compleanno in fattoria su richiesta. Visto che si sta soprattutto all'aperto, chiedete cosa propongono in caso di brutto tempo." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "cosenza",
    citta: "Cosenza",
    aggiornata: "2026-11-06",
    rispostaBreve: "A Cosenza la festa di compleanno per bambini si fa da MagicLand, in città, con sala in esclusiva, area giochi morbida e un pacchetto con buffet e torta; da PlayTown a Rende, un parco giochi al coperto costruito come una piccola città, riservato agli invitati durante la festa; oppure in fattoria da Animagricola, a Rende, tra asini, animali e giochi di una volta. Prenotate con anticipo per il fine settimana e chiedete subito cosa comprende il pacchetto e quanti bambini sono ammessi.",
    intro: "Nell'area urbana di Cosenza, che arriva a Rende, ci sono sale feste al coperto con gonfiabili e animazione e una fattoria didattica a pochi minuti. Si sceglie tra la festa al chiuso, che va bene tutto l'anno, e quella a contatto con gli animali.",
    locali: [
      { nome: "MagicLand", zona: "Cosenza, via Barlaam di Calabria", tipo: "sala feste con area giochi e gonfiabili", descrizione: "Il pacchetto feste comprende la sala in esclusiva, l'area giochi morbida con piscina di palline, scivoli, costruzioni giganti e gonfiabili, il buffet, la torta, i palloncini e l'assistenza di un operatore. Su richiesta si aggiungono animazione, allestimenti personalizzati e sweet table, e l'area gioco è sorvegliata dagli educatori. Il locale propone anche laboratori creativi e di cucina, ludoteca e baby parking.", sito: "https://www.magiclandcosenza.it/" },
      { nome: "PlayTown Family Park", zona: "Rende, via Vittorio Bottego", tipo: "parco giochi al coperto con sala feste", descrizione: "Parco giochi al coperto costruito come una piccola città per bambini da 0 a 10 anni: una zona «Città» per giocare ai mestieri (ristorante, ospedale, pompieri) e una zona «Aeroporto» per il gioco di movimento, con gli animatori. Per le feste ci sono tre pacchetti: il base comprende inviti, percorsi di gioco, sala festa con animazione e menù a scelta, quelli superiori aggiungono laboratorio a tema, allestimento più ricco, sweet table e spettacolo. I menù dei bambini arrivano in box personalizzati, ci sono menù anche per i genitori e durante la festa la struttura è riservata agli invitati.", sito: "https://www.playtownrende.it/" },
      { nome: "Animagricola", zona: "Rende, contrada Isolette", tipo: "fattoria didattica e asineria con compleanni", descrizione: "Fattoria didattica e asineria che organizza compleanni in fattoria: giochi di una volta, incontro con gli asini e con galline, capre, pecore, cavalli e conigli, giochi con la terra e le piante e pic-nic sul prato. Ha uno spazio interno coperto e attrezzato, così la festa si può fare anche d'inverno o con il maltempo. Per gli eventi la prenotazione è obbligatoria.", sito: "https://www.animagricola.farm/" },
    ],
    faq: [
      { domanda: "Meglio una festa al coperto o in fattoria a Cosenza?", risposta: "Dipende dalla stagione e dall'età: MagicLand e PlayTown sono al coperto e vanno bene tutto l'anno; Animagricola, a Rende, punta su animali e giochi all'aperto, ma ha anche uno spazio coperto per l'inverno o la pioggia." },
      { domanda: "La sala è riservata solo ai nostri invitati?", risposta: "MagicLand comprende nel pacchetto la sala in esclusiva e PlayTown riserva la struttura agli invitati per tutta la festa. Confermatelo comunque quando prenotate." },
      { domanda: "Cosa comprende di solito il pacchetto festa?", risposta: "Da MagicLand sala, area giochi, buffet, torta, palloncini e un operatore, con animazione e sweet table su richiesta; da PlayTown tre pacchetti con inviti, animazione e menù a scelta, più laboratorio e spettacolo in quelli superiori. Chiedete sempre il dettaglio aggiornato." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "caserta",
    citta: "Caserta",
    aggiornata: "2026-11-06",
    rispostaBreve: "A Caserta la festa di compleanno per bambini si fa da Sunrise Pizza, in via Roma, che ha un'area kids con scivoli e giochi morbidi e pacchetti con due animatori, menù bimbi e un gadget per ogni bambino; da Meraviland, a Puccianiello, una ludoteca con playground e sala feste; oppure da Pharina, a Capodrise, pizzeria con area bambini dai 3 ai 9 anni, comoda anche per una festa di sera. Chiedete un preventivo scritto con cosa è compreso e se si può portare la torta.",
    intro: "A Caserta e nei comuni attaccati alla città le feste dei bambini si fanno soprattutto nelle ludoteche con playground e nelle pizzerie con un'area kids sorvegliata dallo staff. Si va dalla festa con animatori e menù compreso alla serata in pizzeria con i giochi.",
    locali: [
      { nome: "Sunrise Pizza", zona: "Caserta centro, via Roma", tipo: "pizzeria con area kids e pacchetti feste", descrizione: "Pizzeria con un'area kids protetta, con scivoli, percorsi e giochi morbidi, sorvegliata dagli animatori dello staff e pensata per bambini dai 2 ai 9 anni. I pacchetti per i compleanni prevedono due animatori, il playground, giochi di gruppo, l'apertura dei regali, un menù bimbi (pizza oppure pasta e cotoletta con patatine), bibita, un dolce e un gadget per ogni bambino; per uno dei pacchetti servono almeno 15 bambini. Ci sono anche opzioni senza glutine, vegetariane e vegane.", sito: "https://www.sunrisepizzacaserta.it/area-kids/" },
      { nome: "Meraviland", zona: "Puccianiello (Caserta), via Concezione", tipo: "ludoteca con playground e sala feste", descrizione: "Ludoteca con playground e sala feste dove i compleanni si fanno nell'area playground, con attrezzature e pavimenti protettivi e personale che sorveglia i bambini. Su richiesta si aggiungono animazione, catering e allestimenti a tema. Propone anche laboratori creativi e decorazioni con i palloncini.", sito: "https://meraviland.it/" },
      { nome: "Pharina", zona: "Capodrise, via Retella (al confine con Caserta e Marcianise)", tipo: "pizzeria con area bambini e sale per eventi", descrizione: "Pizzeria, ristorante e burgeria con un'area kids per bambini dai 3 ai 9 anni, con giochi sorvegliati dallo staff. Organizza feste ed eventi privati con servizio personalizzato e gadget per tutti i bambini, nelle sale interne o nel giardino attrezzato. Apre la sera ed è comoda per una festa con cena, con un ampio parcheggio.", sito: "https://www.pharinapizzaevents.com/area-bimbi-pizzeria-ristorante-burgeria-eventi-caserta" },
    ],
    faq: [
      { domanda: "Quale locale di Caserta va bene per i bambini piccoli?", risposta: "L'area kids di Sunrise Pizza è pensata per i bambini dai 2 ai 9 anni, quella di Pharina a Capodrise per i 3-9 anni, e il playground di Meraviland a Puccianiello ha pavimenti protettivi e personale che sorveglia." },
      { domanda: "Si può fare la festa di sera?", risposta: "Sì: Pharina apre la sera ed è adatta a una festa con cena e area bambini. Per gli altri locali chiedete quali fasce orarie sono libere quando prenotate." },
      { domanda: "Cosa conviene chiedere quando prenoto?", risposta: "Cosa comprende il pacchetto (animazione, menù, gadget), il numero minimo di bambini e se si può portare la torta: nessuno dei tre locali pubblica le regole sulla torta. Per intolleranze e diete, Sunrise Pizza indica opzioni senza glutine, vegetariane e vegane." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "pozzuoli",
    citta: "Pozzuoli",
    aggiornata: "2026-11-07",
    rispostaBreve: "A Pozzuoli la festa di compleanno per bambini si fa spesso all'aperto, tra il Lago d'Averno e il Lago Lucrino: il Giardino dell'Orco organizza feste in campagna tra prati e agrumeti, con giochi di una volta, caccia al tesoro e il percorso sulle api; Masseria Sardo costruisce eventi privati su misura con menù per bambini e animatori; il Parco dei Laghi ha un parco giochi con bar e ristorante e un pacchetto per le feste dei bambini. Visto che sono spazi all'aperto, chiedete subito cosa succede se piove.",
    intro: "Nei Campi Flegrei le feste dei bambini più caratteristiche si fanno in campagna, nella fascia verde fra il Lago d'Averno e Lucrino. Aziende agricole, agriturismi e parchi con l'area giochi sono un'alternativa alla solita sala al chiuso.",
    locali: [
      { nome: "Il Giardino dell'Orco", zona: "Lago d'Averno, via Lago Averno (Pozzuoli)", tipo: "azienda agricola con fattoria didattica", descrizione: "Azienda agricola affacciata sul Lago d'Averno che organizza compleanni all'aperto, tra prati e agrumeti, con tavoli da picnic o coperte sul prato. Il programma può comprendere giochi di campagna come la corsa nei sacchi e il tiro alla fune, una caccia al tesoro nella natura che finisce con un erbario e le focaccine di verdure, oppure un percorso sulle api e sul miele. Per gli adulti si può chiedere un preventivo per brunch, barbecue o buffet; il preventivo si chiede indicando data e numero di invitati.", sito: "https://www.ilgiardinodellorco.it" },
      { nome: "Masseria Sardo", zona: "Lago d'Averno, via Montenuovo Licola Patria (Pozzuoli)", tipo: "agriturismo con eventi privati", descrizione: "Agriturismo sul Lago d'Averno con orti, frutteti, ristorante e un bar all'aperto, che ospita eventi privati costruiti insieme alla famiglia, senza pacchetti fissi. Tra i servizi ci sono le proposte per bambini nel menù e gli animatori per intrattenere i più piccoli, in terrazza, nelle sale interne o sul prato del frutteto. Nei fine settimana di primavera e d'estate ospita anche giochi e laboratori all'aperto con un ludobus.", sito: "https://masseriasardo.com" },
      { nome: "Parco dei Laghi", zona: "Lucrino, via Circumlago (Pozzuoli)", tipo: "parco con area giochi, bar e ristorante", descrizione: "Parco tra il Lago Lucrino e il Lago d'Averno, con un parco giochi su superfici morbide, bar e ristorante e ampi spazi per festeggiare. Propone pacchetti per gli eventi, tra cui uno per le feste dei bambini, da personalizzare indicando data e numero di persone. Non ci sono aree picnic: cibo e bevande da fuori non sono ammessi.", sito: "https://parcodeilaghi.it" },
    ],
    faq: [
      { domanda: "A Pozzuoli ci sono posti al chiuso per la festa?", risposta: "I locali di questa pagina puntano soprattutto sugli spazi all'aperto; Masseria Sardo ha anche sale interne e una terrazza. Per una festa d'inverno chiedete quali spazi coperti ci sono e cosa si fa se piove." },
      { domanda: "Si può portare la torta da casa?", risposta: "Dipende: al Parco dei Laghi cibo e bevande da fuori non sono ammessi, quindi chiedete la torta a loro. Al Giardino dell'Orco il rinfresco si concorda nel preventivo." },
      { domanda: "Cosa si fa in una festa in fattoria sul Lago d'Averno?", risposta: "Al Giardino dell'Orco giochi di campagna come la corsa nei sacchi e il tiro alla fune, una caccia al tesoro con l'erbario e le focaccine, o il percorso sulle api e sul miele; da Masseria Sardo, nei fine settimana della bella stagione, giochi e laboratori con il ludobus." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "viterbo",
    citta: "Viterbo",
    aggiornata: "2026-11-07",
    rispostaBreve: "A Viterbo la festa di compleanno per bambini si fa al Parco Giochi Pratogiardino, nella villa comunale, con gonfiabili, pacchetti personalizzati, un regalo per il festeggiato e buffet o sala al bar del parco; nella sala con gonfiabili della piscina MGM, in Strada Castiglione; oppure, per i bambini dagli 8 ai 12 anni, con il compleanno dopo la scuola del Toto's, in sala riservata con gli animatori. Pratogiardino è all'aperto e ha orari stagionali: d'inverno puntate sulle sale al chiuso.",
    intro: "A Viterbo le feste dei bambini si dividono fra il parco giochi storico della villa comunale, la sala con gonfiabili di un centro sportivo e i locali che organizzano compleanni in sala riservata. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Parco Giochi Pratogiardino", zona: "Viterbo, villa comunale di Prato Giardino, vicino al centro", tipo: "parco giochi con gonfiabili all'aperto", descrizione: "Il parco giochi della villa comunale, attivo dal 1993, con giochi, gonfiabili e zone d'ombra. Per i compleanni ci sono sconti e pacchetti personalizzati, il festeggiato riceve un regalo dallo staff e buffet e sala si prenotano al bar del parco. Lo staff noleggia anche gonfiabili da portare nella location scelta. Gli orari cambiano con le stagioni.", sito: "https://parcogiochiviterbo.it/" },
      { nome: "MGM Pool", zona: "Viterbo, Strada Castiglione", tipo: "centro piscina con sala feste e gonfiabili", descrizione: "Centro piscina con una sala attrezzata con gonfiabili per i compleanni dei bambini, anche a tema. Nel centro ci sono bar, caffetteria e parcheggio, e lo staff aiuta a organizzare la festa. Pacchetti e disponibilità si chiedono direttamente al centro.", sito: "https://www.piscinamgm.it/" },
      { nome: "Toto's", zona: "Viterbo, via Genova, vicino al centro", tipo: "ristorante con sala per compleanni", descrizione: "Propone un compleanno dopo la scuola per i bambini dagli 8 ai 12 anni, con una sala intera riservata ai festeggiati e agli amici e gli animatori a intrattenerli, mentre i genitori passano a riprenderli più tardi. Menù e torta, anche con una grafica personalizzata, si scelgono con lo staff, e c'è un menù per bambini.", sito: "https://www.totospub.it/" },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Viterbo?", risposta: "Sì: la sala con gonfiabili della piscina MGM, in Strada Castiglione, e la sala riservata del Toto's sono al chiuso. Il Parco Giochi Pratogiardino è all'aperto e segue orari stagionali." },
      { domanda: "Dove festeggio un bambino fra gli 8 e i 12 anni?", risposta: "Il Toto's ha una formula di compleanno dopo la scuola pensata proprio per gli 8-12 anni: sala intera, animatori, menù e torta scelti con lo staff. Per i più piccoli vanno meglio i gonfiabili di Pratogiardino e della piscina MGM." },
      { domanda: "Posso portare la torta?", risposta: "Al Toto's la torta si concorda con lo staff. Per Pratogiardino e la piscina MGM le fonti non lo dicono: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "trapani",
    citta: "Trapani",
    aggiornata: "2026-11-08",
    rispostaBreve: "A Trapani la festa di compleanno per bambini si fa alla Giungla Incantata Park, un parco giochi al coperto con sala feste; al Parco Avventura Erice, nella pineta di Martogna, con percorsi sugli alberi e un'area feste nel bosco; oppure alla Tenuta Pizzolungo, ai piedi di Erice, con il compleanno in fattoria fra gli animali. Il Parco Avventura e la fattoria sono all'aperto: d'inverno puntate sulla sala al chiuso.",
    intro: "A Trapani le feste dei bambini si dividono fra il parco giochi al coperto in città e due proposte all'aperto appena fuori, verso Erice: il bosco di Martogna e la campagna vicino al mare di Pizzolungo. Orari e pacchetti cambiano: conviene chiedere conferma e prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "La Giungla Incantata Park", zona: "Trapani, in città", tipo: "parco giochi al coperto con sala feste", descrizione: "Un parco giochi al coperto a tema giungla, con una grande struttura imbottita, un tappeto elastico, una piscina di palline e uno spazio per i bambini da 1 a 3 anni. Per le feste c'è una sala dedicata e si festeggia un solo compleanno alla volta. Si può affittare solo la sala oppure scegliere un pacchetto con catering, e il personale sorveglia i bambini. Orari e indirizzo esatto si confermano quando prenotate.", instagram: "https://www.instagram.com/lagiunglaincantatapark/" },
      { nome: "Parco Avventura Erice", zona: "Erice, pineta di Martogna, a pochi minuti da Trapani", tipo: "parco avventura all'aperto", descrizione: "Un parco avventura con percorsi sugli alberi nel bosco di Martogna. Per i compleanni c'è un'area di circa 50 metri quadri sotto una pergola, a uso esclusivo, con un frigorifero e i percorsi a prezzo scontato. Per i più piccoli c'è il percorso Mini Junior, basso e senza imbrago, pensato per la scuola dell'infanzia e i primi anni della primaria. Nel 2026 il parco apre il sabato e la domenica." },
      { nome: "Tenuta Pizzolungo", zona: "Erice, località Pizzolungo, ai piedi del monte e vicino al mare", tipo: "agriturismo e fattoria didattica", descrizione: "Un agriturismo con fattoria didattica che propone il compleanno in fattoria. La festa si fa in giardino, all'aperto, fra alberi, gazebo e zone d'ombra. I bambini incontrano gli animali della fattoria e c'è un piccolo parco giochi; si può organizzare anche una passeggiata sull'asino, con animazione e sorveglianza dello staff." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Trapani?", risposta: "Sì: la Giungla Incantata Park è un parco giochi al chiuso, con sala feste. Il Parco Avventura Erice e la Tenuta Pizzolungo sono all'aperto e vanno meglio con la bella stagione." },
      { domanda: "Ci sono proposte per bambini molto piccoli?", risposta: "Alla Giungla Incantata c'è uno spazio per i bambini da 1 a 3 anni. Al Parco Avventura Erice il percorso Mini Junior è basso e si fa senza imbrago, pensato per i bimbi della scuola dell'infanzia e dei primi anni della primaria." },
      { domanda: "Posso portare la torta?", risposta: "Alla Giungla Incantata ci sono pacchetti con catering e al Parco Avventura Erice l'area feste ha un frigorifero. Se si può portare una torta propria, le fonti non lo dicono per nessuno dei tre: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "savona",
    citta: "Savona",
    aggiornata: "2026-11-08",
    rispostaBreve: "A Savona la festa di compleanno per bambini si fa al Bowling Savona, con piste dotate di sponde per i bambini, videogiochi e un'area riservata alle feste; oppure nella sala feste di Capriole sulle Nuvole, vicino al centro storico e alla Darsena, da affittare da sola o con animazione e allestimento a tema. Sono due posti al chiuso, quindi vanno bene anche d'inverno.",
    intro: "A Savona le feste dei bambini si dividono fra il bowling, per una festa di movimento, e la sala feste con le animatrici, per chi preferisce giochi, palloncini e un tema scelto insieme. Tutti e due sono al chiuso. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Bowling Savona", zona: "Savona, via Trilussa", tipo: "bowling con area feste", descrizione: "Un centro bowling che organizza feste di compleanno con la formula B-Party: 10 piste con le sponde per i bambini, videogiochi, giochi a punti, un'area riservata per festeggiare e uno snack bar. Lo staff aiuta a organizzare la festa. Prezzi e pacchetti non sono indicati online: chiedeteli quando prenotate.", instagram: "https://www.instagram.com/bowlingsavona/" },
      { nome: "Capriole sulle Nuvole", zona: "Savona, via Santa Lucia, vicino al centro storico e alla Darsena", tipo: "sala feste con animazione", descrizione: "Un'agenzia di animazione per bambini con una sala feste attrezzata e colorata. Le formule sono tre: solo la sala, sala con animazione, oppure sala con animazione e allestimento a tema; numero di animatrici, tema e attività si scelgono insieme. La sala è disponibile dal lunedì alla domenica e organizzano anche pigiama party.", instagram: "https://www.instagram.com/capriole_sulle_nuvole/" },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Savona?", risposta: "Sì, tutti e due: il Bowling Savona ha un'area riservata alle feste accanto alle piste, e la sala di Capriole sulle Nuvole è un locale chiuso in via Santa Lucia, vicino alla Darsena." },
      { domanda: "Che età serve per una festa al bowling?", risposta: "Il Bowling Savona ha piste con le sponde pensate per i bambini, ma non indica un'età minima: chiedetela quando prenotate. Per i più piccoli la sala con animazione di Capriole sulle Nuvole è spesso la scelta più semplice." },
      { domanda: "Posso portare la torta?", risposta: "Le fonti non lo dicono, né per il Bowling Savona né per Capriole sulle Nuvole: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "busto-arsizio",
    citta: "Busto Arsizio",
    aggiornata: "2026-11-09",
    rispostaBreve: "A Busto Arsizio la festa di compleanno per bambini si può fare in fattoria da Erba Fina, in via Favana, tra animali, orto e laboratori, con un giardino e una serra al chiuso. A pochi chilometri, a Gallarate, c'è La Tana di Ninì, una ludoteca con laboratori creativi, uno spazio interno e il giardino. Prenotate con qualche settimana di anticipo, soprattutto per il fine settimana.",
    intro: "Intorno a Busto Arsizio le feste dei bambini si dividono fra la campagna, con gli animali e l'orto, e la ludoteca con i laboratori creativi. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Erba Fina", zona: "Busto Arsizio, via Favana", tipo: "fattoria didattica con spazi per feste", descrizione: "Una fattoria didattica alla periferia della città, tra prati e un bosco di robinie, con piccoli animali tra l'aia e l'orto. Organizza feste di compleanno con laboratori creativi, esperienze con gli animali o nell'orto didattico, giochi sul prato e cacce al tesoro, seguite da operatori di fattoria didattica o da educatori. Per la festa si può prenotare il giardino, anche in esclusiva, oppure la Serra Urbana, uno spazio al chiuso." },
      { nome: "La Tana di Ninì", zona: "Gallarate, viale Milano, a pochi chilometri da Busto Arsizio", tipo: "ludoteca con laboratori e giardino per feste", descrizione: "Una ludoteca con laboratori creativi per bambini da 12 mesi a 10 anni, con uno spazio interno e un ampio giardino. Per i compleanni ci sono più formule: solo l'affitto degli spazi, la festa con allestimento a tema e animazione, oppure una festa con un allestimento più ricco. Si possono chiedere anche laboratori privati per il compleanno; gli spazi accolgono circa 25-30 persone." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Busto Arsizio?", risposta: "Sì: da Erba Fina c'è la Serra Urbana, uno spazio al chiuso pensato anche per le feste, e a Gallarate La Tana di Ninì ha uno spazio interno oltre al giardino. Chiedete quale spazio è libero nella vostra data." },
      { domanda: "Fino a che età si può festeggiare?", risposta: "La Tana di Ninì propone laboratori per bambini da 12 mesi a 10 anni. Erba Fina organizza feste in fattoria anche per i ragazzi più grandi." },
      { domanda: "Posso portare la torta?", risposta: "Le fonti non lo dicono in modo chiaro per nessuno dei due locali: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "carpi",
    citta: "Carpi",
    aggiornata: "2026-11-09",
    rispostaBreve: "A Carpi la festa di compleanno per bambini si fa al coperto al BabyCSI di via Lombardia, con castello gioco, tappeti elastici, gonfiabili, saletta riservata e buffet con torta; chi ama l'acqua può scegliere la festa in piscina con Coopernuoto alla piscina Campedelli, la domenica mattina da settembre a maggio. Prenotate con qualche settimana di anticipo e chiedete cosa comprende il pacchetto.",
    intro: "A Carpi ci sono un centro giochi al coperto con le salette per le feste e una piscina comunale che organizza compleanni anche d'inverno. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "BabyCSI", zona: "Carpi, via Lombardia", tipo: "parco giochi al coperto con sale feste", descrizione: "Un centro ludico motorio per bambini fino a 11 anni, gestito da Csi Carpi Sport, con un castello gioco su tre piani, tappeti elastici, due gonfiabili, un campo da calcio e un'area soft per i più piccoli. Le feste si prenotano dal martedì alla domenica pomeriggio, con almeno 10 bambini paganti, e i pacchetti comprendono una saletta riservata e un buffet con la torta. A settembre 2026 il centro ha riaperto rinnovato." },
      { nome: "Coopernuoto, piscina Campedelli", zona: "Carpi, piazzale delle Piscine", tipo: "piscina con corsi di nuoto e feste di compleanno", descrizione: "Coopernuoto organizza feste di compleanno in piscina per bambini e ragazzi. In vasca coperta la festa si fa la domenica mattina, da settembre a maggio, con formule per 4-13 anni e per 14-17 anni, nella vasca baby o in quella dei corsi secondo disponibilità, con giochi d'acqua. Si può scegliere solo la piscina oppure piscina con buffet." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Carpi?", risposta: "Sì: il BabyCSI è un centro giochi al coperto con gonfiabili e salette per le feste, e Coopernuoto organizza feste in piscina coperta la domenica mattina, da settembre a maggio." },
      { domanda: "Quanti bambini servono per prenotare?", risposta: "Al BabyCSI servono almeno 10 bambini paganti. Per la festa in piscina le fonti non indicano un minimo: chiedetelo quando prenotate." },
      { domanda: "Posso portare la torta?", risposta: "Al BabyCSI la torta è già compresa nei pacchetti. Per la festa in piscina c'è la formula con buffet: se si può portare una torta propria, chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "imola",
    citta: "Imola",
    aggiornata: "2026-11-10",
    rispostaBreve: "A Imola la festa di compleanno per bambini si fa da Coccolandia, un parco giochi al coperto con gonfiabile, tappeti elastici e salette per le feste, oppure al museo con «Buon compleanno al Museo» dei Musei civici, per bambini dai 6 ai 12 anni. Per il museo bisogna prenotare almeno 15 giorni prima: conviene muoversi presto.",
    intro: "A Imola ci sono due proposte al coperto adatte a ogni stagione: il parco giochi per i più piccoli e il laboratorio al museo per chi va già a scuola. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Coccolandia Imola", zona: "Imola, via Calamelli", tipo: "parco giochi al coperto con salette per le feste", descrizione: "Un'associazione per bambini e ragazzi da 1 a 12 anni con un grande spazio giochi al chiuso: un gonfiabile grande, un playground, quattro tappeti elastici e un'area baby per i più piccoli. Su un soppalco ci sono quattro salette riservate alle feste di compleanno, con accesso all'area giochi, e il personale allestisce la sala con il tema e i colori scelti dalla famiglia.", instagram: "https://www.instagram.com/coccolandiaimola/" },
      { nome: "Imola Musei, Buon compleanno al Museo", zona: "Imola, centro storico", tipo: "museo con laboratorio per feste di compleanno", descrizione: "I Musei civici di Imola propongono una festa di compleanno al museo per bambini dai 6 ai 12 anni, nei pomeriggi del fine settimana, della durata di circa due ore. La proposta è nel listino dei musei in vigore dal 2026 e si prenota almeno 15 giorni prima." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Imola?", risposta: "Sì, tutti e due: Coccolandia è un parco giochi al chiuso con gonfiabile, tappeti elastici e salette per le feste, e anche la festa dei Musei civici si fa al coperto, nelle sale del museo." },
      { domanda: "Qual è la proposta giusta in base all'età?", risposta: "Coccolandia accoglie bambini da 1 a 12 anni e ha un'area baby; la festa al museo è pensata per bambini dai 6 ai 12 anni." },
      { domanda: "Posso portare la torta?", risposta: "Le fonti non lo dicono per nessuno dei due: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "pordenone",
    citta: "Pordenone",
    aggiornata: "2026-11-10",
    rispostaBreve: "A Pordenone la festa di compleanno per bambini si fa al New Joy Village, in zona via Nuova di Corva, con ludoteche riservate al solo gruppo della festa e un coordinatore di sala; a pochi minuti, a Fontanafredda, c'è Fable Table, una pizzeria con un'area giochi di oltre 100 metri quadri. Per il sabato e la domenica conviene prenotare con largo anticipo.",
    intro: "Intorno a Pordenone ci sono locali al coperto pensati per le feste dei più piccoli, utili soprattutto nei mesi freddi. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "New Joy Village", zona: "Pordenone, zona via Nuova di Corva", tipo: "ludoteca con sale feste riservate", descrizione: "Un centro con ludoteche per le feste di compleanno. La festa è in esclusiva: la ludoteca è riservata solo al gruppo che ha prenotato e c'è un coordinatore di sala dedicato; le guide locali citano anche i gonfiabili. Si può festeggiare dalla mattina alla sera e il centro riceve su appuntamento." },
      { nome: "Fable Table", zona: "Fontanafredda, viale Venezia, a pochi minuti da Pordenone", tipo: "pizzeria con area bimbi e feste di compleanno", descrizione: "Una pizzeria pensata per le famiglie, con un'area giochi di oltre 100 metri quadri con gonfiabili, playground e mattoncini giganti. Per la festa si può portare la torta da casa o sceglierla dal locale, e d'estate si può festeggiare anche nell'area giochi all'aperto." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Pordenone?", risposta: "Sì: il New Joy Village ha ludoteche al coperto riservate al gruppo della festa, e Fable Table a Fontanafredda ha un'area giochi interna di oltre 100 metri quadri con gonfiabili." },
      { domanda: "Posso portare la torta?", risposta: "Da Fable Table sì: si può portare da casa oppure ordinarla al locale. Per il New Joy Village le fonti non lo dicono: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "sesto-san-giovanni",
    citta: "Sesto San Giovanni",
    aggiornata: "2026-11-11",
    rispostaBreve: "A Sesto San Giovanni la festa di compleanno per bambini si fa al Sesto Regno di via Mazzini, una ludoteca con quattro sale feste a tema e un'area bimbi con gonfiabili e scivolo, oppure negli spazi di Al Villaggio, l'associazione di via Cavallotti che affitta saletta o salone in esclusiva per tre ore, anche a chi non è socio. Scegliete il pacchetto in base al numero di bambini e chiedete subito cosa comprende tra cibo e torta.",
    intro: "A Sesto San Giovanni ci sono sale feste in esclusiva per qualche ora, con area giochi, sia in ludoteca sia in un'associazione sportiva del quartiere. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Il Sesto Regno", zona: "Sesto San Giovanni, via Mazzini", tipo: "ludoteca con area bimbi e sale feste a tema", descrizione: "Di pomeriggio è una giocheria per bambini, con una sala con scivolo, gonfiabili, playground e una zona per i più piccoli. Ha quattro sale per le feste, pensate per compleanni ed eventi di bambini da 0 a 12 anni, con formule diverse: in alcune si può portare il cibo confezionato, in altre la torta è già compresa. Si possono organizzare anche pizzate, con allestimento e menù da concordare." },
      { nome: "Al Villaggio", zona: "Sesto San Giovanni, via Cavallotti", tipo: "associazione sportiva con saletta e salone per feste", descrizione: "L'associazione affitta i suoi spazi per le feste dei bambini da 0 a 11 anni, anche a chi non è socio. Ci sono più pacchetti, dal «fai da te» in su, tutti con il locale in esclusiva per tre ore: si sceglie la saletta o il salone, con area giochi e spazio esterno. Su richiesta c'è l'animazione per i più piccoli.", instagram: "https://www.instagram.com/al_villaggio/" },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Sesto San Giovanni?", risposta: "Sì: Il Sesto Regno ha sale feste e un'area bimbi interna con gonfiabili, scivolo e playground, e Al Villaggio mette a disposizione saletta o salone, oltre allo spazio esterno." },
      { domanda: "Posso portare la torta?", risposta: "Dipende dal pacchetto: al Sesto Regno alcune formule permettono di portare cibo confezionato, altre comprendono già la torta. Per Al Villaggio chiedetelo quando prenotate: il pacchetto «fai da te» è pensato per organizzare voi." },
      { domanda: "Fino a che età vanno bene queste feste?", risposta: "Al Sesto Regno le sale sono pensate per bambini da 0 a 12 anni, Al Villaggio per bambini da 0 a 11 anni. Per un festeggiato più grande chiedete al locale." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "altamura",
    citta: "Altamura",
    aggiornata: "2026-11-11",
    rispostaBreve: "Ad Altamura la festa di compleanno per bambini si fa all'Agorateca, la biblioteca di comunità di via Stefano Lorusso, tra letture ad alta voce e laboratori creativi, oppure alla Favola, in via Monte Rosa, che è ludoteca, parco giochi e sala per compleanni. All'Agorateca le feste si tengono soprattutto nel fine settimana: prenotate con qualche settimana di anticipo.",
    intro: "Ad Altamura si può scegliere tra una festa con libri e laboratori e una festa in ludoteca con giochi e spazio per correre. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Agorateca", zona: "Altamura, via Stefano Lorusso", tipo: "biblioteca di comunità con laboratori e feste di compleanno", descrizione: "La biblioteca di comunità di Altamura offre per i compleanni uno spazio interno ed esterno dove passare il pomeriggio tra letture ad alta voce e laboratori creativi. Gli allestimenti usano materiali naturali e sostenibili, con festoni, stoviglie e inviti su carta riciclata, e ai genitori si chiede il tema preferito del festeggiato. Torta e merenda le preparano le famiglie.", instagram: "https://www.instagram.com/agoratecaaltamura/" },
      { nome: "La Favola", zona: "Altamura, via Monte Rosa", tipo: "ludoteca con parco giochi e sala feste", descrizione: "Si presenta come ludoteca, parco giochi e sala per le feste di compleanno, e ogni estate organizza anche un campo estivo per bambini. Spazi e formule della festa si concordano direttamente con la struttura." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno ad Altamura?", risposta: "L'Agorateca ha uno spazio interno, oltre a quello esterno, dove fare letture e laboratori anche nei mesi freddi. Anche La Favola è una ludoteca: chiedete quali spazi sono al chiuso quando prenotate." },
      { domanda: "Posso portare la torta?", risposta: "All'Agorateca sì: torta e merenda le preparano i genitori. Per La Favola le fonti non lo dicono: chiedetelo quando prenotate." },
      { domanda: "Che festa scegliere per un bambino che ama libri e lavoretti?", risposta: "L'Agorateca è pensata proprio per questo: letture ad alta voce, laboratori creativi e un allestimento sul tema scelto dal festeggiato." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "aprilia",
    citta: "Aprilia",
    aggiornata: "2026-11-12",
    rispostaBreve: "Ad Aprilia la festa di compleanno per bambini si fa spesso al coperto: CandyLand, in via Mozart, è un parco giochi al chiuso con una sala feste in esclusiva e feste a tema, mentre Youngo, nel centro commerciale Aprilia2, ha un'area gioco con scivoli e percorsi e sale dedicate ai compleanni. Prenotate con qualche settimana di anticipo, soprattutto per il sabato e la domenica.",
    intro: "Ad Aprilia le feste per bambini si fanno soprattutto nei parchi giochi al chiuso, comodi in ogni stagione. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "CandyLand By Sbirulina", zona: "Aprilia, via Mozart", tipo: "parco giochi al coperto con sala feste", descrizione: "Un parco giochi al chiuso con attrazioni a tema dolci, che si presenta come «il posto più bello dove essere bambini». Per i compleanni c'è una sala feste in esclusiva e si possono organizzare feste a tema.", instagram: "https://www.instagram.com/candylandfeste_aprilia/" },
      { nome: "Youngo Aprilia2", zona: "Aprilia, centro commerciale Aprilia2, sulla Pontina", tipo: "parco giochi al coperto con sale compleanni", descrizione: "Dentro il centro commerciale Aprilia2, con un'area gioco con scivoli, tunnel, palline e percorsi avventura e, nel nuovo spazio annunciato a luglio 2026, giochi arcade e sfide interattive. Le sale per compleanni ed eventi sono ampie, colorate e personalizzabili: la festa prevede uno spazio riservato, l'accesso alle attrazioni e l'assistenza dello staff." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno ad Aprilia?", risposta: "Sì, tutti e due: CandyLand è un parco giochi al chiuso con sala feste in esclusiva, e Youngo è dentro il centro commerciale Aprilia2, con sale dedicate ai compleanni." },
      { domanda: "Cosa comprende la festa da Youngo?", risposta: "Secondo il locale ci sono uno spazio festa riservato, l'accesso alle attrazioni e l'assistenza dello staff. Prezzi e dettagli del pacchetto si chiedono quando si prenota." },
      { domanda: "Posso portare la torta?", risposta: "Le fonti non lo dicono: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "vigevano",
    citta: "Vigevano",
    aggiornata: "2026-11-12",
    rispostaBreve: "A Vigevano la festa di compleanno per bambini si fa al Parco Giochi Arlecchino, un parco giochi coperto e riscaldato con gonfiabili, mini go kart e sale a tema, oppure al Leopark, una pizzeria con un parco giochi indoor di 300 metri quadri dove si organizzano compleanni su misura. Sono tutti e due al chiuso: prenotate con qualche settimana di anticipo per il sabato e la domenica.",
    intro: "A Vigevano le feste dei bambini si fanno al coperto: in un parco giochi con gonfiabili o in pizzeria, con l'area giochi a vista. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Parco Giochi Arlecchino", zona: "Vigevano, via Santa Maria", tipo: "parco giochi al coperto con sale feste", descrizione: "Una struttura coperta, riscaldata e climatizzata con percorsi, piscine di palline, reti elastiche, scivoli e castelli gonfiabili, una pista di mini go kart e un'area tutta per i bimbi fino a tre anni. Organizza feste di compleanno ed eventi, con servizio bar e sale a tema per festeggiare.", instagram: "https://www.instagram.com/parcogiochiarlecchino_vigevano/" },
      { nome: "Leopark", zona: "Vigevano, viale Leopardi", tipo: "pizzeria con gonfiabili e sala feste", descrizione: "Ristorante, pizzeria e bar con un parco giochi di 300 metri quadri, gratuito per chi mangia, con gonfiabili e tappeti elastici, per bambini fino a 12 anni. I genitori guardano i figli dalle grandi finestre della sala e nell'area giochi c'è sempre qualcuno dello staff. Si organizzano compleanni e feste su misura, in sala o nell'area giochi." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Vigevano?", risposta: "Sì, tutti e due: il Parco Giochi Arlecchino è coperto e riscaldato, e il Leopark ha un parco giochi indoor accanto alla sala." },
      { domanda: "Ci sono posti adatti anche ai bambini molto piccoli?", risposta: "Il Parco Giochi Arlecchino ha un'area per i bimbi fino a tre anni; il parco giochi del Leopark è pensato per bambini fino a 12 anni." },
      { domanda: "Posso portare la torta?", risposta: "Le fonti non lo dicono chiaramente: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "benevento",
    citta: "Benevento",
    aggiornata: "2026-11-13",
    rispostaBreve: "A Benevento la festa di compleanno per bambini si fa al coperto alla Ludoteca Un Due Tre Stella, in via Colonnette, pensata per i bambini fino a circa 7 anni; chi preferisce animali e laboratori può scegliere la Fattoria La Cinta, una fattoria didattica alle porte della città. In tutti e due i casi conviene prenotare con qualche settimana di anticipo e chiedere subito cosa è incluso.",
    intro: "A Benevento le feste per bambini si fanno in ludoteca, ma alle porte della città c'è anche una fattoria didattica che accoglie famiglie e gruppi. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Ludoteca Un Due Tre Stella", zona: "Benevento, via Colonnette, in centro", tipo: "ludoteca con feste di compleanno", descrizione: "Una ludoteca nel centro di Benevento, aperta nel 2024 e pensata per bambini fino a circa 7 anni. Organizza feste di compleanno, che si prenotano su WhatsApp, e durante l'anno propone laboratori creativi, baby dance e yoga per bambini." },
      { nome: "Fattoria La Cinta", zona: "Benevento, in campagna alle porte della città", tipo: "fattoria didattica con spazio per feste", descrizione: "Una fattoria didattica con asini, pecore, capre, un cavallo e un antico mulino in pietra, che si propone anche per le feste. I bambini possono fare laboratori pratici, come il pane o il formaggio, e poi mangiare con i prodotti dell'azienda. Si prenota con il modulo sul sito." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Benevento?", risposta: "Sì: la Ludoteca Un Due Tre Stella è uno spazio al chiuso pensato per i più piccoli. Alla Fattoria La Cinta molte attività si fanno all'aperto: d'inverno chiedete quali si possono fare al coperto." },
      { domanda: "Per che età vanno bene?", risposta: "La ludoteca si rivolge ai bambini fino a circa 7 anni; i laboratori in fattoria piacciono anche ai più grandi. Quando prenotate, dite l'età dei bambini." },
      { domanda: "Posso portare la torta?", risposta: "Le fonti non lo dicono: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "fiumicino",
    citta: "Fiumicino",
    aggiornata: "2026-11-14",
    rispostaBreve: "A Fiumicino la festa di compleanno per bambini si fa in campagna, all'agriturismo Casale Traiano lungo via Portuense, oppure al coperto in una pizzeria con area giochi interna come Buffalo Kids 2.0, in via Valderòa. Nella bella stagione c'è anche il Parco Avventura nella pineta di Fregene, con le feste divise per altezza dei bambini.",
    intro: "Nel comune di Fiumicino le feste per bambini si dividono tra la campagna dell'entroterra, le sale al chiuso in città e la pineta di Fregene. Qui trovate un agriturismo con gli animali, una pizzeria con gonfiabile e campetto e un parco avventura all'aperto.",
    locali: [
      { nome: "Casale Traiano", zona: "Fiumicino, lungo via Portuense", tipo: "agriturismo biologico in campagna, con animali e feste di compleanno", descrizione: "Un agriturismo biologico nella campagna di Fiumicino, con una pagina dedicata alle feste di compleanno per tutte le età: natura, animali, giochi e cucina con ingredienti biologici e locali. I bambini possono visitare la fattoria e avvicinare gli animali; menu, allestimenti e attività si personalizzano." },
      { nome: "Buffalo Kids 2.0", zona: "Fiumicino, via Valderòa", tipo: "pizzeria e braceria con gonfiabile, campetto e playground interni", descrizione: "Un ristorante, braceria e pizzeria con uno spazio giochi interno: un gonfiabile, un campetto da calcetto e un playground con le palline. Le feste di compleanno si fanno il pomeriggio con lo spazio giochi riservato, scegliendo tra tre tipi di catering oppure il solo affitto della sala." },
      { nome: "Parco Avventura Fregene", zona: "Fregene, frazione di Fiumicino, nella pineta di via della Veneziana", tipo: "centro sportivo all'aperto: parco avventura nella pineta con feste di compleanno", descrizione: "Un parco avventura nella pineta di Fregene, con percorsi sugli alberi e attività all'aperto. Ha una sezione dedicata alle feste di compleanno, con preventivo su richiesta: i partecipanti sono divisi per altezza (Baby sotto i 115 cm, Junior fino a 139 cm) e la festa si concorda con la reception." },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Fiumicino?", risposta: "Sì: Buffalo Kids 2.0 ha uno spazio giochi interno con gonfiabile, campetto e playground, riservato alla festa il pomeriggio. Il Parco Avventura di Fregene invece è all'aperto: va bene nella bella stagione." },
      { domanda: "Per che età vanno bene?", risposta: "Al Parco Avventura di Fregene i percorsi dipendono dall'altezza: Baby sotto i 115 cm, Junior da 115 a 139 cm. Casale Traiano propone feste per tutte le età. Per Buffalo Kids 2.0 dite l'età dei bambini quando prenotate." },
      { domanda: "Posso portare la torta?", risposta: "Al Parco Avventura di Fregene chi festeggia con le loro formule può lasciare la torta nei frigoriferi del parco, se c'è posto. Per Casale Traiano e Buffalo Kids 2.0 le fonti non lo dicono: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
];

export function cittaFeste(slug: string): CittaFeste | undefined {
  return CITTA_FESTE.find((c) => c.slug === slug);
}
