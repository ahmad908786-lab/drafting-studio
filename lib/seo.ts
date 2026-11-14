/**
 * Shared SEO / AEO / GEO helpers (Nov 2026).
 *
 * One place for the structured-data entities every page reuses, so the
 * Organization is defined once and referenced everywhere else by @id.
 * Only mark up content that is visible on the page.
 */
import { absoluteUrl } from "@/lib/utils";
import { brand } from "@/lib/theme";

/** Stable @id for the Organization entity; other schema references it. */
export const ORG_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

/**
 * Organization entity (ProfessionalService is the closest schema.org fit;
 * there is no drafting-specific subtype). No foundingDate / address /
 * telephone: none of those is a verified fact on the site, so they stay out
 * rather than invented. sameAs lists only the social profiles we own and
 * have verified (LinkedIn + Facebook); the YouTube handle is unconfirmed.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: brand.name,
    slogan: brand.tagline,
    description: brand.descriptor,
    url: absoluteUrl(),
    logo: absoluteUrl("/logo.png"),
    email: brand.contact.email,
    areaServed: "US",
    knowsAbout: [
      "2D AutoCAD drafting",
      "MEP drafting",
      "HVAC drafting",
      "electrical drafting",
      "plumbing drafting",
      "fire protection drafting",
      "permit-ready drawings",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: brand.contact.email,
      areaServed: "US",
      availableLanguage: "en",
    },
    sameAs: [brand.socials.linkedin, brand.socials.facebook],
  };
}

/** WebSite entity, emitted on the homepage only. No SearchAction: the site
 * has no site-wide internal search (the blog has its own scoped search). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: brand.name,
    url: absoluteUrl(),
    publisher: { "@id": ORG_ID },
  };
}

export type Crumb = { label: string; href?: string };

/** BreadcrumbList mirroring the visible breadcrumb nav. The last crumb has
 * no href (it is the current page); schema.org allows a name-only ListItem. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
}

/** ItemList for CollectionPage `hasPart` (category / index pages). */
export function itemListJsonLd(items: { name: string; url: string }[]) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/**
 * Trim a meta description to `max` chars (default 155) at a sentence end
 * where possible, else at the last word boundary. Returns the input
 * unchanged when it already fits. Used for DB-driven descriptions whose
 * source text lives in prisma/content and would otherwise need a live DB
 * sync to change.
 */
export function trimDescription(desc: string | null | undefined, max = 155): string | undefined {
  if (!desc) return undefined;
  if (desc.length <= max) return desc;
  const head = desc.slice(0, max);
  // Prefer a full sentence: last ". " / "? " / "! " inside the limit.
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("? "), head.lastIndexOf("! "));
  if (sentenceEnd > 60) return head.slice(0, sentenceEnd + 1);
  const lastSpace = head.lastIndexOf(" ");
  return lastSpace > 60 ? head.slice(0, lastSpace) : head;
}
