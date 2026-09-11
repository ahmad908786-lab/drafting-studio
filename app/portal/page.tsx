import Link from "next/link";
import { ArrowRight, FileText, FolderKanban, Clock, Download } from "lucide-react";
import { StatCard, Panel, StatusBadge, DashEmpty } from "@/components/dashboard/ui";
import { StageTracker } from "@/components/portal/stage-tracker";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getPortalOverview } from "@/lib/portal";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function PortalDashboard() {
  const user = await requireUser();
  const { projects, openQuotes, quotes, files } = await getPortalOverview(user);
  const nextProject = projects[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your drafting work.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active projects" value={projects.length} icon="FolderKanban" accent="primary" href="/portal/projects" />
        <StatCard label="Open quotes" value={openQuotes.length} icon="FileText" accent="accent" href="/portal/quotes" />
        <StatCard label="Files available" value={files.length} icon="FolderOpen" accent="info" href="/portal/files" />
      </div>

      {nextProject && (
        <Panel title="Current project" action={<Link href={`/portal/projects/${nextProject.id}`} className="text-xs font-semibold text-primary hover:underline">Open</Link>}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-sans font-bold text-foreground">{nextProject.title}</h3>
              <p className="text-xs text-muted-foreground">{nextProject.assignedTo?.name ? `Drafted by ${nextProject.assignedTo.name}` : "Drafting Studio"}{nextProject.dueDate ? ` · Due ${formatDate(nextProject.dueDate)}` : ""}</p>
            </div>
          </div>
          <StageTracker stage={nextProject.stage} progress={nextProject.progress} />
        </Panel>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent files" action={<Link href="/portal/files" className="text-xs font-semibold text-primary hover:underline">All files</Link>}>
          {files.length === 0 ? (
            <DashEmpty label="No files yet" hint="Deliverables will appear here." />
          ) : (
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                  <FileText className="size-4 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.project.title} · {f.revision}</div>
                  </div>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Download className="size-4" /></a>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Your quotes" action={<Link href="/portal/quotes" className="text-xs font-semibold text-primary hover:underline">All quotes</Link>}>
          {quotes.length === 0 ? (
            <div className="text-center">
              <DashEmpty label="No quotes yet" />
              <Button asChild size="sm" className="mt-3"><Link href="/request-quote">Request a quote <ArrowRight className="size-4" /></Link></Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {quotes.slice(0, 5).map((q) => (
                <li key={q.id}>
                  <Link href={`/portal/quotes/${q.id}`} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{q.refNumber}</span>
                        <StatusBadge status={q.status} />
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDate(q.createdAt)}</div>
                    </div>
                    {q.quotedAmount != null && <span className="font-mono text-sm font-semibold text-foreground">{formatCurrency(q.quotedAmount)}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
