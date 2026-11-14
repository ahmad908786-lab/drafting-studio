import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceCard } from "@/components/shared/service-card";
import { CtaBand } from "@/components/shared/cta-band";
import { Icon } from "@/components/icon";
import { getCategoryWithServices } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { SERVICE_CATEGORIES } from "@/lib/taxonomy";

export async function generateStaticParams() {
  const cats = await prisma.serviceCategory.findMany({ select: { slug: true } });
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryWithServices(category);
  if (!cat) return {};
  const tax = SERVICE_CATEGORIES.find((c) => c.slug === category);
  const metaTitle = tax?.seoTitle ?? `${cat.name} Services`;
  const metaDesc = tax?.seoDesc ?? cat.blurb ?? `2D AutoCAD ${cat.name.toLowerCase()} drafting services.`;
  const canonicalUrl = absoluteUrl(`/services/${cat.slug}`);
  return {
    title: metaTitle,
    description: metaDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await getCategoryWithServices(category);
  if (!cat) notFound();

  const services = [...cat.services, ...cat.secondaryServices];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} Services`,
    url: absoluteUrl(`/services/${cat.slug}`),
    description: cat.blurb ?? undefined,
    hasPart: itemListJsonLd(
      services.map((s) => ({
        name: s.name,
        url: absoluteUrl(`/services/${s.category.slug}/${s.slug}`),
      })),
    ),
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <PageHero
        eyebrow="Services"
        title={cat.name}
        description={cat.blurb}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: cat.name }]}
      >
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Icon name={cat.icon} className="size-7" />
        </span>
      </PageHero>

      <section className="py-14">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.slug}
                service={{
                  slug: s.slug, name: s.name, shortDesc: s.shortDesc, turnaroundDays: s.turnaroundDays,
                  // Cross-listed services link to their canonical primary-category
                  // URL, not this (secondary) category's URL.
                  category: { slug: s.category.slug, icon: cat.icon },
                  disciplines: s.disciplines.map((d) => ({ slug: d.slug, label: d.label, color: d.color })),
                }}
              />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              <ArrowRight className="size-4 rotate-180" /> All service categories
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">
            What every {cat.name.toLowerCase()} set includes
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every {cat.name.toLowerCase()} package is delivered as a layered 2D AutoCAD set with plotted PDFs, drafted to the current US codes and to your CAD standard, and QC-checked before delivery. You get a fixed price and a delivery date within one business day of sending your scope, and two free minor revisions are included on every set.
          </p>
          <p className="mt-3 text-muted-foreground">
            This category covers {services.map((s) => s.name).join(", ")}. Send your plans and scope through the quote wizard, or talk to us first if you are not sure which service fits. We will scope it with you and tell you plainly what is included and what is not.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
