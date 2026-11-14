import Link from "next/link";
import { MOTIVI } from "@/components/biglietti/motivi";
import { PERCORSO_LETTERINA, PERCORSO_NATALE, inStagioneNatale } from "@/lib/natale";

/**
 * Il riquadro del Natale in home (studio UX del 14/11/2026: il Natale non si
 * trovava). Compare solo in stagione, con i disegni delle cornici: si capisce
 * anche senza leggere.
 */
export function RiquadroNatale({ className = "" }: { className?: string }) {
  if (!inStagioneNatale()) return null;
  const motivi = ["natale", "natale-neve", "natale-regali", "natale-renne"].map((t) => MOTIVI[t]).filter(Boolean);
  return (
    <section className={`overflow-hidden rounded-[1.6rem] border-2 border-rosso/30 bg-[#FDECEC] p-5 sm:p-6 ${className}`} data-riquadro-natale>
      <div className="flex items-center gap-4">
        <div className="hidden shrink-0 grid-cols-2 gap-1 sm:grid" aria-hidden>
          {motivi.map((m, i) => (
            <svg key={i} viewBox="0 0 40 40" className="h-12 w-12">
              {m.motivo(m.tinte)}
            </svg>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-black text-notte">Il Natale di Mizi</p>
          <p className="mt-1 text-notte-tenue">La letterina a Babbo Natale con la busta da colorare, i biglietti di auguri e gli eventi città per città.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={PERCORSO_LETTERINA} data-tap className="inline-flex min-h-14 items-center rounded-bolla bg-rosa-forte px-5 font-extrabold text-white">
              Scrivi la letterina
            </Link>
            <Link href={PERCORSO_NATALE} prefetch={false} data-tap className="inline-flex min-h-14 items-center rounded-bolla border-2 border-notte/15 bg-white px-5 font-extrabold text-notte">
              Tutto il Natale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
