// La web app: manifest e service worker rispondono, e la barretta
// «Scarica Giocamizi sul tuo telefono» compare SOLO sul telefono, dopo il
// banner dei cookie, mai dentro i giochi né sopra la barra della scheda, e
// se la chiudi resta chiusa.
import { apriBrowser, conServer, contatore, BASE, B_PIENO } from "./comune.mjs";

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

// 7. Il menu del telefono si richiude da solo quando cambi pagina.
const menuCtx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await menuCtx.addInitScript(() => localStorage.setItem("mizi.consenso-statistiche", "no"));
const m = await menuCtx.newPage();
await m.goto(BASE + "/", { waitUntil: "networkidle" });
const tasto = m.locator("button[aria-controls='menu-mobile']");
const menu = m.locator("#menu-mobile");
await tasto.tap();
await m.waitForTimeout(300);
ok("menu: si apre al tocco", (await menu.isVisible()) && (await tasto.getAttribute("aria-expanded")) === "true");
await menu.getByRole("link", { name: "Guide", exact: true }).tap();
await m.waitForURL("**/guide", { timeout: 8000 }).catch(() => null);
await m.waitForTimeout(400);
ok("menu: cambiando pagina si richiude", m.url().endsWith("/guide") && !(await menu.isVisible()) && (await tasto.textContent()) === "Menu");
await tasto.tap();
await m.waitForTimeout(300);
await m.keyboard.press("Escape");
await m.waitForTimeout(300);
ok("menu: si chiude con Esc", !(await menu.isVisible()));
await tasto.tap();
await m.waitForTimeout(300);
await m.locator("main h1").first().tap({ force: true });
await m.waitForTimeout(300);
ok("menu: si chiude toccando fuori", !(await menu.isVisible()));
await menuCtx.close();

// 8. Il telefono come un'app: benvenuto, profilo e barra delle schede.
// Le verifiche girano in un browser automatico, dove il benvenuto non compare
// (navigator.webdriver): qui lo si spegne per provarlo come una persona vera.
const UMANO = () => { Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }); localStorage.setItem("mizi.consenso-statistiche", "no"); };
const telefono = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: IPHONE };
const benvenuto = (p) => p.locator("[data-benvenuto]");
{
  const ctx = await b.newContext(telefono); await ctx.addInitScript(UMANO);
  const p = await ctx.newPage();
  const brevo = []; p.on("request", (r) => r.url().includes("/api/brevo") && brevo.push(r.url()));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("benvenuto: alla prima visita compare a tutto schermo", await benvenuto(p).isVisible());
  ok("benvenuto: sul sito si può saltare («Più tardi»)", await p.locator("[data-piu-tardi]").isVisible());
  await p.locator("[data-inizia]").tap();
  await p.locator("[data-avanti]").tap();
  ok("benvenuto: senza nome non va avanti", (await benvenuto(p).getByRole("alert").textContent())?.includes("nome"));
  await p.locator("[data-campo=mamma]").fill("Giorgia"); await p.locator("[data-avanti]").tap();
  await p.locator("[data-campo=bimbo-0]").fill("Domiziana"); await p.locator("[data-eta='7']").first().tap();
  await p.locator("[data-altro-bimbo]").tap(); await p.locator("[data-campo=bimbo-1]").fill("Leo"); await p.locator("[data-eta='4']").nth(1).tap();
  await p.locator("[data-avanti]").tap();
  ok("benvenuto: il pulsante resta in vista anche col passo lungo", await p.locator("[data-avanti]").isVisible() && (await p.locator("[data-avanti]").boundingBox()).y + 40 < 844);
  await p.locator("[data-avanti]").tap();
  await p.locator("[data-campo=email]").fill("giorgia@esempio"); await p.locator("[data-avanti]").tap();
  ok("benvenuto: email incompleta, lo dice", (await benvenuto(p).getByRole("alert").textContent())?.includes("email"));
  ok("benvenuto: la posta parte spenta", !(await p.locator("[data-spunta=posta]").isChecked()));
  await p.locator("[data-campo=email]").fill("giorgia@esempio.it"); await p.locator("[data-avanti]").tap();
  await p.waitForTimeout(300);
  ok("benvenuto: «Tutto pronto, Giorgia!» alla fine", (await benvenuto(p).textContent())?.includes("Tutto pronto, Giorgia!") && (await p.locator("[data-esito-posta]").count()) === 0);
  await p.locator("[data-avanti]").tap();
  await p.waitForTimeout(500);
  ok("benvenuto: finito, si chiude", !(await benvenuto(p).isVisible()));
  ok("home: «Ciao Giorgia!» e i giochi per Domiziana, 7 anni",
    (await p.locator("[data-saluto]").textContent()) === "Ciao Giorgia!" && (await p.locator("[data-home-app]").textContent()).includes("Oggi per Domiziana · 7 anni"));
  const prof = await p.evaluate(() => JSON.parse(localStorage.getItem("giocamizi-profilo")));
  ok("profilo: salvato sul telefono, due bimbi, posta spenta", prof?.bimbi?.length === 2 && prof.posta === false && prof.email === "giorgia@esempio.it");
  ok("privacy: senza posta nessuna chiamata a Brevo", brevo.length === 0, `${brevo.length} chiamate`);
  await p.getByRole("button", { name: "Leo · 4" }).tap();
  ok("home: si cambia bimbo con un tocco", (await p.locator("[data-home-app]").textContent()).includes("Oggi per Leo · 4 anni"));
  await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(400);
  ok("seconda visita: entra direttamente, niente benvenuto", !(await benvenuto(p).isVisible()));
  // la barra delle schede
  const schede = p.locator("[data-barra-schede]");
  ok("schede: in basso sul telefono, Home attiva", (await schede.isVisible()) && (await schede.locator("[aria-current=page]").textContent()) === "Home");
  await schede.getByRole("link", { name: "Giochi" }).tap(); await p.waitForURL("**/giochi");
  ok("schede: Giochi diventa attiva", (await schede.locator("[aria-current=page]").textContent()) === "Giochi");
  await p.goto(BASE + "/giochi/salvadanaio/gioca", { waitUntil: "networkidle" });
  ok("schede: dentro un gioco spariscono", !(await schede.isVisible()));
  await p.goto(BASE + "/ludoteche/milano/il-nano-gigante", { waitUntil: "networkidle" });
  ok("schede: sulla scheda del locale resta la sua barra", !(await schede.isVisible()) && (await p.locator("[data-barra-fissa]").isVisible()));
  // profilo: si vede e si cancella
  await p.goto(BASE + "/profilo", { waitUntil: "networkidle" });
  ok("profilo: nome e bimbi", (await p.locator("[data-nome-mamma]").textContent()) === "Giorgia" && (await p.locator("[data-bimbo]").count()) === 2);
  ok("profilo: noindex", /noindex/.test(await (await fetch(BASE + "/profilo")).text()));
  p.once("dialog", (d) => d.accept());
  await p.locator("[data-cancella]").tap(); await p.waitForTimeout(300);
  ok("profilo: «Cancella i miei dati» toglie tutto", (await p.evaluate(() => localStorage.getItem("giocamizi-profilo"))) === null);
  await ctx.close();
}
{
  // «Più tardi»: chiuso, e non torna per 7 giorni.
  const ctx = await b.newContext(telefono); await ctx.addInitScript(UMANO);
  const p = await ctx.newPage();
  await p.goto(BASE + "/giochi", { waitUntil: "networkidle" });
  await p.locator("[data-piu-tardi]").tap();
  ok("«Più tardi»: si chiude e la pagina si usa", !(await benvenuto(p).isVisible()));
  await p.goto(BASE + "/storie", { waitUntil: "networkidle" }); await p.waitForTimeout(300);
  ok("«Più tardi»: non ricompare nelle pagine dopo", !(await benvenuto(p).isVisible()));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.locator("[data-crea-profilo]").tap(); await p.waitForTimeout(300);
  ok("home senza profilo: «Crea il profilo» riapre il benvenuto", await benvenuto(p).isVisible());
  await ctx.close();
}
{
  // Da Google: la pagina cercata resta libera, il benvenuto arriva dalla seconda.
  const ctx = await b.newContext(telefono); await ctx.addInitScript(UMANO);
  const p = await ctx.newPage();
  await p.goto(BASE + "/guide/imparare-a-contare", { waitUntil: "networkidle", referer: "https://www.google.com/" }); await p.waitForTimeout(400);
  ok("da Google: la prima pagina non viene coperta", !(await benvenuto(p).isVisible()));
  await p.locator("[data-barra-schede]").getByRole("link", { name: "Giochi" }).tap(); await p.waitForURL("**/giochi"); await p.waitForTimeout(400);
  ok("da Google: dalla seconda pagina compare", await benvenuto(p).isVisible());
  // L'invito ricevuto non si copre mai.
  await p.locator("[data-piu-tardi]").tap();
  await p.evaluate(() => localStorage.removeItem("giocamizi-benvenuto-rimandato"));
  await p.goto(BASE + "/biglietti/vedi?b=" + B_PIENO, { waitUntil: "networkidle" }); await p.waitForTimeout(300);
  ok("invito ricevuto: mai coperto dal benvenuto", !(await benvenuto(p).isVisible()));
  await ctx.close();
}
{
  // App installata: obbligatorio (niente «Più tardi»).
  const ctx = await b.newContext(telefono);
  await ctx.addInitScript(UMANO);
  await ctx.addInitScript(() => { const mm = window.matchMedia.bind(window); window.matchMedia = (q) => (q.includes("display-mode: standalone") ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : mm(q)); });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("app installata: benvenuto obbligatorio", (await benvenuto(p).isVisible()) && !(await p.locator("[data-piu-tardi]").count()));
  await ctx.close();
}
{
  // Browser automatici e computer: niente benvenuto.
  const ctx = await b.newContext(telefono); const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(300);
  ok("robot/browser automatico: niente benvenuto", !(await benvenuto(p).isVisible()));
  ok("telefono: un solo titolo H1 visibile in home", (await p.locator("h1:visible").count()) === 1);
  await ctx.close();
  const pc2 = await b.newContext({ viewport: { width: 1280, height: 900 } }); await pc2.addInitScript(UMANO);
  const d2 = await pc2.newPage(); await d2.goto(BASE + "/", { waitUntil: "networkidle" }); await d2.waitForTimeout(300);
  ok("computer: niente benvenuto né schede, resta il sito", !(await benvenuto(d2).isVisible()) && !(await d2.locator("[data-barra-schede]").isVisible()) && (await d2.locator("h1:visible").count()) === 1);
  await pc2.close();
}

{
  // posta chiesta ma Brevo non risponde (qui non c'è la chiave): lo si dice, il profilo resta
  const ctx = await b.newContext(telefono); await ctx.addInitScript(UMANO);
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.locator("[data-inizia]").tap();
  await p.locator("[data-campo=mamma]").fill("Anna"); await p.locator("[data-avanti]").tap();
  await p.locator("[data-campo=bimbo-0]").fill("Sara"); await p.locator("[data-eta='5']").first().tap(); await p.locator("[data-avanti]").tap();
  await p.locator("[data-campo=email]").fill("anna@esempio.it"); await p.locator("[data-spunta=posta]").check();
  await p.locator("[data-avanti]").tap();
  await p.locator("[data-esito-posta]").waitFor({ timeout: 8000 });
  ok("benvenuto: posta non partita, lo dice e rimanda al Profilo", (await p.locator("[data-esito-posta=ko]").textContent())?.includes("Profilo"));
  const prof = await p.evaluate(() => JSON.parse(localStorage.getItem("giocamizi-profilo")));
  ok("benvenuto: profilo salvato lo stesso, posta spenta", prof?.mamma === "Anna" && prof.posta === false);
  await ctx.close();
}

{
  // Accedi: errori detti come li direbbe una persona
  const ctx = await b.newContext(telefono); await ctx.addInitScript(UMANO);
  const p = await ctx.newPage();
  await p.goto(BASE + "/accedi?errore=link-scaduto", { waitUntil: "networkidle" });
  ok("accedi: link scaduto, lo spiega", (await p.locator("form [role=alert]").textContent())?.includes("scaduto"));
  await p.locator("#email").fill("mamma@esempio.it"); await p.getByRole("checkbox").check();
  await p.getByRole("button", { name: "Mandami il link" }).tap();
  await p.waitForTimeout(400);
  // qui Supabase non si raggiunge: deve uscire una frase in italiano, non l'errore tecnico
  await p.locator("form [role=alert]").filter({ hasNotText: "scaduto" }).waitFor({ timeout: 8000 }).catch(() => null);
  const msg = (await p.locator("form [role=alert]").textContent()) ?? "";
  ok("accedi: se il link non parte lo dice in italiano", /Riprova|manutenzione|aspetta/.test(msg) && !/fetch|error|supabase/i.test(msg), msg);
  ok("accedi: niente barra delle schede", !(await p.locator("[data-barra-schede]").isVisible()));
  await ctx.close();
}

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("app") ? 0 : 1);
