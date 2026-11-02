import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { adminValido } from "@/lib/admin";
import { CATEGORIE_ATTIVE, SCHEDE } from "@/lib/directory";
import { adminDati, chiaveScheda } from "@/lib/directory-db";
import { EVENTI, contatti, perScheda, statisticheAdmin, type Evento } from "@/lib/statistiche";
import { MenuAdmin } from "../MenuAdmin";
import { DaAttivare, NonDisponibile, Numero } from "../NonDisponibile";

/** Tutte le schede, filtrabili per listing (categoria × città), con i numeri degli ultimi 30 giorni. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Schede", robots: { index: false, follow: false } };

const STATO: Record<string, string> = {
  inviato: "Link inviato",
  aperto: "Link aperto",
  approvato: "Approvata",
  modifica: "Modificata",
  rimozione: "Rimozione chiesta",
};

type P = {
  params: Promise<{ codice: string }>;
  searchParams: Promise<{ categoria?: string; citta?: string }>;
};

export default async function SchedePage({ params, searchParams }: P) {
  const { codice } = await params;
  const filtro = await searchParams;
  if (!(await adminValido(codice))) return <NonDisponibile />;

  const [righe, dati] = await Promise.all([statisticheAdmin(codice, 30), adminDati(codice)]);
  const numeri = perScheda(righe ?? []);
  const settimana = perScheda((righe ?? []).filter((r) => r.giorno >= new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)));
  const stato = new Map((dati?.inviti ?? []).map((i) => [i.chiave, i.stato]));
  const vuoto = Object.fromEntries(EVENTI.map((e) => [e, 0])) as Record<Evento, number>;

  const citta = [...new Map(SCHEDE.map((s) => [s.cittaSlug, s.citta])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const elenco = SCHEDE.filter(
    (s) => (!filtro.categoria || s.categoria.slug === filtro.categoria) && (!filtro.citta || s.cittaSlug === filtro.citta),
  )
    .map((s) => ({ s, n: numeri.get(chiaveScheda(s)) ?? vuoto }))
    .sort((a, b) => b.n.vista - a.n.vista || a.s.nome.localeCompare(b.s.nome));

  const somma = (m: Map<string, Record<Evento, number>>, f: (v: Record<Evento, number>) => number) =>
    [...m.values()].reduce((a, v) => a + f(v), 0);

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/schede" />
      <h1 className="text-3xl font-extrabold text-notte">Schede</h1>

      {righe === null ? (
        <div className="mt-6">
          <DaAttivare titolo="I contatori non sono ancora attivi">
            Apri Supabase → SQL Editor, incolla il file <code>supabase/backoffice.sql</code> del repo e premi Run. Da quel
            momento ogni visita alle schede e ogni clic su WhatsApp, telefono, sito e social viene contato (solo numeri,
            niente dati delle persone).
          </DaAttivare>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Numero valore={somma(settimana, (v) => v.vista)} etichetta="Visite, 7 giorni" />
          <Numero valore={somma(settimana, contatti)} etichetta="Contatti, 7 giorni" />
          <Numero valore={somma(numeri, (v) => v.vista)} etichetta="Visite, 30 giorni" />
          <Numero valore={somma(numeri, contatti)} etichetta="Contatti, 30 giorni" />
        </div>
      )}

      <form className="mt-8 flex flex-wrap items-end gap-3" method="get">
        <label className="flex flex-col gap-1 text-sm font-bold text-notte">
          Categoria
          <select name="categoria" defaultValue={filtro.categoria ?? ""} className="rounded-xl border-2 border-crema-scuro px-3 py-2">
            <option value="">Tutte</option>
            {CATEGORIE_ATTIVE.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold text-notte">
          Città
          <select name="citta" defaultValue={filtro.citta ?? ""} className="rounded-xl border-2 border-crema-scuro px-3 py-2">
            <option value="">Tutte</option>
            {citta.map(([slug, nome]) => (
              <option key={slug} value={slug}>
                {nome}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-2xl bg-notte px-5 py-2.5 font-extrabold text-white">
          Filtra
        </button>
        <p className="text-sm font-bold text-notte-tenue" data-schede={elenco.length}>
          {elenco.length} schede
        </p>
      </form>

      <ul className="mt-6 flex flex-col gap-3">
        {elenco.map(({ s, n }) => (
          <li key={`${s.categoria.slug}/${chiaveScheda(s)}`}>
            <Link
              href={`/admin/${codice}/schede/${s.cittaSlug}/${s.slug}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[1.4rem] border border-notte/10 bg-white p-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-extrabold text-notte">{s.nome}</span>
                <span className="block text-sm text-notte-tenue">
                  {s.citta} · {s.categoria.nome} · {STATO[stato.get(chiaveScheda(s)) ?? ""] ?? "Da redazione"}
                </span>
              </span>
              <span className="text-sm font-bold text-notte">
                {n.vista} visite · {contatti(n)} contatti
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Contenitore>
  );
}
