"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from "./config";

/**
 * Client Supabase lato browser. Restituisce null se il progetto non è ancora
 * configurato, così la UI può mostrare un messaggio invece di crashare.
 */
export function creaClientBrowser() {
  if (!supabaseConfigurato) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
