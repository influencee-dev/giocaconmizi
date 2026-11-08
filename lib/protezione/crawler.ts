/**
 * Verifica dei crawler dei motori di ricerca.
 *
 * Lo user-agent si scrive da soli: chiunque può dichiararsi «Googlebot».
 * Per questo un crawler dichiarato viene trattato come motore di ricerca
 * SOLO se il suo IP cade negli intervalli pubblicati ufficialmente da Google
 * e da Microsoft (metodo raccomandato da entrambi, alternativo al reverse DNS
 * che nel middleware edge non è disponibile). Gli elenchi si scaricano solo
 * quando arriva uno user-agent che si dichiara crawler, e restano in memoria
 * 12 ore. Se il download fallisce, il crawler non è verificato e viene
 * trattato come un visitatore normale: limiti normali, niente blocchi.
 */

const FONTI = {
  google: "https://developers.google.com/static/search/apis/ipranges/googlebot.json",
  bing: "https://www.bing.com/toolbox/bingbot.json",
} as const;

type Motore = keyof typeof FONTI;

const DICHIARA: Record<Motore, RegExp> = {
  google: /Googlebot|Google-InspectionTool|GoogleOther/i,
  bing: /bingbot|BingPreview|msnbot/i,
};

const DURATA_CACHE = 12 * 60 * 60 * 1000;
const cache = new Map<Motore, { scade: number; reti: Rete[] }>();

interface Rete {
  v6: boolean;
  base: bigint;
  bit: number;
}

/** Quale motore dichiara di essere lo user-agent (o null). */
export function motoreDichiarato(ua: string): Motore | null {
  for (const m of Object.keys(DICHIARA) as Motore[]) if (DICHIARA[m].test(ua)) return m;
  return null;
}

/** true solo se lo user-agent si dichiara crawler E l'IP è negli intervalli ufficiali. */
export async function crawlerVerificato(ua: string, ip: string): Promise<boolean> {
  const motore = motoreDichiarato(ua);
  if (!motore || !ip) return false;
  const indirizzo = parseIp(ip);
  if (!indirizzo) return false;
  const reti = await retiDi(motore);
  return reti.some((r) => r.v6 === indirizzo.v6 && dentro(indirizzo.valore, r, indirizzo.v6));
}

async function retiDi(motore: Motore): Promise<Rete[]> {
  const inCache = cache.get(motore);
  if (inCache && inCache.scade > Date.now()) return inCache.reti;
  try {
    const risposta = await fetch(FONTI[motore], { signal: AbortSignal.timeout(2500) });
    if (!risposta.ok) throw new Error(String(risposta.status));
    const dati = (await risposta.json()) as { prefixes?: { ipv4Prefix?: string; ipv6Prefix?: string }[] };
    const reti = (dati.prefixes ?? [])
      .map((p) => parseRete(p.ipv4Prefix ?? p.ipv6Prefix ?? ""))
      .filter((r): r is Rete => r !== null);
    cache.set(motore, { scade: Date.now() + DURATA_CACHE, reti });
    return reti;
  } catch {
    // Riprova tra 10 minuti, non a ogni richiesta.
    cache.set(motore, { scade: Date.now() + 10 * 60 * 1000, reti: inCache?.reti ?? [] });
    return inCache?.reti ?? [];
  }
}

function dentro(valore: bigint, rete: Rete, v6: boolean): boolean {
  const totale = v6 ? 128 : 32;
  const spost = BigInt(totale - rete.bit);
  return valore >> spost === rete.base >> spost;
}

function parseRete(cidr: string): Rete | null {
  const [ip, bit] = cidr.split("/");
  const indirizzo = parseIp(ip ?? "");
  const n = Number(bit);
  if (!indirizzo || !Number.isInteger(n)) return null;
  return { v6: indirizzo.v6, base: indirizzo.valore, bit: n };
}

/** IPv4 o IPv6 in un numero; null se il testo non è un indirizzo. */
export function parseIp(ip: string): { v6: boolean; valore: bigint } | null {
  ip = ip.trim();
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    const parti = ip.split(".").map(Number);
    if (parti.some((p) => p > 255)) return null;
    return { v6: false, valore: parti.reduce((a, p) => (a << 8n) + BigInt(p), 0n) };
  }
  if (!ip.includes(":") || !/^[0-9a-f:.]+$/i.test(ip)) return null;
  // IPv4 incapsulato (::ffff:1.2.3.4): si confronta come IPv4.
  const v4 = ip.match(/::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (v4) return parseIp(v4[1]!);
  const [testa, coda] = ip.split("::");
  if (ip.split("::").length > 2) return null;
  const a = testa ? testa.split(":") : [];
  const b = coda !== undefined && coda !== "" ? coda.split(":") : [];
  const mancano = coda !== undefined ? 8 - a.length - b.length : 0;
  const gruppi = [...a, ...Array(Math.max(0, mancano)).fill("0"), ...b];
  if (gruppi.length !== 8 || gruppi.some((g) => !/^[0-9a-f]{1,4}$/i.test(g))) return null;
  return { v6: true, valore: gruppi.reduce((acc, g) => (acc << 16n) + BigInt(parseInt(g, 16)), 0n) };
}
