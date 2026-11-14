"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Freccia } from "./freccia";
import { SENZA_PRECARICO } from "@/lib/precarico";

/**
 * Il menu del telefono e del tablet. Si chiude da solo quando cambi pagina
 * (il layout resta montato tra una pagina e l'altra, quindi va chiuso a mano),
 * quando tocchi fuori e con il tasto Esc. Apertura e chiusura scorrono
 * morbide; chi ha chiesto meno animazioni le vede istantanee (globals.css).
 */
export function MenuMobile({ voci }: { voci: { href: string; nome: string }[] }) {
  const percorso = usePathname();
  const [aperto, setAperto] = useState(false);
  const radice = useRef<HTMLDivElement>(null);

  // Pagina nuova: menu chiuso.
  useEffect(() => setAperto(false), [percorso]);

  useEffect(() => {
    if (!aperto) return;
    const fuori = (e: PointerEvent) => {
      if (radice.current && !radice.current.contains(e.target as Node)) setAperto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAperto(false);
    document.addEventListener("pointerdown", fuori);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuori);
      document.removeEventListener("keydown", esc);
    };
  }, [aperto]);

  return (
    <div ref={radice} className="lg:hidden">
      <button
        type="button"
        data-tap
        aria-expanded={aperto}
        aria-controls="menu-mobile"
        onClick={() => setAperto((a) => !a)}
        className="flex items-center justify-center rounded-2xl bg-notte px-4 font-extrabold text-white"
      >
        {aperto ? "Chiudi" : "Menu"}
      </button>
      <nav
        id="menu-mobile"
        aria-label="Menu"
        inert={!aperto}
        data-aperto={aperto}
        className={`absolute inset-x-0 top-[calc(100%+0.5rem)] flex origin-top flex-col gap-1 rounded-[1.4rem] bg-white p-3 shadow-[0_18px_40px_-12px_rgba(31,36,48,0.35)] transition-[opacity,transform,visibility] duration-200 ease-out ${
          aperto ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        {voci.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            prefetch={SENZA_PRECARICO.has(m.href) ? false : undefined}
            onClick={() => setAperto(false)}
            aria-current={percorso === m.href ? "page" : undefined}
            className="rounded-xl px-4 py-3 text-lg font-extrabold text-notte hover:bg-crema aria-[current=page]:bg-crema aria-[current=page]:text-viola"
          >
            {m.nome}
          </Link>
        ))}
        <Link
          href="/giochi"
          data-tap
          onClick={() => setAperto(false)}
          className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-viola font-extrabold text-white sm:hidden"
        >
          Gioca ora <Freccia />
        </Link>
      </nav>
    </div>
  );
}
