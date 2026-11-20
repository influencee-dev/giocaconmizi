---
name: accademia-giochi
description: Il mestiere dello sviluppatore di videogiochi applicato alla FLUIDITÀ - ciclo di gioco e tempo, latenza dei comandi, movimento e animazione, telecamera, disegno veloce su canvas e pagina, misura dei fotogrammi su telefono. Da usare ogni volta che un gioco «va a scatti», «non è fluido», «è lento sul cellulare», «risponde in ritardo», «si muove rigido», «trema», «sfarfalla», quando si scrive o si rivede un ciclo di gioco, un sistema di comandi touch, un'animazione o una telecamera, e prima di consegnare qualunque gioco che si muove. Vale per qualsiasi gioco nel browser, non solo per quelli di Giocamizi.
---

# Accademia dei giochi: la fluidità

Qui si lavora da sviluppatore di giochi. Un gioco è fluido quando succedono insieme quattro cose, e ognuna si rompe in un modo diverso:

| Che cosa | Si rompe così | Chi gioca dice | Dove si cura |
|---|---|---|---|
| **Ritmo dei fotogrammi**: ogni fotogramma arriva in tempo e dura quanto gli altri | fotogrammi persi o di durata irregolare | «va a scatti», «è lento» | `riferimenti/disegno-veloce.md` |
| **Tempo della simulazione**: il mondo avanza di quanto è passato davvero | movimento che trema anche a 60 fotogrammi, velocità diversa da un telefono all'altro | «trema», «a volte accelera» | `riferimenti/ciclo-e-tempo.md` |
| **Latenza dei comandi**: tra il dito e lo schermo passa poco | il gesto è letto tardi o perso | «risponde in ritardo», «non prende il tocco» | `riferimenti/comandi.md` |
| **Qualità del movimento**: le cose accelerano, pesano, anticipano | spostamenti lineari o istantanei, telecamera incollata | «è rigido», «è piatto» | `riferimenti/movimento.md` |

Il primo errore è curare la colonna sbagliata. Un gioco a 60 fotogrammi perfetti può sembrare a scatti (capitato qui: la scena era disegnata su una griglia grossa e tutto si muoveva a salti di tre pixel), e ottimizzare il disegno non avrebbe cambiato niente.

## Il metodo

1. **Riprodurre.** Giocare davvero, sul profilo più debole che conta (telefono economico, schermo piccolo). Dire in una frase che cosa si vede.
2. **Classificare** con la tabella: ritmo, tempo, latenza o movimento. Se non è chiaro, si misura.
3. **Misurare** prima di toccare (`riferimenti/misurare.md`):
   `node .claude/skills/accademia-giochi/misura-fotogrammi.mjs <indirizzo o file> "<selettore di avvio>" 6`
   - media ≤ 17 ms, 95° percentile ≤ 20 ms, scatti sotto l'1%: il ritmo è a posto, il problema è altrove;
   - media buona ma percentile o massimo alti: scatti isolati (memoria, lavoro a blocchi);
   - media alta: troppo lavoro per fotogramma.
4. **Un'ipotesi, una modifica, una misura.** Mai tre cambi insieme: non si saprebbe quale ha funzionato.
5. **Confermare giocando**, non solo coi numeri. La fluidità è una sensazione: il numero dice se è possibile, la mano dice se c'è.
6. **Scrivere cosa è misurato e cosa no.** Il browser di prova disegna via software: i suoi numeri servono a confrontare prima e dopo, non a promettere come andrà su un telefono vero. Lo si dice sempre.

## Le dieci regole che risolvono quasi tutto

1. Un solo `requestAnimationFrame`; mai `setInterval` o `setTimeout` per muovere.
2. Il movimento dipende dal tempo trascorso, mai dal numero di fotogrammi.
3. Simulazione a passi fissi, disegno interpolato tra un passo e l'altro.
4. Tetto al tempo recuperato dopo una pausa (un quarto di secondo).
5. Il comando si legge mentre il dito si muove, non quando si alza; quello arrivato un attimo troppo presto si ricorda.
6. Niente è lineare e niente è istantaneo: curve esponenziali o molle.
7. La telecamera segue in ritardo e guarda avanti.
8. Nel fotogramma non si crea niente (oggetti, sfumature, stringhe) e non si legge la pagina.
9. Si muove la scena alla risoluzione dello schermo; lo stile a pixel sta solo nelle figure.
10. Se il telefono non ce la fa, si disegnano meno pixel, non meno fotogrammi.

Ogni regola ha la spiegazione e il codice pronto nei file di `riferimenti/`.

## I file

- `riferimenti/ciclo-e-tempo.md` — il ciclo, i passi fissi, l'interpolazione, gli schermi a 90 e 120 Hz, le pause.
- `riferimenti/comandi.md` — la catena dal dito allo schermo, gesti, memoria del comando, tolleranze, suono senza ritardo.
- `riferimenti/movimento.md` — curve, molle, salto, schiaccia e allunga, anticipazione, telecamera, risposta agli eventi.
- `riferimenti/disegno-veloce.md` — canvas e pagina: cosa costa, cosa preparare prima, memoria, risoluzione adattiva.
- `riferimenti/misurare.md` — che cosa misurare, con che cosa, come leggere i numeri.
- `riferimenti/progettazione.md` — idee, livelli e difficoltà (la fluidità serve un progetto, non lo sostituisce).
- `riferimenti/fonti.md` — da dove viene ogni cosa e quanto è stata verificata.

## Lista di consegna

- [ ] Misura a rallentamento 1 e 6, prima e dopo, scritta nel resoconto.
- [ ] Partita intera senza errori in console, su profilo telefono e computer.
- [ ] Provato a 60 Hz e, se possibile, a 120 Hz: stessa velocità di gioco.
- [ ] Cambio di scheda e ritorno: nessun salto, nessun oggetto attraversato.
- [ ] `prefers-reduced-motion`: niente scosse, fermi immagine, deformazioni; il gioco resta identico da giocare.
- [ ] Detto chiaramente che cosa resta da provare su un telefono vero.

## Se il gioco è di Giocamizi

Le regole del sito vengono prima di ogni tecnica: `CLAUDE.md`, `docs/GAME-DESIGN-CHECKLIST.md` e la skill `game-designer-mizi` (niente vite, tempo, suoni negativi, fretta, classifiche). Le tecniche dei giochi d'azione si prendono; vite, sconfitta e pressione si lasciano fuori. Il modello già fatto è `games/_engine/Corsa.tsx` con `corsa-logica.ts` («La corsa nella piramide»): passi fissi a 1/120 s, stato nei `ref`, logica senza React usata da schermo, demo e prove.
