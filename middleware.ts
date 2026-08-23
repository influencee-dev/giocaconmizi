import type { NextRequest } from "next/server";
import { aggiornaSessione } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
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
