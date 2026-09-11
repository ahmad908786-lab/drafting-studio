import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DisciplineChip } from "@/components/shared/discipline-chip";
import { formatSqft } from "@/lib/utils";

type ProjectCardData = {
  slug: string;
  title: string;
  coverImage: string | null;
  city: string | null;
  state: string | null;
  sizeSqft: number | null;
  featured?: boolean;
  industry: { name: string; slug: string } | null;
  disciplines: { slug: string; label: string; color: string }[];
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-primary">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={`${project.title} drawing`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        {project.featured && (
          <Badge variant="accent" className="absolute left-3 top-3 shadow-sm">
            Featured
          </Badge>
        )}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 bg-gradient-to-t from-primary/90 to-transparent p-3 pt-8">
          {project.disciplines.map((d) => (
            <DisciplineChip key={d.slug} label={d.label} color={d.color} className="bg-white/10 text-white backdrop-blur-sm" />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {project.industry && (
          <span className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            {project.industry.name}
          </span>
        )}
        <h3 className="font-sans text-[15px] font-bold leading-snug text-foreground group-hover:text-primary">
          {project.title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {(project.city || project.state) && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {[project.city, project.state].filter(Boolean).join(", ")}
            </span>
          )}
          {project.sizeSqft && (
            <span className="inline-flex items-center gap-1 font-mono">
              <Ruler className="size-3.5" />
              {formatSqft(project.sizeSqft)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
