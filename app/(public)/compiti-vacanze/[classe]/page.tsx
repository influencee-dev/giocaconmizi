import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games, type Skill } from "@/games/registry";
import { CardGioco, Contenitore, Faq, Griglia, TitoloSezione } from "@/components/ui";
import { IconaGioco } from "@/components/icone";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { classi, etichettaClasse, riassunto, titoloPagina, type Classe } from "@/lib/seo/seo";

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

// Dal 23/11/2026 (docs/piano-seo.md, cantiere 5, scelta di Giorgia): la pagina di
// ogni classe vale tutto l'anno. D'inverno la gente cerca «esercizi di seconda
// elementare», non «compiti delle vacanze»: titolo, H1 e giochi divisi per
// materia parlano di esercizi; le vacanze restano un riquadro. L'indirizzo è
// lo stesso di prima, così i link che ha già non si perdono.

/** Le materie della pagina, nell'ordine in cui le cercano i genitori. */
const MATERIE: { titolo: string; competenze: Skill[] }[] = [
  { titolo: "Matematica", competenze: ["matematica", "numeri", "tempo"] },
  { titolo: "Italiano", competenze: ["ortografia", "lettura", "comprensione", "fonetica", "alfabeto"] },
  { titolo: "Scienze", competenze: ["scienze"] },
];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { classe } = await params;
  const valid = valida(classe);
  if (!valid) return {};
  const nome = etichettaClasse(valid);
  return {
    title: titoloPagina(`Esercizi di ${nome}: matematica e italiano`),
    description: riassunto(
      `Esercizi di ${nome} di matematica e italiano da fare online: giochi gratis, senza pubblicità e senza timer, per allenarsi tutto l'anno e per i compiti delle vacanze.`,
    ),
    alternates: { canonical: `/compiti-vacanze/${valid}` },
  };
}

export default async function CompitiVacanzePage({ params }: Params) {
  const { classe } = await params;
  const valid = valida(classe);
  if (!valid) notFound();

  const nome = etichettaClasse(valid);
  const anni = etaPerClasse[valid];
  const selezione = games.filter((g) => g.status === "live" && anni >= g.ageMin && anni <= g.ageMax);
  const perMateria = MATERIE.map((m) => ({ ...m, giochi: selezione.filter((g) => m.competenze.includes(g.skill)) })).filter(
    (m) => m.giochi.length > 0,
  );
  const giaInUnaMateria = new Set(perMateria.flatMap((m) => m.giochi.map((g) => g.slug)));
  const altri = selezione.filter((g) => !giaInUnaMateria.has(g.slug));

  const faq = [
    {
      domanda: `Gli esercizi di ${nome} sono gratis?`,
      risposta: "Sì. Tutti i giochi sono gratuiti e senza pubblicità, e si aprono senza account.",
    },
    {
      domanda: "Vanno bene anche per i compiti delle vacanze?",
      risposta: `Sì. In estate gli stessi giochi servono per ripassare quello che si è fatto in ${nome}, dieci minuti al giorno.`,
    },
    {
      domanda: "Quanto tempo al giorno?",
      risposta:
        "Dai 10 ai 20 minuti bastano. Meglio poco tutti i giorni che un'ora una volta a settimana.",
    },
    {
      domanda: "Funzionano dal telefono?",
      risposta:
        "Sì, sono pensati prima per il telefono: si usano con un dito, in verticale.",
    },
  ];

  const griglia = (elenco: typeof selezione) => (
    <Griglia>
      {elenco.map((g) => (
        <CardGioco
          key={g.slug}
          slug={g.slug}
          titolo={g.title}
          descrizione={g.subskill}
          eta={`${g.ageMin}–${g.ageMax}`}
          minuti={g.minutes}
          illustrazione={<IconaGioco slug={g.slug} skill={g.skill} />}
        />
      ))}
    </Griglia>
  );

  return (
    <Contenitore className="py-10">
      <JsonLd data={jsonLdFaq(faq)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Esercizi per classe", percorso: "/compiti-vacanze/prima-elementare" },
          { nome, percorso: `/compiti-vacanze/${valid}` },
        ])}
      />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Esercizi di {nome}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Esercizi di matematica e di italiano per la {nome}, da fare online come un
        gioco: gratis, senza pubblicità e senza timer. Bastano dieci minuti al giorno,
        e se si sbaglia si riprova con un aiuto.
      </p>

      {perMateria.map((m) => (
        <section key={m.titolo} className="mt-10">
          <TitoloSezione>
            {m.titolo} per la {nome}
          </TitoloSezione>
          {griglia(m.giochi)}
        </section>
      ))}

      {altri.length > 0 && (
        <section className="mt-10">
          <TitoloSezione>Logica, coding e altro</TitoloSezione>
          {griglia(altri)}
        </section>
      )}

      <section className="mt-10 max-w-2xl rounded-morbido border-2 border-giallo/60 bg-[#FFF3CF] p-6">
        <h2 className="text-xl font-extrabold text-notte">Per i compiti delle vacanze</h2>
        <p className="mt-2 text-notte-tenue">
          In estate questa pagina serve per ripassare: chi ha finito la {nome} rifà i giochi
          della sua classe e prova quelli della classe dopo, senza fretta.
        </p>
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
