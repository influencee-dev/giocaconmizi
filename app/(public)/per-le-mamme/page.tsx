import type { Metadata } from "next";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { FacciaMizi } from "@/games/_engine/arte";
import { TITOLARE } from "@/lib/legal";
import { CATEGORIE, perCategoria, type Categoria } from "@/lib/rete";

export const metadata: Metadata = {
  title: "Per le mamme: associazioni, community e locali family-friendly",
  description:
    "La rete delle mamme di Gioca con Mizi: associazioni, community locali, gruppi d'ascolto e locali con nursery o area giochi. Inserimento gratuito, realtà verificate.",
  alternates: { canonical: "/per-le-mamme" },
};

const COLORI_CATEGORIA: Record<Categoria, string> = {
  associazione: "bg-viola",
  community: "bg-rosa",
  ascolto: "bg-azzurro",
  locale: "bg-arancione",
};

const oggetto = encodeURIComponent("Vorrei essere inserita su Gioca con Mizi");
const corpo = encodeURIComponent(
  "Ciao Giorgia!\n\nNome della realtà:\nCategoria (associazione / community di mamme / gruppo d'ascolto / locale family-friendly):\nCittà o zona:\nDue righe su cosa facciamo:\nLink (sito, social o gruppo):\nContatto pubblico da mostrare:\n\nGrazie!",
);

export default function PerLeMammePage() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        La rete delle mamme
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Gioca con Mizi è fatto da una mamma, e questo è lo spazio delle altre:
        associazioni, community locali, gruppi d&apos;ascolto e locali dove i
        bambini sono davvero benvenuti. L&apos;inserimento è{" "}
        <strong className="text-notte">gratuito</strong>: non è pubblicità a
        pagamento, e ogni realtà viene verificata una per una prima di entrare.
      </p>

      {/* Invito a farsi inserire */}
      <div className="mt-6 flex items-start gap-4 rounded-morbido border-2 border-crema-scuro bg-white p-5">
        <span className="h-14 w-14 shrink-0" aria-hidden>
          <FacciaMizi emozione="felice" />
        </span>
        <div className="flex flex-col gap-2">
          <p className="font-extrabold text-notte">Vuoi comparire qui?</p>
          <p className="text-notte-tenue">
            Se rappresenti un&apos;associazione, animi un gruppo di mamme, tieni
            uno spazio d&apos;ascolto o gestisci un locale con nursery o area
            giochi, scrivimi due righe: nome, città, cosa fate e un link.
          </p>
          <a
            href={`mailto:${TITOLARE.email}?subject=${oggetto}&body=${corpo}`}
            data-tap
            className="mt-1 inline-flex w-fit items-center justify-center rounded-bolla bg-rosa px-6 py-3 font-extrabold text-white"
          >
            Scrivi a Giorgia
          </a>
        </div>
      </div>

      {(Object.keys(CATEGORIE) as Categoria[]).map((categoria) => {
        const voci = perCategoria(categoria);
        return (
          <section key={categoria} className="mt-12">
            <div className="mb-1 flex items-center gap-3">
              <span aria-hidden className={`h-4 w-4 rounded-full ${COLORI_CATEGORIA[categoria]}`} />
              <TitoloSezione>{CATEGORIE[categoria].nome}</TitoloSezione>
            </div>
            <p className="mb-4 max-w-2xl text-notte-tenue">
              {CATEGORIE[categoria].descrizione}
            </p>

            {voci.length === 0 ? (
              <p className="rounded-morbido border-2 border-dashed border-crema-scuro bg-white/60 p-5 text-notte-tenue">
                Questo spazio aspetta la prima segnalazione: se è il tuo posto,{" "}
                <a
                  href={`mailto:${TITOLARE.email}?subject=${oggetto}&body=${corpo}`}
                  className="font-bold text-viola underline underline-offset-4"
                >
                  scrivimi
                </a>{" "}
                e inauguriamolo insieme.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {voci.map((v) => (
                  <div
                    key={v.nome}
                    className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5"
                  >
                    <p className="text-xl font-extrabold text-notte">{v.nome}</p>
                    <p className="text-sm font-bold text-viola">{v.dove}</p>
                    <p className="text-notte-tenue">{v.descrizione}</p>
                    {(v.link || v.contatto) && (
                      <p className="mt-auto pt-2 text-sm font-bold text-notte-tenue">
                        {v.link && (
                          <a
                            href={v.link}
                            rel="noopener nofollow"
                            className="text-viola underline underline-offset-4"
                          >
                            {v.link.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                        {v.link && v.contatto && " · "}
                        {v.contatto}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <section className="mt-12">
        <TitoloSezione>Come funziona l&apos;inserimento</TitoloSezione>
        <ul className="flex flex-col gap-2 text-lg text-notte-tenue">
          <li>È gratuito e lo resterà: niente inserzioni a pagamento, niente classifiche comprate.</li>
          <li>Ogni realtà viene verificata prima di entrare; pubblichiamo solo contatti che la realtà stessa chiede di mostrare.</li>
          <li>Se qualcosa cambia o vuoi essere rimossa, basta una email e la voce sparisce.</li>
        </ul>
      </section>
    </Contenitore>
  );
}
