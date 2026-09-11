import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { PostEditor, type PostFormData } from "@/components/admin/post-editor";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { category: true, tags: true } }),
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
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/blog" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
        <DashHeader title="Edit post" />
      </div>
      <PostEditor initial={initial} categories={categories} />
    </div>
  );
}
