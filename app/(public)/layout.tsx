import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { JsonLd, jsonLdSito } from "@/components/seo/JsonLd";
import { FormGenitore } from "@/components/form/FormGenitore";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={jsonLdSito()} />

      <header className="border-b-2 border-crema-scuro bg-white">
        <Contenitore className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-notte">
            <span aria-hidden className="text-2xl">🐧</span>
            Gioca con Mizi
          </Link>
          <nav aria-label="Principale" className="flex items-center gap-1 text-base font-bold">
            <Link href="/giochi" className="rounded-bolla px-3 py-2 text-notte-tenue hover:text-viola">
              Giochi
            </Link>
            <Link href="/storie" className="rounded-bolla px-3 py-2 text-notte-tenue hover:text-viola">
              Storie
            </Link>
            <Link href="/coding" className="hidden rounded-bolla px-3 py-2 text-notte-tenue hover:text-viola sm:inline">
              Coding
            </Link>
          </nav>
        </Contenitore>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t-2 border-crema-scuro bg-white py-10">
        <Contenitore className="flex flex-col gap-6">
          <div className="max-w-md">
            <FormGenitore
              origine="footer"
              titolo="Vi mandiamo i giochi nuovi?"
              sottotitolo="Una email ogni tanto, con i giochi e le storie nuove. Niente pubblicità."
            />
          </div>

          <p className="text-lg font-extrabold text-notte">
            Giochi gratis, senza pubblicità, senza timer.
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 font-bold text-notte-tenue">
            <Link href="/metodo" className="hover:text-viola">Metodo</Link>
            <Link href="/perche-lo-facciamo" className="hover:text-viola">Perché lo facciamo</Link>
            <Link href="/chi-siamo" className="hover:text-viola">Chi siamo</Link>
            <Link href="/per-insegnanti" className="hover:text-viola">Per insegnanti</Link>
            <Link href="/accedi" className="hover:text-viola">Accedi</Link>
          </nav>
          <p className="text-sm text-notte-tenue">
            Gioca con Mizi — giocaconmizi.com
          </p>
        </Contenitore>
      </footer>
    </>
  );
}
