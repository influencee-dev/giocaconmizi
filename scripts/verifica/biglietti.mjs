// Il percorso completo del creatore di biglietti, da telefono (390x844).
import { writeFileSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { apriBrowser, conServer, contatore, BASE, FOTO_PROVA } from "./comune.mjs";

const servito = await conServer();
const b = await apriBrowser();
const { ok, chiudi } = contatore();
const page = await b.newPage({
  viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true,
});
page.on("pageerror", (e) => ok("nessun errore JS", false, e.message));

await page.goto(`${BASE}/biglietti/crea`, { waitUntil: "networkidle" });
await page.getByLabel("Nome", { exact: true }).fill("Domiziana");
await page.getByLabel("Età", { exact: true }).fill("7");
await page.getByLabel("Conferma a (numero WhatsApp)").fill("333 1234567");
await page.waitForTimeout(300);
ok("avviso RSVP col numero valido", await page.locator("text=Confermo, ci saremo!").count());

// Adesivo: aggiungi e trascina (prima si torna su: l'anteprima sta in cima)
await page.getByRole("button", { name: "Aggiungi Unicorno" }).tap();
await page.waitForTimeout(200);
const sticker = page.locator("svg [data-sticker='0']").first();
ok("adesivo sul biglietto", await sticker.count());
await sticker.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
const scatola = await sticker.boundingBox();
const prima = await sticker.getAttribute("transform");
await page.mouse.move(scatola.x + scatola.width / 2, scatola.y + scatola.height / 2);
await page.mouse.down();
await page.mouse.move(scatola.x + 70, scatola.y + 100, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(200);
ok("trascinamento col dito", (await sticker.getAttribute("transform")) !== prima);

// QR di conferma
await page.locator("text=Metti il QR").tap();
await page.waitForTimeout(300);
ok("QR 'Inquadra e conferma'", await page.locator("svg [data-qr]").count());

// Foto: resta nel dispositivo, entra nel PNG
const foto = `${tmpdir()}/foto-prova.png`;
writeFileSync(foto, FOTO_PROVA);
await page.locator("input[type='file']").setInputFiles(foto);
await page.waitForTimeout(700);
ok("foto nel tondo del biglietto", await page.locator("svg image").count());

// Scarica: PNG vero
const attesa = page.waitForEvent("download", { timeout: 8000 }).catch(() => null);
await page.getByRole("button", { name: "Scarica", exact: true }).tap();
const giu = await attesa;
const percorso = giu ? await giu.path() : null;
ok("download PNG valido", percorso && statSync(percorso).size > 5000 &&
  readFileSync(percorso).subarray(0, 4).toString("hex") === "89504e47");

// Link salvato: senza foto, con tutto il resto; l'invito digitale funziona
await page.getByRole("button", { name: "Salva il link" }).tap();
await page.waitForTimeout(300);
const codice = new URL(page.url()).searchParams.get("b") ?? "";
const dati = JSON.parse(Buffer.from(decodeURIComponent(codice), "base64").toString("utf8"));
ok("link senza foto, con QR e adesivo", !dati.foto && dati.conQr === true && dati.stickers?.length === 1);
await page.goto(`${BASE}/biglietti/vedi?b=${codice}`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
ok("invito digitale con bottone conferma",
  (await page.getByRole("button", { name: /Confermo, ci saremo/ }).count()) === 1);

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("biglietti") ? 0 : 1);
