import Link from "next/link";

/** Il menu del pannello di Giorgia: cresce con le fasi di docs/piano-backoffice.md. */
const VOCI = [
  { percorso: "/schede", nome: "Schede" },
  { percorso: "", nome: "Risposte dei locali" },
  { percorso: "/candidature", nome: "Candidature" },
  { percorso: "/risorse", nome: "Risorse" },
  { percorso: "/iscritti", nome: "Iscritti" },
  { percorso: "/posizioni", nome: "Mappa" },
  { percorso: "/immagini", nome: "Immagini" },
] as const;

export function MenuAdmin({ codice, attivo }: { codice: string; attivo: (typeof VOCI)[number]["percorso"] }) {
  return (
    <nav aria-label="Pannello" className="mb-8 flex flex-wrap gap-2">
      {VOCI.map((v) => (
        <Link
          key={v.nome}
          href={`/admin/${codice}${v.percorso}`}
          aria-current={v.percorso === attivo ? "page" : undefined}
          className={`rounded-2xl px-4 py-2 font-extrabold ${
            v.percorso === attivo ? "bg-notte text-white" : "border border-notte/15 bg-white text-notte"
          }`}
        >
          {v.nome}
        </Link>
      ))}
    </nav>
  );
}
