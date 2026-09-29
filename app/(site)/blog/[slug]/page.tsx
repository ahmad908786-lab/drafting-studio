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
import type { PostForTemplate, RelatedPost, TemplateProps } from "@/components/blog/templates/types";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const ogImage = absoluteUrl(
    `/api/og?title=${encodeURIComponent(post.title)}&eyebrow=${encodeURIComponent(post.category?.name ?? "Blog")}`
  );
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.excerpt,
    authors: [],
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
    author: post.author ? { name: post.author.name, image: post.author.image, title: post.author.title } : null,
    tags: post.tags.map((t) => ({ slug: t.slug, name: t.name })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Drafting Studio" },
    publisher: { "@type": "Organization", name: "Drafting Studio" },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : [],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <Template post={postData} toc={toc} related={related} />
    </>
  );
}
