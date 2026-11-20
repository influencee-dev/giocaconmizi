# Misurare

Senza un numero prima e uno dopo non si sa se una modifica ha funzionato. Ma il numero giusto dipende dal problema.

## Che cosa guardare

| Numero | Che cosa dice | Buono |
|---|---|---|
| **Media** del tempo per fotogramma | quanto lavoro c'è | ≤ 17 ms a 60 Hz |
| **95° percentile** | quanto spesso si sfora | ≤ 20 ms |
| **Massimo** | lo scatto peggiore | sotto 50 ms |
| **Scatti** (fotogrammi oltre 25 ms) | quante volte si vede | sotto l'1% |
| **Dimensione del canvas** | quanti pixel si muovono | coerente con lo schermo |

La media da sola inganna: 59 fotogrammi da 15 ms e uno da 120 fanno una media ottima e uno scatto che tutti vedono. Si leggono sempre media e percentile insieme.

## Lo script

```bash
node .claude/skills/accademia-giochi/misura-fotogrammi.mjs <indirizzo o file.html> "<selettore del pulsante di avvio>" <rallentamento>
```
Apre il gioco con un profilo da telefono (390×800, densità 3), tocca il pulsante, rallenta la CPU e misura 240 fotogrammi. Rallentamento 1 = telefono buono; 4 = medio; 6 = economico. Si lancia due volte (1 e 6), prima e dopo ogni modifica.

**Limite da dire sempre:** il browser di prova disegna via software, senza scheda grafica. Esagera il costo dei pixel e non misura la latenza del tocco. I suoi numeri valgono per confrontare due versioni, non per promettere come andrà su un telefono.

## Sul telefono vero

- Collegato al computer, gli strumenti del browser registrano una partita: si cercano i fotogrammi lunghi e che cosa c'era dentro (codice, disegno, memoria).
- Un contatore nel gioco, acceso da un parametro dell'indirizzo, che mostra media e massimo degli ultimi 60 fotogrammi: costa poco e dice la verità su quel telefono.
- La latenza del tocco si giudica con la mano: un oggetto che segue il dito deve restargli sotto. Se resta indietro di un dito, sono oltre 100 ms.

## Misurare il tremolio, non solo i fotogrammi

Un gioco può avere 60 fotogrammi regolari e mostrare lo stesso un movimento irregolare. Si misura facendo scrivere al gioco, a ogni fotogramma, l'istante e la posizione disegnata di una cosa che va a velocità costante; poi si calcola la velocità vista (spazio diviso tempo tra due fotogrammi) e la sua deviazione rispetto alla media. Sotto l'1% non si vede; al 5–7% si vede come un tremolio fine. È la misura che dice se l'interpolazione serve e se funziona (numeri nostri in `fonti.md`).

## Leggere i risultati

- **Media alta, percentile vicino alla media**: troppo lavoro costante → pixel, sfumature, cose disegnate fuori schermo (`disegno-veloce.md`).
- **Media buona, massimo alto, ogni tanto**: memoria o lavoro a blocchi.
- **Numeri buoni ma «a scatti»**: non è il ritmo. Tempo della simulazione (`ciclo-e-tempo.md`) o resa a scalini (`movimento.md`).
- **Numeri buoni ma «in ritardo»**: latenza dei comandi (`comandi.md`).
- **Numeri buoni ma «rigido»**: qualità del movimento (`movimento.md`).

## Provare la logica senza schermo

Con la logica separata dal disegno si simulano centinaia di partite in un secondo con un pilota automatico: si controlla che ogni livello si possa finire, quanto dura, quanti errori fa un giocatore che non tocca niente. Si rifà a ogni modifica della logica. Si usano due passi di tempo diversi (1/120 e 1/30): se il risultato cambia, la logica dipende dai fotogrammi.
