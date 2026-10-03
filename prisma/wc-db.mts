import { prisma } from "../lib/db";
import { POSTS } from "./content/posts";
const words = (s: string) => {
  let t = s.replace(/!\[[^\]]*\]\([^)]+\)/g, " ").replace(/<[^>]+>/g, " ");
  return t.replace(/[#*>`\[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
};
const srcMap = new Map(POSTS.map((p: any) => [p.slug, words(p.bodyMdx ?? "")]));
const rows = await prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, bodyMdx: true } });
console.log("slug | db_words | src_words | match");
for (const r of rows) {
  const db = words(r.bodyMdx ?? ""), s = srcMap.get(r.slug) ?? -1;
  if (db < 600 || s < 600) console.log(`${r.slug}: db=${db} src=${s} ${db===s?"same":"DIFF"}`);
}
await prisma.$disconnect();
