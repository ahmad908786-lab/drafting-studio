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
  const metaTitle = `${cat.name} Services`;
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

  return (
    <>
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
                  category: { slug: cat.slug, icon: cat.icon },
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

      <CtaBand />
    </>
  );
}
