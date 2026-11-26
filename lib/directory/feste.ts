// Le pagine locali "Festa di compleanno per bambini a [città]" (/feste).
// Ogni città = una voce qui: pagina, sitemap e llms.txt si aggiornano da soli.
//
// REGOLE (valgono per ogni città nuova):
// - solo locali REALI trovati con la ricerca web, mai inventati;
// - link esterni solo ai siti ufficiali trovati davvero (rel nofollow);
// - descrizioni fedeli a ciò che le fonti dicono, senza promesse nostre;
// - niente personaggi protetti da copyright nelle NOSTRE descrizioni;
// - il reel Instagram si aggiunge solo con l'URL vero del post (campo reel).
// - un posto che NON risulta fare feste (parco acquatico, parco avventura senza
//   pacchetti compleanno) si inserisce con `festa: false`: entra nella directory,
//   non nella pagina delle feste. Mai scrivere «organizza feste» senza una fonte.
//
// Città già provate e SCARTATE (meno di 2 locali solidi con segnali recenti):
// non ritentarle prima di qualche mese. Pescara, Sassari, Barletta, Pistoia,
// Terni, Matera, L'Aquila, Potenza, Marsala, Faenza, Legnano, Avellino
// (entro il 13/11/2026); Cinisello Balsamo, Torre del Greco, Olbia (14/11/2026);
// Giugliano in Campania (15/11/2026); Andria (un solo locale, scheda senza data)
// e Pesaro (solido solo Fantasilandia a Montelabbate; Enjoy Park e Baboom senza
// segnali recenti) il 16/11/2026.
// Alessandria (17/11/2026): Giocherellando Park e Giocolandia non hanno un sito
// ufficiale, solo recensioni e una pagina Facebook. Da verificare prima di
// usarlo: Il Bosco Sospeso, parco avventura a Cenadi (CZ), con pagina feste ma
// eventi fermi al 2018.
// Brindisi (18/11/2026): solo Gommalandia Park (pagina Facebook, niente sito);
// gli altri nomi vengono da un elenco con numeri di telefono finti.
// Guidonia Montecelio (19/11/2026): solido solo Jungle Park (Collefiorito);
// Atlantic Park ha solo la pagina Facebook e il sito indicato è di un'altra
// struttura. Attenzione: «Il Borgo dei Piccoli» esce nelle ricerche di molte
// città ma è a Bologna.
// Il 20/11/2026: Gela, Lamezia Terme, Massa e Trani (nessun locale con un sito
// suo); Quartu Sant'Elena (solido solo Freedom Party, salafestequartu.it;
// Festalandia ha schede vecchie di anni); Viareggio (solo il parco Bim Bum Bam
// a Torre del Lago, all'aperto e senza sito trovato); Cuneo (in città solo sale
// di oratori e circoli: i parchi al coperto col sito, Michiland e Jump Jump,
// sono a Genola e a Roccabruna).
// Il 21/11/2026: Fano, Crotone e Teramo (solo schede di elenchi o blog vecchi di
// anni); Carrara e Molfetta (nomi senza una sede confermata in città); Mantova
// (col sito c'è solo il Bowling, a Borgo Virgilio); Moncalieri (Casa Zoe senza
// sito suo; PlayZone è a La Loggia); Siena (Children's House, via Mentana, ha
// il sito ma pagine ferme al 2018-2019; il parco Nemo col sito aggiornato è a
// Barberino Tavarnelle, in provincia di Firenze).
// Il 22/11/2026: Rho (solo una pagina di recensioni su una ludoteca in un centro
// commerciale); Foligno (solida solo Sala Foligno, via Roma, che affitta le
// sale; la ludoteca Neverland è a Trevi e ha pagine di due anni fa). A Gallarate
// «La Baia dei Pirati» ha ancora il sito, ma una scheda la dà chiusa: non inserita.
// Gallarate NON ha una pagina sua: La Tana di Ninì (viale Milano) è già nella
// pagina di Busto Arsizio, e la Ludoteca Wonderland (via Piceni) è stata aggiunta
// lì il 22/11/2026. Per aprire Gallarate serve un altro locale solido, non questi.
// Il 23/11/2026: Vittoria e Caltanissetta (nessun locale con un sito suo: solo
// Facebook, Instagram o schede di elenchi; bowling e fattorie della zona sono a
// San Cataldo e a Mazzarino); Afragola (col sito c'è solo Afragola Park, statale
// Sannitica); Castellammare di Stabia (due locali col sito e con le feste,
// L'Acchiappasogni in traversa Pozzillo e Nuvoletta Bianca in via Plinio il
// Vecchio, ma nessun segnale recente: sul primo l'ultimo avviso datato è del
// 2020/21, il secondo ha pagine di negozio di prova).
// Il 25/11/2026: Velletri, Anzio, Marano di Napoli, Sanremo e Bisceglie (solo
// Facebook, elenchi o locali di altri comuni); Cerignola, Modica e Agrigento
// (siti senza un anno 2025/2026); Bitonto e Civitavecchia (un solo locale
// solido: Galleria Devanna, Aquafelix). Tivoli e Chieti NON aperte: solidi solo
// musei e siti archeologici (Villa Adriana, Santuario di Ercole Vincitore;
// Museo Universitario, La Civitella), nessuna sala feste: la pagina feste
// resterebbe vuota. Junior Village (Tivoli) ha il sito ma nessun segnale recente.
// Il 26/11/2026: Scandicci, Bagheria, Battipaglia, Acerra, Nettuno (nessun
// locale per feste con un sito suo); Portici, Cava de' Tirreni, Montesilvano,
// Manfredonia, Ladispoli (siti senza segnali 2025/2026 o solo social); San
// Severo (cinque locali, nessuno col sito). Ercolano: solido solo La Fabbrica
// del Divertimento (via Madonnelle); Valle del Vesuvio fa feste ma senza date
// recenti: riprovare quando pubblica un evento con l'anno.
// COME SI VERIFICA: i siti dei locali NON si aprono dalle sessioni (la rete
// ammette solo un elenco di siti). Si leggono con la ricerca web limitata al
// dominio ufficiale del locale (allowed_domains): è il metodo usato dall'inizio.
// Non chiedere a un aiutante di «aprire le pagine»: fallisce e sembra un blocco.
// Prima di aggiungere un locale, cercarne il nome in questo file: lo stesso posto
// sotto due città crea due schede uguali.

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
  /**
   * `false` = dalle fonti NON risulta che organizzi feste di compleanno
   * (parchi acquatici, molti parchi avventura): la scheda sta nella directory
   * ma non nella pagina «Feste a [città]», e la scheda non dice «fa feste».
   */
  festa?: false;
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
    aggiornata: "2026-11-24",
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
          "Ludoteca e spazio per eventi in via Bistolfi 49 a Milano, legata alla scuola bilingue Il Nano Gigante di via Pitteri. È un ampio open space al chiuso con un grande playground, gonfiabili, giochi interattivi a pavimento e labirinti, dove i bambini passano pomeriggi di gioco e movimento. Organizza feste di compleanno ed eventi: pacchetti, orari ed età vanno chiesti direttamente alla ludoteca.",
        sito: "https://www.ilnanogigante.it/la-ludoteca",
      },
      {
        nome: "Kikolle Lab",
        zona: "zona Solari",
        tipo: "ludoteca creativa",
        descrizione:
          "Laboratori e feste per bambini da 0 a 10 anni in due sedi a Milano: via Cesare da Sesto, zona Navigli-Porta Genova, e via Fratelli Bronzetti. Oltre ai laboratori di arte, movimento, cucina, lingue e STEM, organizza compleanni con animatrici e allestimenti a tema. In via Cesare da Sesto c'è una Play Room di 110 mq per 40-45 persone; in via Bronzetti una Party Room di 70 mq con soppalco per i genitori, una Play Room di 120 mq o tutta la sede, 200 mq per 75 persone. Le feste si fanno anche a casa o all'aperto.",
        sito: "https://www.kikollelab.com/",
      },
      {
        nome: "Festavventura",
        zona: "Stazione Centrale",
        tipo: "sala feste con animazione",
        descrizione:
          "Spazio feste di 220 mq in via Zuretti, vicino alla Stazione Centrale di Milano, sempre in esclusiva. Ha due sale: un living con cucina, per la merenda e per i genitori, e una sala scenografata a giungla o veliero dei pirati, dove gli anim-attori fanno vivere un'avventura ai bambini dai 4 ai 10 anni. Ci sono anche feste baby da 1 a 3 anni e feste disco con DJ. La festa dura 2 ore e mezza; i pacchetti vanno dal solo affitto con pulizie a quelli con animazione, buffet e aperitivo per gli adulti. La torta è un piccolo extra.",
        sito: "https://festavventura.com/",
      },
      {
        nome: "MiniMeG Ludoteca",
        zona: "Sempione",
        tipo: "ludoteca",
        descrizione:
          "Ludoteca e spazio feste di 250 mq in via Andrea Mantegna, zona Sempione a Milano, gestita da Il Mondo di MeG, che fa animazione per bambini. Ci sono un'area gioco con playground e tre sale. Per i compleanni ci sono pacchetti da 4 ore: la sala celeste fino a 15 bambini, sala celeste e sala specchio fino a 35, oppure tutta la location in esclusiva con playground, sempre con salottino per i genitori e bar a consumazione. Le sale si affittano con o senza animazione; su richiesta allestimento, catering e regali di fine festa.",
        sito: "https://www.ilmondodimeg.it/ludoteca/",
      },
      {
        nome: "Effetto Magia",
        zona: "via Morosini",
        tipo: "sala feste con ludoteca",
        descrizione:
          "Sala feste in via Morosini 32, a Milano, con una sala di 165 mq e una ludoteca interna di oltre 50 mq con playground. Organizza feste di compleanno a tema con allestimenti personalizzati, animazione, baby dance, trucca bimbi, noleggio gonfiabili e catering su richiesta. La sala si può anche noleggiare per una festa propria. Propone pacchetti infrasettimanali da 2 ore, fino a 20 bambini, con sala, playground e allestimento, senza cibo. Ci sono anche serate Kiss & Go per bambini e feste disco per ragazzi.",
        sito: "https://www.effettomagia.it/",
      },
      {
        nome: "Mini Club Scooby",
        zona: "Ripamonti",
        tipo: "area giochi attrezzata",
        descrizione:
          "Asilo nido in zona Ripamonti, in via Erice, che affitta i suoi spazi per le feste dei bambini da 1 a 6 anni. Ci sono 200 mq di area gioco attrezzata, un porticato coperto e il giardino per giocare fuori nella bella stagione, più un'area buffet per il rinfresco. Lo staff può organizzare giochi di gruppo, caccia al tesoro e laboratori creativi; decorazioni e palloncini si personalizzano. Gli spazi sono aperti per eventi privati nei weekend e nei giorni festivi, anche per battesimi e comunioni, con preventivo su misura.",
        sito: "https://asilominiclubscoobymilano.it",
      },
      {
        nome: "Spazio Rev",
        zona: "zona sud",
        tipo: "sala in affitto",
        descrizione:
          "Location per feste di bambini a Milano sud, vicino alla Fondazione Prada. Lo spazio si affitta per organizzare la festa da soli; su richiesta il team aggiunge il catering, dagli snack salati alla torta personalizzata, l'allestimento a tema con palloncini e tavoli decorati e l'animazione con mago, truccabimbi e giochi. Le fasce orarie della festa sono la mattina (10–14) e il pomeriggio (15–19), o un altro orario da concordare. Si prenota col modulo sul sito indicando data, età del festeggiato e numero di invitati.",
        sito: "https://www.spaziorev.com/spazio-bambini-milano/",
      },
      {
        nome: "Tuttotondo",
        zona: "zona Fiera, via Biancardi",
        tipo: "ludoteca",
        descrizione:
          "Spazio per bambini di 160 mq in via Biancardi, in zona Fiera a Milano, gestito da un'associazione. Ha un angolo morbido con grandi cuscini per i più piccoli, un playground per arrampicarsi e scivolare, libri, ceste di giochi e divani per i genitori. Per i compleanni lo spazio è in uso esclusivo: si aggiunge solo l'assistenza ai bambini (trucchi, palloncini) oppure il pacchetto con animazione, allestimento a tema e buffet. È pensato per feste fino a 6 anni; per i più grandi si chiede per email, e l'animazione va prenotata 15 giorni prima.",
        sito: "https://www.tuttotondo.org/",
      },
      { nome: "Tree Experience Milano Corvetto", zona: "Milano, parco Cassinis (M3 Porto di Mare)", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura nel parco Cassinis, in via Fabio Massimo a Milano, zona Corvetto, vicino alla fermata Porto di Mare della M3. Ha 7 percorsi tra ponti tibetani, liane, reti e carrucole, più la Net Experience e un salto nel vuoto dai 10 anni. Il percorso Kaa è per i bambini dai 3 anni (90 cm al polso col braccio alzato). Non serve prenotare, salvo i gruppi oltre 10; sui percorsi i ragazzi vanno da soli, ma al parco serve un adulto. È aperto tutto l'anno per gruppi, scuole e compleanni.", sito: "https://treeexperience.it/parco-avventura-milano/", },
      { nome: "Acquatica Park", zona: "Milano, Quinto Romano (via Airaghi)", tipo: "parco acquatico", descrizione: "Parco acquatico in via Gaetano Airaghi 61, a Quinto Romano; in auto si esce dalla Tangenziale Ovest a San Siro / Fiera Milano. Nel 2026 è aperto dal 30 maggio al 6 settembre, tutti i giorni dalle 10 alle 19. Per i piccoli ci sono Baby Lagoon, Spray Park e gli scivoli Rainbow, con acqua bassa; per i grandi fiume lento, Crazy River e scivoli. Nel 2026 sotto i 100 cm si entra gratis, da 100 a 140 cm c'è il ridotto. Il pranzo si può portare da casa e c'è il parcheggio. Organizza anche compleanni.", sito: "https://www.acquaticapark.it/", },
      { nome: "MUBA - Museo dei Bambini Milano", zona: "Milano, Rotonda della Besana (via Enrico Besana 12)", tipo: "museo per bambini", descrizione: "Museo dei bambini alla Rotonda della Besana, in via Enrico Besana 12, con mostre-gioco, installazioni interattive, laboratori ed eventi per tutto l'anno, nei feriali e nel weekend. Nell'autunno 2026 propone, tra le altre cose, la mostra-gioco «Connessioni» (3-8 anni) e l'attività guidata «La camera delle meraviglie» (6-11 anni), con turni il sabato e la domenica fino al 29 novembre 2026. Le attività hanno ingressi a orario e posti limitati: si prenota online sul sito del museo, non per telefono o email. Le FAQ del museo dicono che il MUBA non organizza feste di compleanno.", sito: "https://muba.it/", festa: false },
      { nome: "Cascina Battivacco", zona: "Milano, Barona (via Barona 111)", tipo: "fattoria didattica", descrizione: "Cascina agricola dentro la città, in via Barona 111, fattoria didattica accreditata da Regione Lombardia dal 2008. Propone attività diverse in base all'età, da quelle di gioco e scoperta a quelle più formative, con laboratori sensoriali pensati per i più piccoli. D'estate organizza gli «Agri Campus» per bambini dai 4 ai 10 anni: nel 2026 le settimane andavano da metà giugno a metà settembre. Il sito non parla di feste di compleanno.", sito: "https://cascinabattivacco.it/", festa: false },
      { nome: "ADI Design Museum", zona: "Milano, Porta Volta (piazza Compasso d'Oro 1)", tipo: "museo con laboratori per bambini", descrizione: "Museo del design in piazza Compasso d'Oro 1, zona Porta Volta. Con il Junior Design Lab propone laboratori per bambini e ragazzi (il sito indica fasce 3-5 e 6-13 anni); nel weekend le attività sono per le famiglie: i bambini scoprono il rapporto tra uso, forma e funzione, usano il disegno per progettare, costruiscono un piccolo prototipo e lavorano in squadra. Prenotazione obbligatoria. Il sito descrive anche un laboratorio di compleanno di 90 minuti, con visita e laboratorio o solo laboratorio, su temi come «Un robot per ogni occasione» e «Missione Futuro»: la pagina non è datata, quindi conviene chiedere al museo se è attivo.", sito: "https://www.adidesignmuseum.org/" },
      { nome: "Museo Nazionale Scienza e Tecnologia Leonardo da Vinci", zona: "Milano, Sant'Ambrogio (via San Vittore 21)", tipo: "museo della scienza", descrizione: "Museo della scienza e della tecnologia in via San Vittore 21, vicino a Sant'Ambrogio, con laboratori interattivi per bambini e ragazzi. Il Playlab è un'area per bambini dai 3 ai 6 anni, che giocano, inventano e raccontano storie; gli iLAB Leonardo fanno provare il metodo di Leonardo (per esempio «Le macchine di Leonardo», dai 9 anni, un'ora) e gli iLAB Digital STEAM sono per ragazzi dagli 11 ai 13 anni. Dal 15 settembre 2026 è aperto dal martedì al venerdì 9.30-17 e nel weekend 9.30-18.30. Il «Compleanno al Museo» risulta sospeso fino a maggio 2027.", sito: "https://www.museoscienza.org/", festa: false },
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
    aggiornata: "2026-11-24",
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
          "Gelateria artigianale in via Giuseppe Bagnera 59, nel quartiere Portuense, guidata dalla gelatiera Simona Papagno. Fa gelato naturale anche senza lattosio e senza glutine, prodotti keto e proposte vegane. Per le feste di compleanno la sala, piccola e raccolta, è riservata solo agli invitati; il sito presenta anche corsi per bambini e progetti per le scuole. È aperta dal martedì alla domenica, chiusa il lunedì: per la festa si chiama il numero indicato sul sito.",
        sito: "https://www.criollogelato.it/",
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
          "Ludoteca in zona Portuense, in via Amedeo Avogadro. Per le feste di compleanno mette a disposizione una grande sala per la merenda e i rinfreschi, giochi in scatola per ogni età e lo staff che organizza attività adatte all'età dei bambini. Le formule vanno dalla festa base di due ore, con giochi di movimento e musicali e sculture di palloncini, alla festa magica con spettacolo di magia, alla festa a tema e alla festa calcetto con arbitro. A richiesta trucca bimbi, dj, allestimenti, foto e zucchero filato. I prezzi si concordano col posto.",
        sito: "https://www.didibimbi.it",
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
          "Ludoteca della scuola Nella Vecchia Fattoria, in via del Casale della Crescenza, a Roma Nord, nel Parco di Veio. Nel weekend ospita feste di compleanno, battesimi e comunioni, per tutta la giornata o in due fasce: 10–14 col brunch o 15–19 per la festa del pomeriggio. Tavoli, sedie e ombrelloni ci sono già, e un cameriere aiuta col buffet e fa le pulizie finali; il buffet si porta da sé o lo preparano loro. L'animazione è obbligatoria: si porta la propria o la consigliano loro. C'è un ampio parco con boschetto ombreggiato e parcheggio interno.",
        sito: "https://www.asilodueponti.com/attivita-extra/feste-per-bambini-roma-nord/",
      },
      {
        nome: "Carosel Park",
        zona: "Cinecittà Est",
        tipo: "parco giochi al chiuso",
        descrizione:
          "Parco divertimenti per bambini in viale Rizzieri, nel quartiere Tuscolana-Cinecittà. All'aperto ci sono giostre: la giostra classica, i seggiolini volanti, il trenino, l'autoscontro, i baby cart e i giochi a premi. Dentro c'è una sala ludica riscaldata di circa 350 mq con scivoli gonfiabili, tappeti elastici, vasche di palline, casette e una struttura di gioco per i bambini dai 3 agli 8 anni. Per le feste di compleanno si affittano le sale con un'area per il buffet o il catering; le mascotte si chiedono a parte.",
        sito: "https://www.parcogiochicinecittaest.com/",
      },
      {
        nome: "Candy Park",
        zona: "Roma",
        tipo: "parco giochi al chiuso",
        descrizione:
          "Parco giochi al coperto in via Silicella 4/6, a Torre Maura, a Roma, per famiglie con bambini da 0 a 9 anni. Ci sono una sala giochi con playground e una sala buffet, in un ambiente climatizzato con ristorazione anche per gli adulti. Organizza compleanni, feste di fine anno scolastico, battesimi e cerimonie. Tra i servizi in più ci sono zucchero filato, regalini di fine festa, allestimenti personalizzati e l'ostia stampata per la torta. Listini e offerte, anche serali, sono sul sito.",
        sito: "https://www.candypark.net/",
      },
      { nome: "EurPark Energy & Adventure", zona: "Roma, EUR (piazza Pakistan)", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura dentro Roma, all'EUR. Nell'area Adventure ci sono i percorsi acrobatici sugli alberi, una parete di arrampicata a quattro facce e il tiro con l'arco; nell'area Energy i giochi di squadra, come il laser tag e il calcio balilla umano. Le guide parlano di sei percorsi di difficoltà diversa, con gli istruttori che seguono i bambini. Organizza feste di compleanno per bambini e centri estivi: orari e prenotazioni sono sul sito del parco.", sito: "https://www.eurpark.it/" },
      { nome: "Hydromania", zona: "Roma ovest, vicolo del Casale Lumbroso", tipo: "parco acquatico", descrizione: "Parco acquatico dentro Roma, aperto d'estate: nel 2026 la stagione è andata dal 30 maggio al 6 settembre. Per i più piccoli c'è una zona con tre piscine con giochi, scivoli e rocce con cascate, e un miniclub dove i bambini giocano seguiti dagli animatori. Date, orari e prezzi cambiano ogni anno: si controllano sul sito del parco.", sito: "https://www.hydromania.it/", festa: false },
      { nome: "Aquafelix", zona: "Civitavecchia, sul litorale a nord di Roma", tipo: "parco acquatico", descrizione: "Parco acquatico a Civitavecchia, aperto d'estate: per il 2026 le guide indicano l'apertura tutti i giorni da metà giugno a metà settembre, dalle 10 alle 18:30. Per i bambini c'è un'area dedicata, in parte recintata, con scivoli piccoli, giochi d'acqua, cascate e una piscina bassa, e durante la giornata c'è l'animazione. Orari e regole d'ingresso si controllano sul sito ufficiale.", sito: "https://www.aquafelix.it/", festa: false },
      { nome: "MagicSplash", zona: "Valmontone, a sud-est di Roma, accanto a MagicLand", tipo: "parco acquatico", descrizione: "Il parco acquatico a tema caraibico di MagicLand, a Valmontone: circa 40.000 m² aperti d'estate, con la stagione 2026 inaugurata il 30 maggio. Per i più piccoli ci sono Laguna Tiburon, un'area di giochi d'acqua e spruzzi con il fondo gommato, e Cala Tortuga, con quattro scivoli in miniatura. Nel 2026 sono arrivati anche quattro scivoli nuovi per i più grandi. Calendario e orari si controllano sul sito del parco.", sito: "https://magicland.it/", festa: false },
      { nome: "Explora - Il Museo dei Bambini di Roma", zona: "Roma, Flaminio (via Flaminia 82)", tipo: "museo per bambini", descrizione: "Museo dei bambini in via Flaminia 82, zona Flaminio, per bambini da 0 a 11 anni (fino alla quinta primaria), con attività, eventi e laboratori; dentro c'è il bistrot VIVI-ORA con un menù per bambini. Organizza feste di compleanno di un'ora e 45 minuti, dal martedì alla domenica in più turni, una versione «Superparty» con laboratorio e, per i 6-11 anni, il «Night party» del venerdì sera (in calendario dal 6 novembre al 4 dicembre 2026). Il museo ha aggiornato le tariffe dal 1° giugno 2026: il prezzo della festa va chiesto al momento della prenotazione.", sito: "https://mdbr.it/" },
      { nome: "Teatro Verde", zona: "Roma, Trastevere-Monteverde (Circonvallazione Gianicolense 10)", tipo: "teatro per bambini", descrizione: "Teatro per bambini e ragazzi in Circonvallazione Gianicolense 10, con spettacoli da ottobre a maggio: in settimana per le scuole, il sabato, la domenica e i festivi per le famiglie alle 17 (a volte con replica alle 15). Nel cartellone della stagione 2025/2026, la quarantunesima, ci sono titoli come «Alice, che meraviglia!», «Il Mago di Oz» e «Hansel & Gretel»; ci sono anche corsi di teatro. Per i compleanni propone più formule: «Tanti Auguri a Te» (4-10 anni, circa due ore: il festeggiato vede lo spettacolo con gli amici, fa da presentatore e spegne le candeline sul palco), «Gioca e Crea» (5-8 anni), «Un libro per amico» (3-6 anni) e «Sing-A-Long» (0-48 mesi, con i genitori). Dettagli e prezzi vanno confermati con il teatro.", sito: "https://www.teatroverde.it/" },
      { nome: "Casina di Raffaello", zona: "Roma, Villa Borghese (piazza di Siena)", tipo: "ludoteca", descrizione: "Ludoteca dentro Villa Borghese, con laboratori creativi e letture animate. Ogni sabato e domenica dal 3 ottobre al 29 novembre 2026 propone laboratori per famiglie con bambini dai 2 agli 11 anni; d'estate c'è il centro estivo «Viaggio d'Estate» (5-11 anni). Nella primavera 2026 i laboratori costavano 8 euro a bambino e le letture 3,50 euro. Organizza feste di compleanno per bambini dai 4 agli 11 anni, con un laboratorio creativo di circa un'ora e al massimo 25 partecipanti: data e attività si concordano via email con lo staff, la prenotazione si conferma al contact center 060608.", sito: "https://www.casinadiraffaello.it/" },
      { nome: "Teatro San Carlino", zona: "Roma, Pincio (viale dei Bambini)", tipo: "teatro di burattini", descrizione: "Teatro di burattini a Villa Borghese, in viale dei Bambini al Pincio, con spettacoli per bambini dai 3 ai 10 anni il pomeriggio e la domenica, più spettacoli per le scuole. Nella stagione 2026/2027 sono in cartellone «Pulcinella al servizio di Frankenstein» (dai 5 anni) e «Cenerentola» (dai 4 anni, dal 28 novembre al 19 dicembre 2026). Per i compleanni affitta la sala per feste private, con un'ora in teatro guidati dallo staff; la «Festa TOP» è un'esclusiva per un sabato mattina o un pomeriggio in settimana. Dettagli e prezzi vanno confermati con il teatro.", sito: "https://www.sancarlino.it/" },
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
    aggiornata: "2026-11-24",
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
          "Parco giochi e ludoteca in corso Italia 53 a Mugnano di Napoli, con aree divise per età. Per i più piccoli ci sono gonfiabili, giostre e una pista go-kart; per i ragazzi un playground con tappeto elastico e attività sportive. Organizza feste di compleanno e feste a tema con animazione: lo staff cura gli addobbi e si può scegliere un buffet con pizze e aperitivi. I genitori hanno un'area bar e caffetteria. Preventivi al telefono o con il modulo del sito.",
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
      { nome: "AcquaFlash", zona: "Licola (Giugliano in Campania), sul litorale a nord di Napoli", tipo: "parco acquatico", descrizione: "Parco acquatico a Giugliano in Campania, nella zona di Licola, con piscine per ogni esigenza, dalla piscina idromassaggio a quella con le onde, e scivoli compresi nel biglietto. Lettini e ombrelloni sono inclusi fino a esaurimento; ci sono spogliatoi, docce, un'area food e un parcheggio custodito. In piscina la cuffia è obbligatoria e non si porta cibo da fuori, salvo quello per neonati o per allergie. Apre d'estate tutti i giorni: date, prezzi e promo per famiglie sono sul sito del parco.", sito: "https://acquaflashpark.it", festa: false },
      { nome: "Città della Scienza", zona: "Napoli, Bagnoli (via Coroglio)", tipo: "museo della scienza", descrizione: "Science centre a Bagnoli, in via Coroglio, con il museo interattivo Corporea e il Planetario, che ha spettacoli anche per i più piccoli. Nei weekend organizza laboratori per fasce d'età 3-6, 7-10 e 10-13 anni (nel 2026, per esempio, il weekend sullo spazio dell'11-12 aprile e la caccia alle uova scientifica di Pasquetta) e d'estate campi per bambini di 5-11 anni. Per i compleanni c'è lo «Science Party», per bambini dai 6 ai 12 anni: visita a Corporea, spettacolo al Planetario di circa 20 minuti e animatori. Il prezzo pubblicato non riporta l'anno: va chiesto.", sito: "https://www.cittadellascienza.it/" },
      { nome: "Teatro dei Piccoli - Le Nuvole", zona: "Napoli, Fuorigrotta (Mostra d'Oltremare, viale Usodimare)", tipo: "teatro per bambini", descrizione: "Teatro per l'infanzia dentro la Mostra d'Oltremare, gestito da Le Nuvole - Casa del Contemporaneo, con stagioni per famiglie e scuole; l'ingresso pedonale è da viale Usodimare. In pineta propone una rassegna all'aperto con laboratori scientifici, tenuti dagli animatori de Le Nuvole un'ora prima dello spettacolo e compresi nel biglietto. A maggio 2026 ha ospitato la rassegna «Maggio all'Infanzia», con biglietto a 3 € e prenotazione obbligatoria. Il sito non parla di feste di compleanno.", sito: "https://www.lenuvole.it/", festa: false },
      { nome: "Edenlandia", zona: "Napoli, Fuorigrotta (viale Kennedy 76)", tipo: "parco divertimenti", descrizione: "Parco divertimenti di Fuorigrotta, in viale Kennedy 76, aperto nel 1965, con più di 20 attrazioni soprattutto per i bambini piccoli e le famiglie: autoscontro per piccoli, tazze, mini avion, il Castello di Lord Sheidon, la giostra a cavalli e il trenino. Durante l'anno ospita eventi a tema: nel 2026 il gioco-festival «Wonka incontra il Cappellaio» (3-26 aprile) e l'Oktober Festival di settembre, con un'«Area Baby» con animazione e laboratorio. Il sito non parla di feste di compleanno.", sito: "https://www.edenlandia.it/", festa: false },
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
    aggiornata: "2026-11-24",
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
          "Ludoteca al coperto in via Puccini, a Nichelino, una delle quattro sedi di 1000 Salti. Ha scivoli gonfiabili giganti, playground con tunnel e percorsi morbidi, un'area baby 0–3 anni, calciobalilla e air hockey, per bambini fino a 11 anni. È aperta dal martedì alla domenica, dalle 16 alle 19.30, con ingresso a tempo illimitato e genitori gratis. Per le feste c'è una sala dedicata: il pacchetto comprende cibo, bibite, allestimento e pulizia finale; a parte si aggiungono una mascotte a tema e la torta personalizzata.",
        sito: "https://1000salti.it/nichelino/",
      },
      {
        nome: "Mela Spasso",
        zona: "Collegno",
        tipo: "sala giochi inclusiva",
        descrizione:
          "Sala giochi inclusiva a Collegno, in via Generale Perotti, senza barriere architettoniche: l'hanno aperta due amiche per far giocare insieme tutti i bambini. La sala si prende in uso esclusivo per feste di compleanno ed eventi privati, come battesimi, comunioni, baby shower e feste di classe. Per i compleanni ci sono menù semplici pensati per i più piccoli, mentre il catering per eventi e cerimonie si compone scegliendo le portate. Nel corso dell'anno propone laboratori e workshop tenuti da esperti.",
        sito: "https://melaspasso.it/",
      },
      {
        nome: "Kidsland",
        zona: "via Bardonecchia",
        tipo: "ludoteca",
        descrizione:
          "Ludoteca in via Bardonecchia 63, a Torino (metro Rivoli), con un salone per i giochi e uno per le feste, per bambini dai 3 mesi ai 9 anni. Le feste comprendono l'ingresso all'area giochi, gli inviti, una sala riservata al festeggiato, il catering dolce e salato con bevande e torta in diversi pacchetti, un animatore per tutta la festa e giochi di gruppo e balli. La domenica e il lunedì si può prenotare tutta la struttura in esclusiva. Organizza anche pigiama party, battesimi e baby shower.",
        sito: "https://www.kidsland.to.it/",
      },
      {
        nome: "CH4 Sporting Club",
        zona: "Torino",
        tipo: "centro sportivo con animazione",
        descrizione:
          "Centro sportivo in via Trofarello, a Torino, che organizza feste di compleanno con animazione per tutte le età. La festa dura due ore e mezza, con un animatore ogni 12 bambini, e si fa nel salone o nella palestrina (circa 50 persone) oppure nei gazebo all'aperto (circa 30). Ci sono feste sportive con un campo in più (pallavolo, basket, calcio a 5), feste a tema e, per chi ha dagli 11 anni, l'affitto del campo con spazio per la merenda. Le pulizie finali sono comprese; extra come truccabimbi e caccia al tesoro si aggiungono a parte.",
        sito: "https://ch4sportingclub.it",
      },
      {
        nome: "Baby Luna Park",
        zona: "Torino",
        tipo: "luna park al chiuso",
        descrizione:
          "Luna park per bambini al Parco del Valentino, in viale Ceppi 12, a Torino. Ci sono la giostra dei bimbi, il mini-autoscontro, il bruco-mela, i tappeti elastici, il playground, i gonfiabili e un piccolo ottovolante. Per i compleanni offre due ore sulle giostre e un'area riservata per il catering; su richiesta animazione, mascotte, trucca bimbi, spettacoli di bolle o di magia. Organizza anche feste di classe, baby shower e campi estivi, e durante l'anno eventi a tema. Le tariffe sono sul sito.",
        sito: "https://baby-lunapark.it/",
      },
      {
        nome: "K1 Speed",
        zona: "Beinasco",
        tipo: "kart per bambini",
        descrizione:
          "Pista di kart al coperto in strada Torino, a Beinasco, con zona giochi e realtà virtuale. Le feste per i bambini partono da un minimo di 6 partecipanti: ci sono pacchetti con gara di kart junior, podio e medaglie, e pacchetti senza pista con attività di realtà virtuale e ricarica per la sala giochi. Tutti comprendono un tavolo riservato e un menù con panino o hot dog, patatine e bibita. Per guidare i kart serve un'altezza minima di 125 cm; i prezzi cambiano tra feriali e weekend.",
        sito: "https://www.k1speed.com/it/torino/",
      },
      {
        nome: "+Spazio4",
        zona: "Torino",
        tipo: "salone per feste",
        descrizione:
          "Un salone al chiuso di oltre 200 mq: la scelta per le feste d'inverno coi gruppi numerosi.",
      },
      { nome: "Parco Avventura Tre Querce", zona: "Pino Torinese, sulla collina di Superga", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura nel Parco naturale della Collina di Superga, a Pino Torinese. Ha 9 percorsi con oltre 80 passaggi sospesi: i Baby sono per i bambini dai 3 ai 6 anni, gli altri sette sono percorsi aerei di altezza e difficoltà diverse. Organizza feste di compleanno da 10 a 25 partecipanti, con tavoli da pic-nic riservati; cibo e bevande si portano da casa. Fa anche gite scolastiche e uscite per i centri estivi. La stagione 2026 è finita: il parco riapre a Pasqua 2027.", sito: "https://www.p3q.it/", },
      { nome: "Casa del Teatro Ragazzi e Giovani", zona: "Torino, Santa Rita (corso Galileo Ferraris 266)", tipo: "teatro per bambini", descrizione: "Teatro della Fondazione TRG dedicato a bambini e ragazzi, in corso Galileo Ferraris 266. La stagione 2025/26 «Prendersi cura» ha più di 50 spettacoli per tutte le età, anche per i bambini di 0-3 anni: teatro di parola, musica, danza, circo, figura e classici rivisitati, con l'età indicata per ogni spettacolo. Nel libretto famiglie 2025/26 il biglietto intero costava 13 € e il ridotto under 14 7 €. Per il compleanno propone «Una festa spettacolare»: si sceglie uno spettacolo della stagione, si prenotano i posti per tutti gli invitati e il festeggiato riceve gli auguri dagli attori.", sito: "https://casateatroragazzi.it/" },
      { nome: "MAcA - Museo A come Ambiente", zona: "Torino, Borgo Dora-Aurora (corso Umbria 90)", tipo: "museo dell'ambiente", descrizione: "Museo interattivo sull'educazione ambientale in corso Umbria 90, con percorsi su energia, rifiuti e acqua pensati per sperimentare, giocare e scoprire. Nel fine settimana organizza i laboratori «MAcA Kids» per bambini (per esempio «Missione Bombe di Semi!» per i 3-5 anni, il 22 novembre 2026) e laboratori per ragazzi dai 12 anni (come «Perché lo butti?», il 29 novembre 2026, a 7 € a partecipante). Posti limitati, prenotazione richiesta. Il sito non parla di feste di compleanno.", sito: "https://www.acomeambiente.org/", festa: false },
      { nome: "Cascina Falchera", zona: "Torino, Falchera (strada Cuorgnè 109)", tipo: "fattoria didattica", descrizione: "Cascina didattica nella periferia nord di Torino, in strada Cuorgnè 109, con attività stagionali per famiglie: laboratori creativi e di educazione all'aperto per bambini dai 12 mesi ai 10 anni e un laboratorio sulle api per famiglie con bambini di 3-8 anni. D'estate c'è il centro estivo per bambini dai 4 agli 11 anni (nel 2026, 120 € a settimana con il pasto). Per i compleanni affitta una sala interna o un posto all'aperto nel Bosco, con buffet merenda; informazioni e prenotazioni dal lunedì al venerdì, 9-17.", sito: "https://cascinafalchera.it/" },
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
    aggiornata: "2026-11-25",
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
          "Ludoteca e sala feste a Palermo, in via Resuttana, per bambini fino a 12 anni. Al coperto ci sono un parco giochi con scivoli, gonfiabili e un percorso di gioco, e un baby parking per i più piccoli con casetta, giochi morbidi e vasca con le palline. Organizza compleanni e feste a tema con animazione, giochi e balli: data, tema, orari e allestimento si concordano prima con lo staff. In ludoteca si fanno anche laboratori di pittura, giochi di gruppo e musica; su richiesta noleggia gonfiabili per feste all'aperto.",
        sito: "https://www.chefesta.org/",
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
          "Location per feste dell'agenzia Holiday Animazione in viale Michelangelo 57, a Palermo, accanto al ponte di viale Lazio. Ha 500 mq interni climatizzati, un'area kids coperta, un parco gonfiabili e due spazi esterni per il picnic party. I pacchetti comprendono rosticceria e bevande analcoliche, animatore con musica e giochi, sculture di palloncini, addobbo del tavolo torta e mascotte; la festa dura circa due ore e mezza. Nel fine settimana ci sono anche turni al mattino e la sera. Prezzi da chiedere.",
        sito: "https://www.holidayanimazione.com/organizzazione-feste-palermo",
      },
      {
        nome: "Dueffe Animazione",
        zona: "Favorita e Villabate",
        tipo: "animazione con sale convenzionate",
        descrizione:
          "Agenzia di animazione per feste che lavora a Palermo e nella Sicilia occidentale, con sale convenzionate in città e in provincia. Tra queste la Caffetteria Silvio Massaro dentro il bowling della Favorita, in viale del Fante, con sala per adulti e bambini, e la Sala Feste Joungo a Villabate, con spazio verde e area gonfiabili. Altre sale sono in via del Bersagliere, via Zappalà, via La Marmora e a Casteldaccia. Il preventivo per sala e animazione è gratuito e si chiede su WhatsApp o per telefono.",
        sito: "https://dueffeanimazione.it/sale-feste-bambini-palermo/",
      },
      { nome: "Museo delle Marionette Antonio Pasqualino", zona: "Palermo, Kalsa (piazzetta Antonio Pasqualino 5)", tipo: "museo delle marionette con teatro per bambini", descrizione: "Museo delle marionette e dell'opera dei pupi in piazzetta Antonio Pasqualino 5, una traversa di via Butera, a Palermo. Oltre alle collezioni e agli spettacoli di opera dei pupi, propone attività per le scuole, letture e laboratori per bambini sulle sue collezioni. La domenica pomeriggio c'è la rassegna «Teatro al Museo», teatro d'immagine e di figura per bambini e famiglie: la stagione 2025/26 è andata dal 12 ottobre 2025 al 19 aprile 2026, con spettacoli come «Pinocchio» con la sabbia e «Un'Odissea». Nella stagione 2025/26 il biglietto costava 10 euro intero e 8 euro ridotto per bambini e studenti, l'abbonamento a 7 spettacoli 35 euro.", sito: "https://www.museodellemarionette.it/", festa: false },
      { nome: "Piccolo Teatro Patafisico", zona: "Palermo, Complesso Pietro Pisani (via Gaetano La Loggia 5)", tipo: "teatro e corsi per bambini", descrizione: "Teatro per le nuove generazioni con sede operativa nel Complesso Pietro Pisani, in via Gaetano La Loggia 5, a Palermo. Durante l'anno tiene corsi per bambini e ragazzi divisi per età: laboratori teatrali dai 4 anni (4-6, 6-8 e 8-11 anni), circo per i più piccoli, inglese, taekwondo e canto. Ogni autunno organizza PataPùm, festival di teatro per bambini dai 2 anni, famiglie e scuole, con spettacoli e laboratori: l'edizione 2025 si è tenuta dal 2 al 5 ottobre 2025. Orari e quote dei corsi vanno confermati con il teatro, perché sulle pagine del sito non coincidono.", sito: "https://www.piccoloteatropatafisico.it/", festa: false },
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
    aggiornata: "2026-11-25",
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
          "Servizio di animazione per feste di compleanno a Genova e provincia. Gli animatori vanno nella location scelta dalla famiglia, come una ludoteca, una sala, un ristorante o uno stabilimento balneare; il sito elenca anche sale in affitto per quartiere. Nelle feste ci sono animatori in costume, truccabimbi, palloncini modellabili, giochi di movimento, caccia al tesoro, baby dance e il momento della torta e dei regali. Per i bimbi da 0 a 3 anni c'è il baby party di due ore, con un piccolo castello gonfiabile. Si prenota per telefono o WhatsApp.",
        sito: "https://www.compleannogenova.it",
      },
      { nome: "Parco Avventura Righi", zona: "Genova, Righi (sulle alture della città)", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura in via Carso, sulle colline del Righi, a 10 minuti di funicolare dal centro di Genova. Ha undici percorsi tra gli alberi con ponti tibetani, carrucole e reti; il percorso Cip e Ciop, con 7 piattaforme, è per i bambini dai 3 ai 6 anni. I minorenni vengono con un adulto e la prenotazione è sempre obbligatoria. Organizza feste di compleanno da 10 bambini in su, tutti i giorni, con tavoli, panche e gazebo riservati; ci sono anche barbecue per gruppi e famiglie e un centro estivo.", sito: "https://parcoavventuragenova.it/", },
      { nome: "La Città dei Bambini e dei Ragazzi", zona: "Genova, Porto Antico (Ponte Spinola)", tipo: "museo interattivo per bambini", descrizione: "Museo interattivo per bambini dai 2 ai 12 anni a Ponte Spinola, nel Porto Antico di Genova, gestito insieme all'Acquario. Ha oltre quaranta installazioni da toccare e provare dedicate ai cinque sensi e alla scienza; nei fine settimana e nei festivi lo staff propone i Science Snack, brevi attività di 15-20 minuti comprese nel biglietto. La prenotazione della data e della fascia oraria è obbligatoria e i biglietti si comprano online o alla biglietteria dell'Acquario. Organizza feste di compleanno per le fasce 2-4 e 5-12 anni, con un operatore dedicato, accesso ai giochi e uno spazio riservato per la torta; il cibo non è compreso.", sito: "https://www.cittadeibambini.net/" },
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
    aggiornata: "2026-11-24",
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
          "Parco giochi al coperto di 300 mq in via Caduti di Casteldebole, a Bologna, dedicato al gioco libero per i bambini da 1 a 9 anni, con scivoli e giochi gonfiabili. L'ingresso va prenotato. Per i compleanni c'è una saletta già allestita, con l'uso dell'area giochi; nel servizio sono comprese bibite e qualche stuzzichino, e su richiesta c'è il catering. Le feste si fanno al pomeriggio, la domenica mattina e, su prenotazione, la sera. Propone anche la serata pizza, con pizza al metro e bibite, e le cene di fine anno scolastico.",
        sito: "https://ilborgodeipiccoli.it/",
      },
      {
        nome: "Magic World",
        zona: "Budrio",
        tipo: "sale feste al chiuso",
        descrizione:
          "Parco giochi al chiuso e climatizzato nella zona di Budrio, gestito da un'associazione di promozione sociale. Per giocare ci sono gonfiabili, salterelli, playground, piscina di palline, area baby e un campetto da calcio. Al piano terra due sale per bambini da 1 a 10 anni, al primo piano una sala solo per i bimbi da 1 a 5 anni. Organizza feste di compleanno e feste a tema, come Carnevale e Halloween; su richiesta prepara buffet dolci e salati. Per gli adulti c'è una zona relax con bar.",
        sito: "https://magicworldaps.it/",
      },
      {
        nome: "Il Mondo di Makam\u00f2",
        zona: "via San Rocco",
        tipo: "ludoteca in affitto",
        descrizione:
          "Ludoteca nel centro di Bologna, in via San Rocco, con oltre 120 mq di spazi. Dal martedì al venerdì, dalle 17.30 alle 21.30, accoglie i bambini da 6 mesi a 3 anni con i genitori e quelli da 3 a 6 anni; c'è anche l'Aperibimbo su prenotazione. Per giocare ci sono playground, vasca delle palline, gonfiabile, libri, puzzle e giochi da tavolo, e colori per dipingere. Nel fine settimana gli spazi si affittano per feste di compleanno ed eventi privati, in fasce di tre ore: si può prendere solo la struttura oppure lasciare a loro anche il buffet.",
        sito: "https://www.ilmondodimakamo.it/ludoteca-bologna/",
      },
      {
        nome: "Luna Farm",
        zona: "zona FICO",
        tipo: "parco divertimenti",
        descrizione:
          "Parco divertimenti a tema contadino, al coperto e climatizzato, dentro Grand Tour Italia (ex FICO) in via Paolo Canali a Bologna. Ha giostre accessibili da 90 cm di altezza, il playground Labirintolo, videogiochi e realtà virtuale, e un punto ristoro. Per i compleanni ci sono quattro salette private: il pacchetto comprende giostre illimitate, saletta e pizza, popcorn e bibite analcoliche a volontà per due ore e mezza, a costo fisso fino a 15 partecipanti. Le feste si fanno nei giorni di apertura: il calendario è sul sito.",
        sito: "https://lunafarm.it/",
      },
      { nome: "Parco Avventura Cavaioni", zona: "Bologna, parco Cavaioni (sui colli)", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura dentro il parco Cavaioni, sui colli di Bologna, a 10 minuti dal centro. Su 4.000 mq ci sono 180 piattaforme sugli alberi e 22 percorsi: 7 per i bambini da 100 cm di altezza e 9 per ragazzi e adulti da 140 cm. Per il «Compleanno avventura» si sta 3 ore sui percorsi, servono almeno 5 biglietti della stessa tariffa e gli accompagnatori che non salgono entrano gratis. Il buffet si porta da casa, con tavolo riservato e frigo su richiesta; l'area picnic resta aperta dopo i percorsi. Riapre a marzo 2027.", sito: "https://www.cavaionipark.it/", },
      { nome: "Teatro Testoni Ragazzi - La Baracca", zona: "Bologna, Bolognina (via Matteotti 16)", tipo: "teatro per bambini", descrizione: "Teatro per bambini e ragazzi della compagnia La Baracca, in via Matteotti 16 in Bolognina, riaperto con la stagione 2024/25 dopo i lavori. La stagione per le famiglie ha spettacoli per età precise (per esempio «Cikeciak», per 1-4 anni) e laboratori teatrali; a marzo ospita il festival internazionale per la prima infanzia «Visioni di futuro, visioni di teatro» (edizione 2026). Il sito non parla di feste di compleanno.", sito: "https://www.testoniragazzi.it/", festa: false },
      { nome: "Fondazione Villa Ghigi", zona: "Bologna, colli (via San Mamolo 105)", tipo: "laboratori nella natura", descrizione: "Fondazione che gestisce il Parco Villa Ghigi, sui colli, in via San Mamolo 105, e propone attività di educazione alla natura per scuole, bambini e famiglie: i «Sabati nel Parco» (bambini di 2-6 anni con un genitore e di 5-11 anni, su prenotazione), laboratori settimanali al LEA Villa Scandellara (2-5 anni con un adulto e 5-10 anni) e centri estivi nel parco. A maggio 2026 ha organizzato la festa dei giardini Diverdeinverde, con laboratori gratuiti per bambini e famiglie. Il sito non parla di feste di compleanno.", sito: "https://www.fondazionevillaghigi.it/", festa: false },
      { nome: "Fantateatro", zona: "Bologna, San Vitale (sede in via Brini 29; spettacoli al Teatro Dehon)", tipo: "compagnia teatrale per bambini", descrizione: "Compagnia teatrale bolognese per bambini e famiglie, con la stagione di spettacoli al Teatro Dehon (2025/2026), rassegne estive al Teatro Duse, proposte per le scuole e un'Academy di corsi. Organizza feste di compleanno in due formule: con animazione (giochi, laboratori creativi, trucco per i bambini, letture animate) oppure con uno spettacolo vero dei suoi attori. Si possono fare al chiuso o all'aperto, anche a casa.", sito: "https://www.fantateatro.it/" },
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
    aggiornata: "2026-11-25",
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
          "Ludoteca comunale di Firenze, con un giardino dove si fanno anche laboratori all'aperto. È aperta dal lunedì al venerdì dalle 16 alle 19 e il sabato dalle 9:30 alle 12:30; all'ingresso serve l'iscrizione gratuita. Ogni mese ha un programma di laboratori di pittura, clowneria, letture e giochi; c'è una stanza morbida per i bambini da 0 a 3 anni, dove si entra senza scarpe, e i libri si prendono in prestito per una settimana. Per i bambini dai 6 agli 11 anni c'è uno spazio compiti il martedì, mercoledì e venerdì pomeriggio e il sabato mattina.",
        sito: "https://educazione.comune.fi.it/system/files/2026-04/maggio%202026.pdf",
        festa: false,
      },
      {
        nome: "La Mondolfiera",
        zona: "via dell'Anconella",
        tipo: "ludoteca",
        descrizione:
          "Ludoteca comunale di Firenze in via dell'Anconella 3, seguita dall'Ufficio attività educative nei Quartieri del Comune. La mattina, lunedì, mercoledì e venerdì dalle 9:30 alle 12:30, le attività sono soprattutto per i bambini da 0 a 3 anni; il pomeriggio, dal lunedì al venerdì dalle 16 alle 19, per quelli da 3 a 11 anni. Ogni mese c'è un programma di laboratori, letture, giochi motori e uscite all'aperto nel parco. Si entra senza scarpe, con calzini antiscivolo, e dentro non si mangia. La prenotazione è consigliata.",
        sito: "https://educazione.comune.firenze.it/riscossioneonline/system/files/2026-04/aprile%2026%20Mondolfiera_compressed-1.pdf",
        festa: false,
      },
      {
        nome: "Klab Kids",
        zona: "Firenze",
        tipo: "saloni per feste",
        descrizione:
          "Asilo nido e scuola dell'infanzia in via del Ferrone 5, a Firenze, che il fine settimana apre i suoi spazi alle feste. Ci sono due saloni per oltre 70 persone, uno dei quali dà su uno spazio con giochi e pavimento antitrauma, e anche spazi esterni. Il noleggio comprende l'uso della cucina per sporzionare e le pulizie. Su richiesta pensa ad animazione (giochi di gruppo, baby dance, trucca bimbi, palloncini), addobbi e rinfresco. Sale aperte sabato e domenica dalle 15.30 alle 19.30, da prenotare almeno una settimana prima.",
        sito: "https://www.klabkids.it/feste/",
      },
      {
        nome: "Fantasyland",
        zona: "Calenzano",
        tipo: "parco giochi al coperto",
        descrizione:
          "Parco giochi al coperto nel centro commerciale Le Palme Blu, a Calenzano: oltre 700 mq climatizzati con gonfiabili, playground, giochi e laboratori, per bambini sotto i 12 anni e fino a 140 cm; è anche ludoteca e baby parking. Per i compleanni c'è una sala e il pacchetto comprende 10 bambini, con un costo per ogni bambino in più. Il buffet si porta da casa oppure lo organizza la struttura; si può chiedere l'addobbo con i palloncini. Dentro c'è un bar con tavoli per gli accompagnatori.",
        sito: "https://www.fantasylandpark.it/",
      },
      {
        nome: "Stargate Lasergame",
        zona: "Firenze e Prato",
        tipo: "lasergame",
        descrizione:
          "Arena di laser game a Calenzano, in via Arsiero Salvanti 59, tra Firenze e Prato, aperta solo su prenotazione. Le feste sono pensate dai 6 anni in su e comprendono la partita di laser game, fino a 24 giocatori per turno, o il calcio balilla umano, fino a 14, più sala giochi e biliardo. I pacchetti per numero di invitati comprendono inviti, tavola apparecchiata, pizze anche senza glutine, patatine, bibite e un dolce, con l'assistenza dello staff. Non si affittano solo spazi e tavoli. Prezzi nel PDF sul sito.",
        sito: "https://www.lasergamefirenze.com/compleanni-cxrn",
      },
      { nome: "Tree Experience Vincigliata", zona: "Vincigliata (Fiesole), a una decina di minuti da Firenze", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura in via Vincigliata 21, a Fiesole, a circa 10 minuti di macchina dal centro di Firenze. Ha 8 percorsi sugli alberi con ponti tibetani, liane, reti e carrucole, più la Net Experience, il softair e un salto nel vuoto da 15 metri dai 10 anni. Il percorso Kaa è per i bambini dai 3 anni (90 cm al polso col braccio alzato); il Pitone chiede 1,40 m. Fa feste di compleanno e centro estivo, ed è aperto tutto l'anno per gruppi e compleanni: prezzo e numero di bambini si chiedono al parco.", sito: "https://treeexperience.it/parco-avventura-vincigliata/", },
      { nome: "Parco Avventura Il Gigante", zona: "Pratolino (Vaglia), a nord di Firenze", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura lungo via Bolognese, all'altezza di Villa Demidoff, prima di Pratolino (Vaglia), a circa 10 minuti da Firenze: si entra dal parcheggio davanti alla villa. Ha 18 percorsi sugli alberi, di cui 12 adatti ai bambini dai 3 anni; i più facili chiedono 100 cm di altezza. Il biglietto vale due ore e mezzo e non serve prenotare, tranne per gruppi e compleanni. Per le feste ci sono 15 tavoli da pic-nic da riservare gratis e il catering del bar del parco, oppure il rinfresco si porta da sé. Il calendario delle aperture è sul sito.", sito: "https://parcoavventurailgigante.it/", },
      { nome: "MUS.E Musei Civici Fiorentini", zona: "Firenze, piazza della Signoria (Palazzo Vecchio)", tipo: "museo con laboratori per bambini", descrizione: "La Fondazione MUS.E cura le attività per bambini e famiglie nei Musei Civici Fiorentini, a partire dal Museo di Palazzo Vecchio in piazza della Signoria, e poi al Museo Novecento, a Palazzo Medici Riccardi e in altri musei della città. Propone visite animate e laboratori per famiglie, il programma Pollicino Verde per i bambini dai 3 ai 6 anni e, nell'estate 2026, campi estivi tra arte, gioco e inglese per i 6-10 anni. Nel maggio 2026 ha organizzato «Firenze dei Bambini», tre giorni dedicati a Pinocchio con laboratori per i bambini da 0 a 12 anni.", sito: "https://musefirenze.it/", festa: false },
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
    aggiornata: "2026-11-25",
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
          "Scuola dell'infanzia in via Amendola, a Bari, che organizza anche feste per bambini. Nei suoi spazi si festeggiano compleanni a tema, battesimi, carnevale e altre ricorrenze. Si può scegliere un buffet per 25 bambini, con addobbi colorati, palloncini e animazione; la scuola aiuta a scegliere gli allestimenti. Il preventivo si chiede per telefono.",
        sito: "https://www.scuolagiardinodeibimbi.net",
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
      { nome: "Teatro Casa di Pulcinella", zona: "Bari, Arena della Vittoria", tipo: "teatro di burattini per bambini", descrizione: "Teatro stabile di burattini e marionette fondato nel 1988 dalla compagnia Granteatrino, dentro l'Arena della Vittoria, a Bari. Ha una stagione per famiglie con spettacoli il sabato e la domenica, in genere alle 18, divisi per età dai 3 ai 10 anni: in cartellone per l'autunno 2026 ci sono «Il brutto anatroccolo», «Melina» e spettacoli di Natale fino al 20 dicembre 2026. Nella stagione 2026/27 il biglietto della maggior parte degli spettacoli costa 8 euro. Fa anche spettacoli per le scuole e, su richiesta, uno spettacolo dedicato al festeggiato per i compleanni.", sito: "https://casadipulcinella.it/" },
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
    aggiornata: "2026-11-25",
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
          "Sala feste con playground in via Ingegnere, a Catania, aperta tutti i pomeriggi e la mattina su appuntamento. È un centro di attività al coperto con area baby 0–3 anni, tappeti elastici, un galeone dei pirati, il campetto da calcetto e basket e la realtà virtuale. Per i compleanni la sala è riservata e ci sono molti pacchetti a tema, dal torneo di calcio al pigiama party, ai laboratori di gioielli; lo staff cura anche l'allestimento. Offre pure baby parking, aperiparking e il centro estivo.",
        sito: "https://nilapartyfamily.it/",
      },
      {
        nome: "La Bacchetta Magica",
        zona: "via Quieta",
        tipo: "ludoteca e sala feste",
        descrizione:
          "Ludoteca con sala feste in via Quieta, a Catania. La sala è un unico ambiente colorato con playground, zona snack e una sala medievale con palco e trono per il festeggiato. Durante la festa gli animatori propongono baby dance con bolle di sapone, trucca bimbi, il toro meccanico e tanti giochi; alla fine ci sono palloncini modellabili e braccialetti luminosi per tutti. C'è uno spazio ampio per i genitori. Durante l'anno offre anche post-scuola, doposcuola, nido, baby parking e grest estivo. Il sabato apre solo per gli eventi.",
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
          "Centro di animazione ed eventi in via Giovanni Grasso, a San Gregorio di Catania. Ha sala interna e sala esterna, gonfiabili, playground, nursery e campo di calcetto, più il parcheggio. Per i compleanni il team propone un pacchetto su misura che comprende animazione, mascotte, allestimenti a tema, catering e regalini finali; a richiesta ci sono spettacoli di magia e bolle di sapone, face painting, crêpes preparate davanti agli ospiti e torte a tema. Organizza anche feste spa ed eventi scolastici.",
        sito: "https://powow.it",
      },
      {
        nome: "Funny Island",
        zona: "Misterbianco",
        tipo: "parco giochi al chiuso",
        descrizione: "Parco giochi al coperto e sala feste a Misterbianco, alle porte di Catania. C'è un grande playground con un vulcano per arrampicarsi, gonfiabili, campo da calcetto e scivoli di grandi dimensioni. Per le feste di compleanno ci sono sale a tema riservate e pacchetti su misura; torte e richieste particolari si fanno su preventivo. All'interno c'è una pizzeria con pizza, hamburger e hot dog. L'ingresso giornaliero non si prenota; info e prenotazioni delle feste su WhatsApp. Gli orari cambiano con la stagione.",
        sito: "https://www.funny-island.com/",
      },
      {
        nome: "Villa Anzalone",
        zona: "Acireale (Capomulini)",
        tipo: "parco con spazi all'aperto",
        descrizione:
          "Parco divertimenti e ludoteca con spazi all'aperto e una pista ciclabile privata; feste per bambini da 1 a 12 anni.",
        sito: "https://villaanzalone.it",
      },
      { nome: "Monti Rossi Etna Adventure Park", zona: "Nicolosi, sull'Etna, a pochi chilometri da Catania", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura nella pineta dei Monti Rossi di Nicolosi, in via Goethe, su un cono vulcanico spento dell'Etna a pochi chilometri da Catania. Ha nove percorsi sospesi tra gli alberi, divisi per difficoltà, con moschettoni che impediscono lo sgancio, l'arrampicata sull'albero Up2Tree, slackline, un sentiero natura e un'area pic-nic. C'è un piccolo punto ristoro con bibite e snack. Fa laboratori per scuole e gruppi ed eventi privati per gruppi numerosi: per una festa chiedete direttamente al parco.", sito: "https://montirossietnaadventurepark.understory.io/it", festa: false },
      { nome: "Ludum Science Center", zona: "Catania, via Guido Gozzano 2", tipo: "museo della scienza", descrizione: "Museo della scienza interattivo per bambini e ragazzi, nella nuova sede di via Guido Gozzano 2, a Catania (prima era a Misterbianco). Ha oltre cento esperimenti da provare in sei aree tematiche, un insettario e un planetario, con laboratori didattici e science show. Nei fine settimana organizza pomeriggi a tema per famiglie con laboratori, sfide con i mattoncini e spettacoli scientifici: nel 2026 ci sono stati, tra gli altri, il Lego Day del 10-11 gennaio, il weekend sulla mente del 28 febbraio-1 marzo e «Dalla Terra... alla Luna!» il 26 aprile. Dal lunedì al venerdì apre solo su prenotazione (9:30-17:30); nel weekend gli orari cambiano secondo le attività.", sito: "https://www.museodellascienza.com/", festa: false },
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
    aggiornata: "2026-11-15",
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
          "Sala feste privata dentro l'impianto CSS Sport di via San Marco 121, a Verona, pensata per bambini dai 2 ai 6 anni. Ospita fino a 50 persone, con un'area gonfiabili e giochi (al massimo 20 bambini insieme) e un'area buffet con tavoli, panche e frigorifero. Si festeggia un compleanno alla volta, per un massimo di 3 ore; la data si blocca con un acconto e si lascia un deposito per la pulizia. Animazione e catering si possono chiedere come servizi aggiuntivi. C'è un ampio parcheggio.",
        sito: "https://www.csssport.com/121bimbi",
      },
      {
        nome: "Bowling Verona",
        zona: "viale della Fiera",
        tipo: "bowling con sala feste",
        descrizione:
          "Bowling con 14 piste, biliardi, sala arcade e bar in viale della Fiera, a Verona. I compleanni si fanno da 8 a 25 invitati, con due ore di prenotazione: comprendono una partita di bowling, il rinfresco con pizzette, patatine e panzerotti, una bibita a testa, la torta e un tavolo riservato. Non si possono portare cibi o bevande da fuori, né coriandoli o glitter. Per i ragazzi il locale consiglia il weekend, quando apre dal pomeriggio; si prenota con il modulo o per telefono.",
        sito: "https://www.bowlingverona.com",
      },
      {
        nome: "Children's Museum Verona",
        zona: "via Santa Teresa",
        tipo: "museo per bambini",
        descrizione:
          "Museo pensato per i bambini in via Santa Teresa, a Verona. Il «Compleanno al museo» si fa dal martedì al venerdì nel pomeriggio, nella Party Room, con un operatore. Ci sono tre pacchetti: solo la sala; sala e visita al museo; sala, visita e uno Science Show, con esperimenti. Cibo e bevande non sono inclusi: la merenda e la torta si portano da casa. Con la visita servono almeno 15 bambini, e c'è un numero massimo di partecipanti. Si prenota col modulo sul sito e si versa un acconto; il regolamento va firmato e rimandato.",
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
      { nome: "Caneva Aquapark", zona: "Lazise, sul lago di Garda (a circa 25 km da Verona)", tipo: "parco acquatico", descrizione: "Parco acquatico a Lazise, sul lago di Garda, aperto d'estate: nel 2026 dal 23 maggio al 13 settembre, in genere dalle 10 alle 18 e fino alle 19 nei fine settimana e in piena estate. I bambini sotto i 100 cm entrano gratis e non hanno bisogno del biglietto; da 100 a 140 cm c'è il ridotto. Prezzi e orari cambiano secondo il periodo: controllateli prima di partire.", festa: false },
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
    aggiornata: "2026-11-15",
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
          "Trampoline park nel centro commerciale Porte di Mestre, in via Don Federico Tosatto 22. Per i compleanni ci sono sale private per tre ore fino a 25 persone, con pacchetti che vanno dalla sola sala, con ingressi al parco scontati e calzini compresi, a quello con dieci ingressi da due ore e cibo e bevande. Per gruppi numerosi c'è una doppia sala fino a 50 persone. Non si portano cibi da casa, tranne la torta con scontrino e lista degli allergeni. La disponibilità si chiede con il modulo sul sito.",
        sito: "https://www.joyzone-jump.com/sale_feste/feste.html",
      },
      {
        nome: "Mida Eventi",
        zona: "Mestre",
        tipo: "ristorante per eventi",
        descrizione:
          "Ristorante per eventi a Mestre, in via Ca' Marcello 6/8, a pochi passi dalla stazione. Per le feste dei bambini la sala si può dividere in un'area giochi e un'area tavoli, con cucina interna: si sceglie un buffet a tema oppure un menù concordato, con giochi e animazione. Ha un ampio plateatico esterno ed è raggiungibile in autobus o in auto, con parcheggio anche per disabili. Il costo dipende dalla sala, dall'intrattenimento e dal numero di invitati: il preventivo si chiede su WhatsApp o con il modulo.",
        sito: "https://www.midaevents.it",
      },
      {
        nome: "Il Selgaro",
        zona: "Mestre",
        tipo: "agriturismo",
        descrizione:
          "Agriturismo a Zelarino, alle porte di Mestre, riconosciuto dalla Regione Veneto come fattoria didattica. Ha un'azienda agricola con allevamenti, un ristorante con prodotti a km 0, alloggi e centri estivi. Per il compleanno dei bambini propone truccabimbi, bolle di sapone e caccia al tesoro, in una sala al coperto riscaldata d'inverno o all'aperto se il tempo lo permette, con un buffet dolce e salato fatto coi prodotti dell'azienda. Per gli eventi si possono avere in esclusiva fattoria, laghetto, cortile e sala con impianto audio e video.",
        sito: "https://www.ilselgaro.com/",
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
          "Centro per l'infanzia a Cazzago di Pianiga, in via Monte Rosa 7, con asilo nido, ludoteca, doposcuola e corsi. Per i compleanni affitta gli spazi della ludoteca il sabato e la domenica dalle 15 alle 19: una stanza con i giochi, una per il buffet e una cucina con frigo. Fino a 15 bambini con i loro adulti, una festa alla volta, con un'operatrice presente; si sceglie solo lo spazio o lo spazio con animazione. Il buffet lo portano le famiglie e servono calzini antiscivolo. Meglio prenotare tre settimane prima.",
        sito: "https://www.ilgiardinodelleciliegie.it",
      },
      { nome: "Caribe Bay", zona: "Jesolo, sul litorale veneziano", tipo: "parco acquatico", descrizione: "Parco acquatico a tema caraibico a Jesolo, aperto d'estate: nel 2026 tutti i giorni dal 30 maggio al 13 settembre. Per le famiglie con bambini piccoli c'è Pirates' Bay, una baia con la spiaggia di sabbia bianca e le attrazioni per i bambini. I bambini fino a 100 cm entrano gratis e tra 100 e 140 cm pagano il ridotto. Dal 2026 dal parco si arriva anche al minigolf a tema, con 24 buche, su prenotazione.", sito: "https://www.caribebay.it/", festa: false },
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
          "Area giochi per bambini in via Croce Rossa, a Messina, di Mister Alex, che fa animazione per feste da oltre 30 anni; d'estate c'è anche Mister Alex Summer a Torre Faro, vicino a Capo Peloro. Oltre al parco giochi si occupa di allestimenti per feste con scenografie a tema, animazione per bambini e adulti, noleggio di gonfiabili e costumi, mascotte, spettacoli di magia e macchine per le bolle. Sul sito si scarica il modulo per comporre la festa scegliendo tema, animazione e servizi.",
        sito: "https://misteralex.it/",
      },
      {
        nome: "Underworld Lasergame",
        zona: "Messina",
        tipo: "lasergame ed escape room",
        descrizione:
          "Lasergame ed escape room con due sedi a Messina: in centro (Galleria Vittorio Emanuele) e a Tremestieri. I pacchetti compleanno comprendono una o due partite da 30 minuti nell'arena e un menù a scelta con bibite (pizza, hamburger o rustici); i pacchetti più ricchi aggiungono invito digitale, zona torta allestita e, nel fluo party, trucco e gadget fluo. Come extra ci sono la caccia al tesoro (in centro), il laser maze (a Tremestieri), le escape room e le animatrici, obbligatorie per i gruppi fino a 12 anni. Non si possono portare cibi da fuori.",
        sito: "https://www.lasergamemessina.it",
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
          "Playroom per bambini e famiglie in via Belzoni, a Padova, vicina ai bus 7, 9, 15 e 42 e a parcheggi della zona. Per la festa di compleanno si ha tutta la playroom in uso esclusivo; è pensata per feste di bambini da 1 a 4 anni. Buffet e decorazioni si portano da casa, oppure si chiede il servizio di partner esterni; su richiesta si organizzano laboratori creativi sul tema della festa. Le date libere sono nel calendario sul sito; d'estate gli orari cambiano.",
        sito: "https://www.blankspacepadova.it/feste-di-compleanno-a-blank-space/",
      },
      {
        nome: "Gi\u00f2 Party",
        zona: "Legnaro",
        tipo: "sala feste",
        descrizione:
          "Ludoteca con sala feste a Legnaro, vicino a Padova, aperta tutto l'anno. La sala interna è al coperto, di 90 mq, accoglie fino a 50 invitati e resta riservata alla festa per tutta la fascia prenotata. Fuori ci sono il giardino, i gonfiabili e il trampolino per la bella stagione, con spazi esterni fino a 100 persone. Buffet e allestimenti si possono portare da sé; a parte si chiedono allestimenti a tema, animazione e consigli per il catering. C'è il parcheggio. Date, fasce orarie e tariffa del giorno si vedono nel calendario online.",
        sito: "https://gioparty.com",
      },
      {
        nome: "La Valle Incantata",
        zona: "Albignasego",
        tipo: "ludoteca",
        descrizione:
          "Ludoteca e centro ricreativo per bambini fino a 12 anni in via Leonino da Zara, ad Albignasego. Ci sono gonfiabili al chiuso e un parco giochi esterno nel verde. Si organizzano feste di compleanno con lo spazio e i giochi a disposizione, feste a tema, baby parking, serate a tema e il centro estivo; c'è anche un servizio di feste a domicilio con catering. Apre dal lunedì al venerdì il pomeriggio e nel weekend a pranzo e il pomeriggio: prezzi e disponibilità si chiedono al posto.",
        sito: "https://valleincantata.it",
      },
      {
        nome: "All'Arrembaggio",
        zona: "Maser\u00e0 di Padova",
        tipo: "ludoteca e parco giochi",
        descrizione:
          "Ludoteca e parco giochi in via Volta 4 a Maserà di Padova, con gonfiabili e giochi per varie età e uno spazio bimbi 12-36 mesi al mattino. Le feste si fanno ogni pomeriggio dalle 16 alle 19, o il venerdì e sabato sera su prenotazione, in una sala climatizzata e addobbata con un tavolo riservato; d'estate c'è il parco esterno di 600 mq con piscina. Su richiesta ci sono animazione, baby dance, trucca bimbi, magia e palloncini. Il personale sorveglia i bambini e c'è un'area relax. C'è anche il baby sitting S.O.S. Tate.",
        sito: "https://www.allarrembaggio.com/",
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
          "Sala feste in via Lionello Stock, a Trieste, per compleanni dei bambini, feste private e incontri. Tema, decorazioni, menù e attività si scelgono insieme al locale; ci sono feste a tema, allestimenti con palloncini e un menù personalizzato. L'animazione, con giochi, magia, bolle di sapone e trucca bimbi, è affidata a un'agenzia partner, a cui va chiesto il preventivo per quella parte. La sala si prenota con il modulo sul sito o per telefono.",
        sito: "https://www.stockaparty.it",
      },
      {
        nome: "Villa Rinascita (parrocchia San Marco)",
        zona: "via dei Modiano",
        tipo: "sala parrocchiale con esterno",
        descrizione:
          "Sala feste e area esterna di Villa Rinascita, della parrocchia di San Marco Evangelista, in via dei Modiano a Trieste. Si prenota tutti i giorni tranne la domenica, al mattino, al pomeriggio o alla sera, per compleanni di bambini e ricorrenze di famiglia. Fuori c'è un terreno in ghiaia, un'area verde e un campo da calcio; dentro c'è un forno a microonde per scaldare i cibi, i servizi e una rampa d'accesso. Parcheggio ampio. Non si accettano feste per adolescenti e diciottesimi; si prenota solo per email o telefono, seguendo il regolamento.",
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
          "Parco scientifico dentro un parco pubblico nel centro storico di Brescia, in Largo Torrelunga, protetto dalle mura venete. All'aperto ci sono due aree gioco, una fino a 8 anni e una fino a 12, aperte tutti i giorni dalle 8.30 alle 22. La sala feste nell'edificio storico ospita una trentina di bambini con gli adulti, da lunedì a sabato, con tavoli, sedie e bagni riservati, ed è accessibile. Non ha frigorifero e non c'è animazione: la festa si organizza in autonomia. Accanto c'è il bar ristorante Mondo Liquido.",
        sito: "https://ambienteparco.it/giochi-nel-verde/",
      },
      {
        nome: "LaserGame Brescia",
        zona: "Brescia",
        tipo: "lasergame",
        descrizione:
          "Arena di lasergame in via Vergnano, a Brescia, con feste di compleanno per ragazzi dai 7 ai 17 anni e un minimo di 6 giocatori. Il pacchetto semplice comprende sala con tavolo, doppia partita e 2 ore e mezza di spazio, con buffet portato da casa; quello con buffet incluso dura 3 ore e mezza. Su preventivo c'è la festa con locale riservato e partite illimitate. Addobbi e torta si portano da sé, ma niente coriandoli o brillantini. Prenotazioni per telefono tutti i giorni nel pomeriggio, anche via WhatsApp.",
        sito: "https://lasergame-brescia.com",
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
          "Parco giochi al coperto a San Zeno Naviglio, alle porte di Brescia, accanto al ristorante Cresta Alta. Dentro ci sono un playground con scivolo, reti e palline, una pista per macchinine e biciclette, un campo di calcetto, una casetta con torre per il gioco libero, un'area per i più piccoli con costruzioni giganti e i biliardini. Per i compleanni ha salette dedicate e feste tutto compreso con catering e torte; su richiesta trucca bimbi, palloncini e baby dance. Per i genitori c'è un angolo bar. Gli orari cambiano con la stagione: sono sul sito.",
        sito: "https://www.magomimu.it/",
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
          "Spazio per l'infanzia nel centro storico di Leporano, vicino al castello Muscettola, che è anche asilo nido e ludoteca Montessori bilingue. La sala eventi si usa per feste di compleanno e altri eventi: la struttura è di 170 mq, con sale interne, una playroom tutta in legno e senza plastica, un giardino per il taglio della torta e una terrazza panoramica. Per informazioni su date e servizi della festa si scrive o si chiama la struttura.",
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
          "Sala per feste di 100 mq in via Giovan Battista Tiepolo, nel centro di Prato fuori dalla ZTL, gestita da una party planner. Accoglie fino a 60 persone, ha aria condizionata, riscaldamento, frigo e forno; le pulizie sono comprese nell'affitto. Si può affittare vuota e portare tutto da fuori, oppure chiedere allestimento, animazione di tre ore, catering, torta e foto. Ci sono laboratori per bambini come pittura, collane, slime, pizza, biscotti e cupcake, e feste a pacchetto per tema. Le tariffe per fascia oraria sono sul sito.",
        sito: "https://www.happypartyplanner.it",
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
          "Centro ludico-motorio al coperto in via Gasparini, a Modena est: 1.300 mq di aree gioco per bambini da 0 a 10 anni, con gonfiabili, playground e spazi divisi per età. Servono la tessera, fatta sul posto, e le calze antiscivolo. Propone multisport, yoga e ginnastica dolce, e un'area ristoro per la merenda e l'aperitivo dei genitori. Per le feste di compleanno e i pizza party ci sono pacchetti completi; col servizio «Ci pensa Oplà» il catering, torta compresa, lo preparano loro. Si possono aggiungere palloncini e gadget. Il lunedì è chiuso.",
        sito: "https://www.oplamodena.it/",
      },
      {
        nome: 'Ippodromo Ghirlandina',
        zona: 'Modena',
        tipo: "sala compleanni all'ippodromo",
        descrizione:
          "Ippodromo nel verde alle porte di Modena che ospita anche compleanni di bambini. La sala interna per le feste è attrezzata con gonfiabili e c'è un'area dove travestirsi e fare foto con lo sfondo virtuale. Fuori si possono organizzare attività all'aperto, come il battesimo della sella e l'area giochi, e vedere da lontano i cavalli nei paddock. Due locali sono attrezzati per il catering e c'è un parcheggio interno accessibile. La festa si può fare anche in una giornata di corse.",
        sito: "https://ippodromoghirlandina.it",
      },
      {
        nome: 'Museo della Bilancia',
        zona: 'Campogalliano',
        tipo: 'museo',
        descrizione:
          "Museo degli strumenti di misura a Campogalliano, nel Municipio. Organizza feste di compleanno per bambini dai 6 ai 10 anni: gli esperti del museo guidano attività di gioco e di scoperta e c'è una sala dove allestire un piccolo rinfresco. Si scelgono due proposte, per esempio la caccia alla bilancia tra le sale, i circuiti elettrici, i giochi di equilibrio, gli esperimenti con l'acqua, le battaglie robotiche o gli insetti da vicino. La festa dura circa tre ore; prezzi, orari e prenotazioni si chiedono agli uffici del museo.",
        sito: "https://www.museodellabilancia.it",
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
      { nome: "Bowling 2000 – Laser Game Revolution", zona: "Cella (Reggio Emilia)", tipo: "lasergame", descrizione: "Bowling a Cella, in via Vistola 13 a Reggio Emilia, con sala giochi, bar e pizzeria con due sale per feste. Organizza compleanni per bambini e ragazzi dai 4 ai 18 anni, con pacchetti da un'ora e mezza a tre ore che uniscono bowling, videogiochi o laser game e pizza. Per i più piccoli ci sono spondine e bocce leggere. Il laser game è un labirinto di 200 metri quadrati, dai 9-10 anni e almeno 120 cm di altezza. La torta si può portare con lo scontrino, altri cibi no. Aperto venerdì sera, sabato e domenica pomeriggio.", sito: "https://www.bowling2000.it/" },
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
        descrizione: "Museo di storia naturale di Livorno, nella settecentesca Villa Henderson in via Roma. Si può festeggiare il compleanno il giovedì e la domenica dalle 16 alle 18.30, da settembre a maggio, con uno spazio interno ed esterno e un'ora di attività scientifica con gli educatori della cooperativa Itinera: visita ad alcune sale e laboratorio con un lavoretto da portare a casa. Al massimo 30 persone tra bambini e adulti. La domenica ci sono anche i laboratori «Giocando s'impara». La data si concorda per email.",
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
    aggiornata: "2026-11-15",
    rispostaBreve: "A Ravenna la festa di compleanno per bambini si fa nei parchi giochi al coperto con gonfiabili, come Neverland Park alle Bassette (700 mq, con un'area per i bimbi da 0 a 3 anni), nelle sale feste con playground in città e a Marina Romea, oppure per i più grandi con il pacchetto compleanno di Mirabilandia. Molti pacchetti arrivano a circa 20 bambini fratelli compresi: fate la lista degli invitati prima di prenotare.",
    intro: "Ravenna unisce una città raccolta e i lidi a pochi minuti, e questo si vede anche nelle feste: si sceglie tra i parchi gioco coperti della periferia, le sale feste vicino al mare e il grande parco divertimenti a Savio.",
    locali: [
      { nome: "Neverland Park", zona: "Ravenna, zona commerciale Le Bassette", tipo: "parco giochi al coperto", descrizione: "Parco giochi coperto di 700 mq con gonfiabili, labirinti, tappeti elastici, un piccolo campo da calcio e un'area dedicata ai bimbi da 0 a 3 anni. Ha una sala feste e organizza compleanni di mattina, di pomeriggio o di sera; il pacchetto comprende fino a 20 bambini, fratelli inclusi.", sito: "https://www.neverlandparkravenna.it/" },
      { nome: "Cucina Retrò", zona: "Marina Romea (Ravenna)", tipo: "sala feste con playground", descrizione: "Locale dedicato esclusivamente ai compleanni dei bambini, con sale per le feste e circa 200 mq di aree gioco, tra cui una ludoteca coperta con playground, piscina di palline e scivolo; i genitori possono seguire i bimbi dal tavolo grazie ai monitor. Il buffet è preparato in giornata dalla cucina e in stagione si gioca anche all'aperto.", sito: "https://cucinaretro.it/" },
      { nome: "L'isola di Sophie", zona: "Ravenna, via Agro Pontino", tipo: "sala feste con playground", descrizione: "Ristorante pizzeria con area giochi e sala feste in via Agro Pontino 2 a Ravenna, aperto da poco. Il PlayPark ha una struttura soft play su più livelli, uno scivolo gonfiabile, la piscina di palline e un'area baby per i più piccoli; i genitori stanno al bar o ai tavoli a due passi. Per i compleanni ci sono tre pacchetti con buffet, tutti con l'ingresso al parco per 20 bambini; la torta la porta la famiglia. La data si blocca con una caparra online. Gli orari non sono ancora pubblicati: chiedeteli al telefono.", sito: "https://lisoladisophie.it/", },
      { nome: "Mirabilandia", zona: "Savio di Ravenna", tipo: "parco divertimenti", descrizione: "Grande parco divertimenti a Savio di Ravenna. Per gruppi di almeno 10 persone c'è il pacchetto compleanno: ingresso gratuito per il festeggiato, ingresso scontato per gli invitati e pranzo al ristorante New York Deli con primo, secondo, contorno, bibita e torta di compleanno, più attrazioni e spettacoli del parco. Per gruppi fino a 9 persone si può avere la torta al ristorante, con consumazione. La festa va prenotata con almeno 4 giorni di anticipo con il modulo sul sito.", sito: "https://www.mirabilandia.it/" },
      { nome: "CerviAvventura", zona: "Cervia, via Forlanini (a circa 25 km da Ravenna)", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura dentro il Parco Naturale di Cervia, in via Forlanini a Milano Marittima, gestito dalla cooperativa Atlantide. Ha percorsi sospesi tra gli alberi per tutte le età: prima di partire un istruttore spiega come muoversi e dà imbragatura e caschetto. Si entra dai 4 anni e da un metro di altezza; servono scarpe chiuse e abiti sportivi. Apre a stagione, dalla primavera a settembre: date, orari e biglietti si controllano sulla pagina del parco.", sito: "https://shop.atlantide.net/circuito-amaparco/cerviavventura/", festa: false },
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
      { nome: "Edoland", zona: "Cagliari", tipo: "sala feste con playground", descrizione: "Sala feste per bambini a Cagliari con playground gigante, gonfiabile con scivoli, trono per il taglio della torta e spazi per ogni età. Ogni festa dura 4 ore. Un'assistente di sala aiuta con bevande, buffet e ordine degli spazi e dei bagni; il catering si concorda su misura. La sala è climatizzata, con frigo, pulizie finali e smaltimento dei rifiuti compresi, e c'è un ampio parcheggio. Tra gli extra popcorn, zucchero filato e musica.", sito: "https://edoland.it/" },
      { nome: "Il Castello Incantato", zona: "Monserrato", tipo: "sala feste con playground", descrizione: "Sala feste per bambini in via Decio Mure 34 a Monserrato. Il locale di 160 mq ha zona buffet, trono per il festeggiato, playground con vasca di palline e zona discoteca. Fuori c'è un giardino di 200 mq con un grande castello gonfiabile e un tappeto elastico, una zona per i più piccoli e spazi per i genitori. Organizza compleanni e feste a tema con animatori, e l'evento si personalizza dall'animazione al buffet. La disponibilità della sala si chiede su WhatsApp.", sito: "https://ilcastelloincantatocagliari.it/" },
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
      { nome: "Ludoteca I Sogni di Luca", zona: "Foggia, via Paolo Telesforo", tipo: "ludoteca e sala feste", descrizione: "Ludoteca in via Paolo Telesforo 76, a Foggia, con giochi moderni e tradizionali, laboratori artistici e percorsi di avventura. Organizza feste di compleanno il pomeriggio, la sera e la domenica mattina: i pacchetti della sala comprendono 15 bambini, buffet merenda per 40 persone tra grandi e piccoli e la torta. Su richiesta ci sono allestimento personalizzato sul tema scelto, animazione, trucca bimbi, scatola regalo per i bambini e angolo dolci. Si prenota dal sito, per telefono, su WhatsApp o sui social.", sito: "https://ludotecaisognidiluca.it/" },
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
    aggiornata: "2026-11-15",
    rispostaBreve: "A Rimini la festa di compleanno per bambini si fa soprattutto nelle ludoteche con sala feste e nei parchi giochi al coperto tra Marina Centro e Viserba, mentre nei dintorni ci sono un bowling con play park a Cerasolo di Coriano e un parco giochi all'aperto a Igea Marina. Molte formule durano circa tre ore: Tiny Rimini propone pacchetti fino a 20 bambini, Chibia ha uno spazio coperto di circa 1000 mq con un'area baby per i bimbi da 0 a 3 anni. Prenota con qualche settimana di anticipo, soprattutto per il weekend, e chiedi subito cosa è compreso tra buffet, torta e animazione.",
    intro: "Rimini non è solo spiaggia d'estate: tutto l'anno ci sono spazi pensati per far festa con i bambini, dalle ludoteche vicino al mare ai grandi parchi gonfiabili al coperto. E se cerchi qualcosa di diverso, a pochi chilometri trovi anche bowling e parchi giochi all'aperto nei comuni vicini.",
    locali: [
      { nome: "Tiny Rimini", zona: "Rimini, Marina Centro", tipo: "ludoteca e sala feste", descrizione: "Ludoteca e spazio feste a Marina Centro, in viale Flavio Gioia, vicino al lungomare e alla pista ciclabile, con laboratori e bar interno. Ogni festa dura tre ore e gli adulti accompagnatori entrano gratis. Le formule vanno dal solo spazio con accesso ai giochi, alla formula con buffet e bevande, fino alla festa completa con allestimento per un massimo di 20 bambini; c'è anche la sala riservata solo a una festa. A parte si aggiungono animazione di due ore, truccabimbi, baby dance, magia e torte a tema.", sito: "https://www.tinyriminikids.it/" },
      { nome: "Chibia Parco Giochi", zona: "Rimini, Viserba", tipo: "parco giochi al coperto", descrizione: "Area coperta di circa 1000 mq con gonfiabili, uno scivolo alto 7 metri, percorsi a ostacoli e un'area baby recintata per i bimbi da 0 a 3 anni. Per le feste allestisce uno spazio dedicato, prepara il buffet e include l'accesso a tutti i giochi del parco.", sito: "https://www.chibiaparcogiochirimini.it/" },
      { nome: "Bowling Seventies", zona: "Cerasolo (Coriano)", tipo: "sala feste con playground", descrizione: "Centro divertimenti a Cerasolo (Coriano), vicino a Rimini, aperto dal 1970: 9 piste da bowling, biliardo, sala giochi, cocktail bar e cucina. Per i bambini c'è il Play Park, area morbida con scivoli, gonfiabili e labirinti, e lo short bowling con piste corte e palle leggere dai 4 anni. I pacchetti compleanno sono divisi per età (0-6, 7-10 e 11-17 anni) e comprendono decorazioni, buffet, animatori, il nome del festeggiato sullo schermo della pista e la torta della pasticceria interna. Il truccabimbi è a richiesta.", sito: "https://bowling-seventies.com/" },
      { nome: "Parcogiochi Paperopolis", zona: "Igea Marina (Bellaria Igea Marina)", tipo: "parco divertimenti", descrizione: "Parco giochi all'aperto nato negli anni Settanta in viale Ennio a Igea Marina, vicino al mare, con parcheggio nelle vicinanze. Ci sono reti e tappeti elastici, gonfiabili, autoscontri, due circuiti go-kart, bumper boats, trenino, minigolf, sala giochi e giro in pony. Le feste di compleanno durano tre ore, al pomeriggio sotto il pergolato o sul prato, oppure di sera da concordare; si può scegliere la festa fai da te o quella allestita dal parco, con molti extra. Da metà marzo apre su prenotazione per le feste, d'estate anche la sera.", sito: "https://paperopolis.it/" },
      { nome: "Aquafan", zona: "Riccione, a pochi chilometri da Rimini", tipo: "parco acquatico", descrizione: "Grande parco acquatico di Riccione, aperto d'estate dalle 10 alle 18.30. Per i più piccoli, fino a 1,40 m di altezza, ci sono la piscina dell'Elefante, con l'acqua alta al massimo 50 cm e tre mini scivoli adatti anche a 3–4 anni, e l'Antarctic Baby Beach con due mini scivoli; c'è anche un'area pic-nic. Nel 2026 i bambini fino a 100 cm entravano gratis e i biglietti online costavano meno che alle casse. Ombrelloni e lettini si noleggiano, anche online. Giorni di apertura e orari sono nel calendario del parco.", sito: "https://www.aquafan.it/", festa: false },
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
      { nome: "Dipark", zona: "Salerno, zona orientale", tipo: "ludoteca e sala feste", descrizione: "Centro gioco al coperto in viale Antonio Bandiera, a Salerno, su due piani climatizzati per 1200 mq. Ha un playground su tre livelli con scivoli, reti, tunnel e pareti di roccia, con aree separate per 1-4 e 5-11 anni, uno spazio relax per i genitori, una caffetteria e due parcheggi, uno gratuito. È aperto tutti i pomeriggi senza prenotazione, con tariffa a tempo. Per i compleanni ci sono sale dedicate, animazione, spettacoli dal vivo e oltre 20 feste a tema, e c'è anche una sala spettacoli.", sito: "https://www.dipark.it/" },
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
      { nome: "Youngo Nuova Darsena", zona: "Ferrara, centro commerciale Nuova Darsena (via Darsena)", tipo: "sala feste con playground", descrizione: "Sala giochi dentro il centro commerciale Nuova Darsena, in via Darsena 73 a Ferrara. Ha videogiochi arcade (corse, basket, air hockey, simulatori) e un playground per i più piccoli con scivoli, tunnel, palline e percorsi. Per i compleanni ci sono sale ampie e personalizzabili, con spazio festa riservato, accesso alle attrazioni, servizi inclusi e assistenza dello staff; la brochure delle feste si scarica dal sito. Aperto tutti i giorni dalle 11, sabato e festivi dalle 10, fino alle 21.", sito: "https://youngoshop.it/portfolios/nuova-darsena-ferrara/" },
      { nome: "Baby Park Happy Days", zona: "Ferrara, via del Commercio", tipo: "parco giochi al coperto", descrizione: "Centro ricreativo al coperto in via del Commercio 77 a Ferrara, gestito da un'associazione culturale. Ci sono gonfiabili, saltarelli, un playground e un campetto da calcio. Organizza feste a tema e compleanni, oltre a baby shower e comunioni, con animatori. Tra i servizi extra ci sono truccabimbi, buffet e travestimenti. Il sito indica l'apertura dalle 15:30; la disponibilità della sala si verifica con il modulo del sito o al telefono.", sito: "https://babyparkhappydays.it/" },
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
    aggiornata: "2026-11-15",
    rispostaBreve: "A Latina la festa di compleanno per bambini si fa soprattutto nei parchi giochi al coperto con gonfiabili e trampolini, nelle ludoteche con sala feste del centro e, con la bella stagione, negli spazi verdi dei borghi come Borgo Bainsizza. Ci sono anche formule di nicchia, come le feste a tema moda e spa dai 5 ai 12 anni, o pacchetti con area riservata in esclusiva e torta inclusa. Per le feste nel fine settimana conviene prenotare con qualche settimana di anticipo e chiedere subito cosa comprende il pacchetto (buffet, animazione, aree incluse nel gioco libero).",
    intro: "Latina è una città giovane e a misura di famiglia, dove tra centro, borghi e litorale non mancano gli spazi pensati per far festa con i più piccoli. Si va dai grandi parchi giochi al coperto, perfetti nei mesi freddi, ai giardini e alle piscine della campagna pontina per le feste all'aperto.",
    locali: [
      { nome: "Crazy Park", zona: "Latina, via Coletta", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto in via Coletta a Latina, con un'area gonfiabili per i bambini, un trampoline park dai 6 anni in su e una zona di realtà virtuale. C'è un'area food con bar, fasciatoio e guardaroba. Il pacchetto compleanno comprende un'area in esclusiva con assistenza, tovagliato colorato, torta scenografica e gioco libero nell'area comune, escluso il trampoline park. Su richiesta si aggiungono animazione, truccabimbi, magia, zucchero filato e popcorn. Giorni e orari di apertura escono ogni settimana sul profilo Instagram.", sito: "https://www.crazypark.it/" },
      { nome: "Tutti Giù per Terra", zona: "Latina, via dei Marruccini", tipo: "ludoteca e sala feste", descrizione: "Associazione con ludoteca che affitta una sala per i compleanni dei bambini, personalizzabile con tema, decorazioni e animazione. Organizza anche feste a tema con giochi gonfiabili e teatrini.", sito: "https://www.ludotecatuttigiuperterra.com/" },
      { nome: "Angolo Verde Mini Park", zona: "Borgo Bainsizza (Latina)", tipo: "sala feste con playground", descrizione: "Azienda agrituristica a Borgo Bainsizza, alle porte di Latina, aperta dal 2007: 10.000 m² di verde con tavoli all'ombra, barbecue, una zona giochi recintata per i bambini, piscina all'aperto e due campi da beach volley. Le feste si fanno nel parco, a bordo piscina o, d'inverno, nella sala interna di 100 m² con veranda di 50 m², che ha già tavoli, sedie e frigoriferi. Ci sono buffet pronti in tre misure. La piscina apre da giugno a settembre; da ottobre a maggio si va su prenotazione.", sito: "https://www.miniparklangoloverde.it/" },
      { nome: "La Petite", zona: "Latina, via Garigliano", tipo: "sala feste", descrizione: "Sala feste e kids spa a Latina, in via Garigliano, pensata per le feste delle bambine con le amiche. Le formule si chiamano Rituel, Petit e Super: kimono, maschera allo yogurt, skin care e pedicure per bambine, momento dance, angolo tisane e biscotti; nelle formule più ricche ci sono anche il make-up, la sfilata con abiti e accessori e la merenda. La festa dura 2 o 3 ore, in sala esclusiva, con invito digitale e foto ricordo. Ci sono anche momenti di relax con la mamma o la migliore amica. Si prenota su WhatsApp.", sito: "https://www.lapetite.it/" },
      { nome: "Indiana Park Latina", zona: "Latina, strada Cerasella", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura alle porte di Latina, aperto nei fine settimana. Ha sette percorsi sugli alberi, divisi per colore in base all'età: IndianaKid è pensato per i bambini da 2 a 6 anni circa. Oltre ai percorsi ci sono il tiro con l'arco e una pista per la mountain bike. Per gruppi e compleanni si chiede direttamente al parco.", festa: false },
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
    aggiornata: "2026-11-15",
    rispostaBreve: "A Monza la festa di compleanno per bambini si fa nelle sale dei centri sportivi in città; appena fuori città ci sono il trampoline park di Lissone, i parchi giochi al coperto di Bellusco e la fattoria di Concorezzo. Qualche esempio: il trampoline park di Lissone ha 1.200 m² con un'area feste riservata, mentre il parco al coperto di Bellusco offre 650 m² di gioco per bambini da 0 a 12 anni e un'area party di 150 m² divisa in salette. Prenota con anticipo i weekend d'autunno e d'inverno, quando le feste si spostano al chiuso, e metti i calzini antiscivolo nello zaino.",
    intro: "Monza unisce il verde del Parco e della Villa Reale a una Brianza ricca di spazi pensati per i bambini, tutti a pochi minuti d'auto. Per la festa si può restare in città oppure spostarsi nei comuni vicini, scegliendo tra gioco libero, salti, natura e animali.",
    locali: [
      { nome: "Sport Village Monza", zona: "Monza (zona Binario 7)", tipo: "sala feste", descrizione: "Centro sportivo che affitta per le feste la Sala Arancio, 170 m² con parquet e aria condizionata, e in primavera ed estate un giardino attrezzato con salottini e gazebo. Su richiesta propone allestimenti a tema con un partner.", sito: "https://www.sportvillagemonza.it/" },
      { nome: "Space Jump", zona: "Lissone", tipo: "trampoline park", descrizione: "Trampoline park di 1.200 mq a Lissone, in via Cimabue 41. Ci sono trampolini elastici, ostacoli e altre attrazioni, divisi tra la Space Zone dai 5 anni in su e il Baby Space da 1 a 5 anni. Per i compleanni c'è un'area feste accanto ai giochi, modulabile e senza un numero minimo di invitati, e la sala Space Party da avere in esclusiva, con bagno riservato. Per entrare non serve prenotare, ma le calze antiscivolo sono obbligatorie. C'è un bar con caffetteria per i genitori.", sito: "https://www.spacejump.it/" },
      { nome: "La Foresta Incantata", zona: "Bellusco", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto a tema foresta a Bellusco, per bambini da 0 a 12 anni, con 650 mq di gioco: scivoli, tunnel, gonfiabili, piscina di palline, aree morbide e percorsi avventura. Per le feste ci sono salette private, con formule fai da te o tutto incluso con pizza, focaccia e bevande; la torta si può ordinare, e quella da casa richiede il servizio taglio a pagamento. Ci sono anche serate con pizza e animazione. Ambiente climatizzato, bar e area relax per i genitori.", sito: "https://laforestaincantataparcogiochi.com/" },
      { nome: "La Camilla", zona: "Concorezzo", tipo: "fattoria didattica, spazi all'aperto", descrizione: "Agriturismo a Concorezzo, in Brianza, con un parco di oltre 70.000 mq, una fattoria, orti, frutteti e due laghetti. Per le feste di compleanno dei bambini ci sono sale riservate e il giardino: il buffet ha panini farciti, pizzette, succhi e dolci, e la torta si personalizza col pasticcere. All'aperto si fanno giochi di gruppo e si vanno a vedere gli animali della fattoria, come tartarughe, papere, conigli e cavalli. Il Giardino di Pietro ha anche una casetta gioco per i bambini.", sito: "https://www.lacamilla.it/" },
      { nome: "Acquaworld", zona: "Concorezzo, a pochi minuti da Monza", tipo: "parco acquatico al coperto e all'aperto", descrizione: "Parco acquatico in via La Pira a Concorezzo, vicino a Monza, aperto anche d'inverno. Per i bambini ci sono attrazioni come Baby Slide e Mini World, mentre alcune, tra cui Tiki Bay, riaprono a maggio 2027; il venerdì e il sabato alle 17 c'è il baby schiuma party. I bambini sotto gli 80 cm entrano gratis e non si può portare cibo da casa. Organizza compleanni con ingresso e merenda per gli invitati, area riservata in un punto ristoro e festeggiato gratis, da minimo 5 invitati e prenotati almeno 3 giorni prima; la torta si aggiunge a parte.", sito: "https://acquaworld.it/", },
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
    aggiornata: "2026-11-15",
    rispostaBreve: "A Bergamo la festa di compleanno per bambini si fa soprattutto nei parchi giochi al coperto in città e nei locali per famiglie con playground della provincia, mentre per chi vuole muoversi di più ci sono il parco trampolini di via Guzzanica e, a Capriate San Gervasio, Leolandia. Fantabosco accoglie bambini da 1 a 10 anni, e le feste a Leolandia sono pensate dai 3 anni in su con formule fino a 20 partecipanti. Prenotate con almeno due o tre settimane di anticipo, soprattutto se puntate al sabato o alla domenica.",
    intro: "Bergamo è una città a misura di famiglia, con spazi gioco al coperto a due passi dal centro e tante alternative nei comuni della provincia, dalla Bassa alla zona dei laghi. Che si cerchi un pomeriggio di scivoli e palline per i più piccoli o qualcosa di più movimentato per i grandi, le distanze sono brevi e le opzioni non mancano.",
    locali: [
      { nome: "Fantabosco", zona: "Bergamo, via Tadini", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto in via Luigi Tadini 21 a Bergamo, per bambini da 1 a 10 anni; i genitori entrano gratis. Ci sono scivoli a onde, percorsi a ostacoli, vasche di palline, gonfiabili, un'area morbida per i piccoli e un campo da calcio. Per le feste lo staff pensa ad addobbi, gadget e torte a tema, con tavolo riservato; musica, balli e trucco si aggiungono a parte, e si può affittare tutto il parco. Per i genitori area relax, bar e Wi-Fi gratuito. Venerdì e sabato sera c'è il giropizza. Aperto da mercoledì a lunedì; si prenota su WhatsApp.", sito: "https://www.fantaboscobergamo.com/" },
      { nome: "Mi gioco la pizza", zona: "Chiuduno (BG)", tipo: "sala feste con playground", descrizione: "Pizzeria e ristorante per famiglie a Chiuduno, a due minuti dal casello Grumello-Telgate dell'A4, con oltre 200 posti, Wi-Fi gratuito, nursery e ampio parcheggio. Il parco giochi al coperto ha un'area 0-6 anni e uno spazio 6-12 anni con percorso a ostacoli e piscina di palline; per i più grandi due calcio balilla e console. Per le feste di compleanno ci sono pacchetti per gruppi fino a 20, 30 o 40 persone con tavolo allestito, ingresso al parco, buffet e torta personalizzata, oppure una sala esclusiva.", sito: "https://www.migiocolapizza.com/" },
      { nome: "Zero-Gravity Bergamo", zona: "Bergamo, via Guzzanica", tipo: "trampoline park", descrizione: "Parco trampolini con formula festa privata pensata per bambini e ragazzi: comprende assistente dedicato, sala privata, allestimento e accesso alle aree trampolini, con calze antiscivolo per ogni partecipante.", sito: "https://www.zero-gravity.it/" },
      { nome: "Leolandia", zona: "Capriate San Gervasio (BG)", tipo: "parco divertimenti", descrizione: "Parco divertimenti in via Vittorio Veneto 52 a Capriate San Gervasio, con oltre 50 attrazioni per bambini e ragazzi. Per i compleanni ci sono pacchetti in base al numero di invitati: ingresso omaggio per il festeggiato, torta, tavolo riservato per il taglio, piattini e tovaglioli, e la salita sul palco con Leo e Mia, le mascotte del parco. Gli invitati entrano con un biglietto proprio. Esperienza consigliata dai 3 anni. Per una festa su misura c'è il servizio LeoConcierge; i posti al giorno sono limitati.", sito: "https://www.leolandia.it/" },
      { nome: "Parco Avventura Bergamo Torre Boldone", zona: "Torre Boldone, alle porte di Bergamo", tipo: "parco avventura con percorsi sugli alberi", descrizione: "Parco avventura ai piedi della Val Seriana, a Torre Boldone, a pochi minuti dal centro di Bergamo; ci si arriva anche con la linea 5 ATB, la TEB o la pista ciclabile. I percorsi sospesi sono aperti dai 3 anni compiuti e non serve prenotare. Chi non sale entra gratis nell'area parco, con parco giochi e fontana a spruzzi gratuiti e il ristorante Into The Woods. Organizza feste di compleanno per bambini dai 3 anni, con un'area dedicata, staff e proposte per torta e cibo: il preventivo si chiede al parco.", sito: "https://www.parchiavventurabergamo.it/", },
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
      { nome: "MUSE – Museo delle Scienze", zona: "Trento (quartiere Le Albere)", tipo: "museo", descrizione: "Museo delle Scienze di Trento, alle Albere. Con «Un compleanno bestiale» si festeggia tra animali, dinosauri, stelle e pianeti, con cacce al tesoro, percorsi a tappe ed enigmi divisi per età: per 0-5 anni c'è un'attività nel Maxi Ooh!, poi proposte per 6-8, 6-10 e il compleanno da detective per 8-10 anni. I compleanni si fanno dal martedì al sabato al pomeriggio, fino a 25 persone, con una sala per il taglio della torta. Si prenota per telefono almeno tre settimane prima; d'estate e durante le feste è sospeso.", sito: "https://www.muse.it/" },
      { nome: "Mart – Museo di arte moderna e contemporanea", zona: "Rovereto", tipo: "museo", descrizione: "Museo di arte moderna e contemporanea in corso Bettini 43 a Rovereto, con attività per famiglie: laboratori creativi, vacanze al museo e percorsi di visita per i più piccoli. Il «compleanno ad arte» si prenota il sabato per un massimo di 25 bambini dai 4 ai 12 anni: due o tre ore di attività ludiche e creative con gli operatori dell'Area educazione. Merenda e addobbi sono a carico delle famiglie. Il museo è chiuso il lunedì.", sito: "https://www.mart.tn.it/" },
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
    aggiornata: "2026-11-26",
    rispostaBreve: "A Vicenza la festa di compleanno per bambini si fa soprattutto in un parco giochi al coperto: Wonderwood Dino Camp, dentro il Centro Commerciale Palladio, ha due salette riservabili ed è pensato per bambini fino a 9-10 anni, mentre Jungle Jump, vicino all'uscita Vicenza Est, organizza feste con buffet e allestimento da scegliere passo dopo passo. Per il weekend conviene prenotare con anticipo e chiedere prima le regole su torta e cibo portati da casa.",
    intro: "Vicenza ha diversi spazi al coperto dove i bambini possono correre e arrampicarsi anche quando il tempo non aiuta. Per la festa di compleanno ci sono due parchi giochi con sale dedicate, comodi da raggiungere dalla città.",
    locali: [
      { nome: "Wonderwood Dino Camp Vicenza", zona: "Vicenza (Centro Commerciale Palladio)", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto a tema dinosauri al primo piano del Centro Commerciale Palladio, a pochi minuti dall'uscita A4 Vicenza Est, aperto tutti i giorni con poche eccezioni. Ci sono quattro livelli di scivoli, reti, tunnel e passaggi segreti, una vasca di palline, spazi per i bimbi da 0 a 3 anni, percorsi dai 3 anni e un bar bistrot per i grandi. Per il compleanno ci sono due salette riservate: i pacchetti con merenda comprendono ingresso al parco, spazio riservato, menù e bevande, fino a 40 invitati. Calze antiscivolo anche per gli adulti.", sito: "https://wonderwood.it/vicenza/" },
      { nome: "Jungle Jump Vicenza", zona: "Vicenza Est (via Zamenhof)", tipo: "parco giochi al coperto", descrizione: "Play park al coperto in via Zamenhof 703, a due minuti dall'uscita Vicenza Est, aperto dal martedì alla domenica con ampio parcheggio. Ci sono diverse aree gioco con salti, scivoli e tunnel. Le feste di compleanno si compongono passo dopo passo con il preventivatore online, scegliendo cibo, bevande e allestimento, con il servizio di catering del parco. D'estate organizza centri estivi per bambini dai 3 ai 10 anni. Fa anche cene di classe ed eventi privati, e affitta la sala.", sito: "https://junglejumpvicenza.com/" },
      { nome: "Teatro Astra – Famiglie a Teatro", zona: "Vicenza, contrà Barche 55", tipo: "teatro per bambini", descrizione: "Teatro in contrà Barche, a Vicenza, sede dal 1986 del Centro di produzione teatrale La Piccionaia. Con la rassegna «Famiglie a Teatro» la domenica pomeriggio diventa il momento del teatro dedicato ai bambini e ai genitori. La stagione 2026.27 ha una sezione dedicata alle famiglie, con le prime date da fine novembre 2026. Chi ha l'abbonamento alla stagione ha riduzioni anche sui biglietti di «Famiglie a Teatro».", sito: "http://www.teatroastra.it/", festa: false },
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
      { nome: "Kuni Kids Park", zona: "Bolzano (centro commerciale Twenty, via Galilei)", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto dentro il centro commerciale Twenty di Bolzano, gestito dalla cooperativa sociale Ki.Ba. Project, per bambini dai 3 agli 11 anni. Per il compleanno si può avere la sola sala, con gli amici e due adulti, oppure una festa con animazione seguita dal personale, per gruppi fino a 12 o fino a 18 bambini. I temi cambiano con l'età: principesse e cavalieri, magia, animali, circo, sirene e pirati, dinosauri, spazio, musica e sport. Il catering non è incluso. Si prenota almeno 7 giorni prima, chiamando il parco per la data.", sito: "https://www.kibaproject.it/" },
      { nome: "Ludoteca Il Bruco", zona: "Pineta di Laives", tipo: "ludoteca", descrizione: "Ludoteca a Pineta di Laives, nella zona produttiva Vurza, per bambini da 0 a 12 anni. Ha un'Area Soft per i più piccoli, un playground e una vasca di palline. Dal lunedì al venerdì fa baby sitting dalle 7 alle 18; d'estate c'è l'«Estate al Bruco». Nel weekend la sala si riserva per i compleanni: il pacchetto base comprende 3 ore negli spazi, l'allestimento con le decorazioni portate dalla famiglia, un piccolo buffet e le pulizie finali. Truccabimbi, mago e mascotte sono extra. Conviene prenotare un mese prima.", sito: "https://www.ludotecailbruco.it/" },
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
      { nome: "L'isola che ora c'è", zona: "Piacenza (via Beati)", tipo: "ludoteca e spazio gioco al coperto", descrizione: "Spazio gioco climatizzato a Piacenza, in via Beati 82, per bambini da 1 a 9 anni: un'area per i piccoli fino a 4 anni, aree per i 5-9 anni e un bar per i genitori. I compleanni si fanno da 1 a 8 anni, nelle salette, e la sera si può prenotare tutta la struttura per feste private o pizzate di classe. Su prenotazione ci sono il truccabimbi e il menù per celiaci. Le calzine antiscivolo sono obbligatorie e i passeggini non entrano. Prima di andare conviene mandare un WhatsApp: il locale può essere riservato alle feste.", sito: "https://www.lisolacheorace.it/" },
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
    aggiornata: "2026-11-15",
    rispostaBreve: "A Novara la festa di compleanno per bambini si fa nelle sale di un parco come il Parco della Mora, che affitta due sale con tavoli, frigorifero e bagno con fasciatoio affacciate su un parco giochi recintato, oppure al centro per famiglie Agorà, in via Cameri, che ha un'area feste accanto alla ludoteca e si prenota online. Per il weekend muovetevi con anticipo e chiedete sempre cosa è incluso nel prezzo: alla Mora le sale sono attrezzate con tavoli e frigorifero per merenda e torta, e il bar è proprio di fronte.",
    intro: "Novara è una città pianeggiante e comoda da girare, con spazi verdi e centri per le famiglie a pochi minuti da casa. Per il compleanno si può scegliere tra una sala affacciata su un parco giochi all'aperto e una ludoteca al coperto con area feste.",
    locali: [
      { nome: "Parco della Mora", zona: "Novara", tipo: "sala feste", descrizione: "Centro sportivo nel quartiere di Pernate, a Novara, dentro un parco recintato di circa 24.000 m² con giochi per bambini, nuovi da gennaio 2026: altalene, scivoli, castello, tazza girevole e tirolese. Per i compleanni affitta due sale colorate e riscaldate, con frigorifero, tavoli e sedie e un bagno con fasciatoio, a uso privato per il pomeriggio. Una ha una pergola coperta, l'altra un dehor che si affaccia sui giochi. Davanti alle sale c'è il bar, accanto al parco un ampio parcheggio; chi affitta la sala ha uno sconto sul campo da calcetto.", sito: "https://www.parcodellamora.it/" },
      { nome: "Agorà", zona: "Novara (via Cameri)", tipo: "ludoteca", descrizione: "Centro ricreativo per famiglie a Novara con ludoteca, playground, laboratori gratuiti organizzati periodicamente, scuola di musica, scuola di lingue, campus e un ristorante-bar accanto all'area gioco. Le feste di compleanno si fanno nell'area feste adiacente alla ludoteca, con uno spazio riservato: si può portare l'allestimento da casa oppure far apparecchiare il tavolo dallo staff con due colori a scelta. Il centro ha spazi interni ed esterni. Preventivo e richiesta di prenotazione si fanno online.", sito: "https://www.agoranovara.com/" },
      { nome: "Ondaland", zona: "Vicolungo, vicino a Novara", tipo: "parco acquatico", descrizione: "Parco acquatico a Vicolungo, in provincia di Novara, su un'area verde di 220.000 metri quadri. Ci sono discese a corpo libero e su gommoni, show, foam party e musical per i più piccoli, e dieci punti ristoro tra bar, ristoranti e chioschi. L'area Kids ha scivoli a velocità ridotta per bambini fino a 120 cm, zone di gioco a tema, barchette e un parco giochi all'asciutto. Apre d'estate e ora è chiuso fino alla prossima stagione: date e biglietti si controllano sul sito.", sito: "https://www.ondaland.it", festa: false },
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
      { nome: "Spazio Seme", zona: "Arezzo (via del Pantano, accanto alle Piscine Pantano)", tipo: "sala in affitto con animazione", descrizione: "Centro artistico in via del Pantano 36, ad Arezzo, fondato nel 2012. Propone corsi e laboratori per bambini, ragazzi e adulti: teatro, voce e canto, lettura di fiabe, danza, capoeira, yoga e altro. Ha due sale che si uniscono in un unico spazio di 220 metri quadrati, con bar, spazi esterni e spogliatoi attrezzati, e una capienza di 100 posti. Oltre ai corsi offre l'affitto delle sale e l'animazione per feste private: cosa comprende la festa va chiesto direttamente al centro.", sito: "https://www.spazioseme.com/" },
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
    aggiornata: "2026-11-26",
    rispostaBreve: "A Udine la festa di compleanno per bambini si fa in un parco giochi al coperto come il Bianconiglio Playland di via Tricesimo, con gonfiabili, area baby e pacchetti festa tutto compreso fino a tre ore (o la formula «fai da te» in una saletta accanto ai giochi), oppure in uno spazio più raccolto come la Fata dei Lillà, a Cussignacco, dove educatrici e psicomotriciste preparano feste su misura con giochi di movimento e musica, o si affitta solo la sala per bambini fino a 7 anni. Prenotate con anticipo e chiedete quali formule valgono nel weekend.",
    intro: "Udine è una città a misura di famiglia, con spazi per i bambini sparsi tra i quartieri. Per il compleanno si può scegliere tra un grande parco giochi al coperto, comodo con tanti invitati e in ogni stagione, e uno spazio più piccolo dedicato al movimento, pensato soprattutto per i più piccoli.",
    locali: [
      { nome: "Bianconiglio Playland & Cafè", zona: "Udine (via Tricesimo)", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto in via Tricesimo, a Udine, con 650 mq di gioco per bambini dai 12 mesi ai 10 anni: gonfiabili giganti, un playground di quattro piani, scivoli e un'area baby riservata ai piccoli fino a 36 mesi. C'è un bar per i genitori. Per il compleanno propone tre pacchetti tutto compreso oppure la formula «fai da te», con animazione e truccabimbi a richiesta. Organizza anche feste di classe e laboratori creativi. In luglio e agosto apre solo su prenotazione.", sito: "https://www.bianconiglio-playland.it/" },
      { nome: "Fata dei Lillà", zona: "Udine (Cussignacco)", tipo: "sala feste con animazione", descrizione: "Associazione di psicomotricità in via Decani di Cussignacco, a Udine, con percorsi di movimento, musica e gioco per bambini da 0 a 10 anni. Le feste sono costruite su misura da educatrici, psicomotriciste e insegnanti di movimento, con giochi musicali, cooperativi e piccoli laboratori, senza mascotte né animatori in costume: un educatore fino a 10 bambini, due fino a 24. Dai 5 anni la festa si può fare senza genitori. Si può anche affittare solo la sala, per bambini fino a 7 anni, con tavoli, frigo e musica: torta e merenda le porta la famiglia.", sito: "https://www.fatadeililla.it/" },
      { nome: "CSS – Contatto TIG in famiglia", zona: "Udine, Teatro Palamostre e Teatro S. Giorgio", tipo: "teatro per bambini", descrizione: "Rassegna domenicale di teatro per bambini e famiglie del CSS Teatro stabile di innovazione del Friuli Venezia Giulia, dentro il progetto «Udine città teatro per le bambine e i bambini». Gli spettacoli si tengono al Teatro Palamostre e al Teatro S. Giorgio; nella stagione 2026/27 ci sono, tra gli altri, «SDENG!» il 22 novembre 2026, «Dorita CosaSenti» il 29 novembre (dai 3 anni), «Pippi Calzelunghe» l'8 dicembre e «Nelle tasche di Mìmi» il 21 marzo 2027, pensato anche per i più piccoli. Nella stagione 2026/27 il biglietto costa 8 euro (6 euro per «Nelle tasche di Mìmi»). Prima di alcuni spettacoli al Palamostre c'è un laboratorio gratuito a cura di Damatrà, un'ora prima dell'inizio.", sito: "https://www.cssudine.it/", festa: false },
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
    aggiornata: "2026-11-15",
    rispostaBreve: "A Cesena la festa di compleanno per bambini si fa nel verde del Parco Rio Marano, che ha pacchetti compleanno dai 4 anni in su con gonfiabili e reti elastiche senza limiti di tempo e una merenda con la pizza, oppure al coperto in una ludoteca come Libera-mente, a Capannaguzzo, che riserva lo spazio per le feste con area gioco, angolo per torta e buffet e una caffetteria per i genitori. Prenotate per tempo e, se scegliete il parco, chiedete sempre cosa succede in caso di pioggia.",
    intro: "Cesena ha la campagna a pochi minuti dal centro, e per un compleanno è un vantaggio: si può festeggiare all'aperto in un grande parco giochi nel verde oppure in una ludoteca al coperto, comoda in ogni stagione. Due posti diversi, uno per chi vuole correre e saltare, l'altro per chi cerca uno spazio raccolto anche d'inverno.",
    locali: [
      { nome: "Parco Rio Marano", zona: "Cesena (via Vicinale Papa)", tipo: "parco giochi, spazi all'aperto", descrizione: "Parco giochi all'aperto di 3000 mq nel verde, sulle prime colline a pochi chilometri dal centro di Cesena, con bar, ristorante e pizzeria. Ha oltre 20 giochi: il Rio Tree Village tra gli alberi, gonfiabili, reti elastiche, mini kart, minigolf, castelli in legno, un'area recintata per i bimbi fino a 3 anni e tre caprette. I pacchetti compleanno, per bambini dai 4 anni, comprendono gonfiabili e reti senza limiti di tempo e una merenda con pizza, crocchette, panini, frutta e bibite; la torta si ordina al parco o si porta con lo scontrino.", sito: "https://www.riomaranocesena.it/" },
      { nome: "Libera-mente APS", zona: "Cesena (Capannaguzzo, via Capannaguzzo)", tipo: "ludoteca", descrizione: "Ludoteca e spazio ricreativo e sensoriale per bambini, con un'area gioco attrezzata con giochi adatti a tutte le età, una zona costruzioni, laboratori sensoriali e creativi e una caffetteria dove i genitori si siedono mentre i bambini giocano. Lo spazio si può riservare per le feste di compleanno e gli eventi in esclusiva, con l'area gioco, uno spazio per il taglio della torta e il buffet e un aiuto nell'organizzazione. È un'associazione di promozione sociale: al primo ingresso si fa l'iscrizione, che serve anche per l'assicurazione.", sito: "https://www.libera-mente-aps.it/" },
      { nome: "Atlantica", zona: "Cesenatico, sulla riviera (a circa 15 km da Cesena)", tipo: "parco acquatico", descrizione: "Parco acquatico a Cesenatico, aperto d'estate: per il 2026 le guide indicano l'apertura dal 6 giugno al 6 settembre, tutti i giorni dalle 9:30 alle 19. La zona bambini ha due piscine con scivoli e funghi d'acqua, e durante la giornata c'è l'animazione, con spazi per il miniclub.", festa: false },
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
    aggiornata: "2026-11-26",
    rispostaBreve: "A Lecce la festa di compleanno per bambini si fa soprattutto nelle sale feste appena fuori città, verso Cavallino: LuluParty ha 200 m² climatizzati con playground, area buffet e spazio per la torta e un pacchetto con assistenti in sala e baby dance, mentre il Magic Land di Castromediano organizza feste di due ore con gioco gonfiabile, piscine di palline per i più piccoli e due animatori fino a 20 bambini. Le sale si riempiono presto: prenotate con mesi di anticipo e chiedete cosa è incluso, perché cibo e torta di solito si aggiungono a parte.",
    intro: "Lecce è una città raccolta, e molte sale per le feste dei bambini stanno nei comuni attaccati alla città, a pochi minuti di macchina. Per il compleanno si può scegliere tra una sala grande con playground e un pacchetto con l'animazione, oppure una sala con gonfiabile e giochi guidati dagli animatori, pensata soprattutto per i più piccoli.",
    locali: [
      { nome: "LuluParty", zona: "Cavallino (via Miglietta), alle porte di Lecce", tipo: "sala feste con playground", descrizione: "Sala feste per bambini a Cavallino, in via Miglietta, alle porte di Lecce. La sala climatizzata di 200 m² con playground è riservata a una festa alla volta, nelle fasce di mattina, pomeriggio o sera. La formula base comprende due assistenti fino a 20 bambini, popcorn, l'invito digitale e una mascotte al taglio della torta. Menu per i bambini, rosticceria per gli adulti e torta si aggiungono a scelta, anche pochi giorni prima. Sul sito c'è un preventivatore: disponibilità e costo finale si confermano con la sala.", sito: "https://luluparty.it/" },
      { nome: "Magic Land", zona: "Castromediano (Cavallino), alle porte di Lecce", tipo: "sala feste con animazione", descrizione: "La sala feste per bambini della scuola di ballo Puerta del Sol, alle porte di Lecce. La festa dura due ore, più venti minuti per salutare gli ospiti, e comprende un operatore all'accoglienza, due animatori fino a 20 bambini, un gonfiabile da 3x3 metri, piscine di palline con tappeti antitrauma e la sala climatizzata, con un'area divani per i genitori. Non c'è una cucina interna: merenda e catering li sceglie la famiglia. C'è una sola festa al giorno e l'agenda si riempie anche 6-8 mesi prima.", sito: "https://www.puerta.it/sala-compleanni-feste-bambini/" },
      { nome: "Teatro Koreja", zona: "Lecce, via Guido Dorso 48/50", tipo: "teatro per bambini", descrizione: "Centro di produzione teatrale (Cantieri Teatrali Koreja) con sede in via Guido Dorso, a Lecce. Ogni anno propone «La stagione dei ragazzi e delle ragazze», con spettacoli per bambini e famiglie, e rassegne pomeridiane come «Teatro in tasca». Per la stagione 2026/27 ha aperto le iscrizioni ai laboratori teatrali: il «Cantiere dei piccoli» per bambini dai 6 ai 10 anni, il venerdì da fine settembre a fine maggio, un nuovo gruppo per ragazzi dagli 11 ai 13 anni (da 12 a 20 iscritti) e un gruppo per i 14-17 anni.", sito: "https://www.teatrokoreja.it/", festa: false },
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
      { nome: "Super Park", zona: "Dosson di Casier, alle porte di Treviso", tipo: "parco giochi al coperto con trampolini e kart", descrizione: "Parco giochi al coperto a Dosson di Casier, alle porte di Treviso, aperto il venerdì, il sabato e la domenica. Ha un'area bimbi da 1 a 6 anni di oltre 200 mq con un angolo relax per i genitori e, per i più grandi, trampolini, percorso ninja dai 9 anni, arena Nerf, kart dai 5 ai 16 anni, snow tubing e pattinaggio; d'estate c'è un'area acquatica all'aperto. Per il compleanno c'è uno spazio riservato con tre tavoli, l'accesso a tutte le attrazioni e un frigorifero per la torta; pizza e buffet si aggiungono a richiesta, addobbi esclusi.", sito: "https://superpark.fun/" },
      { nome: "La Fattoria di Geronimo", zona: "Merlengo di Ponzano Veneto, a pochi chilometri da Treviso", tipo: "fattoria didattica, spazi all'aperto", descrizione: "Fattoria didattica riconosciuta dalla Regione Veneto a Merlengo di Ponzano Veneto, con prato, bosco, cavalli, pony, daini, oche e rapaci. È aperta al pubblico solo durante gli eventi che organizza. La festa si fa all'aperto, con spazi coperti se serve, e comprende la visita guidata della fattoria, giochi creativi e animazione adatta all'età; lo staff aiuta a sorvegliare i bambini. Si fa sabato e domenica, con orari diversi secondo la stagione, ed è sospesa da giugno ad agosto per i centri estivi; alla conferma si versa una caparra.", sito: "https://www.ilrifugiodigeronimo.it/" },
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
      { nome: "Kids Park Como", zona: "Como, dentro il centro Driver (via Pasquale Paoli)", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto di circa 1.000 mq dentro il centro Driver, a Como, per bambini fino a 12 anni. Ci sono grandi playground a percorsi, una discesa con i gommoni, moto e macchinine elettriche in pista, un'area per i calci di rigore e uno spazio per i bimbi da 1 a 3 anni. Per il compleanno la sala è riservata per 3 ore con la tavola apparecchiata; cibo e bevande si ordinano al parco, da fuori si porta solo la torta. Calze antiscivolo obbligatorie e almeno un adulto accompagnatore.", sito: "https://www.kidsparkcomo.it/" },
      { nome: "Il Villaggio di Piedone", zona: "Binago, tra Como e Varese", tipo: "parco giochi al coperto con gonfiabili", descrizione: "Parco giochi al coperto in via Luigi Boffi, a Binago, tra Como e Varese, per bambini da 0 a 14 anni, aperto dal venerdì alla domenica. C'è un playground alto 7 metri con percorsi, ponti tibetani, scivoli e cannoni ad aria, due gonfiabili, una pista per tricicli e un'area per i bimbi fino a 3 anni. La festa più scelta comprende sala privata addobbata, torta di compleanno, merenda e tutti i giochi; si fanno anche feste a tema e giropizza il sabato sera. Calze antiscivolo obbligatorie per i bambini. Ci sono bar, ristorante e parcheggio gratuito.", sito: "https://ilvillaggiodipiedone.com/" },
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
      { nome: "Il Gatto e la Volpe", zona: "Gazzada Schianno, alle porte di Varese", tipo: "parco giochi al coperto", descrizione: "Parco giochi al coperto di 600 m² in via Gallarate a Gazzada Schianno, alle porte di Varese. Ha un'area recintata con giochi morbidi per i bimbi da 0 a 3 anni e una zona per i 3–11 anni con gonfiabili, scivoli, percorsi a ostacoli, tappeto elastico, vasca con le palline e un percorso di equilibrio; per gli adulti c'è un bar. Per la festa c'è un'area riservata con l'uso di tutti i giochi e diversi menu, quasi tutti da minimo 10 bambini, dal solo affitto della sala ai menu completi. Apre dal mercoledì alla domenica, dalle 15 alle 19.", sito: "https://www.ilgattoelavolpesrl.com/" },
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
      { nome: "Mara Meo", zona: "Lammari (Capannori), alle porte di Lucca", tipo: "pizzeria con sala feste", descrizione: "Pizzeria a Lammari, nel comune di Capannori, alle porte di Lucca, con altri due locali a Lucca e a Coreglia. Organizza feste di compleanno pomeridiane per bambini con stanza riservata, buffet, torta e pulizie comprese: tre pacchetti fino a 15 bambini, con un supplemento per ogni bambino in più; il più grande include il campino per calcio, pallavolo o giochi. L'animazione con giochi di squadra, baby dance e laboratori si aggiunge a parte. I prodotti sono certificati AIC e AILI. Alla prenotazione si chiede un acconto.", sito: "https://www.marameo-lucca.it/" },
      { nome: "Ristorante La Corte", zona: "Santa Maria a Colle, Lucca", tipo: "ristorante, spazi all'aperto con giochi", descrizione: "Ristorante di cucina toscana a Santa Maria a Colle, vicino a Lucca, in un ampio parco verde. Le feste di compleanno dei bambini si fanno nel gazebo che si affaccia sull'area giochi: parco giochi per i più piccoli, campo da calcio e scivolo gonfiabile per i più grandi. Le feste si fanno nei giorni feriali o in date da concordare. Per i ragazzi dai 12 ai 17 anni c'è la pizzata serale con giro pizza e bibite, e il ristorante può occuparsi della torta. Il listino dei pacchetti si chiede al ristorante.", sito: "https://www.ristorantelacortedadino.com/" },
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
      { nome: "KIDS", zona: "Grosseto, via Irlanda", tipo: "sala feste per bambini in esclusiva", descrizione: "Sala feste in via Irlanda, a Grosseto, affittata in esclusiva, con due ambienti climatizzati. La sala Baby, da 0 a 6 anni, ha un'area recintata su tappeto antitrauma con giochi morbidi e dondoli, una piccola arrampicata e un playground con ponte traballante e scivolo nella vasca di palline. La sala Kids, per tutte le età, ha scivolo gonfiabile, biliardino, air hockey e giochi giganti. Tutte e due hanno area buffet con frigo, carretto dei popcorn, angolo per le foto. I pacchetti si scelgono insieme, e gli inviti digitali a tema sono in regalo.", sito: "https://kidsgrosseto.it/" },
      { nome: "Joy Family Park", zona: "Grosseto, via del Terminillo", tipo: "parco giochi al coperto con sala compleanni", descrizione: "Parco giochi al coperto di 600 m² con area esterna, in via del Terminillo a Grosseto. Ci sono playground per i bambini, tappeti elastici, wipeout, giochi di abilità, due piste per auto radiocomandate e sale multigioco; per i genitori c'è un bar con aree relax dentro e fuori. L'ingresso è libero e in cassa si comprano i singoli giochi o pacchetti da un'ora o giornalieri. Ha una sala compleanni per feste su misura: il costo dipende dai servizi scelti. Apre dal martedì alla domenica dalle 16 alle 21; il lunedì solo per feste prenotate.", sito: "https://www.joyfamilypark.it/" },
      { nome: "Agriturismo Le Giare", zona: "Roselle (Grosseto), Strada del Bottegone", tipo: "agriturismo con parco giochi e ristorante", descrizione: "Agriturismo di oltre 12 ettari in Strada del Bottegone, a Roselle, vicino a Grosseto, con ristorante di cucina maremmana fatta in casa e prodotti a km zero. Ci sono piscina, campo da calcio, campo da pallavolo e un ampio parco giochi con castello gonfiabile, saltarello, scivoli per età diverse e altalena. Organizza feste di compleanno per bambini oltre a battesimi, comunioni e altri eventi, con la sala da pranzo allestita per l'occasione. La festa si concorda direttamente con la struttura.", sito: "https://agriturismolegiare.it/" },
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
      { nome: "Mama Party", zona: "Siracusa, via Elorina (zona sud)", tipo: "sala feste con playground e area baby", descrizione: "Sala feste in via Elorina 55, a Siracusa, nell'area commerciale della zona Bingo. Per i bambini c'è un'area giochi con un grande playground e un'area baby. La sala ospita compleanni, primi compleanni e feste a tema, con allestimenti curati su misura, animazione per bambini e adulti e catering a scelta, dall'aperitivo alla cena. Il locale è climatizzato e ha un ampio parcheggio riservato. Per vedere gli spazi si prende appuntamento per telefono o WhatsApp.", sito: "https://www.mamapartysiracusa.it/" },
      { nome: "Bowling Manhattan", zona: "Città Giardino (Melilli), viale Edoardo Garrone, a nord di Siracusa", tipo: "bowling con pacchetto compleanno", descrizione: "Centro bowling a Città Giardino, nel comune di Melilli, a nord di Siracusa, con 20 piste e sponde per far giocare da soli anche i più piccoli. Ci sono una sala giochi con cabinati, simulatori e flipper, tavoli da biliardo e una cucina aperta la sera con pizze e burger. Organizza feste per bambini con buffet, musica e partita a bowling, e al festeggiato regala un birillo personalizzato. È aperto tutti i giorni, dal pomeriggio nei feriali e dalla mattina nel weekend: orari e pacchetti si chiedono al telefono.", sito: "https://bowlingmanhattan.com", instagram: "https://www.instagram.com/bowlingmanhattan/" },
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
      { nome: "Fattoria Ca' Bianca", zona: "Ossalengo di Castelverde, a pochi minuti da Cremona", tipo: "fattoria didattica con compleanni in fattoria", descrizione: "Fattoria didattica di famiglia, attiva dal 1968, a Ossalengo di Castelverde, a pochi minuti da Cremona. Con gli AGRIcompleanni la fattoria resta riservata alla festa, con buffet preparato in cascina, animali e spazio per giocare; si festeggia tutto l'anno, d'inverno nel porticato riscaldato o nel salone interno per circa 35 persone. Si possono aggiungere un laboratorio di un'ora dai 3 anni, la torta contadina, palloncini e truccabimbi. Il prezzo vale per un minimo di 25 persone: la proposta si chiede su WhatsApp.", sito: "https://cabianca.eu/" },
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
      { nome: "MagicLand", zona: "Cosenza, via Barlaam di Calabria", tipo: "sala feste con area giochi e gonfiabili", descrizione: "Baby parking, ludoteca e sala feste in via Barlaam di Calabria, a Cosenza. L'area giochi morbida ha piscina di palline, scivoli, costruzioni giganti e gonfiabili su un tappeto antitrauma, sorvegliata dalle educatrici. Il pacchetto feste comprende la sala in esclusiva, il buffet, la torta, i palloncini e l'assistenza di un operatore; su richiesta si aggiungono animazione, allestimenti personalizzati e sweet table. C'è un'area food con servizio ai tavoli. Propone anche laboratori creativi e di cucina, baby parking a ore e campo estivo.", sito: "https://www.magiclandcosenza.it/" },
      { nome: "PlayTown Family Park", zona: "Rende, via Vittorio Bottego", tipo: "parco giochi al coperto con sala feste", descrizione: "Parco giochi al coperto costruito come una piccola città per bambini da 0 a 10 anni: una zona «Città» per giocare ai mestieri (ristorante, ospedale, pompieri) e una zona «Aeroporto» per il gioco di movimento, con gli animatori. Per le feste ci sono tre pacchetti: il base comprende inviti, percorsi di gioco, sala festa con animazione e menù a scelta, quelli superiori aggiungono laboratorio a tema, allestimento più ricco, sweet table e spettacolo. I menù dei bambini arrivano in box personalizzati, ci sono menù anche per i genitori e durante la festa la struttura è riservata agli invitati.", sito: "https://www.playtownrende.it/" },
      { nome: "Animagricola", zona: "Rende, contrada Isolette", tipo: "fattoria didattica e asineria con compleanni", descrizione: "Fattoria didattica e asineria in contrada Isolette a Rende, per bambini, scuole e famiglie. Gli animali sono asini, galline, pecore, conigli e caprette. I compleanni in fattoria prevedono giochi antichi, incontro con gli animali, giochi con la terra e le piante e pic-nic sul prato. C'è uno spazio interno coperto e attrezzato, così la festa si fa anche d'inverno o con il maltempo. Propone anche pomeriggi in fattoria con laboratori ogni settimana e campi estivi. La festa si prenota con il modulo del sito o per telefono.", sito: "https://www.animagricola.farm/" },
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
      { nome: "Sunrise Pizza", zona: "Caserta centro, via Roma", tipo: "pizzeria con area kids e pacchetti feste", descrizione: "Pizzeria in via Roma, nel centro di Caserta, con un'area kids colorata e protetta, con scivoli, percorsi e giochi morbidi, seguita dalle animatrici e consigliata per bambini dai 2 ai 9 anni. Per i compleanni ci sono due pacchetti con due animatrici, il playground, giochi di gruppo, l'apertura dei regali, un menù per i bambini (pizza oppure pasta e cotoletta con patatine), bibita, un dolce e un gadget per ogni bambino; servono almeno 15 bambini. Il locale ha anche una proposta senza glutine. Il preventivo si chiede alla pizzeria.", sito: "https://www.sunrisepizzacaserta.it/area-kids/" },
      { nome: "Meraviland", zona: "Puccianiello (Caserta), via Concezione", tipo: "ludoteca con playground e sala feste", descrizione: "Ludoteca con playground e sala feste dove i compleanni si fanno nell'area playground, con attrezzature e pavimenti protettivi e personale che sorveglia i bambini. Su richiesta si aggiungono animazione, catering e allestimenti a tema. Propone anche laboratori creativi e decorazioni con i palloncini.", sito: "https://meraviland.it/" },
      { nome: "Pharina", zona: "Capodrise, via Retella (al confine con Caserta e Marcianise)", tipo: "pizzeria con area bambini e sale per eventi", descrizione: "Pizzeria, ristorante e burgeria in via Retella 85, a Capodrise, al confine con Caserta, aperta tutte le sere dalle 19 a mezzanotte. Ha un'Area Kids per bambini dai 3 ai 9 anni con gonfiabili, giostre e tablet con app, dove giocano seguiti dalle animatrici mentre i genitori cenano. Per compleanni e cerimonie propone diverse soluzioni con gadget per tutti i bambini, e il preventivo si chiede online. Si mangia nelle sale interne o, nella bella stagione, in giardino.", sito: "https://www.pharinapizzaevents.com/" },
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
      { nome: "Il Giardino dell'Orco", zona: "Lago d'Averno, via Lago Averno (Pozzuoli)", tipo: "azienda agricola con fattoria didattica", descrizione: "Azienda agricola e fattoria didattica sul Lago d'Averno, a Pozzuoli. Organizza compleanni all'aperto tra prati e agrumeti, con il picnic sui tavoli o su coperte nel prato. Il programma può essere a scelta: giochi di campagna come la corsa nei sacchi e il tiro alla fune, una caccia al tesoro delle erbe spontanee con erbario e focaccine alle verdure, oppure un percorso sulle api e sul miele. Gli orari consigliati sono di mattina o di pomeriggio. Per gli adulti si chiede un preventivo per brunch, braciata o buffet.", sito: "https://www.ilgiardinodellorco.it/" },
      { nome: "Masseria Sardo", zona: "Lago d'Averno, via Montenuovo Licola Patria (Pozzuoli)", tipo: "agriturismo con eventi privati", descrizione: "Agriturismo in una tenuta agricola del Settecento sul Lago d'Averno, a Pozzuoli, con ristorante panoramico, orti, frutteti, B&B e un bar nel frutteto con amache, panche e tavoli. Ospita eventi privati come battesimi e comunioni, costruiti insieme alla famiglia senza pacchetti fissi, sulla terrazza vista lago, nei giardini o nelle sale interne. Il menù si personalizza, anche con proposte per bambini, e su richiesta ci sono animatori per i più piccoli. Nell'estate 2026 ha ospitato laboratori all'aperto per bambini con un ludobus.", sito: "https://masseriasardo.com/" },
      { nome: "Parco dei Laghi", zona: "Lucrino, via Circumlago (Pozzuoli)", tipo: "parco con area giochi, bar e ristorante", descrizione: "Parco a Lucrino, Pozzuoli, tra il Lago Lucrino e il Lago d'Averno, aperto tutto l'anno, con bar, ristorante, ristogarden, piscine e un parcheggio di circa 7.000 mq. Il parco giochi all'aperto, di circa 3.000 mq, ha superfici morbide e attrazioni per 0-4 e 5-12 anni; apre la sera, dalle 18. Tra i pacchetti per gli eventi c'è il party per bambini, da personalizzare. Non c'è un'area picnic: cibo e bevande da fuori non sono ammessi, e entrano al massimo 2 adulti per bambino.", sito: "https://parcodeilaghi.it/" },
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
      { nome: "Parco Giochi Pratogiardino", zona: "Viterbo, villa comunale di Prato Giardino, vicino al centro", tipo: "parco giochi con gonfiabili all'aperto", descrizione: "Parco giochi attivo dal 1993 dentro la villa comunale di Prato Giardino, a Viterbo, una villa storica nel verde. Ci sono un'ampia area gonfiabili, tappeti elastici, minikart, giostre, giochi automatici e un trenino che fa il giro della villa. Per i compleanni ci sono sconti e pacchetti su misura, il festeggiato riceve un regalo dallo staff e buffet e sala si prenotano al bar del parco. Lo staff noleggia anche gonfiabili a domicilio, con animazione e truccabimbi. Gli orari cambiano tra estate e inverno.", sito: "https://parcogiochiviterbo.it/" },
      { nome: "MGM Pool", zona: "Viterbo, Strada Castiglione", tipo: "centro piscina con sala feste e gonfiabili", descrizione: "Centro sportivo con piscina in strada Castiglione 51/A a Viterbo, con vasca di 20×10 metri, corsi di nuoto per bambini dai pochi mesi e acquafitness. Nel centro c'è una sala per feste con gonfiabili, dove si organizzano compleanni e feste a tema: lo staff aiuta a organizzarli. Ci sono anche un bar e una caffetteria. Pacchetti e disponibilità si chiedono direttamente al centro.", sito: "https://www.piscinamgm.it/" },
      { nome: "Toto's", zona: "Viterbo, via Genova, vicino al centro", tipo: "ristorante con sala per compleanni", descrizione: "Pub ristorante in stile scozzese in via Genova 32/E, a Viterbo, aperto dal 1989, a pranzo e a cena tutto l'anno, con hamburgeria, pizzeria e cucina senza glutine. Per i ragazzi dagli 8 ai 12 anni propone il compleanno post-scuola: un'intera sala riservata al festeggiato e agli amici, con l'animazione del locale, mentre i genitori restano tranquilli. Menù e torta si scelgono insieme allo staff. Organizza anche altre feste di compleanno ed eventi privati.", sito: "https://www.totospub.it/" },
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
      { nome: "Parco Avventura Erice", zona: "Erice, pineta di Martogna, a pochi minuti da Trapani", tipo: "parco avventura all'aperto", descrizione: "Parco avventura nella pineta di Martogna, a Erice, a pochi minuti da Trapani. Ha cinque percorsi sugli alberi: il Mini Junior, a meno di un metro da terra e percorribile anche senza imbragatura, è pensato per la scuola dell'infanzia e i primi anni della primaria. Ci sono anche tiro con l'arco, area giochi, area pic-nic e animali della fattoria. Per i compleanni c'è un pergolato coperto di circa 50 metri quadri a uso esclusivo, con frigo e percorsi a prezzo scontato. Nel 2026 apre sabato e domenica, su prenotazione.", sito: "https://www.parcoavventuraerice.it", },
      { nome: "Tenuta Pizzolungo", zona: "Erice, località Pizzolungo, ai piedi del monte e vicino al mare", tipo: "agriturismo e fattoria didattica", descrizione: "Agriturismo in contrada San Cusumano, a Pizzolungo di Erice, ai piedi del monte e a pochi metri dal mare. Propone il compleanno in fattoria nel giardino, tra gli alberi, dove i bambini possono vedere e avvicinare gli animali da cortile. Si può organizzare un giro sugli asinelli, e la direzione cura animazione e sorveglianza dei festeggiati. Per i più piccoli c'è anche il cammino dell'asino, un percorso tra mare e campagna. Per gli eventi ci sono gazebo in giardino e una cantina al coperto.", sito: "https://www.pizzolungo.com", },
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
      { nome: "Bowling Savona", zona: "Savona, via Trilussa", tipo: "bowling con area feste", descrizione: "Centro bowling in via Trilussa 13 rosso a Savona, a 200 metri dalla stazione. Ha 10 piste con le sponde per i bambini, videogiochi e giochi a punti, 7 biliardi e un servizio bar sempre aperto, con spuntini e panini. Organizza feste di compleanno con la formula B-Party, in un'area riservata e con l'aiuto dello staff. Apre dal lunedì al venerdì dalle 16, nei festivi e prefestivi dalle 14. Prezzi e pacchetti non sono indicati online: chiedeteli quando prenotate.", sito: "https://www.bowlingsavona.it/", instagram: "https://www.instagram.com/bowlingsavona/" },
      { nome: "Capriole sulle Nuvole", zona: "Savona, via Santa Lucia, vicino al centro storico e alla Darsena", tipo: "sala feste con animazione", descrizione: "Agenzia di animazione per bambini con una sala feste in via Santa Lucia 13R, nel centro di Savona, a due passi dalla Darsena. La sala è disponibile tutti i giorni, dal lunedì alla domenica, e ha un'area per il buffet degli adulti. La festa comprende sala e animazione: si scelgono il numero di animatrici, il tema e le attività, come giochi di movimento, trucca bimbi, palloncini e laboratori. L'allestimento si cura da sé o lo prepara l'agenzia, che fa anche feste a tema e noleggia gonfiabili.", sito: "https://capriolesullenuvole.it/", instagram: "https://www.instagram.com/capriole_sulle_nuvole/" },
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
    aggiornata: "2026-11-22",
    rispostaBreve: "A Busto Arsizio la festa di compleanno per bambini si può fare in fattoria da Erba Fina, in via Favana, tra animali, orto e laboratori, con un giardino e una serra al chiuso. A pochi chilometri, a Gallarate, c'è La Tana di Ninì, una ludoteca con laboratori creativi, uno spazio interno e il giardino. Prenotate con qualche settimana di anticipo, soprattutto per il fine settimana.",
    intro: "Intorno a Busto Arsizio le feste dei bambini si dividono fra la campagna, con gli animali e l'orto, e la ludoteca con i laboratori creativi. Conviene prenotare con anticipo per il fine settimana.",
    locali: [
      { nome: "Erba Fina", zona: "Busto Arsizio, via Favana", tipo: "fattoria didattica con spazi per feste", descrizione: "Fattoria didattica nata nel 2022 in via Favana, a Busto Arsizio, a qualche minuto dal centro: un bosco di robinie circonda i prati e piccoli animali vivono tra l'aia e l'orto. Le feste di compleanno per bambini possono avere laboratori creativi, esperienze con gli animali o nell'orto didattico, giochi sul prato e caccia al tesoro, guidati da operatori di fattoria didattica o da educatori. Per i ragazzi ci sono feste teen, come disco party o caccia al tesoro. D'estate propone le Settimane verdi.", sito: "https://www.erbafina.it", },
      { nome: "La Tana di Ninì", zona: "Gallarate, viale Milano, a pochi chilometri da Busto Arsizio", tipo: "ludoteca con laboratori e giardino per feste", descrizione: "Una ludoteca con laboratori creativi per bambini da 12 mesi a 10 anni, con uno spazio interno e un ampio giardino. Per i compleanni ci sono più formule: solo l'affitto degli spazi, la festa con allestimento a tema e animazione, oppure una festa con un allestimento più ricco. Si possono chiedere anche laboratori privati per il compleanno; gli spazi accolgono circa 25-30 persone." },
      { nome: "Ludoteca Wonderland", zona: "Gallarate, via Piceni, a pochi chilometri da Busto Arsizio", tipo: "ludoteca con sala feste e animazione", sito: "http://www.ludotecawonderland.it/", descrizione: "Ludoteca di Gallarate che il sito chiama «centro di cultura ludica». Per i compleanni propone l'animazione con giochi di gruppo e musicali, un'accoglienza con truccabimbi, magia comica e paracadute, e un buffet di pasticceria artigianale dolce e salata con la torta; allergie e intolleranze si segnalano alla prenotazione. Per gli adulti c'è una sala separata. Le feste non si sovrappongono: ogni festa ha la sala in esclusiva. I prezzi non sono pubblicati: si chiede un preventivo." },
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
      { nome: "BabyCSI", zona: "Carpi, via Lombardia", tipo: "parco giochi al coperto con sale feste", descrizione: "Centro ludico motorio di Csi Carpi Sport in via Lombardia, a Carpi, per bambini fino a 11 anni. In 850 metri quadri ci sono un castello gioco su tre piani, tre tappeti elastici, due gonfiabili, un campo da calcio e un'area soft fino a 6 anni con percorso di psicomotricità e scivolo nella piscina di palline. Le feste si prenotano dal martedì alla domenica pomeriggio con almeno 10 bambini paganti, in salette riservate: i pacchetti comprendono allestimento, buffet e torta personalizzata, con invito digitale e un gadget per ogni bambino.", sito: "https://www.babycsi.it/wp/", },
      { nome: "Coopernuoto, piscina Campedelli", zona: "Carpi, piazzale delle Piscine", tipo: "piscina con corsi di nuoto e feste di compleanno", descrizione: "Piscina di Carpi in piazzale delle Piscine, gestita da Coopernuoto, con vasche coperte (anche una vasca bambini a 31 gradi) e d'estate un impianto all'aperto con vasca ludica e scivolo. Le feste di compleanno si fanno da settembre a maggio la domenica mattina in vasca coperta, nella vasca baby o in quella dei corsi, con scivoli e ciambelloni. Nella stagione 2026/27 costa 6 euro a bambino da 4 a 13 anni e 8 euro da 14 a 17; il festeggiato entra gratis. Il buffet si concorda con il bar della piscina.", sito: "https://www.coopernuoto.it/carpi/", },
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
      { nome: "Coccolandia Imola", zona: "Imola, via Calamelli", tipo: "parco giochi al coperto con salette per le feste", descrizione: "Associazione con un parco giochi al chiuso in via Calamelli, a Imola. Per i bambini da 1 a 12 anni ci sono un gonfiabile grande, un playground, quattro tappeti elastici e un campetto multigioco; per quelli da 1 a 3 anni un'area baby con gonfiabile e playground. È aperto tutti i giorni dalle 15.30 alle 19. Per i compleanni ci sono salette con accesso all'area giochi: il personale allestisce la sala con il tema e i colori scelti, fornisce le stoviglie e la pulizia finale è compresa.", sito: "https://www.coccolandiaimola.it", instagram: "https://www.instagram.com/coccolandiaimola/" },
      { nome: "Imola Musei, Buon compleanno al Museo", zona: "Imola, centro storico", tipo: "museo con laboratorio per feste di compleanno", descrizione: "Festa di compleanno nei musei civici di Imola, al Museo San Domenico (via Sacchi 4) o a Palazzo Tozzoni (via Garibaldi 18), per bambini dai 6 ai 12 anni. Si sceglie tra diverse proposte e un operatore didattico guida i giochi; si possono invitare fino a 24 amici. Si festeggia il venerdì, il sabato o la domenica pomeriggio e la festa dura due ore. Nelle proposte 2026 il costo è di 110 euro fino a 17 partecipanti e di 150 euro da 18 a 25. Si prenota almeno 15 giorni prima, per email o per telefono.", sito: "https://imolamusei.it/", },
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
      { nome: "New Joy Village", zona: "Pordenone, zona via Nuova di Corva", tipo: "ludoteca con sale feste riservate", descrizione: "Centro con ludoteche per le feste in via Di Vittorio 1/E a Pordenone, per bambini fino a 11 anni. La festa è in esclusiva, con una coordinatrice di sala dedicata. Nelle sale ci sono in tutto 9 gonfiabili, 3 playground con scivoli e vasca di palline, tappeti elastici, air hockey, calcetti e un percorso laser; la ludoteca verde, di 350 mq, ha anche pareti di arrampicata e una zona baby. Ci sono formule con pizza o hamburger, e pulizie e inviti sono inclusi. Si riceve solo su appuntamento, tutti i giorni fino alle 22:30.", sito: "https://newjoyvillage.it/", },
      { nome: "Fable Table", zona: "Fontanafredda, viale Venezia, a pochi minuti da Pordenone", tipo: "pizzeria con area bimbi e feste di compleanno", descrizione: "Pizzeria per famiglie in viale Venezia 85 a Fontanafredda, a pochi minuti da Pordenone, con pizze, piatti, dolci fatti in casa e, nel fine settimana, colazioni e brunch. L'area giochi interna supera i 100 metri quadri, con gonfiabili, playground e mattoncini giganti; d'estate c'è anche un'area giochi esterna con tavoli e sedie. Per i compleanni ci sono proposte già pronte o su misura, con pulizie incluse; la torta si porta da casa o si ordina al locale. C'è un ampio parcheggio. Area giochi e feste sono su prenotazione.", sito: "https://fabletable.it/", },
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
      { nome: "Il Sesto Regno", zona: "Sesto San Giovanni, via Mazzini", tipo: "ludoteca con area bimbi e sale feste a tema", descrizione: "Ludoteca a tema fantasy a Sesto San Giovanni: di pomeriggio è una giocheria per bambini, la sera una ludoteca di giochi da tavolo per adulti. L'area bimbi ha scivolo, saltarello, gonfiabili, playground e un'area baby per i più piccoli. Ci sono quattro salette a tema per compleanni e occasioni speciali, con formule diverse e anche la festa su misura con menù personalizzato. Si può fare una pizzata mentre i bambini giocano. La giocheria apre dal martedì al venerdì 16-19, sabato e domenica anche 10-13.", sito: "https://ilsestoregno.it", },
      { nome: "Al Villaggio", zona: "Sesto San Giovanni, via Cavallotti", tipo: "associazione sportiva con saletta e salone per feste", descrizione: "Associazione sportiva in via Felice Cavallotti 226 a Sesto San Giovanni che affitta i suoi spazi per le feste dei bambini da 0 a 11 anni, anche a chi non è socio. Ci sono più pacchetti, dalla «festa fai da te» in su, tutti con il locale in esclusiva per tre ore: si sceglie la saletta con area giochi e spazio esterno, oppure anche il salone. Tavoli, sedie, frigorifero e pulizie sono compresi. Su richiesta c'è l'animazione per i più piccoli. Si prenota per email o su WhatsApp.", sito: "https://www.alvillaggioasd.it/", instagram: "https://www.instagram.com/al_villaggio/" },
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
      { nome: "Agorateca", zona: "Altamura, via Stefano Lorusso", tipo: "biblioteca di comunità con laboratori e feste di compleanno", descrizione: "Biblioteca di comunità in via Stefano Lorusso, ad Altamura, con giardino e orto urbano e letture ad alta voce per i più piccoli curate dai volontari. Per i compleanni offre uno spazio interno ed esterno dove passare il pomeriggio tra letture ad alta voce e laboratori creativi. Gli allestimenti usano materiali naturali e sostenibili, con festoni, stoviglie e inviti su carta riciclata, e ai genitori si chiede il tema preferito del festeggiato. Torta e merenda le preparano le famiglie.", sito: "https://www.agorateca.it", instagram: "https://www.instagram.com/agoratecaaltamura/" },
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
      { nome: "Youngo Aprilia2", zona: "Aprilia, centro commerciale Aprilia2, sulla Pontina", tipo: "parco giochi al coperto con sale compleanni", descrizione: "Store Youngo dentro il centro commerciale Aprilia2, sulla Pontina (SS148, km 44). Ha un playground con scivoli, tunnel, palline e percorsi avventura, giostrine, videogiochi arcade come racing, basket e air hockey, e la realtà virtuale. Per i compleanni ci sono sale ampie e personalizzabili: la festa comprende lo spazio riservato, l'accesso alle attrazioni e l'assistenza dello staff. Ad Aprilia2 la festa non si prenota online: si manda la richiesta dal sito o si telefona. Apre dal lunedì al venerdì 13-20, sabato e festivi 10-21.", sito: "https://youngoshop.it/portfolios/aprilia2-aprilia-latina/", },
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
      { nome: "Parco Giochi Arlecchino", zona: "Vigevano, via Santa Maria", tipo: "parco giochi al coperto con sale feste", descrizione: "Parco giochi al coperto in via Santa Maria 31 a Vigevano, riscaldato e climatizzato. Ci sono la grande foresta con i percorsi, uno scivolo e un castello gonfiabili, una pista di mini go kart a gettoni, una mini sala giochi, un tappeto interattivo e un'area per i bimbi fino a tre anni. Per i compleanni ha cinque salette a tema (circo, igloo, giungla, sottomarino, castello) e ospita anche battesimi, comunioni e feste di fine anno. C'è un bar interno. Apre dal martedì alla domenica, di pomeriggio.", sito: "https://www.parcogiochiarlecchino.it/", instagram: "https://www.instagram.com/parcogiochiarlecchino_vigevano/" },
      { nome: "Leopark", zona: "Vigevano, viale Leopardi", tipo: "pizzeria con gonfiabili e sala feste", descrizione: "Ristorante, pizzeria e bistrot in viale Leopardi 19 a Vigevano, con un parco giochi sorvegliato di 300 metri quadri, gratuito per chi pranza o cena. Ha sale grandi, zone all'aperto e un menù per bambini, e si può chiedere un tavolo vicino all'area bimbi. Organizza compleanni e feste a tema su misura, con tavoli allestiti e il parco giochi a disposizione dei piccoli. È aperto a pranzo tutti i giorni e a cena venerdì, sabato e domenica; si prenota anche su WhatsApp.", sito: "https://www.leopark.it", },
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
      { nome: "Fattoria La Cinta", zona: "Benevento, in campagna alle porte della città", tipo: "fattoria didattica con spazio per feste", descrizione: "Fattoria didattica e casa di campagna in contrada San Vitale, sulla collina alle porte di Benevento: cinque ettari con orto, vigna, oliveto e bosco. Ci sono asini, pecore, una capra, un cavallo e due maiali, un molino in pietra, i laboratori del formaggio e un'aula didattica che accoglie fino a 50 persone. Le visite didattiche sono pensate per l'età dei bambini e durano una giornata, con al massimo 50 bambini. Il sito non parla di feste di compleanno: chiedetelo direttamente alla fattoria.", sito: "https://fattorialacinta.it/", festa: false },
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
      { nome: "Casale Traiano", zona: "Fiumicino, lungo via Portuense", tipo: "agriturismo biologico in campagna, con animali e feste di compleanno", descrizione: "Agriturismo in un casale ottocentesco in via Portuense 2380, nella campagna di Fiumicino, con ristorante e pizzeria romana col forno a legna. Usa ingredienti biologici dei suoi orti e di produttori locali. Per i bambini ci sono la fattoria didattica, laboratori, giochi all'aperto e passeggiate con gli animali, oltre alle aree pic-nic. Le feste di compleanno si fanno nei giardini o nelle sale interne, con menu a buffet o serviti per tutte le età; il menu si personalizza. Prezzi e disponibilità si chiedono al casale.", sito: "https://www.casaletraiano.it/", },
      { nome: "Buffalo Kids 2.0", zona: "Fiumicino, via Valderòa", tipo: "pizzeria e braceria con gonfiabile, campetto e playground interni", descrizione: "Ristorante, braceria e pizzeria di cucina romana in via Valderòa 117 a Fiumicino, con un parco giochi interno per i bambini. In menu ci sono soprattutto carni alla brace, come fiorentina, tomahawk, arrosticini e tagliate, oltre alle pizze. Organizza feste di compleanno nei suoi spazi. È aperto dal martedì alla domenica dalle 19:30 alle 23, e da ottobre anche la domenica a pranzo. Per i dettagli della festa, giochi compresi, conviene telefonare.", sito: "https://buffalokids2.it/", },
      { nome: "Parco Avventura Fregene", zona: "Fregene, frazione di Fiumicino, nella pineta di via della Veneziana", tipo: "centro sportivo all'aperto: parco avventura nella pineta con feste di compleanno", descrizione: "Parco avventura nella pineta di Fregene, in via della Veneziana, con percorsi acrobatici divisi per altezza: Baby sotto i 115 cm, Junior da 115 a 139 cm e Adulti. Ci sono anche fattoria didattica, mini golf, go kart a pedali, area pic-nic e un'osteria. Per le feste si compone il pacchetto online: percorsi, una seconda attività come caccia al tesoro o laboratorio di bolle di sapone, buffet e, se si vuole, un istruttore dedicato. Serve un acconto. L'ingresso è libero; da novembre a febbraio apre sabato, domenica e festivi.", sito: "https://www.parcoavventurafregene.it/", },
    ],
    faq: [
      { domanda: "C'è un posto al coperto per una festa d'inverno a Fiumicino?", risposta: "Sì: Buffalo Kids 2.0 ha uno spazio giochi interno con gonfiabile, campetto e playground, riservato alla festa il pomeriggio. Il Parco Avventura di Fregene invece è all'aperto: va bene nella bella stagione." },
      { domanda: "Per che età vanno bene?", risposta: "Al Parco Avventura di Fregene i percorsi dipendono dall'altezza: Baby sotto i 115 cm, Junior da 115 a 139 cm. Casale Traiano propone feste per tutte le età. Per Buffalo Kids 2.0 dite l'età dei bambini quando prenotate." },
      { domanda: "Posso portare la torta?", risposta: "Al Parco Avventura di Fregene chi festeggia con le loro formule può lasciare la torta nei frigoriferi del parco, se c'è posto. Per Casale Traiano e Buffalo Kids 2.0 le fonti non lo dicono: chiedetelo quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "forli",
    citta: "Forlì",
    aggiornata: "2026-11-15",
    rispostaBreve: "A Forlì la festa di compleanno per bambini si fa al coperto da Happyland, il parco giochi dietro il Palafiera di via Punta di Ferro, con gonfiabili e attrazioni per bambini da 0 a 10 anni. Nella bella stagione c'è anche Gommolandia, la città gonfiabile all'aperto nel Parco Urbano Franco Agosto, con sconti per le feste di compleanno.",
    intro: "A Forlì le feste per bambini si dividono tra il grande parco giochi al coperto vicino alla Fiera, buono tutto l'anno, e i gonfiabili all'aperto del Parco Urbano, per la primavera e l'estate. Qui trovate tutti e due, con quello che dicono le fonti.",
    locali: [
      { nome: "Happyland", zona: "Forlì, via Punta di Ferro, dietro il Palafiera", tipo: "parco giochi al coperto con gonfiabili e area per i più piccoli", sito: "https://www.happylandforli.it/", descrizione: "Parco giochi al coperto in via Punta di Ferro, dietro il Palafiera di Forlì, aperto nel 2008: circa 1.500 m² di giochi per bambini da 0 a 10 anni, in un open space dove i genitori li vedono giocare. C'è un'area per i bimbi fino a 3 anni con piscina di palline, un gonfiabile e pavimento imbottito, oltre a un'area ristoro e un ampio parcheggio gratuito. Apre da settembre a giugno, escluso lunedì e martedì, dalle 15.30 alle 19.20. Per il compleanno c'è una saletta riservata con tavolo, 20 posti e inviti; minimo 10 bambini." },
      { nome: "Gommolandia", zona: "Forlì, Parco Urbano Franco Agosto, viale dell'Appennino", tipo: "parco giochi gonfiabile all'aperto nel parco urbano", descrizione: "Una città gonfiabile all'aperto dentro il Parco Urbano Franco Agosto, la più conosciuta di Forlì. È aperta tutti i giorni nella bella stagione, tempo permettendo, con l'orario estivo fino a sera, e fa sconti speciali per le feste di compleanno e per le scolaresche. Essendo all'aperto, va bene da primavera a fine estate." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno d'inverno a Forlì?", risposta: "Al coperto da Happyland, il parco giochi dietro il Palafiera di via Punta di Ferro, con gonfiabili e attrazioni per bambini fino a 10 anni. Gommolandia invece è all'aperto: va bene nella bella stagione." },
      { domanda: "Per che età vanno bene?", risposta: "Happyland è pensato per bambini da 0 a 10 anni e ha uno spazio per i più piccoli. Per Gommolandia le fonti non danno un'età precisa: chiedete quando prenotate." },
      { domanda: "Quanto costa?", risposta: "Happyland indica sul suo sito un prezzo per ogni bambino invitato, con un minimo di bambini; Gommolandia fa sconti per i compleanni. I prezzi cambiano: chiedete sempre un preventivo scritto." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "ancona",
    citta: "Ancona",
    aggiornata: "2026-11-26",
    rispostaBreve: "Ad Ancona la festa di compleanno per bambini si fa in una sala feste con gonfiabili, come Magic Land alla Baraccola Nord, oppure in un parco giochi al coperto come Playland in via Achille Grandi, oltre 800 mq per bambini da 0 a 13 anni con sale riservate alle feste. Tutti e due sono al chiuso, quindi vanno bene tutto l'anno.",
    intro: "Ad Ancona gli spazi per le feste dei bambini stanno soprattutto nella zona della Baraccola e verso Ancona sud, comodi da raggiungere in auto. Qui trovate una sala feste con gonfiabili e area morbida e un grande parco giochi al coperto.",
    locali: [
      { nome: "Magic Land", zona: "Ancona, Baraccola Nord, via Vecchia del Pinocchio", tipo: "sala feste con gonfiabili e area morbida", sito: "https://salafesteancona.it/", descrizione: "Sala feste climatizzata alla Baraccola di Ancona, con parcheggio. Nella parte per i bambini, Magic Land, ci sono gonfiabili professionali con salta salta e scivoli, un'area morbida per i piccoli da 0 a 3 anni, LEGO giganti e biliardino, su circa 250 mq. Si affitta una delle due sale o tutto lo spazio, la mattina, il pomeriggio o la sera. I pacchetti comprendono allestimento, animazione e merenda a buffet; su richiesta anche torta, palloncini e catering. Nello stesso posto c'è Space, per le feste dei grandi." },
      { nome: "Playland", zona: "Ancona, via Achille Grandi", tipo: "parco giochi al coperto con sale feste", descrizione: "Un parco giochi al coperto di oltre 800 mq per bambini da 0 a 13 anni e i loro accompagnatori, con sale riservate alle feste di compleanno. Le guide locali delle famiglie di Ancona lo citano tra le sale feste della città, con animazione e catering." },
      { nome: "Museo Tattile Statale Omero", zona: "Ancona, Mole Vanvitelliana (Banchina Giovanni da Chio 28)", tipo: "museo con laboratori per bambini", descrizione: "Museo tattile statale nella Mole Vanvitelliana, ad Ancona, dove le opere d'arte si possono esplorare con le mani; l'ingresso al museo è gratuito, mentre la collezione Design è a pagamento. Per le famiglie organizza laboratori su prenotazione, divisi per età (4-9 anni e dai 9 anni in su). Nel 2026 ha proposto, tra gli altri, l'indagine tattile al buio «Indovinello al museo» il 18 gennaio, la visita animata «Oggetti naufragati» per bambini dai 6 ai 10 anni a fine settembre e il laboratorio «Storie da toccare» al Green Loop Festival di ottobre (5 euro nel 2026, gratis fino a 4 anni). È aperto dal martedì al sabato il pomeriggio e la domenica tutto il giorno.", sito: "https://museoomero.it/", festa: false },
      { nome: "Marche Teatro – Aperdita d'occhio", zona: "Ancona, Teatrino del Piano e Teatro Sperimentale", tipo: "teatro per bambini", descrizione: "«Aperdita d'occhio» è la stagione di teatro per bambini e famiglie di Marche Teatro, il teatro stabile che gestisce anche il Teatro delle Muse di Ancona. Gli spettacoli si tengono al Teatrino del Piano e al Teatro Sperimentale. L'edizione 2026-27 è la 46ª ed è partita il 9 ottobre 2026. Titoli, orari e prezzi dei singoli spettacoli vanno controllati sul calendario del sito.", sito: "https://www.marcheteatro.it/", festa: false },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini ad Ancona?", risposta: "In una sala feste con gonfiabili come Magic Land alla Baraccola Nord, oppure in un parco giochi al coperto come Playland in via Achille Grandi. Sono tutti e due al chiuso." },
      { domanda: "Per che età vanno bene?", risposta: "Playland accoglie bambini da 0 a 13 anni. Magic Land è pensata per le feste dei bambini, con area morbida per i più piccoli: dite l'età quando prenotate." },
      { domanda: "Cosa comprende la festa?", risposta: "Magic Land propone pacchetti con allestimento, animazione e merenda a buffet. Per Playland le guide parlano di animazione e catering: fatevi dire per iscritto cosa è compreso, torta inclusa." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "la-spezia",
    citta: "La Spezia",
    aggiornata: "2026-11-16",
    rispostaBreve: "Alla Spezia la festa di compleanno per bambini si fa al coperto: al Padre Dionisio Sporting Club, sui colli, con un'area giochi riscaldata con gonfiabili, playground e parete di arrampicata, oppure da Patapan, a Bragarina, un parco giochi al coperto con tre sale per le feste. Tutti e due vanno bene in ogni stagione: chiedete per tempo date libere e cosa comprende il prezzo.",
    intro: "Alla Spezia gli spazi privati per le feste dei bambini sono pochi ma al coperto, quindi buoni anche d'inverno. Qui trovate un parco giochi dentro un centro sportivo sui colli, con ristorante e parcheggio, e un parco giochi al chiuso nel quartiere di Bragarina.",
    locali: [
      { nome: "Padre Dionisio Sporting Club", zona: "La Spezia, via dei Colli", tipo: "parco giochi al coperto con gonfiabili e feste di compleanno", sito: "https://www.padredionisiosportingclub.it/", descrizione: "Centro sportivo in via dei Colli 132, sulle colline della Spezia con vista sul golfo. Oltre a due campi da padel e un campo da calcio a 5, ha un parco giochi coperto e riscaldato con gonfiabili, playground, parete di arrampicata, area kids, palco per la baby dance e biliardini, più un'area giochi esterna. Ci sono bar, ristorante pizzeria e parcheggio, ed è aperto tutto l'anno. Per i compleanni c'è un menù base con focacce, pizza, bevande e apparecchiatura a buffet: il prezzo si controlla col centro." },
      { nome: "Patapan", zona: "La Spezia, Bragarina (via Sardegna)", tipo: "parco giochi al coperto con sale feste", sito: "https://www.patapanlaspezia.it/", descrizione: "Parco giochi al coperto nel quartiere di Bragarina, aperto nel 2016. Il sito parla di un playground di 200 mq su due livelli, con percorsi di gioco e sensoriali, e di tre sale per le feste di compleanno, riscaldate e climatizzate. Su richiesta ci sono giornate a tema con truccabimbi, baby dance e animazione. I bambini devono essere accompagnati da un adulto; orari e disponibilità si chiedono direttamente al parco." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini alla Spezia?", risposta: "Al coperto, in uno dei due parchi giochi che organizzano compleanni: il Padre Dionisio Sporting Club in via dei Colli, con gonfiabili e parete di arrampicata, oppure Patapan a Bragarina, con tre sale per le feste." },
      { domanda: "Vanno bene anche d'inverno?", risposta: "Sì: tutti e due sono al chiuso. L'area giochi del Padre Dionisio è riscaldata e le sale di Patapan sono riscaldate e climatizzate." },
      { domanda: "Quanto costa la festa?", risposta: "Il sito del Padre Dionisio Sporting Club indica feste a partire da 220 euro (prezzo letto a novembre 2026). Per Patapan il prezzo si chiede al parco. In ogni caso fatevi scrivere cosa è compreso: numero di bambini, merenda, torta e durata." },
      { domanda: "Fino a che età si può giocare?", risposta: "Al Padre Dionisio i giochi sono riservati a chi non ha ancora compiuto 13 anni. Da Patapan serve sempre un adulto che accompagna: dite l'età dei bambini quando prenotate." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "catanzaro",
    citta: "Catanzaro",
    aggiornata: "2026-11-17",
    rispostaBreve: "A Catanzaro la festa di compleanno per bambini si fa al coperto: da A Casa di Topolino, in viale Lucrezia della Valle, un'area giochi con playground e una sala feste di circa 450 mq, oppure alla Bacchetta Magica, in via dei Conti Ruffo, mille metri quadrati tra parco giochi, ludoteca e baby parking. Chiedete per tempo le date libere e fatevi scrivere cosa comprende il prezzo.",
    intro: "A Catanzaro gli spazi dove festeggiare un compleanno con molti bambini sono al chiuso, quindi vanno bene tutto l'anno. Qui trovate due parchi giochi al coperto con il loro sito ufficiale: uno ha anche il laser game per chi ha già otto anni, l'altro una ludoteca per i più piccoli.",
    locali: [
      { nome: "A Casa di Topolino", zona: "Catanzaro, viale Lucrezia della Valle", tipo: "area giochi al coperto con ludoteca e sala feste", sito: "https://www.acasaditopolino.com/", descrizione: "Ludoteca e area giochi al coperto in viale Lucrezia della Valle 56, a Catanzaro. Nel playground ci sono scivoli, ponte tibetano, trampolini e giochi di gruppo. Per i compleanni c'è una sala feste di circa 450 mq con zona ristoro: durante la festa la sala è riservata e entrano solo gli invitati. Il locale offre buffet, animazione, mascotte, trucca bimbi e allestimenti. C'è anche un'arena di laser game di 500 mq per i più grandi. Prezzi e orari si chiedono al locale." },
      { nome: "La Bacchetta Magica Catanzaro", zona: "Catanzaro, via dei Conti Ruffo", tipo: "parco giochi al coperto con ludoteca e baby parking", sito: "https://www.labacchettamagica.com/catanzaro", descrizione: "Parco giochi al coperto in via dei Conti Ruffo, a Catanzaro, della rete La Bacchetta Magica. La pagina della sede parla di 1000 mq con parco giochi, ludoteca e baby parking e invita a festeggiarci il compleanno dei bambini. Gli orari pubblicati sono tutti i giorni dalle 9 alle 13.30 e dalle 15.30 alle 21, ma altri elenchi riportano orari diversi: prima di andare conviene telefonare. Il prezzo della festa e cosa comprende si chiedono al locale." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Catanzaro?", risposta: "Al coperto, in uno dei due parchi giochi che organizzano compleanni: A Casa di Topolino in viale Lucrezia della Valle, con una sala feste di circa 450 mq, oppure La Bacchetta Magica in via dei Conti Ruffo, con 1000 mq tra parco giochi e ludoteca." },
      { domanda: "Quanto costa la festa?", risposta: "Nessuno dei due pubblica i prezzi sul sito: si chiedono al locale. Fatevi scrivere cosa è compreso: quanti bambini, quanto dura, se ci sono merenda, torta e animazione." },
      { domanda: "E se gli invitati hanno età diverse?", risposta: "Ditelo quando prenotate. Da A Casa di Topolino il laser game è indicato dagli 8 anni in su, mentre il playground è per i più piccoli. Alla Bacchetta Magica la ludoteca è pensata per i bambini fino a 5 o 6 anni." },
      { domanda: "Vanno bene anche d'inverno o se piove?", risposta: "Sì: tutti e due sono al chiuso." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "pisa",
    citta: "Pisa",
    aggiornata: "2026-11-26",
    rispostaBreve: "A Pisa la festa di compleanno per bambini si fa al Piccolo Mondo, a Madonna dell'Acqua, un parco divertimenti per bambini con un salone e salette a tema per i compleanni, oppure all'Isola delle Meraviglie, a Navacchio, un parco giochi al chiuso di 800 mq con sale per le feste. Il Piccolo Mondo cambia orari con la stagione: chiedete sempre le date libere e cosa comprende il prezzo.",
    intro: "Intorno a Pisa i posti privati per festeggiare con tanti bambini sono due, molto diversi: un parco divertimenti alle porte della città, che d'estate ha anche le piscine, e un parco giochi al chiuso a Navacchio, nel comune di Cascina, a pochi chilometri.",
    locali: [
      { nome: "Piccolo Mondo", zona: "Pisa, Madonna dell'Acqua", tipo: "parco divertimenti per bambini con piscine d'estate e sale per i compleanni", sito: "https://www.piccolomondo.it/", descrizione: "Parco divertimenti e parco acquatico per bambini in via Traversa Che Guevara, a Madonna dell'Acqua, alle porte di Pisa; ci si arriva anche col bus 1+ dalla stazione. Ci sono gonfiabili, percorsi playground e attrazioni all'aperto, aree picnic, bar e pizzeria con menù bambino e un parcheggio gratuito. Per i compleanni c'è un ampio salone con animazione e salette a tema, con pacchetti con o senza rinfresco e torta e le mascotte su richiesta. Nel periodo natalizio ospita il villaggio di Natale nei weekend." },
      { nome: "L'Isola delle Meraviglie", zona: "Navacchio (Cascina)", tipo: "parco giochi al coperto con sale feste", sito: "https://www.isoladellemeraviglie.it/", descrizione: "Parco giochi al chiuso di 800 mq a Navacchio, nel comune di Cascina, per bambini fino a 12 anni. Il sito descrive un'area per i più piccoli con altalene, scivoli e casetta, un playground a forma di galeone e, per i più grandi, biliardino e air hockey. Organizza feste di compleanno e feste di classe e affitta le sale. Gli orari che si trovano in rete non coincidono tra loro: prima di andare conviene telefonare, e il prezzo della festa si chiede al parco." },
      { nome: "Ludoteca Scientifica", zona: "Pisa, via dei Macelli 2B (Largo Padre Renzo Spadoni)", tipo: "museo della scienza", descrizione: "Spazio di scienza da toccare all'interno del Museo degli Strumenti di Fisica dell'Università di Pisa, in via dei Macelli. Si visita solo su prenotazione, dal lunedì al venerdì dalle 9 alle 17, e i laboratori partono con almeno 8 partecipanti. Nel 2026 ha proposto attività per famiglie come i laboratori di primavera (6 euro nel 2026), «Il museo sotto le stelle» del 16 maggio per bambini dagli 8 anni e «Scienza da paura!» il 30 ottobre per bambini dai 6 ai 13 anni. D'estate, con «R-Estate 2026», ha accolto centri estivi con bambini dai 3 ai 12 anni dal 15 giugno all'11 settembre.", sito: "https://lus.sma.unipi.it/", festa: false },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Pisa?", risposta: "Al Piccolo Mondo, a Madonna dell'Acqua, che ha un salone e salette a tema dentro un parco divertimenti per bambini, oppure all'Isola delle Meraviglie di Navacchio, un parco giochi al chiuso di 800 mq con sale per le feste." },
      { domanda: "Quanto costa la festa?", risposta: "Il sito del Piccolo Mondo indica pacchetti a partire da 300 euro per 20 bambini, con saletta a tema e ingresso al parco (prezzo letto a novembre 2026). Per l'Isola delle Meraviglie il prezzo si chiede al parco. Fatevi sempre scrivere cosa è compreso." },
      { domanda: "Quale va bene d'inverno?", risposta: "L'Isola delle Meraviglie è tutta al chiuso. Il Piccolo Mondo d'inverno apre nei pomeriggi di sabato, domenica e festivi e fa le feste nelle sale: chiedete quali attrazioni sono aperte nel giorno che vi interessa." },
      { domanda: "Fino a che età si può giocare?", risposta: "L'Isola delle Meraviglie è pensata per bambini fino a 12 anni, con un'area a parte per i più piccoli. Al Piccolo Mondo le piscine estive hanno l'acqua bassa, adatta ai bambini piccoli." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "asti",
    citta: "Asti",
    aggiornata: "2026-11-18",
    rispostaBreve: "Ad Asti la festa di compleanno per bambini si fa al coperto, in centro: da Kids' Republic, in vicolo Monticone, una ludoteca con una sala con playground e gonfiabili, oppure da Happy Games, in via Assauto, un circolo con laser game dove si festeggia dai 4 anni in su. Chiedete per tempo le date libere e fatevi scrivere cosa comprende il prezzo.",
    intro: "Ad Asti i posti privati per i compleanni dei bambini sono due, tutti e due in centro e al chiuso. Sono molto diversi: uno è una ludoteca per i più piccoli, l'altro un laser game per chi ha già voglia di correre e fare squadra.",
    locali: [
      { nome: "Kids' Republic", zona: "Asti, centro (vicolo Monticone)", tipo: "ludoteca con sala feste e baby parking", sito: "https://kidsrepublic.it/", descrizione: "Ludoteca in centro ad Asti, in vicolo Monticone, che fa anche baby parking a ore. Per i compleanni il sito descrive una sala di 300 mq con playground e gonfiabili, uno spazio riservato per la festa e pacchetti a tema, con un'animatrice per tre ore nella formula di base; la festa nella sala allestita si fa con almeno 12 bambini e comprende il rinfresco. I prezzi non sono pubblicati: si chiedono alla ludoteca, insieme alle date libere." },
      { nome: "Happy Games Asti", zona: "Asti, centro (via Assauto)", tipo: "laser game con sala giochi e feste di compleanno", sito: "https://www.happygamesasti.it/", descrizione: "Circolo con laser game, ludoteca e sala giochi con biliardi e calciobalilla in via Assauto 5, nel cortile interno, ad Asti. I compleanni sono per bambini dai 4 anni in su; se giocano bambini sotto i 6 anni in arena entra anche un adulto. La formula comprende partite di laser game, bibite, patatine, pop corn e caramelle, area riservata e pulizia; si può aggiungere la pizza. Le attività sono per i soci, con tessera annuale. Le date libere si controllano passando di persona al circolo." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini ad Asti?", risposta: "In centro e al coperto: da Kids' Republic in vicolo Monticone, una ludoteca con sala feste, playground e gonfiabili, oppure da Happy Games in via Assauto, dove la festa è una sfida a laser game." },
      { domanda: "Quanto costa la festa?", risposta: "Happy Games indica sul sito 24 euro a invitato con almeno 10 persone, più 13 euro a testa se si aggiunge la pizza (prezzi letti a novembre 2026); serve anche la tessera del circolo, 10 euro l'anno. Kids' Republic non pubblica i prezzi: si chiedono alla ludoteca." },
      { domanda: "Quale va bene per i più piccoli?", risposta: "Kids' Republic è una ludoteca, con playground e gonfiabili. Da Happy Games le feste sono dai 4 anni in su, e sotto i 6 anni in arena entra anche un adulto." },
      { domanda: "Vanno bene anche d'inverno o se piove?", risposta: "Sì: tutti e due sono al chiuso." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "pavia",
    citta: "Pavia",
    aggiornata: "2026-11-18",
    rispostaBreve: "A Pavia la festa di compleanno per bambini si fa da SpazioGioco, una ludoteca in via Allende che la domenica si affitta per le feste dei bambini fino a 6 anni, oppure, da marzo a ottobre, al Parco Giochi Minerva di viale Cesare Battisti, un parco di gonfiabili all'aperto che riserva un'area per la festa. Chiedete per tempo le date libere.",
    intro: "A Pavia città trovate due soluzioni molto diverse: una ludoteca gestita da un'associazione, piccola e pensata per i più piccoli, da affittare e allestire da soli, e un parco di gonfiabili all'aperto per la bella stagione.",
    locali: [
      { nome: "SpazioGioco Pavia", zona: "Pavia, via Allende", tipo: "ludoteca da affittare per le feste", sito: "https://www.spaziogiocopavia.it/", descrizione: "Ludoteca senza scopo di lucro in via Allende, a Pavia, gestita da un circolo ARCI. La domenica la ludoteca si affitta per i compleanni: è pensata per bambini da 0 a 6 anni e ospita al massimo 25 persone, adulti compresi. Si affitta solo lo spazio: organizzazione, merenda e pulizia finale sono a carico della famiglia. Alla prenotazione si versa una caparra, restituita se la sala torna pulita. Non serve la tessera ARCI; il prezzo si chiede alla ludoteca." },
      { nome: "Parco Giochi Minerva", zona: "Pavia, viale Cesare Battisti", tipo: "parco divertimenti all'aperto con gonfiabili e feste di compleanno", sito: "https://www.parcogiochiminerva.it/", descrizione: "Parco di gonfiabili all'aperto in viale Cesare Battisti, accanto al centro commerciale Minerva. Il sito lo dà aperto da marzo a ottobre, tutti i giorni, mattina e pomeriggio, chiuso solo con il maltempo. Per i compleanni riserva un'area privata con addobbi a tema e giochi senza limiti di tempo. I prezzi non sono pubblicati: si chiedono al parco. D'inverno è chiuso." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Pavia?", risposta: "Da SpazioGioco, la ludoteca di via Allende che la domenica si affitta per le feste dei bambini fino a 6 anni, oppure, da marzo a ottobre, al Parco Giochi Minerva di viale Cesare Battisti, con i gonfiabili all'aperto." },
      { domanda: "Quanto costa la festa?", risposta: "SpazioGioco indica sul sito 100 euro per l'affitto della sala, 80 per i soci, più una caparra di 30 euro che viene restituita (prezzi letti a novembre 2026). Il Parco Giochi Minerva non pubblica i prezzi: si chiedono al parco." },
      { domanda: "E d'inverno?", risposta: "D'inverno resta SpazioGioco, che è al chiuso. Il Parco Giochi Minerva è all'aperto e apre da marzo a ottobre." },
      { domanda: "Quanti invitati posso portare da SpazioGioco?", risposta: "Al massimo 25 persone in tutto, contando anche gli adulti. La sala è pensata per bambini fino a 6 anni e si affitta solo la domenica." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "ragusa",
    citta: "Ragusa",
    aggiornata: "2026-11-19",
    rispostaBreve: "A Ragusa la festa di compleanno per bambini si fa in ludoteca: da Batti Cinque, in viale Europa, con una sala feste al chiuso e un'area all'aperto, oppure alla Bacchetta Magica, nella zona industriale, con sala feste, ludoteca e baby parking. Chiedete per tempo le date libere e fatevi scrivere cosa comprende il prezzo.",
    intro: "A Ragusa i compleanni dei bambini si festeggiano soprattutto nelle ludoteche, che mettono la sala e, se volete, anche allestimento e animazione. Qui trovate le due che hanno una pagina ufficiale con l'indirizzo e i servizi.",
    locali: [
      { nome: "Batti Cinque Ludoteca", zona: "Ragusa, viale Europa", tipo: "ludoteca con sala feste e area all'aperto", sito: "https://batticinqueludoteca.it/", descrizione: "Ludoteca in viale Europa con una sala feste al chiuso e un'area esterna usata per gli eventi. Per i compleanni lo staff può curare allestimento, giochi e animazione; in alternativa si affittano solo gli spazi e la famiglia organizza da sé. Gli orari cambiano tra estate e inverno e sul sito non coincidono in tutte le pagine: per le date e i prezzi conviene telefonare." },
      { nome: "La Bacchetta Magica Ragusa", zona: "Ragusa, zona industriale", tipo: "ludoteca con sala feste e baby parking", sito: "https://www.labacchettamagica.com/ragusa", descrizione: "Nella zona industriale di Ragusa, prima fase: il sito del marchio la presenta come sala feste, ludoteca e baby parking. Orari e prezzi non sono pubblicati e i numeri di telefono cambiano da una pagina all'altra: per la festa chiedete tutto direttamente alla ludoteca. Lo stesso marchio ha un'altra sede a Marina di Ragusa." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Ragusa?", risposta: "In ludoteca: da Batti Cinque in viale Europa, che ha una sala feste al chiuso e un'area all'aperto, oppure alla Bacchetta Magica nella zona industriale, con sala feste e ludoteca." },
      { domanda: "Quanto costa la festa?", risposta: "Nessuna delle due pubblica i prezzi: si chiedono alla ludoteca. Fatevi scrivere cosa è compreso: quanti bambini, quanto dura, se ci sono animazione, merenda e torta." },
      { domanda: "Posso organizzare tutto da me?", risposta: "Da Batti Cinque sì: oltre alla festa organizzata dallo staff si può affittare solo lo spazio e portare allestimento e giochi." },
      { domanda: "C'è uno spazio all'aperto?", risposta: "Batti Cinque ha un'area esterna che usa per gli eventi: chiedete se è disponibile nel giorno della vostra festa." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "casoria",
    citta: "Casoria",
    aggiornata: "2026-11-19",
    rispostaBreve: "A Casoria la festa di compleanno per bambini si fa da Funjungle, il parco giochi al coperto del centro Funteam in via Calvanese, con un pacchetto a prezzo unico che comprende menù, due animatori e ingresso ai giochi, oppure al Castello Sale Eventi, in via De Nicola, una ludoteca con una sala grande per le feste a tema. Chiedete per tempo le date libere.",
    intro: "A Casoria trovate due posti al chiuso con il loro sito ufficiale: un parco giochi a tema giungla dentro un centro sportivo, dove alla festa si può aggiungere una partita di calcetto, e una sala eventi con ludoteca che organizza anche battesimi e comunioni.",
    locali: [
      { nome: "Funjungle", zona: "Casoria, via Mauro Calvanese", tipo: "parco giochi al coperto con sale feste", sito: "https://www.funteam.it/funjungle", descrizione: "Il parco giochi al coperto del centro sportivo Funteam, in via Mauro Calvanese 39 a Casoria. Su oltre 450 mq c'è un playground a tema giungla con più di 60 giochi, scivoli, ostacoli, arrampicate e tunnel, più una zona con le game machine. La sala feste ha due spazi, uno per i bambini e uno per gli adulti. Il pacchetto festa a prezzo unico comprende inviti, menù bambini, menù adulti, due animatori, allestimento e ingresso al playground; si può aggiungere una partita di calcetto con speaker e video. Visite su appuntamento." },
      { nome: "Il Castello Sale Eventi", zona: "Casoria, via De Nicola", tipo: "sala feste con ludoteca per bambini", sito: "https://www.ilcastelloeventi.net/", descrizione: "Sala eventi con ludoteca in via De Nicola. Il sito descrive aree gioco per bambini di età diverse, seguite dagli animatori, e una sala grande per le feste a tema: primi compleanni, feste di fine anno, battesimi e comunioni. C'è un parcheggio riservato ai clienti. I prezzi non sono pubblicati: si chiedono alla struttura." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Casoria?", risposta: "Al chiuso: da Funjungle, il parco giochi a tema giungla del centro Funteam in via Calvanese, oppure al Castello Sale Eventi in via De Nicola, una ludoteca con una sala grande per le feste a tema." },
      { domanda: "Quanto costa la festa?", risposta: "Nessuno dei due pubblica i prezzi. Funjungle propone un pacchetto a prezzo unico con menù, due animatori, allestimento e ingresso ai giochi: chiedete la cifra per il vostro numero di invitati." },
      { domanda: "Si può fare una festa con il calcio?", risposta: "Sì: da Funjungle, che sta dentro un centro con i campi di calcetto, al pacchetto festa si può aggiungere una partita con telecronaca e video." },
      { domanda: "Vanno bene anche d'inverno o se piove?", risposta: "Sì: tutti e due sono al chiuso." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "pomezia",
    citta: "Pomezia",
    aggiornata: "2026-11-20",
    rispostaBreve: "A Pomezia la festa di compleanno per bambini si fa da Junior Park, il parco giochi al coperto del centro commerciale Sedici Pini, in via del Mare, con sala privata e animazione comprese nel menù, oppure da PlayZone, in via dei Castelli Romani, che ha sale feste private e un'area giochi con realtà virtuale e videogiochi. Chiedete per tempo le date libere.",
    intro: "A Pomezia trovate due posti al chiuso con il loro sito ufficiale: un parco giochi per bambini fino a 12 anni dentro un centro commerciale, e una struttura che unisce le sale feste a un'agenzia che cura allestimenti ed eventi.",
    locali: [
      { nome: "Junior Park", zona: "Pomezia, via del Mare (centro commerciale Sedici Pini)", tipo: "parco giochi al coperto con sale feste", sito: "https://www.junior-park.it/pomezia", descrizione: "Parco giochi al coperto nel centro commerciale Sedici Pini, in via del Mare a Pomezia: oltre 500 mq climatizzati per bambini da 0 a 12 anni, con scivoli, tappeti elastici, piscina di palline, pista per i velocipedi, spazi a tema e un'area baby. Lo staff segue il percorso di gioco. Per i compleanni ci sono sale private, animazione e menù già organizzati, con formule diverse a seconda del giorno, della fascia oraria e del numero di invitati. Prezzi e formule in vigore sono sul sito." },
      { nome: "PlayZone Pomezia", zona: "Pomezia, via dei Castelli Romani", tipo: "sala feste con area giochi al coperto", sito: "https://www.playzonepomezia.com/", descrizione: "Sala feste per bambini in via dei Castelli Romani, a Pomezia, climatizzata, aperta dal martedì alla domenica. Per i compleanni ci sono sale private con l'organizzazione completa: allestimenti con palloncini e scenografie, bolle di sapone, macchina del fumo e un angolo con popcorn e zucchero filato. Nella sala giochi ci sono postazioni arcade, simulatori, realtà virtuale e un proiettore interattivo; ogni mese c'è un evento o un laboratorio creativo. La stessa gestione ha un'agenzia che organizza eventi anche fuori sede." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Pomezia?", risposta: "Al chiuso: da Junior Park, il parco giochi del centro commerciale Sedici Pini in via del Mare, oppure da PlayZone in via dei Castelli Romani, che ha sale feste private e un'area giochi." },
      { domanda: "Quanto costa la festa?", risposta: "Junior Park pubblica sul suo sito i menù a prezzo fisso, con sala e animazione comprese: guardate lì le cifre in vigore. PlayZone non pubblica i prezzi: si chiedono alla struttura." },
      { domanda: "Si può portare la torta o il cibo da casa?", risposta: "Da Junior Park il sito dice che non si può portare cibo da fuori, e chiede di segnalare prima allergie e intolleranze. Per PlayZone chiedete alla struttura." },
      { domanda: "Vanno bene anche d'inverno o se piove?", risposta: "Sì: tutti e due sono al chiuso." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "rovigo",
    citta: "Rovigo",
    aggiornata: "2026-11-21",
    rispostaBreve: "A Rovigo la festa di compleanno per bambini si fa da Ludosfera, una ludoteca con playground, area per i più piccoli, sale per le feste e pizzeria, oppure al Bosco delle Meraviglie, in via del Commercio, una sala compleanni con ludoteca dove la festa può avere laboratori creativi e un'animatrice. Chiedete per tempo le date libere.",
    intro: "A Rovigo trovate due posti al chiuso con il loro sito ufficiale: una ludoteca grande, dove si va anche solo a giocare il pomeriggio e la sera si può cenare, e una sala compleanni più raccolta, che punta sui laboratori e sulle fiabe animate.",
    locali: [
      { nome: "Ludosfera", zona: "Rovigo", tipo: "ludoteca con playground e sale feste", sito: "https://ludosfera.net/", descrizione: "Family park in viale del Lavoro a Rovigo, accanto al Brico, con un ampio parcheggio. Ci sono un playground su tre livelli con scivoli, percorsi sospesi e reti elastiche, un'area montessoriana per i bimbi da 0 a 4 anni, due sale feste, una sala laboratori, il bar e la pizzeria nelle sere del fine settimana. Per giocare non serve prenotare. Per i compleanni ci sono due formule, Base e Deluxe, da personalizzare; ogni festa ha il suo spazio delimitato anche quando ce ne sono altre. Apre ogni giorno dalle 16, fino alle 23 dal venerdì alla domenica." },
      { nome: "Il Bosco delle Meraviglie", zona: "Rovigo, via del Commercio", tipo: "sala feste con ludoteca e laboratori", sito: "https://www.boscomeraviglie.it/", descrizione: "Sala compleanni con ludoteca in via del Commercio; la stessa gestione ha una sede anche a Ferrara. Il sito elenca laboratori, ludoteca, sala compleanni e intrattenimento per i bambini; per le feste propone pacchetti di animazione fino a tre ore con un'animatrice, con giochi, laboratori creativi e fiabe animate. I prezzi non sono pubblicati: si chiedono alla struttura." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Rovigo?", risposta: "Al chiuso: da Ludosfera, una ludoteca con playground, sale feste e pizzeria, oppure al Bosco delle Meraviglie in via del Commercio, una sala compleanni con ludoteca e laboratori." },
      { domanda: "Quanto costa la festa?", risposta: "Nessuno dei due pubblica i prezzi. Chiedete un preventivo scritto per il vostro numero di invitati e fatevi dire che cosa è compreso." },
      { domanda: "C'è l'animazione?", risposta: "Il Bosco delle Meraviglie propone pacchetti fino a tre ore con un'animatrice, con giochi, laboratori creativi e fiabe animate. Per Ludosfera chiedete alla struttura." },
      { domanda: "Vanno bene anche d'inverno o se piove?", risposta: "Sì: tutti e due sono al chiuso." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
  {
    slug: "collegno",
    citta: "Collegno",
    aggiornata: "2026-11-22",
    rispostaBreve: "A Collegno la festa di compleanno per bambini si fa da Allegropolis, in via Tommaseo, uno spazio per feste ed eventi privati con giochi per bambini da 0 a 12 anni, oppure da Mi Ci Porti, il baby parking di via Vittorio Sassi che affitta la sala in esclusiva con addobbi, inviti e musica compresi. Chiedete per tempo le date libere.",
    intro: "A Collegno, alle porte di Torino, trovate due posti al chiuso con il loro sito ufficiale: uno spazio per eventi privati pensato per le famiglie, e un baby parking che nei momenti liberi diventa una sala feste per i più piccoli.",
    locali: [
      { nome: "Allegropolis", zona: "Collegno, via Tommaseo", tipo: "sala feste con area giochi per bambini", sito: "https://www.allegropolis.it/", descrizione: "Spazio per bambini da 0 a 12 anni in via Tommaseo 3/1, a Collegno, che si affitta per eventi privati: feste di compleanno, battesimi, baby shower, gender reveal e pranzi o cene di classe. Le famiglie con bambini piccoli possono usare la struttura anche per corsi e attività, e il sito propone un corso di ludo-fitness, attività di fitness per mamme e laboratori su prenotazione. Il listino prezzi è un file da scaricare dal sito; per pacchetti e disponibilità si chiede alla struttura." },
      { nome: "Mi Ci Porti Baby Parking", zona: "Collegno, via Vittorio Sassi", tipo: "sala feste in un baby parking", sito: "https://babyparkingmiciporti.it/", descrizione: "Baby parking in via Vittorio Sassi, a Collegno, per bambini dai 13 mesi ai 6 anni, che affitta la sala in esclusiva per compleanni, battesimi, baby shower e feste a tema, nei giorni festivi o in settimana dopo le 16. Il compleanno comprende la sala con frigorifero per le bibite, addobbi, tavoli e sedie, inviti di carta o digitali, la musica, il «Tanti auguri» all'arrivo della torta e la pulizia prima e dopo. A parte si aggiunge l'animazione con baby dance, giochi, trucchi e palloncini. I prezzi non sono pubblicati: si chiedono alla struttura." },
    ],
    faq: [
      { domanda: "Dove si fa una festa di compleanno per bambini a Collegno?", risposta: "Al chiuso: da Allegropolis in via Tommaseo, uno spazio per eventi privati con giochi da 0 a 12 anni, oppure da Mi Ci Porti in via Vittorio Sassi, un baby parking che affitta la sala in esclusiva." },
      { domanda: "Quanto costa la festa?", risposta: "Nessuno dei due pubblica i prezzi: si chiedono alla struttura, con il numero degli invitati." },
      { domanda: "Che cosa è compreso?", risposta: "Da Mi Ci Porti il sito elenca sala riservata, frigo per le bevande, addobbi, tavoli e sedie, inviti, musica e pulizia. Per Allegropolis chiedete che cosa comprende il pacchetto." },
      { domanda: "Vanno bene anche d'inverno o se piove?", risposta: "Sì: tutti e due sono al chiuso." },
      { domanda: "Come raccolgo le conferme?", risposta: "Scadenza chiara nell'invito e conferma a un tocco: con l'invito digitale di Gioca con Mizi la conferma parte da WhatsApp già scritta, e sul biglietto stampato c'è il QR «Inquadra e conferma»." },
    ],
  },
];

/** I soli locali che organizzano feste: quelli della pagina «Feste a [città]». */
export const localiDaFesta = (c: CittaFeste) => c.locali.filter((l) => l.festa !== false);

export function cittaFeste(slug: string): CittaFeste | undefined {
  return CITTA_FESTE.find((c) => c.slug === slug);
}
