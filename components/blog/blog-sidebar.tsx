import Link from "next/link";
import { BlogSearch } from "@/components/blog/blog-search";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getBlogCategories, getPopularPosts } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function BlogSidebar({ activeCategory }: { activeCategory?: string }) {
  const [categories, popular] = await Promise.all([getBlogCategories(), getPopularPosts(5)]);

  return (
    <aside className="space-y-6">
      <BlogSearch />

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 text-sm font-bold text-foreground">Categories</h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/blog"
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                !activeCategory ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              All articles
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/blog/category/${c.slug}`}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  activeCategory === c.slug ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} /> {c.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {popular.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-sm font-bold text-foreground">Popular posts</h3>
          <ul className="space-y-3">
            {popular.map((p, i) => (
              <li key={p.slug} className="flex gap-3">
                <span className="font-sans text-lg font-extrabold text-muted">{String(i + 1).padStart(2, "0")}</span>
                <Link href={`/blog/${p.slug}`} className="text-sm font-medium leading-snug text-foreground hover:text-primary">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-primary/20 bg-primary p-5 text-primary-foreground">
        <h3 className="font-sans text-base font-bold">Join 15,000+ architects &amp; contractors</h3>
        <p className="mt-1.5 text-sm text-primary-foreground/80">Drafting tips, code updates and case studies. No spam.</p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>
    </aside>
  );
}
