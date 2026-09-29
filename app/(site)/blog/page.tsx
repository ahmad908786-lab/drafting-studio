import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { PostCard } from "@/components/shared/post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { getPosts, getFeaturedPost, getBlogCategories } from "@/lib/queries";
import { formatDate, absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/blog") },
  title: "Blog — Drafting Guides & Case Studies",
  description: "2D drafting guides, code walkthroughs and case studies for electrical, HVAC, plumbing, fire protection and lighting.",
};

type SP = Record<string, string | string[] | undefined>;

export default async function BlogPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const page = sp.page ? Math.max(1, parseInt(String(sp.page), 10) || 1) : 1;
  const showFeatured = page === 1 && !q;

  const [{ items, pageCount }, featured, categories] = await Promise.all([
    getPosts({ q, page, perPage: 9 }),
    showFeatured ? getFeaturedPost() : Promise.resolve(null),
    getBlogCategories(),
  ]);

  const gridItems = featured ? items.filter((p) => p.id !== featured.id) : items;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Drafting guides & case studies"
        description="Practical, no-fluff writing on 2D drafting, US codes and getting sets through review — from the people who draft them."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <div className="container-page py-10">
        {/* Category chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/blog" className="rounded-full border border-primary bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Featured */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-10 grid overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)] lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-primary lg:aspect-auto">
              {featured.coverImage && (
                <Image src={featured.coverImage} alt={featured.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
              <Badge variant="accent" className="absolute left-4 top-4">Featured</Badge>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              {featured.category && (
                <span className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: featured.category.color }}>{featured.category.name}</span>
              )}
              <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground group-hover:text-primary sm:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(featured.publishedAt)}</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {featured.readMinutes} min read</span>
                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-primary">Read article <ArrowRight className="size-4" /></span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid + sidebar */}
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            {q && <p className="mb-5 text-sm text-muted-foreground">Results for “<span className="font-semibold text-foreground">{q}</span>”</p>}
            {gridItems.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  {gridItems.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
                <Pagination page={page} pageCount={pageCount} searchParams={sp} basePath="/blog" />
              </>
            ) : (
              <EmptyState title="No articles found" description="Try a different search or browse by category." actionLabel="View all articles" actionHref="/blog" />
            )}
          </div>
          <Suspense fallback={null}>
            <BlogSidebar />
          </Suspense>
        </div>
      </div>
    </>
  );
}
