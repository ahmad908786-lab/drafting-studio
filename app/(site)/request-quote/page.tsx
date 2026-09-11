import type { Metadata } from "next";
import { Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { getAllServices, getIndustries, getServiceCategories } from "@/lib/queries";
import { parseCsvParam } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Get a fixed 2D AutoCAD drafting quote in under 24 hours. Tell us your scope and upload your plans.",
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

  const serviceOpts = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    category: catName.get(s.category.slug) ?? s.category.slug,
  }));

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
    </>
  );
}
