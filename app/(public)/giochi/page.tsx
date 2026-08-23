import type { Metadata } from "next";
import { games } from "@/games/registry";
import { CardGioco, Contenitore, Griglia, TitoloSezione } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tutti i giochi educativi",
  description:
    "Tutti i giochi educativi di Gioca con Mizi: colori, forme, numeri, lettere, logica, coding. Gratis, senza pubblicità, dai 3 ai 12 anni.",
  alternates: { canonical: "/giochi" },
};

export default function GiochiPage() {
  const perEta = [
    { titolo: "Dai 3 ai 5 anni", giochi: games.filter((g) => g.ageMin <= 5) },
    { titolo: "Dai 6 agli 8 anni", giochi: games.filter((g) => g.ageMin >= 6 && g.ageMin <= 8) },
    { titolo: "Dai 9 anni in su", giochi: games.filter((g) => g.ageMin >= 9) },
  ];

  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Tutti i giochi
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Un gioco, una competenza. Nessun timer, nessun punteggio da battere:
        si gioca finché si ha voglia.
      </p>

      {perEta.map((gruppo) => (
        <section key={gruppo.titolo} className="mt-10">
          <TitoloSezione>{gruppo.titolo}</TitoloSezione>
          <Griglia>
            {gruppo.giochi.map((g) => (
              <CardGioco
                key={g.slug}
                slug={g.slug}
                titolo={g.title}
                descrizione={g.subskill}
                eta={`${g.ageMin}–${g.ageMax}`}
                minuti={g.minutes}
              />
            ))}
          </Griglia>
        </section>
      ))}
    </Contenitore>
  );
}
