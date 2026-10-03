import { prisma } from "../lib/db";
import { POSTS } from "./content/posts";
const srcSlugs = new Set((POSTS as any[]).map((p: any) => p.slug));
const rows = await prisma.post.findMany({ select: { slug: true, title: true } });
const dbSlugs = new Set(rows.map(r => r.slug));
console.log("in DB not in POSTS:", rows.filter(r => !srcSlugs.has(r.slug)).map(r => r.slug + " | " + r.title));
console.log("in POSTS not in DB:", [...srcSlugs].filter(s => !dbSlugs.has(s)));
await prisma.$disconnect();
