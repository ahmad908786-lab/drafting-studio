/**
 * Add portfolio projects from prisma/content/projects.ts that are not in the
 * database yet, without the full reseed a new project would otherwise need.
 *
 * The build's db:prepare step only seeds an EMPTY database, so a project added
 * to the content file after launch never reaches a live DB on redeploy alone.
 * Run this after deploy, next to sync-posts / sync-services:
 *
 *   npx tsx prisma/sync-projects.ts [--refresh]
 *
 * Existing projects are left alone — edits made in the admin are not
 * overwritten. Pass --refresh to also rewrite the editorial copy of existing
 * projects from the content file (title, summary, body, scope notes, facts,
 * industry/discipline/service links, featured flag, order). Cover images are
 * only ever pointed at a real photo file (public/projects/<slug>.<ext>); a
 * project with no photo keeps whatever cover it already has, and a new one
 * without a photo gets none — no blueprint SVG fallback is generated here.
 * Private client projects are never touched: only slugs listed in the
 * content file are created or updated.
 */
import { PrismaClient } from "@prisma/client";
import { PROJECTS, type ProjectSeed } from "./content/projects";
import { projectPhoto } from "./photos";

const prisma = new PrismaClient();

const bodyMdx = (p: ProjectSeed) =>
  `## Scope\n\n${p.scopeNotes}\n\nDelivered as a coordinated 2D AutoCAD set (layered DWG + plotted PDF), drafted to current US codes and formatted for permit submission.`;

async function main() {
  const refresh = process.argv.includes("--refresh");

  // Fail fast with a clear message if a linked slug does not exist yet
  // (services/industries/disciplines sync before projects).
  const [industries, disciplines, services] = await Promise.all([
    prisma.industry.findMany({ select: { slug: true } }),
    prisma.discipline.findMany({ select: { slug: true } }),
    prisma.service.findMany({ select: { slug: true } }),
  ]);
  const industrySlugs = new Set(industries.map((i) => i.slug));
  const disciplineSlugs = new Set(disciplines.map((d) => d.slug));
  const serviceSlugs = new Set(services.map((s) => s.slug));
  for (const p of PROJECTS) {
    if (!industrySlugs.has(p.industry)) {
      throw new Error(`Project ${p.slug}: industry "${p.industry}" is not in the database — sync industries first.`);
    }
    for (const d of p.disciplines) {
      if (!disciplineSlugs.has(d)) throw new Error(`Project ${p.slug}: discipline "${d}" is not in the database.`);
    }
    for (const s of p.services) {
      if (!serviceSlugs.has(s)) throw new Error(`Project ${p.slug}: service "${s}" is not in the database — sync services first.`);
    }
  }

  const existing = new Set((await prisma.project.findMany({ select: { slug: true } })).map((p) => p.slug));
  let added = 0;
  let refreshed = 0;

  for (const [i, p] of PROJECTS.entries()) {
    const photo = projectPhoto(p.slug);
    if (existing.has(p.slug)) {
      if (!refresh) continue;
      const row = await prisma.project.findUnique({
        where: { slug: p.slug },
        select: {
          title: true, summary: true, bodyMdx: true, scopeNotes: true,
          city: true, state: true, sizeSqft: true, floors: true, year: true,
          featured: true, order: true, coverImage: true,
          industry: { select: { slug: true } },
          disciplines: { select: { slug: true } },
          services: { select: { slug: true } },
        },
      });
      const sameList = (a: string[], b: string[]) =>
        a.length === b.length && [...a].sort().join(",") === [...b].sort().join(",");
      const unchanged =
        row &&
        row.title === p.title &&
        row.summary === p.summary &&
        row.bodyMdx === bodyMdx(p) &&
        row.scopeNotes === p.scopeNotes &&
        row.city === p.city &&
        row.state === p.state &&
        row.sizeSqft === p.sizeSqft &&
        row.floors === p.floors &&
        row.year === p.year &&
        row.featured === p.featured &&
        row.order === i &&
        row.industry?.slug === p.industry &&
        sameList(row.disciplines.map((d) => d.slug), p.disciplines) &&
        sameList(row.services.map((s) => s.slug), p.services) &&
        (!photo || row.coverImage === photo);
      if (unchanged) continue;
      await prisma.project.update({
        where: { slug: p.slug },
        data: {
          title: p.title,
          summary: p.summary,
          bodyMdx: bodyMdx(p),
          scopeNotes: p.scopeNotes,
          city: p.city,
          state: p.state,
          sizeSqft: p.sizeSqft,
          floors: p.floors,
          year: p.year,
          featured: p.featured,
          order: i,
          ...(photo ? { coverImage: photo } : {}),
          industry: { connect: { slug: p.industry } },
          disciplines: { set: [], connect: p.disciplines.map((d) => ({ slug: d })) },
          services: { set: [], connect: p.services.map((s) => ({ slug: s })) },
        },
      });
      console.log(`refreshed: ${p.slug}`);
      refreshed++;
      continue;
    }
    await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        bodyMdx: bodyMdx(p),
        scopeNotes: p.scopeNotes,
        city: p.city,
        state: p.state,
        sizeSqft: p.sizeSqft,
        floors: p.floors,
        year: p.year,
        coverImage: photo ?? undefined,
        isPublic: true,
        featured: p.featured,
        order: i,
        industry: { connect: { slug: p.industry } },
        disciplines: { connect: p.disciplines.map((d) => ({ slug: d })) },
        services: { connect: p.services.map((s) => ({ slug: s })) },
      },
    });
    console.log(`added: ${p.slug}${photo ? "" : " (no cover photo found)"}`);
    added++;
  }

  console.log(`\ndone — ${added} added, ${refreshed} refreshed, ${existing.size} already present, ${await prisma.project.count()} total`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
