# Fonti e quanto sono verificate

Questa skill è un riassunto ragionato, non la trascrizione di un corso. Nessuno ha «frequentato» queste scuole: sono le materie e i testi che i loro programmi e i professionisti citano più spesso.

## Controllate sul web il 20/11/2026

- **Gesti dei bambini in età prescolare** — Sesame Workshop, «Best Practices: Designing Touch Tablet Experiences for Preschoolers» (2012). Non è stato possibile aprire il documento originale: i punti riportati (tocco più naturale; trascinare e tracciare a pezzi; scorrere con un segnale visivo; evitare pizzico, doppio tocco, più dita, inclinare; niente comandi sul bordo basso) vengono da riassunti di terzi. Pagina del Joan Ganz Cooney Center: https://joanganzcooneycenter.org/?p=19607
- **Tolleranze a favore del giocatore** (tempo del coyote, memoria del salto, correzione agli spigoli, gravità ridotta in cima al salto) — Maddy Thorson, «Celeste & Forgiveness»: https://maddymakesgames.com/articles/celeste_and_forgiveness/ . L'autrice non dà numeri; le finestre scritte nella skill (0,16 s) sono quelle usate nel nostro prototipo, non le sue.

## Da conoscenza generale della disciplina, non ricontrollate in questa sessione

Prima di citarle fuori da qui, o di appoggiarci una decisione importante, vanno rilette alla fonte.

- Passi fissi di simulazione: Glenn Fiedler, «Fix Your Timestep!».
- Schemi di programmazione (stati, riserva di oggetti, ciclo, dati al posto del codice): Robert Nystrom, «Game Programming Patterns».
- Sensazione di gioco: Steve Swink, «Game Feel»; Martin Jonasson e Petri Purho, «Juice it or lose it»; Jan Willem Nijman, «The Art of Screenshake».
- Principi dell'animazione: Frank Thomas e Ollie Johnston, «The Illusion of Life».
- Meccaniche, dinamiche, estetica: Hunicke, LeBlanc e Zubek, «MDA: A Formal Approach to Game Design».
- Curva in quattro tempi dei livelli: lo schema «kishōtenketsu» raccontato da Koichi Hayashida per i giochi di Mario.
- Difficoltà e attenzione: Mihály Csíkszentmihályi, la teoria del «flusso».
- Metodo per prototipi e prove con i giocatori: Tracy Fullerton, «Game Design Workshop»; Jesse Schell, «The Art of Game Design».
- Scuole i cui programmi coprono queste materie: DigiPen, USC Games, NYU Game Center, Carnegie Mellon ETC, Breda University, Abertay.
- Apprendimento giocoso: LEGO Foundation (già citata in `docs/GAME-DESIGN-CHECKLIST.md`).

## Misure fatte da noi (prototipo «Corsa nella Piramide», 20/11/2026)

Con il browser di prova, profilo telefono 390×800:
- Scena su griglia grossa (138×288 punti): 16,7 ms per fotogramma anche con CPU rallentata 6 volte. Non era lenta: si muoveva a scalini.
- Scena alla risoluzione dello schermo (780×1600): 16,7 ms a velocità normale; con CPU rallentata 4–6 volte la risoluzione adattiva scende e la media sale a 21–25 ms.

Il browser di prova disegna via software: su un telefono vero non è stato provato.
