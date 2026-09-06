"use client";

/**
 * Voce italiana via Web Speech API.
 * Serve ai bambini di 3 anni che non leggono: ogni gioco dà l'istruzione a voce
 * (checklist di design, regole non negoziabili).
 *
 * Mizi è femmina: fra le voci disponibili sul dispositivo si sceglie quella
 * femminile. Le voci di sistema non dichiarano il genere, quindi si va per
 * nome: gli elenchi qui sotto coprono Apple, Google e Microsoft.
 */

export type Lingua = "it-IT" | "en-GB";

// Nomi noti delle voci femminili/maschili per piattaforma (minuscolo).
const FEMMINILI = [
  "alice", "federica", "emma", "paola", "silvia", // Apple it
  "elsa", "isabella", "imelda", "palmira", "fiamma", "fabiola", // Microsoft it
  "google italiano", // Google it (femminile)
  "martha", "libby", "sonia", "maisie", "hollie", // Microsoft en-GB
  "kate", "serena", "stephanie", "shelley", "flo", // Apple en-GB
  "google uk english female",
  "female", "donna",
];

const MASCHILI = [
  "luca", "diego", "cosimo", "giuseppe", "gianni", "calimero", "rinaldo", // it
  "daniel", "arthur", "ryan", "oliver", "thomas", "george", // en-GB
  "google uk english male",
  "male", "uomo",
];

function sintesi(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export function voceDisponibile(): boolean {
  return sintesi() !== null;
}

/**
 * Punteggio di una voce: lingua giusta prima di tutto, poi femminile,
 * mai maschile se c'è di meglio.
 */
function punteggio(v: SpeechSynthesisVoice, lingua: Lingua): number {
  const nome = v.name.toLowerCase();
  let punti = 0;
  if (v.lang === lingua || v.lang.replace("_", "-") === lingua) punti += 8;
  else if (v.lang.startsWith(lingua.slice(0, 2))) punti += 4;
  else return -100; // lingua sbagliata: mai
  if (FEMMINILI.some((f) => f && nome.includes(f))) punti += 4;
  if (MASCHILI.some((m) => nome.includes(m))) punti -= 4;
  if (v.localService) punti += 1; // parte anche offline e senza ritardi
  return punti;
}

function miglioreVoce(lingua: Lingua): SpeechSynthesisVoice | null {
  const synth = sintesi();
  if (!synth) return null;
  const voci = synth.getVoices();
  if (voci.length === 0) return null;
  const ordinate = [...voci]
    .map((v) => ({ v, p: punteggio(v, lingua) }))
    .filter((x) => x.p > -100)
    .sort((a, b) => b.p - a.p);
  return ordinate[0]?.v ?? null;
}

// Su Chrome e Safari getVoices() può essere vuoto al primo giro: quando
// l'elenco arriva, le frasi successive prenderanno la voce giusta.
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {});
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
  // Leggermente più acuta: aiuta anche quando la voce di sistema è neutra.
  frase.pitch = 1.15;

  const voce = miglioreVoce(lingua);
  if (voce) frase.voice = voce;

  synth.speak(frase);
}

export function zittisci() {
  sintesi()?.cancel();
}
