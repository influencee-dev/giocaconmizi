/**
 * Genera le foto di un giorno con l'API immagini di OpenAI e le mette sul sito
 * (WebP in public/immagini, tramite foto-arrivate). La lancia la routine serale
 * di Claude nel cloud: funziona anche a computer spento (docs/foto-sera.md).
 *
 *   npm run foto:genera -- --data 2026-11-12 [--quante 2] [--prova]
 *
 * Stesse foto e stessi prompt del documento su Drive (lib/foto-del-giorno.ts),
 * con l'immagine di Mizi (public/mizi/mizi-intera.webp) come riferimento.
 * Variabili d'ambiente (nell'ambiente cloud «Giocamizi», MAI nel repo):
 *   OPENAI_API_KEY          obbligatoria
 *   OPENAI_IMAGE_MODEL      facoltativa, predefinito gpt-image-2
 *   OPENAI_IMAGE_QUALITY    facoltativa: low | medium | high (predefinito high)
 * --prova mostra cosa farebbe senza chiamare l'API (niente costi).
 * Esce con 2 se manca la chiave: la routine allora usa solo il documento su Drive.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { fotoDelGiorno, misuraApi, promptFoto, type FotoDaFare } from "../lib/foto-del-giorno";

const arg = (nome: string) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const data = arg("data") ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
const quante = Math.max(0, Number(arg("quante") ?? 2));
const prova = process.argv.includes("--prova");
const modello = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
const qualita = process.env.OPENAI_IMAGE_QUALITY?.trim() || "high";
const chiave = process.env.OPENAI_API_KEY?.trim();
const CARTELLA = path.join(process.cwd(), ".foto-generate", data);

const { oggi } = fotoDelGiorno(data, quante);
if (!oggi.length) {
  console.log(`foto:genera ${data}: nessuna foto da fare.`);
  process.exit(0);
}
if (prova) {
  for (const f of oggi) console.log(`PROVA      ${f.nomeFile} · ${misuraApi(f.rapporto)} · ${modello}/${qualita}`);
  process.exit(0);
}
if (!chiave) {
  console.error("foto:genera: manca OPENAI_API_KEY nell'ambiente. Nessuna foto generata: resta il documento su Drive.");
  process.exit(2);
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
