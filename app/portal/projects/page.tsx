import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { ProjectCard } from "@/components/portal/project-card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getPortalProjects } from "@/lib/portal";
import { prisma } from "@/lib/db";

export const metadata = { title: "My Projects" };

export default async function PortalProjectsPage() {
  const user = await requireUser();
  const projects = await getPortalProjects(user);
  const company = user.companyId
    ? await prisma.company.findUnique({ where: { id: user.companyId }, select: { name: true } })
    : null;

  return (
    <div>
      <PageHeader title="My Projects" description="Track progress, download deliverables, and send feedback." />
      {projects.length === 0 ? (
        <EmptyState
          icon="FolderKanban"
          title="No projects yet"
          hint="Once a quote is accepted, your project appears here."
          action={
            <Button asChild>
              <Link href="/request-quote">Request a quote</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} companyName={company?.name} showUpdated />
          ))}
        </div>
      )}
    </div>
  );
}
