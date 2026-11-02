"use client";

import type { Iscritto } from "@/lib/brevo";

/** Esporta gli iscritti in CSV (si apre con Excel e Fogli Google), generato nel browser. */
export function EsportaCsv({ righe }: { righe: Iscritto[] }) {
  const esporta = () => {
    const campi: (keyof Iscritto)[] = ["email", "lista", "creato", "disiscritto", "citta", "professione", "origine", "consensoData", "consensoFonte"];
    const cella = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [campi.join(";"), ...righe.map((r) => campi.map((c) => cella(r[c])).join(";"))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
    a.download = `iscritti-giocamizi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };
  return (
    <button type="button" onClick={esporta} disabled={righe.length === 0} className="rounded-2xl border-2 border-notte bg-white px-5 py-3 font-extrabold text-notte disabled:opacity-50">
      Esporta CSV ({righe.length})
    </button>
  );
}
