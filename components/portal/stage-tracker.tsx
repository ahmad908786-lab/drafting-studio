import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const FLOW = ["KICKOFF", "DRAFTING", "QC", "DELIVERED"] as const;
const LABELS: Record<string, string> = { KICKOFF: "Kickoff", DRAFTING: "Drafting", QC: "Quality Check", DELIVERED: "Delivered", REVISIONS: "Revisions" };

export function StageTracker({ stage, progress }: { stage: string; progress: number }) {
  const currentIdx = FLOW.indexOf(stage as (typeof FLOW)[number]);
  const isRevisions = stage === "REVISIONS";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {FLOW.map((s, i) => {
          const done = currentIdx > i || stage === "DELIVERED";
          const active = currentIdx === i;
          return (
            <div key={s} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {i > 0 && <div className={cn("h-0.5 flex-1", done || active ? "bg-primary" : "bg-border")} />}
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors", done ? "bg-primary text-primary-foreground" : active ? "bg-accent text-accent-foreground ring-4 ring-accent/20" : "bg-muted text-muted-foreground")}>
                  {done ? <Check className="size-4" /> : i + 1}
                </span>
                {i < FLOW.length - 1 && <div className={cn("h-0.5 flex-1", done ? "bg-primary" : "bg-border")} />}
              </div>
              <span className={cn("mt-1.5 text-[11px] font-medium", active ? "text-foreground" : "text-muted-foreground")}>{LABELS[s]}</span>
            </div>
          );
        })}
      </div>
      {isRevisions && <p className="mb-2 text-center text-xs font-semibold text-warning">Currently in revisions</p>}
      <Progress value={progress} indicatorClassName={progress >= 100 ? "bg-success" : undefined} />
      <p className="mt-1.5 text-right text-xs text-muted-foreground">{progress}% complete</p>
    </div>
  );
}
