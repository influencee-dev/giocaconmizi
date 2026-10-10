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

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("giochi") ? 0 : 1);
