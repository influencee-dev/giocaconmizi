import collana from "@/content/libri/_collana.json";
import v01 from "@/content/libri/v01.json";

/**
 * I libri di Mizi nella vetrina del sito (/libri). Si comprano SOLO su Amazon
 * (decisione di Giorgia del 27/11/2026): qui c'è la presentazione e il pulsante
 * che porta alla pagina Amazon del libro.
 *
 * I dati vengono dalle stesse schede da cui nasce il libro stampato
 * (content/libri/<codice>.json, docs/libri-kdp.md). Un volume entra nella vetrina
 * con `vetrina.pubblico: true`; il pulsante «Compralo su Amazon» compare solo
 * quando `vetrina.amazon` contiene l'indirizzo vero della pagina Amazon, fino ad
 * allora il libro risulta «in arrivo». Un volume nuovo = una riga in SCHEDE.
 */

type Scheda = typeof v01;

const SCHEDE: Scheda[] = [v01];

export interface LibroVetrina {
  codice: string;
  volume: number;
  titolo: string;
  quarta: string[];
  copertina: string;
  alt: string;
  tema: string;
  eta: string;
  /** Indirizzo della pagina Amazon; null finché il libro non è in vendita. */
  amazon: string | null;
  pagine: number;
  latoCm: string;
  autrici: string;
}

const LATO_CM = (collana.formato.lato_pollici * 2.54).toFixed(1).replace(".", ",");

export const LIBRI: LibroVetrina[] = SCHEDE.filter((s) => s.vetrina?.pubblico).map((s) => ({
  codice: s.codice,
  volume: s.volume,
  titolo: s.titolo,
  quarta: s.quarta,
  copertina: s.vetrina.copertina,
  alt: s.vetrina.alt,
  tema: s.vetrina.tema,
  eta: s.vetrina.eta,
  amazon: /^https:\/\/(www\.)?amazon\.[a-z.]+\//.test(s.vetrina.amazon) ? s.vetrina.amazon : null,
  pagine: collana.formato.pagine,
  latoCm: LATO_CM,
  autrici: collana.firma[1],
}));

export const STORIA_AUTRICI = { titolo: collana.storia_titolo, righe: collana.storia, foto: "/immagini/giorgia-e-domiziana-giocamizi.webp" };

export const PERCORSO_LIBRI = "/libri";
