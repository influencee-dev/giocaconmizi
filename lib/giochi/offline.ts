/**
 * I giochi senza connessione (22/11/2026).
 *
 * Niente si scarica da solo: parte tutto dal bottone «Scarica i giochi»
 * (components/app/GiochiSenzaRete.tsx). L'elenco di cosa serve lo scrive la
 * build (scripts/offline-elenco.mjs → /offline-elenco.json); qui lo si mette
 * nella memoria del browser «giocamizi-senza-rete», da dove lo serve il
 * service worker (public/sw.js) quando la rete non c'è.
 *
 * Dopo una pubblicazione nuova i file cambiano nome: chi ha scelto di tenere
 * i giochi sul telefono li riceve aggiornati alla prima visita con la rete
 * (`aggiornaSeServe`), senza dover ritoccare niente.
 *
 * Sul dispositivo restano: i file nella memoria del browser e la voce
 * «giocamizi-senza-rete» in localStorage (quando e quale versione). Nessun
 * dato di chi gioca. Registro in lib/contenuti/legal.ts.
 */

export const MEMORIA = "giocamizi-senza-rete";
const CHIAVE = "giocamizi-senza-rete";

export interface StatoSenzaRete {
  versione: string;
  /** Quando è finito l'ultimo scaricamento (millisecondi). */
  quando: number;
  giochi: number;
}

interface Elenco {
  versione: string;
  giochi: number;
  /** Peso in byte, stimato. */
  peso: number;
  pagine: string[];
  file: string[];
}

/** Vero se questo browser sa tenere i giochi senza rete. */
export function possibile(): boolean {
  return typeof window !== "undefined" && "caches" in window && "serviceWorker" in navigator;
}

export function statoSenzaRete(): StatoSenzaRete | null {
  try {
    const salvato = localStorage.getItem(CHIAVE);
    return salvato ? (JSON.parse(salvato) as StatoSenzaRete) : null;
  } catch {
    return null;
  }
}

export async function leggiElenco(): Promise<Elenco> {
  const risposta = await fetch("/offline-elenco.json", { cache: "no-store" });
  if (!risposta.ok) throw new Error("elenco non disponibile");
  return (await risposta.json()) as Elenco;
}

/** Le immagini citate da una pagina (icone, foto, Mizi): servono per vederla intera senza rete. */
function immaginiDi(html: string): string[] {
  const trovate = html.match(/\/(?:immagini|icone|mizi|mascot|app)\/[A-Za-z0-9_\-./%]+\.(?:webp|png|svg|jpg)/g) ?? [];
  return [...new Set(trovate)];
}

/** Più richieste insieme, ma non troppe: su una rete lenta sei alla volta bastano. */
async function inParallelo<T>(cose: T[], quante: number, fai: (cosa: T) => Promise<void>): Promise<void> {
  const coda = [...cose];
  await Promise.all(
    Array.from({ length: quante }, async () => {
      for (let cosa = coda.shift(); cosa !== undefined; cosa = coda.shift()) await fai(cosa);
    }),
  );
}

/**
 * Scarica tutto quello che serve e lo mette in memoria. `avanti` riceve un
 * numero da 0 a 1. Lancia un errore se troppe cose non arrivano: meglio dire
 * «riprova» che promettere giochi che poi senza rete non partono.
 */
export async function scaricaGiochi(avanti?: (quanto: number) => void): Promise<StatoSenzaRete> {
  if (!possibile()) throw new Error("questo browser non può tenere i giochi senza rete");
  const elenco = await leggiElenco();
  const memoria = await caches.open(MEMORIA);

  let fatti = 0;
  let mancati = 0;
  let totale = elenco.pagine.length + elenco.file.length;
  const passo = () => avanti?.(Math.min(1, ++fatti / totale));
  const altre = new Set<string>();

  // Le pagine si riscaricano sempre (cambiano a ogni pubblicazione), senza cookie: in memoria va la pagina di tutti.
  await inParallelo(elenco.pagine, 4, async (indirizzo) => {
    try {
      const risposta = await fetch(indirizzo, { credentials: "omit", cache: "no-store" });
      if (!risposta.ok) throw new Error(String(risposta.status));
      const html = await risposta.clone().text();
      for (const immagine of immaginiDi(html)) altre.add(immagine);
      await memoria.put(indirizzo, risposta);
    } catch {
      mancati++;
    }
    passo();
  });

  // I file hanno il contenuto nel nome o non cambiano: quelli già in memoria si tengono.
  const file = [...new Set([...elenco.file, ...altre])];
  totale = elenco.pagine.length + file.length;
  await inParallelo(file, 6, async (indirizzo) => {
    try {
      if (!(await memoria.match(indirizzo))) {
        const risposta = await fetch(indirizzo, { credentials: "omit" });
        if (!risposta.ok) throw new Error(String(risposta.status));
        await memoria.put(indirizzo, risposta);
      }
    } catch {
      // Un'immagine citata da una pagina può non esserci più: non conta come mancata.
      if (!altre.has(indirizzo) || elenco.file.includes(indirizzo)) mancati++;
    }
    passo();
  });

  if (mancati > 0) throw new Error(`${mancati} file non sono arrivati`);

  // Il codice delle pubblicazioni vecchie non serve più.
  const buoni = new Set(elenco.file.map((f) => new URL(f, location.origin).pathname));
  for (const richiesta of await memoria.keys()) {
    const percorso = new URL(richiesta.url).pathname;
    if (percorso.startsWith("/_next/static/") && !buoni.has(percorso)) await memoria.delete(richiesta);
  }

  const stato: StatoSenzaRete = { versione: elenco.versione, quando: Date.now(), giochi: elenco.giochi };
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(stato));
  } catch {
    /* senza localStorage i giochi restano comunque in memoria */
  }
  // Chiede al browser di non buttare via la memoria quando lo spazio scarseggia (può dire di no).
  void navigator.storage?.persist?.().catch(() => false);
  return stato;
}

/** Toglie tutto dal telefono: il sito torna a funzionare solo con la rete. */
export async function togliGiochi(): Promise<void> {
  try {
    localStorage.removeItem(CHIAVE);
  } catch {
    /* niente da togliere */
  }
  if (possibile()) await caches.delete(MEMORIA);
}

/**
 * Da chiamare a ogni apertura del sito: se i giochi sono sul telefono e nel
 * frattempo è uscita una versione nuova, li riallinea in silenzio.
 */
export async function aggiornaSeServe(): Promise<void> {
  const stato = statoSenzaRete();
  if (!stato || !possibile() || !navigator.onLine) return;
  try {
    const elenco = await leggiElenco();
    if (elenco.versione !== stato.versione) await scaricaGiochi();
  } catch {
    /* si riprova alla prossima apertura */
  }
}
