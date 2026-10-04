// Sfondi biglietti — 25 temi × 2 varianti. File in public/cards/bg-{tema}-{chiaro|colorato}.png (1240×1748)
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
 * quando nel creatore è scelto il tema. Due per tema, solo per i temi
 * dove la frase a tema suona davvero meglio di quella generica.
 */
export const phrasesPerTema: Record<string, string[]> = {
  halloween: [
    "Dolcetto o scherzetto? {nome} compie {eta} anni: festa da brivido!",
    "Streghette e fantasmini, siete invitati: {nome} festeggia {eta} anni!",
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
    "Grazie per essere venuto alla mia festa! Con affetto, {nome}",
    "È stato bellissimo festeggiare insieme. Grazie! {nome}",
  ],
};
