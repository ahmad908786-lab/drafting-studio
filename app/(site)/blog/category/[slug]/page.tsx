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
import { absoluteUrl } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  const cats = await prisma.category.findMany({ select: { slug: true } });
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return {};
  return {
    title: CATEGORY_TITLES[slug] ?? `${cat.name} Articles`,
    // The stored category descriptions are 38-45 chars; use fuller
    // code-level descriptions for the meta tag (the short text still
    // shows as the visible hero description).
    description: CATEGORY_DESCRIPTIONS[slug] ?? cat.description ?? undefined,
    alternates: { canonical: absoluteUrl(`/blog/category/${slug}`) },
  };
}

// SEO titles per category, keyed to the mapped primary keyword for each.
// The description lives in the database (seeded from prisma/content/posts.ts).
const CATEGORY_TITLES: Record<string, string> = {
  "design-drafting": "2D AutoCAD Drafting Guides",
  electrical: "Electrical Drafting Guides",
  "hvac-plumbing": "HVAC and Plumbing Drafting Guides",
  "fire-protection": "Fire Protection Drafting Guides",
  lighting: "Lighting and Photometric Guides",
  franchise: "Franchise Rollout Drafting Guides",
};

// Meta descriptions per category (120-155 chars), keyed the same way.
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "design-drafting":
    "2D AutoCAD drafting guides: permit-ready drawing sets, CAD standards, layer and sheet setup, and plan-review workflows for MEP drafting teams.",
  electrical:
    "Electrical drafting guides: power plans, panel schedules, single-line diagrams, load calculations and lighting design for permit-ready 2D AutoCAD sets.",
  "hvac-plumbing":
    "HVAC and plumbing drafting guides: load calculations, ductwork and piping layouts, equipment sizing and coordination for permit-ready drawing sets.",
  "fire-protection":
    "Fire protection drafting guides: sprinkler head layouts, hydraulic calculations, standpipes and fire alarm drawings to NFPA 13 and NFPA 72.",
  lighting:
    "Lighting and photometric guides: fixture layouts, footcandle studies, controls and dark-sky compliance for permit-ready lighting drawings.",
  franchise:
    "Franchise rollout drafting guides: prototype MEP sets, multi-site permit tracking, and site adaptations that keep every location consistent.",
};

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

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} Drafting Guides`,
    url: absoluteUrl(`/blog/category/${slug}`),
    description: CATEGORY_DESCRIPTIONS[slug] ?? cat.description ?? undefined,
    hasPart: itemListJsonLd(items.map((p) => ({ name: p.title, url: absoluteUrl(`/blog/${p.slug}`) }))),
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <PageHero
        eyebrow="Blog Category"
        title={`${cat.name} Drafting Guides`}
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
