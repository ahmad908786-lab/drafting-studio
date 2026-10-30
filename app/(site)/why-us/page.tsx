import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaBand } from "@/components/shared/cta-band";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { getTestimonials } from "@/lib/queries";
import { Gauge, Layers, Users, DollarSign, MapPin, PenTool } from "lucide-react";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/why-us") },
  title: "Why Drafting Studio",
  description: "Why engineering firms choose Drafting Studio: fast 2D AutoCAD MEP drafting to your CAD standard — permit-ready DWG sets, fixed pricing, 24-hour quotes.",
};

const reasons = [
  { icon: PenTool, title: "Pure 2D focus", desc: "We do one thing — permit-ready 2D AutoCAD — and we're fast because that's all we do." },
  { icon: Gauge, title: "Fast turnaround", desc: "Most sets in 3–7 business days, with rush options and a fixed quote in under 24 hours." },
  { icon: Layers, title: "Your CAD standard", desc: "We draft to your title block, layers and sheet order so output drops straight into your set." },
  { icon: Users, title: "An extension of your team", desc: "Scale drafting capacity up and down by the quarter without hiring." },
  { icon: DollarSign, title: "Fixed, transparent pricing", desc: "Know the price before we start. Two free minor revisions on every set." },
  { icon: MapPin, title: "Nationwide + code-fluent", desc: "All 50 states. NEC, IMC, IPC, NFPA 13 & 72, IES — plus local amendments." },
];

export default async function WhyUsPage() {
  const testimonials = await getTestimonials(true);
  return (
    <>
      <PageHero
        eyebrow="Why Us"
        title="Why firms and contractors choose Drafting Studio"
        description="The advantage of a studio that stays focused: speed, consistency, and drawings that clear review the first time."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Why Us" }]}
      />
      <section className="py-14">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-3 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <r.icon className="size-5.5" />
              </div>
              <h3 className="font-sans text-base font-bold text-foreground">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-border bg-secondary/40 py-14">
        <div className="container-page">
          <SectionHeading eyebrow="Client voices" title="Partners on the record" align="center" className="mb-10" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
