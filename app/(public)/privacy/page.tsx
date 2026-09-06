import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FacciaMizi } from "@/games/_engine/arte";
import { AGGIORNATA, FORNITORI, TITOLARE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Come Gioca con Mizi tratta i dati: pochi dati, nessuna pubblicità, nessuna profilazione. Informativa ai sensi degli articoli 13 e 14 del GDPR.",
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
      <div className="mt-6 flex items-start gap-4 rounded-morbido border-2 border-crema-scuro bg-white p-5">
        <span className="h-14 w-14 shrink-0" aria-hidden>
          <FacciaMizi emozione="felice" />
        </span>
        <div className="flex flex-col gap-2 text-notte">
          <p className="font-extrabold">In parole semplici</p>
          <p className="text-notte-tenue">
            Si gioca senza registrazione e senza dare nessun dato. Non c&apos;è pubblicità,
            non ci sono tracciatori di terze parti e non vendiamo niente a nessuno.
            Chiediamo un&apos;email solo se vuoi tu — per entrare nell&apos;area genitori o per
            ricevere le novità — e dei bambini non raccogliamo mai il nome né una foto:
            al massimo la fascia d&apos;età e un soprannome, se il genitore vuole.
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
          <strong className="text-notte">Cosa non facciamo:</strong> niente pubblicità,
          niente profilazione, niente analytics di terze parti, niente vendita o cessione
          di dati, niente social network incorporati.
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
      </Sezione>

      <Sezione titolo="Per quanto conserviamo i dati">
        <p>
          L&apos;account e i suoi dati restano finché non lo cancelli. L&apos;iscrizione alle
          novità resta finché non ti disiscrivi. I log tecnici dell&apos;hosting vengono
          conservati per il breve periodo previsto dal fornitore per la sicurezza.
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
          . Se ritieni che un trattamento violi le regole puoi fare reclamo al Garante per
          la protezione dei dati personali (
          <a href="https://www.garanteprivacy.it" className="font-bold text-viola underline underline-offset-4" rel="noopener noreferrer">
            garanteprivacy.it
          </a>
          ).
        </p>
      </Sezione>

      <Sezione titolo="Cookie e dati salvati nel browser">
        <p>
          Il sito non usa cookie di profilazione né di terze parti: per questo non trovi
          nessun banner. L&apos;elenco completo e aggiornato di quello che salviamo nel tuo
          browser è nella{" "}
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
