import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Mdx } from "@/components/mdx/mdx";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareBar } from "@/components/blog/share-bar";
import { PostMeta, RelatedPosts, TagRow } from "@/components/blog/post-parts";
import { CtaBand } from "@/components/shared/cta-band";
import type { TemplateProps } from "@/components/blog/templates/types";

/** STANDARD — cover hero, sticky TOC rail, author card, share bar, related posts. */
export function StandardTemplate({ post, toc, related }: TemplateProps) {
  return (
    <article>
      <PageHero
        eyebrow={post.category?.name}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.category?.name ?? "Article" }]}
      >
        <PostMeta publishedAt={post.publishedAt} readMinutes={post.readMinutes} className="[&_*]:text-primary-foreground/80 [&_.text-foreground]:text-white" />
      </PageHero>

      <div className="container-page py-10">
        {post.coverImage && (
          <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-primary">
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents items={toc} />
              <ShareBar title={post.title} />
            </div>
          </aside>

          <div className="mx-auto w-full max-w-2xl">
            <Mdx source={post.bodyMdx} />
            <div className="mt-10 border-t border-border pt-6">
              <TagRow tags={post.tags} />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <ShareBar title={post.title} className="lg:hidden" />
            </div>
          </div>
        </div>
      </div>

      <RelatedPosts posts={related} />
      <CtaBand />
    </article>
  );
}
