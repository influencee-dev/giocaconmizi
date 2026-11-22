"use client";

import { BookOpen, Gift, PartyPopper, Sparkles } from "lucide-react";
import Link from "next/link";
import { IconaGioco } from "@/components/icone";
import type { Skill } from "@/games/registry";
import { bimboAttivo, ETA, EVENTO_APRI_BENVENUTO, salvaProfilo, useProfilo } from "@/lib/famiglia/profilo";

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

/** Una guida o un articolo da mostrare nella home dell'app. */
export interface LetturaBreve {
  slug: string;
  titolo: string;
  minuti: number;
  /** La foto piccola di testata, se è già arrivata. */
  foto?: string;
}

/** Una storia da mostrare nella home dell'app. */
export interface StoriaBreve {
  slug: string;
  titolo: string;
  eta: number;
  minuti: number;
}

/**
 * L'ORDINE DELLA HOME DELL'APP È UNA DECISIONE DI GIORGIA (22/11/2026) e vale
 * sempre: prima i GIOCHI, poi le LOCATION (dove fare la festa), poi le STORIE,
 * poi gli ARTICOLI. Una sezione nuova va messa al suo posto in quest'ordine,
 * mai sopra i giochi. La stessa regola vale per la barra in basso (BarraSchede).
 *
 * `recenti`: gli slug degli ultimi arrivati, dal più recente (lib/giochi/novita.ts).
 * `citta`: le prime città delle feste, per popolazione. `storie`: le storie.
 * `letture`: gli articoli e le guide più recenti. Prima nell'app c'era solo una
 * casella «Guide»: gli articoli nuovi non si vedevano mai.
 */
export function HomeApp({
  giochi,
  inVetrina,
  recenti = [],
  citta = [],
  quanteCitta = 0,
  storie = [],
  letture = [],
}: {
  giochi: GiocoBreve[];
  inVetrina: string[];
  recenti?: string[];
  citta?: { slug: string; nome: string }[];
  quanteCitta?: number;
  storie?: StoriaBreve[];
  letture?: LetturaBreve[];
}) {
  const { profilo, pronto } = useProfilo();
  const bimbo = bimboAttivo(profilo);
  const adatti = bimbo ? giochi.filter((g) => bimbo.eta >= g.etaMin && bimbo.eta <= g.etaMax) : giochi.filter((g) => inVetrina.includes(g.slug));
  const oggi = delGiorno(adatti.length ? adatti : giochi);
  const carosello = (adatti.length ? adatti : giochi).filter((g) => g.slug !== oggi?.slug).slice(0, 8);
  // Gli ultimi arrivati: i due più recenti adatti all'età del bimbo, diversi dal gioco di oggi.
  const ultimi = recenti
    .map((s) => giochi.find((g) => g.slug === s))
    .filter((g): g is GiocoBreve => Boolean(g) && g!.slug !== oggi?.slug && (!bimbo || (bimbo.eta >= g!.etaMin && bimbo.eta <= g!.etaMax)))
    .slice(0, 2);

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
              <p className="mt-1 text-[clamp(1.15rem,5.8vw,1.45rem)] font-black leading-tight [overflow-wrap:anywhere]">{oggi.titolo}</p>
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

      {ultimi.length > 0 && (
        <div className="mt-5" data-ultimi-arrivati-app>
          <p className="text-lg font-black text-notte">Gli ultimi arrivati</p>
          <ul className="mt-2 flex flex-col gap-2">
            {ultimi.map((g, i) => (
              <li key={g.slug}>
                <Link
                  href={`/giochi/${g.slug}`}
                  className="flex items-center gap-3 rounded-[1.4rem] bg-white p-3 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.5)]"
                  data-ultimo-arrivato={g.slug}
                >
                  <span className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-2xl ${TONI[(i + 2) % TONI.length]}`}>
                    <IconaGioco slug={g.slug} skill={g.skill} lato="h-9 w-9" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-black leading-tight text-notte [overflow-wrap:anywhere]">{g.titolo}</span>
                    <span className="block text-sm font-bold text-notte-tenue">
                      {g.etaMin}–{g.etaMax} anni · {g.minuti} minuti
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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

      {/* 2. Location: dove fare la festa, città per città. */}
      {citta.length > 0 && (
        <div className="mt-6" data-location-app>
          <div className="flex items-center justify-between">
            <p className="text-lg font-black text-notte">Dove fare la festa</p>
            <Link href="/feste" className="text-sm font-black text-viola" style={{ minHeight: 0, minWidth: 0 }}>
              {quanteCitta} città
            </Link>
          </div>
          <ul className="mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
            {citta.map((c, i) => (
              <li key={c.slug} className="shrink-0 snap-start">
                <Link
                  href={`/feste/${c.slug}`}
                  className={`flex h-16 items-center gap-2 rounded-[1.3rem] px-4 text-[16px] font-black text-notte ${TONI[i % TONI.length]}`}
                  data-citta-app={c.slug}
                >
                  <PartyPopper className="h-5 w-5 shrink-0" strokeWidth={2.4} aria-hidden />
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/biglietti"
            className="mt-1 flex items-center gap-3 rounded-[1.3rem] bg-[#FDE8F0] px-4 py-3.5"
            data-inviti-app
          >
            <Gift className="h-6 w-6 shrink-0 text-notte" strokeWidth={2.4} aria-hidden />
            <span className="min-w-0">
              <span className="block text-[17px] font-black leading-tight text-notte">Inviti di compleanno</span>
              <span className="block text-[13px] font-bold text-notte-tenue">da mandare su WhatsApp, con la conferma</span>
            </span>
          </Link>
        </div>
      )}

      {/* 3. Storie: da leggere stasera. */}
      {storie.length > 0 && (
        <div className="mt-6" data-storie-app>
          <div className="flex items-center justify-between">
            <p className="text-lg font-black text-notte">Storie da leggere</p>
            <Link href="/storie" className="text-sm font-black text-viola" style={{ minHeight: 0, minWidth: 0 }}>
              Vedi tutte
            </Link>
          </div>
          <ul className="mt-2 flex flex-col gap-2">
            {(bimbo ? [...storie].sort((a, b) => Math.abs(a.eta - bimbo.eta) - Math.abs(b.eta - bimbo.eta)) : storie).slice(0, 3).map((st, i) => (
              <li key={st.slug}>
                <Link
                  href={`/storie/${st.slug}`}
                  className="flex items-center gap-3 rounded-[1.4rem] bg-white p-3 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.5)]"
                  data-storia-app={st.slug}
                >
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${TONI[(i + 1) % TONI.length]}`}>
                    <BookOpen className="h-7 w-7 text-notte" strokeWidth={2.2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-black leading-tight text-notte [overflow-wrap:anywhere]">{st.titolo}</span>
                    <span className="mt-0.5 block text-sm font-bold text-notte-tenue">
                      dai {st.eta} anni · {st.minuti} min
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Articoli: le ultime guide e gli ultimi articoli, con la foto. */}
      {letture.length > 0 && (
        <div className="mt-6" data-letture-app>
          <div className="flex items-center justify-between">
            <p className="text-lg font-black text-notte">Articoli per i genitori</p>
            <Link href="/guide" className="text-sm font-black text-viola" style={{ minHeight: 0, minWidth: 0 }}>
              Vedi tutte
            </Link>
          </div>
          <ul className="mt-2 flex flex-col gap-2">
            {letture.map((l, i) => (
              <li key={l.slug}>
                <Link
                  href={`/guide/${l.slug}`}
                  className="flex items-center gap-3 rounded-[1.4rem] bg-white p-3 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.5)]"
                  data-lettura={l.slug}
                >
                  {l.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- foto già pronta in tre misure: qui basta la piccola
                    <img src={l.foto} alt="" width={96} height={64} loading="lazy" decoding="async" className="h-16 w-24 shrink-0 rounded-2xl object-cover" />
                  ) : (
                    <span className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-2xl ${TONI[i % TONI.length]}`}>
                      <BookOpen className="h-7 w-7 text-notte" strokeWidth={2.2} aria-hidden />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-black leading-tight text-notte [overflow-wrap:anywhere]">{l.titolo}</span>
                    <span className="mt-0.5 block text-sm font-bold text-notte-tenue">{l.minuti} minuti di lettura</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
