import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Instagram, Mail, Phone } from "lucide-react";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { Briciole, InBreve } from "@/components/directory/Briciole";
import { Illustrazione } from "@/components/directory/Illustrazione";
import { Contatore } from "@/components/directory/Contatore";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco, jsonLdFaq } from "@/components/seo/JsonLd";
import { LogoRisorsa } from "@/components/risorse/CardRisorsa";
import { CardRisorsaDirectory } from "@/components/risorse/CardRisorsaDirectory";
import { CtaRisorsa, NavCategorieRisorse } from "@/components/risorse/Directory";
import { url } from "@/lib/seo";
import { RISORSE } from "@/lib/risorse-educative-dati";
import { DATA_ANTEPRIME, anteprimaSito } from "@/lib/risorse-anteprime";
import { AVVISO_LINK, DISCLAIMER, PERCORSO_RISORSE, chiaveRisorsa, dominio, percorsoRisorsa } from "@/lib/risorse-educative";
import { linkSocial, risorseVisibili, type RisorsaVista } from "@/lib/risorse-reclamo";
import {
  CATEGORIE_RISORSE,
  MIN_LISTING_RISORSE,
  categoriaDiRisorsa,
  categoriaRisorsaDaSlug,
  categorieAttive,
  percorsoCategoriaRisorse,
  percorsoListingRisorse,
  provinceDi,
  provinciaDi,
  risorseDi,
  type CategoriaRisorsa,
} from "@/lib/risorse-categorie";

/**
 * Un livello solo per due tipi di pagina (lib/risorse-categorie.ts):
 *   - la pagina di una CATEGORIA (/risorse-educative-bambini/cooperative-educative)
 *   - la SCHEDA di una realtà (/risorse-educative-bambini/cooperativa-indaco),
 *     l'indirizzo stabile che parte nelle email di Giorgia.
 * Ogni realtà ha la sua scheda con quello che abbiamo trovato sul sito
 * ufficiale; chi la reclama la completa (contatti, logo) e prende il bollino.
 */

// Le risposte approvate arrivano dal database: rigenerazione ogni 10 minuti.
export const revalidate = 600;
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...categorieAttive(RISORSE).map((c) => ({ slug: c.slug })),
    ...RISORSE.map((r) => ({ slug: r.slug })),
  ];
}

type P = { params: Promise<{ slug: string }> };

async function trova(params: P["params"]) {
  const { slug } = await params;
  const tutte = await risorseVisibili();
  const cat = categoriaRisorsaDaSlug(slug);
  if (cat) return risorseDi(cat.slug, tutte).length ? ({ tipo: "categoria", cat, tutte } as const) : null;
  const r = tutte.find((x) => x.slug === slug);
  return r ? ({ tipo: "scheda", r, tutte } as const) : null;
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = await trova(params);
  if (!t) return {};
  if (t.tipo === "categoria") {
    const { cat } = t;
    const dove = cat.ambito === "territorio" ? ": provincia per provincia" : " per famiglie e scuole";
    return {
      title: `${cat.titolo}${dove}`,
      description: `${cat.sottotitolo} Schede con cosa fanno, per chi e come scegliere.`,
      alternates: { canonical: percorsoCategoriaRisorse(cat) },
    };
  }
  const { r } = t;
  const cat = categoriaDiRisorsa(r);
  const titolo = `${r.nome}${r.localita ? `, ${r.localita}` : ""}: cosa fa e per chi`;
  const descrizione = `${r.descrizione} ${cat.nome}${r.localita ? ` a ${r.localita}` : ""}: scheda, contatti e come scegliere.`;
  return {
    title: titolo,
    description: descrizione,
    alternates: { canonical: percorsoRisorsa(r) },
    openGraph: { title: titolo, description: r.descrizione, url: percorsoRisorsa(r), type: "website" },
  };
}

export default async function Pagina({ params }: P) {
  const t = await trova(params);
  if (!t) notFound();
  return t.tipo === "categoria" ? <PaginaCategoria cat={t.cat} tutte={t.tutte} /> : <PaginaScheda r={t.r} tutte={t.tutte} />;
}

/* ------------------------------------------------------------------ */
/* Pagina categoria                                                    */
/* ------------------------------------------------------------------ */

function PaginaCategoria({ cat, tutte }: { cat: CategoriaRisorsa; tutte: RisorsaVista[] }) {
  const voci = risorseDi(cat.slug, tutte);
  const province = cat.ambito === "territorio" ? provinceDi(cat.slug, tutte) : [];
  const hrefProvincia = (slug: string, n: number) =>
    n >= MIN_LISTING_RISORSE ? percorsoListingRisorse(cat, slug) : percorsoRisorsa(voci.find((r) => provinciaDi(r)?.slug === slug)!);
  const altre = categorieAttive(tutte).filter((c) => c.slug !== cat.slug);

  return (
    <>
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Risorse educative", percorso: PERCORSO_RISORSE },
          { nome: cat.nome, percorso: percorsoCategoriaRisorse(cat) },
        ])}
      />
      <JsonLd data={jsonLdFaq(cat.faq)} />
      <JsonLd data={jsonLdElenco(cat.titolo, voci.map((r) => ({ nome: r.nome, percorso: percorsoRisorsa(r) })))} />

      <div style={{ background: cat.colore }}>
        <Contenitore largo className="flex flex-col gap-4 pb-10 pt-8 sm:pb-14 sm:pt-10">
          <Briciole voci={[{ nome: "Risorse educative", href: PERCORSO_RISORSE }, { nome: cat.nome }]} />
          <h1 className="max-w-3xl text-[2.1rem] font-black leading-[1.05] tracking-tight text-notte sm:text-5xl lg:text-6xl">{cat.titolo}</h1>
          <p className="max-w-2xl text-lg font-semibold text-notte-tenue">{cat.sottotitolo}</p>
          <p className="text-sm font-extrabold text-notte">
            {voci.length} realtà · {cat.ambito === "territorio" ? `${province.length} province` : "online, in tutta Italia"}
          </p>
        </Contenitore>
      </div>

      <Contenitore largo className="-mt-6 sm:-mt-8">
        <NavCategorieRisorse categorie={categorieAttive(tutte)} attuale={cat.slug} />
      </Contenitore>

      <Contenitore largo className="py-8">
        <InBreve testo={cat.rispostaBreve} />

        {province.length > 1 && (
          <section className="mt-10">
            <TitoloSezione>Cerca per provincia</TitoloSezione>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {province.map((p) => (
                <Link
                  key={p.slug}
                  href={hrefProvincia(p.slug, p.n)}
                  className="flex items-center justify-between gap-2 rounded-xl border-2 border-crema-scuro bg-white px-4 py-3 font-extrabold text-notte hover:border-viola"
                >
                  <span>{p.provincia}</span>
                  <span className="text-xs text-viola">{p.n} ›</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <TitoloSezione>Tutte le schede</TitoloSezione>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {voci.map((r) => (
              <li key={r.slug}>
                <CardRisorsaDirectory r={r} />
              </li>
            ))}
          </ul>
        </section>

        <ComeScegliere cat={cat} />

        <Faq voci={cat.faq} />

        {altre.length > 0 && (
          <section className="mt-10">
            <TitoloSezione>Altre risorse educative</TitoloSezione>
            <div className="flex flex-wrap gap-2">
              {altre.map((c) => (
                <Link key={c.slug} href={percorsoCategoriaRisorse(c)} className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola">
                  {c.nome}
                </Link>
              ))}
            </div>
          </section>
        )}

        <CtaRisorsa />
      </Contenitore>
    </>
  );
}

function ComeScegliere({ cat }: { cat: CategoriaRisorsa }) {
  return (
    <section className="mt-10 rounded-[1.4rem] bg-[#FEF3D1] p-6">
      <h2 className="text-2xl font-extrabold text-notte">Cosa guardare prima di scegliere</h2>
      <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-notte">
        {cat.comeScegliere.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Scheda di una realtà                                                */
/* ------------------------------------------------------------------ */

function PaginaScheda({ r, tutte }: { r: RisorsaVista; tutte: RisorsaVista[] }) {
  const cat = categoriaDiRisorsa(r);
  const prov = provinciaDi(r);
  const foto = anteprimaSito(r.slug);
  const e = r.extra;
  const social = (["instagram", "facebook", "tiktok", "youtube"] as const)
    .map((c) => ({ campo: c, href: linkSocial(c, e[c]) }))
    .filter((s): s is { campo: (typeof s)["campo"]; href: string } => s.href !== null);
  const email = e.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email) ? e.email : null;
  const telefono = e.telefono?.replace(/[^\d+]/g, "") || null;
  const stessaCategoria = risorseDi(cat.slug, tutte).filter((x) => x.slug !== r.slug);
  // Prima le realtà della stessa provincia, poi le altre della categoria.
  const simili = [
    ...stessaCategoria.filter((x) => prov && provinciaDi(x)?.slug === prov.slug),
    ...stessaCategoria.filter((x) => !prov || provinciaDi(x)?.slug !== prov.slug),
  ].slice(0, 3);
  const listingProv = prov && cat.ambito === "territorio" && risorseDi(cat.slug, tutte, prov.slug).length >= MIN_LISTING_RISORSE;

  return (
    <Contenitore largo className="pb-10 pt-8">
      <Contatore scheda={chiaveRisorsa(r)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Risorse educative", percorso: PERCORSO_RISORSE },
          { nome: cat.nome, percorso: percorsoCategoriaRisorse(cat) },
          { nome: r.nome, percorso: percorsoRisorsa(r) },
        ])}
      />
      <JsonLd data={jsonLdOrganizzazione(r, cat, social.map((s) => s.href), email, telefono)} />

      <div className="mb-4">
        <Briciole
          voci={[
            { nome: "Risorse educative", href: PERCORSO_RISORSE },
            { nome: cat.nome, href: percorsoCategoriaRisorse(cat) },
            { nome: r.nome },
          ]}
        />
      </div>

      <header className="overflow-hidden rounded-[1.8rem] border border-notte/10 bg-white">
        <div className="relative">
          {foto ? (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- WebP già ottimizzati, servito dal nostro dominio */}
              <img
                src={foto.src}
                srcSet={foto.srcSet}
                sizes="(min-width: 1280px) 1200px, 100vw"
                alt={`La homepage del sito di ${r.nome}`}
                className="aspect-[16/9] max-h-[26rem] w-full border-b border-notte/10 object-cover object-top"
              />
              <figcaption className="px-6 pt-3 text-xs font-semibold text-notte-tenue sm:px-8">
                Anteprima della homepage di {dominio(r.url)}, fotografata il {DATA_ANTEPRIME}.
              </figcaption>
            </figure>
          ) : (
            <Illustrazione colore={cat.colore} icona={cat.icona} alta="h-40 sm:h-52" grande />
          )}
          <span className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            <Link href={percorsoCategoriaRisorse(cat)} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-notte">
              {cat.nome}
            </Link>
          </span>
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:p-8">
          {r.logo && <LogoRisorsa risorsa={r} logo lato={96} />}
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold text-notte [overflow-wrap:anywhere] sm:text-4xl">{r.nome}</h1>
            <p className="mt-1 font-bold text-notte-tenue">{r.localita ?? "Online, in tutta Italia"}</p>
            {r.reclamata ? (
              <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-[#E3F4E8] px-2.5 py-1 text-sm font-extrabold text-[#2E7D4A]">
                <span aria-hidden>✓</span> Scheda verificata dalla realtà
              </p>
            ) : (
              <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-crema px-2.5 py-1 text-sm font-bold text-notte-tenue">
                Scheda scritta da Giocamizi dal sito ufficiale
              </p>
            )}
            <p className="mt-3 max-w-2xl text-lg font-semibold text-notte">{r.descrizione}</p>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="flex flex-col gap-8">
          <section aria-labelledby="titolo-dettagli" className="rounded-[1.4rem] border border-notte/10 bg-white p-6">
            <h2 id="titolo-dettagli" className="text-2xl font-extrabold text-notte">
              Cosa fa e per chi
            </h2>
            <dl className="mt-4 grid gap-4">
              {r.cosaFa && <Voce nome="Cosa fa" valore={r.cosaFa} />}
              <Voce nome="Per chi" valore={r.perChi} />
              {r.comeSiUsa && <Voce nome="Come si partecipa" valore={r.comeSiUsa} />}
              <Voce nome="Costi" valore={r.costi ?? "Da verificare sul sito"} />
              {e.sede && <Voce nome="Sede o zona" valore={e.sede} />}
              {e.orari && <Voce nome="Orari" valore={e.orari} />}
            </dl>
            {r.temi.length > 0 && (
              <ul aria-label="Temi" className="mt-5 flex flex-wrap gap-2">
                {r.temi.map((tema) => (
                  <li key={tema} className="rounded-lg border border-notte/15 px-3 py-1.5 text-sm font-bold text-notte-tenue">
                    {tema}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <ComeScegliere cat={cat} />
        </div>

        <aside aria-labelledby="titolo-contatti" className="flex flex-col gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-6 shadow-[0_10px_30px_rgba(31,36,48,0.08)]">
          <h2 id="titolo-contatti" className="text-xl font-extrabold text-notte">
            Contatti
          </h2>
          <a
            data-traccia="sito"
            href={r.url}
            target="_blank"
            rel="noopener noreferrer nofollow external"
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-viola px-4 py-2 font-extrabold text-white transition-colors hover:bg-notte [overflow-wrap:anywhere]"
          >
            <Globe aria-hidden className="h-5 w-5 shrink-0" /> {dominio(r.url)}
            <span className="sr-only"> (sito ufficiale, si apre in una nuova scheda)</span>
          </a>
          {email && (
            <a href={`mailto:${email}`} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-notte px-4 py-2 font-extrabold text-notte [overflow-wrap:anywhere]">
              <Mail aria-hidden className="h-5 w-5 shrink-0" /> {email}
            </a>
          )}
          {telefono && (
            <a data-traccia="telefono" href={`tel:${telefono}`} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-notte px-4 py-2 font-extrabold text-notte">
              <Phone aria-hidden className="h-5 w-5 shrink-0" /> {e.telefono}
            </a>
          )}
          {social.length > 0 && (
            <ul aria-label="Social" className="flex flex-wrap gap-2">
              {social.map((s) => (
                <li key={s.campo}>
                  <a
                    data-traccia="social"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow external"
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-notte/15 px-3 py-2 text-sm font-bold capitalize text-notte hover:border-viola"
                  >
                    {s.campo === "instagram" && <Instagram aria-hidden className="h-4 w-4" />}
                    {s.campo}
                    <span className="sr-only"> (si apre in una nuova scheda)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {!r.reclamata && (
            <p className="text-sm font-semibold text-notte-tenue">Email, telefono e orari li aggiunge la realtà quando reclama la scheda.</p>
          )}
          <p className="text-xs text-notte-tenue">{AVVISO_LINK}</p>
        </aside>
      </div>

      {!r.reclamata && <CtaRisorsa risorsa={r} />}

      {simili.length > 0 && (
        <section className="mt-12">
          <TitoloSezione>Altre realtà: {cat.nome.toLowerCase()}</TitoloSezione>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {simili.map((x) => (
              <li key={x.slug}>
                <CardRisorsaDirectory r={x} />
              </li>
            ))}
          </ul>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {listingProv && prov && (
              <Link href={percorsoListingRisorse(cat, prov.slug)} className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4 hover:text-viola">
                {cat.nome} in provincia di {prov.provincia}
              </Link>
            )}
            <Link href={percorsoCategoriaRisorse(cat)} className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4 hover:text-viola">
              Tutte le {cat.nome.toLowerCase()}
            </Link>
          </p>
        </section>
      )}

      <p className="mt-10 max-w-3xl text-sm text-notte-tenue">
        {r.reclamata ? `Testi, contatti e logo di questa scheda li ha forniti ${r.nome}. ` : `Questa scheda l'ha scritta Giocamizi rileggendo il sito ufficiale di ${r.nome}. `}
        {DISCLAIMER}
      </p>
    </Contenitore>
  );
}

function Voce({ nome, valore }: { nome: string; valore: string }) {
  return (
    <div>
      <dt className="font-extrabold text-notte">{nome}</dt>
      <dd className="whitespace-pre-line text-notte-tenue">{valore}</dd>
    </div>
  );
}

function jsonLdOrganizzazione(r: RisorsaVista, cat: CategoriaRisorsa, sameAs: string[], email: string | null, telefono: string | null) {
  const prov = provinciaDi(r);
  return {
    "@context": "https://schema.org",
    "@type": cat.schema,
    "@id": `${url(percorsoRisorsa(r))}#organizzazione`,
    name: r.nome,
    url: r.url,
    description: r.descrizione,
    ...(r.logo ? { logo: url(`/loghi/risorse/${r.slug}.webp`) } : {}),
    ...(prov
      ? { address: { "@type": "PostalAddress", addressLocality: prov.comune, addressRegion: prov.sigla, addressCountry: "IT" } }
      : {}),
    ...(email ? { email } : {}),
    ...(telefono ? { telephone: telefono } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

// Categorie e schede condividono il livello dell'indirizzo: mai lo stesso slug.
const doppioni = CATEGORIE_RISORSE.filter((c) => RISORSE.some((r) => r.slug === c.slug));
if (doppioni.length) throw new Error(`Slug usato sia da una categoria sia da una risorsa: ${doppioni.map((c) => c.slug).join(", ")}`);
