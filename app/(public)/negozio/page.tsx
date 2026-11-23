import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { LinkCarrello } from "@/components/negozio/BottoneCarrello";
import { NEGOZIO_APERTO, PREZZI, VOLUMI, euro, volumeVisibile } from "@/lib/negozio/catalogo";
import { stripeDiProva } from "@/lib/negozio/stripe";

// Finché NEGOZIO_APERTO è false il negozio è una bozza: si apre dal link,
// ma non entra nella sitemap e non lo indicizza nessuno.
export const metadata: Metadata = {
  title: "Libretti e disegni da stampare",
  description: "I libretti di Mizi e i disegni da colorare in PDF, da stampare a casa su fogli A4.",
  alternates: { canonical: "/negozio" },
  robots: NEGOZIO_APERTO ? undefined : { index: false, follow: false },
};

export default function NegozioPage() {
  const prova = stripeDiProva();
  const volumi = VOLUMI.filter((v) => volumeVisibile(v, prova));
  return (
    <Contenitore className="py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Libretti e disegni da stampare</h1>
          <p className="mt-3 text-lg text-notte-tenue">
            Le storie di Mizi in PDF, da stampare a casa su fogli A4. Puoi prendere il libretto completo, solo i disegni
            da colorare, oppure un disegno alla volta. I giochi del sito restano gratis, sempre.
          </p>
        </div>
        <LinkCarrello />
      </div>

      {volumi.length === 0 ? (
        <p className="mt-10 rounded-[1.4rem] border border-notte/10 bg-white p-6 text-lg font-bold text-notte">
          I primi libretti arrivano a breve.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {volumi.map((v) => (
            <li key={v.codice}>
              <Link
                href={`/negozio/${v.codice}`}
                className="flex h-full flex-col rounded-[1.4rem] border-2 border-transparent bg-white p-6 hover:border-viola"
              >
                <p className="text-sm font-extrabold uppercase tracking-wide text-viola">
                  Volume {Number(v.codice.slice(1))} · {v.tema}
                </p>
                <p className="mt-2 text-xl font-extrabold text-notte">{v.titolo}</p>
                <p className="mt-2 flex-1 leading-relaxed text-notte-tenue">{v.descrizione}</p>
                <p className="mt-4 font-bold text-notte">
                  Libretto {euro(PREZZI.libretto)} · {v.disegni} disegni {euro(PREZZI.disegni)} · un disegno {euro(PREZZI.disegno)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Si stampa a casa", d: "PDF pronti per fogli A4: un disegno per foglio, oppure due per foglio da tagliare a metà." },
          { t: "Subito tuoi", d: "Dopo il pagamento li scarichi dalla pagina e te li mandiamo per email. Il link vale un anno." },
          { t: "Per la famiglia e la classe", d: "Stampali tutte le volte che vuoi, a casa o a scuola. Non si rivendono e non si mettono online." },
        ].map((x) => (
          <div key={x.t} className="rounded-[1.4rem] bg-crema-scuro/60 p-5">
            <p className="font-extrabold text-notte">{x.t}</p>
            <p className="mt-1 text-notte-tenue">{x.d}</p>
          </div>
        ))}
      </section>
      <p className="mt-8 text-sm text-notte-tenue">
        Prezzi IVA inclusa. Ordine minimo {euro(PREZZI.minimo_ordine)}.{" "}
        <Link href="/negozio/condizioni" prefetch={false} className="font-bold text-viola underline">
          Condizioni di vendita
        </Link>
        .
      </p>
    </Contenitore>
  );
}
