"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/guards";

/** Verify the current client owns the quote before mutating it. */
async function assertOwnsQuote(quoteId: string) {
  const user = await requireUser();
  const quote = await prisma.quote.findFirst({
    where: {
      id: quoteId,
      OR: [{ email: user.email ?? "__none__" }, { userId: user.id }, ...(user.companyId ? [{ companyId: user.companyId }] : [])],
    },
    select: { id: true },
  });
  if (!quote) throw new Error("Not found");
  return user;
}

async function assertOwnsProject(projectId: string) {
  const user = await requireUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, isPublic: false, companyId: user.companyId ?? "__none__" },
    select: { id: true },
  });
  if (!project) throw new Error("Not found");
  return user;
}

export async function sendQuoteMessage(quoteId: string, body: string) {
  const user = await assertOwnsQuote(quoteId);
  if (!body.trim()) return;
  await prisma.quoteMessage.create({ data: { quoteId, body: body.trim(), authorId: user.id, fromClient: true } });
  revalidatePath(`/portal/quotes/${quoteId}`);
}

export async function respondToQuote(quoteId: string, decision: "accept" | "decline") {
  const user = await assertOwnsQuote(quoteId);
  await prisma.$transaction([
    prisma.quote.update({ where: { id: quoteId }, data: { status: decision === "accept" ? "WON" : "LOST" } }),
    prisma.quoteMessage.create({
      data: { quoteId, body: decision === "accept" ? "Client accepted the quote. 🎉" : "Client declined the quote.", authorId: user.id, fromClient: true },
    }),
  ]);
  revalidatePath(`/portal/quotes/${quoteId}`);
  revalidatePath("/portal/quotes");
}

export async function sendProjectMessage(projectId: string, body: string) {
  const user = await assertOwnsProject(projectId);
  if (!body.trim()) return;
  await prisma.projectMessage.create({ data: { projectId, body: body.trim(), authorId: user.id } });
  revalidatePath(`/portal/projects/${projectId}`);
}

export async function uploadProjectMarkup(projectId: string, file: { name: string; url: string; size: number; type?: string }) {
  const user = await assertOwnsProject(projectId);
  await prisma.projectFile.create({
    data: { projectId, name: `[Client] ${file.name}`, url: file.url, sizeBytes: file.size, mimeType: file.type, revision: "MARKUP", visibleToClient: true, uploadedById: user.id },
  });
  revalidatePath(`/portal/projects/${projectId}`);
}
