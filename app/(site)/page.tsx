import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, HardHat, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { VisionMission } from "@/components/marketing/vision-mission";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatBand } from "@/components/shared/stat-band";
import { ServiceCard } from "@/components/shared/service-card";
import { ProjectCard } from "@/components/shared/project-card";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { PostCard } from "@/components/shared/post-card";
import { CtaBand } from "@/components/shared/cta-band";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  getAllServices,
  getFeaturedProjects,
  getIndustries,
  getTestimonials,
  getClientLogos,
  getLatestPosts,
  getSettings,
  getDisciplines,
  getServiceCategories,
} from "@/lib/queries";
import { brand } from "@/lib/theme";
import { absoluteUrl } from "@/lib/utils";
import { websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
  title: "2D AutoCAD MEP Drafting Services",
  description:
    "MEP 2D drafting services for firms and contractors: permit-ready electrical, HVAC, plumbing and fire protection drawings, delivered in 3-7 business days.",
};

// Homepage FAQs (21 Nov 2026): keyword-rich Q&As targeting commercial-intent
// queries about MEP drafting services. Rendered visibly below AND as FAQPage
// JSON-LD. Keep answers factual: fixed pricing, under-24h quotes, 3-7 business
// day turnaround and two free minor revisions are all stated elsewhere on the
// site. Never add prices, size limits, or 3D/BIM claims here.
const HOME_FAQS = [
  {
    q: "What do MEP drafting services include?",
    a: "A complete permit-ready drawing set: electrical drawings (power, lighting, single-line diagrams, panel schedules), HVAC drawings (ductwork, equipment, ventilation), plumbing drawings (water, drainage, gas), fire protection drawings (sprinkler layouts, fire alarm device layouts and risers), plus the calculations behind them: electrical load calculations, HVAC load calculations and sprinkler hydraulic calculations.",
  },
  {
    q: "How much do MEP drafting services cost?",
    a: "Every project is quoted at a fixed price, based on the scope and the size of the set. Send your plans and scope through the quote form and we reply with a fixed price and a delivery date in under 24 hours, with no meeting and no obligation.",
  },
  {
    q: "How fast can I get permit-ready MEP drawings?",
    a: "Most drawing sets are delivered in 3 to 7 business days, depending on scope. Every set is delivered as a layered 2D AutoCAD DWG plus a plotted PDF, QC-checked, with two free minor revisions included.",
  },
  {
    q: "Do you provide electrical drafting services?",
    a: "Yes. Our electrical drafting services cover power plans, lighting plans, single-line diagrams, panel schedules, site electrical plans, EV charging layouts and NEC Article 220 load calculations, drawn to your CAD standard and title block.",
  },
  {
    q: "Do you draft fire sprinkler and fire alarm systems?",
    a: "Yes. We draft fire sprinkler systems to NFPA 13, 13R and 13D, including hydraulic calculations, and fire alarm systems to NFPA 72, including device layouts, riser diagrams and sequence of operations tables.",
  },
  {
    q: "Can you follow our CAD standards and title block?",
    a: "Yes. We draft to your layer standard, sheet order, title block and symbols, so your PE reviews, redlines and stamps with almost no cleanup. We also work from your prototype set on franchise and multi-location rollouts.",
  },
];

export default async function HomePage() {
  const [services, categories, industries, testimonials, logos, posts, settings, disciplines, featuredProjects] =
    await Promise.all([
      getAllServices(),
      getServiceCategories(),
      getIndustries(),
      getTestimonials(true),
      getClientLogos(),
      getLatestPosts(3),
      getSettings(),
      getDisciplines(),
      getFeaturedProjects(6),
    ]);

  const stats = (settings?.stats as { value: string; label: string }[]) ?? brand.stats;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={[websiteJsonLd(), faqJsonLd]} />
      <Hero />

      {/* Discipline strip */}
      <section className="border-b border-border bg-card">
        <div className="container-page py-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {disciplines.map((d) => (
              <Link
                key={d.slug}
                href="/services"
                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <span className="grid size-10 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklab, ${d.color} 15%, transparent)`, color: d.color }}>
                  <Icon name={d.icon} className="size-5" />
                </span>
                <span className="text-sm font-bold text-foreground">{d.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <VisionMission />

      {/* Industries */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="lg:pt-2">
            <h2 className="text-balance font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Industry Verticals
            </h2>
            <span className="mt-4 block h-1 w-16 rounded-full bg-primary" aria-hidden />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              MEP drafting for restaurants, retail plazas, offices, apartments, hotels,
              healthcare clinics, salons, warehouses, franchise rollouts and single-family
              homes. We know the code hooks and coordination traps of each building type,
              and draft around them.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/industries">All industries <ArrowRight className="size-4" /></Link>
            </Button>
          </div>

          <IndustryGrid
            industries={industries.map((i) => ({ slug: i.slug, name: i.name, icon: i.icon }))}
          />
        </div>
      </section>

      {/* Services grid by category */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="What We Draft"
              title="13 services across 4 disciplines"
              description="Our MEP 2D drafting services cover electrical drafting services, HVAC drafting, plumbing drafting, fire sprinkler and fire alarm drafting, and engineering calculations, including load calculations, single-line diagrams, panel schedules and photometric plans, for new construction and retrofit projects. Every service is delivered as a clean 2D AutoCAD set."
            />
            <Button asChild variant="outline">
              <Link href="/services">All services <ArrowRight className="size-4" /></Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.slug}
                service={{
                  slug: s.slug,
                  name: s.name,
                  shortDesc: s.shortDesc,
                  turnaroundDays: s.turnaroundDays,
                  category: { slug: s.category.slug, icon: s.category.icon },
                  disciplines: s.disciplines.map((d) => ({ slug: d.slug, label: d.label, color: d.color })),
                }}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/services/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <Icon name={c.icon} className="size-4 text-primary" /> {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Our Projects"
              title="Recent drafting projects"
              description="A look at the drawing sets we've delivered — power, lighting, fire protection and HVAC across retail, multifamily and office work."
            />
            <Button asChild variant="outline">
              <Link href="/projects">All projects <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <ProjectCard
                key={p.slug}
                project={{
                  slug: p.slug,
                  title: p.title,
                  coverImage: p.coverImage,
                  city: p.city,
                  state: p.state,
                  sizeSqft: p.sizeSqft,
                  featured: p.featured,
                  industry: p.industry ? { name: p.industry.name, slug: p.industry.slug } : null,
                  disciplines: p.disciplines.map((d) => ({ slug: d.slug, label: d.label, color: d.color })),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Proposal band */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="grid items-center gap-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] lg:grid-cols-[1fr_auto] sm:p-10">
            <div>
              <h2 className="text-balance font-sans text-3xl font-extrabold tracking-tight text-foreground">
                Get pricing on a new drafting proposal in fewer than 24 hours
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Send us your plans and scope for MEP drafting services. We reply with a fixed price and a delivery date, no meetings, no runaround. Two free minor revisions are built into every set.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                {[
                  ["Clock", "Under 24h to quote"],
                  ["ShieldCheck", "Code-compliant sets"],
                  ["FileCheck2", "Permit-ready DWG + PDF"],
                ].map(([icon, label]) => (
                  <span key={label} className="inline-flex items-center gap-2 font-medium text-foreground">
                    <Icon name={icon} className="size-4.5 text-accent" /> {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/request-quote">Request a Quote <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to us first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Audience blocks */}
      <section className="border-y border-border bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <AudienceBlock
            icon={<Building2 className="size-6" />}
            title="Engineering firms & architects"
            copy="Extend your team without hiring. Our MEP CAD drafting services follow your CAD standard and title block so your PE reviews, redlines and stamps with almost no cleanup."
            points={["Your layer standard & sheet order", "Load calcs, one-lines & schedules", "Scale capacity up or down per quarter"]}
          />
          <AudienceBlock
            icon={<HardHat className="size-6" />}
            title="Contractors & developers"
            copy="Permit-ready sets that clear review the first time and give your trades clean, buildable drawings — from a single fit-out to a multi-site rollout."
            points={["Permit sets that pass first submission", "Franchise & multi-location rollouts", "Fabrication-ready sprinkler & fire sets"]}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <StatBand stats={stats} />
        </div>
      </section>

      {/* Logos */}
      <section className="py-12">
        <div className="container-page">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Trusted by engineering firms, contractors &amp; developers nationwide
          </p>
          <LogoMarquee logos={logos.map((l) => ({ name: l.name, logo: l.logo }))} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Client Voices" title="What partners say" align="center" className="mb-10" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 7).map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="From the Blog" title="Guides &amp; case studies" />
              <Button asChild variant="outline">
                <Link href="/blog">Read the blog <ArrowRight className="size-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Homepage FAQs */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading
            eyebrow="MEP Drafting FAQs"
            title="Questions about MEP drafting services"
            description="What is included, what it costs, how fast it arrives, and how we work with your CAD standards."
            align="center"
            className="mb-10"
          />
          <FaqAccordion faqs={HOME_FAQS} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}

function AudienceBlock({
  icon,
  title,
  copy,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  points: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
      <div className="mb-4 grid size-12 place-items-center rounded-xl bg-accent/15 text-accent">{icon}</div>
      <h3 className="font-sans text-2xl font-extrabold tracking-tight">{title}</h3>
      <p className="mt-2 text-primary-foreground/75">{copy}</p>
      <ul className="mt-5 flex flex-col gap-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-primary-foreground/90">
            <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-accent" /> {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
