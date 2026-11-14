# Routine articoli — un articolo approfondito al giorno

Istruzioni operative del job quotidiano che scrive i 100 articoli del piano
SEO (content/piano-editoriale.json), uno al giorno. Riassume il «Prompt
master GiocaMizi» e il suo aggiornamento sulla voce di Giorgia (7/11/2026).
Leggi anche CLAUDE.md (regole assolute) e, PRIMA di scrivere una riga,
`.claude/skills/giorgia-authentic-voice/SKILL.md` (testo originale di Giorgia).

## Missione in una riga
Aiutare una mamma a capire il mondo dei giochi che incuriosisce suo figlio,
scegliere in modo informato e passare tempo insieme. Non una fabbrica di
pagine per Google: ogni articolo risolve un problema reale di un genitore.

## Chi parla e a chi
- Voce: Giorgia Palazzo, imprenditrice, professionista della comunicazione,
  mamma di Domiziana (in famiglia Domi o Dodò). **Mizi è solo la pinguina.**
- Lettrice: una mamma intelligente, impegnata, curiosa, che non conosce il
  gergo dei videogiochi. Mai colpevolizzare chi usa il tablet per gestire la giornata.
- Bambini 3–12 anni, ma mai come un gruppo unico: piccoli (3–5),
  scuola primaria (6–10), preadolescenti (11–12). Ogni articolo dice la fascia.
- Mai suggerire di creare account sotto l'età minima o di aggirare controlli.

## Registri (campo `voce`)
- `pratica` — guide, tutorial, confronti: **≥ 27.000 caratteri spazi inclusi** di
  corpo, senza riempitivi. Se il materiale affidabile non basta: si blocca, non si gonfia.
- `personale` — rubrica «I pensieri di Giorgia»: SOLO da materiale autentico
  (vocali, messaggi, appunti suoi). Lunghezza = pensiero completo.
- `spontanea` — osservazioni leggere: lunghezza adatta al contenuto.
I 100 argomenti del piano sono tutti `pratica`.

## Esperienze personali: regola che blocca
Mai inventare: dialoghi o emozioni di Domi, ricordi, test di giochi fatti da
Giorgia, «a casa nostra abbiamo deciso…». Si distingue sempre tra
(A) esperienza fornita da Giorgia, (B) sua opinione da materiale autentico,
(C) informazione verificata con la ricerca, (D) valutazione tecnica del
redattore AI, mai spacciata per esperienza vissuta.
Senza materiale autentico si scrive in prima persona solo per consigli e
ragionamenti («una delle prime verifiche che consiglio è…»), mai per fatti vissuti.
Se un'esperienza c'è, va registrata in `esperienzeAutentiche` (fonte + data).
Il controllo automatico blocca ogni segno di vissuto senza quella voce.

## Il giro quotidiano (fuso Europe/Rome, alle 9:00)
0. **Bacheca e foto di domani, SUBITO** (ChatGPT parte alle 9:30, docs/bacheca.md):
   leggi le note degli ultimi 2 giorni in Drive «Giocamizi / 0 Bacheca».
   Poi `npm run articoli:piano -- domani`: fissa lo slug definitivo
   (`segna <id> da-fare --slug <slug>`), scrivi la scena e prenota
   `guida-<slug>` `--per <domani>` (come nella sezione «La foto di domani» sotto);
   `npm run prompt-del-giorno -- --data <domani>` e carica il testo come doc
   nuovo «Prompt del giorno · GG/MM/AAAA» (data di domani) in «02 Prompt del giorno».
   Committa subito piano e coda (`git pull --rebase`, push). Poi importa da
   «99 Immagini pronte» le foto non ancora sul sito (`npm run foto-arrivate`).
1. `git pull` su main. `npm run articoli:piano -- prossimo`: argomento del giorno
   (se uno è già `bozza` o `bloccato`, si riprende quello: niente doppioni).
   **Usa lo slug fissato ieri sera** nel piano e, per `foto.scena` e `foto.alt`,
   esattamente la prenotazione `guida-<slug>` in content/foto-in-arrivo.json:
   così la foto già arrivata si aggancia alla pagina. Se cambi slug, la foto non si trova più.
2. Controlla le pagine con intento simile che lo script segnala e il campo
   `guidaEsistente`: se l'intento è lo stesso si **aggiorna** la pagina
   esistente (stesso slug, `aggiornaGuidaBreve: true`), non se ne crea una nuova.
   Se l'argomento ha perso senso: `segna <id> sostituito --motivo "…"` e si passa al dopo.
3. Ricerca web aggiornata: SERP italiana della keyword, domande dei genitori,
   cosa manca nei concorrenti, 5–10 keyword secondarie (sono stime editoriali:
   mai inventare volumi). Fonti ufficiali prima di tutto (produttore, help
   center, PEGI, Apple/Google/Microsoft/Sony/Nintendo, Garante, Polizia
   Postale, studi, organizzazioni per la tutela dei minori). Ogni fatto
   preciso (età, prezzi, impostazioni, date) deve venire da una pagina aperta davvero.
4. Scrivi `content/guide/<slug>.md` (formato sotto), in `stato: bozza`.
5. Tabelle, grafici (blocchi `grafico` e `matrice`), FAQ, link interni ai
   giochi e alle guide pertinenti (solo se servono davvero).
6. `npm run articoli:controlla -- <slug> --rete`. Correggi finché non passa.
   Rileggi con il controllo di autenticità della skill (10 domande).
7. Se passa e `modalita` è `pubblica-se-supera-i-controlli`: `stato: pubblicata`,
   `pubblicata` e `aggiornata` = oggi, `npm run articoli:compila`,
   `npm run prompt-guide`, aggiungi lo slug a scripts/verifica/sbordi.mjs,
   `npm run date-pagine`, poi le TRE verifiche di CLAUDE.md, commit, push, deploy READY.
   `npm run articoli:piano -- segna <id> pubblicato`.
   Se NON passa (o `modalita` è `draft_only`): resta `bozza`,
   `segna <id> bloccato` (o `bozza`), si committa solo il Markdown e il piano
   (la bozza non va online: compila esclude le bozze), e il report dice cosa manca.
8. Nota in Bacheca: doc nuovo «AAAA-MM-GG 09:00 · Claude · Articolo» in
   «0 Bacheca» (Fatto / Per chi viene dopo / Problemi).
   Report (≤ 12 righe): data, argomento, keyword, titolo, caratteri, fonti
   verificate, immagini, link interni, esito SEO, build e test, stato, blocchi,
   prossimo argomento. Mai pubblicare il report come articolo.

Un giorno senza fonti sufficienti produce un report, non un articolo inventato.

## La foto di domani (la prepara la routine delle 9:00, passo 0)
1. `git pull`. `npm run articoli:piano -- domani`: è l'argomento che la routine
   delle 9:00 scriverà domani. (La sera, alle 21:00, si controlla con
   `prossimo`: se la sua foto non è prenotata, la prenota la routine della sera.)
2. Fissa lo slug definitivo (corto, con la keyword, senza date):
   `npm run articoli:piano -- segna <id> <stato attuale> --slug <slug>`.
3. Scrivi la scena della foto di testata (regole in docs/foto-sera.md e
   scripts/blocchi-prompt.ts: niente loghi, schermate di giochi, personaggi
   protetti, persone reali; Mizi come pupazzo) e prenotala:
   `npm run foto:prenota -- --file guida-<slug> --per <domani> --titolo "Foto dell'articolo «…»" --scena "…" --alt "…" --chi "routine articoli"`.
4. `npm run prompt-del-giorno -- --data <domani>` e carica il testo come
   documento nuovo «Prompt del giorno · GG/MM/AAAA» in Drive «02 Prompt del giorno»:
   sono i compiti di ChatGPT delle 9:30.

## La sera (routine «Foto della sera», 21:00)
1. `git pull`. Leggi le note degli ultimi 2 giorni in «0 Bacheca».
2. Importa le foto di ChatGPT da «99 Immagini pronte» (`npm run foto-arrivate`,
   docs/foto-sera.md). Guarda ogni foto nuova: niente scritte leggibili, loghi,
   schermate di giochi, persone reali; Mizi riconoscibile. Una foto sbagliata
   non si importa e resta da rifare.
3. `npm run articoli:piano -- prossimo`: se la foto dell'articolo di domani non
   è prenotata (la routine delle 9:00 è saltata), prenotala ora.
4. Foto ancora mancanti: `npm run foto:genera -- --data <domani>` (API OpenAI).
   Se esce con codice 2 (manca OPENAI_API_KEY) si va avanti senza.
5. Se sono arrivati WebP nuovi: `npm run date-pagine` e le TRE verifiche di
   CLAUDE.md (una foto di una guida già online cambia la pagina). Poi commit
   (piano, coda, public/immagini), `git pull --rebase`, push su main, deploy READY.
6. Registro del prodotto (docs/registro-prodotto.md): `npm run registro -- /tmp/registro`
   (se manca: `pip install openpyxl`), carica il file .xlsx in Drive «1 Progetti /
   100 articoli approfonditi» (id 1w7h_IGqfsTD5uiHQl03QsvJCeQAWN7sS) e rinomina
   quello del giorno prima «zz_SUPERATO — …». Se Python non c'è, scrivilo nella nota.
7. Nota in Bacheca: «AAAA-MM-GG 21:00 · Claude · Foto importate» (foto
   importate, foto che mancano ancora col loro nome, problemi).

## Non pestarsi i piedi con la routine delle 7:00
Questo job gira dopo (alle 9:00) e tocca solo: content/guide/, content/piano-editoriale.json,
content/foto-in-arrivo.json, public/immagini/ (foto arrivate),
lib/approfondimenti.json, lib/date-pagine.json, scripts/verifica/sbordi.mjs.
Prima del push: `git pull --rebase`. La routine delle 7:00 non scrive più
guide nuove (lo slot «guida» migliora quelle esistenti): vedi CLAUDE.md.

## Formato del file (content/guide/<slug>.md)
```yaml
---
slug: roblox-e-sicuro-per-bambini      # = nome del file
idPiano: 1
titolo: "Roblox è sicuro per bambini? Guida completa per genitori"   # H1
titoloSeo: "Roblox è sicuro per bambini? Guida per genitori"         # ≤ 70 caratteri (facoltativo)
titoloBreve: "Roblox e sicurezza"
descrizione: "…"                        # meta description ≤ 160
rispostaBreve: "…"                      # 2–3 frasi citabili dalle AI
keyword: "Roblox è sicuro per bambini"
keywordSecondarie: ["…"]
categoria: sicurezza-digitale           # guide-giochi | confronti | sicurezza-digitale | tavolo-offline | famiglia-abitudini | mamme-imprenditrici | rubrica
voce: pratica                           # pratica | personale | spontanea
etaMin: 6
etaMax: 12
skill: attenzione                       # illustrazione di Mizi (Skill di games/registry.ts)
stato: bozza                            # bozza | pubblicata
pubblicata: 2026-11-07
aggiornata: 2026-11-07                  # solo revisioni vere: mai cambiarla per «sembrare fresco»
fontiVerificateIl: 2026-11-07
prezziVerificatiIl: 2026-11-07          # obbligatoria se nel testo ci sono prezzi
giochi: [trova-le-differenze]           # giochi Giocamizi davvero pertinenti
foto:                                   # scheda per la foto di testata (flusso ChatGPT di CLAUDE.md)
  scena: "…"                            # niente personaggi protetti, niente loghi o schermate di terzi
  alt: "…"
schedaRapida:
  - { voce: "Età minima", valore: "…" }
fonti:
  - { titolo: "…", editore: "Roblox", url: "https://…", consultata: 2026-11-07 }
immagini: []                            # { file: /immagini/x.webp, alt, didascalia, origine, licenza }
esperienzeAutentiche: []                # { fonte: "vocale di Giorgia", data: 2026-11-03, nota }
relazioniCommerciali: null              # obbligatorio se si citano Deebrain, Influencee, Partidea…
faq:
  - { domanda: "…", risposta: "…" }
---
```
Corpo: solo `##` e `###` (l'H1 è il titolo). Tabelle Markdown. Visualizzazioni:

    ```grafico
    {"titolo": "…", "unita": "€", "nota": "Fonte: … · verificato il …", "voci": [{"etichetta": "…", "valore": 4.99}]}
    ```
    ```matrice
    {"titolo": "…", "intestazione": "Impostazione", "colonne": ["Roblox", "Minecraft"],
     "righe": [{"voce": "Limite di spesa", "valori": ["si", "parziale"]}], "nota": "…"}
    ```

## Struttura consigliata (si adatta all'argomento, niente sezioni decorative)
Introduzione che parte dal problema → risposta sintetica (In breve + Scheda
rapida) → cos'è e come funziona → età e requisiti ufficiali → cosa fa il
bambino → costi e acquisti (distinguere acquisto, abbonamento, DLC,
microtransazioni) → interazioni online e privacy → rischi reali → vantaggi →
svantaggi → alternative e confronti → istruzioni pratiche per i genitori →
come farlo stare bene nella vita di famiglia → FAQ → fonti.
Piattaforma ≠ singoli giochi ospitati (Roblox: ogni esperienza è diversa).
Mai «il più sicuro» in assoluto: si spiega cosa cambia davvero il rischio.

## Confronti: obbligatori
Criteri sempre uguali: età/PEGI, dispositivi, costo iniziale, acquisti
opzionali, pubblicità, chat, multiplayer, sconosciuti, personalizzazione,
complessità, accessibilità, controlli parentali, durata delle sessioni,
gioco in famiglia, connessione, valore creativo (solo se supportato).
Cinque tabelle: caratteristiche · prezzi e acquisti · controlli e interazioni
online · plus e minus · scelta per età e scenario familiare. Almeno due
visualizzazioni. Ogni tabella commentata in prosa. Data dei prezzi; per i giochi
da tavolo distinguere prezzo di listino e prezzo visto nei negozi.

## Immagini
Priorità: screenshot fatti da noi in un test autorizzato → materiale stampa
ufficiale con permesso d'uso → licenza compatibile → embed ufficiali →
visualizzazioni e infografiche nostre. Mai copiare immagini dai siti dei
produttori, mai hotlink, mai screenshot inventati, mai personaggi protetti.
Ogni immagine: origine, licenza, alt, didascalia (campo `immagini`).
In pratica oggi: grafici e matrici originali nel corpo + la foto di testata
dal flusso ChatGPT (scheda `foto`), che arriva dopo e compare da sola.

## SEO / AEO / GEO
Titolo SEO, meta description, slug, un solo H1, H2/H3 sensati, risposta
sintetica in alto, keyword naturali, fonti esterne verificate, link interni,
autore e date vere, alt alle immagini. Canonical, Open Graph, sitemap,
llms.txt, Article + FAQ + Breadcrumb JSON-LD arrivano da soli dal registro.
Mai promettere posizionamenti o citazioni nelle AI.

## Commerciale
Deebrain, Influencee, Partidea solo negli articoli su lavoro e impresa,
sempre con il rapporto dichiarato (`relazioniCommerciali`). Gli articoli sui
giochi non vendono niente. Funzionalità e prezzi di Deebrain: verificati ogni volta.

## Rubrica «I pensieri di Giorgia» (registro personale)
L'AI può proporre temi (tempo che manca, autonomia e protezione, tecnologie
dei bambini, cambiare programma, giocare senza cercare un risultato), ma il
racconto parte da un vocale o da un testo di Giorgia. Senza materiale si
prepara una **traccia** (domande da farle, struttura), mai un racconto.
Tracce in docs/rubrica/.
