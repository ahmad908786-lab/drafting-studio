import { prisma } from "../lib/db";
const cats = await prisma.serviceCategory.findMany({ include: { services: { select: { slug: true, name: true } } } });
for (const c of cats) {
  console.log("CAT:", c.slug, "|", c.name);
  for (const s of c.services) console.log("   -", s.slug, "|", s.name);
}
const p = await prisma.post.findFirst({ where: { slug: "electrical-load-calculation-nec-220-walkthrough" }, select: { bodyMdx: true, readMinutes: true } });
console.log("\nBODY LEN:", p?.bodyMdx?.length, "READMIN:", p?.readMinutes);
console.log("HEAD:", (p?.bodyMdx ?? "").slice(0, 200).replace(/\n/g, " | "));
await prisma.$disconnect();
