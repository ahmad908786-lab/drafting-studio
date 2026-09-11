import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { StatBand } from "@/components/shared/stat-band";
import { Mdx } from "@/components/mdx/mdx";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/shared/cta-band";
import { getIndustryBySlug, getServiceCategories, getTestimonials } from "@/lib/queries";
import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  const rows = await prisma.industry.findMany({ select: { slug: true } });
  return rows.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = await getIndustryBySlug(slug);
  if (!ind) return {};
  return {
    title: ind.seoTitle ?? `${ind.name} Drafting Services`,
    description: ind.seoDesc ?? ind.shortDesc,
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = await getIndustryBySlug(slug);
  if (!ind) notFound();

  const [categories, testimonials] = await Promise.all([
    getServiceCategories(),
    getTestimonials(true),
  ]);

  const painPoints = (ind.painPoints as string[]) ?? [];
  const stats = (ind.stats as { value: string; label: string }[]) ?? [];
  const testimonial = testimonials[0];

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={`${ind.name} Drafting`}
        description={ind.shortDesc}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: ind.name }]}
      >
        <Button asChild variant="accent" size="lg">
          <Link href={`/request-quote?industry=${ind.slug}`}>Request a Quote <ArrowRight className="size-4" /></Link>
        </Button>
      </PageHero>

      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <Mdx source={ind.bodyMdx} />
            {painPoints.length > 0 && (
              <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-6">
                <h2 className="font-sans text-lg font-bold text-foreground">What we solve for {ind.name.toLowerCase()}</h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {painPoints.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {ind.heroImage && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-border">
                <Image src={ind.heroImage} alt={ind.name} fill sizes="360px" className="object-cover" />
              </div>
            )}
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h3 className="mb-3 text-sm font-bold text-foreground">Services for {ind.name.toLowerCase()}</h3>
              <ul className="space-y-1.5">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/services/${c.slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <Icon name={c.icon} className="size-4 text-primary" /> {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="border-y border-border bg-secondary/40 py-12">
          <div className="container-page">
            <StatBand stats={[...stats, { value: "50", label: "States Covered" }, { value: "48 hrs", label: "Typical Turnaround" }].slice(0, 4)} />
          </div>
        </section>
      )}

      {testimonial && (
        <section className="border-t border-border bg-secondary/40 py-14">
          <div className="container-page max-w-2xl">
            <TestimonialCard t={testimonial} />
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
