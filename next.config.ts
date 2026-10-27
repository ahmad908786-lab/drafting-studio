import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      // SEO: the canonical host is draftingstudio.org (no www) — sitemap,
      // robots and every canonical tag already use it, but both hosts were
      // serving content, so Google filed every www page as an "alternate".
      // Force www onto the canonical host, preserving path and query.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.draftingstudio.org" }],
        destination: "https://draftingstudio.org/:path*",
        permanent: true,
      },
      // The client portal is retired — old bookmarks land on the admin sign-in.
      { source: "/portal/:path*", destination: "/admin", permanent: false },
      { source: "/login", destination: "/admin", permanent: false },
      { source: "/register", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
