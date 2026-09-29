import Link from "next/link";
import Image from "next/image";
import { FileDown, BookOpen, Wrench } from "lucide-react";
import { Mdx } from "@/components/mdx/mdx";
import { ShareBar } from "@/components/blog/share-bar";
import { PostMeta, AuthorCard, RelatedPosts, TagRow } from "@/components/blog/post-parts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/shared/cta-band";
import type { TemplateProps } from "@/components/blog/templates/types";

/** TECHNICAL_GUIDE — numbered section nav, documentation feel, download-checklist CTA. */
export function TechnicalGuideTemplate({ post, toc, related }: TemplateProps) {
  const meta = (post.meta ?? {}) as { downloadable?: string };

  return (
    <article>
      {/* Documentation-style header */}
      <header className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground bg-blueprint-grid">
        <div className="container-page relative py-12">
          <nav className="mb-4 text-sm text-primary-foreground/60">
            <Link href="/blog" className="hover:text-accent">Blog</Link> / <span className="text-primary-foreground/90">{post.category?.name}</span>
          </nav>
          <Badge variant="accent" className="mb-3 gap-1.5"><BookOpen className="size-3.5" /> Technical Guide</Badge>
          <h1 className="max-w-3xl text-balance font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-primary-foreground/80">{post.excerpt}</p>
          <PostMeta author={post.author} publishedAt={post.publishedAt} readMinutes={post.readMinutes} className="mt-5 [&_*]:text-primary-foreground/80 [&_.text-foreground]:text-white" />
        </div>
      </header>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
        {/* Numbered section nav */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Wrench className="size-3.5" /> Contents
              </p>
              <ol className="space-y-1.5">
                {toc.filter((t) => t.level === 2).map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="flex gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary">
                      <span className="font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            {meta.downloadable && (
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
                <FileDown className="mb-2 size-6 text-accent" />
                <p className="text-sm font-bold text-foreground">{meta.downloadable}</p>
                <p className="mt-1 text-xs text-muted-foreground">Grab the reference version to keep on hand.</p>
                <Button asChild size="sm" variant="accent" className="mt-3 w-full">
                  <Link href="/contact?subject=checklist">Get the checklist</Link>
                </Button>
              </div>
            )}
            <ShareBar title={post.title} />
          </div>
        </aside>

        <div className="max-w-3xl">
          {post.coverImage && (
            <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-secondary">
              <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
            </div>
          )}
          <Mdx source={post.bodyMdx} />
          <div className="mt-10 border-t border-border pt-6">
            <TagRow tags={post.tags} />
          </div>
          <div className="mt-6">
            <AuthorCard author={post.author} />
          </div>
        </div>
      </div>

      <RelatedPosts posts={related} />
      <CtaBand />
    </article>
  );
}
