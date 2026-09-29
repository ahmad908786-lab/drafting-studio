import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatBand } from "@/components/shared/stat-band";
import { CtaBand } from "@/components/shared/cta-band";
import { VisionMission } from "@/components/marketing/vision-mission";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";
import { brand } from "@/lib/theme";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/about") },
  title: "2D MEP CAD Drafting Studio | About Drafting Studio",
  description:
    "US-focused 2D AutoCAD drafting studio for MEP, fire protection & lighting. Engineering firms, contractors & architects trust us for permit-ready drawings.",
};

const aboutJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Drafting Studio",
    url: absoluteUrl("/about"),
    description: "Learn about Drafting Studio, a US-focused 2D AutoCAD drafting studio for MEP, fire protection and lighting.",
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: brand.name,
    url: absoluteUrl("/about"),
    description: brand.descriptor,
    telephone: brand.contact.phonePrimary,
    email: brand.contact.email,
    areaServed: "US",
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.contact.addressLine1,
      addressLocality: brand.contact.city,
      addressRegion: brand.contact.state,
      postalCode: brand.contact.zip,
      addressCountry: "US",
    },
    sameAs: [brand.socials.linkedin, brand.socials.facebook, brand.socials.instagram],
  },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const stats = (settings?.stats as { value: string; label: string }[]) ?? brand.stats;

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <PageHero
        eyebrow="About"
        title="2D MEP CAD Drafting Studio for Engineering Firms"
        description="We're a US-focused design and drafting studio that does one thing exceptionally well: clean, permit-ready 2D AutoCAD sets for MEP, fire protection and lighting."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <VisionMission />

      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our approach" title="Why we stay 2D" className="mb-4" />
            <div className="space-y-4 text-muted-foreground">
              <p>Most projects — tenant fit-outs, franchise rollouts, light-commercial and residential work — need a permit set, not a model. Power plans, panel schedules, one-lines, ductwork, piping, sprinkler grids: every one is a 2D deliverable.</p>
              <p>By committing to pure 2D AutoCAD, we keep files small and portable, layer standards disciplined, and turnaround fast. Your engineer of record opens the DWG, redlines, and stamps — no round-trip through a model nobody asked for.</p>
              <p>We work for engineering firms, contractors, architects and developers across all 50 states, drafting to your CAD standard and the current US codes: NEC, IMC, IPC, NFPA 13 &amp; 72, and IES.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground bg-blueprint-grid">
            <h3 className="font-sans text-lg font-bold">What we don&apos;t do</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">We&apos;re deliberate about scope. We focus on 2D drafting and calculations so we can be fast and precise. We don&apos;t stamp drawings — that&apos;s your engineer of record — and we don&apos;t do modeling. That focus is the point.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {brand.promises.map((p) => (
                <div key={p} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-12">
        <div className="container-page">
          <StatBand stats={stats} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
