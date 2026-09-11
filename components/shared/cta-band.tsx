import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/theme";

export function CtaBand({
  title = "Get a fixed drafting quote in under 24 hours",
  description = "Send us your architectural plans and scope. We'll come back with a fixed price and a turnaround date — no obligation.",
  primaryLabel = "Request a Quote",
  primaryHref = "/request-quote",
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-blueprint-grid opacity-40" aria-hidden />
      <div className="container-page relative flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-balance font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-primary-foreground/80">{description}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link href={primaryHref}>
              {primaryLabel} <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
          >
            <a href={`tel:${brand.contact.phonePrimary.replace(/[^\d+]/g, "")}`}>
              <Phone className="size-4" /> {brand.contact.phonePrimary}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
