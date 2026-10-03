import { prisma } from "../lib/db";
import fs from "fs";

const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, include: { category: true, tags: true, author: true }, orderBy: { publishedAt: "desc" } });
console.log("TOTAL POSTS:", posts.length);

const issues: string[] = [];
const slugSet = new Map<string, number>();
const titleSet = new Map<string, number>();
for (const p of posts) {
  slugSet.set(p.slug, (slugSet.get(p.slug) ?? 0) + 1);
  titleSet.set(p.title.toLowerCase(), (titleSet.get(p.title.toLowerCase()) ?? 0) + 1);
}
for (const [s, c] of slugSet) if (c > 1) issues.push(`DUPLICATE SLUG: ${s} x${c}`);
for (const [t, c] of titleSet) if (c > 1) issues.push(`DUPLICATE TITLE: ${t.slice(0, 60)} x${c}`);

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

// valid internal link targets check
const internalLinks = new Set<string>();
for (const p of posts) {
  const body = p.bodyMdx ?? "";
  // cover image
  if (!p.coverImage) issues.push(`NO COVER: ${p.slug}`);
  else {
    const f = "public/" + p.coverImage.replace(/^\//, "");
    if (!fs.existsSync(f)) issues.push(`COVER FILE MISSING: ${p.slug} -> ${p.coverImage}`);
  }
  // inline image
  const inlineRe = /!\[.*?\]\(.*?\)/g;
  const inline = body.match(inlineRe) ?? [];
  for (const m of inline) {
    const url = m.match(/\(([^)]+)\)/)?.[1];
    if (url && url.startsWith("/") && !fs.existsSync("public/" + url.replace(/^\//, ""))) issues.push(`INLINE IMG MISSING: ${p.slug} -> ${url}`);
  }
  // internal links
  const linkRe = /\]\((\/[^)]+)\)/g;
  let lm;
  while ((lm = linkRe.exec(body))) internalLinks.add(lm[1].split("#")[0]);
  // meta
  if (!p.seoTitle) issues.push(`NO SEO TITLE: ${p.slug}`);
  if (!p.seoDesc) issues.push(`NO SEO DESC: ${p.slug}`);
  else if (p.seoDesc.length < 50) issues.push(`SHORT SEO DESC (${p.seoDesc.length}): ${p.slug}`);
  else if (p.seoDesc.length > 160) issues.push(`LONG SEO DESC (${p.seoDesc.length}): ${p.slug}`);
  if (p.seoTitle && p.seoTitle.length > 65) issues.push(`LONG SEO TITLE (${p.seoTitle.length}): ${p.slug}`);
  // content
  const wc = words(body.replace(/[#*`\[\]()!>-]/g, " "));
  if (wc < 600) issues.push(`THIN CONTENT (${wc} words): ${p.slug}`);
  if (!p.excerpt) issues.push(`NO EXCERPT: ${p.slug}`);
  if (!p.category) issues.push(`NO CATEGORY: ${p.slug}`);
  if (p.tags.length === 0) issues.push(`NO TAGS: ${p.slug}`);
  // headings
  if (!/^## /m.test(body)) issues.push(`NO H2 HEADINGS: ${p.slug}`);
  // readMinutes sanity
  const expected = Math.max(1, Math.round(wc / 200));
  if (Math.abs(expected - p.readMinutes) > 3) issues.push(`READ MINUTES OFF (set ${p.readMinutes}, ~${expected}): ${p.slug}`);
}

// check internal link targets exist as routes
import { execSync } from "child_process";
const missing: string[] = [];
for (const l of [...internalLinks].sort()) {
  if (l === "/request-quote") continue;
  const parts = l.split("/").filter(Boolean);
  // map to app dir
  let base = "app/(site)";
  let ok = false;
  for (let i = 0; i < parts.length; i++) {
    const p = base + "/" + parts.slice(0, i + 1).join("/");
    if (fs.existsSync(p) || fs.existsSync(p + ".tsx")) { ok = i === parts.length - 1; }
  }
  // simpler: check page.tsx existence
  const dir = "app/(site)/" + parts.map(s => s.startsWith("[") ? s : s).join("/");
  const pageFile = dir + "/page.tsx";
  const dynParent = "app/(site)/" + parts.slice(0, -1).join("/") + "/[slug]/page.tsx";
  if (!(fs.existsSync(pageFile) || fs.existsSync(dynParent))) missing.push(l);
}
console.log("\n--- INTERNAL LINK TARGETS MISSING ---");
console.log(missing.length ? missing.join("\n") : "none");

console.log("\n--- ISSUES (" + issues.length + ") ---");
console.log(issues.slice(0, 80).join("\n"));

// keyword extraction
const kw = posts.map(p => ({
  slug: p.slug,
  title: p.title,
  seoTitle: p.seoTitle,
  tags: p.tags.map(t => t.name),
  category: p.category?.name,
}));
fs.writeFileSync("prisma/post-keywords.json", JSON.stringify(kw, null, 1));
console.log("\nkeywords written for", kw.length, "posts");

// word count stats
const wcs = posts.map(p => words((p.bodyMdx ?? "").replace(/[#*`\[\]()!>-]/g, " ")));
console.log("avg words:", Math.round(wcs.reduce((a, b) => a + b, 0) / wcs.length), "| min:", Math.min(...wcs), "| max:", Math.max(...wcs));
await prisma.$disconnect();
