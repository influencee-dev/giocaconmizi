# Il registro del prodotto nel piano editoriale (14/11/2026)

Giorgia vuole tracciare tutto quello che si produce e riusarlo per fare il
piano editoriale successivo. Su Drive c'è un solo file, un Foglio Google:

**«Piano editoriale Giocamizi · AAAA-MM-GG»** in «Giocamizi / 1 Progetti /
100 articoli approfonditi» (id cartella `1w7h_IGqfsTD5uiHQl03QsvJCeQAWN7sS`).

| Scheda | Cosa contiene |
|---|---|
| 00 Leggimi e prompt | come si legge il file e il **prompt per fare il piano successivo** (per ChatGPT o Claude) |
| Piano | gli argomenti previsti e non ancora scritti (content/piano-editoriale.json) |
| Prodotto | il registro di ciò che è uscito, dal più recente: articoli (con indirizzo e keyword) e ogni altra cosa prodotta (foto, giochi, biglietti, pagine), dai commit di main |
| Inventario | tutto ciò che è online oggi (articoli, guide, giochi) con l'indirizzo |

## Come si aggiorna
Il file si ricostruisce dal repo, quindi **basta un commit con un messaggio
chiaro in italiano** perché una cosa prodotta entri nel registro (i commit solo
tecnici, tipo «Date delle pagine», «Verifiche», «Note», restano fuori).

```
npm run registro -- <cartella>     # serve Python con openpyxl: pip install openpyxl
```

Il connettore Drive crea ma non modifica, quindi:
1. carica il file `.xlsx` nella cartella (si converte da solo in Foglio Google);
2. rinomina il file del giro prima «zz_SUPERATO — Piano editoriale Giocamizi · <data>».

Lo fa la routine delle 21:00 ogni sera, e chiunque pubblichi qualcosa di
importante in una chat. Il testo del prompt sta in scripts/registro-prodotto.py
(`PROMPT`): si cambia lì. Mai dati personali nel file.
