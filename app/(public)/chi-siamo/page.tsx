import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { TITOLARE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Gioca con Mizi è nato da una mamma, Giorgia, e da sua figlia Domiziana, che non voleva mai fare i compiti. Giochi gratis, senza pubblicità, per tutte le mamme.",
  alternates: { canonical: "/chi-siamo" },
};

// La foto entra nel sito appena il file esiste in public/: fino ad allora la
// pagina funziona uguale, senza immagini rotte.
const FOTO = "foto-giorgia-domiziana.jpg";
const fotoDisponibile = () => existsSync(join(process.cwd(), "public", FOTO));

export default function ChiSiamoPage() {
  const conFoto = fotoDisponibile();

  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Chi siamo</h1>

      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row">
        {conFoto && (
          <figure className="w-full shrink-0 sm:w-72">
            <div className="overflow-hidden rounded-morbido border-4 border-white shadow-lg">
              <Image
                src={`/${FOTO}`}
                alt="Giorgia e Domiziana, che hanno creato Gioca con Mizi"
                width={640}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <figcaption className="mt-2 text-center text-sm font-bold text-notte-tenue">
              Giorgia e Domiziana 🐧
            </figcaption>
          </figure>
        )}

        <div className="flex max-w-2xl flex-col gap-4 text-lg text-notte-tenue">
          <p>
            Sono <strong className="text-notte">Giorgia</strong>, una mamma. Questo
            sito è nato perché mia figlia non voleva mai fare i compiti — e
            perché, soprattutto, avevo voglia di fare qualcosa per lei.
          </p>
          <p>
            Mia figlia si chiama <strong className="text-notte">Domiziana</strong>.
            Quando abbiamo cercato un nome per il sito, l&apos;abbiamo chiesto
            all&apos;intelligenza artificiale: ne è uscita una piccola pinguina
            con i capelli di Domiziana, che si chiama{" "}
            <strong className="text-notte">Mizi</strong> — un pezzetto del nome di
            mia figlia. Da allora Mizi è la maestra gentile di tutti i giochi:
            spiega a voce, non mette fretta e non sgrida mai.
          </p>
          <p>
            Non voglio guadagnare da questo sito e non sono una marketer: sono
            una mamma che ha voglia di aiutare le altre mamme. Il mio impegno è
            migliorarlo un pezzo alla volta e riempirlo di cose{" "}
            <em>davvero utili e credibili</em> — quelle che arrivano segnalate
            direttamente da voi.
          </p>
          <p>
            Hai un&apos;idea, un gioco che vorresti, una cosa che non funziona?
            Scrivimi:{" "}
            <a
              href={`mailto:${TITOLARE.email}`}
              className="font-bold text-viola underline underline-offset-4"
            >
              {TITOLARE.email}
            </a>
            . Questo sito lo costruiamo insieme.
          </p>
        </div>
      </div>

      <section className="mt-10">
        <TitoloSezione>Come lavoriamo</TitoloSezione>
        <ul className="flex flex-col gap-3 text-lg text-notte-tenue">
          <li>Un gioco insegna una cosa sola, e la insegna bene.</li>
          <li>Nessun timer, nessun &laquo;hai perso&raquo;: se sbaglia, si riprova.</li>
          <li>La voce spiega cosa fare, così giocano anche i bambini che non leggono.</li>
          <li>Ogni gioco viene provato da una bambina vera — Domiziana — prima di essere pubblicato.</li>
          <li>Le idee delle mamme diventano giochi: quello che serve davvero lo decidete voi.</li>
        </ul>
      </section>

      <section className="mt-10">
        <TitoloSezione>Quanto costa</TitoloSezione>
        <p className="max-w-2xl text-lg text-notte-tenue">
          Niente. I giochi sono gratis, senza pubblicità e senza acquisti
          nascosti, e resteranno così: questo è un progetto personale, non
          un&apos;azienda. Se vuoi restare aggiornata sulle novità c&apos;è solo
          una newsletter facoltativa, e i tuoi dati restano tuoi (
          <Link href="/privacy" className="font-bold text-viola underline underline-offset-4">
            come li trattiamo
          </Link>
          ).
        </p>
      </section>
    </Contenitore>
  );
}
