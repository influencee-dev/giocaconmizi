// Il negozio dei PDF (lib/negozio/, docs/negozio.md). Si controlla che:
// - le regole (carrello, file di un acquisto, firma dei webhook) facciano quello che dicono;
// - finché NEGOZIO_APERTO è false il negozio resti fuori da Google, dalla sitemap e dal sito;
// - senza chiavi Stripe non si paghi niente e gli indirizzi rifiutino richieste storte;
// - il carrello stia solo nel browser e la pagina regga da telefono.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { apriBrowser, conServer, contatore, BASE } from "./comune.mjs";

const servito = await conServer();
const { ok, chiudi } = contatore();
const aperto = /NEGOZIO_APERTO = true/.test(readFileSync("lib/negozio/catalogo.ts", "utf8"));

// 1. Le regole, senza server.
const logica = spawnSync("npx", ["tsx", "scripts/verifica/negozio-logica.ts"], { encoding: "utf8" });
for (const r of (logica.stdout + logica.stderr).trim().split("\n")) if (r) console.log("   " + r);
ok("regole del negozio", logica.status === 0);

// 2. Le pagine rispondono; da chiuso sono fuori da Google e nessuno le collega.
const pagine = ["/negozio", "/negozio/carrello", "/negozio/condizioni", "/negozio/grazie"];
const testi = {};
for (const p of pagine) {
  const r = await fetch(BASE + p);
  testi[p] = await r.text();
  ok(`${p}: risponde 200 con un solo H1`, r.status === 200 && (testi[p].match(/<h1/g) ?? []).length === 1, String(r.status));
}
ok("carrello e grazie: sempre noindex", ["/negozio/carrello", "/negozio/grazie"].every((p) => /<meta name="robots" content="[^"]*noindex/.test(testi[p])));
ok("grazie senza acquisto: lo dice", testi["/negozio/grazie"].includes("Non troviamo questo acquisto"));
const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
if (!aperto) {
  ok("chiuso: noindex", ["/negozio", "/negozio/condizioni"].every((p) => /<meta name="robots" content="[^"]*noindex/.test(testi[p])));
  ok("chiuso: fuori dalla sitemap", !sitemap.includes("/negozio"));
  const altre = await Promise.all(["/", "/giochi", "/storie", "/natale", "/llms.txt"].map((p) => fetch(BASE + p).then((r) => r.text())));
  ok("chiuso: nessuna pagina del sito lo collega", altre.every((t) => !t.includes('href="/negozio')));
}

// 3. Gli indirizzi del pagamento: niente soldi senza chiavi, niente richieste storte.
const checkout = await fetch(`${BASE}/api/negozio/checkout`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prodotti: ["v01-libretto"], recesso: true }),
});
ok("checkout: senza chiave Stripe non parte", !process.env.STRIPE_SECRET_KEY ? checkout.status === 503 : checkout.status !== 500, String(checkout.status));
const webhook = await fetch(`${BASE}/api/negozio/webhook`, { method: "POST", body: "{}", headers: { "Stripe-Signature": "t=1,v1=00" } });
ok("webhook: firma falsa rifiutata", webhook.status === 400, String(webhook.status));
const scarica = await fetch(`${BASE}/api/negozio/scarica?sessione=../../x&file=a&prodotto=b`, { redirect: "manual" });
ok("scarico: link storto rifiutato", scarica.status === 400, String(scarica.status));
const scarica2 = await fetch(`${BASE}/api/negozio/scarica?sessione=cs_test_inventata0000000000&file=disegni-a4&prodotto=v01-disegni`, { redirect: "manual" });
ok("scarico: acquisto inventato non dà file", scarica2.status === 404, String(scarica2.status));

// 4. Da telefono: il carrello vive nel browser e la pagina non sborda.
const b = await apriBrowser();
const p = await b.newPage({ viewport: { width: 375, height: 800 } });
const richieste = [];
p.on("request", (r) => richieste.push(r.url()));
await p.goto(`${BASE}/negozio/carrello`, { waitUntil: "networkidle" });
ok("carrello vuoto: lo dice", (await p.textContent("main"))?.includes("Il carrello è vuoto"));
await p.evaluate(() => localStorage.setItem("giocamizi.carrello", JSON.stringify(["codice-inventato", 42])));
await p.reload({ waitUntil: "networkidle" });
ok("carrello con codici storti: resta vuoto, nessun errore", (await p.textContent("main"))?.includes("Il carrello è vuoto"));
ok("carrello: nessuna chiamata al server finché non si paga", !richieste.some((u) => u.includes("/api/negozio")));
for (const percorso of pagine) {
  await p.goto(BASE + percorso, { waitUntil: "load" });
  const sborda = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`${percorso}: niente sbordi a 375 px`, sborda <= 1, `${sborda}px`);
}
await b.close();

if (servito) process.kill(-servito.pid);
process.exit(chiudi("negozio") ? 0 : 1);
