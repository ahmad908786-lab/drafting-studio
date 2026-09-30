import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PostForTemplate } from "@/components/blog/templates/types";

/**
 * Category names are navigation labels, so several of them read badly dropped
 * into a sentence — "permit-ready Design & Drafting drawings". These are the
 * same categories phrased as the work itself.
 */
const DISCIPLINE_BY_CATEGORY: Record<string, string> = {
  "design-drafting": "2D AutoCAD",
  electrical: "electrical",
  "hvac-plumbing": "HVAC and plumbing",
  "fire-protection": "fire protection",
  lighting: "lighting and photometric",
  franchise: "multi-site rollout",
};

/** End-of-article CTA: "Need similar drawings?" contextualized to the post's category. */
export function BlogEndCta({ post }: { post: PostForTemplate }) {
  const slug = post.category?.slug;
  const discipline = (slug && DISCIPLINE_BY_CATEGORY[slug]) || post.category?.name || "MEP";
  return (
    <section className="container-page pb-4">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Need similar drawings?
        </p>
        <h2 className="mt-2 text-balance font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">
          Get permit-ready {discipline} drawings for your project
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Send us your plans and scope — we&apos;ll come back with a fixed price
          and a turnaround date. No obligation.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link href="/request-quote">
              Request a Quote <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">
              <Mail className="size-4" /> Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
