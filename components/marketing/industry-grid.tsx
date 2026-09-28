import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type IndustryTile = {
  slug: string;
  name: string;
  icon: string;
};

/**
 * Falls back to the accent swatch for any industry added later without its own
 * token, so a new row in the DB never renders an untinted tile.
 */
function swatch(slug: string): string {
  const known = [
    "franchise", "residential", "commercial", "restaurant", "healthcare", "salon",
    "hotel", "apartments", "plaza", "offices", "warehouse",
  ];
  return known.includes(slug) ? `var(--industry-${slug})` : "var(--accent)";
}

export function IndustryGrid({
  industries,
  className,
  columns = 4,
}: {
  industries: IndustryTile[];
  className?: string;
  columns?: 3 | 4;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {industries.map((ind) => {
        const color = swatch(ind.slug);
        return (
          <li key={ind.slug}>
            <Link
              href={`/industries/${ind.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl p-2 text-center transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className="grid size-20 place-items-center rounded-2xl ring-1 transition-shadow group-hover:shadow-[var(--shadow-card)] sm:size-24"
                style={{
                  backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`,
                  color,
                  // @ts-expect-error -- custom property is valid inline CSS
                  "--tw-ring-color": `color-mix(in oklab, ${color} 26%, transparent)`,
                }}
              >
                <Icon name={ind.icon} className="size-9 sm:size-10" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                {ind.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
