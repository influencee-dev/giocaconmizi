import type { Metadata } from "next";
import { Contenitore, TitoloSezione } from "@/components/ui";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Chi c'è dietro Gioca con Mizi: perché costruiamo giochi educativi gratis, senza pubblicità e senza timer.",
  alternates: { canonical: "/chi-siamo" },
};

export default function ChiSiamoPage() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Chi siamo</h1>

      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Gioca con Mizi nasce da una domanda semplice: perché i giochi per bambini
        online sono pieni di pubblicità, di timer e di schermate che chiedono di
        pagare proprio quando il bambino si sta divertendo.
      </p>

      <section className="mt-10">
        <TitoloSezione>Come lavoriamo</TitoloSezione>
        <ul className="flex flex-col gap-3 text-lg text-notte-tenue">
          <li>Un gioco insegna una cosa sola, e la insegna bene.</li>
          <li>Nessun timer, nessun &laquo;hai perso&raquo;: se sbaglia, si riprova.</li>
          <li>La voce spiega cosa fare, così giocano anche i bambini che non leggono.</li>
          <li>Ogni gioco viene provato da un bambino vero prima di essere pubblicato.</li>
        </ul>
      </section>

      <section className="mt-10">
        <TitoloSezione>Come ci manteniamo</TitoloSezione>
        <p className="max-w-2xl text-lg text-notte-tenue">
          I giochi restano gratis e senza pubblicità. Quello che vendiamo sono
          prodotti nostri: schede stampabili, libri di attività, compiti delle
          vacanze. Una parte del ricavato va a un&apos;associazione per l&apos;infanzia.
        </p>
      </section>
    </Contenitore>
  );
}
