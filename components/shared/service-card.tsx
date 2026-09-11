import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Icon } from "@/components/icon";
import { DisciplineChip } from "@/components/shared/discipline-chip";

type ServiceCardData = {
  slug: string;
  name: string;
  shortDesc: string;
  turnaroundDays: number;
  category: { slug: string; icon?: string };
  disciplines: { slug: string; label: string; color: string }[];
};

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={`/services/${service.category.slug}/${service.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-4 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon name={service.category.icon ?? "PenTool"} className="size-5.5" />
      </div>
      <h3 className="font-sans text-base font-bold leading-snug text-foreground group-hover:text-primary">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.shortDesc}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {service.disciplines.map((d) => (
          <DisciplineChip key={d.slug} label={d.label} color={d.color} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Clock className="size-3.5" /> {service.turnaroundDays}-day turnaround
        </span>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        View service <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
