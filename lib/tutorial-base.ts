/** Le parti dei tutorial che servono anche nel browser (il lettore): niente elenco qui. */

export interface Capitolo {
  /** Secondi dall'inizio del video. */
  da: number;
  titolo: string;
}

/** «1:05» */
export const minuti = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
