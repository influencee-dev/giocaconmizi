// Il cancello prima della pubblicazione automatica degli articoli approfonditi.
//
//   node scripts/articoli/controlla.mjs <slug>          un articolo
//   node scripts/articoli/controlla.mjs --tutti         tutti i content/guide/*.md
//   aggiungi --rete per aprire davvero i link delle fonti
//
// Esce con codice 1 se c'è anche un solo ERRORE: la routine in quel caso NON
// pubblica, lascia l'articolo in bozza e scrive nel report cosa manca.
// Gli AVVISI non bloccano ma finiscono nel report.
// Regole: docs/routine-articoli.md e .claude/skills/giorgia-authentic-voice.
import fs from "node:fs";
import path from "node:path";
import { CARTELLA, leggiArticolo, tuttiGliArticoli } from "./compila.mjs";

const RADICE = path.resolve(CARTELLA, "../..");
const leggi = (f) => fs.readFileSync(path.join(RADICE, f), "utf8");

const MINIMO_CARATTERI = 27000;
const MINIMO_FONTI = 6;
const VOCI = ["pratica", "personale", "spontanea"];
const CATEGORIE = ["guide-giochi", "confronti", "sicurezza-digitale", "tavolo-offline", "famiglia-abitudini", "mamme-imprenditrici", "feste-compleanni", "fuori-casa", "stagionali", "rubrica"];
const SKILL = leggi("games/registry.ts").match(/export type Skill =([^;]+);/)[1].match(/"([a-z]+)"/g).map((s) => s.slice(1, -1));
const GIOCHI_LIVE = [...leggi("games/registry.ts").matchAll(/slug: "([a-z0-9-]+)"[^\n]*status: "live"/g)].map((m) => m[1]);
const GUIDE_BREVI = [...leggi("lib/guide.ts").matchAll(/^    slug: "([a-z0-9-]+)"/gm)].map((m) => m[1]);

// Dalla skill giorgia-authentic-voice, «Parole e formule da limitare».
const FORMULE_VIETATE = [
  /care mamme/i, /super ?mamme/i, /mamme guerriere/i, /magia della maternit/i,
  /ogni bambino è un piccolo universo/i, /viaggio meraviglioso/i, /segreti che cambieranno/i,
  /devi solo crederci/i, /^come mamma e imprenditrice/im,
];
// Artifici tipici della scrittura AI: non bloccano, si segnalano.
const ARTIFICI_AI = [
  /in un mondo (sempre più|in cui)/i, /in conclusione,/i, /non è solo .{3,40}, è /i, /nel panorama/i,
  /immergiti/i, /scopriamo insieme/i, /senza ulteriori indugi/i, /\bfondamentale\b.*\bfondamentale\b/is,
];
// Segni di esperienza personale o familiare: servono materiali autentici di Giorgia.
const SEGNI_PERSONALI =
  /\b(Domi|Dodò|Domiziana|mia figlia|mio marito|a casa nostra|nella nostra famiglia|da noi a casa|ho provato|abbiamo provato|ho testato|abbiamo testato|ho giocato|abbiamo giocato|mi ha detto|mi ha chiesto)\b/i;
// Mizi è SOLO la pinguina: mai la figlia.
const MIZI_COME_FIGLIA = /\bMizi\b[^.\n]{0,40}\b(mia figlia|ha \d+ anni|a scuola|mi ha detto|mi ha chiesto|la sua maestra)\b/i;
const SEGNAPOSTO = /(TODO|DA COMPLETARE|DA VERIFICARE|NON VERIFICATO|lorem ipsum|\[\[|XXX)/;
const MARCHI_DI_CASA = /\b(Deebrain|Influencee|Partidea|Socialee|Myndo)\b/;

function controlla(a, { rete }) {
  const errori = [];
  const avvisi = [];
  const d = a.dati;
  const g = a.guida;
  const ap = g.approfondimento;
  const nome = path.basename(a.file, ".md");
  const corpo = a.corpo;
  const tutto = `${corpo}\n${g.rispostaBreve ?? ""}\n${(g.faq ?? []).map((f) => `${f.domanda} ${f.risposta}`).join("\n")}`;

  // 1. Dati obbligatori
  for (const k of ["slug", "titolo", "titoloBreve", "descrizione", "rispostaBreve", "etaMin", "etaMax", "skill", "voce", "categoria", "keyword", "stato", "aggiornata", "foto"])
    if (d[k] === undefined || d[k] === null || d[k] === "") errori.push(`manca «${k}» nei dati in testa`);
  if (d.slug && d.slug !== nome) errori.push(`slug «${d.slug}» diverso dal nome del file «${nome}»`);
  if (d.voce && !VOCI.includes(d.voce)) errori.push(`voce «${d.voce}» non valida (${VOCI.join(", ")})`);
  if (d.categoria && !CATEGORIE.includes(d.categoria)) errori.push(`categoria «${d.categoria}» non valida`);
  if (d.skill && !SKILL.includes(d.skill)) errori.push(`skill «${d.skill}» non valida (${SKILL.join(", ")})`);
  if (d.stato && !["bozza", "pubblicata"].includes(d.stato)) errori.push(`stato «${d.stato}» non valido (bozza | pubblicata)`);
  if (!(d.etaMin >= 3 && d.etaMax <= 14 && d.etaMin <= d.etaMax)) errori.push("fascia d'età non valida (3–14, min ≤ max)");
  if (d.foto && (!d.foto.scena || !d.foto.alt)) errori.push("foto: servono «scena» e «alt» (scheda per la foto di testata)");
  if (d.descrizione && d.descrizione.length > 165) avvisi.push(`descrizione lunga ${d.descrizione.length} caratteri (meglio ≤ 160)`);
  if ((d.titoloSeo ?? d.titolo ?? "").length > 70) avvisi.push("titolo SEO oltre 70 caratteri: mettine uno corto in «titoloSeo»");
  if (GUIDE_BREVI.includes(d.slug) && !d.aggiornaGuidaBreve) errori.push(`esiste già la guida breve «${d.slug}»: per sostituirla serve «aggiornaGuidaBreve: true»`);

  // 2. Lunghezza (solo registro pratico: personale e spontaneo vanno a pensiero completo)
  if (d.voce === "pratica" && ap.caratteri < MINIMO_CARATTERI)
    errori.push(`corpo di ${ap.caratteri.toLocaleString("it-IT")} caratteri: ne servono almeno ${MINIMO_CARATTERI.toLocaleString("it-IT")} (senza riempitivi)`);

  // 3. Struttura
  if (/^# /m.test(corpo)) errori.push("il corpo ha un H1: l'unico H1 è il titolo (usa ## e ###)");
  if (ap.indice.length < (d.voce === "pratica" ? 6 : 1)) errori.push(`solo ${ap.indice.length} sezioni H2`);
  if (d.voce === "pratica" && (g.faq ?? []).length < 4) errori.push("servono almeno 4 FAQ");
  if (d.voce === "pratica" && (ap.schedaRapida ?? []).length < 4) errori.push("serve la scheda rapida (almeno 4 voci)");
  const tabelle = (ap.html.match(/<table>/g) ?? []).length;
  const viz = (corpo.match(/^```(grafico|matrice)\s*$/gm) ?? []).length;
  if (d.categoria === "confronti") {
    if (tabelle < 5) errori.push(`confronto con ${tabelle} tabelle: ne servono 5 (caratteristiche, prezzi, controlli, plus/minus, scelta per età)`);
    if (viz < 2) errori.push(`confronto con ${viz} visualizzazioni: ne servono almeno 2 (blocchi grafico/matrice)`);
  } else if (d.voce === "pratica" && tabelle + viz < 2) {
    errori.push("servono almeno 2 tra tabelle e visualizzazioni");
  }

  // 4. Fonti
  const fonti = ap.fonti ?? [];
  if (d.voce === "pratica" && fonti.length < MINIMO_FONTI) errori.push(`${fonti.length} fonti: ne servono almeno ${MINIMO_FONTI}`);
  if (fonti.length && !ap.fontiVerificateIl) errori.push("manca «fontiVerificateIl»");
  for (const f of fonti) {
    if (!f.titolo || !/^https:\/\//.test(f.url ?? "")) errori.push(`fonte senza titolo o senza URL https: ${f.url ?? "?"}`);
    if (!f.consultata) errori.push(`fonte senza data di consultazione: ${f.url}`);
  }
  if (new Set(fonti.map((f) => f.url)).size !== fonti.length) errori.push("fonti ripetute");

  // 5. Prezzi datati
  if (/\d+([.,]\d+)?\s?(€|euro\b)|€\s?\d/i.test(tutto) && !ap.prezziVerificatiIl)
    errori.push("ci sono prezzi ma manca «prezziVerificatiIl» (data della verifica)");

  // 6. Immagini: solo autorizzate, niente hotlink
  const immaginiCorpo = [...corpo.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]);
  for (const src of immaginiCorpo) {
    if (/^https?:/.test(src)) errori.push(`immagine esterna (hotlink) non ammessa: ${src}`);
    const scheda = (ap.immagini ?? []).find((i) => i.file === src);
    if (!scheda) errori.push(`immagine senza scheda (origine, licenza) in «immagini»: ${src}`);
    else if (!scheda.origine || !scheda.licenza || !scheda.alt) errori.push(`immagine con scheda incompleta: ${src}`);
    if (src.startsWith("/") && !fs.existsSync(path.join(RADICE, "public", src))) errori.push(`immagine che non esiste in public/: ${src}`);
  }
  if (d.voce === "pratica" && immaginiCorpo.length + viz < 2) errori.push("servono almeno 2 tra immagini autorizzate e visualizzazioni originali");

  // 7. Autenticità (skill giorgia-authentic-voice)
  const personale = tutto.match(SEGNI_PERSONALI);
  const esperienze = d.esperienzeAutentiche ?? [];
  if (personale && !esperienze.length)
    errori.push(`esperienza personale/familiare («${personale[0]}») senza materiale autentico di Giorgia in «esperienzeAutentiche»: blocco`);
  for (const e of esperienze) if (!e.fonte || !e.data) errori.push("ogni esperienza autentica vuole «fonte» (es. vocale, messaggio) e «data»");
  const comeFiglia = tutto.match(MIZI_COME_FIGLIA);
  if (comeFiglia) errori.push(`Mizi usata come se fosse la figlia («${comeFiglia[0]}»): Mizi è solo la pinguina`);
  for (const re of FORMULE_VIETATE) {
    const m = tutto.match(re);
    if (m) errori.push(`formula da evitare (voce di Giorgia): «${m[0]}»`);
  }
  for (const re of ARTIFICI_AI) {
    const m = tutto.match(re);
    if (m) avvisi.push(`artificio da scrittura AI: «${m[0].slice(0, 60)}»`);
  }
  const segnaposto = tutto.match(SEGNAPOSTO);
  if (segnaposto) errori.push(`segnaposto rimasto nel testo: «${segnaposto[0]}»`);

  // 8. Rapporti commerciali
  const marchio = tutto.match(MARCHI_DI_CASA);
  if (marchio && d.categoria !== "mamme-imprenditrici" && d.categoria !== "rubrica")
    errori.push(`«${marchio[0]}» citato fuori dagli articoli su lavoro e impresa`);
  if (marchio && !ap.relazioniCommerciali) errori.push(`«${marchio[0]}» citato: dichiara il rapporto in «relazioniCommerciali»`);

  // 9. Link interni e giochi collegati
  for (const s of g.giochi ?? []) if (!GIOCHI_LIVE.includes(s)) errori.push(`gioco collegato inesistente o non live: ${s}`);
  const guideNote = new Set([...GUIDE_BREVI, ...tuttiGliArticoli().filter((x) => x.dati.stato === "pubblicata" || x.dati.slug === d.slug).map((x) => x.dati.slug)]);
  for (const [, tipo, s] of tutto.matchAll(/\]\(\/(guide|giochi)\/([a-z0-9-]+)/g)) {
    if (tipo === "guide" && !guideNote.has(s)) errori.push(`link a una guida che non esiste (o è in bozza): /guide/${s}`);
    if (tipo === "giochi" && !GIOCHI_LIVE.includes(s)) errori.push(`link a un gioco che non esiste: /giochi/${s}`);
  }

  return { errori, avvisi, fonti, rete };
}

async function controllaRete(fonti) {
  const errori = [];
  const avvisi = [];
  let nonAperte = 0;
  await Promise.all(
    fonti.map(async (f) => {
      try {
        const r = await fetch(f.url, {
          redirect: "follow",
          signal: AbortSignal.timeout(20000),
          headers: { "user-agent": "Mozilla/5.0 (compatible; GiocamiziVerificaFonti/1.0)", accept: "text/html,*/*" },
        });
        if (r.status === 404 || r.status === 410) errori.push(`fonte non trovata (${r.status}): ${f.url}`);
        else if (r.status >= 400) {
          nonAperte++;
          avvisi.push(`fonte risponde ${r.status} (spesso è un blocco anti-robot: controllala a mano): ${f.url}`);
        }
      } catch (e) {
        nonAperte++;
        avvisi.push(`fonte non raggiungibile ora (${e.name}): ${f.url}`);
      }
    }),
  );
  // Se una parte importante delle fonti non si apre, le fonti non sono
  // verificate: di solito è la rete della sessione che blocca i siti. Si
  // pubblica solo con fonti aperte davvero (regola del 7/11, rinforzata l'11/11
  // dopo un articolo uscito con fonti viste solo nei risultati di ricerca).
  if (fonti.length && nonAperte / fonti.length > 0.25)
    errori.push(
      `${nonAperte} fonti su ${fonti.length} non si aprono: non sono verificate. Se è la rete della sessione che blocca i siti, niente pubblicazione oggi.`,
    );
  return { errori, avvisi };
}

const args = process.argv.slice(2);
const rete = args.includes("--rete");
const slug = args.find((x) => !x.startsWith("--"));
const articoli = args.includes("--tutti")
  ? tuttiGliArticoli()
  : slug
    ? [leggiArticolo(path.join(CARTELLA, `${slug}.md`))]
    : (console.error("Uso: controlla.mjs <slug> | --tutti [--rete]"), process.exit(2));

let falliti = 0;
for (const a of articoli) {
  const r = controlla(a, { rete });
  if (!rete) r.avvisi.push("controllo senza --rete: i link delle fonti non sono stati aperti, non pubblicare così");
  if (rete) {
    const n = await controllaRete(r.fonti);
    r.errori.push(...n.errori);
    r.avvisi.push(...n.avvisi);
  }
  const ap = a.guida.approfondimento;
  console.log(`\n${r.errori.length ? "BLOCCATO" : "OK"} · ${a.dati.slug} · ${a.dati.stato} · ${ap.caratteri.toLocaleString("it-IT")} caratteri · ${ap.fonti.length} fonti · ${ap.indice.length} sezioni`);
  for (const e of r.errori) console.log(`  ERRORE  ${e}`);
  for (const w of r.avvisi) console.log(`  avviso  ${w}`);
  if (r.errori.length) falliti++;
}
if (falliti) {
  console.error(`\narticoli: ${falliti} da sistemare prima di pubblicare`);
  process.exit(1);
}
