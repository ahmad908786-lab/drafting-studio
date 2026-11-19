import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Hostinger build fix (19 Nov 2026, build 01a1f4f0): the default worker
    // count is os.cpus().length - 1, which was 47 on Hostinger's build host.
    // Each "Collecting page data" worker loads a Prisma query engine, and
    // 47 of them exhausted the sandbox's thread limit (tokio panic: OS
    // can't spawn worker thread, os error 11), aborting the build. Cap the
    // build to 4 workers. If it ever fails again the same way, drop to 2.
    cpus: 4,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      {
        // HSTS: Semrush flagged both draftingstudio.org and
        // www.draftingstudio.org as not sending Strict-Transport-Security.
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
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
