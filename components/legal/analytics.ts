"use client";

/**
 * Google Analytics 4 — SOLO dopo il consenso.
 *
 * Il Garante e la direttiva ePrivacy richiedono il consenso preventivo per gli
 * strumenti di statistica di terze parti: lo script non viene nemmeno caricato
 * finché il visitatore non accetta dal banner. Configurazione minimizzata:
 * niente Google Signals, niente personalizzazione annunci.
 */

export const GA_ID = "G-SMEEJZQBVJ";

const CHIAVE_CONSENSO = "mizi.consenso-statistiche";

export type Consenso = "si" | "no" | null;

export function consensoStatistiche(): Consenso {
  try {
    const v = window.localStorage.getItem(CHIAVE_CONSENSO);
    return v === "si" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function salvaConsenso(valore: "si" | "no") {
  try {
    window.localStorage.setItem(CHIAVE_CONSENSO, valore);
  } catch {
    // Browser senza storage: la scelta varrà per questa visita.
  }
}

/** Toglie la scelta salvata: al prossimo caricamento il banner ricompare. */
export function azzeraConsenso() {
  try {
    window.localStorage.removeItem(CHIAVE_CONSENSO);
  } catch {
    // niente da azzerare
  }
}

let avviato = false;

/** Carica gtag.js e configura GA4. Chiamare SOLO a consenso dato. */
export function avviaAnalytics() {
  if (avviato || typeof window === "undefined") return;
  avviato = true;

  const w = window as typeof window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  // gtag DEVE spingere l'oggetto `arguments`, non un array: con un array
  // Google Analytics ignora i comandi (comportamento documentato).
  function gtag(...argomenti: unknown[]) {
    void argomenti;
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  }
  w.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}
