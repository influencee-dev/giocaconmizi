/** Contratto comune a tutti i giochi (piano §4.1). */
export interface GameProps {
  age: number;
  difficulty?: 1 | 2 | 3;
  onProgress?: (round: number, totale: number) => void;
  onComplete?: (esito: { score: number; stars: number }) => void;
  /** ?demo=1: il gioco gioca da solo, per registrare i reel (checklist). */
  demo?: boolean;
}

/** Stelle da 1 a 3: mai zero, perché non esiste "hai perso". */
export function stelle(punti: number, totale: number): number {
  if (punti >= totale - 1) return 3;
  if (punti >= Math.ceil(totale / 2)) return 2;
  return 1;
}
