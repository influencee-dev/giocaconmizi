# Architettura di Giocamizi: dove sta ogni cosa

Scritta il 17/11/2026. È la mappa delle cartelle e la regola per decidere dove va un file nuovo. La controlla da sola la verifica (`scripts/verifica/struttura.mjs`): un file nel posto sbagliato ferma la pubblicazione.

Il progetto cresce a pezzi e da più chat insieme. Per questo la regola è una sola e semplice: **prima di creare un file, cerca qui la sua cartella. Se non c'è, non inventarne una: scrivi qui la cartella nuova, e solo dopo crea il file.**

## La radice

| Cartella | Cosa contiene | Cosa NON contiene |
|---|---|---|
| `app/` | Le pagine e gli indirizzi del sito (Next.js). Una cartella = un indirizzo. | Logica riusata da più pagine: quella va in `lib/` o `components/`. |
| `components/` | I pezzi di interfaccia, una cartella per zona del sito. | Dati e regole: stanno in `lib/`. |
| `games/` | I giochi. Una cartella per gioco, più i motori comuni in `games/_engine/`. | Le pagine dei giochi (stanno in `app/`), l'album e la voce (stanno in `lib/giochi/`). |
| `lib/` | Dati, regole e funzioni senza interfaccia, divisi per argomento. | File sciolti: ogni file sta in una cartella per argomento. |
| `content/` | Testi e dati scritti a mano: schede dei giochi, storie, articoli, copione della voce, video. | Codice. |
| `cards/` | Il registro dei temi dei biglietti (`registry.ts`). | Altro: i componenti dei biglietti sono in `components/biglietti/`. |
| `public/` | File serviti così come sono: foto, icone, voce registrata, video. | Sorgenti. |
| `assets/` | Materiali di lavoro non serviti dal sito (musiche e grafiche social). | File usati dalle pagine: quelli vanno in `public/`. |
| `scripts/` | Strumenti da riga di comando. Le prove automatiche sono in `scripts/verifica/`. | Codice usato dal sito mentre gira. |
| `supabase/` | Le tabelle del database, in SQL. | |
| `docs/` | Documenti di progetto e procedure. | Codice. |

Nella radice restano solo i file di configurazione (`package.json`, `next.config.ts`, `middleware.ts`, `CLAUDE.md`…). Uno script non va mai nella radice.

## `lib/`: una cartella per argomento

| Cartella | Argomento | File principali |
|---|---|---|
| `lib/giochi/` | Quello che i giochi hanno in comune fuori dal gioco: album di Mizi, voce, suoni, conto delle partite | `album.ts`, `audio.ts`, `suoni.ts`, `partite.ts`, `voce-id.ts`, `voce-registrata.json` (generato) |
| `lib/directory/` | Feste per città e directory delle attività | `feste.ts` (i locali), `directory.ts` (categorie e schede), `esperienze.ts` (filtri), `etichette.ts`, `coordinate-citta.ts`, `directory-db.ts`, `posizioni.ts`, `statistiche.ts`, `rete.ts`, `reclamo.ts`, `admin.ts` |
| `lib/risorse/` | La directory delle risorse educative | `risorse-categorie.ts`, `risorse-educative.ts`, `risorse-educative-dati.ts`, `risorse-reclamo.ts`, `risorse-anteprime.ts` |
| `lib/natale/` | Il Natale di Mizi | `natale.ts`, `natale-esporta.ts`, `eventi-natale.ts` |
| `lib/biglietti/` | Inviti e kit della festa | `biglietti.ts`, `condivisione.ts`, `esempi.ts` |
| `lib/contenuti/` | Guide, articoli, tutorial, note legali | `guide.ts` (guide brevi), `content.ts` (lettura di `content/`), `approfondimenti.json` (generato), `tutorial.ts`, `tutorial-dati.json` (generato), `legal.ts` |
| `lib/foto/` | Le foto del sito | `foto.ts`, `foto-dati.ts`, `foto-del-giorno.ts`, `foto-in-arrivo.ts`, `caricatore-immagini.ts`, `immagini-varianti.json` (generato) |
| `lib/email/` | Email | `brevo.ts`, `brevo-conferma.ts`, `brevo-benvenuto.ts`, `email-servizio.ts` |
| `lib/seo/` | Motori di ricerca | `seo.ts`, `date-pagine.ts`, `date-pagine.json` (generato), `og.tsx`, `gsc.ts`, `precarico.ts` |
| `lib/famiglia/` | Il profilo della famiglia nell'app e i percorsi di riflessione per i genitori | `profilo.ts`, `sotto-pressione.ts` (domande, calcolo e letture del percorso «sotto pressione») |
| `lib/social/` | Slide e testi per Instagram | `post.ts`, `instagram.ts`, `disegna.tsx` |
| `lib/protezione/` | Limiti e difese contro gli abusi | `limiti.ts` |
| `lib/supabase/` | Collegamenti al database | |

I file segnati «generato» li scrive uno script: non si modificano a mano.

## `games/`: com'è fatto un gioco

- `games/registry.ts`: l'elenco dei giochi. Un gioco esiste solo se è qui.
- `games/<slug>/Game.tsx`: il gioco. Di solito sono poche righe: i contenuti del gioco passati a un motore.
- `games/_engine/`: i motori e le parti comuni.
- `public/figure/`: i disegni fatti apposta per i giochi (WebP 384 px, regole in `LICENZA.txt` lì dentro); li mostra `games/_engine/figura.tsx`.
  - `nucleo.ts`: la logica di partita uguale per tutti (round, punti, stelle, suoni, aiuto, lodi). Un motore nuovo parte da qui.
  - `SceltaMultipla.tsx`, `Memory.tsx`, `Ordina.tsx`, `GrigliaCoding.tsx`, `Tartaruga.tsx`, `Puntini.tsx`, `Differenze.tsx`, `PixelArt.tsx`, `CreaGioco.tsx`, `Esplora.tsx`, `Corsa.tsx`: i motori.
  - `griglia-logica.ts` (coding su griglia), `esplora-logica.ts` (esplorazione a sale) e `corsa-logica.ts` (corsa a tre strade): logica pura, senza interfaccia. La usano lo schermo, la demo e le prove.
  - `arte.tsx`, `scena.tsx`, `casuale.ts`, `tipi.ts`: disegni, numeri a caso, il contratto comune.
- `content/games/<slug>.md`: il testo della pagina del gioco.
- `content/voce-mizi.json`: le frasi che Mizi dice, identiche a quelle nel codice.
- `content/seo/parole-chiave.json`: le ricerche vere su cui lavora il SEO manager (volume, pagina che risponde, stato); `titoloSeo` nel frontmatter di `content/games/<slug>.md` è il titolo per Google del gioco.
- `lib/giochi/novita.ts`: gli ultimi arrivati, cioè i giochi ordinati per ultima modifica. Li mostrano la home e il catalogo.
- Il metodo per migliorare un gioco è in `.claude/skills/game-designer-mizi/SKILL.md`.

## `components/`: una cartella per zona

`app` (l'app installata), `biglietti`, `directory`, `feste`, `form`, `game-shell` (il guscio comune dei giochi, con la festa finale), `genitori` (i percorsi per gli adulti, dal 20/11/2026: non sono guide né giochi), `giochi` (catalogo e album), `guide`, `legal`, `mappa`, `natale`, `risorse`, `seo`, `storie`, `tutorial`, `ui` (bottoni e contenitori di base), `vetrina` (testata, menu, piede), `font-switcher`, `progress`.

Tre file restano sciolti perché li usano tutte le zone: `icone.tsx`, `illustrazioni.tsx`, `decor.tsx`.

## Come si decide dove va un file nuovo

1. **È una pagina o un indirizzo?** → `app/`.
2. **Si vede sullo schermo e si riusa?** → `components/<zona>/`.
3. **È un dato, una regola o un calcolo senza interfaccia?** → `lib/<argomento>/`.
4. **È un testo scritto a mano?** → `content/`.
5. **È uno strumento che si lancia a mano o una prova?** → `scripts/` o `scripts/verifica/`.
6. **È una foto, un audio o un video servito dal sito?** → `public/`.

Se un file serve a due argomenti, sta in quello che lo possiede (chi lo cambia quando cambia la regola) e l'altro lo importa.

## Quando si sposta qualcosa

- Si sposta con `git mv`, così la storia del file resta.
- Si aggiornano i percorsi scritti a mano: `CLAUDE.md`, i documenti in `docs/`, le skill in `.claude/skills/`, gli script che leggono i file per nome, i messaggi delle attività programmate e la «Mappa del sito» su Drive.
- Il commit di un riordino ha `[riordino]` nel titolo e non contiene altre modifiche. Così le date delle pagine non cambiano: uno spostamento non è una modifica del contenuto (`scripts/date-pagine.mjs`, opzione `--riordino`).
- Dopo: verifica completa, e una nota in Bacheca per le altre chat, che hanno rami aperti con i percorsi vecchi.

## Cosa resta da sistemare

- `cards/` ha un solo file: il registro dei temi dei biglietti. Starebbe meglio in `lib/biglietti/`, ma molti documenti lo citano col percorso di oggi: si sposta quando si rimette mano ai biglietti.
- `scripts/` ha tredici strumenti sciolti: si possono dividere per argomento (foto, voce, video, articoli) in un secondo passaggio.
- `components/font-switcher` e `components/progress` hanno un file ciascuno: da unire a `ui` alla prima occasione.
