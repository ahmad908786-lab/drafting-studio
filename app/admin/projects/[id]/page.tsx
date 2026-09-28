import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader, Panel, StageBadge } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { ProjectForm, type ProjectFormData } from "@/components/admin/project-form";
import { ProjectManagement } from "@/components/admin/project-management";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { PROJECT_STAGES } from "@/lib/taxonomy";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, disciplines, services, industries, companies] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        disciplines: true,
        services: true,
        industry: true,
        company: true,
        updates: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } },
        files: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.discipline.findMany({ orderBy: { order: "asc" }, select: { slug: true, label: true } }),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { slug: true, name: true } }),
    prisma.industry.findMany({ orderBy: { order: "asc" }, select: { slug: true, name: true } }),
    prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!project) notFound();

  const initial: ProjectFormData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    bodyMdx: project.bodyMdx,
    industrySlug: project.industry?.slug ?? "",
    disciplineSlugs: project.disciplines.map((d) => d.slug),
    serviceSlugs: project.services.map((s) => s.slug),
    city: project.city ?? "",
    state: project.state ?? "",
    sizeSqft: project.sizeSqft?.toString() ?? "",
    floors: project.floors?.toString() ?? "",
    year: project.year?.toString() ?? "",
    coverImage: project.coverImage ?? "",
    isPublic: project.isPublic,
    featured: project.featured,
    status: project.status,
    stage: project.stage,
    companyId: project.companyId ?? "",
    dueDate: project.dueDate ? project.dueDate.toISOString().slice(0, 10) : "",
  };

  const stageLabel = PROJECT_STAGES.find((s) => s.value === project.stage)?.label ?? project.stage;
  const description = [
    project.company?.name ?? (project.isPublic ? "Sample work" : "No client assigned"),
    project.isPublic ? "Public portfolio" : "Client project",
    project.isPublic ? (project.featured ? "Featured" : "Portfolio") : stageLabel,
  ].join(" · ");

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.title}
        description={description}
        backHref="/admin/projects"
        backLabel="Projects"
        actions={
          <>
            {project.isPublic ? (
              project.featured && <Badge variant="accent">Featured</Badge>
            ) : (
              <StageBadge stage={project.stage} />
            )}
            <Badge variant="secondary">{project.status.replace(/_/g, " ")}</Badge>
            {project.isPublic && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${project.slug}`} target="_blank">View live <ExternalLink className="size-4" /></Link>
              </Button>
            )}
          </>
        }
      />

      <Panel title="Project details">
        <ProjectForm
          initial={initial}
          disciplines={disciplines.map((d) => ({ slug: d.slug, name: d.label, label: d.label }))}
          services={services}
          industries={industries}
          companies={companies}
        />
      </Panel>

      {!project.isPublic && (
        <Panel title="Timeline & files">
          <ProjectManagement projectId={project.id} stage={project.stage} updates={project.updates} files={project.files} />
        </Panel>
      )}
    </div>
  );
}
