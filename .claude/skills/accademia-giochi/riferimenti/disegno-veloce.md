# Disegnare in tempo

A 60 Hz ci sono 16,7 ms per fotogramma, e una parte serve al browser. Il gioco ne ha circa 10; su un telefono economico ogni operazione costa da quattro a sei volte quello che costa sul computer di chi sviluppa.

## Che cosa costa, in ordine

1. **Quanti pixel si riempiono.** Un canvas 390×800 a densità 3 è 2,8 milioni di pixel: ogni riempimento a tutto schermo li tocca tutti. È la prima leva.
2. **Sfumature, ombre (`shadowBlur`), filtri, testo.** Molto più cari di un colore pieno. Si disegnano una volta su un canvas nascosto e poi si copiano con `drawImage`.
3. **Cambi di stato del contesto** (`fillStyle`, `font`, `globalAlpha`, trasformazioni). Si raggruppano i disegni che usano lo stesso stato.
4. **Tracciati lunghi.** Meglio poche forme semplici.
5. **Lettura della pagina** (`getBoundingClientRect`, `offsetWidth`) nel ciclo: obbliga il browser a ricalcolare la disposizione. Le misure si leggono una volta, a ogni cambio di dimensione.
6. **Scrittura nella pagina** a ogni fotogramma (testo dei punti): al massimo dieci volte al secondo, e solo se il valore è cambiato.

## Preparare prima

```ts
// Un alone sfumato: una volta sola.
const alone = document.createElement("canvas");
alone.width = alone.height = 64;
const g = alone.getContext("2d")!;
const sfumatura = g.createRadialGradient(32, 32, 0, 32, 32, 32);
sfumatura.addColorStop(0, "rgba(255,170,80,.6)");
sfumatura.addColorStop(1, "rgba(255,170,80,0)");
g.fillStyle = sfumatura;
g.fillRect(0, 0, 64, 64);
// Nel ciclo: ctx.drawImage(alone, x - r, y - r, 2 * r, 2 * r);
```
Lo stesso vale per le figure (tutte le pose disegnate all'avvio) e per gli sfondi che non cambiano (uno strato a parte, sotto).

## Memoria: gli scatti che arrivano ogni tanto

Se la media è buona ma ogni pochi secondi c'è un fotogramma lungo, quasi sempre è il raccoglitore di memoria. Nel ciclo non si crea niente:

- niente `array.filter/map` a ogni fotogramma su elenchi vivi: si scorre e si compatta sul posto;
- niente oggetti temporanei per punti e vettori: si riusano;
- niente stringhe di colore costruite al volo se si può tenere una tabella;
- particelle e proiettili da una **riserva**: si prendono e si rimettono a posto.

```ts
const riserva: Particella[] = [];
const prendi = () => riserva.pop() ?? nuova();
const lascia = (p: Particella) => riserva.push(p);
```

## Risoluzione adattiva

Meglio meno pixel a 60 fotogrammi che tutti i pixel a 35.

```ts
// All'avvio: densità dello schermo, con un tetto di pixel totali.
let densita = Math.max(0.5, Math.min(2, devicePixelRatio, Math.sqrt(1.3e6 / (larghezza * altezza))));
// Ogni 30 fotogrammi: se la media è sopra 21 ms, si scende (fino a metà).
if (media > 0.021 && densita > 0.5) { densita = Math.max(0.5, densita * Math.max(0.5, 0.017 / media)); ridimensiona(); }
```
Si scende in fretta e non si risale (o molto piano): l'altalena di risoluzione si vede più di una risoluzione bassa.

## Canvas e pagina

- Il canvas ha dimensioni in pixel veri (`larghezza × densita`) e si disegna con `setTransform(densita, …)`: così le coordinate restano in pixel CSS.
- Negli elementi della pagina si animano solo `transform` e `opacity`: non fanno ricalcolare la disposizione.
- Niente elementi con ombre o sfocature sopra il canvas: il browser li ricompone a ogni fotogramma.
- Si disegna dal lontano al vicino; ciò che è fuori schermo non si disegna.
- Coordinate intere per le figure a pixel; coordinate libere per la scena.

## Lavoro a blocchi

Un livello generato, un'immagine decodificata, un JSON grande: se capita a metà partita è un fotogramma perso. Si fa al caricamento, nel momento di passaggio tra due livelli (quando lo schermo è fermo), oppure a pezzi in più fotogrammi.
