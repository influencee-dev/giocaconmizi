import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieDaImpostare = { name: string; value: string; options: CookieOptions };
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "./config";

/**
 * Rinfresca il token di sessione a ogni richiesta e lo riscrive nei cookie.
 * Senza questo passaggio il magic link scade e i genitori vengono sloggati.
 */
export async function aggiornaSessione(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseConfigurato) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesDaImpostare: CookieDaImpostare[]) {
        for (const { name, value } of cookiesDaImpostare) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesDaImpostare) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() va chiamato: è ciò che rinnova effettivamente il token.
  await supabase.auth.getUser();

  return response;
}
