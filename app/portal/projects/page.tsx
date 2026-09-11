import Link from "next/link";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { DashHeader, StageBadge, DashEmpty } from "@/components/dashboard/ui";
import { StageTracker } from "@/components/portal/stage-tracker";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth/guards";
import { getPortalProjects } from "@/lib/portal";
import { formatDate } from "@/lib/utils";

export default async function PortalProjectsPage() {
  const user = await requireUser();
  const projects = await getPortalProjects(user);

  return (
    <div>
      <DashHeader title="My Projects" description="Track progress and download deliverables." />
      {projects.length === 0 ? (
        <DashEmpty label="No projects yet" hint="Once a quote is accepted, your project appears here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.id} href={`/portal/projects/${p.id}`} className="block rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-sans font-bold text-foreground">{p.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.industry?.name}{p.dueDate ? ` · Due ${formatDate(p.dueDate)}` : ""}</p>
                </div>
                <Badge variant={p.status === "ACTIVE" ? "info" : p.status === "COMPLETED" ? "success" : "muted"}>{p.status}</Badge>
              </div>
              <StageTracker stage={p.stage} progress={p.progress} />
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><FileText className="size-3.5" /> {p._count.files} files</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">Open <ArrowRight className="size-3.5" /></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
