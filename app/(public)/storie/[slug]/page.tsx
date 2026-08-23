import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storia, tutteLeStorie } from "@/lib/content";
import { Contenitore } from "@/components/ui";
import { LettoreStoria } from "@/components/font-switcher/FontSwitcher";
import { JsonLd, jsonLdBreadcrumb, jsonLdStoria } from "@/components/seo/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tutteLeStorie().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = storia(slug);
  if (!s) return {};
  return {
    title: s.title,
    description:
      s.summary ??
      `${s.title}: storia da leggere per bambini di ${s.age} anni, in stampatello, minuscolo o corsivo.`,
    alternates: { canonical: `/storie/${slug}` },
  };
}

export default async function StoriaPage({ params }: Params) {
  const { slug } = await params;
  const s = storia(slug);
  if (!s) notFound();

  return (
    <Contenitore className="py-10">
      <JsonLd data={jsonLdStoria(s)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Storie", percorso: "/storie" },
          { nome: `${s.age} anni`, percorso: `/storie/eta/${s.age}-anni` },
          { nome: s.title, percorso: `/storie/${s.slug}` },
        ])}
      />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{s.title}</h1>
      <p className="mt-2 font-bold text-viola">
        {s.age} anni · {s.minutes} minuti di lettura
      </p>

      <div className="mt-8">
        <LettoreStoria testo={s.testo} />
      </div>
    </Contenitore>
  );
}
