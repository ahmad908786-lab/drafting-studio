import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/theme";
import { absoluteUrl } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.descriptor,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.descriptor,
    url: absoluteUrl(),
    images: [`/api/og?eyebrow=${encodeURIComponent("Drafting Studio")}&title=${encodeURIComponent(brand.tagline)}`],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.descriptor,
    images: [`/api/og?title=${encodeURIComponent(brand.tagline)}`],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a1f44",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  description: brand.descriptor,
  url: absoluteUrl(),
  email: brand.contact.email,
  areaServed: "US",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: brand.contact.email,
    areaServed: "US",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: brand.contact.addressLine1,
    addressLocality: brand.contact.city,
    addressRegion: brand.contact.state,
    postalCode: brand.contact.zip,
    addressCountry: "US",
  },
  sameAs: [brand.socials.linkedin, brand.socials.facebook, brand.socials.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${inter.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
