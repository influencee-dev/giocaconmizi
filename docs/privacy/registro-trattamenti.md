# Registro delle attività di trattamento (art. 30 GDPR)

Titolare: Giorgia Palazzo, gestrice di Giocamizi (giocamizi.it). Contatto: ciao@giocamizi.it.
DPO: non nominato, perché non obbligatorio (art. 37: nessun ente pubblico, nessun monitoraggio regolare e sistematico su larga scala, nessuna categoria particolare di dati).
Ultimo aggiornamento: 31 ottobre 2026. Va aggiornato a ogni nuovo trattamento, insieme a `lib/legal.ts`.

| # | Trattamento | Interessati | Dati | Finalità | Base giuridica | Destinatari / responsabili | Extra UE | Conservazione |
|---|---|---|---|---|---|---|---|---|
| 1 | Navigazione e sicurezza | Visitatori | IP, user agent, richieste (log) | Funzionamento e sicurezza | Legittimo interesse (6.1.f) | Vercel Inc. (resp.) | USA, Data Privacy Framework | Periodo dei log Vercel |
| 2 | Statistiche | Visitatori che accettano | Identificativo cookie, pagine viste, eventi di gioco anonimi | Capire l'uso del sito | Consenso (6.1.a), art. 122 Codice privacy | Google Ireland (resp.) | Possibile verso USA, DPF | 2 mesi |
| 3 | Newsletter | Genitori ed educatori maggiorenni | Email; facoltativi: nome, città, professione, età del figlio, origine | Invio novità | Consenso (6.1.a) | Brevo (resp.) | No (UE) | Fino alla disiscrizione |
| 4 | Area genitori | Genitori maggiorenni | Email, progressi di gioco, fascia d'età e soprannome dei figli | Servizio richiesto | Contratto (6.1.b) | Supabase (resp.) | No (Francoforte) | Fino alla cancellazione dell'account |
| 5 | Directory delle attività | Titolari e referenti delle attività | Dati pubblici dai siti ufficiali; risposte dal link personale; impronta SHA-256 del codice | Informare le famiglie | Legittimo interesse (6.1.f), informativa art. 14 | Supabase, Vercel (resp.) | Vercel: DPF | Finché la scheda è pubblicata; rimozione entro 30 giorni dalla richiesta |
| 6 | Corrispondenza | Chi scrive | Email e contenuto | Rispondere | Contratto o legittimo interesse | Provider email | Da verificare col provider | Fino alla chiusura della richiesta |

Misure di sicurezza (art. 32): HTTPS con HSTS, Content Security Policy, RLS e funzioni `security definer` con `search_path` vuoto su Supabase, codici delle attività salvati solo come impronta, accesso senza password (magic link), chiavi API solo lato server, nessun dato dei bambini oltre fascia d'età e soprannome.

Valutazione d'impatto (DPIA, art. 35): non necessaria. Non c'è trattamento su larga scala di dati di minori, né profilazione, né monitoraggio sistematico. Da rivedere se arrivano account per bambini, profilazione o nuovi tracciamenti.

## Procedura in caso di violazione dei dati (artt. 33-34)

1. Chi se ne accorge avvisa subito Giorgia e annota data, ora e cosa è successo.
2. Si contiene il problema: revoca delle chiavi, disattivazione dei link, ripristino.
3. Entro 72 ore dalla scoperta si notifica al Garante (servizio online su garanteprivacy.it), a meno che sia improbabile un rischio per le persone.
4. Se il rischio è elevato, si avvisano anche le persone coinvolte, in modo semplice.
5. Ogni violazione, anche non notificata, si annota in fondo a questo documento.

### Violazioni registrate

Nessuna.
