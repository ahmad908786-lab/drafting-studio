import { prisma } from "../lib/db";
const rows = await prisma.post.findMany({ where: { slug: { in: ["9-sprinkler-head-layout-rules-every-drafter-should-know","tenant-improvement-drawing-checklist-rollout","plumbing-riser-diagrams-what-goes-on-the-sheet"] } }, select: { slug: true, readMinutes: true, bodyMdx: true } });
const words = (s: string) => s.replace(/!\[[^\]]*\]\([^)]+\)/g, " ").replace(/<[^>]+>/g, " ").replace(/[#*>`\[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
rows.forEach(r => console.log(r.slug.slice(0,45), "db readMinutes:", r.readMinutes, "calc:", Math.max(3, Math.round(words(r.bodyMdx ?? "")/200))));
await prisma.$disconnect();
