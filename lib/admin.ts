import { prisma } from "@/lib/db";

export async function getAdminOverview() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thirtyAgo = new Date(now.getTime() - 30 * 86_400_000);
  const sevenAgo = new Date(now.getTime() - 7 * 86_400_000);

  const [
    newRfqs,
    totalRfqs,
    activeProjects,
    onHoldProjects,
    leadsMtd,
    leadsPrevMtd,
    rfqsMtd,
    rfqsPrevMtd,
    publishedPosts,
    quotes,
    recentQuotes,
    recentLeads,
    statusCounts,
    quotesForChart,
    stalledProjects,
    recentUpdates,
    recentNotes,
    recentClientMessages,
  ] = await Promise.all([
    prisma.quote.count({ where: { status: "NEW" } }),
    prisma.quote.count(),
    prisma.project.count({ where: { isPublic: false, status: "ACTIVE" } }),
    prisma.project.count({ where: { isPublic: false, status: "ON_HOLD" } }),
    prisma.lead.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { createdAt: { gte: prevMonthStart, lt: monthStart } } }),
    prisma.quote.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.quote.count({ where: { createdAt: { gte: prevMonthStart, lt: monthStart } } }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.quote.findMany({
      where: { status: { in: ["NEW", "REVIEWING", "QUOTED"] }, quotedAmount: { not: null } },
      select: { quotedAmount: true, status: true },
    }),
    prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { industry: true },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.quote.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.quote.findMany({ where: { createdAt: { gte: thirtyAgo } }, select: { createdAt: true } }),
    prisma.project.findMany({
      where: { isPublic: false, status: "ACTIVE", updatedAt: { lt: sevenAgo } },
      orderBy: { updatedAt: "asc" },
      take: 5,
      select: { id: true, title: true, stage: true, updatedAt: true, company: { select: { name: true } } },
    }),
    prisma.projectUpdate.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { project: { select: { id: true, title: true } }, author: { select: { name: true } } },
    }),
    prisma.quoteNote.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { quote: { select: { id: true, refNumber: true } }, author: { select: { name: true } } },
    }),
    prisma.projectMessage.findMany({
      where: { authorId: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: { select: { id: true, title: true } } },
    }),
  ]);

  // 30-day RFQ submission series.
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
    date: new Date(date).toISOString().slice(5, 10),
    count,
  }));

  const funnel = ["NEW", "REVIEWING", "QUOTED", "WON", "LOST"].map((s) => ({
    status: s,
    count: statusCounts.find((c) => c.status === s)?._count._all ?? 0,
  }));

  const pipelineValue = quotes.reduce((sum, q) => sum + (q.quotedAmount ?? 0), 0);

  // Kanban: quotes in play, newest first.
  const kanbanQuotes = await prisma.quote.findMany({
    where: { status: { in: ["NEW", "REVIEWING", "QUOTED"] } },
    orderBy: { createdAt: "desc" },
    take: 24,
    select: {
      id: true, refNumber: true, name: true, companyName: true,
      status: true, quotedAmount: true, createdAt: true,
    },
  });

  // Unified activity feed.
  const activity = [
    ...recentUpdates.map((u) => ({
      id: `u-${u.id}`, kind: "update" as const, at: u.createdAt,
      title: `${u.author?.name ?? "Studio"} posted an update on ${u.project.title}`,
      body: u.note, href: `/admin/projects/${u.project.id}`,
    })),
    ...recentNotes.map((n) => ({
      id: `n-${n.id}`, kind: "note" as const, at: n.createdAt,
      title: `${n.author?.name ?? "Studio"} noted on ${n.quote.refNumber}`,
      body: n.body, href: `/admin/rfqs/${n.quote.id}`,
    })),
    ...recentQuotes.slice(0, 4).map((q) => ({
      id: `q-${q.id}`, kind: "rfq" as const, at: q.createdAt,
      title: `New RFQ from ${q.name}${q.companyName ? ` · ${q.companyName}` : ""}`,
      body: q.refNumber, href: `/admin/rfqs/${q.id}`,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 9);

  return {
    newRfqs, totalRfqs, activeProjects, onHoldProjects,
    leadsMtd, leadsDelta: leadsMtd - leadsPrevMtd,
    rfqsMtd, rfqsDelta: rfqsMtd - rfqsPrevMtd,
    publishedPosts, wonQuotes: funnel.find((f) => f.status === "WON")?.count ?? 0,
    pipelineValue,
    recentQuotes, recentLeads, funnel, chart,
    kanbanQuotes, stalledProjects, recentClientMessages, activity,
  };
}
