# I comandi: dal dito allo schermo

## La catena e quanto dura

Tocco → il sistema lo consegna al browser → il browser chiama il gioco → la simulazione lo usa → il fotogramma viene disegnato → lo schermo lo mostra. Su un telefono buono sono 50–80 ms anche a gioco perfetto. Sopra i 100 ms chi gioca sente il ritardo; sopra i 150 lo dice. Il gioco controlla solo i tre passi centrali: lì non si deve perdere nemmeno un fotogramma.

## Non perdere tempo

- **Eventi puntatore** (`pointerdown`, `pointermove`, `pointerup`): un codice solo per dito, penna e mouse.
- **`touch-action: none`** sull'area di gioco. Senza, il browser aspetta di capire se il gesto è uno scorrimento della pagina prima di consegnarlo.
- **`setPointerCapture`** al primo tocco: se il dito esce dal canvas il gesto continua.
- **Il comando si applica subito allo stato**, nello stesso giro in cui arriva l'evento. Non lo si mette in uno stato di React da leggere al prossimo disegno: è un fotogramma perso.
- **La risposta visibile parte nello stesso fotogramma.** Se l'azione vera ha un tempo (un salto con rincorsa), parte subito almeno un segnale: una deformazione, un suono.
- Niente lavoro pesante dentro il gestore dell'evento: si registra il comando e basta.

## Leggere un gesto

- **Lo scorrimento scatta mentre il dito si muove**, appena supera una soglia (circa 18 px), non quando il dito si alza. Aspettare il sollevamento aggiunge tutta la durata del gesto.
- Dopo lo scatto si sposta l'origine sul punto attuale: continuando a trascinare si fa una seconda mossa. La seconda soglia è più alta (circa 46 px), altrimenti uno scorrimento lungo ne fa due per sbaglio.
- La direzione è l'asse dominante: `|dx| > |dy|` è laterale.
- Un tocco senza movimento si riconosce al sollevamento, quindi ha il ritardo della sua durata. Per l'azione più frequente conviene un bottone grande o il `pointerdown` su una zona dedicata.
- I gesti stanno in pixel CSS, non in pixel del canvas.

## Perdonare

Tecniche note come «tolleranze»: chi gioca non le vede, ma senza il gioco sembra ingiusto.

```ts
// Memoria del comando: un salto chiesto un attimo prima di toccare terra parte all'atterraggio.
function chiediSalto(s) {
  if (s.inAria) { s.saltoInMemoria = 0.16; return; }
  parti(s);
}
// in aggiorna(): s.saltoInMemoria -= dt; e all'atterraggio: if (s.saltoInMemoria > 0) parti(s);
```

- **Tempo del coyote**: per 0,08–0,12 s dopo aver lasciato un bordo si può ancora saltare.
- **Sagome generose**: l'area che fa urtare è più piccola della figura; quella che fa raccogliere è più grande.
- **Correzione agli spigoli**: sfiorando un angolo si viene spostati di poco invece che fermati.
- **Calamita leggera**: una mossa quasi giusta viene completata (la corsia più vicina, il bersaglio più vicino).
- Con i bambini le finestre si allargano.

## I gesti e i bambini piccoli

- Il tocco è il gesto più naturale; lo scorrimento funziona se lo schermo fa vedere dove scorrere.
- Trascinare e tracciare piacciono, ma il dito si stacca: il gioco accetta il gesto a pezzi.
- Sotto i 6 anni si evitano pizzico, doppio tocco, due dita, scuotere o inclinare, scorrimenti «a frusta».
- Il polso si appoggia sul bordo basso: lì niente pulsanti che fanno uscire o ricominciare.
- Bersagli di almeno 64 px con 16 px di spazio.

## Il suono non deve arrivare tardi

Un suono in ritardo fa sembrare lento anche un gioco veloce.

- Un solo `AudioContext`, creato al primo gesto e riusato; `latencyHint: "interactive"`.
- Suoni brevi sintetizzati o già decodificati in memoria: mai caricare un file al momento dell'evento.
- Il suono parte nello stesso giro dell'evento di gioco, non dopo un'animazione.
- Le raccolte in serie salgono di tono: la mano sente il ritmo.
