// Il calendario dei 100 articoli (content/piano-editoriale.json): uno al giorno.
//
//   node scripts/articoli/piano.mjs prossimo        il prossimo argomento da scrivere + possibili doppioni
//   node scripts/articoli/piano.mjs domani          l'argomento DOPO quello di oggi (per prenotarne la foto)
//   node scripts/articoli/piano.mjs stato           quanti fatti, in bozza, bloccati
//   node scripts/articoli/piano.mjs segna <id> <stato> [--slug x] [--motivo "..."]
//        stati: da-fare | bozza | bloccato | pubblicato | sostituito
//
// «prossimo» è idempotente: se un argomento è già in bozza o bloccato, riparte
// da quello invece di aprirne un altro (così rieseguire il job non duplica).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FILE = path.join(RADICE, "content/piano-editoriale.json");
const piano = JSON.parse(fs.readFileSync(FILE, "utf8"));
const oggi = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
const salva = () => {
  piano.aggiornato = oggi;
  fs.writeFileSync(FILE, `${JSON.stringify(piano, null, 2)}\n`);
};

const parole = (t) =>
  new Set(
    t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/)
      .filter((p) => p.length > 3 && !["come", "cosa", "guida", "bambini", "bambino", "genitori", "quale", "per", "della", "delle"].includes(p)),
  );
const somiglianza = (a, b) => {
  const A = parole(a);
  const B = parole(b);
  const comuni = [...A].filter((p) => B.has(p)).length;
  return comuni / Math.max(1, Math.min(A.size, B.size));
};

/** Le pagine già online: guide brevi (lib/guide.ts) e articoli pubblicati. */
function pagineEsistenti() {
  const brevi = [...fs.readFileSync(path.join(RADICE, "lib/guide.ts"), "utf8").matchAll(/^    slug: "([a-z0-9-]+)",\n(?:.*\n){0,2}?    titolo: "([^"]+)"/gm)].map((m) => ({ slug: m[1], titolo: m[2] }));
  const cartella = path.join(RADICE, "content/guide");
  const lunghi = fs.existsSync(cartella)
    ? fs.readdirSync(cartella).filter((f) => f.endsWith(".md")).map((f) => {
        const testo = fs.readFileSync(path.join(cartella, f), "utf8");
        return { slug: f.slice(0, -3), titolo: testo.match(/^titolo: "?(.+?)"?$/m)?.[1] ?? f };
      })
    : [];
  return [...brevi, ...lunghi];
}

const [comando, ...resto] = process.argv.slice(2);

if (comando === "prossimo") {
  const aperto = piano.argomenti.find((a) => a.stato === "bozza" || a.stato === "bloccato");
  const voce = aperto ?? piano.argomenti.filter((a) => a.stato === "da-fare").sort((a, b) => a.ordine - b.ordine)[0];
  if (!voce) {
    console.log("Piano finito: tutti gli argomenti sono pubblicati o sostituiti. Proponi nuovi argomenti a Giorgia.");
    process.exit(0);
  }
  console.log(JSON.stringify(voce, null, 2));
  if (aperto) console.log(`\nATTENZIONE: questo argomento è già «${aperto.stato}»: riprendilo invece di aprirne un altro.`);
  const simili = pagineEsistenti()
    .filter((p) => p.slug !== voce.slug)
    .map((p) => ({ ...p, s: Math.max(somiglianza(voce.titolo, p.titolo), somiglianza(voce.keyword, p.titolo)) }))
    .filter((p) => p.s >= 0.5)
    .sort((a, b) => b.s - a.s);
  if (voce.guidaEsistente) console.log(`\nGuida esistente collegata: /guide/${voce.guidaEsistente} (${voce.azioneGuidaEsistente})`);
  if (simili.length) {
    console.log("\nPagine con un intento forse simile (controlla la cannibalizzazione):");
    for (const p of simili.slice(0, 5)) console.log(`  /guide/${p.slug} — ${p.titolo} (${Math.round(p.s * 100)}%)`);
  }
} else if (comando === "domani") {
  // L'argomento che la routine scriverà DOMANI: il primo «da-fare» dopo quello
  // di oggi (oggi = la bozza/il bloccato aperto, o il primo da-fare).
  const aperto = piano.argomenti.find((a) => a.stato === "bozza" || a.stato === "bloccato");
  const daFare = piano.argomenti.filter((a) => a.stato === "da-fare").sort((a, b) => a.ordine - b.ordine);
  const voce = aperto ? daFare[0] : daFare[1];
  if (!voce) {
    console.log("Nessun argomento per domani: il piano è finito.");
    process.exit(0);
  }
  console.log(JSON.stringify(voce, null, 2));
} else if (comando === "stato") {
  const conta = {};
  for (const a of piano.argomenti) conta[a.stato] = (conta[a.stato] ?? 0) + 1;
  console.log(`Modalità: ${piano.modalita}`);
  console.log(conta);
} else if (comando === "segna") {
  const [id, stato] = resto;
  const STATI = ["da-fare", "bozza", "bloccato", "pubblicato", "sostituito"];
  const voce = piano.argomenti.find((a) => a.id === Number(id));
  if (!voce || !STATI.includes(stato)) {
    console.error(`Uso: segna <id> <${STATI.join("|")}> [--slug x] [--motivo "..."]`);
    process.exit(2);
  }
  const opz = (nome) => {
    const i = resto.indexOf(`--${nome}`);
    return i >= 0 ? resto[i + 1] : undefined;
  };
  voce.stato = stato;
  if (opz("slug")) voce.slug = opz("slug");
  if (stato === "pubblicato") voce.pubblicataIl ??= oggi;
  if (stato === "bozza" || stato === "pubblicato") voce.fontiVerificateIl = oggi;
  if (opz("motivo")) {
    voce.nota = opz("motivo");
    piano.storicoSostituzioni ??= [];
    if (stato === "sostituito") piano.storicoSostituzioni.push({ id: voce.id, data: oggi, motivo: opz("motivo") });
  }
  salva();
  console.log(`#${voce.id} ${voce.slug} → ${stato}`);
} else {
  console.error("Uso: piano.mjs prossimo | domani | stato | segna <id> <stato>");
  process.exit(2);
}
