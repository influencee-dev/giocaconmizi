# Checklist di design per ogni gioco (Gioca con Mizi)

Basata su LEGO Foundation (apprendimento giocoso: gioioso, significativo, attivo, iterativo, sociale), Starfall (niente fretta), Montessori (autocorrezione).

## Prima di costruire
- [ ] Una sola competenza per gioco (es. "conta fino a 10", non "numeri")
- [ ] Fascia d'età dichiarata (ageMin/ageMax) e difficoltà 1–3
- [ ] Meccanica spiegabile in una frase a un bambino di 3 anni
- [ ] Funziona con un solo dito, in verticale, su schermo da 360px

## Regole non negoziabili
- [ ] NIENTE timer, NIENTE countdown, NIENTE "game over"
- [ ] Errore = feedback gentile + riprova, mai punizione, mai suono negativo
- [ ] Istruzione vocale all'inizio (Web Speech it-IT) + icona ripeti
- [ ] Tap target ≥ 64px, spaziatura ≥ 16px tra elementi toccabili
- [ ] Una sola azione per schermo; niente menu durante il gioco
- [ ] 5–8 round, difficoltà crescente, poi festa finale con mizi-festa.png + coriandoli
- [ ] Bottone "Ancora" sempre visibile a fine gioco; "Esci" piccolo in alto a sinistra
- [ ] Nessuna immagine esterna: SVG inline o asset in /public
- [ ] Nessun testo da leggere per i giochi 3–5 anni (solo icone + voce)
- [ ] Modalità `?demo=1`: gioca da sola per 12s (per i reel)
- [ ] onProgress(round, total) e onComplete({score, stars}) chiamati correttamente

## Contenuto SEO (content/games/{slug}.md)
- [ ] Frontmatter: title, slug, ageMin, ageMax, skill, subskill, description (≤155 caratteri)
- [ ] Paragrafo risposta 40–60 parole
- [ ] "Cosa impara" 3 bullet + riferimento Indicazioni Nazionali
- [ ] "Come giocare insieme" 3 suggerimenti per il genitore (guided play)
- [ ] 4 FAQ nel linguaggio delle ricerche Google

## Prima di pubblicare
- [ ] Testato su un telefono vero da un bambino della fascia d'età
- [ ] Lighthouse mobile ≥ 90
- [ ] Registrato in games/registry.ts
- [ ] OG image generata
