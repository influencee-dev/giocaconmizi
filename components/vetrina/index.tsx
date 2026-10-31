import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { fotoSito, type CodiceFoto } from "@/lib/foto";
import { MiziIntero } from "@/components/illustrazioni";
import { Freccia } from "./freccia";

/**
 * I mattoni del template vetrina: card pastello con la foto incassata,
 * bottoni con la freccia, blocco "In breve", testata delle pagine,
 * fascia finale. Le foto arrivano da lib/foto.ts; finché mancano, ogni
 * riquadro mostra un'illustrazione su fondo pastello.
 */

export type Tono = "azzurro" | "rosa" | "giallo" | "viola" | "arancione" | "verde";

/** Classi letterali per Tailwind: card, sfondo del ripiego, pallino. */
export const TONI: Record<Tono, { card: string; ripiego: string; pieno: string }> = {
  azzurro: { card: "bg-[#E2F2FB] border-azzurro/45", ripiego: "from-azzurro/30 via-white to-viola/15", pieno: "bg-azzurro" },
  rosa: { card: "bg-[#FCE6EE] border-rosa/45", ripiego: "from-rosa/30 via-white to-giallo/20", pieno: "bg-rosa" },
  giallo: { card: "bg-[#FFF3CF] border-giallo/60", ripiego: "from-giallo/35 via-white to-arancione/15", pieno: "bg-giallo" },
  viola: { card: "bg-[#F0E8FA] border-viola/40", ripiego: "from-viola/25 via-white to-rosa/20", pieno: "bg-viola" },
  arancione: { card: "bg-[#FFEBD3] border-arancione/45", ripiego: "from-arancione/25 via-white to-giallo/25", pieno: "bg-arancione" },
  verde: { card: "bg-[#E3F4E7] border-verde/40", ripiego: "from-verde/20 via-white to-azzurro/20", pieno: "bg-verde" },
};

export { Freccia };

const STILI_BOTTONE = {
  viola: "bg-viola text-white hover:bg-notte",
  chiaro: "bg-white text-notte hover:bg-crema",
  notte: "bg-notte text-white hover:bg-viola",
  arancione: "bg-arancione text-white hover:bg-notte",
  rosa: "bg-rosa text-white hover:bg-viola",
} as const;

/** Bottone del template: angoli morbidi, testo in grassetto e freccia. */
export function BottoneFreccia({
  href,
  children,
  variante = "viola",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variante?: keyof typeof STILI_BOTTONE;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-tap
      className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 text-base font-extrabold transition-colors sm:text-lg ${STILI_BOTTONE[variante]} ${className}`}
    >
      {children}
      <Freccia />
    </Link>
  );
}

/**
 * Riquadro foto. Con la foto consegnata mostra il WebP (con la nota "foto
 * illustrativa"); senza, un fondo pastello con l'illustrazione di ripiego.
 */
export function Foto({
  codice,
  tono = "viola",
  ripiego,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  nota = true,
}: {
  codice: CodiceFoto;
  tono?: Tono;
  ripiego?: ReactNode;
  className?: string;
  sizes?: string;
  priority?: boolean;
  nota?: boolean;
}) {
  const foto = fotoSito(codice);
  if (foto) {
    return (
      <figure className={`relative overflow-hidden ${className}`}>
        <Image src={foto.src} alt={foto.alt} fill sizes={sizes} priority={priority} className="object-cover" />
        {nota && (
          <figcaption className="absolute bottom-2 right-2 rounded-lg bg-notte/55 px-2 py-0.5 text-[10px] font-bold text-white">
            Foto illustrativa AI
          </figcaption>
        )}
      </figure>
    );
  }
  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${TONI[tono].ripiego} ${className}`}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_92%_8%,rgba(255,255,255,0.55)_0_16%,transparent_17%),radial-gradient(circle_at_6%_96%,rgba(255,255,255,0.45)_0_20%,transparent_21%)]" />
      <div className="relative flex h-[72%] w-[72%] items-center justify-center">
        {ripiego ?? <MiziIntero className="h-full w-auto" />}
      </div>
    </div>
  );
}

/** Card pastello: foto incassata, titolo, testo, etichette e bottone scuro. */
export function CardPastello({
  href,
  tono,
  foto,
  titolo,
  testo,
  etichette = [],
  azione,
  livello = "h3",
}: {
  href: string;
  tono: Tono;
  foto: ReactNode;
  titolo: string;
  testo?: string;
  etichette?: string[];
  azione: string;
  livello?: "h2" | "h3";
}) {
  const Titolo = livello;
  return (
    <Link
      href={href}
      className={`group flex min-w-0 flex-col rounded-[1.6rem] border-2 p-2.5 transition-transform hover:-translate-y-1 ${TONI[tono].card}`}
    >
      <div className="overflow-hidden rounded-[1.1rem] bg-white">{foto}</div>
      <div className="flex grow flex-col gap-1.5 px-1.5 pb-1 pt-3 sm:px-2 sm:pt-4">
        <Titolo className="text-base font-extrabold leading-tight text-notte sm:text-xl">{titolo}</Titolo>
        {testo && <p className="text-sm leading-relaxed text-notte-tenue sm:text-[15px]">{testo}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {etichette.map((e) => (
              <span key={e} className="rounded-lg border border-notte/15 bg-white px-2.5 py-1 text-xs font-bold text-notte">
                {e}
              </span>
            ))}
          </div>
          <span className="rounded-xl bg-notte px-3.5 py-2 text-sm font-extrabold text-white transition-colors group-hover:bg-viola">
            {azione}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** La risposta in due righe, citabile dalle AI: sempre in alto. */
export function InBreve({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 rounded-[1.25rem] border-2 border-viola/35 bg-white p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5 ${className}`}>
      <span className="w-fit shrink-0 rounded-lg bg-viola px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
        In breve
      </span>
      <p className="text-base leading-relaxed text-notte-tenue sm:text-[17px]">{children}</p>
    </div>
  );
}

/** Titolo di sezione del template: grande, nero pieno, centrato. */
export function TitoloVetrina({
  children,
  sotto,
  allineo = "centro",
  as: Tag = "h2",
}: {
  children: ReactNode;
  sotto?: ReactNode;
  allineo?: "centro" | "sinistra";
  as?: "h1" | "h2";
}) {
  const centro = allineo === "centro";
  return (
    <div className={`flex flex-col gap-3 ${centro ? "items-center text-center" : ""}`}>
      <Tag className="text-[2rem] font-black leading-[1.08] tracking-tight text-notte sm:text-[2.6rem] lg:text-5xl">
        {children}
      </Tag>
      {sotto && <p className={`max-w-2xl text-base text-notte-tenue sm:text-lg ${centro ? "mx-auto" : ""}`}>{sotto}</p>}
    </div>
  );
}

/**
 * Testata delle pagine interne: riquadro pastello con occhiello, titolo
 * (l'H1 resta nella pagina, passato come children) e foto a destra.
 */
export function TestataPagina({
  occhiello,
  tono = "viola",
  foto,
  ripiego,
  children,
}: {
  occhiello?: string;
  tono?: Tono;
  foto?: CodiceFoto;
  ripiego?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`mb-10 overflow-hidden rounded-[2rem] border-2 ${TONI[tono].card}`}>
      <div className="grid items-center gap-6 p-5 sm:p-8 md:grid-cols-[1.15fr_1fr] md:gap-8 lg:p-10">
        <div className="testata flex min-w-0 flex-col gap-4">
          {occhiello && (
            <span className="w-fit rounded-full bg-white px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-notte">
              {occhiello}
            </span>
          )}
          {children}
        </div>
        {foto && (
          <Foto
            codice={foto}
            tono={tono}
            ripiego={ripiego}
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[4/3] w-full rounded-[1.4rem] bg-white"
          />
        )}
      </div>
    </section>
  );
}

/** Bollino rotondo e ruotato, come un adesivo. */
export function Bollino({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-36 w-36 -rotate-8 flex-col items-center justify-center gap-1 rounded-full border-[3px] border-dashed border-viola bg-white p-4 text-center shadow-xl ${className}`}
    >
      <span className="h-10 w-10">
        <MiziIntero className="h-full w-full" />
      </span>
      <span className="text-[13px] font-black leading-tight text-viola">{children}</span>
    </div>
  );
}

/** Cerchio d'azione della fascia finale. */
export function CerchioAzione({
  href,
  children,
  tono = "azzurro",
}: {
  href: string;
  children: ReactNode;
  tono?: "azzurro" | "giallo";
}) {
  return (
    <Link
      href={href}
      className={`flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-full text-center font-extrabold text-notte transition-transform hover:scale-105 sm:h-44 sm:w-44 ${tono === "azzurro" ? "bg-azzurro" : "bg-giallo"}`}
    >
      <Freccia className="h-10 w-10 sm:h-12 sm:w-12" />
      <span className="px-3 text-sm leading-tight sm:text-base">{children}</span>
    </Link>
  );
}

/** Fascia finale: foto larga e riquadro blu notte con i due cerchi. */
export function FasciaFinale({
  titolo,
  testo,
  azioni,
}: {
  titolo: string;
  testo: string;
  azioni: [{ href: string; etichetta: string }, { href: string; etichetta: string }];
}) {
  return (
    <section className="relative mt-6">
      <Foto
        codice="H-08"
        tono="giallo"
        sizes="100vw"
        className="h-64 w-full sm:h-96 lg:h-[30rem]"
        ripiego={<MiziIntero className="h-full w-auto" />}
      />
      <div className="relative mx-auto -mt-24 max-w-6xl px-4 sm:-mt-32 sm:px-8">
        <div className="flex flex-col items-center gap-6 rounded-[1.8rem] bg-notte p-6 text-center sm:p-10 md:flex-row md:justify-between md:text-left">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-[1.8rem] font-black leading-tight tracking-tight text-white sm:text-4xl">{titolo}</h2>
            <p className="text-base text-white/75 sm:text-lg">{testo}</p>
          </div>
          <div className="flex shrink-0 -space-x-4">
            <CerchioAzione href={azioni[0].href}>{azioni[0].etichetta}</CerchioAzione>
            <CerchioAzione href={azioni[1].href} tono="giallo">
              {azioni[1].etichetta}
            </CerchioAzione>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Domande frequenti a fisarmonica (details): leggibili anche senza JS. */
export function FaqVetrina({
  voci,
  colonne = true,
}: {
  voci: { domanda: string; risposta: string }[];
  colonne?: boolean;
}) {
  return (
    <div className={`grid gap-3 ${colonne ? "md:grid-cols-2" : ""}`}>
      {voci.map((v) => (
        <details key={v.domanda} className="group rounded-[1.2rem] border border-notte/10 bg-white p-5 open:shadow-sm">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-extrabold text-notte sm:text-lg [&::-webkit-details-marker]:hidden">
            <span>{v.domanda}</span>
            <span aria-hidden className="text-2xl font-black leading-none text-viola transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-2 text-[15px] leading-relaxed text-notte-tenue sm:text-base">{v.risposta}</p>
        </details>
      ))}
    </div>
  );
}
