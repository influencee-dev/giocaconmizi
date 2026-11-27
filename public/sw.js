// Service worker di Giocamizi: rende il sito installabile come app e, se la
// famiglia lo chiede, fa funzionare i giochi senza connessione.
//
// Non mette niente da parte di nascosto. Finché nessuno tocca «Scarica i
// giochi» (components/app/GiochiSenzaRete.tsx) lascia passare tutto alla rete
// e, se manca la connessione mentre si apre una pagina, mostra un messaggio
// gentile. Dopo quel tocco esiste la memoria «giocamizi-senza-rete»
// (la riempie lib/giochi/offline.ts): da lì in poi
//  - codice, voce, disegni e icone si prendono dalla memoria, e quello che
//    manca si aggiunge quando lo si vede con la rete;
//  - le pagine si chiedono prima alla rete (così sono sempre aggiornate) e
//    solo senza rete si usa la copia salvata.
// «Togli i giochi dal telefono» cancella la memoria e tutto torna come prima.
const MEMORIA = "giocamizi-senza-rete";
const STATICI = /^\/(_next\/static|voce|figure|icone|mizi|mascot|app|immagini)\//;
// Mai in memoria: pannello, aree private, accesso, API.
const PRIVATE = /^\/(admin|la-tua-scheda|account|accedi|auth|api|social)(\/|$)/;

const SENZA_RETE = (conGiochi) => `<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Giocamizi</title><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FFF3E6;font-family:system-ui,sans-serif;color:#1F2430;text-align:center;padding:24px">
<div><img src="/app/icona-192.png" width="96" height="96" alt=""><h1 style="font-size:24px">Sei senza connessione</h1>
<p style="color:#4A5164">${conGiochi ? "Questa pagina ha bisogno della rete. I giochi invece li hai sul telefono." : "Mizi ti aspetta: riprova appena torna la rete."}</p>
${conGiochi ? '<p><a href="/giochi" style="display:inline-block;background:#9B6DD6;color:#fff;border-radius:16px;padding:14px 24px;font-weight:800;font-size:16px;text-decoration:none">Vai ai giochi</a></p>' : ""}
<button onclick="location.reload()" style="background:${conGiochi ? "#fff" : "#9B6DD6"};color:${conGiochi ? "#1F2430" : "#fff"};border:${conGiochi ? "2px solid #F6E3CF" : "0"};border-radius:16px;padding:14px 24px;font-weight:800;font-size:16px">Riprova</button></div></body></html>`;

const pagina = (conGiochi) => new Response(SENZA_RETE(conGiochi), { headers: { "content-type": "text/html; charset=utf-8" } });

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

async function statico(richiesta) {
  const memoria = await caches.open(MEMORIA);
  const salvato = await memoria.match(richiesta, { ignoreSearch: true });
  if (salvato) return salvato;
  const risposta = await fetch(richiesta);
  if (risposta.ok && risposta.type === "basic") memoria.put(richiesta, risposta.clone()).catch(() => {});
  return risposta;
}

async function navigazione(richiesta) {
  const scaricati = await caches.has(MEMORIA);
  try {
    return await fetch(richiesta);
  } catch {
    if (!scaricati) return pagina(false);
    const memoria = await caches.open(MEMORIA);
    // L'indirizzo esatto, poi lo stesso senza «?eta=7»: l'età la rimette il gioco (Giocatore.tsx).
    const salvata = (await memoria.match(richiesta)) ?? (await memoria.match(new URL(richiesta.url).pathname, { ignoreSearch: true }));
    return salvata ?? pagina(true);
  }
}

self.addEventListener("fetch", (e) => {
  const richiesta = e.request;
  if (richiesta.method !== "GET") return;
  const url = new URL(richiesta.url);
  if (url.origin !== self.location.origin || PRIVATE.test(url.pathname)) return;

  if (richiesta.mode === "navigate") {
    e.respondWith(navigazione(richiesta));
    return;
  }
  if (STATICI.test(url.pathname)) {
    e.respondWith(caches.has(MEMORIA).then((scaricati) => (scaricati ? statico(richiesta) : fetch(richiesta))));
  }
});
