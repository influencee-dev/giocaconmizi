// Sfondi biglietti — un tema × 2 varianti; i motivi sono SVG (components/biglietti/motivi.tsx)
export type Gender = "f" | "m" | "n";
export interface CardBg { id: string; theme: string; label: string; variant: "chiaro" | "colorato"; gender: Gender; ageMin: number; ageMax: number; keywords: string[]; file: string; }

const themes: [string, string, Gender, number, number, string[]][] = [
  ["unicorno", "Unicorno", "f", 3, 9, ["unicorno", "arcobaleno", "magia"]],
  ["dinosauri", "Dinosauri", "m", 3, 9, ["dinosauri", "t-rex", "preistoria"]],
  ["calcio", "Calcio", "m", 5, 12, ["calcio", "pallone", "stadio"]],
  ["principessa", "Principessa", "f", 3, 8, ["principessa", "castello", "corona"]],
  ["supereroe", "Supereroi", "n", 4, 10, ["supereroi", "eroe", "mantello"]],
  ["spazio", "Spazio e razzi", "n", 4, 12, ["spazio", "razzo", "pianeti", "astronauta"]],
  ["animali-foresta", "Animali della foresta", "n", 1, 6, ["animali", "volpe", "orsetto", "bosco"]],
  ["fattoria", "Fattoria", "n", 1, 6, ["fattoria", "trattore", "mucca"]],
  ["sirena", "Sirena", "f", 3, 9, ["sirena", "mare", "conchiglie"]],
  ["pirati", "Pirati", "m", 4, 10, ["pirati", "tesoro", "nave"]],
  ["mondo-a-cubetti", "Mondo a cubetti", "n", 6, 12, ["cubetti", "gaming", "pixel", "minecraft"]],
  ["macchinine", "Macchinine", "m", 2, 7, ["macchinine", "auto", "corsa", "cars"]],
  ["cuccioli", "Cuccioli", "n", 2, 8, ["cuccioli", "cagnolini", "gattini", "paw"]],
  ["farfalle-fiori", "Farfalle e fiori", "f", 2, 8, ["farfalle", "fiori", "primavera"]],
  ["arcobaleno", "Arcobaleno", "n", 1, 8, ["arcobaleno", "nuvole", "colori"]],
  ["circo", "Circo", "n", 2, 7, ["circo", "tendone", "clown"]],
  ["safari", "Safari", "n", 2, 8, ["safari", "giungla", "leone", "giraffa"]],
  ["mare-estate", "Mare ed estate", "n", 1, 12, ["mare", "estate", "spiaggia", "piscina"]],
  ["dolci-torta", "Dolci e torta", "n", 1, 10, ["torta", "cupcake", "caramelle"]],
  ["palloncini", "Palloncini e coriandoli", "n", 1, 12, ["palloncini", "coriandoli", "festa"]],
  ["robot", "Robot", "m", 4, 10, ["robot", "tecnologia", "ingranaggi"]],
  ["fate", "Fate", "f", 3, 8, ["fate", "fatina", "bacchetta"]],
  ["ballerina", "Ballerina", "f", 3, 9, ["ballerina", "danza", "tutù"]],
  ["mattoncini", "Mattoncini", "n", 3, 10, ["mattoncini", "costruzioni", "lego"]],
  ["halloween", "Halloween", "n", 3, 12, ["halloween", "zucca", "fantasmi", "pipistrelli", "dolcetto o scherzetto"]],
  ["natale", "Natale", "n", 1, 12, ["natale", "albero", "neve", "renne", "feste di dicembre"]],
  ["stelle-luna", "Stelle e luna", "n", 1, 3, ["stelle", "luna", "primo compleanno", "nanna"]],
];

export const cardBackgrounds: CardBg[] = themes.flatMap(([theme, label, gender, ageMin, ageMax, keywords]) =>
  (["chiaro", "colorato"] as const).map(variant => ({
    id: `${theme}-${variant}`, theme, label, variant, gender, ageMin, ageMax, keywords,
    file: `/cards/bg-${theme}-${variant}.png`,
  }))
);

export const cardTypes = ["invito", "auguri", "ringraziamento"] as const;
export const cardFormats = { a6: [1240, 1748], a5: [1748, 2480], story: [1080, 1920], square: [1080, 1080] } as const;

/**
 * Frasi d'invito su misura del tema: compaiono PRIMA di quelle generiche
 * quando nel creatore è scelto il tema, e nella pagina del tema. Due per tema.
 */
export const phrasesPerTema: Record<string, string[]> = {
  halloween: [
    "Dolcetto o scherzetto? {nome} compie {eta} anni: festa da brivido!",
    "Streghette e fantasmini, siete invitati: {nome} festeggia {eta} anni!",
  ],
  natale: [
    "Un compleanno sotto l'albero: {nome} compie {eta} anni, vieni a festeggiare?",
    "Campanelline e cioccolata calda: festeggiamo i {eta} anni di {nome}!",
  ],
  unicorno: [
    "{nome} compie {eta} anni: una festa magica ti aspetta!",
    "Unicorni e arcobaleni per i {eta} anni di {nome}: vieni a festeggiare?",
  ],
  dinosauri: [
    "ROAARRR! {nome} compie {eta} anni: festa giurassica in arrivo!",
    "Caccia al dinosauro per i {eta} anni di {nome}: ti aspettiamo!",
  ],
  calcio: [
    "Fischio d'inizio! {nome} compie {eta} anni: vieni a giocare con noi?",
    "{nome} ti convoca per la festa dei suoi {eta} anni: non mancare!",
  ],
  principessa: [
    "Il castello è in festa: la principessa {nome} compie {eta} anni!",
    "Sei invitato a corte: {nome} festeggia {eta} anni da vera principessa!",
  ],
  supereroe: [
    "Serve il tuo superpotere: {nome} compie {eta} anni, vieni a salvarci la festa!",
    "Missione compleanno: {nome} spegne {eta} candeline. Accetti l'incarico?",
  ],
  spazio: [
    "3, 2, 1... decollo! {nome} compie {eta} anni: festa spaziale!",
    "Destinazione festa: {nome} ti aspetta per i suoi {eta} anni tra le stelle.",
  ],
  sirena: [
    "In fondo al mar si festeggia: {nome} compie {eta} anni!",
    "Tuffati alla festa di {nome}: {eta} anni tra onde e conchiglie!",
  ],
  pirati: [
    "All'arrembaggio! {nome} compie {eta} anni: la ciurma ti aspetta!",
    "C'è un tesoro alla festa di {nome}: vieni a cercarlo per i suoi {eta} anni!",
  ],
  "mondo-a-cubetti": [
    "Nuova missione sbloccata: la festa dei {eta} anni di {nome}!",
    "{nome} compie {eta} anni: vieni a costruire la festa blocco su blocco?",
  ],
  // Dal 19/11/2026 ogni tema ha le sue due frasi. Regole: corte (stanno sul
  // biglietto senza toccare la data), senza «invitato/invitata», senza
  // personaggi dei cartoni.
  "animali-foresta": [
    "Nel bosco si fa festa: {nome} compie {eta} anni!",
    "Volpi e orsetti ti aspettano: vieni ai {eta} anni di {nome}?",
  ],
  fattoria: [
    "Chicchirichì! {nome} compie {eta} anni: festa in fattoria!",
    "Tutti sul trattore: si va alla festa dei {eta} anni di {nome}!",
  ],
  macchinine: [
    "Pronti, partenza, via! {nome} compie {eta} anni: ti aspettiamo.",
    "Motori accesi per i {eta} anni di {nome}: vieni a fare un giro?",
  ],
  cuccioli: [
    "Bau, miao e tanta torta: {nome} compie {eta} anni!",
    "Zampette in festa per i {eta} anni di {nome}: vieni anche tu?",
  ],
  "farfalle-fiori": [
    "È sbocciata una festa: {nome} compie {eta} anni!",
    "Tra farfalle e fiori festeggiamo i {eta} anni di {nome}: vieni?",
  ],
  arcobaleno: [
    "Una festa di tutti i colori: {nome} compie {eta} anni!",
    "In fondo all'arcobaleno c'è la torta di {nome}: {eta} anni!",
  ],
  circo: [
    "Venghino, venghino! {nome} compie {eta} anni: comincia lo spettacolo.",
    "Sotto il tendone si festeggia: {eta} anni per {nome}!",
  ],
  safari: [
    "Zaino in spalla: si parte per il safari dei {eta} anni di {nome}!",
    "Leoni, giraffe e torta: {nome} compie {eta} anni, vieni?",
  ],
  "mare-estate": [
    "Costume e asciugamano: {nome} compie {eta} anni, festa al mare!",
    "Sole, tuffi e torta per i {eta} anni di {nome}: ti aspettiamo!",
  ],
  "dolci-torta": [
    "Chi vuole una fetta di torta? {nome} compie {eta} anni!",
    "Festa dolcissima per i {eta} anni di {nome}: vieni ad assaggiarla?",
  ],
  palloncini: [
    "Palloncini pronti a volare: {nome} compie {eta} anni!",
    "Coriandoli, palloncini e amici: alla festa di {nome} manchi solo tu!",
  ],
  robot: [
    "Bip bip! Messaggio per te: {nome} compie {eta} anni.",
    "Modalità festa attivata: vieni ai {eta} anni di {nome}?",
  ],
  fate: [
    "Un pizzico di polvere di stelle: {nome} compie {eta} anni!",
    "Nel giardino delle fate si festeggia: {eta} anni per {nome}!",
  ],
  ballerina: [
    "Sulle punte verso la festa: {nome} compie {eta} anni!",
    "Musica, piroette e torta per i {eta} anni di {nome}: vieni?",
  ],
  mattoncini: [
    "Un mattoncino alla volta costruiamo la festa: {nome} compie {eta} anni!",
    "Alla festa di {nome} manca un pezzo: sei tu! Vieni ai suoi {eta} anni?",
  ],
  // Tema dei primi compleanni: niente «{eta} anni», che a un anno suonerebbe storto.
  "stelle-luna": [
    "Brilla una stellina in più: è la festa di {nome}!",
    "Sotto la luna e le stelle festeggiamo {nome}: vieni anche tu?",
  ],
};

/**
 * Auguri a tema: con lo sfondo di Natale il biglietto di auguri diventa un
 * biglietto di Natale ({nome} è chi lo riceve: «Nonna Rosa», «Maestra Anna»).
 */
export const auguriPerTema: Record<string, string[]> = {
  natale: [
    "Buon Natale {nome}! Che la tua casa sia piena di luci, biscotti e risate.",
    "Tanti auguri di buon Natale e felice anno nuovo, {nome}!",
    "{nome}, ti auguro un Natale caldo come una tazza di cioccolata.",
    "Per {nome}: grazie di esserci, buone feste!",
    "Buone feste {nome}! Ci vediamo sotto l'albero.",
  ],
};

/**
 * Grazie a tema (dal 23/11/2026): dopo la festa il biglietto di ringraziamento
 * riprende lo sfondo dell'invito. Due frasi per tema, firmate da {nome} (chi ha
 * festeggiato), senza genere: vanno bene per chiunque le riceva.
 */
export const graziePerTema: Record<string, string[]> = {
  unicorno: [
    "Grazie per aver reso magica la mia festa! Un abbraccio, {nome}",
    "Un arcobaleno di grazie per aver festeggiato con me! {nome}",
  ],
  dinosauri: [
    "Un grazie grande come un T-Rex per aver festeggiato con me! {nome}",
    "Che festa da ruggito! Grazie di cuore, {nome}",
  ],
  calcio: [
    "Che partita, la mia festa! Grazie per aver giocato con me. {nome}",
    "Grazie: con te in squadra, che gol la mia festa! {nome}",
  ],
  principessa: [
    "Grazie per aver festeggiato a corte con me! Con affetto, {nome}",
    "Una festa da favola, grazie a te. Un abbraccio, {nome}",
  ],
  supereroe: [
    "Missione festa compiuta, anche grazie a te! {nome}",
    "Un super grazie per aver festeggiato con me! {nome}",
  ],
  spazio: [
    "Grazie per il viaggio tra le stelle alla mia festa! {nome}",
    "Un grazie grande come la galassia! Con affetto, {nome}",
  ],
  "animali-foresta": [
    "Grazie per aver festeggiato nel bosco con me! Un abbraccio, {nome}",
    "Volpi, orsetti e tu: che bella festa! Grazie, {nome}",
  ],
  fattoria: [
    "Grazie per la festa in fattoria! Un abbraccio, {nome}",
    "Chicchirichì, che festa! Grazie per aver festeggiato con me. {nome}",
  ],
  sirena: [
    "Un mare di grazie per aver festeggiato con me! {nome}",
    "Grazie per il tuffo nella mia festa! Con affetto, {nome}",
  ],
  pirati: [
    "Il tesoro più bello della festa? Avere te a bordo. Grazie! {nome}",
    "Grazie, ciurma: che avventura la mia festa! {nome}",
  ],
  "mondo-a-cubetti": [
    "Una festa costruita cubetto dopo cubetto, anche grazie a te! {nome}",
    "Grazie per aver giocato con me alla mia festa! {nome}",
  ],
  macchinine: [
    "Grazie per la corsa fino alla mia festa! Un abbraccio, {nome}",
    "Pronti, via... grazie! Che bella festa insieme. {nome}",
  ],
  cuccioli: [
    "Grazie per le coccole e i giochi alla mia festa! {nome}",
    "Tanti grazie e una zampa sul cuore. Con affetto, {nome}",
  ],
  "farfalle-fiori": [
    "Un mazzo di grazie per aver festeggiato con me! {nome}",
    "Grazie: con te la mia festa è fiorita! Un abbraccio, {nome}",
  ],
  arcobaleno: [
    "Grazie per aver colorato la mia festa! Con affetto, {nome}",
    "Tutti i colori dell'arcobaleno per dirti grazie! {nome}",
  ],
  circo: [
    "Che spettacolo, la mia festa! Grazie per l'applauso. {nome}",
    "Grazie per aver riso e giocato sotto il tendone con me! {nome}",
  ],
  safari: [
    "Un grazie alto come una giraffa! Con affetto, {nome}",
    "Grazie per l'avventura alla mia festa! Un abbraccio, {nome}",
  ],
  "mare-estate": [
    "Un'onda di grazie per aver festeggiato con me! {nome}",
    "Grazie per le risate al sole della mia festa! {nome}",
  ],
  "dolci-torta": [
    "Grazie: la torta era buona, ma con te di più! {nome}",
    "Un grazie dolce come la mia torta! Con affetto, {nome}",
  ],
  palloncini: [
    "Grazie per aver fatto volare la mia festa! {nome}",
    "Coriandoli, palloncini e tu: grazie di cuore! {nome}",
  ],
  robot: [
    "Bip bip: grazie per aver festeggiato con me! {nome}",
    "Messaggio per te: festa riuscita, grazie! {nome}",
  ],
  fate: [
    "Un pizzico di magia e tanti grazie! Con affetto, {nome}",
    "Grazie per aver volato fino alla mia festa! {nome}",
  ],
  ballerina: [
    "Grazie per aver ballato con me alla mia festa! {nome}",
    "Un inchino e un grazie grande così! Con affetto, {nome}",
  ],
  mattoncini: [
    "Mattoncino dopo mattoncino, che bella festa! Grazie, {nome}",
    "Grazie per aver costruito con me una festa bellissima! {nome}",
  ],
  halloween: [
    "Grazie per la festa da brivido! Un abbraccio, {nome}",
    "Dolcetti, scherzetti e tu: grazie di cuore! {nome}",
  ],
  natale: [
    "Grazie per il pensiero sotto l'albero! Con affetto, {nome}",
    "Grazie per aver festeggiato con me tra luci e biscotti! {nome}",
  ],
  "stelle-luna": [
    "Grazie per aver festeggiato con noi {nome}!",
    "Sotto la luna e le stelle, un grazie da {nome}.",
  ],
};

export const phrases = {
  invito: [
    "{nome} compie {eta} anni e vuole festeggiare con te!",
    "Vieni alla festa di {nome}? Ci saranno giochi, torta e tanti amici.",
    "{nome} ti aspetta per spegnere {eta} candeline insieme!",
    "Una festa senza di te non è una festa: vieni al compleanno di {nome}!",
  ],
  auguri: [
    "Tanti auguri {nome}! {eta} anni di risate, giochi e abbracci.",
    "Buon compleanno {nome}! Che questo sia un anno pieno di scoperte.",
    "Auguri {nome}: {eta} anni e sei già un piccolo grande campione.",
  ],
  ringraziamento: [
    "Grazie per aver festeggiato con me! Con affetto, {nome}",
    "È stato bellissimo festeggiare insieme. Grazie! {nome}",
  ],
};
