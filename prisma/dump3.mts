import { prisma } from "../lib/db";
import { writeFileSync } from "fs";
const slugs = ["9-sprinkler-head-layout-rules-every-drafter-should-know","tenant-improvement-drawing-checklist-rollout","plumbing-riser-diagrams-what-goes-on-the-sheet"];
const rows = await prisma.post.findMany({ where: { slug: { in: slugs } } });
writeFileSync("/tmp/db3.json", JSON.stringify(rows.map(r => ({ slug: r.slug, title: r.title, excerpt: r.excerpt, bodyMdx: r.bodyMdx, readMinutes: r.readMinutes }))));
await prisma.$disconnect();
