import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Ruler, Layers, Calendar, ArrowRight, Building2 } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { DrawingGallery } from "@/components/projects/drawing-gallery";
import { DisciplineChip } from "@/components/shared/discipline-chip";
import { ProjectCard } from "@/components/shared/project-card";
import { Mdx } from "@/components/mdx/mdx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/shared/cta-band";
import { getProjectBySlug, getRelatedProjects } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { formatSqft } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ where: { isPublic: true }, select: { slug: true } });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Projects`,
    description: project.summary,
    openGraph: { images: project.coverImage ? [project.coverImage] : [] },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(
    project.disciplines.map((d) => d.slug),
    project.slug,
    3,
  );

  const facts = [
    project.industry && { icon: Building2, label: "Industry", value: project.industry.name },
    (project.city || project.state) && { icon: MapPin, label: "Location", value: [project.city, project.state].filter(Boolean).join(", ") },
    project.sizeSqft && { icon: Ruler, label: "Size", value: formatSqft(project.sizeSqft) },
    project.floors && { icon: Layers, label: "Floors", value: String(project.floors) },
    project.year && { icon: Calendar, label: "Year", value: String(project.year) },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <>
      <PageHero
        eyebrow={project.industry?.name ?? "Project"}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      >
        <div className="flex flex-wrap gap-1.5">
          {project.disciplines.map((d) => (
            <DisciplineChip key={d.slug} label={d.label} color={d.color} className="bg-white/10 text-white" />
          ))}
        </div>
      </PageHero>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div>
          <DrawingGallery cover={project.coverImage} images={project.images} title={project.title} />
          <div className="mt-8">
            <Mdx source={project.bodyMdx} />
          </div>

          {project.services.length > 0 && (
            <div className="mt-8">
              <h2 className="font-sans text-xl font-bold text-foreground">Services on this project</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.category.slug}/${s.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    {s.name} <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:pt-2">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">Project details</h3>
              <dl className="space-y-3">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <f.icon className="size-4 text-primary" />
                    <dt className="text-sm text-muted-foreground">{f.label}</dt>
                    <dd className="ml-auto text-sm font-semibold text-foreground">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <Badge variant="secondary" className="mt-4">2D AutoCAD · DWG + PDF</Badge>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary p-5 text-primary-foreground">
              <h3 className="font-sans text-lg font-bold">Need something similar?</h3>
              <p className="mt-1.5 text-sm text-primary-foreground/80">Send your scope for a fixed quote in under 24 hours.</p>
              <Button asChild variant="accent" className="mt-4 w-full">
                <Link href={`/request-quote?industry=${project.industry?.slug ?? ""}`}>Request a Quote</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/40 py-14">
          <div className="container-page">
            <h2 className="mb-8 font-sans text-2xl font-extrabold tracking-tight text-foreground">Related work</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
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
      )}

      <CtaBand />
    </>
  );
}
