import Link from "next/link";
import { FacciaMizi } from "@/games/_engine/arte";
import { PERCORSO, PERCORSO_PUBBLICO } from "@/lib/famiglia/sotto-pressione";

/**
 * Il riquadro che porta al test «sotto pressione» dalle altre pagine del sito
 * (per le mamme, guide). Se il test torna in bozza (PERCORSO_PUBBLICO false)
 * sparisce da solo.
 */
export function InvitoTest({ className = "" }: { className?: string }) {
  if (!PERCORSO_PUBBLICO) return null;
  return (
    <Link
      href={PERCORSO.percorso}
      data-invito-test
      className={`flex items-center gap-4 rounded-[1.4rem] border-2 border-rosa/40 bg-rosa/10 p-5 transition-colors hover:border-rosa-forte ${className}`}
    >
      <span className="h-16 w-16 shrink-0" aria-hidden>
        <FacciaMizi emozione="felice" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-xl font-extrabold text-notte">E tu che tipo di mamma sei quando sei sotto pressione?</span>
        <span className="text-notte-tenue">
          Fai il test: 10 minuti, gratis. Le risposte restano sul tuo telefono e alla fine trovi un esercizio per la settimana.
        </span>
        <span className="mt-1 inline-flex w-fit items-center rounded-2xl bg-rosa-forte px-5 py-2.5 font-extrabold text-white">
          Fai il test
        </span>
      </span>
    </Link>
  );
}
