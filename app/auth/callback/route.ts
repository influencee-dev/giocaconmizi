import { NextResponse, type NextRequest } from "next/server";
import { creaClientServer } from "@/lib/supabase/server";

/**
 * Atterraggio del magic link: scambia il codice con una sessione e porta il
 * genitore dove stava andando.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const destinazione = searchParams.get("next") ?? "/account";

  // Solo percorsi interni: evita redirect aperti verso domini esterni.
  const sicura = destinazione.startsWith("/") && !destinazione.startsWith("//")
    ? destinazione
    : "/account";

  if (!code) {
    return NextResponse.redirect(`${origin}/accedi?errore=link-non-valido`);
  }

  const supabase = await creaClientServer();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/accedi?errore=supabase-non-configurato`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/accedi?errore=link-scaduto`);
  }

  return NextResponse.redirect(`${origin}${sicura}`);
}
