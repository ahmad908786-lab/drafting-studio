/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import { DISCIPLINES } from "../lib/taxonomy";
import { SERVICE_CATEGORIES } from "../lib/taxonomy";
import { SERVICES } from "./content/services";
import { INDUSTRIES } from "./content/industries";
import { PROJECTS } from "./content/projects";
import { POSTS, BLOG_CATEGORIES } from "./content/posts";
import { projectPhoto, industryPhoto, blogPhoto } from "./photos";
import {
  blueprintSvg,
  heroSvg,
  blogCoverSvg,
  logoMarkSvg,
  clientLogoSvg,
  avatarSvg,
} from "./svg";

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

async function clearDb() {
  // Child-first deletion so FK constraints and implicit m-n joins clear cleanly.
  await prisma.auditLog.deleteMany();
  await prisma.projectMessage.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.projectUpdate.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.quoteMessage.deleteMany();
  await prisma.quoteNote.deleteMany();
  await prisma.quoteFile.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.project.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.discipline.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.clientLogo.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
}

async function main() {
  console.log("→ Clearing database…");
  await clearDb();

  // Brand mark
  writeSvg("brand", "logo-mark", logoMarkSvg());

  /* -------------------- Disciplines -------------------- */
  console.log("→ Disciplines");
  for (const [i, d] of DISCIPLINES.entries()) {
    await prisma.discipline.create({
      data: { slug: d.slug, value: d.value, label: d.label, color: d.color, icon: d.icon, order: i },
    });
  }

  /* -------------------- Service categories -------------------- */
  console.log("→ Service categories");
  for (const [i, c] of SERVICE_CATEGORIES.entries()) {
    await prisma.serviceCategory.create({
      data: { slug: c.slug, name: c.name, icon: c.icon, blurb: c.blurb, order: i },
    });
  }

  /* -------------------- Services -------------------- */
  console.log("→ Services");
  for (const s of SERVICES) {
    const cover = writeSvg(
      "services",
      s.slug,
      blueprintSvg({ seed: s.slug, title: s.name, discipline: s.disciplines[0], label: s.slug.slice(0, 6).toUpperCase() }),
    );
    await prisma.service.create({
      data: {
        slug: s.slug,
        name: s.name,
        shortDesc: s.shortDesc,
        heroCopy: s.heroCopy,
        bodyMdx: s.bodyMdx,
        deliverables: s.deliverables as any,
        documentsRequired: s.documentsRequired as any,
        notCovered: s.notCovered as any,
        valuePillars: s.valuePillars as any,
        faqs: s.faqs as any,
        turnaroundDays: s.turnaroundDays,
        startingPrice: s.startingPrice ?? undefined,
        priceNote: s.priceNote,
        coverImage: cover,
        seoTitle: `${s.name} Services`, // layout template appends "| Drafting Studio"
        seoDesc: s.shortDesc,
        order: s.order,
        category: { connect: { slug: s.category } },
        ...(s.secondaryCategory ? { secondaryCategory: { connect: { slug: s.secondaryCategory } } } : {}),
        disciplines: { connect: s.disciplines.map((d) => ({ slug: d })) },
      },
    });
  }

  /* -------------------- Industries -------------------- */
  console.log("→ Industries");
  for (const ind of INDUSTRIES) {
    // Prefer a real photo when one exists; fall back to the demo SVG.
    const photo = industryPhoto(ind.slug);
    const hero = photo ?? writeSvg("industries", ind.slug, heroSvg({ seed: ind.slug, label: ind.name.split(" ")[0] }));
    if (photo) {
      const staleDemo = join(process.cwd(), "public", "generated", "industries", `${ind.slug}.svg`);
      if (existsSync(staleDemo)) rmSync(staleDemo);
    }
    await prisma.industry.create({
      data: {
        slug: ind.slug,
        name: ind.name,
        icon: ind.icon,
        shortDesc: ind.shortDesc,
        bodyMdx: ind.bodyMdx,
        heroImage: hero,
        painPoints: ind.painPoints as any,
        stats: ind.stats as any,
        seoTitle: `${ind.name} Drafting Services`,
        seoDesc: ind.shortDesc,
        order: ind.order,
      },
    });
  }

  /* -------------------- Projects (public sample work) -------------------- */
  console.log("→ Sample-work projects");
  for (const [i, p] of PROJECTS.entries()) {
    // Prefer a real cover photo when one exists; otherwise fall back to the demo blueprint SVG.
    const photo = projectPhoto(p.slug);
    const cover =
      photo ??
      writeSvg(
        "drawings",
        p.slug,
        blueprintSvg({ seed: p.slug, title: p.title, discipline: p.disciplines[0], label: p.sheet }),
      );
    if (photo) {
      // Drop the stale demo blueprint for this project, if a previous seed wrote one.
      const staleDemo = join(PUB, "drawings", `${p.slug}.svg`);
      if (existsSync(staleDemo)) rmSync(staleDemo);
    }
    // Projects with a real photo show that one image alone. Demo projects get a
    // couple of extra "sheets" so the detail gallery has something to page through.
    const extraImages = photo
      ? []
      : p.disciplines.slice(0, 3).map((disc, idx) => {
          const label = `${p.sheet.split("-")[0]}-${100 + idx * 2 + 1}`;
          const url = writeSvg(
            "drawings",
            `${p.slug}-${idx + 1}`,
            blueprintSvg({ seed: `${p.slug}-${idx}`, title: `${p.title} — ${disc}`, discipline: disc, label }),
          );
          return { url, caption: `${disc.replace("-", " ")} — ${label}`, order: idx, isDrawing: true };
        });

    await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        bodyMdx: `## Scope\n\n${p.scopeNotes}\n\nDelivered as a coordinated 2D AutoCAD set (layered DWG + plotted PDF), drafted to current US codes and formatted for permit submission.`,
        scopeNotes: p.scopeNotes,
        city: p.city,
        state: p.state,
        sizeSqft: p.sizeSqft,
        floors: p.floors,
        year: p.year,
        coverImage: cover,
        isPublic: true,
        featured: p.featured,
        order: i,
        industry: { connect: { slug: p.industry } },
        disciplines: { connect: p.disciplines.map((d) => ({ slug: d })) },
        services: { connect: p.services.map((s) => ({ slug: s })) },
        images: { create: extraImages },
      },
    });
  }

  /* -------------------- Blog -------------------- */
  console.log("→ Blog categories, tags & posts");
  for (const c of BLOG_CATEGORIES) {
    await prisma.category.create({
      data: { slug: c.slug, name: c.name, description: c.description, color: c.color, order: c.order },
    });
  }

  // Author = staff member (created below in users step); create a placeholder author now.
  const author = await prisma.user.create({
    data: {
      name: "Priya Raman",
      email: "priya@draftingstudio.example",
      role: "STAFF",
      title: "Lead Drafter",
      passwordHash: await bcrypt.hash("Staff123!", 10),
      image: writeSvg("avatars", "priya-raman", avatarSvg("Priya Raman")),
    },
  });

  for (const post of POSTS) {
    // Prefer a real cover photo when one exists; otherwise fall back to the demo SVG.
    const photo = blogPhoto(post.slug);
    const cover =
      photo ??
      writeSvg(
        "blog",
        post.slug,
        blogCoverSvg({ seed: post.slug, discipline: post.discipline, kicker: post.category.replace("-", " ") }),
      );
    await prisma.post.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        bodyMdx: post.bodyMdx,
        template: post.template,
        coverImage: cover,
        ogImage: cover,
        readMinutes: post.readMinutes,
        featured: post.featured,
        status: "PUBLISHED",
        publishedAt: daysAgo(post.daysAgo),
        views: 200 + post.readMinutes * 37 + post.daysAgo * 3,
        seoTitle: post.title,
        seoDesc: post.excerpt,
        meta: (post.meta ?? {}) as any,
        author: { connect: { id: author.id } },
        category: { connect: { slug: post.category } },
        tags: {
          connectOrCreate: post.tags.map((t) => ({
            where: { slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
            create: { slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: t },
          })),
        },
      },
    });
  }

  /* -------------------- Testimonials -------------------- */
  console.log("→ Testimonials, logos, team");
  // SAMPLE content — replace with real client quotes from the admin dashboard (/admin).
  const testimonials = [
    { author: "Michael Trent", role: "Principal Engineer", company: "Trent MEP Engineering", quote: "Drafting Studio feels like an extension of our office. Sets come back to our CAD standard, on time, and our PEs stamp them with almost no cleanup.", rating: 5, featured: true },
    { author: "Sofia Delgado", role: "Director of Construction", company: "BrightBrew Franchising", quote: "We roll out 20+ locations a year. Their prototype adaptations are consistent to the sheet and hit our open dates every time.", rating: 5, featured: true },
    { author: "Aaron Whitfield", role: "Owner", company: "Whitfield Fire Protection", quote: "The sprinkler layouts and hydraulic reports are fabrication-ready and clear review. That's exactly what we need from a drafting partner.", rating: 5, featured: true },
    { author: "Rebecca Lin", role: "Project Manager", company: "Northstar General Contractors", quote: "Fast, responsive, and genuinely good at coordination. The restaurant kitchen sets alone have saved us weeks.", rating: 5, featured: true },
    { author: "James Okoye", role: "Electrical Engineer", company: "Okoye & Associates", quote: "Load calcs and one-lines done right the first time. Their documentation makes my stamp an easy decision.", rating: 5, featured: true },
    { author: "Danielle Foster", role: "Developer", company: "Foster Urban Living", quote: "Our multifamily 13R packages and unit electrical stacks came back coordinated and permit-ready. Great value.", rating: 5, featured: true },
    { author: "Priya Nair", role: "Project Architect", company: "Nair Studio Architects", quote: "The lighting layouts and photometric studies coordinated with our architectural backgrounds on the first pass — no rework.", rating: 5, featured: true },
  ];
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.create({
      data: { ...t, avatar: writeSvg("avatars", `t-${i}`, avatarSvg(t.author)), order: i },
    });
  }

  const logos = ["Trent MEP", "BrightBrew", "Northstar GC", "Whitfield Fire", "Foster Urban", "Okoye & Assoc.", "Summit Retail", "BluePeak Design"];
  for (const [i, name] of logos.entries()) {
    await prisma.clientLogo.create({ data: { name, logo: writeSvg("logos", `logo-${i}`, clientLogoSvg(name)), order: i } });
  }

  const team = [
    { name: "Daniel Cho", role: "Founder & Managing Drafter", bio: "20+ years drafting MEP, fire and lighting sets for firms across the US.", linkedin: "https://linkedin.com" },
    { name: "Priya Raman", role: "Lead Drafter — Electrical", bio: "Electrical power, lighting and load-calc specialist.", linkedin: "https://linkedin.com" },
    { name: "Marcus Bell", role: "Lead Drafter — Fire Protection", bio: "NFPA 13/72 layouts and hydraulic reporting.", linkedin: "https://linkedin.com" },
    { name: "Elena Vasquez", role: "Lead Drafter — Mechanical", bio: "HVAC and plumbing coordination and load calculations.", linkedin: "https://linkedin.com" },
  ];
  for (const [i, m] of team.entries()) {
    await prisma.teamMember.create({
      data: { ...m, photo: writeSvg("avatars", `team-${i}`, avatarSvg(m.name)), order: i },
    });
  }

  /* -------------------- Site settings -------------------- */
  console.log("→ Site settings");
  await prisma.siteSetting.create({
    data: {
      id: "singleton",
      brand: "Drafting Studio",
      tagline: "2D AutoCAD Drafting for MEP, Fire Protection & Lighting",
      phones: ["(212) 555-0142", "(786) 555-0198"] as any,
      emails: ["sales@draftingstudio.example", "support@draftingstudio.example"] as any,
      offices: [
        { city: "New York", line1: "1180 Avenue of the Americas, Suite 800", region: "New York, NY 10036", phone: "(212) 555-0142" },
        { city: "Miami", line1: "78 SW 7th Street, Floor 5", region: "Miami, FL 33130", phone: "(786) 555-0198" },
      ] as any,
      socials: { linkedin: "https://linkedin.com/company/drafting-studio", facebook: "https://facebook.com", instagram: "https://instagram.com" } as any,
      stats: [
        { value: "6,200+", label: "Drawing Sets Delivered" },
        { value: "48 hrs", label: "Typical Turnaround" },
        { value: "50", label: "States Covered" },
        { value: "98%", label: "First-Time Permit Approval" },
      ] as any,
    },
  });

  /* -------------------- Users, company, client work -------------------- */
  console.log("→ Users, demo company & client work");
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@draftingstudio.example",
      role: "ADMIN",
      title: "Studio Administrator",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      image: writeSvg("avatars", "admin", avatarSvg("Admin User")),
    },
  });

  const company = await prisma.company.create({
    data: {
      name: "Acme Construction Co.",
      slug: "acme-construction",
      website: "https://acme.example",
      phone: "(312) 555-0170",
      city: "Chicago",
      state: "IL",
      logo: writeSvg("logos", "acme", clientLogoSvg("Acme Construction")),
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "Jordan Blake",
      email: "client@acme.example",
      role: "CLIENT",
      title: "Project Manager",
      phone: "(312) 555-0170",
      passwordHash: await bcrypt.hash("Client123!", 10),
      image: writeSvg("avatars", "jordan-blake", avatarSvg("Jordan Blake")),
      company: { connect: { id: company.id } },
    },
  });

  // Two active client projects with stages, updates, files, and a message thread.
  const clientProjects = [
    {
      slug: "acme-warehouse-electrical-2026",
      title: "Acme Warehouse — Electrical & Lighting",
      summary: "Distribution and high-bay lighting for Acme's new Chicago warehouse.",
      stage: "DRAFTING", progress: 45, disciplines: ["electrical", "lighting"],
      services: ["electrical-system-design", "photometric-design"],
      due: 12, sqft: 42000, floors: 1,
      updates: [
        { stage: "KICKOFF", note: "Kickoff complete. Received architectural DWG and equipment list.", d: 9 },
        { stage: "DRAFTING", note: "Power distribution and high-bay layout in progress. Photometric grid started.", d: 2 },
      ],
      files: [
        { name: "Acme-Warehouse-Architectural.dwg", rev: "R0", visible: true, size: 2_400_000 },
        { name: "E-101-Power-Plan-WIP.pdf", rev: "R1", visible: true, size: 880_000 },
      ],
      messages: [
        { from: "client", body: "Can we confirm the high-bay mounting height is 28 ft? Racking changed.", d: 3 },
        { from: "staff", body: "Confirmed 28 ft — photometric grid is being re-run at that height. Updated PDF by Thursday.", d: 2 },
      ],
    },
    {
      slug: "acme-office-hvac-2026",
      title: "Acme Office TI — HVAC & Load",
      summary: "Zoned HVAC and ASHRAE load basis for Acme's 2nd-floor office fit-out.",
      stage: "QC", progress: 75, disciplines: ["hvac"],
      services: ["hvac-design", "hvac-heating-cooling-load"],
      due: 5, sqft: 9800, floors: 1,
      updates: [
        { stage: "KICKOFF", note: "Kickoff complete. ASHRAE load basis agreed.", d: 14 },
        { stage: "DRAFTING", note: "Ductwork and equipment layout drafted; load report complete.", d: 6 },
        { stage: "QC", note: "In internal QC. Coordinating diffusers against the reflected ceiling.", d: 1 },
      ],
      files: [
        { name: "M-201-HVAC-Plan.pdf", rev: "R2", visible: true, size: 1_100_000 },
        { name: "Acme-Office-Load-Report.pdf", rev: "R1", visible: true, size: 540_000 },
        { name: "Internal-QC-notes.pdf", rev: "R0", visible: false, size: 120_000 },
      ],
      messages: [
        { from: "staff", body: "Load report is attached and the HVAC plan is in QC. On track for delivery next week.", d: 1 },
      ],
    },
  ];

  for (const [i, cp] of clientProjects.entries()) {
    const cover = writeSvg("drawings", cp.slug, blueprintSvg({ seed: cp.slug, title: cp.title, discipline: cp.disciplines[0], label: "WIP" }));
    await prisma.project.create({
      data: {
        slug: cp.slug,
        title: cp.title,
        summary: cp.summary,
        bodyMdx: `Active client project for ${company.name}.`,
        coverImage: cover,
        isPublic: false,
        status: "ACTIVE",
        stage: cp.stage,
        progress: cp.progress,
        dueDate: inDays(cp.due),
        sizeSqft: cp.sqft,
        floors: cp.floors,
        city: "Chicago",
        state: "IL",
        order: i,
        company: { connect: { id: company.id } },
        assignedTo: { connect: { id: author.id } },
        disciplines: { connect: cp.disciplines.map((d) => ({ slug: d })) },
        services: { connect: cp.services.map((s) => ({ slug: s })) },
        updates: {
          create: cp.updates.map((u) => ({ stage: u.stage, note: u.note, createdAt: daysAgo(u.d), author: { connect: { id: author.id } } })),
        },
        files: {
          create: cp.files.map((f) => ({
            name: f.name, url: `/uploads/demo/${f.name}`, revision: f.rev, visibleToClient: f.visible,
            sizeBytes: f.size, mimeType: f.name.endsWith(".pdf") ? "application/pdf" : "application/acad",
            uploadedBy: { connect: { id: author.id } },
          })),
        },
        messages: {
          create: cp.messages.map((m) => ({
            body: m.body, createdAt: daysAgo(m.d),
            author: { connect: { id: m.from === "client" ? client.id : author.id } },
          })),
        },
      },
    });
  }

  /* -------------------- Quotes / RFQ pipeline -------------------- */
  console.log("→ Quotes");
  const year = now.getFullYear();
  const quoteSeeds = [
    {
      ref: `DS-${year}-0001`, status: "NEW", name: "Kevin Marsh", email: "kevin@marshbuild.example", phone: "(415) 555-0133",
      companyName: "Marsh Build", industry: "restaurant", services: [{ slug: "mechanical-design", name: "Mechanical Design" }],
      state: "CA", sqft: 3200, floors: 1, budget: "$1,500 – $5,000", deadline: 21,
      description: "New full-service restaurant. Need HVAC (Type-I hood exhaust + MUA) and plumbing (grease/gas). Have architectural DWG.",
      d: 1,
    },
    {
      ref: `DS-${year}-0002`, status: "REVIEWING", name: "Alicia Gomez", email: "alicia@gomezmep.example", phone: "(602) 555-0148",
      companyName: "Gomez MEP", industry: "healthcare", services: [{ slug: "fire-alarm-system-design", name: "Fire Alarm System Design" }, { slug: "electrical-system-design", name: "Electrical System Design" }],
      state: "AZ", sqft: 6400, floors: 1, budget: "$5,000 – $15,000", deadline: 18,
      description: "Urgent care clinic. Need electrical + NFPA 72 fire alarm. We stamp in-house.",
      d: 3, assigned: true,
    },
    {
      ref: `DS-${year}-0003`, status: "QUOTED", name: "Tom Becker", email: "tom@beckerdev.example", phone: "(305) 555-0192",
      companyName: "Becker Development", industry: "hotel", services: [{ slug: "sprinkler-layout-plan", name: "Sprinkler Layout Plan" }],
      state: "FL", sqft: 14200, floors: 6, budget: "$15,000+", deadline: 30,
      description: "Boutique hotel, typical-floor sprinkler + hydraulic report for the tower.",
      d: 6, assigned: true, quotedAmount: 9800,
    },
    {
      ref: `DS-${year}-0004`, status: "WON", name: "Jordan Blake", email: "client@acme.example", phone: "(312) 555-0170",
      companyName: "Acme Construction Co.", industry: "warehouse", services: [{ slug: "electrical-system-design", name: "Electrical System Design" }, { slug: "photometric-design", name: "Photometric Design" }],
      state: "IL", sqft: 42000, floors: 1, budget: "$5,000 – $15,000", deadline: 14,
      description: "Warehouse electrical + high-bay photometrics. (Converted to active project.)",
      d: 20, assigned: true, quotedAmount: 7600, linkClient: true,
    },
  ];

  for (const q of quoteSeeds) {
    await prisma.quote.create({
      data: {
        refNumber: q.ref,
        status: q.status,
        name: q.name, email: q.email, phone: q.phone, companyName: q.companyName,
        industry: { connect: { slug: q.industry } },
        serviceIds: q.services as any,
        state: q.state, sizeSqft: q.sqft, floors: q.floors,
        budgetRange: q.budget, deadline: inDays(q.deadline),
        description: q.description,
        source: "website",
        createdAt: daysAgo(q.d),
        quotedAmount: (q as any).quotedAmount,
        ...(q.assigned ? { assignedTo: { connect: { id: admin.id } } } : {}),
        ...(q.linkClient ? { company: { connect: { id: company.id } } } : {}),
        notes: q.assigned
          ? { create: [{ body: "Reviewed scope — straightforward. Preparing fixed quote.", author: { connect: { id: admin.id } }, createdAt: daysAgo(q.d - 1) }] }
          : undefined,
        messages: (q as any).quotedAmount
          ? { create: [{ body: `Thanks for the details — we've sent a fixed quote of $${(q as any).quotedAmount.toLocaleString()}. Happy to walk through scope.`, fromClient: false, author: { connect: { id: admin.id } }, createdAt: daysAgo(q.d - 2) }] }
          : undefined,
      },
    });
  }

  /* -------------------- Leads -------------------- */
  await prisma.lead.createMany({
    data: [
      { type: "NEWSLETTER", email: "newsub1@example.com", createdAt: daysAgo(2) },
      { type: "NEWSLETTER", email: "newsub2@example.com", createdAt: daysAgo(5) },
      { type: "CONTACT", name: "Grace Hall", email: "grace@hallarch.example", phone: "(718) 555-0110", subject: "Ongoing drafting partner", message: "Architecture firm looking for a recurring MEP drafting partner. Can we set up a call?", createdAt: daysAgo(1) },
      { type: "CALLBACK", name: "Victor Reyes", email: "victor@reyesgc.example", phone: "(214) 555-0166", message: "Callback re: warehouse ESFR + photometrics timeline.", createdAt: daysAgo(3) },
    ],
  });

  console.log("✓ Seed complete.");
  console.log("  Admin  : admin@draftingstudio.example / Admin123!");
  console.log("  Staff  : priya@draftingstudio.example / Staff123!");
  console.log("  Client : client@acme.example / Client123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
