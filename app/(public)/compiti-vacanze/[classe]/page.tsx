import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games } from "@/games/registry";
import { CardGioco, Contenitore, Faq, Griglia, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { classi, etichettaClasse, type Classe } from "@/lib/seo";

type Params = { params: Promise<{ classe: string }> };

/** Età di riferimento per ogni classe: serve a scegliere i giochi. */
const etaPerClasse: Record<Classe, number> = {
  "prima-elementare": 6,
  "seconda-elementare": 7,
  "terza-elementare": 8,
  "quarta-elementare": 9,
  "quinta-elementare": 10,
};

export function generateStaticParams() {
  return classi.map((classe) => ({ classe }));
}

function valida(slug: string): Classe | null {
  return classi.includes(slug as Classe) ? (slug as Classe) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { classe } = await params;
  const valid = valida(classe);
  if (!valid) return {};
  const nome = etichettaClasse(valid);
  return {
    title: `Compiti delle vacanze ${nome}`,
    description: `Compiti delle vacanze per la ${nome}: esercizi online gratis di italiano e matematica, da fare al telefono o da stampare.`,
    alternates: { canonical: `/compiti-vacanze/${valid}` },
  };
}

export default async function CompitiVacanzePage({ params }: Params) {
  const { classe } = await params;
  const valid = valida(classe);
  if (!valid) notFound();

  const nome = etichettaClasse(valid);
  const anni = etaPerClasse[valid];
  const selezione = games.filter((g) => anni >= g.ageMin && anni <= g.ageMax);

  const faq = [
    {
      domanda: `I compiti delle vacanze per la ${nome} sono gratis?`,
      risposta:
        "Sì. Gli esercizi online sono gratuiti e senza pubblicità. Le schede da stampare in PDF sono un prodotto a parte.",
    },
    {
      domanda: "Quanto tempo al giorno?",
      risposta:
        "Dai 10 ai 20 minuti bastano. Meglio poco tutti i giorni che un'ora una volta a settimana.",
    },
    {
      domanda: "Servono un account o un login?",
      risposta:
        "No. Gli esercizi si aprono e si fanno subito. L'account serve solo per salvare l'avanzamento e scaricare i PDF.",
    },
    {
      domanda: "Funzionano dal telefono?",
      risposta:
        "Sì, sono pensati prima per il telefono: si usano con un dito, in verticale.",
    },
  ];

  return (
    <Contenitore className="py-10">
      <JsonLd data={jsonLdFaq(faq)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Compiti delle vacanze", percorso: `/compiti-vacanze/${valid}` },
          { nome, percorso: `/compiti-vacanze/${valid}` },
        ])}
      />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Compiti delle vacanze {nome}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Esercizi di italiano e matematica per chi ha finito la {nome}. Si fanno
        online, gratis e senza pubblicità, in dieci minuti al giorno. Nessun
        timer e nessun voto: se sbaglia, si riprova.
      </p>

      <section className="mt-10">
        <TitoloSezione>Esercizi da fare adesso</TitoloSezione>
        <Griglia>
          {selezione.map((g) => (
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

      <section className="mt-10">
        <TitoloSezione>Altre classi</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          {classi
            .filter((c) => c !== valid)
            .map((c) => (
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

      <Faq voci={faq} />
    </Contenitore>
  );
}
