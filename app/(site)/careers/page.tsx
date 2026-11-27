import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/utils";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/careers") },
  title: "Remote AutoCAD Drafter Jobs",
  description: "Remote AutoCAD drafter jobs at Drafting Studio: electrical, HVAC, plumbing, fire protection and lighting roles in a fast-paced MEP drafting studio.",
};

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const openings = careers.map((c) => ({
    title: c.title,
    type: c.type,
    tags: c.tags.split(",").map((t) => t.trim()).filter(Boolean),
    desc: c.desc,
  }));
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Draft with us"
        description="We're a remote-first 2D AutoCAD studio. If you're fast, precise, and fluent in US codes, we'd love to meet you."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />
      <section className="py-14">
        <div className="container-page">
          <SectionHeading eyebrow="Open roles" title="Current openings" className="mb-8" />
          {openings.length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No open roles at the moment. Check back soon, or send us your portfolio through the contact form.</p>
          ) : (
          <div className="grid gap-4">
            {openings.map((o) => (
              <div key={o.title} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-sans text-lg font-bold text-foreground">{o.title}</h3>
                    {o.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{o.desc}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><MapPin className="size-3.5" /> {o.type}</p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link href={`/contact?role=${encodeURIComponent(o.title)}`}>Apply <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
          )}
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Our remote MEP drafter jobs cover every discipline we draft: electrical drafter jobs for power, lighting and one-line sets, HVAC drafter jobs for ductwork and equipment layouts, and fire protection drafter jobs for sprinkler and fire alarm drawings.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
              <h2 className="font-sans text-xl font-bold text-foreground">How we work</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Every drafter here works in 2D AutoCAD on real permit sets for engineering firms, contractors and architects across the United States. You will draft power plans, ductwork, piping, sprinkler grids and lighting layouts to the client&apos;s CAD standard and the current US codes, and every set passes a QC check before it goes out. We are remote-first, so you can work from anywhere, and we keep the team small on purpose, so good drafting gets noticed.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
              <h2 className="font-sans text-xl font-bold text-foreground">What we look for</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Speed without sloppiness. Clean layer discipline, schedules that match the plans, and details a plan reviewer can follow. Experience with permit submittals helps, and so does fluency in NEC, IMC, IPC, NFPA 13 and 72, and IES lighting. If you have drafted restaurants, retail, multifamily or office work, you will fit right in.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
            <h2 className="font-sans text-xl font-bold text-foreground">How to apply</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Send your portfolio and a short note about your experience through the contact form. Tell us which discipline is your strongest and include a sample set if you can. We read every application and get back to people whose work fits the way we draft.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">Don&apos;t see your role? We&apos;re always glad to meet skilled drafters.</p>
            <Button asChild variant="link"><Link href="/contact">Send us your portfolio →</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
