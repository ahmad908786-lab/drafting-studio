import Link from "next/link";
import { ArrowRight, CheckCircle2, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/theme";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-blueprint-grid opacity-50" aria-hidden />
      <div className="absolute -right-32 -top-32 size-[32rem] rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground/85">
            <span className="size-1.5 rounded-full bg-accent" /> MEP Drafting for Permit
          </span>
          {/* Explicit {" "} so the spaces either side of the accent span survive
              JSX formatting and the balanced-text wrap. */}
          <h1 className="mt-5 text-balance font-sans text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            Expert{" "}
            <span className="text-accent">CAD Drafting Services</span>{" "}
            to Cut Down on Repetitive Drafting Time for Permit
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            {brand.heroSubhead}
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {brand.promises.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-primary-foreground/90">
                <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-accent" /> {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link href="/request-quote">Request a Quote <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white">
              <Link href="/contact"><CalendarCheck className="size-4" /> Book Your Free Consultation</Link>
            </Button>
          </div>
        </div>

        {/* Blueprint panel */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 rounded-2xl border border-white/15 bg-white/[0.03] shadow-2xl" />
          <div className="relative flex h-full flex-col justify-between rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[11px] uppercase tracking-widest text-primary-foreground/60">
              <span>Sheet E-101</span><span>2D / AutoCAD</span>
            </div>
            <svg viewBox="0 0 460 300" className="my-4 w-full" role="img" aria-label="Sample electrical plan schematic">
              <g stroke="var(--accent)" strokeWidth="1.4" fill="none" opacity="0.9">
                <rect x="40" y="40" width="46" height="120" />
                <line x1="86" y1="60" x2="360" y2="60" /><circle cx="360" cy="60" r="5" />
                <line x1="86" y1="90" x2="300" y2="90" /><circle cx="300" cy="90" r="5" />
                <line x1="86" y1="120" x2="330" y2="120" /><circle cx="330" cy="120" r="5" />
                <line x1="86" y1="150" x2="260" y2="150" /><circle cx="260" cy="150" r="5" />
              </g>
              <g stroke="#8fb3ff" strokeWidth="1.2" fill="none" opacity="0.7">
                <rect x="120" y="200" width="40" height="20" /><rect x="200" y="200" width="40" height="20" /><rect x="280" y="200" width="40" height="20" />
                <line x1="140" y1="210" x2="140" y2="210" /><circle cx="360" cy="230" r="8" /><line x1="355" y1="230" x2="365" y2="230" />
              </g>
              <text x="40" y="285" fill="rgba(255,255,255,0.45)" fontFamily="monospace" fontSize="11">POWER + LIGHTING PLAN — DRAFTING STUDIO</text>
            </svg>
            <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
              {[["48h", "Turnaround"], ["NEC", "Code-drawn"], ["DWG", "+ PDF"]].map(([v, l]) => (
                <div key={l}>
                  <div className="font-sans text-xl font-extrabold text-accent">{v}</div>
                  <div className="text-[11px] uppercase tracking-wide text-primary-foreground/60">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
