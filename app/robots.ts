import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ["/", "/api/og"], disallow: ["/admin", "/api", "/forgot-password", "/reset-password"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
