import {
  Accessibility,
  Baby,
  Backpack,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleHelp,
  Clock,
  Euro,
  House,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
  Sun,
  Trees,
  Users,
  Wallet,
} from "lucide-react";
import {
  campiPerCategoria,
  testoPrezzo,
  testoValore,
  videoRiconosciuto,
  type DefCampo,
  type Extra,
  type Gruppo,
  type IdCampo,
  type Intervallo,
  type Pacchetto,
  type Prezzo,
  type SchedaEstesa,
} from "@/lib/scheda-campi";
import { TitoloSezione } from "@/components/ui";
import { VideoAlTocco } from "./VideoAlTocco";

/**
 * Le parti della scheda pubblica che nascono dalla scheda estesa
 * (lib/scheda-campi.ts), sul modello di Booking, Airbnb Esperienze e dei
 * portali di eventi (docs/listing-ricerca.md § 5b). Un campo vuoto non si
 * inventa: nei dati chiave compare «da chiedere».
 */

type Valori = SchedaEstesa["valori"];

function Chip({ icona: I, titolo, valore, vuoto }: { icona: LucideIcon; titolo: string; valore: string; vuoto?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-notte/10 bg-white px-4 py-3">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${vuoto ? "bg-crema text-notte-tenue" : "bg-viola/10 text-viola"}`}>
        <I className="h-5 w-5" strokeWidth={2.2} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-extrabold uppercase tracking-wide text-notte-tenue">{titolo}</span>
        <span className={`block font-extrabold ${vuoto ? "text-notte-tenue" : "text-notte"}`}>{valore}</span>
      </span>
    </div>
  );
}

const anni = (i: Intervallo) =>
  i.da !== undefined && i.a !== undefined ? `${i.da}-${i.a} anni` : i.da !== undefined ? `da ${i.da} anni` : `fino a ${i.a} anni`;
const bambini = (i: Intervallo) =>
  i.da !== undefined && i.a !== undefined ? `${i.da}-${i.a}` : i.da !== undefined ? `da ${i.da}` : `fino a ${i.a}`;
const DURATA: Record<string, string> = { "90": "1 h 30", "120": "2 ore", "150": "2 h 30", "180": "3 ore", altro: "variabile" };
const AMBIENTE: Record<string, string> = { coperto: "Al coperto", aperto: "All'aperto", entrambi: "Coperto e aperto" };

/** La riga dei dati chiave, in testa alla scheda: sempre presente, con «da chiedere» dove manca. */
export function DatiChiave({ valori, etaCard }: { valori: Valori; etaCard?: string }) {
  const eta = valori.eta as Intervallo | undefined;
  const b = valori.bambini as Intervallo | undefined;
  const p = testoPrezzo(valori.prezzo as Prezzo | undefined);
  const amb = valori.ambiente as string | undefined;
  return (
    <section data-dati-chiave aria-label="Dati chiave" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      <Chip icona={Baby} titolo="Età" valore={eta ? anni(eta) : etaCard ?? "da chiedere"} vuoto={!eta && !etaCard} />
      <Chip icona={Users} titolo="Bambini" valore={b ? bambini(b) : "da chiedere"} vuoto={!b} />
      <Chip icona={Clock} titolo="Durata festa" valore={DURATA[valori.durata as string] ?? "da chiedere"} vuoto={!valori.durata} />
      <Chip icona={amb === "aperto" ? Trees : amb === "entrambi" ? Sun : House} titolo="Dove" valore={amb ? AMBIENTE[amb] : "da chiedere"} vuoto={!amb} />
      <div className="col-span-2 sm:col-span-1">
        <Chip icona={Euro} titolo="Prezzo" valore={p.prezzo} vuoto={!p.nota} />
      </div>
    </section>
  );
}

/** I punti di forza scelti dall'attività fra i suoi servizi. */
export function PuntiForza({ categoria, valori }: { categoria: string; valori: Valori }) {
  const pf = valori.puntiForza as string[] | undefined;
  if (!pf?.length) return null;
  const def = campiPerCategoria(categoria).find((c) => c.id === "puntiForza")!;
  return (
    <ul className="flex flex-wrap gap-2">
      {pf.map((id) => (
        <li key={id} className="flex items-center gap-1.5 rounded-full bg-[#E3F4E7] px-3.5 py-1.5 text-sm font-extrabold text-[#2E7D4A]">
          <Sparkles className="h-4 w-4" aria-hidden />
          {def.opzioni?.find((o) => o.id === id)?.nome ?? id}
        </li>
      ))}
    </ul>
  );
}

const euro = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")} €`;

/** Prezzo, pacchetti, incluso ed extra: «la mamma calcola la spesa senza sorprese». */
export function PrezziPacchetti({ categoria, valori }: { categoria: string; valori: Valori }) {
  const p = testoPrezzo(valori.prezzo as Prezzo | undefined);
  const pacchetti = valori.pacchetti as Pacchetto[] | undefined;
  const extra = valori.extra as Extra[] | undefined;
  const incluso = valori.incluso as string[] | undefined;
  const defIncluso = campiPerCategoria(categoria).find((c) => c.id === "incluso");
  if (!pacchetti && !extra && !incluso && !p.nota) return null;
  return (
    <section data-prezzi>
      <TitoloSezione>Prezzi e pacchetti festa</TitoloSezione>
      <div className="rounded-[1.4rem] border border-notte/10 bg-white p-5">
        <p className="flex items-center gap-2 text-xl font-extrabold text-notte">
          <Wallet className="h-5 w-5 text-viola" aria-hidden />
          {p.prezzo}
        </p>
        {p.nota && <p className="mt-1 text-sm font-semibold text-notte-tenue">{p.nota}: chiedete sempre la conferma.</p>}
      </div>
      {pacchetti && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pacchetti.map((k) => (
            <article key={k.nome} className="flex flex-col gap-2 rounded-[1.4rem] border-2 border-crema-scuro bg-white p-5">
              <p className="text-lg font-extrabold text-notte">{k.nome}</p>
              {k.prezzo !== undefined && <p className="text-2xl font-black text-viola">{euro(k.prezzo)}</p>}
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-notte-tenue">
                {k.bambini && (
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" aria-hidden /> {bambini(k.bambini)} bambini</span>
                )}
                {k.durata && (
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden /> {k.durata % 60 ? `${Math.floor(k.durata / 60)} h ${k.durata % 60}` : `${k.durata / 60} ore`}</span>
                )}
              </p>
              {k.comprende && <p className="text-sm text-notte">{k.comprende}</p>}
            </article>
          ))}
        </div>
      )}
      {(incluso || extra) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {incluso && (
            <div className="rounded-[1.4rem] bg-[#E3F4E7] p-5">
              <p className="font-extrabold text-[#2E7D4A]">Incluso nel prezzo</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {incluso.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-notte">
                    <Check className="h-4 w-4 text-[#2E7D4A]" strokeWidth={3} aria-hidden />
                    {defIncluso?.opzioni?.find((o) => o.id === i)?.nome ?? i}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {extra && (
            <div className="rounded-[1.4rem] border-2 border-crema-scuro bg-white p-5">
              <p className="font-extrabold text-notte">Extra a pagamento</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {extra.map((e) => (
                  <li key={e.nome} className="flex justify-between gap-3 text-sm font-bold text-notte">
                    <span>{e.nome}</span>
                    {e.prezzo !== undefined && <span className="text-notte-tenue">{euro(e.prezzo)}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** Campi già mostrati altrove nella scheda: qui non si ripetono. */
const GIA_MOSTRATI = new Set<string>([
  "descrizione", "indirizzo", "puntiForza", "fannoFeste", "eta", "bambini", "durata", "ambiente", "prezzo", "pacchetti", "extra", "incluso",
  "whatsapp", "telefono", "sito", "instagram", "facebook", "tiktok", "schedaGoogle", "video",
]);

const BLOCCHI: { titolo: string; icona: LucideIcon; gruppi: Gruppo[] }[] = [
  { titolo: "La festa", icona: CalendarDays, gruppi: ["Per chi", "La festa"] },
  { titolo: "Prenotare", icona: BadgeCheck, gruppi: ["Prenotare", "Prezzi"] },
  { titolo: "Orari", icona: Clock, gruppi: ["Quando"] },
  { titolo: "Spazi e comodità", icona: Accessibility, gruppi: ["Dove e comodità"] },
  { titolo: "Sicurezza e regole", icona: ShieldCheck, gruppi: ["Sicurezza e regole"] },
  { titolo: "Prima di andare", icona: Backpack, gruppi: ["Prima di andare"] },
];

/** Tutti gli altri campi compilati, a blocchi come la pagina di una struttura su Booking. */
export function BlocchiDettaglio({ categoria, valori }: { categoria: string; valori: Valori }) {
  const campi = campiPerCategoria(categoria).filter(
    (c) => !GIA_MOSTRATI.has(c.id) && valori[c.id as IdCampo] !== undefined,
  );
  const blocchi = BLOCCHI.map((b) => ({ ...b, campi: campi.filter((c) => b.gruppi.includes(c.gruppo)) })).filter((b) => b.campi.length);
  if (!blocchi.length) return null;
  return (
    <section data-dettagli className="grid gap-4 sm:grid-cols-2">
      {blocchi.map((b) => (
        <div key={b.titolo} className="rounded-[1.4rem] border border-notte/10 bg-white p-5">
          <p className="flex items-center gap-2 text-lg font-extrabold text-notte">
            <b.icona className="h-5 w-5 text-viola" aria-hidden />
            {b.titolo}
          </p>
          <dl className="mt-3 flex flex-col gap-2.5">
            {b.campi.map((c: DefCampo) => (
              <div key={c.id}>
                <dt className="text-xs font-extrabold uppercase tracking-wide text-notte-tenue">{c.pubblica ?? c.etichetta}</dt>
                <dd className="whitespace-pre-line font-semibold text-notte">{testoValore(c, valori[c.id as IdCampo]!)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
}

/** Reel e video con il player ufficiale, al tocco. */
export function VideoAttivita({ valori, nome }: { valori: Valori; nome: string }) {
  const lista = ((valori.video as string[] | undefined) ?? []).map(videoRiconosciuto).filter((v) => v !== null);
  if (!lista.length) return null;
  return (
    <section data-video-attivita>
      <TitoloSezione>Reel e video di {nome}</TitoloSezione>
      <div className="flex flex-wrap gap-4">
        {lista.map((v) => (
          <VideoAlTocco key={v.url} video={v} nome={nome} />
        ))}
      </div>
    </section>
  );
}

/** Le domande per i campi vuoti: non scritto non vuol dire che manchi. */
export function DaChiedere({ domande }: { domande: string[] }) {
  if (!domande.length) return null;
  return (
    <div className="mt-5 rounded-[1.4rem] border-2 border-dashed border-crema-scuro bg-white p-5">
      <p className="font-black text-notte">Da chiedere al locale</p>
      <p className="mt-1 text-sm text-notte-tenue">Non è scritto nella scheda, il che non vuol dire che manchi:</p>
      <ul className="mt-3 flex flex-col gap-2">
        {domande.map((d) => (
          <li key={d} className="flex gap-2 text-sm font-bold text-notte">
            <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-viola" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

