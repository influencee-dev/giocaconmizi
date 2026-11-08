import Link from "next/link";
import { AVVISO_LINK, SEZIONI, chiaveRisorsa, dominio, iniziali, percorsoRisorsa, type Risorsa, type Sezione } from "@/lib/risorse-educative";

/** La card di una risorsa nell'hub (e nell'anteprima del link personale). */

export const COLORI: Record<Sezione, { pallino: string; fondo: string }> = {
  famiglie: { pallino: "bg-rosa", fondo: "bg-[#FCE6EE]" },
  insegnanti: { pallino: "bg-verde", fondo: "bg-[#E3F4E7]" },
  territorio: { pallino: "bg-arancione", fondo: "bg-[#FFEBD3]" },
  coding: { pallino: "bg-azzurro", fondo: "bg-[#E2F2FB]" },
  lettura: { pallino: "bg-viola", fondo: "bg-[#F0E8FA]" },
};

/** Un tema del foglio già detto da una sezione della card non si ripete. */
const TEMA_SEZIONE: Record<string, Sezione | undefined> = {
  "Famiglie e genitorialità": "famiglie",
  "Scuola e didattica": "insegnanti",
  "Territorio e attività": "territorio",
  "Coding e STEM": "coding",
  "Lettura e storie": "lettura",
};

/** Il logo approvato (caricato dalla realtà) o, finché manca, le iniziali. */
export function LogoRisorsa({ risorsa: r, logo, lato = 48 }: { risorsa: Risorsa; logo?: boolean; lato?: number }) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logo piccolo già in WebP, servito dal nostro dominio
      <img
        src={`/loghi/risorse/${r.slug}.webp`}
        alt={`Logo di ${r.nome}`}
        width={lato}
        height={lato}
        loading="lazy"
        className="shrink-0 rounded-2xl border border-notte/10 bg-white object-contain p-1"
        style={{ width: lato, height: lato }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-2xl font-black text-notte ${COLORI[r.sezioni[0]!].fondo}`}
      style={{ width: lato, height: lato, fontSize: lato * 0.38 }}
    >
      {iniziali(r.nome)}
    </span>
  );
}

export function CardRisorsa({ risorsa: r, reclamata = false, logo = false, anteprima = false }: {
  risorsa: Risorsa;
  reclamata?: boolean;
  logo?: boolean;
  /** Nell'anteprima del link personale niente link «È la tua realtà?». */
  anteprima?: boolean;
}) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <LogoRisorsa risorsa={r} logo={logo} />
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold leading-snug text-notte [overflow-wrap:anywhere]">
            {reclamata ? (
              <Link href={percorsoRisorsa(r)} className="hover:text-viola">
                {r.nome}
              </Link>
            ) : (
              r.nome
            )}
          </h3>
          {r.localita && <p className="text-sm font-bold text-notte-tenue">{r.localita}</p>}
          {reclamata && (
            <p className="mt-1 inline-flex items-center gap-1 rounded-lg bg-[#E3F4E8] px-2 py-0.5 text-xs font-extrabold text-[#2E7D4A]">
              <span aria-hidden>✓</span> Scheda verificata dalla realtà
            </p>
          )}
        </div>
      </div>
      <p className="text-notte-tenue">{r.descrizione}</p>
      <ul aria-label="Sezioni e temi" className="flex flex-wrap gap-1.5">
        {r.sezioni.map((s) => (
          <li key={s} className={`rounded-lg px-2.5 py-1 text-xs font-bold text-notte ${COLORI[s].fondo}`}>
            {SEZIONI[s].breve}
          </li>
        ))}
        {r.temi
          .filter((t) => !r.sezioni.includes(TEMA_SEZIONE[t] as Sezione))
          .map((t) => (
            <li key={t} className="rounded-lg border border-notte/15 px-2.5 py-1 text-xs font-bold text-notte-tenue">
              {t}
            </li>
          ))}
      </ul>
      {/* <details> nativo: funziona senza JavaScript, con tastiera e screen reader,
          e il testo resta nell'HTML (lo leggono anche i motori di ricerca). */}
      <details className="group rounded-2xl bg-crema/60 px-4 py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 font-extrabold text-notte [&::-webkit-details-marker]:hidden">
          Scopri di più
          <span aria-hidden className="text-viola transition-transform group-open:rotate-180">▾</span>
        </summary>
        <dl className="mt-2 grid gap-2 text-sm">
          {r.cosaFa && <VoceScheda nome="Cosa fa" valore={r.cosaFa} />}
          <VoceScheda nome="Per chi" valore={r.perChi} />
          {r.comeSiUsa && <VoceScheda nome="Come si usa" valore={r.comeSiUsa} />}
          <VoceScheda nome="Costi" valore={r.costi ?? "Da verificare sul sito"} />
        </dl>
      </details>
      <div className="mt-auto flex flex-col gap-2 pt-2">
        {reclamata && (
          <Link
            href={percorsoRisorsa(r)}
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-2xl border-2 border-notte px-4 py-2 font-extrabold text-notte transition-colors hover:border-viola hover:text-viola"
          >
            Apri la scheda completa <span aria-hidden>›</span>
          </Link>
        )}
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer nofollow external"
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-2xl bg-notte px-4 py-2 font-extrabold text-white transition-colors hover:bg-viola [overflow-wrap:anywhere]"
        >
          Sito ufficiale: {dominio(r.url)}
          <span aria-hidden>↗</span>
          <span className="sr-only"> (link esterno, si apre in una nuova scheda)</span>
        </a>
        <p className="text-xs text-notte-tenue">{AVVISO_LINK}</p>
        {!reclamata && !anteprima && (
          <Link
            href={`/aggiungi-attivita?scheda=${encodeURIComponent(chiaveRisorsa(r))}`}
            rel="nofollow"
            className="text-sm font-bold text-viola underline decoration-2 underline-offset-4"
          >
            È la tua realtà? Reclama la scheda
          </Link>
        )}
      </div>
    </article>
  );
}

function VoceScheda({ nome, valore }: { nome: string; valore: string }) {
  return (
    <div>
      <dt className="font-extrabold text-notte">{nome}</dt>
      <dd className="text-notte-tenue">{valore}</dd>
    </div>
  );
}
