import type { MetadataRoute } from "next";
import { url } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Pagine di servizio: nulla da indicizzare, e niente sessioni nei log.
  const privati = ["/api/", "/auth/", "/accedi", "/account"];

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
