import Image from "next/image";
import { ListOrdered } from "lucide-react";
import { Mdx } from "@/components/mdx/mdx";
import { ShareBar } from "@/components/blog/share-bar";
import { RelatedPosts, PostMeta, TagRow } from "@/components/blog/post-parts";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/shared/cta-band";
import { BlogEndCta } from "@/components/blog/blog-end-cta";
import type { TemplateProps } from "@/components/blog/templates/types";

/** LISTICLE — jump-to chip nav + numbered content, per-item accent. */
export function ListicleTemplate({ post, toc, related }: TemplateProps) {
  const items = toc.filter((t) => t.level === 2);

  return (
    <article>
      <header className="border-b border-border bg-secondary/50">
        <div className="container-page py-12">
          <Badge variant="accent" className="mb-3 gap-1.5"><ListOrdered className="size-3.5" /> {items.length}-Point Guide</Badge>
          <h1 className="max-w-3xl text-balance font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{post.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{post.excerpt}</p>
          <PostMeta publishedAt={post.publishedAt} readMinutes={post.readMinutes} className="mt-5" />
        </div>
      </header>

      {post.coverImage && (
        <div className="container-page pt-10">
          <div className="relative aspect-[21/8] overflow-hidden rounded-2xl border border-border bg-primary">
            <Image src={post.coverImage} alt={post.title} fill sizes="1024px" className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Jump-to chips */}
      {items.length > 0 && (
        <div className="container-page pt-8">
          <div className="flex flex-wrap gap-2">
            {items.map((t, i) => (
              <a key={t.id} href={`#${t.id}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary">
                <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">{i + 1}</span>
                {t.text.replace(/^\d+\.\s*/, "")}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_260px]">
        {/* Listicle content: h2s styled large via mdx components; add accent left rule */}
        <div className="max-w-3xl [&_h2]:border-l-4 [&_h2]:border-accent [&_h2]:pl-4">
          <Mdx source={post.bodyMdx} />
          <div className="mt-10 border-t border-border pt-6">
            <TagRow tags={post.tags} />
          </div>
        </div>
        <aside className="lg:pt-2">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-xl border border-border bg-card p-5"><ShareBar title={post.title} /></div>
          </div>
        </aside>
      </div>

      <BlogEndCta post={post} />
      <RelatedPosts posts={related} />
      <CtaBand />
    </article>
  );
}
