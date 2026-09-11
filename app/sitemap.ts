import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, industries, posts, categories] = await Promise.all([
    prisma.service.findMany({ where: { published: true }, select: { slug: true, category: { select: { slug: true } }, updatedAt: true } }),
    prisma.industry.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes = ["", "/services", "/industries", "/blog", "/about", "/process", "/why-us", "/faq", "/contact", "/careers", "/request-quote", "/privacy", "/terms"];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((r) => ({ url: absoluteUrl(r || "/"), lastModified: now, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.category.slug}/${s.slug}`), lastModified: s.updatedAt, priority: 0.8 })),
    ...industries.map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), lastModified: i.updatedAt, priority: 0.6 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt, priority: 0.6 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/blog/category/${c.slug}`), priority: 0.4 })),
  ];
  return entries;
}
