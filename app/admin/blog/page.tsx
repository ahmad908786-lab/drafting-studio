import Link from "next/link";
import { Plus } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { BlogPostTable } from "@/components/admin/blog-post-table";
import { prisma } from "@/lib/db";
import { blogPhoto } from "@/prisma/photos";

export const metadata = { title: "Blog Posts" };

export default async function AdminBlogPage() {
  const raw = await prisma.post.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      status: true,
      featured: true,
      template: true,
      views: true,
      publishedAt: true,
      createdAt: true,
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });
  // Prefer the cover file that actually exists on disk over a stale stored path.
  const posts = raw.map((p) => {
    const live = blogPhoto(p.slug);
    return live && live !== p.coverImage ? { ...p, coverImage: live } : p;
  });

  return (
    <div>
      <DashHeader title="Blog" description="Articles, guides and case studies.">
        <Button asChild size="sm"><Link href="/admin/blog/new"><Plus className="size-4" /> New post</Link></Button>
      </DashHeader>
      <BlogPostTable posts={posts} />
    </div>
  );
}
