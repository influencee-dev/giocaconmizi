import Link from "next/link";
import { chiaveRisorsa, type Risorsa } from "@/lib/risorse-educative";
import { percorsoCategoriaRisorse, type CategoriaRisorsa } from "@/lib/risorse-categorie";
import { PERCORSO_COME_RECLAMARE } from "@/lib/reclamo";

/** I mattoni condivisi delle pagine della directory delle risorse educative. */

/** La fila delle categorie, come le sotto-categorie della directory feste. */
export function NavCategorieRisorse({ categorie, attuale }: { categorie: CategoriaRisorsa[]; attuale?: string }) {
  return (
    <nav aria-label="Categorie delle risorse educative" className="flex gap-3 overflow-x-auto pb-2">
      {categorie.map((c) => {
        const qui = c.slug === attuale;
        return (
          <Link
            key={c.slug}
            href={percorsoCategoriaRisorse(c)}
            aria-current={qui ? "page" : undefined}
            className={`flex shrink-0 flex-col items-center gap-2 rounded-[1.4rem] border-2 px-4 py-3 text-center text-sm font-extrabold shadow-sm ${
              qui ? "border-viola bg-viola text-white" : "border-white bg-white text-notte hover:border-viola"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- icone statiche locali */}
            <img src={`/icone/${c.icona}.png`} alt="" className="h-10 w-10" />
            <span className="w-28 leading-tight">{c.nome}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Il richiamo per le realtà: reclamare la scheda (o proporne una nuova) e la guida su come si fa. */
export function CtaRisorsa({ risorsa }: { risorsa?: Pick<Risorsa, "slug" | "nome"> }) {
  const href = risorsa ? `/aggiungi-attivita?scheda=${encodeURIComponent(chiaveRisorsa(risorsa))}` : "/aggiungi-attivita";
  return (
    <section className="mt-12 flex flex-col gap-4 rounded-morbido border-[3px] border-dashed border-rosa bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xl font-extrabold text-notte">{risorsa ? `Gestisci ${risorsa.nome}?` : "Sei una scuola, una cooperativa o un progetto educativo?"}</p>
        <p className="mt-1 text-sm font-semibold text-notte-tenue">
          {risorsa
            ? "La scheda è gratuita: reclamala per completarla, aggiungere il logo e i contatti e vedere quante famiglie la guardano."
            : "La scheda è gratuita: reclama quella che c'è già o proponi la tua realtà. Nessuna commissione, nessuna pubblicità."}
        </p>
        <Link href={PERCORSO_COME_RECLAMARE} className="mt-2 inline-block text-sm font-extrabold text-viola underline decoration-2 underline-offset-4">
          Come funziona, passo per passo
        </Link>
      </div>
      <Link href={href} rel="nofollow" className="shrink-0 rounded-2xl bg-viola px-5 py-3 text-center font-extrabold text-white" data-cta-attivita>
        {risorsa ? "Reclama la scheda" : "Reclama o proponi"}
      </Link>
    </section>
  );
}
