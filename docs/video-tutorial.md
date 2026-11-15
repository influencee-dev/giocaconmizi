# Video tutorial (15/11/2026)

Il primo: «Come reclamare la scheda», in `/come-reclamare-la-scheda`
(`VIDEO_RECLAMO` in lib/reclamo.ts, file in `public/video/`). Scene animate in
HTML con le schermate vere del sito, voce italiana con l'API di OpenAI, musica
originale scritta col codice, sottotitoli WebVTT bruciati nel video e in traccia.

## Come si rifà (o se ne fa uno nuovo, es. per gli eventi)

Tutto in una cartella di lavoro fuori dal repo (lo scratchpad), con gli script
di `scripts/video/` copiati dentro, più `asset/` (nunito-*.ttf da
lib/social/caratteri, mizi-intera.webp e il logo da public/mizi, le icone da
public/icone usate nelle scene).

1. **Testi**: `testi.json`, una frase per scena (per la pronuncia scrivere
   «giocamizi punto it»: nei sottotitoli diventa giocamizi.it).
2. **Voce di Mizi**: `python3 voce.py` → `voce/<n>.wav`. Parla SEMPRE Mizi,
   pinguina-bambina di ~10 anni, in prima persona (decisione di Giorgia del
   15/11/2026: voce «sage» di gpt-4o-mini-tts, istruzioni fisse in voce.py).
   Tutto il testo in UNA chiamata (la voce resta uguale), poi whisper-1 dà i
   tempi delle parole e lo script taglia frase per frase: controllare che le
   durate stampate siano sensate (una frase di 1 secondo = taglio sbagliato). La chiave è un segreto
   dell'ambiente cloud «Giocamizi» (la mette il proxy: header
   `Authorization: Bearer proxy-injected`), mai nel repo né in chat.
3. **Schermate**: build fresca, server di prova con `GIOCAMIZI_ADMIN_PROVA`
   (vedi scripts/verifica/comune.mjs), poi `node schermi.mjs` → `schermi/*.png`
   e `box.json` (dove stanno bottoni e campi, per i cerchi). Nasconde le barre
   fisse e il banner dei cookie del NOSTRO sito; il modulo si riempie con dati finti.
4. **Scene**: `python3 prepara.py` → `video-pronto.html` (aprirlo nel browser,
   con `#verticale` per il 9:16, e chiamare `render(t)` per guardare un
   istante), poi `node rendi.mjs` → `fotogrammi/` (1920×1080) e
   `node rendi.mjs v` → `fotogrammi-v/` (1080×1920, per Reel e storie: testi e
   sottotitoli stanno in alto, fuori dalla fascia dei bottoni di Instagram).
   30 al secondo, ~25 minuti ciascuno (si possono lanciare insieme).
5. **Audio**: `python3 musica.py <durata in secondi>` (marimba + basso + sonaglio, accordi
   Do-La-Fa-Sol: tutto originale) e `python3 audio.py` → `audio.wav` (voce al
   suo posto, musica che si abbassa quando si parla, volume normalizzato) e
   `sottotitoli.vtt`.
6. **Montaggio**: ffmpeg, H.264 + AAC, `-movflags +faststart`, CRF ~24
   (il file deve restare sotto i 10 MB); poster = un fotogramma in WebP.
8. **Second brain**: ogni video finito (16:9 e 9:16) si carica su Drive in
   2 Aree → Giocamizi · Video (cartelle «16x9 · Tutorial per partner»,
   «16x9 · Tutorial per utenti», «9x16 · Reel e storie»), nome
   «AAAA-MM-GG · titolo · 16x9.mp4», e si aggiorna «01 Catalogo dei video».
7. Sul sito va solo l'orizzontale: file in `public/video/`, una voce in
   `TUTORIAL` di lib/tutorial.ts (testo, capitoli = inizi delle scene, FAQ) →
   pagina /tutorial/<slug> da sola. Togliere il titolo da IN_ARRIVO.
   Poi, se serve,: copiare mp4, vtt e poster in `public/video/`. Il verticale va su Drive (2 Aree → Giocamizi · Social) per Instagram, aggiornare durata e testo in
   lib/reclamo.ts, verifiche di sempre.

Regole: niente schermate di siti di altri, niente volti veri, niente musica
o voci prese dal web. Mizi compare come illustrazione nostra.
