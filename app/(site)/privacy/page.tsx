import type { Metadata } from "next";
import { LegalPage } from "@/app/(site)/legal/legal-content";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/privacy") },
  title: "Privacy Policy",
  description: "How Drafting Studio collects, uses and protects your information when you request quotes or create an account.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        { heading: "Information we collect", body: ["We collect the information you provide when you request a quote, contact us, subscribe to our newsletter, or create an account — such as your name, email, phone, company, and project details and files you upload.", "We also collect basic usage data through standard web analytics to improve the site."] },
        { heading: "How we use it", body: ["We use your information to respond to inquiries, prepare quotes, deliver drafting work, manage your account and projects, and send updates you've asked for. We do not sell your personal information."] },
        { heading: "Files you upload", body: ["Plans and documents you upload as part of a quote or project are used solely to prepare and deliver your drafting work. We treat them as confidential."] },
        { heading: "Cookies", body: ["We use essential cookies for authentication and site functionality, and optional analytics cookies you can decline."] },
        { heading: "Your rights", body: ["You can request access to, correction of, or deletion of your personal information by contacting us. We retain project records only as long as needed for our services and legal obligations."] },
        { heading: "Contact", body: ["Questions about this policy? Email us and we'll respond promptly."] },
      ]}
    />
  );
}
