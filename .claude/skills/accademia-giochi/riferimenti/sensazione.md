# Sensazione dei comandi, animazione e peso

La «sensazione di gioco» è ciò che si prova nelle mani prima ancora di capire le regole. Si costruisce con tre cose: il comando risponde subito, il gioco perdona le piccole imprecisioni, il personaggio ha peso.

## Il comando risponde subito

- La risposta visibile parte **nello stesso fotogramma** del tocco. Se l'azione vera richiede tempo, parte subito almeno un segnale (un suono, un movimento).
- **Lo scorrimento scatta mentre il dito si muove**, dopo circa 18 px, non quando il dito si alza. Continuando a trascinare si può fare una seconda mossa (soglia più alta, circa 46 px, per non farne due per sbaglio).
- `touch-action: none` sull'area di gioco e `setPointerCapture`: la pagina non scorre e il gesto non si perde se il dito esce dal canvas.

## Il gioco perdona (a favore del bambino, sempre)

- **Memoria del comando**: un salto chiesto fino a 0,16 s prima di toccare terra parte appena si atterra.
- **Tempo del coyote**: per un attimo dopo aver lasciato un bordo si può ancora saltare.
- **Sagome generose**: l'area che conta per un urto è più piccola della figura; l'area che conta per raccogliere è più grande.
- **Correzione agli spigoli**: se si sfiora un angolo, il gioco sposta di poco il personaggio invece di fermarlo.
- Con i bambini queste tolleranze si allargano: finestre più lunghe, sagome ancora più generose, e l'aiuto dopo tre errori.

## I gesti adatti ai bambini piccoli

- Il **tocco** è il gesto più naturale. Lo **scorrimento** funziona se lo schermo fa vedere dove scorrere.
- **Trascinare e tracciare** piacciono ma i piccoli staccano il dito: il gioco deve accettare il gesto fatto a pezzi.
- Da evitare sotto i 6 anni: pizzico, doppio tocco, due dita insieme, scuotere o inclinare il telefono, scorrimenti rapidi «a frusta».
- I bambini appoggiano il polso sul bordo basso: lì non si mettono pulsanti che fanno uscire o ricominciare.
- Bersagli di almeno 64 px con 16 px di spazio (è già nella checklist del sito).
- Per i 3–5 anni un gioco d'azione usa **un gesto solo** (tocca dove vuoi andare); il secondo gesto arriva dai 6 anni.

## Movimento: le curve

- Nessun movimento a velocità costante e nessuno istantaneo. La formula che non dipende dai fotogrammi:
  `x += (meta - x) * (1 - Math.exp(-dt * k))` — `k` alto = scatto, `k` basso = morbido.
- Per i movimenti con una durata nota si usano curve di accelerazione: parte forte e rallenta per le cose che arrivano, parte piano per quelle che se ne vanno.
- Il salto ha una curva che si sente: salita rapida, cima un po' più lenta (gravità ridotta vicino al punto più alto), discesa più veloce della salita.

## Peso: i principi dell'animazione che contano in un gioco

1. **Schiaccia e allunga**: si allunga allo stacco, si schiaccia all'atterraggio, torna morbido. Il volume resta lo stesso (più alto = più stretto).
2. **Anticipazione**: un attimo di caricamento prima di un'azione grande. Brevissima per le azioni del giocatore (non deve ritardare il comando), più lunga per gli ostacoli, così si leggono in tempo.
3. **Azione che segue**: sciarpa, ciuffo e ali arrivano un attimo dopo il corpo.
4. **Archi**: le cose vive si muovono su curve, non su rette.
5. **Azione secondaria**: polvere sotto i piedi, ombra che si restringe in salto, scintille quando si raccoglie.
6. **Tempi diversi**: non tutto dura uguale. Un colpo secco accanto a un ritorno lento dà carattere.

## La telecamera

- Segue una parte dello spostamento, con ritardo; non sta incollata al personaggio.
- Guarda un po' avanti nella direzione di marcia: chi gioca deve vedere dove va, non dov'è.
- Niente scosse forti: per i bambini basta un sussulto breve, e con `prefers-reduced-motion` nemmeno quello.

## La risposta a un evento («succo»)

Ogni evento importante risponde su più canali insieme: una forma che cambia, un suono, una parola o un numero che sale, qualche particella. Per le raccolte in serie il suono sale di tono. Un urto qui è: rimbalzo morbido, breve fermo immagine (0,05–0,08 s), lampeggio, «ops» detto con dolcezza. Mai un suono negativo.

## Rispetto di chi gioca

Con `prefers-reduced-motion` si tolgono scosse, fermo immagine, inclinazione e deformazioni: il gioco resta giocabile identico. I pulsanti di pausa e dei suoni restano sempre visibili.
