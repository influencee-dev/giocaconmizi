import type { Metadata, Viewport } from "next";
import { Nunito, Lexend } from "next/font/google";
import { site, url } from "@/lib/seo";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

// Font ad alta leggibilità per le letture (piano §4.1)
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(url("/")),
  // Verifica della proprieta su Google Search Console (tag HTML).
  verification: { google: "n759tXs0ypLjV_uHMPFzt7MCbk6v6-3vA-5Sam42l_0" },
  title: {
    default: site.titoloDefault,
    template: `%s — ${site.nome}`,
  },
  description: site.descrizioneDefault,
  applicationName: site.nome,
  authors: [{ name: site.autore }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: site.nome,
    title: site.titoloDefault,
    description: site.descrizioneDefault,
    url: url("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: site.titoloDefault,
    description: site.descrizioneDefault,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFF3E6",
  width: "device-width",
  initialScale: 1,
  // I bambini toccano ovunque: lo zoom resta possibile, non lo blocchiamo.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${nunito.variable} ${lexend.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
