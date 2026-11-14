import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// AI search + training crawlers, explicitly allowed (SEO/AEO/GEO, Nov 2026).
// Blocking a search crawler removes the site from that vendor's AI answers
// entirely (OpenAI: sites opted out of OAI-SearchBot are not shown in
// ChatGPT search answers). The same admin/API disallows apply to them as
// to every other crawler.
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "PerplexityBot",
  "Claude-SearchBot",
  "ChatGPT-User",
  "Claude-User",
  "Bingbot",
  "Googlebot",
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api", "/forgot-password", "/reset-password"];
  return {
    rules: [
      { userAgent: AI_CRAWLERS, allow: ["/", "/api/og"], disallow },
      { userAgent: "*", allow: ["/", "/api/og"], disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
