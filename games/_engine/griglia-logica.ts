/**
 * La logica pura del coding su griglia: come si muove Mizi e come si risolve
 * un livello. Niente React qui dentro: la stessa funzione muove Mizi sullo
 * schermo (GrigliaCoding.tsx), risolve i livelli per la demo e fa da prova
 * automatica che ogni livello abbia davvero una soluzione.
 */

export type Comando = "su" | "giu" | "sinistra" | "destra" | "avanti" | "giraDx" | "giraSx";

export interface Livello {
  /** Lato della griglia. */
  lato: number;
  partenza: [number, number];
  arrivo: [number, number];
  /** Celle non attraversabili, come "x,y". */
  muri?: string[];
  /** Direzione iniziale in modalità blocchi: 0 su, 1 destra, 2 giù, 3 sinistra. */
  direzione?: number;
  /** Numero massimo di comandi: è il vincolo che rende il livello un problema. */
  massimo?: number;
  ripeti?: boolean;
}

export type Modalita = "frecce" | "blocchi";

export interface Stato {
  x: number;
  y: number;
  dir: number;
}

const SPOSTAMENTI: [number, number][] = [
  [0, -1], // su
  [1, 0], // destra
  [0, 1], // giù
  [-1, 0], // sinistra
];

const ASSOLUTI: Partial<Record<Comando, number>> = { su: 0, destra: 1, giu: 2, sinistra: 3 };

export const comandiDi = (modalita: Modalita): Comando[] =>
  modalita === "frecce" ? ["su", "giu", "sinistra", "destra"] : ["avanti", "giraSx", "giraDx"];

export const massimoDi = (livello: Livello) => livello.massimo ?? livello.lato * 3;

export const statoIniziale = (livello: Livello): Stato => ({
  x: livello.partenza[0],
  y: livello.partenza[1],
  dir: livello.direzione ?? 1,
});

/** Un comando: muri e bordi fermano Mizi senza drammi, resta dov'è. */
export function passo(livello: Livello, muri: ReadonlySet<string>, s: Stato, comando: Comando): Stato {
  if (comando === "giraDx") return { ...s, dir: (s.dir + 1) % 4 };
  if (comando === "giraSx") return { ...s, dir: (s.dir + 3) % 4 };
  const [dx, dy] = SPOSTAMENTI[comando === "avanti" ? s.dir : ASSOLUTI[comando]!];
  const nx = s.x + dx;
  const ny = s.y + dy;
  if (nx < 0 || ny < 0 || nx >= livello.lato || ny >= livello.lato || muri.has(`${nx},${ny}`)) return s;
  return { ...s, x: nx, y: ny };
}

/** I comandi che Mizi esegue davvero: con «ripeti» la sequenza gira due volte. */
export const passiDi = (livello: Livello, programma: Comando[]) => (livello.ripeti ? [...programma, ...programma] : programma);

/** Dove finisce Mizi con questo programma, e se ha preso il pesce. */
export function simula(livello: Livello, programma: Comando[]): Stato & { arrivato: boolean } {
  const muri = new Set(livello.muri ?? []);
  let s = statoIniziale(livello);
  for (const c of passiDi(livello, programma)) s = passo(livello, muri, s, c);
  return { ...s, arrivato: s.x === livello.arrivo[0] && s.y === livello.arrivo[1] };
}

/**
 * Il programma più corto che porta Mizi al pesce, entro `massimo` comandi.
 * `null` se il livello non ha soluzione (non deve succedere: lo controlla la verifica).
 */
export function risolvi(livello: Livello, modalita: Modalita): Comando[] | null {
  const comandi = comandiDi(modalita);
  const massimo = massimoDi(livello);
  const muri = new Set(livello.muri ?? []);

  if (livello.ripeti) {
    // La seconda passata dipende da tutto il programma: si provano i programmi
    // dal più corto in su. I livelli «ripeti» hanno pochi comandi, quindi basta.
    const limite = Math.min(massimo, 8);
    for (let lunghezza = 1; lunghezza <= limite; lunghezza++) {
      const indici = new Array<number>(lunghezza).fill(0);
      for (;;) {
        const programma = indici.map((i) => comandi[i]);
        if (simula(livello, programma).arrivato) return programma;
        let k = lunghezza - 1;
        while (k >= 0 && indici[k] === comandi.length - 1) indici[k--] = 0;
        if (k < 0) break;
        indici[k]++;
      }
    }
    return null;
  }

  // Senza «ripeti» conta solo dove sta Mizi: visita in ampiezza sugli stati.
  const chiave = (s: Stato) => `${s.x},${s.y},${s.dir}`;
  const inizio = statoIniziale(livello);
  const visti = new Set([chiave(inizio)]);
  let fronte: { s: Stato; programma: Comando[] }[] = [{ s: inizio, programma: [] }];
  for (let profondita = 0; profondita <= massimo && fronte.length; profondita++) {
    const prossimo: typeof fronte = [];
    for (const nodo of fronte) {
      if (nodo.s.x === livello.arrivo[0] && nodo.s.y === livello.arrivo[1]) return nodo.programma;
      if (profondita === massimo) continue;
      for (const c of comandi) {
        const s = passo(livello, muri, nodo.s, c);
        const k = chiave(s);
        if (visti.has(k)) continue;
        visti.add(k);
        prossimo.push({ s, programma: [...nodo.programma, c] });
      }
    }
    fronte = prossimo;
  }
  return null;
}
