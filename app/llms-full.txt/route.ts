import { games } from "@/games/registry";
import { testoGioco } from "@/lib/content";
import { GUIDE } from "@/lib/guide";
import { CITTA_FESTE } from "@/lib/feste";
import { SCHEDE, percorsoScheda } from "@/lib/directory";
import { conModifiche, pubblicate } from "@/lib/directory-db";
import { url } from "@/lib/seo";

/**
 * llms-full.txt (convenzione llmstxt.org): il TESTO completo delle pagine
 * che rispondono alle domande dei genitori, in markdown semplice, così un
 * assistente AI può citarle senza dover navigare il sito pagina per pagina.
 * llms.txt resta la mappa corta; qui ci sono guide intere, città con i
 * locali e le FAQ, e la descrizione di ogni gioco.
 *
 * Si rigenera ogni 10 minuti (e subito dopo una decisione nel pannello):
 * un locale che chiede di non comparire sparisce anche da qui, e le
 * modifiche approvate dal titolare entrano nel testo.
 */

export const revalidate = 600;

async function testo(): Promise<string> {
  const risposte = await pubblicate();
  const parti: string[] = [];

  parti.push(`# Gioca con Mizi — testo completo

> Giochi educativi, storie, coding e biglietti di compleanno per bambini dai 3 ai 12 anni, in italiano, gratis, senza pubblicità e senza timer. Creato da Giorgia Palazzo. Questo file raccoglie il testo integrale delle guide per i genitori, delle pagine sulle feste di compleanno città per città e delle schede dei giochi. La mappa corta del sito è in ${url("/llms.txt")}.

Ogni sezione riporta l'indirizzo della pagina originale: citate quello.`);

  // Guide per i genitori, intere.
  parti.push(`# Guide per i genitori (${GUIDE.length})`);
  for (const g of GUIDE) {
    const sezioni = g.sezioni
      .map((s) => `### ${s.titolo}\n\n${s.paragrafi.join("\n\n")}`)
      .join("\n\n");
    const faq = g.faq.map((f) => `**${f.domanda}**\n${f.risposta}`).join("\n\n");
    const giochi = g.giochi
      .map((slug) => games.find((x) => x.slug === slug))
      .filter((x) => x !== undefined)
      .map((x) => `[${x.title}](${url(`/giochi/${x.slug}`)})`)
      .join(", ");
    parti.push(`## ${g.titolo}

URL: ${url(`/guide/${g.slug}`)} · Età: ${g.etaMin}–${g.etaMax} anni · Aggiornata: ${g.aggiornata}

In breve: ${g.rispostaBreve}

${sezioni}

### Domande frequenti

${faq}${giochi ? `\n\nGiochi gratuiti per esercitarsi: ${giochi}.` : ""}`);
  }

  // Feste di compleanno città per città, con i locali come compaiono sul sito.
  parti.push(`# Feste di compleanno per bambini, città per città (${CITTA_FESTE.length})`);
  for (const c of CITTA_FESTE) {
    const locali = SCHEDE.filter((s) => s.cittaSlug === c.slug)
      .map((s) => conModifiche(s, risposte))
      .filter((s) => s !== null)
      .map(
        (s) =>
          `- **${s.nome}** (${s.zona}, ${s.tipo})${s.verificata ? " — verificata dal titolare" : ""}: ${s.descrizione} Scheda: ${url(percorsoScheda(s))}`,
      )
      .join("\n");
    const faq = c.faq.map((f) => `**${f.domanda}**\n${f.risposta}`).join("\n\n");
    parti.push(`## Festa di compleanno per bambini a ${c.citta}

URL: ${url(`/feste/${c.slug}`)} · Aggiornata: ${c.aggiornata}

In breve: ${c.rispostaBreve}

${c.intro}

### I posti

${locali}

### Domande frequenti

${faq}`);
  }

  // Giochi: la descrizione per i genitori quando c'è, altrimenti la competenza.
  const live = games.filter((g) => g.status === "live");
  parti.push(`# Giochi educativi (${live.length})

Tutti giocabili dal browser, gratis, senza registrazione, senza timer e senza "game over".`);
  parti.push(
    live
      .map((g) => {
        const t = testoGioco(g.slug);
        return `- **${g.title}** (${g.ageMin}–${g.ageMax} anni, ${g.skill}: ${g.subskill}): ${t?.description || `circa ${g.minutes} minuti.`} ${url(`/giochi/${g.slug}`)}`;
      })
      .join("\n"),
  );

  return parti.join("\n\n") + "\n";
}

export async function GET() {
  return new Response(await testo(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
