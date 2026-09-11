import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { PostCard } from "@/components/shared/post-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatDate, initials } from "@/lib/utils";

type Author = { name: string | null; image: string | null; title?: string | null } | null;

export function PostMeta({
  author,
  publishedAt,
  readMinutes,
  className,
}: {
  author: Author;
  publishedAt: Date | null;
  readMinutes: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className ?? ""}`}>
      {author && (
        <span className="flex items-center gap-2">
          {author.image ? (
            <Image src={author.image} alt={author.name ?? "Author"} width={32} height={32} className="size-8 rounded-full" />
          ) : (
            <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">{initials(author.name ?? "DS")}</span>
          )}
          <span className="font-semibold text-foreground">{author.name}</span>
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Calendar className="size-4" /> {formatDate(publishedAt)}</span>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="size-4" /> {readMinutes} min read</span>
    </div>
  );
}

export function AuthorCard({ author }: { author: Author }) {
  if (!author) return null;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      {author.image ? (
        <Image src={author.image} alt={author.name ?? "Author"} width={56} height={56} className="size-14 rounded-full" />
      ) : (
        <span className="grid size-14 place-items-center rounded-full bg-secondary font-semibold">{initials(author.name ?? "DS")}</span>
      )}
      <div>
        <div className="text-sm font-bold text-foreground">{author.name}</div>
        {author.title && <div className="text-sm text-muted-foreground">{author.title}</div>}
        <div className="mt-0.5 text-xs text-muted-foreground">Drafting Studio</div>
      </div>
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
