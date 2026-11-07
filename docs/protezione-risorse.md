# Protezione di /risorse-educative-bambini (7/11/2026)

Approccio etico e difensivo: la pagina è pubblica e deve fare SEO, quindi non
esiste una protezione assoluta. L'obiettivo è rendere costosa la lettura a
raffica senza mai disturbare genitori, insegnanti, screen reader e i crawler
verificati. Nessuna risposta contiene dati falsi, alterati o codice ostile.

## Cosa c'è nel codice

| Difesa | Dove | Cosa fa |
| --- | --- | --- |
| Solo dati pubblici nel repo | `lib/risorse-educative-dati.ts` | 53 schede: nome, descrizione, sezioni, temi, destinatari, località, sito. Mai email, fonti email, bozze, stati Gmail, note. Le 25 righe «Solo outreach» non ci sono. |
| HTML lato server | `app/(public)/risorse-educative-bambini/page.tsx` | Le schede arrivano già nell'HTML; filtri = link, funzionano senza JavaScript. Nessun endpoint JSON con l'elenco. |
| Paginazione lato server | `?sezione=…&pagina=…` | 12 schede per pagina nelle viste filtrate (noindex,follow, canonical all'hub). |
| Limite di frequenza | `lib/protezione/limiti.ts` + `middleware.ts` | Per IP 120/min (scuole con IP condiviso), per «sessione tecnica» IP+browser 40/min e 15 in 10 s. Oltre: 429 + Retry-After + pagina gentile in italiano. I prefetch del browser non contano. |
| Crawler verificati | `lib/protezione/crawler.ts` | Googlebot/Bingbot passano senza limiti solo se l'IP è negli intervalli ufficiali pubblicati da Google e Microsoft. Chi si dichiara crawler senza esserlo ha i limiti normali. |
| Trappola (honeypot) | link `hidden` in pagina → `/risorse-educative-bambini/elenco-completo-archivio` | Invisibile e fuori dall'albero di accessibilità, vietato in robots.txt, mai in sitemap. Chi lo apre riceve 404 e la sua impronta IP+browser è bloccata 30 min sulle pagine protette (403 neutro). |
| Log privacy-safe | `console.warn` nei log Vercel | Evento, percorso, impronta SHA-256 troncata dell'IP con sale giornaliero, famiglia del client. Niente IP in chiaro. Conservazione = log del piano Vercel. |
| robots.txt / meta robots | `app/robots.ts` | Indicazioni per crawler corretti, NON una barriera (commentato nel codice). |

## Limiti onesti

- I contatori stanno nella memoria della singola istanza del middleware:
  Vercel ne accende più d'una, quindi il limite è «al meglio». La barriera
  condivisa è la regola WAF qui sotto.
- Uno scraper lento, distribuito su molti IP, con un browser vero, legge
  comunque la pagina: è il prezzo dell'essere indicizzabili.
- La «sessione» è IP+browser, non un cookie: su un sito per bambini non
  aggiungiamo un cookie solo per questo. Due persone con lo stesso browser
  dietro lo stesso IP condividono il contatore (per questo i limiti sono larghi).
- Se gli elenchi IP di Google/Bing non si scaricano, i crawler veri hanno i
  limiti normali (mai un blocco): 15 pagine in 10 secondi bastano comunque.
- In locale (nessun IP dal proxy) il limite non scatta, per non bloccare le
  batterie di verifica. La trappola invece funziona sempre.

## Impostazioni Vercel da attivare a mano

Progetto `giocaconmizi` → **Firewall**:

1. **Bot Protection** (managed ruleset): attivare in modalità *Log* per qualche
   giorno, poi *Challenge*. Lascia passare i bot verificati (Google, Bing).
2. **AI Bots** (managed ruleset): lasciare *Off* o *Log*: il sito vuole essere
   letto dagli assistenti AI (GEO). Decisione di Giorgia.
3. **Regola personalizzata — limite**: se il percorso inizia con
   `/risorse-educative-bambini` → *Rate limit*, finestra fissa 60 s,
   100 richieste per IP, azione *Deny (429)*. Escludere i bot verificati.
4. **Regola personalizzata — trappola**: se il percorso è
   `/risorse-educative-bambini/elenco-completo-archivio` → *Deny* (o *Log*
   per iniziare). Così il blocco vale su tutte le istanze.
5. **Attack Challenge Mode**: solo durante un attacco in corso, poi spegnerla.
6. **Environment Variables** (Production): `PROTEZIONE_SALE` = una stringa
   casuale lunga (rende le impronte dei log non indovinabili).
7. Log Drains: non servono. Se in futuro se ne collega uno, retention breve.

## Test locali (non distruttivi, solo su localhost)

```bash
npm run build && npx next start -p 3100
```

```bash
B=http://localhost:3100/risorse-educative-bambini
# 1. SEO: title, H1, canonical, meta robots, 53 schede, 3 JSON-LD propri
curl -s $B | grep -oE '<title>[^<]*|<h1[^>]*>[^<]*|<link rel="canonical"[^>]*>|<meta name="robots"[^>]*>'
curl -s $B | grep -o '<article' | wc -l
# 2. Nessuna email delle realtà (devono uscire solo ciao@giocamizi.it e il segnaposto del modulo)
curl -s $B | grep -oiE '[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}' | sort -u
# 3. Vista filtrata: noindex,follow, 12 schede, pagina inesistente = 404
curl -s "$B?sezione=territorio&pagina=2" | grep -o '<meta name="robots"[^>]*>'
curl -s -o /dev/null -w "%{http_code}\n" "$B?sezione=territorio&pagina=99"
# 4. Raffica: dopo 15 richieste in 10 s arriva 429 con Retry-After
for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code} " -A Test/1 -H "x-real-ip: 10.0.0.1" $B; done; echo
# 5. Stesso IP, altro browser (scuola): passa
curl -s -o /dev/null -w "%{http_code}\n" -A Altro/2 -H "x-real-ip: 10.0.0.1" $B
# 6. Trappola: 404, poi 403 per quell'impronta, 200 per gli altri
curl -s -o /dev/null -w "%{http_code}\n" -A Bot/1 -H "x-real-ip: 10.0.0.2" $B/elenco-completo-archivio
curl -s -o /dev/null -w "%{http_code}\n" -A Bot/1 -H "x-real-ip: 10.0.0.2" $B
# 7. Finto Googlebot: limiti normali; Googlebot da IP ufficiale: mai limitato
for i in $(seq 1 17); do curl -s -o /dev/null -w "%{http_code} " -A "Googlebot/2.1" -H "x-real-ip: 10.0.0.3" $B; done; echo
for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code} " -A "Googlebot/2.1" -H "x-real-ip: 66.249.66.1" $B; done; echo
# 8. Nessun JSON con l'archivio
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/api/risorse
```

Dopo il deploy (solo lettura, poche richieste): Search Console → Controllo
URL sull'hub, e il Rich Results Test per BreadcrumbList e FAQPage.
