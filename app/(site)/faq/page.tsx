import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/shared/cta-band";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Drafting Studio's 2D AutoCAD drafting services — deliverables, turnaround, stamping, pricing and more.",
};

const FAQS = [
  { q: "Do you stamp the drawings?", a: "No. We're a drafting studio, not the engineer of record. We deliver permit-ready 2D sets that your licensed engineer reviews and stamps. Many of our clients are engineering firms who stamp in-house." },
  { q: "Is everything delivered in 2D AutoCAD?", a: "Yes — we work exclusively in 2D AutoCAD and deliver layered DWG plus plotted PDF sets. That focus keeps files portable, turnaround fast, and cost down. For most permit sets, 2D is exactly what the plan reviewer wants." },
  { q: "What files do I receive?", a: "Layered AutoCAD DWG files plus plotted PDFs. DXF is available on request, and calculation reports come as PDF/XLSX." },
  { q: "Can you match our CAD standard?", a: "Yes. Send your title block, layer standard, or a sample sheet and we draft to it so the output drops straight into your set." },
  { q: "How fast is turnaround?", a: "Most sets are delivered in 3–7 business days depending on scope and size. Rush service is available, and you get a fixed quote and delivery date within 24 hours of sending scope." },
  { q: "How much does it cost?", a: "Every project is priced individually. Send us your scope and we reply with a custom fixed-price offer and a delivery date within one business day — no standard rate card, because no two sets are the same." },
  { q: "What do you need to start?", a: "Typically an architectural floor plan (DWG or PDF), any equipment schedules or selections, and the applicable code / local amendments. Each service page lists its specific document requirements." },
  { q: "Which codes do you draft to?", a: "Current US codes: NEC (NFPA 70), IMC, IPC, NFPA 13 and 72, and IES for lighting — plus your local amendments." },
  { q: "Do you offer revisions?", a: "Yes — two minor revisions are included on every set so it lands right. Larger scope changes are quoted separately." },
  { q: "What areas do you serve?", a: "All 50 US states. We work remotely with firms, contractors, architects and developers nationwide." },
  { q: "Can you handle multi-location / franchise rollouts?", a: "Absolutely — it's one of our specialties. We lock your prototype and adapt it per site and jurisdiction, keeping every location consistent to the sheet." },
  { q: "Do you provide calculations too?", a: "Yes — electrical load calculations, HVAC heating & cooling loads, sprinkler hydraulic reports, and photometric studies, either standalone or paired with drafting." },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about working with a 2D AutoCAD drafting studio."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section className="py-14">
        <div className="container-page max-w-3xl">
          <FaqAccordion faqs={FAQS} />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Still have a question?{" "}
            <Link href="/contact" className="font-semibold text-primary hover:underline">Get in touch →</Link>
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
