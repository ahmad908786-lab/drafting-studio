import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  readMinutes: number;
  publishedAt: Date | null;
  category: { name: string; slug: string; color?: string } | null;
};

export function PostCard({ post, compact = false }: { post: PostCardData; compact?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-primary">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {post.category && (
          <Badge className="absolute left-3 top-3 border-transparent text-white shadow-sm" style={{ backgroundColor: post.category.color ?? "var(--primary)" }}>
            {post.category.name}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-sans font-bold leading-snug text-foreground group-hover:text-primary ${compact ? "text-[15px]" : "text-lg"}`}>
          {post.title}
        </h3>
        {!compact && <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {post.readMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
