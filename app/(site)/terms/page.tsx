import type { Metadata } from "next";
import { LegalPage } from "@/app/(site)/legal/legal-content";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      sections={[
        { heading: "Scope of services", body: ["Drafting Studio provides 2D AutoCAD drafting and related calculations. We are not the engineer of record and do not stamp or seal drawings. Sets we deliver are intended to be reviewed and stamped by your licensed professional engineer."] },
        { heading: "Quotes and payment", body: ["Fixed quotes are based on the scope and documents you provide. Changes in scope may adjust the price and timeline. Payment terms are stated on your quote."] },
        { heading: "Revisions", body: ["Two minor revisions are included with each set. Additional revisions or scope changes are quoted separately."] },
        { heading: "Deliverables and ownership", body: ["Upon payment, you receive the deliverables (layered DWG and PDF) for use on the project they were prepared for. You are responsible for final review, engineering judgment, stamping, and permit submission."] },
        { heading: "Confidentiality", body: ["We keep the plans and documents you provide confidential and use them solely to perform your work."] },
        { heading: "Limitation of liability", body: ["Our work product supports your design and permitting process but does not replace the review and professional responsibility of your engineer of record. Liability is limited to the fees paid for the affected work."] },
      ]}
    />
  );
}
