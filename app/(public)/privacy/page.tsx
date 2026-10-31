import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FacciaMizi } from "@/games/_engine/arte";
import { AGGIORNATA, FORNITORI, TITOLARE, TITOLARI_AUTONOMI } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Come Giocamizi (Gioca con Mizi) tratta i dati: pochi dati, nessuna pubblicità, nessuna profilazione. Informativa ai sensi degli articoli 13 e 14 del GDPR.",
  alternates: { canonical: "/privacy" },
};

/** Un blocco dell'informativa, con titolo e contenuto libero. */
function Sezione({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-extrabold text-notte sm:text-2xl">{titolo}</h2>
      <div className="flex flex-col gap-3 leading-relaxed text-notte-tenue">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Privacy policy</h1>
      <p className="mt-2 text-sm font-bold text-notte-tenue">
        Ultimo aggiornamento: {AGGIORNATA} · Informativa ai sensi degli artt. 13 e 14 del
        Regolamento (UE) 2016/679 (GDPR)
      </p>

      {/* Il riassunto onesto, prima del legalese */}
      <div className="mt-6 flex items-start gap-4 rounded-[1.4rem] border border-notte/10 bg-white p-5">
        <span className="h-14 w-14 shrink-0" aria-hidden>
          <FacciaMizi emozione="felice" />
        </span>
        <div className="flex flex-col gap-2 text-notte">
          <p className="font-extrabold">In parole semplici</p>
          <p className="text-notte-tenue">
            Si gioca senza registrazione e senza dare nessun dato. Non c&apos;è pubblicità,
            non c&apos;è profilazione e non vendiamo niente a nessuno. Le statistiche di
            visita partono solo se le accetti dal banner. Chiediamo un&apos;email solo se
            vuoi tu — per entrare nell&apos;area genitori o per ricevere le novità — e dei
            bambini non raccogliamo mai il nome né una foto: al massimo la fascia
            d&apos;età e un soprannome, se il genitore vuole.
          </p>
        </div>
      </div>

      <Sezione titolo="Chi è il titolare del trattamento">
        <p>
          {TITOLARE.nome}, {TITOLARE.ruolo}. Per qualsiasi domanda su questa informativa o
          per esercitare i tuoi diritti puoi scrivere a{" "}
          <a href={`mailto:${TITOLARE.email}`} className="font-bold text-viola underline underline-offset-4">
            {TITOLARE.email}
          </a>
          .
        </p>
      </Sezione>

      <Sezione titolo="Quali dati trattiamo, perché e con quale base giuridica">
        <p>
          <strong className="text-notte">1. Navigazione.</strong> Per far funzionare il sito
          il fornitore di hosting registra dati tecnici (indirizzo IP, richieste al server)
          in log di sicurezza. Base giuridica: legittimo interesse a far funzionare e
          proteggere il sito (art. 6.1.f). Non usiamo questi dati per identificarti.
        </p>
        <p>
          <strong className="text-notte">2. Area genitori (facoltativa).</strong> Se crei un
          account salviamo la tua email (l&apos;accesso avviene con un link via email, senza
          password), i progressi nei giochi e, se li inserisci, la fascia d&apos;età e un
          soprannome per ciascun bambino. Base giuridica: esecuzione del servizio che
          richiedi (art. 6.1.b).
        </p>
        <p>
          <strong className="text-notte">3. Novità via email (facoltative).</strong> Se ti
          iscrivi salviamo l&apos;email e i campi facoltativi che scegli di darci (nome,
          città, professione, età del bambino). Base giuridica: il tuo consenso
          (art. 6.1.a), che non è mai pre-spuntato e puoi revocare quando vuoi con il link
          in fondo a ogni email.
        </p>
        <p>
          <strong className="text-notte">4. Statistiche (solo col tuo consenso).</strong>{" "}
          Se accetti dal banner, usiamo Google Analytics per capire quante persone
          visitano il sito e quali giochi piacciono. È configurato al minimo: niente
          Google Signals, niente personalizzazione degli annunci. Base giuridica: il tuo
          consenso (art. 6.1.a); se rifiuti, lo strumento non viene proprio caricato e
          puoi cambiare idea in ogni momento dalla cookie policy.
        </p>
        <p>
          <strong className="text-notte">5. Schede delle attività (ludoteche, sale feste, musei…).</strong>{" "}
          Le pagine Feste e la directory descrivono attività reali. I dati vengono solo da
          fonti pubbliche: il sito ufficiale dell&apos;attività e le pagine che lei stessa
          pubblica (nome, zona, tipo di attività, descrizione dei servizi, indirizzo del
          sito). Email e telefoni non vengono pubblicati né conservati sul sito. Se
          l&apos;attività usa il suo link personale per confermare, correggere o chiedere
          di togliere la scheda, salviamo la risposta, i testi che invia, la data e
          un&apos;impronta cifrata del link (mai il link in chiaro). Base giuridica:
          legittimo interesse a informare le famiglie su dove festeggiare (art. 6.1.f).
          Questa sezione vale come informativa ai sensi dell&apos;art. 14 GDPR: ogni
          attività può opporsi in qualsiasi momento e la scheda viene tolta.
        </p>
        <p>
          <strong className="text-notte">6. Email che ci scrivi.</strong> Se ci scrivi,
          usiamo il tuo indirizzo e quello che racconti solo per risponderti e per gestire
          la richiesta (art. 6.1.b e 6.1.f). Le email vengono cancellate quando la
          questione è chiusa, salvo che servano per dimostrare di aver dato seguito a una
          richiesta sui dati.
        </p>
        <p>
          <strong className="text-notte">7. Contenuti di terzi incorporati.</strong> Alcune
          pagine possono mostrare un reel di Instagram. Il player non viene caricato finché
          non tocchi «Guarda il reel»: solo da quel momento Instagram (Meta) riceve dati
          come il tuo indirizzo IP e può impostare i suoi cookie, come titolare autonomo e
          secondo la propria informativa.
        </p>
        <p>
          <strong className="text-notte">Cosa non facciamo:</strong> niente pubblicità,
          niente profilazione, niente vendita o cessione di dati, niente decisioni
          automatizzate che producano effetti su di te (art. 22 GDPR). Dare i dati è
          sempre facoltativo: senza email non si perde nessun gioco.
        </p>
      </Sezione>

      <Sezione titolo="I dati dei bambini">
        <p>
          Il sito si usa senza registrazione: un bambino può giocare senza che nessun suo
          dato venga raccolto. L&apos;account è del genitore. Del bambino il genitore può
          indicare soltanto la fascia d&apos;età e, se vuole, un soprannome: mai il nome
          completo, mai una foto, mai dati che lo rendano identificabile. È il principio di
          minimizzazione dell&apos;art. 5 GDPR, ed è una scelta di progetto prima che un
          obbligo.
        </p>
        <p>
          L&apos;iscrizione alle novità e l&apos;area genitori sono riservate agli adulti:
          chi si iscrive dichiara di avere almeno 18 anni. In Italia un minore di 14 anni
          non può prestare da solo il consenso per i servizi online (art. 2-quinquies del
          Codice privacy): se scopriamo che un minore si è iscritto, cancelliamo i suoi
          dati.
        </p>
        <p>
          Il banner delle statistiche è pensato per l&apos;adulto che apre il sito. Se a
          rispondere è stato un bambino, basta cambiare la scelta dalla{" "}
          <Link href="/cookie" className="font-bold text-viola underline underline-offset-4">
            cookie policy
          </Link>
          .
        </p>
      </Sezione>

      <Sezione titolo="Chi tratta i dati per noi">
        <p>
          Ci appoggiamo a pochi fornitori, scelti anche per dove tengono i dati. Agiscono
          come responsabili del trattamento (art. 28 GDPR):
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {FORNITORI.map((f) => (
            <li key={f.nome}>
              <strong className="text-notte">{f.nome}</strong> — {f.scopo}{" "}
              <em>Dove: {f.dove}.</em>
            </li>
          ))}
        </ul>
        <p>
          Con ciascuno vale l&apos;accordo sul trattamento dei dati (DPA) previsto dalle sue
          condizioni di servizio. Ricevono dati come titolari autonomi, solo dopo un tuo
          gesto:{" "}
          {TITOLARI_AUTONOMI.map((t) => (
            <span key={t.nome}>
              <strong className="text-notte">{t.nome}</strong>, {t.quando} (
              <a href={t.informativa} rel="noopener noreferrer" className="font-bold text-viola underline underline-offset-4">
                informativa
              </a>
              ).
            </span>
          ))}
        </p>
        <p>
          <strong className="text-notte">Trasferimenti fuori dall&apos;UE.</strong> I dati
          restano nell&apos;Unione Europea, tranne i possibili trasferimenti verso gli Stati
          Uniti di Vercel e Google, società certificate nel Data Privacy Framework UE-USA
          (decisione di adeguatezza della Commissione europea del 10 luglio 2023, art. 45
          GDPR).
        </p>
      </Sezione>

      <Sezione titolo="Per quanto conserviamo i dati">
        <p>
          L&apos;account e i suoi dati restano finché non lo cancelli. L&apos;iscrizione alle
          novità resta finché non ti disiscrivi. Le statistiche di Google Analytics sono
          conservate per 2 mesi. Le risposte delle attività restano finché la scheda è
          pubblicata, e una richiesta di rimozione viene eseguita entro 30 giorni. I log
          tecnici dell&apos;hosting vengono conservati per il breve periodo previsto dal
          fornitore per la sicurezza.
        </p>
      </Sezione>

      <Sezione titolo="Responsabile della protezione dei dati (DPO)">
        <p>
          Non abbiamo nominato un DPO perché non è obbligatorio (art. 37 GDPR): il sito non
          è un ente pubblico, non monitora le persone in modo regolare e sistematico su
          larga scala e non tratta categorie particolari di dati. Per ogni questione sui
          dati il riferimento è direttamente la titolare, all&apos;indirizzo qui sopra.
        </p>
      </Sezione>

      <Sezione titolo="Come proteggiamo i dati">
        <p>
          Il sito viaggia solo su HTTPS. I database hanno l&apos;accesso bloccato riga per
          riga e funzioni con permessi minimi. I codici personali delle attività sono
          conservati solo come impronta cifrata (SHA-256). L&apos;accesso
          all&apos;area genitori avviene con un link via email, senza password da rubare.
          In caso di violazione dei dati la notifichiamo al Garante entro 72 ore e, se
          serve, alle persone coinvolte (artt. 33 e 34 GDPR).
        </p>
      </Sezione>

      <Sezione titolo="I tuoi diritti">
        <p>
          Puoi chiedere in ogni momento l&apos;accesso ai tuoi dati, la rettifica, la
          cancellazione, la limitazione del trattamento, la portabilità, oppure opporti al
          trattamento e revocare i consensi dati (artt. 15–22 GDPR). Basta un&apos;email a{" "}
          <a href={`mailto:${TITOLARE.email}`} className="font-bold text-viola underline underline-offset-4">
            {TITOLARE.email}
          </a>
          . Rispondiamo entro un mese (art. 12 GDPR). Se ritieni che un trattamento violi le regole puoi fare reclamo al Garante per
          la protezione dei dati personali (
          <a href="https://www.garanteprivacy.it" className="font-bold text-viola underline underline-offset-4" rel="noopener noreferrer">
            garanteprivacy.it
          </a>
          ).
        </p>
      </Sezione>

      <Sezione titolo="Cookie e dati salvati nel browser">
        <p>
          Il banner del primo ingresso ti chiede una cosa sola: il consenso per le
          statistiche. Tutto il resto è tecnico e non ne richiede. L&apos;elenco completo
          e aggiornato di quello che salviamo nel tuo browser è nella{" "}
          <Link href="/cookie" className="font-bold text-viola underline underline-offset-4">
            cookie policy
          </Link>
          .
        </p>
      </Sezione>

      <Sezione titolo="Aggiornamenti di questa informativa">
        <p>
          Se il sito cambierà — per esempio se un giorno aggiungeremo uno strumento di
          statistica — questa pagina verrà aggiornata prima, la data in alto cambierà e, se
          servirà un consenso, te lo chiederemo in modo chiaro. Niente entra nel sito senza
          entrare prima qui.
        </p>
      </Sezione>
    </Contenitore>
  );
}
