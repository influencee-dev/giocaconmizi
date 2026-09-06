import type { Metadata } from "next";
import { games } from "@/games/registry";
import { CardGioco, Contenitore, Griglia, TitoloSezione } from "@/components/ui";
import { IllustrazioneSkill } from "@/components/illustrazioni";

export const metadata: Metadata = {
  title: "Coding per bambini e ragazzi",
  description:
    "Coding per bambini dai 3 ai 12 anni: dalle frecce ai blocchi, fino al codice vero. Gratis, senza pubblicità, in italiano.",
  alternates: { canonical: "/coding" },
};

export default function CodingPage() {
  const giochi = games.filter((g) => g.skill === "coding");
  const primi = giochi.filter((g) => g.ageMin <= 5);
  const blocchi = giochi.filter((g) => g.ageMin >= 6);

  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Coding per bambini e ragazzi
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Si comincia a tre anni con le frecce, si arriva a dodici con i cicli e le
        variabili. Nessuna installazione, nessun account: si apre e si programma.
      </p>

      <section className="mt-10">
        <TitoloSezione>Primi passi, senza leggere</TitoloSezione>
        <Griglia>
          {primi.map((g) => (
            <CardGioco
              key={g.slug}
              slug={g.slug}
              titolo={g.title}
              descrizione={g.subskill}
              eta={`${g.ageMin}–${g.ageMax}`}
              minuti={g.minutes}
              illustrazione={<IllustrazioneSkill skill={g.skill} />}
            />
          ))}
        </Griglia>
      </section>

      <section className="mt-10">
        <TitoloSezione>Blocchi e codice</TitoloSezione>
        <Griglia>
          {blocchi.map((g) => (
            <CardGioco
              key={g.slug}
              slug={g.slug}
              titolo={g.title}
              descrizione={g.subskill}
              eta={`${g.ageMin}–${g.ageMax}`}
              minuti={g.minutes}
              illustrazione={<IllustrazioneSkill skill={g.skill} />}
            />
          ))}
        </Griglia>
      </section>
    </Contenitore>
  );
}
