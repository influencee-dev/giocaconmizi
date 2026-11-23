import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore } from "@/components/ui";
import { BottoneCarrello, LinkCarrello } from "@/components/negozio/BottoneCarrello";
import { NEGOZIO_APERTO, VOLUMI, anteprima, euro, prodottiDelVolume, volume, volumeVisibile } from "@/lib/negozio/catalogo";
import { stripeDiProva } from "@/lib/negozio/stripe";
import { SUPABASE_URL } from "@/lib/supabase/config";

export function generateStaticParams() {
  return VOLUMI.map((v) => ({ volume: v.codice }));
}

export async function generateMetadata({ params }: { params: Promise<{ volume: string }> }): Promise<Metadata> {
  const v = volume((await params).volume);
  if (!v) return {};
  return {
    title: `${v.titolo}: libretto e disegni da stampare`,
    description: `${v.descrizione.slice(0, 120)} In PDF da stampare a casa.`,
    alternates: { canonical: `/negozio/${v.codice}` },
    robots: NEGOZIO_APERTO && v.in_vendita ? undefined : { index: false, follow: false },
  };
}

export default async function VolumePage({ params }: { params: Promise<{ volume: string }> }) {
  const v = volume((await params).volume);
  if (!v || !volumeVisibile(v, stripeDiProva())) notFound();
  const prodotti = prodottiDelVolume(v.codice);
  const interi = prodotti.filter((p) => p.tipo !== "disegno");
  const singoli = prodotti.filter((p) => p.tipo === "disegno");

  return (
    <Contenitore className="py-10">
      <nav className="text-sm text-notte-tenue" aria-label="Percorso">
        <Link href="/negozio" className="hover:text-viola">Negozio</Link> › <span>Volume {Number(v.codice.slice(1))}</span>
      </nav>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{v.titolo}</h1>
          <p className="mt-3 text-lg leading-relaxed text-notte-tenue">{v.descrizione}</p>
        </div>
        <LinkCarrello />
      </div>

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {interi.map((p) => (
          <li key={p.codice} className="flex flex-col rounded-[1.4rem] bg-white p-6">
            <p className="text-xl font-extrabold text-notte">{p.nome}</p>
            <p className="mt-2 flex-1 leading-relaxed text-notte-tenue">{p.sotto}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-2xl font-extrabold text-notte">{euro(p.prezzo)}</p>
              <BottoneCarrello codice={p.codice} nome={`${p.nome}, ${v.titolo}`} />
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl font-extrabold text-notte">Un disegno alla volta</h2>
      <p className="mt-2 text-notte-tenue">
        {euro(singoli[0]?.prezzo ?? 0)} l&apos;uno, su un foglio A4. Se scegli anche il pacchetto o il libretto, i disegni
        singoli non li paghi: sono già dentro.
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {singoli.map((p) => (
          <li key={p.codice} className="flex flex-col gap-3 rounded-[1.4rem] bg-white p-3">
            {/* Anteprima piccola dall'archivio pubblico «negozio-anteprime»: niente immagini dei libri nel repo. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={anteprima(v, p.numero!, SUPABASE_URL)}
              alt={`Anteprima del disegno n. ${p.numero} di «${v.titolo}»`}
              width={480}
              height={480}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-xl border border-notte/10 bg-crema object-cover"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="font-extrabold text-notte">n. {p.numero}</p>
              <BottoneCarrello codice={p.codice} nome={`${p.nome}, ${v.titolo}`} piccolo />
            </div>
          </li>
        ))}
      </ul>
    </Contenitore>
  );
}
