"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Accetta il codice da solo o il link intero, e apre /admin/<codice>. */
export function IngressoAdmin() {
  const router = useRouter();
  const [testo, setTesto] = useState("");
  const [avviso, setAvviso] = useState("");

  return (
    <form
      className="mt-6 flex max-w-xl flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const t = testo.trim();
        const codice = (t.match(/\/admin\/([^/?#\s]+)/)?.[1] ?? t).replace(/[^A-Za-z0-9_-]/g, "");
        if (codice.length < 12) {
          setAvviso("Questo codice è troppo corto: controlla di averlo copiato tutto.");
          return;
        }
        router.push(`/admin/${codice}`);
      }}
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-extrabold text-notte">Codice o link del pannello</span>
        <input
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full min-w-0 rounded-2xl border-2 border-crema-scuro bg-white px-4 py-3.5 text-lg"
          data-codice-admin
        />
      </label>
      {avviso && (
        <p role="alert" className="font-bold text-arancione">
          {avviso}
        </p>
      )}
      <button type="submit" className="rounded-2xl bg-viola px-6 py-3.5 font-black text-white hover:bg-notte">
        Apri il pannello
      </button>
    </form>
  );
}
