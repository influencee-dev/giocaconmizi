import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { adminValido } from "@/lib/admin";
import { giornoDiRoma, postDelGiorno, type TipoPost } from "@/lib/social/post";
import { instagramCollegato } from "@/lib/social/instagram";
import { MenuAdmin } from "../MenuAdmin";
import { SchedaPost } from "./SchedaPost";

/**
 * Social: i post Instagram del giorno, pronti dai contenuti del sito
 * (lib/social/post.ts). Giorgia guarda le slide, ritocca la didascalia e
 * pubblica con un tocco. Il giorno si cambia con ?data=AAAA-MM-GG.
 */

export const dynamic = "force-dynamic";
// La pubblicazione di un carosello aspetta che Meta prepari le immagini.
export const maxDuration = 60;
export const metadata: Metadata = { title: "Social", robots: { index: false, follow: false } };

const NOMI: Record<TipoPost, string> = {
  carosello: "Carosello dall'articolo",
  foto: "Post con la foto",
  gioco: "Post del gioco",
};

export default async function SocialPage({
  params,
  searchParams,
}: {
  params: Promise<{ codice: string }>;
  searchParams: Promise<{ data?: string }>;
}) {
  const { codice } = await params;
  const { data } = await searchParams;
  if (!(await adminValido(codice))) {
    return (
      <Contenitore className="py-16">
        <h1 className="text-3xl font-extrabold text-notte">Pannello non disponibile</h1>
        <p className="mt-4 text-notte-tenue">Il codice non è valido, oppure il database non risponde (forse è in pausa su Supabase).</p>
      </Contenitore>
    );
  }
  const giorno = giornoDiRoma(/^\d{4}-\d{2}-\d{2}$/.test(data ?? "") ? data : undefined);
  const post = postDelGiorno(giorno.iso);
  const collegato = instagramCollegato();
  const spostato = (d: number) => new Date(Date.parse(`${giorno.iso}T12:00:00Z`) + d * 86_400_000).toISOString().slice(0, 10);
  const dataLeggibile = new Date(`${giorno.iso}T12:00:00Z`).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/social" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-notte">Social</h1>
          <p className="mt-2 max-w-2xl text-notte-tenue">
            I post Instagram di {dataLeggibile}, fatti dai contenuti del sito. Guarda le slide, ritocca la didascalia se vuoi, poi pubblica.
          </p>
        </div>
        <nav aria-label="Giorno" className="flex gap-2">
          <a href={`?data=${spostato(-1)}`} className="rounded-2xl border border-notte/15 bg-white px-4 py-2 font-bold text-notte">
            ← Giorno prima
          </a>
          <a href={`?data=${spostato(1)}`} className="rounded-2xl border border-notte/15 bg-white px-4 py-2 font-bold text-notte">
            Giorno dopo →
          </a>
        </nav>
      </div>

      {!collegato && (
        <div role="note" className="mt-6 rounded-morbido border-2 border-giallo bg-giallo/15 p-4 text-notte">
          <p className="font-extrabold">Instagram non è ancora collegato</p>
          <p className="mt-1">
            Puoi già vedere le slide. Per pubblicare da qui servono due chiavi di Meta nelle impostazioni di Vercel: la procedura è in{" "}
            <code>docs/instagram.md</code>.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-8">
        {post.map((p) => (
          <section key={p.id} aria-labelledby={`titolo-${p.id}`} className="rounded-morbido border border-notte/10 bg-white p-5">
            <p className="text-sm font-extrabold uppercase tracking-wide text-viola">
              {NOMI[p.tipo]} · {p.slides.length === 1 ? "1 immagine" : `${p.slides.length} slide`}
            </p>
            <h2 id={`titolo-${p.id}`} className="mt-1 text-xl font-extrabold text-notte">
              {p.titolo}
            </h2>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {p.slides.map((_, i) => (
                <a
                  key={i}
                  href={`/admin/${codice}/social/anteprima/${p.id}/${i + 1}.jpg`}
                  target="_blank"
                  rel="noopener"
                  className="shrink-0 overflow-hidden rounded-2xl border border-notte/10"
                  title={`Apri la slide ${i + 1} a grandezza piena`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/admin/${codice}/social/anteprima/${p.id}/${i + 1}.jpg`} alt={`Slide ${i + 1} di ${p.slides.length}`} width={176} height={220} loading="lazy" className="block h-[220px] w-[176px] object-cover" />
                </a>
              ))}
            </div>
            <SchedaPost codice={codice} id={p.id} link={p.link} didascaliaIniziale={p.didascalia} collegato={collegato} />
          </section>
        ))}
      </div>
    </Contenitore>
  );
}
