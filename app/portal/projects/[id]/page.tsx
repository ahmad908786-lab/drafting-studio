import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Download, MapPin, Ruler, Calendar } from "lucide-react";
import { Panel, StageBadge } from "@/components/dashboard/ui";
import { StageTracker } from "@/components/portal/stage-tracker";
import { ProjectMessages } from "@/components/portal/project-messages";
import { MarkupUploader } from "@/components/portal/markup-uploader";
import { DisciplineChip } from "@/components/shared/discipline-chip";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getPortalProject } from "@/lib/portal";
import { formatDate, formatSqft } from "@/lib/utils";
import { PROJECT_STAGES } from "@/lib/taxonomy";

export default async function PortalProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const project = await getPortalProject(user, id);
  if (!project) notFound();

  const threadMessages = project.messages.map((m) => ({ id: m.id, body: m.body, createdAt: m.createdAt, fromClient: !m.author, authorName: m.author?.name ?? null }));
  const deliverables = project.files.filter((f) => f.revision !== "MARKUP");
  const markups = project.files.filter((f) => f.revision === "MARKUP");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/portal/projects" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
          <div>
            <h2 className="font-sans text-xl font-extrabold text-foreground">{project.title}</h2>
            <p className="text-xs text-muted-foreground">{project.assignedTo?.name ? `Drafted by ${project.assignedTo.name}` : "Drafting Studio"}</p>
          </div>
        </div>
        <StageBadge stage={project.stage} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel title="Progress">
            <StageTracker stage={project.stage} progress={project.progress} />
            <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
              {(project.city || project.state) && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> {[project.city, project.state].filter(Boolean).join(", ")}</span>}
              {project.sizeSqft && <span className="inline-flex items-center gap-1.5"><Ruler className="size-4" /> {formatSqft(project.sizeSqft)}</span>}
              {project.dueDate && <span className="inline-flex items-center gap-1.5"><Calendar className="size-4" /> Due {formatDate(project.dueDate)}</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.disciplines.map((d) => <DisciplineChip key={d.slug} label={d.label} color={d.color} />)}
            </div>
          </Panel>

          <Panel title="Deliverables">
            {deliverables.length === 0 ? (
              <p className="text-sm text-muted-foreground">No deliverables shared yet. They&apos;ll appear here as your set is drafted.</p>
            ) : (
              <ul className="space-y-2">
                {deliverables.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                    <FileText className="size-4 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-foreground">{f.name}</div>
                      <div className="text-xs text-muted-foreground">Rev {f.revision} · {(f.sizeBytes / 1024 / 1024).toFixed(1)}MB · {formatDate(f.createdAt)}</div>
                    </div>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> Download</a>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Upload a markup">
            <MarkupUploader projectId={project.id} />
            {markups.length > 0 && (
              <ul className="mt-4 space-y-2">
                {markups.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-2.5 text-sm">
                    <FileText className="size-4 text-accent" />
                    <span className="flex-1 truncate text-foreground">{f.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(f.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Updates">
            <ol className="space-y-3">
              {project.updates.map((u) => (
                <li key={u.id} className="flex gap-3">
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{PROJECT_STAGES.find((s) => s.value === u.stage)?.label ?? u.stage}</div>
                    <p className="text-sm text-muted-foreground">{u.note}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(u.createdAt)}</p>
                  </div>
                </li>
              ))}
              {project.updates.length === 0 && <li className="text-sm text-muted-foreground">No updates yet.</li>}
            </ol>
          </Panel>

          <Panel title="Messages">
            <ProjectMessages projectId={project.id} messages={threadMessages} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
