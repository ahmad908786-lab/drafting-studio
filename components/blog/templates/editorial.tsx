import Image from "next/image";
import { Mdx } from "@/components/mdx/mdx";
import { ShareBar } from "@/components/blog/share-bar";
import { RelatedPosts, PostMeta, TagRow } from "@/components/blog/post-parts";
import { CtaBand } from "@/components/shared/cta-band";
import type { TemplateProps } from "@/components/blog/templates/types";

/** EDITORIAL — wide single column, oversized pull quote, magazine typography, no sidebar. */
export function EditorialTemplate({ post, related }: TemplateProps) {
  const meta = (post.meta ?? {}) as { pullQuotes?: string[] };
  const pullQuote = meta.pullQuotes?.[0];

  return (
    <article>
      <header className="border-b border-border">
        <div className="container-page max-w-3xl py-16 text-center">
          {post.category && (
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: post.category.color }}>{post.category.name}</span>
          )}
          <h1 className="mt-4 text-balance font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex justify-center">
            <PostMeta publishedAt={post.publishedAt} readMinutes={post.readMinutes} />
          </div>
        </div>
      </header>

      <div className="container-page max-w-2xl py-14">
        {post.coverImage && (
          <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-secondary">
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
          </div>
        )}
        {pullQuote && (
          <blockquote className="mb-10 border-y border-border py-8 text-center font-sans text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
            “{pullQuote}”
          </blockquote>
        )}
        <div className="[&_p]:text-[18px] [&_p]:leading-[1.85]">
          <Mdx source={post.bodyMdx} />
        </div>
        <div className="mt-12 flex flex-col items-center gap-6 border-t border-border pt-8">
          <TagRow tags={post.tags} />
          <ShareBar title={post.title} />
        </div>
      </div>

      <RelatedPosts posts={related} />
      <CtaBand />
    </article>
  );
}
