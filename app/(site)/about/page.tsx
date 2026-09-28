import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatBand } from "@/components/shared/stat-band";
import { CtaBand } from "@/components/shared/cta-band";
import { getSettings } from "@/lib/queries";
import { brand } from "@/lib/theme";

export const metadata: Metadata = {
  title: "About Us",
  description: "Drafting Studio is a US-focused 2D AutoCAD drafting studio for engineering firms, contractors, architects and developers.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  const stats = (settings?.stats as { value: string; label: string }[]) ?? brand.stats;

  return (
    <>
      <PageHero
        eyebrow="About"
        title="A drafting studio, focused on 2D"
        description="We're a US-focused design and drafting studio that does one thing exceptionally well: clean, permit-ready 2D AutoCAD sets for MEP, fire protection and lighting."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="py-14 sm:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          <div>
            <h2 className="text-balance font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              America&rsquo;s Trusted MEP Drafting Experts
            </h2>
            <span className="mt-4 block h-1 w-56 rounded-full bg-accent" aria-hidden />
            <p className="mt-6 text-lg font-bold text-foreground">Where We Draft Your Vision</p>
            <p className="mt-6 text-base font-bold text-foreground">Mission:</p>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Drafting Studio&rsquo;s mission is to partner with engineering firms, contractors
              and developers to meet their drafting and documentation needs through reliable,
              high-quality and flexible 2D CAD service.
            </p>
            <p className="mt-6 text-base font-bold text-foreground">Vision:</p>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Our vision is to be the drafting team AEC firms call first — the partner that
              makes permit-ready drawing sets the easiest part of every project.
            </p>
          </div>
          <div className="space-y-5 leading-relaxed text-muted-foreground lg:pt-1">
            <p>
              Drafting Studio is a US-based CAD drafting firm specializing in comprehensive 2D
              electrical and mechanical drafting services for the residential, commercial and
              multifamily sectors. We deliver clean, permit-ready AutoCAD sets to clients
              nationwide.
            </p>
            <p>
              Our team brings deep, hands-on experience across the MEP disciplines. Our
              electrical drafting expertise covers power distribution plans, lighting and
              photometric layouts, fire alarm systems, panel schedules, one-line diagrams and
              load calculations. Our mechanical expertise covers HVAC ductwork and piping
              layouts, plumbing system drawings, and fire sprinkler drafting to NFPA 13.
            </p>
            <p>
              At Drafting Studio, we believe great drafting makes every project run smoother.
              Our drafters have extensive experience across project types — restaurant and
              retail rollouts, multifamily housing, warehouses, self-storage facilities and
              office fit-outs — always drafting to your CAD standard and title block.
            </p>
            <p>
              By combining precision, technical expertise and a client-first approach, we
              deliver drawing sets that clear review, coordinate cleanly, and meet — and
              exceed — our clients&rsquo; expectations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our approach" title="Why we stay 2D" className="mb-4" />
            <div className="space-y-4 text-muted-foreground">
              <p>Most projects — tenant fit-outs, franchise rollouts, light-commercial and residential work — need a permit set, not a model. Power plans, panel schedules, one-lines, ductwork, piping, sprinkler grids: every one is a 2D deliverable.</p>
              <p>By committing to pure 2D AutoCAD, we keep files small and portable, layer standards disciplined, and turnaround fast. Your engineer of record opens the DWG, redlines, and stamps — no round-trip through a model nobody asked for.</p>
              <p>We work for engineering firms, contractors, architects and developers across all 50 states, drafting to your CAD standard and the current US codes: NEC, IMC, IPC, NFPA 13 &amp; 72, and IES.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground bg-blueprint-grid">
            <h3 className="font-sans text-lg font-bold">What we don't do</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">We're deliberate about scope. We focus on 2D drafting and calculations so we can be fast and precise. We don't stamp drawings — that's your engineer of record — and we don't do modeling. That focus is the point.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {brand.promises.map((p) => (
                <div key={p} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-12">
        <div className="container-page">
          <StatBand stats={stats} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
