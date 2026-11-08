import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Instagram, Mail, Phone } from "lucide-react";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { Briciole } from "@/components/directory/Briciole";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { CardRisorsa, COLORI, LogoRisorsa } from "@/components/risorse/CardRisorsa";
import { url } from "@/lib/seo";
import { AVVISO_LINK, DISCLAIMER, PERCORSO_RISORSE, SEZIONI, dominio, percorsoRisorsa, principaliDi } from "@/lib/risorse-educative";
import { linkSocial, risorseVisibili, type RisorsaVista } from "@/lib/risorse-reclamo";

/**
 * La pagina propria di una risorsa educativa. Esiste SOLO per chi ha reclamato
 * la scheda dal suo link personale e ha avuto l'approvazione di Giorgia: le
 * altre restano card nell'hub (niente pagine sottili). Testi, contatti e logo
 * li ha scritti o caricati la realtà stessa.
 */

// Le risposte approvate arrivano dal database: rigenerazione ogni 10 minuti.
export const revalidate = 600;

type P = { params: Promise<{ slug: string }> };

async function trova(params: P["params"]): Promise<{ r: RisorsaVista; tutte: RisorsaVista[] } | null> {
  const { slug } = await params;
  const tutte = await risorseVisibili();
  const r = tutte.find((x) => x.slug === slug);
  return r?.reclamata ? { r, tutte } : null;
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = await trova(params);
  if (!t) return { robots: { index: false, follow: false } };
  const { r } = t;
  const titolo = `${r.nome}${r.localita ? `, ${r.localita}` : ""}: cosa fa e per chi`;
  return {
    title: titolo,
    description: r.descrizione,
    alternates: { canonical: percorsoRisorsa(r) },
    openGraph: { title: titolo, description: r.descrizione, url: percorsoRisorsa(r), type: "website" },
  };
}

export default async function PaginaRisorsa({ params }: P) {
  const t = await trova(params);
  if (!t) notFound();
  const { r, tutte } = t;
  const e = r.extra;
  const social = (["instagram", "facebook", "tiktok", "youtube"] as const)
    .map((c) => ({ campo: c, href: linkSocial(c, e[c]) }))
    .filter((s): s is { campo: (typeof s)["campo"]; href: string } => s.href !== null);
  const email = e.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email) ? e.email : null;
  const telefono = e.telefono?.replace(/[^\d+]/g, "") || null;
  const principale = r.sezioni[0]!;
  const simili = principaliDi(principale, tutte).filter((x) => x.slug !== r.slug).slice(0, 3);

  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Risorse educative", percorso: PERCORSO_RISORSE },
          { nome: r.nome, percorso: percorsoRisorsa(r) },
        ])}
      />
      <JsonLd data={jsonLdOrganizzazione(r, social.map((s) => s.href), email, telefono)} />

      <div className="mb-4">
        <Briciole voci={[{ nome: "Risorse educative", href: PERCORSO_RISORSE }, { nome: r.nome }]} />
      </div>

      <header className={`flex flex-col gap-5 rounded-[1.8rem] p-6 sm:flex-row sm:items-center sm:p-8 ${COLORI[principale].fondo}`}>
        <LogoRisorsa risorsa={r} logo={r.logo} lato={96} />
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold text-notte [overflow-wrap:anywhere] sm:text-4xl">{r.nome}</h1>
          {r.localita && <p className="mt-1 font-bold text-notte-tenue">{r.localita}</p>}
          <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white/80 px-2.5 py-1 text-sm font-extrabold text-[#2E7D4A]">
            <span aria-hidden>✓</span> Scheda verificata dalla realtà
          </p>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-notte">{r.descrizione}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
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
          <ul aria-label="Sezioni" className="mt-5 flex flex-wrap gap-2">
            {r.sezioni.map((s) => (
              <li key={s}>
                <Link href={`${PERCORSO_RISORSE}?sezione=${s}#elenco`} className={`inline-block rounded-lg px-3 py-1.5 text-sm font-bold text-notte ${COLORI[s].fondo}`}>
                  {SEZIONI[s].nome}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <aside aria-labelledby="titolo-contatti" className="flex flex-col gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-6">
          <h2 id="titolo-contatti" className="text-xl font-extrabold text-notte">
            Contatti
          </h2>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer nofollow external"
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-notte px-4 py-2 font-extrabold text-white transition-colors hover:bg-viola [overflow-wrap:anywhere]"
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
            <a href={`tel:${telefono}`} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-notte px-4 py-2 font-extrabold text-notte">
              <Phone aria-hidden className="h-5 w-5 shrink-0" /> {e.telefono}
            </a>
          )}
          {social.length > 0 && (
            <ul aria-label="Social" className="flex flex-wrap gap-2">
              {social.map((s) => (
                <li key={s.campo}>
                  <a
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
          <p className="text-xs text-notte-tenue">{AVVISO_LINK}</p>
        </aside>
      </div>

      {simili.length > 0 && (
        <section className="mt-12">
          <TitoloSezione>Altre risorse: {SEZIONI[principale].nome.toLowerCase()}</TitoloSezione>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {simili.map((x) => (
              <li key={x.slug}>
                <CardRisorsa risorsa={x} reclamata={x.reclamata} logo={x.logo} />
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href={`${PERCORSO_RISORSE}#elenco`} className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4 hover:text-viola">
              Tutte le risorse educative consigliate
            </Link>
          </p>
        </section>
      )}

      <p className="mt-10 max-w-3xl text-sm text-notte-tenue">
        Testi, contatti e logo di questa scheda li ha forniti {r.nome}. {DISCLAIMER}
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

function jsonLdOrganizzazione(r: RisorsaVista, sameAs: string[], email: string | null, telefono: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url(percorsoRisorsa(r))}#organizzazione`,
    name: r.nome,
    url: r.url,
    description: r.descrizione,
    ...(r.logo ? { logo: url(`/loghi/risorse/${r.slug}.webp`) } : {}),
    ...(r.localita ? { address: { "@type": "PostalAddress", addressLocality: r.localita, addressCountry: "IT" } } : {}),
    ...(email ? { email } : {}),
    ...(telefono ? { telephone: telefono } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
