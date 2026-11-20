# Ciclo di gioco, codice e prestazioni

## Il ciclo

- **Un solo `requestAnimationFrame`.** Mai `setInterval` per muovere le cose: non è sincronizzato con lo schermo.
- **Il movimento usa il tempo trascorso** (`dt` in secondi), non il numero di fotogrammi: su uno schermo a 120 Hz il gioco non deve andare al doppio.
- **`dt` ha un tetto** (0,05 s). Dopo una pausa o un cambio di scheda il primo fotogramma è lunghissimo: senza tetto gli oggetti attraversano gli ostacoli.
- **Passi fissi per la fisica.** Si accumula il tempo e si avanza la simulazione a passi uguali (per esempio 1/120 s), disegnando una volta sola. È la tecnica di «Fix Your Timestep»: stessa partita su ogni telefono, collisioni che non saltano. Versione minima accettabile: se `dt` supera 0,02 s, due mezzi passi.
- **Pausa** quando la pagina è nascosta (`visibilitychange`) e quando il guscio lo chiede.
- **In React**: il ciclo vive in un `useEffect` che parte una volta; lo stato vivo sta nei `ref`. Un `setTimeout` che legge lo stato di React vede un valore vecchio: è il bug più trovato in questo repo.

## Schemi che servono davvero

- **Stati del personaggio come macchina a stati**: corre, salta, scivola, urtato. Ogni stato dice cosa si può fare e in quale stato si passa. Evita le combinazioni impossibili («scivola mentre salta»).
- **Logica separata dal disegno**: `aggiorna(stato, comandi, dt)` non tocca il canvas; `disegna(stato)` non cambia lo stato. Così la demo e le prove usano la stessa logica dello schermo.
- **Dati, non codice**: ostacoli, tratti e missioni sono elenchi di oggetti. Un gioco nuovo dello stesso tipo è un elenco nuovo.
- **Oggetti riusati**: particelle e ostacoli si prendono da una riserva e si rimettono a posto, invece di crearne di nuovi a ogni fotogramma (meno pause del raccoglitore di memoria).
- **Casualità con seme** (`games/_engine/casuale.ts`): la stessa partita si può rigiocare identica, quindi un bug si può riprodurre e la demo è stabile.
- **Generazione a pezzi verificati**: i tratti si compongono da schemi scritti a mano e controllati («sempre almeno una corsia libera»), non da numeri casuali puri. Un tratto impossibile è un bug, non sfortuna.

## Prestazioni su telefono

In ordine di resa:

1. **Niente lavoro ripetuto nel fotogramma.** Sfumature, ombre e figure si disegnano una volta su un canvas nascosto e poi si copiano con `drawImage`. Niente `getBoundingClientRect`, niente lettura di misure dalla pagina dentro il ciclo.
2. **Il testo sullo schermo (punti, round) si aggiorna solo quando cambia**, e comunque non più di dieci volte al secondo: scrivere nella pagina a ogni fotogramma costa un ricalcolo.
3. **Risoluzione adattiva.** Si parte dalla densità dello schermo con un tetto di pixel totali (circa 1,3 milioni); ogni 30 fotogrammi, se la media supera 21 ms, si disegnano meno pixel, fino a metà.
4. **Si muove solo `transform` e `opacity`** negli elementi della pagina: le altre proprietà fanno ricalcolare la disposizione.
5. **Niente oggetti creati nel ciclo** (array, stringhe di colore, funzioni): si preparano prima.
6. **Si disegna dal lontano al vicino**, e ciò che è fuori schermo non si disegna.

## Resa: perché una cosa veloce sembra a scatti

- Se tutto il canvas ha una griglia grossa (stile pixel ottenuto abbassando la risoluzione), ogni cosa si muove a salti di 3–4 pixel e le righe lontane sfarfallano. Lo stile pixel si mette **solo sulle figure** (scala intera, `imageSmoothingEnabled = false`); la scena si disegna alla risoluzione dello schermo.
- Le posizioni non si arrotondano alla griglia della figura.
- Le cose lontane sfumano verso il colore del fondo: meno sfarfallio, più profondità.

## Lo script di misura

`misura-fotogrammi.mjs` apre un indirizzo o un file con un profilo da telefono (390×800, densità 3), tocca il pulsante di avvio, rallenta la CPU del fattore dato e stampa media, 95° percentile e massimo del tempo per fotogramma. Fattore 1 = telefono buono, 4–6 = telefono economico. Sul sito: build di produzione, `npx next start -p 3200`, poi l'indirizzo del gioco.
