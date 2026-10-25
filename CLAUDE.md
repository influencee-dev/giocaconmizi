# Gioca con Mizi — canone del progetto

Sito italiano di giochi educativi gratuiti per bambini 3–12 anni, live su
https://giocamizi.it (collegato su Vercel il 24/10/2026; giocaconmizi.vercel.app fa redirect).
Progetto personale senza scopo di lucro di Giorgia Palazzo, nato per la
figlia Domiziana. Mascotte: Mizi, una pinguina.

## Regole assolute
- Tutto in italiano: codice (nomi, commenti), contenuti, commit.
- MAI personaggi protetti da copyright (Peppa Pig, Disney, Paw Patrol…),
  nemmeno "presi dal web": solo arte originale o librerie con licenza
  verificata (vedi public/icone/LICENZA.txt).
- Niente pubblicità, timer, dark pattern; dati dei bambini al minimo
  (vedi lib/legal.ts: un tracciamento nuovo = una voce nel registro).
- Prima di OGNI push, verifica TRE volte (regola di Giorgia):
  1. `npm run typecheck && npm run lint && npm run build`
  2. `npm run verifica` (batterie Playwright da mobile, scripts/verifica/)
  3. gli sbordi sono inclusi nella batteria; se tocchi pagine nuove,
     aggiungile a scripts/verifica/sbordi.mjs PRIMA di verificare.
     La batteria seo.mjs controlla dominio unico (giocamizi.it) su robots,
     sitemap, canonical, og:url e JSON-LD, e che ogni URL della sitemap
     risponda 200 col canonical su sé stesso: se cambia il dominio,
     aggiornalo lì insieme a lib/seo.ts.
- Push su `main` → deploy automatico Vercel. Controlla che arrivi READY
  (progetto prj_O3AzIDL7AdXBzBW5Ui4fN4i44PJo, team team_rd3X8YlvlxgVMoQxo1AUXJB6).
  Se il deploy è READY sul commit appena pushato e le verifiche locali sono
  passate, non serve scaricare le pagine live.

## Architettura (tutto data-driven: un dato nuovo aggiorna sitemap e llms.txt da solo)
- `games/registry.ts` — i giochi; componenti in `games/<slug>/Game.tsx`,
  motore condiviso in `games/_engine/`, testi in `content/games/*.md`.
- `lib/guide.ts` — le guide per i genitori (/guide): risposta breve
  citabile dalle AI + sezioni + FAQ + giochi collegati.
- `cards/registry.ts` + `components/biglietti/` — il creatore di biglietti:
  temi (motivi SVG in motivi.tsx), adesivi (stickers.tsx), QR RSVP,
  foto solo nel PNG mai nei link (lib/condivisione.ts).
- `components/icone.tsx` — libreria icone (Fluent Emoji MIT, public/icone/).
- `lib/feste.ts` — pagine locali /feste/[città] (SEO/GEO/AEO): 3 città nuove
  al giorno, SOLO locali reali trovati con la ricerca web, link nofollow ai
  siti ufficiali verificati, reel Instagram solo con URL vero (carica al
  tocco: niente cookie di terzi senza gesto). Ordine: città per popolazione.
- `lib/directory.ts` — la directory /[categoria]/[città]/[attività]
  (docs/piano-directory.md): le schede nascono dai locali di lib/feste.ts,
  smistati per `tipo` nelle categorie; listing città solo con ≥2 schede.
  MAI foto prese dai siti o dai social dei locali: solo illustrazioni
  nostre finché l'attività non carica le sue. Email e telefoni dei locali
  NON vanno nel repo (è pubblico): stanno nel foglio privato di Giorgia.
- Area attività (fase 1): `/la-tua-scheda/[codice]` (link personale: il
  locale approva, modifica o chiede di togliere la scheda) e
  `/admin/[codice]` (Giorgia decide). Database in `supabase/directory.sql`,
  incollato a mano da Giorgia nel SQL Editor: il sito usa solo la chiave
  pubblica e funzioni RPC; nel DB solo impronte SHA-256 dei codici. I
  codici veri non vanno MAI nel repo. Le pagine pubbliche leggono le
  risposte accettate con `pubblicate()` (lib/directory-db.ts) e si
  rigenerano ogni 10 minuti o subito dopo una decisione.
- `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts` — AEO/SEO:
  generati dai registri. JSON-LD in `components/seo/JsonLd.tsx`.
- SEO/AEO: ogni contenuto nuovo deve avere risposta citabile, FAQ con
  JSON-LD e link interni ai giochi pertinenti.

## Ambiente di lavoro (sessioni Claude)
- Playwright: Chromium in `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  (o env CHROMIUM); `playwright-core` è nelle devDependencies.
- `npm run verifica` avvia da solo `next start -p 3100` se serve
  (richiede una build fresca). Un `next-server` rimasto acceso da prima
  tiene la porta e fa testare la build VECCHIA: trovalo con
  `ps -eo pid,args | grep next-server` (lsof qui non lo vede) e uccidilo.
- Trappola nota: un `<svg>` annidato senza width/height vale "100%" del
  riquadro esterno e sfonda il layout — `Disegno` ha il prop `lato` apposta.
- Trappola nota: commenti JSX mai prima dell'elemento radice di un return.

## Co-work quotidiano (Routine delle 7:00 italiane)
Un miglioramento al giorno, piccolo e finito, a rotazione:
(a) biglietti · (b) guida nuova · (c) giochi · (d) SEO/AEO tecnico.
Report breve (≤5 righe) salvo novità da mostrare. Diario della rotazione:
guardare gli ultimi commit (`git log --oneline -10`) per non ripetersi.

## In attesa (cose ferme lato Giorgia)
- Immagini AI di Mizi per gli 11 slot in `public/mizi/` (lib/immagini.ts)
  e foto per Chi siamo (`public/foto-giorgia-domiziana.jpg`).
- BREVO_API_KEY nelle env Vercel; email ciao@giocamizi.it da attivare
  in lib/legal.ts; dominio giocamizi.it collegato (24/10/2026)
  (poi: next.config vecchiHost, redirect Supabase, etichetta stream GA).
