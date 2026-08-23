import Link from "next/link";
import type { ReactNode } from "react";

/** Contenitore centrato, largo al massimo quanto una lettura comoda. */
export function Contenitore({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-4xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

const varianti = {
  rosa: "bg-rosa text-white hover:bg-rosa/90",
  azzurro: "bg-azzurro text-white hover:bg-azzurro/90",
  viola: "bg-viola text-white hover:bg-viola/90",
  giallo: "bg-giallo text-notte hover:bg-giallo/90",
  chiaro: "bg-white text-notte border-2 border-crema-scuro hover:border-viola",
} as const;

export type VarianteBottone = keyof typeof varianti;

/** Bottone-link. Rispetta il minimo di 64px imposto in globals.css. */
export function BottoneLink({
  href,
  children,
  variante = "rosa",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variante?: VarianteBottone;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-tap
      className={`inline-flex items-center justify-center gap-2 rounded-bolla px-6 py-4 text-lg font-bold transition-colors ${varianti[variante]} ${className}`}
    >
      {children}
    </Link>
  );
}

/** Titolo di sezione con la stessa impaginazione ovunque. */
export function TitoloSezione({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-extrabold text-notte sm:text-3xl">
      {children}
    </h2>
  );
}

/** Griglia di card: 1 colonna sul telefono, 2 dal tablet in su. */
export function Griglia({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

/** Card di un gioco nella griglia degli hub. */
export function CardGioco({
  slug,
  titolo,
  descrizione,
  eta,
  minuti,
}: {
  slug: string;
  titolo: string;
  descrizione: string;
  eta: string;
  minuti: number;
}) {
  return (
    <Link
      href={`/giochi/${slug}`}
      data-tap
      className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5 transition-colors hover:border-viola"
    >
      <span className="text-xl font-extrabold text-notte">{titolo}</span>
      <span className="text-notte-tenue">{descrizione}</span>
      <span className="mt-auto pt-2 text-sm font-bold text-viola">
        {eta} anni · {minuti} minuti
      </span>
    </Link>
  );
}

/** Blocco FAQ: la versione visibile della stessa lista che va in JSON-LD. */
export function Faq({ voci }: { voci: { domanda: string; risposta: string }[] }) {
  return (
    <section className="mt-10">
      <TitoloSezione>Domande frequenti</TitoloSezione>
      <dl className="flex flex-col gap-4">
        {voci.map((voce) => (
          <div
            key={voce.domanda}
            className="rounded-morbido border-2 border-crema-scuro bg-white p-5"
          >
            <dt className="font-extrabold text-notte">{voce.domanda}</dt>
            <dd className="mt-1 text-notte-tenue">{voce.risposta}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Testo lungo che arriva dai .md di content/. */
export function Prosa({ html }: { html: string }) {
  return (
    <div
      className="prosa flex flex-col gap-4 text-lg leading-relaxed text-notte"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
