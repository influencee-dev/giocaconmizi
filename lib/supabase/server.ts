import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieDaImpostare = { name: string; value: string; options: CookieOptions };
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "./config";

/**
 * Client Supabase per Server Component, Server Action e Route Handler.
 * Va creato a ogni richiesta: i cookie di sessione non si possono condividere.
 */
export async function creaClientServer() {
  if (!supabaseConfigurato) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesDaImpostare: CookieDaImpostare[]) {
        try {
          for (const { name, value, options } of cookiesDaImpostare) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chiamato da un Server Component: il refresh dei cookie lo fa il
          // middleware, quindi qui possiamo ignorare senza perdere la sessione.
        }
      },
    },
  });
}

/** L'utente loggato, o null se non c'è sessione o Supabase non è configurato. */
export async function utenteCorrente() {
  const supabase = await creaClientServer();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
