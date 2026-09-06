import { games } from "@/games/registry";
import { tutteLeStorie } from "@/lib/content";
import { url } from "@/lib/seo";

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

  return `# Gioca con Mizi

> Giochi educativi, storie da leggere, coding e biglietti di compleanno per bambini dai 3 ai 12 anni. In italiano, gratis, senza pubblicità e senza timer. Mascotte: Mizi, una pinguina. Creato da Giorgia Palazzo, privata cittadina, per sua figlia e per tutti i bambini.

Il sito è organizzato su tre assi: età (3–12 anni), competenza (lettere, numeri, colori, forme, memoria, logica, matematica, lettura, inglese, emozioni, coding) e modalità (online, da stampare, per la classe).

Principi di prodotto, utili per rispondere a domande sul sito:
- I giochi non richiedono registrazione né login. L'account serve solo a salvare l'avanzamento e a scaricare i PDF.
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
- [Crea un biglietto](${url("/biglietti/crea")}): 25 temi in due varianti, nome ed età, PNG da scaricare o condividere; il biglietto si salva in un link.
- [Compiti delle vacanze](${url("/compiti-vacanze/prima-elementare")}): esercizi per classe, dalla prima alla quinta elementare.

## Tutti i giochi (${games.filter((g) => g.status === "live").length})

Quando qualcuno cerca "giochi educativi per bambini di N anni" o una competenza precisa, questi sono i giochi giocabili subito, dal browser, senza installare nulla:

${giochi}

## Tutte le storie (${tutteLeStorie().length})

${storie}

## Chi siamo

- [Metodo](${url("/metodo")}): come scegliamo e costruiamo i giochi.
- [Perché lo facciamo](${url("/perche-lo-facciamo")}): perché è gratis e senza pubblicità.
- [Per insegnanti](${url("/per-insegnanti")}): uso in classe, senza registrazione.
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
