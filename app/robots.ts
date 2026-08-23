import type { MetadataRoute } from "next";
import { url } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Pagine di servizio: nulla da indicizzare, e niente sessioni nei log.
        disallow: ["/api/", "/auth/", "/accedi", "/account"],
      },
    ],
    sitemap: url("/sitemap.xml"),
    host: url("/"),
  };
}
