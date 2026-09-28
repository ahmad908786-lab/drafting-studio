import Link from "next/link";
import { ArrowRight, Building2, HardHat, Clock, ShieldCheck, FileCheck2 } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { Overview } from "@/components/marketing/overview";
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

  return (
    <>
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

      <Overview />

      {/* Industries */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="lg:pt-2">
            <h2 className="text-balance font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Industry Verticals
            </h2>
            <span className="mt-4 block h-1 w-16 rounded-full bg-primary" aria-hidden />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Industries we serve. We know the code hooks and coordination traps of each
              building type — and draft around them.
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
              description="Electrical, mechanical (HVAC + plumbing), fire protection, and engineering calculations — every one delivered as a clean 2D AutoCAD set."
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
              eyebrow="Sample Work"
              title="Recent drafting projects"
              description="A slice of the drawing sets we've delivered — power, lighting, fire protection and HVAC across retail, multifamily and industrial work."
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
                Send us your plans and scope. We reply with a fixed price and a delivery date — no meetings, no runaround. Two free minor revisions are built into every set.
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
            copy="Extend your team without hiring. We draft to your CAD standard and title block so your PE reviews, redlines and stamps with almost no cleanup."
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
