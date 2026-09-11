import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Server-rendered pagination that preserves existing query params. */
export function Pagination({
  page,
  pageCount,
  searchParams,
  basePath,
}: {
  page: number;
  pageCount: number;
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v == null || k === "page") continue;
      params.set(k, Array.isArray(v) ? v.join(",") : v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary" aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      )}
      {pages.map((p, i) => {
        const gap = i > 0 && p - pages[i - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-muted-foreground">…</span>}
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                p === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {page < pageCount && (
        <Link href={hrefFor(page + 1)} className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary" aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}
