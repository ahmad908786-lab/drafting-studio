import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { PostCard } from "@/components/shared/post-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatDate } from "@/lib/utils";

export function PostMeta({
  publishedAt,
  readMinutes,
  className,
}: {
  publishedAt: Date | null;
  readMinutes: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className ?? ""}`}>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Calendar className="size-4" /> {formatDate(publishedAt)}</span>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="size-4" /> {readMinutes} min read</span>
    </div>
  );
}

type RelatedPost = React.ComponentProps<typeof PostCard>["post"];

export function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="border-t border-border bg-secondary/40 py-14">
      <div className="container-page">
        <SectionHeading eyebrow="Keep reading" title="Related articles" className="mb-8" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TagRow({ tags }: { tags: { slug: string; name: string }[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Link key={t.slug} href={`/blog?q=${encodeURIComponent(t.name)}`} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
          #{t.name}
        </Link>
      ))}
    </div>
  );
}
