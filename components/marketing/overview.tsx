import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Complete 2D drafting across electrical, HVAC, plumbing and fire protection — from redlines to permit sets",
  "Code-compliant drawings built to NEC, IMC, IPC and NFPA standards",
  "Delivered in native AutoCAD DWG + PDF, layered to your CAD standard",
  "Fixed quote in 72 hours with a confirmed delivery date — no meetings required",
  "QA/QC checks on every sheet before it reaches your desk",
  "Two free minor revisions included with every drawing set",
];

export function Overview() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Overview</p>
        <h2 className="mt-2 max-w-3xl text-balance font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          MEP Drafting Designed for <span className="text-accent">Speed, Standards and Scale</span>
        </h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          When you outsource drafting to a team that lives in AutoCAD, your whole delivery
          changes — cleaner coordination, faster drawing production, and sets that stay on
          schedule from first redline to permit approval.
        </p>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            <Image
              src="/generated/landing/overview-drafting.jpg"
              alt="Architectural illustration of a house over blueprint linework with rolled construction drawings"
              width={1200}
              height={800}
              className="h-auto w-full"
              priority={false}
            />
          </div>

          <div>
            <h3 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">
              A Dedicated Drafting Team for Your Firm
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
