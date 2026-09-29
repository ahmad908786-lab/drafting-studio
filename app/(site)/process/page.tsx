import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProcessTimeline } from "@/components/marketing/process-timeline";
import { CtaBand } from "@/components/shared/cta-band";
import { Clock, RefreshCw, ShieldCheck, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Process",
  description: "How Drafting Studio turns your plans and scope into a permit-ready 2D AutoCAD set — from upload to delivery.",
};

const guarantees = [
  { icon: Clock, title: "Fixed quote in 24 hours", desc: "Send scope, get a fixed price and delivery date — no meetings required." },
  { icon: RefreshCw, title: "Two free revisions", desc: "Minor revisions are included so the set lands right." },
  { icon: ShieldCheck, title: "Code-compliant", desc: "Drawn to current US codes and your local amendments." },
  { icon: FileCheck2, title: "Permit-ready output", desc: "Layered DWG + plotted PDF, formatted for AHJ submission." },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Process"
        title="Our 5-Step Permit-Ready Drafting Process"
        description="A simple, predictable workflow. You always know the price, the date, and what you'll receive."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Process" }]}
      />
      <section className="py-14">
        <div className="container-page">
          <ProcessTimeline />
        </div>
      </section>
      <section className="border-y border-border bg-secondary/40 py-14">
        <div className="container-page">
          <SectionHeading eyebrow="Our promise" title="What every project includes" align="center" className="mb-10" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g) => (
              <div key={g.title} className="rounded-xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)]">
                <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-accent/15 text-accent">
                  <g.icon className="size-6" />
                </div>
                <h3 className="font-sans text-base font-bold text-foreground">{g.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
