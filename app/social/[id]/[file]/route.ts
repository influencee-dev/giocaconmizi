import { firmaValida, numeroSlide, rispostaSlide, slideJpeg } from "@/lib/social/disegna";

/**
 * Il prelievo delle slide da parte di Meta, al momento della pubblicazione:
 * /social/<id>/<n>.jpg?f=<firma>. Senza la firma giusta (calcolata col token
 * Instagram, che esiste solo su Vercel) risponde 404: le slide non sono pubbliche.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(richiesta: Request, { params }: { params: Promise<{ id: string; file: string }> }) {
  const { id, file } = await params;
  const n = numeroSlide(file);
  const firma = new URL(richiesta.url).searchParams.get("f");
  if (!n || !firmaValida(id, n, firma)) return rispostaSlide(null);
  return rispostaSlide(await slideJpeg(id, n));
}
