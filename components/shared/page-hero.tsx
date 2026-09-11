import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  align = "left",
  size = "default",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
  align?: "left" | "center";
  size?: "default" | "compact";
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-blueprint-grid opacity-40" aria-hidden />
      <div className={cn("container-page relative", size === "compact" ? "py-10" : "py-14 sm:py-16")}>
        {breadcrumbs && (
          <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-primary-foreground/60" aria-label="Breadcrumb">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-accent">{c.label}</Link>
                ) : (
                  <span className="text-primary-foreground/90">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className={cn(align === "center" && "mx-auto max-w-3xl text-center")}>
          {eyebrow && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
          )}
          <h1 className="text-balance font-sans text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className={cn("mt-4 text-lg leading-relaxed text-primary-foreground/80", align === "center" && "mx-auto")}>
              {description}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
