/**
 * Registro dei contatti delle attività (dal 23/11/2026, richiesta di Giorgia).
 *
 * Per ogni scheda del sito (lib/directory) una riga nel foglio privato su Drive
 * «Registro contatti attività Giocamizi»: link della scheda, sito, email e
 * telefono dell'attività, e la mail già scritta (oggetto e testo) con il link
 * della scheda, la pagina per gestirla e il video che spiega come si fa.
 *
 * I CONTATTI NON STANNO MAI NEL REPO (è pubblico): arrivano da un file JSON
 * fuori dal repo e finiscono solo nel CSV, che si carica su Drive.
 *
 *   npx tsx scripts/registro-contatti.ts --registro <CSV attuale da Drive> \
 *     [--contatti <JSON con id/link, email, telefono…>] --uscita <CSV nuovo>
 *
 * - Le righe già nel registro restano com'erano (anche quello che Giorgia ha
 *   scritto a mano: stato, data di invio, risposta, note). Si riempiono solo
 *   le celle vuote di email, telefono e sito.
 * - Una scheda nuova del sito diventa una riga nuova, con il numero ZO-xxx dopo
 *   l'ultimo e la mail pronta.
 * - Le righe GM- (blog, scuole, associazioni: casella Gmail) restano in fondo.
 * - Non manda niente: le mail le spedisce solo Giorgia, da Zoho.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { SCHEDE, percorsoScheda } from "../lib/directory/directory";

export const SITO = "https://giocamizi.it";
export const PAGINA_GESTIONE = `${SITO}/come-reclamare-la-scheda`;
export const VIDEO_GESTIONE = `${SITO}/tutorial/come-reclamare-la-scheda`;

export const COLONNE = [
  "Rif", "Attività", "Città", "Categoria", "Link scheda", "Sito ufficiale", "Email", "Telefono",
  "Fonte contatto", "Bozza vecchia Zoho (31/10)", "Oggetto email", "Testo email", "Stato",
  "Data invio", "Risposta", "Note",
] as const;
type Riga = Record<(typeof COLONNE)[number], string>;

const arg = (n: string) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

/** CSV con campi tra virgolette e a capo dentro le celle (come lo esporta Google). */
export function leggiCsv(testo: string): string[][] {
  const righe: string[][] = [];
  let riga: string[] = [];
  let cella = "";
  let virgolette = false;
  for (let i = 0; i < testo.length; i++) {
    const c = testo[i];
    if (virgolette) {
      if (c === '"' && testo[i + 1] === '"') { cella += '"'; i++; }
      else if (c === '"') virgolette = false;
      else cella += c;
    } else if (c === '"') virgolette = true;
    else if (c === ",") { riga.push(cella); cella = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && testo[i + 1] === "\n") i++;
      riga.push(cella); cella = "";
      if (riga.some((x) => x !== "")) righe.push(riga);
      riga = [];
    } else cella += c;
  }
  riga.push(cella);
  if (riga.some((x) => x !== "")) righe.push(riga);
  return righe;
}

const csv = (righe: string[][]) =>
  righe.map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n") + "\n";

/** La mail per un'attività: una sola richiesta, i tre link, la nota privacy. */
export function mail(nome: string, citta: string, link: string): { oggetto: string; testo: string } {
  return {
    oggetto: `${nome}, la vostra scheda su Giocamizi è già online`,
    testo: [
      "Ciao,",
      "",
      `sono Giorgia Palazzo. Ho messo ${nome} su Giocamizi, tra i posti per bambini di ${citta}. Questa è la vostra scheda:`,
      link,
      "",
      "Giocamizi l'ho creato quest'estate con mia figlia: giochi educativi gratis e, città per città, i posti dove portare i bambini o fare la festa di compleanno.",
      "",
      "Vi chiedo una cosa sola: aprite la scheda e in fondo toccate «Gestisci la scheda». Lasciate un contatto: dopo un controllo vi arriva un link personale, con cui la correggete e la completate (WhatsApp, orari, pacchetti festa, foto) oppure chiedete di toglierla.",
      "",
      `Come si fa, passo per passo: ${PAGINA_GESTIONE}`,
      `Il video che lo spiega in un minuto e mezzo: ${VIDEO_GESTIONE}`,
      "",
      "Quando la scheda è vostra prende il bollino «Verificata» e le famiglie vi scrivono direttamente. È gratis, senza commissioni.",
      "",
      "Grazie,",
      "Giorgia",
      "",
      "P.S. Se il progetto vi piace, un link a giocamizi.it sul vostro sito o sui social mi aiuta tantissimo.",
      "",
      "—",
      "Perché vi scrivo: nome, zona e descrizione della scheda vengono dal vostro sito ufficiale, dove abbiamo trovato anche questo indirizzo, che usiamo solo per farvi gestire la scheda. Titolare del trattamento è Partidea SRL, che gestisce Giocamizi. Potete opporvi in qualsiasi momento: la scheda viene tolta. Informativa: giocamizi.it/privacy. Se preferite non ricevere altre mie email, mi basta un cenno.",
    ].join("\n"),
  };
}

type Contatto = { id?: number; link?: string; sito?: string; email?: string; telefono?: string; fonte_email?: string; fonte_telefono?: string; nota?: string };

function principale() {
  const pathRegistro = arg("registro");
  const pathUscita = arg("uscita");
  if (!pathRegistro || !pathUscita) {
    console.error("Uso: npx tsx scripts/registro-contatti.ts --registro <csv> [--contatti <json>] --uscita <csv>");
    process.exit(1);
  }
  const vecchio = leggiCsv(readFileSync(pathRegistro, "utf8"));
  const intestazione = vecchio[0] ?? [];
  const nuovoFormato = intestazione.includes("Link scheda");
  const contatti: Contatto[] = arg("contatti") ? JSON.parse(readFileSync(arg("contatti")!, "utf8")) : [];
  const perLink = new Map(contatti.filter((c) => c.link).map((c) => [c.link!, c]));

  // Le schede del sito, nell'ordine del file delle città.
  const schede = SCHEDE.map((s) => ({
    nome: s.nome, citta: s.citta, categoria: s.categoria.nome, link: SITO + percorsoScheda(s), sito: s.sito ?? "",
  }));

  const righe: Riga[] = [];
  const gm: string[][] = [];
  const vuota = (): Riga => Object.fromEntries(COLONNE.map((c) => [c, ""])) as Riga;

  if (nuovoFormato) {
    for (const r of vecchio.slice(1)) {
      if (r[0]?.startsWith("GM-")) { gm.push(r); continue; }
      const riga = vuota();
      intestazione.forEach((c, i) => { if ((COLONNE as readonly string[]).includes(c)) (riga as Record<string, string>)[c] = r[i] ?? ""; });
      righe.push(riga);
    }
  } else {
    // Registro vecchio (12/11/2026): righe ZO- con nome e stato, righe GM- da tenere.
    for (const r of vecchio.slice(1)) if (r[0]?.startsWith("GM-")) gm.push(r);
  }

  const giaDentro = new Set(righe.map((r) => r["Link scheda"]));
  let ultimo = Math.max(0, ...righe.map((r) => Number(r.Rif.replace("ZO-", "")) || 0));
  const vecchieZo = new Map(nuovoFormato ? [] : vecchio.slice(1).filter((r) => r[0]?.startsWith("ZO-")).map((r) => [r[1], r[0]]));
  const usatiZo = new Set<string>();

  for (const s of schede) {
    if (giaDentro.has(s.link)) continue;
    const riga = vuota();
    // Le 81 attività del 31/10 tengono il loro ZO-: una volta sola anche se il nome è doppio.
    const zo = vecchieZo.get(s.nome);
    if (zo && !usatiZo.has(zo)) { riga.Rif = zo; usatiZo.add(zo); riga["Bozza vecchia Zoho (31/10)"] = "sì, testo vecchio senza video: non spedire quella"; }
    riga.Attività = s.nome;
    riga.Città = s.citta;
    riga.Categoria = s.categoria;
    riga["Link scheda"] = s.link;
    riga["Sito ufficiale"] = s.sito;
    const m = mail(s.nome, s.citta, s.link);
    riga["Oggetto email"] = m.oggetto;
    riga["Testo email"] = m.testo;
    righe.push(riga);
    giaDentro.add(s.link);
  }
  ultimo = Math.max(ultimo, ...righe.map((r) => Number(r.Rif.replace("ZO-", "")) || 0));
  for (const r of righe) if (!r.Rif) r.Rif = `ZO-${String(++ultimo).padStart(3, "0")}`;

  // Contatti nuovi: riempiono solo le celle vuote.
  for (const r of righe) {
    const c = perLink.get(r["Link scheda"]);
    if (c) {
      if (!r.Email && c.email) r.Email = c.email;
      if (!r.Telefono && c.telefono) r.Telefono = c.telefono;
      if (!r["Sito ufficiale"] && c.sito) r["Sito ufficiale"] = c.sito;
      if (!r["Fonte contatto"] && (c.fonte_email || c.fonte_telefono))
        r["Fonte contatto"] = [c.fonte_email && `email: ${c.fonte_email}`, c.fonte_telefono && `tel: ${c.fonte_telefono}`].filter(Boolean).join(" · ");
      if (c.nota && !r.Note.includes(c.nota)) r.Note = [r.Note, c.nota].filter(Boolean).join(" · ");
    }
    if (!r.Stato) r.Stato = r.Email ? "Pronta da inviare" : r.Telefono ? "Senza email: chiamare o scrivere dal sito" : "Contatto da trovare";
  }

  const uscita = [[...COLONNE], ...righe.map((r) => COLONNE.map((c) => r[c]))];
  if (gm.length) {
    uscita.push(Array(COLONNE.length).fill(""));
    uscita.push(["GM- (casella Gmail: blog, scuole, associazioni)", ...Array(COLONNE.length - 1).fill("")]);
    uscita.push(...gm.map((r) => [...r, ...Array(Math.max(0, COLONNE.length - r.length)).fill("")].slice(0, COLONNE.length)));
  }
  writeFileSync(pathUscita, csv(uscita));
  const conta = (f: (r: Riga) => boolean) => righe.filter(f).length;
  console.log(
    `registro: ${righe.length} attività (${schede.length} schede sul sito), con email ${conta((r) => !!r.Email)}, con telefono ${conta((r) => !!r.Telefono)}, inviate ${conta((r) => /inviat/i.test(r.Stato))}; righe Gmail ${gm.length}.`,
  );
}

principale();
