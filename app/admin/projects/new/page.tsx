import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { ProjectForm, type ProjectFormData } from "@/components/admin/project-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const metadata = { title: "New Project" };

const EMPTY: ProjectFormData = {
  title: "", slug: "", summary: "", bodyMdx: "", industrySlug: "", disciplineSlugs: [], serviceSlugs: [],
  city: "", state: "", sizeSqft: "", floors: "", year: "", coverImage: "", isPublic: true, featured: false,
  status: "ACTIVE", stage: "KICKOFF", companyId: "", dueDate: "",
};

export default async function NewProjectPage() {
  const [disciplines, services, industries, companies] = await Promise.all([
    prisma.discipline.findMany({ orderBy: { order: "asc" }, select: { slug: true, label: true } }),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { slug: true, name: true } }),
    prisma.industry.findMany({ orderBy: { order: "asc" }, select: { slug: true, name: true } }),
    prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/projects" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
        <DashHeader title="New project" />
      </div>
      <ProjectForm
        initial={EMPTY}
        disciplines={disciplines.map((d) => ({ slug: d.slug, name: d.label, label: d.label }))}
        services={services}
        industries={industries}
        companies={companies}
      />
    </div>
  );
}
