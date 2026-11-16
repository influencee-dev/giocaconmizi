import type { Metadata } from "next";
import Link from "next/link";
import { SCHEDE, percorsoScheda } from "@/lib/directory";
import { adminSchedeGiorgia } from "@/lib/directory-db";
import { adminValido } from "@/lib/admin";
import { chiaveAiPresente, fornitoreAi, nomeChiaveAi } from "@/lib/import-ai";
import { Contenitore } from "@/components/ui";
import { MenuAdmin } from "../MenuAdmin";
import { NonDisponibile } from "../NonDisponibile";
import { Importatore, type SchedaScelta } from "./Importatore";

/**
 * Importazione con l'AI (lib/import-ai.ts): Giorgia prepara le schede leggendo
 * sito e social ufficiali delle attività, controlla campo per campo e decide se
 * pubblicare o lasciare la scheda pronta per quando l'attività apre il suo link.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Importa con l'AI", robots: { index: false, follow: false } };

const quando = (d: string) => new Date(d).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminImporta({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  if (!(await adminValido(codice))) return <NonDisponibile />;
  const preparate = await adminSchedeGiorgia(codice);
  const schede: SchedaScelta[] = SCHEDE.map((s) => ({
    chiave: `${s.cittaSlug}/${s.slug}`,
    nome: s.nome,
    citta: s.citta,
    categoria: s.categoria.slug,
    nomeCategoria: s.categoria.nome,
    ...(s.sito && { sito: s.sito }),
    ...(s.instagram && { instagram: s.instagram }),
  }));
  const perChiave = new Map(SCHEDE.map((s) => [`${s.cittaSlug}/${s.slug}`, s]));
  const chiaveAttiva = chiaveAiPresente();

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/importa" />
      <h1 className="text-3xl font-extrabold text-notte">Importa con l&apos;AI</h1>
      <p className="mt-2 max-w-2xl text-notte-tenue">
        L&apos;AI legge il sito ufficiale e i post pubblici di un locale e propone i campi della scheda, con la frase della fonte accanto.
        Prende solo fatti scritti: quello che non trova resta «da chiedere». Nessuna foto viene presa. AI in uso: {fornitoreAi() === "gemini" ? "Gemini di Google (piano gratuito)" : "Claude di Anthropic"}.
      </p>
      {!chiaveAttiva && (
        <p className="mt-4 rounded-xl bg-[#FFF3CF] px-4 py-3 text-sm font-bold text-[#7A5A00]" data-manca-chiave>
          Per attivarla manca la chiave {nomeChiaveAi()} su Vercel (Settings → Environment Variables). Finché non c&apos;è, la pagina si apre ma l&apos;AI non risponde.
        </p>
      )}
      <div className="mt-6">
        <Importatore codice={codice} schede={schede} />
      </div>

      <h2 className="mt-12 text-2xl font-extrabold text-notte">Schede preparate ({preparate.length})</h2>
      {preparate.length === 0 ? (
        <p className="mt-3 text-notte-tenue">Ancora nessuna.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {preparate.map((p) => {
            const s = perChiave.get(p.chiave);
            return (
              <li key={p.chiave} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-notte/10 bg-white px-4 py-3">
                <span className="font-extrabold text-notte">
                  {s?.nome ?? p.chiave} <span className="text-sm font-bold text-notte-tenue">· {s?.citta} · {quando(p.aggiornato_il)}</span>
                </span>
                <span className="flex items-center gap-3 text-sm font-extrabold">
                  <span className={p.pubblicata ? "text-[#2E7D4A]" : "text-notte-tenue"}>{p.pubblicata ? "Pubblicata" : "Pronta per l'attività"}</span>
                  {s && (
                    <Link href={percorsoScheda(s)} target="_blank" className="text-viola">Apri ›</Link>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Contenitore>
  );
}
