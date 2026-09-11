/**
 * Brand + identity config for Drafting Studio.
 *
 * This is the ONE file to edit when rebranding: name, tagline, contact details,
 * headline stats, and social links. Colors live in app/globals.css. The database
 * SiteSetting row can override the contact/stats values at runtime (edited from
 * the admin dashboard); this object is the build-time default and fallback.
 */

export const brand = {
  name: "Drafting Studio",
  shortName: "Drafting Studio",
  legalName: "Drafting Studio LLC",
  tagline: "2D AutoCAD Drafting for MEP, Fire Protection & Lighting",
  // Used for SEO: the meta description, OpenGraph/Twitter cards and the RSS feed.
  descriptor:
    "Nationwide 2D AutoCAD design & drafting for engineering firms, contractors, architects and developers. Electrical, HVAC, plumbing, fire protection, lighting — permit-ready plans, fast.",
  // The paragraph under the homepage hero headline. Kept separate from the
  // descriptor so marketing copy can change without touching SEO metadata.
  heroSubhead:
    "Our pre-vetted, US-trained CAD drafters will take care of detailed MEP CAD drawing and AutoCAD drafting services for you so your design team can concentrate on core work.",
  domain: "draftingstudio.example",

  contact: {
    phonePrimary: "(212) 555-0142",
    phoneSecondary: "(786) 555-0198",
    email: "sales@draftingstudio.example",
    supportEmail: "support@draftingstudio.example",
    addressLine1: "1180 Avenue of the Americas",
    addressLine2: "Suite 800",
    city: "New York",
    state: "NY",
    zip: "10036",
    hours: "Mon–Fri, 8am–7pm ET",
  },

  offices: [
    { city: "New York", line1: "1180 Avenue of the Americas, Suite 800", region: "New York, NY 10036", phone: "(212) 555-0142" },
    { city: "Miami", line1: "78 SW 7th Street, Floor 5", region: "Miami, FL 33130", phone: "(786) 555-0198" },
  ],

  socials: {
    linkedin: "https://linkedin.com/company/drafting-studio",
    facebook: "https://facebook.com/draftingstudio",
    instagram: "https://instagram.com/draftingstudio",
    youtube: "https://youtube.com/@draftingstudio",
  },

  /** Headline stats for the homepage band + about page. Framed around 2D speed. */
  stats: [
    { value: "6,200+", label: "Drawing Sets Delivered" },
    { value: "48 hrs", label: "Typical Turnaround" },
    { value: "50", label: "States Covered" },
    { value: "98%", label: "First-Time Permit Approval" },
  ],

  /** Short value props reused across hero + CTA bands. */
  promises: [
    "High-Precision MEP Drafting Services",
    "Permit-ready, code-compliant DWG & PDF sets",
    "On-Demand Team Available In 24 Hours",
    "Local US Building Codes and ADA Standards",
  ],
} as const;

export type Brand = typeof brand;
