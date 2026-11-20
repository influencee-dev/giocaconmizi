"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AFFERMAZIONI,
  ETICHETTA_LIVELLO,
  LETTURE,
  PERCORSO,
  SCALA,
  SITUAZIONI,
  TOTALE_DOMANDE,
  calcola,
  completo,
  letturaDiCoppia,
  letturaSituazioni,
  type Profilo,
  type Risposte,
  type Spinta,
} from "@/lib/famiglia/sotto-pressione";

/**
 * Lo schermo del percorso «Che genitore diventi quando sei sotto pressione?»:
 * una domanda per volta, bottoni grandi, poi il profilo.
 *
 * Le risposte NON lasciano il browser: stanno nella memoria della pagina e in
 * sessionStorage (per riprendere se la scheda si ricarica), e spariscono
 * chiudendo la scheda o toccando «Cancella le mie risposte». Niente invii al
 * server, niente statistiche: lo controlla la batteria `genitori`.
 */

type Fase = "inizio" | "domande" | "risultato";

interface Salvato {
  versione: string;
  indice: number;
  risposte: Risposte;
}

function leggi(): Salvato | null {
  try {
    const dato = JSON.parse(sessionStorage.getItem(PERCORSO.chiave) ?? "null") as Salvato | null;
    return dato && dato.versione === PERCORSO.versione && dato.risposte ? dato : null;
  } catch {
    return null;
  }
}

function scrivi(dato: Salvato | null) {
  try {
    if (dato) sessionStorage.setItem(PERCORSO.chiave, JSON.stringify(dato));
    else sessionStorage.removeItem(PERCORSO.chiave);
  } catch {
    // navigazione privata o memoria piena: si va avanti senza salvare
  }
}

export function PercorsoSottoPressione({ titoli }: { titoli: Record<string, string> }) {
  const [fase, setFase] = useState<Fase>("inizio");
  const [indice, setIndice] = useState(0);
  const [risposte, setRisposte] = useState<Risposte>({});
  const [daRiprendere, setDaRiprendere] = useState<Salvato | null>(null);
  const testa = useRef<HTMLDivElement>(null);
  const passaggio = useRef<number | undefined>(undefined);

  // Al primo sguardo: c'è un percorso lasciato a metà in questa scheda?
  useEffect(() => {
    const dato = leggi();
    if (!dato || !Object.keys(dato.risposte).length) return;
    if (completo(dato.risposte)) {
      setRisposte(dato.risposte);
      setFase("risultato");
    } else setDaRiprendere(dato);
  }, []);

  useEffect(() => () => window.clearTimeout(passaggio.current), []);

  /** Cambio di schermo: si torna in cima al riquadro, e lo sa anche chi usa un lettore di schermo. */
  const inCima = useCallback(() => {
    window.requestAnimationFrame(() => {
      testa.current?.focus({ preventScroll: true });
      testa.current?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }, []);

  const vai = useCallback(
    (nuovaFase: Fase, nuovoIndice: number, nuove: Risposte) => {
      setFase(nuovaFase);
      setIndice(nuovoIndice);
      setRisposte(nuove);
      scrivi(nuovaFase === "inizio" ? null : { versione: PERCORSO.versione, indice: nuovoIndice, risposte: nuove });
      inCima();
    },
    [inCima],
  );

  const affermazione = indice < AFFERMAZIONI.length ? AFFERMAZIONI[indice] : undefined;
  const situazione = affermazione ? undefined : SITUAZIONI[indice - AFFERMAZIONI.length];
  const idDomanda = affermazione?.id ?? situazione?.id ?? "";
  const data = risposte[idDomanda];

  const rispondi = (valore: number) => {
    window.clearTimeout(passaggio.current);
    const nuove = { ...risposte, [idDomanda]: valore };
    setRisposte(nuove);
    scrivi({ versione: PERCORSO.versione, indice, risposte: nuove });
    // Un attimo per vedere la scelta accendersi, poi si passa da soli alla domanda dopo.
    passaggio.current = window.setTimeout(() => {
      if (indice + 1 < TOTALE_DOMANDE) vai("domande", indice + 1, nuove);
      else if (completo(nuove)) vai("risultato", indice, nuove);
    }, 260);
  };

  const cancella = () => {
    window.clearTimeout(passaggio.current);
    setDaRiprendere(null);
    vai("inizio", 0, {});
  };

  return (
    <section
      aria-label="Il percorso"
      data-percorso
      data-fase={fase}
      data-indice={indice}
      className="rounded-[2rem] border-2 border-viola/25 bg-white p-5 sm:p-8"
    >
      <div ref={testa} tabIndex={-1} className="scroll-mt-32 outline-none">
        {fase === "inizio" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold text-notte">Prima di cominciare</h2>
            <ul className="flex flex-col gap-3 text-lg text-notte-tenue">
              <li>
                <strong className="text-notte">{TOTALE_DOMANDE} domande, circa dieci minuti.</strong> Prima {AFFERMAZIONI.length} frasi a cui dire quanto
                spesso ti succede, poi {SITUAZIONI.length} momenti di casa.
              </li>
              <li>
                <strong className="text-notte">Rispondi d&apos;istinto.</strong> Conta quello che fai di solito, non quello che vorresti fare.
              </li>
              <li>
                <strong className="text-notte">Non esistono risposte giuste.</strong> Ogni spinta è anche una risorsa.
              </li>
              <li>
                <strong className="text-notte">Le risposte restano su questo dispositivo.</strong> Non le riceviamo e non le salviamo.
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              {daRiprendere ? (
                <>
                  <button
                    type="button"
                    data-riprendi
                    onClick={() => vai("domande", Math.min(daRiprendere.indice, TOTALE_DOMANDE - 1), daRiprendere.risposte)}
                    className="rounded-2xl bg-viola px-6 py-4 text-lg font-extrabold text-white hover:bg-notte"
                  >
                    Riprendi dalla domanda {Math.min(daRiprendere.indice, TOTALE_DOMANDE - 1) + 1}
                  </button>
                  <button
                    type="button"
                    data-comincia
                    onClick={() => vai("domande", 0, {})}
                    className="rounded-2xl border-2 border-notte/15 bg-white px-6 py-4 text-lg font-extrabold text-notte hover:border-viola"
                  >
                    Ricomincia da capo
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  data-comincia
                  onClick={() => vai("domande", 0, {})}
                  className="rounded-2xl bg-viola px-8 py-4 text-lg font-extrabold text-white hover:bg-notte"
                >
                  Comincia
                </button>
              )}
            </div>
          </div>
        )}

        {fase === "domande" && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-viola-forte" data-conto>
                Domanda {indice + 1} di {TOTALE_DOMANDE}
              </p>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={TOTALE_DOMANDE}
                aria-valuenow={indice}
                aria-label="A che punto sei"
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-crema-scuro"
              >
                <div className="h-full rounded-full bg-viola transition-[width]" style={{ width: `${(indice / TOTALE_DOMANDE) * 100}%` }} />
              </div>
            </div>

            <p className="text-base font-bold text-notte-tenue">
              {affermazione ? "Quanto spesso ti succede?" : "Un momento di casa. Qual è la prima reazione che ti verrebbe?"}
            </p>
            <h2
              className="text-xl font-extrabold leading-snug text-notte sm:text-2xl"
              data-domanda={idDomanda}
              data-spinta={affermazione?.spinta}
              data-rovescio={affermazione?.rovescio ? "si" : undefined}
              aria-live="polite"
            >
              {affermazione?.testo ?? situazione?.scena}
            </h2>

            <div role="radiogroup" aria-label="La tua risposta" className="flex flex-col gap-2.5">
              {affermazione
                ? SCALA.map((etichetta, i) => (
                    <Risposta key={`${idDomanda}-${i}`} valore={i + 1} scelta={data === i + 1} onScegli={rispondi}>
                      {etichetta}
                    </Risposta>
                  ))
                : situazione?.scelte.map((scelta, i) => (
                    <Risposta key={`${idDomanda}-${i}`} valore={i} verso={scelta.verso} scelta={data === i} onScegli={rispondi}>
                      {scelta.testo}
                    </Risposta>
                  ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                data-indietro
                disabled={indice === 0}
                onClick={() => vai("domande", indice - 1, risposte)}
                className="rounded-2xl border-2 border-notte/15 bg-white px-5 py-3 text-base font-extrabold text-notte hover:border-viola disabled:opacity-40"
              >
                Indietro
              </button>
              {data !== undefined && (
                <button
                  type="button"
                  data-avanti
                  onClick={() => (indice + 1 < TOTALE_DOMANDE ? vai("domande", indice + 1, risposte) : completo(risposte) && vai("risultato", indice, risposte))}
                  className="rounded-2xl bg-notte px-5 py-3 text-base font-extrabold text-white hover:bg-viola"
                >
                  {indice + 1 < TOTALE_DOMANDE ? "Avanti" : "Vedi il profilo"}
                </button>
              )}
            </div>
          </div>
        )}

        {fase === "risultato" && <Risultato profilo={calcola(risposte)} titoli={titoli} onRicomincia={() => vai("domande", 0, {})} onCancella={cancella} />}
      </div>
    </section>
  );
}

function Risposta({
  valore,
  verso,
  scelta,
  onScegli,
  children,
}: {
  valore: number;
  verso?: string;
  scelta: boolean;
  onScegli: (valore: number) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={scelta}
      data-valore={valore}
      data-verso={verso}
      onClick={() => onScegli(valore)}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-lg font-bold transition-colors ${
        scelta ? "border-viola bg-viola text-white" : "border-notte/12 bg-crema text-notte hover:border-viola"
      }`}
    >
      <span
        aria-hidden
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${scelta ? "border-white bg-white" : "border-notte/30 bg-white"}`}
      >
        {scelta && <span className="h-3 w-3 rounded-full bg-viola" />}
      </span>
      <span className="min-w-0">{children}</span>
    </button>
  );
}

function Risultato({
  profilo,
  titoli,
  onRicomincia,
  onCancella,
}: {
  profilo: Profilo;
  titoli: Record<string, string>;
  onRicomincia: () => void;
  onCancella: () => void;
}) {
  const { principali, ordine } = profilo;
  const altre = ordine.filter((k) => !principali.includes(k));
  return (
    <div className="flex flex-col gap-8" data-risultato data-principali={principali.join(",")} data-alla-pari={profilo.allaPari ? "si" : "no"} data-calma={profilo.calma} data-sotto-pressione={profilo.sottoPressione ?? ""}>
      <div>
        <h2 className="text-2xl font-extrabold text-notte sm:text-3xl">Il tuo profilo</h2>
        <p className="mt-2 text-lg text-notte-tenue">
          Cinque spinte, dalla più presente alla meno presente nelle tue risposte di oggi. Il numero va da 0 a 100 e dice solo quanto
          spesso ti riconosci in quella spinta: non ti confronta con nessuno.
        </p>
      </div>

      <ol className="flex flex-col gap-4">
        {ordine.map((k) => (
          <li key={k} data-barra={k} data-punteggio={profilo.punteggi[k]} data-livello={profilo.livelli[k]}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="text-lg font-extrabold text-notte">
                {LETTURE[k].nome} <span className="font-bold text-notte-tenue">· {LETTURE[k].inBreve}</span>
              </p>
              <p className="text-base font-extrabold text-notte">
                {profilo.punteggi[k]}/100 <span className="font-bold text-notte-tenue">· {ETICHETTA_LIVELLO[profilo.livelli[k]]}</span>
              </p>
            </div>
            <div className="mt-1.5 h-4 overflow-hidden rounded-full bg-crema-scuro" aria-hidden>
              <div className={`h-full rounded-full ${LETTURE[k].tinta}`} style={{ width: `${Math.max(profilo.punteggi[k], 3)}%` }} />
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-5">
        <h3 className="text-xl font-extrabold text-notte sm:text-2xl">La tua lettura</h3>
        {principali.length === 0 && (
          <p className="text-lg text-notte-tenue" data-nessuna>
            {profilo.allaPari
              ? "Nelle tue risposte più spinte sono quasi alla pari: nessuna guida da sola."
              : "Nelle tue risposte nessuna spinta prevale: oggi non ce n'è una che guida le tue reazioni più delle altre."}{" "}
            Qui sotto trovi comunque le cinque spinte: può esserti utile leggere quella che riconosci nei momenti più stretti.
          </p>
        )}
        {principali.length === 2 && (
          <p className="rounded-2xl bg-crema p-4 text-lg font-bold text-notte" data-coppia>
            Due spinte sono in testa quasi alla pari: «{LETTURE[principali[0]].nome}» e «{LETTURE[principali[1]].nome}».{" "}
            {letturaDiCoppia(principali[0], principali[1])}
          </p>
        )}
        {principali.map((k) => (
          <SchedaSpinta key={k} spinta={k} titoli={titoli} aperta />
        ))}
      </div>

      <div className="rounded-2xl border-2 border-notte/10 p-4 sm:p-5">
        <h3 className="text-xl font-extrabold text-notte">Nei dieci momenti di casa</h3>
        <p className="mt-2 text-lg text-notte-tenue" data-lettura-situazioni>
          {letturaSituazioni(profilo)}
        </p>
      </div>

      {altre.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-extrabold text-notte">{principali.length ? "Le altre spinte" : "Le cinque spinte"}</h3>
          {altre.map((k) => (
            <SchedaSpinta key={k} spinta={k} titoli={titoli} />
          ))}
        </div>
      )}

      <p className="rounded-2xl bg-crema p-4 text-base text-notte-tenue">
        Questo profilo è uno spunto per pensarci su, non una diagnosi e non un giudizio su che genitore sei. Dice come hai risposto
        oggi: tra un mese potrebbe essere diverso. Se in questo periodo la fatica ti sembra troppa, parlane con il pediatra o con uno
        psicologo.
      </p>

      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          data-stampa
          onClick={() => window.print()}
          className="rounded-2xl bg-viola px-5 py-3 text-base font-extrabold text-white hover:bg-notte"
        >
          Stampa o salva in PDF
        </button>
        <button
          type="button"
          data-ricomincia
          onClick={onRicomincia}
          className="rounded-2xl border-2 border-notte/15 bg-white px-5 py-3 text-base font-extrabold text-notte hover:border-viola"
        >
          Rifai il percorso
        </button>
        <button
          type="button"
          data-cancella
          onClick={onCancella}
          className="rounded-2xl border-2 border-notte/15 bg-white px-5 py-3 text-base font-extrabold text-notte hover:border-viola"
        >
          Cancella le mie risposte
        </button>
      </div>
    </div>
  );
}

function SchedaSpinta({ spinta, titoli, aperta = false }: { spinta: Spinta; titoli: Record<string, string>; aperta?: boolean }) {
  const l = LETTURE[spinta];
  const corpo = (
    <div className="flex flex-col gap-3 text-lg text-notte-tenue">
      <p>
        <strong className="text-notte">Che cosa ti dà.</strong> {l.risorsa}
      </p>
      <p>
        <strong className="text-notte">Sotto pressione.</strong> {l.pressione}
      </p>
      <p>
        <strong className="text-notte">Con i figli.</strong> {l.conIFigli}
      </p>
      <p className="rounded-2xl bg-crema p-4 text-notte">
        <strong>La frase da ricordarti:</strong> «{l.permesso}»
      </p>
      <p>
        <strong className="text-notte">Un esercizio.</strong> {l.esercizio}
      </p>
      <div>
        <p className="font-extrabold text-notte">Su Giocamizi</p>
        <ul className="mt-1 flex flex-col gap-1">
          {l.suGiocamizi.map((href) => (
            <li key={href}>
              <Link href={href} className="font-bold text-viola-forte underline underline-offset-4">
                {titoli[href] ?? href}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  if (aperta)
    return (
      <article className="rounded-2xl border-2 border-viola/30 p-4 sm:p-5" data-scheda={spinta}>
        <h4 className="mb-3 text-xl font-extrabold text-notte">
          {l.nome} <span className="font-bold text-notte-tenue">· {l.inBreve}</span>
        </h4>
        {corpo}
      </article>
    );
  return (
    <details className="rounded-2xl border-2 border-notte/10 p-4" data-scheda={spinta}>
      <summary className="cursor-pointer text-lg font-extrabold text-notte">
        {l.nome} <span className="font-bold text-notte-tenue">· {l.inBreve}</span>
      </summary>
      <div className="mt-3">{corpo}</div>
    </details>
  );
}
