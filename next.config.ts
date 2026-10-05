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
      // The client portal is retired — old bookmarks land on the admin sign-in.
      { source: "/portal/:path*", destination: "/admin", permanent: false },
      { source: "/login", destination: "/admin", permanent: false },
      { source: "/register", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
