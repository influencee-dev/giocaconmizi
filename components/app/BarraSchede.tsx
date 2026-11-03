"use client";

import { BookOpen, Gamepad2, House, PartyPopper, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * La barra delle schede in basso, come in un'app: SOLO sul telefono (sotto
 * i 768 px). Sul tablet e sul computer resta il menu in alto.
 *
 * Non c'è dentro un gioco (serve tutto lo schermo), nel pannello, nella
 * scheda privata del locale, nell'invito ricevuto e dove la pagina ha già
 * una sua barra fissa in basso ([data-barra-fissa]). Quando c'è, scrive la
 * sua altezza in --barra-schede: banner cookie e barretta «Scarica» si
 * appoggiano sopra.
 */

const SCHEDE: { href: string; nome: string; icona: LucideIcon; attiva: (p: string) => boolean }[] = [
  { href: "/", nome: "Home", icona: House, attiva: (p) => p === "/" },
  { href: "/giochi", nome: "Giochi", icona: Gamepad2, attiva: (p) => p.startsWith("/giochi") || p.startsWith("/coding") || p.startsWith("/compiti") },
  { href: "/storie", nome: "Storie", icona: BookOpen, attiva: (p) => p.startsWith("/storie") || p.startsWith("/guide") },
  { href: "/feste", nome: "Feste", icona: PartyPopper, attiva: (p) => p.startsWith("/feste") || p.startsWith("/biglietti") || /^\/(ludoteche|sale-feste|parchi-|musei-|laser-game)/.test(p) },
  { href: "/profilo", nome: "Profilo", icona: UserRound, attiva: (p) => p.startsWith("/profilo") },
];

export const NASCOSTA_SCHEDE = [/^\/giochi\/[^/]+\/gioca/, /^\/admin/, /^\/la-tua-scheda\//, /^\/biglietti\/vedi/, /^\/biglietti\/crea/, /^\/accedi/];

export function BarraSchede() {
  const percorso = usePathname() ?? "/";
  const [altraBarra, setAltraBarra] = useState(false);

  useEffect(() => {
    setAltraBarra(document.querySelector("[data-barra-fissa]") !== null);
  }, [percorso]);

  const visibile = !altraBarra && !NASCOSTA_SCHEDE.some((r) => r.test(percorso));

  useEffect(() => {
    const radice = document.documentElement;
    const misura = () => {
      const telefono = window.matchMedia("(max-width: 767px)").matches;
      radice.style.setProperty("--barra-schede", visibile && telefono ? "calc(4.25rem + env(safe-area-inset-bottom))" : "0px");
    };
    misura();
    window.addEventListener("resize", misura);
    return () => window.removeEventListener("resize", misura);
  }, [visibile]);

  if (!visibile) return null;

  return (
    <>
      {/* Spazio in fondo alla pagina, così la barra non copre il piè di pagina. */}
      <div aria-hidden className="h-[calc(4.25rem+env(safe-area-inset-bottom))] md:hidden" />
      <nav
        aria-label="Schede"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-crema-scuro bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        data-barra-schede
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
          {SCHEDE.map((s) => {
            const attiva = s.attiva(percorso);
            const Icona = s.icona;
            return (
              <li key={s.href} className="flex-1">
                <Link
                  href={s.href}
                  aria-current={attiva ? "page" : undefined}
                  className={`flex h-[4.25rem] flex-col items-center justify-center gap-0.5 text-[12px] ${attiva ? "font-black text-viola" : "font-bold text-notte-tenue"}`}
                  style={{ minWidth: 0 }}
                >
                  <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${attiva ? "bg-viola/15" : ""}`}>
                    <Icona className="h-6 w-6" strokeWidth={attiva ? 2.6 : 2.2} aria-hidden />
                  </span>
                  {s.nome}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
