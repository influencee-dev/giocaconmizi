// I giochi: una partita completa di inglese + apertura senza errori dei più delicati.
import { apriBrowser, conServer, contatore, BASE } from "./comune.mjs";

const servito = await conServer();
const b = await apriBrowser();
const { ok, chiudi } = contatore();

// Partita completa a "Prime parole in inglese": 10 round, risposte lette
// dall'istruzione — "Where is the cat?" (parole e cerchi colorati) oppure
// "Where are three fish?" (numeri, aria-label "three fish").
const page = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
let erroriJs = 0;
page.on("pageerror", () => erroriJs++);
await page.goto(`${BASE}/giochi/prime-parole-inglese/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
let round = 0;
for (let i = 0; i < 10; i++) {
  const istruzione = await page.locator("text=/Where (is|are)/").first().textContent({ timeout: 5000 }).catch(() => null);
  if (!istruzione) break;
  const parola = istruzione.match(/Where is the (\w+)/)?.[1];
  const numero = istruzione.match(/Where (?:is|are) (\w+ \w+)\?/)?.[1];
  const attese = parola ? [parola, `${parola} circle`] : [numero];
  const giusta = page.locator(attese.map((a) => `button[aria-label='${a}']`).join(", ")).first();
  if (!(await giusta.count())) break;
  await giusta.tap();
  round++;
  await page.waitForTimeout(1400);
}
ok("inglese: partita completa 10/10", round === 10, `${round}/10`);

// Partita completa a "Che ore sono?" (8 round, due finali con l'ora a parole).
// La risposta giusta non si legge dall'istruzione, quindi si prova finché il
// round avanza: gli errori spengono il bottone, max 4 tocchi per round.
const primaOrologio = erroriJs;
await page.goto(`${BASE}/giochi/l-orologio/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
let vinta = false;
for (let tocchi = 0; tocchi < 40 && !vinta; tocchi++) {
  const libero = page.locator("main div.grid > button:enabled").first();
  if (!(await libero.count().catch(() => 0))) break;
  await libero.tap().catch(() => {});
  await page.waitForTimeout(1300);
  vinta = await page.locator("text=Bravissimo!").isVisible().catch(() => false);
}
ok("orologio: partita completa fino alla festa", vinta && erroriJs === primaOrologio);

// Le pagine /gioca dei giochi più complessi si aprono senza errori JS
for (const slug of ["labirinto-a-blocchi", "tartaruga", "crea-il-tuo-gioco", "missione-ghiaccio"]) {
  const prima = erroriJs;
  await page.goto(`${BASE}/giochi/${slug}/gioca`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  ok(`${slug} apre pulito`, erroriJs === prima);
}

// C o CH?: partita completa. Il buco può stare in mezzo alla parola
// (FO___A): la risposta si ricava da istruzione + pezzi visibili, e un
// buco mostrato nel punto sbagliato farebbe fallire il conto.
await page.goto(`${BASE}/giochi/ortografia-c-ch-g-gh/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
let buchi = 0;
for (let r = 0; r < 8; r++) {
  const istruzione = await page
    .locator("text=/Come si scrive\\?/")
    .first()
    .textContent({ timeout: 5000 })
    .catch(() => null);
  if (!istruzione) break;
  const parola = istruzione.split(".")[0].trim().toUpperCase();
  const centro = (await page.locator("main span.tracking-widest").first().textContent()).trim();
  const [prima, dopo] = centro.split("___");
  const buco = parola.slice(prima.length, parola.length - dopo.length);
  await page.locator(`button[aria-label='${buco}']`).first().tap();
  buchi++;
  await page.waitForTimeout(1400);
}
ok("ortografia: partita completa 8/8", buchi === 8, `${buchi}/8`);

// Il robot ballerino: 6 coreografie lette dall'istruzione, toccando sempre
// la PRIMA tessera con quel nome. Con le mosse doppie (due "batti le mani")
// è il caso che scoprì il bug dei gemelli: la mossa giusta rifiutata
// perché toccata sull'altra tessera identica.
await page.goto(`${BASE}/giochi/robot-ballerino/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
let coreografie = 0;
for (let r = 0; r < 6; r++) {
  const istruzione = await page
    .locator("text=/Guarda la coreografia/")
    .first()
    .textContent({ timeout: 5000 })
    .catch(() => null);
  if (!istruzione) break;
  const mosse = istruzione.replace(/^.*rifalla: /, "").replace(/\.$/, "").split(", poi ");
  for (const mossa of mosse) {
    await page.locator(`button[aria-label='${mossa}']`).first().tap();
    await page.waitForTimeout(150);
  }
  coreografie++;
  await page.waitForTimeout(2400);
}
ok("robot: sei coreografie, gemelli compresi", coreografie === 6, `${coreografie}/6`);

// Unisci i puntini: tutte e 5 le figure, toccando i punti in ordine.
// Due punti troppo vicini si rubano il tocco a vicenda (bersaglio r=9):
// se succede, la sequenza si blocca e la partita non arriva alla festa.
await page.goto(`${BASE}/giochi/unisci-i-puntini/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
for (let f = 0; f < 5; f++) {
  const gruppi = page.locator("svg[viewBox='-6 -6 112 112'] g");
  const quanti = await gruppi.count();
  for (let i = 0; i < quanti; i++) {
    await gruppi.nth(i).tap().catch(() => {});
    await page.waitForTimeout(100);
  }
  // 2200ms è l'attesa del motore prima della figura successiva.
  await page.waitForTimeout(2700);
}
ok(
  "puntini: cinque figure completate fino alla festa",
  await page.locator("text=Bravissimo!").isVisible().catch(() => false),
);

// Cosa manca?: partita completa. Il mancante non è scritto da nessuna parte:
// si deduce confrontando il vassoio prima e dopo "Ho guardato!", che è
// esattamente quello che deve fare il bambino.
await page.goto(`${BASE}/giochi/cosa-manca/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
let vassoi = 0;
for (let r = 0; r < 8; r++) {
  const bottone = page.getByRole("button", { name: "Ho guardato!" });
  await bottone.waitFor({ timeout: 5000 }).catch(() => null);
  if (!(await bottone.count())) break;
  const prima = await page
    .locator("[data-vassoio] [data-oggetto]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-oggetto")));
  await bottone.tap();
  await page.waitForTimeout(400);
  const dopo = await page
    .locator("[data-vassoio] [data-oggetto]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-oggetto")));
  const mancante = prima.find((n) => !dopo.includes(n));
  if (!mancante) break;
  await page.locator(`button[aria-label='${mancante}']`).tap();
  vassoi++;
  await page.waitForTimeout(1400);
}
ok("cosa manca: otto vassoi risolti", vassoi === 8, `${vassoi}/8`);
ok(
  "cosa manca: festa finale",
  await page.locator("text=Bravissimo!").isVisible().catch(() => false),
);

// Il salvadanaio: partita completa. Il prezzo sta in data-prezzo (centesimi);
// nel primo round si sbaglia apposta (troppo), si toglie una moneta e si paga:
// è il percorso di autocorrezione che il gioco deve permettere.
await page.goto(`${BASE}/giochi/salvadanaio/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const NOMI_MONETA = { 200: "2 euro", 100: "1 euro", 50: "50 centesimi" };
let pagamenti = 0;
let autocorretto = false;
for (let r = 0; r < 8; r++) {
  const banco = page.locator("[data-prezzo]");
  await banco.waitFor({ timeout: 5000 }).catch(() => null);
  if (!(await banco.count())) break;
  let resto = Number(await banco.getAttribute("data-prezzo"));
  if (r === 0) {
    await page.getByRole("button", { name: "Aggiungi 2 euro" }).tap();
    await page.getByRole("button", { name: "Aggiungi 1 euro" }).tap();
    await page.getByRole("button", { name: "Paga" }).tap();
    await page.waitForTimeout(300);
    const troppo = await page.locator("text=È troppo!").isVisible().catch(() => false);
    await page.getByRole("button", { name: "Togli 1 euro" }).first().tap();
    resto -= 200;
    autocorretto = troppo;
  }
  for (const m of [200, 100, 50]) {
    while (resto >= m) {
      await page.getByRole("button", { name: `Aggiungi ${NOMI_MONETA[m]}` }).tap();
      resto -= m;
    }
  }
  await page.getByRole("button", { name: "Paga" }).tap();
  pagamenti++;
  await page.waitForTimeout(1700);
}
ok("salvadanaio: troppo → togli una moneta → paga", autocorretto);
ok("salvadanaio: otto acquisti fino alla festa",
  pagamenti === 8 && (await page.locator("text=Bravissimo!").isVisible().catch(() => false)), `${pagamenti}/8`);

// La pizza delle frazioni: partita completa. La frazione giusta sta in
// data-frazione. Nel primo round "leggi" si sceglie apposta una sbagliata
// (deve comparire l'aiuto e il round non deve chiudersi); nel primo round
// "fai" si mette una fetta in più, si legge "Sono troppe" e la si toglie.
await page.goto(`${BASE}/giochi/pizza-delle-frazioni/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const NOMI_D = { 2: ["mezzo", "mezzi"], 3: ["terzo", "terzi"], 4: ["quarto", "quarti"], 5: ["quinto", "quinti"], 6: ["sesto", "sesti"], 8: ["ottavo", "ottavi"] };
const aVoce = (n, d) => (n === 1 ? `un ${NOMI_D[d][0]}` : `${n} ${NOMI_D[d][1]}`);
let pizzeFatte = 0;
let aiutoLeggi = false;
let aiutoFai = false;
for (let r = 0; r < 8; r++) {
  const banco = page.locator("[data-frazione]");
  await banco.waitFor({ timeout: 5000 }).catch(() => null);
  if (!(await banco.count())) break;
  const [n, d] = (await banco.getAttribute("data-frazione")).split("/").map(Number);
  const tipo = await banco.getAttribute("data-round");
  if (tipo === "leggi") {
    if (!aiutoLeggi) {
      const bottoni = banco.locator("button");
      for (let i = 0; i < (await bottoni.count()); i++) {
        const nome = await bottoni.nth(i).getAttribute("aria-label");
        if (nome !== aVoce(n, d)) {
          await bottoni.nth(i).tap();
          break;
        }
      }
      await page.waitForTimeout(300);
      const testo = (await banco.locator("[aria-live='polite']").textContent()) ?? "";
      aiutoLeggi = testo.length > 10 && (await banco.getAttribute("data-frazione")) === `${n}/${d}`;
    }
    await page.getByRole("button", { name: aVoce(n, d), exact: true }).tap();
  } else {
    const quante = aiutoFai ? n : n + 1;
    for (let i = 0; i < quante; i++) await page.getByRole("button", { name: `Fetta ${i + 1}`, exact: true }).dispatchEvent("click");
    if (!aiutoFai) {
      await page.getByRole("button", { name: "Fatto" }).tap();
      await page.waitForTimeout(300);
      aiutoFai = await page.locator("text=Sono troppe").isVisible().catch(() => false);
      await page.getByRole("button", { name: `Fetta ${n + 1}`, exact: true }).dispatchEvent("click");
    }
    await page.getByRole("button", { name: "Fatto" }).tap();
  }
  pizzeFatte++;
  await page.waitForTimeout(1800);
}
ok("pizza delle frazioni: risposta sbagliata → aiuto, il round resta", aiutoLeggi);
ok("pizza delle frazioni: una fetta di troppo → «Sono troppe» → togli", aiutoFai);
ok("pizza delle frazioni: otto pizze fino alla festa",
  pizzeFatte === 8 && (await page.locator("text=Bravissimo!").isVisible().catch(() => false)), `${pizzeFatte}/8`);

// Il catalogo dei giochi: il filtro per competenza restringe la griglia
await page.goto(`${BASE}/giochi`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const tutteLeCard = await page.locator("main a[href^='/giochi/']").count();
await page.getByRole("button", { name: "coding", exact: true }).tap();
await page.waitForTimeout(400);
const soloCoding = await page.locator("main a[href^='/giochi/']").count();
ok(
  "catalogo giochi: filtro competenza",
  soloCoding > 0 && soloCoding < tutteLeCard,
  `${soloCoding}/${tutteLeCard}`,
);

// Dati strutturati: la scheda gioco dichiara cosa insegna, gli hub l'elenco
async function jsonLdDi(percorso) {
  await page.goto(`${BASE}${percorso}`, { waitUntil: "domcontentloaded" });
  const blocchi = await page.locator("script[type='application/ld+json']").allTextContents();
  return blocchi.join("\n");
}
const schedaGioco = await jsonLdDi("/giochi/l-orologio");
ok(
  "scheda gioco: JSON-LD LearningResource con teaches",
  schedaGioco.includes("LearningResource") && schedaGioco.includes("teaches"),
);
ok("hub età: JSON-LD ItemList", (await jsonLdDi("/giochi/eta/5-anni")).includes("ItemList"));
ok(
  "hub competenza: JSON-LD ItemList",
  (await jsonLdDi("/giochi/competenza/matematica")).includes("ItemList"),
);
ok("hub storie: JSON-LD ItemList", (await jsonLdDi("/storie")).includes("ItemList"));
const festeMilano = await jsonLdDi("/feste/milano");
ok(
  "pagina feste: LocalBusiness e FAQ",
  festeMilano.includes("LocalBusiness") && festeMilano.includes("FAQPage"),
);
const listingDir = await jsonLdDi("/ludoteche/milano");
ok("directory: listing con ItemList, breadcrumb e FAQ",
  listingDir.includes("ItemList") && listingDir.includes("BreadcrumbList") && listingDir.includes("FAQPage"));
const schedaDir = await jsonLdDi("/ludoteche/milano/il-nano-gigante");
ok("directory: scheda col tipo di attività e indirizzo", schedaDir.includes('"ChildCare"') && schedaDir.includes("PostalAddress"));
const hubCorsivo = await jsonLdDi("/storie/corsivo");
ok(
  "hub corsivo: ItemList e breadcrumb",
  hubCorsivo.includes("ItemList") && hubCorsivo.includes("BreadcrumbList"),
);

// Open Graph: la pagina dichiara l'anteprima e l'immagine viene servita
// davvero (il metadataBase punta al dominio di produzione: si riscrive
// il percorso sul server locale).
async function ogServita(percorso) {
  const html = await (await page.request.get(`${BASE}${percorso}`)).text();
  const m = html.match(/property="og:image"[^>]*content="([^"]+)"/) || html.match(/content="([^"]+)"[^>]*property="og:image"/);
  if (!m) return false;
  const u = new URL(m[1], BASE);
  const img = await page.request.get(`${BASE}${u.pathname}${u.search}`);
  return img.ok() && (img.headers()["content-type"] || "").includes("image");
}
ok("og:image della home", await ogServita("/"));
ok("og:image di una guida", await ogServita("/guide/tabelline-senza-lacrime"));
ok("og:image di una città", await ogServita("/feste/milano"));

// Vesti Mizi: Fatto senza i capi → aiuto e il livello resta; sei uscite
// vestite giuste, il gioco libero con la foto, poi la festa.
{
  const prima = erroriJs;
  await page.goto(`${BASE}/giochi/vesti-mizi/gioca`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.locator("[data-fatto]").tap();
  const aiuto = await page.locator("[data-messaggio=aiuto]").textContent().catch(() => "");
  ok("vesti Mizi: senza vestiti → aiuto, il livello resta", aiuto.includes("cappello di paglia") && (await page.locator("text=Livello 1 di 7").isVisible()));
  const SERVE = [["paglia", "sole"], ["festa", "palloncino"], ["ombrello", "stivali"], ["lana"], ["sub", "pinne"], ["corona", "bacchetta"]];
  const ZONA = { paglia: "testa", sole: "occhi", festa: "testa", palloncino: "ali", ombrello: "ali", stivali: "piedi", lana: "testa", sub: "occhi", pinne: "piedi", corona: "testa", bacchetta: "ali" };
  let vestite = 0;
  for (const capi of SERVE) {
    for (const id of capi) { await page.locator(`[data-zona=${ZONA[id]}]`).tap(); await page.locator(`[data-capo=${id}]`).tap(); }
    const addosso = await page.locator("[data-palco] [data-addosso]").count();
    await page.locator("[data-fatto]").tap();
    if ((await page.locator("[data-messaggio=brava]").count()) && addosso === capi.length) vestite++;
    await page.waitForTimeout(1700);
  }
  ok("vesti Mizi: sei uscite vestite giuste", vestite === 6, `${vestite}/6`);
  await page.locator("[data-zona=trucchi]").tap();
  for (const id of ["guance", "stelline", "brillantini"]) await page.locator(`[data-capo=${id}]`).tap();
  ok("vesti Mizi: i trucchi si sommano", (await page.locator("[data-palco] [data-addosso]").count()) === 3);
  const scarico = page.waitForEvent("download", { timeout: 8000 }).catch(() => null);
  await page.locator("[data-salva-foto]").tap();
  const foto = await scarico;
  ok("vesti Mizi: «Salva la foto» scarica un PNG", foto?.suggestedFilename() === "mizi-vestita-giocamizi.png");
  await page.locator("[data-fatto]").tap();
  await page.waitForTimeout(1900);
  ok("vesti Mizi: fino alla festa, senza errori", (await page.locator("text=Bravissimo!").isVisible().catch(() => false)) && erroriJs === prima);
}

// Colora con Mizi: secchiello, pennello col dito, annulla, salva, sei disegni.
{
  const prima = erroriJs;
  await page.goto(`${BASE}/giochi/colora-con-mizi/gioca`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.locator('[data-colore="rosso"]').tap();
  await page.locator('[data-parte="pancia"]').dispatchEvent("click");
  ok("colora: il secchiello riempie la parte toccata", (await page.locator('[data-parte="pancia"]').getAttribute("fill")) === "#EF5350");
  await page.locator("[data-annulla]").tap();
  ok("colora: «Annulla» toglie il colore", (await page.locator('[data-parte="pancia"]').getAttribute("fill")) === "#FFFFFF");
  const pieni = () => page.locator("[data-tela]").evaluate((c) => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let k = 3; k < d.length; k += 4) if (d[k]) n++; return n; });
  await page.locator("[data-strumento=pennello]").tap();
  const box = await page.locator("[data-tela]").boundingBox();
  await page.mouse.move(box.x + 40, box.y + 60); await page.mouse.down();
  for (let k = 0; k < 12; k++) await page.mouse.move(box.x + 40 + k * 10, box.y + 60 + k * 4);
  await page.mouse.up();
  const dopoTratto = await pieni();
  ok("colora: il pennello disegna col dito", dopoTratto > 500, `${dopoTratto} pixel`);
  await page.locator("[data-annulla]").tap();
  ok("colora: «Annulla» cancella il tratto", (await pieni()) === 0);
  const scarico = page.waitForEvent("download", { timeout: 8000 }).catch(() => null);
  await page.locator("[data-salva]").tap();
  ok("colora: «Salva» scarica il disegno in PNG", (await scarico)?.suggestedFilename() === "mizi-colorato-giocamizi.png");
  for (let k = 0; k < 6; k++) { await page.locator("[data-fatto]").tap(); await page.waitForTimeout(400); }
  await page.waitForTimeout(600);
  ok("colora: sei disegni fino alla festa, senza errori", (await page.locator("text=Bravissimo!").isVisible().catch(() => false)) && erroriJs === prima);
}

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("giochi") ? 0 : 1);
