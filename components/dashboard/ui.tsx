import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";
import { QUOTE_STATUSES, PROJECT_STAGES } from "@/lib/taxonomy";

/* ------------------------------------------------------------------ */
/* Page header with breadcrumb + actions                                */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
}: {
  title: React.ReactNode;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {backLabel ?? "Back"}
        </Link>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/** Legacy header — kept for compatibility. */
export function DashHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return <PageHeader title={title} description={description} actions={children} />;
}

/* ------------------------------------------------------------------ */
/* KPI card — quiet, typography-led, mono numerals                     */
/* ------------------------------------------------------------------ */

export function KpiCard({
  label,
  value,
  icon,
  href,
  delta,
  deltaHint,
  invertDelta,
}: {
  label: string;
  value: string | number;
  icon: string;
  href?: string;
  /** e.g. +12 or -3 — positive is good unless invertDelta */
  delta?: number;
  deltaHint?: string;
  invertDelta?: boolean;
}) {
  const good = delta == null ? null : invertDelta ? delta < 0 : delta > 0;
  const body = (
    <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <Icon name={icon} className="size-4 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
      </div>
      <p className="mt-2 font-mono text-[32px] font-bold leading-none tracking-tight text-foreground tabular-nums">{value}</p>
      {(delta != null || deltaHint) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {delta != null && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold tabular-nums",
                good === null && "bg-secondary text-muted-foreground",
                good === true && "bg-success/10 text-success",
                good === false && "bg-destructive/10 text-destructive",
              )}
            >
              {delta > 0 ? <ArrowUpRight className="size-3" /> : delta < 0 ? <ArrowDownRight className="size-3" /> : <Minus className="size-3" />}
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
          {deltaHint && <span className="text-muted-foreground">{deltaHint}</span>}
        </div>
      )}
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

/* ------------------------------------------------------------------ */
/* StatCard — legacy, now quieter                                      */
/* ------------------------------------------------------------------ */

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
  return <KpiCard label={label} value={value} icon={icon} href={href} deltaHint={hint} />;
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export function StatusBadge({ status }: { status: string }) {
  const def = QUOTE_STATUSES.find((s) => s.value === status);
  const variant = (def?.color ?? "muted") as "info" | "warning" | "accent" | "success" | "destructive" | "muted";
  return <Badge variant={variant}>{def?.label ?? status}</Badge>;
}

export function StageBadge({ stage }: { stage: string }) {
  const def = PROJECT_STAGES.find((s) => s.value === stage);
  return <Badge variant="secondary">{def?.label ?? stage}</Badge>;
}

/** Small colored dot + label, for kanban cards and timelines. */
export function StatusDot({ color, label, className }: { color: string; label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Panels & cards                                                       */
/* ------------------------------------------------------------------ */

/** Quiet surface: hairline border, no decorative shadow. */
export function Panel({
  title,
  action,
  children,
  className,
  padded = true,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3.5">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {action}
        </div>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </div>
  );
}

/** Designed empty state: icon + headline + one line + single CTA. */
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon: string;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icon name={icon} className="size-5" />
      </span>
      <p className="mt-3 text-sm font-bold text-foreground">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Legacy empty placeholder — kept for compatibility. */
export function DashEmpty({ label, hint }: { label: string; hint?: string }) {
  return <EmptyState icon="Inbox" title={label} hint={hint} />;
}

/* ------------------------------------------------------------------ */
/* People                                                               */
/* ------------------------------------------------------------------ */

export function PersonChip({ name, image, email }: { name?: string | null; image?: string | null; email?: string | null }) {
  const label = name ?? email ?? "—";
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar className="size-6">
        {image && <AvatarImage src={image} alt={label} />}
        <AvatarFallback className="text-[10px]">{initials(label)}</AvatarFallback>
      </Avatar>
      <span className="truncate text-sm font-medium text-foreground">{label}</span>
    </span>
  );
}

export function AvatarStack({ people, max = 3 }: { people: { name?: string | null; image?: string | null }[]; max?: number }) {
  const shown = people.slice(0, max);
  return (
    <span className="inline-flex -space-x-1.5">
      {shown.map((p, i) => (
        <Avatar key={i} className="size-6 border-2 border-card">
          {p.image && <AvatarImage src={p.image} alt={p.name ?? ""} />}
          <AvatarFallback className="text-[10px]">{initials(p.name ?? "?")}</AvatarFallback>
        </Avatar>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Data helpers                                                         */
/* ------------------------------------------------------------------ */

/** Thin progress bar with mono percent label. */
export function MiniProgress({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex min-w-28 items-center gap-2", className)}>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <span
          className={cn("block h-full rounded-full", value >= 100 ? "bg-success" : "bg-primary")}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </span>
      <span className="font-mono text-xs text-muted-foreground tabular-nums">{value}%</span>
    </span>
  );
}

/** Mono reference number, e.g. DS-2026-0004. */
export function Ref({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-mono text-xs text-muted-foreground tabular-nums", className)}>{children}</span>;
}
