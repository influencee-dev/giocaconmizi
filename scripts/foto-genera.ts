/**
 * Genera le foto di un giorno con l'API immagini di OpenAI e le mette sul sito
 * (WebP in public/immagini, tramite foto-arrivate). La lancia la routine serale
 * di Claude nel cloud: funziona anche a computer spento (docs/foto-sera.md).
 *
 *   npm run foto:genera -- --data 2026-11-12 [--quante 2] [--prova]
 *
 * Stesse foto e stessi prompt del documento su Drive (lib/foto/foto-del-giorno.ts),
 * con l'immagine di Mizi (public/mizi/mizi-intera.webp) come riferimento.
 * Variabili d'ambiente (nell'ambiente cloud «Giocamizi», MAI nel repo):
 *   OPENAI_API_KEY          facoltativa nel cloud: lì la chiave vera la aggiunge
 *                           il proxy di rete (segreto di rete per api.openai.com)
 *   OPENAI_IMAGE_MODEL      facoltativa, predefinito gpt-image-2
 *   OPENAI_IMAGE_QUALITY    facoltativa: low | medium | high (predefinito high)
 * --prova mostra cosa farebbe e dice se OpenAI risponde, senza generare (niente costi).
 * Esce con 2 se OpenAI non è raggiungibile o rifiuta la chiave: la routine allora
 * usa solo il documento su Drive.
 *
 * Nel cloud il comando si sistema da solo (dal 22/11/2026): si rilancia una volta
 * con NODE_USE_ENV_PROXY=1, perché senza quella variabile il fetch di Node non
 * passa dal proxy e dà «fetch failed». Prima andava ricordato a mano, e due sere
 * su cinque la riserva non è partita.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { fotoDelGiorno, misuraApi, promptFoto, type FotoDaFare } from "../lib/foto/foto-del-giorno";

// Nel cloud tutte le uscite passano da un proxy: Node lo usa solo se la
// variabile c'è già all'avvio, quindi il comando si rilancia una volta sola.
const PROXY = Boolean(process.env.HTTPS_PROXY || process.env.https_proxy);
const CA_CLOUD = "/root/.ccr/ca-bundle.crt";
if (PROXY && process.env.NODE_USE_ENV_PROXY !== "1") {
  const r = spawnSync(process.execPath, [path.join("node_modules", "tsx", "dist", "cli.mjs"), ...process.argv.slice(1)], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_USE_ENV_PROXY: "1",
      ...(!process.env.NODE_EXTRA_CA_CERTS && fs.existsSync(CA_CLOUD) ? { NODE_EXTRA_CA_CERTS: CA_CLOUD } : {}),
    },
  });
  process.exit(r.status ?? 1);
}

const arg = (nome: string) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const data = arg("data") ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
const quante = Math.max(0, Number(arg("quante") ?? 2));
const prova = process.argv.includes("--prova");
const modello = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
const qualita = process.env.OPENAI_IMAGE_QUALITY?.trim() || "high";
// Dietro il proxy la chiave vera la aggiunge lui: basta un segnaposto.
const chiave = process.env.OPENAI_API_KEY?.trim() || (PROXY ? "proxy-injected" : undefined);

/** Una chiamata che non costa niente: dice subito e chiaro se si può generare. */
async function accesso(): Promise<string | null> {
  if (!chiave) return "manca OPENAI_API_KEY nell'ambiente";
  try {
    const r = await fetch("https://api.openai.com/v1/models", {
      headers: { authorization: `Bearer ${chiave}` },
      signal: AbortSignal.timeout(30_000),
    });
    if (r.status === 401 || r.status === 403) return `OpenAI rifiuta la chiave (errore ${r.status}): non è nell'ambiente e il proxy non la aggiunge`;
    return null;
  } catch {
    return "api.openai.com non è raggiungibile da questo ambiente";
  }
}
const CARTELLA = path.join(process.cwd(), ".foto-generate", data);

const { oggi } = fotoDelGiorno(data, quante);
if (!oggi.length) {
  console.log(`foto:genera ${data}: nessuna foto da fare.`);
  process.exit(0);
}

async function riferimentoMizi(): Promise<Blob> {
  const png = await sharp(path.join(process.cwd(), "public", "mizi", "mizi-intera.webp")).png().toBuffer();
  return new Blob([new Uint8Array(png)], { type: "image/png" });
}

async function genera(f: FotoDaFare, riferimento: Blob): Promise<Buffer> {
  for (let tentativo = 1; tentativo <= 2; tentativo++) {
    const modulo = new FormData();
    modulo.append("model", modello);
    modulo.append("image", riferimento, "mizi-riferimento.png");
    modulo.append("prompt", promptFoto(f));
    modulo.append("size", misuraApi(f.rapporto));
    modulo.append("quality", qualita);
    modulo.append("n", "1");
    const r = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { authorization: `Bearer ${chiave}` },
      body: modulo,
      signal: AbortSignal.timeout(240_000),
    });
    const corpo = (await r.json().catch(() => ({}))) as { data?: { b64_json?: string }[]; error?: { message?: string; code?: string } };
    const b64 = corpo.data?.[0]?.b64_json;
    if (r.ok && b64) return Buffer.from(b64, "base64");
    const motivo = corpo.error?.message ?? `errore ${r.status}`;
    // Riprova solo su errori temporanei (limiti di frequenza, server).
    if (tentativo === 1 && (r.status === 429 || r.status >= 500)) {
      await new Promise((ok) => setTimeout(ok, 20_000));
      continue;
    }
    throw new Error(motivo);
  }
  throw new Error("nessuna risposta utile");
}

async function principale() {
  const motivo = await accesso();
  if (prova) {
    for (const f of oggi) console.log(`PROVA      ${f.nomeFile} · ${misuraApi(f.rapporto)} · ${modello}/${qualita}`);
    console.log(motivo ? `PROVA      OpenAI: NO, ${motivo}.` : "PROVA      OpenAI: risponde, la riserva può generare.");
    return;
  }
  if (motivo) {
    console.error(`foto:genera: ${motivo}. Nessuna foto generata: resta il documento su Drive.`);
    process.exit(2);
  }
  fs.mkdirSync(CARTELLA, { recursive: true });
  const riferimento = await riferimentoMizi();
  const fatte: string[] = [];
  const saltate: string[] = [];
  for (const f of oggi) {
    const file = path.join(CARTELLA, `${f.nomeFile}.png`);
    if (fs.existsSync(file)) {
      fatte.push(`${f.nomeFile} (già generata prima)`);
      continue;
    }
    try {
      fs.writeFileSync(file, await genera(f, riferimento));
      fatte.push(f.nomeFile);
      console.log(`GENERATA   ${f.nomeFile}`);
    } catch (e) {
      saltate.push(`${f.nomeFile}: ${e instanceof Error ? e.message : e}`);
      console.log(`SALTATA    ${f.nomeFile}: ${e instanceof Error ? e.message : e}`);
    }
  }
  if (fatte.length) {
    // Le trasforma in WebP per il sito con le stesse regole delle foto da Drive.
    const r = spawnSync(process.execPath, [path.join("node_modules", "tsx", "dist", "cli.mjs"), "scripts/foto-arrivate.ts", CARTELLA], {
      stdio: "inherit",
    });
    if (r.status !== 0) process.exitCode = 1;
  }
  console.log(`foto:genera ${data} (${modello}/${qualita}): ${fatte.length} generate, ${saltate.length} saltate.`);
  for (const s of saltate) console.log(`  da rifare a mano dal documento su Drive: ${s}`);
}

principale().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
