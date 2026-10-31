import { NextResponse, type NextRequest } from "next/server";
import { creaContatto } from "@/lib/brevo";

/**
 * Sync verso Brevo (piano §4.4).
 * POST /api/brevo con { azione: "contatto", ... }: solo l'iscrizione alle
 * novità, con consenso esplicito e dichiarazione di maggiore età.
 * La chiave Brevo resta lato server: il browser non la vede mai.
 * Niente eventi di gioco legati all'email: non profiliamo (privacy policy).
 */

export const runtime = "nodejs";

interface CorpoContatto {
  azione: "contatto";
  email: string;
  nomeGenitore?: string;
  citta?: string;
  professione?: string;
  etaFiglio?: number;
  classe?: string;
  origine?: string;
  consenso: boolean;
  maggiorenne?: boolean;
  /** Campo trappola per i bot: invisibile alle persone, deve restare vuoto. */
  sito?: string;
}

type Corpo = CorpoContatto;

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
/** Taglia i campi liberi: niente testi lunghi né oggetti al posto delle stringhe. */
const corto = (v: unknown, max = 80) => (typeof v === "string" ? v.trim().slice(0, max) || undefined : undefined);

export async function POST(request: NextRequest) {
  let corpo: Corpo;
  try {
    corpo = (await request.json()) as Corpo;
  } catch {
    return NextResponse.json({ errore: "JSON non valido" }, { status: 400 });
  }

  const email = typeof corpo?.email === "string" ? corpo.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email)) {
    return NextResponse.json({ errore: "email non valida" }, { status: 400 });
  }
  // Un bot ha riempito il campo trappola: rispondiamo ok e non salviamo nulla.
  if (corto(corpo.sito)) return NextResponse.json({ ok: true });

  if (corpo.azione === "contatto") {
    // Senza consenso esplicito e senza dichiarazione di maggiore età non
    // scriviamo niente (GDPR artt. 7-8, Codice privacy art. 2-quinquies).
    if (corpo.consenso !== true || corpo.maggiorenne !== true) {
      return NextResponse.json({ errore: "consenso mancante" }, { status: 400 });
    }
    const eta = Number(corpo.etaFiglio);

    const esito = await creaContatto({
      email,
      nomeGenitore: corto(corpo.nomeGenitore, 60),
      citta: corto(corpo.citta, 60),
      professione: corto(corpo.professione, 40),
      etaFiglio: Number.isInteger(eta) && eta >= 0 && eta <= 18 ? eta : undefined,
      classe: corto(corpo.classe, 40),
      origine: corto(corpo.origine, 30),
    });

    return NextResponse.json(esito, { status: esito.ok ? 200 : 502 });
  }

  return NextResponse.json({ errore: "azione sconosciuta" }, { status: 400 });
}
