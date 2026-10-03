import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { getNavData } from "@/lib/queries";
import { INDUSTRIES } from "@/lib/taxonomy";
import { brand } from "@/lib/theme";

export async function SiteFooter() {
  const nav = await getNavData();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Logo className="[&_span]:text-white" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Nationwide 2D AutoCAD design &amp; drafting for engineering firms, contractors, architects and developers. Electrical, HVAC, plumbing, fire protection and lighting — permit-ready.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-primary-foreground/80">
            <a href={`mailto:${brand.contact.email}`} className="inline-flex items-center gap-2 hover:text-accent">
              <Mail className="size-4" /> {brand.contact.email}
            </a>
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {brand.contact.addressLine1}, {brand.contact.city}, {brand.contact.state}
            </span>
          </div>
          <div className="mt-5 flex gap-2">
            <SocialLink href={brand.socials.linkedin} label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>
            </SocialLink>
            <SocialLink href={brand.socials.facebook} label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" /></svg>
            </SocialLink>
            <SocialLink href={brand.socials.instagram} label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg>
            </SocialLink>
          </div>
        </div>

        {/* Services columns (first 2 categories + rest) */}
        {nav.slice(0, 2).map((cat) => (
          <FooterCol key={cat.slug} title={cat.name}>
            {cat.services.slice(0, 6).map((s) => (
              <FooterLink key={s.slug} href={`/services/${cat.slug}/${s.slug}`}>{s.name}</FooterLink>
            ))}
          </FooterCol>
        ))}

        <FooterCol title="Industries">
          {INDUSTRIES.slice(0, 7).map((i) => (
            <FooterLink key={i.slug} href={`/industries/${i.slug}`}>{i.name}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/process">Our Process</FooterLink>
          <FooterLink href="/why-us">Why Drafting Studio</FooterLink>
          <FooterLink href="/blog">Blog</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
          <FooterLink href="/careers">Careers</FooterLink>
          <FooterLink href="/request-quote">Request a Quote</FooterLink>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-primary-foreground/60 sm:flex-row">
          <p>© {year} {brand.legalName}. All rights reserved. 2D AutoCAD drafting services.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary-foreground/50">{title}</h3>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-primary-foreground/75 transition-colors hover:text-accent">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-white/15 text-primary-foreground/80 transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}
