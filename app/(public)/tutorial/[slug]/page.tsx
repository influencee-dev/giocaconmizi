import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { Briciole, InBreve } from "@/components/directory/Briciole";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { PlayerTutorial } from "@/components/tutorial/PlayerTutorial";
import { url } from "@/lib/seo";
import { GRUPPI, PERCORSO_TUTORIAL, TUTORIAL, minuti, percorsoTutorial, tutorialDaSlug, tutorialDi } from "@/lib/tutorial";

/** La pagina di un video tutorial di Mizi (lib/tutorial.ts). */

export const dynamicParams = false;

export function generateStaticParams() {
  return TUTORIAL.map((t) => ({ slug: t.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = tutorialDaSlug((await params).slug);
  if (!t) return {};
  const titolo = `Video tutorial: ${t.titolo}`;
  return {
    title: titolo,
    description: t.descrizione,
    alternates: { canonical: percorsoTutorial(t) },
    openGraph: {
      title: titolo,
      description: t.descrizione,
      url: percorsoTutorial(t),
      type: "video.other",
      images: [{ url: t.video.poster, width: 1280, height: 720 }],
      videos: [{ url: t.video.src, type: "video/mp4", width: 1920, height: 1080 }],
    },
  };
}

export default async function PaginaTutorial({ params }: P) {
  const t = tutorialDaSlug((await params).slug);
  if (!t) notFound();
  const altri = tutorialDi(t.gruppo).filter((x) => x.slug !== t.slug);

  return (
    <Contenitore className="py-8 sm:py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Tutorial", percorso: PERCORSO_TUTORIAL },
          { nome: t.titolo, percorso: percorsoTutorial(t) },
        ])}
      />
      <JsonLd data={jsonLdVideo(t)} />
      <JsonLd data={jsonLdFaq(t.faq)} />

      <Briciole voci={[{ nome: "Tutorial", href: PERCORSO_TUTORIAL }, { nome: t.titolo }]} />
      <p className="mt-5 w-fit rounded-full bg-viola px-4 py-1 text-sm font-black text-white">
        Video tutorial · {GRUPPI[t.gruppo].titolo.toLowerCase()}
      </p>
      <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-notte sm:text-5xl">{t.titolo}</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        {t.descrizione} Dura {minuti(t.video.secondi)} minuti; i sottotitoli sono già dentro il video.
      </p>

      <div className="mt-6">
        <PlayerTutorial t={t} />
      </div>

      <div className="mt-8">
        <InBreve testo={t.rispostaBreve} />
      </div>

      <section className="mt-10" aria-labelledby="titolo-testo">
        <h2 id="titolo-testo" className="text-2xl font-black text-notte sm:text-3xl">
          Cosa dice Mizi nel video
        </h2>
        <div className="mt-4 flex max-w-3xl flex-col gap-3 text-lg text-notte-tenue">
          {t.video.testo.map((frase) => (
            <p key={frase}>{frase}</p>
          ))}
        </div>
        <p className="mt-5">
          <Link href={t.pagina.href} className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4 hover:text-viola">
            {t.pagina.testo}
          </Link>
        </p>
      </section>

      <Faq voci={t.faq} />

      <section className="mt-12">
        <TitoloSezione>Altri tutorial</TitoloSezione>
        {altri.length > 0 ? (
          <ul className="flex flex-col gap-2 text-lg">
            {altri.map((x) => (
              <li key={x.slug}>
                <Link href={percorsoTutorial(x)} className="font-bold text-notte underline decoration-viola decoration-2 underline-offset-4">
                  {x.titolo}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3">
          <Link href={PERCORSO_TUTORIAL} className="font-extrabold text-viola">
            Tutti i video tutorial di Mizi ›
          </Link>
        </p>
      </section>
    </Contenitore>
  );
}

/** VideoObject con i «momenti chiave» (Clip): Google li mostra come capitoli. */
function jsonLdVideo(t: NonNullable<ReturnType<typeof tutorialDaSlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: t.titolo,
    description: t.descrizione,
    thumbnailUrl: [url(t.video.poster)],
    uploadDate: t.video.caricato,
    duration: t.video.durata,
    contentUrl: url(t.video.src),
    embedUrl: url(percorsoTutorial(t)),
    inLanguage: "it-IT",
    transcript: t.video.testo.join(" "),
    hasPart: t.capitoli.map((c, i) => ({
      "@type": "Clip",
      name: c.titolo,
      startOffset: c.da,
      endOffset: t.capitoli[i + 1]?.da ?? t.video.secondi,
      url: `${url(percorsoTutorial(t))}?t=${c.da}`,
    })),
  };
}
