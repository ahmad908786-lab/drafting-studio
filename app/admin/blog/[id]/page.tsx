import { notFound } from "next/navigation";
import { PostEditor, type PostFormData } from "@/components/admin/post-editor";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Edit Post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { category: true, tags: true, author: { select: { name: true } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" }, select: { slug: true, name: true } }),
  ]);
  if (!post) notFound();

  const initial: PostFormData = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    bodyMdx: post.bodyMdx,
    template: post.template,
    categorySlug: post.category?.slug ?? "",
    tags: post.tags.map((t) => t.name).join(", "),
    coverImage: post.coverImage ?? "",
    status: post.status,
    featured: post.featured,
    seoTitle: post.seoTitle ?? "",
    seoDesc: post.seoDesc ?? "",
    authorName: post.author?.name ?? undefined,
    createdAt: formatDate(post.createdAt),
    updatedAt: formatDate(post.updatedAt),
  };

  return <PostEditor initial={initial} categories={categories} />;
}
