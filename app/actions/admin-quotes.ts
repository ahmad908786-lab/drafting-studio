"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/guards";
import { slugify } from "@/lib/utils";

export async function updateQuoteStatus(quoteId: string, status: string) {
  const user = await requireStaff();
  await prisma.quote.update({ where: { id: quoteId }, data: { status } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "quote.status", entity: "Quote", entityId: quoteId, meta: { status } } });
  revalidatePath(`/admin/rfqs/${quoteId}`);
  revalidatePath("/admin/rfqs");
}

export async function setQuotedAmount(quoteId: string, amount: number | null) {
  await requireStaff();
  await prisma.quote.update({ where: { id: quoteId }, data: { quotedAmount: amount ?? null, status: amount ? "QUOTED" : undefined } });
  revalidatePath(`/admin/rfqs/${quoteId}`);
}

export async function assignQuote(quoteId: string, userId: string | null) {
  await requireStaff();
  await prisma.quote.update({ where: { id: quoteId }, data: { assignedToId: userId } });
  revalidatePath(`/admin/rfqs/${quoteId}`);
}

export async function addQuoteNote(quoteId: string, body: string) {
  const user = await requireStaff();
  if (!body.trim()) return;
  await prisma.quoteNote.create({ data: { quoteId, body: body.trim(), authorId: user.id } });
  revalidatePath(`/admin/rfqs/${quoteId}`);
}

export async function addQuoteMessage(quoteId: string, body: string, fromClient = false) {
  const user = await requireStaff();
  if (!body.trim()) return;
  await prisma.quoteMessage.create({ data: { quoteId, body: body.trim(), authorId: user.id, fromClient } });
  revalidatePath(`/admin/rfqs/${quoteId}`);
}

/** Convert an RFQ into an active client project, linking the two records. */
export async function convertQuoteToProject(quoteId: string): Promise<{ ok: boolean; projectId?: string; message?: string }> {
  const user = await requireStaff();
  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote) return { ok: false, message: "Quote not found" };
  if (quote.convertedProjectId) return { ok: true, projectId: quote.convertedProjectId };

  const services = (quote.serviceIds as { slug: string; name: string }[]) ?? [];
  const serviceRecords = await prisma.service.findMany({
    where: { slug: { in: services.map((s) => s.slug) } },
    include: { disciplines: true },
  });
  const disciplineIds = Array.from(new Set(serviceRecords.flatMap((s) => s.disciplines.map((d) => d.id))));

  const baseSlug = slugify(`${quote.companyName ?? quote.name}-${quote.refNumber}`);

  const project = await prisma.project.create({
    data: {
      slug: baseSlug,
      title: quote.projectType || `${quote.companyName ?? quote.name} — Project`,
      summary: quote.description?.slice(0, 200) || `Converted from RFQ ${quote.refNumber}.`,
      bodyMdx: quote.description ?? "",
      isPublic: false,
      status: "ACTIVE",
      stage: "KICKOFF",
      progress: 10,
      state: quote.state,
      sizeSqft: quote.sizeSqft,
      floors: quote.floors,
      dueDate: quote.deadline,
      companyId: quote.companyId,
      industryId: quote.industryId,
      assignedToId: quote.assignedToId ?? user.id,
      disciplines: disciplineIds.length ? { connect: disciplineIds.map((id) => ({ id })) } : undefined,
      services: serviceRecords.length ? { connect: serviceRecords.map((s) => ({ id: s.id })) } : undefined,
      updates: { create: { stage: "KICKOFF", note: `Project created from RFQ ${quote.refNumber}.`, authorId: user.id } },
    },
  });

  await prisma.quote.update({ where: { id: quoteId }, data: { status: "WON", convertedProjectId: project.id } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "quote.convert", entity: "Project", entityId: project.id } });

  revalidatePath(`/admin/rfqs/${quoteId}`);
  revalidatePath("/admin/projects");
  return { ok: true, projectId: project.id };
}
