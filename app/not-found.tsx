import Link from "next/link";
import { Home, Search, ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary px-4 text-center text-primary-foreground">
      <div className="absolute inset-0 bg-blueprint-grid opacity-40" aria-hidden />
      <div className="relative">
        <Logo className="mx-auto mb-8 [&_span]:text-white" />
        <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-accent">Error 404</p>
        <h1 className="mt-3 font-sans text-6xl font-extrabold tracking-tight sm:text-7xl">Sheet not found</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-primary-foreground/75">
          This drawing isn&apos;t in the set. It may have been moved or the link is off by a revision.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg"><Link href="/"><Home className="size-4" /> Back home</Link></Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white">
            <Link href="/services"><Search className="size-4" /> Browse services</Link>
          </Button>
        </div>
        <Link href="/request-quote" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
          Or request a quote <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
