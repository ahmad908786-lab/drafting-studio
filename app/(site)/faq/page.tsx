import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/shared/cta-band";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/faq") },
  title: "2D AutoCAD Drafting FAQs",
  description: "2D AutoCAD drafting FAQs: answers on deliverables, turnaround, stamping, pricing and file formats for our permit-ready drafting services, all in one place.",
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
        title="2D CAD Drafting FAQs — Deliverables, Turnaround & Pricing"
        description="Everything you need to know about working with a 2D AutoCAD drafting studio."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section className="py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">How to get an answer fast</h2>
          <p className="mt-3 text-muted-foreground">
            Most questions about our drafting service have a short answer. We draft permit-ready 2D AutoCAD sets for engineering firms, contractors, architects and developers across the United States, and every set is delivered as a layered DWG plus a plotted PDF, QC-checked, with two free minor revisions. If you send your scope, you get a fixed price and a delivery date within one business day, with no meeting and no obligation.
          </p>
          <p className="mt-3 text-muted-foreground">
            The questions below cover deliverables, turnaround, stamping, pricing and what we need to start. If your question is about a specific project, send the plans and a short description through the contact form or the quote wizard, and we will answer with your scope in mind instead of a generic reply.
          </p>
          <div className="mt-8">
            <FaqAccordion faqs={FAQS} />
          </div>
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
