import type { Approfondimento as DatiApprofondimento } from "@/lib/guide";

/**
 * Il corpo di un articolo approfondito (content/guide/<slug>.md): scheda
 * rapida, indice, testo con tabelle e grafici, fonti e nota su come è fatto.
 * L'HTML arriva già pronto da scripts/articoli/compila.mjs (contenuto nostro,
 * controllato da scripts/articoli/controlla.mjs prima di andare online).
 */

const giornoIt = (iso: string | null) =>
  iso
    ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

export function SchedaRapida({ voci }: { voci: DatiApprofondimento["schedaRapida"] }) {
  if (!voci.length) return null;
  return (
    <section aria-labelledby="scheda-rapida" className="mt-6 rounded-morbido border border-notte/10 bg-white p-5">
      <h2 id="scheda-rapida" className="text-xl font-extrabold text-notte">
        Scheda rapida
      </h2>
      <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {voci.map((v) => (
          <div key={v.voce} className="min-w-0">
            <dt className="text-sm font-bold text-notte-tenue">{v.voce}</dt>
            <dd className="text-notte">{v.valore}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function IndiceArticolo({ voci }: { voci: DatiApprofondimento["indice"] }) {
  if (voci.length < 3) return null;
  return (
    <nav aria-labelledby="indice-articolo" className="mt-6 rounded-morbido bg-crema p-5">
      <h2 id="indice-articolo" className="text-lg font-extrabold text-notte">
        In questo articolo
      </h2>
      <ol className="mt-2 list-decimal space-y-1 pl-6 text-notte">
        {voci.map((v) => (
          <li key={v.id}>
            <a href={`#${v.id}`} className="font-bold text-viola hover:underline">
              {v.titolo}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CorpoArticolo({ html }: { html: string }) {
  return <div className="articolo mt-8" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function FontiArticolo({ dati }: { dati: DatiApprofondimento }) {
  const verificate = giornoIt(dati.fontiVerificateIl);
  const prezzi = giornoIt(dati.prezziVerificatiIl);
  return (
    <>
      {dati.fonti.length > 0 && (
        <section aria-labelledby="fonti" className="mt-12">
          <h2 id="fonti" className="text-2xl font-extrabold text-notte">
            Fonti
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-notte [overflow-wrap:anywhere]">
            {dati.fonti.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener" className="font-bold text-viola hover:underline">
                  {f.titolo}
                </a>
                {f.editore && <span className="text-notte-tenue"> · {f.editore}</span>}
                <span className="text-sm text-notte-tenue"> · consultata il {giornoIt(f.consultata)}</span>
              </li>
            ))}
          </ol>
          {dati.immagini.length > 0 && (
            <p className="mt-4 text-sm text-notte-tenue">
              Immagini:{" "}
              {dati.immagini.map((i) => `${i.alt} (${i.origine}, ${i.licenza})`).join("; ")}.
            </p>
          )}
        </section>
      )}

      <aside className="mt-10 rounded-morbido border-2 border-notte/10 bg-white p-5 text-notte" data-trasparenza>
        <p className="font-extrabold">Come è fatto questo articolo</p>
        <p className="mt-2">
          {dati.trasparenza ??
            "Ricerca e prima stesura con l'aiuto dell'intelligenza artificiale, a partire dalle fonti elencate qui sopra. Non contiene prove personali né esperienze di famiglia: quando ci sono, lo diciamo nel testo."}
        </p>
        <p className="mt-2 text-sm text-notte-tenue">
          {verificate && <>Fonti verificate il {verificate}. </>}
          {prezzi && <>Prezzi controllati il {prezzi}: possono cambiare, verifica sempre nello store. </>}
          {dati.relazioniCommerciali ?? "Nessun rapporto commerciale con i prodotti citati, nessun link di affiliazione."}
        </p>
      </aside>
    </>
  );
}
