import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
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
              <Link href="/contact"><Mail className="size-4" /> Email Us</Link>
            </Button>
          </div>
        </div>

        {/* Hero image — oversized and masked so every edge dissolves into the navy
            rather than ending on a hard border. */}
        <div className="hidden items-center lg:flex">
          <Image
            src="/hero/mep-coordination.webp"
            alt="MEP coordination drawing set laid out beside a building model"
            width={1699}
            height={941}
            sizes="(max-width: 1024px) 0px, 70vw"
            className="h-auto w-[132%] max-w-none -translate-x-[4%] scale-105"
            style={{
              maskImage:
                "radial-gradient(ellipse 72% 72% at 50% 50%, #000 42%, rgba(0,0,0,0.75) 62%, transparent 88%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 72% at 50% 50%, #000 42%, rgba(0,0,0,0.75) 62%, transparent 88%)",
            }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
