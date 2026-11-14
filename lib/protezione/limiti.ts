/**
 * Difesa dalle letture automatiche a raffica — solo per le pagine elencate in
 * PERCORSI_PROTETTI (oggi l'hub /risorse-educative-bambini).
 *
 * Cosa fa, in ordine:
 *   1. trappola (honeypot): un link nascosto agli utenti e agli screen
 *      reader, vietato in robots.txt. Chi lo segue è quasi certamente un bot
 *      che ignora le regole: la sua «impronta» resta bloccata 30 minuti
 *      sulle pagine protette (403 neutro).
 *   2. crawler verificati (Googlebot, Bingbot con IP negli intervalli
 *      ufficiali): passano senza limiti, perché la pagina deve fare SEO.
 *   3. limite di frequenza su due chiavi:
 *        - IP: largo (120/min), perché una scuola intera può uscire su
 *          internet con un solo IP;
 *        - «sessione tecnica» = IP + browser: più stretta (40/min, 15 in
 *          10 secondi). Niente cookie: su un sito per bambini non ne
 *          aggiungiamo uno solo per questo.
 *      Oltre il limite: 429 con Retry-After e una pagina gentile in italiano.
 *
 * Limiti onesti: i contatori vivono nella memoria della singola istanza del
 * middleware (Vercel ne accende più d'una), quindi il limite è «al meglio».
 * La barriera vera e condivisa è la regola WAF di Vercel (vedi
 * docs/protezione-risorse.md). Nessuna risposta contiene dati falsi o
 * alterati: chi supera il limite riceve solo un messaggio chiaro.
 */
import { crawlerVerificato, motoreDichiarato } from "./crawler";

export const PERCORSI_PROTETTI = ["/risorse-educative-bambini"];
/** Il link trappola: mai in sitemap, vietato in robots.txt, invisibile in pagina. */
export const PERCORSO_TRAPPOLA = "/risorse-educative-bambini/elenco-completo-archivio";

const LIMITI = {
  ip: { finestra: 60_000, massimo: 120 },
  sessione: { finestra: 60_000, massimo: 40 },
  raffica: { finestra: 10_000, massimo: 15 },
} as const;
const DURATA_BLOCCO_TRAPPOLA = 30 * 60_000;

/** chiave → istanti delle richieste recenti. Si svuota da sola. */
const colpi = new Map<string, number[]>();
/** impronta → scadenza del blocco da trappola. */
const bloccati = new Map<string, number>();

/**
 * Solo la pagina esatta (e la trappola). Dal 14/11/2026 le categorie e le
 * schede delle risorse sono pagine pubbliche come quelle delle feste: con il
 * limite a 40 al minuto un motore di ricerca o un'AI non verificata si
 * fermerebbe a metà delle ~55 pagine (docs/piano-risorse-eventi.md).
 */
export function protetto(percorso: string): boolean {
  return percorso === PERCORSO_TRAPPOLA || PERCORSI_PROTETTI.includes(percorso);
}

export type Esito =
  | { tipo: "passa"; crawler?: boolean }
  | { tipo: "limite"; riprova: number }
  | { tipo: "bloccato" }
  | { tipo: "trappola" };

export async function valuta(dati: {
  percorso: string;
  ip: string;
  ua: string;
  /** I prefetch di <Link> non contano: li fa il browser, non la persona. */
  prefetch: boolean;
  ora?: number;
}): Promise<Esito> {
  const ora = dati.ora ?? Date.now();
  pulisci(ora);
  const sessione = `${dati.ip}|${dati.ua}`;

  if (dati.percorso === PERCORSO_TRAPPOLA) {
    bloccati.set(sessione, ora + DURATA_BLOCCO_TRAPPOLA);
    await registra("trappola", dati);
    return { tipo: "trappola" };
  }

  if ((bloccati.get(sessione) ?? 0) > ora) return { tipo: "bloccato" };

  if (motoreDichiarato(dati.ua)) {
    if (await crawlerVerificato(dati.ua, dati.ip)) return { tipo: "passa", crawler: true };
    await registra("crawler-non-verificato", dati);
  }

  // Prefetch del browser: non è una lettura della persona.
  // IP vuoto: succede solo in locale (su Vercel l'IP lo scrive sempre la
  // piattaforma); così le batterie di verifica non inciampano nel limite.
  if (dati.prefetch || !dati.ip) return { tipo: "passa" };

  const controlli: [string, keyof typeof LIMITI][] = [
    [`ip:${dati.ip}`, "ip"],
    [`s:${sessione}`, "sessione"],
    [`r:${sessione}`, "raffica"],
  ];
  let riprova = 0;
  for (const [chiave, tipo] of controlli) {
    const { finestra, massimo } = LIMITI[tipo];
    const recenti = (colpi.get(chiave) ?? []).filter((t) => t > ora - finestra);
    recenti.push(ora);
    colpi.set(chiave, recenti);
    if (recenti.length > massimo) riprova = Math.max(riprova, Math.ceil((recenti[0]! + finestra - ora) / 1000));
  }
  if (riprova > 0) {
    await registra("limite", dati);
    return { tipo: "limite", riprova: Math.max(5, riprova) };
  }
  return { tipo: "passa" };
}

/** Tiene le mappe piccole: niente crescita infinita della memoria. */
function pulisci(ora: number) {
  if (colpi.size > 5000) {
    for (const [k, v] of colpi) if ((v.at(-1) ?? 0) < ora - 60_000) colpi.delete(k);
  }
  if (bloccati.size > 2000) {
    for (const [k, scade] of bloccati) if (scade < ora) bloccati.delete(k);
  }
}

/**
 * Registro privacy-safe: un evento tecnico minimo nei log di Vercel
 * (conservati solo per la durata dei log del piano, da 1 ora a pochi giorni).
 * Niente IP in chiaro né user-agent completo: un'impronta SHA-256 troncata,
 * con un sale che cambia ogni giorno (non si può risalire all'IP né
 * collegare giorni diversi), e la sola famiglia del client.
 */
async function registra(evento: string, dati: { percorso: string; ip: string; ua: string }) {
  const giorno = new Date().toISOString().slice(0, 10);
  const sale = process.env.PROTEZIONE_SALE || "giocamizi";
  const impronta = await sha256(`${sale}|${giorno}|${dati.ip}`);
  console.warn(
    JSON.stringify({
      protezione: evento,
      percorso: dati.percorso,
      impronta: impronta.slice(0, 12),
      client: famiglia(dati.ua),
      ora: new Date().toISOString(),
    }),
  );
}

async function sha256(testo: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(testo));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function famiglia(ua: string): string {
  if (!ua) return "vuoto";
  const m = ua.match(/(Googlebot|bingbot|GPTBot|ClaudeBot|PerplexityBot|CCBot|python-requests|curl|wget|Scrapy|HeadlessChrome|Go-http-client|axios|node-fetch|Firefox|Edg|Chrome|Safari)/i);
  return m ? m[1]!.toLowerCase() : "altro";
}

/** Solo per i test: riparte da zero. */
export function _azzera() {
  colpi.clear();
  bloccati.clear();
}

const STILE =
  "body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#FFF3E6;color:#1F2430;display:grid;min-height:100vh;place-items:center;padding:24px;box-sizing:border-box}main{max-width:34rem;background:#fff;border-radius:24px;padding:28px;box-shadow:0 10px 30px -12px rgba(31,36,48,.35)}h1{font-size:1.5rem;margin:0 0 12px}p{font-size:1.05rem;line-height:1.55;margin:0 0 12px}a{color:#5B34A3;font-weight:700}";

function pagina(titolo: string, testo: string): string {
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${titolo} · Giocamizi</title><style>${STILE}</style></head><body><main><h1>${titolo}</h1>${testo}<p><a href="/">Torna alla home di Giocamizi</a></p></main></body></html>`;
}

const INTESTAZIONI = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

/** 429 gentile: chi legge capisce cosa succede e quando riprovare. */
export function rispostaLimite(riprova: number): Response {
  return new Response(
    pagina(
      "Un attimo di pausa",
      `<p role="status">Sono arrivate molte richieste in poco tempo da questa connessione, quindi la pagina si prende una piccola pausa.</p><p>Riprova tra circa ${riprova} secondi: la pagina tornerà come prima. Se succede spesso dalla rete della tua scuola, scrivici a <a href="mailto:ciao@giocamizi.it">ciao@giocamizi.it</a>.</p>`,
    ),
    { status: 429, headers: { ...INTESTAZIONI, "Retry-After": String(riprova) } },
  );
}

/** 403 neutro per chi è caduto nella trappola: nessun dettaglio sul perché. */
export function rispostaBloccato(): Response {
  return new Response(
    pagina(
      "Pagina non disponibile",
      `<p>Al momento questa pagina non è disponibile da questa connessione. Riprova più tardi.</p><p>Se pensi sia un errore, scrivici a <a href="mailto:ciao@giocamizi.it">ciao@giocamizi.it</a>.</p>`,
    ),
    { status: 403, headers: INTESTAZIONI },
  );
}

/** La trappola risponde come una pagina che non c'è: nessun contenuto, niente di falso. */
export function rispostaTrappola(): Response {
  return new Response(pagina("Pagina non trovata", "<p>Questa pagina non esiste.</p>"), {
    status: 404,
    headers: INTESTAZIONI,
  });
}
