import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getSettings } from "@/lib/queries";
import { brand } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Drafting Studio for 2D AutoCAD drafting. Send a message, request a callback, or start a quote.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const offices = (settings?.offices as { city: string; line1: string; region: string; phone: string }[]) ?? brand.offices;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your drafting"
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
                  <Phone className="size-4 text-primary" />
                  <a href={`tel:${brand.contact.phonePrimary.replace(/[^\d+]/g, "")}`} className="hover:text-primary">{brand.contact.phonePrimary}</a>
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
            {offices.map((o) => (
              <div key={o.city} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <MapPin className="size-4 text-primary" /> {o.city}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{o.line1}<br />{o.region}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
