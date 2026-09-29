/**
 * Add blog posts from prisma/content/posts.ts that are not in the database yet,
 * without the full reseed a new post would otherwise need.
 *
 * Existing posts are left alone — edits made in the admin are not overwritten.
 * Missing categories are created first so a new post's category always resolves.
 *
 * Usage:  npx tsx prisma/sync-posts.ts
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { POSTS, BLOG_CATEGORIES } from "./content/posts";
import { blogCoverSvg } from "./svg";
import { blogPhoto } from "./photos";

const prisma = new PrismaClient();
const PUB = join(process.cwd(), "public", "generated");

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

function writeSvg(folder: string, name: string, svg: string): string {
  const dir = join(PUB, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.svg`), svg, "utf8");
  return `/generated/${folder}/${name}.svg`;
}

async function main() {
  for (const c of BLOG_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, description: c.description, color: c.color, order: c.order },
    });
  }

  // Posts need an author; reuse whichever staff account the seed created.
  const author =
    (await prisma.user.findFirst({ where: { role: "STAFF" }, select: { id: true } })) ??
    (await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } }));
  if (!author) throw new Error("No staff or admin user to attribute posts to — seed the database first.");

  const existing = new Set((await prisma.post.findMany({ select: { slug: true } })).map((p) => p.slug));
  let added = 0;

  for (const post of POSTS) {
    if (existing.has(post.slug)) continue;
    const cover =
      blogPhoto(post.slug) ??
      writeSvg(
        "blog",
        post.slug,
        blogCoverSvg({ seed: post.slug, discipline: post.discipline, kicker: post.category.replace("-", " ") }),
      );
    await prisma.post.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        bodyMdx: post.bodyMdx,
        template: post.template,
        coverImage: cover,
        ogImage: cover,
        readMinutes: post.readMinutes,
        featured: post.featured,
        status: "PUBLISHED",
        publishedAt: daysAgo(post.daysAgo),
        views: 200 + post.readMinutes * 37 + post.daysAgo * 3,
        seoTitle: post.title,
        seoDesc: post.excerpt,
        meta: (post.meta ?? {}) as never,
        author: { connect: { id: author.id } },
        category: { connect: { slug: post.category } },
        tags: {
          connectOrCreate: post.tags.map((t) => ({
            where: { slug: slugify(t) },
            create: { slug: slugify(t), name: t },
          })),
        },
      },
    });
    console.log(`added: ${post.slug}`);
    added++;
  }

  console.log(`\ndone — ${added} added, ${existing.size} already present, ${await prisma.post.count()} total`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
