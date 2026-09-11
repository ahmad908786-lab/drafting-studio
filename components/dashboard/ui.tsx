import Link from "next/link";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QUOTE_STATUSES, PROJECT_STAGES } from "@/lib/taxonomy";

/** Page header for dashboard sections. */
export function DashHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  icon: string;
  hint?: string;
  accent?: "primary" | "accent" | "success" | "info";
  href?: string;
}) {
  const color = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
  }[accent ?? "primary"];

  const body = (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn("grid size-11 place-items-center rounded-lg", color)}>
          <Icon name={icon} className="size-5.5" />
        </span>
      </div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function StatusBadge({ status }: { status: string }) {
  const def = QUOTE_STATUSES.find((s) => s.value === status);
  const variant = (def?.color ?? "muted") as "info" | "warning" | "accent" | "success" | "destructive" | "muted";
  return <Badge variant={variant}>{def?.label ?? status}</Badge>;
}

export function StageBadge({ stage }: { stage: string }) {
  const def = PROJECT_STAGES.find((s) => s.value === stage);
  return <Badge variant="secondary">{def?.label ?? stage}</Badge>;
}

/** Empty placeholder inside dashboard tables/cards. */
export function DashEmpty({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-12 text-center">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-[var(--shadow-card)]", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
