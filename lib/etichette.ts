/**
 * Le etichette che distinguono a colpo d'occhio il tipo di attività
 * (ludoteca, sala feste, bar per famiglie, asilo…): stesso colore e stessa
 * icona su card, scheda e segnaposto della mappa. Si ricavano dal «tipo»
 * della scheda (la prima regola che combacia vince) e, se nessuna combacia,
 * dalla categoria della directory. Un tipo nuovo = una riga qui.
 */

export type IdEtichetta =
  | "bar"
  | "asilo"
  | "fattoria"
  | "museo"
  | "sport"
  | "divertimenti"
  | "ludoteca"
  | "coperto"
  | "aperto"
  | "sala";

export interface Etichetta {
  id: IdEtichetta;
  nome: string;
  icona: string;
  /** Fondo chiaro, testo scuro e colore pieno (segnaposto della mappa). */
  fondo: string;
  testo: string;
  pieno: string;
}

const E: Record<IdEtichetta, Etichetta> = {
  bar: { id: "bar", nome: "Bar e ristoranti", icona: "☕", fondo: "#F3E6DA", testo: "#6B4026", pieno: "#9A6240" },
  asilo: { id: "asilo", nome: "Asilo e nido", icona: "🍼", fondo: "#FDE7EF", testo: "#9C2F5C", pieno: "#E36E9C" },
  fattoria: { id: "fattoria", nome: "Fattoria", icona: "🐐", fondo: "#E6F2DC", testo: "#3D6B1F", pieno: "#6AA43A" },
  museo: { id: "museo", nome: "Museo e scienza", icona: "🔭", fondo: "#FFF3CF", testo: "#7A5A00", pieno: "#E0A800" },
  sport: { id: "sport", nome: "Sport e laser game", icona: "⚡", fondo: "#FFEBD3", testo: "#8A4A00", pieno: "#F59A23" },
  divertimenti: { id: "divertimenti", nome: "Parco divertimenti", icona: "🎡", fondo: "#E5E9FB", testo: "#2F3F95", pieno: "#5A6FE0" },
  ludoteca: { id: "ludoteca", nome: "Ludoteca", icona: "🧩", fondo: "#F0E8FA", testo: "#5B3A9A", pieno: "#9B6DD6" },
  coperto: { id: "coperto", nome: "Parco giochi al coperto", icona: "🏰", fondo: "#E2F2FB", testo: "#185E7E", pieno: "#3DB5E6" },
  aperto: { id: "aperto", nome: "All'aperto", icona: "🌳", fondo: "#E3F4E7", testo: "#2E7D4A", pieno: "#4CAF6D" },
  sala: { id: "sala", nome: "Sala feste", icona: "🎉", fondo: "#FCE6EE", testo: "#A23462", pieno: "#F28AB2" },
};

/** Regole sul «tipo», in ordine: la prima che combacia vince. */
const REGOLE: [RegExp, IdEtichetta][] = [
  [/\bbar\b|caff[eè]|gelateri|trattori|ristorant|pizzeri/i, "bar"],
  [/asilo|\bnido\b|^spazio per l'infanzia|^baby parking/i, "asilo"],
  [/fattoria|agriturism/i, "fattoria"],
  [/museo|scientific/i, "museo"],
  [/laser|bowling|\bkart|sportiv|trampolin/i, "sport"],
  [/parco divertimenti|luna park|parco a tema/i, "divertimenti"],
  [/ludotec|playroom|sala giochi/i, "ludoteca"],
  [/parco giochi|area giochi/i, "coperto"],
  [/all'aperto|giardino con/i, "aperto"],
  [/sal[ae]|salon|location|feste|eventi|animazion/i, "sala"],
];

const PER_CATEGORIA: Record<string, IdEtichetta> = {
  ludoteche: "ludoteca",
  "sale-feste": "sala",
  "parchi-giochi-al-coperto": "coperto",
  "parchi-all-aperto": "aperto",
  "musei-per-bambini": "museo",
  "laser-game": "sport",
};

export function etichettaDi(tipo: string, categoria: string): Etichetta {
  const regola = REGOLE.find(([r]) => r.test(tipo));
  return E[regola?.[1] ?? PER_CATEGORIA[categoria] ?? "sala"];
}

export const ETICHETTE = Object.values(E);
