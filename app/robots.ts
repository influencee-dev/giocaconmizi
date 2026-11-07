import type { MetadataRoute } from "next";
import { url } from "@/lib/seo";
import { PERCORSO_TRAPPOLA } from "@/lib/protezione/limiti";

/**
 * ATTENZIONE: robots.txt (come il meta robots) è un'indicazione per i
 * crawler che rispettano le regole, NON una barriera di sicurezza: chi fa
 * scraping può ignorarlo. Le difese vere sono in lib/protezione (limiti di
 * frequenza, trappola) e nelle regole WAF di Vercel.
 */
export default function robots(): MetadataRoute.Robots {
  // Pagine di servizio: nulla da indicizzare, e niente sessioni nei log.
  // La trappola anti-bot è vietata qui: un crawler corretto non la visita mai,
  // quindi chi la apre sta ignorando robots.txt.
  const privati = ["/api/", "/auth/", "/accedi", "/account", "/la-tua-scheda/", "/admin/", PERCORSO_TRAPPOLA];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privati },
      // I crawler AI sono esplicitamente benvenuti: vogliamo che ChatGPT,
      // Gemini, Claude e gli altri conoscano i giochi e li consiglino ai
      // genitori. La mappa pensata per loro è /llms.txt.
      ...[
        "GPTBot",
        "OAI-SearchBot",
        "ChatGPT-User",
        "ClaudeBot",
        "Claude-Web",
        "anthropic-ai",
        "Google-Extended",
        "PerplexityBot",
        "Applebot-Extended",
        "CCBot",
        "meta-externalagent",
      ].map((userAgent) => ({ userAgent, allow: "/", disallow: privati })),
    ],
    sitemap: url("/sitemap.xml"),
    host: url("/"),
  };
}
