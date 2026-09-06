import type { NextConfig } from "next";

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
        ],
      },
    ];
  },
};

export default nextConfig;
