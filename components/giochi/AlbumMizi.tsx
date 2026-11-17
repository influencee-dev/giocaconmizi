"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FigurinaGioco } from "@/components/icone";
import { FacciaMizi } from "@/games/_engine/arte";
import { CHIAVE_ALBUM, GIOCHI_PER_COCCARDA, fattiOggi, prossimiGiochi, useAlbum, type GiocoBreve } from "@/lib/giochi/album";
import { bimboAttivo, useProfilo } from "@/lib/famiglia/profilo";
import { AREE } from "./CatalogoGiochi";

/**
 * L'album di Mizi (/giochi/album): una figurina per ogni gioco finito, divise
 * per competenza, così la mamma vede a colpo d'occhio che cosa si è allenato e
 * il bambino vede i buchi da riempire. Le figurine mancanti portano al gioco.
 */

function Stelle({ quante }: { quante: number }) {
  return (
    <span className="text-sm leading-none" role="img" aria-label={`${quante} ${quante === 1 ? "stella" : "stelle"} su 3`}>
      {"⭐".repeat(quante)}
      <span className="opacity-25">{"⭐".repeat(3 - quante)}</span>
    </span>
  );
}

export function AlbumMizi({ giochi }: { giochi: GiocoBreve[] }) {
  const { album, pronto } = useAlbum();
  const { profilo } = useProfilo();
  const bimbo = bimboAttivo(profilo);

  const figurine = giochi.filter((g) => album.giochi[g.slug]).length;
  const stelle = giochi.reduce((n, g) => n + (album.giochi[g.slug]?.stelle ?? 0), 0);
  const oggi = fattiOggi(album);
  const mancano = GIOCHI_PER_COCCARDA - oggi;

  // Senza profilo si guarda l'età dei giochi già fatti; al primo giro, 4 anni.
  const eta = useMemo(() => {
    if (bimbo) return bimbo.eta;
    const fatti = giochi.filter((g) => album.giochi[g.slug]);
    if (fatti.length === 0) return 4;
    return Math.round(fatti.reduce((n, g) => n + (g.ageMin + g.ageMax) / 2, 0) / fatti.length);
  }, [bimbo, giochi, album]);
  const proposte = useMemo(() => prossimiGiochi(giochi, album, eta, undefined, 3), [giochi, album, eta]);

  const sezioni = AREE.map((a) => ({ ...a, giochi: giochi.filter((g) => a.skills.includes(g.skill)) })).filter((a) => a.giochi.length > 0);

  const svuota = () => {
    if (!window.confirm("Vuoi davvero svuotare l'album? Le figurine e le coccarde di questo dispositivo si cancellano.")) return;
    try {
      window.localStorage.removeItem(CHIAVE_ALBUM);
    } catch {
      /* niente da cancellare */
    }
    window.dispatchEvent(new Event("giocamizi-album"));
  };

  return (
    <div data-album={pronto ? "pronto" : "attesa"} data-figurine={figurine}>
      <Link href="/giochi" className="font-bold text-viola-forte underline underline-offset-4">
        ← Tutti i giochi
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <span className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
          <FacciaMizi emozione="felice" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">L&apos;album di Mizi{bimbo ? ` e di ${bimbo.nome}` : ""}</h1>
          <p className="mt-1 text-lg text-notte-tenue">Ogni gioco finito regala la sua figurina. Tre giochi diversi in un giorno: arriva la coccarda!</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { nome: "figurine", valore: `${figurine}`, di: `di ${giochi.length}`, tono: "bg-[#EFE6FB]" },
          { nome: "stelle", valore: `${stelle}`, di: `di ${giochi.length * 3}`, tono: "bg-[#FFF3CF]" },
          { nome: "coccarde", valore: `${album.coccarde}`, di: album.coccarde === 1 ? "giorno da tre giochi" : "giorni da tre giochi", tono: "bg-[#FDE8F0]" },
        ].map((s) => (
          <div key={s.nome} className={`flex flex-col rounded-morbido p-3 ${s.tono}`} data-conto={s.nome}>
            <dd className="text-3xl font-extrabold text-notte sm:text-4xl">{s.valore}</dd>
            <dt className="text-sm font-extrabold text-notte">{s.nome}</dt>
            <span className="text-xs font-bold text-notte-tenue">{s.di}</span>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center gap-3 rounded-morbido border-2 border-crema-scuro bg-white p-4" data-oggi={oggi}>
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          {Array.from({ length: GIOCHI_PER_COCCARDA }, (_, i) => (
            <span key={i} className={`h-5 w-5 rounded-full ${i < oggi ? "bg-arancione" : "bg-crema-scuro"}`} />
          ))}
        </span>
        <p className="font-bold text-notte">
          {mancano <= 0
            ? "La coccarda di oggi è vostra! 🎖️ Domani se ne vince un'altra."
            : oggi === 0
              ? "Oggi: tre giochi diversi e arriva la coccarda del giorno."
              : mancano === 1
                ? "Oggi ne manca uno solo: ancora un gioco diverso e arriva la coccarda."
                : `Oggi: ancora ${mancano} giochi diversi per la coccarda.`}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-extrabold text-notte">{figurine === 0 ? "Comincia da qui" : "Prova questi"}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {proposte.map((g) => (
            <Link
              key={g.slug}
              href={`/giochi/${g.slug}/gioca?eta=${Math.min(Math.max(eta, g.ageMin), g.ageMax)}`}
              className="flex min-h-16 items-center gap-3 rounded-bolla bg-rosa-forte p-2.5 pr-5 text-white"
              data-proposta={g.slug}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-2" aria-hidden>
                <FigurinaGioco slug={g.slug} skill={g.skill} />
              </span>
              <span className="min-w-0 flex-1 text-lg font-extrabold leading-tight">{g.title}</span>
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </section>

      {sezioni.map((a) => {
        const fatte = a.giochi.filter((g) => album.giochi[g.slug]).length;
        return (
          <section key={a.slug} className="mt-8" data-area={a.slug}>
            <h2 className="flex flex-wrap items-baseline gap-x-3 text-2xl font-extrabold text-notte">
              <span>{a.nome.charAt(0).toUpperCase() + a.nome.slice(1)}</span>
              <span className="text-base font-bold text-notte-tenue">
                {fatte} di {a.giochi.length}
              </span>
            </h2>
            <ul className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
              {a.giochi.map((g) => {
                const fig = album.giochi[g.slug];
                return (
                  <li key={g.slug}>
                    <Link
                      href={`/giochi/${g.slug}`}
                      data-figurina={fig ? "presa" : "manca"}
                      className={`flex h-full flex-col items-center gap-1.5 rounded-2xl p-2 text-center ${
                        fig ? "border-2 border-viola bg-white shadow-sm" : "border-2 border-dashed border-crema-scuro bg-crema"
                      }`}
                    >
                      <span className={`flex h-12 w-12 items-center justify-center ${fig ? "" : "opacity-30 grayscale"}`} aria-hidden>
                        <FigurinaGioco slug={g.slug} skill={g.skill} />
                      </span>
                      <span className={`text-xs font-extrabold leading-tight ${fig ? "text-notte" : "text-notte-tenue"}`}>{g.title}</span>
                      {fig ? <Stelle quante={fig.stelle} /> : <span className="text-xs font-bold text-notte-tenue">da scoprire</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="mt-10 rounded-morbido bg-white p-5 text-sm text-notte-tenue">
        <p>
          <strong className="text-notte">Per i grandi.</strong> L&apos;album resta solo su questo dispositivo: non serve un account e a noi non
          arriva niente. Non ci sono serie da non perdere né punti che scadono: se un giorno non si gioca, non si perde nulla.
        </p>
        {figurine > 0 && (
          <button type="button" onClick={svuota} className="mt-3 min-h-12 font-bold text-notte underline underline-offset-4" data-svuota-album>
            Svuota l&apos;album e ricomincia
          </button>
        )}
      </div>
    </div>
  );
}
