import { NextResponse } from "next/server";
import { utenteCorrente } from "@/lib/supabase/server";
import { GRATIS_PER_TUTTI, candidati, cercaConAi, tracciaRicerca } from "@/lib/contenuti/ricerca-ai";
import { consumaRicerca } from "@/lib/pagamenti/accesso-ai";
import { inServerDiProva } from "@/lib/pagamenti/stripe";

/** Tetto per indirizzo, in memoria (aiuta contro chi martella: il costo vero è dell'AI). */
const finestre = new Map<string, { inizio: number; n: number }>();
function troppe(ip: string) {
  const ora = Date.now();
  const f = finestre.get(ip);
  if (!f || ora - f.inizio > 60_000) {
    finestre.set(ip, { inizio: ora, n: 1 });
    if (finestre.size > 5000) finestre.clear();
    return false;
  }
  f.n += 1;
  return f.n > 8;
}

export async function POST(req: Request) {
  const corpo = (await req.json().catch(() => null)) as { domanda?: unknown } | null;
  const domanda = typeof corpo?.domanda === "string" ? corpo.domanda.trim().slice(0, 300) : "";
  if (domanda.length < 3) return NextResponse.json({ errore: "Scrivi cosa cerchi, anche in poche parole." }, { status: 400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "sconosciuto";
  if (troppe(ip)) return NextResponse.json({ errore: "Troppe ricerche in un minuto: riprova tra poco." }, { status: 429 });

  const utente = await utenteCorrente();
  // Decisione del 27/11/2026: per ora gratis per tutti. Con GRATIS_PER_TUTTI = false
  // torna il giro del piano: 3 gratis per le mamme collegate, poi il contributo di 10 €.
  if (!GRATIS_PER_TUTTI) {
    const esito = await consumaRicerca();
    if (esito !== "pagato" && esito !== "gratis") {
      return NextResponse.json({ errore: esito, serve: esito }, { status: esito === "non_collegata" ? 401 : 402 });
    }
  }

  // Copia di prova senza AI: una risposta finta con le pagine trovate, per vedere la pagina.
  const senzaAi = inServerDiProva() && !process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY;
  try {
    const r = senzaAi
      ? {
          risposta: "Risposta di prova: qui l'AI spiegherebbe in due frasi cosa ha trovato.",
          risultati: candidati(domanda, 4).map((v) => ({ ...v, perche: "Pagina trovata dalla ricerca (prova, senza AI)." })),
        }
      : await cercaConAi(domanda);
    await tracciaRicerca({ domanda, risultati: r.risultati.length, collegata: Boolean(utente), esito: "ok" });
    return NextResponse.json(r);
  } catch (e) {
    await tracciaRicerca({ domanda, risultati: 0, collegata: Boolean(utente), esito: "errore" });
    console.error("[cerca] AI non riuscita", e instanceof Error ? e.message : e);
    return NextResponse.json({ errore: "La ricerca con l'AI non ha risposto: riprova tra poco." }, { status: 503 });
  }
}
