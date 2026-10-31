import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { games } from "@/games/registry";
import {
  MiziIntero,
  ScenaBiglietti,
  ScenaCoding,
  ScenaCompiti,
  ScenaStorie,
} from "@/components/illustrazioni";
import { IconaGioco } from "@/components/icone";
import {
  Bollino,
  BottoneFreccia,
  CardPastello,
  FasciaFinale,
  FaqVetrina,
  Foto,
  InBreve,
  TitoloVetrina,
} from "@/components/vetrina";
import { PilaGuide } from "@/components/vetrina/PilaGuide";
import { JsonLd, jsonLdElenco, jsonLdFaq } from "@/components/seo/JsonLd";
import { fotoSito } from "@/lib/foto";
import { GUIDE } from "@/lib/guide";
import { CITTA_FESTE } from "@/lib/feste";
import { tutteLeStorie } from "@/lib/content";
import { eta, url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Giochi educativi, storie e feste per bambini",
  description:
    "Giocamizi: giochi educativi gratis per bambini dai 3 ai 12 anni, storie da leggere, inviti di compleanno, feste in 30+ città e guide per genitori. Senza pubblicità e senza timer.",
  alternates: { canonical: "/" },
};

const COMPETENZE: [string, string][] = [
  ["lettere", "Lettere"], ["numeri", "Numeri"], ["colori", "Colori"], ["forme", "Forme"],
  ["memoria", "Memoria"], ["logica", "Logica"], ["matematica", "Matematica"], ["lettura", "Lettura"],
  ["inglese", "Inglese"], ["emozioni", "Emozioni"], ["coding", "Coding"],
];

const IN_VETRINA = ["conta-fino-a-10", "salvadanaio", "le-emozioni-di-mizi", "tabelline"];
const TONI_GIOCHI = ["azzurro", "giallo", "rosa", "viola"] as const;
const COLORI_ETA = ["bg-rosa text-white", "bg-azzurro text-white", "bg-giallo text-notte", "bg-viola text-white", "bg-arancione text-white"];

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
const dataItaliana = (iso: string) => {
  const [a, m, g] = iso.split("-").map(Number);
  return `${g} ${MESI[m - 1]} ${a}`;
};
/** L'inizio della risposta breve: frasi intere fino a ~120 caratteri, mai oltre 240. */
const estratto = (testo: string) => {
  const frasi = testo.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const f of frasi) {
    if (out.length >= 120) break;
    out = out ? `${out} ${f}` : f;
  }
  if (out.length <= 240) return out;
  return `${out.slice(0, 236).replace(/\s+\S*$/, "")}…`;
};

const FOTO_FAMIGLIA = "foto-giorgia-domiziana.jpg";

export default function Home() {
  const vetrina = IN_VETRINA.map((s) => games.find((g) => g.slug === s)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g),
  );
  const storie = tutteLeStorie().length;
  const citta = CITTA_FESTE.length;
  const guide = [...GUIDE].sort((a, b) => b.aggiornata.localeCompare(a.aggiornata));
  const fotoHero = fotoSito("H-01");
  const conFotoFamiglia = existsSync(join(process.cwd(), "public", FOTO_FAMIGLIA));

  const FAQ = [
    { domanda: "Giocamizi è davvero gratis?", risposta: "Sì. Giochi, storie, inviti e guide sono gratis, senza pubblicità e senza acquisti nascosti; per giocare non serve registrarsi." },
    { domanda: "Per che età sono i giochi?", risposta: `Dai 3 ai 12 anni: ${games.length} giochi divisi per età e per competenza (numeri, lettere, logica, emozioni, coding e altro), ognuno con l'età consigliata.` },
    { domanda: "I giochi funzionano sul telefono?", risposta: "Sì, su telefono, tablet, computer e LIM, direttamente dal browser: non c'è nessuna app da installare." },
    { domanda: "Come funziona l'invito di compleanno?", risposta: "Scegli il tema, scrivi nome, età, data e luogo, e lo mandi su WhatsApp o lo stampi. Gli invitati confermano con un tocco o inquadrando il QR." },
    { domanda: "Dove festeggiare un compleanno per bambini nella mia città?", risposta: `Nelle pagine Feste trovi ludoteche, parchi giochi al coperto, musei e sale feste di ${citta} città italiane, verificati uno per uno con il link al sito ufficiale.` },
    { domanda: "Chi c'è dietro Giocamizi?", risposta: "Giorgia Palazzo, mamma di Domiziana e founder di Influencee, che l'ha ideato; il sito è gestito da Partidea SRL. Mizi, la pinguina, porta un pezzetto del nome di sua figlia." },
  ];

  const ALTRO = [
    { href: "/storie", tono: "viola" as const, foto: "S-01" as const, scena: <ScenaStorie />, titolo: "Storie da leggere", testo: `${storie} storie in stampatello, minuscolo e corsivo, con la lettura ad alta voce.`, azione: "Leggi" },
    { href: "/coding", tono: "azzurro" as const, foto: "S-02" as const, scena: <ScenaCoding />, titolo: "Coding", testo: "Dalle frecce ai blocchi fino al codice vero, dai 3 ai 12 anni.", azione: "Programma" },
    { href: "/compiti-vacanze/prima-elementare", tono: "giallo" as const, foto: "S-03" as const, scena: <ScenaCompiti />, titolo: "Compiti delle vacanze", testo: "Schede per classe, dalla prima alla quinta: online o da stampare.", azione: "Apri" },
    { href: "/biglietti", tono: "rosa" as const, foto: "F-02" as const, scena: <ScenaBiglietti />, titolo: "Biglietti e inviti", testo: "Inviti, auguri, etichette e versioni da colorare, gratis.", azione: "Crea" },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Giocamizi",
          alternateName: "Gioca con Mizi",
          url: url("/"),
          description: "Giochi educativi, storie, inviti di compleanno e guide per genitori di bambini dai 3 ai 12 anni: gratis e senza pubblicità.",
          founder: { "@type": "Person", name: "Giorgia Palazzo", url: url("/chi-siamo") },
          parentOrganization: {
            "@type": "Organization",
            name: "Partidea SRL",
            vatID: "IT04405500408",
            address: { "@type": "PostalAddress", streetAddress: "Via Antonio Beltramelli 13", postalCode: "47923", addressLocality: "Rimini", addressCountry: "IT" },
          },
          knowsAbout: ["giochi educativi per bambini", "feste di compleanno per bambini", "apprendimento attraverso il gioco"],
        }}
      />
      <JsonLd data={jsonLdFaq(FAQ)} />
      <JsonLd data={jsonLdElenco("Giochi in evidenza", vetrina.map((g) => ({ nome: g.title, percorso: `/giochi/${g.slug}` })))} />

      {/* ---------- HERO: foto a tutta larghezza, il menu ci galleggia sopra ---------- */}
      <section className="relative -mt-[5.5rem] overflow-hidden bg-notte">
        {fotoHero ? (
          <Image src={fotoHero.src} alt={fotoHero.alt} fill priority sizes="100vw" className="object-cover object-[70%_center]" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-viola via-[#7d58c4] to-notte">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_88%_6%,rgba(242,138,178,0.32)_0_14rem,transparent_14.1rem),radial-gradient(circle_at_62%_82%,rgba(249,200,70,0.25)_0_5rem,transparent_5.1rem),radial-gradient(circle_at_4%_100%,rgba(61,181,230,0.25)_0_11rem,transparent_11.1rem)]" />
            <div className="absolute bottom-0 right-[4%] hidden h-[78%] w-[34%] items-end justify-center md:flex">
              <MiziIntero className="h-full w-auto drop-shadow-2xl" />
            </div>
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-notte/85 via-notte/25 to-transparent md:bg-gradient-to-r md:from-notte/80 md:via-notte/35" />
        <div className="relative mx-auto flex min-h-[36rem] max-w-6xl flex-col justify-end gap-5 px-4 pb-12 pt-36 sm:min-h-[40rem] sm:px-8 sm:pb-16 lg:min-h-[44rem]">
          <span className="w-fit rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white backdrop-blur">
            Gratis · 3–12 anni · senza pubblicità
          </span>
          <h1 className="max-w-3xl text-[2.35rem] font-black leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
            Giochi educativi, storie e feste di compleanno per bambini dai 3 ai 12 anni
          </h1>
          <p className="max-w-xl text-lg text-white/85">
            {games.length} giochi senza timer, {storie} storie, inviti da mandare su WhatsApp e i posti per festeggiare in {citta} città.
          </p>
          <div className="flex flex-wrap gap-3">
            <BottoneFreccia href="/giochi">Scegli un gioco</BottoneFreccia>
            <BottoneFreccia href="/biglietti" variante="chiaro">Crea un invito</BottoneFreccia>
          </div>
        </div>
        {fotoHero && <Bollino className="absolute bottom-10 right-8 hidden lg:flex">Gratis e senza pubblicità</Bollino>}
      </section>

      {/* ---------- TRE PORTE + blocco risposta ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-8 sm:pt-24">
        <TitoloVetrina>Da dove cominciamo oggi?</TitoloVetrina>
        <InBreve className="mx-auto mt-8 max-w-4xl">
          Giocamizi è un sito gratuito e senza pubblicità con giochi educativi, storie, inviti di compleanno e guide per
          genitori di bambini dai 3 ai 12 anni. Lo cura Giorgia Palazzo, mamma di Domiziana: niente timer, niente
          «hai perso», si sbaglia e si riprova.
        </InBreve>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CardPastello
            href="/giochi"
            tono="azzurro"
            livello="h2"
            foto={<Foto codice="H-02" tono="azzurro" className="aspect-[2/1] w-full" />}
            titolo="Gioca e impara"
            testo="Numeri, lettere, logica, emozioni e coding. Niente timer, niente «hai perso»."
            etichette={["3–12 anni", `${games.length} giochi`]}
            azione="Gioca"
          />
          <CardPastello
            href="/feste"
            tono="rosa"
            livello="h2"
            foto={<Foto codice="H-03" tono="rosa" ripiego={<ScenaBiglietti />} className="aspect-[2/1] w-full" />}
            titolo="Organizza la festa"
            testo="Inviti con conferma su WhatsApp e i posti per festeggiare il compleanno nella tua città."
            etichette={["Inviti gratis", `${citta} città`]}
            azione="Inizia"
          />
          <CardPastello
            href="/guide"
            tono="giallo"
            livello="h2"
            foto={<Foto codice="H-04" tono="giallo" ripiego={<ScenaCompiti />} className="aspect-[2/1] w-full" />}
            titolo="Guide per genitori"
            testo="Risposte chiare alle domande di tutti i giorni: contare, leggere, perdere, compiti."
            etichette={[`${GUIDE.length} guide`, "5 minuti"]}
            azione="Leggi"
          />
        </div>
      </section>

      {/* ---------- GIOCA: giochi in evidenza, età, competenze ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-28">
        <TitoloVetrina sotto="Ogni gioco insegna una cosa sola, ha l'età giusta e una scheda per i genitori con cosa allena.">
          Giochi consigliati per cominciare
        </TitoloVetrina>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {vetrina.map((g, i) => (
            <CardPastello
              key={g.slug}
              href={`/giochi/${g.slug}`}
              tono={TONI_GIOCHI[i % TONI_GIOCHI.length]}
              foto={
                <span aria-hidden className="flex h-28 items-center justify-center p-3 sm:h-36 sm:p-4">
                  <IconaGioco slug={g.slug} skill={g.skill} />
                </span>
              }
              titolo={g.title}
              etichette={[`${g.ageMin}–${g.ageMax} anni`]}
              azione="Gioca"
            />
          ))}
        </div>
        <div className="mt-10 grid gap-6 rounded-[1.8rem] bg-white p-5 sm:p-8 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-extrabold text-notte">Scegli l&apos;età</h3>
            <div className="flex flex-wrap gap-2.5">
              {eta.map((anni, i) => (
                <Link
                  key={anni}
                  href={`/giochi/eta/${anni}-anni`}
                  data-tap
                  aria-label={`Giochi per ${anni} anni`}
                  className={`flex items-center justify-center rounded-full text-xl font-black transition-transform hover:-translate-y-0.5 ${COLORI_ETA[i % COLORI_ETA.length]}`}
                >
                  {anni}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-extrabold text-notte">Oppure cosa vuole imparare</h3>
            <div className="flex flex-wrap gap-2">
              {COMPETENZE.map(([slug, nome]) => (
                <Link
                  key={slug}
                  href={`/giochi/competenza/${slug}`}
                  className="rounded-full border border-notte/15 bg-crema px-4 py-2.5 text-[15px] font-bold text-notte hover:border-viola hover:text-viola"
                >
                  {nome}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- GUIDE: carte impilate ---------- */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:mt-28 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <PilaGuide
              voci={guide.slice(0, 5).map((g) => ({
                slug: g.slug,
                titolo: g.titoloBreve,
                estratto: estratto(g.rispostaBreve),
                data: dataItaliana(g.aggiornata),
              }))}
            />
          </div>
          <div className="order-1 flex flex-col gap-5 lg:order-2">
            <TitoloVetrina allineo="sinistra">Risposte chiare per genitori che vanno di corsa</TitoloVetrina>
            <p className="text-lg text-notte-tenue">
              {GUIDE.length} guide scritte da una mamma, con la risposta in due righe in cima e i giochi giusti per esercitarsi.
            </p>
            <ul className="flex flex-col gap-1.5">
              {guide.slice(0, 4).map((g) => (
                <li key={g.slug}>
                  <Link href={`/guide/${g.slug}`} className="font-bold text-viola underline-offset-4 hover:underline">
                    {g.titoloBreve}
                  </Link>
                </li>
              ))}
            </ul>
            <BottoneFreccia href="/guide" className="w-fit">Tutte le guide</BottoneFreccia>
          </div>
        </div>
      </section>

      {/* ---------- COLLAGE: il posto giusto + città ---------- */}
      <section className="mt-20 bg-white py-16 sm:mt-28 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <TitoloVetrina>Il posto giusto per crescere giocando</TitoloVetrina>
          <div className="mt-12 grid items-center gap-6 md:grid-cols-[1fr_1.05fr_0.9fr] lg:gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-extrabold text-notte">Giochi senza pubblicità né timer</h3>
              <p className="text-[15px] leading-relaxed text-notte-tenue">
                Si sbaglia, si riprova, si va avanti. Mizi spiega a voce, così giocano anche i bambini che non sanno ancora leggere.
              </p>
              <Foto codice="H-06" tono="azzurro" className="aspect-[3/2] w-full rounded-[1.4rem]" />
            </div>
            <Foto codice="H-05" tono="rosa" sizes="(min-width: 768px) 36vw, 100vw" className="aspect-[3/4] w-full rounded-[1.6rem]" />
            <div className="flex flex-col gap-4">
              <Foto codice="H-07" tono="giallo" ripiego={<ScenaBiglietti />} className="aspect-[4/3] w-2/3 rounded-[1.4rem] md:w-3/4" />
              <h3 className="text-xl font-extrabold text-notte">Feste nella tua città</h3>
              <p className="text-[15px] leading-relaxed text-notte-tenue">
                Ludoteche, parchi al coperto, musei e sale feste verificati uno per uno, con il link al sito ufficiale.
              </p>
              <BottoneFreccia href="/feste" variante="arancione" className="w-fit">Trova la tua città</BottoneFreccia>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {CITTA_FESTE.slice(0, 11).map((c) => (
              <Link
                key={c.slug}
                href={`/feste/${c.slug}`}
                className="rounded-full border border-notte/12 bg-crema px-4 py-2.5 text-sm font-bold text-notte hover:border-viola hover:text-viola"
              >
                {c.citta}
              </Link>
            ))}
            <Link href="/feste" className="rounded-full bg-notte px-4 py-2.5 text-sm font-bold text-white hover:bg-viola">
              Tutte le {citta} città
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- STORIE, CODING, COMPITI, BIGLIETTI ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-28">
        <TitoloVetrina>E poi storie, coding e compiti</TitoloVetrina>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ALTRO.map((a) => (
            <CardPastello
              key={a.href}
              href={a.href}
              tono={a.tono}
              foto={<Foto codice={a.foto} tono={a.tono} ripiego={a.scena} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[4/3] w-full" />}
              titolo={a.titolo}
              testo={a.testo}
              azione={a.azione}
            />
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-28">
        <TitoloVetrina sotto="Le risposte che cercano i genitori, scritte per essere chiare anche agli assistenti AI.">
          Domande frequenti
        </TitoloVetrina>
        <div className="mt-10">
          <FaqVetrina voci={FAQ} />
        </div>
      </section>

      {/* ---------- CHI C'È DIETRO ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-8 sm:pt-28">
        <div className="grid items-center gap-8 rounded-[2rem] border-2 border-viola/30 bg-[#F0E8FA] p-6 sm:p-10 md:grid-cols-[auto_1fr]">
          <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-52 sm:w-52">
            {conFotoFamiglia ? (
              <Image src={`/${FOTO_FAMIGLIA}`} alt="Giorgia Palazzo con la figlia Domiziana" fill sizes="208px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center p-6">
                <MiziIntero className="h-full w-auto" />
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-white px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-notte">Chi c&apos;è dietro</span>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-notte sm:text-4xl">Una mamma, una figlia e una pinguina</h2>
            <p className="max-w-2xl text-lg text-notte-tenue">
              Giocamizi è nato perché Domiziana non voleva fare i compiti. Ogni gioco viene provato da lei prima di
              uscire, e ogni guida è scritta da Giorgia Palazzo con le fonti citate. Niente pubblicità, niente dati dei bambini.
            </p>
            <div className="flex flex-wrap gap-3">
              <BottoneFreccia href="/chi-siamo" variante="notte">La nostra storia</BottoneFreccia>
              <BottoneFreccia href="/metodo" variante="chiaro">Il metodo</BottoneFreccia>
            </div>
          </div>
        </div>
      </section>

      <FasciaFinale
        titolo="Pronti a giocare con Mizi?"
        testo="Un gioco da cinque minuti, un invito per la festa o una guida da leggere stasera."
        azioni={[
          { href: "/giochi", etichetta: "Gioca ora" },
          { href: "/biglietti", etichetta: "Crea un invito" },
        ]}
      />
    </>
  );
}
