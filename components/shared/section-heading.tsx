import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-2.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
          <span className="h-px w-6 bg-accent" aria-hidden />
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "text-balance font-sans font-extrabold tracking-tight text-foreground",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
