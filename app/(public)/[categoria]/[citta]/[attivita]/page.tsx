import type { Metadata } from "next";
import { Condividi } from "@/components/ui/Condividi";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCHEDE, datiCard, haListing, percorsoScheda, scheda, schedeDi } from "@/lib/directory/directory";
import { chiaveScheda, conModifiche, pubblicate, type DatiModifica } from "@/lib/directory/directory-db";
import { url, riassunto, titoloScheda } from "@/lib/seo/seo";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { Briciole, CtaAttivita, InBreve } from "@/components/directory/Briciole";
import { CardAttivita } from "@/components/directory/CardAttivita";
import { Illustrazione } from "@/components/directory/Illustrazione";
import { ReelInstagram } from "@/components/feste/ReelInstagram";
import { Contatore } from "@/components/directory/Contatore";
import { Globe, Instagram, MessageCircle, Phone } from "lucide-react";
import { Etichetta } from "@/components/directory/Etichetta";
import { ESPERIENZE } from "@/lib/directory/esperienze";
import { daChiedere as domandeDaChiedere, eSchedaEstesa, jsonLdEstesa, testoPrezzo, type Prezzo } from "@/lib/directory/scheda-campi";
import { IconaLucide } from "@/components/directory/IconaLucide";
import { BlocchiDettaglio, DaChiedere, DatiChiave, PrezziPacchetti, PuntiForza, VideoAttivita } from "@/components/directory/SchedaDettagli";
import { BadgeCheck, Camera } from "lucide-react";

/** La scheda di un'attività (Figma 04–06). */

export const dynamicParams = false;
// Le risposte approvate dei locali arrivano dal database: rigenerazione ogni 10 minuti.
export const revalidate = 600;

export function generateStaticParams() {
  return SCHEDE.map((s) => ({ categoria: s.categoria.slug, citta: s.cittaSlug, attivita: s.slug }));
}

type P = { params: Promise<{ categoria: string; citta: string; attivita: string }> };

async function trova(params: P["params"]) {
  const { categoria, citta, attivita } = await params;
  return scheda(categoria, citta, attivita) ?? null;
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = await trova(params);
  if (!s) return {};
  return {
    // Titolo corto (lib/seo/seo.ts): nome, che cos'è e città stanno in 65 caratteri.
    title: titoloScheda(s),
    // Nome, tipo e città sono già nel titolo: qui va il racconto del posto,
    // tagliato perché stia intero nei risultati di ricerca (prima arrivava a 500 caratteri).
    // Un racconto molto corto si completa con che cos'è il posto e dove sta.
    description: riassunto(s.descrizione.length < 110 ? `${s.descrizione} ${s.nome}: ${s.tipo} a ${s.citta}, zona ${s.zona}.` : s.descrizione),
    alternates: { canonical: percorsoScheda(s) },
  };
}

const numero = (t: string) => t.replace(/[^\d+]/g, "");
const wa = (t: string) => {
  const n = numero(t).replace(/^\+/, "").replace(/^00/, "");
  return `https://wa.me/${/^3\d{8,9}$/.test(n) ? `39${n}` : n}`;
};

function Contatti({ sito, instagram, extra, festa, prezzo }: { sito?: string; instagram?: string; extra: DatiModifica; festa: boolean; prezzo: { prezzo: string; nota?: string } }) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.4rem] border border-notte/10 bg-white p-5 shadow-[0_10px_30px_rgba(31,36,48,0.08)]">
      <div>
        <p className="text-2xl font-black text-notte">{prezzo.prezzo}</p>
        {prezzo.nota && <p className="text-xs font-semibold text-notte-tenue">{prezzo.nota}</p>}
      </div>
      <p className="text-sm font-semibold text-notte-tenue">
        {prezzo.nota
          ? "Disponibilità e preventivo si chiedono direttamente al locale: noi non prendiamo commissioni."
          : festa
            ? "Richiedi prezzo e disponibilità direttamente al locale: noi non prendiamo commissioni."
            : "Giorni di apertura, orari e prezzi si controllano direttamente dal parco: noi non prendiamo commissioni."}
      </p>
      {extra.whatsapp && (
        <a data-traccia="whatsapp" href={wa(extra.whatsapp)} target="_blank" rel="nofollow noopener" className="rounded-bolla bg-verde px-5 py-3 text-center font-extrabold text-white">
          <MessageCircle className="mr-2 inline h-5 w-5 align-[-4px]" strokeWidth={2.4} aria-hidden />
          {prezzo.nota ? "Scrivi su WhatsApp" : "Richiedi su WhatsApp"}
        </a>
      )}
      {extra.telefono && (
        <a data-traccia="telefono" href={`tel:${numero(extra.telefono)}`} className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 text-center font-extrabold text-notte">
          <Phone className="mr-2 inline h-5 w-5 align-[-4px]" strokeWidth={2.4} aria-hidden />
          Chiama {extra.telefono}
        </a>
      )}
      {sito && (
        <a data-traccia="sito" href={sito} target="_blank" rel="nofollow noopener" className="rounded-2xl bg-viola px-5 py-3 text-center font-extrabold text-white">
          <Globe className="mr-2 inline h-5 w-5 align-[-4px]" strokeWidth={2.4} aria-hidden />
          Vai al sito ufficiale
        </a>
      )}
      {instagram && (
        <a data-traccia="social" href={instagram} target="_blank" rel="nofollow noopener" className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 text-center font-extrabold text-notte">
          <Instagram className="mr-2 inline h-5 w-5 align-[-4px]" strokeWidth={2.4} aria-hidden />
          Profilo Instagram
        </a>
      )}
      {[["Facebook", extra.facebook], ["TikTok", extra.tiktok]].map(([n, u]) =>
        u ? (
          <a key={n} data-traccia="social" href={u} target="_blank" rel="nofollow noopener" className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 text-center font-extrabold text-notte">
            {n}
          </a>
        ) : null,
      )}
      {!sito && !instagram && !extra.whatsapp && !extra.telefono && (
        <p className="rounded-xl bg-crema px-4 py-3 text-sm font-bold text-notte">
          I contatti arrivano quando l&apos;attività completa la scheda.
        </p>
      )}
      <Link data-traccia="invito" href="/biglietti/crea" className="border-t-2 border-crema pt-3 text-sm font-extrabold text-viola">
        Intanto prepara l&apos;invito, gratis ›
      </Link>
    </div>
  );
}

export default async function SchedaPage({ params }: P) {
  const base = await trova(params);
  if (!base) notFound();
  const p = await pubblicate();
  const s = conModifiche(base, p);
  if (!s) notFound();
  const cat = s.categoria;
  const listing = haListing(cat.slug, s.cittaSlug);
  // Fa feste se lo dicono le fonti o se il titolare ha scritto i suoi pacchetti festa.
  const faFeste = s.festa || Boolean(s.extra.pacchetti) || s.extra.estesa?.valori?.fannoFeste === true;
  // Senza listing di città si torna alle feste della città; un posto che non fa feste torna alla sua categoria.
  const hrefCitta = listing ? `/${cat.slug}/${s.cittaSlug}` : faFeste ? `/feste/${s.cittaSlug}` : `/${cat.slug}`;
  const simili = schedeDi(cat.slug, s.cittaSlug)
    .filter((x) => x.slug !== s.slug)
    .map((x) => conModifiche(x, p))
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, 3);
  const faq = cat.faq.map((f) => ({ ...f }));
  const card = datiCard(s);
  const offre = ESPERIENZE.filter((e) => card.esperienze.includes(e.id) && e.gruppo !== "Dove");
  // La scheda estesa compilata dall'attività (lib/scheda-campi.ts), se Giorgia l'ha accettata.
  const estesa = eSchedaEstesa(s.extra.estesa) ? s.extra.estesa : undefined;
  const valori = estesa?.valori ?? {};
  const domande = estesa
    ? domandeDaChiedere(cat.slug, estesa)
    : ESPERIENZE.filter(
        (e) =>
          !card.esperienze.includes(e.id) &&
          (faFeste ? ["animazione", "buffet", "esclusiva", "piccoli", "genitori"] : ["piccoli", "genitori"]).includes(e.id),
      ).map((e) => e.domanda);
  const prezzo = valori.prezzo as Prezzo | undefined;
  const sameAs = [...new Set([s.sito, s.instagram, valori.instagram, s.extra.facebook, valori.facebook, valori.tiktok, valori.schedaGoogle]
    .filter((x): x is string => typeof x === "string" && x !== ""))];
  // WhatsApp e telefono: quelli della scheda estesa, se ci sono, altrimenti i campi di prima.
  const contatti: DatiModifica = {
    ...s.extra,
    ...(typeof valori.whatsapp === "string" && { whatsapp: valori.whatsapp }),
    ...(typeof valori.telefono === "string" && { telefono: valori.telefono }),
    ...(typeof valori.facebook === "string" && { facebook: valori.facebook }),
    ...(typeof valori.tiktok === "string" && { tiktok: valori.tiktok }),
  };

  return (
    <>
      <Contenitore largo className="pb-28 pt-6 lg:pb-12">
        <Contatore scheda={chiaveScheda(s)} />
        <JsonLd
          data={jsonLdBreadcrumb([
            { nome: cat.nome, percorso: `/${cat.slug}` },
            ...(listing ? [{ nome: s.citta, percorso: hrefCitta }] : []),
            { nome: s.nome, percorso: percorsoScheda(s) },
          ])}
        />
        <JsonLd data={jsonLdFaq(faq)} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": cat.schema,
            name: s.nome,
            description: s.descrizione,
            url: url(percorsoScheda(s)),
            address: { "@type": "PostalAddress", ...(s.extra.indirizzo ? { streetAddress: s.extra.indirizzo } : {}), addressLocality: s.citta, addressRegion: s.zona, addressCountry: "IT" },
            ...(s.extra.telefono ? { telephone: s.extra.telefono } : {}),
            ...(sameAs.length ? { sameAs } : {}),
            ...jsonLdEstesa(cat.slug, estesa),
          }}
        />

        <Briciole voci={[{ nome: cat.nome, href: `/${cat.slug}` }, { nome: s.citta, href: hrefCitta }, { nome: s.nome }]} />

        <div className="mt-4 overflow-hidden rounded-morbido">
          <Illustrazione colore={card.etichetta.fondo} icona={cat.icona} alta="h-48 sm:h-72" grande />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-notte-tenue">
          <Camera className="h-3.5 w-3.5" aria-hidden />
          Le foto vere le aggiunge l&apos;attività quando completa la scheda.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold text-notte sm:text-5xl">{s.nome}</h1>
          <p className="font-bold text-notte-tenue">
            {s.extra.indirizzo || `${s.zona}, ${s.citta}`} · {s.tipo}
          </p>
          <div className="flex flex-wrap gap-2">
            <Etichetta e={card.etichetta} grande />
            {card.eta && <span className="rounded-bolla bg-crema px-3 py-1 text-xs font-extrabold text-notte">{card.eta}</span>}
            {s.verificata ? (
              <span className="inline-flex items-center gap-1 rounded-bolla bg-[#E3F4E8] px-3 py-1 text-xs font-extrabold text-[#2E7D4A]">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verificata dal titolare
              </span>
            ) : s.preparataDaGiorgia ? (
              <span className="rounded-bolla bg-crema px-3 py-1 text-xs font-extrabold text-notte-tenue">Dati presi dal sito ufficiale · da confermare</span>
            ) : (
              <span className="rounded-bolla bg-crema px-3 py-1 text-xs font-extrabold text-notte-tenue">Scheda da reclamare</span>
            )}
            {faFeste && valori.fannoFeste !== false && <span data-fa-feste className="rounded-bolla bg-crema px-3 py-1 text-xs font-extrabold text-notte">Fa feste di compleanno</span>}
            <span className="rounded-bolla bg-crema px-3 py-1 text-xs font-extrabold text-notte">{cat.nome}</span>
          </div>
          <Condividi
            percorso={percorsoScheda(s)}
            titolo={`${s.nome}, ${s.citta}`}
            testo={`${s.nome} a ${s.citta}: ${faFeste ? "per la festa di compleanno" : "per i bambini"} trovi tutte le info sulla scheda di Giocamizi 👇`}
            campagna="attivita"
            etichetta="Condividi la scheda"
            compatto
          />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <DatiChiave valori={valori} etaCard={card.eta ?? undefined} />
          <PuntiForza categoria={cat.slug} valori={valori} />
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-col gap-8">
            <InBreve
              testo={
                faFeste
                  ? `${(valori.descrizione as string | undefined) ?? s.descrizione} ${s.nome} si trova a ${s.citta}, zona ${s.zona}, e organizza feste di compleanno per bambini: chiedete al locale un preventivo scritto con tutto quello che è incluso.`
                  : `${(valori.descrizione as string | undefined) ?? s.descrizione} ${s.nome} si trova a ${s.zona}.`
              }
            />
            <section data-cosa-offre>
              <TitoloSezione>Cosa offre</TitoloSezione>
              {offre.length > 0 ? (
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {offre.map((e) => (
                    <li key={e.id} className="flex items-center gap-3 rounded-xl bg-[#E3F4E7] px-4 py-3 font-extrabold text-[#2E7D4A]">
                      <IconaLucide nome={e.icona} className="h-6 w-6" />
                      {e.nome}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-notte-tenue">La scheda non elenca ancora i servizi: chiedili al locale con le domande qui sotto.</p>
              )}
              <DaChiedere domande={domande} />
            </section>
            <section>
              <TitoloSezione>{cat.giornata ? "Cosa guardare prima di andare" : "Cosa chiedere prima di prenotare"}</TitoloSezione>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {cat.comeScegliere.map((c) => (
                  <li key={c} className="flex gap-2 rounded-xl border-2 border-crema-scuro bg-white px-4 py-3 text-sm font-bold text-notte">
                    <span className="text-verde" aria-hidden>✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
            <PrezziPacchetti categoria={cat.slug} valori={valori} />
            <BlocchiDettaglio categoria={cat.slug} valori={valori} />
            {!estesa && (s.extra.orari || s.extra.pacchetti) && (
              <section className="grid gap-4 sm:grid-cols-2">
                {[["Orari", s.extra.orari], ["Pacchetti festa", s.extra.pacchetti]].map(([t, v]) =>
                  v ? (
                    <div key={t} className="rounded-[1.4rem] border border-notte/10 bg-white p-5">
                      <p className="text-lg font-extrabold text-notte">{t}</p>
                      <p className="mt-2 whitespace-pre-line text-notte-tenue">{v}</p>
                    </div>
                  ) : null,
                )}
              </section>
            )}
            <VideoAttivita valori={{ ...valori, video: (valori.video as string[] | undefined) ?? (s.extra.video ? [s.extra.video] : undefined) }} nome={s.nome} />
            {s.reel && <ReelInstagram url={s.reel} nome={s.nome} />}
            <div className="lg:hidden">
              <Contatti sito={s.sito} instagram={s.instagram} extra={contatti} festa={faFeste} prezzo={testoPrezzo(prezzo)} />
            </div>
          </div>
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <Contatti sito={s.sito} instagram={s.instagram} extra={contatti} festa={faFeste} prezzo={testoPrezzo(prezzo)} />
          </aside>
        </div>

        <Faq voci={faq} />

        {simili.length > 0 && (
          <section className="mt-12">
            <TitoloSezione>
              Altre {cat.nome.toLowerCase()} a {s.citta}
            </TitoloSezione>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {simili.map((x) => (
                <CardAttivita key={x.slug} s={datiCard(x)} />
              ))}
            </div>
          </section>
        )}

        <CtaAttivita scheda={chiaveScheda(s)} />
      </Contenitore>

      {/* Telefono e tablet: l'azione principale sempre a portata di pollice. */}
      <div data-barra-fissa className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-crema-scuro bg-white px-4 py-3 lg:hidden">
        {s.sito ? (
          <a data-traccia="sito" href={s.sito} target="_blank" rel="nofollow noopener" className="block rounded-2xl bg-viola px-5 py-3 text-center font-extrabold text-white">
            Vai al sito ufficiale
          </a>
        ) : (
          <Link data-traccia={faFeste ? "invito" : "categoria"} href={faFeste ? "/biglietti/crea" : `/${cat.slug}`} className="block rounded-2xl bg-viola px-5 py-3 text-center font-extrabold text-white">
            {faFeste ? "Prepara l'invito, gratis" : `Vedi tutti: ${cat.nome.toLowerCase()}`}
          </Link>
        )}
      </div>
    </>
  );
}
