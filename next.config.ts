import type { NextConfig } from "next";

/**
 * Content Security Policy: il browser carica solo da noi e dai pochi servizi
 * dichiarati nella privacy policy (Supabase, Google Analytics dopo il
 * consenso, il player di Instagram dopo il tocco). Next.js usa script inline
 * per l'idratazione: per questo 'unsafe-inline' resta negli script.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://vercel.live",
  "frame-src https://www.instagram.com https://vercel.live",
  "media-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Le pagine pubbliche sono statiche/ISR: velocità = SEO + bambini impazienti (piano §4.1).
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js"],
  },
  async redirects() {
    // L'indirizzo canonico è uno solo: gli alias vecchi del progetto Vercel
    // reindirizzano lì in modo permanente (SEO + niente doppioni).
    // Quando il dominio giocaconmizi.com sarà attivo, aggiungere qui anche
    // "giocaconmizi.vercel.app" e cambiare destinazione.
    const vecchiHost = ["giocaconmizi-influencees-projects.vercel.app"];
    return vecchiHost.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://giocaconmizi.vercel.app/:path*",
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
