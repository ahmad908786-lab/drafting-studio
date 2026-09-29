import { cache } from "react";
import { prisma } from "@/lib/db";
import { parseCsvParam } from "@/lib/utils";
import { blogPhoto } from "@/prisma/photos";

/* Per-request memoized reads. Admin mutations call revalidatePath to refresh. */

/**
 * Stored cover paths can go stale (e.g. a DB seeded before the current cover
 * files existed). Prefer the file that actually exists on disk so covers
 * never render broken, then fall back to whatever the row stores.
 */
function withLiveCover<T extends { slug: string; coverImage: string | null }>(post: T): T {
  const live = blogPhoto(post.slug);
  return live && live !== post.coverImage ? { ...post, coverImage: live } : post;
}

export const getSettings = cache(async () => {
  return prisma.siteSetting.findUnique({ where: { id: "singleton" } });
});

export const getNavData = cache(async () => {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      services: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: { slug: true, name: true, shortDesc: true },
      },
      secondaryServices: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: { slug: true, name: true, shortDesc: true },
      },
    },
  });
  // Each category's menu = primary services + services cross-listed into it.
  return categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    blurb: c.blurb,
    services: [...c.services, ...c.secondaryServices],
  }));
});

export const getServiceCategories = cache(async () => {
  return prisma.serviceCategory.findMany({ orderBy: { order: "asc" } });
});

export const getAllServices = cache(async () => {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { category: true, secondaryCategory: { select: { slug: true } }, disciplines: true },
  });
});

export const getServiceBySlug = cache(async (slug: string) => {
  return prisma.service.findUnique({
    where: { slug },
    include: { category: true, secondaryCategory: true, disciplines: true },
  });
});

export const getCategoryWithServices = cache(async (slug: string) => {
  return prisma.serviceCategory.findUnique({
    where: { slug },
    include: {
      services: { where: { published: true }, orderBy: { order: "asc" }, include: { disciplines: true } },
      secondaryServices: { where: { published: true }, orderBy: { order: "asc" }, include: { disciplines: true } },
    },
  });
});

export const getIndustries = cache(async () => {
  return prisma.industry.findMany({ orderBy: { order: "asc" } });
});

export const getIndustryBySlug = cache(async (slug: string) => {
  return prisma.industry.findUnique({ where: { slug } });
});

export const getDisciplines = cache(async () => {
  return prisma.discipline.findMany({ orderBy: { order: "asc" } });
});

export const getTestimonials = cache(async (featuredOnly = false) => {
  return prisma.testimonial.findMany({
    where: featuredOnly ? { featured: true } : {},
    orderBy: { order: "asc" },
  });
});

export const getClientLogos = cache(async () => {
  return prisma.clientLogo.findMany({ orderBy: { order: "asc" } });
});

export const getLatestPosts = cache(async (take = 3) => {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take,
    include: { category: true, author: true },
  });
});

/* ------------------------- Projects / portfolio ------------------------- */

export type ProjectFilters = {
  disciplines?: string[]; // slugs
  industries?: string[]; // slugs
  q?: string;
  sort?: "newest" | "featured" | "size";
  page?: number;
  perPage?: number;
};

export function parseProjectFilters(sp: Record<string, string | string[] | undefined>): ProjectFilters {
  return {
    disciplines: parseCsvParam(sp.discipline),
    industries: parseCsvParam(sp.industry),
    q: typeof sp.q === "string" ? sp.q : undefined,
    sort: (sp.sort as ProjectFilters["sort"]) ?? "newest",
    page: sp.page ? Math.max(1, parseInt(String(sp.page), 10) || 1) : 1,
  };
}

function buildProjectWhere(filters: ProjectFilters) {
  const where: Record<string, unknown> = { isPublic: true };
  if (filters.disciplines?.length) {
    where.disciplines = { some: { slug: { in: filters.disciplines } } };
  }
  if (filters.industries?.length) {
    where.industry = { slug: { in: filters.industries } };
  }
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { summary: { contains: filters.q } },
      { city: { contains: filters.q } },
    ];
  }
  return where;
}

export async function getProjects(filters: ProjectFilters) {
  const perPage = filters.perPage ?? 12;
  const page = filters.page ?? 1;
  const where = buildProjectWhere(filters);

  const orderBy =
    filters.sort === "featured"
      ? [{ featured: "desc" as const }, { order: "asc" as const }]
      : filters.sort === "size"
        ? [{ sizeSqft: "desc" as const }]
        : [{ order: "asc" as const }];

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { industry: true, disciplines: true },
    }),
    prisma.project.count({ where }),
  ]);

  return { items, total, page, perPage, pageCount: Math.ceil(total / perPage) };
}

export const getFeaturedProjects = cache(async (take = 6) => {
  return prisma.project.findMany({
    where: { isPublic: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    take,
    include: { industry: true, disciplines: true },
  });
});

export const getProjectBySlug = cache(async (slug: string) => {  return prisma.project.findFirst({
    where: { slug, isPublic: true },
    include: {
      industry: true,
      disciplines: true,
      services: { select: { slug: true, name: true, category: { select: { slug: true } } } },
      images: { orderBy: { order: "asc" } },
    },
  });
});

export const getRelatedProjects = cache(async (disciplineSlugs: string[], excludeSlug: string, take = 3) => {
  return prisma.project.findMany({
    where: {
      isPublic: true,
      slug: { not: excludeSlug },
      disciplines: { some: { slug: { in: disciplineSlugs } } },
    },
    orderBy: { featured: "desc" },
    take,
    include: { industry: true, disciplines: true },
  });
});

/* -------------------- Blog -------------------- */

export const getBlogCategories = cache(async () => {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const counts = await prisma.post.groupBy({
    by: ["categoryId"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
  return categories.map((c) => ({ ...c, count: countMap.get(c.id) ?? 0 }));
});

export const getFeaturedPost = cache(async () => {
  const post = await prisma.post.findFirst({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
  });
  return post ? withLiveCover(post) : post;
});

export type PostFilters = { category?: string; q?: string; page?: number; perPage?: number; excludeId?: string };

export async function getPosts(filters: PostFilters) {
  const perPage = filters.perPage ?? 9;
  const page = filters.page ?? 1;
  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (filters.category) where.category = { slug: filters.category };
  if (filters.excludeId) where.id = { not: filters.excludeId };
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { excerpt: { contains: filters.q } },
    ];
  }
  const [rawItems, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true, author: true },
    }),
    prisma.post.count({ where }),
  ]);
  const items = rawItems.map(withLiveCover);
  return { items, total, page, perPage, pageCount: Math.ceil(total / perPage) };
}

export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, author: true, tags: true },
  });
  return post ? withLiveCover(post) : post;
});

export const getRelatedPosts = cache(async (categoryId: string | null, excludeId: string, take = 3) => {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", id: { not: excludeId }, ...(categoryId ? { categoryId } : {}) },
    orderBy: { publishedAt: "desc" },
    take,
    include: { category: true, author: true },
  });
  return posts.map(withLiveCover);
});

export const getPopularPosts = cache(async (take = 5) => {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { views: "desc" },
    take,
    include: { category: true },
  });
  return posts.map(withLiveCover);
});
