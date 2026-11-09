import type { Metadata } from "next";
import { Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { getAllServices, getIndustries, getServiceCategories } from "@/lib/queries";
import { parseCsvParam, absoluteUrl } from "@/lib/utils";
import { OTHER_QUOTE_SERVICES } from "@/lib/taxonomy";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/request-quote") },
  title: "Request a MEP Drafting Quote",
  description: "Request a MEP drafting quote: fixed-price 2D AutoCAD drafting in under 24 hours for electrical, HVAC, plumbing and fire protection. Fixed pricing, no meetings.",
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const [services, industries, categories] = await Promise.all([
    getAllServices(),
    getIndustries(),
    getServiceCategories(),
  ]);
  const catName = new Map(categories.map((c) => [c.slug, c.name]));

  const serviceOpts = [
    ...services.map((s) => ({
      slug: s.slug,
      name: s.name,
      category: catName.get(s.category.slug) ?? s.category.slug,
    })),
    // Catch-alls, kept last so "Other" sits at the bottom of the picker.
    ...OTHER_QUOTE_SERVICES.map((s) => ({ slug: s.slug, name: s.name, category: s.category })),
  ];

  const initialServices = parseCsvParam(sp.service);
  const initialIndustry = typeof sp.industry === "string" ? sp.industry : "";

  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Get a fixed quote in under 24 hours"
        description="Tell us what you need and send your plans. We reply with a fixed price and delivery date — no meetings, no obligation."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]}
      >
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-primary-foreground/90"><Clock className="size-4.5 text-accent" /> 24-hour quote</span>
          <span className="inline-flex items-center gap-2 font-medium text-primary-foreground/90"><ShieldCheck className="size-4.5 text-accent" /> Fixed pricing</span>
          <span className="inline-flex items-center gap-2 font-medium text-primary-foreground/90"><RefreshCw className="size-4.5 text-accent" /> 2 free revisions</span>
        </div>
      </PageHero>

      <section className="py-14">
        <div className="container-page">
          <QuoteWizard
            services={serviceOpts}
            industries={industries.map((i) => ({ slug: i.slug, name: i.name }))}
            initialServices={initialServices}
            initialIndustry={initialIndustry}
          />
        </div>
      </section>
      <section className="border-t border-border bg-secondary/40 py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">How quoting works</h2>
          <p className="mt-3 text-muted-foreground">
            Tell us what you need and send your plans. The wizard above walks through it in three steps: pick the services, describe the project and the building, then upload your files. You can request a quote for one service or a full coordinated MEP set, and you can add the calculation reports alongside the drafting if the permit needs them.
          </p>
          <p className="mt-3 text-muted-foreground">
            We reply with a fixed price and a delivery date within one business day, with no meeting and no obligation. Most sets are delivered in 3 to 7 business days depending on scope and size, and every set is delivered as a layered DWG plus a plotted PDF, QC-checked, with two free minor revisions. Everything you upload stays confidential and is used only to prepare your quote and your drafting work.
          </p>
          <p className="mt-3 text-muted-foreground">
            To get the most accurate price first time, include the architectural floor plans, any equipment selections or schedules, and the applicable local amendments. If you are not sure what applies, send what you have and we will ask for the rest.
          </p>
        </div>
      </section>
    </>
  );
}
