import type { Metadata } from "next";
import Link from "next/link";
import { cardTypes } from "@/cards/registry";
import { Biglietto } from "@/components/biglietti/Biglietto";
import { Contenitore, TitoloSezione } from "@/components/ui";
import { ETA_BIGLIETTI, linkAlTool, temi } from "@/lib/biglietti";

export const metadata: Metadata = {
  title: "Inviti e biglietti di compleanno per bambini, gratis",
  description:
    "Crea gratis inviti, biglietti di auguri e ringraziamenti per il compleanno dei bambini: 25 temi, personalizzabili con nome ed età. Senza registrazione.",
  alternates: { canonical: "/biglietti" },
};

const SEZIONI = [
  { href: "/biglietti/inviti-compleanno-bambini", nome: "Inviti", testo: "Per la festa: data, ora, indirizzo e a chi confermare." },
  { href: "/biglietti/auguri-compleanno-bambini", nome: "Auguri", testo: "Da regalare o da mandare il giorno del compleanno." },
  { href: "/biglietti/ringraziamento-compleanno-bambini", nome: "Ringraziamenti", testo: "Dopo la festa, per chi è venuto." },
  { href: "/biglietti/biglietti-compleanno-da-colorare", nome: "Da colorare", testo: "Stampalo chiaro e lascia il colore a lui." },
  { href: "/biglietti/esempi", nome: "Esempi", testo: "Biglietti veri da cui prendere ispirazione." },
];

export default function BigliettiPage() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Inviti e biglietti di compleanno da personalizzare
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Scegli lo sfondo, scrivi il nome e l&apos;età, scarica. Gratis, senza
        registrazione e senza filigrana. Venticinque temi, ognuno in versione
        chiara e colorata.
      </p>

      <Link
        href={linkAlTool({ tipo: "invito" })}
        data-tap
        className="mt-6 inline-flex items-center justify-center rounded-bolla bg-rosa px-8 py-5 text-xl font-extrabold text-white"
      >
        Crea il tuo, gratis
      </Link>

      <section className="mt-12">
        <TitoloSezione>Che cosa ti serve</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-2">
          {SEZIONI.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              data-tap
              className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5 hover:border-viola"
            >
              <span className="text-xl font-extrabold text-notte">{s.nome}</span>
              <span className="text-notte-tenue">{s.testo}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <TitoloSezione>I temi</TitoloSezione>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {temi.map((t) => (
            <Link
              key={t.theme}
              href={`/biglietti/inviti-compleanno-${t.theme}`}
              className="overflow-hidden rounded-morbido border-4 border-transparent hover:border-viola"
              style={{ minHeight: 0, minWidth: 0 }}
            >
              <Biglietto
                dati={{
                  tipo: "invito",
                  tema: t.theme,
                  variante: "chiaro",
                  nome: "Sofia",
                  eta: "5",
                  frase: "",
                  data: "",
                  ora: "",
                  luogo: "",
                  conferma: "",
                  firma: "",
                  conMizi: false,
                  carattere: "tondo",
                }}
                larghezza={620}
                altezza={874}
              />
              <span className="block bg-white p-2 text-center text-sm font-bold text-notte">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <TitoloSezione>Per età</TitoloSezione>
        <div className="flex flex-wrap gap-2">
          {ETA_BIGLIETTI.map((a) => (
            <Link
              key={a}
              href={`/biglietti/inviti-compleanno-${a}-anni`}
              className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola"
              style={{ minHeight: "2.75rem" }}
            >
              {a} anni
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <TitoloSezione>Cosa scrivere</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/biglietti/frasi-inviti-compleanno-bambini"
            data-tap
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-4 font-bold text-notte hover:border-viola"
          >
            Frasi per gli inviti
          </Link>
          <Link
            href="/biglietti/frasi-auguri-compleanno-bambini"
            data-tap
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-4 font-bold text-notte hover:border-viola"
          >
            Frasi di auguri
          </Link>
        </div>
        <p className="mt-4 text-notte-tenue">
          Tipi disponibili nel creatore: {cardTypes.join(", ")}. Ogni biglietto si
          può salvare in un link e rifare uguale cambiando solo il nome, come
          serve quando gli inviti sono venti.
        </p>
      </section>
    </Contenitore>
  );
}
