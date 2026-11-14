import Link from "next/link";
import type { ReactNode } from "react";
import { SOCIETA, TITOLARE } from "@/lib/legal";
import type { CodiceFoto } from "@/lib/foto";
import { Foto, Freccia } from "./index";

/**
 * Il piè di pagina del template vetrina: una fila di quattro foto che portano
 * alle sezioni, poi logo, promessa e colonne di link, infine la riga legale
 * con i dati di Partidea (D.Lgs. 70/2003, art. 7).
 * Le foto FT-01…FT-04 si consegnano a parte; finché mancano si vede la foto
 * della sezione già online (prop `oppure` di Foto).
 */

const FOTO: { codice: CodiceFoto; oppure: CodiceFoto; href: string; nome: string }[] = [
  { codice: "FT-01", oppure: "G-01", href: "/giochi", nome: "Giochi" },
  { codice: "FT-02", oppure: "F-01", href: "/feste", nome: "Feste" },
  { codice: "FT-03", oppure: "S-01", href: "/storie", nome: "Storie" },
  { codice: "FT-04", oppure: "I-03", href: "/per-le-mamme", nome: "Mamme" },
];

export const COLONNE: { titolo: string; voci: [string, string][] }[] = [
  {
    titolo: "Gioca",
    voci: [
      ["/giochi", "Tutti i giochi"],
      ["/giochi/eta/5-anni", "Giochi per età"],
      ["/storie", "Storie da leggere"],
      ["/coding", "Coding"],
      ["/compiti-vacanze/prima-elementare", "Compiti delle vacanze"],
    ],
  },
  {
    titolo: "Feste",
    voci: [
      ["/natale", "Natale con Mizi"],
      ["/biglietti", "Inviti di compleanno"],
      ["/feste", "Feste per città"],
      ["/ludoteche", "Ludoteche"],
      ["/sale-feste", "Sale feste"],
      ["/parchi-giochi-al-coperto", "Parchi al coperto"],
      ["/fattorie-didattiche", "Fattorie didattiche"],
      ["/ristoranti-per-bambini", "Ristoranti e pizzerie"],
      ["/animatori-per-feste", "Animatori e feste a domicilio"],
    ],
  },
  {
    titolo: "Impara",
    voci: [
      ["/guide", "Guide per genitori"],
      ["/metodo", "Il nostro metodo"],
      ["/per-insegnanti", "Per insegnanti"],
      ["/per-le-mamme", "Per le mamme"],
      ["/risorse-educative-bambini", "Risorse educative consigliate"],
      ["/perche-lo-facciamo", "Perché lo facciamo"],
    ],
  },
  {
    titolo: "Giocamizi",
    voci: [
      ["/chi-siamo", "Chi siamo"],
      ["/aggiungi-attivita", "Aggiungi la tua attività"],
      ["/termini-attivita", "Termini per le attività"],
      ["/accedi", "Accedi"],
      ["/privacy", "Privacy"],
      ["/cookie", "Cookie"],
      ["/note-legali", "Note legali"],
    ],
  },
];

const PROMESSE = ["Gratis", "Senza pubblicità", "Senza timer", "Fatto da una mamma"];

export function Piede({ logo }: { logo: ReactNode }) {
  return (
    <footer className="mt-20 overflow-hidden bg-[#F0E8FA]">
      {/* Le quattro porte, in foto. */}
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-8">
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {FOTO.map((f) => (
            <li key={f.codice}>
              <Link
                href={f.href}
                className={`group relative block rounded-[1.6rem] border-[5px] border-white bg-white shadow-[0_14px_30px_-14px_rgba(31,36,48,0.45)] transition-transform hover:-translate-y-1`}
              >
                <Foto
                  codice={f.codice}
                  oppure={f.oppure}
                  tono="viola"
                  sizes="(min-width: 1024px) 18rem, 45vw"
                  className="aspect-square w-full rounded-[1.2rem]"
                />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-black text-notte shadow">
                  {f.nome} <Freccia className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-14 sm:px-8 lg:grid-cols-[1.15fr_2fr]">
        <div className="flex flex-col gap-5">
          {logo}
          <p className="max-w-sm text-[15px] leading-relaxed text-notte-tenue">
            Giochi educativi, storie e feste per bambini dai 3 ai 12 anni. Un&apos;idea di una mamma, Giorgia, per la figlia
            Domiziana: da lei viene il nome di Mizi.
          </p>
          <ul className="flex flex-wrap gap-2">
            {PROMESSE.map((p) => (
              <li key={p} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-notte">
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${TITOLARE.email}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-notte px-5 py-3 font-extrabold text-white hover:bg-viola"
            >
              Scrivici <Freccia className="h-4 w-4" />
            </a>
            <Link href="/#newsletter" className="inline-flex items-center gap-2 rounded-2xl border-2 border-notte bg-white px-5 py-3 font-extrabold text-notte">
              La posta di Mizi
            </Link>
          </div>
          <Link
            href="/aggiungi-attivita"
            data-piede-attivita
            className="flex max-w-sm items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 text-notte ring-1 ring-notte/10 hover:ring-viola"
          >
            <span>
              <span className="block font-extrabold">Hai un&apos;attività per bambini?</span>
              <span className="block text-sm text-notte-tenue">Ludoteche, fattorie, ristoranti, animatori, corsi, teatri: aggiungila gratis.</span>
            </span>
            <Freccia className="h-5 w-5 shrink-0" />
          </Link>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLONNE.map((col) => (
            <div key={col.titolo} className="flex flex-col gap-2.5">
              <p className="font-black text-notte">{col.titolo}</p>
              {col.voci.map(([href, nome]) => (
                <Link key={href} href={href} className="text-[15px] text-notte-tenue hover:text-viola">
                  {nome}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-notte/10 bg-white/60">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm leading-relaxed text-notte-tenue sm:px-8">
          © 2026 Giocamizi, un&apos;idea di Giorgia Palazzo · Gestito da {SOCIETA.ragioneSociale}, {SOCIETA.sede} · P.IVA{" "}
          {SOCIETA.piva} · REA {SOCIETA.rea} · Capitale sociale {SOCIETA.capitale} · Le foto con il segno «AI» sono generate con l&apos;intelligenza artificiale · Icone:{" "}
          <a href="https://github.com/microsoft/fluentui-emoji" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-viola">
            Fluent Emoji
          </a>{" "}
          (MIT) e{" "}
          <a href="https://github.com/jdecked/twemoji" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-viola">
            Twemoji
          </a>{" "}
          (CC-BY 4.0)
        </p>
      </div>
    </footer>
  );
}
