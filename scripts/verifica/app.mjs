// La web app: manifest e service worker rispondono, e la barretta
// «Scarica Giocamizi sul tuo telefono» compare SOLO sul telefono, dopo il
// banner dei cookie, mai dentro i giochi né sopra la barra della scheda, e
// se la chiudi resta chiusa.
import { apriBrowser, conServer, contatore, BASE } from "./comune.mjs";

const servito = await conServer();
const { ok, chiudi } = contatore();

// 1. Manifest, icone e service worker.
const man = await fetch(`${BASE}/manifest.webmanifest`).then((r) => r.json()).catch(() => ({}));
ok("manifest: nome, a tutto schermo, colori", man.short_name === "Giocamizi" && man.display === "standalone" && man.theme_color === "#9B6DD6");
const icone = await Promise.all((man.icons ?? []).map((i) => fetch(BASE + i.src).then((r) => r.ok && r.headers.get("content-type")?.includes("png"))));
ok("manifest: icone 192/512/maskable raggiungibili", icone.length === 3 && icone.every(Boolean));
const sw = await fetch(`${BASE}/sw.js`);
ok("service worker: /sw.js risponde", sw.ok && (await sw.text()).includes("navigate"));
const home = await fetch(`${BASE}/`).then((r) => r.text());
ok("home: link al manifest e meta per iPhone", home.includes('rel="manifest"') && home.includes("apple-mobile-web-app"));

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
const b = await apriBrowser();
const barra = (p) => p.locator("[data-barra-app]");
const visibile = (p) => barra(p).isVisible().catch(() => false);

// 2. iPhone: col banner dei cookie aperto la barra aspetta.
const iphone = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: IPHONE });
const p = await iphone.newPage();
await p.goto(BASE + "/", { waitUntil: "networkidle" });
ok("iPhone: col banner cookie aperto la barra non c'è", !(await visibile(p)));
await p.getByRole("region", { name: /Consenso/ }).getByRole("button").first().tap();
await barra(p).waitFor({ timeout: 4000 }).catch(() => null);
ok("iPhone: chiuso il banner, la barra compare", await visibile(p));
ok("iPhone: dice «Scarica Giocamizi sul tuo telefono»", (await barra(p).textContent())?.includes("Scarica Giocamizi sul tuo telefono"));
await p.locator("[data-installa]").tap();
ok("iPhone: «Scarica» spiega Condividi → Aggiungi alla schermata Home",
  (await p.getByRole("dialog", { name: /installare/ }).textContent())?.includes("Aggiungi alla schermata Home"));
const box = await barra(p).boundingBox();
ok("iPhone: la barra sta in fondo e dentro lo schermo", box && box.y + box.height <= 844 + 1 && box.y > 500 && box.width <= 390);

// 3. Dentro un gioco e sulla scheda di un locale (che ha la sua barra): niente.
await p.goto(BASE + "/giochi/salvadanaio/gioca", { waitUntil: "networkidle" });
ok("iPhone: dentro un gioco la barra non c'è", !(await visibile(p)));
await p.goto(BASE + "/ludoteche/milano/il-nano-gigante", { waitUntil: "networkidle" });
ok("iPhone: sulla scheda del locale resta solo la sua barra", !(await visibile(p)) && (await p.locator("[data-barra-fissa]").isVisible()));

// 4. La X la chiude, e resta chiusa anche ricaricando.
await p.goto(BASE + "/giochi", { waitUntil: "networkidle" });
await barra(p).waitFor({ timeout: 4000 }).catch(() => null);
await p.locator("[data-chiudi-app]").tap();
ok("iPhone: la X chiude la barra", !(await visibile(p)));
await p.reload({ waitUntil: "networkidle" });
await p.waitForTimeout(500);
ok("iPhone: chiusa resta chiusa (30 giorni)", !(await visibile(p)) && Number(await p.evaluate(() => localStorage.getItem("giocamizi-app-chiusa"))) > 0);
await iphone.close();

// 5. Android senza finestra d'installazione del browser: istruzioni dal menu.
const android = await b.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, userAgent: ANDROID });
await android.addInitScript(() => localStorage.setItem("mizi.consenso-statistiche", "no"));
const a = await android.newPage();
await a.goto(BASE + "/feste", { waitUntil: "networkidle" });
await barra(a).waitFor({ timeout: 4000 }).catch(() => null);
await a.locator("[data-installa]").tap();
ok("Android: istruzioni «Installa app» dal menu", (await a.getByRole("dialog", { name: /installare/ }).textContent())?.includes("Installa app"));
ok("Android: nessuno sbordo con la barra", await a.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
await android.close();

// 6. Computer: mai.
const pc = await b.newContext({ viewport: { width: 1280, height: 900 } });
await pc.addInitScript(() => localStorage.setItem("mizi.consenso-statistiche", "no"));
const d = await pc.newPage();
await d.goto(BASE + "/", { waitUntil: "networkidle" });
await d.waitForTimeout(500);
ok("computer: la barra non compare", !(await visibile(d)));
await pc.close();

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("app") ? 0 : 1);
