/**
 * Le tre email della serie di benvenuto (richiesta di Giorgia del 27/11/2026):
 * storie vere per far conoscere Giocamizi, dire che è gratis e chiedere di
 * farlo girare. Bozze da approvare: «Email di benvenuto Giocamizi · tre bozze
 * (27-11-2026)» su Drive, 1 Progetti.
 *
 * - Email 1, subito: la manda il sito alla conferma (lib/email/brevo.ts →
 *   inviaBenvenuto), al posto del benvenuto di oggi, quando Giorgia dà l'ok.
 * - Email 2 (dopo 2 giorni) e 3 (dopo 5): automazione Brevo sulla lista
 *   «Giocamizi · Genitori»; l'HTML si genera con `npx tsx scripts/email-serie.ts`.
 *
 * Solo fatti già scritti sul sito (Chi siamo, Perché lo facciamo): niente
 * episodi inventati. Tono: niente «bimbi», «magico», «fantastico».
 * La community è su Instagram (decisione di Giorgia del 27/11/2026): le email
 * invitano a scrivere «MIZI» in DM a @giocamizi, e l'automazione dei messaggi (le
 * di Meta Business Suite, senza ManyChat) risponde con l'invito al canale e i giochi.
 * Finché COMMUNITY_ATTIVA è false, i riquadri della community non compaiono.
 */

import { SOCIETA } from "../contenuti/legal";

const SITO = "https://giocamizi.it";

/** Si accende quando l'automazione dei messaggi su Instagram risponde a «MIZI». */
export const COMMUNITY_ATTIVA = false;

/** La parola che fa partire l'automazione nei messaggi di Instagram. */
export const PAROLA_CHIAVE = "MIZI";

/** Apre direttamente la chat con @giocamizi su Instagram. */
export const LINK_DM_INSTAGRAM = "https://ig.me/m/giocamizi";

/** Il messaggio già scritto per il passaparola (email 3). */
export const MESSAGGIO_PASSAPAROLA =
  "Ti giro questo sito: giochi educativi gratis per bambini dai 3 ai 12 anni, senza pubblicità e senza registrazione. https://giocamizi.it";

type Numero = 1 | 2 | 3;

const link = (percorso: string, n: Numero) =>
  `${SITO}${percorso}${percorso.includes("?") ? "&" : "?"}utm_source=brevo&utm_medium=email&utm_campaign=benvenuto-${n}`;

const bottone = (href: string, testo: string, colore: string, scuro = false) =>
  `<a href="${href}" style="display:block;background:${colore};color:${scuro ? "#1F2430" : "#FFFFFF"};font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 18px;border-radius:14px;text-align:center;margin:0 0 10px 0;">${testo}</a>`;

const p = (testo: string) => `<p style="margin:0 0 14px 0;">${testo}</p>`;

/** Il riquadro della community su Instagram: vuoto finché l'automazione non è accesa. */
function community(titolo: string, testo: string): string {
  if (!COMMUNITY_ATTIVA) return "";
  return `<div style="background:#FBEAF2;border-radius:16px;padding:16px 18px;margin:6px 0 18px 0;">
<p style="margin:0 0 8px 0;font-weight:bold;font-size:17px;">${titolo}</p>
<p style="margin:0 0 12px 0;">${testo}</p>
<p style="margin:0 0 12px 0;">Scrivi <strong>${PAROLA_CHIAVE}</strong> in un messaggio a @giocamizi: ti rispondo subito con l'invito.</p>
${bottone(LINK_DM_INSTAGRAM, `📩 Scrivi ${PAROLA_CHIAVE} su Instagram`, "#C42A6B")}
</div>`;
}

export interface EmailSerie {
  numero: Numero;
  /** Nome del modello in Brevo. */
  nome: string;
  oggetto: string;
  anteprima: string;
  /** Il saluto col nome: il sito usa i params, l'automazione Brevo il contatto. */
  html: (saluto: "params" | "contatto") => string;
}

function involucro(numero: Numero, anteprima: string, saluto: "params" | "contatto", corpo: string): string {
  const nome =
    saluto === "params"
      ? "{% if params.NOME %} {{ params.NOME }}{% endif %}"
      : "{% if contact.FIRSTNAME %} {{ contact.FIRSTNAME }}{% endif %}";
  const piede =
    saluto === "contatto"
      ? `Ricevi questa email perché ti sei iscritta alla posta di Giocamizi. <a href="{{ unsubscribe }}" style="color:#4A5164;">Cancella l'iscrizione</a> · <a href="${SITO}/privacy" style="color:#4A5164;">Privacy</a>`
      : `Ricevi questa email perché ti sei iscritta alla posta di Giocamizi. Per non ricevere più le nostre email basta rispondere «cancellami» a questa, oppure toccare «Cancella l'iscrizione» in fondo alle prossime. <a href="${SITO}/privacy" style="color:#4A5164;">Privacy</a>`;
  return `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Giocamizi</title></head><body style="margin:0;padding:0;background:#FFF3E6;">
<div style="display:none;max-height:0;overflow:hidden;">${anteprima}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3E6;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:22px;">
<tr><td style="padding:26px 28px 6px 28px;font-family:Arial,Helvetica,sans-serif;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;"><img src="${SITO}/email/mizi.png" width="44" height="54" alt="" style="display:block;border:0;"></td><td style="vertical-align:middle;padding-left:10px;font-size:22px;font-weight:bold;color:#9B6DD6;">Giocamizi</td></tr></table></td></tr>
${numero === 1 ? `<tr><td style="padding:18px 28px 0 28px;"><img src="${SITO}/email/giorgia-e-domiziana-giocamizi.jpg" width="504" alt="Giorgia Palazzo con la figlia Domiziana, da cui è nato Giocamizi" style="display:block;width:100%;max-width:504px;height:auto;border:0;border-radius:18px;"></td></tr>` : ""}
<tr><td style="padding:18px 28px 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1F2430;">
<p style="margin:0 0 14px 0;">Ciao${nome},</p>
${corpo}
</td></tr>
<tr><td style="padding:22px 28px 26px 28px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.55;color:#4A5164;">
<p style="margin:0 0 6px 0;border-top:1px solid #F6E3CF;padding-top:16px;">Giocamizi è un progetto di Giorgia Palazzo, gestito gratuitamente da ${SOCIETA.ragioneSociale}, ${SOCIETA.sede}, P.IVA ${SOCIETA.piva}.</p>
<p style="margin:0;">${piede}</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

export const SERIE_BENVENUTO: EmailSerie[] = [
  {
    numero: 1,
    nome: "Giocamizi · Benvenuto 1 · Com'è nato (subito)",
    oggetto: "Com'è nato Giocamizi (e perché è gratis)",
    anteprima: "Una figlia senza voglia di fare i compiti, e una pinguina.",
    html: (saluto) =>
      involucro(1, "Una figlia senza voglia di fare i compiti, e una pinguina.", saluto, [
        p("grazie di esserti iscritta. Ti racconto in due righe da dove arriva tutto questo."),
        p("Estate 2026. Domi, mia figlia, non aveva nessuna voglia di fare i compiti. Per spronarla ho iniziato a giocarci insieme. Io con lei preferisco cucinare, ma quella volta abbiamo pensato e costruito qualcosa insieme. Ed è stato bello."),
        p("La pinguina l'ha voluta lei, perché è un animale che le piace. Le abbiamo dato i suoi capelli e un pezzetto del suo nome: Domiziana, Mizi."),
        p("Da lì è nato Giocamizi, ed è gratis davvero. Niente pubblicità, niente account da creare, niente timer o «hai perso». Si apre e si gioca."),
        community(
          "Ti aspetto nella community delle mamme su Instagram",
          "Ogni giorno una cosa utile: un gioco per la sua età, un posto per il weekend, un'idea per la festa, un consiglio tra mamme. E non solo cose nostre: anche quello che di buono trovo in giro.",
        ),
        p("Se vuoi cominciare subito:"),
        bottone(link("/giochi", 1), "🎲 Scegli un gioco per la sua età", "#9B6DD6"),
        `<p style="margin:12px 0 0 0;">A presto,<br><strong>Giorgia</strong></p>`,
      ].join("\n")),
  },
  {
    numero: 2,
    nome: "Giocamizi · Benvenuto 2 · Le idee di Domi (giorno 2)",
    oggetto: "Le idee le dà Domi",
    anteprima: "Come nasce un gioco nuovo, e cosa trovi gratis sul sito.",
    html: (saluto) =>
      involucro(2, "Come nasce un gioco nuovo, e cosa trovi gratis sul sito.", saluto, [
        p("ti dico un segreto: i giochi nuovi non li invento io a tavolino. Domi mi racconta cosa le piace e dove fa fatica, e da lì nasce il gioco."),
        p("Nei giochi Mizi spiega a voce cosa fare, così possono giocare anche i bambini che non sanno ancora leggere. Se sbagliano non perdono niente: riprovano, e dopo un paio di tentativi Mizi li aiuta."),
        p("Intanto il sito è cresciuto. Ecco cosa trovi, tutto gratis:"),
        bottone(link("/giochi", 2), "🎲 Più di 50 giochi, dai 3 ai 12 anni", "#9B6DD6"),
        bottone(link("/biglietti/crea", 2), "🎂 Inviti di compleanno, senza scaricare app", "#F28AB2"),
        bottone(link("/feste", 2), "🎈 Dove festeggiare in 78 città", "#F9C846", true),
        bottone(link("/guide", 2), "📚 Guide per genitori", "#3DB5E6"),
        p("Hai un'idea per un gioco, o c'è qualcosa su cui tuo figlio fa fatica? <strong>Rispondi a questa email</strong>: le idee delle mamme e delle maestre sono la fonte principale dei giochi nuovi."),
        community("Un'idea al giorno, già pronta", "Se non l'hai ancora fatto, entra nella community su Instagram: ogni giorno un'idea già pronta."),
        `<p style="margin:12px 0 0 0;"><strong>Giorgia</strong></p>`,
      ].join("\n")),
  },
  {
    numero: 3,
    nome: "Giocamizi · Benvenuto 3 · Il passaparola (giorno 5)",
    oggetto: "Ti chiedo un piccolo favore",
    anteprima: "Giocamizi resta gratis. Mi aiuti a farlo conoscere?",
    html: (saluto) =>
      involucro(3, "Giocamizi resta gratis. Mi aiuti a farlo conoscere?", saluto, [
        p("oggi ti chiedo una cosa, ma prima ti spiego perché."),
        p("Giocamizi non l'ho fatto per guadagnare. Per me il digitale non è un problema: è un amplificatore, e va usato con cura. Per questo qui non ci sono pubblicità, trucchi per farti restare o dati dei bambini. Dietro però c'è tanto lavoro, e l'unico modo per farlo crescere senza pubblicità è il passaparola tra mamme."),
        p("<strong>Il favore è questo: mandalo a un'amica, o nel gruppo WhatsApp della classe.</strong> Ti ho già scritto il messaggio, basta un tocco:"),
        bottone(`https://wa.me/?text=${encodeURIComponent(MESSAGGIO_PASSAPAROLA)}`, "💬 Mandalo su WhatsApp", "#25D366"),
        community("Invita le amiche anche nella community", "Così le idee ce le scambiamo tutte insieme."),
        p("Grazie davvero. Ogni mamma che arriva da un'amica vale più di qualunque pubblicità."),
        `<p style="margin:12px 0 0 0;"><strong>Giorgia</strong></p>`,
      ].join("\n")),
  },
];
