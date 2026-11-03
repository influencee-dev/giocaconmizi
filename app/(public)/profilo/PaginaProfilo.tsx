"use client";

import { Lock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Contenitore } from "@/components/ui";
import { ETA, EVENTO_APRI_BENVENUTO, iscriviPosta, salvaProfilo, useProfilo, type Profilo } from "@/lib/profilo";

/**
 * La pagina Profilo (Figma «App mobile», 7): nomi, bimbi, posta di Mizi e
 * «Cancella i miei dati». Tutto resta sul telefono; la posta passa da Brevo
 * con il doppio opt-in, e ci si cancella dal link in fondo a ogni email.
 */
export function PaginaProfilo() {
  const { profilo, pronto } = useProfilo();
  const [modifica, setModifica] = useState(false);
  const [avviso, setAvviso] = useState("");

  if (!pronto) return <div className="min-h-[50vh]" />;

  if (!profilo) {
    return (
      <Contenitore className="py-10">
        <h1 className="text-3xl font-black text-notte">Il tuo profilo</h1>
        <p className="mt-3 max-w-md text-notte-tenue">
          Con il profilo Giocamizi ti saluta per nome e ti propone ogni giorno i giochi giusti per l&apos;età del tuo bimbo. Resta solo su questo telefono.
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(EVENTO_APRI_BENVENUTO))}
          className="mt-6 rounded-[1.4rem] bg-viola px-6 py-4 text-lg font-black text-white md:hidden"
          data-crea-profilo
        >
          Crea il profilo
        </button>
        <p className="mt-6 hidden text-notte-tenue md:block">Il profilo si crea dal telefono, aprendo Giocamizi.</p>
      </Contenitore>
    );
  }

  const aggiorna = (p: Partial<Profilo>) => salvaProfilo({ ...profilo, ...p });

  return (
    <Contenitore className="py-8">
      <h1 className="text-3xl font-black text-notte">Il tuo profilo</h1>

      <div className="mt-5 flex max-w-xl flex-col gap-4">
        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.4)]" aria-label="Mamma">
          {modifica ? (
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="font-extrabold">Il tuo nome</span>
                <input value={profilo.mamma} onChange={(e) => aggiorna({ mamma: e.target.value.slice(0, 40) })} className="w-full min-w-0 rounded-2xl border-2 border-viola px-4 py-3 text-lg font-bold" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-extrabold">Email</span>
                <input type="email" value={profilo.email} onChange={(e) => aggiorna({ email: e.target.value.trim().toLowerCase() })} className="w-full min-w-0 rounded-2xl border-2 border-viola px-4 py-3 text-lg font-bold" />
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xl font-black text-notte" data-nome-mamma>{profilo.mamma}</p>
                <p className="break-words text-sm font-bold text-notte-tenue">{profilo.email}</p>
              </div>
            </div>
          )}
          <button type="button" onClick={() => setModifica((m) => !m)} className="mt-3 text-sm font-black text-viola" style={{ minHeight: 0, minWidth: 0 }}>
            {modifica ? "Fatto" : "Modifica"}
          </button>
        </section>

        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.4)]" aria-label="I tuoi bimbi">
          <p className="font-extrabold text-notte-tenue">I tuoi bimbi</p>
          <ul className="mt-3 flex flex-col gap-4">
            {profilo.bimbi.map((b, i) => (
              <li key={i} className="flex flex-col gap-2" data-bimbo={i}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => aggiorna({ attivo: i })}
                    aria-pressed={i === profilo.attivo}
                    aria-label={`Scegli i giochi per ${b.nome}`}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black text-white ${i === profilo.attivo ? "bg-rosa ring-4 ring-rosa/30" : "bg-notte-tenue/40"}`}
                    style={{ minHeight: 0, minWidth: 0 }}
                  >
                    {b.nome.slice(0, 1).toUpperCase() || "?"}
                  </button>
                  <input
                    value={b.nome}
                    aria-label="Nome del bimbo"
                    onChange={(e) => aggiorna({ bimbi: profilo.bimbi.map((x, j) => (j === i ? { ...x, nome: e.target.value.slice(0, 30) } : x)) })}
                    className="min-w-0 flex-1 rounded-xl border-2 border-crema-scuro px-3 py-2 font-black"
                  />
                  {profilo.bimbi.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Togli ${b.nome}`}
                      onClick={() => aggiorna({ bimbi: profilo.bimbi.filter((_, j) => j !== i), attivo: 0 })}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-arancione"
                      style={{ minHeight: 0, minWidth: 0 }}
                    >
                      <Trash2 className="h-5 w-5" strokeWidth={2.4} aria-hidden />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                  {ETA.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={b.eta === a}
                      onClick={() => aggiorna({ bimbi: profilo.bimbi.map((x, j) => (j === i ? { ...x, eta: a } : x)) })}
                      className={`h-10 rounded-xl border-2 text-sm font-black ${b.eta === a ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white"}`}
                      style={{ minHeight: 0, minWidth: 0 }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          {profilo.bimbi.length < 4 && (
            <button
              type="button"
              onClick={() => aggiorna({ bimbi: [...profilo.bimbi, { nome: "Nuovo bimbo", eta: profilo.bimbi[0]?.eta ?? 6 }] })}
              className="mt-4 flex items-center gap-1.5 font-black text-viola"
              style={{ minHeight: 0 }}
            >
              <Plus className="h-5 w-5" strokeWidth={3} aria-hidden /> Aggiungi un bimbo
            </button>
          )}
        </section>

        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.4)]" aria-label="La posta di Mizi">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-black text-notte">La posta di Mizi</p>
              <p className="text-sm font-bold text-notte-tenue">{profilo.posta ? "Accesa · 1 email a settimana" : "Spenta"}</p>
            </div>
            {!profilo.posta && (
              <button
                type="button"
                onClick={async () => {
                  setAvviso("");
                  const ok = await iscriviPosta(profilo.email, profilo.bimbi[profilo.attivo]?.eta);
                  if (ok) {
                    aggiorna({ posta: true });
                    setAvviso("Ti abbiamo scritto: conferma dal link nell'email e la posta parte.");
                  } else setAvviso("Non siamo riusciti a iscriverti. Riprova tra poco.");
                }}
                className="shrink-0 rounded-2xl bg-viola px-4 py-2.5 font-black text-white"
                style={{ minHeight: 0 }}
                data-accendi-posta
              >
                Accendi
              </button>
            )}
          </div>
          {profilo.posta && <p className="mt-2 text-sm text-notte-tenue">Per spegnerla tocca «Cancella l&apos;iscrizione» in fondo a una delle nostre email.</p>}
          {avviso && (
            <p role="status" className="mt-2 text-sm font-bold text-viola">
              {avviso}
            </p>
          )}
          <p className="mt-2 text-xs text-notte-tenue">Ho almeno 18 anni e accendendola accetto di ricevere la posta di Mizi (vedi la privacy).</p>
        </section>

        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.4)]" aria-label="I tuoi dati">
          <p className="flex items-start gap-2 text-sm font-semibold text-notte-tenue">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.4} aria-hidden />
            Nomi, età ed email restano su questo telefono. L&apos;email arriva a noi solo se accendi la posta di Mizi.
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Cancello il profilo da questo telefono?")) salvaProfilo(null);
            }}
            className="mt-3 font-black text-arancione"
            style={{ minHeight: 0 }}
            data-cancella
          >
            Cancella i miei dati
          </button>
        </section>
      </div>
    </Contenitore>
  );
}
