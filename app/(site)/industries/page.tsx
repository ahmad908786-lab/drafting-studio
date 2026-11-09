import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBand } from "@/components/shared/cta-band";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { getIndustries } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/industries") },
  title: "MEP Drafting Services by Industry",
  description:
    "MEP drafting services by industry: 2D AutoCAD drafting for franchise, residential, commercial, restaurant, healthcare, salon, hotel, apartments and offices.",
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
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every building type has its own code hooks. Restaurants need kitchen
              ventilation, gas and grease coordination. Healthcare needs medical power,
              egress lighting and fire alarm coverage. Multifamily needs stacked
              plumbing and sprinkler coverage that repeats cleanly from floor to floor.
              We draft around those traps instead of discovering them at plan review.
            </p>
          </div>

          <IndustryGrid
            industries={industries.map((i) => ({ slug: i.slug, name: i.name, icon: i.icon }))}
          />
        </div>
      </section>
      <section className="border-t border-border bg-secondary/40 py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">One studio, every sector</h2>
          <p className="mt-3 text-muted-foreground">
            The same team drafts for all of these industries, so what we learn on one project carries into the next. Franchise clients get their prototype locked and adapted per site and jurisdiction, keeping every location consistent to the sheet. Single-site clients get the same treatment: drawings built to their CAD standard, coordinated across disciplines, and ready for their engineer to review and stamp.
          </p>
          <p className="mt-3 text-muted-foreground">
            If your building type is not listed, ask anyway. The list above covers the sectors we serve most, and the drafting process is the same everywhere: send your plans and scope, get a fixed quote within one business day, and receive a layered DWG plus plotted PDF set, QC-checked, with two free minor revisions.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
