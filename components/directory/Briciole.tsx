import Link from "next/link";

/** Il percorso visibile (Home › Ludoteche › Milano), gemello del JSON-LD. */
export function Briciole({ voci }: { voci: { nome: string; href?: string }[] }) {
  return (
    <nav aria-label="Percorso" className="flex flex-wrap items-center gap-1 text-sm font-bold text-notte-tenue">
      <Link href="/" className="hover:text-viola">Home</Link>
      {voci.map((v) => (
        <span key={v.nome} className="flex items-center gap-1">
          <span aria-hidden>›</span>
          {v.href ? (
            <Link href={v.href} className="hover:text-viola">{v.nome}</Link>
          ) : (
            <span className="font-extrabold text-notte">{v.nome}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Il box «In breve»: la risposta citabile dalle AI, in testa a ogni pagina. */
export function InBreve({ testo }: { testo: string }) {
  return (
    <div className="rounded-morbido bg-viola px-6 py-5 text-white">
      <p className="text-xs font-extrabold uppercase tracking-widest opacity-85">In breve</p>
      <p className="mt-1.5 text-base font-semibold leading-relaxed sm:text-lg">{testo}</p>
    </div>
  );
}

/** L'invito alle attività: iscriversi o reclamare la scheda già creata. */
/** Il richiamo per le attività. Sulla scheda di un locale (`scheda`) porta al modulo con quella scheda già scelta. */
export function CtaAttivita({ scheda }: { scheda?: string } = {}) {
  return (
    <section className="mt-12 flex flex-col gap-4 rounded-morbido border-[3px] border-dashed border-rosa bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xl font-extrabold text-notte">{scheda ? "È la tua attività?" : "Gestisci uno di questi spazi per bambini?"}</p>
        <p className="mt-1 text-sm font-semibold text-notte-tenue">
          {scheda
            ? "La scheda è gratuita: chiedi di gestirla per correggerla, completarla o aggiungere le foto."
            : "La scheda è gratuita: chiedi di gestirla o aggiungi la tua attività, anche se è un'associazione o un laboratorio."}
        </p>
      </div>
      <Link href={scheda ? `/aggiungi-attivita?scheda=${encodeURIComponent(scheda)}` : "/aggiungi-attivita"} className="shrink-0 rounded-2xl bg-viola px-5 py-3 text-center font-extrabold text-white" data-cta-attivita>
        {scheda ? "Gestisci la scheda" : "Aggiungi o gestisci"}
      </Link>
    </section>
  );
}
