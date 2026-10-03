import { prisma } from "../lib/db";
import { POSTS } from "./content/posts";
let updated = 0;
const changed: string[] = [];
for (const p of POSTS as any[]) {
  const row = await prisma.post.findUnique({ where: { slug: p.slug }, select: { title: true, excerpt: true, bodyMdx: true, readMinutes: true, seoTitle: true, seoDesc: true } });
  if (!row) { console.log("NOT IN DB:", p.slug); continue; }
  const data: any = {};
  if (row.title !== p.title) data.title = p.title;
  if (row.excerpt !== p.excerpt) data.excerpt = p.excerpt;
  if (row.bodyMdx !== p.bodyMdx) data.bodyMdx = p.bodyMdx;
  if (row.readMinutes !== p.readMinutes) data.readMinutes = p.readMinutes;
  if (row.seoTitle !== p.title) data.seoTitle = p.title;
  if (row.seoDesc !== p.excerpt) data.seoDesc = p.excerpt;
  if (Object.keys(data).length > 0) {
    await prisma.post.update({ where: { slug: p.slug }, data });
    updated++;
    changed.push(`${p.slug} [${Object.keys(data).join(",")}]`);
  }
}
console.log(`updated ${updated}/${(POSTS as any[]).length} posts`);
changed.slice(0, 60).forEach(c => console.log(" ", c));
await prisma.$disconnect();
