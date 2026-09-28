/**
 * One-off fix: point project covers at real photos.
 *
 * For every project, if public/generated/projects/<slug>.jpg exists,
 * update its coverImage to that photo and delete the stale demo SVG.
 * Safe to run on a live DB — it only touches coverImage, nothing else.
 *
 * Usage:  npx tsx prisma/fix-project-covers.ts
 */
import { PrismaClient } from "@prisma/client";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({ select: { id: true, slug: true, coverImage: true } });
  let updated = 0;
  for (const p of projects) {
    const photoPath = `/generated/projects/${p.slug}.jpg`;
    if (!existsSync(join(process.cwd(), "public", photoPath))) continue;
    if (p.coverImage === photoPath) continue;
    await prisma.project.update({ where: { id: p.id }, data: { coverImage: photoPath } });
    const staleDemo = join(process.cwd(), "public", "generated", "drawings", `${p.slug}.svg`);
    if (existsSync(staleDemo)) rmSync(staleDemo);
    console.log(`updated cover: ${p.slug}`);
    updated++;
  }
  console.log(`done — ${updated} cover(s) updated`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
