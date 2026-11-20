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
// L'invito alle novità compare sopra la festa dopo il secondo gioco: qui si
// finiscono molti giochi di fila, quindi lo si dà per già visto (ha la sua prova in fondo).
await page.addInitScript(() => { try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
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
  vinta = await page.locator("[data-festa]").isVisible().catch(() => false);
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

// Con l'H o senza?: la risposta si ricava dalla frase letta (istruzione) e
// dal buco mostrato. Al primo round si sbaglia apposta: deve comparire il trucco.
const COPPIA = { ho: "o", o: "ho", ha: "a", a: "ha", hanno: "anno", anno: "hanno", hai: "ai", ai: "hai", "è": "e", e: "è" };
await page.goto(`${BASE}/giochi/con-l-h-o-senza/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
let frasiH = 0;
let truccoVisto = false;
for (let r = 0; r < 10; r++) {
  const istruzione = await page.locator("text=/Come si scrive\\?/").first().textContent({ timeout: 5000 }).catch(() => null);
  if (!istruzione) break;
  const frase = istruzione.replace(/\s*Come si scrive\?\s*$/, "").trim();
  const centro = (await page.locator("main [data-frase]").first().textContent()).trim();
  const [prima, dopo] = centro.split("___");
  const giusta = frase.slice(prima.length, frase.length - dopo.length);
  if (r === 0) {
    await page.locator(`button[aria-label='${COPPIA[giusta]}']`).first().tap();
    await page.waitForTimeout(300);
    truccoVisto = /Trucco/.test((await page.locator("[data-aiuto]").textContent().catch(() => "")) ?? "");
  }
  await page.locator(`button[aria-label='${giusta}']`).first().tap();
  frasiH++;
  await page.waitForTimeout(1400);
}
ok("con l'H o senza: dopo un errore Mizi mostra il trucco", truccoVisto);
ok("con l'H o senza: partita completa 10/10", frasiH === 10, `${frasiH}/10`);

// Le doppie: si tocca la prima parola; se Mizi mostra la spiegazione era
// sbagliata e si tocca l'altra. Le due parole differiscono solo per una
// consonante raddoppiata, e il fumetto non contiene la risposta prima della scelta.
await page.goto(`${BASE}/giochi/le-doppie/gioca`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
let roundDoppie = 0;
let spiegazioneVista = false;
let coppieBuone = true;
for (let r = 0; r < 10; r++) {
  const bottoni = page.locator("main button[aria-label]").filter({ hasText: /^[a-zàèéìòù]+$/ });
  if ((await page.locator("main [data-frase]").count()) === 0) break;
  const parole = (await bottoni.allTextContents()).map((t) => t.trim()).filter(Boolean).slice(0, 2);
  const [a, b] = [...parole].sort((x, y) => x.length - y.length);
  if (!(a && b && b.length === a.length + 1 && [...b].some((_, i) => b.slice(0, i) + b.slice(i + 1) === a && b[i] === b[i - 1]))) coppieBuone = false;
  await page.locator(`main button[aria-label='${parole[0]}']`).first().tap();
  await page.waitForTimeout(300);
  if (await page.locator("[data-aiuto]").isVisible().catch(() => false)) {
    spiegazioneVista = true;
    await page.locator(`main button[aria-label='${parole[1]}']`).first().tap();
  }
  roundDoppie++;
  await page.waitForTimeout(1400);
}
ok("le doppie: ogni round è una coppia semplice/doppia", coppieBuone);
ok("le doppie: partita completa 10/10, con la spiegazione dopo un errore", roundDoppie === 10 && spiegazioneVista, `${roundDoppie}/10, spiegazione ${spiegazioneVista}`);

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
  await page.locator("[data-festa]").isVisible().catch(() => false),
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
  await page.locator("[data-festa]").isVisible().catch(() => false),
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
  pagamenti === 8 && (await page.locator("[data-festa]").isVisible().catch(() => false)), `${pagamenti}/8`);

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
  pizzeFatte === 8 && (await page.locator("[data-festa]").isVisible().catch(() => false)), `${pizzeFatte}/8`);

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
  ok("vesti Mizi: fino alla festa, senza errori", (await page.locator("[data-festa]").isVisible().catch(() => false)) && erroriJs === prima);
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
  ok("colora: sei disegni fino alla festa, senza errori", (await page.locator("[data-festa]").isVisible().catch(() => false)) && erroriJs === prima);
}

// ── Memory degli animali (upgrade del 15/11/2026) + album di Mizi ──
// Tre livelli che crescono, la sbirciata a 3 anni, ogni frase detta è nel
// copione della voce registrata, la festa dà la figurina e il prossimo gioco.
{
  const { readFileSync, existsSync } = await import("node:fs");
  const copione = JSON.parse(readFileSync("content/voce-mizi.json", "utf8"));
  const nelCopione = new Set(Object.values(copione.frasi).flat().map((f) => (typeof f === "string" ? f : f.testo)));
  const registrate = JSON.parse(readFileSync("lib/giochi/voce-registrata.json", "utf8"));
  ok("voce: ogni frase segnata come registrata ha il suo file",
    registrate.frasi.every((id) => existsSync(`public/voce/v${registrate.versione}/${id}.mp3`)), `${registrate.frasi.length} frasi`);

  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { window.__voceMizi = []; });
  const m = await ctx.newPage();
  let erroriM = 0;
  m.on("pageerror", () => erroriM++);

  /** Gioca un livello ricordando ogni carta vista; `smemorato` gira sempre le prime due coperte (o quelle che ballano). */
  const giocaLivello = async (smemorato = false) => {
    const campo = m.locator("[data-memory]");
    await m.locator("[data-memory][data-fase='gioca']").waitFor({ timeout: 10000 });
    const livello = await campo.getAttribute("data-livello");
    const carte = m.locator("[data-carta]");
    const n = await carte.count();
    const visti = {};
    let aiuti = 0;
    for (let giro = 0; giro < 80; giro++) {
      if ((await campo.getAttribute("data-livello")) !== livello || (await campo.getAttribute("data-fase")) === "finito") break;
      if ((await campo.getAttribute("data-fase")) !== "gioca") { await m.waitForTimeout(200); continue; }
      const coperte = [];
      for (let i = 0; i < n; i++) if ((await carte.nth(i).getAttribute("data-stato")) === "coperta") coperte.push(i);
      if (coperte.length < 2) { await m.waitForTimeout(200); continue; }
      let a, due;
      if (smemorato) {
        const ballano = [];
        for (const i of coperte) if (await carte.nth(i).getAttribute("data-aiuto")) ballano.push(i);
        if (ballano.length === 2) aiuti++;
        [a, due] = ballano.length === 2 ? ballano : coperte;
      } else {
        const perNome = {};
        for (const i of coperte) if (visti[i]) (perNome[visti[i]] ??= []).push(i);
        const coppia = Object.values(perNome).find((v) => v.length === 2);
        if (coppia) [a, due] = coppia; else a = coperte.find((i) => !visti[i]) ?? coperte[0];
      }
      await carte.nth(a).tap(); await m.waitForTimeout(120);
      visti[a] = await carte.nth(a).getAttribute("aria-label");
      due ??= coperte.find((i) => i !== a && visti[i] === visti[a]) ?? coperte.find((i) => i !== a && !visti[i]) ?? coperte.find((i) => i !== a);
      await carte.nth(due).tap(); await m.waitForTimeout(120);
      visti[due] = await carte.nth(due).getAttribute("aria-label");
      await m.waitForTimeout(1400);
    }
    return { n, aiuti };
  };

  await m.goto(`${BASE}/giochi/memory-animali/gioca?eta=3`, { waitUntil: "networkidle" });
  ok("memory: a 3 anni si comincia guardando le carte scoperte",
    (await m.locator("[data-memory]").getAttribute("data-fase")) === "guarda" && (await m.locator("[data-carta][data-stato='coperta']").count()) === 0);
  const misure = [];
  for (let l = 0; l < 3; l++) misure.push((await giocaLivello()).n);
  const festa = await m.locator("[data-festa]").waitFor({ timeout: 8000 }).then(() => true, () => false);
  await m.waitForTimeout(900);
  ok("memory: tre livelli che crescono (4, 6, 8 carte) fino alla festa", festa && misure.join() === "4,6,8" && erroriM === 0, misure.join());
  const detto = await m.evaluate(() => window.__voceMizi.map((v) => v.testo));
  const fuori = [...new Set(detto.filter((t) => !nelCopione.has(t)))];
  ok("memory: tutto quello che Mizi dice è nel copione della voce registrata", detto.length > 15 && fuori.length === 0, fuori.join(" | "));
  ok("memory: ogni carta girata dice il suo animale", detto.some((t) => /^(Il|La|L')[ a-z']+$/.test(t)) && detto.some((t) => t.endsWith("Coppia trovata.")));
  const prossimo = m.locator("[data-prossimo-gioco]");
  ok("festa: figurina nuova, 1 nell'album, tre stelle per chi ricorda tutto",
    (await m.locator("[data-figurina]").getAttribute("data-figurina")) === "nuova" &&
    (await m.locator("[data-figurine]").getAttribute("data-figurine")) === "1" &&
    (await m.locator("[data-stelle]").getAttribute("data-stelle")) === "3" &&
    (await m.locator("[data-oggi]").getAttribute("data-oggi")) === "1");
  const hrefProssimo = await prossimo.getAttribute("href");
  ok("festa: propone un altro gioco adatto ai 3 anni, e «Ancora» resta",
    /^\/giochi\/(?!memory-animali)[a-z0-9-]+\/gioca\?eta=3$/.test(hrefProssimo ?? "") && (await m.locator("[data-ancora]").count()) === 1, hrefProssimo);
  ok("festa: la frase finale parla della figurina nuova", detto.at(-1)?.includes("figurina nuova") || (await m.evaluate(() => window.__voceMizi.at(-1).testo)).includes("figurina nuova"));

  await m.locator("[data-ancora]").tap();
  await m.waitForTimeout(500);
  ok("memory: «Ancora» riparte dal livello 1 e la festa sparisce",
    (await m.locator("[data-memory]").getAttribute("data-livello")) === "1" && (await m.locator("[data-festa]").count()) === 0);

  // Lo smemorato: dopo tre tentativi a vuoto due carte ballano, e si arriva in fondo lo stesso.
  let aiuti = 0;
  for (let l = 0; l < 3; l++) aiuti += (await giocaLivello(true)).aiuti;
  await m.locator("[data-festa]").waitFor({ timeout: 8000 }).catch(() => {});
  await m.waitForTimeout(700);
  ok("memory: dopo tre errori di fila Mizi aiuta, e chi sbaglia finisce comunque (con meno stelle)",
    aiuti > 0 && Number(await m.locator("[data-stelle]").getAttribute("data-stelle").catch(() => 0)) < 3 &&
    (await m.locator("[data-figurina]").getAttribute("data-figurina")) === "gia", `${aiuti} aiuti`);

  // Coccarda del giorno: altri due giochi già finiti oggi, il Memory è il terzo.
  await m.evaluate(() => {
    const a = JSON.parse(localStorage.getItem("giocamizi-album"));
    const d = new Date();
    const g = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    a.giochi["conta-fino-a-10"] = { stelle: 2, volte: 1, ultimo: g };
    a.giochi["abbina-i-colori"] = { stelle: 3, volte: 1, ultimo: g };
    a.oggi = { giorno: g, slug: ["conta-fino-a-10", "abbina-i-colori"] };
    a.coccarde = 0;
    localStorage.setItem("giocamizi-album", JSON.stringify(a));
  });
  await m.goto(`${BASE}/giochi/memory-animali/gioca?eta=3`, { waitUntil: "networkidle" });
  for (let l = 0; l < 3; l++) await giocaLivello();
  await m.locator("[data-festa]").waitFor({ timeout: 8000 }).catch(() => {});
  await m.waitForTimeout(900);
  ok("album: il terzo gioco diverso del giorno regala la coccarda",
    (await m.locator("[data-oggi]").getAttribute("data-oggi")) === "3" && (await m.locator("[data-oggi]").textContent()).includes("Coccarda di oggi conquistata") &&
    (await m.evaluate(() => window.__voceMizi.at(-1).testo)).includes("coccarda"));
  const versoIlProssimo = await m.locator("[data-prossimo-gioco]").getAttribute("href");
  await Promise.all([m.waitForURL((u) => !u.pathname.includes("memory-animali"), { timeout: 10000 }).catch(() => {}), m.locator("[data-prossimo-gioco]").tap()]);
  ok("festa: «Prossimo gioco» porta dritto a giocare", `${new URL(m.url()).pathname}${new URL(m.url()).search}` === versoIlProssimo, m.url());

  await m.goto(`${BASE}/giochi/album`, { waitUntil: "networkidle" });
  await m.locator("[data-album='pronto']").waitFor({ timeout: 5000 }).catch(() => {});
  const album = await m.evaluate(() => ({
    prese: document.querySelectorAll("[data-figurina='presa']").length,
    tutte: document.querySelectorAll("[data-figurina]").length,
    oggi: document.querySelector("[data-oggi]")?.getAttribute("data-oggi"),
    coccarde: document.querySelector("[data-conto='coccarde'] dd")?.textContent,
    proposte: [...document.querySelectorAll("[data-proposta]")].map((x) => x.getAttribute("data-proposta")),
    sbordo: document.documentElement.scrollWidth - window.innerWidth,
  }));
  ok("album: 3 figurine prese su 40, coccarda contata, tre giochi nuovi da provare",
    album.prese === 3 && album.tutte === 40 && album.oggi === "3" && album.coccarde === "1" && album.proposte.length === 3 &&
    !album.proposte.some((s) => ["memory-animali", "conta-fino-a-10", "abbina-i-colori"].includes(s)) && album.sbordo <= 0, JSON.stringify(album));
  await m.goto(`${BASE}/giochi`, { waitUntil: "networkidle" });
  await m.waitForTimeout(400);
  ok("catalogo: la fascia dell'album e le stelle sui giochi già finiti",
    (await m.locator("[data-fascia-album]").getAttribute("data-fascia-album")) === "3" && (await m.locator("[data-stelle-gioco]").count()) === 3);

  // Demo (per i reel): prima si bloccava alla seconda carta. E non riempie l'album.
  const d = await ctx.newPage();
  await d.goto(`${BASE}/giochi/memory-animali/gioca?eta=3&demo=1`, { waitUntil: "networkidle" });
  await d.evaluate(() => localStorage.removeItem("giocamizi-album"));
  await d.reload({ waitUntil: "networkidle" });
  const demoFinita = await d.locator("[data-festa]").waitFor({ timeout: 90000 }).then(() => true, () => false);
  ok("memory: la demo arriva in fondo da sola e non tocca l'album",
    demoFinita && (await d.locator("[data-esito-album]").count()) === 0 && (await d.evaluate(() => localStorage.getItem("giocamizi-album"))) === null);
  await d.close();

  // Tre tocchi nello stesso istante: restano scoperte due carte, mai tre.
  await m.goto(`${BASE}/giochi/memory-animali/gioca?eta=5`, { waitUntil: "networkidle" });
  await m.locator("[data-memory][data-fase='gioca']").waitFor({ timeout: 5000 });
  await m.evaluate(() => { const c = [...document.querySelectorAll("[data-carta]")]; c[0].click(); c[1].click(); c[2].click(); });
  await m.waitForTimeout(150);
  ok("memory: tre tocchi insieme scoprono due carte, non tre", (await m.locator("[data-carta]:not([data-stato='coperta'])").count()) === 2);
  await ctx.close();

  // L'invito alle novità dopo il secondo gioco: deve stare SOPRA la festa (prima finiva sotto e nessuno lo vedeva).
  const ctxForm = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const f = await ctxForm.newPage();
  await f.goto(`${BASE}/giochi/memory-animali/gioca?eta=3&demo=1`, { waitUntil: "networkidle" });
  await f.evaluate(() => localStorage.setItem("mizi.partite", JSON.stringify(["un-gioco"])));
  await f.locator("[data-festa]").waitFor({ timeout: 90000 }).catch(() => {});
  const invito = f.locator("[data-dopo-il-gioco]");
  const comparso = await invito.waitFor({ timeout: 8000 }).then(() => true, () => false);
  const inCima = comparso && (await f.evaluate(() => {
    const titolo = [...document.querySelectorAll("[data-dopo-il-gioco] *")].find((e) => e.textContent?.trim() === "Vi mandiamo i giochi nuovi?");
    if (!titolo) return false;
    const r = titolo.getBoundingClientRect();
    return titolo.contains(document.elementFromPoint(r.x + 4, r.y + r.height / 2));
  }));
  ok("dopo il secondo gioco l'invito alle novità si vede davvero, sopra la festa", comparso && inCima);
  await ctxForm.close();
}

// ── Nucleo comune dei giochi (16/11/2026) ──
// 1) OGNI gioco del registro arriva da solo alla festa (?demo=1): è la prova
//    che nessuno resta bloccato a metà. Il 16/11 erano 31 su 38: «La tartaruga»
//    non si poteva finire nemmeno giocando davvero.
// 2) Una partita da sbadati a un gioco «tocca la risposta giusta»: dopo due
//    errori la risposta giusta dondola, la festa dà una stella sola, la
//    figurina entra nell'album, e ogni lode detta è nel copione.
// 3) «Crea il tuo gioco»: «Ho finito» porta alla festa e alla figurina.
{
  const { readFileSync } = await import("node:fs");
  const registro = readFileSync("games/registry.ts", "utf8");
  const vivi = [...registro.matchAll(/slug: "([^"]+)"[^}]*?ageMin: (\d+)[^}]*?status: "live"/g)].map((x) => ({ slug: x[1], eta: Number(x[2]) }));
  const fermi = [];
  const coda = [...vivi];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (coda.length) {
      const g = coda.shift();
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await ctx.addInitScript(() => { try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
      const pg = await ctx.newPage();
      let rotto = 0;
      pg.on("pageerror", () => rotto++);
      await pg.goto(`${BASE}/giochi/${g.slug}/gioca?eta=${g.eta}&demo=1`, { waitUntil: "domcontentloaded" });
      const festa = await pg.locator("[data-festa]").waitFor({ timeout: 120000 }).then(() => true, () => false);
      if (!festa || rotto) fermi.push(`${g.slug}${rotto ? " (errore JS)" : ""}`);
      await ctx.close();
    }
  }));
  ok(`tutti i ${vivi.length} giochi del registro arrivano da soli alla festa`, vivi.length >= 38 && fermi.length === 0, fermi.join(", "));

  const copione = JSON.parse(readFileSync("content/voce-mizi.json", "utf8"));
  const nucleo = new Set(copione.frasi.nucleo ?? []);
  const sorgente = readFileSync("games/_engine/nucleo.ts", "utf8");
  const nelCodice = [...sorgente.matchAll(/"([^"\n]+[.!])"/g)].map((x) => x[1]).filter((f) => /^(Evviva|Esatto|Sì|Che occhio|Giusto|Quasi|Non è|Riprova|Ti aiuto)/.test(f));
  ok("nucleo: le frasi comuni del codice sono identiche a quelle del copione", nelCodice.length === nucleo.size && nelCodice.every((f) => nucleo.has(f)), nelCodice.filter((f) => !nucleo.has(f)).join(" | "));
  ok("nucleo: nessuna lode al maschile nei giochi", !/Brav[oa][!.]|Bravissim/.test(["games/_engine/SceltaMultipla.tsx", "games/_engine/Ordina.tsx", "games/_engine/PixelArt.tsx", "games/_engine/Tartaruga.tsx", "games/cosa-manca/Game.tsx", "games/salvadanaio/Game.tsx", "games/pizza-delle-frazioni/Game.tsx", "games/puzzle-facile/Game.tsx", "games/unisci-le-sillabe/Game.tsx"].map((f) => readFileSync(f, "utf8")).join("\n")));

  // La partita da sbadati: «Abbina i colori» a 3 anni.
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { window.__voceMizi = []; try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const s = await ctx.newPage();
  let erroriS = 0;
  s.on("pageerror", () => erroriS++);
  await s.goto(`${BASE}/giochi/abbina-i-colori/gioca?eta=3`, { waitUntil: "networkidle" });
  const campo = s.locator("[data-scelta-multipla]");
  await campo.waitFor({ timeout: 10000 });
  const totali = Number(await campo.getAttribute("data-round-totali"));
  // Il colore giusto è quello dell'oggetto al centro («Oggetto viola»): a ogni round
  // si toccano apposta due secchielli sbagliati, poi deve dondolare proprio quello giusto.
  let aiutiGiusti = 0, doppioTocco = true, rounds = 0;
  for (let r = 1; r <= totali; r++) {
    await s.waitForFunction((n) => document.querySelector("[data-scelta-multipla]")?.getAttribute("data-round") === String(n) && document.querySelector("[data-scelta-multipla]")?.getAttribute("data-partita") === "gioca", r, { timeout: 8000 }).catch(() => {});
    const colore = (await campo.locator('[aria-label^="Oggetto "]').first().getAttribute("aria-label", { timeout: 5000 }).catch(() => ""))?.replace("Oggetto ", "");
    const sbagliati = s.locator(`[data-opzione][data-stato=libera]:not([aria-label="Secchiello ${colore}"])`);
    for (let colpo = 0; colpo < 2; colpo++) {
      await sbagliati.first().tap();
      await s.waitForTimeout(250);
    }
    const aiuto = s.locator("[data-aiuto-opzione]");
    if ((await aiuto.count()) === 1 && (await aiuto.getAttribute("aria-label")) === `Secchiello ${colore}`) aiutiGiusti++;
    // Due tocchi nello stesso istante sulla giusta: il round avanza una volta sola.
    await s.locator(`[data-opzione][aria-label="Secchiello ${colore}"]`).evaluate((el) => { el.click(); el.click(); });
    rounds++;
    await s.waitForTimeout(1300);
    const adesso = await campo.getAttribute("data-round").catch(() => null);
    if (r < totali && Number(adesso) !== r + 1) doppioTocco = false;
  }
  const stelleAttese = 1;
  const festaS = await s.locator("[data-festa]").waitFor({ timeout: 8000 }).then(() => true, () => false);
  const stelleS = festaS ? await s.locator("[data-festa] [data-stelle]").first().getAttribute("data-stelle") : null;
  const album = await s.evaluate(() => JSON.parse(localStorage.getItem("giocamizi-album") || "{}"));
  const detto = await s.evaluate(() => (window.__voceMizi || []).map((v) => v.testo));
  ok("nucleo: la partita da sbadati finisce senza errori JS", festaS && erroriS === 0 && rounds === totali, `round ${rounds}/${totali}`);
  ok("nucleo: dopo due errori dondola proprio la risposta giusta, a ogni round", aiutiGiusti === totali, `${aiutiGiusti} su ${totali}`);
  ok("nucleo: due tocchi nello stesso istante non saltano un round", doppioTocco);
  ok("nucleo: chi sbaglia a ogni round prende una stella, mai zero", stelleS === String(stelleAttese), `stelle ${stelleS}`);
  ok("nucleo: la partita finita mette la figurina nell'album", album.giochi?.["abbina-i-colori"]?.stelle === stelleAttese && album.giochi["abbina-i-colori"].volte === 1, JSON.stringify(album.giochi ?? {}));
  ok("nucleo: lodi e incoraggiamenti detti sono quelli del copione", detto.some((t) => nucleo.has(t)) && !detto.some((t) => /Brav[oa]/.test(t)), detto.slice(0, 6).join(" | "));
  // La pagina del gioco mostra la sua figurina: presa (con le stelle) dopo la partita, da prendere prima.
  await s.goto(`${BASE}/giochi/abbina-i-colori`, { waitUntil: "networkidle" });
  const presa = s.locator("[data-figurina-gioco=presa]");
  const vistaPresa = await presa.waitFor({ timeout: 5000 }).then(() => true, () => false);
  await s.goto(`${BASE}/giochi/tabelline`, { waitUntil: "networkidle" });
  const daPrendere = await s.locator("[data-figurina-gioco=da-prendere]").waitFor({ timeout: 5000 }).then(() => true, () => false);
  ok("album: la pagina di ogni gioco dice se la figurina è presa o da prendere", vistaPresa && daPrendere);
  await ctx.close();

  // «Crea il tuo gioco»: prima «Ho finito» non mostrava né festa né figurina.
  const ctxC = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctxC.addInitScript(() => { try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const c = await ctxC.newPage();
  await c.goto(`${BASE}/giochi/crea-il-tuo-gioco/gioca?eta=10`, { waitUntil: "networkidle" });
  await c.locator("[data-ho-finito]").tap();
  const festaC = await c.locator("[data-festa]").waitFor({ timeout: 6000 }).then(() => true, () => false);
  const albumC = await c.evaluate(() => JSON.parse(localStorage.getItem("giocamizi-album") || "{}"));
  ok("crea il tuo gioco: «Ho finito» porta alla festa e alla figurina", festaC && albumC.giochi?.["crea-il-tuo-gioco"]?.stelle === 3);
  await ctxC.close();

  // «Trova le differenze» sul nucleo (17/11/2026). Una partita da curiosi a 7 anni:
  // a ogni scena tre tocchi a vuoto, poi la differenza indicata, poi le altre,
  // l'ultima con due tocchi nello stesso istante (prima saltava una scena).
  const frasiD = copione.frasi["trova-le-differenze"] ?? [];
  const sorgenteD = readFileSync("games/_engine/Differenze.tsx", "utf8");
  const nelCodiceD = [...sorgenteD.matchAll(/(?:trovata|tutte|aiuto|vuoto): "([^"]+)"/g)].map((x) => x[1]);
  ok("differenze: le frasi del motore sono identiche a quelle del copione", nelCodiceD.length === 4 && nelCodiceD.every((f) => frasiD.includes(f)), nelCodiceD.filter((f) => !frasiD.includes(f)).join(" | "));
  const ctxD = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctxD.addInitScript(() => { window.__voceMizi = []; try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const d = await ctxD.newPage();
  let erroriD = 0;
  d.on("pageerror", () => erroriD++);
  await d.goto(`${BASE}/giochi/trova-le-differenze/gioca?eta=7`, { waitUntil: "networkidle" });
  const campoD = d.locator("[data-differenze]");
  await campoD.waitFor({ timeout: 10000 });
  const sceneD = Number(await campoD.getAttribute("data-round-totali"));
  let aiutiD = 0, aiutoPresto = 0, aiutoResta = 0, scenePulite = 0, saltate = 0;
  for (let r = 1; r <= sceneD; r++) {
    await d.waitForFunction((n) => { const c = document.querySelector("[data-differenze]"); return c?.getAttribute("data-round") === String(n) && c?.getAttribute("data-partita") === "gioca"; }, r, { timeout: 8000 }).catch(() => {});
    const box = await d.locator("[data-scena-da-toccare]").boundingBox();
    const centri = await d.locator("[data-differenza]").evaluateAll((els) => els.map((e) => ({ x: Number(e.getAttribute("cx")), y: Number(e.getAttribute("cy")) })));
    // Un punto della scena lontano da ogni differenza.
    let libero = { x: 50, y: 55 };
    cerca: for (let x = 5; x < 100; x += 5) for (let y = 5; y < 60; y += 5) if (centri.every((c) => Math.hypot(c.x - x, c.y - y) > 12)) { libero = { x, y }; break cerca; }
    for (let colpo = 1; colpo <= 3; colpo++) {
      if (colpo === 3 && (await d.locator("[data-aiuto-differenza]").count())) aiutoPresto++;
      await d.touchscreen.tap(box.x + (libero.x / 100) * box.width, box.y + (libero.y / 60) * box.height);
      await d.waitForTimeout(200);
    }
    const aiutoD = d.locator("[data-aiuto-differenza]");
    const indicata = (await aiutoD.count()) === 1 ? await aiutoD.getAttribute("data-aiuto-differenza") : null;
    if (indicata && (await d.locator(`[data-differenza="${indicata}"]:not([data-trovata])`).count()) === 1) aiutiD++;
    if (indicata) await d.locator(`[data-differenza="${indicata}"]`).tap({ force: true });
    await d.waitForTimeout(200);
    if (await d.locator("[data-aiuto-differenza]").count()) aiutoResta++;
    const resto = await d.locator("[data-differenza]:not([data-trovata])").evaluateAll((els) => els.map((e) => e.getAttribute("data-differenza")));
    for (let i = 0; i < resto.length; i++) {
      const el = d.locator(`[data-differenza="${resto[i]}"]`);
      if (i === resto.length - 1) await el.evaluate((e) => { for (let k = 0; k < 2; k++) e.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      else { await el.tap({ force: true }); await d.waitForTimeout(150); }
    }
    await d.waitForTimeout(300);
    if ((await campoD.getAttribute("data-trovate")) === (await campoD.getAttribute("data-da-trovare"))) scenePulite++;
    await d.waitForTimeout(1500);
    if (r < sceneD && Number(await campoD.getAttribute("data-round").catch(() => 0)) !== r + 1) saltate++;
  }
  const festaD = await d.locator("[data-festa]").waitFor({ timeout: 8000 }).then(() => true, () => false);
  const stelleD = festaD ? await d.locator("[data-festa] [data-stelle]").first().getAttribute("data-stelle") : null;
  const albumD = await d.evaluate(() => JSON.parse(localStorage.getItem("giocamizi-album") || "{}"));
  const dettoD = await d.evaluate(() => (window.__voceMizi || []).map((v) => v.testo));
  ok("differenze: la partita da curiosi finisce senza errori JS", festaD && erroriD === 0 && scenePulite === sceneD, `scene ${scenePulite}/${sceneD}`);
  ok("differenze: dopo tre tocchi a vuoto (non prima) un cerchio indica una differenza che manca", aiutiD === sceneD && aiutoPresto === 0, `${aiutiD} su ${sceneD}, in anticipo ${aiutoPresto}`);
  ok("differenze: trovata la differenza indicata, il cerchio dell'aiuto sparisce", aiutoResta === 0);
  ok("differenze: due tocchi nello stesso istante sull'ultima non saltano una scena", saltate === 0);
  ok("differenze: tanti tocchi a vuoto danno una stella, mai zero, e la figurina", stelleD === "1" && albumD.giochi?.["trova-le-differenze"]?.stelle === 1, `stelle ${stelleD}`);
  ok("differenze: Mizi dice solo frasi del copione, senza «sbagliato»", ["Trovata!", "Trovate tutte!", "Ti aiuto io: guarda il cerchio viola.", "Lì è uguale. Guarda meglio."].every((f) => dettoD.includes(f)) && !dettoD.some((t) => /sbagliat|Brav[oa]/i.test(t)), [...new Set(dettoD)].join(" | "));
  await ctxD.close();

  // Chi non tocca mai a vuoto prende tre stelle (a 5 anni: tre differenze per scena).
  const ctxE = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctxE.addInitScript(() => { try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const e = await ctxE.newPage();
  await e.goto(`${BASE}/giochi/trova-le-differenze/gioca?eta=5`, { waitUntil: "networkidle" });
  const campoE = e.locator("[data-differenze]");
  await campoE.waitFor({ timeout: 10000 });
  const treAScena = (await campoE.getAttribute("data-da-trovare")) === "3";
  for (let r = 1; r <= sceneD; r++) {
    await e.waitForFunction((n) => { const c = document.querySelector("[data-differenze]"); return c?.getAttribute("data-round") === String(n) && c?.getAttribute("data-partita") === "gioca"; }, r, { timeout: 8000 }).catch(() => {});
    const ids = await e.locator("[data-differenza]").evaluateAll((els) => els.map((x) => x.getAttribute("data-differenza")));
    for (const id of ids) { await e.locator(`[data-differenza="${id}"]`).tap({ force: true }); await e.waitForTimeout(120); }
  }
  const festaE = await e.locator("[data-festa]").waitFor({ timeout: 8000 }).then(() => true, () => false);
  const stelleE = festaE ? await e.locator("[data-festa] [data-stelle]").first().getAttribute("data-stelle") : null;
  ok("differenze: a 5 anni tre differenze per scena, e senza tocchi a vuoto tre stelle", treAScena && stelleE === "3", `stelle ${stelleE}`);
  await ctxE.close();

  // «Il labirinto dei tesori» (17/11/2026): esplorazione a sale. Mizi va dove si
  // tocca; ogni sala ha una missione che apre la porta; nell'ultima c'è il tesoro.
  const frasiL = new Set(copione.frasi["labirinto-dei-tesori"] ?? []);
  const tuttoIlCopione = new Set(Object.values(copione.frasi).flat().map((f) => (typeof f === "string" ? f : f.testo)));
  const sorgenteL = readFileSync("games/labirinto-dei-tesori/Game.tsx", "utf8") + readFileSync("games/_engine/Esplora.tsx", "utf8").split("const ERRORI_PER_AIUTO")[0];
  const nelCodiceL = [...sorgenteL.matchAll(/"([^"\n]{2,}[.!])"/g)].map((x) => x[1]).filter((f) => !f.startsWith("@/"));
  ok("labirinto: le frasi del gioco sono identiche a quelle del copione", nelCodiceL.length >= 40 && nelCodiceL.every((f) => frasiL.has(f)), nelCodiceL.filter((f) => !frasiL.has(f)).join(" | "));

  const fermoL = (pg) => pg.waitForFunction(() => !document.querySelector("[data-esplora]")?.hasAttribute("data-in-cammino"), null, { timeout: 8000 }).catch(() => {});
  const salaL = (pg, n) => pg.waitForFunction((k) => { const c = document.querySelector("[data-esplora]"); return c?.getAttribute("data-round") === String(k) && c?.getAttribute("data-partita") === "gioca"; }, n, { timeout: 8000 }).catch(() => {});
  // Prende la prossima cosa giusta: se era nella nebbia il primo tocco la scopre soltanto.
  const prendiL = async (pg) => {
    const campo = pg.locator("[data-esplora]");
    const prima = await campo.getAttribute("data-prese");
    for (let v = 0; v < 3 && (await campo.getAttribute("data-prese")) === prima; v++) {
      await pg.locator("[data-prossimo]").tap();
      await fermoL(pg);
      await pg.waitForTimeout(150);
    }
  };

  // Partita onesta a 5 anni: quattro sale, la prima senza nuvole.
  const ctxL = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctxL.addInitScript(() => { window.__voceMizi = []; try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const l = await ctxL.newPage();
  let erroriL = 0;
  l.on("pageerror", () => erroriL++);
  await l.goto(`${BASE}/giochi/labirinto-dei-tesori/gioca?eta=5`, { waitUntil: "networkidle" });
  const campoL = l.locator("[data-esplora]");
  await campoL.waitFor({ timeout: 10000 });
  const saleL = Number(await campoL.getAttribute("data-round-totali"));
  const nuvole = [];
  let latoMinimo = 999, portaPresto = 0;
  for (let r = 1; r <= saleL; r++) {
    await salaL(l, r);
    nuvole.push(await l.locator("[data-nebbia]").count());
    latoMinimo = Math.min(latoMinimo, await l.locator("[data-cella]").first().evaluate((el) => Math.round(el.getBoundingClientRect().width)));
    while ((await campoL.getAttribute("data-porta")) === "chiusa") {
      if ((await l.locator("[data-disegno-porta=aperta]").count()) > 0) portaPresto++;
      await prendiL(l);
    }
    await l.locator("[data-porta-qui]").tap();
    await fermoL(l);
    await l.waitForTimeout(1500);
  }
  const festaL = await l.locator("[data-festa]").waitFor({ timeout: 8000 }).then(() => true, () => false);
  const stelleL = festaL ? await l.locator("[data-festa] [data-stelle]").first().getAttribute("data-stelle") : null;
  const dettoL = await l.evaluate(() => (window.__voceMizi || []).map((v) => v.testo));
  ok("labirinto: a 5 anni quattro sale fino al tesoro, senza errori JS e con tre stelle", festaL && erroriL === 0 && saleL === 4 && stelleL === "3", `sale ${saleL}, stelle ${stelleL}`);
  ok("labirinto: la prima sala è tutta scoperta, le altre hanno le nuvole", nuvole[0] === 0 && nuvole.slice(1).every((n) => n > 0), nuvole.join(","));
  ok("labirinto: le caselle da toccare sono larghe almeno 64 px sul telefono", latoMinimo >= 64, `${latoMinimo}px`);
  ok("labirinto: la porta si apre solo a missione compiuta", portaPresto === 0);
  ok("labirinto: tutto quello che Mizi dice è nel copione, e conta ad alta voce", dettoL.every((t) => tuttoIlCopione.has(t)) && ["Uno!", "Due!", "Tre!", "Hai trovato il tesoro!"].every((f) => dettoL.includes(f)), dettoL.filter((t) => !tuttoIlCopione.has(t)).join(" | "));
  await ctxL.close();

  // Partita da curiosi e sbadati a 8 anni: nebbia, porta chiusa, cose sbagliate, la spesa.
  const ctxM = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctxM.addInitScript(() => { window.__voceMizi = []; try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const m = await ctxM.newPage();
  let erroriM = 0;
  m.on("pageerror", () => erroriM++);
  await m.goto(`${BASE}/giochi/labirinto-dei-tesori/gioca?eta=8`, { waitUntil: "networkidle" });
  const campoM = m.locator("[data-esplora]");
  await campoM.waitFor({ timeout: 10000 });
  const saleM = Number(await campoM.getAttribute("data-round-totali"));
  let nebbiaOk = null, portaChiusaOk = 0, aiutiGiustiM = 0, restano = 0, saltateM = 0, borsa = [];
  for (let r = 1; r <= saleM; r++) {
    await salaL(m, r);
    if (r === 1) {
      // Una cosa nascosta dalle nuvole: toccarla la scopre, non la prende, e Mizi non ci sale sopra.
      const nascosta = await m.locator("[data-oggetto][data-nebbia]").first().getAttribute("data-cella").catch(() => null);
      if (nascosta) {
        const nuvolePrima = await m.locator("[data-nebbia]").count();
        await m.locator(`[data-cella="${nascosta}"]`).tap();
        await fermoL(m);
        await m.waitForTimeout(200);
        nebbiaOk = (await campoM.getAttribute("data-prese")) === "0" && (await campoM.getAttribute("data-errori-round")) === "0" && (await campoM.getAttribute("data-mizi")) !== nascosta &&
          (await m.locator(`[data-cella="${nascosta}"][data-nebbia]`).count()) === 0 && (await m.locator("[data-nebbia]").count()) < nuvolePrima;
      }
    }
    // La porta chiusa: nessun errore, si resta nella sala, Mizi fa vedere una cosa da cercare.
    await m.locator("[data-porta-qui]").tap();
    await fermoL(m);
    await m.waitForTimeout(250);
    if ((await campoM.getAttribute("data-round")) === String(r) && (await campoM.getAttribute("data-errori-round")) === "0" && (await m.locator("[data-aiuto-oggetto]").count()) === 1 &&
      (await campoM.getAttribute("data-mizi")) !== (await m.locator("[data-porta-qui]").getAttribute("data-cella"))) portaChiusaOk++;
    // Due cose prese per sbaglio (da lasciare, o fuori ordine): restano dove sono e poi si muove quella giusta.
    const daLasciare = await m.locator('[data-giusto="no"]').evaluateAll((els) => els.map((el) => el.getAttribute("data-cella")));
    const fuoriOrdine = await m.locator('[data-giusto="si"]:not([data-prossimo])').evaluateAll((els) => els.map((el) => el.getAttribute("data-cella")));
    const cosePrima = await m.locator("[data-oggetto]").count();
    for (const k of [...daLasciare, ...fuoriOrdine].slice(0, 2)) {
      const sbagli = Number(await campoM.getAttribute("data-errori-round"));
      for (let v = 0; v < 3 && Number(await campoM.getAttribute("data-errori-round")) === sbagli; v++) {
        await m.locator(`[data-cella="${k}"]`).tap();
        await fermoL(m);
        await m.waitForTimeout(200);
      }
    }
    if ((await m.locator("[data-oggetto]").count()) === cosePrima) restano++;
    const mossa = m.locator("[data-aiuto-oggetto]");
    if ((await campoM.getAttribute("data-aiuto-attivo")) === "si" && (await mossa.count()) === 1 &&
      (await mossa.getAttribute("data-aiuto-oggetto")) === (await m.locator("[data-prossimo]").getAttribute("data-oggetto"))) aiutiGiustiM++;
    if ((await m.locator("[data-cruscotto]").getAttribute("data-cruscotto")) === "lista") borsa.push(await m.locator("[data-borsa]").getAttribute("data-borsa"));
    while ((await campoM.getAttribute("data-porta")) === "chiusa") await prendiL(m);
    if ((await m.locator("[data-cruscotto]").getAttribute("data-cruscotto")) === "lista") borsa.push(await m.locator("[data-borsa]").getAttribute("data-borsa"));
    // Due tocchi nello stesso istante sulla porta aperta: una sala sola.
    await m.locator("[data-porta-qui]").evaluate((el) => { for (let k = 0; k < 2; k++) el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
    await fermoL(m);
    await m.waitForTimeout(1600);
    if (r < saleM && Number(await campoM.getAttribute("data-round").catch(() => 0)) !== r + 1) saltateM++;
  }
  const festaM = await m.locator("[data-festa]").waitFor({ timeout: 8000 }).then(() => true, () => false);
  const stelleM = festaM ? await m.locator("[data-festa] [data-stelle]").first().getAttribute("data-stelle") : null;
  const albumM = await m.evaluate(() => JSON.parse(localStorage.getItem("giocamizi-album") || "{}"));
  const dettoM = await m.evaluate(() => (window.__voceMizi || []).map((v) => v.testo));
  ok("labirinto: a 8 anni cinque sale, anche sbagliando sempre si arriva al tesoro", festaM && erroriM === 0 && saleM === 5);
  ok("labirinto: una cosa nelle nuvole si scopre, non si prende per caso", nebbiaOk !== false, String(nebbiaOk));
  ok("labirinto: la porta chiusa non è un errore e Mizi mostra cosa cercare, in ogni sala", portaChiusaOk === saleM, `${portaChiusaOk} su ${saleM}`);
  ok("labirinto: le cose prese per sbaglio restano al loro posto", restano === saleM, `${restano} su ${saleM}`);
  ok("labirinto: dopo due sbagli si muove proprio la cosa giusta, in ogni sala", aiutiGiustiM === saleM, `${aiutiGiustiM} su ${saleM}`);
  ok("labirinto: la spesa parte da 10 monete e ne resta una", borsa.join(",") === "10,1", borsa.join(","));
  ok("labirinto: due tocchi sulla porta non saltano una sala", saltateM === 0);
  ok("labirinto: chi sbaglia in ogni sala prende una stella, mai zero, e la figurina", stelleM === "1" && albumM.giochi?.["labirinto-dei-tesori"]?.stelle === 1, `stelle ${stelleM}`);
  ok("labirinto: anche da sbadati Mizi dice solo frasi del copione, senza «sbagliato»", dettoM.every((t) => tuttoIlCopione.has(t)) && !dettoM.some((t) => /sbagliat|Brav[oa]/i.test(t)), dettoM.filter((t) => !tuttoIlCopione.has(t)).join(" | "));
  await ctxM.close();

  // Da computer si gioca anche con le frecce della tastiera.
  const ctxT = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctxT.addInitScript(() => { try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const t = await ctxT.newPage();
  await t.goto(`${BASE}/giochi/labirinto-dei-tesori/gioca?eta=5`, { waitUntil: "networkidle" });
  const campoT = t.locator("[data-esplora]");
  await campoT.waitFor({ timeout: 10000 });
  const partenzaT = await campoT.getAttribute("data-mizi");
  let mossaT = false;
  for (const freccia of ["ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"]) {
    await t.keyboard.press(freccia);
    await t.waitForTimeout(350);
    if ((await campoT.getAttribute("data-mizi")) !== partenzaT || Number(await campoT.getAttribute("data-prese")) > 0) { mossaT = true; break; }
  }
  ok("labirinto: da computer Mizi si muove con le frecce", mossaT);
  await ctxT.close();
}

// «La corsa nella piramide» (20/11/2026): corsa a tre strade, motore Corsa.tsx.
// Niente vite e niente tempo: chi sbatte dappertutto arriva in cima lo stesso.
{
  const { readFileSync } = await import("node:fs");
  const copioneC = JSON.parse(readFileSync("content/voce-mizi.json", "utf8"));
  const frasiC = new Set(copioneC.frasi["corsa-nella-piramide"] ?? []);
  const tuttoC = new Set(Object.values(copioneC.frasi).flat().map((f) => (typeof f === "string" ? f : f.testo)));
  const sorgenteC = readFileSync("games/corsa-nella-piramide/Game.tsx", "utf8") + readFileSync("games/_engine/Corsa.tsx", "utf8").split("const ERRORI_PER_AIUTO")[0];
  const nelCodiceC = [...sorgenteC.matchAll(/"([^"\n]{2,}[.!])"/g)].map((x) => x[1]).filter((f) => !f.startsWith("@/"));
  ok("corsa: le frasi del gioco sono identiche a quelle del copione", nelCodiceC.length >= 13 && nelCodiceC.every((f) => frasiC.has(f)), nelCodiceC.filter((f) => !frasiC.has(f)).join(" | "));

  // I comandi: bottoni grandi, frecce della tastiera, il salto.
  const ctxC = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctxC.addInitScript(() => { window.__voceMizi = []; try { localStorage.setItem("mizi.form-proposto-2", "1"); } catch {} });
  const c = await ctxC.newPage();
  let erroriC = 0;
  c.on("pageerror", () => erroriC++);
  await c.goto(`${BASE}/giochi/corsa-nella-piramide/gioca?eta=6`, { waitUntil: "networkidle" });
  const campoC = c.locator("[data-corsa]");
  await campoC.waitFor({ timeout: 10000 });
  const stradaC = (n) => c.waitForFunction((k) => document.querySelector("[data-corsa]")?.getAttribute("data-strada") === k, String(n), { timeout: 3000 }).then(() => true, () => false);
  await stradaC(0);
  const latiC = await c.locator("[data-comando]").evaluateAll((els) => els.map((el) => Math.round(Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height))));
  ok("corsa: tre bottoni di almeno 64 px, tutti dentro lo schermo senza scorrere", latiC.length === 3 && Math.min(...latiC) >= 64 &&
    (await c.locator("[data-comando]").evaluateAll((els) => els.every((el) => el.getBoundingClientRect().bottom <= window.innerHeight))), latiC.join(" "));
  await c.locator("[data-comando=destra]").tap();
  const aDestra = await stradaC(1);
  await c.keyboard.press("ArrowLeft");
  await c.keyboard.press("ArrowLeft");
  const aSinistra = await stradaC(-1);
  await c.locator("[data-comando=salta]").tap();
  const inAria = await c.waitForFunction(() => document.querySelector("[data-corsa]")?.getAttribute("data-in-aria") === "si", null, { timeout: 2000 }).then(() => true, () => false);
  ok("corsa: bottoni e frecce cambiano strada, «Salta» fa saltare", aDestra && aSinistra && inAria, `destra ${aDestra} sinistra ${aSinistra} salto ${inAria}`);

  // Da qui non si tocca più niente: Mizi sbatte, riparte, e al terzo urto di un piano scatta l'aiuto.
  let aiutoVisto = false;
  const inizioC = Date.now();
  while (Date.now() - inizioC < 240000 && (await c.locator("[data-festa]").count()) === 0) {
    if ((await campoC.getAttribute("data-aiuto-attivo")) === "si") aiutoVisto = true;
    await c.waitForTimeout(500);
  }
  const festaC = (await c.locator("[data-festa]").count()) > 0;
  const stelleC = festaC ? await c.locator("[data-festa] [data-stelle]").first().getAttribute("data-stelle") : null;
  ok("corsa: senza toccare niente si arriva in cima lo stesso, con l'aiuto e una stella, mai zero", festaC && aiutoVisto && stelleC === "1" && erroriC === 0, `festa ${festaC} aiuto ${aiutoVisto} stelle ${stelleC}`);
  const dettoC = await c.evaluate(() => (window.__voceMizi || []).map((v) => v.testo));
  ok("corsa: anche sbattendo Mizi dice solo frasi del copione, senza «sbagliato»", dettoC.length > 10 && dettoC.every((t) => tuttoC.has(t)) && !dettoC.some((t) => /sbagliat|Brav[oa]|perso/i.test(t)), dettoC.filter((t) => !tuttoC.has(t)).join(" | "));
  await ctxC.close();
}

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("giochi") ? 0 : 1);
