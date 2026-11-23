# Gioca con Mizi — canone del progetto

Sito italiano di giochi educativi gratuiti per bambini 3–12 anni, live su
https://giocamizi.it (collegato su Vercel il 24/10/2026; giocaconmizi.vercel.app fa redirect).
Un'idea di Giorgia Palazzo (founder di Partidea e Influencee), nata per la
figlia Domiziana, da cui il nome di Mizi. Titolare e gestore del sito:
Partidea SRL (dati in lib/contenuti/legal.ts → SOCIETA). Mascotte: Mizi, una pinguina.

## Regole assolute
- Tutto in italiano: codice (nomi, commenti), contenuti, commit.
- MAI personaggi protetti da copyright (Peppa Pig, Disney, Paw Patrol…),
  nemmeno "presi dal web": solo arte originale o librerie con licenza
  verificata (vedi public/icone/LICENZA.txt).
- Niente pubblicità, timer, dark pattern; dati dei bambini al minimo
  (vedi lib/contenuti/legal.ts: un tracciamento nuovo = una voce nel registro).
- Prima di OGNI push, `npm run date-pagine` (date vere per i lastmod della
  sitemap, dalla storia git: serve il clone completo, quindi in un clone
  `--depth` prima `git fetch --unshallow origin main`). La batteria seo
  fallisce se lib/seo/date-pagine.json non è allineato.
- Prima di OGNI push, verifica TRE volte (regola di Giorgia):
  1. `npm run typecheck && npm run lint && npm run build`
  2. `npm run verifica` (batterie Playwright da mobile, scripts/verifica/)
  3. gli sbordi sono inclusi nella batteria; se tocchi pagine nuove,
     aggiungile a scripts/verifica/sbordi.mjs PRIMA di verificare.
     La batteria seo.mjs controlla dominio unico (giocamizi.it) su robots,
     sitemap, canonical, og:url e JSON-LD, e che ogni URL della sitemap
     risponda 200 col canonical su sé stesso: se cambia il dominio,
     aggiornalo lì insieme a lib/seo/seo.ts.
- Push su `main` → deploy automatico Vercel. Controlla che arrivi READY
  (progetto prj_O3AzIDL7AdXBzBW5Ui4fN4i44PJo, team team_rd3X8YlvlxgVMoQxo1AUXJB6).
  Se il deploy è READY sul commit appena pushato e le verifiche locali sono
  passate, non serve scaricare le pagine live.

## Articoli nell'app e ordine dei contenuti (Giorgia, 22/11/2026)
Scelte confermate da Giorgia con tre risposte a scelta, dopo due letture sbagliate:
- L'ordine «giochi, poi location, poi storie, poi articoli» è l'ordine in cui
  i contenuti si vedono NELL'APP. Mai niente sopra i giochi.
- La home dell'app (`components/app/HomeApp.tsx`) resta com'era: giochi, le
  quattro caselle «Per la mamma» (Inviti, Feste, Storie, Guide) e in fondo il
  blocco «Articoli per i genitori» (i quattro più recenti). Niente sezioni
  nuove con le città o le storie: le ha viste e non le ha volute.
- La barra in basso (`components/app/BarraSchede.tsx`) è Home, Giochi, Feste,
  Storie, Profilo.
- Non rifare la home né spostare le schede senza che lo chieda lei.
- Gli articoli nuovi compaiono da soli: nella home dell'app e in cima a /guide
  (`guideInOrdine()` in lib/contenuti/guide.ts: prima gli articoli dal più
  recente, poi le guide brevi).

## Percorso per i genitori «sotto pressione» (20/11/2026)
- `/genitori/sotto-pressione`: 35 affermazioni sulle cinque spinte dell'Analisi
  Transazionale (Kahler) e 10 situazioni di casa, poi un profilo. Domande,
  calcolo e letture in `lib/famiglia/sotto-pressione.ts`, schermo in
  `components/genitori/`, prove in `scripts/verifica/genitori.mjs`.
- PUBBLICATO il 23/11/2026 per decisione di Giorgia (`PERCORSO_PUBBLICO` true),
  anche per raccogliere iscrizioni; la rilettura di uno psicologo resta
  consigliata. Titolo per Google e social «E tu che mamma diventi sotto
  pressione?» (`titoloSocial`), tasto «Condividi il test con le amiche»
  (components/genitori/CondividiTest.tsx: mai il risultato nel messaggio),
  richiamo «E tu che tipo di mamma sei?» (InvitoTest) su /per-le-mamme e
  /guide. Con false torna bozza e tutto sparisce.
- Dati PRIMA del profilo (decisione di Giorgia, 23/11 sera): dopo l'ultima
  domanda la fase «dati» (components/genitori/ModuloDati.tsx: nome, cognome,
  email, fascia d'età, città, età del figlio, spunta per la Posta di Mizi),
  detto già nella schermata iniziale. Va a /api/brevo con origine
  «test-sotto-pressione» (LASTNAME, ETA_GENITORE): SOLO il modulo, mai le
  risposte. Se Brevo non risponde il profilo si apre lo stesso.

## Condividere e anteprime social (23/11/2026)
- Tasto comune `components/ui/Condividi.tsx` (foglio del telefono,
  altrimenti WhatsApp, Facebook, Telegram, email, copia link; link con UTM
  utm_source=condivisione&utm_campaign=<guida|gioco|attivita|test-…>) su guide
  e articoli, giochi, schede delle attività e test. Pagina nuova da far
  condividere = un <Condividi> con un invito che porta sul sito.
- Anteprime (opengraph-image) disegnate da `immagineOg` in lib/seo/og.tsx sul
  design system: logo, Mizi, Nunito, etichetta colorata, «… su giocamizi.it →».
  Ci sono per home, guide, feste/[città], giochi, schede, test; i file letti
  stanno in outputFileTracingIncludes («/**/opengraph-image*»).
- Su guide, giochi e schede il tasto è la pillola piccola (`piccolo`, 40 px:
  sotto la regola dei 64 px dei bottoni, che è per i bambini); nella scheda sta
  nel riquadro dei contatti, accanto ai link del locale. Nel test resta grande.
- Video dei tutorial: sul telefono si vede la versione 9:16
  (public/video/<slug>-verticale.mp4, la fa `npm run video`), dal computer la 16:9.
- Non è un test validato e non fa diagnosi: i testi dicono «può», mai «sei».
  Il punteggio è un conto fisso; nessuna AI decide o ritocca i numeri.
- Le risposte restano nel browser (sessionStorage): niente server, niente
  database, niente statistiche. Salvarle altrove = decisione di Giorgia più
  informativa nuova.
- Il questionario ESQ-R-I sugli stati dell'Io (Laghi, Crea, Filipponi, 2020)
  NON si copia: i diritti d'uso non sono verificati. Niente profili dei
  bambini. La versione per i collaboratori non si fa qui senza un parere
  legale (test di personalità e lavoratori).

## Dove va ogni file (17/11/2026, docs/ARCHITETTURA.md)
- Prima di creare un file si cerca la sua cartella in `docs/ARCHITETTURA.md`.
  Se non c'è non se ne inventa una: prima si scrive lì la cartella nuova.
- `lib/` non ha file sciolti: solo cartelle per argomento (`giochi`,
  `directory`, `risorse`, `natale`, `biglietti`, `contenuti`, `foto`, `email`,
  `seo`, `famiglia`, `social`, `protezione`, `supabase`). Nella radice solo
  configurazione; niente codice in `content/` e `docs/`.
- Lo controlla `scripts/verifica/struttura.mjs`, prima batteria di
  `npm run verifica`: un file fuori posto ferma la pubblicazione.
- Uno spostamento si fa con `git mv`, in un commit con `[riordino]` nel titolo
  e nient'altro dentro; le date delle pagine si rigenerano con
  `node scripts/date-pagine.mjs --riordino` (uno spostamento non è una modifica).

## Architettura (tutto data-driven: un dato nuovo aggiorna sitemap e llms.txt da solo)
- `games/registry.ts` — i giochi; componenti in `games/<slug>/Game.tsx`,
  motore condiviso in `games/_engine/`, testi in `content/games/*.md`.
- `lib/contenuti/guide.ts` — le guide per i genitori (/guide): risposta breve
  citabile dalle AI + sezioni + FAQ + giochi collegati.
  Ogni guida ha `foto: { scena, alt }`: è la scheda per la foto di testata.
  Dopo una guida nuova, `npm run prompt-guide` e aggiorna su Drive il
  documento «00 PROMPT GUIDE · Foto degli articoli Giocamizi» (cartella
  «Giocamizi · Prompt immagini», id 1tvRSJlXalCDtEsiDaGK3MBRAEM-3lEYhAU8EW9coRX8):
  Giorgia lo dà a ChatGPT. Le foto arrivano come
  public/immagini/guida-<slug>-<1440|960|640>.webp e compaiono da sole.
- `cards/registry.ts` + `components/biglietti/` — il creatore di biglietti:
  temi (motivi SVG in motivi.tsx), adesivi (stickers.tsx), QR RSVP,
  foto solo nel PNG mai nei link (lib/biglietti/condivisione.ts).
- `components/icone.tsx` — libreria icone (Fluent Emoji MIT, public/icone/).
- `lib/directory/feste.ts` — pagine locali /feste/[città] (SEO/GEO/AEO): 3 città nuove
  al giorno, SOLO locali reali trovati con la ricerca web, link nofollow ai
  siti ufficiali verificati, reel Instagram solo con URL vero (carica al
  tocco: niente cookie di terzi senza gesto). Ordine: città per popolazione.
- `lib/directory/directory.ts` — la directory /[categoria]/[città]/[attività]
  (docs/piano-directory.md): le schede nascono dai locali di lib/directory/feste.ts,
  smistati per `tipo` nelle categorie; listing città solo con ≥2 schede.
  MAI foto prese dai siti o dai social dei locali: solo illustrazioni
  nostre finché l'attività non carica le sue. Email e telefoni dei locali
  NON vanno nel repo (è pubblico): stanno nel foglio privato di Giorgia.
- Categorie della directory (08/11/2026): 13, in `CATEGORIE` di lib/directory/directory.ts
  (fattorie didattiche, ristoranti, animatori, corsi, teatro, allestimenti
  oltre alle 7 storiche); una categoria diventa pagina solo con ≥1 scheda.
  Se una regola nuova sposta schede esistenti di categoria, gli indirizzi
  vecchi vanno aggiunti a `content/directory-spostamenti.json` (redirect
  permanenti in next.config.ts; la batteria SEO li controlla). Il modulo
  ha anche «Altro».
- Parchi avventura e parchi acquatici (15/11/2026): due categorie «da giornata
  fuori» (`giornata: true` in CATEGORIE, in testa all'elenco perché il loro
  `tipo` contiene parole di altre regole). Un posto che dalle fonti NON risulta
  fare feste si inserisce in lib/directory/feste.ts con `festa: false`: ha la scheda
  nella directory ma non compare in /feste/[città] (`localiDaFesta`), la scheda
  non mostra «Fa feste di compleanno», non prende i filtri «Per la festa» e il
  listing non scrive «tutte organizzano feste». Mai scrivere che un parco fa
  feste senza una fonte. I parchi si agganciano a una città già presente, con
  la distanza nella `zona` («Riccione, a pochi chilometri da Rimini»). Le date
  di stagione si scrivono con l'anno («nel 2026 dal… al…»). Parchi chiusi o
  senza segnali recenti non si inseriscono (Etnaland: stagione 2026 annullata).
  La lista di nomi da verificare è su Drive, 1 Progetti («Parchi avventura e
  acquatici · lotto 1 e nomi da verificare»).
- Candidature: `/aggiungi-attivita` (pubblica) — un'attività nuova si propone
  (anche la categoria «Associazioni e laboratori», attiva solo quando c'è una
  scheda) o un titolare chiede l'accesso alla sua scheda. Finiscono in
  `dir_candidature` (`supabase/candidature.sql`) e in /admin/[codice]/candidature.
  Niente va online da solo: un'attività nuova si verifica sul sito ufficiale e
  si aggiunge a lib/directory/feste.ts come le altre; un accesso si chiude mandando il
  link personale. Email e telefoni dei proponenti restano nel database, mai nel repo.
- Area attività (fase 1): `/la-tua-scheda/[codice]` (link personale: il
  locale approva, modifica o chiede di togliere la scheda) e
  `/admin/[codice]` (Giorgia decide). Database in `supabase/directory.sql`,
  incollato a mano da Giorgia nel SQL Editor: il sito usa solo la chiave
  pubblica e funzioni RPC; nel DB solo impronte SHA-256 dei codici. I
  codici veri non vanno MAI nel repo. Le pagine pubbliche leggono le
  risposte accettate con `pubblicate()` (lib/directory/directory-db.ts) e si
  rigenerano ogni 10 minuti o subito dopo una decisione.
- `lib/risorse/risorse-educative.ts` + `lib/risorse/risorse-educative-dati.ts` +
  `lib/risorse/risorse-categorie.ts` — dal 14/11/2026 una directory come le feste
  (docs/piano-risorse-eventi.md): /risorse-educative-bambini → /<categoria>
  → /<categoria>/<provincia> (≥2 schede) e la scheda di OGNI realtà su
  /risorse-educative-bambini/<slug> (il link delle email: senza categoria
  nell'indirizzo apposta). Categoria nuova = una voce in CATEGORIE_RISORSE,
  appare da sola alla prima scheda. Anti-scraping solo sull'hub esatto.
  Anteprime dei siti (decisione di Giorgia del 14/11/2026, eccezione alla
  regola «mai foto dai siti»): screenshot ritagliati SOLO delle risorse
  online (blog, portali), mai di scuole/nidi/cooperative, guardati uno per
  uno (niente volti di bambini, personaggi protetti, banner cookie; mai
  cliccare «Accetta» a nome di nessuno): `lib/risorse/risorse-anteprime.ts`. Reclamo come le attività: «È la tua realtà?» → Candidature →
  link personale da /admin/[codice]/risorse (chiave `risorse/<slug>` in
  dir_inviti/dir_richieste) → la realtà completa la scheda e carica il logo
  (ricodificato in WebP, approvato da Giorgia, servito da /loghi/risorse/).
  Mai loghi presi dai siti. SQL: `supabase/risorse-reclamo.sql`, logica in
  `lib/risorse/risorse-reclamo.ts`. Tutti e 4 i file SQL sono stati incollati l'8/11/2026.
- Email di servizio delle schede: `lib/email/email-servizio.ts` (via Brevo,
  `inviaEmailServizio`, sempre dentro `after()`: non bloccano mai l'azione).
  Avviso a Giorgia (AVVISI_EMAIL su Vercel, se no ciao@) a ogni candidatura,
  risposta o logo; conferma a chi scrive; «Manda il link personale» in
  Candidature; «la tua scheda è online / tolta» quando Giorgia decide.
  Senza BREVO_API_KEY non parte niente (il link si copia a mano).
  Collegate e provate il 12/11/2026: account Brevo «Gioca Mizi» (NON quello
  Influencee del connettore MCP, che da qui non vede né log né liste del sito),
  mittente ciao@giocamizi.it, dominio autenticato. Blocco IP di Brevo spento
  (Vercel cambia IP). Pannello → Iscritti → «Email di servizio»: account,
  mittente, dominio e bottone di prova; un invio fallito lascia
  `[brevo] email «…» non partita` nei log di Vercel.
  Posta di Mizi (iscrizione con doppio opt-in → email di conferma → pagina
  /iscrizione-confermata → email di benvenuto con la foto di Giorgia e
  Domiziana, lib/email/brevo-benvenuto.ts) provata dal vivo fino in fondo il
  13/11/2026: arrivate tutte e due. Se si blocca, la risposta di /api/brevo
  riporta il messaggio esatto di Brevo (es. «Sender is invalid / inactive»
  = mittente da riverificare). Posta di giocamizi.it su
  Zoho Mail (MX zoho.eu, organizzazione di giorgia@influencee.it):
  ciao@giocamizi.it è una casella Zoho, non un alias Gmail. DNS su Netsons.
  Dati dal foglio «Listing GiocaMizi» di Giorgia: SOLO
  colonne pubbliche, mai le righe «Solo outreach — non pubblicare», mai email
  o note di outreach (il repo è pubblico). Difese anti-scraping in
  `lib/protezione/` (limiti, crawler verificati, trappola): docs/protezione-risorse.md.
- `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts` — AEO/SEO:
  generati dai registri. JSON-LD in `components/seo/JsonLd.tsx`.
- SEO/AEO: ogni contenuto nuovo deve avere risposta citabile, FAQ con
  JSON-LD e link interni ai giochi pertinenti.
- Foto preparate LA SERA PRIMA (docs/foto-sera.md): chi prepara un contenuto
  prenota le foto che gli serviranno domani o dopo in `content/foto-in-arrivo.json`
  (`npm run foto:prenota`). Dal 12/11/2026 il giro è quello della Bacheca (sotto):
  il documento dei prompt (`npm run prompt-del-giorno -- --data <domani>`) va su
  Drive «02 Prompt del giorno» (id 1B5v_f7JpfXiZGnnXyEBBXxzy9ARYtYwe) alle 9:00,
  ChatGPT genera alle 9:30, Claude importa alle 21:00. Riserva: l'API di OpenAI
  (`npm run foto:genera`, chiave OPENAI_API_KEY solo nell'ambiente cloud
  «Giocamizi»). Le foto finiscono in «99 Immagini pronte» (id 1lUlL1Uj2AspXO2SgFeSU_itN0nu2RQbP)
  con nomi neutri (foto-xxxxxxxx) e chi lavora dopo le importa con
  `npm run foto-arrivate -- <cartella>`. Prompt e scelta delle foto: lib/foto/foto-del-giorno.ts.
- Sitemap delle immagini (08/11/2026): le foto vere stanno in sitemap con
  la loro pagina (`fotoDellaPagina` in lib/foto/foto.ts, guide ed esempi da soli).
  Un riquadro foto nuovo o spostato = aggiornare FOTO_PAGINE: la batteria
  SEO controlla che ogni foto in sitemap compaia nella sua pagina.

## Drive di Giocamizi: secondo cervello PARA (11/11/2026, rifatto il 13/11/2026)
- Cartella «Giocamizi» (id 1Qh2okN0Bj-GDvy4y9m9wGSk9KnBnpPfN) con 0 Bacheca,
  0 Richieste di Giorgia, 1 Progetti, 2 Aree, 3 Risorse, 4 Archivio. Indice:
  doc «00 LEGGIMI · Giocamizi (13-11-2026)» (id 1VgWbEO9HWppoMp2J5YurE1twkQvS5jDra91Iol-RcBQ;
  il vecchio dell'11/11 è «zz_SUPERATO»): leggerlo prima di cercare o salvare
  su Drive. «Prompt immagini» e «Social» stanno in 2 Aree con gli stessi id.
- I quattro documenti base in 3 Risorse, scritti per ChatGPT che il repo non
  lo legge: «01 Fatti di Giocamizi», «02 Mappa del sito · dove sta ogni testo»,
  «03 Come si cambiano i testi», «04 Patto di lavoro Claude e ChatGPT». Sono
  FOTOGRAFIE con la data nel titolo: il connettore Drive crea, rinomina e
  sposta ma non modifica, quindi quando cambiano i fatti si crea la versione
  nuova e la vecchia prende «zz_SUPERATO — » davanti al titolo.
- «La mappa di Giocamizi» (14/11/2026, regola di Giorgia): la pagina privata
  https://claude.ai/artifact/6QKg2emJDB3HrZsYY7F67K (cosa c'è, a chi serve,
  semaforo, modello di business, contenuti da usare settimana per settimana).
  Ogni volta che va online qualcosa di nuovo (pagina, strumento, sezione,
  prodotto) o cambia una decisione di business, si aggiorna: strumento Artifact
  azione «read» sull'URL, si modifica l'HTML, si ripubblica con lo stesso «url».
  Ogni lunedì revisione completa con i numeri veri del repo e copia su Drive in
  3 Risorse come «05 Mappa di Giocamizi (AAAA-MM-GG)» (la vecchia prende
  «zz_SUPERATO — »). La fa la routine locale «Mappa di Giocamizi · lunedì».
- «0 Richieste di Giorgia» (id 1UWRDMZzDF5Rpbh17amd_KrCjXwbNKr9v): una modifica
  al sito per documento («AAAA-MM-GG · pagina · cosa»). Le aperte sono quelle che
  non iniziano con «FATTO», «DA CHIARIRE» o «00». Fatta la modifica (con le
  verifiche di sempre), rinominare il documento «FATTO · <titolo>» (o «DA
  CHIARIRE · …» se manca qualcosa) e dirlo nella nota di Bacheca.
- «3 Risorse / Decisioni» (id 1LB1cGhrzRgfz3g_y4DAw-lzjg8J7A7mz): ogni decisione
  nuova di Giorgia = un documento «AAAA-MM-GG · Decisione · titolo» (cosa,
  perché, cosa cambia). Riepilogo fino al 13/11 già lì.
- Ogni file nuovo di Giocamizi va nel cassetto giusto, mai nella radice; una
  cartella nuova = una riga nel LEGGIMI successivo; progetto finito → 4 Archivio;
  mai cancellare. Il resto del Drive di Giorgia non si tocca.

- Bacheca (12/11/2026, docs/bacheca.md): Claude e ChatGPT lavorano in
  continuità su Drive. Ogni routine legge le note degli ultimi 2 giorni in
  «0 Bacheca» (id 1wY3hFuwkjp-BwlD8jEsDF-AllPG4XXtG) e ne lascia una nuova
  («AAAA-MM-GG HH:MM · Claude · cosa»: Fatto / Per chi viene dopo / Problemi).
  Giro: 9:00 Claude prenota la foto di DOMANI (`npm run articoli:piano -- domani`)
  e carica il «Prompt del giorno»; 9:30 ChatGPT (attività programmata, testo in
  docs/chatgpt-attivita.md) genera le foto in «99 Immagini pronte»; 21:00 Claude
  le importa (l'API OpenAI è solo la riserva). Questo sostituisce il vecchio
  giro «prompt alle 21:00, ChatGPT alle 6:00».

## Ambiente di lavoro (sessioni Claude)
- Playwright: Chromium in `/opt/pw-browsers/chromium` (collegamento alla
  versione installata; o env CHROMIUM); `playwright-core` è nelle devDependencies.
- `npm run verifica` avvia da solo `next start -p 3100` se serve
  (richiede una build fresca). Un `next-server` rimasto acceso da prima
  tiene la porta e fa testare la build VECCHIA: trovalo con
  `ps -eo pid,args | grep next-server` (lsof qui non lo vede) e uccidilo.
- Trappola nota: un `<svg>` annidato senza width/height vale "100%" del
  riquadro esterno e sfonda il layout — `Disegno` ha il prop `lato` apposta.
- Trappola nota: commenti JSX mai prima dell'elemento radice di un return.

## Articoli approfonditi e voce di Giorgia (7/11/2026)
- Voce: `.claude/skills/giorgia-authentic-voice/SKILL.md` (testo originale di
  Giorgia, non modificarlo). Va letta PRIMA di scrivere qualsiasi testo a suo
  nome. Domiziana = Domi o Dodò; **Mizi è solo la pinguina**. Mai esperienze,
  dialoghi o test inventati: senza materiale suo si scrive senza vissuto.
- Articoli lunghi: `content/guide/<slug>.md` → `npm run articoli:compila` →
  `lib/contenuti/approfondimenti.json` (solo `stato: pubblicata`) → entrano in GUIDE di
  lib/contenuti/guide.ts (stesso slug di una guida breve = la sostituisce). Pagina:
  `components/guide/Approfondimento.tsx`; stili `.articolo` in globals.css.
- Piano dei 100 articoli: `content/piano-editoriale.json`, uno al giorno
  (ribilanciato il 14/11/2026: meno schermi, più feste, territorio, stagione e
  famiglia; categorie nuove feste-compleanni, fuori-casa, stagionali)
  (`npm run articoli:piano -- prossimo | stato | segna`). Cancello prima di
  pubblicare: `npm run articoli:controlla -- <slug> --rete` (≥27.000 caratteri,
  fonti, prezzi datati, immagini autorizzate, autenticità): se fallisce, resta bozza.
- Procedura completa del job quotidiano (9:00): `docs/routine-articoli.md`.
- Registro del prodotto (14/11/2026, docs/registro-prodotto.md): tutto ciò che
  si produce va tracciato nel Foglio «Piano editoriale Giocamizi · <data>» su
  Drive (1 Progetti / 100 articoli approfonditi), scheda «Prodotto»; la prima
  scheda ha il prompt per fare il piano successivo. Si ricostruisce dal repo con
  `npm run registro -- <cartella>` (dai commit: messaggi chiari in italiano) e
  si ricarica ogni sera alle 21:00 e dopo ogni pubblicazione importante; il
  file vecchio prende «zz_SUPERATO — ».

## Co-work quotidiano (Routine delle 7:00 italiane)
Un miglioramento al giorno, piccolo e finito, a rotazione:
(a) biglietti · (b) guide: migliorare una guida breve esistente (le guide
NUOVE le scrive solo la routine articoli delle 9:00, mai questa) · (c) giochi ·
(d) SEO/AEO tecnico. Non toccare content/guide/ né content/piano-editoriale.json.
Prima di iniziare importa le foto arrivate in «99 Immagini pronte»; se il
contenuto di domani avrà bisogno di foto, prenotale oggi (`npm run foto:prenota`).
Prima leggi le note recenti in «0 Bacheca» e le richieste aperte in
«0 Richieste di Giorgia»: una richiesta aperta viene PRIMA della rotazione
(se è piccola si fa e basta; se è grande, se ne fa un pezzo e lo si dice).
ATTIVITÀ NUOVE OGNI GIORNO (Giorgia, 23/11/2026: «ho bisogno di aggiungere
più attività ogni giorno»): almeno 8 schede nuove al giorno, sempre vere e
verificate. Prima le città nuove (fino a 3, con 2 locali solidi ciascuna); poi,
per arrivare a 8, attività nuove nelle città GIÀ aperte, partendo dalle più
grandi con meno schede e dalle categorie della directory (fattorie didattiche,
teatro, corsi, parchi): lì i locali solidi abbondano. Stesse regole di sempre
(sito ufficiale, segnali recenti, mai inventare, nome cercato nel file prima
di aggiungerlo). Se in un giorno non si arriva a 8, si scrive perché.
CONTATTI E MAIL DI OGNI ATTIVITÀ: vedi la sezione «Registro contatti
attività» qui sotto. Si fa nello stesso giro, per ogni scheda nuova.
Il lunedì controlla anche che i quattro documenti base di 3 Risorse siano
ancora veri: se no, versione nuova con la data. Alla fine lascia una nota
(«AAAA-MM-GG 07:00 · Claude · Miglioramento», docs/bacheca.md).
Report breve (≤5 righe) salvo novità da mostrare. Diario della rotazione:
guardare gli ultimi commit (`git log --oneline -10`) per non ripetersi.

## Registro contatti attività (23/11/2026, richiesta di Giorgia)
- Ogni attività del sito ha una riga nel foglio PRIVATO su Drive «Registro
  contatti attività Giocamizi (AAAA-MM-GG)» in 1 Progetti (il più recente: i
  vecchi vanno in 4 Archivio con «zz_SUPERATO»). Colonne: link della scheda,
  sito, email, telefono, fonte, e la mail già scritta (oggetto e testo) con il
  link della scheda, la pagina /come-reclamare-la-scheda e il video
  /tutorial/come-reclamare-la-scheda. Stato: «Pronta da inviare», «Contatto da
  trovare», «Senza email: chiamare…»; Giorgia scrive «Inviata» e la data.
- Email e telefoni stanno SOLO in quel foglio, MAI nel repo né in Bacheca.
  Si prendono dal sito ufficiale (o dalla pagina social ufficiale) con
  WebSearch limitato al dominio; mai indovinati. Fonte scritta in colonna.
- Giro di ogni giorno: (1) scarica il registro più recente come CSV
  (download_file_content, exportMimeType text/csv); (2) scrivi in un file
  dello scratchpad i contatti trovati oggi, come JSON
  `[{link, sito, email, telefono, fonte_email, fonte_telefono, nota}]` (link =
  indirizzo pieno della scheda): tutte le schede nuove di oggi e almeno 20
  righe «Contatto da trovare» dell'arretrato; (3) `npx tsx
  scripts/registro-contatti.ts --registro <csv> --contatti <json> --uscita
  <csv nuovo>`: tiene le righe e le correzioni di Giorgia, aggiunge le schede
  nuove del sito con la mail pronta, riempie solo le celle vuote; (4) carica il
  CSV come foglio nuovo con la data di oggi in 1 Progetti e sposta il
  precedente in 4 Archivio rinominandolo «zz_SUPERATO — …».
- Schede arricchite (23/11/2026): 170 descrizioni riscritte dai siti ufficiali
  (età, spazi, cosa include la festa), siti aggiunti o corretti; prezzi solo con
  l'anno; personaggi protetti scritti come «feste a tema». La rete
  dell'ambiente «Giocamizi» è aperta a tutti i siti pubblici (23/11, approvata
  da Giorgia) per leggere i siti dei locali.
- Le ricerche web sono circa 200 per turno, condivise anche dagli aiutanti:
  non lanciare più di 3-4 aiutanti di ricerca insieme.
- Dal 23/11/2026 (Giorgia: «quelle mail sono tutte sbagliate») anche le 80
  realtà dell'archivio ex Gmail (righe GM-: cooperative, scuole, blog,
  riviste) stanno nello stesso registro e partono da Zoho: le 80 bozze Gmail
  vecchie non si spediscono. Il testo lo fa lo strumento (`--realta` con il
  JSON tratto dal foglio «archivio-contatti-giocamizi-influencee», una volta
  sola: poi le righe restano nel registro e si portano avanti da sole).
- Invio (decisione di Giorgia del 23/11/2026, che sostituisce «le mail non si
  spediscono mai»): le spedisce Claude dal connettore Zoho, da
  giorgia@influencee.it con ciao@giocamizi.it in copia, con il testo del
  registro, al massimo 40 al giorno, solo righe «Pronta da inviare» con email
  presa da fonte ufficiale. Dopo ogni invio, nel registro: Stato «Inviata» e
  Data invio. Mai a un'attività segnata «da controllare» (sito fermo da anni,
  forse chiusa, nome che non corrisponde). Prima del primo invio Giorgia ha
  visto due mail di prova arrivate a ciao@giocamizi.it.
  Le 81 bozze Zoho del 31/10 hanno il testo vecchio, senza video: non vanno
  spedite; si cancellano solo con il sì di Giorgia.

## Video di Mizi (15/11/2026, docs/video-tutorial.md)
- Nei video parla SEMPRE Mizi, in prima persona: pinguina-bambina di ~10 anni,
  voce «sage» di OpenAI scelta da Giorgia, tutto il testo in UNA registrazione
  (scripts/video/voce.py). Scene animate con le schermate vere del sito, musica
  originale scritta col codice, sottotitoli; sempre 16:9 (sito) e 9:16 (social).
- Ogni video finito si carica su Drive in 2 Aree → «Giocamizi · Video»
  (id 1vcpiq2FvnCB4-6zasNgovGeC6MG3_KqQ): «16x9 · Tutorial per partner»,
  «16x9 · Tutorial per utenti», «9x16 · Reel e storie», «99 Voce di Mizi»
  (campione ufficiale). Cosa fare dopo: «01 Catalogo dei video» (crearne la
  versione nuova con la data quando cambia). Chiave OpenAI: segreto
  dell'ambiente cloud «Giocamizi», il proxy la mette da solo.
- Un video = una scheda `content/video/<slug>.json` (scene, frasi di Mizi,
  testi della pagina) + `npm run video -- <slug>` (dopo `npm run build`): fa
  schermate, voce, fotogrammi 16:9 e 9:16 a 25 fps, montaggio, finale viola,
  file in public/video/ e pagina del tutorial (registra.py → lib/contenuti/tutorial-dati.json,
  generato: non si scrive a mano). Pagine: /tutorial e /tutorial/<slug> (video
  nostro incorporato, passi cliccabili, ?t=, trascrizione, VideoObject con i
  Clip, video in sitemap). Gruppi «partner» e «utenti» come su Drive;
  IN_ARRIVO in lib/contenuti/tutorial.ts = solo testo nell'hub. 12 tutorial fatti il 16/11.

## Giochi: upgrade uno alla volta, voce registrata, album di Mizi (15/11/2026)
- Metodo e coda in `.claude/skills/game-designer-mizi/SKILL.md` (da leggere prima
  di toccare un gioco). Fatto: memory-animali (3 livelli, aiuto, suoni).
- Voce: `parla()` in lib/giochi/audio.ts suona il file registrato se la frase è in
  lib/giochi/voce-registrata.json (generato), altrimenti la sintesi del telefono.
  Copione in content/voce-mizi.json; `npm run voce` registra con OpenAI (voce da
  bambina; serve il segreto di rete api.openai.com nell'ambiente della sessione).
  `{ accoda: true }` = non tagliare la frase in corso. Suoni: lib/giochi/suoni.ts.
- Album di Mizi: lib/giochi/album.ts (localStorage «giocamizi-album», in lib/contenuti/legal.ts).
  Figurina per ogni gioco finito, coccarda per 3 giochi diversi in un giorno,
  «Prossimo gioco» nella festa del guscio (components/game-shell). Pagina
  /giochi/album (noindex), fascia e stelle nel catalogo. Mai serie, punti che
  scadono, classifiche.
- La festa si riconosce da `[data-festa]` (non più dal testo «Bravissimo!»).
- Giochi di esplorazione (17/11/2026): motore `games/_engine/Esplora.tsx` con
  logica pura in `esplora-logica.ts`. Primo gioco «Il labirinto dei tesori»
  (games/labirinto-dei-tesori, 5-9 anni, 39º gioco): mappa dall'alto, si tocca
  una casella e Mizi ci va, una missione per sala apre la porta. Un gioco nuovo
  di questo tipo è un elenco di sale. Niente nemici, tempo o vite. Lo stile dei
  disegni sta in fondo a Esplora.tsx (`STILE`).
- Giochi che si muovono (20/11/2026): motore `games/_engine/Corsa.tsx` con logica
  pura in `corsa-logica.ts`. Primo gioco «La corsa nella piramide»
  (games/corsa-nella-piramide, 6-10 anni, 40º gioco): corridoio a tre strade,
  si scorre per cambiare strada e si tocca per saltare, cinque piani. Niente
  vite, tempo o velocità che cresce: un urto fa ripartire piano, al terzo la
  strada libera si illumina. Un gioco nuovo di questo tipo è un elenco di
  tratti. Metodo in `.claude/skills/accademia-giochi/SKILL.md`.
- Voce registrata (22/11/2026): tutto il copione, 113 frasi su 113 (comuni,
  nucleo, memory, differenze, labirinto, corsa), riascoltate con whisper-1.
  Gli altri giochi usano ancora la sintesi per le istruzioni: prima vanno
  scritte nel copione. Motore SceltaMultipla rivisto per il movimento
  (opzioni che entrano, saltello, dondolio; stili in app/globals.css).
  Grafica (22/11/2026): nel guscio parla il viso vero di Mizi
  (public/mizi/mizi-faccia.webp), macchie pastello dietro al gioco, bottoni
  con spessore, figure con ombra. Con tutta la voce nel copione: abbina i
  colori, trova la forma, conta fino a 10 (campo `lode` dei round: Mizi dice
  la cosa toccata). Figure ridisegnate col volume in games/_engine/arte.tsx
  (colore + ombra + riflesso): forme, secchiello, pesce, palla, mela, fiore,
  macchina; `tinta` di Disegno cambia il colore principale di una figura.
- Giochi dei compiti di seconda elementare (22/11/2026, 51 giochi in tutto):
  i-suoni-difficili, mb-o-mp, maggiore-minore-uguale, numeri-in-ordine,
  causa-ed-effetto, le-parti-della-pianta, le-foglie; matematica senza
  disegni: problemi-con-mizi, decine-e-unita, il-numero-prima-e-dopo,
  piu-e-meno (risposte e limiti per età in games/_engine/numeri.ts: 20 a sei
  anni, 60 a sette, 100 dagli otto). Competenza nuova «scienze». Nascono dagli ARGOMENTI che Giorgia manda (registro di classe,
  pagine del libro): gli esercizi e i disegni si rifanno da zero, MAI copiati
  dal libro, e niente del registro (nomi, classe, scuola) entra nel repo.
  Disegni: `public/figure/<nome>.webp` con `Figura` (games/_engine/figura.tsx)
  e il campo `immagine` delle opzioni; fatti con l'API immagini di OpenAI
  (gpt-image-2, un soggetto, sfondo bianco, nessuna scritta, nessun
  personaggio protetto), guardati uno per uno: regole in public/figure/LICENZA.txt.
- Giochi senza connessione (22/11/2026): il bottone «Scarica i giochi»
  (components/app/GiochiSenzaRete.tsx, in fondo a /giochi e nel Profilo) mette
  sul telefono tutti i giochi con voce e disegni; logica in lib/giochi/offline.ts,
  elenco scritto dalla build (scripts/offline-elenco.mjs → public/offline-elenco.json,
  generato, fuori dal repo), servito da public/sw.js. Niente si scarica da solo:
  senza quel tocco il service worker lascia passare tutto. Senza rete la pagina
  del gioco arriva salvata con l'età minima e Giocatore.tsx rilegge «?eta=».
- «Gli ultimi arrivati» (21/11/2026): `giochiRecenti()` in lib/giochi/novita.ts
  ordina i giochi vivi per ultima modifica vera (lib/seo/date-pagine.json). Un
  gioco nuovo o appena migliorato sale da solo in cima al catalogo /giochi
  (quattro giochi, finché non si sceglie un filtro) e in home (due sul
  telefono in HomeApp, quattro dal tablet in su). Niente elenchi a mano: i
  «consigliati per cominciare» restano quelli di IN_VETRINA.
- Nucleo comune dei giochi (16/11/2026): `games/_engine/nucleo.ts` (`useRound`:
  round, blocco del doppio tocco, punto ai round puliti, aiuto dopo N errori,
  suoni, lodi senza genere, attributi `data-partita`/`data-round`, esito con
  errori, aiuti e secondi). Lo usa SceltaMultipla (20 giochi); gli altri motori
  ci passano quando si migliorano. Logica pura dei motori in file senza React
  (`griglia-logica.ts`). La batteria gioca da sola TUTTI i giochi del registro
  fino alla festa: un gioco che non finisce fa fallire la verifica.
- L'invito alle novità dopo il secondo gioco (components/form/DopoIlGioco.tsx)
  ora è sopra lo schermo di gioco: prima era nascosto sotto.

## Filtri dei listing della directory (15/11/2026)
- components/directory/ListingFiltrato.tsx: barra con «Filtri» (apre un foglio
  dal basso con tutti i gruppi, pillole grandi e «Mostra N posti»), «Mappa» e
  i filtri più usati come pillole rapide. Niente più tendine con caselline:
  su telefono si aprivano sotto il bordo dello schermo.
- RicercaCosaDove `compatta`: nei risultati, su telefono, è una riga sola.
- Routine «Giocamizi · Due giochi al giorno» (11:23, sessione nuova, ambiente
  «Giocamizi»): segue la coda della skill game-designer-mizi. Voce «sage».
- Proposta dei tipi di attività nuovi: Drive, 1 Progetti, «Mappa dei tipi di
  attività da inserire» (da decidere con Giorgia, niente è stato creato).

## Foto servite dai nostri file, senza /_next/image (15/11/2026)
- `<Image>` usa il caricatore lib/foto/caricatore-immagini.ts (next.config.ts,
  loader «custom»): per `/immagini/<nome>-<L>.webp` sceglie tra le larghezze
  che esistono davvero (lib/foto/immagini-varianti.json, rigenerato dal «prebuild»);
  il resto (logo, ritratti) si serve com'è. Motivo: su iPhone le foto passate
  dal servizio di Vercel non si vedevano, anche se dal server uscivano giuste.
- Una foto nuova deve avere le sue varianti in public/immagini (le fa
  `npm run foto-arrivate`): niente più ridimensionamento al volo.

## Canzoni di Mizi (14/11/2026)
- Su Drive: 2 Aree → Giocamizi · Social → «Canzoni di Mizi» (id
  1VnaChhQWdr6zhvQZom9cMat9jmIiRvDv): guida «00 Come funzionano le canzoni di
  Mizi», schede in «01 Schede canzoni», file finiti in «99 Canzoni pronte».
- Una canzone a settimana insieme al post della settimana, SOLO se c'è il file
  `canzone-NN-slug.mp4`; se manca, slitta. Testi e melodie originali (mai copiare
  canzoni esistenti, mai nomi di artisti nei prompt); niente Domiziana nei video.
  Musica con Suno (piano a pagamento), video con CapCut: li fa Giorgia o la sua
  automazione. Claude scrive le schede nuove quando le 10 finiscono.
  Elenco e stati in `content/canzoni-mizi.json` (scheda-pronta → pubblicata).

## Il Natale di Mizi (/natale, 14/11/2026)
- Lo porta avanti SOLO la chat del co-work quotidiano (Decisione su Drive del
  14/11): le altre chat non toccano /natale, components/natale, lib/natale/natale.ts,
  lib/natale/natale-esporta.ts, lib/natale/eventi-natale.ts; scrivono in «0 Richieste».
- Letterina: /natale/letterina-babbo-natale (lib/natale/natale.ts + components/natale/).
  Sette carte (motivi natale, natale-neve/regali/dolci/renne in motivi.tsx,
  più stelle-luna e animali-foresta), PDF A4 scritto a mano (lib/natale/natale-esporta.ts),
  stampa, condivisione, busta da colorare (FoglioBusta), risposta di Babbo
  Natale dal 20/12. Gli esempi «come scrivere» stanno nella pagina stessa
  (#come-si-scrive): niente pagina doppia. Riquadro in home e voce «Natale»
  nel menu solo in stagione (inStagioneNatale, 1/11–15/1).
- I link a /natale hanno prefetch={false}: la pagina è ISR e sul server di
  prova il precaricamento resta appeso e blocca networkidle nelle batterie.

## Studio UX degli strumenti (14/11/2026, Drive 1 Progetti)
- Messaggio «Fatto!» comune: `annuncia(testo, festa)` + <MessaggioEsito />
  (components/ui/Esito.tsx), fisso in basso con i coriandoli.
- Bottoni d'azione con testo bianco: bg-rosa-forte / bg-viola-forte /
  bg-verde-forte (contrasto ≥ 4,5:1), non le tinte chiare del brand.
- Bersagli da toccare almeno 56 px (min-h-14) negli strumenti per bambini.
- Fatto tutto l'ordine dello studio: letterina a passi con Mizi e voce;
  desideri a figura (DESIDERI_FIGURA in lib/natale/natale.ts); invito a passi
  (Editor `parte="biglietto"`, 7 passi, 8 sfondi in vista + «Vedi tutti»,
  «Vedi tutto in una pagina») e kit della festa su /biglietti/kit-festa
  (Editor `parte="kit"`, arriva col biglietto in ?b=, senza foto né nomi
  degli invitati). Le prove sull'invito toccano prima [data-vedi-tutto].

## Instagram (8/11/2026, docs/instagram.md)
- Post del giorno da `lib/social/post.ts` (carosello da articolo, foto di una
  guida, gioco): solo testi già sul sito. Slide disegnate da
  `lib/social/disegna.tsx` (JPEG 1080×1350, Nunito in lib/social/caratteri).
  La parte social è SOLO admin: anteprime dietro il codice
  (`/admin/[codice]/social/anteprima/...`), `/social/<id>/<n>.jpg` risponde solo
  con la firma HMAC del token Instagram (il prelievo di Meta), altrimenti 404.
- Pubblicazione SOLO dal tocco di Giorgia in `/admin/[codice]/social`
  (`lib/social/instagram.ts`, API Meta). Chiavi `INSTAGRAM_USER_ID` e
  `INSTAGRAM_ACCESS_TOKEN` solo su Vercel; il token scade ogni 60 giorni.

## Pannello e immagini (2/11/2026)
- Piano completo: `docs/piano-backoffice.md` (fasi A-D). Il pannello vive
  sotto `/admin/[codice]` (menu in `MenuAdmin.tsx`); il codice si controlla
  con `adminValido()` in lib/directory/admin.ts. Nelle verifiche vale il codice di
  prova `CODICE_ADMIN_PROVA` (scripts/verifica/comune.mjs), mai su Vercel.
- Ottimizzatore immagini: `/admin/[codice]/immagini` (pannello) e
  `npm run immagini -- <file> --codice H-03` (riga di comando, scrive in
  public/immagini/). Stessa logica in lib/foto/immagini/ottimizza.ts: WebP alla
  qualità più bassa con PSNR ≥ 38 dB, varianti 1440…480, niente metadati.
- Contatori delle schede (fase B): `Contatore.tsx` sulla scheda manda
  vista + clic sugli elementi `data-traccia` a `/api/eventi` → funzione SQL
  `dir_conta` (supabase/backoffice.sql). Solo conteggi per giorno, niente
  cookie né IP. Un contatto nuovo sulla scheda = un `data-traccia`.
- Pannello (fase C): Schede (filtro per categoria/città, dettaglio con
  grafico, ricerche Google da lib/seo/gsc.ts), Iscritti (Brevo), Mappa
  (posizioni con OpenStreetMap Nominatim, dal server), Immagini.
- Directory stile Booking: `lib/directory/esperienze.ts` (filtri: SOLO ciò che è
  scritto nella scheda, il resto va «da chiedere») e `lib/directory/etichette.ts`
  (etichette colorate per tipo). Mappa: `components/mappa/MappaLocali.tsx`
  (Leaflet + tile OSM, caricata solo al tocco; CSP img-src
  tile.openstreetmap.org), centri città in `lib/directory/coordinate-citta.ts`: una
  città nuova in lib/directory/feste.ts = una riga lì (la batteria admin controlla).

## Template vetrina (31/10/2026)
- Stile dal riferimento di Giorgia: header bianco arrotondato che galleggia,
  hero a foto piena, card pastello con foto incassata, carte impilate,
  collage, fascia finale blu notte con cerchi. Mattoni in `components/vetrina/`
  (TestataPagina per le pagine interne, PaginaHub per i markdown di content/hubs).
- Foto: registro in `lib/foto/foto.ts` (codici H/G/F/P/S/I, gli stessi del doc
  "00 PROMPT UNICO · Foto sito Giocamizi" su Drive). I WebP vanno in
  `public/immagini/<file>-<larghezza>.webp`; finché mancano si vede Mizi
  su fondo pastello. Brand: "Giocamizi" (tagline Gioca con Mizi).

## In attesa (cose ferme lato Giorgia)
- Immagini AI di Mizi per gli 11 slot in `public/mizi/` (lib/foto/immagini.ts)
  (la foto vera di Giorgia e Domiziana è in public/immagini/, fatta il 2/11).
- Vercel Web Analytics da attivare nel pannello (il codice c'è già:
  conteggio visite senza cookie, sempre attivo; GA resta solo su consenso).
- `GSC_SERVICE_ACCOUNT` su Vercel per le ricerche Google nel pannello
  (supabase/backoffice.sql è stato incollato l'8/11/2026).
- Email «la tua scheda è online / tolta» non ancora provata dal vivo (parte
  quando Giorgia accetta una risposta): controllarla al primo reclamo vero.
  Brevo è collegato (vedi «Email di servizio» sopra); dominio giocamizi.it
  collegato (24/10/2026) (poi: next.config vecchiHost, redirect Supabase,
  etichetta stream GA).
