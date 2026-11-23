import { inviaEmailServizio } from "./brevo";
import { AVVISI, bottone, h, pagina, par } from "./email-servizio";
import { GIORNI_SCARICO, euro, fileAcquistati } from "../negozio/catalogo";

/**
 * Le email del negozio dei PDF (docs/negozio.md), mandate dal webhook di Stripe:
 *   1. a chi ha comprato: il link alla pagina dei suoi PDF;
 *   2. a Giorgia: «hai venduto», con cosa e quanto (niente dati della carta, Stripe non ce li dà).
 * Non bloccano mai il pagamento: se Brevo non risponde, la pagina «grazie» funziona lo stesso.
 */

const SITO = "https://giocamizi.it";

export async function mandaPdfAcquistati(a: string, sessione: string, codici: string[]) {
  const link = `${SITO}/negozio/grazie?sessione=${encodeURIComponent(sessione)}`;
  const elenco = fileAcquistati(codici)
    .map(({ prodotto, file }) => `<li style="margin:0 0 6px;">${h(prodotto.volume.titolo)} · ${h(prodotto.nome)} <span style="color:#5B6070;">(${h(file.nome)})</span></li>`)
    .join("");
  const corpo =
    par("Grazie! I tuoi PDF sono pronti da scaricare e stampare a casa.") +
    `<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.5;">${elenco}</ul>` +
    `<p style="margin:0 0 18px;">${bottone(link, "Scarica i PDF")}</p>` +
    par(`Il link funziona per ${GIORNI_SCARICO} giorni: puoi tornare a scaricarli quando vuoi, anche da un altro dispositivo. Tienilo per te, è il tuo.`) +
    par("Per stampare: carta A4 normale, stampa «a dimensione reale». I disegni due per foglio si tagliano a metà lungo la linea tratteggiata. Il libricino si stampa fronte-retro «sul lato corto»: pieghi i fogli a metà, li infili uno dentro l'altro e li pinzi al centro.") +
    par("Come promemoria: prima di pagare hai chiesto di ricevere subito i PDF e hai preso atto che, con la consegna immediata, il diritto di recesso non si applica (art. 59, lettera o, Codice del consumo). Se un file non si apre o è sbagliato, rispondi a questa email e lo sistemiamo.");
  return inviaEmailServizio({ a, oggetto: "I tuoi disegni di Mizi sono pronti", html: pagina("I tuoi PDF da stampare", corpo), etichetta: "negozio-acquisto" });
}

export async function avvisaVendita(codici: string[], totale: number, prova: boolean) {
  const righe = fileAcquistati(codici)
    .map(({ prodotto }) => `${prodotto.volume.titolo} · ${prodotto.nome}`)
    .filter((r, i, tutte) => tutte.indexOf(r) === i)
    .map((r) => `<li>${h(r)}</li>`)
    .join("");
  const titolo = `${prova ? "[PROVA] " : ""}Nuova vendita nel negozio: ${euro(totale)}`;
  const corpo =
    `<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.5;">${righe}</ul>` +
    par("Il dettaglio del pagamento, la ricevuta e l'email di chi ha comprato sono nel pannello di Stripe.");
  return inviaEmailServizio({ a: AVVISI, oggetto: titolo, html: pagina(titolo, corpo), etichetta: "avviso-vendita" });
}
