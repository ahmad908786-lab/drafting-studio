/**
 * Runs before `next build` (see package.json "build").
 *
 * The build itself reads the database (generateStaticParams on blog, services,
 * industries and projects), so the schema and content must exist first.
 *
 *  1. `prisma db push` — syncs the schema. Without --accept-data-loss, so a
 *     destructive schema change fails the build instead of dropping data.
 *  2. Seeds once, only when the content tables are empty. prisma/seed.ts wipes
 *     every table, so it must never run against a live database with content.
 *  3. Locks down the demo logins. The seed creates accounts with passwords that
 *     are printed in the README; on a public site those must not work. If
 *     ADMIN_EMAIL + ADMIN_PASSWORD are set, the admin login is set to them.
 *
 * Skip all of this with SKIP_DB_PREPARE=1 (e.g. a build with no DB access).
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const DEMO_ACCOUNTS = [
  "admin@draftingstudio.example",
  "priya@draftingstudio.example",
  "client@acme.example",
];

function run(cmd: string) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

async function main() {
  if (process.env.SKIP_DB_PREPARE === "1") {
    console.log("SKIP_DB_PREPARE=1 — skipping schema push and seed.");
    return;
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it in Hostinger → Environment variables.");
  }
  // Placeholders were added in Hostinger first; fail loudly until they're replaced
  // rather than building with a guessable admin password or a fake auth secret.
  const placeholders = ["DATABASE_URL", "AUTH_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"].filter((k) =>
    process.env[k]?.includes("CHANGE_ME"),
  );
  if (placeholders.length) {
    throw new Error(`Replace the CHANGE_ME placeholder in: ${placeholders.join(", ")} (Hostinger → Environment variables).`);
  }
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  run("npx prisma db push --skip-generate");

  const prisma = new PrismaClient();
  try {
    const [services, posts] = await Promise.all([prisma.service.count(), prisma.post.count()]);
    if (services === 0 && posts === 0) {
      console.log("\nEmpty database — running the one-time seed.");
      run("npx tsx prisma/seed.ts");
    } else {
      console.log(`\nDatabase has content (${services} services, ${posts} posts) — seed skipped.`);
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      // Take over the seeded admin row (keeps its posts/assignments) if the
      // real admin doesn't exist yet; otherwise just keep the real one current.
      const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
      if (existing) {
        await prisma.user.update({ where: { id: existing.id }, data: { passwordHash, role: "ADMIN" } });
      } else {
        const seeded = await prisma.user.findUnique({ where: { email: DEMO_ACCOUNTS[0] } });
        if (seeded) {
          await prisma.user.update({ where: { id: seeded.id }, data: { email: adminEmail, passwordHash, role: "ADMIN" } });
        } else {
          await prisma.user.create({ data: { email: adminEmail, name: "Admin", role: "ADMIN", passwordHash } });
        }
      }
      console.log(`Admin login set for ${adminEmail}.`);

      const locked = await prisma.user.updateMany({
        where: { email: { in: DEMO_ACCOUNTS }, passwordHash: { not: null } },
        data: { passwordHash: null },
      });
      if (locked.count) console.log(`Disabled ${locked.count} demo login(s).`);
    } else {
      console.warn(
        "\n⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — the seeded demo logins still work. " +
          "Set both in Hostinger to secure /admin.",
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
