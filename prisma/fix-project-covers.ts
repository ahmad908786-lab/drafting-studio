/**
 * One-off fix: point project covers + industry heroes at real photos.
 *
 * For every project, if public/projects/<slug>.<ext> exists, update its
 * coverImage to that photo, drop any leftover demo "sheets" from the gallery
 * (a photographed project shows one image), and delete the stale demo SVG.
 * For every industry, if public/generated/industries/<slug>.jpg exists,
 * update its heroImage to that photo and delete the stale demo SVG.
 * Safe to run on a live DB — it only touches coverImage/heroImage and demo images.
 *
 * Usage:  npx tsx prisma/fix-project-covers.ts
 */
import { PrismaClient } from "@prisma/client";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { projectPhoto, industryPhoto } from "./photos";

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({ select: { id: true, slug: true, coverImage: true } });
  let updated = 0;
  for (const p of projects) {
    const photoPath = projectPhoto(p.slug);
    if (!photoPath || p.coverImage === photoPath) continue;
    await prisma.project.update({ where: { id: p.id }, data: { coverImage: photoPath } });
    await prisma.projectImage.deleteMany({ where: { projectId: p.id, isDrawing: true } });
    const staleDemo = join(process.cwd(), "public", "generated", "drawings", `${p.slug}.svg`);
    if (existsSync(staleDemo)) rmSync(staleDemo);
    console.log(`updated cover: ${p.slug} -> ${photoPath}`);
    updated++;
  }

  const industries = await prisma.industry.findMany({ select: { id: true, slug: true, heroImage: true } });
  for (const ind of industries) {
    const photoPath = industryPhoto(ind.slug);
    if (!photoPath || ind.heroImage === photoPath) continue;
    await prisma.industry.update({ where: { id: ind.id }, data: { heroImage: photoPath } });
    const staleDemo = join(process.cwd(), "public", "generated", "industries", `${ind.slug}.svg`);
    if (existsSync(staleDemo)) rmSync(staleDemo);
    console.log(`updated industry hero: ${ind.slug}`);
    updated++;
  }

  console.log(`done — ${updated} cover(s) updated`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
