"use client";

/**
 * Voce italiana via Web Speech API.
 * Serve ai bambini di 3 anni che non leggono: ogni gioco dà l'istruzione a voce
 * (checklist di design, regole non negoziabili).
 */

export type Lingua = "it-IT" | "en-GB";

function sintesi(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export function voceDisponibile(): boolean {
  return sintesi() !== null;
}

/** Legge un testo. Interrompe quello in corso: mai due voci sovrapposte. */
export function parla(testo: string, lingua: Lingua = "it-IT") {
  const synth = sintesi();
  if (!synth) return;

  synth.cancel();

  const frase = new SpeechSynthesisUtterance(testo);
  frase.lang = lingua;
  // Un po' più lenta del normale: i bambini piccoli seguono meglio.
  frase.rate = lingua === "it-IT" ? 0.9 : 0.85;
  frase.pitch = 1.1;

  const vocePreferita = synth
    .getVoices()
    .find((v) => v.lang === lingua || v.lang.startsWith(lingua.slice(0, 2)));
  if (vocePreferita) frase.voice = vocePreferita;

  synth.speak(frase);
}

export function zittisci() {
  sintesi()?.cancel();
}
