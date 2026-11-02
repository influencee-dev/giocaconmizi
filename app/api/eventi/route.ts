import { SCHEDE } from "@/lib/directory";
import { chiaveScheda } from "@/lib/directory-db";
import { EVENTI, conta, type Evento } from "@/lib/statistiche";

/**
 * Contatori delle schede: la pagina manda { scheda, evento } con sendBeacon.
 * Si accettano solo schede esistenti ed eventi del registro; i bot che si
 * dichiarano non contano. Non si salva niente della persona: né IP, né
 * cookie, né browser. Risponde sempre 204 per non dare indizi.
 */

export const runtime = "nodejs";

const CHIAVI = new Set(SCHEDE.map((s) => chiaveScheda(s)));
const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|facebookexternalhit|whatsapp/i;

export async function POST(richiesta: Request) {
  const vuota = new Response(null, { status: 204 });
  if (BOT.test(richiesta.headers.get("user-agent") ?? "")) return vuota;
  let corpo: { scheda?: unknown; evento?: unknown };
  try {
    corpo = JSON.parse(await richiesta.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const scheda = typeof corpo.scheda === "string" ? corpo.scheda : "";
  const evento = typeof corpo.evento === "string" ? corpo.evento : "";
  if (!CHIAVI.has(scheda) || !EVENTI.includes(evento as Evento)) return new Response(null, { status: 400 });
  await conta(scheda, evento as Evento);
  return vuota;
}
