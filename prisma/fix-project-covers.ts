/**
 * One-off fix: point project covers at real photos.
 *
 * For every project, if public/projects/<slug>.<ext> exists, update its
 * coverImage to that photo, drop any leftover demo "sheets" from the gallery
 * (a photographed project shows one image), and delete the stale demo SVG.
 * Safe to run on a live DB — it only touches coverImage and demo images.
 *
 * Usage:  npx tsx prisma/fix-project-covers.ts
 */
import { PrismaClient } from "@prisma/client";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { projectPhoto } from "./seed";

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
  console.log(`done — ${updated} cover(s) updated`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
