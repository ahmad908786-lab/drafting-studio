/**
 * Targeted industry sync — applies prisma/content/industries.ts to the existing
 * DB without a full reseed (a reseed would wipe users, leads, RFQs and projects).
 *
 * Hero images are left as they are: real photos are swapped in by
 * prisma/fix-project-covers.ts and must not be reverted to a demo SVG here.
 *
 * Run: npx tsx prisma/sync-industries.ts
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INDUSTRIES } from "./content/industries";
import { heroSvg } from "./svg";
import { industryPhoto } from "./photos";

const prisma = new PrismaClient();
const PUB = join(process.cwd(), "public", "generated");

function writeSvg(folder: string, name: string, svg: string): string {
  const dir = join(PUB, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.svg`), svg, "utf8");
  return `/generated/${folder}/${name}.svg`;
}

async function main() {
  const wanted = new Set(INDUSTRIES.map((i) => i.slug));

  for (const e of await prisma.industry.findMany({ select: { slug: true, _count: { select: { projects: true } } } })) {
    if (wanted.has(e.slug)) continue;
    await prisma.industry.delete({ where: { slug: e.slug } });
    console.log(`deleted: ${e.slug} (${e._count.projects} project(s) unlinked)`);
  }

  for (const ind of INDUSTRIES) {
    const base = {
      name: ind.name,
      icon: ind.icon,
      shortDesc: ind.shortDesc,
      bodyMdx: ind.bodyMdx,
      painPoints: ind.painPoints as never,
      stats: ind.stats as never,
      seoTitle: `${ind.name} Drafting Services`,
      seoDesc: ind.shortDesc,
      order: ind.order,
    };
    const found = await prisma.industry.findUnique({ where: { slug: ind.slug } });
    if (found) {
      await prisma.industry.update({ where: { slug: ind.slug }, data: base });
    } else {
      const hero =
        industryPhoto(ind.slug) ??
        writeSvg("industries", ind.slug, heroSvg({ seed: ind.slug, label: ind.name.split(" ")[0] }));
      await prisma.industry.create({ data: { ...base, slug: ind.slug, heroImage: hero } });
      console.log("created:", ind.slug);
    }
  }

  console.log(`sync complete — ${await prisma.industry.count()} industries in DB`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
