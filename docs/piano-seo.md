# Piano SEO, GEO e AEO di Giocamizi: la coda dei cantieri

Scritto il 23/11/2026, dalla ricerca del 22/11 (Ubersuggest, Italia: 81 ricerche su 700,
pagina «Ricerca SEO Giocamizi», copia su Drive in 2 Aree → Sito e SEO). Il metodo è nella
skill `.claude/skills/seo-geo-aeo-manager/SKILL.md`; le ricerche, con lo stato di ognuna, in
`content/seo/parole-chiave.json`; la misura è `npm run seo:copertura`.

Si fa **un cantiere alla volta**, dall'alto. Chi lo chiude cambia la sua riga qui sotto
(stato, data, cosa è cambiato nei numeri) e lascia la nota in «0 Bacheca». Il co-work
quotidiano delle 7:00 ne prende un pezzo nel suo turno (d) «SEO/AEO tecnico».

Stati: **fatto** · **in corso** · **da fare** · **da decidere** (serve una risposta di Giorgia) ·
**di un'altra chat** (lo fa chi possiede quella parte del sito).

| # | Cantiere | Ricerche (al mese) | Stato |
|---|---|---|---|
| 1 | Titoli per Google dei giochi | tabelline 90.500, disegni da colorare 110.000, sottrazioni… | **fatto** 23/11 |
| 2 | Natale | auguri 40.500, disegni di Natale 27.100, lavoretti 18.100 | fatto il 24-26/11/2026 (co-work), restano le guide della routine articoli |
| 3 | Elenchi scritti nelle pagine dei giochi | tabelline dal 1 al 10 18.100, doppie 4.400+3.600+3.600, MB e MP 1.600 | da fare |
| 4 | Una pagina per tabellina | tabelline 7 18.100, del 3 9.900 (e le altre) | da fare |
| 5 | Le pagine delle classi tutto l'anno | esercizi seconda elementare 1.600+720, prima 1.600, terza 1.000 | **fatto** 23/11 |
| 6 | «Vicino a me» negli hub della directory | parco avventura vicino a me 5.400, ludoteca 4.400, parco acquatico 3.600… | fatto il 26/11/2026 |
| 7 | Inviti e biglietti: le parole che mancano | inviti digitali 1.900, frasi per inviti 880, cosa scrivere 390 | da fare |
| 8 | Storie: «favole della buonanotte» | 12.100 + 720 | da fare |
| 9 | Stampabili veri (PDF) | disegni da colorare da stampare 40.500, puntini 880 | da fare |
| 10 | Autorità: bollino per i locali e link dalle scuole | tutte (autorità oggi 1/100) | da fare |
| 11 | Search Console, Bing e IndexNow | tutte | da fare (serve la chiave) |
| 12 | Entità per le AI: chi c'è dietro Giocamizi | tutte le risposte AI | da fare |
| 13 | Misura mensile della visibilità nelle risposte AI | tutte | da fare (primo giro a dicembre) |

## 1. Titoli per Google dei giochi · fatto il 23/11/2026

Campo nuovo `titoloSeo` nel frontmatter di `content/games/<slug>.md`: diventa il `<title>` e
l'`og:title` della pagina del gioco; il nome del gioco resta nell'H1, nel catalogo e
nell'album. Fatto per 14 giochi (tabelline, colora-con-mizi, pixel-art, pizza-delle-frazioni,
addizioni-entro-20, piu-e-meno, problemi-con-mizi, numeri-in-ordine, le-doppie,
leggi-e-rispondi, mb-o-mp, trova-le-differenze, unisci-i-puntini, unisci-le-sillabe).

Risultato misurato sul server locale: ricerche presenti nel titolo **da 21 a 34 su 81**,
volume coperto dal titolo **dal 29% al 46%** (da 257.000 a 414.000 ricerche al mese).
17 righe segnate «fatto»: le protegge la batteria SEO.

## 2. Natale · della chat del co-work

`/natale` lo tocca solo il co-work (decisione del 14/11): la richiesta è in «0 Richieste di
Giorgia» («2026-11-23 · natale · parole cercate per Natale»). Cosa contiene, in ordine di
volume: biglietto di auguri di Natale con frasi pronte (40.500 + 22.200 + 12.100), disegni di
Natale da colorare (27.100) e pixel art di Natale (5.400), «villaggi di Babbo Natale» negli
eventi città per città (18.100), «lettera» oltre a «letterina» nel titolo della letterina
(14.800). Le guide «Lavoretti di Natale facili» (18.100 + 8.100), «Babbo Natale esiste? Cosa
rispondere» (12.100) e i nomi delle renne (5.400) sono idee per la routine articoli delle 9:00.
Picco dal 25/11 al 24/12: dopo il 15/12 non conviene più cominciare.

Fatto (co-work, 24-26/11/2026): auguri con frasi brevi in `/natale/biglietti-di-natale`, «lettera»
nel titolo della letterina, villaggi di Babbo Natale in ogni città degli eventi, voce «Biglietti di
Natale» in `/biglietti`, i giochi «Pixel art di Natale» e «Colora il Natale», la pagina
`/natale/disegni-da-colorare` con dieci PDF A4. Restano alla routine articoli le tre guide.

## 3. Elenchi scritti nelle pagine dei giochi

Sotto il gioco, nel testo di `content/games/<slug>.md`, gli elenchi che la gente cerca come
elenchi: la tabella delle tabelline dal 1 al 10 (`tabelline`), parole con le doppie divise per
lettera e parole con due e tre doppie (`le-doppie`), parole con MB e MP (`mb-o-mp`), i gruppi
BR, PR, STR… con esempi (`i-suoni-difficili`). Parole scelte da noi, mai copiate da un libro.
Sono anche il testo che le AI citano.

## 4. Una pagina per tabellina

Ricerche da 9.900 a 18.100 al mese per ciascuna, dal 2 al 10. Una pagina per numero
(indirizzo da scegliere sotto `/giochi/tabelline/`), con la tabella, i trucchi di quel numero,
due FAQ e il gioco che parte già su quella tabellina (il gioco oggi la fa scegliere a schermo:
serve un parametro nell'indirizzo). Nascono da un elenco, non a mano. Prima si chiude il 3.

## 5. Le pagine delle classi tutto l'anno · fatto il 23/11/2026

Scelta di Giorgia (23/11): strada (a). Le pagine `/compiti-vacanze/prima-elementare` …
`quinta-elementare` restano allo stesso indirizzo (i link che hanno non si perdono) ma
diventano «Esercizi di seconda elementare: matematica e italiano»: H1 «Esercizi di …», giochi
divisi per materia (Matematica, Italiano, Scienze, poi logica e coding), un riquadro «Per i
compiti delle vacanze» e FAQ nuove. Anche il piede, la home, `/per-insegnanti` e llms.txt
dicono «Esercizi per classe». Quattro ricerche segnate «fatto».

## 6. «Vicino a me» negli hub della directory · fatto il 26/11/2026

Fatto in `app/(public)/[categoria]/page.tsx` per tutte le categorie: sotto «In breve» la frase
«Cerchi una ludoteca vicino a te? Scegli la tua città:» con le otto città con più posti come
link, e in fondo la FAQ «Come trovo … vicino a me?» (anche nei dati strutturati). Titolo e H1
restano quelli della categoria: le quattro righe sono «c-e», non «fatto». Prova in verifica/seo.

Gli hub `/parchi-avventura`, `/ludoteche`, `/parchi-acquatici`, `/fattorie-didattiche`, laser
game: una frase vera in apertura («Cerchi un parco avventura vicino a te? Scegli la città») e
le città più grandi come link in vista. Il titolo resta quello della categoria.

## 7. Inviti e biglietti

Nel creatore: dire nella prima riga «senza scaricare app» (in cima a Google oggi ci sono solo
app), «inviti digitali» e «da mandare su WhatsApp», «da stampare». Una pagina «Frasi per gli
inviti di compleanno» che porta al creatore (frasi nostre, già in `lib/biglietti/`).

## 8. Storie

`/storie` si chiama «Storie per bambini da leggere»: la ricerca grande è «favole della
buonanotte» (12.100). Titolo e prima frase con la durata di lettura delle storie brevi.

## 9. Stampabili veri

«Disegni da colorare da stampare» (40.500, difficoltà 15) è la ricerca facile più grande:
i disegni di `colora-con-mizi` in PDF A4 (disegni nostri), una pagina che li raccoglie.
Poi unisci i puntini e le foglie. `scripts/export-pdf.ts` è ancora da fare (TODO interno):
si parte da lì o dalla stampa della pagina con Playwright, come la letterina.

## 10. Autorità

Il bollino «Ci trovi su Giocamizi» (immagine nostra + link alla scheda) da offrire ai locali
e alle realtà nella mail del Registro contatti e nella pagina `/come-reclamare-la-scheda`.
Proposta alle scuole e ai blog di didattica di `/per-insegnanti`. Più avanti, uno studio con
dati nostri (prezzi delle feste per città, dalle schede con fonte e data).

## 11. Search Console, Bing e IndexNow

`GSC_SERVICE_ACCOUNT` su Vercel (in attesa da Giorgia, CLAUDE.md «In attesa»). Bing Webmaster
Tools (si importa da Search Console). IndexNow: una chiave in `public/` e un avviso a ogni
pubblicazione, così Bing (e Copilot, ChatGPT con la ricerca) vedono subito le pagine nuove.

## 12. Entità per le AI

`jsonLdSito` oggi dice solo nome e indirizzo. Aggiungere: logo, `founder` (Giorgia Palazzo),
`parentOrganization` (Partidea SRL, da `lib/contenuti/legal.ts`), `sameAs` coi profili social
ufficiali verificati, `Person` come autrice degli articoli. Stessa descrizione del sito
ovunque (sito, social, schede esterne).

## 13. Misura mensile nelle risposte AI

Il primo lunedì del mese: le ricerche principali in forma di domanda a ChatGPT, Perplexity,
Gemini e Google (AI Overviews), e con Ubersuggest (`brand_prompts`, `brand_citation_gaps`).
Si annota chi viene citato e quale pagina nostra potrebbe esserlo; il riassunto va in
2 Aree → Sito e SEO su Drive con la data.
