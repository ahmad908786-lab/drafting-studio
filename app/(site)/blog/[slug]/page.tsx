import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { extractToc } from "@/components/mdx/mdx";
import { StandardTemplate } from "@/components/blog/templates/standard";
import { TechnicalGuideTemplate } from "@/components/blog/templates/technical-guide";
import { CaseStudyTemplate } from "@/components/blog/templates/case-study";
import { ListicleTemplate } from "@/components/blog/templates/listicle";
import { EditorialTemplate } from "@/components/blog/templates/editorial";
import { JsonLd } from "@/components/seo/json-ld";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { ORG_ID, breadcrumbJsonLd, trimDescription } from "@/lib/seo";
import type { PostForTemplate, RelatedPost, TemplateProps } from "@/components/blog/templates/types";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

// Short <title> overrides for posts whose stored seoTitle is too long for
// search results (the layout template appends " | Drafting Studio").
// The stored titles stay long in the DB; this keeps the rendered title short
// until the content is re-synced with the shortened titles in posts.ts.
const SHORT_TITLES: Record<string, string> = {
  "clearing-mep-plan-review-corrections": "How to Clear MEP Plan-Review Corrections",
  "commercial-hvac-design-requirements-2026-usa": "2026 Commercial HVAC Design Requirements",
  // Stored seoTitle renders at 61 chars with the layout template.
  "electrical-load-calculation-nec-220-walkthrough": "Electrical Load Calculation: NEC 220",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const shortTitle = SHORT_TITLES[post.slug] ?? post.seoTitle ?? post.title;
  const ogImage = absoluteUrl(
    `/api/og?title=${encodeURIComponent(post.title)}&eyebrow=${encodeURIComponent(post.category?.name ?? "Blog")}`
  );
  return {
    title: shortTitle,
    description: trimDescription(post.seoDesc ?? post.excerpt),
    authors: [{ name: "Drafting Studio", url: absoluteUrl() }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      images: [ogImage],
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

const TEMPLATES: Record<string, (p: TemplateProps) => React.ReactNode> = {
  STANDARD: StandardTemplate,
  TECHNICAL_GUIDE: TechnicalGuideTemplate,
  CASE_STUDY: CaseStudyTemplate,
  LISTICLE: ListicleTemplate,
  EDITORIAL: EditorialTemplate,
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Fire-and-forget view count (don't block render).
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const toc = extractToc(post.bodyMdx);
  const relatedRaw = await getRelatedPosts(post.categoryId, post.id, 3);
  const related: RelatedPost[] = relatedRaw.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    readMinutes: p.readMinutes,
    publishedAt: p.publishedAt,
    category: p.category ? { name: p.category.name, slug: p.category.slug, color: p.category.color } : null,
  }));

  const Template = TEMPLATES[post.template] ?? StandardTemplate;
  const postData: PostForTemplate = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    bodyMdx: post.bodyMdx,
    coverImage: post.coverImage,
    readMinutes: post.readMinutes,
    publishedAt: post.publishedAt,
    template: post.template,
    meta: post.meta,
    category: post.category ? { name: post.category.name, slug: post.category.slug, color: post.category.color } : null,
    // Blog author is always the studio itself, never the stored placeholder
    // user. The byline, metadata and JSON-LD all say "Drafting Studio".
    author: { name: "Drafting Studio", image: null, title: null },
    tags: post.tags.map((t) => ({ slug: t.slug, name: t.name })),
  };

  // BlogPosting (not plain Article) with the Organization linked by @id.
  // The blog author is Drafting Studio itself (Organization), matching the
  // visible "By Drafting Studio" byline. Never a Person: the stored author
  // user is a placeholder and its name is never shown.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@id": ORG_ID },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Drafting Studio",
      logo: absoluteUrl("/logo.png"),
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : [],
  };

  // BreadcrumbList: the STANDARD template gets one from PageHero; the other
  // templates render their own headers, so emit it here for them.
  const schemas =
    post.template === "STANDARD"
      ? [articleJsonLd]
      : [
          articleJsonLd,
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.category?.name ?? "Article", href: post.category ? `/blog/category/${post.category.slug}` : "/blog" },
            { label: post.title },
          ]),
        ];

  return (
    <>
      <JsonLd data={schemas} />
      <Template post={postData} toc={toc} related={related} />
    </>
  );
}
