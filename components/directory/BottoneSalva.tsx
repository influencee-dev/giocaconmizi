"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Il cuoricino «Salva» (come immobiliare.it e matrimonio.com). I preferiti
 * restano SOLO sul dispositivo di chi li salva (localStorage): niente account,
 * niente dati a noi. È una memoria chiesta dalla persona stessa, quindi non
 * serve consenso; se il browser blocca lo spazio, il cuore semplicemente non
 * ricorda.
 */

export const CHIAVE_PREFERITI = "giocamizi-preferiti";
export const EVENTO_PREFERITI = "giocamizi-preferiti";

export function leggiPreferiti(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(CHIAVE_PREFERITI) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function scriviPreferiti(lista: string[]) {
  try {
    window.localStorage.setItem(CHIAVE_PREFERITI, JSON.stringify(lista.slice(0, 200)));
  } catch {
    /* spazio non disponibile: pazienza */
  }
  window.dispatchEvent(new Event(EVENTO_PREFERITI));
}

export function BottoneSalva({ chiave, nome }: { chiave: string; nome: string }) {
  const [salvato, setSalvato] = useState(false);
  useEffect(() => {
    const aggiorna = () => setSalvato(leggiPreferiti().includes(chiave));
    aggiorna();
    window.addEventListener(EVENTO_PREFERITI, aggiorna);
    return () => window.removeEventListener(EVENTO_PREFERITI, aggiorna);
  }, [chiave]);

  return (
    <button
      type="button"
      aria-pressed={salvato}
      aria-label={salvato ? `Togli ${nome} dai salvati` : `Salva ${nome}`}
      onClick={(e) => {
        e.preventDefault();
        const lista = leggiPreferiti();
        scriviPreferiti(lista.includes(chiave) ? lista.filter((x) => x !== chiave) : [...lista, chiave]);
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform active:scale-90"
      style={{ minHeight: 0, minWidth: 0 }}
      data-salva
    >
      <Heart className="h-5 w-5" strokeWidth={2.4} fill={salvato ? "#F28AB2" : "none"} color={salvato ? "#F28AB2" : "#1F2430"} aria-hidden />
    </button>
  );
}
