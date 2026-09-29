import { PostEditor, type PostFormData } from "@/components/admin/post-editor";
import { prisma } from "@/lib/db";

export const metadata = { title: "New Post" };

const EMPTY: PostFormData = {
  title: "", slug: "", excerpt: "", bodyMdx: "", template: "STANDARD", categorySlug: "", tags: "",
  coverImage: "", status: "DRAFT", featured: false, seoTitle: "", seoDesc: "",
};

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" }, select: { slug: true, name: true } });
  return <PostEditor initial={EMPTY} categories={categories} />;
}
