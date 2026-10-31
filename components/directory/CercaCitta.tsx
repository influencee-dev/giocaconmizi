"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Il campo «In quale città?» della pagina categoria: va al listing o alla scheda. */
export function CercaCitta({ voci }: { voci: { citta: string; href: string }[] }) {
  const router = useRouter();
  const [testo, setTesto] = useState("");
  const vai = () => {
    const t = testo.trim().toLowerCase();
    const voce = voci.find((v) => v.citta.toLowerCase() === t) ?? voci.find((v) => v.citta.toLowerCase().startsWith(t));
    if (t && voce) router.push(voce.href);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        vai();
      }}
      className="flex w-full max-w-xl gap-2 rounded-bolla border-2 border-crema-scuro bg-crema p-1.5"
    >
      <label className="flex flex-1 items-center gap-2 pl-3">
        <span className="sr-only">In quale città?</span>
        <input
          list="citta-directory"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="In quale città?"
          className="w-full min-w-0 bg-transparent py-2 text-base font-bold text-notte outline-none placeholder:text-notte-tenue"
        />
        <datalist id="citta-directory">
          {voci.map((v) => (
            <option key={v.citta} value={v.citta} />
          ))}
        </datalist>
      </label>
      <button type="submit" className="rounded-2xl bg-viola px-5 py-2.5 font-extrabold text-white">
        Cerca
      </button>
    </form>
  );
}
