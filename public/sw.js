// Service worker di Giocamizi: rende il sito installabile come app.
// Non mette niente in cache di nascosto: lascia passare tutto alla rete e,
// solo se manca la connessione mentre si apre una pagina, mostra un
// messaggio gentile invece della pagina d'errore del browser.
const OFFLINE = `<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Giocamizi</title><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FFF3E6;font-family:system-ui,sans-serif;color:#1F2430;text-align:center;padding:24px">
<div><img src="/app/icona-192.png" width="96" height="96" alt=""><h1 style="font-size:24px">Sei senza connessione</h1>
<p style="color:#4A5164">Mizi ti aspetta: riprova appena torna la rete.</p>
<button onclick="location.reload()" style="background:#9B6DD6;color:#fff;border:0;border-radius:16px;padding:14px 24px;font-weight:800;font-size:16px">Riprova</button></div></body></html>`;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE, { headers: { "content-type": "text/html; charset=utf-8" } })));
});
