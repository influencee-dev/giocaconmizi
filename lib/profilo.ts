"use client";

import { useEffect, useState } from "react";

/**
 * Il profilo della mamma nell'app: nome, bimbi (nome ed età), email e la
 * scelta sulla posta di Mizi. Resta SOLO sul telefono (localStorage, voce
 * «giocamizi-profilo» nel registro di lib/legal.ts): al server non arriva
 * niente. L'email va a Brevo solo se la mamma accende la posta di Mizi, e
 * allora parte il doppio opt-in come per la fascia newsletter (senza i nomi).
 */

export interface Bimbo {
  nome: string;
  eta: number;
}

export interface Profilo {
  mamma: string;
  bimbi: Bimbo[];
  /** Indice del bimbo per cui si scelgono i giochi. */
  attivo: number;
  email: string;
  posta: boolean;
  creato: string;
}

export const CHIAVE_PROFILO = "giocamizi-profilo";
export const CHIAVE_RIMANDATO = "giocamizi-benvenuto-rimandato";
const EVENTO = "giocamizi-profilo";
/** Riapre il benvenuto (dalla pagina Profilo, «Crea il profilo»). */
export const EVENTO_APRI_BENVENUTO = "giocamizi-apri-benvenuto";

export const ETA = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

function valido(p: unknown): p is Profilo {
  if (!p || typeof p !== "object") return false;
  const x = p as Profilo;
  return typeof x.mamma === "string" && Array.isArray(x.bimbi) && x.bimbi.length > 0 && x.bimbi.every((b) => typeof b?.nome === "string" && typeof b?.eta === "number");
}

export function leggiProfilo(): Profilo | null {
  try {
    const p = JSON.parse(window.localStorage.getItem(CHIAVE_PROFILO) ?? "null");
    if (!valido(p)) return null;
    return { ...p, attivo: Math.min(Math.max(0, p.attivo ?? 0), p.bimbi.length - 1) };
  } catch {
    return null;
  }
}

export function salvaProfilo(p: Profilo | null) {
  try {
    if (p) window.localStorage.setItem(CHIAVE_PROFILO, JSON.stringify(p));
    else window.localStorage.removeItem(CHIAVE_PROFILO);
  } catch {
    /* senza spazio il profilo vale per questa visita */
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Il profilo, aggiornato quando cambia (anche da un'altra scheda). `pronto` = letto dal telefono. */
export function useProfilo(): { profilo: Profilo | null; pronto: boolean } {
  const [stato, setStato] = useState<{ profilo: Profilo | null; pronto: boolean }>({ profilo: null, pronto: false });
  useEffect(() => {
    const aggiorna = () => setStato({ profilo: leggiProfilo(), pronto: true });
    aggiorna();
    window.addEventListener(EVENTO, aggiorna);
    window.addEventListener("storage", aggiorna);
    return () => {
      window.removeEventListener(EVENTO, aggiorna);
      window.removeEventListener("storage", aggiorna);
    };
  }, []);
  return stato;
}

/** Aperto come app installata (schermata Home), non nel browser. */
export function appInstallata(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Il bimbo attivo, o null. */
export function bimboAttivo(p: Profilo | null): Bimbo | null {
  return p ? p.bimbi[p.attivo] ?? p.bimbi[0] ?? null : null;
}

/** Iscrive alla posta di Mizi (doppio opt-in): solo email ed età, mai i nomi. */
export async function iscriviPosta(email: string, eta?: number): Promise<boolean> {
  const r = await fetch("/api/brevo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ azione: "contatto", email, etaFiglio: eta, origine: "app-benvenuto", consenso: true, maggiorenne: true, sito: "" }),
  }).catch(() => null);
  return Boolean(r?.ok);
}
