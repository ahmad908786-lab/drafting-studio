import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { ProjectForm, type ProjectFormData } from "@/components/admin/project-form";
import { ProjectManagement } from "@/components/admin/project-management";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, disciplines, services, industries, companies] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        disciplines: true,
        services: true,
        industry: true,
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/projects" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
          <DashHeader title={project.title} description={project.isPublic ? "Public sample work" : "Client project"} />
        </div>
        {project.isPublic && (
          <Button asChild variant="outline" size="sm"><Link href={`/projects/${project.slug}`} target="_blank">View live <ExternalLink className="size-4" /></Link></Button>
        )}
      </div>

      {!project.isPublic && (
        <ProjectManagement projectId={project.id} stage={project.stage} updates={project.updates} files={project.files} />
      )}

      <ProjectForm
        initial={initial}
        disciplines={disciplines.map((d) => ({ slug: d.slug, name: d.label, label: d.label }))}
        services={services}
        industries={industries}
        companies={companies}
      />
    </div>
  );
}
