import dati from "@/content/negozio/catalogo.json";

/**
 * Il negozio dei PDF da stampare a casa (23/11/2026, docs/negozio.md).
 *
 * Per ogni volume della collana si vendono tre cose:
 *   - il libretto completo (storia + disegni), in A4 e in A5 due per foglio;
 *   - il pacchetto dei disegni da colorare, senza storia, in A4 e in A5 due per foglio;
 *   - ogni disegno da solo, in A4.
 * I prodotti non si scrivono a mano: nascono dal volume (content/negozio/catalogo.json).
 * I PDF stanno nell'archivio privato «negozio» di Supabase, mai nel repo (è pubblico).
 */

/**
 * Interruttore del negozio. Finché è false: pagine noindex, fuori dalla sitemap,
 * nessun collegamento dal sito, e il pagamento parte solo con una chiave Stripe
 * di prova (sk_test_). Lo accende Giorgia, dopo i passi di docs/negozio.md
 * (condizioni di vendita rilette, account Stripe vero, file caricati).
 */
export const NEGOZIO_APERTO = false;

export const PERCORSO_NEGOZIO = "/negozio";

export type TipoProdotto = "libretto" | "disegni" | "disegno";

export interface Volume {
  codice: string;
  titolo: string;
  tema: string;
  in_vendita: boolean;
  descrizione: string;
  pagine_libretto: number;
  disegni: number;
}

export interface FileProdotto {
  /** Chiave breve usata nel link di scarico. */
  chiave: string;
  /** Il nome che vede chi scarica. */
  nome: string;
  /** Il percorso nell'archivio privato. */
  percorso: string;
}

export interface Prodotto {
  codice: string;
  volume: Volume;
  tipo: TipoProdotto;
  /** Solo per il disegno singolo: 1…12. */
  numero?: number;
  nome: string;
  sotto: string;
  prezzo: number;
  file: FileProdotto[];
}

export const PREZZI = dati.prezzi;
export const VOLUMI: Volume[] = dati.volumi;

const due = (n: number) => String(n).padStart(2, "0");

/** Il nome di file che la famiglia si ritrova nei download: leggibile, senza spazi. */
function nomeFile(v: Volume, resto: string) {
  return `Giocamizi-${v.codice.toUpperCase()}-${resto}.pdf`;
}

function prodottiDel(v: Volume): Prodotto[] {
  const elenco: Prodotto[] = [
    {
      codice: `${v.codice}-libretto`,
      volume: v,
      tipo: "libretto",
      nome: "Il libretto completo",
      sotto: `La storia e i ${v.disegni} disegni, ${v.pagine_libretto} pagine. Da stampare su fogli A4, oppure due pagine per foglio come un vero libretto.`,
      prezzo: PREZZI.libretto,
      file: [
        { chiave: "libretto-a4", nome: nomeFile(v, "libretto-A4"), percorso: `${v.codice}/libretto-A4.pdf` },
        { chiave: "libretto-a5", nome: nomeFile(v, "libretto-due-pagine-per-foglio"), percorso: `${v.codice}/libretto-A5.pdf` },
      ],
    },
    {
      codice: `${v.codice}-disegni`,
      volume: v,
      tipo: "disegni",
      nome: `I ${v.disegni} disegni da colorare`,
      sotto: "Solo i disegni, senza la storia. Un disegno per foglio A4, oppure due per foglio da tagliare a metà.",
      prezzo: PREZZI.disegni,
      file: [
        { chiave: "disegni-a4", nome: nomeFile(v, "disegni-A4"), percorso: `${v.codice}/disegni-A4.pdf` },
        { chiave: "disegni-a5", nome: nomeFile(v, "disegni-due-per-foglio"), percorso: `${v.codice}/disegni-A5.pdf` },
      ],
    },
  ];
  for (let n = 1; n <= v.disegni; n++) {
    elenco.push({
      codice: `${v.codice}-disegno-${due(n)}`,
      volume: v,
      tipo: "disegno",
      numero: n,
      nome: `Disegno n. ${n}`,
      sotto: "Un disegno da colorare su un foglio A4.",
      prezzo: PREZZI.disegno,
      file: [{ chiave: `disegno-${due(n)}`, nome: nomeFile(v, `disegno-${due(n)}`), percorso: `${v.codice}/disegno-${due(n)}-A4.pdf` }],
    });
  }
  return elenco;
}

export const PRODOTTI: Prodotto[] = VOLUMI.flatMap(prodottiDel);
const PER_CODICE = new Map(PRODOTTI.map((p) => [p.codice, p]));

export const prodotto = (codice: string) => PER_CODICE.get(codice);
export const volume = (codice: string) => VOLUMI.find((v) => v.codice === codice);
export const prodottiDelVolume = (codice: string) => PRODOTTI.filter((p) => p.volume.codice === codice);

/** L'anteprima del disegno: piccola, con il segno del sito, nell'archivio pubblico «negozio-anteprime». */
export function anteprima(v: Volume, numero: number, base: string) {
  return `${base}/storage/v1/object/public/negozio-anteprime/${v.codice}/disegno-${due(numero)}.webp`;
}

/** Prezzo in euro all'italiana: 99 → «0,99 €». */
export const euro = (centesimi: number) => `${(centesimi / 100).toFixed(2).replace(".", ",")} €`;

/** Un volume si mostra se è in vendita, oppure se il negozio gira con la chiave di prova. */
export const volumeVisibile = (v: Volume, prova: boolean) => v.in_vendita || prova;

export interface EsitoCarrello {
  prodotti: Prodotto[];
  totale: number;
  sottoMinimo: boolean;
  errore?: string;
}

/**
 * Controlla un carrello che arriva dal browser: solo codici veri, niente doppi,
 * al massimo 40 righe, volumi in vendita (o in prova). Un disegno singolo è
 * inutile se nel carrello c'è già il pacchetto o il libretto dello stesso volume:
 * lo togliamo, così nessuno paga due volte lo stesso foglio.
 */
export function controllaCarrello(codici: unknown, prova: boolean): EsitoCarrello {
  if (!Array.isArray(codici) || codici.length === 0) return { prodotti: [], totale: 0, sottoMinimo: true, errore: "carrello vuoto" };
  if (codici.length > 40) return { prodotti: [], totale: 0, sottoMinimo: true, errore: "troppi prodotti" };
  const visti = new Set<string>();
  const scelti: Prodotto[] = [];
  for (const c of codici) {
    if (typeof c !== "string") return { prodotti: [], totale: 0, sottoMinimo: true, errore: "prodotto non valido" };
    const p = prodotto(c);
    if (!p) return { prodotti: [], totale: 0, sottoMinimo: true, errore: `prodotto sconosciuto: ${c.slice(0, 40)}` };
    if (!volumeVisibile(p.volume, prova)) return { prodotti: [], totale: 0, sottoMinimo: true, errore: "volume non in vendita" };
    if (visti.has(c)) continue;
    visti.add(c);
    scelti.push(p);
  }
  const conTutti = new Set(scelti.filter((p) => p.tipo !== "disegno").map((p) => p.volume.codice));
  const prodotti = scelti.filter((p) => !(p.tipo === "disegno" && conTutti.has(p.volume.codice)));
  const totale = prodotti.reduce((s, p) => s + p.prezzo, 0);
  return { prodotti, totale, sottoMinimo: totale < PREZZI.minimo_ordine };
}

/** I file che un acquisto dà diritto a scaricare, in ordine e senza doppi. */
export function fileAcquistati(codici: string[]): { prodotto: Prodotto; file: FileProdotto }[] {
  const fuori: { prodotto: Prodotto; file: FileProdotto }[] = [];
  const visti = new Set<string>();
  for (const c of codici) {
    const p = prodotto(c);
    if (!p) continue;
    for (const f of p.file) {
      if (visti.has(f.percorso)) continue;
      visti.add(f.percorso);
      fuori.push({ prodotto: p, file: f });
    }
  }
  return fuori;
}

/** Per quanto tempo funzionano i link di scarico dopo l'acquisto. */
export const GIORNI_SCARICO = 365;
