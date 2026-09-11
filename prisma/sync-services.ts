/**
 * Targeted service sync — applies prisma/content/services.ts to the existing DB
 * without a full reseed (a reseed would wipe users, leads, RFQs and projects).
 *
 * Run: npx tsx prisma/sync-services.ts
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SERVICES } from "./content/services";
import { blueprintSvg } from "./svg";

const prisma = new PrismaClient();
const PUB = join(process.cwd(), "public", "generated");

function writeSvg(folder: string, name: string, svg: string): string {
  const dir = join(PUB, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.svg`), svg, "utf8");
  return `/generated/${folder}/${name}.svg`;
}

async function main() {
  const wanted = new Set(SERVICES.map((s) => s.slug));

  // 1. Drop services that are no longer in the content file.
  for (const e of await prisma.service.findMany({ select: { slug: true } })) {
    if (!wanted.has(e.slug)) {
      await prisma.service.delete({ where: { slug: e.slug } });
      console.log("deleted:", e.slug);
    }
  }

  // 2. Create or refresh every service in the content file.
  for (const s of SERVICES) {
    const base = {
      name: s.name,
      shortDesc: s.shortDesc,
      heroCopy: s.heroCopy,
      bodyMdx: s.bodyMdx,
      deliverables: s.deliverables as never,
      documentsRequired: s.documentsRequired as never,
      notCovered: s.notCovered as never,
      valuePillars: s.valuePillars as never,
      faqs: s.faqs as never,
      turnaroundDays: s.turnaroundDays,
      startingPrice: s.startingPrice ?? undefined,
      priceNote: s.priceNote,
      seoTitle: `${s.name} Services`, // layout template appends the brand
      seoDesc: s.shortDesc,
      order: s.order,
    };

    const found = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (found) {
      await prisma.service.update({
        where: { slug: s.slug },
        data: {
          ...base,
          category: { connect: { slug: s.category } },
          secondaryCategory: s.secondaryCategory
            ? { connect: { slug: s.secondaryCategory } }
            : { disconnect: true },
          disciplines: { set: s.disciplines.map((d) => ({ slug: d })) },
        },
      });
    } else {
      const cover = writeSvg(
        "services",
        s.slug,
        blueprintSvg({
          seed: s.slug,
          title: s.name,
          discipline: s.disciplines[0],
          label: s.slug.slice(0, 6).toUpperCase(),
        }),
      );
      await prisma.service.create({
        data: {
          ...base,
          slug: s.slug,
          coverImage: cover,
          category: { connect: { slug: s.category } },
          ...(s.secondaryCategory ? { secondaryCategory: { connect: { slug: s.secondaryCategory } } } : {}),
          disciplines: { connect: s.disciplines.map((d) => ({ slug: d })) },
        },
      });
      console.log("created:", s.slug);
    }
  }

  const total = await prisma.service.count();
  console.log(`sync complete — ${total} services in DB`);
}

main().finally(() => prisma.$disconnect());
