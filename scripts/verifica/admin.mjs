// Il pannello di Giorgia: l'ingresso è chiuso senza codice, e il «plugin»
// immagini trasforma una foto in WebP molto più leggeri, con i nomi giusti.
// Il codice di prova vale solo nel server delle verifiche (lib/admin.ts).
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { apriBrowser, conServer, contatore, BASE, CODICE_ADMIN_PROVA } from "./comune.mjs";

const sharp = createRequire(import.meta.url)("sharp");
const servito = await conServer();
const { ok, chiudi } = contatore();

// 1. Senza codice valido: niente pannello, niente API.
const sbagliata = await fetch(`${BASE}/admin/codice-sbagliato-000000/immagini`).then((r) => r.text());
ok("immagini: codice sbagliato → pannello non disponibile", sbagliata.includes("Pannello non disponibile"));
const senza = await fetch(`${BASE}/api/admin/immagini`, { method: "POST", body: new FormData() });
ok("API immagini: 401 senza codice", senza.status === 401);

// 2. Una foto vera del sito, rifatta PNG pesante (come quelle di ChatGPT).
const png = await sharp("public/immagini/bambino-gioca-numeri-in-cucina-1440.webp").png().toBuffer();

const browser = await apriBrowser();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
await page.goto(`${BASE}/admin/${CODICE_ADMIN_PROVA}/immagini`, { waitUntil: "networkidle" });
ok("immagini: il pannello si apre col codice", await page.getByRole("heading", { name: "Ottimizza immagini" }).isVisible());
await page.getByLabel("Immagini da ottimizzare").setInputFiles([
  { name: "Foto Cucina.png", mimeType: "image/png", buffer: png },
  { name: "seconda.png", mimeType: "image/png", buffer: png },
]);
// La seconda va assegnata a una foto del sito: ritaglio e nomi dal registro.
await page.getByLabel("Foto del sito (facoltativo)").nth(1).selectOption("H-02");
await page.getByRole("button", { name: "Ottimizza le immagini" }).tap();
await page.locator("[data-voce='fatta']").nth(1).waitFor({ timeout: 60000 }).catch(() => null);
const fatte = await page.locator("[data-voce='fatta']").count();
const risparmio = Number(await page.locator("[data-risparmio]").getAttribute("data-risparmio").catch(() => "0"));
ok("immagini: due foto ottimizzate", fatte === 2, `${fatte}/2`);
ok("immagini: peso giù di oltre il 70%", risparmio > 70, `−${risparmio}%`);
ok("immagini: nomi puliti e varianti del sito",
  (await page.getByRole("button", { name: /^1440 px/ }).count()) === 2 && (await page.getByRole("button", { name: /^480 px/ }).count()) === 2);

const attesa = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.getByRole("button", { name: "Scarica tutto (ZIP)" }).tap();
const zip = await attesa;
const dati = zip ? readFileSync(await zip.path()) : Buffer.alloc(0);
const testo = dati.toString("latin1");
ok("immagini: ZIP con i WebP e i nomi giusti",
  dati.subarray(0, 2).toString() === "PK" && testo.includes("foto-cucina.webp") && testo.includes("bambino-gioca-numeri-in-cucina-480.webp") && testo.includes("RIFF"));

await browser.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("admin") ? 0 : 1);
