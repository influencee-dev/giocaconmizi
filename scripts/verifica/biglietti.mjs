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

// Segnaposto: usano i nomi delle etichette (qui Martina, Leo, Aurora); un
// foglio A4 con 3 cartoncini a due facce, PNG 2480×3508; con 7 nomi due fogli.
ok("segnaposto: senza nomi rimanda al punto 7", (await page.locator("[data-segnaposto-vuoto]").count()) === 1);
await page.getByLabel("Nomi degli invitati (uno per riga)").fill("Martina\n\nLeo\nAurora");
await page.waitForTimeout(300);
const fogliSp = page.locator("[data-foglio-segnaposto]");
ok("segnaposto: un foglio con i 3 invitati, ognuno sulle due facce",
  (await fogliSp.count()) === 1 && (await fogliSp.first().getAttribute("data-segnaposto")) === "3" &&
  (await fogliSp.first().locator("[data-segnaposto-nome]").count()) === 6);
const attesaSp = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.getByRole("button", { name: "Scarica i segnaposto (A4)" }).tap();
const scaricatoSp = await attesaSp;
const pngSp = scaricatoSp ? readFileSync(await scaricatoSp.path()) : null;
ok("segnaposto: è un PNG A4 2480×3508", pngSp && pngSp.readUInt32BE(16) === 2480 && pngSp.readUInt32BE(20) === 3508);
await page.getByLabel("Nomi degli invitati (uno per riga)").fill("Martina\nLeo\nAurora\nNoah\nSofia\nGiulia\nAhmed");
await page.waitForTimeout(300);
ok("segnaposto: 7 invitati su 2 fogli (6 + 1)",
  (await fogliSp.count()) === 2 && (await page.locator("[data-scarica-segnaposto]").count()) === 2 &&
  (await fogliSp.nth(1).getAttribute("data-segnaposto")) === "1");
await page.getByLabel("Nomi degli invitati (uno per riga)").fill("");
await page.waitForTimeout(200);

// Caccia al tesoro: 6 indizi pronti; uno cambiato a mano compare nel foglio,
// gli altri restano quelli suggeriti; PNG A4 2480×3508.
const caccia = page.locator("[data-foglio-caccia]");
ok("caccia al tesoro: 6 indizi pronti sul foglio",
  (await caccia.getAttribute("data-indizi")) === "6" && (await caccia.locator("[data-testo-indizio]").first().textContent()).includes("cuscini"));
await page.locator("[data-campo-indizio='3']").fill("Cerca nella cesta dei giochi di Mizi");
await page.waitForTimeout(200);
ok("caccia al tesoro: l'indizio cambiato va sul foglio, gli altri restano",
  /cesta.*giochi di Mizi/.test(await caccia.locator("[data-indizio='3'] [data-testo-indizio]").textContent()) &&
  (await caccia.locator("[data-indizio='4'] [data-testo-indizio]").textContent()).includes("sedia"));
const attesaCaccia = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.locator("[data-scarica-caccia]").tap();
const scaricataCaccia = await attesaCaccia;
const pngCaccia = scaricataCaccia ? readFileSync(await scaricataCaccia.path()) : null;
ok("caccia al tesoro: è un PNG A4 2480×3508", pngCaccia && pngCaccia.readUInt32BE(16) === 2480 && pngCaccia.readUInt32BE(20) === 3508);
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

// Foglio A4: quattro copie A6 coi segni di taglio, un PNG 2480×3508 (300 dpi)
const attesaFoglio = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.getByRole("button", { name: "Foglio A4 (4 copie)" }).tap();
const foglio = await attesaFoglio;
const percorsoFoglio = foglio ? await foglio.path() : null;
const testaFoglio = percorsoFoglio ? readFileSync(percorsoFoglio) : null;
ok("foglio A4 da 4 copie: PNG 2480×3508",
  testaFoglio && testaFoglio.readUInt32BE(16) === 2480 && testaFoglio.readUInt32BE(20) === 3508);

// Etichette per i sacchettini: senza nomi il bottone è spento; con tre nomi
// (più una riga vuota da ignorare) il foglio A4 ha tre cartellini, e i nomi
// degli invitati non finiscono nel link del biglietto.
const bottoneEtichette = page.getByRole("button", { name: "Scarica le etichette (A4)" });
ok("etichette: bottone spento senza nomi", await bottoneEtichette.isDisabled());
await page.getByLabel("Nomi degli invitati (uno per riga)").fill("Martina\n\nLeo\nAurora");
await page.waitForTimeout(300);
const quanteEtichette = await page.locator("[data-etichette]").getAttribute("data-etichette");
const attesaEtichette = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await bottoneEtichette.tap();
const etichette = await attesaEtichette;
const pngEtichette = etichette ? readFileSync(await etichette.path()) : null;
ok("etichette: tre cartellini su un PNG A4 2480×3508",
  quanteEtichette === "3" && pngEtichette && pngEtichette.readUInt32BE(16) === 2480 && pngEtichette.readUInt32BE(20) === 3508,
  `cartellini ${quanteEtichette}`);
await page.getByRole("button", { name: /Salva il link|Link copiato/ }).tap();
await page.waitForTimeout(200);
const codiceLink = new URL(page.url()).searchParams.get("b") ?? "";
const nelLink = Buffer.from(decodeURIComponent(codiceLink), "base64").toString("utf8");
ok("etichette: i nomi degli invitati non vanno nel link", codiceLink.length > 0 && !nelLink.includes("Martina") && !nelLink.includes("Aurora"));

// Festone col nome: "BUON ★ COMPLEANNO ★ DOMIZIANA" sono 25 bandierine,
// 6 per foglio = 5 fogli; ogni foglio si scarica come PNG A4. "Solo il nome"
// scende a 9 bandierine su 2 fogli.
const contaBandierine = async () =>
  (await page.locator("[data-foglio-festone]").evaluateAll((f) => f.map((x) => Number(x.getAttribute("data-bandierine")))))
    .reduce((a, b) => a + b, 0);
const bottoniFestone = page.getByRole("button", { name: /^Scarica il foglio \d+ di \d+$/ });
ok("festone: 25 bandierine su 5 fogli", (await contaBandierine()) === 25 && (await bottoniFestone.count()) === 5,
  `${await contaBandierine()} su ${await bottoniFestone.count()}`);
const attesaFestone = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.getByRole("button", { name: "Scarica il foglio 5 di 5" }).tap();
const festone = await attesaFestone;
const pngFestone = festone ? readFileSync(await festone.path()) : null;
ok("festone: un foglio è un PNG A4 2480×3508",
  pngFestone && pngFestone.readUInt32BE(16) === 2480 && pngFestone.readUInt32BE(20) === 3508);
await page.getByLabel("Solo il nome").check();
await page.waitForTimeout(300);
ok("festone: solo il nome, 9 bandierine su 2 fogli", (await contaBandierine()) === 9 && (await bottoniFestone.count()) === 2);
await page.getByLabel("Buon compleanno + nome").check();

// Topper per la torta: disco grande con gli anni e il nome, 8 dischetti, PNG A4.
const topper = page.locator("[data-foglio-topper]");
ok("topper: 7 anni e Domiziana sul disco grande, 8 dischetti",
  (await topper.getAttribute("data-anni")) === "7" && (await topper.locator("[data-topper-nome]").textContent()) === "Domiziana" &&
  (await topper.getAttribute("data-dischetti")) === "8");
const attesaTopper = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.locator("[data-scarica-topper]").tap();
const scaricatoTopper = await attesaTopper;
const pngTopper = scaricatoTopper ? readFileSync(await scaricatoTopper.path()) : null;
ok("topper: è un PNG A4 2480×3508", pngTopper && pngTopper.readUInt32BE(16) === 2480 && pngTopper.readUInt32BE(20) === 3508);
await page.getByLabel("Età", { exact: true }).fill("");
await page.waitForTimeout(200);
ok("topper: senza età c'è la stella al posto del numero",
  (await topper.locator("[data-topper-stella]").count()) === 1 && (await topper.locator("[data-topper-numero]").count()) === 0);
await page.getByLabel("Età", { exact: true }).fill("7");

// Nei formati digitali il foglio A4 non ha senso: il bottone sparisce
await page.getByRole("button", { name: "WhatsApp e storie" }).tap();
await page.waitForTimeout(300);
ok("foglio A4 nascosto nel formato storia",
  (await page.getByRole("button", { name: "Foglio A4 (4 copie)" }).count()) === 0);
await page.getByRole("button", { name: "A6 da stampare" }).tap();
await page.waitForTimeout(300);

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

// Frasi pronte solo dopo il nome (niente «{nome}» a vista, studio UX 14/11)
await page.goto(`${BASE}/biglietti/crea?tema=halloween`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
ok("frasi pronte: senza nome c'è l'invito a scriverlo, niente {nome}",
  (await page.locator("[data-frasi-dopo-il-nome]").count()) === 1 && (await page.locator("button:has-text('{nome}')").count()) === 0);
await page.getByLabel("Nome", { exact: true }).fill("Margherita");
await page.waitForTimeout(200);
// Frasi a tema: col tema halloween la prima frase proposta è a tema
ok("frasi a tema (halloween)", await page.locator("button:has-text('Dolcetto o scherzetto')").count());

// Tema natale: frase dedicata e i tre adesivi nuovi a catalogo
await page.goto(`${BASE}/biglietti/crea?tema=natale`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.getByLabel("Nome", { exact: true }).fill("Margherita");
await page.waitForTimeout(200);
ok("frasi a tema (natale)", await page.getByRole("button", { name: /sotto l'albero/ }).count());
ok("adesivi di natale a catalogo",
  (await page.getByRole("button", { name: "Aggiungi Pupazzo di neve" }).count()) &&
  (await page.getByRole("button", { name: "Aggiungi Alberello" }).count()) &&
  (await page.getByRole("button", { name: "Aggiungi Fiocco di neve" }).count()));
ok("adesivi del tema in testa (natale)",
  (await page.locator("button[aria-label^='Aggiungi ']").first().getAttribute("aria-label")) === "Aggiungi Alberello");

// La frase non deve mai toccare la data (difetto trovato il 14/11): tutte le
// frasi pronte, nome lungo, in tutti e quattro i formati.
await page.goto(`${BASE}/biglietti/crea`, { waitUntil: "networkidle" });
await page.getByLabel("Nome", { exact: true }).fill("Margherita");
await page.getByLabel("Età", { exact: true }).fill("10");
await page.getByLabel("Data", { exact: true }).fill("sabato 20 dicembre");
await page.getByLabel("Ora", { exact: true }).fill("dalle 16 alle 19");
await page.getByLabel("Dove", { exact: true }).fill("Via Roma 1, Milano");
await page.waitForTimeout(200);
const sovrapposte = [];
for (const formato of ["A6 da stampare", "A5 da stampare", "WhatsApp e storie", "Quadrato"]) {
  await page.getByRole("button", { name: formato }).tap();
  const frasi = page.locator("button.text-left.text-sm");
  const quante = await frasi.count();
  for (let i = 0; i < quante; i++) {
    await frasi.nth(i).tap();
    await page.waitForTimeout(60);
    const esito = await page.evaluate(() => {
      const svg = document.querySelector(".lg\\:sticky svg") ?? document.querySelector("svg[aria-label^='Biglietto per']");
      const righe = [...svg.querySelectorAll("[data-riga-frase]")];
      const quando = svg.querySelector("[data-riga-quando]");
      if (!righe.length || !quando) return null;
      const fondo = Math.max(...righe.map((r) => { const b = r.getBBox(); return b.y + b.height; }));
      return { fondo, cima: quando.getBBox().y, frase: righe.map((r) => r.textContent).join(" ") };
    });
    if (esito && esito.fondo > esito.cima) sovrapposte.push(`${formato}: «${esito.frase}»`);
  }
}
ok("la frase non tocca mai la data (tutte le frasi pronte, 4 formati)", sovrapposte.length === 0, sovrapposte.join(" | "));
const attesaEsito = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);
await page.getByRole("button", { name: "Scarica", exact: true }).tap();
await attesaEsito;
ok("dopo «Scarica» compare il messaggio «Fatto!» in basso",
  await page.locator("[data-esito]").filter({ hasText: "Fatto!" }).waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false));

// Da colorare: dal link della pagina SEO il tool si apre già in modalità
// contorni; il PNG scaricato deve essere bianco e nero (quasi nessun pixel
// colorato), con il nome a lettere vuote.
await page.goto(`${BASE}/biglietti/crea?variante=colorare&tema=dinosauri`, { waitUntil: "networkidle" });
await page.getByLabel("Nome", { exact: true }).fill("Domiziana");
await page.waitForTimeout(300);
ok("da colorare: modalità scelta dal link",
  (await page.getByRole("button", { name: "Da colorare" }).getAttribute("aria-pressed")) === "true" &&
  (await page.locator("svg .dc-linea").count()) > 10);
const attesaColorare = page.waitForEvent("download", { timeout: 8000 }).catch(() => null);
await page.getByRole("button", { name: "Scarica", exact: true }).tap();
const daColorare = await attesaColorare;
const pngColorare = daColorare ? readFileSync(await daColorare.path()).toString("base64") : "";
const colori = await page.evaluate(async (b64) => {
  if (!b64) return null;
  const img = new Image();
  img.src = `data:image/png;base64,${b64}`;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  const x = c.getContext("2d");
  x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  let colorati = 0, scuri = 0;
  for (let i = 0; i < d.length; i += 4) {
    const max = Math.max(d[i], d[i + 1], d[i + 2]), min = Math.min(d[i], d[i + 1], d[i + 2]);
    if (max - min > 60) colorati++;
    if (max < 90) scuri++;
  }
  const tot = d.length / 4;
  return { colorati: colorati / tot, scuri: scuri / tot };
}, pngColorare);
ok("da colorare: PNG a contorni, senza colori",
  colori && colori.colorati < 0.01 && colori.scuri > 0.01 && colori.scuri < 0.25,
  colori ? `colorati ${(colori.colorati * 100).toFixed(2)}%, scuri ${(colori.scuri * 100).toFixed(1)}%` : "nessun download");
await page.goto(`${BASE}/biglietti/biglietti-compleanno-da-colorare`, { waitUntil: "networkidle" });
ok("pagina da colorare: anteprime a contorni e link al tool in modalità colorare",
  (await page.locator("main svg .dc-linea").count()) > 10 &&
  (await page.locator("main a[href*='variante=colorare']").count()) > 3);
await page.goto(`${BASE}/biglietti/inviti-compleanno-bambini`, { waitUntil: "networkidle" });
ok("le altre pagine restano a colori", (await page.locator("svg .dc-linea").count()) === 0);

// La letterina a Babbo Natale (/natale/letterina-babbo-natale), da telefono:
// il nome non deve mai uscire dalla pagina; PDF, busta, messaggio «Fatto!»,
// miniatura sempre in vista che si apre a tutto schermo.
const richiesteConNome = [];
page.on("request", (r) => {
  if (`${r.url()} ${r.postData() ?? ""}`.includes("Sofiella")) richiesteConNome.push(r.url());
});
await page.goto(`${BASE}/natale/letterina-babbo-natale`, { waitUntil: "networkidle" });
const anteprimaL = page.locator("[data-anteprima-letterina] [data-foglio-letterina]");
ok("letterina: c'è il foglio in anteprima e Mizi guida dal primo passo",
  (await anteprimaL.count()) === 1 && (await page.locator("[data-mizi-guida]").textContent()).includes("Quanti anni hai") &&
  (await page.locator("form[data-passo='0']").count()) === 1);
await page.locator("#letterina-nome").fill("Sofiella");
await page.locator("#letterina-eta").fill("7");
await page.waitForTimeout(150);
ok("letterina: il nome va sul foglio, col contatore",
  (await anteprimaL.textContent()).includes("Sofiella") && (await page.locator("[data-contatore='letterina-nome']").textContent()) === "8/24");
await page.locator("[data-voce-mizi]").tap(); // nei test niente voce
await page.locator("[data-avanti]").tap();
ok("letterina: passo 2, sette carte da lettera a figura",
  (await page.locator("form[data-passo='1']").count()) === 1 && (await page.locator("[data-carta-letterina] svg").count()) === 7 &&
  (await page.locator("#letterina-nome").count()) === 0);
await page.locator("[data-carta-letterina='natale-renne']").tap();
ok("letterina: la carta scelta resta segnata", (await page.locator("[data-carta-letterina='natale-renne']").getAttribute("aria-checked")) === "true");
await page.locator("[data-avanti]").tap();
await page.locator("[data-avanti]").tap();
await page.locator("[data-idea-desiderio]").first().tap();
await page.waitForTimeout(150);
ok("letterina: passo 4, l'idea toccata diventa il primo desiderio",
  (await page.locator("form[data-passo='3']").count()) === 1 && (await page.locator("#letterina-desiderio-1").inputValue()).length > 0);
await page.locator("[data-avanti]").tap();
await page.locator("[data-navigazione-passi]").scrollIntoViewIfNeeded();
ok("letterina: la miniatura resta in vista mentre si scrive", await page.locator("[data-miniatura-letterina]").isVisible());
await page.locator("[data-miniatura-letterina]").tap();
ok("letterina: toccando la miniatura si apre a tutto schermo",
  (await page.locator("[data-letterina-grande] [data-foglio-letterina]").count()) === 1);
await page.locator("[data-chiudi-grande]").tap();
await page.locator("[data-avanti]").tap();
ok("letterina: ultimo passo «Fatto!» con i bottoni per stampare e la festa",
  (await page.locator("[data-passo-fatto] [data-scarica-letterina-pdf]").count()) === 1 &&
  (await page.locator("[data-esito]").filter({ hasText: "Evviva" }).waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false)));
await page.locator("[data-vedi-tutto]").tap();
ok("letterina: «Vedi tutto in una pagina» mostra tutti i passi insieme",
  (await page.locator("#letterina-nome").count()) === 1 && (await page.locator("#letterina-pensiero").count()) === 1 &&
  (await page.locator("[data-navigazione-passi]").count()) === 0);
const attesaPdfL = page.waitForEvent("download", { timeout: 15000 }).catch(() => null);
await page.locator("[data-anteprima-letterina] ~ div [data-scarica-letterina-pdf]").tap();
const pdfL = await attesaPdfL;
const bytePdfL = pdfL ? readFileSync(await pdfL.path()) : null;
ok("letterina: il PDF è un A4 vero", bytePdfL && bytePdfL.subarray(0, 5).toString() === "%PDF-" &&
  bytePdfL.toString("latin1").includes("/MediaBox [0 0 595.28 841.89]") && bytePdfL.length > 50_000,
  bytePdfL ? `${Math.round(bytePdfL.length / 1024)} KB` : "nessun download");
ok("letterina: dopo il download compare «Fatto!»",
  await page.locator("[data-esito]").filter({ hasText: "Fatto!" }).waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false));
const bustaL = page.locator("[data-foglio-busta]");
ok("busta: da colorare, col mittente e «A: Babbo Natale»",
  (await bustaL.locator(".dc-linea").count()) > 5 &&
  (await bustaL.locator("[data-busta-mittente]").textContent()) === "Da: Sofiella" &&
  (await bustaL.locator("[data-busta-destinatario]").textContent()) === "A: Babbo Natale");
const attesaBustaL = page.waitForEvent("download", { timeout: 15000 }).catch(() => null);
await page.locator("[data-scarica-busta]").tap();
const bustaPdfL = await attesaBustaL;
const byteBustaL = bustaPdfL ? readFileSync(await bustaPdfL.path()) : null;
ok("busta: PDF A4", byteBustaL && byteBustaL.subarray(0, 5).toString() === "%PDF-");
ok("letterina: il nome del bambino non è mai uscito dalla pagina", richiesteConNome.length === 0, richiesteConNome.join(", "));
await page.goto(`${BASE}/natale`, { waitUntil: "networkidle" });
ok("hub del Natale: cinque schede, ognuna col suo disegno", (await page.locator("[data-scheda-natale] svg").count()) === 5);
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
ok("home: in stagione c'è il riquadro del Natale", await page.locator("[data-riquadro-natale]").first().isVisible());

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("biglietti") ? 0 : 1);
