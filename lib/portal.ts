import { prisma } from "@/lib/db";
import type { SessionUser } from "@/lib/auth/guards";

/**
 * Company-scoped data access for the client portal. Every query here is
 * constrained to the signed-in client's own company + account so a client can
 * never read another company's rows, even by guessing an id.
 */

function quoteScope(user: SessionUser) {
  const or: Record<string, unknown>[] = [{ email: user.email ?? "__none__" }, { userId: user.id }];
  if (user.companyId) or.push({ companyId: user.companyId });
  return { OR: or };
}

function projectScope(user: SessionUser) {
  // Client projects are always tied to a company.
  return { isPublic: false, companyId: user.companyId ?? "__none__" };
}

export async function getPortalOverview(user: SessionUser) {
  const [projects, quotes, files] = await Promise.all([
    prisma.project.findMany({
      where: { ...projectScope(user), status: { in: ["ACTIVE", "ON_HOLD"] } },
      orderBy: { updatedAt: "desc" },
      include: { assignedTo: { select: { name: true } } },
    }),
    prisma.quote.findMany({ where: quoteScope(user), orderBy: { createdAt: "desc" } }),
    prisma.projectFile.findMany({
      where: { visibleToClient: true, project: projectScope(user) },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: { select: { title: true, slug: true, id: true } } },
    }),
  ]);
  const openQuotes = quotes.filter((q) => ["NEW", "REVIEWING", "QUOTED"].includes(q.status));
  return { projects, quotes, openQuotes, files };
}

export async function getPortalProjects(user: SessionUser) {
  return prisma.project.findMany({
    where: projectScope(user),
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { assignedTo: { select: { name: true } }, industry: true, _count: { select: { files: true } } },
  });
}

export async function getPortalProject(user: SessionUser, id: string) {
  return prisma.project.findFirst({
    where: { id, ...projectScope(user) },
    include: {
      assignedTo: { select: { name: true, image: true } },
      industry: true,
      disciplines: true,
      services: { select: { name: true, slug: true } },
      updates: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } },
      files: { where: { visibleToClient: true }, orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true } } } },
    },
  });
}

export async function getPortalQuotes(user: SessionUser) {
  return prisma.quote.findMany({
    where: quoteScope(user),
    orderBy: { createdAt: "desc" },
    include: { industry: true, convertedProject: { select: { id: true, title: true } }, _count: { select: { files: true } } },
  });
}

export async function getPortalQuote(user: SessionUser, id: string) {
  return prisma.quote.findFirst({
    where: { id, ...quoteScope(user) },
    include: {
      industry: true,
      files: true,
      messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true } } } },
      convertedProject: { select: { id: true, title: true } },
    },
  });
}

export async function getPortalFiles(user: SessionUser) {
  return prisma.projectFile.findMany({
    where: { visibleToClient: true, project: projectScope(user) },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { title: true, id: true } } },
  });
}
