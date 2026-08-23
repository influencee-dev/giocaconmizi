import { NextResponse, type NextRequest } from "next/server";
import { creaClientServer, utenteCorrente } from "@/lib/supabase/server";
import { tracciaGiocoCompletato } from "@/lib/brevo";

/**
 * Salva l'avanzamento di un gioco completato.
 * I giochi restano liberi: senza sessione rispondiamo 204 e non salviamo nulla,
 * senza mai far fallire il gioco in corso (piano §2, decisione 1).
 */

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await creaClientServer();
  if (!supabase) return new NextResponse(null, { status: 204 });

  const utente = await utenteCorrente();
  if (!utente) return new NextResponse(null, { status: 204 });

  let corpo: { slug?: string; score?: number; stars?: number };
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ errore: "JSON non valido" }, { status: 400 });
  }

  if (!corpo.slug) {
    return NextResponse.json({ errore: "slug mancante" }, { status: 400 });
  }

  const { error } = await supabase.from("progress").insert({
    profile_id: utente.id,
    game_slug: corpo.slug,
    score: corpo.score ?? 0,
    stars: corpo.stars ?? 0,
    completed_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ errore: error.message }, { status: 500 });
  }

  if (utente.email) {
    // L'evento Brevo alimenta le automazioni; un suo errore non invalida il salvataggio.
    await tracciaGiocoCompletato(utente.email, corpo.slug);
  }

  return NextResponse.json({ ok: true });
}
