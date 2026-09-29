import Image from "next/image";
import { Link2 } from "lucide-react";
import { Mdx } from "@/components/mdx/mdx";
import { ShareBar } from "@/components/blog/share-bar";
import { RelatedPosts, PostMeta } from "@/components/blog/post-parts";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/shared/cta-band";
import type { TemplateProps } from "@/components/blog/templates/types";

/** CASE_STUDY — stats banner, challenge/solution/result, metrics prominent. */
export function CaseStudyTemplate({ post, related }: TemplateProps) {
  const meta = (post.meta ?? {}) as { stats?: { value: string; label: string }[] };
  const stats = meta.stats ?? [];

  return (
    <article>
      <header className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-blueprint-grid opacity-40" aria-hidden />
        {post.coverImage && (
          <div className="absolute inset-0 opacity-20">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="container-page relative py-14">
          <Badge variant="accent" className="mb-3">Case Study</Badge>
          <h1 className="max-w-3xl text-balance font-sans text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/85">{post.excerpt}</p>
          <PostMeta publishedAt={post.publishedAt} readMinutes={post.readMinutes} className="mt-5 [&_*]:text-primary-foreground/80 [&_.text-foreground]:text-white" />
        </div>
      </header>

      {/* Stats banner */}
      {stats.length > 0 && (
        <div className="border-b border-border bg-card">
          <div className="container-page grid grid-cols-2 gap-px lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-6 text-center">
                <div className="font-sans text-3xl font-extrabold text-primary sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_260px]">
        <div className="max-w-3xl">
          <Mdx source={post.bodyMdx} />
        </div>
        <aside className="lg:pt-2">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-xl border border-border bg-card p-5">
              <ShareBar title={post.title} />
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary p-5 text-primary-foreground">
              <p className="text-sm font-bold">Want results like these?</p>
              <p className="mt-1 text-xs text-primary-foreground/80">Send your scope for a fixed quote.</p>
              <a href="/request-quote" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                <Link2 className="size-4" /> Request a quote
              </a>
            </div>
          </div>
        </aside>
      </div>

      <RelatedPosts posts={related} />
      <CtaBand />
    </article>
  );
}
