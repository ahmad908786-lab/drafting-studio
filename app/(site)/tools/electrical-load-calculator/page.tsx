import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaBand } from "@/components/shared/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { ElectricalLoadCalculator } from "@/components/calculators/electrical-load-calculator";
import { absoluteUrl } from "@/lib/utils";
import { breadcrumbJsonLd, ORG_ID } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/tools/electrical-load-calculator") },
  title: "Electrical Load Calculator | NEC 220 Service Sizing",
  description:
    "Electrical load calculator using the NEC Article 220 standard method. Size a dwelling or small commercial service in amps, with every demand factor shown.",
};

const faqs = [
  {
    question: "Which NEC edition does this calculator follow?",
    answer:
      "NEC 2023, Article 220, standard method. The 2026 NEC moves load calculations to Article 120 and cuts the dwelling general lighting load from 3 VA to 2 VA per square foot for feeder and service work, while branch circuits stay at 3 VA per square foot. Check which edition your AHJ enforces before you submit.",
  },
  {
    question: "Does it cover dwellings and commercial buildings?",
    answer:
      "Yes. The dwelling mode follows the Part III standard method: general lighting at 3 VA per square foot, small-appliance and laundry circuits, Table 220.42 demand, range, dryer, fixed appliances and HVAC. The small commercial mode covers one occupancy (office, retail, restaurant, warehouse or school) with Table 220.42(A) lighting loads, receptacles at 180 VA each, kitchen equipment, motors and signage, up to a 600 A service.",
  },
  {
    question: "What does the recommended service size mean?",
    answer:
      "It is the next standard service rating at or above the calculated current, per 240.6(A). A 135.9 A demand becomes a 150 A service, not a 135.9 A one, because services are built in standard sizes. Dwellings always get at least a 100 A service.",
  },
  {
    question: "What is not in this calculator?",
    answer:
      "EV charging, welders, fire pumps, farm loads and other special equipment each follow their own articles and are not in this tool. The engineer of record adds them, and the AHJ has the final say on the service size.",
  },
];

const calculatorJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Electrical Load Calculator",
    url: absoluteUrl("/tools/electrical-load-calculator"),
    description:
      "Electrical load calculator using the NEC Article 220 standard method. Size a dwelling or small commercial service in amps, with every demand factor shown.",
    mainEntity: { "@id": ORG_ID },
  },
  breadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Electrical Load Calculator" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default function ElectricalLoadCalculatorPage() {
  return (
    <>
      <JsonLd data={calculatorJsonLd} />
      <PageHero
        eyebrow="Free tool"
        title="Electrical Load Calculator"
        description="Size a dwelling or small commercial service with the NEC Article 220 standard method. Every demand factor is shown, so you can check each line against the Code."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Electrical Load Calculator" },
        ]}
      />

      <section className="py-14">
        <div className="container-page">
          <ElectricalLoadCalculator />

          <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-6">
            <h2 className="font-sans text-lg font-bold">
              A planning estimate, not a stamped calculation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This tool runs the NEC 2023 Article 220 standard method on the
              numbers you enter. It does not replace the engineer of record,
              and it does not cover every load in the Code: EV charging,
              welders, fire pumps and other special equipment each follow
              their own articles. The AHJ and the engineer of record decide
              the final service size, and the edition your AHJ adopted
              governs. The 2026 NEC cuts dwelling general lighting to 2 VA
              per square foot for feeder and service work, so if your
              jurisdiction already enforces the 2026 edition, this 2023-based
              result will read high.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="The standard method, line by line"
              className="mb-4"
            />
            <div className="space-y-4 text-muted-foreground">
              <p>
                A load calculation answers one question: how big does the
                service need to be? The standard method in NEC Article 220
                Part III builds the answer from the connected load, then
                applies the demand factors the Code allows, because not
                everything runs at once.
              </p>
              <p>
                For a dwelling, general lighting starts at 3 VA per square
                foot, which already covers the general-use receptacles, so
                they are not added separately. Small-appliance circuits add
                1,500 VA each and the laundry circuit adds 1,500 VA. Table
                220.42 then steps the combined general load down: the first
                3,000 VA at 100%, the next block to 120,000 VA at 35%, and
                anything above that at 25%. Range, dryer, fixed appliances
                and the larger of heating or cooling are added after, each
                with its own rule.
              </p>
              <p>
                For a small commercial building, the lighting load comes from
                Table 220.42(A) by occupancy, receptacles at 180 VA each take
                the Table 220.47 demand, and motors, kitchen equipment and
                signage each follow their own section. The result is a demand
                load in VA, converted to amps at the service voltage, and the
                next standard service size per 240.6(A).
              </p>
              <p>
                Our{" "}
                <Link
                  className="font-semibold text-foreground underline underline-offset-2"
                  href="/blog/electrical-load-calculation-nec-220-walkthrough"
                >
                  NEC Article 220 walkthrough
                </Link>{" "}
                works the full method with a 3,000 sq ft office example, and
                our{" "}
                <Link
                  className="font-semibold text-foreground underline underline-offset-2"
                  href="/blog/panel-schedule-mistakes-that-trigger-plan-review-corrections"
                >
                  panel schedule guide
                </Link>{" "}
                shows how the totals land on the schedule without triggering
                corrections.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
            <h3 className="font-sans text-lg font-bold">
              Worked example: 2,000 sq ft dwelling
            </h3>
            <p className="mt-2 text-sm text-primary-foreground/80">
              The calculator above is prefilled with this example. Change any
              number and the result updates.
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-primary-foreground/20 pb-3">
                <dt className="text-primary-foreground/80">
                  General lighting, 2,000 sq ft at 3 VA
                </dt>
                <dd className="font-semibold tabular-nums">6,000 VA</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-primary-foreground/20 pb-3">
                <dt className="text-primary-foreground/80">
                  Small-appliance and laundry circuits
                </dt>
                <dd className="font-semibold tabular-nums">4,500 VA</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-primary-foreground/20 pb-3">
                <dt className="text-primary-foreground/80">
                  General load after Table 220.42 demand
                </dt>
                <dd className="font-semibold tabular-nums">5,625 VA</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-primary-foreground/20 pb-3">
                <dt className="text-primary-foreground/80">
                  Range, dryer, fixed appliances, HVAC
                </dt>
                <dd className="font-semibold tabular-nums">27,000 VA</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-primary-foreground/20 pb-3">
                <dt className="text-primary-foreground/80">
                  Total demand load
                </dt>
                <dd className="font-semibold tabular-nums">32,625 VA</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-primary-foreground/80">
                  Service current and size, 120/240 V
                </dt>
                <dd className="font-semibold tabular-nums">135.9 A, 150 A service</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="container-page max-w-3xl">
          <SectionHeading
            eyebrow="Questions"
            title="About this calculator"
            className="mb-8"
          />
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-sans text-lg font-bold">{faq.question}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Need the stamped calculation behind the estimate?"
        description="Send your equipment list and plans. We will produce the NEC Article 220 load calculation, panel schedules and utility load letter as a permit-ready set."
        primaryLabel="Request a Quote"
        primaryHref="/request-quote"
      />
    </>
  );
}
