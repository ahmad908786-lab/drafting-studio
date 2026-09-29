/**
 * One-off enrichment: insert one inline figure (with caption) into every blog
 * post body, placed just before the mid-article `##` heading — the way other
 * publications break up long-form content.
 *
 * - Reads captions from ~/workspace/blog-images/captions.json ({slug: caption}).
 * - Expects the inline image at public/generated/blog/inline/<slug>-1.webp.
 * - Rewrites prisma/content/posts.ts (source of truth) via exact string
 *   replacement, then updates DB rows — but ONLY rows whose bodyMdx still
 *   matches the pre-enrichment text (admin-edited posts are left alone and
 *   reported).
 * - Idempotent: posts already containing `/generated/blog/inline/` are skipped.
 *
 * Usage: npx tsx prisma/enrich-post-images.ts
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { POSTS } from "./content/posts";

const prisma = new PrismaClient();
const INLINE_MARKER = "/generated/blog/inline/";
const POSTS_PATH = join(process.cwd(), "prisma", "content", "posts.ts");
const CAPTIONS_PATH = join(homedir(), "workspace", "blog-images", "captions.json");

/** Insert the figure markdown just before the `##` heading nearest to 45% of the body. */
function insertFigure(body: string, slug: string, caption: string): string {
  const figure = `\n\n![${caption}](/generated/blog/inline/${slug}-1.webp)\n\n`;
  const lines = body.split("\n");
  const headings = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l.startsWith("## "));
  if (headings.length === 0) {
    // No headings: drop it at a paragraph break near the middle.
    const mid = Math.floor(body.length / 2);
    const at = body.indexOf("\n\n", mid);
    const pos = at === -1 ? mid : at;
    return body.slice(0, pos) + figure + body.slice(pos).replace(/^\n\n/, "");
  }
  const target = Math.floor(lines.length * 0.45);
  const after = headings.find(({ i }) => i >= target);
  const chosen = after ?? headings[headings.length - 1];
  const before = lines.slice(0, chosen.i).join("\n").replace(/\n+$/, "");
  const rest = lines.slice(chosen.i).join("\n").replace(/^\n+/, "");
  return `${before}\n${figure}\n${rest}`;
}

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

async function main() {
  const captions = JSON.parse(readFileSync(CAPTIONS_PATH, "utf8")) as Record<string, string>;
  let fileText = readFileSync(POSTS_PATH, "utf8");

  let fileUpdated = 0;
  let dbUpdated = 0;
  const skippedEdited: string[] = [];
  const missing: string[] = [];

  for (const post of POSTS) {
    const caption = captions[post.slug];
    if (!caption) {
      missing.push(post.slug);
      continue;
    }
    if (post.bodyMdx.includes(INLINE_MARKER)) continue; // already enriched

    const oldBody = post.bodyMdx;
    const newBody = insertFigure(oldBody, post.slug, caption);
    if (newBody === oldBody) continue;

    // 1. Rewrite source of truth.
    const occurrences = countOccurrences(fileText, oldBody);
    if (occurrences !== 1) {
      console.error(`REFUSING ${post.slug}: body found ${occurrences}x in posts.ts`);
      continue;
    }
    fileText = fileText.split(oldBody).join(newBody);
    fileUpdated++;

    // 2. Update DB only if the row still carries the pre-enrichment body
    // (i.e. nobody edited it in the admin afterwards).
    const row = await prisma.post.findUnique({ where: { slug: post.slug }, select: { bodyMdx: true } });
    if (!row) continue;
    if (row.bodyMdx.includes(INLINE_MARKER)) continue;
    if (row.bodyMdx === oldBody) {
      await prisma.post.update({ where: { slug: post.slug }, data: { bodyMdx: newBody } });
      dbUpdated++;
    } else {
      skippedEdited.push(post.slug);
    }
  }

  writeFileSync(POSTS_PATH, fileText, "utf8");
  console.log(`done — posts.ts: ${fileUpdated} bodies enriched, db: ${dbUpdated} rows updated`);
  if (skippedEdited.length) console.log(`skipped (edited in admin, update manually): ${skippedEdited.join(", ")}`);
  if (missing.length) console.log(`missing captions: ${missing.join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
