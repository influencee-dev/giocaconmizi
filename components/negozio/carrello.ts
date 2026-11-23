"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Il carrello del negozio: solo i codici dei prodotti, nel browser
 * (localStorage «giocamizi.carrello», voce del registro in lib/contenuti/legal.ts).
 * Niente account e niente server finché non si paga. Prezzi e controlli li
 * rifà sempre il server (app/api/negozio/checkout).
 */

const CHIAVE = "giocamizi.carrello";
const EVENTO = "giocamizi-carrello";

function leggi(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(CHIAVE) ?? "[]");
    return Array.isArray(v) ? v.filter((c): c is string => typeof c === "string").slice(0, 40) : [];
  } catch {
    return [];
  }
}

function scrivi(codici: string[]) {
  try {
    if (codici.length) window.localStorage.setItem(CHIAVE, JSON.stringify(codici));
    else window.localStorage.removeItem(CHIAVE);
  } catch {
    // Navigazione privata o memoria piena: il carrello vale solo per questa pagina.
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function useCarrello() {
  const [codici, setCodici] = useState<string[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const aggiorna = () => setCodici(leggi());
    aggiorna();
    setPronto(true);
    window.addEventListener(EVENTO, aggiorna);
    window.addEventListener("storage", aggiorna);
    return () => {
      window.removeEventListener(EVENTO, aggiorna);
      window.removeEventListener("storage", aggiorna);
    };
  }, []);

  const aggiungi = useCallback((codice: string) => {
    const ora = leggi();
    if (!ora.includes(codice)) scrivi([...ora, codice]);
  }, []);
  const togli = useCallback((codice: string) => scrivi(leggi().filter((c) => c !== codice)), []);
  const svuota = useCallback(() => scrivi([]), []);

  return { codici, pronto, aggiungi, togli, svuota };
}
