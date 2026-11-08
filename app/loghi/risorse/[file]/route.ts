import { logoDi } from "@/lib/directory-db";
import { chiaveRisorsa, risorsaDaSlug } from "@/lib/risorse-educative";

/**
 * Il logo di una risorsa: solo quello caricato dalla realtà e approvato da
 * Giorgia (supabase/risorse-reclamo.sql), già ricodificato in WebP dal server.
 * Finisce in .webp apposta: il middleware salta le immagini, quindi i loghi
 * non contano nel limite di frequenza della pagina Risorse.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const r = file.endsWith(".webp") ? risorsaDaSlug(file.slice(0, -5)) : undefined;
  const logo = r ? await logoDi(chiaveRisorsa(r)) : null;
  if (!logo) return new Response("Non trovato", { status: 404, headers: { "Cache-Control": "public, max-age=300" } });
  return new Response(new Uint8Array(logo), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
