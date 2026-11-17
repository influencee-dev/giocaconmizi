"use client";

/**
 * I piccoli suoni dei giochi, fatti al volo col sintetizzatore del browser
 * (Web Audio): nessun file da scaricare, pesano zero. Regola della checklist:
 * mai un suono «negativo». «riprova» è un tocco morbido di legno, non un buzz.
 */

export type Suono = "gira" | "coppia" | "riprova" | "livello" | "festa" | "figurina" | "aiuto";

let contesto: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Classe = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Classe) return null;
  contesto ??= new Classe();
  if (contesto.state === "suspended") void contesto.resume().catch(() => undefined);
  return contesto;
}

/** Una nota: frequenza in Hz, quando parte (secondi da adesso), quanto dura, volume. */
function nota(c: AudioContext, hz: number, da: number, durata: number, volume = 0.12, forma: OscillatorType = "sine") {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = forma;
  o.frequency.value = hz;
  const t = c.currentTime + da;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + durata);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + durata + 0.02);
}

// Do maggiore: le note stanno bene insieme in qualunque ordine.
const DO = 523.25, MI = 659.25, SOL = 783.99, DO2 = 1046.5, MI2 = 1318.5, SOL2 = 1568;

const SPARTITI: Record<Suono, (c: AudioContext) => void> = {
  gira: (c) => nota(c, 880, 0, 0.07, 0.06, "triangle"),
  coppia: (c) => { nota(c, MI, 0, 0.16); nota(c, SOL, 0.09, 0.16); nota(c, DO2, 0.18, 0.3); },
  riprova: (c) => nota(c, 220, 0, 0.12, 0.07, "triangle"),
  aiuto: (c) => { nota(c, SOL, 0, 0.12, 0.07); nota(c, SOL, 0.16, 0.12, 0.07); },
  livello: (c) => { nota(c, DO, 0, 0.14); nota(c, MI, 0.1, 0.14); nota(c, SOL, 0.2, 0.14); nota(c, DO2, 0.3, 0.35); },
  festa: (c) => [DO, MI, SOL, DO2, SOL, DO2, MI2].forEach((hz, i) => nota(c, hz, i * 0.11, i === 6 ? 0.6 : 0.16)),
  figurina: (c) => [DO2, MI2, SOL2].forEach((hz, i) => nota(c, hz, i * 0.07, 0.22, 0.08, "triangle")),
};

export function suona(quale: Suono) {
  try {
    const c = ctx();
    if (c) SPARTITI[quale](c);
  } catch {
    // Un suono che non parte non deve mai fermare il gioco.
  }
}
