import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { PostCard } from "@/components/shared/post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { getPosts, getBlogCategories } from "@/lib/queries";
import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  const cats = await prisma.category.findMany({ select: { slug: true } });
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return {};
  return { title: `${cat.name} Articles`, description: cat.description ?? undefined };
}

type SP = Record<string, string | string[] | undefined>;

export default async function CategoryBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SP>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) notFound();

  const page = sp.page ? Math.max(1, parseInt(String(sp.page), 10) || 1) : 1;
  const [{ items, pageCount }, categories] = await Promise.all([
    getPosts({ category: slug, page, perPage: 9 }),
    getBlogCategories(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Blog Category"
        title={cat.name}
        description={cat.description ?? undefined}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: cat.name }]}
      />
      <div className="container-page py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/blog" className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-secondary">All</Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${c.slug === slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {items.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  {items.map((p) => <PostCard key={p.slug} post={p} />)}
                </div>
                <Pagination page={page} pageCount={pageCount} searchParams={sp} basePath={`/blog/category/${slug}`} />
              </>
            ) : (
              <EmptyState title="No articles yet" description="Check back soon or browse other categories." actionLabel="All articles" actionHref="/blog" />
            )}
          </div>
          <Suspense fallback={null}>
            <BlogSidebar activeCategory={slug} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
