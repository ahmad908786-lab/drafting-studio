/**
 * Additive demo data for the admin dashboard and client portal.
 *
 * Adds companies, client logins, quote requests and client projects on top of
 * whatever is already there — it never deletes or overwrites. Safe to re-run:
 * every record is keyed by a unique slug / ref number and skipped if present.
 *
 * Run: npx tsx prisma/seed-demo.ts
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import { blueprintSvg, avatarSvg } from "./svg";

const prisma = new PrismaClient();
const PUB = join(process.cwd(), "public", "generated");
const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);
const inDays = (n: number) => new Date(now.getTime() + n * 86_400_000);

function writeSvg(folder: string, name: string, svg: string): string {
  const dir = join(PUB, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.svg`), svg, "utf8");
  return `/generated/${folder}/${name}.svg`;
}

/* ---------------------------------------------------------------- */
/* Companies + their client logins                                    */
/* ---------------------------------------------------------------- */
const COMPANIES = [
  {
    slug: "northline-builders", name: "Northline Builders",
    city: "Denver", state: "CO", phone: "(303) 555-0118", website: "https://northline.example",
    contact: { name: "Dana Whitfield", email: "dana@northline.example" },
  },
  {
    slug: "harbor-point-hospitality", name: "Harbor Point Hospitality",
    city: "Savannah", state: "GA", phone: "(912) 555-0164", website: "https://harborpoint.example",
    contact: { name: "Marcus Elliot", email: "marcus@harborpoint.example" },
  },
  {
    slug: "vertex-mep-engineers", name: "Vertex MEP Engineers",
    city: "Portland", state: "OR", phone: "(503) 555-0107", website: "https://vertexmep.example",
    contact: { name: "Sofia Nakamura", email: "sofia@vertexmep.example" },
  },
];

/* ---------------------------------------------------------------- */
/* Quote requests across every pipeline status                        */
/* ---------------------------------------------------------------- */
const QUOTES = [
  {
    ref: "0005", status: "NEW", name: "Ravi Menon", email: "ravi@brightpathdev.example",
    phone: "(206) 555-0141", companyName: "Brightpath Development", industry: "apartments",
    services: [{ slug: "electrical-system-design", name: "Electrical System Design" }, { slug: "single-line-diagram", name: "Single Line Diagram" }],
    state: "WA", sqft: 18500, floors: 4, budget: "$5,000 – $15,000", deadline: 25, d: 0,
    description: "48-unit apartment building. Need unit and house panel design plus the service one-line for permit.",
  },
  {
    ref: "0006", status: "NEW", name: "Dana Whitfield", email: "dana@northline.example",
    phone: "(303) 555-0118", companyName: "Northline Builders", industry: "offices",
    services: [{ slug: "power-upgrade", name: "Power Upgrade" }],
    state: "CO", sqft: 6200, floors: 2, budget: "$1,500 – $5,000", deadline: 20, d: 1,
    company: "northline-builders",
    description: "Existing 200A service is maxed out after adding server room loads. Need an upgrade set to 400A.",
  },
  {
    ref: "0007", status: "REVIEWING", name: "Marcus Elliot", email: "marcus@harborpoint.example",
    phone: "(912) 555-0164", companyName: "Harbor Point Hospitality", industry: "hotel",
    services: [{ slug: "sprinkler-layout-plan", name: "Sprinkler Layout Plan" }, { slug: "fire-alarm-system-design", name: "Fire Alarm System Design" }],
    state: "GA", sqft: 22000, floors: 5, budget: "$15,000+", deadline: 35, d: 4, assign: true,
    company: "harbor-point-hospitality",
    description: "Historic building conversion to boutique hotel. Sprinkler layout and NFPA 72 fire alarm for all five floors.",
  },
  {
    ref: "0008", status: "REVIEWING", name: "Priya Raman", email: "priya@coastalclinics.example",
    phone: "(619) 555-0175", companyName: "Coastal Clinics", industry: "healthcare",
    services: [{ slug: "hvac-design", name: "HVAC Design" }, { slug: "hvac-heating-cooling-load", name: "HVAC Heating & Cooling Load" }],
    state: "CA", sqft: 8100, floors: 1, budget: "$5,000 – $15,000", deadline: 22, d: 5, assign: true,
    description: "Outpatient clinic fit-out. Need zoned HVAC with the ASHRAE load basis for plan review.",
  },
  {
    ref: "0009", status: "QUOTED", name: "Sofia Nakamura", email: "sofia@vertexmep.example",
    phone: "(503) 555-0107", companyName: "Vertex MEP Engineers", industry: "industrial",
    services: [{ slug: "electrical-load-calculation", name: "Electrical Load Calculation" }, { slug: "single-line-diagram", name: "Single Line Diagram" }],
    state: "OR", sqft: 31000, floors: 1, budget: "$5,000 – $15,000", deadline: 28, d: 8,
    assign: true, quotedAmount: 6400, company: "vertex-mep-engineers",
    description: "Overflow drafting for a fabrication plant. We stamp in-house; need load calcs and a clean one-line.",
  },
  {
    ref: "0010", status: "QUOTED", name: "Eli Foster", email: "eli@fosterretail.example",
    phone: "(214) 555-0129", companyName: "Foster Retail Group", industry: "plaza",
    services: [{ slug: "site-electrical-plan", name: "Site Electrical Plan" }, { slug: "photometric-design", name: "Photometric Design" }],
    state: "TX", sqft: 26000, floors: 1, budget: "$5,000 – $15,000", deadline: 26, d: 10,
    assign: true, quotedAmount: 5200,
    description: "Retail plaza. Site power distribution plus a parking lot photometric study for the city.",
  },
  {
    ref: "0011", status: "WON", name: "Dana Whitfield", email: "dana@northline.example",
    phone: "(303) 555-0118", companyName: "Northline Builders", industry: "restaurant",
    services: [{ slug: "mechanical-design", name: "Mechanical Design" }, { slug: "plumbing-design", name: "Plumbing Design" }],
    state: "CO", sqft: 4400, floors: 1, budget: "$1,500 – $5,000", deadline: 16, d: 24,
    assign: true, quotedAmount: 4300, company: "northline-builders",
    description: "Quick-service restaurant. Type-I hood exhaust, make-up air and grease waste. Converted to an active project.",
  },
  {
    ref: "0012", status: "LOST", name: "Hannah Cole", email: "hannah@summitgc.example",
    phone: "(801) 555-0188", companyName: "Summit General Contractors", industry: "commercial",
    services: [{ slug: "lighting-design", name: "Lighting Design" }],
    state: "UT", sqft: 5200, floors: 2, budget: "Under $500", deadline: 12, d: 30, assign: true,
    description: "Office lighting refresh. Client went with an in-house draftsman on timing.",
  },
];

/* ---------------------------------------------------------------- */
/* Client projects across every stage                                 */
/* ---------------------------------------------------------------- */
const PROJECTS = [
  {
    slug: "northline-qsr-mechanical-2026", company: "northline-builders",
    title: "Northline QSR — Mechanical & Plumbing",
    summary: "Type-I hood exhaust, make-up air and grease waste for a quick-service restaurant.",
    stage: "KICKOFF", progress: 10, status: "ACTIVE",
    disciplines: ["hvac", "plumbing"], services: ["mechanical-design", "plumbing-design"],
    due: 16, sqft: 4400, floors: 1, city: "Denver", state: "CO",
    updates: [{ stage: "KICKOFF", note: "Kickoff call done. Received architectural DWG and the hood cut sheet.", d: 2 }],
    files: [{ name: "Northline-QSR-Architectural.dwg", rev: "R0", visible: true, size: 1_900_000 }],
    messages: [{ from: "staff", body: "We have everything we need to start. Drafting begins Monday.", d: 2 }],
  },
  {
    slug: "harbor-point-hotel-fire-2026", company: "harbor-point-hospitality",
    title: "Harbor Point Hotel — Sprinkler & Fire Alarm",
    summary: "Sprinkler layout and NFPA 72 fire alarm across five floors of a historic conversion.",
    stage: "DRAFTING", progress: 45, status: "ACTIVE",
    disciplines: ["fire-protection", "electrical"], services: ["sprinkler-layout-plan", "fire-alarm-system-design"],
    due: 21, sqft: 22000, floors: 5, city: "Savannah", state: "GA",
    updates: [
      { stage: "KICKOFF", note: "Kickoff complete. Existing conditions survey received.", d: 12 },
      { stage: "DRAFTING", note: "Typical-floor sprinkler layout drafted. Fire alarm riser in progress.", d: 3 },
    ],
    files: [
      { name: "HarborPoint-Existing-Conditions.pdf", rev: "R0", visible: true, size: 3_100_000 },
      { name: "FP-101-Typical-Floor-WIP.pdf", rev: "R1", visible: true, size: 940_000 },
    ],
    messages: [
      { from: "client", body: "The 3rd floor layout changed — two suites merged. Can you re-run that floor?", d: 4 },
      { from: "staff", body: "Got it. Re-drafting level 3 now, no impact on the delivery date.", d: 3 },
    ],
  },
  {
    slug: "vertex-fabrication-calcs-2026", company: "vertex-mep-engineers",
    title: "Vertex Fabrication Plant — Load Calcs & One-Line",
    summary: "Connected and demand load tabulation with a permit-ready single line diagram.",
    stage: "QC", progress: 75, status: "ACTIVE",
    disciplines: ["electrical"], services: ["electrical-load-calculation", "single-line-diagram"],
    due: 6, sqft: 31000, floors: 1, city: "Portland", state: "OR",
    updates: [
      { stage: "KICKOFF", note: "Equipment schedule received and load basis agreed.", d: 16 },
      { stage: "DRAFTING", note: "Load tabulation complete; one-line drafted to the main switchboard.", d: 7 },
      { stage: "QC", note: "Internal QC — checking AIC ratings against the utility fault current.", d: 1 },
    ],
    files: [
      { name: "Vertex-Load-Calculation.pdf", rev: "R2", visible: true, size: 610_000 },
      { name: "E-001-Single-Line.dwg", rev: "R2", visible: true, size: 1_240_000 },
      { name: "QC-checklist-internal.pdf", rev: "R0", visible: false, size: 96_000 },
    ],
    messages: [{ from: "staff", body: "In QC now. You will have the stamped-ready set by end of week.", d: 1 }],
  },
  {
    slug: "harbor-point-lobby-lighting-2026", company: "harbor-point-hospitality",
    title: "Harbor Point Lobby — Lighting & Controls",
    summary: "Lobby and public-area lighting layout with fixture schedule and controls.",
    stage: "DELIVERED", progress: 100, status: "COMPLETED",
    disciplines: ["lighting", "electrical"], services: ["lighting-design", "photometric-design"],
    due: -4, sqft: 3800, floors: 1, city: "Savannah", state: "GA",
    updates: [
      { stage: "KICKOFF", note: "Fixture family selected with the interior designer.", d: 34 },
      { stage: "DRAFTING", note: "Lighting plan and controls drafted.", d: 22 },
      { stage: "QC", note: "Photometric levels verified against IES targets.", d: 12 },
      { stage: "DELIVERED", note: "Final DWG + PDF set issued.", d: 6 },
    ],
    files: [
      { name: "E-301-Lighting-Plan.dwg", rev: "R3", visible: true, size: 1_560_000 },
      { name: "Lobby-Photometric-Study.pdf", rev: "R2", visible: true, size: 720_000 },
      { name: "Fixture-Schedule.pdf", rev: "R3", visible: true, size: 310_000 },
    ],
    messages: [{ from: "staff", body: "Final set delivered. Let us know when the permit comments come back.", d: 6 }],
  },
  {
    slug: "northline-office-power-2026", company: "northline-builders",
    title: "Northline Office — Power Upgrade",
    summary: "Existing versus new service, feeder routing and updated panel schedules for a 400A upgrade.",
    stage: "REVISIONS", progress: 90, status: "ACTIVE",
    disciplines: ["electrical"], services: ["power-upgrade"],
    due: 4, sqft: 6200, floors: 2, city: "Denver", state: "CO",
    updates: [
      { stage: "KICKOFF", note: "Survey photos of the existing service received.", d: 20 },
      { stage: "DRAFTING", note: "Existing vs. new one-line and demo plan drafted.", d: 11 },
      { stage: "QC", note: "Load tabulation checked against the new service size.", d: 5 },
      { stage: "REVISIONS", note: "Plan review comments received — relocating the meter bank per utility.", d: 1 },
    ],
    files: [
      { name: "E-101-Power-Upgrade.dwg", rev: "R2", visible: true, size: 1_780_000 },
      { name: "Plan-Review-Comments.pdf", rev: "R0", visible: true, size: 220_000 },
    ],
    messages: [
      { from: "client", body: "City wants the meter bank moved to the alley side. Comments attached.", d: 1 },
      { from: "staff", body: "Understood — revision in progress, back to you in two business days.", d: 1 },
    ],
  },
  {
    slug: "vertex-warehouse-hvac-2026", company: "vertex-mep-engineers",
    title: "Vertex Warehouse — HVAC Design",
    summary: "Warehouse ventilation and office-area HVAC with the supporting load report.",
    stage: "DRAFTING", progress: 45, status: "ON_HOLD",
    disciplines: ["hvac"], services: ["hvac-design", "hvac-heating-cooling-load"],
    due: 18, sqft: 27500, floors: 1, city: "Portland", state: "OR",
    updates: [
      { stage: "KICKOFF", note: "Kickoff complete; equipment selections pending from the client.", d: 15 },
      { stage: "DRAFTING", note: "On hold — waiting on the rooftop unit selection before ductwork can be finalised.", d: 4 },
    ],
    files: [{ name: "M-101-HVAC-WIP.pdf", rev: "R1", visible: true, size: 830_000 }],
    messages: [{ from: "staff", body: "Paused pending your RTU selection. Say the word and we resume same day.", d: 4 }],
  },
];

async function main() {
  const staff = await prisma.user.findFirst({ where: { role: "STAFF" } })
    ?? await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!staff) throw new Error("No staff/admin user found — run the main seed first.");

  const passwordHash = await bcrypt.hash("Client123!", 10);
  const companyIds = new Map<string, string>();

  /* Companies + client users */
  for (const c of COMPANIES) {
    let company = await prisma.company.findUnique({ where: { slug: c.slug } });
    if (!company) {
      company = await prisma.company.create({
        data: { slug: c.slug, name: c.name, city: c.city, state: c.state, phone: c.phone, website: c.website },
      });
      console.log("company created:", c.name);
    }
    companyIds.set(c.slug, company.id);

    const existingUser = await prisma.user.findUnique({ where: { email: c.contact.email } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: c.contact.name, email: c.contact.email, role: "CLIENT", passwordHash,
          image: writeSvg("avatars", c.slug, avatarSvg(c.contact.name)),
          company: { connect: { id: company.id } },
        },
      });
      console.log("  client login:", c.contact.email);
    }
  }

  /* Quotes */
  const year = now.getFullYear();
  for (const q of QUOTES) {
    const refNumber = `DS-${year}-${q.ref}`;
    if (await prisma.quote.findUnique({ where: { refNumber } })) { console.log("quote exists, skipped:", refNumber); continue; }
    await prisma.quote.create({
      data: {
        refNumber, status: q.status,
        name: q.name, email: q.email, phone: q.phone, companyName: q.companyName,
        industry: { connect: { slug: q.industry } },
        serviceIds: q.services as never,
        state: q.state, sizeSqft: q.sqft, floors: q.floors,
        budgetRange: q.budget, deadline: inDays(q.deadline),
        description: q.description, source: "website", createdAt: daysAgo(q.d),
        ...(q.quotedAmount ? { quotedAmount: q.quotedAmount } : {}),
        ...(q.assign ? { assignedTo: { connect: { id: staff.id } } } : {}),
        ...(q.company && companyIds.has(q.company) ? { company: { connect: { id: companyIds.get(q.company)! } } } : {}),
      },
    });
    console.log("quote created:", refNumber, q.status);
  }

  /* Client projects */
  for (const [i, p] of PROJECTS.entries()) {
    if (await prisma.project.findUnique({ where: { slug: p.slug } })) { console.log("project exists, skipped:", p.slug); continue; }
    const companyId = companyIds.get(p.company);
    if (!companyId) { console.log("no company for", p.slug, "— skipped"); continue; }
    const client = await prisma.user.findFirst({ where: { companyId, role: "CLIENT" } });

    const cover = writeSvg("drawings", p.slug, blueprintSvg({ seed: p.slug, title: p.title, discipline: p.disciplines[0], label: "WIP" }));
    await prisma.project.create({
      data: {
        slug: p.slug, title: p.title, summary: p.summary,
        bodyMdx: `Active client project for ${p.company}.`,
        coverImage: cover,
        isPublic: false, status: p.status, stage: p.stage, progress: p.progress,
        dueDate: inDays(p.due), sizeSqft: p.sqft, floors: p.floors,
        city: p.city, state: p.state, order: 10 + i,
        company: { connect: { id: companyId } },
        assignedTo: { connect: { id: staff.id } },
        disciplines: { connect: p.disciplines.map((d) => ({ slug: d })) },
        services: { connect: p.services.map((s) => ({ slug: s })) },
        updates: { create: p.updates.map((u) => ({ stage: u.stage, note: u.note, createdAt: daysAgo(u.d), author: { connect: { id: staff.id } } })) },
        files: {
          create: p.files.map((f) => ({
            name: f.name, url: `/uploads/demo/${f.name}`, revision: f.rev, visibleToClient: f.visible,
            sizeBytes: f.size, mimeType: f.name.endsWith(".pdf") ? "application/pdf" : "application/acad",
            uploadedBy: { connect: { id: staff.id } },
          })),
        },
        messages: {
          create: p.messages
            .filter((m) => m.from !== "client" || client)
            .map((m) => ({
              body: m.body, createdAt: daysAgo(m.d),
              author: { connect: { id: m.from === "client" && client ? client.id : staff.id } },
            })),
        },
      },
    });
    console.log("project created:", p.title, `(${p.stage})`);
  }

  const [q, pr, c, u] = await Promise.all([
    prisma.quote.count(),
    prisma.project.count({ where: { isPublic: false } }),
    prisma.company.count(),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);
  console.log(`\ntotals — quotes: ${q}, client projects: ${pr}, companies: ${c}, client logins: ${u}`);
}

main().finally(() => prisma.$disconnect());
