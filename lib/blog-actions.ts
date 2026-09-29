"use server";

import { getPosts } from "@/lib/queries";

export type BlogCardItem = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  readMinutes: number;
  publishedAt: string | null;
  category: { name: string; slug: string; color?: string } | null;
};

/** Fetch one page of blog cards for infinite scroll. Always JSON-safe. */
export async function loadMorePosts(args: {
  q?: string;
  page: number;
  perPage: number;
  excludeId?: string;
}): Promise<{ items: BlogCardItem[]; page: number; pageCount: number }> {
  const { items, page, pageCount } = await getPosts({
    q: args.q,
    page: args.page,
    perPage: args.perPage,
    excludeId: args.excludeId,
  });
  return {
    items: items.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      coverImage: p.coverImage ?? null,
      readMinutes: p.readMinutes,
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
      category: p.category
        ? { name: p.category.name, slug: p.category.slug, color: p.category.color ?? undefined }
        : null,
    })),
    page,
    pageCount,
  };
}
