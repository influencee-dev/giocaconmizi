import Image from "next/image";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { Onda } from "@/components/decor";
import { JsonLd, jsonLdSito } from "@/components/seo/JsonLd";
import { FormGenitore } from "@/components/form/FormGenitore";
import { BannerCookie } from "@/components/legal/BannerCookie";
import { immagineMizi } from "@/lib/immagini";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Il logo vero (public/mizi/mizi-logo.png) sostituisce l'emoji appena c'è.
  const logo = immagineMizi("mizi-logo");

  return (
    <>
      <JsonLd data={jsonLdSito()} />

      <header className="sticky top-0 z-30 border-b-2 border-crema-scuro bg-white/95 backdrop-blur">
        <Contenitore largo className="flex items-center justify-between gap-3 py-2.5">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-notte">
            {logo ? (
              <Image src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" priority />
            ) : (
              <span aria-hidden className="text-2xl">🐧</span>
            )}
            <span>
              Gioca con <span className="text-viola">Mizi</span>
            </span>
          </Link>
          <nav aria-label="Principale" className="flex items-center gap-1 text-base font-bold">
            <Link href="/giochi" className="hidden rounded-bolla px-3 py-2 text-notte-tenue hover:text-viola sm:inline">
              Giochi
            </Link>
            <Link href="/storie" className="hidden rounded-bolla px-3 py-2 text-notte-tenue hover:text-viola sm:inline">
              Storie
            </Link>
            <Link href="/coding" className="hidden rounded-bolla px-3 py-2 text-notte-tenue hover:text-viola sm:inline">
              Coding
            </Link>
            <Link
              href="/giochi"
              data-tap
              className="ml-1 rounded-bolla bg-rosa px-5 py-2.5 font-extrabold text-white transition-colors hover:bg-viola"
            >
              Gioca ora
            </Link>
          </nav>
        </Contenitore>
      </header>

      <main>{children}</main>

      <BannerCookie />

      <footer className="mt-16">
        <Onda colore="#FFFFFF" />
        <div className="bg-white pb-10 pt-4">
          <Contenitore largo className="flex flex-col gap-6">
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
              <Link href="/per-le-mamme" className="hover:text-viola">Per le mamme</Link>
              <Link href="/privacy" className="hover:text-viola">Privacy</Link>
              <Link href="/cookie" className="hover:text-viola">Cookie</Link>
              <Link href="/accedi" className="hover:text-viola">Accedi</Link>
            </nav>
            <p className="text-sm text-notte-tenue">
              Gioca con Mizi — giocaconmizi.com
            </p>
          </Contenitore>
        </div>
      </footer>
    </>
  );
}
