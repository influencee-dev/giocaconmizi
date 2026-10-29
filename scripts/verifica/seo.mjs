// La guardia SEO: tutto il sito deve dichiarare UN solo dominio, e ogni URL
// della sitemap deve rispondere 200 col canonical su sé stesso.
// Nata dal 24/10/2026: il sito dichiarava un dominio mai collegato e Google
// scartava ogni pagina. Il server locale risponde su BASE: i percorsi
// dichiarati si riscrivono lì, gli host si confrontano tra loro.
import { conServer, contatore, BASE } from "./comune.mjs";

const servito = await conServer();
const { ok, chiudi } = contatore();
const testo = (p) => fetch(`${BASE}${p}`).then((r) => r.text());
const locale = (assoluto) => {
  const u = new URL(assoluto);
  return `${u.pathname}${u.search}`;
};

// 1. robots.txt: Host e Sitemap sullo stesso dominio.
const robots = await testo("/robots.txt");
const host = robots.match(/^Host:\s*(\S+)/m)?.[1];
const sitemapUrl = robots.match(/^Sitemap:\s*(\S+)/m)?.[1];
ok("robots: dichiara Host e Sitemap", host && sitemapUrl);
const dominio = new URL(host).origin;
ok("robots: sitemap sullo stesso dominio dell'Host", new URL(sitemapUrl).origin === dominio, dominio);
// Il dominio dev'essere quello COLLEGATO su Vercel: un dominio coerente ma
// non collegato è esattamente il guasto del 24/10. Se cambia il dominio,
// si aggiorna qui insieme a lib/seo.ts.
const COLLEGATO = "https://giocamizi.it";
ok("robots: il dominio è quello collegato su Vercel", dominio === COLLEGATO, `${dominio} (atteso ${COLLEGATO})`);

// 2. sitemap: tutti gli URL sul dominio, nessun doppione, numero plausibile.
const sitemap = await testo(locale(sitemapUrl));
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const fuori = locs.filter((l) => new URL(l).origin !== dominio);
ok("sitemap: tutti gli URL sul dominio", fuori.length === 0, fuori.slice(0, 3).join(" "));
ok("sitemap: nessun URL doppio", new Set(locs).size === locs.length, `${locs.length} URL`);
// 262 pagine il 25/10/2026: sotto 250 vuol dire che una sezione è sparita.
ok("sitemap: almeno 250 pagine", locs.length >= 250, `${locs.length}`);

// 3. Ogni pagina della sitemap: 200, un solo canonical, su sé stessa e sul
// dominio; og:url coerente; i JSON-LD non citano altri domini del sito.
const problemi = [];
const coda = [...locs];
async function controlla(loc) {
  const percorso = locale(loc);
  const r = await fetch(`${BASE}${percorso}`, { redirect: "manual" });
  if (r.status !== 200) return problemi.push(`${percorso}: HTTP ${r.status}`);
  const html = await r.text();
  const canonici = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  if (canonici.length !== 1) return problemi.push(`${percorso}: ${canonici.length} canonical`);
  const can = new URL(canonici[0]);
  if (can.origin !== dominio) problemi.push(`${percorso}: canonical su ${can.origin}`);
  if (decodeURIComponent(can.pathname) !== decodeURIComponent(new URL(loc).pathname))
    problemi.push(`${percorso}: canonical punta a ${can.pathname}`);
  const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
  if (ogUrl && new URL(ogUrl).origin !== dominio) problemi.push(`${percorso}: og:url su ${new URL(ogUrl).origin}`);
  for (const blocco of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const altri = [...blocco[1].matchAll(/https?:\/\/(?:www\.)?gioca[a-z]*mizi[^"/\s]*/gi)]
      .map((m) => new URL(m[0]).origin)
      .filter((o) => o !== dominio);
    if (altri.length) problemi.push(`${percorso}: JSON-LD cita ${altri[0]}`);
  }
}
// Cinque richieste alla volta: abbastanza veloce, senza affogare il server.
await Promise.all(Array.from({ length: 5 }, async () => {
  while (coda.length) await controlla(coda.shift());
}));
ok(
  "ogni pagina della sitemap: 200 e canonical su sé stessa",
  problemi.length === 0,
  problemi.length ? `${problemi.length} problemi, es. ${problemi.slice(0, 3).join(" | ")}` : `${locs.length} pagine`,
);

// 4. Le pagine private restano fuori da Google: l'accesso e gli inviti dei
// bambini (/biglietti/vedi porta nome, data e indirizzo della festa), il
// link personale dei locali e il pannello di approvazione.
for (const percorso of ["/accedi", "/biglietti/vedi", "/la-tua-scheda/link-di-prova-non-valido-000", "/admin/codice-di-prova-non-valido-0000"]) {
  const html = await testo(percorso);
  ok(`${percorso}: noindex e fuori dalla sitemap`,
    /<meta name="robots" content="[^"]*noindex/.test(html) && !locs.some((l) => new URL(l).pathname === percorso));
}

// 4-bis. llms-full.txt: testo intero (guide, città, giochi), link sul dominio,
// e i locali citati sono gli stessi delle pagine città (nessun locale tolto).
const pieno = await testo("/llms-full.txt");
const linkPieno = [...pieno.matchAll(/https?:\/\/[^\s)]+/g)].map((m) => m[0].replace(/[.,;:]+$/, ""));
ok("llms-full.txt: guide intere, città e giochi",
  pieno.length > 50000 && pieno.includes("### Domande frequenti") && pieno.includes("Il salvadanaio di Mizi") && pieno.includes("Festa di compleanno per bambini a Milano"),
  `${Math.round(pieno.length / 1000)} kB`);
ok("llms-full.txt: link sul dominio", linkPieno.length > 100 && linkPieno.every((l) => new URL(l).origin === dominio), `${linkPieno.length} link`);
ok("llms.txt rimanda a llms-full.txt", (await testo("/llms.txt")).includes("/llms-full.txt"));

// 5. llms.txt: i link citati stanno sul dominio.
const llms = await testo("/llms.txt");
const linkLlms = [...llms.matchAll(/https?:\/\/[^\s)]+/g)].map((m) => m[0])
  .filter((l) => /gioca[a-z]*mizi/i.test(l));
const llmsFuori = linkLlms.filter((l) => new URL(l).origin !== dominio);
ok("llms.txt: link sul dominio", linkLlms.length > 0 && llmsFuori.length === 0, `${linkLlms.length} link`);

if (servito) process.kill(-servito.pid);
process.exit(chiudi("seo") ? 0 : 1);
