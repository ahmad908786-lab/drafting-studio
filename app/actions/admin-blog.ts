"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/guards";
import { slugify, readingMinutes } from "@/lib/utils";

type PostInput = {
  id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  bodyMdx: string;
  template: string;
  categorySlug?: string;
  tags: string[];
  coverImage?: string;
  status: string;
  featured: boolean;
  seoTitle?: string;
  seoDesc?: string;
};

export async function savePost(input: PostInput): Promise<{ ok: boolean; id?: string; slug?: string; message?: string }> {
  const user = await requireStaff();
  if (!input.title?.trim()) return { ok: false, message: "Title is required" };

  const category = input.categorySlug ? await prisma.category.findUnique({ where: { slug: input.categorySlug }, select: { id: true } }) : null;
  const readMinutes = readingMinutes(input.bodyMdx);
  const publishedAt = input.status === "PUBLISHED" ? new Date() : null;

  const tagConnect = {
    set: [],
    connectOrCreate: input.tags.map((t) => ({
      where: { slug: slugify(t) },
      create: { slug: slugify(t), name: t },
    })),
  };

  const base = {
    title: input.title.trim(),
    excerpt: input.excerpt?.trim() || input.title.trim(),
    bodyMdx: input.bodyMdx,
    template: input.template,
    coverImage: input.coverImage || null,
    status: input.status,
    featured: input.featured,
    readMinutes,
    seoTitle: input.seoTitle || null,
    seoDesc: input.seoDesc || null,
    categoryId: category?.id ?? null,
  };

  if (input.id) {
    const existing = await prisma.post.findUnique({ where: { id: input.id }, select: { publishedAt: true } });
    const post = await prisma.post.update({
      where: { id: input.id },
      data: {
        ...base,
        publishedAt: input.status === "PUBLISHED" ? existing?.publishedAt ?? publishedAt : input.status === "DRAFT" ? null : existing?.publishedAt,
        tags: tagConnect,
      },
    });
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { ok: true, id: post.id, slug: post.slug };
  }

  const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
  const exists = await prisma.post.findUnique({ where: { slug: baseSlug } });
  const slug = exists ? `${baseSlug}-${Math.floor(Date.now() % 10000)}` : baseSlug;

  const post = await prisma.post.create({
    data: { ...base, slug, publishedAt, authorId: user.id, tags: { connectOrCreate: tagConnect.connectOrCreate } },
  });
  revalidatePath("/admin/blog");
  return { ok: true, id: post.id, slug: post.slug };
}

export async function deletePost(id: string) {
  await requireStaff();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/blog");
}

export async function togglePostFeatured(id: string, featured: boolean) {
  await requireStaff();
  await prisma.post.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/blog");
}
