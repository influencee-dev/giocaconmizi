import { NextResponse, type NextRequest } from "next/server";
import { creaContatto, tracciaGiocoCompletato } from "@/lib/brevo";

/**
 * Sync verso Brevo (piano §4.4).
 * POST /api/brevo con { azione: "contatto" | "gioco_completato", ... }.
 * La chiave Brevo resta lato server: il browser non la vede mai.
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
}

interface CorpoEvento {
  azione: "gioco_completato";
  email: string;
  slug: string;
}

type Corpo = CorpoContatto | CorpoEvento;

export async function POST(request: NextRequest) {
  let corpo: Corpo;
  try {
    corpo = (await request.json()) as Corpo;
  } catch {
    return NextResponse.json({ errore: "JSON non valido" }, { status: 400 });
  }

  if (!corpo?.email) {
    return NextResponse.json({ errore: "email mancante" }, { status: 400 });
  }

  if (corpo.azione === "contatto") {
    // Senza consenso esplicito non scriviamo niente: GDPR art. 8 (§2, decisione 2).
    if (!corpo.consenso) {
      return NextResponse.json({ errore: "consenso mancante" }, { status: 400 });
    }

    const esito = await creaContatto({
      email: corpo.email,
      nomeGenitore: corpo.nomeGenitore,
      citta: corpo.citta,
      professione: corpo.professione,
      etaFiglio: corpo.etaFiglio,
      classe: corpo.classe,
      origine: corpo.origine,
    });

    return NextResponse.json(esito, { status: esito.ok ? 200 : 502 });
  }

  if (corpo.azione === "gioco_completato") {
    const esito = await tracciaGiocoCompletato(corpo.email, corpo.slug);
    return NextResponse.json(esito, { status: esito.ok ? 200 : 502 });
  }

  return NextResponse.json({ errore: "azione sconosciuta" }, { status: 400 });
}
