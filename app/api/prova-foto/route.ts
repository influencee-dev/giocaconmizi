import { NextResponse, type NextRequest } from "next/server";

/**
 * TEMPORANEO (15/11/2026): riceve l'esito della pagina /prova-foto, aperta da
 * Giorgia sul suo iPhone per capire perché lì le foto non si vedono, e lo
 * scrive nei log. Niente database, niente cookie. Da togliere a guasto risolto.
 */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const testo = (await request.text()).slice(0, 6000);
  try {
    console.log(`PROVA-FOTO ${JSON.stringify(JSON.parse(testo))}`);
  } catch {
    return NextResponse.json({ errore: "non valido" }, { status: 400 });
  }
  return new NextResponse(null, { status: 204 });
}
