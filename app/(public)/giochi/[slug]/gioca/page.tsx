import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games } from "@/games/registry";
import { giocabile } from "@/games/elenco";
import { Giocatore } from "./Giocatore";

type Params = { params: Promise<{ slug: string }> };
type Query = { searchParams: Promise<{ eta?: string; demo?: string }> };

export function generateStaticParams() {
  return games.filter((g) => giocabile(g.slug)).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const gioco = games.find((g) => g.slug === slug);
  if (!gioco) return {};
  return {
    title: `Gioca a ${gioco.title}`,
    // La pagina indicizzata è /giochi/[slug]: questa è solo lo schermo di gioco.
    robots: { index: false, follow: true },
    alternates: { canonical: `/giochi/${slug}` },
  };
}

export default async function GiocaPage({ params, searchParams }: Params & Query) {
  const { slug } = await params;
  const { eta, demo } = await searchParams;

  const gioco = games.find((g) => g.slug === slug);
  if (!gioco || !giocabile(slug)) notFound();

  // L'età scelta dall'hub arriva per query string; altrimenti si parte dal minimo.
  const etaLetta = Number(eta);
  const etaGioco =
    Number.isFinite(etaLetta) && etaLetta >= gioco.ageMin && etaLetta <= gioco.ageMax
      ? etaLetta
      : gioco.ageMin;

  return (
    <Giocatore
      slug={slug}
      titolo={gioco.title}
      eta={etaGioco}
      difficolta={gioco.difficulty}
      demo={demo === "1"}
    />
  );
}
