import { notFound } from "next/navigation";
import { FileText, Download, MapPin, Ruler, CalendarDays, PenLine } from "lucide-react";
import { PageHeader, Panel, StageBadge, PersonChip } from "@/components/dashboard/ui";
import { StageTracker } from "@/components/portal/stage-tracker";
import { ProjectTabs } from "@/components/portal/project-tabs";
import { ProjectMessages } from "@/components/portal/project-messages";
import { MarkupUploader } from "@/components/portal/markup-uploader";
import { DisciplineChip } from "@/components/shared/discipline-chip";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getPortalProject } from "@/lib/portal";
import { formatDate, formatSqft } from "@/lib/utils";
import { PROJECT_STAGES } from "@/lib/taxonomy";

export const metadata = { title: "Project Details" };

function fileSize(bytes: number): string {
  if (bytes <= 0) return "—";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default async function PortalProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const project = await getPortalProject(user, id);
  if (!project) notFound();

  const threadMessages = project.messages.map((m) => ({
    id: m.id,
    body: m.body,
    createdAt: m.createdAt,
    fromClient: !m.author,
    authorName: m.author?.name ?? null,
  }));
  const deliverables = project.files.filter((f) => f.revision !== "MARKUP");
  const markups = project.files.filter((f) => f.revision === "MARKUP");

  const updatesTab = (
    <Panel>
      {project.updates.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No updates yet — we&apos;ll post here every time your set moves forward.
        </p>
      ) : (
        <ol className="relative space-y-6 border-l border-border pl-6">
          {project.updates.map((u) => (
            <li key={u.id} className="relative">
              <span className="absolute -left-[31px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">
                  {PROJECT_STAGES.find((s) => s.value === u.stage)?.label ?? u.stage}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</p>
              </div>
              {u.note && <p className="mt-1 text-sm text-muted-foreground">{u.note}</p>}
              <div className="mt-1.5">
                <PersonChip name={u.author?.name ?? "Drafting Studio"} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );

  const filesTab = (
    <div className="space-y-6">
      <Panel title="Deliverables">
        {deliverables.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No deliverables shared yet. They&apos;ll appear here as your set is drafted.
          </p>
        ) : (
          <ul className="space-y-2">
            {deliverables.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm"
              >
                <FileText className="size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground">{f.name}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-mono tabular-nums">
                      Rev {f.revision}
                    </span>
                    <span>{fileSize(f.sizeBytes)}</span>
                    <span>{formatDate(f.createdAt)}</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={f.url} target="_blank" rel="noopener noreferrer">
                    <Download className="size-4" /> Download
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Your markups">
        <MarkupUploader projectId={project.id} />
        {markups.length > 0 && (
          <ul className="mt-4 space-y-2">
            {markups.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-2.5 text-sm"
              >
                <PenLine className="size-4 shrink-0 text-accent" />
                <span className="flex-1 truncate text-foreground">{f.name}</span>
                <span className="text-xs text-muted-foreground">{formatDate(f.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );

  const messagesTab = (
    <Panel title="Messages">
      <ProjectMessages projectId={project.id} messages={threadMessages} />
    </Panel>
  );

  return (
    <div>
      <PageHeader
        backHref="/portal/projects"
        backLabel="My Projects"
        title={project.title}
        description={
          project.assignedTo?.name ? `Drafted by ${project.assignedTo.name}` : "Your drafting project"
        }
        actions={<StageBadge stage={project.stage} />}
      />

      {/* Hero */}
      <Panel padded={false} className="overflow-hidden">
        {project.coverImage && (
          <img src={project.coverImage} alt="" className="h-44 w-full rounded-t-xl object-cover" />
        )}
        <div className="p-5 sm:p-6">
          <StageTracker stage={project.stage} progress={project.progress} />
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            {(project.city || project.state) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {[project.city, project.state].filter(Boolean).join(", ")}
              </span>
            )}
            {project.sizeSqft && (
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="size-4" /> {formatSqft(project.sizeSqft)}
              </span>
            )}
            {project.dueDate && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" /> Due {formatDate(project.dueDate)}
              </span>
            )}
          </div>
          {project.disciplines.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.disciplines.map((d) => (
                <DisciplineChip key={d.slug} label={d.label} color={d.color} />
              ))}
            </div>
          )}
        </div>
      </Panel>

      <div className="mt-6">
        <ProjectTabs updates={updatesTab} files={filesTab} messages={messagesTab} />
      </div>
    </div>
  );
}
