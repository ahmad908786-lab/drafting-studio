import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ProjectCard } from "@/components/shared/project-card";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { CtaBand } from "@/components/shared/cta-band";
import { getProjects, parseProjectFilters } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects — 2D Drafting Portfolio",
  description:
    "Recent 2D AutoCAD projects from Drafting Studio — electrical, HVAC, plumbing, lighting and fire-protection sets across every US building type.",
};

type SP = Record<string, string | string[] | undefined>;

/**
 * The public project archive. Discipline/industry links elsewhere on the site
 * still narrow this list via `?discipline=` / `?industry=`; there is no filter
 * UI, so an active filter is surfaced as a "show everything" escape hatch.
 */
export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filters = parseProjectFilters(sp);
  const { items, total, page, pageCount } = await getProjects({ ...filters, perPage: 12 });

  const isFiltered = Boolean(filters.disciplines?.length || filters.industries?.length || filters.q);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="2D drafting sets across every building type"
        description="A cross-section of recent electrical, HVAC, plumbing, lighting and fire-protection work."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />

      <div className="container-page py-10">
        {items.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {total} {total === 1 ? "project" : "projects"}
              </p>
              {isFiltered && (
                <Link href="/projects" className="text-sm font-semibold text-primary hover:underline">
                  View all projects
                </Link>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
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

            <Pagination page={page} pageCount={pageCount} searchParams={sp} basePath="/projects" />
          </>
        ) : (
          <EmptyState
            icon={<Layers className="size-7" />}
            title="No projects to show"
            description="We may still have done work like this — tell us what you need and we'll show you relevant work."
          >
            <div className="mt-5 flex gap-3">
              {isFiltered && (
                <Link href="/projects" className="text-sm font-semibold text-primary hover:underline">
                  View all projects
                </Link>
              )}
              <Link href="/request-quote" className="text-sm font-semibold text-primary hover:underline">
                Request similar work →
              </Link>
            </div>
          </EmptyState>
        )}
      </div>

      <CtaBand
        title="Don't see your project type?"
        description="We draft across every US building type and code. Send your scope and we'll show you relevant work and a fixed quote."
      />
    </>
  );
}
