import Link from "next/link";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/theme";

/**
 * Brand logo.
 * - tone="auto" (default): navy logo for light backgrounds.
 * - tone="light": white logo (for dark surfaces like the footer).
 * Plain <img> is used deliberately: the Next.js image optimizer hangs on
 * the shared-hosting production build, so the logo must not go through it.
 */
export function Logo({
  className,
  href = "/",
  tone = "auto",
}: {
  className?: string;
  href?: string;
  tone?: "auto" | "light";
}) {
  return (
    <Link href={href} className={cn("flex items-center", className)} aria-label={brand.name}>
      <img
        src={tone === "light" ? "/logo-light.png" : "/logo.png"}
        alt={brand.name}
        width={248}
        height={61}
        className="h-9 w-auto"
      />
    </Link>
  );
}
