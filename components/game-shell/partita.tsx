"use client";

import { createContext, useContext } from "react";
import type { EsitoAlbum, GiocoBreve } from "@/lib/giochi/album";

/**
 * Quello che il guscio dei giochi deve sapere della partita in corso per fare
 * la festa finale con la figurina e il prossimo gioco. Lo dà la pagina
 * /giochi/[slug]/gioca (Giocatore); senza, il guscio fa la festa semplice.
 */
export interface Partita {
  slug: string;
  titolo: string;
  eta: number;
  /** Tutti i giochi giocabili, per scegliere il prossimo. */
  giochi: GiocoBreve[];
  /** Arriva quando la partita finisce e la figurina è nell'album. */
  esito: EsitoAlbum | null;
  /** Si ricomincia («Ancora»): l'esito della partita prima non vale più. */
  azzera: () => void;
}

export const ContestoPartita = createContext<Partita | null>(null);

export function usePartita(): Partita | null {
  return useContext(ContestoPartita);
}
