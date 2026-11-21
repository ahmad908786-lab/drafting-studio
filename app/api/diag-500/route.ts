import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { prisma } from "@/lib/db";
import {
  getCategoryWithServices,
  getIndustryBySlug,
  getNavData,
  getPostBySlug,
  getProjectBySlug,
  getRelatedPosts,
  getRelatedProjects,
  getServiceBySlug,
} from "@/lib/queries";
import { extractToc } from "@/components/mdx/mdx";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { trimDescription } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TEMPORARY diagnostic (20 Nov 2026): the live site 500s on every
 * non-prerendered detail URL (unknown blog/service/industry/project slugs,
 * wrong-category service URLs) while the same code + seeded data works
 * locally. This endpoint runs the exact queries the failing pages run,
 * both as direct Prisma calls and via the lib/queries helpers, and returns
 * the real error message for each so the live failure can be identified.
 * REMOVE once the 500 cause is fixed.
 */

type Probe = { name: string; ok: boolean; result?: string | null; error?: string };

async function probe(name: string, fn: () => Promise<unknown>): Promise<Probe> {
  try {
    const value = await fn();
    if (value === null || value === undefined) return { name, ok: true, result: null };
    if (typeof value === "object" && value !== null && "slug" in value) {
      return { name, ok: true, result: `found:${String((value as { slug: unknown }).slug)}` };
    }
    return { name, ok: true, result: "ok" };
  } catch (e) {
    return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// Same as probe() but keeps a string value verbatim (field dumps need it).
async function probeStr(name: string, fn: () => Promise<string | null>): Promise<Probe> {
  try {
    const value = await fn();
    return { name, ok: true, result: value };
  } catch (e) {
    return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET() {
  // A cached query defined HERE (same shape as the old helpers) so the live
  // run can compare React cache() vs direct calls in the same process.
  const cachedPostBySlug = cache(async (slug: string) =>
    prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { category: true, author: true, tags: true },
    }),
  );

  const results: Probe[] = [];
  results.push(await probe("raw:SELECT 1", () => prisma.$queryRaw`SELECT 1`));
  results.push(
    await probe("direct:post.findFirst unknown", () =>
      prisma.post.findFirst({
        where: { slug: "this-slug-does-not-exist-12345", status: "PUBLISHED" },
        include: { category: true, author: true, tags: true },
      }),
    ),
  );
  results.push(
    await probe("direct:post.findFirst known", () =>
      prisma.post.findFirst({
        where: { slug: "clearing-mep-plan-review-corrections", status: "PUBLISHED" },
        include: { category: true, author: true, tags: true },
      }),
    ),
  );
  results.push(await probe("helper:getPostBySlug unknown", () => getPostBySlug("this-slug-does-not-exist-12345")));
  results.push(await probe("helper:getPostBySlug known", () => getPostBySlug("clearing-mep-plan-review-corrections")));
  results.push(await probe("cached-local:post.findFirst unknown", () => cachedPostBySlug("this-slug-does-not-exist-12345")));
  results.push(
    await probe("direct:service.findUnique known", () =>
      prisma.service.findUnique({
        where: { slug: "fire-alarm-system-design" },
        include: { category: true, secondaryCategory: true, disciplines: true },
      }),
    ),
  );
  results.push(await probe("helper:getServiceBySlug known", () => getServiceBySlug("fire-alarm-system-design")));
  results.push(
    await probe("direct:industry.findUnique unknown", () =>
      prisma.industry.findUnique({ where: { slug: "does-not-exist" } }),
    ),
  );
  results.push(await probe("helper:getIndustryBySlug unknown", () => getIndustryBySlug("does-not-exist")));
  results.push(
    await probe("direct:project.findFirst unknown", () =>
      prisma.project.findFirst({
        where: { slug: "does-not-exist", isPublic: true },
        include: { industry: true, disciplines: true },
      }),
    ),
  );
  results.push(await probe("helper:getProjectBySlug unknown", () => getProjectBySlug("does-not-exist")));
  results.push(await probe("control:getCategoryWithServices unknown", () => getCategoryWithServices("does-not-exist")));

  // --- 21 Nov 2026: the 3 panel-created items ARE in the live DB and
  // Published, yet their public detail pages still 500. Probe the exact
  // record shape and every render step the detail pages run for these slugs,
  // so the live throw is identified instead of guessed.
  const NEW_POST_SLUGS = ["grounding-bonding-nec-250-drawings", "nfpa-13-vs-13r-vs-13d"];
  const NEW_PROJECT_SLUG = "double-story-double-dwelling-unit-mep";
  const mdxOptions = { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } };

  for (const slug of NEW_POST_SLUGS) {
    results.push(
      await probeStr(`panel:post fields ${slug}`, async () => {
        const p = await prisma.post.findFirst({
          where: { slug, status: "PUBLISHED" },
          include: { category: true, author: true, tags: true },
        });
        if (!p) return null;
        return JSON.stringify({
          template: p.template,
          coverImage: p.coverImage,
          bodyLen: p.bodyMdx?.length ?? null,
          metaNull: p.meta === null,
          publishedAt: p.publishedAt?.toISOString() ?? null,
          updatedAt: p.updatedAt?.toISOString() ?? null,
          categoryId: p.categoryId,
          authorId: p.authorId,
          readMinutes: p.readMinutes,
          views: p.views,
          status: p.status,
          excerptLen: p.excerpt?.length ?? null,
          seoDescLen: p.seoDesc?.length ?? null,
          tags: p.tags.length,
        });
      }),
    );
    results.push(await probe(`panel:helper getPostBySlug ${slug}`, () => getPostBySlug(slug)));
    results.push(
      await probeStr(`panel:extractToc ${slug}`, async () => {
        const p = await prisma.post.findFirst({ where: { slug }, select: { bodyMdx: true } });
        if (!p) return null;
        return `toc:${extractToc(p.bodyMdx).length}`;
      }),
    );
    results.push(
      await probeStr(`panel:relatedPosts ${slug}`, async () => {
        const p = await prisma.post.findFirst({ where: { slug }, select: { id: true, categoryId: true } });
        if (!p) return null;
        const rel = await getRelatedPosts(p.categoryId, p.id, 3);
        return `count:${rel.length}`;
      }),
    );
    results.push(
      await probe(`panel:compileMDX ${slug}`, async () => {
        const p = await prisma.post.findFirst({ where: { slug }, select: { bodyMdx: true } });
        if (!p) return null;
        await compileMDX({ source: p.bodyMdx, components: mdxComponents, options: mdxOptions });
        return "compiled ok";
      }),
    );
    results.push(
      await probeStr(`panel:trimDescription ${slug}`, async () => {
        const p = await prisma.post.findFirst({ where: { slug }, select: { seoDesc: true, excerpt: true } });
        if (!p) return null;
        return trimDescription(p.seoDesc ?? p.excerpt) ?? null;
      }),
    );
  }

  results.push(
    await probeStr(`panel:project fields ${NEW_PROJECT_SLUG}`, async () => {
      const pr = await prisma.project.findFirst({
        where: { slug: NEW_PROJECT_SLUG, isPublic: true },
        include: {
          industry: true,
          disciplines: true,
          services: { select: { slug: true, name: true, category: { select: { slug: true } } } },
          images: true,
        },
      });
      if (!pr) return null;
      return JSON.stringify({
        coverImage: pr.coverImage,
        bodyLen: pr.bodyMdx?.length ?? null,
        isPublic: pr.isPublic,
        featured: pr.featured,
        industryId: pr.industryId,
        disciplines: pr.disciplines.length,
        services: pr.services.map((s) => `${s.slug}:${s.category?.slug ?? "NULL-CAT"}`),
        images: pr.images.length,
        city: pr.city,
        state: pr.state,
        sizeSqft: pr.sizeSqft,
        floors: pr.floors,
        year: pr.year,
        summaryLen: pr.summary?.length ?? null,
      });
    }),
  );
  results.push(await probe(`panel:helper getProjectBySlug ${NEW_PROJECT_SLUG}`, () => getProjectBySlug(NEW_PROJECT_SLUG)));
  results.push(
    await probeStr(`panel:relatedProjects ${NEW_PROJECT_SLUG}`, async () => {
      const pr = await prisma.project.findFirst({
        where: { slug: NEW_PROJECT_SLUG },
        select: { slug: true, disciplines: { select: { slug: true } } },
      });
      if (!pr) return null;
      const rel = await getRelatedProjects(
        pr.disciplines.map((d) => d.slug),
        pr.slug,
        3,
      );
      return `count:${rel.length}`;
    }),
  );
  results.push(
    await probe(`panel:compileMDX project ${NEW_PROJECT_SLUG}`, async () => {
      const pr = await prisma.project.findFirst({ where: { slug: NEW_PROJECT_SLUG }, select: { bodyMdx: true } });
      if (!pr) return null;
      await compileMDX({ source: pr.bodyMdx, components: mdxComponents, options: mdxOptions });
      return "compiled ok";
    }),
  );
  results.push(await probe("panel:getNavData", () => getNavData()));

  return Response.json({
    node: process.version,
    env: {
      databaseUrlSet: Boolean(process.env.DATABASE_URL),
      databaseUrlHost: process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] ?? null,
    },
    results,
  });
}
