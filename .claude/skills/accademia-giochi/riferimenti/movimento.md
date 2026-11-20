# Movimento, animazione, telecamera

La regola generale: **niente è lineare e niente è istantaneo.** Una cosa viva accelera, rallenta, supera di poco il punto d'arrivo, ha peso.

## Tre attrezzi per muovere

**1. Inseguimento esponenziale** — per tutto ciò che deve raggiungere una meta che può cambiare (corsia, telecamera, barra).

```ts
x += (meta - x) * (1 - Math.exp(-dt * k));   // k = 16 scatto, 6 morbido, 2 pigro
```
Non dipende dai fotogrammi, non supera mai la meta, non ha uno stato di velocità da gestire.

**2. Molla** — quando serve il rimbalzo (schiaccia e allunga, un oggetto che arriva e oscilla).

```ts
// rigidezza alta = scatto; smorzamento basso = più rimbalzi
v += (-rigidezza * (x - meta) - smorzamento * v) * dt;
x += v * dt;
```
Con passi fissi è stabile. Smorzamento critico (nessun rimbalzo): `smorzamento = 2 * Math.sqrt(rigidezza)`.

**3. Curva a durata fissa** — quando si sa quanto dura (un'entrata, un passaggio di livello).

```ts
const esceLenta = (t: number) => 1 - (1 - t) ** 3;     // parte forte, arriva piano: cose che ARRIVANO
const entraLenta = (t: number) => t ** 3;              // parte piano: cose che SE NE VANNO
const dentroFuori = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
```
Durate che funzionano: 80–150 ms una risposta a un tocco, 200–300 ms uno spostamento, 400–600 ms un passaggio di scena.

## Il salto

Un salto con gravità costante sembra una palla. Quello che si sente bene:
- salita rapida (spinta alta, gravità alta: mezzo secondo scarso in tutto);
- gravità dimezzata vicino alla cima: un attimo di sospensione per correggere;
- discesa più veloce della salita;
- altezza variabile se il comando è tenuto: rilasciando presto si taglia la spinta.

## Peso: i principi dell'animazione che servono in un gioco

1. **Schiaccia e allunga.** Allo stacco più alta e stretta, all'atterraggio più bassa e larga, poi ritorno a molla. Il volume resta: `scalaX = 1 - molla * 0.6`, `scalaY = 1 + molla`.
2. **Anticipazione.** Un caricamento prima dell'azione. Per le azioni di chi gioca dura uno o due fotogrammi (non deve ritardare il comando); per gli ostacoli dura di più, così si leggono in tempo.
3. **Azione che segue.** Sciarpa, ciuffo, coda arrivano dopo il corpo: inseguono con un `k` più basso.
4. **Archi.** Le cose vive si muovono su curve.
5. **Azione secondaria.** Polvere sotto i piedi, ombra che si restringe in salto, scintille alla raccolta. È ciò che dà il contatto col terreno.
6. **Tempi diversi.** Un colpo secco accanto a un ritorno lento.
7. **Inclinazione.** Ci si piega verso dove si va: proporzionale alla distanza dalla meta.

**Animazione a fotogrammi.** Il passo della corsa segue la distanza percorsa, non il tempo: `fotogramma = Math.floor(distanza * passiPerMetro) % n`. Così i piedi non scivolano quando la velocità cambia.

## La telecamera

Una telecamera incollata al personaggio trasmette ogni piccolo scatto a tutto lo schermo.

- **Segue in ritardo**: inseguimento esponenziale con `k` tra 4 e 8.
- **Segue solo una parte** dello spostamento (40–60%): il personaggio si muove sullo schermo, lo sfondo poco.
- **Guarda avanti**: il punto inquadrato sta davanti al personaggio nella direzione di marcia. Si deve vedere dove si va.
- **Zona morta**: dentro una piccola finestra la telecamera non si muove affatto.
- **Scossa**: breve, che si spegne da sola, mai su entrambi gli assi con la stessa ampiezza. Con i bambini quasi niente; con `prefers-reduced-motion` niente.
- La telecamera si interpola come tutto il resto: è la prima cosa che fa vedere il tremolio.

## La risposta a un evento

Un evento importante risponde su più canali nello stesso fotogramma: forma (deformazione, lampo), movimento (particelle, rimbalzo), suono, numero o parola. Il **fermo immagine** di 0,05–0,08 s su un colpo dà peso più di qualunque effetto. Poche particelle ben mosse valgono più di molte: partono veloci, rallentano, cadono, svaniscono.

## Perché una cosa veloce sfarfalla

- Righe sottili e contrasti forti che scorrono in prospettiva creano disegni che ballano: le cose lontane sfumano verso il colore del fondo e perdono contrasto.
- Una griglia grossa per tutto il canvas fa muovere ogni cosa a scalini. Lo stile a pixel si mette sulle figure (scala intera, `imageSmoothingEnabled = false`), non sulla scena.
- Le posizioni non si arrotondano alla griglia della figura.

## Rispetto di chi gioca

Con `prefers-reduced-motion` si spengono scosse, fermi immagine, inclinazioni e deformazioni. Il gioco resta identico da giocare.
