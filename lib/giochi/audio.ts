"use client";

import { idFrase } from "@/lib/giochi/voce-id";
import REGISTRATE from "@/lib/giochi/voce-registrata.json";

/**
 * La voce di Mizi.
 *
 * Piano A: la voce REGISTRATA (una bambina, fatta con OpenAI una volta sola da
 * `npm run voce`, file in public/voce/v{versione}/). Le frasi stanno in
 * content/voce-mizi.json; qui si sa solo quali esistono (lib/giochi/voce-registrata.json).
 * Piano B: la sintesi del telefono (Web Speech), per le frasi non ancora
 * registrate e per i dispositivi dove il file non parte.
 *
 * Serve ai bambini di 3 anni che non leggono: ogni gioco dà l'istruzione a voce
 * (checklist di design, regole non negoziabili).
 */

export type Lingua = "it-IT" | "en-GB";

/** Come parlare: `accoda` aspetta che finisca la frase in corso invece di tagliarla. */
export interface ComeParlare {
  accoda?: boolean;
}

const VERSIONE: number = REGISTRATE.versione;
const ESISTONO = new Set<string>(REGISTRATE.frasi);

/** L'indirizzo del file registrato, o null se la frase non è stata registrata. */
export function fileRegistrato(testo: string, lingua: Lingua = "it-IT"): string | null {
  const id = idFrase(testo, lingua);
  return ESISTONO.has(id) ? `/voce/v${VERSIONE}/${id}.mp3` : null;
}

/* ───────────── Sintesi del telefono (piano B) ───────────── */

// Mizi è femmina: fra le voci del dispositivo si sceglie quella femminile. Le
// voci di sistema non dichiarano il genere, quindi si va per nome (minuscolo).
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
  return sintesi() !== null || ESISTONO.size > 0;
}

/** Lingua giusta prima di tutto, poi femminile, mai maschile se c'è di meglio. */
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

/* ───────────── Stato: una voce sola alla volta ───────────── */

interface Frase {
  testo: string;
  lingua: Lingua;
}

let lettore: HTMLAudioElement | null = null;
/** Cresce a ogni frase: gli eventi di una frase vecchia non toccano la nuova. */
let turno = 0;
let staParlando = false;
let inCoda: Frase | null = null;
/** Frase rifiutata dal browser perché nessuno ha ancora toccato lo schermo. */
let inAttesaDelTocco: Frase | null = null;

function finita(mioTurno: number) {
  if (mioTurno !== turno) return;
  staParlando = false;
  const prossima = inCoda;
  inCoda = null;
  if (prossima) pronuncia(prossima);
}

function conLaSintesi(frase: Frase, mioTurno: number) {
  const synth = sintesi();
  if (!synth) return finita(mioTurno);
  const u = new SpeechSynthesisUtterance(frase.testo);
  u.lang = frase.lingua;
  // Un po' più lenta del normale: i bambini piccoli seguono meglio.
  u.rate = frase.lingua === "it-IT" ? 0.9 : 0.85;
  // Leggermente più acuta: aiuta anche quando la voce di sistema è neutra.
  u.pitch = 1.15;
  const voce = miglioreVoce(frase.lingua);
  if (voce) u.voice = voce;
  u.onend = () => finita(mioTurno);
  u.onerror = () => finita(mioTurno);
  synth.speak(u);
}

function alPrimoTocco() {
  const frase = inAttesaDelTocco;
  inAttesaDelTocco = null;
  if (frase && !staParlando) pronuncia(frase);
}

function pronuncia(frase: Frase) {
  const mioTurno = ++turno;
  staParlando = true;
  sintesi()?.cancel();
  lettore?.pause();

  const file = fileRegistrato(frase.testo, frase.lingua);
  if (!file) return conLaSintesi(frase, mioTurno);

  // Un solo lettore riusato: su iPhone resta «sbloccato» dopo il primo tocco.
  lettore ??= new Audio();
  const a = lettore;
  a.onended = () => finita(mioTurno);
  // File mancante o rovinato: la frase si dice lo stesso, con la sintesi.
  a.onerror = () => mioTurno === turno && conLaSintesi(frase, mioTurno);
  a.src = file;
  a.currentTime = 0;
  a.play().catch((e: unknown) => {
    if (mioTurno !== turno) return;
    if (e instanceof DOMException && e.name === "NotAllowedError") {
      // Il browser vuole un tocco prima di far suonare qualcosa: la frase
      // parte al primo tocco, come il fumetto scritto promette.
      staParlando = false;
      inAttesaDelTocco = frase;
      window.addEventListener("pointerdown", alPrimoTocco, { once: true });
      return;
    }
    if (e instanceof DOMException && e.name === "AbortError") return; // tagliata da una frase nuova
    conLaSintesi(frase, mioTurno);
  });
}

/**
 * Dice una frase. Di norma interrompe quella in corso (mai due voci sopra);
 * con `accoda` aspetta che finisca: serve all'istruzione del round dopo, che
 * altrimenti taglierebbe il «Brava, coppia trovata!» a metà.
 */
export function parla(testo: string, lingua: Lingua = "it-IT", come: ComeParlare = {}) {
  if (typeof window === "undefined" || !testo.trim()) return;
  const frase: Frase = { testo, lingua };
  // Le verifiche automatiche ascoltano da qui cosa viene detto (scripts/verifica/giochi.mjs).
  (window as unknown as { __voceMizi?: { testo: string; registrata: boolean }[] }).__voceMizi?.push({ testo, registrata: fileRegistrato(testo, lingua) !== null });
  inAttesaDelTocco = null;
  if (come.accoda && staParlando) {
    inCoda = frase; // una sola in coda: l'ultima vince
    // Certi browser non avvisano quando la sintesi finisce: dopo 4 secondi
    // la frase in coda parte comunque, non resta muta per sempre.
    window.setTimeout(() => {
      if (inCoda !== frase) return;
      inCoda = null;
      pronuncia(frase);
    }, 4000);
    return;
  }
  inCoda = null;
  pronuncia(frase);
}

export function zittisci() {
  turno++;
  staParlando = false;
  inCoda = null;
  inAttesaDelTocco = null;
  sintesi()?.cancel();
  lettore?.pause();
}

/** Scarica in anticipo le frasi registrate di un gioco: al tocco partono subito. */
export function preparaVoci(testi: string[], lingua: Lingua = "it-IT") {
  if (typeof window === "undefined") return;
  for (const t of testi) {
    const file = fileRegistrato(t, lingua);
    if (file) void fetch(file).catch(() => undefined);
  }
}
