import VARIANTI from "@/lib/foto/immagini-varianti.json";

/**
 * Da dove arrivano le immagini di <Image> (next.config.ts, loader «custom»).
 *
 * Le foto del sito esistono già in più larghezze, fatte da noi
 * (public/immagini/<nome>-<larghezza>.webp): si serve direttamente il file
 * della misura giusta, senza passare da /_next/image di Vercel. Dal
 * 15/11/2026: su iPhone le foto passate da quel servizio non si vedevano più,
 * mentre dal server uscivano giuste. Così c'è un pezzo in meno che può
 * rompersi, e non si consuma la quota di ridimensionamenti del piano gratuito.
 *
 * Tutto il resto (logo, ritratti senza varianti) si serve com'è: sono file
 * già piccoli. L'elenco delle larghezze lo rigenera scripts/varianti-immagini.mjs
 * prima di ogni build.
 */
const elenco = VARIANTI as Record<string, number[]>;

export default function caricatore({ src, width }: { src: string; width: number; quality?: number }): string {
  const m = src.match(/^\/immagini\/(.+)-\d+\.webp$/);
  const larghezze = m ? elenco[m[1]] : undefined;
  if (!m || !larghezze?.length) return src;
  // La più piccola che basta; se nessuna basta, la più grande che c'è.
  const scelta = larghezze.find((l) => l >= width) ?? larghezze[larghezze.length - 1];
  return `/immagini/${m[1]}-${scelta}.webp`;
}
