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

// 1-bis. /admin senza codice: il campo per incollare codice o link intero.
const ingresso = await fetch(`${BASE}/admin`).then(async (r) => [r.status, await r.text()]);
ok("/admin senza codice: pagina con il campo, noindex", ingresso[0] === 200 && ingresso[1].includes("data-codice-admin") && /noindex/.test(ingresso[1]));
{
  const b0 = await apriBrowser();
  const p0 = await b0.newPage({ viewport: { width: 390, height: 844 } });
  await p0.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  await p0.locator("[data-codice-admin]").fill(`https://giocamizi.it/admin/${CODICE_ADMIN_PROVA}/schede`);
  await p0.getByRole("button", { name: "Apri il pannello" }).click();
  await p0.waitForURL(`**/admin/${CODICE_ADMIN_PROVA}`, { timeout: 8000 }).catch(() => null);
  ok("/admin: incollando il link intero si apre il pannello", p0.url().endsWith(`/admin/${CODICE_ADMIN_PROVA}`) && !(await p0.content()).includes("Pannello non disponibile"));
  await b0.close();
}

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

// 3. Contatori delle schede: solo schede ed eventi veri; la scheda li manda.
const evento = (corpo) => fetch(`${BASE}/api/eventi`, { method: "POST", body: JSON.stringify(corpo) }).then((r) => r.status);
ok("eventi: scheda inventata rifiutata", (await evento({ scheda: "milano/non-esiste", evento: "vista" })) === 400);
ok("eventi: evento inventato rifiutato", (await evento({ scheda: "milano/il-nano-gigante", evento: "acquisto" })) === 400);
ok("eventi: scheda vera accettata", (await evento({ scheda: "milano/il-nano-gigante", evento: "vista" })) === 204);
const schedaPubblica = await fetch(`${BASE}/ludoteche/milano/il-nano-gigante`).then((r) => r.text());
ok("scheda pubblica: i contatti sono contati", schedaPubblica.includes('data-traccia="sito"') || schedaPubblica.includes('data-traccia="invito"'));

// 4. Le pagine del pannello: schede filtrabili, dettaglio, iscritti. In
// locale il database non conosce il codice di prova e Brevo non ha la
// chiave: si vedono i riquadri «da attivare», non errori.
await page.goto(`${BASE}/admin/${CODICE_ADMIN_PROVA}/schede`, { waitUntil: "networkidle" });
const tutte = Number(await page.locator("[data-schede]").getAttribute("data-schede"));
await page.goto(`${BASE}/admin/${CODICE_ADMIN_PROVA}/schede?citta=milano`, { waitUntil: "networkidle" });
const milano = Number(await page.locator("[data-schede]").getAttribute("data-schede"));
ok("pannello schede: elenco completo e filtro per città", tutte > 100 && milano > 0 && milano < tutte, `${milano}/${tutte}`);
const linkScheda = await page.locator(`a[href="/admin/${CODICE_ADMIN_PROVA}/schede/milano/il-nano-gigante"]`).count();
await page.goto(`${BASE}/admin/${CODICE_ADMIN_PROVA}/schede/milano/il-nano-gigante`, { waitUntil: "networkidle" });
ok("pannello scheda: dettaglio con traffico e ricerche Google",
  linkScheda > 0 &&
  (await page.getByRole("heading", { name: "Il Nano Gigante" }).count()) === 1 &&
  (await page.getByText("Ricerche Google che portano qui").count()) === 1);
await page.goto(`${BASE}/admin/${CODICE_ADMIN_PROVA}/iscritti`, { waitUntil: "networkidle" });
ok("pannello iscritti: si apre", (await page.getByRole("heading", { name: "Iscritti" }).count()) === 1);
const chiuse = await Promise.all(["schede", "iscritti", "schede/milano/il-nano-gigante"].map((p) =>
  fetch(`${BASE}/admin/codice-sbagliato-000000/${p}`).then((r) => r.text())));
ok("pannello: tutte le sezioni chiuse senza codice", chiuse.every((t) => t.includes("Pannello non disponibile") && !t.includes("Genitori iscritti") && !t.includes("visite ·")));

// 5. La fascia newsletter: in tutto il sito tranne dentro i giochi; senza
// la spunta del consenso non parte niente (mai spuntata in partenza).
await page.goto(`${BASE}/guide`, { waitUntil: "networkidle" });
const fascia = page.locator("#newsletter");
ok("newsletter: fascia presente nelle pagine", (await fascia.count()) === 1);
ok("newsletter: consenso non spuntato in partenza", !(await fascia.getByRole("checkbox").isChecked()));
let chiamate = 0;
page.on("request", (r) => { if (r.url().endsWith("/api/brevo")) chiamate++; });
await fascia.getByLabel("La tua email").fill("prova@esempio.it");
await fascia.getByRole("button", { name: "7", exact: true }).tap();
await fascia.getByRole("button", { name: "Sì, voglio la posta di Mizi" }).tap();
await page.waitForTimeout(400);
ok("newsletter: senza consenso non invia e lo dice", chiamate === 0 && (await fascia.getByRole("alert").isVisible()));
await page.goto(`${BASE}/giochi/salvadanaio/gioca`, { waitUntil: "networkidle" });
ok("newsletter: niente fascia dentro un gioco", (await page.locator("#newsletter").count()) === 0);
const piede = await fetch(`${BASE}/`).then((r) => r.text());
ok("piè di pagina: dati della società e quattro porte", piede.includes("04405500408") && piede.includes("REA") && (piede.match(/data-ai/g) ?? []).length >= 4);

// 6. Listing in stile Booking: filtri per esperienze, conteggi, indirizzo
// condivisibile; etichette del tipo di attività; «Cosa offre» nella scheda.
await page.goto(`${BASE}/sale-feste/milano`, { waitUntil: "networkidle" });
const risultati = async () => Number(await page.locator("[data-risultati]").getAttribute("data-risultati"));
const prima = await risultati();
await page.getByRole("button", { name: /^Per la festa/ }).tap();
await page.locator("[data-tendina]").getByLabel(/Animazione inclusa/).check();
await page.waitForTimeout(300);
const dopo = await risultati();
ok("listing: il filtro esperienze restringe i risultati", prima > dopo && dopo >= 1, `${dopo}/${prima}`);
ok("listing: il filtro finisce nell'indirizzo", page.url().includes("servizi=animazione"));
await page.goto(`${BASE}/sale-feste/milano?servizi=animazione`, { waitUntil: "networkidle" });
ok("listing: un link con i filtri li riapre", (await risultati()) === dopo);
ok("listing: etichette del tipo su ogni card", (await page.locator("[data-risultato] [data-etichetta-tipo]").count()) === dopo);
await page.locator("[data-salva]").first().tap();
await page.waitForTimeout(200);
ok("listing: il cuoricino salva e compare «Salvati»", (await page.getByRole("button", { name: /Salvati \(1\)/ }).count()) === 1);
await page.goto(`${BASE}/ludoteche`, { waitUntil: "networkidle" });
await page.getByRole("search").getByPlaceholder("In quale città?").fill("Milano");
await page.getByRole("search").getByRole("button", { name: "Cerca" }).tap();
await page.waitForURL(/\/ludoteche\/milano/, { timeout: 8000 }).catch(() => null);
ok("ricerca Cosa · Dove: porta al listing della città", page.url().endsWith("/ludoteche/milano"), page.url());
await page.goto(`${BASE}/ludoteche/milano/il-nano-gigante`, { waitUntil: "networkidle" });
ok("scheda: «Cosa offre» e domande da fare", (await page.locator("[data-cosa-offre]").count()) === 1 && (await page.getByText("Da chiedere al locale").count()) === 1);

// 7. Mappa: si carica solo al tocco (niente terze parti prima); ogni città
// ha le coordinate; il pannello delle posizioni si apre.
await page.goto(`${BASE}/feste`, { waitUntil: "networkidle" });
ok("mappa: nessuna mappa prima del tocco", (await page.locator(".leaflet-container").count()) === 0);
await page.locator("[data-apri-mappa]").first().tap();
await page.locator(".leaflet-container").waitFor({ timeout: 10000 }).catch(() => null);
ok("mappa: al tocco compare con le città", (await page.locator(".leaflet-marker-icon").count()) >= 40, `${await page.locator(".leaflet-marker-icon").count()} segnaposto`);
const feste = readFileSync("lib/feste.ts", "utf8");
const coord = readFileSync("lib/coordinate-citta.ts", "utf8");
const cittaSenza = [...feste.matchAll(/slug: ["']([a-z-]+)["']/g)].map((m) => m[1]).filter((c) => !coord.includes(`${c}:`) && !coord.includes(`"${c}":`));
ok("mappa: ogni città ha le coordinate", cittaSenza.length === 0, cittaSenza.join(" "));
await page.goto(`${BASE}/admin/${CODICE_ADMIN_PROVA}/posizioni`, { waitUntil: "networkidle" });
ok("pannello posizioni: si apre", (await page.getByRole("button", { name: "Cerca le prossime 12 posizioni" }).count()) === 1);

await browser.close();
// Candidature: le attività si propongono da /aggiungi-attivita e arrivano nel pannello.
{
  const pagina = await fetch(`${BASE}/aggiungi-attivita`).then(async (r) => [r.status, await r.text()]);
  ok("aggiungi attività: pagina pubblica con canonical", pagina[0] === 200 && pagina[1].includes('rel="canonical" href="https://giocamizi.it/aggiungi-attivita"'));
  ok("aggiungi attività: c'è la categoria «Associazioni e laboratori»", pagina[1].includes("Associazioni e laboratori"));
  ok("aggiungi attività: categorie nuove e voce «Altro»",
    ["Fattorie didattiche e agriturismi", "Ristoranti e pizzerie per feste", "Animatori e feste a domicilio", "Corsi e sport per bambini", "Teatro e cinema per bambini", "Torte, palloncini e allestimenti", 'value="altro"'].every((t) => pagina[1].includes(t)));
  ok("footer: invito ad aggiungere un'attività su ogni pagina", pagina[1].includes("data-piede-attivita"));
  const sbagliato = await fetch(`${BASE}/admin/codice-sbagliato-000000/candidature`).then((r) => r.text());
  ok("candidature: senza codice → pannello non disponibile", sbagliato.includes("Pannello non disponibile"));

  const bc = await apriBrowser();
  const pc = await bc.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await pc.goto(`${BASE}/aggiungi-attivita`, { waitUntil: "networkidle" });
  await pc.locator("[data-campo=nome]").fill("Associazione Prova Bimbi");
  await pc.locator("[data-campo=categoria]").selectOption("associazioni-per-bambini");
  await pc.locator("[data-campo=citta]").fill("Milano");
  await pc.locator("[data-campo=descrizione]").fill("Laboratori creativi per bambini dai 4 ai 10 anni e feste di compleanno a tema con un educatore.");
  await pc.locator("[data-campo=referente]").fill("Maria Prova");
  await pc.locator("[data-campo=email]").fill("maria@esempio.it");
  // senza la spunta il browser ferma l'invio; si spunta e si manda
  await pc.locator("[data-spunta=conferma]").check();
  await pc.locator("[data-invia]").tap();
  await pc.locator("[data-candidatura-ok]").waitFor({ timeout: 8000 }).catch(() => null);
  ok("aggiungi attività: un'associazione nuova si propone", await pc.locator("[data-candidatura-ok]").isVisible());

  await pc.goto(`${BASE}/aggiungi-attivita`, { waitUntil: "networkidle" });
  await pc.getByText("La mia attività c'è già").tap();
  await pc.locator("[data-campo=cerca-scheda]").fill("attività che non esiste");
  ok("aggiungi attività: se non la trova, propone di aggiungerla", await pc.locator("[data-nessuna]").isVisible());
  await pc.locator("[data-campo=cerca-scheda]").fill("nano gigante");
  await pc.locator("[data-trovata='milano/il-nano-gigante']").tap();
  ok("aggiungi attività: la ricerca trova la scheda e la sceglie", (await pc.locator("[data-scheda-scelta]").textContent())?.includes("Il Nano Gigante"));
  await pc.locator("[data-campo=referente]").fill("Luca Titolare");
  await pc.locator("[data-campo=email]").fill("luca@esempio");
  await pc.locator("[data-spunta=conferma]").check();
  // email che il browser accetta ma il server no: l'errore si vede e i campi restano scritti
  await pc.locator("[data-invia]").tap();
  await pc.locator("[data-candidatura-errore]").waitFor({ timeout: 8000 }).catch(() => null);
  ok("aggiungi attività: dopo un errore quello che hai scritto resta lì",
    (await pc.locator("[data-candidatura-errore]").isVisible()) && (await pc.locator("[data-campo=referente]").inputValue()) === "Luca Titolare");
  await pc.locator("[data-campo=email]").fill("luca@esempio.it");
  await pc.locator("[data-invia]").tap();
  await pc.locator("[data-candidatura-ok]").waitFor({ timeout: 8000 }).catch(() => null);
  ok("aggiungi attività: il titolare di una scheda chiede l'accesso", (await pc.locator("[data-candidatura-ok]").textContent())?.includes("link personale"));

  await pc.goto(`${BASE}/admin/${CODICE_ADMIN_PROVA}/candidature`, { waitUntil: "networkidle" });
  ok("candidature: nel pannello arrivano tutte e due",
    (await pc.locator("[data-candidatura=nuova]").count()) >= 1 && (await pc.locator("[data-candidatura=accesso]").count()) >= 1);
  ok("candidature: l'accesso mostra il nome della scheda", (await pc.locator("[data-candidatura=accesso]").first().textContent()).includes("Il Nano Gigante"));
  ok("candidature: l'accesso ha «Manda il link personale» con l'email di chi ha scritto",
    (await pc.locator("[data-candidatura=accesso] [data-manda-link]").first().textContent().catch(() => ""))?.includes("luca@esempio.it"));
  await pc.locator("[data-candidatura=nuova] [data-accetta]").first().tap();
  await pc.waitForLoadState("networkidle");
  await pc.waitForTimeout(500);
  ok("candidature: «Accetta» la sposta nello storico", (await pc.locator("[data-storico]").first().textContent().catch(() => "")).includes("accettata"));

  await pc.goto(`${BASE}/ludoteche/milano/il-nano-gigante`, { waitUntil: "networkidle" });
  ok("scheda: «Gestisci la scheda» porta al modulo con la scheda già scelta", (await pc.locator("[data-cta-attivita]").getAttribute("href")) === "/aggiungi-attivita?scheda=milano%2Fil-nano-gigante");
  await pc.locator("[data-cta-attivita]").tap();
  await pc.locator("[data-scheda-scelta]").waitFor({ timeout: 8000 }).catch(() => null);
  ok("modulo: arrivando dalla scheda, la scheda è già scelta", (await pc.locator("[data-scheda-scelta]").textContent().catch(() => ""))?.includes("Il Nano Gigante"));
  await pc.goto(`${BASE}/ludoteche/milano`, { waitUntil: "networkidle" });
  ok("città: «Aggiungi o gestisci» porta al modulo", (await pc.locator("[data-cta-attivita]").getAttribute("href")) === "/aggiungi-attivita");
  await bc.close();
}

if (servito) process.kill(-servito.pid);
process.exit(chiudi("admin") ? 0 : 1);
