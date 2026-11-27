/**
 * La logica della corsa a tre strade (20/11/2026), senza interfaccia.
 *
 * Mizi corre lungo un corridoio visto dall'alto e da dietro. Il gioco è fatto
 * di tratti: ogni tratto è una fila di cose che le vengono incontro e finisce
 * con un portale. La usano lo schermo (Corsa.tsx), la demo e le prove, così
 * non possono andare in disaccordo.
 *
 * Regole di casa: nessuna vita, nessun tempo, nessuna fretta. Un urto rallenta
 * Mizi e basta: al portale si arriva sempre. La velocità è la stessa dal primo
 * all'ultimo tratto; la difficoltà sale per combinazioni, non per fretta.
 */

/** -1 sinistra, 0 centro, 1 destra. */
export type Strada = -1 | 0 | 1;
export const STRADE: readonly Strada[] = [-1, 0, 1];

/** Cosa può esserci in una fila. Il fosso prende tutte e tre le strade: si salta. */
export type TipoCosa = "gemma" | "cassa" | "blocco" | "fosso" | "stella";

export interface Cosa {
  tipo: TipoCosa;
  /** Su quale strada sta; il fosso le prende tutte e non la usa. */
  strada: Strada;
  /** Distanza dall'inizio del tratto. */
  z: number;
  /** Altezza da terra: le gemme sopra un fosso stanno in alto. */
  alta: boolean;
  /** Presa, rotta o urtata: non conta più. */
  fatta: boolean;
}

/** Le file che un tratto può contenere. */
export type Schema = "gemme" | "casse" | "blocco" | "due-blocchi" | "fosso";

export interface SpecTratto {
  /** La missione, detta a voce e scritta nel fumetto. */
  istruzione: string;
  /** Detta al portale. */
  fatto: string;
  /** Gli schemi di questo tratto: il primo è la novità e compare da solo all'inizio. */
  schemi: Schema[];
  /** Una stella che protegge, a inizio tratto. */
  stella?: boolean;
}

export interface StatoCorsa {
  cose: Cosa[];
  /** Dove sta il portale: oltre questa distanza il tratto è finito. */
  lunghezza: number;
  /** Quanta strada ha fatto Mizi in questo tratto. */
  percorso: number;
  /** La strada scelta e la posizione vera, che la raggiunge morbida. */
  strada: Strada;
  x: number;
  /** Altezza del salto e velocità verso l'alto. */
  y: number;
  vy: number;
  /** Velocità di marcia piena e quella di adesso (dopo un urto riparte piano). */
  velocita: number;
  velocitaOra: number;
  /** Secondi in cui un altro urto non conta. */
  riparo: number;
  /** Secondi di stella: niente ferma Mizi e le gemme arrivano da sole. */
  scudo: number;
  /** Un salto chiesto poco prima di toccare terra parte all'atterraggio. */
  saltoInMemoria: number;
  /** L'aiuto è scattato: si va più piano e la strada libera si illumina. */
  aiuto: boolean;
  gemme: number;
  urti: number;
  arrivato: boolean;
}

export type Evento =
  | { tipo: "gemma"; cosa: Cosa }
  | { tipo: "cassa"; cosa: Cosa }
  | { tipo: "stella"; cosa: Cosa }
  | { tipo: "urto"; cosa: Cosa }
  | { tipo: "salto" }
  | { tipo: "atterra" }
  | { tipo: "portale" };

const GRAVITA = 38;
const SPINTA_SALTO = 11;
/** Quanto dura un salto, in secondi: serve al pilota per scegliere il momento. */
export const DURATA_SALTO = (2 * SPINTA_SALTO) / GRAVITA;
const MEMORIA_SALTO = 0.2;
const SECONDI_SCUDO = 6;
const SECONDI_RIPARO = 1.5;

/** La velocità di marcia: più calma per i più piccoli, uguale per tutta la partita. */
export function velocitaPerEta(eta: number): number {
  return 10 + Math.max(0, Math.min(4, eta - 6));
}

/** Quante file ha un tratto. Nella demo sono meno, per stare nei tempi dei video. */
export function filePerTratto(demo: boolean): number {
  return demo ? 6 : 11;
}

const strada = (n: number): Strada => (n <= 0 ? -1 : n === 1 ? 0 : 1);

/**
 * Costruisce un tratto. `caso` è la fonte dei numeri a caso (da 0 a 1): le
 * prove ne passano una fissa per rifare sempre la stessa partita.
 *
 * Garanzie: la prima fila è la novità da sola; ogni terza fila è di respiro
 * (solo gemme); in ogni fila resta sempre una strada libera oppure si salta.
 */
export function creaTratto(spec: SpecTratto, eta: number, file: number, caso: () => number = Math.random): StatoCorsa {
  const velocita = velocitaPerEta(eta);
  // Tra una fila e l'altra passa sempre lo stesso tempo, a qualunque età.
  const passo = velocita * 1.35;
  // Prima della prima fila c'è il tempo di ascoltare la missione.
  const partenza = velocita * 4.2;
  const cose: Cosa[] = [];
  const metti = (tipo: TipoCosa, s: Strada, z: number, alta = false) => cose.push({ tipo, strada: s, z, alta, fatta: false });
  const filaDiGemme = (s: Strada, z: number, quante = 3) => {
    for (let i = 0; i < quante; i++) metti("gemma", s, z + i * 2.4);
  };

  for (let i = 0; i < file; i++) {
    const z = partenza + i * passo;
    const respiro = i % 3 === 2;
    const schema: Schema = respiro ? "gemme" : i === 0 ? spec.schemi[0] : spec.schemi[Math.floor(caso() * spec.schemi.length)];
    const libera = strada(Math.floor(caso() * 3));
    if (schema === "gemme") {
      filaDiGemme(libera, z, 4);
    } else if (schema === "casse") {
      const quante = 1 + Math.floor(caso() * 2);
      const prima = Math.floor(caso() * 3);
      for (let k = 0; k < quante; k++) metti("cassa", strada((prima + k) % 3), z);
    } else if (schema === "blocco") {
      const chiuse = STRADE.filter((s) => s !== libera);
      metti("blocco", chiuse[Math.floor(caso() * chiuse.length)], z);
      filaDiGemme(libera, z - 2.4);
    } else if (schema === "due-blocchi") {
      for (const s of STRADE) if (s !== libera) metti("blocco", s, z);
      filaDiGemme(libera, z - 2.4);
    } else {
      metti("fosso", 0, z);
      metti("gemma", libera, z, true);
    }
  }
  if (spec.stella) metti("stella", strada(Math.floor(caso() * 3)), partenza - passo * 0.55);
  cose.sort((a, b) => a.z - b.z);

  return {
    cose,
    lunghezza: partenza + file * passo,
    percorso: 0,
    strada: 0,
    x: 0,
    y: 0,
    vy: 0,
    velocita,
    velocitaOra: velocita,
    riparo: 0,
    scudo: 0,
    saltoInMemoria: 0,
    aiuto: false,
    gemme: 0,
    urti: 0,
    arrivato: false,
  };
}

/** Cambia strada di un passo. */
export function sposta(s: StatoCorsa, verso: -1 | 1): void {
  s.strada = Math.max(-1, Math.min(1, s.strada + verso)) as Strada;
}

/** Chiede un salto: se Mizi è in aria se lo ricorda per un attimo. `true` se è partito subito. */
export function salta(s: StatoCorsa): boolean {
  if (s.y > 0) {
    s.saltoInMemoria = MEMORIA_SALTO;
    return false;
  }
  s.vy = SPINTA_SALTO;
  s.y = 0.001;
  s.saltoInMemoria = 0;
  return true;
}

/** Fa passare `dt` secondi e dice che cosa è successo. */
export function aggiorna(s: StatoCorsa, dt: number): Evento[] {
  const eventi: Evento[] = [];
  if (s.arrivato) return eventi;

  // Dopo un urto si riparte piano; con l'aiuto si va un po' più calmi.
  const meta = s.velocita * (s.aiuto ? 0.72 : 1);
  s.velocitaOra += (meta - s.velocitaOra) * (1 - Math.exp(-dt * 1.4));
  s.percorso += s.velocitaOra * dt;
  s.x += (s.strada - s.x) * (1 - Math.exp(-dt * 16));
  s.riparo = Math.max(0, s.riparo - dt);
  s.scudo = Math.max(0, s.scudo - dt);
  s.saltoInMemoria = Math.max(0, s.saltoInMemoria - dt);

  if (s.y > 0) {
    s.vy -= GRAVITA * dt;
    s.y += s.vy * dt;
    if (s.y <= 0) {
      s.y = 0;
      s.vy = 0;
      eventi.push({ tipo: "atterra" });
      if (s.saltoInMemoria > 0 && salta(s)) eventi.push({ tipo: "salto" });
    }
  }

  for (const c of s.cose) {
    if (c.fatta) continue;
    const davanti = c.z - s.percorso;
    if (davanti > 1.2) break;
    // Le sagome sono generose: larghe per raccogliere, strette per urtare.
    const vicina = Math.abs(davanti) < (c.tipo === "fosso" ? 1 : 0.8);
    if (!vicina) continue;
    const mia = c.tipo === "fosso" || Math.abs(s.x - c.strada) < 0.55;
    if (c.tipo === "gemma") {
      const aPortata = s.scudo > 0 || (mia && (c.alta ? s.y > 0.5 : s.y < 1.3));
      if (aPortata) {
        c.fatta = true;
        s.gemme += 1;
        eventi.push({ tipo: "gemma", cosa: c });
      }
    } else if (c.tipo === "cassa") {
      if (mia && s.y < 0.9) {
        c.fatta = true;
        s.gemme += 3;
        eventi.push({ tipo: "cassa", cosa: c });
      }
    } else if (c.tipo === "stella") {
      if (mia) {
        c.fatta = true;
        s.scudo = SECONDI_SCUDO;
        eventi.push({ tipo: "stella", cosa: c });
      }
    } else if (mia && (c.tipo === "blocco" || s.y < 0.3)) {
      c.fatta = true;
      if (s.scudo > 0 || s.riparo > 0) continue;
      s.urti += 1;
      s.riparo = SECONDI_RIPARO;
      s.velocitaOra = s.velocita * 0.35;
      eventi.push({ tipo: "urto", cosa: c });
    }
  }

  if (s.percorso >= s.lunghezza) {
    s.arrivato = true;
    eventi.push({ tipo: "portale" });
  }
  return eventi;
}

export interface Mossa {
  /** La strada da prendere. */
  strada: Strada;
  /** C'è un fosso da saltare. */
  salta: boolean;
  /** Quanto manca alla cosa che decide la mossa. */
  davanti: number;
}

/**
 * La prossima mossa giusta: la segue la demo, e la mostra l'aiuto quando
 * scatta. Guarda la prima fila con un ostacolo; se non ce n'è, va verso le
 * gemme o le casse più vicine.
 */
export function prossimaMossa(s: StatoCorsa): Mossa {
  // Un ostacolo conta finché non è alle spalle: cambiare strada mentre gli si passa accanto è un urto.
  const avanti = s.cose.filter((c) => !c.fatta && c.z - s.percorso > -1.1 && c.z - s.percorso < s.velocita * 3);
  const ostacolo = avanti.find((c) => c.tipo === "blocco" || c.tipo === "fosso");
  const premio = avanti.find((c) => c.z - s.percorso > 0.4 && (c.tipo === "gemma" || c.tipo === "cassa" || c.tipo === "stella"));
  if (!ostacolo) return { strada: premio ? premio.strada : s.strada, salta: false, davanti: premio ? premio.z - s.percorso : 99 };

  const davanti = ostacolo.z - s.percorso;
  // Un premio che arriva prima dell'ostacolo si prende, se c'è il tempo di tornare.
  if (premio && premio.z < ostacolo.z - s.velocita * 0.9) return { strada: premio.strada, salta: false, davanti: premio.z - s.percorso };
  if (ostacolo.tipo === "fosso") {
    const sopra = avanti.find((c) => c.tipo === "gemma" && c.alta && Math.abs(c.z - ostacolo.z) < 0.5);
    return { strada: sopra ? sopra.strada : s.strada, salta: true, davanti };
  }
  const chiuse = avanti.filter((c) => c.tipo === "blocco" && Math.abs(c.z - ostacolo.z) < 0.5).map((c) => c.strada);
  const libere = STRADE.filter((x) => !chiuse.includes(x));
  // Tra le strade libere, quella più vicina a dove Mizi è già.
  const scelta = [...libere].sort((a, b) => Math.abs(a - s.strada) - Math.abs(b - s.strada))[0] ?? s.strada;
  return { strada: scelta, salta: false, davanti };
}

/** Il pilota della demo: fa la prossima mossa giusta, una strada alla volta. */
export function pilota(s: StatoCorsa): { sposta?: -1 | 1; salta?: boolean } {
  const m = prossimaMossa(s);
  if (m.strada !== s.strada) return { sposta: m.strada > s.strada ? 1 : -1 };
  // Si salta quando il fosso è a metà salto di distanza.
  if (m.salta && s.y === 0 && m.davanti <= s.velocitaOra * DURATA_SALTO * 0.5) return { salta: true };
  return {};
}
