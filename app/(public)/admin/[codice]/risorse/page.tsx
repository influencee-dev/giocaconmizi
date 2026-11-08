import type { Metadata } from "next";
import Link from "next/link";
import { adminDati, adminLoghi } from "@/lib/directory-db";
import { adminValido } from "@/lib/admin";
import { chiaveRisorsa, percorsoRisorsa, risorsaDaChiave } from "@/lib/risorse-educative";
import { RISORSE } from "@/lib/risorse-educative-dati";
import { Contenitore } from "@/components/ui";
import { MenuAdmin } from "../MenuAdmin";
import { NonDisponibile } from "../NonDisponibile";
import { CreaLink } from "./CreaLink";
import { decidiLogo } from "./azioni";

/**
 * Le risorse educative nel pannello: il link personale da mandare a chi chiede
 * di reclamare la scheda, i loghi da approvare e lo stato di ogni risorsa.
 * Le risposte ai link (approva, modifica, rimuovi) si decidono in «Risposte
 * dei locali», insieme a quelle delle attività.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Risorse educative", robots: { index: false, follow: false } };

const STATO: Record<string, string> = {
  inviato: "Link inviato",
  aperto: "Link aperto",
  approvato: "Ha approvato",
  modifica: "Ha mandato modifiche",
  rimozione: "Chiede la rimozione",
};

export default async function AdminRisorse({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  if (!(await adminValido(codice))) return <NonDisponibile />;
  const [dati, loghi] = await Promise.all([adminDati(codice), adminLoghi(codice)]);
  const stato = new Map((dati?.inviti ?? []).filter((i) => i.chiave.startsWith("risorse/")).map((i) => [i.chiave, i.stato]));
  const attesa = loghi.filter((l) => l.stato === "in_attesa");

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/risorse" />
      <h1 className="text-3xl font-extrabold text-notte">Risorse educative</h1>
      <p className="mt-2 max-w-2xl text-notte-tenue">
        Chi tocca «È la tua realtà?» sulla pagina Risorse finisce in <strong>Candidature</strong>. Dopo aver controllato che gestisca
        davvero quella realtà, crea qui il link personale e mandaglielo per email: da lì approva, completa la scheda e carica il logo.
        Le risposte si decidono in <strong>Risposte dei locali</strong>, i loghi qui sotto.
      </p>
      {!dati && (
        <p className="mt-4 rounded-xl bg-rosso/10 px-4 py-3 font-bold text-rosso">
          Il database non risponde: vanno incollati in Supabase supabase/directory.sql e supabase/risorse-reclamo.sql.
        </p>
      )}

      <h2 className="mt-10 text-2xl font-extrabold text-notte">Loghi da decidere ({attesa.length})</h2>
      {attesa.length === 0 && <p className="mt-3 text-notte-tenue">Nessun logo in attesa.</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attesa.map((l) => {
          const r = risorsaDaChiave(l.chiave);
          return (
            <article key={l.id} className="flex items-center gap-4 rounded-[1.4rem] border border-notte/10 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- anteprima dal database, già ricodificata in WebP */}
              <img
                src={`data:image/webp;base64,${l.immagine}`}
                alt={`Logo caricato da ${r?.nome ?? l.chiave}`}
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-2xl border border-notte/10 object-contain"
              />
              <div className="flex min-w-0 flex-col gap-2">
                <p className="font-extrabold text-notte [overflow-wrap:anywhere]">{r?.nome ?? l.chiave}</p>
                <form className="flex flex-wrap gap-2">
                  <input type="hidden" name="codice" value={codice} />
                  <input type="hidden" name="id" value={l.id} />
                  <button formAction={decidiLogo.bind(null, "accettato")} className="rounded-xl bg-verde px-3 py-1.5 text-sm font-extrabold text-white">
                    Approva
                  </button>
                  <button formAction={decidiLogo.bind(null, "rifiutato")} className="rounded-xl border-2 border-rosso px-3 py-1.5 text-sm font-extrabold text-rosso">
                    Rifiuta
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>

      <h2 className="mt-10 text-2xl font-extrabold text-notte">Tutte le risorse ({RISORSE.length})</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {RISORSE.map((r) => {
          const s = stato.get(chiaveRisorsa(r));
          return (
            <li key={r.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-notte/10 bg-white p-4">
              <div className="min-w-0">
                <p className="font-extrabold text-notte [overflow-wrap:anywhere]">{r.nome}</p>
                <p className="text-sm font-semibold text-notte-tenue">
                  {r.localita ?? "Online"} · {s ? (STATO[s] ?? s) : "Nessun link"}
                  {(s === "approvato" || s === "modifica") && (
                    <>
                      {" · "}
                      <Link href={percorsoRisorsa(r)} target="_blank" className="font-bold text-viola underline">
                        pagina
                      </Link>
                    </>
                  )}
                </p>
              </div>
              <CreaLink codice={codice} slug={r.slug} giaInviato={Boolean(s)} />
            </li>
          );
        })}
      </ul>
    </Contenitore>
  );
}
