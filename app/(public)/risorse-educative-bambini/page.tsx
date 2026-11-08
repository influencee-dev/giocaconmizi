import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TestataPagina } from "@/components/vetrina";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { Briciole } from "@/components/directory/Briciole";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { TITOLARE } from "@/lib/legal";
import { site, url } from "@/lib/seo";
import { PERCORSO_TRAPPOLA } from "@/lib/protezione/limiti";
import {
  AVVISO_LINK,
  DISCLAIMER,
  FAQ_RISORSE,
  LINK_CONTROLLATI,
  ORDINE_SEZIONI,
  PERCORSO_RISORSE,
  RISPOSTA_BREVE,
  SEZIONI,
  contaRisorse,
  dominio,
  eSezione,
  iniziali,
  paginaDi,
  principaliDi,
  type Risorsa,
  type Sezione,
} from "@/lib/risorse-educative";

/**
 * Hub «Risorse educative consigliate». HTML generato sul server: la vista
 * completa (indicizzabile) mostra ogni scheda una volta, nella sua sezione
 * principale; la vista filtrata (?sezione=…&pagina=…) è paginata sul server,
 * noindex,follow e col canonical verso l'hub. Nessun JSON con l'elenco: il
 * browser riceve solo le schede che vede.
 */

type Parametri = Promise<{ sezione?: string | string[]; pagina?: string | string[] }>;

const TITOLO = "Risorse educative per bambini e insegnanti | Gioca con Mizi";
const DESCRIZIONE =
  "Scopri risorse educative, scuole, attività e siti utili per bambini, famiglie e insegnanti: lettura, creatività e coding.";
const H1 = "Risorse educative per bambini, famiglie e insegnanti";

function leggi(p: Awaited<Parametri>) {
  const sezione = Array.isArray(p.sezione) ? p.sezione[0] : p.sezione;
  const pagina = Array.isArray(p.pagina) ? p.pagina[0] : p.pagina;
  return { sezione, pagina };
}

export async function generateMetadata({ searchParams }: { searchParams: Parametri }): Promise<Metadata> {
  const { sezione, pagina } = leggi(await searchParams);
  const filtrata = sezione !== undefined || pagina !== undefined;
  return {
    // absolute: il title richiesto è già completo, senza il suffisso del layout.
    title: { absolute: TITOLO },
    description: DESCRIZIONE,
    alternates: { canonical: PERCORSO_RISORSE },
    // Le viste filtrate non competono con l'hub: si seguono i link ma non si indicizzano.
    robots: filtrata ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: TITOLO, description: DESCRIZIONE, url: PERCORSO_RISORSE, type: "website" },
  };
}

const COLORI: Record<Sezione, { pallino: string; fondo: string }> = {
  famiglie: { pallino: "bg-rosa", fondo: "bg-[#FCE6EE]" },
  insegnanti: { pallino: "bg-verde", fondo: "bg-[#E3F4E7]" },
  territorio: { pallino: "bg-arancione", fondo: "bg-[#FFEBD3]" },
  coding: { pallino: "bg-azzurro", fondo: "bg-[#E2F2FB]" },
  lettura: { pallino: "bg-viola", fondo: "bg-[#F0E8FA]" },
};

export default async function RisorseEducativePage({ searchParams }: { searchParams: Parametri }) {
  const { sezione, pagina } = leggi(await searchParams);
  const filtro = eSezione(sezione) ? sezione : null;
  const numero = pagina === undefined ? 1 : Number(pagina);
  const risultati = filtro ? paginaDi(filtro, numero) : null;
  if (filtro && !risultati) notFound();

  // Le schede che il JSON-LD elenca sono esattamente quelle visibili.
  const visibili: Risorsa[] = risultati
    ? risultati.voci
    : ORDINE_SEZIONI.flatMap((s) => principaliDi(s));

  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Risorse educative", percorso: PERCORSO_RISORSE }])} />
      <JsonLd data={jsonLdCollezione(visibili)} />
      <JsonLd data={jsonLdFaq([...FAQ_RISORSE])} />

      <div className="mb-4">
        <Briciole voci={[{ nome: "Risorse educative" }]} />
      </div>

      <TestataPagina occhiello="Risorse educative consigliate" tono="verde" foto="I-04">
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{H1}</h1>
        <p className="max-w-2xl text-lg font-semibold text-notte">{RISPOSTA_BREVE}</p>
        <p className="max-w-2xl text-notte-tenue">
          Qui raccogliamo {contaRisorse()} realtà, siti e progetti utili a bambini, famiglie e
          insegnanti: idee per leggere, creare, imparare con il digitale e scoprire attività sul
          territorio.
        </p>
      </TestataPagina>

      <p className="max-w-3xl rounded-[1.2rem] border border-notte/10 bg-white p-5 text-notte-tenue">
        {DISCLAIMER} Link controllati il {LINK_CONTROLLATI}.
      </p>

      {/* Filtri: semplici link, funzionano senza JavaScript e con ogni lettore di schermo. */}
      <nav aria-label="Filtra le risorse per sezione" className="mt-8" id="elenco">
        <p className="mb-3 font-extrabold text-notte">Filtra per sezione</p>
        <ul className="flex flex-wrap gap-2.5">
          <li>
            <Link
              href={`${PERCORSO_RISORSE}#elenco`}
              aria-current={!filtro ? "page" : undefined}
              className={chip(!filtro)}
            >
              Tutte
            </Link>
          </li>
          {ORDINE_SEZIONI.map((s) => (
            <li key={s}>
              <Link
                href={`${PERCORSO_RISORSE}?sezione=${s}#elenco`}
                aria-current={filtro === s ? "page" : undefined}
                className={chip(filtro === s)}
              >
                <span aria-hidden className={`h-3 w-3 shrink-0 rounded-full ${COLORI[s].pallino}`} />
                {SEZIONI[s].nome}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {risultati && filtro ? (
        <section className="mt-10" aria-labelledby="titolo-filtro">
          <h2 id="titolo-filtro" className="mb-2 text-[1.75rem] font-black leading-tight tracking-tight text-notte sm:text-4xl">
            {SEZIONI[filtro].nome}
          </h2>
          <p className="mb-5 max-w-2xl text-notte-tenue">{SEZIONI[filtro].descrizione}</p>
          <p className="mb-4 text-sm font-bold text-notte-tenue" role="status">
            {risultati.totale} risorse · pagina {risultati.pagina} di {risultati.pagine}
          </p>
          <Elenco voci={risultati.voci} />
          {risultati.pagine > 1 && <Paginazione sezione={filtro} pagina={risultati.pagina} pagine={risultati.pagine} />}
        </section>
      ) : (
        ORDINE_SEZIONI.map((s) => (
          <section key={s} id={s} className="mt-12 scroll-mt-28" aria-labelledby={`titolo-${s}`}>
            <div className="mb-1 flex items-center gap-3">
              <span aria-hidden className={`h-4 w-4 shrink-0 rounded-full ${COLORI[s].pallino}`} />
              <h2 id={`titolo-${s}`} className="text-[1.75rem] font-black leading-tight tracking-tight text-notte sm:text-4xl">
                {SEZIONI[s].nome}
              </h2>
            </div>
            <p className="mb-5 max-w-2xl text-notte-tenue">{SEZIONI[s].descrizione}</p>
            <Elenco voci={principaliDi(s)} />
            <p className="mt-4">
              <Link
                href={`${PERCORSO_RISORSE}?sezione=${s}#elenco`}
                className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4 hover:text-viola"
              >
                Vedi tutte le risorse «{SEZIONI[s].breve}», anche quelle di altre sezioni
              </Link>
            </p>
          </section>
        ))
      )}

      {/*
        Trappola per bot (honeypot): nascosta a chi naviga e agli screen reader
        (attributo hidden = fuori dall'albero di accessibilità), fuori dal tab,
        vietata in robots.txt e assente dalla sitemap. Una persona non la può
        raggiungere; un crawler corretto la salta. Vedi lib/protezione/limiti.ts.
      */}
      <a href={PERCORSO_TRAPPOLA} hidden aria-hidden="true" tabIndex={-1} rel="nofollow">
        Archivio
      </a>

      <Faq voci={[...FAQ_RISORSE]} />

      <section className="mt-12">
        <TitoloSezione>Continua con Gioca con Mizi</TitoloSezione>
        <ul className="flex flex-col gap-2 text-lg text-notte-tenue">
          <li>
            <Link href="/giochi" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Giochi didattici online
            </Link>{" "}
            per bambini dai 3 ai 12 anni: lettura, matematica, inglese e coding, gratis e senza pubblicità.
          </li>
          <li>
            <Link href="/per-insegnanti" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Giochi da usare in classe
            </Link>{" "}
            con la LIM o sui tablet, senza registrazione.
          </li>
          <li>
            <Link href="/storie" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Storie da leggere
            </Link>{" "}
            in stampatello, minuscolo o corsivo, con lettura ad alta voce.
          </li>
          <li>
            <Link href="/guide" className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
              Guide per i genitori
            </Link>{" "}
            con risposte brevi e giochi collegati.
          </li>
        </ul>
      </section>

      <section className="mt-12 rounded-[1.4rem] border border-notte/10 bg-white p-5">
        <p className="font-extrabold text-notte">Segnala una risorsa o una correzione</p>
        <p className="mt-1 text-notte-tenue">
          Gestisci una delle realtà elencate e vuoi correggere o togliere la scheda, oppure conosci un
          progetto utile? Scrivi a{" "}
          <a href={`mailto:${TITOLARE.email}`} className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
            {TITOLARE.email}
          </a>
          .
        </p>
        <p className="mt-3 text-sm text-notte-tenue">{DISCLAIMER}</p>
      </section>
    </Contenitore>
  );
}

/** Un tema del foglio già detto da una sezione della card non si ripete. */
const TEMA_SEZIONE: Record<string, Sezione | undefined> = {
  "Famiglie e genitorialità": "famiglie",
  "Scuola e didattica": "insegnanti",
  "Territorio e attività": "territorio",
  "Coding e STEM": "coding",
  "Lettura e storie": "lettura",
};

function chip(attivo: boolean) {
  return `inline-flex min-h-12 items-center gap-2 rounded-bolla border-2 px-4 py-2 text-[15px] font-bold transition-colors ${
    attivo ? "border-notte bg-notte text-white" : "border-crema-scuro bg-white text-notte hover:border-viola"
  }`;
}

function Elenco({ voci }: { voci: Risorsa[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {voci.map((r) => (
        <li key={r.url}>
          <CardRisorsa risorsa={r} />
        </li>
      ))}
    </ul>
  );
}

function CardRisorsa({ risorsa: r }: { risorsa: Risorsa }) {
  const principale = r.sezioni[0]!;
  return (
    <article className="flex h-full flex-col gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-5">
      <div className="flex items-start gap-3">
        {/* Iniziali al posto del logo: nessun marchio preso dai siti esterni. */}
        <span
          aria-hidden
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-notte ${COLORI[principale].fondo}`}
        >
          {iniziali(r.nome)}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold leading-snug text-notte [overflow-wrap:anywhere]">{r.nome}</h3>
          {r.localita && <p className="text-sm font-bold text-notte-tenue">{r.localita}</p>}
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

function Paginazione({ sezione, pagina, pagine }: { sezione: Sezione; pagina: number; pagine: number }) {
  const href = (n: number) => `${PERCORSO_RISORSE}?sezione=${sezione}${n > 1 ? `&pagina=${n}` : ""}#elenco`;
  return (
    <nav aria-label="Pagine dei risultati" className="mt-8">
      <ul className="flex flex-wrap items-center gap-2">
        {pagina > 1 && (
          <li>
            <Link href={href(pagina - 1)} rel="prev" className={chip(false)}>
              ← Precedente
            </Link>
          </li>
        )}
        {Array.from({ length: pagine }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <Link href={href(n)} aria-current={n === pagina ? "page" : undefined} aria-label={`Pagina ${n}`} className={chip(n === pagina)}>
              {n}
            </Link>
          </li>
        ))}
        {pagina < pagine && (
          <li>
            <Link href={href(pagina + 1)} rel="next" className={chip(false)}>
              Successiva →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

/** CollectionPage + ItemList: solo le schede visibili, con la stessa descrizione della card. */
function jsonLdCollezione(voci: Risorsa[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url(PERCORSO_RISORSE),
    url: url(PERCORSO_RISORSE),
    name: H1,
    description: "Una raccolta di risorse esterne utili per bambini, famiglie e insegnanti.",
    inLanguage: site.lingua,
    isPartOf: { "@type": "WebSite", name: site.nome, url: url("/") },
    mainEntity: {
      "@type": "ItemList",
      name: "Risorse educative selezionate",
      numberOfItems: voci.length,
      itemListElement: voci.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "WebPage", name: r.nome, url: r.url, description: r.descrizione },
      })),
    },
  };
}
