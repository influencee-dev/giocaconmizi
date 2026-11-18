/**
 * Com'è andata una partita. `score` e `stars` li danno tutti i giochi; i motori
 * sul nucleo comune (nucleo.ts) aggiungono errori, aiuti e secondi giocati.
 */
export interface EsitoPartita {
  score: number;
  stars: number;
  /** Tocchi sbagliati in tutta la partita. */
  errori?: number;
  /** Quante volte è scattato l'aiuto. */
  aiuti?: number;
  /** Secondi dal primo round alla festa. */
  secondi?: number;
}

/** Contratto comune a tutti i giochi (piano §4.1). */
export interface GameProps {
  age: number;
  difficulty?: 1 | 2 | 3;
  onProgress?: (round: number, totale: number) => void;
  onComplete?: (esito: EsitoPartita) => void;
  /** ?demo=1: il gioco gioca da solo, per registrare i reel (checklist). */
  demo?: boolean;
}

/** Stelle da 1 a 3: mai zero, perché non esiste "hai perso". */
export function stelle(punti: number, totale: number): number {
  if (punti >= totale - 1) return 3;
  if (punti >= Math.ceil(totale / 2)) return 2;
  return 1;
}
