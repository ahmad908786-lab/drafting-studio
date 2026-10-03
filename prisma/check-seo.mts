import { prisma } from "../lib/db";
const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, title: true, excerpt: true, seoTitle: true, seoDesc: true } });
let customTitle = 0, customDesc = 0;
for (const p of posts) {
  if (p.seoTitle && p.seoTitle !== p.title) customTitle++;
  if (p.seoDesc && p.seoDesc !== p.excerpt) customDesc++;
}
console.log("total:", posts.length, "| custom seoTitle:", customTitle, "| custom seoDesc:", customDesc);
const s = posts.find(p => p.slug === "commercial-hvac-design-requirements-2026-usa");
console.log("sample title:", s?.title);
console.log("sample seoTitle:", s?.seoTitle);
console.log("sample seoDesc:", s?.seoDesc);
await prisma.$disconnect();
