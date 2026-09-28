import Link from "next/link";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/theme";

export function Logo({ className, showText = true, href = "/" }: { className?: string; showText?: boolean; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 font-sans", className)} aria-label={brand.name}>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
          <path d="M11 28 L11 12 L20 12 A8 8 0 0 1 20 28 Z" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <line x1="26" y1="12" x2="30" y2="12" stroke="var(--accent)" strokeWidth="2.4" />
          <line x1="26" y1="28" x2="30" y2="28" stroke="var(--accent)" strokeWidth="2.4" />
          <line x1="28" y1="12" x2="28" y2="28" stroke="var(--accent)" strokeWidth="2.4" />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-extrabold tracking-tight text-foreground">Drafting Studio</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            2D CAD · MEP · Fire
          </span>
        </span>
      )}
    </Link>
  );
}
