import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Drafting Studio. We're hiring experienced AutoCAD drafters across MEP, fire protection and lighting.",
};

const openings = [
  { title: "Senior Electrical Drafter (AutoCAD)", type: "Full-time · Remote", tags: ["Electrical", "Lighting"], desc: "Draft power, lighting, one-line and load-calc sets for firms nationwide." },
  { title: "Fire Protection Drafter — NFPA 13/72", type: "Full-time · Remote", tags: ["Fire Protection"], desc: "Sprinkler layouts, hydraulic reports and fire-alarm device plans." },
  { title: "Mechanical Drafter (HVAC & Plumbing)", type: "Full-time · Remote", tags: ["HVAC", "Plumbing"], desc: "Ductwork, piping and equipment layouts with load-calc support." },
  { title: "QA / Plan Reviewer", type: "Part-time · Remote", tags: ["QC"], desc: "Review 2D sets against code and CAD standards before delivery." },
];

export default function CareersPage() {
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
          <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">Don't see your role? We're always glad to meet skilled drafters.</p>
            <Button asChild variant="link"><Link href="/contact">Send us your portfolio →</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
