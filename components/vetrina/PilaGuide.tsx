"use client";

import Link from "next/link";
import { useState } from "react";
import { Freccia } from "./freccia";

export interface VocePila {
  slug: string;
  titolo: string;
  estratto: string;
  data: string;
}

/**
 * Le carte impilate della home: davanti l'estratto di una guida, dietro le
 * altre. Le frecce sfogliano; senza JS si vede comunque la prima carta, e
 * l'elenco dei link resta nella pagina per i motori.
 */
export function PilaGuide({ voci }: { voci: VocePila[] }) {
  const [i, setI] = useState(0);
  const v = voci[i];
  const vai = (d: number) => setI((x) => (x + d + voci.length) % voci.length);
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative pr-4 pt-3 sm:pr-8">
        <span aria-hidden className="absolute inset-0 left-8 top-0 rounded-[1.6rem] border-2 border-rosa/40 bg-white sm:left-12" />
        <span aria-hidden className="absolute inset-0 left-4 top-1.5 rounded-[1.6rem] border-2 border-rosa/70 bg-white sm:left-6" />
        <Link
          href={`/guide/${v.slug}`}
          className="relative flex min-h-[19rem] flex-col justify-between gap-6 rounded-[1.6rem] border-2 border-rosa bg-[#FBE0EB] p-6 shadow-[0_14px_34px_-14px_rgba(31,36,48,0.35)] sm:p-8"
          aria-live="polite"
        >
          <p className="text-lg font-bold leading-relaxed text-notte sm:text-xl">«{v.estratto}»</p>
          <div className="flex flex-col gap-4">
            <span className="h-0.5 w-full bg-notte/15" />
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-11 w-11 shrink-0 rounded-full border-[3px] border-white bg-viola/30" />
              <div className="flex min-w-0 flex-col">
                <span className="font-extrabold leading-tight text-notte">{v.titolo}</span>
                <span className="text-sm text-notte-tenue">Giorgia Palazzo · aggiornata il {v.data}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-1 grow overflow-hidden rounded-full bg-notte/12">
          <div className="h-full rounded-full bg-notte transition-all" style={{ width: `${((i + 1) / voci.length) * 100}%` }} />
        </div>
        <button
          type="button"
          onClick={() => vai(-1)}
          aria-label="Guida precedente"
          className="flex !h-12 !min-h-0 !w-12 !min-w-0 items-center justify-center rounded-full border-2 border-notte/30 text-notte hover:border-notte"
        >
          <Freccia indietro />
        </button>
        <button
          type="button"
          onClick={() => vai(1)}
          aria-label="Guida successiva"
          className="flex !h-12 !min-h-0 !w-12 !min-w-0 items-center justify-center rounded-full bg-arancione text-white hover:bg-notte"
        >
          <Freccia />
        </button>
      </div>
    </div>
  );
}
