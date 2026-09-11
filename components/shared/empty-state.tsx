import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No results found",
  description = "Try adjusting or clearing your filters.",
  icon,
  actionLabel,
  actionHref,
  children,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
        {icon ?? <SearchX className="size-7" />}
      </div>
      <h3 className="font-sans text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {children}
      {actionLabel && actionHref && (
        <Button asChild className="mt-5">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
