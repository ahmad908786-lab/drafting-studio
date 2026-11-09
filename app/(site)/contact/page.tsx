import type { Metadata } from "next";
import { Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { absoluteUrl } from "@/lib/utils";
import { whatsappUrl, whatsappDisplay } from "@/lib/whatsapp";
import { brand } from "@/lib/theme";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/contact") },
  title: "Contact Us",
  description: "Get in touch with Drafting Studio for 2D AutoCAD drafting. Send a message, request a callback, or start a quote.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Drafting Studio — Get a Drafting Quote"
        description="Questions, scope, or a quote — we reply within one business day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <Tabs defaultValue="message">
              <TabsList className="mb-6">
                <TabsTrigger value="message">Send a message</TabsTrigger>
                <TabsTrigger value="callback">Request a callback</TabsTrigger>
              </TabsList>
              <TabsContent value="message">
                <ContactForm type="CONTACT" submitLabel="Send message" />
              </TabsContent>
              <TabsContent value="callback">
                <ContactForm type="CALLBACK" submitLabel="Request callback" />
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h3 className="mb-3 text-sm font-bold text-foreground">Reach us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <WhatsAppIcon className="size-4 text-[#25D366]" />
                  <a
                    href={whatsappUrl("Hi Drafting Studio! I need a quote for 2D CAD drafting.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    WhatsApp: {whatsappDisplay()}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-primary" />
                  <a href={`mailto:${brand.contact.email}`} className="hover:text-primary">{brand.contact.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="size-4 text-primary" /> {brand.contact.hours}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <section className="border-t border-border bg-secondary/40 py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">What happens next</h2>
          <p className="mt-3 text-muted-foreground">
            We reply within one business day. If you asked for a quote, we will come back with a fixed price and a delivery date, or with a short list of questions if your scope needs anything else. If you sent a general question, you will get a direct answer from someone who drafts, not a sales script.
          </p>
          <p className="mt-3 text-muted-foreground">
            To get the fastest answer, tell us the project type, the size and location, your timeline, and attach the plans you already have. Floor plans in DWG or PDF, equipment selections, and any local amendments all help. Everything you send stays confidential and is used only to prepare your drafting work.
          </p>
        </div>
      </section>
    </>
  );
}
