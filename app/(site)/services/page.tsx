import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/shared/service-card";
import { Icon } from "@/components/icon";
import { CtaBand } from "@/components/shared/cta-band";
import { getServiceCategories, getAllServices } from "@/lib/queries";

export const metadata: Metadata = {
  title: "2D Drafting Services",
  description:
    "13 2D AutoCAD drafting services across electrical, mechanical (HVAC + plumbing), fire protection, and engineering calculations & reports.",
};

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([getServiceCategories(), getAllServices()]);

  const byCategory = categories.map((c) => ({
    ...c,
    services: services.filter((s) => s.category.slug === c.slug || s.secondaryCategory?.slug === c.slug),
  }));

  return (
    <>
      <PageHero
        eyebrow="What We Draft"
        title="2D AutoCAD drafting services"
        description="Thirteen services across four disciplines — electrical, mechanical (HVAC + plumbing), fire protection, and engineering calculations. Every one delivered as a clean, permit-ready 2D set."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-white/15">
              <Icon name={c.icon} className="size-4" /> {c.name}
            </a>
          ))}
        </div>
      </PageHero>

      {byCategory.map((cat, idx) => (
        <section key={cat.slug} id={cat.slug} className={`scroll-mt-24 py-14 ${idx % 2 === 1 ? "border-y border-border bg-secondary/40" : ""}`}>
          <div className="container-page">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={cat.icon} className="size-6" />
                </span>
                <SectionHeading as="h2" title={cat.name} description={cat.blurb} />
              </div>
              <Link href={`/services/${cat.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Category overview <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.services.map((s) => (
                <ServiceCard
                  key={s.slug}
                  service={{
                    slug: s.slug, name: s.name, shortDesc: s.shortDesc, turnaroundDays: s.turnaroundDays,
                    category: { slug: s.category.slug, icon: s.category.icon },
                    disciplines: s.disciplines.map((d) => ({ slug: d.slug, label: d.label, color: d.color })),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
