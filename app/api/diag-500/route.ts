import { cache } from "react";
import { prisma } from "@/lib/db";
import {
  getCategoryWithServices,
  getIndustryBySlug,
  getPostBySlug,
  getProjectBySlug,
  getServiceBySlug,
} from "@/lib/queries";

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

  return Response.json({
    node: process.version,
    env: {
      databaseUrlSet: Boolean(process.env.DATABASE_URL),
      databaseUrlHost: process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] ?? null,
    },
    results,
  });
}
