import Link from "next/link";
import { ArrowRight, ChevronRight, CircleAlert, Download, FileText } from "lucide-react";
import { Panel, StatusBadge, EmptyState, Ref } from "@/components/dashboard/ui";
import { ProjectCard } from "@/components/portal/project-card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getPortalOverview } from "@/lib/portal";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default async function PortalDashboard() {
  const user = await requireUser();
  const { projects, quotes, files } = await getPortalOverview(user);
  const company = user.companyId
    ? await prisma.company.findUnique({ where: { id: user.companyId }, select: { name: true } })
    : null;

  const firstName = user.name?.split(" ")[0] ?? "";
  const quoted = quotes.filter((q) => q.status === "QUOTED");
  const firstQuoted = quoted[0];
  const revisionProjects = projects.filter((p) => p.stage === "REVISIONS");
  const needsAttention = quoted.length + revisionProjects.length;

  return (
    <div className="space-y-6">
      {/* Hero strip */}
      <Panel padded={false}>
        <div className="p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {company?.name ?? "Client portal"}
          </p>
          <h2 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-foreground">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {plural(projects.length, "active project")} · {plural(quoted.length, "quote")} awaiting you ·{" "}
            {plural(files.length, "new file")}
          </p>
          <div className="mt-5">
            {firstQuoted ? (
              <Button asChild>
                <Link href={`/portal/quotes/${firstQuoted.id}`}>
                  Review your quote <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/request-quote">
                  Request a quote <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {/* Action items */}
      {needsAttention > 0 && (
        <Panel title="Needs your attention" className="border-l-4 border-l-amber-500" padded={false}>
          <ul className="divide-y divide-border">
            {quoted.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/portal/quotes/${q.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <CircleAlert className="size-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Review quote <Ref>{q.refNumber}</Ref>
                        {q.quotedAmount != null && (
                          <span className="font-mono text-sm font-bold tabular-nums">
                            {" "}— {formatCurrency(q.quotedAmount)}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Tap to review and accept or decline.</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
            {revisionProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/portal/projects/${p.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <CircleAlert className="size-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Feedback requested on {p.title}</p>
                      <p className="text-xs text-muted-foreground">The team is waiting on your markups or comments.</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Projects */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-sans text-base font-bold text-foreground">Your projects</h3>
          <Link href="/portal/projects" className="text-xs font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState
            icon="FolderKanban"
            title="No projects yet"
            hint="Once a quote is accepted, your project will appear here."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      {/* Files + quotes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recent files"
          action={
            <Link href="/portal/files" className="text-xs font-semibold text-primary hover:underline">
              All files
            </Link>
          }
        >
          {files.length === 0 ? (
            <EmptyState icon="FileText" title="No files yet" hint="Deliverables will appear here as your set is drafted." />
          ) : (
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                  <FileText className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">{f.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.project.title} · Rev {f.revision}
                    </div>
                  </div>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`Download ${f.name}`}
                  >
                    <Download className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Quotes"
          action={
            <Link href="/portal/quotes" className="text-xs font-semibold text-primary hover:underline">
              All quotes
            </Link>
          }
        >
          {quotes.length === 0 ? (
            <EmptyState
              icon="FileText"
              title="No quotes yet"
              hint="Tell us about your project and we'll price it for you."
              action={
                <Button asChild size="sm">
                  <Link href="/request-quote">
                    Request a quote <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-1">
              {quotes.slice(0, 5).map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/portal/quotes/${q.id}`}
                    className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-secondary"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Ref>{q.refNumber}</Ref>
                        <StatusBadge status={q.status} />
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{formatDate(q.createdAt)}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {q.quotedAmount != null && (
                        <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
                          {formatCurrency(q.quotedAmount)}
                        </span>
                      )}
                      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
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
