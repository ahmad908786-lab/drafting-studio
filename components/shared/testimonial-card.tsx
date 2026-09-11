import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type TestimonialData = {
  author: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar: string | null;
  rating: number;
};

export function TestimonialCard({ t, className }: { t: TestimonialData; className?: string }) {
  return (
    <figure className={cn("flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]", className)}>
      <div className="mb-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("size-4", i < t.rating ? "fill-accent text-accent" : "text-muted")} />
        ))}
      </div>
      <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground">“{t.quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        {t.avatar && (
          <Image src={t.avatar} alt={t.author} width={44} height={44} className="size-11 rounded-full" />
        )}
        <div>
          <div className="text-sm font-bold text-foreground">{t.author}</div>
          <div className="text-xs text-muted-foreground">
            {[t.role, t.company].filter(Boolean).join(", ")}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
