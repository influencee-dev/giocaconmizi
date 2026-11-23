// La guardia SEO: tutto il sito deve dichiarare UN solo dominio, e ogni URL
// della sitemap deve rispondere 200 col canonical su sé stesso.
// Nata dal 24/10/2026: il sito dichiarava un dominio mai collegato e Google
// scartava ogni pagina. Il server locale risponde su BASE: i percorsi
// dichiarati si riscrivono lì, gli host si confrontano tra loro.
import { conServer, contatore, BASE } from "./comune.mjs";
import { validaJsonLd } from "./jsonld.mjs";

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
// si aggiorna qui insieme a lib/seo/seo.ts.
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

// 2-bis. lastmod veri (dal 02/11/2026): Google li ignora se dicono "adesso"
// su ogni pagina. Ogni lastmod è un giorno intero dalla storia git
// (lib/seo/date-pagine.json), mai nel futuro; i giochi ce l'hanno tutti; il
// file delle date è allineato ai sorgenti (npm run date-pagine).
const voci = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
  lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));
const conData = voci.filter((v) => v.lastmod);
const adesso = conData.filter((v) => !/T00:00:00(\.000)?Z$/.test(v.lastmod));
ok("sitemap: nessun lastmod «adesso», solo giorni veri", adesso.length === 0, adesso.slice(0, 2).map((v) => `${v.loc} ${v.lastmod}`).join(" "));
const domani = Date.now() + 86400000;
const futuri = conData.filter((v) => Date.parse(v.lastmod) > domani);
ok("sitemap: nessun lastmod nel futuro", futuri.length === 0, futuri.slice(0, 2).map((v) => v.loc).join(" "));
const giochiSenza = voci.filter((v) => /\/giochi\/[a-z0-9-]+$/.test(new URL(v.loc).pathname) && !v.lastmod);
ok("sitemap: ogni gioco ha il suo lastmod", giochiSenza.length === 0, giochiSenza.slice(0, 3).map((v) => v.loc).join(" "));
const { spawnSync } = await import("node:child_process");
const controllo = spawnSync("node", ["scripts/date-pagine.mjs", "--controlla"], { encoding: "utf8" });
ok("date-pagine.json allineato ai sorgenti", controllo.status === 0, (controllo.stderr || controllo.stdout).trim());

// 2-quater. Directory: gli indirizzi cambiati di categoria (content/directory-spostamenti.json)
// reindirizzano in modo permanente a una pagina viva della sitemap, e non
// sono più in sitemap loro stessi.
const { readFileSync } = await import("node:fs");
const spostati = JSON.parse(readFileSync("content/directory-spostamenti.json", "utf8")).spostamenti.flatMap((g) => g.indirizzi);
const percorsiSitemap = new Set(locs.map((l) => new URL(l).pathname));
const rotti = [];
for (const { da, a } of spostati) {
  const r = await fetch(`${BASE}${da}`, { redirect: "manual" });
  const dove = r.headers.get("location") ?? "";
  if (![301, 308].includes(r.status) || new URL(dove, BASE).pathname !== a) rotti.push(`${da}: ${r.status} → ${dove}`);
  if (!percorsiSitemap.has(a)) rotti.push(`${a}: non è in sitemap`);
  if (percorsiSitemap.has(da)) rotti.push(`${da}: ancora in sitemap`);
}
ok("directory: indirizzi vecchi reindirizzati a pagine vive", spostati.length > 0 && rotti.length === 0, rotti.slice(0, 3).join(" | ") || `${spostati.length} indirizzi`);

// 2-quater-bis. Parchi avventura e parchi acquatici (dal 15/11/2026): sono
// posti «da giornata fuori». Un parco che non risulta fare feste (festa: false
// in lib/directory/feste.ts) ha la sua scheda ma non dice «fa feste» e non compare nella
// pagina delle feste della città; uno che le fa, sì.
const htmlAvventura = await testo("/parchi-avventura");
const htmlAcquatici = await testo("/parchi-acquatici");
ok("parchi: le due categorie nuove hanno la loro pagina", htmlAvventura.includes("Parchi avventura per bambini") && htmlAcquatici.includes("Parchi acquatici per bambini"));
ok("parchi: le pagine sono in sitemap, col listing di Roma e di Firenze",
  ["/parchi-avventura", "/parchi-acquatici", "/parchi-acquatici/roma", "/parchi-avventura/firenze", "/parchi-acquatici/roma/hydromania"].every((x) => percorsiSitemap.has(x)));
const htmlHydro = await testo("/parchi-acquatici/roma/hydromania");
ok("parchi: un parco acquatico non dice «fa feste di compleanno»",
  htmlHydro.includes("Hydromania") && !htmlHydro.includes("data-fa-feste") && !htmlHydro.includes("organizza feste di compleanno"));
const htmlEur = await testo("/parchi-avventura/roma/eurpark-energy-adventure");
ok("parchi: un parco avventura che fa feste lo dice", htmlEur.includes("data-fa-feste"));
const htmlFesteRoma = await testo("/feste/roma");
ok("parchi: nella pagina feste di Roma c'è EurPark ma non Hydromania", htmlFesteRoma.includes("EurPark") && !htmlFesteRoma.includes("Hydromania"));
const htmlListingRoma = await testo("/parchi-acquatici/roma");
ok("parchi: il listing dei parchi acquatici non promette feste",
  htmlListingRoma.includes("Aquafelix") && htmlListingRoma.includes("MagicSplash") && !htmlListingRoma.includes("tutte organizzano anche feste"));

// 2-quinquies. Città vicine (dal 12/11/2026): ogni pagina città linka le 6
// più vicine; Carpi deve avere Modena e Reggio Emilia, e mai sé stessa.
const htmlCarpi = await testo("/feste/carpi");
const vicineCarpi = [...(htmlCarpi.match(/data-citta-vicine="6"[\s\S]*?<\/section>/)?.[0] ?? "").matchAll(/href="\/feste\/([a-z-]+)"/g)].map((m) => m[1]);
ok("città vicine: Carpi linka 6 città vicine, tra cui Modena e Reggio Emilia",
  vicineCarpi.length === 6 && vicineCarpi.includes("modena") && vicineCarpi.includes("reggio-emilia") && !vicineCarpi.includes("carpi"),
  vicineCarpi.join(" "));

// 2-ter. Sitemap delle immagini (dal 08/11/2026): le foto vere legate alla
// loro pagina. Ogni immagine sul dominio, risponde come immagine e compare
// davvero nella pagina che la dichiara (anche dentro /_next/image).
const conImmagini = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
  immagini: [...m[1].matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((x) => x[1]),
})).filter((v) => v.immagini.length);
const tutteImmagini = conImmagini.flatMap((v) => v.immagini);
ok("sitemap immagini: dichiarata e con le foto del sito", /xmlns:image=/.test(sitemap) && tutteImmagini.length >= 10, `${tutteImmagini.length} foto`);
const immaginiStorte = [];
for (const v of conImmagini) {
  const html = (await testo(locale(v.loc))).replace(/%2F/gi, "/");
  for (const img of v.immagini) {
    const u = new URL(img);
    if (u.origin !== dominio) { immaginiStorte.push(`${img}: fuori dominio`); continue; }
    const r = await fetch(`${BASE}${u.pathname}`);
    if (!r.ok || !r.headers.get("content-type")?.startsWith("image/")) immaginiStorte.push(`${u.pathname}: ${r.status}`);
    if (!html.includes(u.pathname)) immaginiStorte.push(`${u.pathname}: non è in ${new URL(v.loc).pathname}`);
  }
}
ok("sitemap immagini: ogni foto risponde e sta nella sua pagina", immaginiStorte.length === 0, immaginiStorte.slice(0, 3).join(" | "));

// 2-quater. Le foto si servono dai nostri file già pronti nelle varie misure
// (lib/foto/caricatore-immagini.ts), mai da /_next/image: dal 15/11/2026, quando
// su iPhone le foto passate da quel servizio non si vedevano. Ogni indirizzo
// di immagine scritto nelle pagine deve rispondere con un'immagine.
{
  const pagineConFoto = ["/", "/giochi", "/feste", "/guide", "/guide/tabelline-senza-lacrime", "/chi-siamo", "/storie", "/biglietti", "/coding"];
  const daServizio = [];
  const indirizzi = new Set();
  for (const percorso of pagineConFoto) {
    const html = (await testo(percorso)).replace(/&amp;/g, "&");
    if (html.includes("/_next/image")) daServizio.push(percorso);
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      const src = m[0].match(/\ssrc="([^"]+)"/)?.[1];
      const srcset = m[0].match(/\ssrcSet="([^"]+)"/i)?.[1] ?? "";
      for (const u of [src, ...srcset.split(",").map((x) => x.trim().split(/\s+/)[0])]) if (u?.startsWith("/")) indirizzi.add(u);
    }
  }
  ok("foto: nessuna pagina passa da /_next/image", daServizio.length === 0, daServizio.join(", "));
  const rotte = [];
  for (const u of indirizzi) {
    const r = await fetch(`${BASE}${u}`);
    if (!r.ok || !r.headers.get("content-type")?.startsWith("image/")) rotte.push(`${u}: ${r.status}`);
  }
  ok("foto: ogni immagine scritta nelle pagine risponde", indirizzi.size > 40 && rotte.length === 0, `${indirizzi.size} indirizzi; ${rotte.slice(0, 3).join(" | ")}`);
  const hero = (await testo("/feste")).match(/<img[^>]*festa-di-compleanno-per-bambini-ludoteca[^>]*>/)?.[0] ?? "";
  ok("foto: sul telefono arriva la misura giusta, non sempre la più grande",
    /ludoteca-480\.webp 256w/.test(hero) && /ludoteca-640\.webp 640w/.test(hero) && /ludoteca-1440\.webp 1200w/.test(hero), hero.slice(0, 200));
}

// 3. Ogni pagina della sitemap: 200, un solo canonical, su sé stessa e sul
// dominio; og:url coerente; i JSON-LD non citano altri domini del sito.
const problemi = [];
const strutturati = [];
const teste = [];
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
  strutturati.push(...validaJsonLd(html, percorso).problemi);
  // Per il punto 3-ter: titolo, descrizione e intestazioni di ogni pagina.
  const pulito = (t) => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
  teste.push({
    percorso,
    titolo: pulito(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? ""),
    descrizione: pulito(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""),
    h1: [...html.matchAll(/<h1[\s>]/g)].length,
  });
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

// 3-ter. Titolo, descrizione e intestazione di ogni pagina (dal 18/11/2026).
// Un giro su tutta la sitemap aveva trovato 38 pagine dei giochi con due h1 e descrizioni delle schede lunghe fino a 550 caratteri,
// che Google taglia a metà parola.
{
  const doppi = (campo) => {
    const gruppi = new Map();
    for (const t of teste) gruppi.set(t[campo], [...(gruppi.get(t[campo]) ?? []), t.percorso]);
    return [...gruppi].filter(([valore, dove]) => valore && dove.length > 1).map(([, dove]) => dove.slice(0, 2).join(" = "));
  };
  // La home ne ha due uguali, uno per il telefono (la home «come un'app») e uno per
  // il computer: se ne vede sempre uno solo, e lo controlla la batteria dell'app.
  const h1Storti = teste.filter((t) => t.h1 !== (t.percorso === "/" ? 2 : 1)).map((t) => `${t.percorso} (${t.h1})`);
  ok("ogni pagina della sitemap ha un solo h1", teste.length === locs.length && h1Storti.length === 0, `${h1Storti.length} pagine, es. ${h1Storti.slice(0, 3).join(" ")}`);
  const titoliDoppi = doppi("titolo");
  const descrizioniDoppie = doppi("descrizione");
  ok("nessun titolo e nessuna descrizione uguali su due pagine", titoliDoppi.length === 0 && descrizioniDoppie.length === 0, [...titoliDoppi, ...descrizioniDoppie].slice(0, 3).join(" | "));
  const povere = teste.filter((t) => !t.titolo || t.descrizione.length < 70).map((t) => `${t.percorso} (${t.descrizione.length})`);
  ok("ogni pagina ha un titolo e una descrizione di almeno 70 caratteri", povere.length === 0, povere.slice(0, 4).join(" "));
  // Le schede delle attività: /categoria/città/scheda. La descrizione deve stare intera nei risultati.
  const schede = teste.filter((t) => /^\/[a-z-]+\/[a-z-]+\/[a-z0-9-]+$/.test(t.percorso) && !/^\/(giochi|guide|natale|biglietti|storie|tutorial|risorse-educative-bambini|admin|feste)\//.test(t.percorso));
  const lunghe = schede.filter((t) => t.descrizione.length > 160).map((t) => `${t.percorso} (${t.descrizione.length})`);
  ok("schede delle attività: la descrizione sta nei 160 caratteri", schede.length > 200 && lunghe.length === 0, `${schede.length} schede; ${lunghe.slice(0, 3).join(" ")}`);

  // Titoli (dal 22/11/2026). Google mostra circa 60 caratteri: 318 pagine su 761 ne avevano più di 70,
  // e le schede arrivavano a 150-200 («Nome, tipo lungo a Città (zona) — Giocamizi»).
  const TITOLO_MAX = 65;
  const titoliLunghi = schede.filter((t) => t.titolo.length > TITOLO_MAX).map((t) => `${t.percorso} (${t.titolo.length})`);
  ok("schede delle attività: il titolo sta in 65 caratteri", titoliLunghi.length === 0, titoliLunghi.slice(0, 3).join(" "));
  const elenchi = teste.filter((t) => /^\/[a-z-]+\/[a-z-]+$/.test(t.percorso) && !/^\/(giochi|guide|natale|biglietti|storie|tutorial|risorse-educative-bambini|admin|feste|genitori)\//.test(t.percorso));
  const elenchiLunghi = elenchi.filter((t) => t.titolo.length > TITOLO_MAX).map((t) => `${t.percorso} (${t.titolo.length})`);
  ok("elenchi per città: il titolo sta in 65 caratteri", elenchi.length > 40 && elenchiLunghi.length === 0, `${elenchi.length} elenchi; ${elenchiLunghi.slice(0, 3).join(" ")}`);
  // Chi supera i 65 col nome del sito in coda esce senza: il nome del sito non deve allungare un titolo già lungo.
  const conCoda = teste.filter((t) => t.titolo.length > TITOLO_MAX && / — Giocamizi$/.test(t.titolo) && !t.percorso.startsWith("/natale")).map((t) => `${t.percorso} (${t.titolo.length})`);
  ok("titoli: nelle pagine con la regola nuova il nome del sito non allunga un titolo già lungo", conCoda.length <= 12, `${conCoda.length} pagine, es. ${conCoda.slice(0, 3).join(" ")}`);
  const oltre70 = teste.filter((t) => t.titolo.length > 70);
  ok("titoli: oltre i 70 caratteri resta meno del 6% delle pagine", oltre70.length < teste.length * 0.06, `${oltre70.length} su ${teste.length}`);
}

// 3-quater. «Leggi anche»: le guide gemelle si linkano tra loro (dal 20/11/2026).
{
  const { readFileSync } = await import("node:fs");
  const sorgente = readFileSync("lib/contenuti/guide.ts", "utf8");
  const mappa = sorgente.split("const LEGGI_ANCHE")[1].split("};")[0];
  const coppie = [...mappa.matchAll(/"([a-z0-9-]+)": \[([^\]]*)\]/g)].flatMap((m) => [...m[2].matchAll(/"([a-z0-9-]+)"/g)].map((x) => [m[1], x[1]]));
  const inSitemap = new Set(locs.map((l) => new URL(l).pathname));
  const sconosciute = coppie.flat().filter((slug) => !inSitemap.has(`/guide/${slug}`));
  const mancanti = [];
  for (const [da, a] of coppie) {
    const html = await testo(`/guide/${da}`);
    const leggiAnche = html.split("Leggi anche")[1] ?? "";
    if (!leggiAnche.includes(`href="/guide/${a}"`)) mancanti.push(`${da} → ${a}`);
  }
  ok("guide: quelle sullo stesso tema si linkano in «Leggi anche»", coppie.length >= 10 && sconosciute.length === 0 && mancanti.length === 0,
    `${coppie.length} coppie; sconosciute: ${[...new Set(sconosciute)].join(", ")}; mancanti: ${mancanti.slice(0, 4).join(" | ")}`);
}

// 3-bis. I dati strutturati di ogni pagina (dal 04/11/2026, scripts/verifica/jsonld.mjs):
// JSON leggibile, tipi schema.org veri, FAQ complete e VISIBILI nella pagina,
// una sola FAQPage, briciole dalla Home con indirizzi sul dominio, Article
// con titolo, data, autrice e immagine.
ok("dati strutturati validi su ogni pagina", strutturati.length === 0,
  strutturati.length ? `${strutturati.length} problemi, es. ${strutturati.slice(0, 3).join(" | ")}` : `${locs.length} pagine`);
// La guardia stessa: su una pagina finta piena di errori deve trovarli tutti.
const finta = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Domanda che non c'è nella pagina?","acceptedAnswer":{"@type":"Answer","text":"x"}}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Giochi","item":"https://altro.it/giochi"}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Articolo"}</script><p>niente</p>`;
const trovati = validaJsonLd(finta, "/prova").problemi.join(" | ");
ok("la guardia dei dati strutturati scatta sugli errori",
  ["FAQ non visibile", "FAQPage senza domande", "2 FAQPage", "meno di 2 voci", "fuori dominio", "tipo sconosciuto «Articolo»"].every((t) => trovati.includes(t)), trovati.slice(0, 120));
const copertina = await fetch(`${BASE}/guide/tabelline-senza-lacrime/copertina.png`);
ok("guida: la copertina dell'Article risponde (PNG)", copertina.ok && copertina.headers.get("content-type")?.includes("image/png"));

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

// 6. Le ricerche già lavorate dal SEO manager (content/seo/parole-chiave.json,
// stato «fatto») hanno ancora le loro parole nel titolo o nell'H1 della pagina:
// un titolo riscritto per sbaglio non deve buttare via il lavoro (23/11/2026).
const copertura = spawnSync("node", ["scripts/seo-copertura.mjs", "--controlla"], { encoding: "utf8" });
ok("parole chiave fatte ancora al loro posto", copertura.status === 0, (copertura.stdout + copertura.stderr).trim().split("\n").slice(-3).join(" · "));

if (servito) process.kill(-servito.pid);
process.exit(chiudi("seo") ? 0 : 1);
