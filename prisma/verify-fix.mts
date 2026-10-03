import { prisma } from "../lib/db";
const rows = await prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, bodyMdx: true, readMinutes: true, seoDesc: true, title: true } });
const words = (s: string) => s.replace(/!\[[^\]]*\]\([^)]+\)/g, " ").replace(/<[^>]+>/g, " ").replace(/[#*>`\[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
let thin = 0, longDesc = 0, longTitle = 0;
for (const r of rows) {
  if (words(r.bodyMdx ?? "") < 600) { thin++; console.log("THIN:", r.slug); }
  if ((r.seoDesc ?? "").length > 160) { longDesc++; console.log("LONGDESC:", r.slug, (r.seoDesc ?? "").length); }
  if ((r.title ?? "").length > 65) { longTitle++; console.log("LONGTITLE:", r.slug); }
}
console.log(`\nFINAL: ${rows.length} posts | thin=${thin} longDesc=${longDesc} longTitle=${longTitle}`);
const e = rows.find(r => r.slug === "electrical-load-calculation-nec-220-walkthrough");
console.log("expanded sample words:", words(e?.bodyMdx ?? ""), "| readMinutes:", e?.readMinutes);
await prisma.$disconnect();
