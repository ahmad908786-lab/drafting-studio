import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { breadcrumbJsonLd, itemListJsonLd, ORG_ID } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/tools") },
  title: "Free Tools | Drafting Studio",
  description:
    "Free tools from Drafting Studio: an NEC Article 220 electrical load calculator for dwellings and small commercial buildings.",
};

const toolsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Tools",
    url: absoluteUrl("/tools"),
    description:
      "Free tools from Drafting Studio: an NEC Article 220 electrical load calculator for dwellings and small commercial buildings.",
    mainEntity: { "@id": ORG_ID },
    hasPart: itemListJsonLd([
      {
        name: "Electrical Load Calculator",
        url: absoluteUrl("/tools/electrical-load-calculator"),
      },
    ]),
  },
  breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Tools" }]),
];

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={toolsJsonLd} />
      <PageHero
        eyebrow="Tools"
        title="Free Tools"
        description="Small, focused tools for the work we draft every day. No sign-up, no download, the calculation runs in your browser."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}
      />

      <section className="py-14">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/tools/electrical-load-calculator"
            className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <h2 className="font-sans text-xl font-bold">
              Electrical Load Calculator
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Size a dwelling or small commercial service with the NEC Article
              220 standard method. Every demand factor is shown, so you can
              check each line against the Code.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Open the calculator
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
