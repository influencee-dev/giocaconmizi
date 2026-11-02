import Image from "next/image";
import Link from "next/link";
import { JsonLd, jsonLdSito } from "@/components/seo/JsonLd";
import { FasciaNewsletter } from "@/components/form/FasciaNewsletter";
import { Piede } from "@/components/vetrina/Piede";
import { games } from "@/games/registry";
import { GUIDE } from "@/lib/guide";
import { CITTA_FESTE } from "@/lib/feste";
import { BannerCookie } from "@/components/legal/BannerCookie";
import { MiziIntero } from "@/components/illustrazioni";
import { Freccia } from "@/components/vetrina";
import { immagineMizi } from "@/lib/immagini";

const MENU = [
  { href: "/giochi", nome: "Giochi" },
  { href: "/feste", nome: "Feste" },
  { href: "/guide", nome: "Guide" },
  { href: "/storie", nome: "Storie" },
  { href: "/chi-siamo", nome: "Chi siamo" },
];

function Logo() {
  // Il logo vero (public/mizi/mizi-logo.png) sostituisce il disegno appena c'è.
  const logo = immagineMizi("mizi-logo");
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Giocamizi, torna alla home">
      {logo ? (
        <Image src={logo} alt="" width={40} height={40} className="h-9 w-9 object-contain" priority />
      ) : (
        <span className="h-9 w-8">
          <MiziIntero className="h-full w-full" />
        </span>
      )}
      <span className="text-[1.35rem] font-black tracking-tight text-viola">Giocamizi</span>
    </Link>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={jsonLdSito()} />

      {/* Barra bianca arrotondata che galleggia sopra la pagina (e sopra la foto della home). */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-[1.4rem] bg-white/95 py-1.5 pl-4 pr-1.5 shadow-[0_10px_30px_-12px_rgba(31,36,48,0.35)] backdrop-blur sm:pl-6">
          <Logo />
          <nav aria-label="Principale" className="hidden items-center gap-1 lg:flex">
            {MENU.map((m) => (
              <Link key={m.href} href={m.href} className="rounded-xl px-3.5 py-2 text-[15px] font-bold text-notte hover:text-viola">
                {m.nome}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <Link
              href="/giochi"
              data-tap
              className="hidden items-center gap-2 rounded-2xl bg-viola px-5 font-extrabold text-white transition-colors hover:bg-notte sm:inline-flex"
            >
              Gioca ora <Freccia />
            </Link>
            <details className="group lg:hidden">
              <summary
                data-tap
                className="flex cursor-pointer list-none items-center justify-center rounded-2xl bg-notte px-4 font-extrabold text-white [&::-webkit-details-marker]:hidden"
              >
                <span className="group-open:hidden">Menu</span>
                <span className="hidden group-open:inline">Chiudi</span>
              </summary>
              <nav
                aria-label="Menu"
                className="absolute inset-x-0 top-[calc(100%+0.5rem)] hidden flex-col gap-1 group-open:flex rounded-[1.4rem] bg-white p-3 shadow-[0_18px_40px_-12px_rgba(31,36,48,0.35)]"
              >
                {[...MENU, { href: "/biglietti", nome: "Inviti di compleanno" }].map((m) => (
                  <Link key={m.href} href={m.href} className="rounded-xl px-4 py-3 text-lg font-extrabold text-notte hover:bg-crema">
                    {m.nome}
                  </Link>
                ))}
                <Link
                  href="/giochi"
                  data-tap
                  className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-viola font-extrabold text-white sm:hidden"
                >
                  Gioca ora <Freccia />
                </Link>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <BannerCookie />

      <FasciaNewsletter giochi={games.length} guide={GUIDE.length} citta={CITTA_FESTE.length} />

      <Piede logo={<Logo />} />
    </>
  );
}
