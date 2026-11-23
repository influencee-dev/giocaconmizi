// Il percorso per i genitori «Che genitore diventi quando sei sotto pressione?»
// (lib/famiglia/sotto-pressione.ts). Dal telefono si controlla che:
// - finché è una bozza resti fuori da Google, dalla sitemap e dal sito;
// - le 45 domande siano bilanciate (7 per spinta con 2 rovesciate, 6 reazioni
//   per spinta nelle situazioni) e il punteggio sia quello del conto dichiarato;
// - le risposte NON lascino il browser, si riprendano dopo un ricarico e si
//   cancellino davvero.
import { readFileSync } from "node:fs";
import { apriBrowser, conServer, contatore, BASE } from "./comune.mjs";

const servito = await conServer();
const { ok, chiudi } = contatore();
const PERCORSO = "/genitori/sotto-pressione";
const CHIAVE = "giocamizi-percorso-genitori";
const SPINTE = ["sbrigati", "perfetto", "compiaci", "sforzati", "forte"];
const sorgente = readFileSync("lib/famiglia/sotto-pressione.ts", "utf8");
const pubblico = /PERCORSO_PUBBLICO = true/.test(sorgente);

// 1. La pagina risponde; da bozza è fuori da Google e nessuno la collega.
const risposta = await fetch(BASE + PERCORSO);
const html = await risposta.text();
ok("pagina: risponde 200 con un solo H1", risposta.status === 200 && (html.match(/<h1/g) ?? []).length === 1);
const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
if (pubblico) {
  ok("pubblica: indicizzabile e in sitemap", !noindex && sitemap.includes(PERCORSO));
  // il richiamo «E tu che tipo di mamma sei?» porta al test da «Per le mamme» e dalle guide
  const richiami = await Promise.all(["/per-le-mamme", "/guide"].map((x) => fetch(BASE + x).then((r) => r.text())));
  ok("pubblica: «Per le mamme» e le guide invitano al test", richiami.every((t) => t.includes("data-invito-test") && t.includes(`href="${PERCORSO}"`)));
  ok("pubblica: titolo per Google e social che invoglia, e il tasto condividi in cima",
    /<title>E tu che mamma diventi sotto pressione\?/.test(html) && /property="og:title" content="E tu che mamma/.test(html) && html.includes("data-condividi-test"));
} else {
  ok("bozza: noindex e fuori dalla sitemap", noindex && !sitemap.includes(PERCORSO));
  const altre = await Promise.all(["/", "/guide", "/per-le-mamme", "/chi-siamo", "/llms.txt"].map((p) => fetch(BASE + p).then((r) => r.text())));
  ok("bozza: nessuna pagina del sito la collega", altre.every((t) => !t.includes(PERCORSO)));
}
// Il tasto «Condividi» comune (components/condivisione/Condividi.tsx) e l'anteprima disegnata
// stanno su articoli, giochi e schede delle attività (decisione del 23/11/2026).
for (const [x, campagna] of [["/guide/imparare-a-leggere-giocando", "guida"], ["/giochi/tabelline", "gioco"], ["/ludoteche/milano/il-nano-gigante", "attivita"]]) {
  const t = await fetch(BASE + x).then((r) => r.text());
  const og = t.match(/property="og:image" content="https?:\/\/[^/"]+([^"]+)"/)?.[1];
  const img = og ? await fetch(BASE + og.replaceAll("&amp;", "&")) : null;
  ok(`condividi su ${x}: tasto e anteprima disegnata`, t.includes(`data-condividi="${campagna}"`) && img?.status === 200 && img.headers.get("content-type") === "image/png");
}
ok("pagina: dice che non è una diagnosi e che le risposte restano nel browser", html.includes("Non è una diagnosi") && html.includes("restano nel tuo browser"));
ok("codice: il questionario ESQ-R-I non è copiato (solo citato nelle regole)", (sorgente.match(/ESQ-R-I/g) ?? []).length === 1);

const b = await apriBrowser();
const telefono = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const UMANO = () => localStorage.setItem("mizi.consenso-statistiche", "no");

/**
 * Apre la pagina e tiene il conto di tutto ciò che parte verso la rete.
 * L'iscrizione (/api/brevo) non arriva a Brevo: risponde la prova con `esitoBrevo`
 * e il corpo inviato finisce in `moduli`, per controllare che non porti le risposte.
 */
async function apri(opzioni = telefono, esitoBrevo = 200) {
  const ctx = await b.newContext(opzioni);
  await ctx.addInitScript(UMANO);
  const p = await ctx.newPage();
  const invii = [];
  const moduli = [];
  await p.route("**/api/brevo", (r) => {
    moduli.push(JSON.parse(r.request().postData() ?? "{}"));
    return r.fulfill({ status: esitoBrevo, contentType: "application/json", body: JSON.stringify({ ok: esitoBrevo === 200 }) });
  });
  p.on("request", (r) => {
    if (r.method() !== "GET") invii.push(`${r.method()} ${r.url()}`);
  });
  await p.goto(BASE + PERCORSO, { waitUntil: "networkidle" });
  return { ctx, p, invii, moduli };
}

/** Il modulo prima del profilo: lo compila con dati finti e lo manda. */
async function lasciaDati(p) {
  const m = p.locator("[data-modulo-dati]");
  await m.locator("input[name=nome]").fill("Anna");
  await m.locator("input[name=cognome]").fill("Prova");
  await m.locator("input[name=email]").fill("anna.prova@esempio.it");
  await m.locator("select[name=eta]").selectOption({ index: 2 });
  await m.locator("input[name=citta]").fill("Milano");
  await m.locator("select[name=etaFiglio]").selectOption("6");
  await m.locator("input[name=consenso]").check();
  await m.locator("[data-vedi-profilo]").tap();
  await p.locator("[data-risultato]").waitFor({ timeout: 5000 }).catch(() => null);
}

const stato = (p) => p.locator("[data-percorso]").evaluate((e) => ({ fase: e.dataset.fase, indice: Number(e.dataset.indice) }));

/** Legge la domanda sullo schermo. */
const domanda = (p) =>
  p.locator("[data-domanda]").evaluate((e) => ({
    id: e.dataset.domanda,
    spinta: e.dataset.spinta,
    rovescio: e.dataset.rovescio === "si",
    versi: [...document.querySelectorAll("[data-percorso] [role=radio]")].map((r) => r.dataset.verso ?? null),
  }));

/** Tocca una risposta e aspetta che lo schermo passi avanti da solo. */
async function tocca(p, valore) {
  const prima = await stato(p);
  await p.locator(`[data-percorso] [role=radio][data-valore="${valore}"]`).tap();
  await p.waitForFunction(
    (x) => {
      const e = document.querySelector("[data-percorso]");
      return e.dataset.fase !== "domande" || Number(e.dataset.indice) !== x;
    },
    prima.indice,
    { timeout: 4000 },
  );
}

/**
 * Compila tutto il percorso. `scegli(d)` riceve la domanda e restituisce il
 * valore da toccare. Restituisce le domande viste e le risposte date.
 */
async function compila(p, scegli, fino = 45) {
  const viste = [];
  for (let i = 0; i < fino; i++) {
    const d = await domanda(p);
    const valore = scegli(d);
    viste.push({ ...d, valore });
    await tocca(p, valore);
  }
  return viste;
}

/** Il conto dichiarato nella pagina, rifatto qui in modo indipendente. */
function attesi(viste) {
  const somme = Object.fromEntries(SPINTE.map((k) => [k, 0]));
  for (const d of viste) if (d.spinta) somme[d.spinta] += d.rovescio ? 6 - d.valore : d.valore;
  return Object.fromEntries(SPINTE.map((k) => [k, Math.round(((somme[k] - 7) / 28) * 100)]));
}

const barre = (p) =>
  p.locator("[data-barra]").evaluateAll((e) => Object.fromEntries(e.map((x) => [x.dataset.barra, { punti: Number(x.dataset.punteggio), livello: x.dataset.livello }])));
const risultato = (p) => p.locator("[data-risultato]").evaluate((e) => ({ ...e.dataset }));

// 2. Tutto su «Sbrigati»: la spinta va a 100, le altre a 0.
{
  const { ctx, p, invii, moduli } = await apri();
  ok("inizio: spiega durata, niente risposte giuste, risposte sul dispositivo",
    await p.locator("[data-percorso]").evaluate((e) => /45 domande/.test(e.textContent) && /Non esistono risposte giuste/.test(e.textContent) && /restano su questo dispositivo/.test(e.textContent)));
  await p.locator("[data-comincia]").tap();
  ok("si parte dalla domanda 1 di 45", (await p.locator("[data-conto]").textContent())?.trim() === "Domanda 1 di 45");
  const misure = await p.locator("[data-percorso] [role=radio]").evaluateAll((e) => e.map((x) => x.getBoundingClientRect().height));
  ok("le risposte sono bottoni grandi (almeno 48 px)", misure.length === 5 && misure.every((h) => h >= 48), misure.join(","));
  const viste = await compila(p, (d) =>
    d.spinta ? ((d.spinta === "sbrigati") !== d.rovescio ? 5 : 1) : d.versi.indexOf("sbrigati") >= 0 ? d.versi.indexOf("sbrigati") : d.versi.indexOf("calma"));

  const affermazioni = viste.filter((d) => d.spinta);
  const situazioni = viste.filter((d) => !d.spinta);
  ok("35 affermazioni e 10 situazioni, ognuna una volta sola", affermazioni.length === 35 && situazioni.length === 10 && new Set(viste.map((d) => d.id)).size === 45);
  ok("7 affermazioni per spinta, di cui 2 rovesciate",
    SPINTE.every((k) => affermazioni.filter((d) => d.spinta === k).length === 7 && affermazioni.filter((d) => d.spinta === k && d.rovescio).length === 2));
  ok("due affermazioni della stessa spinta non si seguono mai", affermazioni.every((d, i) => i === 0 || d.spinta !== affermazioni[i - 1].spinta));
  const versi = situazioni.flatMap((d) => d.versi);
  ok("situazioni: 4 scelte, una pensata, 6 reazioni per spinta",
    situazioni.every((d) => d.versi.length === 4 && d.versi.filter((v) => v === "calma").length === 1) && SPINTE.every((k) => versi.filter((v) => v === k).length === 6));
  ok("situazioni: la risposta pensata cambia posto", new Set(situazioni.map((d) => d.versi.indexOf("calma"))).size >= 3);

  // prima del profilo: il modulo con i dati (decisione di Giorgia del 23/11/2026)
  ok("dopo l'ultima domanda arriva il modulo, non ancora il profilo", (await stato(p)).fase === "dati" && (await p.locator("[data-risultato]").count()) === 0);
  const campi = await p.locator("[data-modulo-dati] [name]").evaluateAll((e) => e.map((x) => x.getAttribute("name")));
  ok("modulo: nome, cognome, email, età, città, età del figlio e consenso",
    ["nome", "cognome", "email", "eta", "citta", "etaFiglio", "consenso"].every((n) => campi.includes(n)));
  ok("modulo: il consenso non è spuntato in partenza", !(await p.locator("[data-modulo-dati] input[name=consenso]").isChecked()));
  const altezze = await p.locator("[data-modulo-dati] input:not([type=checkbox]):not([tabindex='-1']), [data-modulo-dati] select, [data-vedi-profilo]").evaluateAll((e) => e.map((x) => x.getBoundingClientRect().height));
  ok("modulo: campi e bottone grandi da toccare (almeno 48 px)", altezze.length === 7 && altezze.every((h) => h >= 48), altezze.join(","));
  ok("nessuno sbordo sul modulo (390 px)", await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await lasciaDati(p);
  ok("mandati i dati, si arriva al profilo", (await stato(p)).fase === "risultato");
  const [modulo] = moduli;
  ok("al server va solo il modulo: dati, origine «test-sotto-pressione», consenso",
    moduli.length === 1 && modulo.origine === "test-sotto-pressione" && modulo.consenso === true && modulo.cognome === "Prova" && modulo.etaFiglio === 6 && modulo.citta === "Milano");
  ok("nel modulo non c'è niente delle risposte né del profilo",
    Object.keys(modulo).every((k) => ["azione", "email", "nomeGenitore", "cognome", "etaGenitore", "citta", "etaFiglio", "origine", "consenso", "maggiorenne", "sito"].includes(k)) &&
    !/sbrigati|perfetto|compiaci|sforzati|forte|risposte|punteggi/i.test(JSON.stringify(modulo)));
  const bar = await barre(p);
  const conto = attesi(viste);
  ok("il punteggio è il conto dichiarato (somma delle 7 risposte, da 0 a 100)", SPINTE.every((k) => bar[k]?.punti === conto[k]), JSON.stringify(bar));
  ok("Sbrigati a 100 «alta», le altre a 0 «bassa»", bar.sbrigati.punti === 100 && bar.sbrigati.livello === "alta" && SPINTE.filter((k) => k !== "sbrigati").every((k) => bar[k].punti === 0 && bar[k].livello === "bassa"));
  const ris = await risultato(p);
  ok("lettura: una sola spinta principale, 6 reazioni di fretta e 4 risposte pensate", ris.principali === "sbrigati" && ris.sottoPressione === "sbrigati" && ris.calma === "4");
  const scheda = p.locator('article[data-scheda="sbrigati"]');
  const testoScheda = (await scheda.textContent()) ?? "";
  ok("scheda: risorsa, pressione, figli, frase ed esercizio", ["Che cosa ti dà.", "Sotto pressione.", "Con i figli.", "La frase da ricordarti:", "Un esercizio."].every((t) => testoScheda.includes(t)));
  ok("le letture parlano con «può», mai con una sentenza", /può|potrebbe/.test(testoScheda) && !/\b(sei un genitore|il tuo problema)\b/i.test(testoScheda));
  ok("le altre quattro spinte restano leggibili, chiuse", (await p.locator("details[data-scheda]").count()) === 4);
  ok("nessuno sbordo sul profilo (390 px)", await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));

  // i collegamenti portano a pagine vere e hanno il titolo della pagina, non l'indirizzo
  const link = await p.locator("[data-scheda] a").evaluateAll((e) => e.map((x) => ({ href: x.getAttribute("href"), testo: x.textContent.trim() })));
  const unici = [...new Map(link.map((l) => [l.href, l])).values()];
  const stati = await Promise.all(unici.map((l) => fetch(BASE + l.href).then((r) => r.status)));
  ok("i collegamenti «Su Giocamizi» rispondono 200 e hanno un titolo", unici.length >= 10 && stati.every((s) => s === 200) && unici.every((l) => l.testo && !l.testo.startsWith("/")), unici.map((l, i) => `${l.href}:${stati[i]}`).filter((_, i) => stati[i] !== 200).join(" "));

  // condividere: nel messaggio solo l'invito e l'indirizzo, mai il risultato
  ok("profilo: c'è il tasto per condividere il test", (await p.locator("[data-risultato] [data-condividi-test] button").count()) === 1);
  await p.evaluate(() => { Object.defineProperty(navigator, "share", { value: undefined, configurable: true }); });
  await p.locator("[data-risultato] [data-condividi-test] button").first().tap();
  const voci = await p.locator("[data-risultato] [data-condividi-voci] a").evaluateAll((e) => e.map((x) => x.getAttribute("href")));
  const wa = decodeURIComponent(voci.find((h) => h.startsWith("https://wa.me/")) ?? "");
  ok("condividi: WhatsApp, Facebook, Telegram ed email, con l'invito e il link al test", voci.length === 4 && wa.includes("che tipo di mamma") && wa.includes(`giocamizi.it${PERCORSO}`));
  ok("condividi: nel messaggio non c'è il risultato di chi ha compilato", !/sbrigati|\/100|spinta/i.test(voci.map(decodeURIComponent).join(" ")));
  ok("nessuna risposta lascia il browser: l'unico invio è il modulo", invii.length === 1 && invii[0].startsWith("POST ") && invii[0].endsWith("/api/brevo"), invii.join(" | "));

  // 3. Ricaricando si ritrova il profilo; «Cancella» lo toglie davvero.
  await p.reload({ waitUntil: "networkidle" });
  await p.locator("[data-risultato]").waitFor({ timeout: 4000 }).catch(() => null);
  ok("ricaricando la pagina il profilo c'è ancora", (await stato(p)).fase === "risultato" && (await barre(p)).sbrigati?.punti === 100);
  await p.locator("[data-cancella]").tap();
  ok("«Cancella le mie risposte»: si torna all'inizio e la memoria è vuota", (await stato(p)).fase === "inizio" && (await p.evaluate((k) => sessionStorage.getItem(k), CHIAVE)) === null);
  ok("niente finisce in localStorage", await p.evaluate(() => Object.keys(localStorage).every((k) => !k.includes("percorso"))));
  await ctx.close();
}

// 4. Tutto «A volte» e sempre la risposta pensata: cinque spinte alla pari, nessuna guida.
{
  const { ctx, p } = await apri({ ...telefono, viewport: { width: 320, height: 640 } }, 502);
  await p.locator("[data-comincia]").tap();
  ok("nessuno sbordo sulla domanda (320 px)", await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await compila(p, (d) => (d.spinta ? 3 : d.versi.indexOf("calma")), 12);

  // a metà: si ricarica e si riprende dallo stesso punto
  await p.reload({ waitUntil: "networkidle" });
  await p.locator("[data-riprendi]").waitFor({ timeout: 4000 }).catch(() => null);
  ok("a metà: ricaricando propone di riprendere dalla domanda 13", ((await p.locator("[data-riprendi]").textContent()) ?? "").includes("13"));
  await p.locator("[data-riprendi]").tap();
  ok("si riprende dalla domanda 13 di 45", (await p.locator("[data-conto]").textContent())?.trim() === "Domanda 13 di 45");

  // «Indietro» mostra la risposta già data e non la perde
  await p.locator("[data-indietro]").tap();
  ok("«Indietro»: la risposta data è ancora accesa", (await p.locator('[data-percorso] [role=radio][aria-checked="true"]').getAttribute("data-valore")) === "3");
  await p.locator("[data-avanti]").tap();
  await compila(p, (d) => (d.spinta ? 3 : d.versi.indexOf("calma")), 33);
  ok("nessuno sbordo sul modulo (320 px)", await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  // senza spunta il profilo non si apre
  await p.locator("[data-modulo-dati] input[name=nome]").fill("Anna");
  await p.locator("[data-vedi-profilo]").tap();
  ok("senza i dati obbligatori il profilo resta chiuso", (await stato(p)).fase === "dati");
  await lasciaDati(p);
  ok("se Brevo non risponde il profilo si apre lo stesso", (await stato(p)).fase === "risultato");

  const bar = await barre(p);
  const ris = await risultato(p);
  ok("tutto «A volte»: cinque spinte a 50, «media»", SPINTE.every((k) => bar[k].punti === 50 && bar[k].livello === "media"));
  ok("cinque alla pari: nessuna spinta viene indicata come principale", ris.principali === "" && ris.allaPari === "si" && (await p.locator("[data-nessuna]").count()) === 1);
  ok("dieci risposte pensate: nessuna reazione d'istinto prevale", ris.calma === "10" && ris.sottoPressione === "" && ((await p.locator("[data-lettura-situazioni]").textContent()) ?? "").includes("10 situazioni su dieci"));
  ok("nessuno sbordo sul profilo (320 px)", await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  await ctx.close();
}

// 5. Due spinte in testa: si leggono insieme, con la frase della coppia.
{
  const { ctx, p } = await apri();
  await p.locator("[data-comincia]").tap();
  const alte = ["perfetto", "forte"];
  await compila(p, (d) => (d.spinta ? (alte.includes(d.spinta) !== d.rovescio ? 5 : 1) : d.versi.indexOf("calma")));
  await lasciaDati(p);
  const ris = await risultato(p);
  ok("due spinte alla pari in testa: tutte e due principali", ris.principali === "perfetto,forte" && ris.allaPari === "no");
  ok("la frase della coppia c'è", ((await p.locator("[data-coppia]").textContent()) ?? "").includes("senza aiuto"));
  ok("due schede aperte e tre chiuse", (await p.locator("article[data-scheda]").count()) === 2 && (await p.locator("details[data-scheda]").count()) === 3);
  await ctx.close();
}

await b.close();
if (servito) process.kill(-servito.pid);
process.exit(chiudi("genitori") ? 0 : 1);
