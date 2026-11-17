"use client";

import { Esplora } from "@/games/_engine/Esplora";
import type { SpecSala } from "@/games/_engine/esplora-logica";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Il labirinto dei tesori (5–9 anni).
 * Mizi esplora una mappa sala per sala: si tocca una casella e lei ci va. Ogni
 * sala ha una missione che apre la porta; nell'ultima c'è il tesoro.
 *
 * Le missioni sono fisse per fascia d'età (cambiano solo il labirinto e i
 * posti delle cose): così tutto quello che Mizi dice sta nel copione della
 * voce, content/voce-mizi.json sotto «labirinto-dei-tesori».
 */

const UNO_CINQUE = ["Uno!", "Due!", "Tre!", "Quattro!", "Cinque!"];

/** 5–6 anni: mappa piccola, si conta, si sceglie, si mettono in fila i primi numeri. */
const SALE_PICCOLI: SpecSala[] = [
  {
    istruzione: "Tocca un fiore e Mizi va a prenderlo. Trova 3 fiori, poi vai alla porta.",
    colonne: 4,
    righe: 5,
    nebbia: false,
    giusti: [{ figura: "fiore" }, { figura: "fiore" }, { figura: "fiore" }],
    conta: UNO_CINQUE.slice(0, 3),
    cruscotto: "caselle",
    errore: "Non è questo. Cerca ancora.",
    fatto: "Tre fiori! La porta è aperta.",
  },
  {
    istruzione: "Qui ci sono le nuvole: cammina per scoprire la mappa. Prendi solo gli animali, poi vai alla porta.",
    colonne: 4,
    righe: 5,
    nebbia: true,
    giusti: [
      { figura: "gatto", voce: "Gatto!" },
      { figura: "cane", voce: "Cane!" },
      { figura: "rana", voce: "Rana!" },
    ],
    altri: [{ figura: "mela" }, { figura: "palla" }],
    cruscotto: "caselle",
    errore: "Questo non è un animale. Cerca gli animali.",
    fatto: "Hai trovato tutti gli animali! La porta è aperta.",
  },
  {
    istruzione: "Prendi i numeri in ordine: uno, due, tre, quattro. Poi vai alla porta.",
    colonne: 4,
    righe: 5,
    nebbia: true,
    giusti: [
      { testo: "1", voce: "Uno!" },
      { testo: "2", voce: "Due!" },
      { testo: "3", voce: "Tre!" },
      { testo: "4", voce: "Quattro!" },
    ],
    inOrdine: true,
    cruscotto: "caselle",
    errore: "Non ancora. Cerca il numero che viene prima.",
    fatto: "Uno, due, tre, quattro! La porta è aperta.",
  },
  {
    istruzione: "Trova 5 pesci per Mizi. Poi apri il tesoro.",
    colonne: 4,
    righe: 5,
    nebbia: true,
    giusti: [{ figura: "pesce" }, { figura: "pesce" }, { figura: "pesce" }, { figura: "pesce" }, { figura: "pesce" }],
    altri: [{ figura: "stella" }, { figura: "mela" }],
    conta: UNO_CINQUE,
    cruscotto: "caselle",
    errore: "Questo non è un pesce. Cerca i pesci.",
    fatto: "Cinque pesci! Il tesoro si apre.",
  },
];

const ERRORE_LETTERA = "Questa lettera non serve adesso. Guarda la parola in alto.";

/** 7–9 anni: mappa più grande, sempre con le nuvole; numeri, parole, pari e dispari, la spesa. */
const SALE_GRANDI: SpecSala[] = [
  {
    istruzione: "Cammina per scoprire la mappa. Prendi i numeri dal più piccolo al più grande, poi vai alla porta.",
    colonne: 5,
    righe: 6,
    nebbia: true,
    giusti: [
      { testo: "3", voce: "Tre!" },
      { testo: "7", voce: "Sette!" },
      { testo: "12", voce: "Dodici!" },
      { testo: "18", voce: "Diciotto!" },
      { testo: "25", voce: "Venticinque!" },
    ],
    inOrdine: true,
    cruscotto: "caselle",
    errore: "Non ancora. Cerca il numero più piccolo rimasto.",
    fatto: "Tutti in fila, dal più piccolo al più grande! La porta è aperta.",
  },
  {
    istruzione: "Raccogli le lettere della parola «mare», una dopo l'altra. Poi vai alla porta.",
    colonne: 5,
    righe: 6,
    nebbia: true,
    giusti: [
      { testo: "M", voce: "Emme!" },
      { testo: "A", voce: "A!" },
      { testo: "R", voce: "Erre!" },
      { testo: "E", voce: "E!" },
    ],
    altri: [{ testo: "L" }, { testo: "O" }],
    inOrdine: true,
    cruscotto: "parola",
    errore: ERRORE_LETTERA,
    fatto: "Mare! La porta è aperta.",
  },
  {
    istruzione: "Prendi solo i numeri pari. Poi vai alla porta.",
    colonne: 5,
    righe: 6,
    nebbia: true,
    giusti: [
      { testo: "2", voce: "Due!" },
      { testo: "6", voce: "Sei!" },
      { testo: "8", voce: "Otto!" },
      { testo: "14", voce: "Quattordici!" },
    ],
    altri: [{ testo: "5" }, { testo: "9" }, { testo: "11" }],
    cruscotto: "caselle",
    errore: "Questo numero è dispari. Cerca i numeri pari.",
    fatto: "Tutti pari! La porta è aperta.",
  },
  {
    istruzione: "Hai 10 monete. Compra solo quello che c'è nella lista in alto, poi vai alla porta.",
    colonne: 5,
    righe: 6,
    nebbia: true,
    giusti: [
      { figura: "pesce", prezzo: 3, voce: "Pesce: tre monete." },
      { figura: "mela", prezzo: 2, voce: "Mela: due monete." },
      { figura: "libro", prezzo: 4, voce: "Libro: quattro monete." },
    ],
    altri: [
      { figura: "palla", prezzo: 5 },
      { figura: "torta", prezzo: 6 },
    ],
    borsa: 10,
    cruscotto: "lista",
    errore: "Non è nella lista. Guarda la lista in alto.",
    fatto: "Spesa fatta! Ti resta una moneta. La porta è aperta.",
  },
  {
    istruzione: "Raccogli le lettere della parola «tesoro», una dopo l'altra. Poi apri il tesoro.",
    colonne: 5,
    righe: 6,
    nebbia: true,
    giusti: [
      { testo: "T", voce: "Ti!" },
      { testo: "E", voce: "E!" },
      { testo: "S", voce: "Esse!" },
      { testo: "O", voce: "O!" },
      { testo: "R", voce: "Erre!" },
      { testo: "O", voce: "O!" },
    ],
    altri: [{ testo: "A" }, { testo: "L" }],
    inOrdine: true,
    cruscotto: "parola",
    errore: ERRORE_LETTERA,
    fatto: "Tesoro! Il forziere si apre.",
  },
];

export default function Game(props: GameProps) {
  return <Esplora {...props} titolo="Il labirinto dei tesori" sale={props.age <= 6 ? SALE_PICCOLI : SALE_GRANDI} />;
}
