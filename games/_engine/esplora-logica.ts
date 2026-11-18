/**
 * La logica pura dei giochi di esplorazione (17/11/2026): come si costruisce
 * una sala col suo labirinto, per dove passa Mizi quando si tocca una casella,
 * e quando la missione della sala è compiuta. Niente React qui dentro: le
 * stesse funzioni servono allo schermo (Esplora.tsx), alla demo e alle prove.
 *
 * Una sala è una griglia di caselle tutte percorribili, con dei muretti SUI
 * BORDI tra una casella e l'altra (non caselle piene): così anche una griglia
 * piccola, con caselle grandi da toccare, è un vero labirinto.
 */

export interface Cella {
  x: number;
  y: number;
}

/** Una cosa che si trova nella sala, prima di sapere in che casella sta. */
export interface SpecOggetto {
  /** Nome di un disegno di arte.tsx («pesce», «mela»…). */
  figura?: string;
  /** Oppure una tessera con un numero o una lettera. */
  testo?: string;
  /** Cosa dice Mizi quando la prende (serve solo alle cose da prendere). */
  voce?: string;
  /** Solo per la spesa: quante monete costa. */
  prezzo?: number;
}

/** Come si mostra a che punto è la missione, sopra la mappa. */
export type Cruscotto = "pallini" | "caselle" | "parola" | "lista";

/** La missione di una sala, scritta da chi fa il gioco. */
export interface SpecSala {
  istruzione: string;
  colonne: number;
  righe: number;
  /** Le caselle lontane sono coperte dalle nuvole finché Mizi non ci passa vicino. */
  nebbia: boolean;
  /** Le cose da prendere. Con `inOrdine`, in quest'ordine. */
  giusti: SpecOggetto[];
  /** Le cose da lasciare dove sono. */
  altri?: SpecOggetto[];
  inOrdine?: boolean;
  /** Se c'è, a ogni cosa presa Mizi conta («Uno!», «Due!») invece di dirne il nome. */
  conta?: string[];
  cruscotto: Cruscotto;
  /** Per la spesa: le monete nella borsa all'inizio. */
  borsa?: number;
  /** Detta quando si prende una cosa da lasciare, o fuori ordine. */
  errore: string;
  /** Detta quando la missione è compiuta. */
  fatto: string;
}

export interface Oggetto extends SpecOggetto, Cella {
  id: string;
  giusto: boolean;
  /** Che cos'è, per confrontare due cose uguali (due «O» della stessa parola). */
  chiave: string;
}

export interface Sala {
  spec: SpecSala;
  colonne: number;
  righe: number;
  /** I muretti: «x,y|x,y» tra due caselle vicine, con la casella più piccola prima. */
  muri: Set<string>;
  partenza: Cella;
  porta: Cella;
  oggetti: Oggetto[];
}

export const chiaveCella = (c: Cella) => `${c.x},${c.y}`;
export const stessaCella = (a: Cella, b: Cella) => a.x === b.x && a.y === b.y;

const chiaveMuro = (a: Cella, b: Cella) => {
  const [p, s] = a.y < b.y || (a.y === b.y && a.x < b.x) ? [a, b] : [b, a];
  return `${chiaveCella(p)}|${chiaveCella(s)}`;
};

const PASSI: Cella[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function vicine(sala: Pick<Sala, "colonne" | "righe">, c: Cella): Cella[] {
  return PASSI.map((p) => ({ x: c.x + p.x, y: c.y + p.y })).filter((v) => v.x >= 0 && v.y >= 0 && v.x < sala.colonne && v.y < sala.righe);
}

/** C'è un muretto tra queste due caselle vicine? */
export const muroTra = (sala: Pick<Sala, "muri">, a: Cella, b: Cella) => sala.muri.has(chiaveMuro(a, b));

function mescola<T>(elenco: T[], caso: () => number): T[] {
  const copia = [...elenco];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(caso() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Quanti passi servono da `da` a ogni altra casella. */
function distanze(sala: Pick<Sala, "colonne" | "righe" | "muri">, da: Cella): Map<string, number> {
  const visti = new Map([[chiaveCella(da), 0]]);
  let fronte = [da];
  while (fronte.length) {
    const prossimo: Cella[] = [];
    for (const c of fronte) {
      for (const v of vicine(sala, c)) {
        if (muroTra(sala, c, v) || visti.has(chiaveCella(v))) continue;
        visti.set(chiaveCella(v), visti.get(chiaveCella(c))! + 1);
        prossimo.push(v);
      }
    }
    fronte = prossimo;
  }
  return visti;
}

/**
 * Costruisce la sala: un labirinto dove ogni casella si raggiunge, Mizi in
 * basso a sinistra, la porta nella casella più lontana, le cose sparse.
 * `caso` si può passare fisso nelle prove.
 */
export function costruisciSala(spec: SpecSala, caso: () => number = Math.random): Sala {
  const { colonne, righe } = spec;
  const misura = { colonne, righe };
  const tutte: Cella[] = [];
  for (let y = 0; y < righe; y++) for (let x = 0; x < colonne; x++) tutte.push({ x, y });

  // Si parte con un muretto su ogni bordo interno e si scava un percorso che
  // tocca tutte le caselle: così nessuna resta chiusa fuori.
  const muri = new Set<string>();
  for (const c of tutte) for (const v of vicine(misura, c)) muri.add(chiaveMuro(c, v));
  const partenza: Cella = { x: 0, y: righe - 1 };
  const scavate = new Set([chiaveCella(partenza)]);
  const pila = [partenza];
  while (pila.length) {
    const qui = pila[pila.length - 1];
    const libere = mescola(vicine(misura, qui), caso).filter((v) => !scavate.has(chiaveCella(v)));
    if (!libere.length) {
      pila.pop();
      continue;
    }
    muri.delete(chiaveMuro(qui, libere[0]));
    scavate.add(chiaveCella(libere[0]));
    pila.push(libere[0]);
  }
  // Poi si toglie circa un muretto su tre: più strade, meno vicoli ciechi.
  for (const m of [...muri]) if (caso() < 0.35) muri.delete(m);

  const lontane = distanze({ ...misura, muri }, partenza);
  const massima = Math.max(...lontane.values());
  const candidate = tutte.filter((c) => lontane.get(chiaveCella(c)) === massima);
  const porta = candidate[Math.floor(caso() * candidate.length)];

  const posti = mescola(
    tutte.filter((c) => !stessaCella(c, partenza) && !stessaCella(c, porta)),
    caso,
  );
  const cose = [...spec.giusti.map((o) => ({ ...o, giusto: true })), ...(spec.altri ?? []).map((o) => ({ ...o, giusto: false }))];
  const oggetti: Oggetto[] = cose.slice(0, posti.length).map((o, i) => ({ ...o, ...posti[i], id: `o${i}`, chiave: o.testo ?? o.figura ?? "" }));

  return { spec, colonne, righe, muri, partenza, porta, oggetti };
}

/**
 * La strada più corta da `da` ad `a`, senza `da` e con `a`. Si gira intorno
 * alle caselle in `evita` (le cose non ancora prese: passarci sopra per sbaglio
 * non deve contare); se non si può, ci si passa.
 */
export function percorso(sala: Sala, da: Cella, a: Cella, evita: ReadonlySet<string> = new Set()): Cella[] {
  if (stessaCella(da, a)) return [];
  const cerca = (vietate: ReadonlySet<string>): Cella[] | null => {
    const prima = new Map<string, Cella | null>([[chiaveCella(da), null]]);
    let fronte = [da];
    while (fronte.length) {
      const prossimo: Cella[] = [];
      for (const c of fronte) {
        for (const v of vicine(sala, c)) {
          const k = chiaveCella(v);
          if (muroTra(sala, c, v) || prima.has(k)) continue;
          if (vietate.has(k) && !stessaCella(v, a)) continue;
          prima.set(k, c);
          if (stessaCella(v, a)) {
            const strada: Cella[] = [];
            for (let p: Cella | null = v; p && !stessaCella(p, da); p = prima.get(chiaveCella(p)) ?? null) strada.unshift(p);
            return strada;
          }
          prossimo.push(v);
        }
      }
      fronte = prossimo;
    }
    return null;
  };
  return cerca(evita) ?? cerca(new Set()) ?? [];
}

/** Le caselle già scoperte: quelle dove Mizi è passata e le loro vicine, anche in diagonale. */
export function scoperte(sala: Sala, visitate: readonly string[]): Set<string> {
  const viste = new Set<string>();
  if (!sala.spec.nebbia) {
    for (let y = 0; y < sala.righe; y++) for (let x = 0; x < sala.colonne; x++) viste.add(`${x},${y}`);
    return viste;
  }
  for (const k of visitate) {
    const [x, y] = k.split(",").map(Number);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) viste.add(`${x + dx},${y + dy}`);
  }
  return viste;
}

const giusti = (sala: Sala) => sala.oggetti.filter((o) => o.giusto);

/** Quante cose giuste sono già prese. */
export const quantePrese = (sala: Sala, presi: readonly string[]) => giusti(sala).filter((o) => presi.includes(o.id)).length;

export const missioneCompiuta = (sala: Sala, presi: readonly string[]) => quantePrese(sala, presi) === giusti(sala).length;

/** La prossima cosa giusta da prendere (con `inOrdine`, proprio quella che tocca adesso). */
export function prossimoGiusto(sala: Sala, presi: readonly string[]): Oggetto | undefined {
  const mancano = giusti(sala).filter((o) => !presi.includes(o.id));
  if (!sala.spec.inOrdine) return mancano[0];
  const serve = sala.spec.giusti[quantePrese(sala, presi)];
  if (!serve) return undefined;
  const chiave = serve.testo ?? serve.figura ?? "";
  return mancano.find((o) => o.chiave === chiave);
}

/** Si può prendere adesso questa cosa? */
export function siPuoPrendere(sala: Sala, presi: readonly string[], oggetto: Oggetto): boolean {
  if (!oggetto.giusto || presi.includes(oggetto.id)) return false;
  if (!sala.spec.inOrdine) return true;
  return prossimoGiusto(sala, presi)?.chiave === oggetto.chiave;
}

/** Cosa dice Mizi quando prende la cosa numero `quante` (contando da 1). */
export const voceDiPresa = (sala: Sala, oggetto: Oggetto, quante: number) => sala.spec.conta?.[quante - 1] ?? oggetto.voce ?? "";

/** Per la spesa: le monete rimaste nella borsa. */
export function monete(sala: Sala, presi: readonly string[]): number {
  const spese = sala.oggetti.filter((o) => presi.includes(o.id)).reduce((somma, o) => somma + (o.prezzo ?? 0), 0);
  return (sala.spec.borsa ?? 0) - spese;
}

/** Tutte le frasi che una sala può far dire: devono stare nel copione della voce. */
export function frasiDellaSala(spec: SpecSala): string[] {
  return [spec.istruzione, spec.errore, spec.fatto, ...(spec.conta ?? spec.giusti.map((o) => o.voce ?? ""))].filter(Boolean);
}
