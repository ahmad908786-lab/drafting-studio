import Link from "next/link";
import { ArrowRight, Check, ImageIcon, RotateCcw } from "lucide-react";
import { StageBadge, MiniProgress } from "@/components/dashboard/ui";
import { cn, formatDate } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shared project tracker card for the client portal                    */
/* ------------------------------------------------------------------ */

export type PortalProjectCardData = {
  id: string;
  title: string;
  coverImage: string | null;
  stage: string;
  progress: number;
  dueDate: Date | string | null;
  updatedAt: Date | string;
  assignedTo?: { name?: string | null } | null;
  industry?: { name?: string | null } | null;
};

/** Tiny relative-time helper for portal pages. */
export function timeAgo(d: Date | string): string {
  const ms = Date.now() - new Date(d).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const FLOW = ["KICKOFF", "DRAFTING", "QC", "DELIVERED"] as const;
const LABELS: Record<string, string> = {
  KICKOFF: "Kickoff",
  DRAFTING: "Drafting",
  QC: "Quality check",
  DELIVERED: "Delivered",
  REVISIONS: "Revisions",
};

function Milestones({ stage }: { stage: string }) {
  if (stage === "REVISIONS") {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
        <RotateCcw className="size-3.5" /> In revisions
      </span>
    );
  }
  const idx = FLOW.indexOf(stage as (typeof FLOW)[number]);
  return (
    <div className="flex items-center">
      {FLOW.map((s, i) => {
        const done = stage === "DELIVERED" || idx > i;
        const current = idx === i && stage !== "DELIVERED";
        return (
          <span key={s} className="flex items-center">
            {i > 0 && <span className={cn("h-0.5 w-5", done ? "bg-primary" : "bg-border")} />}
            <span
              title={LABELS[s]}
              className={cn(
                "grid size-6 place-items-center rounded-full",
                done && "bg-primary text-primary-foreground",
                current && "bg-amber-500/15 text-amber-700 ring-2 ring-amber-500/70 animate-pulse dark:text-amber-400",
                !done && !current && "bg-secondary text-muted-foreground/40",
              )}
            >
              {done ? (
                <Check className="size-3.5" />
              ) : (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </span>
          </span>
        );
      })}
      <span className="ml-2.5 text-xs font-medium text-muted-foreground">{LABELS[stage] ?? stage}</span>
    </div>
  );
}

export function ProjectCard({
  project,
  companyName,
  showUpdated = false,
}: {
  project: PortalProjectCardData;
  companyName?: string | null;
  showUpdated?: boolean;
}) {
  const meta: string[] = [];
  if (companyName) meta.push(companyName);
  if (project.dueDate) meta.push(`Due ${formatDate(project.dueDate)}`);
  if (project.assignedTo?.name) meta.push(project.assignedTo.name);
  if (showUpdated) meta.push(`Updated ${timeAgo(project.updatedAt)}`);

  return (
    <Link
      href={`/portal/projects/${project.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/25"
    >
      <div className="relative h-36 w-full shrink-0 bg-secondary">
        {project.coverImage ? (
          <img src={project.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground/40">
            <ImageIcon className="size-8" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-[15px] font-bold leading-snug text-foreground">{project.title}</h3>
          <StageBadge stage={project.stage} />
        </div>
        <Milestones stage={project.stage} />
        <MiniProgress value={project.progress} />
        {meta.length > 0 && <p className="text-xs text-muted-foreground">{meta.join(" · ")}</p>}
        <span className="mt-auto inline-flex items-center gap-1 border-t border-border pt-3 text-[13px] font-semibold text-primary">
          View updates <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
