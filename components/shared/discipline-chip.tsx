import { cn } from "@/lib/utils";

/** Small colored dot + label for a drafting discipline. */
export function DisciplineChip({
  label,
  color,
  className,
}: {
  label: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] font-semibold text-foreground",
        className,
      )}
    >
      <span className="size-2 rounded-full" style={{ backgroundColor: color ?? "var(--primary)" }} aria-hidden />
      {label}
    </span>
  );
}
