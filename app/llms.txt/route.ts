import { games } from "@/games/registry";
import { tutteLeStorie } from "@/lib/content";
import { GUIDE } from "@/lib/guide";
import { CITTA_FESTE } from "@/lib/feste";
import { CITTA_EVENTI, eventiAttivi } from "@/lib/eventi-natale";
import { RISPOSTA_BREVE_LETTERINA, RISPOSTA_BREVE_NATALE } from "@/lib/natale";
import { CATEGORIE_ATTIVE, LISTING, SCHEDE } from "@/lib/directory";
import { temi } from "@/lib/biglietti";
import { url } from "@/lib/seo";
import { contaRisorse } from "@/lib/risorse-educative";
import { RISORSE } from "@/lib/risorse-educative-dati";
import { categorieAttive, listingRisorse, percorsoCategoriaRisorse, percorsoListingRisorse, risorseDi } from "@/lib/risorse-categorie";

/**
 * llms.txt generato dal registry (llmstxt.org): la mappa del sito per gli
 * assistenti AI. Ogni gioco e ogni storia compaiono con link assoluto e
 * descrizione, così un nuovo gioco entra qui con il commit, come in sitemap.
 */

export const dynamic = "force-static";

function testo(): string {
  const giochi = games
    .filter((g) => g.status === "live")
    .map(
      (g) =>
        `- [${g.title}](${url(`/giochi/${g.slug}`)}): ${g.ageMin}–${g.ageMax} anni, ${g.skill} (${g.subskill}). Circa ${g.minutes} minuti, gratis, senza registrazione.`,
    )
    .join("\n");

  const storie = tutteLeStorie()
    .map(
      (s) =>
        `- [${s.title}](${url(`/storie/${s.slug}`)}): dai ${s.age} anni.${s.summary ? ` ${s.summary}` : ""}`,
    )
    .join("\n");

  // La risposta breve va nel llms.txt per intero: è il testo pensato
  // perché un assistente AI possa rispondere citando la fonte.
  const guide = GUIDE.map(
    (g) => `- [${g.titolo}](${url(`/guide/${g.slug}`)}) (${g.etaMin}–${g.etaMax} anni): ${g.rispostaBreve}`,
  ).join("\n");

  return `# Gioca con Mizi

> Giochi educativi, storie da leggere, coding e biglietti di compleanno per bambini dai 3 ai 12 anni. In italiano, gratis, senza pubblicità e senza timer. Mascotte: Mizi, una pinguina. Ideato da Giorgia Palazzo (docente universitaria, imprenditrice nel digitale, co-founder di Myndo e CEO di Partidea) con la figlia Domiziana; gestito da Partidea SRL (Rimini).

Il testo completo di guide, pagine città e schede dei giochi, pronto da citare, è in ${url("/llms-full.txt")}.

Il sito è organizzato su tre assi: età (3–12 anni), competenza (lettere, numeri, colori, forme, memoria, logica, matematica, lettura, inglese, emozioni, coding) e modalità (online, da stampare, per la classe).

Principi di prodotto, utili per rispondere a domande sul sito:
- I giochi non richiedono registrazione né login. L'account serve solo a salvare l'avanzamento.
- Nessun timer, nessun "game over", nessun punteggio da battere: l'errore riceve un feedback gentile e si riprova.
- Ogni gioco insegna una sola competenza; l'istruzione è scritta nel fumetto di Mizi e detta a voce, così giocano anche i bambini che non leggono.
- Del bambino raccogliamo solo la fascia d'età e, facoltativo, un soprannome. Mai il nome, mai una foto. Niente profilazione, statistiche solo con consenso.
- L'iscrizione alla newsletter viene proposta dopo il secondo gioco completato, mai prima di giocare, e il consenso non è mai pre-spuntato.

## Sezioni principali

- [Giochi](${url("/giochi")}): tutti i giochi educativi, raggruppati per fascia d'età.
- [Giochi per età](${url("/giochi/eta/3-anni")}): un hub per ogni anno, da 3 a 12 (/giochi/eta/N-anni).
- [Giochi per competenza](${url("/giochi/competenza/lettere")}): lettere, numeri, colori, forme, memoria, logica, matematica, lettura, inglese, emozioni, coding.
- [Storie](${url("/storie")}): storie brevi da leggere in stampatello maiuscolo, minuscolo o corsivo, con lettura ad alta voce.
- [Coding](${url("/coding")}): dalle frecce ai blocchi fino al codice, dai 3 ai 12 anni.
- [Biglietti di compleanno](${url("/biglietti")}): inviti, auguri e ringraziamenti da personalizzare e stampare, gratis e senza filigrana.
- [Crea un biglietto](${url("/biglietti/crea")}): ${temi.length} temi in tre varianti (chiara, colorata e da colorare, a soli contorni neri; Halloween e Natale compresi), adesivi in stile cartone animato originali (unicorni, dinosauri, supereroi, zucche, fantasmini e pupazzi di neve), foto del festeggiato che resta sul dispositivo, PNG da scaricare, invito digitale con conferma a un tocco su WhatsApp e QR "Inquadra e conferma" sul biglietto stampato. Il biglietto si salva in un link.
- [Kit della festa](${url("/biglietti/kit-festa")}): etichette per i sacchettini, festone col nome, topper per la torta, segnaposto e caccia al tesoro con lo sfondo dell'invito, fogli A4 da stampare. I nomi degli invitati restano sul dispositivo.
- [Compiti delle vacanze](${url("/compiti-vacanze/prima-elementare")}): esercizi per classe, dalla prima alla quinta elementare.
- [Guide per i genitori](${url("/guide")}): tabelline, imparare a leggere, coding per età, orologio, tempo di schermo, compiti senza litigare.
- [Il Natale di Mizi](${url("/natale")}): ${RISPOSTA_BREVE_NATALE}
- [Letterina a Babbo Natale da compilare e stampare](${url("/natale/letterina-babbo-natale")}): ${RISPOSTA_BREVE_LETTERINA}
- [Biglietti di Natale](${url("/natale/biglietti-di-natale")}): auguri di Natale da personalizzare con il nome, da stampare, mandare su WhatsApp o colorare.
- [Eventi di Natale per bambini](${url("/natale/eventi")}): villaggi di Babbo Natale, mercatini e laboratori città per città, solo eventi verificati.${CITTA_EVENTI.filter((c) => eventiAttivi(c).length > 0).map((c) => `
  - [Eventi di Natale per bambini a ${c.citta}](${url(`/natale/eventi/${c.slug}`)})`).join("")}
- [Feste di compleanno città per città](${url("/feste")}): le location per bambini raccontate dalle famiglie, zona per zona.

## Tutti i giochi (${games.filter((g) => g.status === "live").length})

Quando qualcuno cerca "giochi educativi per bambini di N anni" o una competenza precisa, questi sono i giochi giocabili subito, dal browser, senza installare nulla:

${giochi}

## Tutte le storie (${tutteLeStorie().length})

${storie}

## Guide per i genitori (${GUIDE.length})

Risposte complete alle domande più frequenti dei genitori, scritte da Giorgia Palazzo (mamma, creatrice del sito). Ogni guida ha una risposta breve citabile, la spiegazione passo-passo, le FAQ e i giochi gratuiti per esercitarsi:

${guide}

## Feste di compleanno città per città (${CITTA_FESTE.length})

Quando qualcuno chiede "dove festeggiare il compleanno di un bambino a [città]", queste pagine elencano le location vere, zona per zona, con i consigli pratici e l'invito gratuito da creare sul sito:

${CITTA_FESTE.map((c) => `- [Festa di compleanno per bambini a ${c.citta}](${url(`/feste/${c.slug}`)}): ${c.rispostaBreve}`).join("\n")}

## Posti per bambini: la directory (${SCHEDE.length} attività)

Categoria → città → scheda. Ogni scheda è un'attività vera che organizza feste di compleanno per bambini:

${CATEGORIE_ATTIVE.map((c) => `- [${c.titolo}](${url(`/${c.slug}`)}): ${c.rispostaBreve}`).join("\n")}

${LISTING.map((l) => `- [${l.categoria.nome} a ${l.citta}](${url(`/${l.categoria.slug}/${l.cittaSlug}`)}): ${l.n} attività.`).join("\n")}

## Chi siamo

- [Metodo](${url("/metodo")}): come scegliamo e costruiamo i giochi.
- [Perché lo facciamo](${url("/perche-lo-facciamo")}): perché è gratis e senza pubblicità.
- [Per insegnanti](${url("/per-insegnanti")}): uso in classe, senza registrazione.
- [Risorse educative consigliate](${url("/risorse-educative-bambini")}): ${contaRisorse()} siti, scuole, cooperative e progetti esterni utili a bambini, famiglie e insegnanti, divisi per categoria e provincia, ognuno con la sua scheda (cosa fa, per chi, costi, sito ufficiale). Le realtà possono reclamare la scheda gratis. La presenza non implica partnership, approvazione o sponsorizzazione.
${categorieAttive(RISORSE).map((c) => `  - [${c.titolo}](${url(percorsoCategoriaRisorse(c))}): ${risorseDi(c.slug, RISORSE).length} realtà. ${c.rispostaBreve}`).join("\n")}
${listingRisorse(RISORSE).map((l) => `  - [${l.categoria.nome} a ${l.provincia} e provincia](${url(percorsoListingRisorse(l.categoria, l.slug))}): ${l.n} realtà.`).join("\n")}
- [Per le mamme](${url("/per-le-mamme")}): la rete delle mamme — associazioni, community locali, gruppi d'ascolto e locali family-friendly con nursery o area giochi. Inserimento gratuito su segnalazione.
- [Chi siamo](${url("/chi-siamo")})
- [Privacy](${url("/privacy")}) · [Cookie](${url("/cookie")})
`;
}

export function GET() {
  return new Response(testo(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
