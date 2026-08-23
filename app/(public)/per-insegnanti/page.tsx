import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/games/registry";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { classi, etichettaClasse } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Per insegnanti",
  description:
    "Giochi educativi da usare in classe con la LIM o sui tablet: gratis, senza pubblicità, senza registrazione e senza timer.",
  alternates: { canonical: "/per-insegnanti" },
};

export default function PerInsegnantiPage() {
  const perCompetenza = [...new Set(games.map((g) => g.skill))].sort();

  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Per insegnanti
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        I giochi si aprono con un link, senza registrazione e senza pubblicità.
        Funzionano sulla LIM, sui tablet della classe e sui telefoni. Nessun
        timer: nessun bambino resta indietro davanti a tutti.
      </p>

      <section className="mt-10">
        <TitoloSezione>Per competenza</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          {perCompetenza.map((skill) => (
            <Link
              key={skill}
              href={`/giochi/competenza/${skill}`}
              data-tap
              className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-6 text-lg font-bold text-notte hover:border-viola hover:text-viola"
            >
              {skill}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <TitoloSezione>Compiti delle vacanze per classe</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          {classi.map((c) => (
            <Link
              key={c}
              href={`/compiti-vacanze/${c}`}
              data-tap
              className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-6 text-lg font-bold text-notte hover:border-viola hover:text-viola"
            >
              {etichettaClasse(c)}
            </Link>
          ))}
        </div>
      </section>
    </Contenitore>
  );
}
