# Gioca con Mizi — canone del progetto

Sito italiano di giochi educativi gratuiti per bambini 3–12 anni, live su
https://giocaconmizi.vercel.app (dominio futuro: giocaconmizi.com).
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
- `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts` — AEO/SEO:
  generati dai registri. JSON-LD in `components/seo/JsonLd.tsx`.
- SEO/AEO: ogni contenuto nuovo deve avere risposta citabile, FAQ con
  JSON-LD e link interni ai giochi pertinenti.

## Ambiente di lavoro (sessioni Claude)
- Playwright: Chromium in `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  (o env CHROMIUM); `playwright-core` è nelle devDependencies.
- `npm run verifica` avvia da solo `next start -p 3100` se serve
  (richiede una build fresca).
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
- BREVO_API_KEY nelle env Vercel; email ciao@giocaconmizi.com da attivare
  o cambiare in lib/legal.ts; dominio giocaconmizi.com da collegare
  (poi: next.config vecchiHost, redirect Supabase, etichetta stream GA).
