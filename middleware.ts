import type { NextRequest } from "next/server";
import { aggiornaSessione } from "@/lib/supabase/middleware";
import {
  protetto,
  rispostaBloccato,
  rispostaLimite,
  rispostaTrappola,
  valuta,
} from "@/lib/protezione/limiti";

export async function middleware(request: NextRequest) {
  const percorso = request.nextUrl.pathname;

  // Difesa dalle letture a raffica, solo sulle pagine protette (lib/protezione).
  if (protetto(percorso)) {
    // Su Vercel x-real-ip / x-forwarded-for li scrive la piattaforma.
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "";
    const esito = await valuta({
      percorso,
      ip,
      ua: request.headers.get("user-agent") ?? "",
      prefetch:
        request.headers.get("next-router-prefetch") === "1" ||
        request.headers.get("purpose") === "prefetch" ||
        request.headers.get("sec-purpose")?.includes("prefetch") === true,
    });
    if (esito.tipo === "trappola") return rispostaTrappola();
    if (esito.tipo === "bloccato") return rispostaBloccato();
    if (esito.tipo === "limite") return rispostaLimite(esito.riprova);
  }

  return aggiornaSessione(request);
}

export const config = {
  matcher: [
    /*
     * Tutte le pagine tranne asset statici e immagini: le pagine pubbliche sono
     * statiche e non hanno bisogno del refresh, ma il matcher deve coprire
     * /account e /accedi per non perdere la sessione.
     */
    "/((?!_next/static|_next/image|favicon.ico|cards/|mascot/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|xml)$).*)",
  ],
};
