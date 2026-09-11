import { prisma } from "@/lib/db";

export async function getAdminOverview() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyAgo = new Date(now.getTime() - 30 * 86_400_000);

  const [
    newRfqs,
    totalRfqs,
    activeProjects,
    leadsMtd,
    publishedPosts,
    wonQuotes,
    recentQuotes,
    recentLeads,
    statusCounts,
    quotesForChart,
  ] = await Promise.all([
    prisma.quote.count({ where: { status: "NEW" } }),
    prisma.quote.count(),
    prisma.project.count({ where: { isPublic: false, status: "ACTIVE" } }),
    prisma.lead.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.quote.count({ where: { status: "WON" } }),
    prisma.quote.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { industry: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.quote.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.quote.findMany({ where: { createdAt: { gte: thirtyAgo } }, select: { createdAt: true } }),
  ]);

  // Build a 30-day RFQ submission series.
  const buckets = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const q of quotesForChart) {
    const key = q.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const chart = Array.from(buckets.entries()).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count,
  }));

  const funnel = ["NEW", "REVIEWING", "QUOTED", "WON", "LOST"].map((s) => ({
    status: s,
    count: statusCounts.find((c) => c.status === s)?._count._all ?? 0,
  }));

  return { newRfqs, totalRfqs, activeProjects, leadsMtd, publishedPosts, wonQuotes, recentQuotes, recentLeads, funnel, chart };
}
