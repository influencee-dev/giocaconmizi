import type { Skill } from "@/games/registry";

// Le guide per i genitori — Gioca con Mizi.
// Rispondono alle domande che le mamme fanno davvero (a Google e alle AI):
// ogni guida è una risposta completa, onesta e senza fuffa, con i giochi
// del sito collegati. Una guida nuova = una voce in GUIDE, e pagina,
// sitemap e llms.txt si aggiornano da soli.

export interface SezioneGuida {
  titolo: string;
  paragrafi: string[];
}

export interface Guida {
  slug: string;
  /** Titolo pieno: è l'H1 e la domanda a cui la guida risponde. */
  titolo: string;
  /** Titolo corto per card e breadcrumb. */
  titoloBreve: string;
  descrizione: string;
  /** La risposta in due frasi: quella che un assistente AI può citare. */
  rispostaBreve: string;
  etaMin: number;
  etaMax: number;
  minutiLettura: number;
  /** Data ISO di pubblicazione/revisione, per l'Article JSON-LD. */
  aggiornata: string;
  /** La scenetta di Mizi in testa alla guida (components/illustrazioni). */
  skill: Skill;
  sezioni: SezioneGuida[];
  faq: { domanda: string; risposta: string }[];
  /** Slug dei giochi del sito citati come "per esercitarsi". */
  giochi: string[];
}

export const GUIDE: Guida[] = [
  {
    slug: "tabelline-senza-lacrime",
    skill: "matematica",
    titolo: "Come insegnare le tabelline senza lacrime",
    titoloBreve: "Le tabelline",
    descrizione:
      "Il metodo passo-passo per imparare le tabelline a 7-9 anni: in che ordine studiarle, i trucchi che riducono lo sforzo del 75% e gli errori da evitare.",
    rispostaBreve:
      "Le tabelline non si imparano tutte insieme e non si imparano recitandole: si parte da 2, 10 e 5, si usano i trucchi (il 9 con le mani, il 4 come doppio del 2) e ci si esercita 5 minuti al giorno con domande in ordine sparso, non in fila.",
    etaMin: 7,
    etaMax: 10,
    minutiLettura: 6,
    aggiornata: "2026-09-26",
    sezioni: [
      {
        titolo: "Perché recitarle in fila non funziona",
        paragrafi: [
          "Quasi tutti i bambini sanno dire la tabellina del 3 in fila: tre, sei, nove, dodici... Ma se chiedi \"tre per sette?\" a bruciapelo, ricominciano dall'inizio contando sulle dita. È normale: recitare in fila allena la memoria della filastrocca, non il recupero rapido del singolo fatto. A scuola e nella vita serve il secondo.",
          "La regola d'oro quindi è: pochi minuti al giorno, domande in ordine sparso, tante volte. Cinque minuti ogni giorno battono un'ora nel weekend, sempre.",
        ],
      },
      {
        titolo: "L'ordine giusto (non è quello del libro)",
        paragrafi: [
          "Partite da 1, 2 e 10: sono quasi gratis. Poi il 5 (finisce sempre per 0 o 5) e l'11 fino a 9. A questo punto arriva il momento magico: spiegate che 3×7 e 7×3 sono la stessa cosa. Metà del lavoro sparisce in un colpo solo.",
          "Poi il 4 (è il doppio del 2), il 9 (ha il trucco delle mani e le cifre che sommano sempre 9), il 3 e il 6. Alla fine restano davvero difficili solo una manciata di fatti: 6×7, 6×8, 7×8. Ditelo al bambino: \"te ne mancano solo tre, non cento\". Cambia tutto anche nella testa.",
        ],
      },
      {
        titolo: "I trucchi che funzionano davvero",
        paragrafi: [
          "Il 9 con le mani: dita aperte davanti a te, per 9×4 abbassa il quarto dito da sinistra. Le dita prima del dito abbassato sono le decine (3), quelle dopo le unità (6): 36. Funziona da 9×1 a 9×10 e ai bambini sembra una magia.",
          "Il quadrato come ancora: 6×6=36 si impara in fretta perché \"suona bene\". Da lì, 6×7 è \"36 più 6\". Appoggiare i fatti difficili a quelli facili è esattamente come lavora la memoria.",
          "E quando sbaglia, niente drammi: la risposta giusta detta subito, ripetuta dal bambino, e la stessa domanda rifatta dopo un paio di minuti. L'errore corretto subito e rivisto a breve è il modo più rapido di fissare un ricordo.",
        ],
      },
      {
        titolo: "Quanto tempo ci vuole",
        paragrafi: [
          "Con 5 minuti al giorno, un bambino di seconda o terza arriva a rispondere sotto i 3 secondi su tutte le tabelline in 6-10 settimane. Non è una gara: c'è chi ci mette di più, e va benissimo. L'unico confronto utile è con se stesso la settimana prima.",
          "Se dopo mesi i numeri restano un muro — inversioni frequenti, fatica sproporzionata, frustrazione grande — parlatene con l'insegnante: a volte dietro c'è una discalculia, e prima la si riconosce meglio è. Non è pigrizia e non è colpa di nessuno.",
        ],
      },
    ],
    faq: [
      {
        domanda: "A che età si imparano le tabelline?",
        risposta:
          "In Italia si iniziano in seconda elementare (7 anni) e si consolidano in terza. Prima dei 7 anni non ha senso forzarle: meglio contare, raggruppare e giocare con i numeri.",
      },
      {
        domanda: "In che ordine conviene studiarle?",
        risposta:
          "1, 2 e 10, poi 5 e 11; poi si scopre che 3×7 = 7×3 e il lavoro si dimezza. Seguono 4, 9 (col trucco delle mani), 3, 6 e per ultime le difficili: 6×7, 6×8, 7×8.",
      },
      {
        domanda: "Quanto esercizio serve ogni giorno?",
        risposta:
          "Cinque minuti al giorno con domande in ordine sparso. Le sessioni brevi e frequenti battono le sessioni lunghe: la memoria si fissa ripetendo a distanza, non insistendo.",
      },
      {
        domanda: "Mio figlio le sa in fila ma non a caso: è normale?",
        risposta:
          "Sì, ed è il segnale che ha memorizzato la filastrocca, non i singoli fatti. Si risolve esercitandosi solo con domande sparse: all'inizio sembrerà tornare indietro, in un paio di settimane il recupero diventa diretto.",
      },
    ],
    giochi: ["tabelline", "addizioni-entro-20", "conta-fino-a-10"],
  },
  {
    slug: "coding-per-bambini",
    skill: "coding",
    titolo: "Coding per bambini: a che età iniziare e come",
    titoloBreve: "Il coding",
    descrizione:
      "A 3 anni si può già \"programmare\" senza schermo, a 6 con i blocchi, a 10 col codice vero: il percorso per età, cosa insegna davvero il coding e gli errori da evitare.",
    rispostaBreve:
      "Il pensiero computazionale si può iniziare a 3-4 anni con giochi di sequenze (anche senza schermo); dai 5-6 anni funzionano frecce e blocchi visuali, dai 8-10 i cicli e le condizioni, dai 10-12 il primo codice vero. L'obiettivo non è formare programmatori: è imparare a scomporre un problema, prevedere un risultato e correggere gli errori senza frustrazione.",
    etaMin: 3,
    etaMax: 12,
    minutiLettura: 7,
    aggiornata: "2026-09-26",
    sezioni: [
      {
        titolo: "Cosa insegna davvero il coding (non è \"fare i programmatori\")",
        paragrafi: [
          "Quando un bambino programma, anche solo con quattro frecce, fa tre cose potentissime: scompone un problema grande in passi piccoli, prevede cosa succederà prima di premere \"via\", e quando il risultato è sbagliato cerca l'errore invece di buttare tutto. Questa terza cosa ha un nome — debug — ed è forse la lezione emotiva più preziosa: l'errore non è un fallimento, è un'informazione.",
          "Per questo il coding ha senso anche per bambini che da grandi faranno tutt'altro. È ginnastica di logica, pazienza e precisione — le stesse che servono per un problema di matematica o per organizzare lo zaino.",
        ],
      },
      {
        titolo: "Da 3 a 5 anni: sequenze, anche senza schermo",
        paragrafi: [
          "A quest'età il coding è: mettere in ordine i passi di un'azione. Si fa benissimo senza schermo: \"dimmi i passi per lavarsi i denti\", percorsi sul pavimento con i comandi a voce (\"avanti, avanti, gira\"), pattern con i mattoncini (rosso-blu-rosso-blu, cosa viene dopo?).",
          "Sullo schermo, i giochi giusti sono quelli con le frecce: il bambino mette in fila i comandi e guarda il personaggio eseguirli. Se il pinguino finisce nell'acqua, si ride e si riprova: il messaggio è che il programma si può sempre correggere.",
        ],
      },
      {
        titolo: "Da 6 a 9 anni: blocchi, cicli e primi \"se\"",
        paragrafi: [
          "Qui arrivano i blocchi visuali (come Scratch o Blockly): comandi che si incastrano, impossibili da scrivere \"sbagliati\", con tutta la logica vera della programmazione. Le due idee nuove sono il ciclo — \"ripeti 4 volte\" invece di scrivere lo stesso comando 4 volte — e la condizione: \"SE c'è un muro, gira\".",
          "Un buon segnale che il bambino sta capendo davvero: quando inizia ad accorgersi da solo che il suo programma è lungo e ripetitivo, e chiede se c'è un modo più corto. Quella è la nascita del pensiero da programmatore.",
        ],
      },
      {
        titolo: "Da 10 a 12 anni: dal blocco al codice",
        paragrafi: [
          "Il passaggio al codice scritto ha senso quando i blocchi vanno stretti. Il ponte migliore è vedere le due cose insieme: molti ambienti (compresi i nostri giochi avanzati) mostrano il codice JavaScript generato dai blocchi, così il testo non arriva come una lingua aliena ma come \"quello che i blocchi dicevano da sempre\".",
          "A questa età contano anche variabili ed eventi: i punti che aumentano, il \"quando tocchi lo schermo\". Con questi tre ingredienti un ragazzino costruisce un piccolo videogioco vero — e la motivazione fa il resto.",
        ],
      },
      {
        titolo: "Gli errori da evitare",
        paragrafi: [
          "Non correggetegli il programma: fatelo eseguire e chiedete \"dove ha sbagliato Mizi?\". Trovare l'errore da soli vale dieci volte la soluzione suggerita.",
          "Non trasformatelo in una lezione: 10-15 minuti quando c'è voglia battono l'ora fissa del martedì. E non serve alcun abbonamento: gli strumenti migliori per iniziare sono gratuiti.",
        ],
      },
    ],
    faq: [
      {
        domanda: "A che età un bambino può iniziare col coding?",
        risposta:
          "A 3-4 anni con giochi di sequenze e percorsi (anche senza schermo), a 5-6 con le frecce da mettere in fila, a 6-9 con i blocchi visuali, cicli e condizioni, dai 10 col primo codice vero.",
      },
      {
        domanda: "Serve saper leggere per programmare?",
        risposta:
          "No: i giochi per i più piccoli usano frecce e simboli, e le istruzioni possono essere dette a voce. La lettura serve solo per il passaggio al codice scritto, anni dopo.",
      },
      {
        domanda: "Il coding aumenta il tempo davanti allo schermo?",
        risposta:
          "È tempo di schermo attivo: il bambino costruisce, prevede e corregge invece di guardare. E il pensiero computazionale si allena anche a schermo spento, con percorsi, pattern e istruzioni a voce.",
      },
      {
        domanda: "Meglio un corso o giocare in autonomia?",
        risposta:
          "Fino alle medie, per la maggior parte dei bambini bastano buoni giochi gratuiti e un adulto che chiede \"come l'hai risolto?\". Un corso ha senso quando la passione è già accesa e chiede di più.",
      },
    ],
    giochi: [
      "cosa-viene-dopo",
      "guida-mizi",
      "robot-ballerino",
      "dove-arriva-mizi",
      "labirinto-a-blocchi",
      "salto-di-mizi",
      "missione-ghiaccio",
      "tartaruga",
      "crea-il-tuo-gioco",
    ],
  },
  {
    slug: "imparare-a-leggere-l-orologio",
    skill: "tempo",
    titolo: "Come insegnare ai bambini a leggere l'orologio",
    titoloBreve: "L'orologio",
    descrizione:
      "Ore, mezz'ore, quarti e i famosi \"meno dieci\": il percorso in 4 tappe per leggere l'orologio analogico a 6-8 anni, con i passaggi dove quasi tutti si bloccano.",
    rispostaBreve:
      "L'orologio si insegna in quattro tappe: prima solo le ore esatte (lancetta corta), poi le mezz'ore, poi i quarti, e per ultimi i minuti a salti di 5. L'errore classico è introdurre subito \"le e venti\" e \"meno un quarto\" insieme: sono due sistemi diversi e vanno separati.",
    etaMin: 6,
    etaMax: 9,
    minutiLettura: 5,
    aggiornata: "2026-09-26",
    sezioni: [
      {
        titolo: "Prima tappa: solo la lancetta corta",
        paragrafi: [
          "Coprite mentalmente la lancetta lunga: per una settimana esistono solo le ore esatte. \"La lancetta corta è sul 7: sono le 7.\" Il bambino deve arrivare a leggerle senza pensarci, perché tutto il resto si appoggia qui.",
          "Un orologio vero in cameretta (analogico, con i numeri grandi) aiuta più di ogni esercizio: le ore diventano parte della giornata — \"alle 8 si esce\", \"alle 9 a letto\".",
        ],
      },
      {
        titolo: "Seconda tappa: la mezz'ora, e il tranello della lancetta corta",
        paragrafi: [
          "\"Quando la lancetta lunga è sul 6, sono le e mezza.\" Facile. Il tranello è un altro: alle 7 e mezza la lancetta corta non è più sul 7, è a metà strada verso l'8, e metà dei bambini legge \"le 8 e mezza\". Non è distrazione: è la difficoltà vera di questa tappa.",
          "La regola da dare: la lancetta corta dice l'ora che è già passata. Se è tra il 7 e l'8, sono ancora \"le 7 e qualcosa\".",
        ],
      },
      {
        titolo: "Terza tappa: i quarti. Quarta: i minuti a salti di 5",
        paragrafi: [
          "\"E un quarto\" (lunga sul 3) e \"e tre quarti\" (lunga sul 9) si imparano come posizioni fisse, tipo punti cardinali. Solo dopo arriva l'idea generale: ogni numero del quadrante vale 5 minuti, e si conta per 5 seguendo la lancetta lunga — che è anche un bel ripasso della tabellina del 5.",
          "Per ultimo, il sistema \"all'indietro\": \"le 8 meno dieci\" invece di \"le 7 e cinquanta\". È una convenzione italiana in più, non una tappa obbligata: introducetela solo quando la lettura in avanti è solidissima.",
        ],
      },
      {
        titolo: "E l'orologio digitale?",
        paragrafi: [
          "Il digitale si legge da solo, ma non insegna niente: il quadrante analogico è una mappa del tempo — si vede quanto manca, quanto è passato, quanto dura mezz'ora. Per questo a scuola si parte dall'analogico, e ha senso fare lo stesso a casa. Il digitale arriva gratis dopo.",
        ],
      },
    ],
    faq: [
      {
        domanda: "A che età si impara a leggere l'orologio?",
        risposta:
          "Le ore esatte a 6 anni, mezz'ore e quarti tra i 6 e i 7, i minuti a salti di 5 tra i 7 e gli 8. La lettura completa e sicura arriva in genere entro i 9 anni.",
      },
      {
        domanda: "Perché mio figlio sbaglia l'ora quando è \"e mezza\"?",
        risposta:
          "Perché a metà ora la lancetta corta è a metà strada tra due numeri e viene naturale leggere il numero più vicino. La regola che risolve: la lancetta corta dice l'ora già passata.",
      },
      {
        domanda: "Meglio iniziare dall'orologio digitale?",
        risposta:
          "No: il digitale si legge senza capire. Il quadrante analogico fa vedere il tempo come spazio (quanto manca, quanto è passato) ed è la base su cui il digitale poi si aggancia da solo.",
      },
    ],
    giochi: ["l-orologio", "conta-fino-a-10", "tabelline"],
  },
  {
    slug: "imparare-a-leggere-giocando",
    skill: "lettura",
    titolo: "Imparare a leggere: il percorso dai suoni alle prime frasi",
    titoloBreve: "Imparare a leggere",
    descrizione:
      "Suoni, lettere, sillabe, parole, frasi: le 5 tappe con cui i bambini imparano a leggere in italiano, cosa fare a casa a ogni tappa e cosa non fare mai.",
    rispostaBreve:
      "In italiano si impara a leggere in cinque tappe: giocare coi suoni delle parole, riconoscere le lettere, fondere le sillabe (MA+RE), leggere parole intere e infine frasi con senso. A casa la cosa più efficace non è anticipare la scuola: è leggere ad alta voce ogni giorno e giocare coi suoni, senza mai trasformare la lettura in una prestazione.",
    etaMin: 4,
    etaMax: 7,
    minutiLettura: 6,
    aggiornata: "2026-09-26",
    sezioni: [
      {
        titolo: "Tappa zero: le orecchie vengono prima degli occhi",
        paragrafi: [
          "Prima di leggere MARE, un bambino deve sentire che \"mare\" comincia con MMM e si spezza in MA-RE. Questa abilità si chiama consapevolezza fonologica ed è il predittore più forte di come andrà la lettura. Si allena giocando: \"con che suono inizia SOLE?\", catene di parole (\"dimmi una parola che inizia come PANE\"), battere le mani a ogni sillaba.",
          "Sono giochi da macchina e da coda alla cassa, a 4-5 anni. Nessuna scheda, nessuna lettera ancora: solo orecchie.",
        ],
      },
      {
        titolo: "Le lettere: poche, maiuscole, legate al suono",
        paragrafi: [
          "Lo stampatello maiuscolo è il punto di partenza: è il più semplice da distinguere. E ogni lettera va presentata col suo suono, non col suo nome: M è \"mmm\", non \"emme\" — perché è \"mmm\" che serve per leggere. Partite dalle lettere del suo nome: sono quelle che ogni bambino impara con più gioia.",
        ],
      },
      {
        titolo: "La fusione: il momento più delicato",
        paragrafi: [
          "M più A che diventa MA è il vero salto: c'è un momento, uguale per quasi tutti, in cui il bambino dice \"mmm... aaa...\" e non sente la sillaba. È normale e passa con la pratica: allungate il primo suono e attaccate il secondo senza pausa (\"mmmA\"), sempre su sillabe semplici consonante-vocale.",
          "L'italiano qui è un regalo: si legge com'è scritto. Per questo la maggior parte dei bambini italiani decodifica già a metà prima elementare — molto prima dei coetanei inglesi. Se la scuola usa il metodo sillabico, a casa non serve altro che esercitare le stesse sillabe con leggerezza.",
        ],
      },
      {
        titolo: "Cosa fare a casa (e cosa non fare mai)",
        paragrafi: [
          "La cosa più potente resta la lettura ad alta voce dell'adulto, ogni giorno, anche dopo che il bambino ha imparato: nutre vocabolario e amore per le storie mentre lui automatizza la tecnica. Testi brevi, stampatello grande, e la stessa storia riletta cento volte va benissimo: la ripetizione è allenamento, non pigrizia.",
          "Da non fare mai: correggere ogni singolo errore (interrompe il filo e il coraggio), confrontare con fratelli o compagni, forzare chi non è pronto. E un'attenzione: se a metà prima elementare la fusione delle sillabe resta un muro, parlatene con l'insegnante — un controllo precoce non fa mai danni, aspettare sì.",
        ],
      },
    ],
    faq: [
      {
        domanda: "A che età un bambino impara a leggere?",
        risposta:
          "In Italia la decodifica arriva in prima elementare, tra i 6 e i 7 anni, e per molti già a metà anno. Prima dei 6 anni si prepara il terreno con i giochi sui suoni, senza forzare la lettura vera.",
      },
      {
        domanda: "Devo insegnargli a leggere prima della scuola?",
        risposta:
          "No. Ciò che aiuta davvero prima della scuola è giocare coi suoni delle parole, conoscere qualche lettera (partendo dal proprio nome) e ascoltare tante storie lette ad alta voce. La tecnica la costruisce la scuola.",
      },
      {
        domanda: "Perché si parte dallo stampatello maiuscolo?",
        risposta:
          "Perché le maiuscole sono le più facili da distinguere tra loro. Il minuscolo arriva subito dopo, e il corsivo per ultimo, quando la lettura è già avviata.",
      },
      {
        domanda: "Legge lentamente e sillabando: devo preoccuparmi?",
        risposta:
          "In prima elementare è il percorso normale: prima si sillaba, poi le parole diventano intere, poi arriva la velocità. Il campanello d'allarme non è la lentezza ma il blocco: se la fusione delle sillabe non parte affatto, meglio parlarne con l'insegnante.",
      },
    ],
    giochi: ["lettera-iniziale", "tocca-la-lettera", "unisci-le-sillabe", "leggi-e-rispondi"],
  },
  {
    slug: "tempo-davanti-allo-schermo",
    skill: "emozioni",
    titolo: "Schermi e bambini: quanto tempo va bene davvero?",
    titoloBreve: "Il tempo di schermo",
    descrizione:
      "Le indicazioni dei pediatri per età (0-2, 3-5, 6-12), perché contare solo i minuti è fuorviante e le 5 regole che funzionano più del cronometro.",
    rispostaBreve:
      "Le società pediatriche indicano: niente schermi sotto i 2 anni, massimo un'ora al giorno tra i 3 e i 5, regole familiari chiare dai 6 in su. Ma conta più il come del quanto: 30 minuti passivi di video a raffica non equivalgono a 30 minuti in cui il bambino costruisce, gioca o impara — e la presenza dell'adulto cambia tutto.",
    etaMin: 3,
    etaMax: 12,
    minutiLettura: 6,
    aggiornata: "2026-09-26",
    sezioni: [
      {
        titolo: "I numeri di riferimento (e cosa significano davvero)",
        paragrafi: [
          "Le indicazioni delle principali società pediatriche (OMS, pediatri americani e italiani) convergono: sotto i 2 anni, niente schermi se non le videochiamate coi nonni; dai 2 ai 5 anni, massimo un'ora al giorno e di qualità, meglio se insieme a un adulto; dai 6 anni in su non c'è più un numero unico ma una regola di equilibrio: lo schermo non deve rubare sonno, movimento, compiti e gioco vero.",
          "Questi numeri sono bussole, non sentenze. Il giorno di pioggia coi cartoni in più non rovina nessuno; è la routine quotidiana che fa la differenza.",
        ],
      },
      {
        titolo: "Non tutti i minuti sono uguali",
        paragrafi: [
          "C'è schermo passivo — video che scorrono da soli, uno dopo l'altro, senza che il bambino faccia nulla — e schermo attivo: costruire in un gioco, risolvere un labirinto, disegnare, videochiamare la nonna. Il primo è quello su cui si concentrano le preoccupazioni dei ricercatori (soprattutto per l'autoplay, che elimina il momento naturale in cui ci si ferma); il secondo può essere tempo speso bene.",
          "La domanda giusta quindi non è solo \"quanti minuti?\" ma \"cosa sta facendo, e con chi?\". Dieci minuti di gioco con la mamma accanto che chiede \"come l'hai risolto?\" valgono più di un'ora di video in solitudine — è quello che i ricercatori chiamano co-viewing, e raddoppia il valore di qualunque contenuto.",
        ],
      },
      {
        titolo: "Le 5 regole che funzionano più del cronometro",
        paragrafi: [
          "1) Niente schermi nell'ora prima della nanna: la luce e l'eccitazione disturbano il sonno, e il sonno è la cosa più importante di tutte. 2) Niente schermi a tavola — vale anche per i grandi, ed è la regola più difficile per i grandi. 3) Autoplay spento: la fine di un episodio è il momento naturale per smettere. 4) Lo schermo si usa nelle stanze comuni, non da soli in cameretta. 5) Si concorda prima quando si finisce (\"due partite, poi merenda\"), perché il conflitto nasce quasi sempre dall'interruzione a sorpresa.",
          "E la regola zero, la più scomoda: i figli fanno quello che vedono. Un genitore che scrolla a cena toglie forza a qualunque limite. Nessuno è perfetto su questo — conta la direzione, non la perfezione.",
        ],
      },
      {
        titolo: "Come lo applichiamo noi su Gioca con Mizi",
        paragrafi: [
          "Questo sito è fatto da una mamma, e queste regole sono dentro il prodotto: niente pubblicità, niente video a raffica, niente timer che mettono ansia e niente meccanismi per trattenere il bambino \"ancora un po'\". Ogni gioco dura pochi minuti, insegna una cosa sola e finisce. Quando il bambino chiude, il sito non lo richiama: la porta del giardino resta aperta, ma non c'è nessuno che tira per la manica.",
        ],
      },
    ],
    faq: [
      {
        domanda: "Quanto tempo di schermo è consigliato per età?",
        risposta:
          "Zero sotto i 2 anni (tranne le videochiamate), massimo un'ora al giorno dai 2 ai 5 anni, e dai 6 in su una regola di equilibrio: lo schermo non deve togliere spazio a sonno, movimento, scuola e gioco libero.",
      },
      {
        domanda: "I giochi educativi contano come tempo di schermo?",
        risposta:
          "Sì, contano nel totale, ma sono tempo attivo: il bambino risolve, costruisce e sbaglia invece di guardare passivamente. A parità di minuti, un gioco in cui si pensa vale più di un video che scorre da solo — soprattutto se un adulto è vicino.",
      },
      {
        domanda: "Come faccio a interrompere senza capricci?",
        risposta:
          "Concordando la fine prima di iniziare (\"due partite, poi si spegne\") e usando fini naturali: la partita completata, la storia finita. Il capriccio nasce quasi sempre dall'interruzione a sorpresa, non dal limite in sé.",
      },
      {
        domanda: "Ho esagerato con gli schermi finora: è tardi?",
        risposta:
          "No. Le abitudini dei bambini si riorganizzano in poche settimane quando le regole sono chiare, uguali per tutti i giorni e accompagnate da alternative vere (giocare insieme, uscire, annoiarsi un po': la noia è fertile).",
      },
    ],
    giochi: ["le-emozioni-di-mizi", "sequenze-logiche", "puzzle-facile"],
  },
  {
    slug: "compiti-senza-litigare",
    skill: "comprensione",
    titolo: "Compiti a casa senza litigare: cosa funziona davvero",
    titoloBreve: "I compiti",
    descrizione:
      "Perché i compiti diventano una guerra e come uscirne: il momento giusto, il ruolo del genitore (che non è fare i compiti), la tecnica dei pezzi piccoli e quando preoccuparsi.",
    rispostaBreve:
      "I litigi sui compiti calano quando cambiano tre cose: un orario fisso deciso insieme (non \"quando ti va\" né \"subito appena torni\"), il genitore vicino ma non addosso (presente all'inizio e alla fine, non su ogni esercizio), e i compiti lunghi spezzati in pezzi da 10-15 minuti con pause vere. Il genitore non è l'insegnante: se un compito è troppo difficile, la cosa giusta è scriverlo all'insegnante, non finirlo al posto del bambino.",
    etaMin: 6,
    etaMax: 11,
    minutiLettura: 6,
    aggiornata: "2026-09-26",
    sezioni: [
      {
        titolo: "Questo sito è nato da un litigio sui compiti",
        paragrafi: [
          "Lo diciamo subito, perché è la verità: Gioca con Mizi esiste perché una bambina di nome Domiziana non voleva mai fare i compiti, e sua mamma invece di insistere ha provato a trasformare l'esercizio in gioco. Quindi questa guida non arriva dall'alto: arriva da una cucina come la vostra, all'ora dei compiti.",
        ],
      },
      {
        titolo: "Il momento giusto (esiste, ma non è uguale per tutti)",
        paragrafi: [
          "\"Subito appena torni da scuola\" funziona male: il bambino ha appena finito sei ore di attenzione e ha bisogno di scaricare. \"Dopo cena\" peggio: è stanco. La finestra buona per la maggior parte dei bambini è dopo merenda e un po' di sfogo — mezz'ora di gioco libero, movimento, niente schermi — e prima di cena.",
          "Ma la cosa più importante non è quale orario: è che sia sempre quello, deciso insieme una volta e non rinegoziato ogni pomeriggio. Ogni negoziazione quotidiana è un litigio potenziale; la routine li elimina quasi tutti.",
        ],
      },
      {
        titolo: "Il vostro ruolo: vicini, non addosso",
        paragrafi: [
          "Il genitore seduto accanto che controlla ogni riga insegna una cosa sola: \"non sei capace da solo\". Il genitore che sparisce del tutto ne insegna un'altra: \"dei tuoi compiti non importa a nessuno\". La via di mezzo che funziona: presenti all'inizio (si guarda insieme cosa c'è da fare e da dove si parte), disponibili a distanza (\"sono in cucina se ti serve\"), presenti alla fine per guardare il lavoro fatto — guardarlo, non correggerlo tutto.",
          "Gli errori lasciateli: servono all'insegnante per capire cosa non è passato. Un quaderno perfetto firmato mamma non aiuta nessuno dei due.",
        ],
      },
      {
        titolo: "Pezzi piccoli e pause vere",
        paragrafi: [
          "L'attenzione di un bambino di prima o seconda regge 10-15 minuti su un compito; in quarta o quinta 20-25. Oltre, il rendimento crolla e il nervosismo sale. Quindi: si spezza. Dieci minuti di matematica, cinque di pausa (movimento, non schermi: lo schermo non è una pausa, è un altro impegno per il cervello), poi la lettura.",
          "Per i più riluttanti funziona partire dal compito più facile: tre esercizi fatti in cinque minuti accendono il motore, e il compito odiato si affronta a motore caldo. E l'esercizio ripetitivo — tabelline, sillabe, calcoli a mente — si può spostare sul gioco: dieci minuti su un buon gioco valgono una scheda, con la metà della fatica emotiva.",
        ],
      },
      {
        titolo: "Quando il problema non sono i capricci",
        paragrafi: [
          "Se ogni pomeriggio finisce in lacrime da mesi, se i compiti richiedono il triplo del tempo dei compagni, se la fatica è enorme su lettura o calcoli semplici: non è pigrizia e non è colpa vostra. Parlatene con l'insegnante e, se il sospetto resta, chiedete una valutazione per i disturbi dell'apprendimento (DSA). Riconoscerli presto cambia la vita scolastica di un bambino; combatterli a forza di volontà la rovina.",
        ],
      },
    ],
    faq: [
      {
        domanda: "Devo stare seduta accanto a mio figlio mentre fa i compiti?",
        risposta:
          "In prima elementare spesso sì, ma l'obiettivo è ridurre la presenza ogni mese: presenti all'inizio per organizzare, a distanza durante, presenti alla fine per guardare. L'autonomia è il vero compito.",
      },
      {
        domanda: "Qual è il momento migliore per fare i compiti?",
        risposta:
          "Dopo merenda e mezz'ora di sfogo senza schermi, prima di cena. Ma conta più la costanza dell'orario in sé: la routine fissa elimina la negoziazione quotidiana, che è la miccia della maggior parte dei litigi.",
      },
      {
        domanda: "Devo correggere gli errori nei compiti?",
        risposta:
          "Meglio di no: segnalate al massimo che c'è qualcosa da ricontrollare. Gli errori servono all'insegnante per capire cosa riprendere in classe; un quaderno perfetto corretto dal genitore nasconde l'informazione.",
      },
      {
        domanda: "Quanto devono durare i compiti alle elementari?",
        risposta:
          "Un riferimento diffuso è 10 minuti per anno di scuola: 10-20 minuti in prima e seconda, fino a 50-60 in quinta. Se i tempi reali sono sistematicamente il doppio o il triplo, parlatene con l'insegnante.",
      },
    ],
    giochi: ["tabelline", "unisci-le-sillabe", "leggi-e-rispondi", "l-orologio"],
  },
];

export function guida(slug: string): Guida | undefined {
  return GUIDE.find((g) => g.slug === slug);
}
