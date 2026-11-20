# Il ciclo e il tempo

## Perché un gioco a 60 fotogrammi può tremare

Lo schermo si aggiorna a intervalli fissi (16,7 ms a 60 Hz, 8,3 ms a 120 Hz). `requestAnimationFrame` chiama il gioco una volta per aggiornamento, ma il tempo che riceve non è regolare: 15, 18, 16, 17 ms. Se il mondo avanza di quel tempo grezzo, un oggetto che va a velocità costante fa passi un po' diversi a ogni fotogramma: l'occhio lo vede tremare. Se invece il mondo avanza «di un fotogramma» fisso, su uno schermo a 120 Hz il gioco va al doppio.

La soluzione dei professionisti è separare le due cose: **la simulazione avanza a passi sempre uguali; il disegno mostra un punto intermedio tra due passi.**

## Il ciclo da copiare

```ts
const PASSO = 1 / 120;           // secondi di simulazione per passo
const TETTO = 0.25;              // quanto tempo si recupera al massimo
let ultimo = 0, accumulo = 0;

function fotogramma(adesso: number) {
  const trascorso = Math.min(TETTO, (adesso - ultimo) / 1000 || 0);
  ultimo = adesso;
  if (!document.hidden) {
    accumulo += trascorso;
    while (accumulo >= PASSO) {
      precedente = copia(stato);  // serve per interpolare
      aggiorna(stato, PASSO);
      accumulo -= PASSO;
    }
    disegna(precedente, stato, accumulo / PASSO); // quanto siamo tra i due passi, da 0 a 1
  }
  requestAnimationFrame(fotogramma);
}
```

- **Perché 1/120.** È un divisore sia di 60 sia di 120 Hz: due passi o un passo per fotogramma, quasi sempre esatti. Con 1/60 uno schermo a 120 Hz mostrerebbe ogni posizione due volte.
- **Interpolazione.** `disegna` usa `prima + (dopo - prima) * t` per tutto ciò che si muove (posizione, telecamera). Senza, il resto che avanza nell'accumulo si vede come un tremolio fine. Versione economica quando la velocità è nota: estrapolare, `posizione + velocita * accumulo`.
- **Il tetto.** Dopo un cambio di scheda il primo `trascorso` vale secondi. Senza tetto il gioco esegue centinaia di passi insieme (la «spirale della morte») o fa attraversare gli ostacoli.
- **Collisioni.** Con passi piccoli e fissi un oggetto non può saltare oltre un ostacolo: la distanza per passo è sempre la stessa e si può controllare a tavolino (`velocita × PASSO` deve essere minore dello spessore dell'ostacolo).
- **Stessa partita ovunque.** Passi fissi più numeri a caso con un seme: la partita si può rifare identica. I bug si riproducono, la demo è stabile, la logica si prova senza schermo.

## Errori tipici

- **`setInterval` per muovere.** Non è sincronizzato con lo schermo: due aggiornamenti in un fotogramma e nessuno in quello dopo.
- **Tempo dal `Date.now()`.** Usare il tempo che `requestAnimationFrame` passa alla funzione: è quello dell'aggiornamento dello schermo.
- **Attrito scritto come `v *= 0.9`.** Dipende dai fotogrammi. Forma giusta: `v *= Math.exp(-attrito * dt)`.
- **Inseguimento scritto come `x += (meta - x) * 0.1`.** Stesso difetto. Forma giusta: `x += (meta - x) * (1 - Math.exp(-dt * k))`.
- **Stato vivo dentro lo stato di React.** Ogni cambio ridisegna il componente; un timer che lo legge vede un valore vecchio. Lo stato del ciclo sta in un `ref` o in un oggetto fuori da React; React riceve solo ciò che cambia di rado (round, fine partita).
- **Più cicli.** Un `requestAnimationFrame` per il gioco e un altro per un effetto: si pestano i piedi. Uno solo, che chiama tutto.

## Pause e ripresa

- `visibilitychange`: a pagina nascosta non si simula e non si disegna. Al ritorno il tetto assorbe il buco.
- Il suono si ferma con la pausa (`AudioContext.suspend()`).
- Un fermo immagine voluto (colpo) è un contatore che blocca la simulazione per 0,05–0,08 s mentre il disegno continua: non un `setTimeout`.

## Logica separata dal disegno

`aggiorna(stato, dt)` non tocca lo schermo e restituisce un elenco di eventi («gemma presa», «atterrata»); lo schermo decide suoni, scintille e parole. Così la stessa logica gira nelle prove a migliaia di partite al secondo: prima di scrivere lo schermo si simulano centinaia di livelli con un pilota automatico e si scopre subito se uno è impossibile.
