"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { PostCard } from "@/components/shared/post-card";
import { loadMorePosts, type BlogCardItem } from "@/lib/blog-actions";

type Props = {
  initialItems: BlogCardItem[];
  pageCount: number;
  q?: string;
  perPage: number;
  excludeId?: string;
};

export function BlogInfiniteGrid({ initialItems, pageCount, q, perPage, excludeId }: Props) {
  const [items, setItems] = useState<BlogCardItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ page: 1, loading: false });
  stateRef.current = { page, loading };

  const loadNext = useCallback(async () => {
    const { page: cur, loading: isLoading } = stateRef.current;
    if (isLoading || cur >= pageCount) return;
    setLoading(true);
    try {
      const res = await loadMorePosts({ q, page: cur + 1, perPage, excludeId });
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.slug));
        return [...prev, ...res.items.filter((p) => !seen.has(p.slug))];
      });
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  }, [q, perPage, excludeId, pageCount]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || pageCount <= 1) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNext();
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadNext, pageCount]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <PostCard
            key={p.slug}
            post={{ ...p, publishedAt: p.publishedAt ? new Date(p.publishedAt) : null }}
          />
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden className="h-1" />
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading more articles…
        </div>
      )}
    </>
  );
}
