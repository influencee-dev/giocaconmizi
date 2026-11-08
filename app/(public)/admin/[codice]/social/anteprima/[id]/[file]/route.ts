import { adminValido } from "@/lib/admin";
import { numeroSlide, rispostaSlide, slideJpeg } from "@/lib/social/disegna";

/** Le anteprime delle slide nel pannello: solo con il codice admin. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_r: Request, { params }: { params: Promise<{ codice: string; id: string; file: string }> }) {
  const { codice, id, file } = await params;
  const n = numeroSlide(file);
  if (!n || !(await adminValido(codice))) return rispostaSlide(null);
  return rispostaSlide(await slideJpeg(id, n));
}
