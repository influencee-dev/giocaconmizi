import Image from "next/image";
import Link from "next/link";
import { JsonLd, jsonLdSito } from "@/components/seo/JsonLd";
import { FasciaNewsletter } from "@/components/form/FasciaNewsletter";
import { Piede } from "@/components/vetrina/Piede";
import { games } from "@/games/registry";
import { GUIDE } from "@/lib/guide";
import { CITTA_FESTE } from "@/lib/feste";
import { BannerCookie } from "@/components/legal/BannerCookie";
import { BarraApp } from "@/components/app/BarraApp";
import { BarraSchede } from "@/components/app/BarraSchede";
import { Benvenuto } from "@/components/app/Benvenuto";
import { Freccia } from "@/components/vetrina";
import { MenuMobile } from "@/components/vetrina/MenuMobile";

const MENU = [
  { href: "/giochi", nome: "Giochi" },
  { href: "/feste", nome: "Feste" },
  { href: "/guide", nome: "Guide" },
  { href: "/storie", nome: "Storie" },
  { href: "/risorse-educative-bambini", nome: "Risorse" },
  { href: "/chi-siamo", nome: "Chi siamo" },
];

/** Il logo di Giorgia (public/mizi/, da Drive «Loghi» del 2/11/2026). */
function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Giocamizi, torna alla home">
      <Image
        src="/mizi/giocamizi-logo-orizzontale.webp"
        alt="Giocamizi"
        width={513}
        height={176}
        priority
        className="h-11 w-auto sm:h-[3.25rem]"
      />
    </Link>
  );
}

function LogoGrande() {
  return (
    <Link href="/" aria-label="Giocamizi, torna alla home" className="w-fit">
      <Image src="/mizi/giocamizi-logo.webp" alt="Giocamizi" width={640} height={430} className="h-auto w-56" />
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
            <MenuMobile voci={[...MENU, { href: "/biglietti", nome: "Inviti di compleanno" }]} />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <BannerCookie />

      <FasciaNewsletter giochi={games.length} guide={GUIDE.length} citta={CITTA_FESTE.length} />

      <Piede logo={<LogoGrande />} />

      <BarraApp />

      <BarraSchede />

      <Benvenuto />
    </>
  );
}
