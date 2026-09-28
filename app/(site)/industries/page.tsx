import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBand } from "@/components/shared/cta-band";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { getIndustries } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "2D AutoCAD drafting for franchise, residential, commercial, restaurant, healthcare, salon, hotel, apartments, plaza, offices and warehouse projects.",
};

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Drafting for every building type"
        description="We know the code hooks and coordination traps of each sector — and draft around them. Explore the industries we serve most."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />
      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="lg:pt-2">
            <h2 className="text-balance font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Industry Verticals
            </h2>
            <span className="mt-4 block h-1 w-16 rounded-full bg-primary" aria-hidden />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Industries we serve. Pick a sector to see the scope we draft for it, the
              traps we design around, and the services that apply.
            </p>
          </div>

          <IndustryGrid
            industries={industries.map((i) => ({ slug: i.slug, name: i.name, icon: i.icon }))}
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
