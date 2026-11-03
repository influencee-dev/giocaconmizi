"use client";

import { BookOpen, Gift, PartyPopper, Sparkles } from "lucide-react";
import Link from "next/link";
import { IconaGioco } from "@/components/icone";
import type { Skill } from "@/games/registry";
import { bimboAttivo, ETA, EVENTO_APRI_BENVENUTO, salvaProfilo, useProfilo } from "@/lib/profilo";

/**
 * La testa della home sul telefono, come un'app (Figma «App mobile», 6):
 * il saluto, il gioco di oggi e i giochi giusti per l'età del bimbo scelto.
 * Senza profilo: le età da toccare e l'invito a crearlo. Sopra i 768 px non
 * c'è: resta la home del sito.
 */

export interface GiocoBreve {
  slug: string;
  titolo: string;
  etaMin: number;
  etaMax: number;
  minuti: number;
  skill: Skill;
}

const TONI = ["bg-[#FFF3CF]", "bg-[#E3F5FC]", "bg-[#E6F5EA]", "bg-[#FDE8F0]", "bg-[#EFE6FA]"];
const ACCENTI = ["text-arancione", "text-azzurro", "text-verde", "text-rosa", "text-viola"];

/** Lo stesso gioco per tutto il giorno, diverso domani. */
function delGiorno<T>(lista: T[]): T | undefined {
  if (!lista.length) return undefined;
  const giorno = Math.floor(Date.now() / 86_400_000);
  return lista[giorno % lista.length];
}

export function HomeApp({ giochi, inVetrina }: { giochi: GiocoBreve[]; inVetrina: string[] }) {
  const { profilo, pronto } = useProfilo();
  const bimbo = bimboAttivo(profilo);
  const adatti = bimbo ? giochi.filter((g) => bimbo.eta >= g.etaMin && bimbo.eta <= g.etaMax) : giochi.filter((g) => inVetrina.includes(g.slug));
  const oggi = delGiorno(adatti.length ? adatti : giochi);
  const carosello = (adatti.length ? adatti : giochi).filter((g) => g.slug !== oggi?.slug).slice(0, 8);

  return (
    <section className="px-4 pt-4 md:hidden" aria-label="La tua giornata su Giocamizi" data-home-app>
      {/* Il saluto: con il profilo per nome, senza un invito a crearlo. */}
      <div className={`flex items-start justify-between gap-3 transition-opacity ${pronto ? "opacity-100" : "opacity-0"}`}>
        <div className="min-w-0">
          <p className="text-[1.9rem] font-black leading-tight text-notte" data-saluto>
            {profilo ? `Ciao ${profilo.mamma}!` : "Ciao! Per chi giochiamo?"}
          </p>
          <p className="mt-0.5 text-[15px] font-bold text-notte-tenue">
            {bimbo ? `Oggi per ${bimbo.nome} · ${bimbo.eta} anni` : "Giochi gratis, senza pubblicità"}
          </p>
        </div>
        {profilo ? (
          <Link href="/profilo" aria-label="Il tuo profilo" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rosa text-xl font-black text-white" style={{ minHeight: 0, minWidth: 0 }}>
            {(bimbo?.nome ?? profilo.mamma).slice(0, 1).toUpperCase()}
          </Link>
        ) : null}
      </div>

      {profilo && profilo.bimbi.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {profilo.bimbi.map((b, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === profilo.attivo}
              onClick={() => salvaProfilo({ ...profilo, attivo: i })}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-black ${i === profilo.attivo ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white text-notte"}`}
              style={{ minHeight: 0, minWidth: 0 }}
            >
              {b.nome} · {b.eta}
            </button>
          ))}
        </div>
      )}

      <h1 className="mt-3 text-sm font-bold leading-snug text-notte-tenue">
        Giochi educativi, storie e feste di compleanno per bambini dai 3 ai 12 anni
      </h1>

      {/* Il gioco di oggi */}
      {oggi && (
        <div className="relative mt-4 overflow-hidden rounded-[1.75rem] bg-viola p-5 text-white shadow-[0_16px_34px_-16px_rgba(155,109,214,0.9)]">
          <span aria-hidden className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wide text-giallo">Il gioco di oggi</p>
              <p className="mt-1 text-[1.45rem] font-black leading-tight">{oggi.titolo}</p>
              <p className="mt-1 text-sm font-bold text-white/85">
                {oggi.etaMin}–{oggi.etaMax} anni · {oggi.minuti} minuti
              </p>
              <Link href={`/giochi/${oggi.slug}/gioca`} className="mt-3 inline-flex rounded-2xl bg-giallo px-5 py-2.5 font-black text-notte" style={{ minHeight: 0 }} data-gioca-oggi>
                Gioca
              </Link>
            </div>
            <span className="shrink-0 rounded-[1.25rem] bg-white/15 p-2">
              <IconaGioco slug={oggi.slug} skill={oggi.skill} lato="h-14 w-14" />
            </span>
          </div>
        </div>
      )}

      {/* Le età (senza profilo) o i giochi scelti per l'età */}
      {!bimbo && (
        <div className="mt-5">
          <p className="text-lg font-black text-notte">Quanti anni ha il tuo bimbo?</p>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {ETA.map((a) => (
              <Link key={a} href={`/giochi/eta/${a}-anni`} className="flex h-12 items-center justify-center rounded-2xl border-2 border-crema-scuro bg-white text-lg font-black text-notte" style={{ minHeight: 0, minWidth: 0 }}>
                {a}
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(EVENTO_APRI_BENVENUTO))}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 font-black text-viola shadow-[0_8px_20px_-14px_rgba(31,36,48,0.5)]"
            data-crea-profilo
          >
            <Sparkles className="h-5 w-5" strokeWidth={2.6} aria-hidden /> Crea il profilo: i giochi giusti ogni giorno
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-black text-notte">{bimbo ? `Scelti per ${bimbo.eta} anni` : "I più giocati"}</p>
        <Link href={bimbo ? `/giochi/eta/${bimbo.eta}-anni` : "/giochi"} className="text-sm font-black text-viola" style={{ minHeight: 0, minWidth: 0 }}>
          Vedi tutti
        </Link>
      </div>
      <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none]" data-carosello>
        {carosello.map((g, i) => (
          <li key={g.slug} className="w-[9.5rem] shrink-0 snap-start">
            <Link href={`/giochi/${g.slug}`} className="flex h-full flex-col gap-1.5 rounded-[1.4rem] bg-white p-3 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.5)]">
              <span className={`flex h-20 items-center justify-center rounded-2xl ${TONI[i % TONI.length]}`}>
                <IconaGioco slug={g.slug} skill={g.skill} lato="h-11 w-11" />
              </span>
              <span className="text-[15px] font-black leading-tight text-notte">{g.titolo}</span>
              <span className={`text-xs font-bold ${ACCENTI[i % ACCENTI.length]}`}>
                {g.etaMin}–{g.etaMax} anni · {g.minuti} min
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Per la mamma */}
      <p className="mt-5 text-lg font-black text-notte">Per la mamma</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {[
          { href: "/biglietti", nome: "Inviti", sotto: "per il compleanno", Icona: Gift, tono: "bg-[#FDE8F0]" },
          { href: "/feste", nome: "Feste", sotto: "posti nella tua città", Icona: PartyPopper, tono: "bg-[#FFF3CF]" },
          { href: "/storie", nome: "Storie", sotto: "da leggere stasera", Icona: BookOpen, tono: "bg-[#E3F5FC]" },
          { href: "/guide", nome: "Guide", sotto: "3 minuti, pratiche", Icona: Sparkles, tono: "bg-[#E6F5EA]" },
        ].map(({ href, nome, sotto, Icona, tono }) => (
          <Link key={href} href={href} className={`flex flex-col gap-1 rounded-[1.3rem] px-4 py-3.5 ${tono}`}>
            <Icona className="h-6 w-6 text-notte" strokeWidth={2.4} aria-hidden />
            <span className="text-[17px] font-black text-notte">{nome}</span>
            <span className="text-[13px] font-bold text-notte-tenue">{sotto}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
