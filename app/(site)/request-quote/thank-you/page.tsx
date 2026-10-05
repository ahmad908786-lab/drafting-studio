import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, UserPlus } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Request Received", robots: { index: false } };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Request received"
        title="Thanks — we're on it"
        description="Your quote request is in. We'll reply with a fixed price and delivery date within one business day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Request a Quote", href: "/request-quote" }, { label: "Received" }]}
      />
      <section className="py-14">
        <div className="container-page max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="size-9" />
            </div>
            <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">Request submitted</h2>
            {ref && (
              <p className="mt-2 text-muted-foreground">
                Your reference number is{" "}
                <span className="font-mono text-lg font-bold text-foreground">{ref}</span>
              </p>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              A copy has been sent to your email. Keep your reference number handy — you can use it when you contact us.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              <div className="rounded-xl border border-primary/20 bg-primary p-5 text-primary-foreground">
                <UserPlus className="mb-2 size-6 text-accent" />
                <h3 className="font-sans text-base font-bold">What happens next</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">We&apos;ll reply with a fixed quote within one business day. Keep your reference number handy.</p>
                <Button asChild variant="accent" size="sm" className="mt-4">
                  <Link href="/contact">Contact us <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-5">
                <h3 className="font-sans text-base font-bold text-foreground">While you wait</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  <li><Link href="/services" className="text-primary hover:underline">Browse services →</Link></li>
                  <li><Link href="/blog" className="text-primary hover:underline">Read drafting guides →</Link></li>
                  <li><Link href="/faq" className="text-primary hover:underline">Check the FAQ →</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
