import { prisma } from "../lib/db";
const slugs = ["9-sprinkler-head-layout-rules-every-drafter-should-know","tenant-improvement-drawing-checklist-rollout","plumbing-riser-diagrams-what-goes-on-the-sheet"];
const rows = await prisma.post.findMany({ where: { slug: { in: slugs } } });
console.log(JSON.stringify(rows.map(r => ({ slug: r.slug, title: r.title, excerptLen: (r.excerpt??"").length, bodyLen: (r.bodyMdx??"").length, readMinutes: r.readMinutes })), null, 1));
await prisma.$disconnect();
