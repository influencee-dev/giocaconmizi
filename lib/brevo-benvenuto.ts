/**
 * L'email di benvenuto: parte una volta sola, quando la mamma ha toccato
 * «Confermo l'iscrizione» (lib/brevo.ts → inviaBenvenuto). Foto vera di
 * Giorgia e Domiziana (public/email/, JPG perché alcuni programmi di posta
 * non aprono il WebP), tre bottoni verso il sito e, molto in piccolo in
 * fondo, i progetti di Giorgia e la nota che tutto è gestito gratuitamente
 * da Partidea SRL. {{ params.NOME }} è il nome della mamma, se l'ha dato.
 */

import { SOCIETA } from "./legal";

const SITO = "https://giocamizi.it";
const UTM = "utm_source=brevo&utm_medium=email&utm_campaign=benvenuto";
const link = (percorso: string) => `${SITO}${percorso}${percorso.includes("?") ? "&" : "?"}${UTM}`;

export const OGGETTO_BENVENUTO = "Grazie dell'iscrizione a Giocamizi";

const bottone = (href: string, testo: string, colore: string, scuro = false) =>
  `<a href="${href}" style="display:block;background:${colore};color:${scuro ? "#1F2430" : "#FFFFFF"};font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 18px;border-radius:14px;text-align:center;margin:0 0 10px 0;">${testo}</a>`;

/** I progetti di Giorgia, in piccolo nel piè di pagina. */
const PROPRIETA: [string, string][] = [
  ["giocamizi.it", SITO],
  ["Instagram @giocamizi", "https://www.instagram.com/giocamizi"],
  ["partidea.it", "https://partidea.it"],
  ["influencee.it", "https://influencee.it"],
  ["socialee.it", "https://socialee.it"],
];

export function htmlBenvenuto(): string {
  const progetti = PROPRIETA.map(([testo, href]) => `<a href="${href}" style="color:#4A5164;text-decoration:underline;">${testo}</a>`).join(" · ");
  return `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Grazie dell'iscrizione a Giocamizi</title></head><body style="margin:0;padding:0;background:#FFF3E6;">
<div style="display:none;max-height:0;overflow:hidden;">Ti scrivo solo quando c'è un gioco, una guida o un'idea nuova.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3E6;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:22px;">
<tr><td style="padding:26px 28px 6px 28px;font-family:Arial,Helvetica,sans-serif;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;"><img src="${SITO}/email/mizi.png" width="44" height="54" alt="" style="display:block;border:0;"></td><td style="vertical-align:middle;padding-left:10px;font-size:22px;font-weight:bold;color:#9B6DD6;">Giocamizi</td></tr></table></td></tr>
<tr><td style="padding:14px 28px 0 28px;font-family:Arial,Helvetica,sans-serif;color:#1F2430;"><p style="margin:0;font-size:26px;line-height:1.25;font-weight:bold;">Grazie dell'iscrizione{% if params.NOME %}, {{ params.NOME }}{% endif %}!</p></td></tr>
<tr><td style="padding:18px 28px 0 28px;"><img src="${SITO}/email/giorgia-e-domiziana-giocamizi.jpg" width="504" alt="Giorgia Palazzo con la figlia Domiziana, da cui è nato Giocamizi" style="display:block;width:100%;max-width:504px;height:auto;border:0;border-radius:18px;"></td></tr>
<tr><td style="padding:18px 28px 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1F2430;">
<p style="margin:0 0 14px 0;">Sono Giorgia. Giocamizi l'ho creato nell'estate 2026 con mia figlia Domi, che non aveva voglia di fare i compiti: per spronarla ho iniziato a giocarci insieme. Domi ha scelto una pinguina, le abbiamo dato i suoi capelli e un pezzetto del suo nome: Mizi.</p>
<p style="margin:0 0 14px 0;">È tutto gratis, senza pubblicità e senza timer. Ti scrivo solo quando c'è qualcosa di nuovo e utile: un gioco, una guida, un'idea per la festa.</p>
<p style="margin:0 0 18px 0;">Da dove cominciare:</p>
${bottone(link("/giochi"), "🎲 Scegli un gioco per la sua età", "#9B6DD6")}
${bottone(link("/biglietti/crea"), "🎂 Crea l'invito di compleanno", "#F28AB2")}
${bottone(link("/guide"), "📚 Leggi le guide per genitori", "#F9C846", true)}
<p style="margin:12px 0 0 0;">A presto,<br><strong>Giorgia</strong></p>
</td></tr>
<tr><td style="padding:22px 28px 26px 28px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.55;color:#4A5164;">
<p style="margin:0 0 6px 0;border-top:1px solid #F6E3CF;padding-top:16px;">Giocamizi è un progetto di Giorgia Palazzo, gestito gratuitamente da ${SOCIETA.ragioneSociale}, ${SOCIETA.sede}, P.IVA ${SOCIETA.piva}.</p>
<p style="margin:0 0 6px 0;">${progetti}</p>
<p style="margin:0;">Ricevi questa email perché ti sei iscritta alla posta di Giocamizi. Per non ricevere più le nostre email basta rispondere «cancellami» a questa, oppure toccare «Cancella l'iscrizione» in fondo alle prossime. <a href="${SITO}/privacy" style="color:#4A5164;">Privacy</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}
