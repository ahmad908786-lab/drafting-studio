import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Check, FileText, ShieldCheck, XCircle, FileStack, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ProcessTimeline } from "@/components/marketing/process-timeline";
import { ValuePillars } from "@/components/marketing/value-pillars";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Mdx } from "@/components/mdx/mdx";
import { DisciplineChip } from "@/components/shared/discipline-chip";
import { ContactForm } from "@/components/forms/contact-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { getServiceBySlug } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { DELIVERABLE_FORMATS } from "@/lib/taxonomy";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true, category: { select: { slug: true } } },
  });
  return services.map((s) => ({ category: s.category.slug, service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const s = await getServiceBySlug(service);
  if (!s) return {};
  return {
    title: s.seoTitle ?? `${s.name} Services`,
    description: s.seoDesc ?? s.shortDesc,
    openGraph: { images: s.coverImage ? [s.coverImage] : [] },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; service: string }>;
}) {
  const { category, service } = await params;
  const s = await getServiceBySlug(service);
  if (!s || s.category.slug !== category) {
    // Allow reaching via the secondary (cross-listed) category too.
    if (!s || s.secondaryCategory?.slug !== category) notFound();
  }

  const deliverables = (s.deliverables as string[]) ?? [];
  const docsRequired = (s.documentsRequired as string[]) ?? [];
  const notCovered = (s.notCovered as string[]) ?? [];
  const pillars = (s.valuePillars as { title: string; desc: string; icon: string }[]) ?? [];
  const faqs = (s.faqs as { q: string; a: string }[]) ?? [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.shortDesc,
    provider: { "@type": "Organization", name: "Drafting Studio" },
    areaServed: "US",
    url: absoluteUrl(`/services/${s.category.slug}/${s.slug}`),
  };

  return (
    <>
      <JsonLd data={[serviceJsonLd, faqJsonLd]} />
      <PageHero
        eyebrow={s.category.name}
        title={s.name}
        description={s.heroCopy}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: s.category.name, href: `/services/${s.category.slug}` },
          { label: s.name },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent" className="gap-1.5 px-3 py-1 text-sm">
            <Clock className="size-4" /> {s.turnaroundDays}-day turnaround
          </Badge>
          <span className="flex flex-wrap gap-1.5">
            {s.disciplines.map((d) => (
              <DisciplineChip key={d.slug} label={d.label} color={d.color} className="bg-white/10 text-white" />
            ))}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href={`/request-quote?service=${s.slug}`}>Request a Quote <ArrowRight className="size-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white">
            <Link href="/contact">Talk to us about scope</Link>
          </Button>
        </div>
      </PageHero>

      {/* Process */}
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="From upload to permit-ready set" align="center" className="mb-8" />
          <ProcessTimeline turnaroundDays={s.turnaroundDays} />
        </div>
      </section>

      {/* Value pillars */}
      {pillars.length > 0 && (
        <section className="py-14">
          <div className="container-page">
            <ValuePillars pillars={pillars} />
          </div>
        </section>
      )}

      {/* Deliverables + specs */}
      <section className="border-y border-border bg-secondary/40 py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">What's included</h2>
            <p className="mt-2 text-muted-foreground">Every {s.name.toLowerCase()} package is delivered as a layered 2D AutoCAD set.</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
              {DELIVERABLE_FORMATS.map((f) => (
                <Badge key={f} variant="secondary" className="font-mono">{f}</Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <SpecCard icon={<FileText className="size-4" />} title="Documents required" items={docsRequired} />
            <SpecCard icon={<XCircle className="size-4" />} title="What's not covered" items={notCovered} muted />
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="size-4 text-success" /> Delivery standards
              </div>
              <p className="text-sm text-muted-foreground">
                Drafted to current US codes and your CAD standard, QC-checked, with two free minor revisions. Ready for your engineer to review and stamp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      {s.bodyMdx && (
        <section className="py-14">
          <div className="container-page max-w-3xl">
            <Mdx source={s.bodyMdx} />
          </div>
        </section>
      )}

      {/* FAQ + inline quote */}
      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_420px]">
          {faqs.length > 0 && (
            <div>
              <SectionHeading eyebrow="FAQ" title={`${s.name} questions`} className="mb-6" />
              <FaqAccordion faqs={faqs} />
            </div>
          )}
          <div id="quote" className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="mb-1 flex items-center gap-2">
              <FileStack className="size-5 text-primary" />
              <h2 className="font-sans text-xl font-bold text-foreground">Have a question or scope?</h2>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              Ask about {s.name.toLowerCase()} or start a fixed quote. We reply within one business day.
            </p>
            <ContactForm compact submitLabel="Send" defaultSubject={`${s.name} inquiry`} />
            <div className="mt-4 border-t border-border pt-4 text-center">
              <Button asChild variant="link">
                <Link href={`/request-quote?service=${s.slug}`}>Or start a full quote request →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SpecCard({ icon, title, items, muted }: { icon: React.ReactNode; title: string; items: string[]; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-foreground">
        <span className={muted ? "text-muted-foreground" : "text-primary"}>{icon}</span> {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-[13px] text-muted-foreground">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" /> {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
