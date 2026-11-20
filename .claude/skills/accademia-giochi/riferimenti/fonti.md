# Fonti e quanto sono verificate

Questa skill è un riassunto ragionato, non la trascrizione di un corso. Nessuno ha «frequentato» queste scuole: sono le materie e i testi che i loro programmi e i professionisti citano più spesso.

## Controllate sul web il 20/11/2026

- **Gesti dei bambini in età prescolare** — Sesame Workshop, «Best Practices: Designing Touch Tablet Experiences for Preschoolers» (2012). Non è stato possibile aprire il documento originale: i punti riportati (tocco più naturale; trascinare e tracciare a pezzi; scorrere con un segnale visivo; evitare pizzico, doppio tocco, più dita, inclinare; niente comandi sul bordo basso) vengono da riassunti di terzi. Pagina del Joan Ganz Cooney Center: https://joanganzcooneycenter.org/?p=19607
- **Tolleranze a favore del giocatore** (tempo del coyote, memoria del salto, correzione agli spigoli, gravità ridotta in cima al salto) — Maddy Thorson, «Celeste & Forgiveness»: https://maddymakesgames.com/articles/celeste_and_forgiveness/ . L'autrice non dà numeri; le finestre scritte nella skill (0,16 s per la memoria del salto, 0,08–0,12 s per il coyote) sono valori d'uso comune e quelli del nostro gioco, non i suoi.

## Da conoscenza generale della disciplina, non ricontrollate in questa sessione

Prima di citarle fuori da qui, o di appoggiarci una decisione importante, vanno rilette alla fonte.

- Passi fissi, accumulo e interpolazione: Glenn Fiedler, «Fix Your Timestep!».
- Movimento indipendente dai fotogrammi (forma esponenziale dell'inseguimento e dell'attrito): pratica comune, spiegata tra gli altri da Freya Holmér («Lerp smoothing is broken»).
- Schemi di programmazione (ciclo, stati, riserva di oggetti, dati al posto del codice): Robert Nystrom, «Game Programming Patterns».
- Sensazione di gioco: Steve Swink, «Game Feel»; Martin Jonasson e Petri Purho, «Juice it or lose it»; Jan Willem Nijman, «The Art of Screenshake».
- Telecamere nei giochi a scorrimento (ritardo, zona morta, sguardo in avanti): Itay Keren, «Scroll Back».
- Curve di accelerazione: Robert Penner, le funzioni di «easing».
- Principi dell'animazione: Frank Thomas e Ollie Johnston, «The Illusion of Life».
- Costi del canvas e della pagina (pixel riempiti, sfumature, lettura della disposizione, `transform` e `opacity`): documentazione per sviluppatori dei browser (MDN, web.dev).
- Soglie di latenza percepita (circa 100 ms): letteratura sull'interazione uomo-macchina; le cifre nel file dei comandi sono ordini di grandezza, non misure nostre.
- Meccaniche, dinamiche, estetica: Hunicke, LeBlanc e Zubek, «MDA».
- Curva in quattro tempi dei livelli: lo schema «kishōtenketsu» raccontato da Koichi Hayashida.
- Scuole i cui programmi coprono queste materie: DigiPen, USC Games, NYU Game Center, Carnegie Mellon ETC, Breda University, Abertay.

## Misure fatte da noi (prototipo «Corsa nella Piramide», 20/11/2026)

Con il browser di prova, profilo telefono 390×800:
- Scena su griglia grossa (138×288 punti): 16,7 ms per fotogramma anche con CPU rallentata 6 volte. Non era lenta: si muoveva a scalini.
- Scena alla risoluzione dello schermo (780×1600): 16,7 ms a velocità normale; con CPU rallentata 4–6 volte la risoluzione adattiva scende e la media sale a 21–25 ms.

Il browser di prova disegna via software: su un telefono vero non è stato provato.
