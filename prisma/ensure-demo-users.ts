/**
 * Ensure the demo login accounts exist with known passwords.
 * Safe to run any time — it only upserts the two demo users, nothing else.
 *
 *   Admin : admin@draftingstudio.example / Admin123!
 *   Client: client@acme.example / Client123!
 *
 * Usage:  npx tsx prisma/ensure-demo-users.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@draftingstudio.example" },
    update: { passwordHash: await bcrypt.hash("Admin123!", 10), role: "ADMIN" },
    create: {
      name: "Admin User",
      email: "admin@draftingstudio.example",
      role: "ADMIN",
      title: "Studio Administrator",
      passwordHash: await bcrypt.hash("Admin123!", 10),
    },
  });
  console.log("admin ready: admin@draftingstudio.example / Admin123!");

  let company = await prisma.company.findFirst({ where: { slug: "acme-construction" } });
  if (!company) {
    company = await prisma.company.create({
      data: { name: "Acme Construction Co.", slug: "acme-construction" },
    });
  }
  await prisma.user.upsert({
    where: { email: "client@acme.example" },
    update: { passwordHash: await bcrypt.hash("Client123!", 10), role: "CLIENT", companyId: company.id },
    create: {
      name: "Jordan Blake",
      email: "client@acme.example",
      role: "CLIENT",
      title: "Project Manager",
      passwordHash: await bcrypt.hash("Client123!", 10),
      companyId: company.id,
    },
  });
  console.log("client ready: client@acme.example / Client123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
