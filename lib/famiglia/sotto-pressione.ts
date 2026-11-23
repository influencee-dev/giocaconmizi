/**
 * «Che genitore diventi quando sei sotto pressione?» (20/11/2026).
 *
 * Un percorso di riflessione per gli adulti, costruito sulle cinque «spinte»
 * descritte da Taibi Kahler nell'Analisi Transazionale. Qui stanno le domande,
 * il calcolo e i testi: niente interfaccia.
 *
 * REGOLE (valgono per ogni modifica):
 * - NON è un test psicologico validato e non fa diagnosi: lo dice la pagina e
 *   lo devono dire tutti i testi («può», «potrebbe», mai «sei»).
 * - Il punteggio è un calcolo fisso e controllabile (`calcola`): nessuna AI
 *   decide o ritocca i numeri, e le letture sono scritte a mano qui sotto.
 * - Le affermazioni sono ORIGINALI. Il questionario ESQ-R-I sugli stati
 *   dell'Io (Laghi, Crea, Filipponi, 2020) NON si copia: prima vanno chiariti
 *   i diritti d'uso con gli autori.
 * - Le risposte restano nel browser di chi compila: niente server, niente
 *   database, niente statistiche sulle risposte.
 * - Pubblicato il 23/11/2026 su decisione di Giorgia, che lo vuole anche per
 *   raccogliere iscrizioni: alla fine c'è il modulo della Posta di Mizi
 *   (origine «test-sotto-pressione» in Brevo). Al server arriva SOLO l'email
 *   di chi si iscrive, mai le risposte o il profilo. La rilettura di uno
 *   psicologo resta consigliata: se arriva, si aggiornano le letture qui.
 * - Con `PERCORSO_PUBBLICO` false la pagina torna bozza: fuori da Google, dalla
 *   sitemap e dal sito (InvitoTest sparisce da solo).
 */

/** false = bozza: pagina raggiungibile solo dal link, fuori da Google e dal sito. */
export const PERCORSO_PUBBLICO = true;

export const PERCORSO = {
  percorso: "/genitori/sotto-pressione",
  titolo: "Che genitore diventi quando sei sotto pressione?",
  /** Il titolo per Google e per l'anteprima sui social: deve far venire voglia di farlo. */
  titoloSocial: "E tu che mamma diventi sotto pressione? Il test in 10 minuti",
  /** Il testo che parte con il tasto «Condividi» (niente risultati dentro: restano privati). */
  testoCondividi: "E tu che tipo di mamma sei quando sei sotto pressione? Io ho fatto il test di Giocamizi: 10 minuti, gratis, e le risposte restano sul telefono. Provalo 👇",
  descrizione:
    "Un percorso di dieci minuti per riconoscere le tue reazioni automatiche con i figli: 45 domande, un profilo delle tue cinque spinte e un esercizio per la settimana.",
  /** La chiave in sessionStorage (registro in lib/contenuti/legal.ts). */
  chiave: "giocamizi-percorso-genitori",
  /** Cambia quando cambiano domande o calcolo: le risposte vecchie non valgono più. */
  versione: "2026-11-20",
} as const;

export type Spinta = "perfetto" | "forte" | "sforzati" | "sbrigati" | "compiaci";

export const SPINTE: Spinta[] = ["sbrigati", "perfetto", "compiaci", "sforzati", "forte"];

/** Le cinque risposte possibili a un'affermazione, da 1 a 5. */
export const SCALA = ["Mai o quasi mai", "Raramente", "A volte", "Spesso", "Quasi sempre"] as const;

export interface Affermazione {
  id: string;
  spinta: Spinta;
  testo: string;
  /** true = l'affermazione va nel verso opposto: «Quasi sempre» abbassa il punteggio. */
  rovescio?: boolean;
}

const a = (id: string, spinta: Spinta, testo: string, rovescio = false): Affermazione => ({ id, spinta, testo, ...(rovescio ? { rovescio } : {}) });

/** Sette affermazioni per spinta: cinque dirette e due rovesciate. */
const PER_SPINTA: Record<Spinta, Affermazione[]> = {
  perfetto: [
    a("p1", "perfetto", "Quando finisco un lavoro, continuo a vedere i dettagli che potevo fare meglio."),
    a("p2", "perfetto", "Un errore piccolo mi resta in testa per ore."),
    a("p3", "perfetto", "Preferisco rifare una cosa da capo piuttosto che lasciarla «abbastanza buona»."),
    a("p4", "perfetto", "Quando i figli fanno i compiti o un lavoretto, mi viene da correggere quello che non è preciso."),
    a("p5", "perfetto", "Prima di mostrare una cosa agli altri la ricontrollo più volte."),
    a("p6", "perfetto", "Se una cosa è fatta abbastanza bene, la lascio così e non ci penso più.", true),
    a("p7", "perfetto", "Quando i figli sbagliano una cosa da poco, mi viene facile lasciar correre.", true),
  ],
  forte: [
    a("f1", "forte", "Mi è difficile chiedere aiuto, anche quando ne avrei bisogno."),
    a("f2", "forte", "Quando sto male tendo a non farlo vedere."),
    a("f3", "forte", "Davanti a un problema penso che tocca a me risolverlo, senza pesare su nessuno."),
    a("f4", "forte", "Quando i figli piangono per una cosa piccola, mi viene da dire «non è niente»."),
    a("f5", "forte", "Parlare di come mi sento mi mette a disagio."),
    a("f6", "forte", "Quando la giornata è stata pesante, lo dico a chi mi sta vicino.", true),
    a("f7", "forte", "Se qualcuno si offre di darmi una mano con i figli, accetto volentieri.", true),
  ],
  sforzati: [
    a("s1", "sforzati", "Comincio molte cose con slancio e faccio fatica a portarle fino in fondo."),
    a("s2", "sforzati", "Ho la sensazione di faticare tanto e di concludere poco."),
    a("s3", "sforzati", "Mi sento a disagio quando non sto facendo qualcosa di utile."),
    a("s4", "sforzati", "Se una cosa mi riesce facile, mi viene il dubbio di non averla fatta bene."),
    a("s5", "sforzati", "Con i figli mi capita di dire «almeno provaci» o «impegnati di più»."),
    a("s6", "sforzati", "Quando decido di fare una cosa, la finisco senza girarci intorno.", true),
    a("s7", "sforzati", "Riesco a riposarmi senza sentirmi in colpa.", true),
  ],
  sbrigati: [
    a("b1", "sbrigati", "Mi irrito quando gli altri ci mettono più tempo del previsto."),
    a("b2", "sbrigati", "Faccio due cose insieme per guadagnare tempo."),
    a("b3", "sbrigati", "Mi capita di finire le frasi degli altri o di interromperli."),
    a("b4", "sbrigati", "Prima di uscire di casa ripeto più volte ai figli «dai, muoviti»."),
    a("b5", "sbrigati", "Quando i figli fanno una cosa piano, mi viene da farla io al posto loro."),
    a("b6", "sbrigati", "Aspettare non mi pesa.", true),
    a("b7", "sbrigati", "Riesco a stare a tavola o a fare una passeggiata senza guardare l'ora.", true),
  ],
  compiaci: [
    a("c1", "compiaci", "Dico di sì a una richiesta anche quando vorrei dire di no."),
    a("c2", "compiaci", "Se qualcuno è scontento di me, ci penso a lungo."),
    a("c3", "compiaci", "Prima di dire quello che penso, mi chiedo come la prenderanno gli altri."),
    a("c4", "compiaci", "Quando i figli protestano per un no, mi viene da cedere per riportare la pace."),
    a("c5", "compiaci", "Mi sento responsabile dell'umore delle persone che ho intorno."),
    a("c6", "compiaci", "Riesco a dire di no senza sentirmi in colpa.", true),
    a("c7", "compiaci", "Se i figli si arrabbiano con me per una regola, resto della mia idea con tranquillità.", true),
  ],
};

/**
 * Le 35 affermazioni nell'ordine in cui si leggono: mescolate, sempre uguali.
 * A ogni giro le spinte cambiano posto, così due affermazioni della stessa
 * spinta non si seguono mai e non si capisce subito che cosa si misura.
 */
export const AFFERMAZIONI: Affermazione[] = Array.from({ length: 7 }, (_, giro) =>
  SPINTE.map((_, i) => PER_SPINTA[SPINTE[(i + giro * 2) % SPINTE.length]][giro]),
).flat();

export interface Scelta {
  /** La spinta a cui somiglia questa reazione; «calma» = una risposta pensata, fuori dalle spinte. */
  verso: Spinta | "calma";
  testo: string;
}

export interface Situazione {
  id: string;
  scena: string;
  scelte: Scelta[];
}

const s = (id: string, scena: string, ...scelte: [Scelta["verso"], string][]): Situazione => ({
  id,
  scena,
  scelte: scelte.map(([verso, testo]) => ({ verso, testo })),
});

/**
 * Dieci momenti di casa. Ogni situazione ha tre reazioni che somigliano a una
 * spinta e una risposta pensata; ogni spinta compare in sei situazioni. La
 * risposta pensata cambia posto da una situazione all'altra.
 */
export const SITUAZIONI: Situazione[] = [
  s("scarpe", "È ora di uscire. Dopo dieci minuti il bambino non ha ancora le scarpe ai piedi.",
    ["sbrigati", "Gliele metto io: facciamo prima."],
    ["calma", "Dico quanto tempo abbiamo e aspetto vicino alla porta."],
    ["perfetto", "Gli spiego di nuovo come si fa, passo per passo, e controllo che il nodo sia fatto bene."],
    ["compiaci", "Prometto qualcosa in cambio, purché non si arrabbi."]),
  s("bicchiere", "Stai preparando la cena. Il bambino rovescia un bicchiere d'acqua sul tavolo.",
    ["perfetto", "Faccio notare che bastava fare più attenzione."],
    ["forte", "Dico «non è niente» e vado avanti senza parlarne."],
    ["sbrigati", "Asciugo subito io: ho già poco tempo."],
    ["calma", "Prendo uno straccio e asciughiamo insieme."]),
  s("supermercato", "Al supermercato vuole un dolce. Dici di no e scoppia a piangere davanti a tutti.",
    ["calma", "Mi abbasso, ripeto il no con calma e aspetto che passi."],
    ["compiaci", "Lo compro: così smette e nessuno ci guarda."],
    ["forte", "Tiro dritto come se niente fosse, senza far vedere che mi pesa."],
    ["sbrigati", "Taglio corto: lascio metà spesa e andiamo via in fretta."]),
  s("compito", "Un compito non gli riesce. Dopo venti minuti il foglio è ancora mezzo vuoto.",
    ["sforzati", "Dico «impegnati di più» e restiamo lì finché non è finito, anche se è tardi."],
    ["perfetto", "Correggo ogni riga man mano che la scrive."],
    ["calma", "Facciamo una pausa e ripartiamo da un pezzo più piccolo."],
    ["sbrigati", "Suggerisco io le risposte, così chiudiamo."]),
  s("letto", "È ora di dormire. Per la terza volta chiede «ancora cinque minuti».",
    ["compiaci", "Concedo altri cinque minuti: non voglio chiudere la giornata con un pianto."],
    ["sforzati", "Provo una spiegazione dopo l'altra, e la trattativa non finisce più."],
    ["forte", "Spengo la luce e chiudo la porta senza dire niente, anche se dentro mi dispiace."],
    ["calma", "Ricordo l'accordo di prima, una volta sola, e lo accompagno a letto."]),
  s("sconfitta", "Giocate a un gioco da tavolo. Il bambino perde e si mette a piangere.",
    ["forte", "Dico che non si piange per un gioco."],
    ["calma", "Dico che perdere dispiace, e resto lì vicino."],
    ["sforzati", "Dico che la prossima volta deve metterci più impegno."],
    ["perfetto", "Gli spiego le mosse che ha sbagliato."]),
  s("lavoretto", "Domani deve portare a scuola un lavoretto. Lo ha fatto da solo: è storto e pasticciato.",
    ["perfetto", "Lo sistemo io di nascosto, così è presentabile."],
    ["sforzati", "Glielo faccio rifare: si vede che non si è applicato."],
    ["compiaci", "Penso a cosa diranno la maestra e gli altri genitori."],
    ["calma", "È il suo lavoro: lo porta così com'è."]),
  s("gioca-con-me", "Stai finendo una cosa di lavoro o di casa. Il bambino ti chiede di giocare adesso.",
    ["calma", "Dico a che ora finisco, e a quell'ora smetto davvero."],
    ["sforzati", "Dico «dopo», ma poi comincio un'altra cosa e il dopo non arriva."],
    ["compiaci", "Mollo tutto subito, anche se poi dovrò recuperare di notte."],
    ["sbrigati", "Gioco cinque minuti di corsa, con la testa a quello che devo finire."]),
  s("parco", "Al parco litiga con un altro bambino per un gioco.",
    ["forte", "Lo lascio arrangiarsi: deve imparare a cavarsela."],
    ["compiaci", "Faccio dare il gioco all'altro bambino e mi scuso con chi lo accompagna."],
    ["calma", "Mi avvicino e chiedo a tutti e due che cosa è successo."],
    ["sbrigati", "Li separo e andiamo via: non c'è tempo per discutere."]),
  s("giornata-storta", "Hai avuto una giornata pesante. A cena il bambino ti chiede: «Sei triste?»",
    ["forte", "Rispondo «no, va tutto bene» e cambio discorso."],
    ["perfetto", "Penso che un buon genitore non dovrebbe farsi vedere così."],
    ["sforzati", "Faccio la voce allegra, anche se mi costa fatica."],
    ["calma", "Dico che ho avuto una giornata faticosa, e che lui non c'entra."]),
];

export const TOTALE_DOMANDE = AFFERMAZIONI.length + SITUAZIONI.length;

/** Le risposte: id dell'affermazione → 1…5, id della situazione → posto della scelta (0…3). */
export type Risposte = Record<string, number>;

export type Livello = "alta" | "media" | "bassa";

export interface Profilo {
  /** Da 0 a 100: quanto la spinta è presente nelle risposte. NON è un confronto con altre persone. */
  punteggi: Record<Spinta, number>;
  livelli: Record<Spinta, Livello>;
  /** Le spinte dalla più presente alla meno presente. */
  ordine: Spinta[];
  /** La spinta o le due spinte che guidano la lettura; vuoto se nessuna è almeno «media» o se sono in tante alla pari. */
  principali: Spinta[];
  /** true = tre o più spinte sono in testa quasi alla pari: nessuna guida da sola. */
  allaPari: boolean;
  /** Nelle dieci situazioni: quante volte si è scelta una reazione di ogni spinta. */
  situazioni: Record<Spinta, number>;
  /** Nelle dieci situazioni: quante risposte pensate. */
  calma: number;
  /** La spinta scelta più spesso nelle situazioni (almeno 3 volte e da sola in testa), se c'è. */
  sottoPressione?: Spinta;
}

/** Sopra questa soglia la spinta è «alta», sotto `SOGLIA_MEDIA` è «bassa». */
export const SOGLIA_ALTA = 67;
export const SOGLIA_MEDIA = 40;
/** Stanno «in testa» le spinte almeno «medie» e a non più di questi punti dalla prima: una, due (si leggono insieme) o tante (alla pari). */
const DISTANZA_COPPIA = 8;

export const completo = (r: Risposte) =>
  AFFERMAZIONI.every((d) => r[d.id] >= 1 && r[d.id] <= 5) && SITUAZIONI.every((d) => r[d.id] >= 0 && r[d.id] < d.scelte.length);

/**
 * Il calcolo, sempre uguale: per ogni spinta si sommano le sette risposte
 * (da 1 a 5; quelle rovesciate valgono 6 meno la risposta), e la somma da 7 a
 * 35 diventa un numero da 0 a 100. Le situazioni si contano a parte.
 */
export function calcola(r: Risposte): Profilo {
  const zero = () => Object.fromEntries(SPINTE.map((k) => [k, 0])) as Record<Spinta, number>;
  const somme = zero();
  for (const d of AFFERMAZIONI) {
    const v = Math.min(5, Math.max(1, r[d.id] ?? 3));
    somme[d.spinta] += d.rovescio ? 6 - v : v;
  }
  const punteggi = zero();
  for (const k of SPINTE) punteggi[k] = Math.round(((somme[k] - 7) / 28) * 100);
  const livelli = Object.fromEntries(
    SPINTE.map((k) => [k, punteggi[k] >= SOGLIA_ALTA ? "alta" : punteggi[k] >= SOGLIA_MEDIA ? "media" : "bassa"]),
  ) as Record<Spinta, Livello>;
  // A pari punti vince l'ordine fisso di SPINTE: il risultato non cambia mai da una volta all'altra.
  const ordine = [...SPINTE].sort((x, y) => punteggi[y] - punteggi[x] || SPINTE.indexOf(x) - SPINTE.indexOf(y));
  const inTesta = ordine.filter((k) => punteggi[k] >= SOGLIA_MEDIA && punteggi[ordine[0]] - punteggi[k] <= DISTANZA_COPPIA);
  const allaPari = inTesta.length >= 3;
  const principali: Spinta[] = allaPari ? [] : inTesta;

  const situazioni = zero();
  let calma = 0;
  for (const d of SITUAZIONI) {
    const verso = d.scelte[r[d.id]]?.verso;
    if (verso === "calma") calma += 1;
    else if (verso) situazioni[verso] += 1;
  }
  const perScelte = [...SPINTE].sort((x, y) => situazioni[y] - situazioni[x]);
  const sottoPressione = situazioni[perScelte[0]] >= 3 && situazioni[perScelte[0]] > situazioni[perScelte[1]] ? perScelte[0] : undefined;

  return { punteggi, livelli, ordine, principali, allaPari, situazioni, calma, sottoPressione };
}

export interface Lettura {
  /** Il nome della spinta nell'Analisi Transazionale. */
  nome: string;
  /** Come la diciamo in parole di tutti i giorni. */
  inBreve: string;
  /** La tinta della barra (classi Tailwind del sito). */
  tinta: string;
  risorsa: string;
  pressione: string;
  conIFigli: string;
  /** La frase che scioglie la spinta: nell'Analisi Transazionale si chiama «permesso». */
  permesso: string;
  esercizio: string;
  /**
   * Dove continuare su Giocamizi: indirizzi interni. Il testo del collegamento
   * è il titolo vero della guida o del gioco (lo mette la pagina), così non
   * promettiamo niente che la pagina di arrivo non dica.
   */
  suGiocamizi: string[];
}

export const LETTURE: Record<Spinta, Lettura> = {
  sbrigati: {
    nome: "Sbrigati",
    inBreve: "la spinta a fare in fretta",
    tinta: "bg-arancione",
    risorsa: "Sei una persona rapida: decidi, ti muovi, fai stare molte cose in una giornata.",
    pressione:
      "Sotto pressione tutto può sembrarti urgente, anche quello che non ha una scadenza. La lentezza degli altri diventa un ostacolo, e ti viene da fare tu per fare prima.",
    conIFigli:
      "I bambini hanno tempi più lunghi dei nostri. Con loro la fretta può diventare un «dai, muoviti» ripetuto, le scarpe allacciate al posto loro, le frasi finite da te. Così resta meno occasione di imparare a fare da soli.",
    permesso: "Puoi prenderti il tempo che serve.",
    esercizio:
      "La prossima volta che senti l'urgenza, chiediti: c'è davvero un orario, o lo sto mettendo io? Se c'è, la volta dopo cominciate dieci minuti prima. Se non c'è, lascia finire.",
    suGiocamizi: ["/storie", "/giochi/labirinto-dei-tesori", "/metodo"],
  },
  perfetto: {
    nome: "Sii perfetto",
    inBreve: "la spinta a fare tutto giusto",
    tinta: "bg-viola",
    risorsa: "Sei una persona precisa e affidabile: quello che fai è curato, e gli altri lo sanno.",
    pressione:
      "Sotto pressione l'asticella può salire ancora: vedi prima quello che manca di quello che c'è, e fai fatica a dire «va bene così».",
    conIFigli:
      "Con i figli può diventare una correzione continua: il nodo rifatto, il disegno sistemato, il compito ricontrollato riga per riga. Un bambino corretto molto spesso può cominciare ad avere paura di sbagliare.",
    permesso: "Va bene anche così.",
    esercizio:
      "Questa settimana scegli ogni giorno una cosa fatta dal bambino e lasciala com'è, senza ritoccarla. Di' solo che cosa ti piace.",
    suGiocamizi: ["/guide/ansia-da-verifica", "/guide/bambino-non-sa-perdere", "/giochi/colora-con-mizi"],
  },
  compiaci: {
    nome: "Compiaci",
    inBreve: "la spinta ad accontentare tutti",
    tinta: "bg-rosa-forte",
    risorsa: "Senti subito come stanno gli altri e sai mettere le persone a loro agio.",
    pressione:
      "Sotto pressione il bisogno che tutti siano contenti può passare davanti al tuo. Dici sì quando vorresti dire no, e poi ti resta addosso la fatica.",
    conIFigli:
      "Con i figli il punto delicato è il limite: davanti a una protesta o a un pianto può venirti da cedere per riportare la pace. Una regola che cambia a ogni pianto è più difficile da capire.",
    permesso: "Puoi dire di no e volere bene lo stesso.",
    esercizio:
      "Questa settimana scegli una regola sola e tienila ferma per sette giorni, con una frase sempre uguale. Se arriva la protesta non serve spiegare ancora: basta restare lì vicino.",
    suGiocamizi: ["/guide/tempo-davanti-allo-schermo", "/guide/paghetta-ai-bambini"],
  },
  sforzati: {
    nome: "Sforzati",
    inBreve: "la spinta a faticare",
    tinta: "bg-azzurro",
    risorsa: "Hai energia e non ti tiri indietro: ti butti nelle cose e ci metti impegno.",
    pressione:
      "Sotto pressione l'impegno può contare più del risultato: cominci, ricominci, aggiungi. Se una cosa viene facile ti sembra sospetta, e fermarti ti fa sentire in colpa.",
    conIFigli:
      "Con i figli può diventare un «impegnati di più» anche quando il problema non è l'impegno, e pomeriggi lunghi sui compiti in cui si fatica tanto e si finisce poco.",
    permesso: "Puoi farlo e finirlo. Può anche essere facile.",
    esercizio:
      "Questa settimana, prima di cominciare una cosa con il bambino, decidete insieme quando è finita: «tre righe», «dieci minuti». Arrivati lì, vi fermate.",
    suGiocamizi: ["/guide/compiti-senza-litigare", "/guide/memoria-e-concentrazione"],
  },
  forte: {
    nome: "Sii forte",
    inBreve: "la spinta a farcela senza aiuto",
    tinta: "bg-verde-forte",
    risorsa: "Reggi bene i momenti difficili: nelle emergenze gli altri contano su di te.",
    pressione:
      "Sotto pressione stringi i denti e fai da te. Chiedere aiuto può sembrarti un peso per gli altri, e la fatica si accumula senza che nessuno la veda.",
    conIFigli:
      "Con i figli può uscire come «non è niente» o «non si piange». L'intenzione è proteggerli; il rischio è che imparino a tenersi dentro quello che provano.",
    permesso: "Puoi chiedere. Puoi dire come stai.",
    esercizio:
      "Questa settimana chiedi un aiuto piccolo e preciso a una persona vicina. E una sera, a tavola, racconta una cosa della giornata che ti ha dato fastidio.",
    suGiocamizi: ["/guide/giochi-da-tavolo-cooperativi-per-bambini", "/giochi/le-emozioni-di-mizi"],
  },
};

/** Una riga in più quando due spinte sono in testa insieme. La chiave è in ordine alfabetico. */
const COPPIE: Record<string, string> = {
  "perfetto+sbrigati": "Bene e subito: due richieste che si scontrano. Sotto pressione può sembrarti che niente sia abbastanza curato né abbastanza veloce.",
  "forte+perfetto": "Fare tutto giusto e farlo senza aiuto: è la combinazione che lascia meno spazio alla stanchezza.",
  "perfetto+sforzati": "Tanta fatica e un'asticella che non si ferma: può essere difficile sentire di avere finito.",
  "compiaci+perfetto": "Vuoi fare bene e vuoi che gli altri approvino: il giudizio degli altri può pesare molto su come valuti te.",
  "forte+sforzati": "Fatichi tanto e non lo dici: da fuori può non vedersi quanto ti costa.",
  "forte+sbrigati": "Fai da te e fai in fretta: è facile che gli altri restino indietro, o che non abbiano il tempo di aiutarti.",
  "compiaci+forte": "Ti prendi cura di tutti e non chiedi niente per te: i tuoi bisogni possono arrivare per ultimi.",
  "sbrigati+sforzati": "Sempre in movimento: anche le pause possono sembrarti tempo da riempire.",
  "compiaci+sforzati": "Ti dai da fare per gli altri e fai fatica a dire basta: il rischio è prendere più impegni di quelli che riesci a chiudere.",
  "compiaci+sbrigati": "Vuoi accontentare tutti e subito: può venirti da dire sì in fretta, prima di chiederti se puoi.",
};

export const letturaDiCoppia = (x: Spinta, y: Spinta): string => COPPIE[[x, y].sort().join("+")] ?? "";

export const ETICHETTA_LIVELLO: Record<Livello, string> = {
  alta: "molto presente",
  media: "presente",
  bassa: "poco presente",
};

/** La frase sulle dieci situazioni: dice un conto, non un giudizio. */
export function letturaSituazioni(p: Profilo): string {
  const pensate =
    p.calma === 0
      ? "In nessuna delle dieci situazioni hai scelto la risposta pensata."
      : p.calma === 1
        ? "In una situazione su dieci hai scelto la risposta pensata."
        : `In ${p.calma} situazioni su dieci hai scelto la risposta pensata.`;
  if (!p.sottoPressione) return `${pensate} Nelle altre le tue reazioni si dividono tra più spinte: nessuna prevale.`;
  const volte = p.situazioni[p.sottoPressione];
  const nome = LETTURE[p.sottoPressione].nome;
  const diversa =
    p.principali.length && !p.principali.includes(p.sottoPressione)
      ? " Non è la spinta più presente nelle tue risposte generali: può darsi che esca soprattutto a casa, nei momenti stretti."
      : "";
  return `${pensate} Quando hai scelto una reazione d'istinto, la più frequente è stata quella di «${nome}» (${volte} volte).${diversa}`;
}

/** Il testo dei collegamenti verso le pagine che non sono guide né giochi. */
export const TITOLI_PAGINE: Record<string, string> = {
  "/storie": "Le storie da leggere insieme",
  "/metodo": "Il metodo: perché i giochi non hanno il timer",
};

/** Le fonti del modello, citate nella pagina. */
export const FONTI_PERCORSO = [
  "Kahler T., Capers H. (1974), «The Miniscript», Transactional Analysis Journal, 4(1).",
  "Kahler T. (1975), «Drivers: The Key to the Process of Scripts», Transactional Analysis Journal, 5(3).",
];
