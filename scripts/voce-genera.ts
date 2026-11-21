/**
 * La voce registrata di Mizi (una bambina), fatta con OpenAI una volta sola.
 *
 *   npm run voce                      registra le frasi che mancano
 *   npm run voce -- --gioco <slug>    solo le frasi di un gioco (o «comuni»)
 *   npm run voce -- --rifai           rifà anche quelle già registrate
 *   npm run voce -- --prova <cartella>  tre frasi con più voci e intonazioni, per scegliere a orecchio
 *   npm run voce -- --pulisci         toglie i file di frasi che non esistono più
 *
 * Le frasi stanno in content/voce-mizi.json, divise per gioco. Ogni frase
 * diventa public/voce/v{versione}/{id}.mp3, dove l'id si calcola dal testo
 * (lib/giochi/voce-id.ts): il sito suona il file se c'è, altrimenti usa la sintesi
 * del telefono. Alla fine si riscrive lib/giochi/voce-registrata.json con le frasi
 * che esistono davvero.
 *
 * La chiave: OPENAI_API_KEY se c'è; nelle sessioni cloud la mette il proxy
 * dell'ambiente (segreto di rete per api.openai.com). Cambiare voce o
 * istruzioni per TUTTE le frasi = alzare «versione» (cartella nuova, niente
 * file vecchi rimasti nella memoria dei telefoni) e rifare tutto.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { idFrase } from "../lib/giochi/voce-id";

type Voce = string | { testo: string; lingua: string };
interface Copione {
  versione: number;
  modello: string;
  voce: string;
  /** Semitoni in più dopo la registrazione: 2 = più da bambina. 0 = com'è. */
  intonazione: number;
  istruzioni: string;
  frasi: Record<string, Voce[]>;
}

const copione: Copione = JSON.parse(readFileSync("content/voce-mizi.json", "utf8"));
const argomenti = process.argv.slice(2);
const opzione = (nome: string) => {
  const i = argomenti.indexOf(nome);
  return i >= 0 ? argomenti[i + 1] ?? "" : null;
};
const soloGioco = opzione("--gioco");
const cartellaProva = opzione("--prova");
const rifai = argomenti.includes("--rifai");
const pulisci = argomenti.includes("--pulisci");

const CARTELLA = `public/voce/v${copione.versione}`;
const lavoro = mkdtempSync(join(tmpdir(), "voce-mizi-"));

function tutteLeFrasi(gruppo?: string | null) {
  return Object.entries(copione.frasi)
    .filter(([g]) => !gruppo || g === gruppo)
    .flatMap(([g, lista]) =>
      lista.map((f) => {
        const testo = typeof f === "string" ? f : f.testo;
        const lingua = typeof f === "string" ? "it-IT" : f.lingua;
        return { gruppo: g, testo, lingua, id: idFrase(testo, lingua) };
      }),
    );
}

/** Chiede una frase a OpenAI e la salva in mp3, più acuta di `semitoni`. */
function registra(testo: string, lingua: string, voce: string, semitoni: number, uscita: string): string | null {
  const wav = join(lavoro, "frase.wav");
  const corpo = JSON.stringify({
    model: copione.modello,
    voice: voce,
    input: testo,
    instructions: lingua === "it-IT" ? copione.istruzioni : `${copione.istruzioni} Questa frase è in inglese britannico: dilla con pronuncia inglese chiara e lenta.`,
    response_format: "wav",
  });
  const chiamata = spawnSync(
    "curl",
    ["-sS", "-m", "90", "-o", wav, "-w", "%{http_code}", "https://api.openai.com/v1/audio/speech", "-H", `Authorization: Bearer ${process.env.OPENAI_API_KEY ?? "proxy-injected"}`, "-H", "Content-Type: application/json", "-d", corpo],
    { encoding: "utf8" },
  );
  const stato = chiamata.stdout.trim();
  if (chiamata.status !== 0 || stato !== "200") {
    const perche = stato === "401" || stato === "403" || stato === "000" ? "la chiave OpenAI non è disponibile in questo ambiente (segreto di rete per api.openai.com)" : `risposta ${stato}`;
    return `${perche}${chiamata.stderr ? ` — ${chiamata.stderr.trim().slice(0, 160)}` : ""}`;
  }
  // Più acuta senza diventare più veloce: si alza la frequenza e si rimette il tempo.
  // In due passaggi: su alcune frasi il taglio del silenzio e il volume nella
  // stessa catena lasciano ffmpeg fermo per sempre (visto il 21/11/2026 con
  // ffmpeg 6.1). Ogni passaggio ha un limite di tempo, così un blocco diventa un errore.
  const r = Math.pow(2, semitoni / 12);
  const taglio = [
    ...(semitoni ? [`asetrate=24000*${r.toFixed(5)}`, "aresample=24000", `atempo=${(1 / r).toFixed(5)}`] : []),
    "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05",
  ].join(",");
  const pulita = join(lavoro, "pulita.wav");
  const primo = spawnSync("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", "-i", wav, "-af", taglio, pulita], { encoding: "utf8", timeout: 60_000 });
  if (primo.status !== 0) return `ffmpeg (taglio): ${primo.stderr?.trim().slice(0, 200) || "fermo oltre un minuto"}`;
  const mp3 = spawnSync("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", "-i", pulita, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ac", "1", "-ar", "24000", "-b:a", "48k", uscita], { encoding: "utf8", timeout: 60_000 });
  if (mp3.status !== 0) {
    rmSync(uscita, { force: true });
    return `ffmpeg (volume): ${mp3.stderr?.trim().slice(0, 200) || "fermo oltre un minuto"}`;
  }
  return null;
}

/* ── Prova: poche frasi, più voci, per scegliere a orecchio ── */
if (cartellaProva !== null) {
  const dove = cartellaProva || "voce-prova";
  mkdirSync(dove, { recursive: true });
  const frasi = ["Tocca due carte uguali: trova le coppie!", "Il gatto! Coppia trovata.", "Evviva! Ce l'hai fatta! Hai una figurina nuova!"];
  for (const voce of ["coral", "nova", "shimmer", "sage"]) {
    for (const semitoni of [0, 2, 3]) {
      for (const [i, testo] of frasi.entries()) {
        const errore = registra(testo, "it-IT", voce, semitoni, join(dove, `${voce}-piu${semitoni}-${i + 1}.mp3`));
        if (errore) {
          console.error(`Non riesco a registrare: ${errore}`);
          process.exit(2);
        }
      }
      console.log(`${voce} +${semitoni}: 3 frasi`);
    }
  }
  console.log(`Prove in ${dove}/ — scelta la voce, si scrive in content/voce-mizi.json («voce» e «intonazione»).`);
  process.exit(0);
}

/* ── Registrazione vera ── */
mkdirSync(CARTELLA, { recursive: true });
const daFare = tutteLeFrasi(soloGioco).filter((f) => rifai || !existsSync(join(CARTELLA, `${f.id}.mp3`)));
let fatte = 0;
let bloccato: string | null = null;
for (const f of daFare) {
  const errore = registra(f.testo, f.lingua, copione.voce, copione.intonazione, join(CARTELLA, `${f.id}.mp3`));
  if (errore) {
    bloccato = errore;
    break;
  }
  fatte++;
  console.log(`✓ [${f.gruppo}] ${f.testo}`);
}

const previste = new Set(tutteLeFrasi().map((f) => f.id));
const sulDisco = readdirSync(CARTELLA).filter((n) => n.endsWith(".mp3"));
if (pulisci) for (const n of sulDisco) if (!previste.has(n.replace(/\.mp3$/, ""))) rmSync(join(CARTELLA, n));
const registrate = readdirSync(CARTELLA)
  .filter((n) => n.endsWith(".mp3") && previste.has(n.replace(/\.mp3$/, "")) && statSync(join(CARTELLA, n)).size > 500)
  .map((n) => n.replace(/\.mp3$/, ""))
  .sort();
writeFileSync("lib/giochi/voce-registrata.json", `${JSON.stringify({ versione: copione.versione, frasi: registrate }, null, 2)}\n`);
rmSync(lavoro, { recursive: true, force: true });

console.log(JSON.stringify({ registrate_ora: fatte, registrate_in_tutto: registrate.length, previste: previste.size, mancano: previste.size - registrate.length }));
if (bloccato) {
  console.error(`Mi sono fermato: ${bloccato}`);
  process.exit(2);
}
