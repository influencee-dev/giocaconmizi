// Le regole del negozio senza server (lanciata da scripts/verifica/negozio.mjs con tsx):
// carrello controllato lato server, file di un acquisto, firma dei webhook di Stripe.
import { createHmac } from "node:crypto";
import { PREZZI, PRODOTTI, controllaCarrello, fileAcquistati } from "../../lib/negozio/catalogo";
import { firmaValida, sessioneValida } from "../../lib/negozio/stripe";

let ko = 0;
const ok = (nome: string, cond: boolean, det = "") => {
  if (!cond) ko++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${nome}${det ? ` — ${det}` : ""}`);
};

// Catalogo: per il Volume 1 libretto, pacchetto e 12 disegni, ognuno con i suoi file.
const v01 = PRODOTTI.filter((p) => p.volume.codice === "v01");
ok("catalogo: 14 prodotti per v01", v01.length === 14, String(v01.length));
ok("catalogo: codici unici", new Set(PRODOTTI.map((p) => p.codice)).size === PRODOTTI.length);
ok("catalogo: ogni prodotto ha file in v01/…pdf", v01.every((p) => p.file.length > 0 && p.file.every((f) => /^v01\/[a-z0-9-]+-A[45]\.pdf$/.test(f.percorso))));
ok("catalogo: prezzi interi positivi", PRODOTTI.every((p) => Number.isInteger(p.prezzo) && p.prezzo > 0));

// Carrello: il server decide, il browser propone.
ok("carrello: vuoto rifiutato", Boolean(controllaCarrello([], true).errore));
ok("carrello: codice sconosciuto rifiutato", Boolean(controllaCarrello(["v99-libretto"], true).errore));
ok("carrello: non stringhe rifiutate", Boolean(controllaCarrello([{ codice: "v01-libretto" }], true).errore));
ok("carrello: oltre 40 righe rifiutato", Boolean(controllaCarrello(Array(41).fill("v01-libretto"), true).errore));
ok("carrello: volume non in vendita rifiutato fuori prova", Boolean(controllaCarrello(["v01-libretto"], false).errore));
const doppi = controllaCarrello(["v01-libretto", "v01-libretto"], true);
ok("carrello: i doppi contano una volta", doppi.prodotti.length === 1 && doppi.totale === PREZZI.libretto);
const conPacchetto = controllaCarrello(["v01-disegno-03", "v01-disegni", "v01-disegno-07"], true);
ok("carrello: i singoli dentro un pacchetto non si pagano", conPacchetto.prodotti.length === 1 && conPacchetto.totale === PREZZI.disegni);
const unoSolo = controllaCarrello(["v01-disegno-01"], true);
ok("carrello: sotto il minimo segnalato", unoSolo.sottoMinimo === PREZZI.disegno < PREZZI.minimo_ordine);

// File di un acquisto: niente doppi, solo quelli dei prodotti comprati.
const file = fileAcquistati(["v01-disegni", "v01-disegno-02", "inventato"]);
ok("file: pacchetto più un singolo = 3 file", file.length === 3, file.map((f) => f.file.chiave).join(","));

// Sessioni Stripe: solo cs_test_/cs_live_.
ok("sessione: formato valido accettato", sessioneValida("cs_test_a1B2c3D4e5F6g7H8i9"));
ok("sessione: altro rifiutato", !sessioneValida("cs_test_../../etc") && !sessioneValida("pi_123") && !sessioneValida(undefined));

// Firma dei webhook.
const segreto = "whsec_prova";
const corpo = JSON.stringify({ type: "checkout.session.completed" });
const ora = Date.now();
const t = Math.floor(ora / 1000);
const firma = createHmac("sha256", segreto).update(`${t}.${corpo}`).digest("hex");
ok("firma: giusta accettata", firmaValida(corpo, `t=${t},v1=${firma}`, segreto, ora));
ok("firma: corpo cambiato rifiutato", !firmaValida(corpo + " ", `t=${t},v1=${firma}`, segreto, ora));
ok("firma: segreto sbagliato rifiutato", !firmaValida(corpo, `t=${t},v1=${firma}`, "whsec_altro", ora));
ok("firma: vecchia di 10 minuti rifiutata", !firmaValida(corpo, `t=${t},v1=${firma}`, segreto, ora + 600_000));
ok("firma: senza intestazione rifiutata", !firmaValida(corpo, null, segreto, ora));
ok("firma: senza segreto rifiutata", !firmaValida(corpo, `t=${t},v1=${firma}`, "", ora));

process.exit(ko ? 1 : 0);
