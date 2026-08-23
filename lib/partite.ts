"use client";

/**
 * Conteggio locale delle partite finite.
 *
 * Serve a una cosa sola: sapere quando proporre il form ai genitori, cioè
 * dopo il secondo gioco completato (piano §2, decisione 1). Resta nel browser,
 * non viaggia da nessuna parte e non identifica nessuno.
 */

const CHIAVE = "mizi.partite";

export function registraPartita(slug: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const precedenti: string[] = JSON.parse(window.localStorage.getItem(CHIAVE) ?? "[]");
    const aggiornate = [...precedenti, slug].slice(-20);
    window.localStorage.setItem(CHIAVE, JSON.stringify(aggiornate));
    return aggiornate.length;
  } catch {
    // Navigazione privata o storage bloccato: si continua a giocare lo stesso.
    return 0;
  }
}

export function partiteFinite(): number {
  if (typeof window === "undefined") return 0;
  try {
    return (JSON.parse(window.localStorage.getItem(CHIAVE) ?? "[]") as string[]).length;
  } catch {
    return 0;
  }
}
