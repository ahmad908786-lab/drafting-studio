/**
 * Shared taxonomy + enums for Drafting Studio.
 *
 * This is the single source of truth for the fixed structural vocabulary of the
 * site: the five drafting disciplines, the four service-category groups, project
 * stages, quote statuses, blog templates, etc. Content-heavy records (individual
 * services, industries, projects, blog posts) live in the database and are
 * created by prisma/seed.ts — but they reference the slugs and enum values here.
 *
 * SCOPE NOTE: This studio provides 2D AutoCAD drafting only — flat plan and
 * schematic work, nothing model-based.
 */

/* ------------------------------------------------------------------ */
/* Disciplines — chips on project + service cards.                     */
/* ------------------------------------------------------------------ */

export const DISCIPLINES = [
  { value: "ELECTRICAL", slug: "electrical", label: "Electrical", color: "var(--discipline-electrical)", icon: "Zap" },
  { value: "HVAC", slug: "hvac", label: "HVAC", color: "var(--discipline-hvac)", icon: "Wind" },
  { value: "PLUMBING", slug: "plumbing", label: "Plumbing", color: "var(--discipline-plumbing)", icon: "Droplets" },
  { value: "LIGHTING", slug: "lighting", label: "Lighting", color: "var(--discipline-lighting)", icon: "Lightbulb" },
  { value: "FIRE_PROTECTION", slug: "fire-protection", label: "Fire Protection", color: "var(--discipline-fire)", icon: "Flame" },
] as const;

export type DisciplineValue = (typeof DISCIPLINES)[number]["value"];
export type DisciplineSlug = (typeof DISCIPLINES)[number]["slug"];

export const DISCIPLINE_BY_SLUG = Object.fromEntries(
  DISCIPLINES.map((d) => [d.slug, d]),
) as Record<DisciplineSlug, (typeof DISCIPLINES)[number]>;

export const DISCIPLINE_BY_VALUE = Object.fromEntries(
  DISCIPLINES.map((d) => [d.value, d]),
) as Record<DisciplineValue, (typeof DISCIPLINES)[number]>;

export function disciplineLabel(value: string): string {
  return DISCIPLINE_BY_VALUE[value as DisciplineValue]?.label ?? value;
}

/* ------------------------------------------------------------------ */
/* Service categories — the four mega-menu columns.                    */
/* ------------------------------------------------------------------ */

export const SERVICE_CATEGORIES = [
  { slug: "electrical-design", name: "Electrical Design", icon: "Zap", blurb: "Power, lighting, site & low-voltage plans.", seoDesc: "Electrical design drafting in 2D AutoCAD: power plans, lighting design, single-line diagrams, fire alarm & photometrics — permit-ready for AHJ approval." },
  { slug: "mechanical-design", name: "Mechanical Design", icon: "Wind", blurb: "HVAC and plumbing layouts, ducts & piping.", seoDesc: "Mechanical design drafting in 2D AutoCAD: HVAC ductwork, equipment & controls plus plumbing — water, waste, vent & gas — in coordinated permit-ready sets." },
  { slug: "fire-protection", name: "Fire Protection", icon: "Flame", blurb: "Sprinkler layouts, fire alarm & hydraulics.", seoDesc: "Fire protection drafting services: NFPA 13 sprinkler layouts, fire alarm system design to NFPA 72 & hydraulic reports — 2D, permit-ready drawing sets." },
  { slug: "calculations-reports", name: "Calculations & Reports", icon: "Calculator", blurb: "Load calcs, hydraulic & photometric reports.", seoDesc: "MEP calculations & reports: NEC Article 220 electrical load calcs, Manual-J/ASHRAE HVAC loads & IES photometric studies — stamp-ready engineering basis." },
] as const;

export type ServiceCategorySlug = (typeof SERVICE_CATEGORIES)[number]["slug"];

/* ------------------------------------------------------------------ */
/* Industries — project filtering + landing pages.                     */
/* ------------------------------------------------------------------ */

export const INDUSTRIES = [
  { slug: "franchise", name: "Franchise", icon: "Store" },
  { slug: "residential", name: "Residential", icon: "Home" },
  { slug: "commercial", name: "Commercial", icon: "Building2" },
  { slug: "restaurant", name: "Restaurant", icon: "UtensilsCrossed" },
  { slug: "healthcare", name: "Healthcare", icon: "Stethoscope" },
  { slug: "salon", name: "Salon & Spa", icon: "Scissors" },
  { slug: "hotel", name: "Hotel", icon: "BedDouble" },
  { slug: "apartments", name: "Apartments", icon: "Building" },
  { slug: "plaza", name: "Plaza", icon: "ShoppingBag" },
  { slug: "offices", name: "Offices", icon: "Briefcase" },
  { slug: "warehouse", name: "Warehouse", icon: "Warehouse" },
] as const;

export type IndustrySlug = (typeof INDUSTRIES)[number]["slug"];

/* ------------------------------------------------------------------ */
/* Enum-like constants shared with Prisma models.                      */
/* ------------------------------------------------------------------ */

export const PROJECT_STAGES = [
  { value: "KICKOFF", label: "Kickoff", pct: 10 },
  { value: "DRAFTING", label: "Drafting", pct: 45 },
  { value: "QC", label: "Quality Check", pct: 75 },
  { value: "DELIVERED", label: "Delivered", pct: 100 },
  { value: "REVISIONS", label: "Revisions", pct: 90 },
] as const;

export type ProjectStage = (typeof PROJECT_STAGES)[number]["value"];

export const PROJECT_STATUSES = ["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const QUOTE_STATUSES = [
  { value: "NEW", label: "New", color: "info" },
  { value: "REVIEWING", label: "Reviewing", color: "warning" },
  { value: "QUOTED", label: "Quoted", color: "accent" },
  { value: "WON", label: "Won", color: "success" },
  { value: "LOST", label: "Lost", color: "destructive" },
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number]["value"];

export const BUDGET_RANGES = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Not sure yet",
] as const;

export const POST_TEMPLATES = [
  { value: "STANDARD", label: "Standard Article", desc: "Cover hero, sticky table of contents, author card." },
  { value: "TECHNICAL_GUIDE", label: "Technical Guide", desc: "Numbered section nav, spec tables, formula callouts." },
  { value: "CASE_STUDY", label: "Case Study", desc: "Stats banner, challenge/solution/result, drawing gallery." },
  { value: "LISTICLE", label: "Listicle", desc: "Numbered card sections with per-item images." },
  { value: "EDITORIAL", label: "Editorial", desc: "Wide single column, oversized pull quotes." },
] as const;

export type PostTemplate = (typeof POST_TEMPLATES)[number]["value"];

export const POST_STATUSES = ["DRAFT", "SCHEDULED", "PUBLISHED"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const LEAD_TYPES = ["CONTACT", "CALLBACK", "NEWSLETTER"] as const;
export const LEAD_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;

export const USER_ROLES = ["ADMIN", "STAFF", "CLIENT"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
] as const;

export const DELIVERABLE_FORMATS = [".dwg", ".pdf", ".dxf (on request)", ".xlsx / .pdf reports"] as const;

/* ------------------------------------------------------------------ */
/* Extra quote-form options                                            */
/* ------------------------------------------------------------------ */

/**
 * Catch-all choices offered in the RFQ wizard only — deliberately NOT rows in
 * the Service table, so they never appear in the nav, the services pages or the
 * rate sheet. createQuote resolves these slugs from here, since the DB lookup
 * that snapshots service names cannot find them.
 */
export const OTHER_QUOTE_SERVICES = [
  { slug: "cad-drafting", name: "CAD Drafting", category: "Other" },
  { slug: "other-scope", name: "Other — tell us below", category: "Other" },
] as const;

export const OTHER_QUOTE_SERVICE_BY_SLUG: Record<string, string> = Object.fromEntries(
  OTHER_QUOTE_SERVICES.map((s) => [s.slug, s.name]),
);
